import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Salad, Zap, Award, Sparkles, Leaf, Clock, Truck, Users, Apple } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO -- "Logiciel de marge pour salad bar / healthy bowl"
   Mots-cles cibles : marge salad bar / rentabilite bowl healthy / food cost poke bowl
   ~2 600 mots -- mode clair, fond blanc, theme W&B avec accent emeraude (healthy)
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost ideal pour un salad bar ou un restaurant healthy en 2026 ?',
    answer: "Le food cost ideal d'un salad bar ou d'un restaurant healthy (poke, buddha bowls, smoothies) se situe entre 30 % et 35 %, soit 5 a 8 points au-dessus d'une pizzeria. Cette specificite vient du cout eleve des produits frais premium (avocat 4-7 EUR/kg, saumon 22-26 EUR/kg, pousses d'epinard 12-15 EUR/kg) et de la perte structurellement forte sur produits a duree de vie courte (24-48 h). Un food cost superieur a 38 % signale un sourcing mal negocie ou une perte produits frais superieure a 10 %.",
  },
  {
    question: 'Combien coute la fabrication d\'un poke bowl saumon ?',
    answer: "Un poke bowl saumon classique (riz 100 g, saumon 100 g, avocat 1/2, edamame, carotte, mangue, sauce miso) coute entre 5,20 EUR et 5,80 EUR en cout matieres : riz vinaigre 0,15 EUR, saumon cru sashimi grade 2,50 EUR, avocat 1,50 EUR, edamame 0,40 EUR, carotte marinee 0,20 EUR, mangue 0,30 EUR, sauce miso maison 0,30 EUR, graines sesame 0,10 EUR. Vendu 14 a 16 EUR sur place, le food cost ressort entre 34 % et 39 %.",
  },
  {
    question: 'Comment calculer la rentabilite d\'un salad bar healthy ?',
    answer: "La rentabilite d'un salad bar se calcule en additionnant la marge brute par bowl/salade puis en deduisant les charges fixes (loyer souvent en zone passante midi, salaires equipe prep matinale, energie froid, banque). Formule : Marge nette (%) = (CA - couts matieres - perte produits frais - personnel - charges fixes) / CA x 100. Un salad bar bien gere degage 12 a 18 % de marge nette ; un mal gere descend sous 5 % a cause de la perte avocat / saumon / pousses non vendus le soir.",
  },
  {
    question: 'Quel est le taux de perte normal sur les ingredients frais en healthy ?',
    answer: "Le taux de perte structurel sur produits frais en salad bar est de 8 a 12 % du volume achete : pousses d'epinard et mache (oxydent en 24 h), avocats trop murs, herbes fraiches, saumon cru. Au-dela de 15 % de perte, le sourcing est trop ambitieux ou la rotation menu est mal calibree. RestauMargin permet de tracker la perte par categorie (legumes feuilles, proteines, fruits) et d'alerter quand le seuil critique est atteint.",
  },
  {
    question: 'Pourquoi l\'avocat est-il un poste critique en salad bar ?',
    answer: "L'avocat est le poste #1 de volatilite des couts en salad bar : son prix oscille entre 3 EUR/kg en pleine saison Mexique (octobre-fevrier) et 8 EUR/kg en intersaison (avril-juin). Sur un bowl avec 1/2 avocat (75 g), cette volatilite represente +/- 0,40 EUR par bowl, soit jusqu'a 4 points de food cost. Une mercuriale rigoureuse et un stock tampon avocat sont indispensables. Astuce : passer en avocat surgele en demi pour les sauces et tartinades pendant les pics de prix.",
  },
  {
    question: 'Combien coutent les pousses d\'epinard et la mache en 2026 ?',
    answer: "Les pousses d'epinard cooperatives (Provence, Aquitaine) coutent 12 a 15 EUR/kg HT chez Pomona/Metro en mai 2026, avec un pic possible a 18 EUR/kg en juillet-aout (canicule). La mache premium 10 a 14 EUR/kg, la roquette 8 a 12 EUR/kg. Pour un salad bar qui consomme 8-12 kg de mix feuilles par jour, c'est un poste majeur (300-450 EUR/semaine). Negociation possible -10 a -15 % avec un grossiste maraicher direct vs distributeur.",
  },
  {
    question: 'Pourquoi la rotation 24-48h est-elle critique en healthy ?',
    answer: "Les ingredients d'un salad bar healthy (pousses, herbes, fruits coupes, proteines crues) ont une duree de vie tres courte apres preparation : 24 h pour saumon cru et fruits coupes, 48 h max pour les sauces maison et legumes coupes. Au-dela : oxydation visible, perte de croquant, risque sanitaire. Un salad bar doit donc commander en juste-a-temps (JAT) 4-6 fois par semaine et calibrer ses preparations au plus juste. Une rotation lente = perte directe sur la marge.",
  },
  {
    question: 'Quelle commission Uber Eats / Deliveroo sur la livraison de bowls ?',
    answer: "Les plateformes prelevent 25 a 32 % de commission sur le healthy comme sur les autres cuisines. La specificite : un bowl voyage mieux qu'un sushi (sauce a part, ingredients separes possibles), mais le ticket moyen reste bas (12-18 EUR). Beaucoup de salad bars appliquent +12 a 18 % de prix sur les plateformes vs sur place et poussent les formules 2 bowls / box famille pour augmenter le ticket. Le click & collect (+0 % commission) reste l'objectif a 25-30 % du CA.",
  },
  {
    question: 'Quel salaire pour une equipe de salad bar ?',
    answer: "Un salad bar avec 200-300 couverts/jour fait tourner 4-6 personnes : 1 chef cuisinier qualifie (2 200-2 800 EUR brut/mois en HCR), 1-2 commis prep matinale (1 700-1 950 EUR brut), 2-3 vendeurs comptoir et caisse (SMIC HCR a 1 800 EUR). Cout total employeur : 12 000 a 16 000 EUR/mois. Le poste prep matinale (5h30-10h30) est critique : c'est la qui se joue 70 % de la productivite midi. Centraliser la prep en amont du rush est non-negociable.",
  },
  {
    question: 'Pourquoi un logiciel de marge est-il indispensable pour un salad bar ?',
    answer: "Un salad bar gere 30-60 references (bowls signatures, salades composees, smoothies, jus, snacks) avec des combinaisons d'ingredients tres variables et des couts produits frais qui fluctuent chaque semaine (avocat, saumon, pousses, fruits exotiques). Sans logiciel, impossible de recalculer la marge a chaque variation de prix ou de tracker la perte par categorie. RestauMargin met a jour les couts via le scan OCR factures grossistes et alerte des qu'un bowl passe sous le seuil de marge cible.",
  },
];

export default function LogicielMargeSaladBar() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel marge salad bar healthy | Food cost poke bowl | RestauMargin"
        description="Logiciel pour calculer marge salad bar, poke bowl, healthy restaurant. Food cost 30-35%, gestion ingredients frais. Essai gratuit 7 jours."
        path="/logiciel-marge-salad-bar"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels metier', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            { name: 'Logiciel marge salad bar', url: 'https://www.restaumargin.fr/logiciel-marge-salad-bar' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour salad bar et restaurant healthy en 2026',
            description: "Guide complet du calcul de marge pour salad bar et restaurant healthy : decomposition cout poke bowl saumon, food cost cible 30-35 %, gestion perte produits frais, KPI specifiques et cas concret Paris.",
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/logiciel-marge-salad-bar' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin Salad Bar',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Healthy Restaurant Margin Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-salad-bar',
            description: "Logiciel SaaS de calcul de marge pour salad bar et restaurant healthy : food cost par bowl, suivi perte produits frais 24-48h, gestion multi-canaux (sur place / livraison / click & collect), alertes prix avocat/saumon/pousses, KPI rotation, optimisation menu signature.",
            featureList: [
              'Fiches techniques bowls et salades avec grammages precis',
              'Calcul food cost automatique par bowl / formule / smoothie',
              'Suivi perte produits frais par categorie (feuilles, proteines, fruits)',
              'Scan factures grossistes (OCR) avec mise a jour prix temps reel',
              'Grille tarifaire multi-canal (sur place, livraison, click & collect)',
              'Alertes deviation prix matieres premieres (avocat, saumon, pousses)',
              'KPI specifiques healthy : rotation produits frais, perte 24-48h, mix bowls vs formules',
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
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '78',
              bestRating: '5',
              worstRating: '1',
            },
          },
        ]}
      />

      {/* -- Navbar -- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login?mode=register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Salad className="w-4 h-4" />
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
          <Link to="/logiciel-marge-restaurant" className="hover:text-teal-600">Logiciels metier</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge salad bar</span>
        </div>
      </div>

      {/* -- Hero / H1 -- */}
      <BlogArticleHero
        category="Salad Bar & Healthy"
        readTime="13 min"
        date="Mai 2026"
        title="Logiciel de marge pour salad bar et restaurant healthy en 2026"
        accentWord="salad bar"
        subtitle="Le healthy est un business porteur (+12 %/an) avec un food cost structurellement plus eleve (30-35 %) que la moyenne, plombe par le cout des produits frais premium (avocat, saumon, pousses) et la perte 24-48 h. Methode, decomposition, KPI et cas concret salad bar Paris."
      />

      {/* -- Contenu principal -- */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="header" />

        {/* -- Encadre formule rapide -- */}
        <div className="mt-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Reperes cles salad bar healthy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les ratios a memoriser
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-emerald-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost cible healthy</strong> : 30 % a 35 % (cher a cause du frais premium)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-200 font-bold">2.</span>
              <span><strong className="text-white">Marge brute cible</strong> : 65 % a 70 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-200 font-bold">3.</span>
              <span><strong className="text-white">Perte produits frais acceptable</strong> : 8 % a 12 % du volume achete</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-200 font-bold">4.</span>
              <span><strong className="text-white">Marge nette saine</strong> : 12 % a 18 %</span>
            </div>
          </div>
          <p className="mt-4 text-emerald-100 text-sm">
            Un salad bar qui ne pilote pas sa perte frais (avocat, saumon, pousses) voit sa marge nette
            s'effondrer sous les 5 %, malgre un ticket moyen confortable et une frequentation midi soutenue.
          </p>
        </div>

        {/* -- Table des matieres -- */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#marche', label: 'Marche healthy France 2026 : 1,4 Md EUR, +12 % par an' },
              { href: '#specificites', label: 'Specificites : food cost 30-35 %, frais coûteux, rotation 24-48h' },
              { href: '#ingredients', label: 'Couts ingredients : bases, legumes, proteines, toppings' },
              { href: '#poke-bowl', label: 'Decomposition cout : poke bowl saumon detaille' },
              { href: '#8-bowls', label: 'Tableau : 8 bowls healthy types et leurs marges' },
              { href: '#operations', label: 'Operations : prep matinale, presentation Instagram-worthy' },
              { href: '#avocat', label: 'Avocat : la volatilite cachee qui plombe votre marge' },
              { href: '#optimisation', label: 'Optimisation : menu signature, abonnement, livraison' },
              { href: '#kpi', label: 'Les KPI a suivre en salad bar healthy' },
              { href: '#cas-paris', label: 'Cas concret : salad bar Paris, 5 % a 18 % de marge nette' },
              { href: '#logiciel', label: 'Comment RestauMargin automatise tout' },
              { href: '#faq', label: 'Questions frequentes salad bar healthy' },
              { href: '#cta', label: 'Essayer RestauMargin gratuitement' },
            ].map((item, i) => (
              <li key={i}>
                <a href={item.href} className="hover:text-emerald-600 transition-colors flex items-start gap-2">
                  <span className="text-emerald-600 font-semibold min-w-[24px]">{i + 1}.</span>
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
            Marche healthy France 2026 : 1,4 Md EUR, +12 % par an
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le marche du healthy en France (salad bars, poke bowls, buddha bowls, smoothies, jus
              frais, snacking vegetal) pese environ <strong>1,4 milliard d'euros</strong> en 2026,
              en croissance forte de <strong>+10 a +14 %</strong> par an depuis 2020. Une dynamique
              portee par trois tendances de fond : la generalisation du "manger mieux" comme reflexe
              quotidien (et non plus exceptionnel), l'essor de la livraison healthy en zone bureau,
              et la sensibilite croissante des 25-44 ans urbains aux produits frais et bio.
            </p>
            <p>
              On denombre environ <strong>3 800 salad bars et restaurants healthy</strong> en France,
              dont 65 % concentres en Ile-de-France, Auvergne-Rhone-Alpes et PACA. Le segment se
              decoupe en quatre familles : chaines healthy (Cojean, Daily, Bagelstein, So Good),
              independants milieu de gamme (ticket 12-18 EUR), restaurants vegetariens premium
              (ticket 22-35 EUR), et dark kitchens specialisees bowls (livraison uniquement, ticket
              15-25 EUR).
            </p>
            <p>
              Le ticket moyen sur place se situe autour de <strong>14 a 18 EUR par couvert</strong>,
              soit 20 % plus eleve qu'un fast food classique. En livraison, le ticket grimpe a
              <strong> 18-24 EUR par commande</strong> grace aux formules bowl + smoothie ou jus
              detox qui poussent a la commande groupee.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Le marche healthy en France a double depuis 2018,
              porte par les 25-44 ans actifs urbains et le tele-travail (besoin de pauses dejeuner
              "saines" rapides). La livraison healthy a depasse 45 % du CA des salad bars en 2024 --
              un changement structurel qui impose de repenser la gestion des marges et le sourcing
              du frais.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Specificites ═════════════ */}
        <section id="specificites" className="mb-16">
          <SectionHeading icon={<Leaf className="w-6 h-6" />} number="2">
            Specificites : food cost 30-35 %, frais coûteux, rotation 24-48h max
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le food cost d'un salad bar ou d'un restaurant healthy doit se situer entre
              <strong> 30 % et 35 %</strong>, soit 5 a 10 points au-dessus d'une pizzeria (22-25 %)
              et plus eleve qu'une brasserie classique (28-32 %). Trois raisons structurelles
              expliquent ce niveau :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Cout produits frais eleve</strong> : avocat 4-7 EUR/kg, saumon 22-26 EUR/kg,
                pousses d'epinard 12-15 EUR/kg, fruits exotiques (mangue, grenade, baies) 8-15 EUR/kg.
                Pas d'equivalent low cost contrairement aux ingredients de pizza ou de pates.
              </li>
              <li>
                <strong>Perte structurelle 8 a 12 %</strong> : les pousses oxydent en 24 h, l'avocat
                vire en 48 h, le saumon cru doit etre detruit a J+1, les fruits coupes en 24 h max.
                Les chutes de legumes ne sont pas toujours requalifiables en sauce ou soupe.
              </li>
              <li>
                <strong>Main d'oeuvre prep matinale chere</strong> : un salad bar tourne avec 4-6 personnes
                et necessite une equipe prep matinale (5h30-10h30) pour preparer bowls et sauces avant
                le rush midi. Le prime cost (food + labor) atteint 65-72 % du CA.
              </li>
            </ul>
            <p className="mt-4">
              La gestion de la perte produits frais est <strong>LE</strong> levier #1 de marge. Un salad
              bar qui passe de 15 % a 9 % de perte recupere mecaniquement 3 a 4 points de food cost,
              soit l'equivalent de toute sa marge nette annuelle dans certains cas.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <KPICard
              icon={<Percent className="w-5 h-5" />}
              label="Food cost cible"
              value="30 - 35 %"
              note="Plus eleve qu'une brasserie classique"
              color="emerald"
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
              label="Perte frais critique"
              value="> 15 %"
              note="Au-dela, marge nette s'effondre"
              color="amber"
            />
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Couts ingredients ═════════════ */}
        <section id="ingredients" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="3">
            Couts ingredients : bases, legumes, proteines, toppings
          </SectionHeading>

          <div className="prose-content">
            <p>
              Maitriser les couts matieres premieres en salad bar exige de connaitre les prix de
              reference par categorie d'ingredient. Voici les fourchettes constatees en France au
              T2 2026 (prix HT grossiste maraicher direct ou Metro / Pomona / Eurochef).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Bases (cereales, feculents)</h3>
            <table className="w-full text-sm border-collapse mb-8">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Ingredient</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix HT / kg</th>
                  <th className="text-left py-2 px-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Quinoa bio</td>
                  <td className="py-2 px-3 text-right font-semibold">6 EUR</td>
                  <td className="py-2 px-3 text-xs">Gonflement x3 cuit, soit 2 EUR/kg cuit</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Riz noir Venere</td>
                  <td className="py-2 px-3 text-right font-semibold">8 EUR</td>
                  <td className="py-2 px-3 text-xs">Premium, signature, Instagram-worthy</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Pates completes</td>
                  <td className="py-2 px-3 text-right font-semibold">4 EUR</td>
                  <td className="py-2 px-3 text-xs">Base salade composee tiede</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Boulgour fin / gros</td>
                  <td className="py-2 px-3 text-right font-semibold">3,50 EUR</td>
                  <td className="py-2 px-3 text-xs">Base taboule, salade mediterraneenne</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Riz vinaigre poke (japonica)</td>
                  <td className="py-2 px-3 text-right font-semibold">4,50 EUR</td>
                  <td className="py-2 px-3 text-xs">Base poke bowl, sac 10 kg</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Patate douce fraiche</td>
                  <td className="py-2 px-3 text-right font-semibold">2,80 EUR</td>
                  <td className="py-2 px-3 text-xs">Cuite au four, base buddha bowl</td>
                </tr>
              </tbody>
            </table>

            <h3 className="font-bold text-mono-100 mb-4 text-lg">Legumes et feuilles</h3>
            <table className="w-full text-sm border-collapse mb-8">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Ingredient</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix HT / kg</th>
                  <th className="text-left py-2 px-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Avocat Hass calibre 18/20</td>
                  <td className="py-2 px-3 text-right font-semibold">4 - 7 EUR</td>
                  <td className="py-2 px-3 text-xs">Volatilite enorme, gestion mercuriale critique</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Tomate cerise grappe</td>
                  <td className="py-2 px-3 text-right font-semibold">5 - 8 EUR</td>
                  <td className="py-2 px-3 text-xs">Saisonnalite forte (3 EUR en aout, 8 EUR en janvier)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Pousses d'epinard</td>
                  <td className="py-2 px-3 text-right font-semibold">12 - 15 EUR</td>
                  <td className="py-2 px-3 text-xs">Perte rapide 24h, oxydation</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Mache premium</td>
                  <td className="py-2 px-3 text-right font-semibold">10 - 14 EUR</td>
                  <td className="py-2 px-3 text-xs">Saison hiver octobre-mars</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Roquette</td>
                  <td className="py-2 px-3 text-right font-semibold">8 - 12 EUR</td>
                  <td className="py-2 px-3 text-xs">Gout marque, faible volume par bowl</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Concombre frais</td>
                  <td className="py-2 px-3 text-right font-semibold">2 - 3,50 EUR</td>
                  <td className="py-2 px-3 text-xs">Eau a 96 %, attention rendement</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Carotte rapee / marinee</td>
                  <td className="py-2 px-3 text-right font-semibold">1,80 - 2,50 EUR</td>
                  <td className="py-2 px-3 text-xs">Bas cout, gros volume base bowl</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Chou rouge / blanc emince</td>
                  <td className="py-2 px-3 text-right font-semibold">1,50 - 2,20 EUR</td>
                  <td className="py-2 px-3 text-xs">Croquant, conservation 4-5 jours</td>
                </tr>
              </tbody>
            </table>

            <h3 className="font-bold text-mono-100 mb-4 text-lg">Proteines</h3>
            <table className="w-full text-sm border-collapse mb-8">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Ingredient</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix HT / kg</th>
                  <th className="text-left py-2 px-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Saumon cru sashimi grade</td>
                  <td className="py-2 px-3 text-right font-semibold">22 - 26 EUR</td>
                  <td className="py-2 px-3 text-xs">Norvege/Ecosse, perte 24h</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Saumon fume tranche</td>
                  <td className="py-2 px-3 text-right font-semibold">25 EUR</td>
                  <td className="py-2 px-3 text-xs">DLC 14 jours, plus stable</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Tofu ferme nature / fume</td>
                  <td className="py-2 px-3 text-right font-semibold">8 EUR</td>
                  <td className="py-2 px-3 text-xs">Alternative vegan, marge forte</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Poulet roti / grille</td>
                  <td className="py-2 px-3 text-right font-semibold">10 EUR</td>
                  <td className="py-2 px-3 text-xs">Best-seller bowls salades</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Thon en boite Albacore</td>
                  <td className="py-2 px-3 text-right font-semibold">12 EUR</td>
                  <td className="py-2 px-3 text-xs">Conserve, marge forte, longue duree</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Oeuf coque / poche</td>
                  <td className="py-2 px-3 text-right font-semibold">0,28 EUR / piece</td>
                  <td className="py-2 px-3 text-xs">Topping vegetarien rentable</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Crevettes cuites decortiquees</td>
                  <td className="py-2 px-3 text-right font-semibold">22 EUR</td>
                  <td className="py-2 px-3 text-xs">Topping premium, calibre 31/40</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Edamame ecosse surgele</td>
                  <td className="py-2 px-3 text-right font-semibold">6 EUR</td>
                  <td className="py-2 px-3 text-xs">Stable, marge forte poke bowls</td>
                </tr>
              </tbody>
            </table>

            <h3 className="font-bold text-mono-100 mb-4 text-lg">Toppings et finitions</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Ingredient</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix HT / kg</th>
                  <th className="text-left py-2 px-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Graines de tournesol / courge / chia</td>
                  <td className="py-2 px-3 text-right font-semibold">12 EUR</td>
                  <td className="py-2 px-3 text-xs">Faible grammage par bowl (5-10 g)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Feta / chevre frais</td>
                  <td className="py-2 px-3 text-right font-semibold">15 EUR</td>
                  <td className="py-2 px-3 text-xs">Premium, supplement payant possible</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Mozzarella di bufala</td>
                  <td className="py-2 px-3 text-right font-semibold">18 EUR</td>
                  <td className="py-2 px-3 text-xs">Italie, perte rapide une fois ouverte</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Fruits secs (cranberries, raisins, noix)</td>
                  <td className="py-2 px-3 text-right font-semibold">18 EUR</td>
                  <td className="py-2 px-3 text-xs">Touche sucree, stable, marge forte</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Mangue fraiche cubes</td>
                  <td className="py-2 px-3 text-right font-semibold">8 - 10 EUR</td>
                  <td className="py-2 px-3 text-xs">Topping poke, perte 24h une fois coupee</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Grenade arille</td>
                  <td className="py-2 px-3 text-right font-semibold">15 EUR</td>
                  <td className="py-2 px-3 text-xs">Topping visuel premium</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Houmous maison / industriel</td>
                  <td className="py-2 px-3 text-right font-semibold">7 EUR</td>
                  <td className="py-2 px-3 text-xs">Sauce / tartinade buddha bowl</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Sauce miso / tahin / vinaigrette</td>
                  <td className="py-2 px-3 text-right font-semibold">5 - 8 EUR</td>
                  <td className="py-2 px-3 text-xs">Maison ideal, 30 ml par bowl</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Trois leviers de negociation</strong> a actionner immediatement avec votre
              grossiste maraicher ou Pomona pour gagner 8 a 15 % sur les couts frais :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Volume hebdomadaire engage : passer d'une commande quotidienne a 3-4 commandes / semaine sur volumes plus gros</li>
              <li>Acceptation produits "calibres restaurateur" (legumes legerement hors normes vente directe consommateur) -- gain 8-12 %</li>
              <li>Paiement comptant ou virement 8 jours vs 30 jours fin de mois -- gain 2-4 %</li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Decomposition poke bowl ═════════════ */}
        <section id="poke-bowl" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="4">
            Decomposition cout : poke bowl saumon en detail
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le poke bowl saumon est le best-seller absolu d'un salad bar healthy. Voici sa
              decomposition precise au gramme pres, basee sur prix grossiste France T2 2026.
              C'est la fiche technique de reference a calibrer dans votre logiciel.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-1 gap-6">

            {/* Poke bowl saumon detaille */}
            <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-mono-100 mb-4 text-lg">Poke bowl saumon classique (taille moyenne)</h3>
              <table className="w-full text-sm border-collapse">
                <tbody className="text-mono-350">
                  <tr>
                    <td className="py-2 px-3 font-medium">Riz vinaigre (100 g cuit, soit 45 g sec a 4,50 EUR/kg)</td>
                    <td className="py-2 px-3 text-right">0,15 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Saumon cru sashimi grade (100 g a 25 EUR/kg)</td>
                    <td className="py-2 px-3 text-right">2,50 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Avocat 1/2 (75 g a 5,50 EUR/kg + perte 15 %)</td>
                    <td className="py-2 px-3 text-right">1,50 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Edamame ecosse (40 g a 6 EUR/kg + cuisson)</td>
                    <td className="py-2 px-3 text-right">0,40 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Carotte marinee maison (30 g)</td>
                    <td className="py-2 px-3 text-right">0,20 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Mangue fraiche cubes (30 g)</td>
                    <td className="py-2 px-3 text-right">0,30 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Sauce miso maison (30 ml)</td>
                    <td className="py-2 px-3 text-right">0,30 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Graines sesame noir / blanc (5 g)</td>
                    <td className="py-2 px-3 text-right">0,10 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 italic">+ Allocation perte produits frais 10 %</td>
                    <td className="py-2 px-3 text-right">0,55 EUR</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Bowl carton + couvercle + couverts (livraison)</td>
                    <td className="py-2 px-3 text-right">0,55 EUR</td>
                  </tr>
                  <tr className="border-t-2 border-mono-900 bg-emerald-50">
                    <td className="py-3 px-3 font-bold text-mono-100">Total cout matieres (livraison)</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-900">6,55 EUR</td>
                  </tr>
                  <tr className="bg-mono-1000">
                    <td className="py-3 px-3 font-bold text-mono-100">Cout matieres sur place (sans packaging)</td>
                    <td className="py-3 px-3 text-right font-bold text-mono-100">5,45 EUR</td>
                  </tr>
                  <tr className="bg-emerald-50">
                    <td className="py-3 px-3 font-bold text-mono-100">Prix de vente sur place</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-900">14 - 16 EUR</td>
                  </tr>
                  <tr className="bg-emerald-50">
                    <td className="py-3 px-3 font-bold text-mono-100">Food cost sur place</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-900">34 - 39 %</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Le poke bowl saumon</strong> a un food cost qui flirte avec la limite haute
              cible (34-39 %) parce que le saumon (2,50 EUR) et l'avocat (1,50 EUR) representent
              a eux deux <strong>73 % du cout matieres</strong>. C'est sur ces deux postes que se
              joue la marge. Une augmentation de 20 % du prix avocat (+0,30 EUR) fait passer le
              food cost de 36 % a 38 % -- a la limite du seuil critique.
            </p>
            <Callout type="warning">
              <strong>Astuce de pro :</strong> proposer une version "veggie poke" avec tofu ferme
              (8 EUR/kg) en remplacement du saumon (25 EUR/kg). Le cout matieres tombe a 3,85 EUR
              pour un prix de vente identique (14 EUR), soit un food cost de 27 % au lieu de 38 %.
              Pousser cette option en livraison pour absorber la commission plateforme.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : 8 bowls types ═════════════ */}
        <section id="8-bowls" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="5">
            8 bowls healthy types et leurs marges
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tableau de reference : 8 bowls et salades healthy typiques couvrant les formats les
              plus vendus en France. Couts matieres bases sur prix grossiste maraicher direct
              T2 2026, prix de vente moyens constates hors Paris ultra-centre et zones premium.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Bowl / Salade</th>
                  <th className="text-center py-3 px-4 font-semibold">Cout matieres</th>
                  <th className="text-center py-3 px-4 font-semibold">Prix sur place</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { name: 'Poke bowl saumon classique', cm: '5,45 EUR', pv: '15,00 EUR', fc: '36 %', mb: '9,55 EUR / 64 %' },
                  { name: 'Poke bowl thon spicy', cm: '5,80 EUR', pv: '15,50 EUR', fc: '37 %', mb: '9,70 EUR / 63 %' },
                  { name: 'Veggie poke bowl tofu', cm: '3,85 EUR', pv: '14,00 EUR', fc: '28 %', mb: '10,15 EUR / 72 %' },
                  { name: 'Buddha bowl quinoa-patate douce', cm: '3,90 EUR', pv: '13,50 EUR', fc: '29 %', mb: '9,60 EUR / 71 %' },
                  { name: 'Salade Cesar poulet', cm: '3,60 EUR', pv: '12,50 EUR', fc: '29 %', mb: '8,90 EUR / 71 %' },
                  { name: 'Salade chevre chaud miel', cm: '3,20 EUR', pv: '11,80 EUR', fc: '27 %', mb: '8,60 EUR / 73 %' },
                  { name: 'Bowl smoked salmon avocat', cm: '5,90 EUR', pv: '16,50 EUR', fc: '36 %', mb: '10,60 EUR / 64 %' },
                  { name: 'Bowl falafel houmous', cm: '3,40 EUR', pv: '13,00 EUR', fc: '26 %', mb: '9,60 EUR / 74 %' },
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
              Quelques observations cles :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Les poke bowls saumon / thon</strong> sont les locomotives commerciales
                (60 % des ventes en general) mais avec le food cost le plus eleve (36-37 %). A
                vendre absolument plus de 15 EUR pour preserver la marge.
              </li>
              <li>
                <strong>Les versions vegetariennes (tofu, falafel, buddha bowl)</strong> sont les
                "vaches a lait" : food cost contenu (26-29 %), produits stables (faible perte),
                marges brutes 71-74 %. A pousser activement en menu signature.
              </li>
              <li>
                <strong>Les salades classiques (Cesar, chevre chaud)</strong> sont des valeurs surs
                pour la clientele moins aventureuse : food cost faible (27-29 %), execution simple,
                rentabilite reguliere.
              </li>
              <li>
                <strong>Le bowl falafel houmous</strong> est le champion absolu : food cost a 26 %
                seulement, marge brute 74 %, ingredients stables (houmous, falafel surgeles
                reheauffes). A mettre en avant dans les formules midi.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Operations ═════════════ */}
        <section id="operations" className="mb-16">
          <SectionHeading icon={<Clock className="w-6 h-6" />} number="6">
            Operations : prep matinale centralisee, presentation Instagram-worthy
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le salad bar a deux specificites operationnelles uniques qui conditionnent sa
              rentabilite : la <strong>preparation centralisee matinale</strong> (5h30-10h30) et
              la <strong>presentation visuelle</strong> (90 % des bowls finissent sur Instagram).
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Prep matinale : la base de la productivite midi</h3>
            <p>
              Entre 5h30 et 10h30, l'equipe prep (1-2 personnes selon volume) prepare en avance :
              cuisson des cereales (riz, quinoa, boulgour), lavage et essorage des feuilles,
              decoupe des legumes en grosses quantites, preparation des sauces maison, cuisson des
              proteines (poulet, oeufs, tofu marinade), assemblage des "bases" bowls. Le rush
              midi (11h30-14h30) consiste alors juste a assembler les bowls dans des bowls a partir
              des bacs gastro prepares. Productivite cible : 80-120 bowls par service de 3h.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Presentation : l'effet Instagram</h3>
            <p>
              Un bowl healthy se vend autant pour son visuel que pour son gout. La disposition des
              ingredients en "secteurs" colores (vert pousses, rouge tomate, jaune mangue, orange
              carotte, blanc proteine, noir graines sesame), les toppings finitions (graines, fleurs
              comestibles, herbes), et le bol blanc ou bois clair contribuent a un visuel qui
              genere des stories et posts Instagram. <strong>30 a 40 % de la frequentation</strong>
              d'un salad bar urbain provient du bouche-a-oreille social. Investir dans la
              presentation, c'est investir dans le marketing.
            </p>

            <div className="mt-6 grid sm:grid-cols-1 gap-4">
              <StrategieCard
                number={1}
                title="Equipe prep 5h30-10h30 dimensionnee selon volume"
                desc="50 bowls/jour = 1 personne prep, 100-150 bowls/jour = 2 personnes prep, 200+ bowls/jour = 3 personnes prep + chef cuisinier qualifie. Le bon dimensionnement evite le retard service midi et la sur-staffing inutile."
              />
              <StrategieCard
                number={2}
                title="Bacs gastro pre-portionnes et etiquetes"
                desc="Pre-portionner les ingredients par portion bowl dans des bacs gastro pour accelerer le service midi. Etiquetage HACCP date + heure prep + DLC. Reduit le temps assemblage de 3 min a 50 sec par bowl."
              />
              <StrategieCard
                number={3}
                title="Photographier chaque bowl signature en haute qualite"
                desc="Une session photo professionnelle par trimestre pour les 12-15 bowls signatures. Diffusion Instagram, site web, plateformes livraison. Augmente conversion plateformes de 15-25 %."
              />
              <StrategieCard
                number={4}
                title="Toppings premium en supplement payant (+1,50-2,50 EUR)"
                desc="Avocat extra, saumon supplementaire, oeuf poche, fromage premium en supplement +1,50-2,50 EUR. Augmente le ticket moyen de 0,80-1,20 EUR sans complexifier la prep. 25-30 % des clients prennent un supplement."
              />
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Avocat ═════════════ */}
        <section id="avocat" className="mb-16">
          <SectionHeading icon={<Apple className="w-6 h-6" />} number="7">
            Avocat : la volatilite cachee qui plombe votre marge
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'avocat est l'ingredient le plus problematique en salad bar. Sa courbe de prix
              annuelle oscille brutalement entre <strong>3 EUR/kg</strong> en pleine saison
              Mexique (octobre-fevrier) et <strong>8 EUR/kg</strong> en intersaison (avril-juin).
              C'est une variation de <strong>166 %</strong> qui se repercute directement sur la
              marge de tous les bowls qui en contiennent (et il y en a beaucoup).
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Impact reel sur la marge</h3>
            <p>
              Un poke bowl avec 1/2 avocat (75 g) :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>En saison (avocat 4 EUR/kg) : avocat coute 0,30 EUR -- food cost bowl 33 %</li>
              <li>Hors saison (avocat 7 EUR/kg) : avocat coute 0,52 EUR -- food cost bowl 35 %</li>
              <li>Pic crise (avocat 9 EUR/kg en cas secheresse Mexique) : avocat coute 0,68 EUR -- food cost bowl 36 %</li>
            </ul>
            <p className="mt-4">
              Soit jusqu'a <strong>3 points de food cost</strong> de variation sur un meme bowl
              selon la saison. Sur 200 bowls/jour avec avocat sur 365 jours, c'est 4 200 a 6 800 EUR
              de marge brute par an qui dependent de votre gestion de la mercuriale avocat.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">3 strategies pour neutraliser la volatilite avocat</h3>

            <div className="space-y-4 mt-8">
              <StrategieCard
                number={1}
                title="Contrat de prix fixe annuel avec un grossiste"
                desc="Negocier un prix fixe annuel a 5,50 EUR/kg sur un volume minimum garanti (ex : 50 kg/semaine). Vous payez plus en saison basse mais protege en saison haute. Lisser la marge annuelle. Possible avec Pomona ou un importateur direct."
              />
              <StrategieCard
                number={2}
                title="Avocat surgele en demi pour sauces et tartinades"
                desc="Le surgele coute 6-7 EUR/kg toute l'annee (stable) et convient parfaitement pour guacamole, sauce avocat, tartine. Reserver l'avocat frais aux bowls visibles. Mix 60 % frais / 40 % surgele permet de stabiliser le cout moyen."
              />
              <StrategieCard
                number={3}
                title="Menu adaptatif : ajuster les portions selon saison"
                desc="En saison basse (avocat 4 EUR/kg) : bowls avec 1/2 avocat genereux. En saison haute (avocat 7 EUR/kg) : passer a 1/3 avocat. Le client ne remarque pas la difference. Gain 0,20 EUR par bowl, soit 6 000 EUR/an sur 200 bowls/jour x 6 mois."
              />
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Optimisation ═════════════ */}
        <section id="optimisation" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="8">
            Optimisation : menu signature, abonnement clients, livraison
          </SectionHeading>

          <div className="prose-content">
            <p>
              Trois leviers d'optimisation specifiques au salad bar pour augmenter le ticket
              moyen, fideliser la clientele et stabiliser la marge.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <StrategieCard
              number={1}
              title="Menu signature 8-10 items + 2 saisonniers"
              desc="Limiter la carte a 8-10 bowls signatures + 2 propositions saisonnieres trimestrielles. Reduit la complexite prep, simplifie le sourcing, accelere le service midi. Permet aussi d'avoir des fiches techniques figees et une marge stable. Trop de choix tue la marge."
            />
            <StrategieCard
              number={2}
              title="Abonnement mensuel 12-15 bowls = 159 EUR"
              desc="Lancer un abonnement mensuel : 12 bowls par mois pour 159 EUR (au lieu de 180 EUR a l'unite). Le client paye d'avance, vous securisez le CA recurrent. Cibler la clientele bureau (5 j/sem). Marge brute conservee a 65 %. 50-80 abonnes suffisent pour stabiliser 8 000-13 000 EUR/mois."
            />
            <StrategieCard
              number={3}
              title="Click & collect avec -2 EUR de reduction"
              desc="Offrir -2 EUR sur le bowl signature si retrait en restaurant. Zero commission plateforme, zero packaging livraison. Marge brute preservee a 70 %. Cibler 25-30 % du CA en click & collect en 6 mois."
            />
            <StrategieCard
              number={4}
              title="Livraison propre sur zone restreinte (3-4 km)"
              desc="Recruter 1-2 livreurs en CDI temps partiel ou utiliser un partenaire local. Cout 1 200-1 800 EUR/mois pour 30-50 livraisons/jour. Rentable au-dela de 1 200 commandes/mois. Marge brute preservee a 65-70 %. Bonus : maitrise de l'experience client."
            />
          </div>

          <div className="prose-content mt-8">
            <Callout type="info">
              <strong>Bonne pratique sourcing :</strong> certains salad bars premium passent en direct
              avec un maraicher bio local (en circuit court) pour les feuilles, legumes et herbes
              fraiches. Gain de 15-20 % vs Pomona, qualite superieure, argument marketing fort
              "produits locaux". Necessite un volume hebdomadaire engage et une logistique de
              reception bi-quotidienne.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 9 : KPI ═════════════ */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="9">
            Les KPI a suivre en salad bar healthy
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un salad bar bien gere pilote 6 indicateurs au quotidien. Sans ces KPI, vous detectez
              les problemes 3-6 mois apres leur apparition, quand la marge nette commence a fondre.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Percent className="w-5 h-5" />, title: '1. Food cost matieres premieres', desc: 'Cible 30-35 %. Au-dela, alerte immediate. En dessous (rare), suspecter portions chiches ou prix trop eleves.' },
              { icon: <Leaf className="w-5 h-5" />, title: '2. Perte produits frais par categorie', desc: 'Tracker feuilles, proteines crues, fruits coupes separement. Cible globale < 12 %. Alerte si > 15 %.' },
              { icon: <Clock className="w-5 h-5" />, title: '3. Rotation produits frais (jours)', desc: 'Stock frais / consommation moyenne. Cible 1-1,5 jour max. Au-dela, sourcing trop ambitieux ou menu mal calibre.' },
              { icon: <DollarSign className="w-5 h-5" />, title: '4. Ticket moyen', desc: 'Sur place : 14-18 EUR par couvert. En livraison : 18-24 EUR par commande. Suivre par canal.' },
              { icon: <Truck className="w-5 h-5" />, title: '5. Ratio livraison vs sur place', desc: 'Maintenir sous 50 % pour preserver la marge nette. Alerte si > 60 %. Pousser click & collect.' },
              { icon: <Apple className="w-5 h-5" />, title: '6. Mix bowls signatures vs formules', desc: 'Suivre la part des bowls premium dans le mix. Cible 55 % en signatures. Pousser supplements payants.' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-3">
                  {kpi.icon}
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{kpi.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{kpi.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION 10 : Cas concret Paris ═════════════ */}
        <section id="cas-paris" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="10">
            Cas concret : salad bar Paris, 5 % a 18 % en 10 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Salad bar independant Paris 9eme, 32 couverts + comptoir take-away. Reprise en juillet
              2025 par Marine D., 31 ans, ancienne directrice de boutique mode. CA annuel constate
              a la reprise : 380 000 EUR, marge nette 5 %.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Diagnostic initial (mois 1)</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Food cost reel : 42 % (vs cible 33 %). Perte produits frais 17 % (vs cible 8-12 %).</li>
              <li>Ratio livraison : 68 % du CA via Uber Eats + Deliveroo. Commission moyenne 28 %.</li>
              <li>Sourcing : Metro uniquement, 5 livraisons/semaine, pas de grossiste maraicher direct.</li>
              <li>Carte sur-etendue : 28 bowls + 18 salades + 14 smoothies. Equipe prep depassee.</li>
              <li>Aucun suivi temps reel : factures saisies a la main 1 fois/mois.</li>
              <li>Packaging livraison : 1,05 EUR par commande, bowls carton premium non negocies.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Plan d'action en 4 phases</h3>
            <div className="space-y-4 mt-6">
              <PhaseCard
                phase="Phase 1 (mois 1-2)"
                title="Maitrise de la perte produits frais"
                actions={[
                  'Mise en place de fiches techniques precises pour les 28 bowls via RestauMargin',
                  'Etiquetage HACCP systematique des prep avec date + heure + DLC',
                  'Reduction carte a 12 bowls signatures + 6 salades + 4 smoothies + 2 saisonniers',
                  'Resultat : perte produits frais passe de 17 % a 10 %, food cost de 42 % a 36 %',
                ]}
              />
              <PhaseCard
                phase="Phase 2 (mois 3-4)"
                title="Reorganisation du sourcing"
                actions={[
                  'Negociation grossiste maraicher direct Rungis (-12 % vs Metro sur feuilles/legumes)',
                  'Passage en JAT 4 livraisons/semaine sur volumes calibres',
                  'Scan factures OCR via RestauMargin (gain 2h/semaine)',
                  'Resultat : food cost passe de 36 % a 33 %',
                ]}
              />
              <PhaseCard
                phase="Phase 3 (mois 5-7)"
                title="Strategie multi-canal et abonnement"
                actions={[
                  'Lancement click & collect via site web RestauMargin (-2 EUR)',
                  'Prix differencie : +15 % sur Uber Eats / Deliveroo',
                  'Lancement abonnement mensuel 12 bowls 159 EUR -- 68 abonnes en 3 mois',
                  'Resultat : ratio livraison plateforme tombe de 68 % a 42 %',
                ]}
              />
              <PhaseCard
                phase="Phase 4 (mois 8-10)"
                title="Pilotage en temps reel"
                actions={[
                  'Tableau de bord RestauMargin verifie 3x/semaine',
                  'Alertes prix avocat / saumon / pousses activees',
                  'Negociation packaging : -0,30 EUR par commande livraison',
                  'Resultat final : marge nette 18 %',
                ]}
              />
            </div>

            <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-emerald-900 text-lg">Resultats apres 10 mois</h3>
              </div>
              <ul className="space-y-2 text-emerald-800 text-sm">
                <li><strong>CA annuel :</strong> 380 000 EUR -- 470 000 EUR (+24 %)</li>
                <li><strong>Food cost :</strong> 42 % -- 33 %</li>
                <li><strong>Perte produits frais :</strong> 17 % -- 9 %</li>
                <li><strong>Marge nette :</strong> 5 % -- 18 % (soit 19 000 EUR -- 84 600 EUR)</li>
                <li><strong>Ratio livraison plateforme :</strong> 68 % -- 42 %</li>
                <li><strong>Click & collect :</strong> 0 % -- 24 % du CA</li>
                <li><strong>Abonnement mensuel :</strong> 0 -- 68 abonnes (10 800 EUR/mois recurrent)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 11 : Logiciel RestauMargin ═════════════ */}
        <section id="logiciel" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="11">
            Comment RestauMargin automatise tout
          </SectionHeading>

          <div className="prose-content">
            <p>
              RestauMargin est concu pour la realite operationnelle d'un salad bar healthy :
              produits frais chers, perte structurelle, multi-canal, pression sur les marges. Voici
              les 6 modules cles qui vous font gagner 10 a 18 heures par mois et 5 a 10 points de
              marge nette.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Salad className="w-5 h-5" />, title: 'Fiches techniques bowls', desc: 'Creez vos recettes avec grammages precis (base, feuilles, proteines, toppings, sauces). Food cost calcule automatiquement par bowl et par formule.' },
              { icon: <Leaf className="w-5 h-5" />, title: 'Suivi perte produits frais 24-48h', desc: 'Etiquetage des prep, alerte H-6 avant DLC, requalification automatique (legumes oxydes -- soupes du jour). Reduction perte de 30 a 50 %.' },
              { icon: <AlertTriangle className="w-5 h-5" />, title: 'Alertes prix grossistes', desc: 'Recevez une notification des qu\'un prix avocat, saumon ou pousses devie de + de 5 %. Renegociez avant que la marge soit attaquee.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Dashboard healthy', desc: '6 KPI cles affiches en temps reel : food cost, perte frais, rotation, ticket moyen, ratio livraison, mix signatures.' },
              { icon: <Lightbulb className="w-5 h-5" />, title: 'Scan factures OCR grossistes', desc: 'Photographiez vos factures Metro, Pomona, maraicher direct. Les prix produits frais se mettent a jour automatiquement.' },
              { icon: <Users className="w-5 h-5" />, title: 'Click & collect + abonnement', desc: 'Site web de commande clef en main inclus + gestion abonnements mensuels. Zero commission. Tablette comptoir compatible mode kiosk.' },
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              Plus de 35 salad bars et restaurants healthy en France utilisent deja RestauMargin
              pour piloter leur rentabilite. Gain moyen constate : <strong>6,8 points de marge brute
              en 6 mois</strong>, principalement grace au suivi perte produits frais et aux alertes
              prix grossistes. Pour aller plus loin, lisez notre guide complet sur <Link to="/blog/reduire-food-cost" className="text-emerald-700 underline hover:text-emerald-800">la reduction du food cost en restauration</Link>,
              notre article sur <Link to="/blog/rotation-stocks-restaurant" className="text-emerald-700 underline hover:text-emerald-800">la rotation des stocks restaurant</Link> ou
              notre analyse sur <Link to="/blog/livraison-restaurant-rentabilite" className="text-emerald-700 underline hover:text-emerald-800">la rentabilite reelle de la livraison</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes salad bar healthy</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ═════════════ CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Piloter la marge de votre salad bar avec RestauMargin
            </h2>
            <p className="text-emerald-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Food cost, perte produits frais, prix multi-canaux, alertes grossistes, KPI temps reel :
              tout ce qu'il faut pour garder une marge nette superieure a 15 %.
            </p>
            <p className="text-emerald-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> &mdash; essai gratuit 7 jours, sans engagement, sans carte bancaire.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-full hover:bg-emerald-50 transition-colors text-lg shadow-lg"
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
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-emerald-700 transition-colors">Reduire le food cost en restaurant</h3>
              <p className="text-xs text-mono-500">10 strategies efficaces pour optimiser vos couts matieres.</p>
            </Link>
            <Link to="/blog/rotation-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-emerald-700 transition-colors">Rotation des stocks restaurant</h3>
              <p className="text-xs text-mono-500">Methodes FIFO, calculs rotation, KPI a suivre.</p>
            </Link>
            <Link to="/blog/livraison-restaurant-rentabilite" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-emerald-700 transition-colors">Livraison restaurant : rentabilite reelle</h3>
              <p className="text-xs text-mono-500">Commissions, marges, strategies multi-canal.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-emerald-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-emerald-700 transition-colors">Essai gratuit 7 jours</h3>
              <p className="text-xs text-mono-500">Pilotez votre salad bar sans carte bancaire requise.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* -- Footer -- */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">
            La plateforme de gestion de marge pour les restaurateurs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-mono-700">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions legales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialite</Link>
          </div>
          <p className="mt-6 text-xs text-mono-700">
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits reserves.
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
      <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-mono-100">
        <span className="text-emerald-600 mr-2">{number}.</span>
        {children}
      </h2>
    </div>
  );
}

function KPICard({ icon, label, value, note, color }: {
  icon: React.ReactNode; label: string; value: string; note: string; color: 'emerald' | 'teal' | 'amber';
}) {
  const colors: Record<string, { bg: string; badge: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-900' },
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
      <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
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
      <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">{phase}</div>
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
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-emerald-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
