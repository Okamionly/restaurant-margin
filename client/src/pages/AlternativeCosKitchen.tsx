import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, DollarSign, Target, BookOpen, Lightbulb, Users, Zap, Sparkles, Scale, XCircle, Building2, Package } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

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
    answer: "COS Kitchen est une plateforme en ligne française qui calcule le food cost, la marge brute et le prix de vente conseillé de chaque plat. Elle revendique plus de 2 500 restaurateurs utilisateurs et met en avant un positionnement freemium : le calculateur de base, les fiches techniques (limitées à 10) et un menu complet restent gratuits à vie.",
  },
  {
    question: "COS Kitchen est-il vraiment gratuit ?",
    answer: "Le plan Découverte est effectivement gratuit sans limite de temps, mais il est limité à 10 fiches techniques et 1 menu avec résultats complets. Pour des fiches et menus illimités, l'export PDF/Excel et l'optimisation par IA, il faut passer au plan Essentiel (29€ HT/mois). Le suivi des fournisseurs et les alertes de hausse de prix ne sont disponibles qu'au plan Pro (59€ HT/mois).",
  },
  {
    question: "Quelle est la différence entre COS Kitchen et RestauMargin ?",
    answer: "COS Kitchen est conçu comme un calculateur de food cost, avec une montée en gamme progressive vers le suivi fournisseurs. RestauMargin est une plateforme opérationnelle complète dès l'entrée : food cost, fiches techniques illimitées, mercuriale fournisseurs avec alertes de prix, gestion de stock, menu engineering, HACCP digital et 19 actions IA sont tous inclus dès le plan Pro à 29€/mois, sans palier supplémentaire à payer pour le suivi fournisseurs.",
  },
  {
    question: "RestauMargin propose-t-il un plan gratuit comme COS Kitchen ?",
    answer: "Non, RestauMargin ne propose pas de plan gratuit permanent : nous offrons un essai gratuit de 7 jours, sans carte bancaire, avec accès à l'intégralité des fonctionnalités (pas de version bridée). Si votre besoin se limite à calculer occasionnellement le food cost de quelques plats, le plan Découverte gratuit de COS Kitchen (10 fiches, 1 menu) peut suffire. Si vous gériez une carte complète au quotidien, l'essai RestauMargin vous montrera l'écart dès le premier jour.",
  },
  {
    question: "COS Kitchen gère-t-il les stocks et les fournisseurs ?",
    answer: "COS Kitchen propose un import des bons de livraison par email et des alertes de hausse de prix fournisseur, mais uniquement au plan Pro (59€ HT/mois). Aucune gestion de stock (inventaire, alertes de rupture, valorisation) n'est mentionnée sur leur site. RestauMargin inclut la mercuriale fournisseurs avec historique de prix et le scan OCR de factures dès le plan Pro à 29€/mois, plus une gestion de stock complète.",
  },
  {
    question: "Puis-je migrer mes données de COS Kitchen vers RestauMargin ?",
    answer: "Les deux outils stockent le même type de données de base (ingrédients, recettes, fiches techniques), ce qui facilite une migration manuelle ou via export CSV/Excel (fonction disponible sur les deux plateformes à partir de leurs plans payants). Notre équipe support peut vous accompagner pour réimporter vos fiches techniques existantes lors de votre essai gratuit.",
  },
  {
    question: "Quel est le meilleur outil pour un groupe de plusieurs restaurants ?",
    answer: "COS Kitchen ne mentionne aucune fonctionnalité multi-établissement sur son site public : chaque compte semble conçu pour un seul restaurant. RestauMargin gère nativement le multi-restaurant avec une vue consolidée des marges (formule Business, 79€/mois), ce qui en fait le choix par défaut pour un groupe de 2 établissements ou plus.",
  },
  {
    question: "COS Kitchen propose-t-il de l'intelligence artificielle ?",
    answer: "Oui, COS Kitchen mentionne une 'optimisation de coût par IA' et des suggestions d'ingrédients alternatifs dès le plan Essentiel (29€ HT/mois). RestauMargin va plus loin avec 19 actions IA couvrant les suggestions de recettes, l'optimisation des marges, la détection d'anomalies de prix et la commande vocale, disponibles dès le plan Pro.",
  },
  {
    question: "Quel outil choisir pour débuter à moindre coût ?",
    answer: "Si votre restaurant ne gère qu'une poignée de plats et que vous voulez tester le concept de calcul de food cost sans dépenser un centime, le plan Découverte gratuit de COS Kitchen (10 fiches techniques) est un bon point d'entrée. Dès que votre carte dépasse 10 plats ou que vous voulez suivre vos fournisseurs, l'essai gratuit de 7 jours de RestauMargin vous donne accès à une solution complète sans palier à franchir.",
  },
  {
    question: "RestauMargin est-il plus cher que COS Kitchen sur un an ?",
    answer: "Sur le premier palier payant, les deux outils sont proches : COS Kitchen Essentiel facture 29€ HT/mois (348€ HT/an) et RestauMargin Pro facture 29€/mois (348€/an), pour un périmètre de fonctionnalités plus large chez RestauMargin (mercuriale et alertes fournisseurs incluses, non disponibles avant le palier Pro à 59€ HT/mois chez COS Kitchen). À fonctionnalités égales, RestauMargin Pro est donc moins cher que COS Kitchen Pro (59€ HT/mois, soit 708€ HT/an).",
  },
];

export default function AlternativeCosKitchen() {
  return (
    <div className="min-h-screen">
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
            description: "Comparatif détaillé entre RestauMargin (29 EUR/mois, plateforme opérationnelle complète) et COS Kitchen (freemium, 0 à 59 EUR HT/mois, calculateur food cost). Tableau 15 critères, cas d'usage, FAQ.",
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
                  description: "Gestion des marges, food cost, fiches techniques, mercuriale fournisseurs et IA d'optimisation pour restaurateurs indépendants et groupes.",
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
                  description: "Calculateur de food cost et de marge en ligne, plans Découverte gratuit, Essentiel (29 EUR HT/mois) et Pro (59 EUR HT/mois).",
                },
              },
            ],
          },
        ]}
      />

      {/* ── Navbar ── */}
      <PublicHeader />

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
        subtitle="COS Kitchen a séduit plus de 2 500 restaurateurs avec un calculateur de food cost gratuit. Voici un comparatif honnête pour savoir si son offre freemium suffit à votre restaurant, ou si une plateforme opérationnelle complète comme RestauMargin est le meilleur choix."
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
              <strong className="text-white">COS Kitchen</strong> est un <strong>calculateur de food cost</strong> freemium : gratuit jusqu'à 10 fiches et 1 menu, puis 29€ HT/mois (Essentiel) et 59€ HT/mois (Pro) pour débloquer le suivi des fournisseurs.
            </p>
            <p className="leading-relaxed">
              <strong className="text-white">RestauMargin</strong> est une <strong>plateforme opérationnelle complète</strong> à 29€/mois : food cost, fiches illimitées, stock, mercuriale fournisseurs avec alertes, menu engineering, HACCP et 19 actions IA, tout inclus dès l'entrée.
            </p>
            <p className="leading-relaxed pt-2 border-t border-white/20">
              <strong className="text-white">Verdict :</strong> pour un simple calcul ponctuel, le plan gratuit COS Kitchen suffit. Pour piloter une carte au quotidien avec fournisseurs et stock, RestauMargin couvre plus large pour un prix d'entrée identique.
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
              COS Kitchen s'est fait une place dans le paysage français de la gestion de food cost avec
              une promesse simple : un calculateur gratuit, sans engagement, pour connaître le coût et
              la marge de chaque plat. C'est un outil établi dans la restauration.
              C'est une porte d'entrée accessible pour qui n'a jamais mis un chiffre précis
              sur ses fiches techniques.
            </p>
            <p>
              Mais un calculateur gratuit et une plateforme de gestion opérationnelle répondent à des
              besoins différents. Trois questions se posent quand on hésite entre
              les deux :
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 mt-8">
            <ReasonCard
              icon={<Package className="w-6 h-6" />}
              title="Les fournisseurs et le stock"
              desc="Le plan gratuit et le plan Essentiel de COS Kitchen ne suivent pas vos fournisseurs. Il faut passer au plan Pro (59€ HT/mois) pour les alertes de prix, et aucune gestion de stock n'est mentionnée."
            />
            <ReasonCard
              icon={<XCircle className="w-6 h-6" />}
              title="Les limites du plan gratuit"
              desc="10 fiches techniques et 1 menu complet, c'est suffisant pour tester mais pas pour gérer une carte de 20 à 40 plats au quotidien avec entrées, plats, desserts et boissons."
            />
            <ReasonCard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="Le multi-restaurant"
              desc="Aucune fonctionnalité de gestion multi-établissement n'apparaît sur le site de COS Kitchen. Pour un groupe de plusieurs restaurants, c'est un manque structurant."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              Soyons justes : ces limites ne font pas de COS Kitchen un mauvais outil. Pour un
              restaurateur qui veut juste vérifier le food cost de trois nouveaux plats avant de les
              mettre à la carte, le plan gratuit suffit largement. Le problème apparaît quand la carte
              grandit, quand les fournisseurs changent leurs prix chaque mois, ou quand un deuxième
              établissement ouvre.
            </p>
            <p>
              C'est cette différence de périmètre qui explique pourquoi nous nous présentons comme une
              <strong> alternative à COS Kitchen</strong> pour les restaurateurs qui ont dépassé le stade
              du simple calcul ponctuel. Voyons les deux approches en détail.
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
              COS Kitchen est positionné comme un <strong>calculateur de food cost et de marge en
              ligne</strong>, avec une montée en gamme progressive vers le suivi fournisseurs. Le produit
              met en avant sa simplicité ("configurez en 2 minutes") et un modèle freemium : les outils
              essentiels restent gratuits à vie, les fonctions avancées sont réservées aux plans
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
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Plan Découverte gratuit à vie, sans carte bancaire (10 fiches, 1 menu)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Interface simple, calcul de food cost instantané</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Benchmarks sectoriels intégrés au plan gratuit</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Import de bons de livraison par email (plan Pro)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Communauté large revendiquée : des restaurateurs</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Modèles gratuits téléchargeables (fiches, tableaux)</span></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Limites de COS Kitchen</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-amber-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Plan gratuit limité à 10 fiches techniques et 1 menu</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Suivi fournisseurs et alertes prix réservés au plan Pro (59€ HT/mois)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Aucune gestion de stock ou d'inventaire mentionnée</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de multi-restaurant identifié sur le site</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de menu engineering (matrice Boston) ni de HACCP digital</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas d'application mobile PWA ni de mode kiosk</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>À noter :</strong> les informations ci-dessus sont issues du site public
            coskitchen.fr (accueil et page tarifs) consulté le 3 septembre 2026. Si une fonctionnalité
            existe sans être publiée sur leur site, elle n'a pas pu être intégrée à ce comparatif.
          </Callout>
        </section>

        {/* ═════════════ SECTION 3 : Vue d'ensemble RestauMargin ═════════════ */}
        <section id="restaumargin" className="mb-16">
          <SectionHeading icon={<ChefHat className="w-6 h-6" />} number="3">
            Vue d'ensemble : RestauMargin en 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              RestauMargin est positionné comme la <strong>solution de référence pour la gestion
              opérationnelle et la rentabilité</strong> en restauration. Contrairement à un simple
              calculateur, notre plateforme couvre l'ensemble du cycle : ingrédients, fiches techniques,
              mercuriale fournisseurs, stock, marges par plat et par carte, et optimisation par IA — tout
              inclus dès le premier palier payant.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Points forts de RestauMargin</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-emerald-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Fiches techniques et menus illimités dès le plan Pro (29€/mois)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Mercuriale fournisseurs avec historique de prix et alertes, incluse dès l'entrée</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Gestion de stock complète (inventaire, valorisation, alertes rupture)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>19 actions IA : suggestions recettes, optimisation marges, détection d'anomalies</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Multi-restaurant natif avec vue consolidée (plan Business)</span></li>
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
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de modèles téléchargeables gratuits type "kit de démarrage"</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de module de réservation en ligne (utilisez TheFork ou Zenchef)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de création de site web restaurant</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de marketing email automatisé</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Notre conviction :</strong> si votre besoin se limite à calculer occasionnellement
            le coût de quelques plats, un outil gratuit et simple comme COS Kitchen est parfaitement
            légitime. RestauMargin est conçu pour les restaurateurs qui veulent piloter leur rentabilité
            au quotidien, avec fournisseurs, stock et IA intégrés.
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
              nous indiquons le palier (Découverte / Essentiel / Pro) où la fonctionnalité devient
              disponible, basé sur les informations publiques au 3 septembre 2026.
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
            <strong>Lecture du tableau :</strong> COS Kitchen gagne sur l'accessibilité immédiate (plan
            gratuit, modèles téléchargeables). RestauMargin gagne sur la profondeur fonctionnelle dès le
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
              Plutôt qu'un verdict unique, voici trois profils types.
              Identifiez celui qui ressemble le plus à votre situation.
            </p>
          </div>

          <div className="grid gap-6 mt-8">
            <ScenarioCard
              badge="Profil 1"
              title="Vous testez le concept, carte de moins de 10 plats"
              recommendation="COS Kitchen (plan gratuit)"
              recoColor="blue"
              desc="Vous voulez simplement vérifier le food cost de quelques plats avant d'ajuster vos prix, sans dépenser un centime. Le plan Découverte de COS Kitchen (10 fiches, 1 menu, gratuit à vie) est suffisant pour ce besoin ponctuel."
            />
            <ScenarioCard
              badge="Profil 2"
              title="Vous gérez une carte complète avec fournisseurs actifs"
              recommendation="RestauMargin (Pro)"
              recoColor="emerald"
              desc="Votre carte dépasse 15-20 plats, vos fournisseurs changent leurs prix régulièrement et vous voulez être alerté automatiquement. RestauMargin inclut la mercuriale et les alertes dès 29€/mois, là où COS Kitchen exige de passer à son plan Pro à 59€ HT/mois pour la même chose."
            />
            <ScenarioCard
              badge="Profil 3"
              title="Vous êtes un groupe de plusieurs restaurants"
              recommendation="RestauMargin (Business)"
              recoColor="purple"
              desc="Vous avez besoin d'une vue consolidée des marges entre établissements. Aucune fonctionnalité multi-restaurant n'est publiée chez COS Kitchen. RestauMargin Business (79€/mois) gère nativement plusieurs restaurants avec comparaison des performances."
            />
          </div>

          <Callout type="info">
            <strong>Notre engagement :</strong> si après votre essai de 7 jours vous constatez que vos
            besoins se limitent à un calcul occasionnel, nous vous recommandons honnêtement de rester
            sur une solution gratuite comme COS Kitchen. Notre objectif est que vous ayez le bon outil
            pour votre besoin réel, pas que vous payiez RestauMargin par défaut.
          </Callout>
        </section>


        {/* ═════════════ SECTION 7 : Prix sur 12 mois ═════════════ */}
        <section id="prix" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="6">
            Comparaison de prix sur 12 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le point d'entrée gratuit de COS Kitchen n'a pas d'équivalent chez RestauMargin. En
              revanche, dès que le suivi fournisseurs devient nécessaire, l'écart de prix s'inverse en
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
              <strong> 708€ HT par an</strong> (plan Pro). Le même périmètre fonctionnel — plus la gestion
              de stock, le menu engineering, le HACCP digital et 19 actions IA — coûte
              <strong> 348€ par an</strong> chez RestauMargin Pro, soit une économie de l'ordre de 360€
              par an à fonctionnalités égales ou supérieures.
            </p>
            <p>
              Si votre seul besoin est de calculer ponctuellement quelques fiches sans aucun suivi
              fournisseur, le plan gratuit de COS Kitchen reste imbattable sur le prix : 0€ contre 348€
              chez RestauMargin. Le choix dépend donc entièrement de la profondeur de gestion dont vous
              avez besoin.
            </p>
          </div>

          <Callout type="info">
            <strong>Le saviez-vous ?</strong> Une hausse de prix fournisseur non détectée pendant un mois
            sur un ingrédient représentant 10% du coût matière d'un plat vendu 200 fois par mois peut
            faire perdre plusieurs centaines d'euros de marge brute sans que le restaurateur s'en
            aperçoive. Les alertes automatiques de prix se rentabilisent généralement dès le premier
            incident évité.
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
      <PublicFooter />
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
