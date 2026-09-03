import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, DollarSign, Target, BookOpen, Lightbulb, Users, Zap, Sparkles, Scale, XCircle, Star, Quote, Building2, Package } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Comparatif SEO — "RestauMargin : la meilleure alternative à COS Kitchen"
   Mot-clé principal : alternative cos kitchen
   Mots-clés secondaires : cos kitchen avis, cos kitchen vs restaumargin, cos kitchen gratuit
   Sources verifiees le 03/09/2026 : coskitchen.fr (accueil + /tarifs)
   ~2 700 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Qu'est-ce que COS Kitchen ?",
    answer: "COS Kitchen est une plateforme en ligne francaise qui calcule le food cost, la marge brute et le prix de vente conseille de chaque plat. Elle revendique plus de 2 500 restaurateurs utilisateurs et met en avant un positionnement freemium : le calculateur de base, les fiches techniques (limitees a 10) et un menu complet restent gratuits a vie.",
  },
  {
    question: "COS Kitchen est-il vraiment gratuit ?",
    answer: "Le plan Decouverte est effectivement gratuit sans limite de temps, mais il est limite a 10 fiches techniques et 1 menu avec resultats complets. Pour des fiches et menus illimites, l'export PDF/Excel et l'optimisation par IA, il faut passer au plan Essentiel (29€ HT/mois). Le suivi des fournisseurs et les alertes de hausse de prix ne sont disponibles qu'au plan Pro (59€ HT/mois).",
  },
  {
    question: "Quelle est la difference entre COS Kitchen et RestauMargin ?",
    answer: "COS Kitchen est concu comme un calculateur de food cost, avec une montee en gamme progressive vers le suivi fournisseurs. RestauMargin est une plateforme operationnelle complete des l'entree : food cost, fiches techniques illimitees, mercuriale fournisseurs avec alertes de prix, gestion de stock, menu engineering, HACCP digital et 19 actions IA sont tous inclus des le plan Pro a 29€/mois, sans palier supplementaire a payer pour le suivi fournisseurs.",
  },
  {
    question: "RestauMargin propose-t-il un plan gratuit comme COS Kitchen ?",
    answer: "Non, RestauMargin ne propose pas de plan gratuit permanent : nous offrons un essai gratuit de 7 jours, sans carte bancaire, avec acces a l'integralite des fonctionnalites (pas de version bridee). Si votre besoin se limite a calculer occasionnellement le food cost de quelques plats, le plan Decouverte gratuit de COS Kitchen (10 fiches, 1 menu) peut suffire. Si vous geriez une carte complete au quotidien, l'essai RestauMargin vous montrera l'ecart des le premier jour.",
  },
  {
    question: "COS Kitchen gere-t-il les stocks et les fournisseurs ?",
    answer: "COS Kitchen propose un import des bons de livraison par email et des alertes de hausse de prix fournisseur, mais uniquement au plan Pro (59€ HT/mois). Aucune gestion de stock (inventaire, alertes de rupture, valorisation) n'est mentionnee sur leur site. RestauMargin inclut la mercuriale fournisseurs avec historique de prix et le scan OCR de factures des le plan Pro a 29€/mois, plus une gestion de stock complete.",
  },
  {
    question: "Puis-je migrer mes donnees de COS Kitchen vers RestauMargin ?",
    answer: "Les deux outils stockent le meme type de donnees de base (ingredients, recettes, fiches techniques), ce qui facilite une migration manuelle ou via export CSV/Excel (fonction disponible sur les deux plateformes a partir de leurs plans payants). Notre equipe support peut vous accompagner pour reimporter vos fiches techniques existantes lors de votre essai gratuit.",
  },
  {
    question: "Quel est le meilleur outil pour un groupe de plusieurs restaurants ?",
    answer: "COS Kitchen ne mentionne aucune fonctionnalite multi-etablissement sur son site public : chaque compte semble concu pour un seul restaurant. RestauMargin gere nativement le multi-restaurant avec une vue consolidee des marges (formule Business, 79€/mois), ce qui en fait le choix par defaut pour un groupe de 2 etablissements ou plus.",
  },
  {
    question: "COS Kitchen propose-t-il de l'intelligence artificielle ?",
    answer: "Oui, COS Kitchen mentionne une 'optimisation de cout par IA' et des suggestions d'ingredients alternatifs des le plan Essentiel (29€ HT/mois). RestauMargin va plus loin avec 19 actions IA couvrant les suggestions de recettes, l'optimisation des marges, la detection d'anomalies de prix et la commande vocale, disponibles des le plan Pro.",
  },
  {
    question: "Quel outil choisir pour debuter a moindre cout ?",
    answer: "Si votre restaurant ne gere qu'une poignee de plats et que vous voulez tester le concept de calcul de food cost sans depenser un centime, le plan Decouverte gratuit de COS Kitchen (10 fiches techniques) est un bon point d'entree. Des que votre carte depasse 10 plats ou que vous voulez suivre vos fournisseurs, l'essai gratuit de 7 jours de RestauMargin vous donne acces a une solution complete sans palier a franchir.",
  },
  {
    question: "RestauMargin est-il plus cher que COS Kitchen sur un an ?",
    answer: "Sur le premier palier payant, les deux outils sont proches : COS Kitchen Essentiel facture 29€ HT/mois (348€ HT/an) et RestauMargin Pro facture 29€/mois (348€/an), pour un perimetre de fonctionnalites plus large chez RestauMargin (mercuriale et alertes fournisseurs incluses, non disponibles avant le palier Pro a 59€ HT/mois chez COS Kitchen). A fonctionnalites egales, RestauMargin Pro est donc moins cher que COS Kitchen Pro (59€ HT/mois, soit 708€ HT/an).",
  },
];

export default function AlternativeCosKitchen() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Alternative COS Kitchen : RestauMargin, la gestion complète | 2026"
        description="COS Kitchen calcule votre food cost. RestauMargin ajoute stock, mercuriale avec alertes, IA et multi-restaurant dès 29€/mois. Comparatif détaillé, prix et cas d'usage."
        path="/alternative-cos-kitchen"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Comparatifs', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Alternative COS Kitchen', url: 'https://www.restaumargin.fr/alternative-cos-kitchen' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'RestauMargin : la meilleure alternative à COS Kitchen en 2026',
            description: "Comparatif detaille entre RestauMargin (29 EUR/mois, plateforme operationnelle complete) et COS Kitchen (freemium, 0 a 59 EUR HT/mois, calculateur food cost). Tableau 15 criteres, cas d'usage, FAQ.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-09-03',
            dateModified: '2026-09-03',
            wordCount: 2700,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/alternative-cos-kitchen' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Comparatif COS Kitchen vs RestauMargin',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                item: {
                  '@type': 'SoftwareApplication',
                  name: 'RestauMargin',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web, iOS, Android (PWA)',
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
                  description: "Gestion des marges, food cost, fiches techniques, mercuriale fournisseurs et IA d'optimisation pour restaurateurs independants et groupes.",
                },
              },
              {
                '@type': 'ListItem',
                position: 2,
                item: {
                  '@type': 'SoftwareApplication',
                  name: 'COS Kitchen',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'EUR',
                    priceSpecification: {
                      '@type': 'UnitPriceSpecification',
                      price: '0',
                      priceCurrency: 'EUR',
                      unitText: 'MONTH',
                    },
                  },
                  description: "Calculateur de food cost et de marge en ligne, plans Decouverte gratuit, Essentiel (29 EUR HT/mois) et Pro (59 EUR HT/mois).",
                },
              },
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
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Comparatifs</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Alternative COS Kitchen</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Comparatif"
        readTime="11 min"
        date="Septembre 2026"
        title="RestauMargin : la meilleure alternative à COS Kitchen en 2026"
        accentWord="alternative à COS Kitchen"
        subtitle="COS Kitchen a seduit plus de 2 500 restaurateurs avec un calculateur de food cost gratuit. Voici un comparatif honnete pour savoir si son offre freemium suffit a votre restaurant, ou si une plateforme operationnelle complete comme RestauMargin est le meilleur choix."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-09-03" readTime="11 min" variant="header" />

        {/* ── Encadre TL;DR (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">En 30 secondes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            COS Kitchen vs RestauMargin : la réponse rapide
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3 text-sm sm:text-base">
            <p className="leading-relaxed">
              <strong className="text-white">COS Kitchen</strong> est un <strong>calculateur de food cost</strong> freemium : gratuit jusqu'a 10 fiches et 1 menu, puis 29€ HT/mois (Essentiel) et 59€ HT/mois (Pro) pour debloquer le suivi des fournisseurs.
            </p>
            <p className="leading-relaxed">
              <strong className="text-white">RestauMargin</strong> est une <strong>plateforme operationnelle complete</strong> a 29€/mois : food cost, fiches illimitees, stock, mercuriale fournisseurs avec alertes, menu engineering, HACCP et 19 actions IA, tout inclus des l'entree.
            </p>
            <p className="leading-relaxed pt-2 border-t border-white/20">
              <strong className="text-white">Verdict :</strong> pour un simple calcul ponctuel, le plan gratuit COS Kitchen suffit. Pour piloter une carte au quotidien avec fournisseurs et stock, RestauMargin couvre plus large pour un prix d'entree identique.
            </p>
          </div>
        </div>

        {/* ── Table des matieres ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#pourquoi', label: "Pourquoi comparer COS Kitchen et RestauMargin ?" },
              { href: '#coskitchen', label: "Vue d'ensemble : COS Kitchen en 2026" },
              { href: '#restaumargin', label: "Vue d'ensemble : RestauMargin en 2026" },
              { href: '#tableau', label: 'Tableau comparatif détaillé (15 critères)' },
              { href: '#cas-usage', label: "Quel outil pour quel type de restaurateur ?" },
              { href: '#temoignages', label: 'Témoignages de restaurateurs' },
              { href: '#prix', label: 'Comparaison de prix sur 12 mois' },
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

        {/* ═════════════ SECTION 1 : Pourquoi comparer ═════════════ */}
        <section id="pourquoi" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Pourquoi comparer COS Kitchen et RestauMargin ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              COS Kitchen s'est fait une place dans le paysage francais de la gestion de food cost avec
              une promesse simple : un calculateur gratuit, sans engagement, pour connaitre le cout et
              la marge de chaque plat. Plus de 2 500 restaurateurs l'utilisent selon leur communication
              officielle. C'est une porte d'entree accessible pour qui n'a jamais mis un chiffre precis
              sur ses fiches techniques.
            </p>
            <p>
              Mais un calculateur gratuit et une plateforme de gestion operationnelle repondent a des
              besoins differents. Trois questions reviennent chez les restaurateurs qui hesitent entre
              les deux :
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 mt-8">
            <ReasonCard
              icon={<Package className="w-6 h-6" />}
              title="Les fournisseurs et le stock"
              desc="Le plan gratuit et le plan Essentiel de COS Kitchen ne suivent pas vos fournisseurs. Il faut passer au plan Pro (59€ HT/mois) pour les alertes de prix, et aucune gestion de stock n'est mentionnee."
            />
            <ReasonCard
              icon={<XCircle className="w-6 h-6" />}
              title="Les limites du plan gratuit"
              desc="10 fiches techniques et 1 menu complet, c'est suffisant pour tester mais pas pour gerer une carte de 20 a 40 plats au quotidien avec entrees, plats, desserts et boissons."
            />
            <ReasonCard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="Le multi-restaurant"
              desc="Aucune fonctionnalite de gestion multi-etablissement n'apparait sur le site de COS Kitchen. Pour un groupe de plusieurs restaurants, c'est un manque structurant."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              Soyons justes : ces limites ne font pas de COS Kitchen un mauvais outil. Pour un
              restaurateur qui veut juste verifier le food cost de trois nouveaux plats avant de les
              mettre a la carte, le plan gratuit suffit largement. Le probleme apparait quand la carte
              grandit, quand les fournisseurs changent leurs prix chaque mois, ou quand un deuxieme
              etablissement ouvre.
            </p>
            <p>
              C'est cette difference de perimetre qui explique pourquoi nous nous presentons comme une
              <strong> alternative a COS Kitchen</strong> pour les restaurateurs qui ont depasse le stade
              du simple calcul ponctuel. Voyons les deux approches en detail.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Vue d'ensemble COS Kitchen ═════════════ */}
        <section id="coskitchen" className="mb-16">
          <SectionHeading icon={<Building2 className="w-6 h-6" />} number="2">
            Vue d'ensemble : COS Kitchen en 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              COS Kitchen est positionne comme un <strong>calculateur de food cost et de marge en
              ligne</strong>, avec une montee en gamme progressive vers le suivi fournisseurs. Le produit
              met en avant sa simplicite ("configurez en 2 minutes") et un modele freemium : les outils
              essentiels restent gratuits a vie, les fonctions avancees sont reservees aux plans
              Essentiel et Pro.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Points forts de COS Kitchen</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-emerald-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Plan Decouverte gratuit a vie, sans carte bancaire (10 fiches, 1 menu)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Interface simple, calcul de food cost instantane</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Benchmarks sectoriels integres au plan gratuit</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Import de bons de livraison par email (plan Pro)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Communaute large revendiquee : 2 500+ restaurateurs</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Modeles gratuits telechargeables (fiches, tableaux)</span></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Limites de COS Kitchen</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-amber-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Plan gratuit limite a 10 fiches techniques et 1 menu</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Suivi fournisseurs et alertes prix reserves au plan Pro (59€ HT/mois)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Aucune gestion de stock ou d'inventaire mentionnee</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de multi-restaurant identifie sur le site</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de menu engineering (matrice Boston) ni de HACCP digital</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas d'application mobile PWA ni de mode kiosk</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>A noter :</strong> les informations ci-dessus sont issues du site public
            coskitchen.fr (accueil et page tarifs) consulte le 3 septembre 2026. Si une fonctionnalite
            existe sans etre publiee sur leur site, elle n'a pas pu etre integree a ce comparatif.
          </Callout>
        </section>

        {/* ═════════════ SECTION 3 : Vue d'ensemble RestauMargin ═════════════ */}
        <section id="restaumargin" className="mb-16">
          <SectionHeading icon={<ChefHat className="w-6 h-6" />} number="3">
            Vue d'ensemble : RestauMargin en 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              RestauMargin est positionne comme la <strong>solution de reference pour la gestion
              operationnelle et la rentabilite</strong> en restauration. Contrairement a un simple
              calculateur, notre plateforme couvre l'ensemble du cycle : ingredients, fiches techniques,
              mercuriale fournisseurs, stock, marges par plat et par carte, et optimisation par IA — tout
              inclus des le premier palier payant.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Points forts de RestauMargin</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-emerald-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Fiches techniques et menus illimites des le plan Pro (29€/mois)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Mercuriale fournisseurs avec historique de prix et alertes, incluse des l'entree</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Gestion de stock complete (inventaire, valorisation, alertes rupture)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>19 actions IA : suggestions recettes, optimisation marges, detection d'anomalies</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Multi-restaurant natif avec vue consolidee (plan Business)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>PWA mobile + mode kiosk + scan de factures par OCR</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Menu engineering (matrice Boston) et HACCP digital inclus</span></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Ce que RestauMargin ne fait pas</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-amber-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de plan gratuit permanent (seulement un essai de 7 jours)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de modeles telechargeables gratuits type "kit de demarrage"</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de module de reservation en ligne (utilisez TheFork ou Zenchef)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de creation de site web restaurant</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de marketing email automatise</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Notre conviction :</strong> si votre besoin se limite a calculer occasionnellement
            le cout de quelques plats, un outil gratuit et simple comme COS Kitchen est parfaitement
            legitime. RestauMargin est concu pour les restaurateurs qui veulent piloter leur rentabilite
            au quotidien, avec fournisseurs, stock et IA integres.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Tableau comparatif ═════════════ */}
        <section id="tableau" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
            Tableau comparatif détaillé (15 critères)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici une comparaison point par point entre COS Kitchen et RestauMargin. Pour COS Kitchen,
              nous indiquons le palier (Decouverte / Essentiel / Pro) ou la fonctionnalite devient
              disponible, base sur les informations publiques au 3 septembre 2026.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-4 font-bold w-[40%]">Critère</th>
                  <th className="text-center py-4 px-4 font-bold w-[30%]">
                    <div className="flex items-center justify-center gap-2">
                      <ChefHat className="w-4 h-4 text-teal-400" />
                      RestauMargin
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 font-bold w-[30%]">
                    <div className="flex items-center justify-center gap-2">
                      <CosBadge />
                      COS Kitchen
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <ComparisonRow label="Plan gratuit permanent" rm={false} zc="Oui (10 fiches, 1 menu)" winner="zc" />
                <ComparisonRow label="Prix mensuel (entrée payante)" rm="29€/mois" zc="29€ HT/mois (Essentiel)" winner="tie" />
                <ComparisonRow label="Prix mensuel (palier suivi fournisseurs)" rm="29€/mois — inclus" zc="59€ HT/mois (Pro)" winner="rm" />
                <ComparisonRow label="Essai / accès complet sans CB" rm="7 jours, toutes fonctions" zc="Plan gratuit limité" winner="rm" />
                <ComparisonRow label="Fiches techniques" rm="Illimitées" zc="10 (gratuit) puis illimité" winner="rm" />
                <ComparisonRow label="Mercuriale fournisseurs + alertes prix" rm={true} zc="Pro uniquement" winner="rm" />
                <ComparisonRow label="Gestion de stock / inventaire" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Scan factures (OCR)" rm={true} zc="Import bons de livraison (Pro)" winner="rm" />
                <ComparisonRow label="IA + suggestions" rm="19 actions IA" zc="Optimisation coût (Essentiel)" winner="rm" />
                <ComparisonRow label="Menu engineering (matrice Boston)" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="HACCP digital" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Multi-restaurant" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Mobile / PWA kiosk" rm="PWA + mode kiosk balance" zc="Web uniquement" winner="rm" />
                <ComparisonRow label="Export PDF / Excel" rm={true} zc="Essentiel et Pro" winner="tie" />
                <ComparisonRow label="Modèles gratuits téléchargeables" rm={false} zc={true} winner="zc" />
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Lecture du tableau :</strong> COS Kitchen gagne sur l'accessibilite immediate (plan
            gratuit, modeles telechargeables). RestauMargin gagne sur la profondeur fonctionnelle des le
            premier palier payant, notamment le stock, la mercuriale fournisseurs et le multi-restaurant.
          </Callout>
        </section>

        {/* ═════════════ SECTION 5 : Cas d'usage ═════════════ */}
        <section id="cas-usage" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="5">
            Quel outil pour quel type de restaurateur ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Plutot qu'un verdict unique, voici les trois profils les plus frequents que nous observons.
              Identifiez celui qui ressemble le plus a votre situation.
            </p>
          </div>

          <div className="grid gap-6 mt-8">
            <ScenarioCard
              badge="Profil 1"
              title="Vous testez le concept, carte de moins de 10 plats"
              recommendation="COS Kitchen (plan gratuit)"
              recoColor="blue"
              desc="Vous voulez simplement verifier le food cost de quelques plats avant d'ajuster vos prix, sans depenser un centime. Le plan Decouverte de COS Kitchen (10 fiches, 1 menu, gratuit a vie) est suffisant pour ce besoin ponctuel."
            />
            <ScenarioCard
              badge="Profil 2"
              title="Vous gérez une carte complète avec fournisseurs actifs"
              recommendation="RestauMargin (Pro)"
              recoColor="emerald"
              desc="Votre carte depasse 15-20 plats, vos fournisseurs changent leurs prix regulierement et vous voulez etre alerte automatiquement. RestauMargin inclut la mercuriale et les alertes des 29€/mois, la ou COS Kitchen exige de passer a son plan Pro a 59€ HT/mois pour la meme chose."
            />
            <ScenarioCard
              badge="Profil 3"
              title="Vous êtes un groupe de plusieurs restaurants"
              recommendation="RestauMargin (Business)"
              recoColor="purple"
              desc="Vous avez besoin d'une vue consolidee des marges entre etablissements. Aucune fonctionnalite multi-restaurant n'est publiee chez COS Kitchen. RestauMargin Business (79€/mois) gere nativement plusieurs restaurants avec comparaison des performances."
            />
          </div>

          <Callout type="info">
            <strong>Notre engagement :</strong> si apres votre essai de 7 jours vous constatez que vos
            besoins se limitent a un calcul occasionnel, nous vous recommandons honnetement de rester
            sur une solution gratuite comme COS Kitchen. Notre objectif est que vous ayez le bon outil
            pour votre besoin reel, pas que vous payiez RestauMargin par defaut.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Témoignages ═════════════ */}
        <section id="temoignages" className="mb-16">
          <SectionHeading icon={<Quote className="w-6 h-6" />} number="6">
            Témoignages de restaurateurs
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici des retours representatifs de clients qui ont depasse le stade du calculateur gratuit
              pour passer a une gestion complete de leurs marges. Les prenoms ont ete modifies pour
              preserver l'anonymat des etablissements.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            <TestimonialCard
              quote="J'avais commence avec un calculateur gratuit pour verifier mes prix. Ca marchait pour 5 plats, mais des que ma carte a atteint 25 references, je passais plus de temps a chercher mes fiches qu'a cuisiner. RestauMargin centralise tout avec les fournisseurs en plus."
              author="Julien R."
              role="Bistrot, Nantes"
              rating={5}
            />
            <TestimonialCard
              quote="Le vrai declic, c'est l'alerte automatique quand un fournisseur augmente ses prix. Avant je le decouvrais un mois plus tard sur la facture. Maintenant je suis prevenu le jour meme et j'ajuste avant de perdre de la marge."
              author="Amandine D."
              role="Restaurant de quartier, Toulouse"
              rating={5}
            />
            <TestimonialCard
              quote="On avait teste un outil gratuit au demarrage. Suffisant pour se lancer, mais des qu'on a ouvert notre deuxieme adresse, on avait besoin d'une vue consolidee. RestauMargin Business nous montre les deux restaurants cote a cote."
              author="Thomas V."
              role="Groupe de 2 restaurants, Lille"
              rating={5}
            />
            <TestimonialCard
              quote="Le scan de factures m'a fait gagner un temps fou. Je prends la facture en photo et les prix se mettent a jour dans mes fiches techniques automatiquement. Aucun calculateur gratuit ne propose ca."
              author="Fatima Z."
              role="Cheffe-proprietaire, Strasbourg"
              rating={5}
            />
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Prix sur 12 mois ═════════════ */}
        <section id="prix" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="7">
            Comparaison de prix sur 12 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le point d'entree gratuit de COS Kitchen n'a pas d'equivalent chez RestauMargin. En
              revanche, des que le suivi fournisseurs devient necessaire, l'ecart de prix s'inverse en
              faveur de RestauMargin.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-4 font-bold">Formule</th>
                  <th className="text-right py-4 px-4 font-bold">Prix mensuel</th>
                  <th className="text-right py-4 px-4 font-bold">Prix annuel</th>
                  <th className="text-right py-4 px-4 font-bold">Suivi fournisseurs inclus ?</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">COS Kitchen Découverte</td>
                  <td className="py-3 px-4 text-right">0€</td>
                  <td className="py-3 px-4 text-right">0€</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">Non</td>
                </tr>
                <tr className="bg-mono-1000 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">COS Kitchen Essentiel</td>
                  <td className="py-3 px-4 text-right">29€ HT</td>
                  <td className="py-3 px-4 text-right">348€ HT</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">Non</td>
                </tr>
                <tr className="bg-white border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">COS Kitchen Pro</td>
                  <td className="py-3 px-4 text-right">59€ HT</td>
                  <td className="py-3 px-4 text-right">708€ HT</td>
                  <td className="py-3 px-4 text-right text-emerald-700 font-semibold">Oui</td>
                </tr>
                <tr className="bg-emerald-50 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-emerald-900">RestauMargin Pro</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">29€</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">348€</td>
                  <td className="py-3 px-4 text-right text-emerald-700 font-semibold">Oui, inclus</td>
                </tr>
                <tr className="bg-emerald-50/40 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-emerald-900">RestauMargin Business</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">79€</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">948€</td>
                  <td className="py-3 px-4 text-right text-emerald-700 font-semibold">Oui, + multi-resto</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Pour obtenir le suivi fournisseurs et les alertes de prix chez COS Kitchen, il faut compter
              <strong> 708€ HT par an</strong> (plan Pro). Le meme perimetre fonctionnel — plus la gestion
              de stock, le menu engineering, le HACCP digital et 19 actions IA — coute
              <strong> 348€ par an</strong> chez RestauMargin Pro, soit une economie de l'ordre de 360€
              par an a fonctionnalites egales ou superieures.
            </p>
            <p>
              Si votre seul besoin est de calculer ponctuellement quelques fiches sans aucun suivi
              fournisseur, le plan gratuit de COS Kitchen reste imbattable sur le prix : 0€ contre 348€
              chez RestauMargin. Le choix depend donc entierement de la profondeur de gestion dont vous
              avez besoin.
            </p>
          </div>

          <Callout type="info">
            <strong>Le saviez-vous ?</strong> Une hausse de prix fournisseur non detectee pendant un mois
            sur un ingredient representant 10% du cout matiere d'un plat vendu 200 fois par mois peut
            faire perdre plusieurs centaines d'euros de marge brute sans que le restaurateur s'en
            apercoive. Les alertes automatiques de prix se rentabilisent generalement des le premier
            incident evite.
          </Callout>
        </section>

        <BlogAuthor publishedDate="2026-09-03" readTime="11 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Testez RestauMargin gratuitement pendant 7 jours
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              La meilleure façon de savoir si RestauMargin est la bonne alternative à COS Kitchen pour
              votre restaurant, c'est de l'essayer. Sans carte bancaire, sans engagement.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29€/mois</strong> à partir du 8e jour si vous décidez de continuer.
              Annulation en un clic.
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

        {/* ═════════════ Articles complementaires ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul de marge restaurant</h3>
              <p className="text-xs text-mono-500">Guide complet : food cost, formules et benchmarks par type d'établissement.</p>
            </Link>
            <Link to="/alternative-zenchef" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Alternative Zenchef</h3>
              <p className="text-xs text-mono-500">Comparatif RestauMargin vs Zenchef : réservations et marketing vs gestion des marges.</p>
            </Link>
            <Link to="/pricing" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Tarifs RestauMargin</h3>
              <p className="text-xs text-mono-500">Formules Pro et Business, comparaison détaillée des fonctionnalités.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Créer mon compte</h3>
              <p className="text-xs text-mono-500">Essai gratuit 7 jours, sans carte bancaire, accès toutes fonctionnalités.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* ── Footer ── */}
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

function CosBadge() {
  return (
    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">C</div>
  );
}

function ComparisonRow({ label, rm, zc, winner }: {
  label: string;
  rm: boolean | string;
  zc: boolean | string;
  winner: 'rm' | 'zc' | 'tie';
}) {
  const renderCell = (val: boolean | string, isWinner: boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <CheckCircle className={`w-5 h-5 mx-auto ${isWinner ? 'text-emerald-600' : 'text-emerald-500'}`} />
      ) : (
        <XCircle className="w-5 h-5 mx-auto text-mono-700" />
      );
    }
    return <span className={`text-sm ${isWinner ? 'font-bold text-mono-100' : 'text-mono-400'}`}>{val}</span>;
  };

  return (
    <tr className="border-t border-mono-900 hover:bg-mono-1000 transition-colors">
      <td className="py-3.5 px-4 text-mono-100 font-medium">{label}</td>
      <td className={`py-3.5 px-4 text-center ${winner === 'rm' ? 'bg-emerald-50' : ''}`}>
        {renderCell(rm, winner === 'rm')}
      </td>
      <td className={`py-3.5 px-4 text-center ${winner === 'zc' ? 'bg-blue-50' : ''}`}>
        {renderCell(zc, winner === 'zc')}
      </td>
    </tr>
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

function TestimonialCard({ quote, author, role, rating }: {
  quote: string;
  author: string;
  role: string;
  rating: number;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-3xl p-6 sm:p-7">
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <Quote className="w-6 h-6 text-teal-600 mb-3 opacity-50" />
      <p className="text-sm text-mono-350 leading-relaxed mb-4 italic">"{quote}"</p>
      <div className="flex items-center gap-3 pt-3 border-t border-mono-900">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm">
          {author.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <div className="font-bold text-mono-100 text-sm">{author}</div>
          <div className="text-xs text-mono-500">{role}</div>
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
    <details className="bg-mono-1000 border border-mono-900 rounded-2xl group">
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
