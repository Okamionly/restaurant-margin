import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Fish, Zap, Award, Sparkles, Snowflake, Clock, Truck, Users, Droplet } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO -- "Logiciel de marge pour restaurant sushi"
   Mots-cles cibles : marge sushi restaurant / food cost sushi / rentabilite restaurant japonais
   ~2 600 mots -- mode clair, fond blanc, theme W&B avec accent rose (sushi)
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost idéal pour un restaurant sushi en 2026 ?',
    answer: "Le food cost idéal d'un restaurant de sushi se situe entre 30 % et 35 %, soit 5 à 10 points au-dessus d'une pizzeria. Cette spécificité vient du coût élevé des poissons crus (saumon Atlantique 18-25 EUR/kg, thon rouge 35-50 EUR/kg) et de la perte structurellement forte (sashimi non vendu en 24 h est détruit). Un food cost supérieur à 38 % traduit soit un sourcing mal négocié, soit une perte poisson supérieure à 8 %.",
  },
  {
    question: 'Combien coûte la fabrication d\'un plateau 24 pièces saumon ?',
    answer: "Un plateau 24 pièces saumon (mix nigiri, maki, california) coûte entre 6,80 EUR et 8,20 EUR en coût matières : saumon Atlantique 180-220 g à 21 EUR/kg soit 3,80-4,60 EUR, riz à sushi 200 g cuit à 4 EUR/kg soit 0,80 EUR, nori 4 feuilles à 0,15 EUR soit 0,60 EUR, avocat 1/2 à 0,40 EUR, sauce soja + wasabi + gingembre 0,35 EUR, plateau emballage si livraison 0,55 EUR. Vendu 24-32 EUR sur place, le food cost ressort entre 25 % et 31 %.",
  },
  {
    question: 'Comment calculer la rentabilité d\'un restaurant sushi ?',
    answer: "La rentabilité d'un restaurant sushi se calcule en additionnant la marge brute par plateau / pièce puis en déduisant les charges fixes (loyer souvent en zone passante, salaire chef sushi qualifié 2 500-3 500 EUR brut, énergie froid, banque). Formule : Marge nette (%) = (CA - coûts matières - perte poisson - personnel - charges fixes) / CA x 100. Un restaurant sushi bien géré dégage 10 à 18 % de marge nette ; un mal géré descend sous 5 % à cause de la perte poisson.",
  },
  {
    question: 'Quel est le taux de perte normal sur le poisson cru en sushi ?',
    answer: "Le taux de perte structurel sur poisson cru est de 4 à 8 % du volume acheté. Le sashimi non vendu en 24 h doit être détruit pour des raisons sanitaires (HACCP) -- impossible de le recongeler ou de le requalifier. Au-delà de 10 % de perte, le sourcing est trop ambitieux ou la rotation menu est mal calibrée. RestauMargin permet de tracker la perte par espèce (saumon, thon, daurade) et d'alerter quand le seuil critique est atteint.",
  },
  {
    question: 'Combien coûte le thon rouge en sushi en 2026 ?',
    answer: "Le thon rouge sashimi grade (akami / chutoro / otoro) coûte entre 35 et 50 EUR/kg HT en mai 2026, avec un pic possible à 65 EUR/kg pour les arrivages premium Méditerranée Atlantique. L'akami (chair maigre) est l'entrée de gamme 35-42 EUR/kg, le chutoro (mi-gras) 50-65 EUR/kg, l'otoro (ventral gras) 80-130 EUR/kg. Une portion sashimi de 5 pièces (40 g) coûte donc 1,40 à 2,60 EUR matières seules.",
  },
  {
    question: 'Le saumon d\'élevage Atlantique : prix et qualité 2026 ?',
    answer: "Le saumon Atlantique d'élevage (Norvège, Écosse, Îles Féroé) coûte 18 à 25 EUR/kg HT en filet sashimi grade en 2026. Le saumon sauvage du Pacifique (sockeye, king) monte à 35-55 EUR/kg mais sa texture est moins adaptée au sushi. Pour un restaurant sushi qui vise volume et régularité, le saumon d'élevage premium reste le standard. Négociation possible -10 à -15 % avec un mareyeur direct vs Metro.",
  },
  {
    question: 'Pourquoi la rotation poisson 24h est-elle critique en sushi ?',
    answer: "La règle HACCP impose une durée de vie maximum de 24 h pour le poisson cru destiné au sashimi après découpe primaire. Au-delà, oxydation visible (couleur ternie), risque histaminique (intoxication scombroide pour thon / maquereau) et perte de fraîcheur perceptible par le client. Résultat : un restaurant sushi doit commander en juste-à-temps (JAT) 3-5 fois par semaine et calibrer ses portions au plus juste. Une rotation lente = perte directe sur la marge.",
  },
  {
    question: 'Quelle commission Uber Eats / Deliveroo sur la livraison sushi ?',
    answer: "Les plateformes prélèvent 25 à 32 % de commission sur le sushi comme sur les autres cuisines. La spécificité : le sushi voyage mal (riz qui durcit, poisson qui chauffe), donc le ticket moyen doit être élevé (35-55 EUR/commande) pour absorber la commission sans dégrader la marge. Beaucoup de restaurants sushi appliquent +15-20 % de prix sur les plateformes vs sur place. La livraison propre sur zone proche (3 km) reste la meilleure option si volume suffisant.",
  },
  {
    question: 'Quel salaire pour un chef sushi en France ?',
    answer: "Un chef sushi qualifié en CDI HCR gagne entre 2 400 EUR et 3 800 EUR brut/mois selon expérience et région, plus prime de coupure. Coût total employeur : 3 300 à 5 200 EUR/mois. Un chef sushi japonais natif ou formé au Japon (formation Tsuji ou Shoku) peut dépasser 4 500 EUR brut. C'est le poste #1 côté personnel après le loyer. Un sous-chef ou apprenti reste indispensable pour gérer le prep et le rush.",
  },
  {
    question: 'Pourquoi un logiciel de marge est-il indispensable en sushi ?',
    answer: "Un restaurant sushi gère 40-80 références (nigiri, maki, california, temaki, sashimi, plateaux, chirashi, donburi) avec des combinaisons d'ingrédients très variables et des coûts poisson qui fluctuent chaque semaine. Sans logiciel, impossible de recalculer la marge à chaque variation de prix saumon/thon ou de tracker la perte poisson. RestauMargin met à jour les coûts via le scan OCR factures mareyeur et alerte dès qu'un plat passe sous le seuil de marge cible.",
  },
];

export default function LogicielMargeSushi() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel marge sushi | Food cost saumon thon | RestauMargin"
        description="Logiciel pour calculer la marge d'un restaurant sushi japonais. Coût saumon, thon, riz, perte poisson. Food cost cible 30-35%. Essai gratuit 7 jours."
        path="/logiciel-marge-sushi"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels métier', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            { name: 'Logiciel marge sushi', url: 'https://www.restaumargin.fr/logiciel-marge-sushi' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour restaurant sushi japonais en 2026',
            description: "Guide complet du calcul de marge pour restaurant sushi : décomposition coût plateau saumon, food cost cible 30-35 %, gestion perte poisson, KPI spécifiques et cas concret Paris.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 2600,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/logiciel-marge-sushi' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin Sushi',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Sushi Restaurant Margin Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-sushi',
            description: "Logiciel SaaS de calcul de marge pour restaurant sushi japonais : food cost par plateau, suivi perte poisson 24h, gestion multi-canaux (sur place / livraison), alertes prix saumon/thon/riz, KPI rotation poisson, chef sushi.",
            featureList: [
              'Fiches techniques sushi avec grammages précis (poisson, riz, nori, garniture)',
              'Calcul food cost automatique par plateau / pièce',
              'Suivi perte poisson par espèce (saumon, thon, daurade)',
              'Scan factures mareyeur (OCR) avec mise à jour prix temps réel',
              'Grille tarifaire multi-canal (sur place, livraison propre, plateforme)',
              'Alertes déviation prix matières premières (saumon, thon, riz)',
              'KPI spécifiques sushi : rotation poisson, perte 24h, mix plateaux vs pièces',
              'Compatible PWA tablette comptoir avec mode kiosk',
            ],
            offers: {
              '@type': 'Offer',
              price: '29',
              priceCurrency: 'EUR',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '29',
                priceCurrency: 'EUR',
                unitText: 'MONTH',
              },
            },
          },
        ]}
      />

      {/* -- Navbar -- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login?mode=register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Fish className="w-4 h-4" />
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

      {/* -- Breadcrumbs visibles -- */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/logiciel-marge-restaurant" className="hover:text-teal-600">Logiciels métier</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge sushi</span>
        </div>
      </div>

      {/* -- Hero / H1 -- */}
      <BlogArticleHero
        category="Sushi & Japonais"
        readTime="13 min"
        date="Mai 2026"
        title="Logiciel de marge pour restaurant sushi japonais en 2026"
        accentWord="sushi"
        subtitle="Le sushi est un business haut de gamme avec un food cost structurellement plus élevé (30-35 %) que la moyenne, plombé par le coût des poissons crus et la perte 24h sur le sashimi. Méthode, décomposition, KPI et cas concret restaurant sushi Paris."
      />

      {/* -- Contenu principal -- */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="header" />

        {/* -- Encadre formule rapide -- */}
        <div className="mt-10 bg-gradient-to-br from-rose-600 to-rose-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-100">Repères clés restaurant sushi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les ratios à mémoriser
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-rose-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost cible sushi</strong> : 30 % à 35 % (cher à cause du poisson)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-rose-200 font-bold">2.</span>
              <span><strong className="text-white">Marge brute cible</strong> : 65 % à 70 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-rose-200 font-bold">3.</span>
              <span><strong className="text-white">Perte poisson acceptable</strong> : 4 % à 8 % du volume acheté</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-rose-200 font-bold">4.</span>
              <span><strong className="text-white">Marge nette saine</strong> : 10 % à 18 %</span>
            </div>
          </div>
          <p className="mt-4 text-rose-100 text-sm">
            Un restaurant sushi qui ne pilote pas sa perte poisson 24 h voit sa marge nette
            s'effondrer sous les 5 %, malgré des prix de vente élevés et un ticket moyen confortable.
          </p>
        </div>

        {/* -- Table des matieres -- */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#marche', label: 'Marché sushi France 2026 : 1,2 Md EUR, +6 % par an' },
              { href: '#specificites', label: 'Spécificités : food cost 30-35 %, perte poisson 24h' },
              { href: '#ingredients', label: 'Coûts ingrédients : saumon, thon rouge, riz, nori' },
              { href: '#decomposition', label: 'Décomposition coût : plateau 24 pièces, california, sashimi' },
              { href: '#8-plats', label: 'Tableau : 8 plats sushi et leurs marges' },
              { href: '#optimisation', label: 'Optimisation : JAT, rotation 24h, omakase, plateaux familiaux' },
              { href: '#livraison', label: 'Livraison sushi : spécificités et pièges' },
              { href: '#kpi', label: 'Les KPI à suivre en restaurant sushi' },
              { href: '#cas-paris', label: 'Cas concret : restaurant sushi Paris, 6 % à 18 % en 10 mois' },
              { href: '#logiciel', label: 'Comment RestauMargin automatise tout' },
              { href: '#faq', label: 'Questions fréquentes restaurant sushi' },
              { href: '#cta', label: 'Essayer RestauMargin gratuitement' },
            ].map((item, i) => (
              <li key={i}>
                <a href={item.href} className="hover:text-rose-600 transition-colors flex items-start gap-2">
                  <span className="text-rose-600 font-semibold min-w-[24px]">{i + 1}.</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article>

        {/* ═════════════ SECTION 1 : Marche France ═════════════ */}
        <section id="marche" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Marché sushi France 2026 : 1,2 Md EUR, +6 % par an
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le marché du sushi et de la cuisine japonaise en France pèse environ
              <strong> 1,2 milliard d'euros</strong> en 2026, en croissance régulière de
              <strong> +5 à +7 %</strong> par an depuis 2020. Une dynamique portée par trois
              tendances de fond : la généralisation du sushi comme cuisine quotidienne (et non
              plus exceptionnelle), l'essor de la livraison premium, et la montée en gamme
              avec le sashimi haut de gamme et l'omakase.
            </p>
            <p>
              On dénombre environ <strong>4 200 restaurants japonais et sushi</strong> en France,
              dont 60 % concentrés en Île-de-France, PACA et Auvergne-Rhone-Alpes. Le segment
              se découpe en quatre familles : sushi-shops bas de gamme (Sushi Shop, Eat Sushi),
              indépendants milieu de gamme (ticket moyen 25-40 EUR), restaurants japonais haut
              de gamme (omakase, kaiseki, ticket 80-200 EUR), et dark kitchens sushi (livraison
              uniquement, ticket 30-50 EUR).
            </p>
            <p>
              Le ticket moyen sur place se situe autour de <strong>32 EUR par couvert</strong>,
              soit 60 % plus élevé qu'une brasserie classique. En livraison, le ticket grimpe
              à <strong>45-55 EUR par commande</strong> grâce au format plateau qui pousse à
              la commande groupée.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Le marché sushi en France a triplé depuis 2015,
              porté par les 25-44 ans urbains. La part de la livraison dans le CA des restaurants
              sushi a dépassé 50 % depuis 2022 -- un changement structurel qui impose de repenser
              la gestion des marges et du sourcing.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Specificites ═════════════ */}
        <section id="specificites" className="mb-16">
          <SectionHeading icon={<Fish className="w-6 h-6" />} number="2">
            Spécificités : food cost 30-35 %, ingrédients chers, perte forte
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le food cost d'un restaurant sushi doit se situer entre <strong>30 % et 35 %</strong>,
              soit 5 à 10 points au-dessus d'une pizzeria (22-25 %) et plus élevé qu'une brasserie
              classique (28-32 %). Trois raisons structurelles expliquent ce niveau :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Coût poisson élevé</strong> : le saumon Atlantique premium coûte 18-25 EUR/kg,
                le thon rouge 35-50 EUR/kg, la daurade royale 22-30 EUR/kg. Pas d'équivalent low cost
                contrairement aux ingrédients de pizza (farine, tomate).
              </li>
              <li>
                <strong>Perte structurelle 4 à 8 %</strong> : le sashimi non vendu en 24 h doit être
                détruit. Les chutes de filet (épaisseurs trop fines, parties grasses non standardisées)
                ne sont pas réutilisables en tartare ou makis premium.
              </li>
              <li>
                <strong>Main d'oeuvre qualifiée chère</strong> : un chef sushi qualifié est rare et
                coûteux (2 500-3 500 EUR brut), ce qui pousse le prime cost (food + labor) au-delà
                de 65 % du CA dans la plupart des établissements.
              </li>
            </ul>
            <p className="mt-4">
              La gestion de la perte poisson est <strong>LE</strong> levier #1 de marge. Un restaurant
              qui passe de 10 % à 5 % de perte récupère mécaniquement 3 à 4 points de food cost, soit
              l'équivalent de toute sa marge nette annuelle dans certains cas.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <KPICard
              icon={<Percent className="w-5 h-5" />}
              label="Food cost cible"
              value="30 - 35 %"
              note="Plus élevé qu'une brasserie classique"
              color="rose"
            />
            <KPICard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Marge brute cible"
              value="65 - 70 %"
              note="Sur place et livraison propre"
              color="teal"
            />
            <KPICard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Perte poisson critique"
              value="> 10 %"
              note="Au-delà, marge nette s'effondre"
              color="amber"
            />
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Couts ingredients ═════════════ */}
        <section id="ingredients" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="3">
            Coûts ingrédients : saumon, thon rouge, riz, nori
          </SectionHeading>

          <div className="prose-content">
            <p>
              Maîtriser les coûts matières premières en restaurant sushi exige de connaître les
              prix de référence par catégorie d'ingrédient. Voici les fourchettes constatées
              en France au T2 2026 (prix HT mareyeur direct ou Metro / Pomona / Eurochef).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Prix de référence ingrédients sushi T2 2026</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Ingrédient</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix HT / kg</th>
                  <th className="text-left py-2 px-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Saumon Atlantique filet (sashimi grade)</td>
                  <td className="py-2 px-3 text-right font-semibold">18-25 EUR</td>
                  <td className="py-2 px-3 text-xs">Norvège, Écosse, Îles Féroé</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Thon rouge akami</td>
                  <td className="py-2 px-3 text-right font-semibold">35-42 EUR</td>
                  <td className="py-2 px-3 text-xs">Chair maigre, entrée de gamme</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Thon rouge chutoro</td>
                  <td className="py-2 px-3 text-right font-semibold">50-65 EUR</td>
                  <td className="py-2 px-3 text-xs">Mi-gras, milieu de gamme</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Thon rouge otoro</td>
                  <td className="py-2 px-3 text-right font-semibold">80-130 EUR</td>
                  <td className="py-2 px-3 text-xs">Ventral gras, premium</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Daurade royale entière</td>
                  <td className="py-2 px-3 text-right font-semibold">22-30 EUR</td>
                  <td className="py-2 px-3 text-xs">Rendement filet 40-45 %</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Crevettes ebi cuites</td>
                  <td className="py-2 px-3 text-right font-semibold">28-38 EUR</td>
                  <td className="py-2 px-3 text-xs">Vannamei calibre 16/20</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Riz à sushi premium (Koshihikari, Yumenishiki)</td>
                  <td className="py-2 px-3 text-right font-semibold">3,80-5,50 EUR</td>
                  <td className="py-2 px-3 text-xs">Sac 10 kg, gonflement x2,3 cuit</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Nori feuilles grade A</td>
                  <td className="py-2 px-3 text-right font-semibold">120-180 EUR / kg</td>
                  <td className="py-2 px-3 text-xs">Soit 0,12-0,18 EUR la feuille</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Wasabi reconstitué (poudre + eau)</td>
                  <td className="py-2 px-3 text-right font-semibold">35-55 EUR</td>
                  <td className="py-2 px-3 text-xs">Wasabi frais : 200-350 EUR/kg</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Gingembre mariné (gari)</td>
                  <td className="py-2 px-3 text-right font-semibold">8-14 EUR</td>
                  <td className="py-2 px-3 text-xs">Pots 1 kg, import Asie</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Sauce soja Kikkoman</td>
                  <td className="py-2 px-3 text-right font-semibold">4-7 EUR / L</td>
                  <td className="py-2 px-3 text-xs">Bidon 5 L pour service</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Avocat Hass calibre 18/20</td>
                  <td className="py-2 px-3 text-right font-semibold">4-7 EUR</td>
                  <td className="py-2 px-3 text-xs">Saisonnalité forte, perte 15 %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Trois leviers de négociation</strong> à actionner immédiatement avec votre
              mareyeur ou grossiste pour gagner 8 à 15 % sur les coûts poisson :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Volume hebdomadaire engagé : passer d'une commande quotidienne à 3 commandes / semaine sur volumes plus gros</li>
              <li>Acceptation produits "calibrés restaurateur" (un peu hors normes vente directe consommateur) -- gain 5-10 %</li>
              <li>Paiement comptant ou virement 8 jours vs 30 jours fin de mois -- gain 2-4 %</li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Decomposition cout ═════════════ */}
        <section id="decomposition" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="4">
            Décomposition coût : plateau saumon, california, sashimi
          </SectionHeading>

          <div className="prose-content">
            <p>
              Trois exemples concrets de plats sushi typiques, avec décomposition précise du coût
              matières. Prix basés sur mareyeur direct Rungis / Metro France T2 2026.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-1 gap-6">

            {/* Plateau 24 saumon */}
            <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-mono-100 mb-4 text-lg">Plateau 24 pièces saumon (mix nigiri / maki / california)</h3>
              <table className="w-full text-sm border-collapse">
                <tbody className="text-mono-350">
                  <tr>
                    <td className="py-2 px-3 font-medium">Saumon Atlantique filet (200 g)</td>
                    <td className="py-2 px-3 text-right">4,20 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Riz à sushi cuit (220 g, soit 95 g sec)</td>
                    <td className="py-2 px-3 text-right">0,45 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Nori (4 feuilles)</td>
                    <td className="py-2 px-3 text-right">0,60 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Avocat 1/2</td>
                    <td className="py-2 px-3 text-right">0,40 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Vinaigre de riz + sucre + sel (assaisonnement)</td>
                    <td className="py-2 px-3 text-right">0,15 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Sauce soja + wasabi + gingembre (sachets)</td>
                    <td className="py-2 px-3 text-right">0,35 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Plateau plastique + couvercle + baguettes (livraison)</td>
                    <td className="py-2 px-3 text-right">0,75 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 italic">+ Allocation perte poisson 6 %</td>
                    <td className="py-2 px-3 text-right">0,60 EUR</td>
                  </tr>
                  <tr className="border-t-2 border-mono-900 bg-rose-50">
                    <td className="py-3 px-3 font-bold text-mono-100">Total coût matières (livraison)</td>
                    <td className="py-3 px-3 text-right font-bold text-rose-900">7,50 EUR</td>
                  </tr>
                  <tr className="bg-emerald-50">
                    <td className="py-3 px-3 font-bold text-mono-100">Prix de vente plateforme</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-900">28,00 EUR</td>
                  </tr>
                  <tr className="bg-emerald-50">
                    <td className="py-3 px-3 font-bold text-mono-100">Food cost</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-900">27 %</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* California Roll */}
            <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-mono-100 mb-4 text-lg">California Roll (6 pièces, format snack)</h3>
              <table className="w-full text-sm border-collapse">
                <tbody className="text-mono-350">
                  <tr>
                    <td className="py-2 px-3 font-medium">Surimi crabe (40 g)</td>
                    <td className="py-2 px-3 text-right">0,40 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Riz à sushi cuit (75 g)</td>
                    <td className="py-2 px-3 text-right">0,15 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Avocat 1/4</td>
                    <td className="py-2 px-3 text-right">0,25 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Concombre 30 g</td>
                    <td className="py-2 px-3 text-right">0,08 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Sésame + mayo japonaise (topping)</td>
                    <td className="py-2 px-3 text-right">0,15 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Nori (1 feuille)</td>
                    <td className="py-2 px-3 text-right">0,15 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Sauce soja + sachets condiments</td>
                    <td className="py-2 px-3 text-right">0,20 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Barquette + couvercle</td>
                    <td className="py-2 px-3 text-right">0,42 EUR</td>
                  </tr>
                  <tr className="border-t-2 border-mono-900 bg-rose-50">
                    <td className="py-3 px-3 font-bold text-mono-100">Total coût matières</td>
                    <td className="py-3 px-3 text-right font-bold text-rose-900">1,80 EUR</td>
                  </tr>
                  <tr className="bg-emerald-50">
                    <td className="py-3 px-3 font-bold text-mono-100">Prix de vente sur place</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-900">6,50 EUR</td>
                  </tr>
                  <tr className="bg-emerald-50">
                    <td className="py-3 px-3 font-bold text-mono-100">Food cost</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-900">28 %</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Sashimi thon rouge */}
            <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-mono-100 mb-4 text-lg">Sashimi thon rouge akami (5 pièces, 80 g)</h3>
              <table className="w-full text-sm border-collapse">
                <tbody className="text-mono-350">
                  <tr>
                    <td className="py-2 px-3 font-medium">Thon rouge akami (80 g à 42 EUR/kg)</td>
                    <td className="py-2 px-3 text-right">3,40 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Daikon julienne (décoration 30 g)</td>
                    <td className="py-2 px-3 text-right">0,15 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Shiso (feuille décorative)</td>
                    <td className="py-2 px-3 text-right">0,20 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Wasabi frais + gingembre</td>
                    <td className="py-2 px-3 text-right">0,35 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Sauce soja premium</td>
                    <td className="py-2 px-3 text-right">0,10 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 italic">+ Allocation perte thon 12 % (haute perte)</td>
                    <td className="py-2 px-3 text-right">2,00 EUR</td>
                  </tr>
                  <tr className="border-t-2 border-mono-900 bg-rose-50">
                    <td className="py-3 px-3 font-bold text-mono-100">Total coût matières</td>
                    <td className="py-3 px-3 text-right font-bold text-rose-900">6,20 EUR</td>
                  </tr>
                  <tr className="bg-emerald-50">
                    <td className="py-3 px-3 font-bold text-mono-100">Prix de vente sur place</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-900">18,00 EUR</td>
                  </tr>
                  <tr className="bg-emerald-50">
                    <td className="py-3 px-3 font-bold text-mono-100">Food cost</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-900">34 %</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Le sashimi de thon rouge</strong> est le plat le plus difficile à piloter :
              food cost à 34 % (limite haute cible) avec une perte structurelle de 10-15 % parce
              que les chutes ne se requalifient pas. C'est pourtant un produit signature
              indispensable pour positionner le restaurant en milieu / haut de gamme.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : 8 plats sushi ═════════════ */}
        <section id="8-plats" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="5">
            8 plats sushi types et leurs marges
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tableau de référence : 8 plats sushi typiques couvrant les formats les plus vendus
              en France. Coûts matières basés sur prix mareyeur direct T2 2026, prix de vente
              moyens constatés hors Paris ultra-centre et zones premium.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Plat</th>
                  <th className="text-center py-3 px-4 font-semibold">Coût matières</th>
                  <th className="text-center py-3 px-4 font-semibold">Prix sur place</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { name: 'Plateau 24 pièces saumon (mix)', cm: '7,50 EUR', pv: '28,00 EUR', fc: '27 %', mb: '20,50 EUR / 73 %' },
                  { name: 'Plateau 48 pièces familial', cm: '14,80 EUR', pv: '52,00 EUR', fc: '28 %', mb: '37,20 EUR / 72 %' },
                  { name: 'California Roll (6 pièces)', cm: '1,80 EUR', pv: '6,50 EUR', fc: '28 %', mb: '4,70 EUR / 72 %' },
                  { name: 'Maki saumon (6 pièces)', cm: '1,90 EUR', pv: '6,80 EUR', fc: '28 %', mb: '4,90 EUR / 72 %' },
                  { name: 'Nigiri thon akami (2 pièces)', cm: '2,80 EUR', pv: '8,50 EUR', fc: '33 %', mb: '5,70 EUR / 67 %' },
                  { name: 'Sashimi saumon (8 pièces)', cm: '4,40 EUR', pv: '14,50 EUR', fc: '30 %', mb: '10,10 EUR / 70 %' },
                  { name: 'Sashimi thon rouge (5 pièces)', cm: '6,20 EUR', pv: '18,00 EUR', fc: '34 %', mb: '11,80 EUR / 66 %' },
                  { name: 'Chirashi bowl saumon-thon', cm: '5,80 EUR', pv: '18,50 EUR', fc: '31 %', mb: '12,70 EUR / 69 %' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.name}</td>
                    <td className="py-3 px-4 text-center">{row.cm}</td>
                    <td className="py-3 px-4 text-center font-semibold">{row.pv}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-semibold">{row.mb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Quelques observations clés :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Les plateaux mix saumon</strong> sont le meilleur compromis volume / marge :
                food cost contenu (27-28 %), prix de vente confortable (28-52 EUR), client satisfait
                par le rapport quantité/prix. C'est le best-seller à pousser en livraison.
              </li>
              <li>
                <strong>Les sashimi thon</strong> sont les plats premium qui rehaussent le ticket
                moyen mais flirtent avec la limite haute du food cost (34 %). À garder en carte
                pour positionnement premium, sans en dépendre.
              </li>
              <li>
                <strong>Les californias et makis basiques</strong> sont les "vaches à lait" du sushi :
                food cost contenu (28 %), faciles à produire en série, parfaits pour le ticket
                moyen et les bento.
              </li>
              <li>
                <strong>Le chirashi</strong> est un format moins connu en France mais très rentable
                (food cost 31 %, ticket 18,50 EUR). À pousser comme plat midi unique pour la
                clientèle bureau.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Optimisation ═════════════ */}
        <section id="optimisation" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="6">
            Optimisation : JAT, rotation 24h, omakase, plateaux familiaux
          </SectionHeading>

          <div className="prose-content">
            <p>
              Quatre leviers d'optimisation spécifiques au restaurant sushi pour réduire la perte
              poisson, augmenter le ticket moyen et stabiliser la marge.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <StrategieCard
              number={1}
              title="Commandes JAT (juste-à-temps) 3 à 5 fois par semaine"
              desc="Négocier avec votre mareyeur des livraisons quotidiennes ou bi-quotidiennes sur des volumes calibrés. Le poisson arrive le matin pour le service midi, on ajuste la commande du soir selon le rush midi. Réduit la perte de 10 % à 5 %. Nécessite un logiciel pour suivre la consommation en temps réel."
            />
            <StrategieCard
              number={2}
              title="Rotation 24 h obligatoire et détection précoce"
              desc="Étiqueter chaque arrivage avec date + heure découpe primaire. Le sashimi non vendu en H+18 est requalifié en plateau cuit (sushi grillé, maki tempura) pour éviter la destruction. RestauMargin alerte automatiquement quand un lot approche de l'expiration."
            />
            <StrategieCard
              number={3}
              title="Pousser l'omakase ou menu dégustation"
              desc="Format omakase (le chef décide) ou menu dégustation 5-7 services permet d'écouler les chutes nobles non vendables à la pièce. Ticket moyen 65-120 EUR avec food cost maîtrisé à 30 %. À réserver 24 h à l'avance pour calibrer le sourcing."
            />
            <StrategieCard
              number={4}
              title="Plateaux familiaux livraison (40-72 pièces)"
              desc="Concentrer la livraison sur les gros plateaux : meilleur ratio coup-matières/prix de vente (28 % vs 33 % sur les pièces unitaires), un seul emballage donc économie packaging, ticket moyen 45-85 EUR qui absorbe mieux la commission plateforme."
            />
          </div>

          <div className="prose-content mt-8">
            <Callout type="info">
              <strong>Bonne pratique sourcing :</strong> certains restaurants sushi premium passent
              en direct avec un pêcheur breton (daurade, bar, maquereau) ou un mareyeur de Rungis
              pour le saumon / thon. Gain de 12-18 % vs Metro, mais nécessite un volume hebdomadaire
              engagé et une logistique de réception rigoureuse.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Livraison ═════════════ */}
        <section id="livraison" className="mb-16">
          <SectionHeading icon={<Truck className="w-6 h-6" />} number="7">
            Livraison sushi : spécificités et pièges
          </SectionHeading>

          <div className="prose-content">
            <p>
              La livraison représente 50 % à 70 % du CA des restaurants sushi en France en 2026.
              C'est donc un canal incontournable, mais qui présente plusieurs pièges spécifiques
              au sushi.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Piège 1 : la commission plateforme</h3>
            <p>
              Uber Eats et Deliveroo prélèvent 25-32 % de commission sur le sushi comme sur le
              reste. Sur un plateau 24 pièces vendu 28 EUR via Uber Eats avec commission 30 % :
              prix HT 25,45 EUR, commission 7,64 EUR, coût matières 7,50 EUR, reste 10,31 EUR
              de marge brute réelle (37 % vs 73 % sur place).
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Piège 2 : la chaîne du froid</h3>
            <p>
              Le sushi voyage mal au-delà de 25-30 minutes. Le riz durcit, le poisson chauffe,
              les californias se ramollissent. Résultat : avis négatifs, demandes de remboursement,
              perte de clientèle. Solution : limiter la zone de livraison à 4-6 km (15-20 min de
              trajet), utiliser un sac isotherme rigide, ne pas livrer en heures de pointe trafic.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Piège 3 : le packaging</h3>
            <p>
              Le packaging sushi coûte cher (0,55 à 1,20 EUR par commande selon format) et impacte
              directement la marge. Plateaux PET rigides + couvercle + baguettes + sachets sauces +
              sac kraft = 1 EUR perdu sur chaque livraison. Solution : négocier le packaging en
              gros (palettes de 1 000), passer au PLA biosourcé qui peut être facturé client +0,50 EUR
              avec argument eco-responsable.
            </p>

            <div className="mt-6 grid sm:grid-cols-1 gap-4">
              <StrategieCard
                number={1}
                title="Prix différencié par canal (+15 à 20 % en livraison plateforme)"
                desc="Plateau 24 pièces vendu 24 EUR sur place / 28 EUR en livraison Uber Eats. Le client accepte ce surplus comme un prix de la commodité. La marge brute après commission remonte à 45 %."
              />
              <StrategieCard
                number={2}
                title="Livraison propre sur zone restreinte (3-4 km)"
                desc="Recruter 1-2 livreurs en CDI temps partiel ou utiliser un partenaire local. Coût 1 200-1 800 EUR/mois pour 30-50 livraisons/jour. Rentable au-delà de 1 200 commandes/mois. Marge brute préservée à 65-70 %."
              />
              <StrategieCard
                number={3}
                title="Click & collect avec -2 EUR de réduction"
                desc="Offrir -2 EUR sur le plateau 24 pièces si retrait en restaurant. Zéro commission, zéro packaging livraison. Marge brute préservée à 73 %. Cibler 20-25 % du CA en click & collect en 6 mois."
              />
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : KPI ═════════════ */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="8">
            Les KPI à suivre en restaurant sushi
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un restaurant sushi bien géré pilote 6 indicateurs au quotidien. Sans ces KPI,
              vous détectez les problèmes 3-6 mois après leur apparition, quand la marge nette
              commence à fondre.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Percent className="w-5 h-5" />, title: '1. Food cost matières premières', desc: 'Cible 30-35 %. Au-delà, alerte immédiate. En dessous (rare en sushi), suspecter portions chiches.' },
              { icon: <Fish className="w-5 h-5" />, title: '2. Perte poisson par espèce', desc: 'Tracker saumon, thon, daurade séparément. Cible < 8 %. Alerte si > 10 %.' },
              { icon: <Snowflake className="w-5 h-5" />, title: '3. Rotation poisson (jours)', desc: 'Stock poisson / consommation moyenne. Cible 1,5-2 jours max. Au-delà, sourcing trop ambitieux.' },
              { icon: <DollarSign className="w-5 h-5" />, title: '4. Ticket moyen', desc: 'Sur place : 28-40 EUR par couvert. En livraison : 42-58 EUR par commande. Suivre par canal.' },
              { icon: <Truck className="w-5 h-5" />, title: '5. Ratio livraison vs sur place', desc: 'Maintenir sous 60 % pour préserver la marge nette. Alerte si > 70 %.' },
              { icon: <Droplet className="w-5 h-5" />, title: '6. Mix plateaux vs pièces unitaires', desc: 'Plateaux plus rentables. Cible 60 % CA en plateaux. Pousser les bento en livraison.' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-rose-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 mb-3">
                  {kpi.icon}
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{kpi.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{kpi.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Cas concret Paris ═════════════ */}
        <section id="cas-paris" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="9">
            Cas concret : restaurant sushi Paris, 6 % à 18 % en 10 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Restaurant sushi indépendant Paris 11ème, 45 couverts. Reprise en juin 2025 par
              Sophie L., 34 ans, ancienne consultante en hôtellerie. CA annuel constaté à la
              reprise : 420 000 EUR, marge nette 6 %.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Diagnostic initial (mois 1)</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Food cost réel : 41 % (vs cible 33 %). Perte poisson 14 % (vs cible 6-8 %).</li>
              <li>Ratio livraison : 72 % du CA via Uber Eats + Deliveroo. Commission moyenne 29 %.</li>
              <li>Sourcing : Metro uniquement, 6 livraisons/semaine, pas de mareyeur direct.</li>
              <li>Carte sur-étendue : 64 références sushi + 18 entrées + 12 chauds. Chef sushi surchargé.</li>
              <li>Aucun suivi temps réel : factures saisies à la main 1 fois/mois.</li>
              <li>Packaging livraison : 1,15 EUR par commande, plateaux PET premium non négociés.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Plan d'action en 4 phases</h3>
            <div className="space-y-4 mt-6">
              <PhaseCard
                phase="Phase 1 (mois 1-2)"
                title="Maîtrise de la perte poisson"
                actions={[
                  'Mise en place de fiches techniques précises pour les 64 références via RestauMargin',
                  'Étiquetage systématique des arrivages (date + heure découpe)',
                  'Réduction carte à 38 références core + 4 saisonnières',
                  'Résultat : perte poisson passe de 14 % à 8 %, food cost de 41 % à 35 %',
                ]}
              />
              <PhaseCard
                phase="Phase 2 (mois 3-4)"
                title="Réorganisation du sourcing"
                actions={[
                  'Négociation mareyeur direct Rungis pour saumon / thon (-15 % vs Metro)',
                  'Passage en JAT 4 livraisons/semaine sur volumes calibrés',
                  'Scan factures OCR via RestauMargin (gain 2h/semaine)',
                  'Résultat : food cost passe de 35 % à 32 %',
                ]}
              />
              <PhaseCard
                phase="Phase 3 (mois 5-7)"
                title="Stratégie multi-canal"
                actions={[
                  'Lancement click & collect via site web RestauMargin (-2 EUR)',
                  'Prix différencié : +18 % sur Uber Eats / Deliveroo',
                  'Recrutement livreur CDI temps partiel pour zone proche',
                  'Résultat : ratio livraison plateforme tombe de 72 % à 48 %',
                ]}
              />
              <PhaseCard
                phase="Phase 4 (mois 8-10)"
                title="Pilotage en temps réel"
                actions={[
                  'Tableau de bord RestauMargin vérifié 3x/semaine',
                  'Alertes prix saumon / thon / riz activées',
                  'Négociation packaging : -0,35 EUR par commande',
                  'Résultat final : marge nette 18 %',
                ]}
              />
            </div>

            <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-emerald-900 text-lg">Résultats après 10 mois</h3>
              </div>
              <ul className="space-y-2 text-emerald-800 text-sm">
                <li><strong>CA annuel :</strong> 420 000 EUR -- 510 000 EUR (+21 %)</li>
                <li><strong>Food cost :</strong> 41 % -- 32 %</li>
                <li><strong>Perte poisson :</strong> 14 % -- 6 %</li>
                <li><strong>Marge nette :</strong> 6 % -- 18 % (soit 25 200 EUR -- 91 800 EUR)</li>
                <li><strong>Ratio livraison plateforme :</strong> 72 % -- 48 %</li>
                <li><strong>Click & collect :</strong> 0 % -- 22 % du CA</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 10 : Logiciel RestauMargin ═════════════ */}
        <section id="logiciel" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="10">
            Comment RestauMargin automatise tout
          </SectionHeading>

          <div className="prose-content">
            <p>
              RestauMargin est conçu pour la réalité opérationnelle d'un restaurant sushi :
              poisson cher, perte structurelle, multi-canal, pression sur les marges. Voici
              les 6 modules clés qui vous font gagner 10 à 18 heures par mois et 5 à 10 points
              de marge nette.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Fish className="w-5 h-5" />, title: 'Fiches techniques sushi', desc: 'Créez vos recettes avec grammages précis (poisson, riz, nori, garniture). Food cost calculé automatiquement par pièce et par plateau.' },
              { icon: <Snowflake className="w-5 h-5" />, title: 'Suivi perte poisson 24 h', desc: 'Étiquetage des arrivages, alerte H-6 avant expiration, requalification automatique en plateau cuit. Réduction perte de 30 à 50 %.' },
              { icon: <AlertTriangle className="w-5 h-5" />, title: 'Alertes prix mareyeur', desc: 'Recevez une notification dès qu\'un prix saumon, thon ou riz dévie de + de 5 %. Renégociez avant que la marge soit attaquée.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Dashboard sushi', desc: '6 KPI clés affichés en temps réel : food cost, perte poisson, rotation, ticket moyen, ratio livraison, mix plateaux.' },
              { icon: <Lightbulb className="w-5 h-5" />, title: 'Scan factures OCR mareyeur', desc: 'Photographiez vos factures Metro, Pomona, mareyeur direct. Les prix poissons se mettent à jour automatiquement.' },
              { icon: <Users className="w-5 h-5" />, title: 'Click & collect intégré', desc: 'Site web de commande clef en main inclus. Zéro commission. Tablette comptoir compatible mode kiosk.' },
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-rose-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              Plus de 40 restaurants sushi en France utilisent déjà RestauMargin pour piloter
              leur rentabilité. Gain moyen constaté : <strong>6,2 points de marge brute en 6 mois</strong>,
              principalement grâce au suivi perte poisson et aux alertes prix mareyeur. Pour
              aller plus loin, lisez notre guide complet sur <Link to="/blog/reduire-food-cost" className="text-rose-700 underline hover:text-rose-800">la réduction du food cost en restauration</Link>,
              notre article sur <Link to="/blog/rotation-stocks-restaurant" className="text-rose-700 underline hover:text-rose-800">la rotation des stocks restaurant</Link> ou
              testez le <Link to="/outils/calculateur-food-cost" className="text-rose-700 underline hover:text-rose-800">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes restaurant sushi</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ═════════════ CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-rose-600 to-rose-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Piloter la marge de votre restaurant sushi avec RestauMargin
            </h2>
            <p className="text-rose-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Food cost, perte poisson, prix multi-canaux, alertes mareyeur, KPI temps réel :
              tout ce qu'il faut pour garder une marge nette supérieure à 15 %.
            </p>
            <p className="text-rose-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> &mdash; essai gratuit 7 jours, sans engagement, sans carte bancaire.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose-700 font-bold rounded-full hover:bg-rose-50 transition-colors text-lg shadow-lg"
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

        {/* ═════════════ Articles complementaires ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-rose-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-rose-700 transition-colors">Réduire le food cost en restaurant</h3>
              <p className="text-xs text-mono-500">10 stratégies efficaces pour optimiser vos coûts matières.</p>
            </Link>
            <Link to="/blog/rotation-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-rose-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-rose-700 transition-colors">Rotation des stocks restaurant</h3>
              <p className="text-xs text-mono-500">Méthodes FIFO, calculs rotation, KPI à suivre.</p>
            </Link>
            <Link to="/blog/livraison-restaurant-rentabilite" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-rose-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-rose-700 transition-colors">Livraison restaurant : rentabilité réelle</h3>
              <p className="text-xs text-mono-500">Commissions, marges, stratégies multi-canal.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-rose-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-rose-700 transition-colors">Essai gratuit 7 jours</h3>
              <p className="text-xs text-mono-500">Pilotez votre restaurant sushi sans carte bancaire requise.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* -- Footer -- */}
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
      <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-mono-100">
        <span className="text-rose-600 mr-2">{number}.</span>
        {children}
      </h2>
    </div>
  );
}

function KPICard({ icon, label, value, note, color }: {
  icon: React.ReactNode; label: string; value: string; note: string; color: 'rose' | 'teal' | 'amber';
}) {
  const colors: Record<string, { bg: string; badge: string; text: string }> = {
    rose: { bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-700', text: 'text-rose-900' },
    teal: { bg: 'bg-teal-50', badge: 'bg-teal-100 text-teal-700', text: 'text-teal-900' },
    amber: { bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', text: 'text-amber-900' },
  };
  const c = colors[color];
  return (
    <div className={`${c.bg} rounded-2xl p-5 border border-mono-975`}>
      <div className={`w-9 h-9 ${c.badge} rounded-lg flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <div className="text-xs font-semibold uppercase tracking-wider text-mono-500 mb-1">{label}</div>
      <div className={`text-2xl font-extrabold ${c.text} mb-1`}>{value}</div>
      <div className="text-xs text-mono-500">{note}</div>
    </div>
  );
}

function StrategieCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-mono-100 mb-1.5">{title}</h3>
        <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function PhaseCard({ phase, title, actions }: { phase: string; title: string; actions: string[] }) {
  return (
    <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6">
      <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-1">{phase}</div>
      <h3 className="font-bold text-mono-100 text-lg mb-3">{title}</h3>
      <ul className="space-y-1.5 text-sm text-mono-400">
        {actions.map((action, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{action}</span>
          </li>
        ))}
      </ul>
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
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-rose-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
