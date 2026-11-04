import { Link } from 'react-router-dom';
import {
  ChefHat,
  Calculator,
  ArrowRight,
  Check,
  Sparkles,
  Wine,
  Coffee,
  Beer,
  GlassWater,
  Cookie,
  Croissant,
  Store,
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  Lightbulb,
  Receipt,
  Bell,
  ListChecks,
  Award,
  Users,
  Martini,
  Soup,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Landing niche SEO — Logiciel marge cafe / bar / brasserie de quartier
   Mots-cles cibles : marge cafe, marge bar, coefficient boissons,
   logiciel cafe bar, rentabilite bar de quartier
   ~2 700 mots, ton expert bar / coffee shop
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quelle marge brute viser sur les boissons en bar / café ?',
    answer:
      "La marge brute cible sur les boissons dans un café ou un bar de quartier se situe entre 80 et 85 %. C'est le meilleur ratio matières de toute la restauration (vs 28-32 % en bistrot, 35-40 % en gastro). Le café expresso atteint 88-90 % de marge brute (0,30 EUR coût, 2 EUR vente). Une bière pression bien gérée affiche 78-82 % de marge. Les cocktails signature peuvent monter à 85 %. Le secret : minimiser les pertes (tirage, casse, périmés) et appliquer rigoureusement les coefficients.",
  },
  {
    question: 'Quel coefficient multiplicateur appliquer au café et à la bière ?',
    answer:
      "Café expresso : coefficient x6 à x8 (coût 0,25-0,35 EUR, vente 1,80-2,80 EUR selon zone). Bière pression : coefficient x4 à x5 (coût 0,75-1 EUR le demi 25cl, vente 4-6 EUR). Cocktails classiques : coefficient x4 à x5 (coût 2,50-3,50 EUR, vente 10-15 EUR). Vins au verre : coefficient x4 à x6 selon gamme. Spiritueux dose 4cl : coefficient x5 à x8. Ces coefficients intègrent la TVA 10/20 % et garantissent 80-85 % de marge brute après pertes.",
  },
  {
    question: 'Comment gérer la perte au tirage sur la bière pression ?',
    answer:
      "La perte au tirage représente 5 à 10 % du volume d'un fût selon la qualité du matériel et la formation du personnel. Sur un fût 30L vendu 240 EUR en demis, c'est 12 à 24 EUR de marge envolée par fût. Les leviers : pression CO2 calibrée (1,1-1,4 bar), serpentin refroidi à -2/0 C, becs de tirage propres (nettoyage hebdomadaire), formation précise au coup de main (ouverture franche, verre incliné 45 degrés). RestauMargin permet de suivre le ratio volume vendu / volume acheté par fût et détecte les dérives.",
  },
  {
    question: 'Faut-il proposer une petite restauration dans un bar de quartier ?',
    answer:
      "Oui, c'est devenu un standard en 2026. Une offre snacking simple (croque, croissant, sandwich, salade, planche) booste le ticket moyen de 35 à 50 % sur le créneau midi et après-midi. Food cost cible 30-35 % (légèrement plus haut qu'un bistrot car volume moindre). 5 références suffisent : 2 plats chauds + 2 plats froids + 1 planche partage. La planche apéro (charcuterie + fromage + olives) a un food cost 25-28 % et un prix de vente 14-22 EUR : c'est le produit roi.",
  },
  {
    question: 'Comment gérer les stocks d\'alcool dans un bar ?',
    answer:
      "Méthode LIFO (Last In First Out) sur les vins fins et spiritueux haut de gamme : le dernier acheté sort en premier, ce qui protège la marge en période d'inflation. Méthode FIFO (First In First Out) sur le frais (lait, jus, fruits cocktails) et la bière en bouteille (DLUO). Inventaire physique hebdomadaire sur les spiritueux ouverts (jaugeage millimétré), mensuel sur les bouteilles fermées. Le ratio idéal de rotation : 12-18 rotations/an sur le bar, 6-10 sur la cave.",
  },
  {
    question: 'Quel ticket moyen viser pour un café / bar rentable ?',
    answer:
      "Ticket moyen café matin : 3-5 EUR (café + viennoiserie). Ticket midi avec petite restauration : 12-18 EUR (boisson + plat + café). Ticket apéro (18h-20h) : 8-14 EUR par personne (1 à 2 boissons + planche). Ticket soirée : 15-25 EUR par personne (2-3 boissons + snacking). La rotation typique : 3 à 5 services / jour (matin, midi, goûter, apéro, soir). Un bar de 50 places vise 150-250 couverts par jour, soit un CA de 1500-3500 EUR/jour.",
  },
  {
    question: 'Comment optimiser un Happy Hour sans casser la marge ?',
    answer:
      "Le Happy Hour (17h-19h en général) doit attirer sans sacrifier la rentabilité. Règle d'or : réduire le prix de 20-30 % sur 2-3 références précises, pas sur toute la carte. Exemple : bière pression 25cl à 3 EUR (vs 4 EUR), spritz à 6 EUR (vs 9 EUR), verre de vin à 4,50 EUR (vs 6 EUR). La marge brute reste à 75-80 %. Le calcul : le volume double ou triple sur le créneau, compensant la baisse de marge unitaire. Éviter les Happy Hour cocktails complexes (perte de marge trop forte).",
  },
  {
    question: 'Quelle est la marge sur un cocktail signature ?',
    answer:
      "Cocktail signature type Negroni, Old Fashioned, Spritz, Mojito : coût matières 2,80-3,80 EUR, prix de vente 11-15 EUR, marge brute 75-80 %. Les cocktails premium (Penicillin, Last Word, Boulevardier) : coût 3,50-5 EUR, vente 14-18 EUR, marge 70-75 %. Astuce : créer 4-6 cocktails maison non-comparables (éviter Mojito générique), avec des ingrédients exclusifs (sirops maison, infusions), justifiant un prix 30 % supérieur. RestauMargin permet de calculer la marge de chaque cocktail au centilitre près.",
  },
  {
    question: 'Combien d\'établissements café / bar en France en 2026 ?',
    answer:
      "On compte environ 40 000 cafés, bars et brasseries de quartier en France en 2026, contre 200 000 dans les années 1960. Le secteur est en mutation : les bars purs reculent (-5%/an) au profit des hybrides café/bar/restaurant. Les coffee shops indépendants explosent (+12%/an depuis 2020). Le ticket moyen monte (+8% en 5 ans) compensé par une fréquentation en baisse (-3% sur 10 ans). La rentabilité reste solide pour les établissements bien gérés : 12-18 % de marge nette.",
  },
  {
    question: 'RestauMargin est-il adapté à un bar de quartier indépendant ?',
    answer:
      "Oui parfaitement. RestauMargin est utilisé par bars, cafés et coffee shops en France. Le plan Pro à 29 EUR/mois inclut : fiches techniques cocktails illimitées, scan factures fournisseurs (Pernod Ricard, Diageo, brasseurs locaux), suivi des pertes bière/spiritueux, gestion carte des vins au verre, alertes prix matières, KPI ticket moyen et rotations. Essai gratuit 7 jours sans carte bancaire. Modèles cocktails et planches inclus.",
  },
];

// Tableau de 15 boissons / produits cafe-bar type
const boissonsTypes = [
  { item: 'Café expresso', cout: '0,30 EUR', prix: '2,00 EUR', coef: 'x6,7', marge: '85 %' },
  { item: 'Café allongé / americano', cout: '0,32 EUR', prix: '2,40 EUR', coef: 'x7,5', marge: '87 %' },
  { item: 'Cappuccino / latte', cout: '0,55 EUR', prix: '3,80 EUR', coef: 'x6,9', marge: '86 %' },
  { item: 'Thé infusion', cout: '0,40 EUR', prix: '3,50 EUR', coef: 'x8,8', marge: '89 %' },
  { item: 'Jus orange pressé', cout: '1,20 EUR', prix: '5,50 EUR', coef: 'x4,6', marge: '78 %' },
  { item: 'Bière pression 25cl', cout: '0,80 EUR', prix: '4,00 EUR', coef: 'x5,0', marge: '80 %' },
  { item: 'Bière bouteille 33cl', cout: '1,40 EUR', prix: '5,50 EUR', coef: 'x3,9', marge: '75 %' },
  { item: 'Vin au verre 15cl', cout: '1,50 EUR', prix: '6,50 EUR', coef: 'x4,3', marge: '77 %' },
  { item: 'Cocktail signature', cout: '3,00 EUR', prix: '13,00 EUR', coef: 'x4,3', marge: '77 %' },
  { item: 'Spritz Aperol', cout: '2,20 EUR', prix: '9,00 EUR', coef: 'x4,1', marge: '76 %' },
  { item: 'Whisky 4cl', cout: '1,80 EUR', prix: '9,00 EUR', coef: 'x5,0', marge: '80 %' },
  { item: 'Gin tonic premium', cout: '2,40 EUR', prix: '12,00 EUR', coef: 'x5,0', marge: '80 %' },
  { item: 'Soft / soda 33cl', cout: '0,55 EUR', prix: '3,80 EUR', coef: 'x6,9', marge: '86 %' },
  { item: 'Eau plate 50cl', cout: '0,35 EUR', prix: '3,50 EUR', coef: 'x10,0', marge: '90 %' },
  { item: 'Planche charcuterie / fromage', cout: '4,80 EUR', prix: '17,00 EUR', coef: 'x3,5', marge: '72 %' },
];

export default function LogicielMargeCafeBar() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel marge café bar | Coefficient boissons | RestauMargin"
        description="Logiciel pour calculer marge café, bar, brasserie de quartier. Marge boissons 80-85 %, gestion stocks alcool. Essai gratuit 7 jours."
        path="/logiciel-marge-cafe-bar"
        type="website"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciel marge café bar', url: 'https://www.restaumargin.fr/logiciel-marge-cafe-bar' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour café et bar en 2026',
            description:
              "Guide complet sur la gestion des marges en café, bar et brasserie de quartier : marge boissons 80-85 %, coefficients multiplicateurs café/bière/cocktails/vins/spiritueux, gestion stocks alcool LIFO/FIFO, perte au tirage, Happy Hour, snacking, KPI ticket moyen et rotations.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 2700,
            inLanguage: 'fr-FR',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.restaumargin.fr/logiciel-marge-cafe-bar',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin pour café, bar et brasserie de quartier',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Bar Management Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-cafe-bar',
            description:
              "Logiciel de gestion des marges adapté aux cafés, bars et brasseries de quartier : fiches techniques cocktails, coefficients multiplicateurs boissons, gestion stocks alcool LIFO/FIFO, suivi pertes bière pression, scan factures Pernod/Diageo/brasseurs, alertes prix matières, KPI ticket moyen et rotations.",
            featureList: [
              'Fiches techniques cocktails au centilitre près',
              'Coefficients automatiques café/bière/spiritueux/vin',
              'Gestion stocks alcool (LIFO vins fins, FIFO frais)',
              'Suivi perte au tirage bière pression',
              'Scan factures Pernod Ricard, Diageo, brasseurs',
              'Calcul marge Happy Hour vs marge standard',
              'KPI rotations spiritueux et vins',
              'Reporting ticket moyen par créneau (matin/midi/apéro/soir)',
            ],
            offers: [
              {
                '@type': 'Offer',
                name: 'Pro',
                price: '29',
                priceCurrency: 'EUR',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: '29',
                  priceCurrency: 'EUR',
                  unitText: 'MONTH',
                },
              },
            ],
          },
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/pricing" className="hidden sm:inline-flex text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">
              Tarifs
            </Link>
            <Link to="/demo" className="hidden sm:inline-flex text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">
              Demo
            </Link>
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              Essai gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumbs ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-6xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge café / bar / brasserie de quartier</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className="bg-gradient-to-b from-amber-50 via-white to-white pt-16 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-amber-800 bg-amber-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Spécialiste café, bar et brasserie de quartier
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-mono-100 leading-tight mb-6 max-w-4xl mx-auto">
            Logiciel de marge pour café et bar en 2026
          </h1>
          <p className="text-lg sm:text-xl text-mono-400 max-w-3xl mx-auto leading-relaxed mb-8">
            La solution SaaS dédiée aux <strong>cafés, bars et brasseries de quartier</strong>.
            Marge brute boissons cible 80-85 %, coefficients multiplicateurs, gestion stocks alcool LIFO/FIFO, suivi pertes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-colors text-lg shadow-lg shadow-teal-600/30"
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-mono-100 text-mono-100 font-semibold rounded-full hover:bg-mono-100 hover:text-white transition-colors"
            >
              Voir la demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-mono-500">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Sans carte bancaire</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Sans engagement</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> 200+ bars clients</span>
          </div>
        </div>
      </header>

      {/* ── Section 1 : Marche cafe/bar France 2026 ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-6">
            Le marché du café et bar en France : 40 000 établissements en mutation
          </h2>
          <p className="text-lg text-mono-400 leading-relaxed mb-4">
            La France compte environ <strong>40 000 cafés, bars et brasseries de quartier</strong> en 2026,
            contre 200 000 dans les années 1960. Le secteur a connu une érosion historique, mais traverse
            depuis 2020 une vraie mutation : les bars purs reculent au profit d'établissements hybrides
            (café le matin, restaurant le midi, bar le soir). Les coffee shops indépendants explosent
            (+12 %/an) et les bars à cocktails de quartier connaissent un regain.
          </p>
          <p className="text-lg text-mono-400 leading-relaxed mb-4">
            La rentabilité d'un café/bar repose sur un atout structurel unique : la <strong>marge brute
            sur les boissons est la meilleure de toute la restauration (80-85 %)</strong>. Un café expresso
            vendu 2 EUR ne coûte que 0,30 EUR en matières : c'est un coefficient x6,7. Une bière pression
            tirée à 0,80 EUR se vend 4 EUR : coefficient x5. Aucun autre secteur de la restauration n'offre
            cette structure de coût matières aussi favorable.
          </p>
          <p className="text-lg text-mono-400 leading-relaxed">
            <strong>RestauMargin</strong> est utilisé par cafés, bars et coffee shops en France pour
            piloter précisément coefficients, pertes au tirage, stocks alcool et carte cocktails.
            Découvrez comment maximiser une marge brute déjà excellente.
          </p>

          <Callout type="info">
            <strong>Chiffre clé :</strong> Un bar de quartier urbain bien géré réalise entre 380 000 et 850 000 EUR
            de CA annuel avec une marge nette de 12 à 18 %. Soit 45 000 à 150 000 EUR de résultat net par établissement.
            La marge nette est supérieure à celle d'un bistrot (10-15 %) grâce au coût matières très bas.
          </Callout>
        </div>
      </section>

      {/* ── Section 2 : Specificites cafe/bar ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Spécificités du modèle café / bar : marge brute boissons 80-85 % (TOP du secteur)
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              4 caractéristiques uniques qui font du bar le format le plus rentable en coût matières.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Coffee className="w-6 h-6" />,
                title: 'Coût matières très bas',
                desc:
                  "Sur les boissons chaudes et softs, le coût matières est inférieur à 15 % du prix de vente. Le café (coefficient x6-8), le thé (x8-9), les eaux (x10) sont les produits les plus rentables.",
              },
              {
                icon: <Beer className="w-6 h-6" />,
                title: 'Volume et rotation élevés',
                desc:
                  "Un bar tourne 3 à 5 services/jour (matin, midi, goûter, apéro, soir). Avec 200 couverts/jour à 8 EUR ticket moyen, on atteint facilement 1 600 EUR de CA quotidien sur un seul comptoir.",
              },
              {
                icon: <Martini className="w-6 h-6" />,
                title: 'Stocks alcool : capital fort',
                desc:
                  "20 000 à 60 000 EUR de stocks alcool selon la taille du bar. Nécessite une gestion LIFO/FIFO rigoureuse, des inventaires hebdomadaires sur les spiritueux ouverts, un jaugeage précis.",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Snacking en complément',
                desc:
                  "L'offre petit en-cas (croque, planche, salade) booste le ticket moyen de 35-50 %. Food cost cible 30-35 % sur ces produits, qui restent moins margés que les boissons mais ouvrent le midi et le goûter.",
              },
            ].map((spec, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mb-4">
                  {spec.icon}
                </div>
                <h3 className="font-bold text-mono-100 mb-2">{spec.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3 : Coefficients multiplicateurs ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
            Coefficients multiplicateurs par catégorie de boisson
          </h2>
          <p className="text-lg text-mono-400 mb-12">
            La règle d'or du bar : appliquer le bon coefficient sur chaque catégorie. Voici les ratios
            validés en 2026 sur le marché français, intégrant TVA 10/20 % et pertes moyennes.
          </p>

          <div className="space-y-6">
            <CoefBox
              icon={<Coffee className="w-5 h-5" />}
              title="Café expresso et dérivés"
              details={[
                'Coût matières : 0,25-0,35 EUR par tasse (grain + lait + sucre)',
                'Prix de vente : 1,80 EUR (province) à 2,80 EUR (Paris centre)',
                'Coefficient appliqué : x6 à x8 selon zone et qualité torréfacteur',
                'Marge brute : 85-90 % (TOP catégorie du bar)',
              ]}
              coef="x6 à x8"
              marge="85-90 %"
              color="amber"
            />

            <CoefBox
              icon={<Beer className="w-5 h-5" />}
              title="Bière pression"
              details={[
                "Coût fût 30L (240 demis 25cl théoriques) : 180-220 EUR HT",
                "Coût demi 25cl : 0,75-0,95 EUR (pertes 5-10 % intégrées)",
                "Prix de vente : 4-6 EUR le demi selon zone",
                "Coefficient : x4 à x5, marge 78-82 % après pertes",
              ]}
              coef="x4 à x5"
              marge="78-82 %"
              color="amber"
            />

            <CoefBox
              icon={<Martini className="w-5 h-5" />}
              title="Cocktails signature"
              details={[
                "Coût matières : 2,80-3,80 EUR (spiritueux 4cl + modificateurs + garniture)",
                "Prix de vente : 11-15 EUR (classiques) à 14-18 EUR (premium)",
                "Coefficient : x4 à x5 selon complexité",
                "Marge brute : 75-80 %, avec marge prestige supplémentaire sur cocktails maison",
              ]}
              coef="x4 à x5"
              marge="75-80 %"
              color="emerald"
            />

            <CoefBox
              icon={<Wine className="w-5 h-5" />}
              title="Vins au verre 15cl"
              details={[
                "Coût matières : 1,20-2 EUR par verre (bouteille 6-12 EUR / 5 verres)",
                "Prix de vente : 5-9 EUR selon gamme",
                "Coefficient : x4 à x6 selon prestige du domaine",
                "Marge brute : 75-80 %, levier de différenciation clé",
              ]}
              coef="x4 à x6"
              marge="75-80 %"
              color="amber"
            />

            <CoefBox
              icon={<GlassWater className="w-5 h-5" />}
              title="Spiritueux dose 4cl"
              details={[
                "Coût matières : 0,80-2 EUR selon gamme (bouteille 70cl / 17,5 doses 4cl)",
                "Prix de vente : 7-15 EUR selon spiritueux et qualité",
                "Coefficient : x5 à x8 (whisky premium, gin craft, rhum vieux)",
                "Marge brute : 80-87 %, gamme la plus rentable après le café",
              ]}
              coef="x5 à x8"
              marge="80-87 %"
              color="emerald"
            />
          </div>

          <Callout type="info">
            <strong>Astuce pricing :</strong> Le mix produit idéal d'un bar de quartier : 30 % boissons chaudes/softs
            (marge 85-90 %), 35 % bière (marge 78-82 %), 20 % vins/cocktails (marge 75-80 %), 10 % spiritueux
            (marge 80-87 %), 5 % snacking (marge 65-70 %). Marge brute pondree moyenne : 81-84 %.
            <Link to="/blog/coefficient-multiplicateur" className="block mt-2 text-teal-700 font-semibold underline">
              Voir le guide complet du coefficient multiplicateur
            </Link>
          </Callout>
        </div>
      </section>

      {/* ── Section 4 : Tableau 15 boissons ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Tableau de 15 boissons et produits café/bar : coûts et marges
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Référence complète avec coût matières, prix de vente, coefficient et marge brute (2026).
            </p>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-mono-900 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-4 px-4 font-semibold">Produit</th>
                  <th className="text-right py-4 px-4 font-semibold">Coût matières</th>
                  <th className="text-right py-4 px-4 font-semibold">Prix vente TTC</th>
                  <th className="text-right py-4 px-4 font-semibold">Coefficient</th>
                  <th className="text-right py-4 px-4 font-semibold">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {boissonsTypes.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.item}</td>
                    <td className="py-3 px-4 text-right">{row.cout}</td>
                    <td className="py-3 px-4 text-right">{row.prix}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                        {row.coef}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-700">{row.marge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-mono-500 mt-4 text-center">
            Prix calculés sur tarifs fournisseurs Pernod Ricard, Diageo, Brasseries Heineken/Carlsberg/Brasseurs locaux,
            torréfacteurs indépendants (mai 2026). Variations selon région et gamme.
          </p>
        </div>
      </section>

      {/* ── Section 5 : Gestion stocks alcool LIFO/FIFO ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
            Gestion des stocks alcool : LIFO sur les vins fins, FIFO sur le frais
          </h2>
          <p className="text-lg text-mono-400 leading-relaxed mb-8">
            Un bar de quartier stocke entre <strong>20 000 et 60 000 EUR de marchandises</strong> en permanence
            (vins, spiritueux, bière, softs). La méthode de valorisation et de rotation des stocks impacte
            directement la marge brute en période d'inflation.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <Wine className="w-5 h-5 text-purple-600" />
                LIFO : vins fins et spiritueux premium
              </h3>
              <ul className="space-y-2 text-sm text-mono-400">
                <li><strong>Last In First Out</strong> : la dernière bouteille achetée sort en premier</li>
                <li>Protège la marge en période d'inflation des prix vins</li>
                <li>Permet aux bouteilles anciennes de prendre de la valeur</li>
                <li>Adapté aux cuvées rares, millésimes, spiritueux vieux</li>
                <li>Comptabilisation valorisée au cours du dernier achat</li>
              </ul>
            </div>

            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <Beer className="w-5 h-5 text-amber-600" />
                FIFO : frais, bière, softs
              </h3>
              <ul className="space-y-2 text-sm text-mono-400">
                <li><strong>First In First Out</strong> : la première unité arrivée sort en premier</li>
                <li>Indispensable sur le frais (jus, lait, fruits cocktails)</li>
                <li>Bière bouteille (DLUO 6-9 mois)</li>
                <li>Softs et eaux (DLUO 12 mois)</li>
                <li>Réduit le risque de perte / DLC dépassée</li>
              </ul>
            </div>
          </div>

          <Callout type="warning">
            <strong>Piège courant :</strong> Sans gestion rigoureuse, un bar de quartier peut perdre 4 à 8 % de
            son stock alcool par an entre les pertes (casse, périmés), les vols internes (10-15 % des cas),
            le surdosage (verres trop pleins). Sur un stock de 40 000 EUR, c'est 1 600 à 3 200 EUR de marge
            envolée chaque année. RestauMargin trace chaque entrée/sortie et détecte les écarts d'inventaire.
          </Callout>
        </div>
      </section>

      {/* ── Section 6 : Service petit en-cas ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
              <Croissant className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100">
              Service "petit en-cas" : food cost cible 30-35 %
            </h2>
          </div>
          <p className="text-lg text-mono-400 leading-relaxed mb-6">
            L'offre snacking est devenue indispensable en 2026. Croissant le matin, croque-monsieur ou
            sandwich à midi, planche apéro le soir : la petite restauration <strong>booste le ticket moyen
            de 35 à 50 %</strong> et ouvre les créneaux 11h-14h et 17h-20h habituellement plus calmes.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <Cookie className="w-5 h-5 text-amber-600" />
                Petit déjeuner / matin
              </h3>
              <ul className="space-y-2 text-sm text-mono-400">
                <li>Croissant 0,40 EUR / 1,80 EUR (food cost 22 %)</li>
                <li>Pain au chocolat 0,55 EUR / 2,20 EUR (food cost 25 %)</li>
                <li>Tartine beurre confiture 0,90 EUR / 3,80 EUR (food cost 24 %)</li>
                <li>Formule café + viennoiserie 3,50 EUR (panier moyen +75 %)</li>
              </ul>
            </div>

            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <Soup className="w-5 h-5 text-emerald-600" />
                Midi / apéro
              </h3>
              <ul className="space-y-2 text-sm text-mono-400">
                <li>Croque-monsieur 2,20 EUR / 8,50 EUR (food cost 26 %)</li>
                <li>Sandwich jambon-beurre artisanal 2,80 EUR / 9 EUR (food cost 31 %)</li>
                <li>Salade composée 3,50 EUR / 11 EUR (food cost 32 %)</li>
                <li>Planche charcuterie/fromage 4,80 EUR / 17 EUR (food cost 28 %)</li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Produit roi : la planche apéro.</strong> Coût matières 4,80 EUR (charcuterie qualité +
            fromages variés + olives + pain), prix de vente 14-22 EUR selon composition. Marge brute 72-78 %.
            Boit avec : 2 verres de vin + 1 bière. Ticket apéro : 28-42 EUR / personne. C'est le produit
            le plus rentable du bar de quartier en 2026.
          </Callout>
        </div>
      </section>

      {/* ── Section 7 : Pertes specifiques bar ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Pertes spécifiques bar : tirage bière, casse verres
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              4 sources de pertes qui rongent silencieusement la marge brute d'un bar mal piloté.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Beer className="w-6 h-6" />,
                title: 'Perte au tirage bière',
                rate: '5-10 %',
                desc:
                  "Mousse excessive, premiers demis sales, fond de fût. Sur un fût 30L à 240 EUR de CA potentiel, c'est 12-24 EUR perdus par fût. Calibrage CO2 + serpentin -2 à 0 degrés + formation tirage = 3-5 % atteignable.",
              },
              {
                icon: <GlassWater className="w-6 h-6" />,
                title: 'Casse verres',
                rate: '8-15 % / an',
                desc:
                  "Sur un parc de 200 verres à 4 EUR, c'est 64 à 120 EUR de renouvellement annuel. Plus si verres de qualité (cristal). Pose plateau standardisé + formation rangement = -50 % de casse.",
              },
              {
                icon: <Wine className="w-6 h-6" />,
                title: 'Surdosage verres',
                rate: '5-12 % de marge',
                desc:
                  "Un verre de vin servi à 18cl au lieu de 15cl = 20 % de perte de marge sur la ligne. Idem cocktails : 4,5cl spiritueux au lieu de 4cl = 12 % de marge perdue. Doseurs + formation précise indispensables.",
              },
              {
                icon: <AlertTriangle className="w-6 h-6" />,
                title: 'Vols / consommations gratuites',
                rate: '2-6 % CA',
                desc:
                  "Verres offerts non déclarés, consommations personnel non comptabilisées, vols internes. Sur un CA de 500 000 EUR, c'est 10-30 000 EUR de marge perdue/an. Inventaire physique + TPE rigoureux = contrôle.",
              },
            ].map((perte, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-red-300 transition-colors">
                <div className="w-12 h-12 bg-red-50 text-red-700 rounded-xl flex items-center justify-center mb-3">
                  {perte.icon}
                </div>
                <div className="text-2xl font-extrabold text-red-700 mb-1">{perte.rate}</div>
                <h3 className="font-bold text-mono-100 mb-2">{perte.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{perte.desc}</p>
              </div>
            ))}
          </div>

          <Callout type="warning">
            <strong>Cumul des pertes cachées :</strong> Un bar de quartier non piloté perd en moyenne 8 à 14 %
            de marge brute sur l'ensemble de ces postes. Sur 500 000 EUR de CA, c'est 40 000 à 70 000 EUR de
            résultat net qui s'évapore chaque année. RestauMargin trace tout : ratio volume vendu/volume acheté
            par fût, inventaire spiritueux par jaugeage, alerte écart vs théorique.
          </Callout>
        </div>
      </section>

      {/* ── Section 8 : KPI cafe/bar ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              KPI café / bar : ticket moyen 6-12 EUR, rotations 3-5x / jour
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              6 indicateurs clés à piloter chaque semaine dans un bar de quartier.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                kpi: 'Marge brute boissons',
                cible: '80-85 %',
                desc: "Ratio (CA boissons - coût matières) / CA boissons. En dessous de 78 %, alerte sur les pertes ou le coefficient.",
                color: 'emerald',
              },
              {
                kpi: 'Ticket moyen global',
                cible: '6-12 EUR',
                desc: "Matin : 3-5 EUR. Midi snacking : 12-18 EUR. Apéro : 8-14 EUR. Soir : 15-25 EUR. Pondéré par créneau.",
                color: 'teal',
              },
              {
                kpi: 'Rotations / jour',
                cible: '3-5x',
                desc: "Nombre de services dans la journée (matin, midi, goûter, apéro, soir). Un bar a 5 rotations sur 50 places = 250 couverts/jour.",
                color: 'amber',
              },
              {
                kpi: 'Prime cost',
                cible: '< 60 %',
                desc: "Food cost + coût personnel. Atteignable 55-58 % grâce au coût matières très bas, malgré une masse salariale serveur 28-32 % du CA.",
                color: 'red',
              },
              {
                kpi: 'Rotation stock alcool',
                cible: '12-18x / an',
                desc: "CA alcool / valeur moyenne stock alcool. Trop bas = sur-stockage, trop haut = risque de rupture client.",
                color: 'purple',
              },
              {
                kpi: 'Marge nette',
                cible: '12-18 %',
                desc: "Après charges totales. Un bar bien géré dépasse souvent celle d'un bistrot grâce au coût matières très bas et au volume.",
                color: 'emerald',
              },
            ].map((k, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="text-xs font-semibold uppercase tracking-wider text-mono-500 mb-2">{k.kpi}</div>
                <div className={`text-3xl font-extrabold mb-3 ${
                  k.color === 'amber' ? 'text-amber-700' :
                  k.color === 'red' ? 'text-red-700' :
                  k.color === 'teal' ? 'text-teal-700' :
                  k.color === 'purple' ? 'text-purple-700' :
                  'text-emerald-700'
                }`}>
                  {k.cible}
                </div>
                <p className="text-sm text-mono-400 leading-relaxed">{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 9 : Optimisation Happy Hour / formules / evenementiel ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Leviers d'optimisation : Happy Hour, formules petit-déj, événementiel
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              4 leviers éprouvés pour augmenter le CA de 25-40 % sans dégrader la marge brute.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Happy Hour cible (2-3 produits)',
                desc:
                  "Réduction 20-30 % sur bière pression + spritz + vin verre uniquement, sur créneau 17h-19h. Le volume double ou triple, compensant la baisse de marge unitaire. Marge brute Happy Hour : 75-80 %, vs 80-85 % en standard. Éviter les Happy Hour cocktails (marge trop entamée).",
                impact: '+15-25 % CA apéro',
              },
              {
                icon: <Coffee className="w-6 h-6" />,
                title: 'Formules petit-déjeuner',
                desc:
                  "Café + viennoiserie à 3,50 EUR (vs 2 + 1,80 = 3,80 EUR). Café + tartine confiture à 4,80 EUR. Café + jus + viennoiserie à 6,80 EUR. Le panier moyen passe de 2,50 EUR (café seul) à 4-7 EUR. Marge brute formule : 80 %. Augmentation panier matin +60-100 %.",
                impact: 'Panier matin +60 à 100 %',
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'Événementiel hebdomadaire',
                desc:
                  "Soirée dégustation vin, blind test bière, atelier cocktails, concert acoustique, soirée jeux. Format réservation prépayée 25-45 EUR / personne (vin/bière inclus). CA événement : 600-1500 EUR. Marge brute 70-75 %. Fidélisation + bouche-à-oreille + Instagrammable.",
                impact: '600-1500 EUR / soirée',
              },
              {
                icon: <Wine className="w-6 h-6" />,
                title: 'Cocktails signature non-comparables',
                desc:
                  "Créer 4-6 cocktails maison avec ingrédients exclusifs (sirops maison, infusions, bitters artisanaux). Non-comparables avec carte standardisée : peuvent être vendus 14-18 EUR sans résistance prix. Marge brute 78-82 %. Différenciation + storytelling Instagram + ticket apéro +30 %.",
                impact: 'Ticket apéro +30 %',
              },
            ].map((levier, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    {levier.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-mono-100 mb-2 text-lg">{levier.title}</h3>
                    <p className="text-sm text-mono-400 leading-relaxed mb-3">{levier.desc}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                      <Award className="w-3.5 h-3.5" />
                      {levier.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Callout type="info">
            <strong>Stratégie ticket moyen :</strong> Augmenter le ticket moyen est plus rentable que d'attirer
            plus de clients. Sur 200 couverts/jour, passer le ticket de 8 à 10 EUR = +400 EUR/jour, +120 000 EUR/an
            de CA. Avec une marge brute 82 %, c'est +98 000 EUR de marge brute supplémentaire annuelle.
            <Link to="/blog/augmenter-ticket-moyen-restaurant" className="block mt-2 text-teal-700 font-semibold underline">
              Lire notre guide complet sur le ticket moyen
            </Link>
          </Callout>
        </div>
      </section>

      {/* ── Section 10 : Cas concret bar Marseille ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-3xl p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">Cas concret client</div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100">
                  Bar Marseille (Cours Julien) : de 8 % à 23 % de marge nette en 9 mois
                </h2>
              </div>
            </div>

            <p className="text-lg text-mono-400 leading-relaxed mb-6">
              Le <em>Comptoir du Cours</em>, bar de quartier de 65 places sur le Cours Julien à Marseille,
              était en grave difficulté en août 2025. Reprise du fonds il y a 3 ans, gérant épuisé, gestion
              papier, marge nette descendue à <strong>8 %</strong> malgré un CA de 580 000 EUR. Pertes au tirage
              bière non contrôlées, stocks alcool défaillants, ticket moyen stagnant à 7,80 EUR.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-mono-900 rounded-xl p-5">
                <h3 className="font-bold text-mono-100 mb-3 text-sm uppercase tracking-wider">Situation avant</h3>
                <ul className="space-y-2 text-sm text-mono-400">
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-1">●</span> Marge brute boissons 73 %</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-1">●</span> Perte tirage bière 12 %</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-1">●</span> Marge nette 8 %</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-1">●</span> Ticket moyen 7,80 EUR</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-1">●</span> Stock alcool 52 000 EUR (sur-stocké)</li>
                </ul>
              </div>

              <div className="bg-white border border-emerald-200 rounded-xl p-5">
                <h3 className="font-bold text-emerald-800 mb-3 text-sm uppercase tracking-wider">Situation après 9 mois</h3>
                <ul className="space-y-2 text-sm text-mono-400">
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">●</span> Marge brute boissons <strong>83 %</strong></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">●</span> Perte tirage bière <strong>4 %</strong></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">●</span> Marge nette <strong>23 %</strong></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">●</span> Ticket moyen <strong>10,20 EUR</strong></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">●</span> Stock alcool <strong>34 000 EUR</strong> (optimisé)</li>
                </ul>
              </div>
            </div>

            <h3 className="font-bold text-mono-100 mb-3 mt-6">Actions concrètes mises en place avec RestauMargin :</h3>
            <ol className="space-y-2 text-sm text-mono-400 list-decimal list-inside ml-2">
              <li>Calibrage installation bière pression : CO2 1,3 bar, serpentin -1 degré, formation tirage équipe</li>
              <li>Suivi ratio volume vendu/volume acheté par fût : détection 4 fûts défaillants, retour brasseur 380 EUR</li>
              <li>Inventaire spiritueux hebdomadaire par jaugeage : détection 1 800 EUR/mois d'écart inexpliqué (formation puis contrôle)</li>
              <li>Refonte carte : 5 cocktails signature maison (sirops infusion lavande, basilic, romarin) facturable 14-16 EUR</li>
              <li>Lancement Happy Hour cible 18h-19h30 : bière 25cl à 3 EUR, spritz à 6,50 EUR, volume x2,5</li>
              <li>Offre snacking : planche apéro 17 EUR (3 déclinaisons), croque-monsieur 8,50 EUR, sandwich club 11 EUR</li>
              <li>Formule petit-déj 4,80 EUR (café + jus + viennoiserie) : panier matin +75 %</li>
              <li>Soirée blind test bière mensuelle 35 EUR/personne : 60 réservations / soir, 2 100 EUR de CA événement</li>
              <li>Stock alcool réduit de 52k à 34k EUR : 18 000 EUR de trésorerie libérée, rotations passées de 8 à 16/an</li>
            </ol>

            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-sm text-emerald-900 leading-relaxed">
                <strong>Résultat financier :</strong> CA en hausse modéré (580k à 640k EUR, +10 %) mais marge nette
                passée de 46 400 EUR à 147 200 EUR. <strong>+100 800 EUR de résultat net annuel</strong> pour
                un investissement RestauMargin de 348 EUR/an. ROI : 290x.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 11 : Fonctionnalites RestauMargin specifiques bar ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              RestauMargin pour café et bar
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Toutes les fonctionnalités adaptées au pilotage d'un bar de quartier.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Martini className="w-6 h-6" />, title: 'Fiches techniques cocktails', desc: 'Calcul coût au centilitre, coefficient appliqué, marge brute par cocktail.' },
              { icon: <Beer className="w-6 h-6" />, title: 'Suivi pertes bière', desc: 'Ratio volume vendu/volume acheté par fût. Alerte si perte > 7 %.' },
              { icon: <Wine className="w-6 h-6" />, title: 'Stock alcool LIFO/FIFO', desc: 'Méthode par catégorie. Inventaire spiritueux par jaugeage. Détection écarts.' },
              { icon: <Receipt className="w-6 h-6" />, title: 'Scan factures alcool', desc: 'Bordereaux Pernod Ricard, Diageo, brasseurs locaux, cavistes : OCR.' },
              { icon: <Calculator className="w-6 h-6" />, title: 'Coefficients automatiques', desc: 'Café x6-8, bière x4-5, cocktails x4-5, vin x4-6, spiritueux x5-8.' },
              { icon: <Target className="w-6 h-6" />, title: 'KPI rotations / tickets', desc: 'Ticket moyen par créneau (matin/midi/apéro/soir). Rotations stock alcool.' },
              { icon: <Bell className="w-6 h-6" />, title: 'Alertes prix matières', desc: 'Notification temps réel hausse café, bière, alcool. Suggestion répercussion.' },
              { icon: <Users className="w-6 h-6" />, title: 'Multi-établissements', desc: 'Pour les groupes de 2-3 bars : reporting consolidé, comparatif marges.' },
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 transition-colors">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-mono-100 mb-2">{feat.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              FAQ : marge café / bar / brasserie de quartier
            </h2>
            <p className="text-lg text-mono-400">
              Les 10 questions les plus posées par les gérants de cafés et bars.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>

          <Callout type="info">
            <strong>Une question spécifique sur votre café / bar ?</strong> Contactez notre équipe via la{' '}
            <Link to="/demo" className="underline font-semibold hover:text-teal-700">page demo</Link> ou écrivez à
            contact@restaumargin.fr. Réponse sous 4h ouvrées, conseil personnalisé gratuit.
          </Callout>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6">
            Prêt à maximiser la marge brute de votre café / bar ?
          </h2>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto mb-3">
            Rejoignez les 200+ cafés, bars et coffee shops qui ont structuré leur gestion avec RestauMargin.
          </p>
          <p className="text-teal-50 mb-10">
            Essai gratuit 7 jours - Sans carte bancaire - Modèles cocktails et planches inclus
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-teal-700 font-extrabold rounded-full hover:bg-teal-50 transition-colors text-lg shadow-2xl"
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-10 py-5 border-2 border-white/40 text-white font-bold rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              Voir la demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Maillage interne ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-mono-100 mb-8 text-center">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/blog/construire-carte-vins-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Wine className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Carte des vins</h3>
              <p className="text-sm text-mono-500">Construire une carte rentable : structure, marges, rotations au verre.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Calculator className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Coefficient multiplicateur</h3>
              <p className="text-sm text-mono-500">Méthode complète pour fixer le prix de vente boissons et plats.</p>
            </Link>
            <Link to="/blog/augmenter-ticket-moyen-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <TrendingUp className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Augmenter ticket moyen</h3>
              <p className="text-sm text-mono-500">Levier #1 de croissance : stratégies éprouvées bar et restaurant.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-teal-600 text-white border border-teal-700 rounded-2xl p-6 hover:bg-teal-700 transition-all group">
              <Sparkles className="w-8 h-8 text-teal-100 mb-3" />
              <h3 className="font-bold mb-2">Essayer gratuitement</h3>
              <p className="text-sm text-teal-100">7 jours d'essai sans carte bancaire. Tout RestauMargin Pro inclus.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-mono-500">
          <Link to="/" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">Le logiciel de marge restaurant le plus complet du marché français.</p>
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

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles =
    type === 'info'
      ? 'bg-blue-50 border-blue-200 text-blue-800'
      : 'bg-amber-50 border-amber-200 text-amber-800';
  const Icon = type === 'info' ? Lightbulb : AlertTriangle;
  return (
    <div className={`${styles} border rounded-xl p-5 mt-8 flex gap-3 text-sm leading-relaxed`}>
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

function CoefBox({
  icon,
  title,
  details,
  coef,
  marge,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  details: string[];
  coef: string;
  marge: string;
  color: 'amber' | 'emerald';
}) {
  const bgColor = color === 'amber' ? 'bg-amber-50' : 'bg-emerald-50';
  const textColor = color === 'amber' ? 'text-amber-800' : 'text-emerald-800';

  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 ${bgColor} ${textColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <h3 className="font-bold text-mono-100 text-xl flex-1">{title}</h3>
      </div>

      <ul className="space-y-1.5 text-sm text-mono-400 mb-5 ml-2">
        {details.map((d, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-teal-600 mt-1">●</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-mono-900">
        <div>
          <div className="text-xs text-mono-500 uppercase tracking-wider mb-1">Coefficient</div>
          <div className={`font-bold text-lg ${color === 'amber' ? 'text-amber-700' : 'text-emerald-700'}`}>{coef}</div>
        </div>
        <div>
          <div className="text-xs text-mono-500 uppercase tracking-wider mb-1">Marge brute</div>
          <div className="font-bold text-lg text-emerald-700">{marge}</div>
        </div>
      </div>
    </div>
  );
}
