import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, DollarSign, Target, BookOpen, Lightbulb, Users, Zap, Sparkles, Scale, XCircle, Building2, Package, Wallet } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Comparatif SEO — "RestauMargin : la meilleure alternative à Marge Brut"
   Mot-clé principal : alternative marge brut
   Mots-clés secondaires : marge brut avis, marge brut vs restaumargin, marge brut gratuit
   Sources verifiees le 10/09/2026 : margebrut.fr (accueil)
   Concurrent identifie #2 sur "logiciel marge restaurant food cost IA" (audit 02/09/2026)
   ~2 700 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Qu'est-ce que Marge Brut ?",
    answer: "Marge Brut (margebrut.fr) est un logiciel francais de gestion et pilotage pour restaurateurs independants, axe sur le controle du food cost, des marges et de la rentabilite. Il propose des fiches techniques avec prix de revient au centime, une lecture par IA des factures fournisseurs, un P&L quotidien et une tresorerie projetee sur 13 semaines.",
  },
  {
    question: "Marge Brut est-il vraiment gratuit ?",
    answer: "Oui, au 10 septembre 2026, Marge Brut est entierement gratuit, sans carte bancaire requise et sans fonctionnalite bridee, pendant sa phase de developpement active. L'editeur ne communique aucune date de passage a un modele payant sur son site public — c'est un point important a surveiller si vous batissez votre gestion quotidienne sur cet outil.",
  },
  {
    question: "Quelle est la difference entre Marge Brut et RestauMargin ?",
    answer: "Marge Brut est un outil jeune, gratuit pendant sa phase de developpement, avec un perimetre oriente pilotage financier : food cost, P&L, tresorerie, factures IA et gestion d'equipe. RestauMargin est une plateforme mature et payante des 29€/mois qui ajoute la mercuriale fournisseurs avec alertes de hausse de prix, la gestion de stock complete, le menu engineering (matrice Boston), le HACCP digital et 19 actions IA — des fonctionnalites que Marge Brut ne mentionne pas sur son site.",
  },
  {
    question: "Marge Brut propose-t-il la gestion de stock et le menu engineering ?",
    answer: "Non, ni la gestion de stock (inventaire, valorisation, alertes de rupture) ni le menu engineering (classement des plats stars/vaches a lait/enigmes/poids morts) ne figurent parmi les fonctionnalites publiees de Marge Brut au 10 septembre 2026. RestauMargin inclut les deux des le plan Pro a 29€/mois.",
  },
  {
    question: "Marge Brut gere-t-il le HACCP et la conformite hygiene ?",
    answer: "Aucune fonctionnalite HACCP (releves de temperature, checklists hygiene, tracabilite) n'est mentionnee sur le site de Marge Brut. RestauMargin propose un module HACCP digital inclus dans son abonnement, ce qui evite de jongler entre plusieurs outils pour la gestion financiere et la conformite reglementaire.",
  },
  {
    question: "Marge Brut restera-t-il gratuit longtemps ?",
    answer: "L'editeur communique une gratuite pendant la phase de developpement, sans engagement ni date annoncee de bascule vers un modele payant. C'est une situation frequente chez les jeunes editeurs SaaS : le produit est gratuit le temps d'acquerir des utilisateurs et des retours, puis un modele payant est introduit une fois la base installee. Rien ne garantit que les fonctionnalites actuellement gratuites le resteront indefiniment.",
  },
  {
    question: "Quel outil gere le mieux les fournisseurs ?",
    answer: "Marge Brut propose une lecture IA des factures fournisseurs avec controle des livraisons et quantification des ecarts en euros — une fonctionnalite solide. RestauMargin va plus loin avec une mercuriale fournisseurs complete : historique de prix par produit et par fournisseur, alertes automatiques des qu'un prix augmente, et scan OCR des factures, le tout inclus des le premier palier payant.",
  },
  {
    question: "Marge Brut convient-il a un groupe de plusieurs restaurants ?",
    answer: "Pas encore de maniere native : la vue multi-etablissements figure dans la roadmap \"a venir\" de Marge Brut, sans date de disponibilite publiee. RestauMargin gere deja le multi-restaurant avec une vue consolidee des marges via la formule Business a 79€/mois.",
  },
  {
    question: "Puis-je migrer mes donnees de Marge Brut vers RestauMargin ?",
    answer: "Les deux outils manipulent le meme type de donnees de base (ingredients, recettes, fiches techniques, fournisseurs). Une migration manuelle est possible en reprenant vos fiches techniques existantes. Notre equipe support peut vous accompagner pour ce transfert pendant votre essai gratuit de 7 jours.",
  },
  {
    question: "Quel outil choisir pour debuter sans budget ?",
    answer: "Si votre priorite absolue est de ne rien depenser tant que votre activite se stabilise, Marge Brut est un choix legitime : c'est aujourd'hui un outil gratuit et fonctionnel pour le food cost, les factures et la tresorerie. Si vous geriez deja une carte complete avec fournisseurs multiples et que vous voulez aussi le stock, le menu engineering et le HACCP dans un seul outil eprouve, l'essai gratuit de 7 jours de RestauMargin vous permet de comparer sans engagement.",
  },
];

export default function AlternativeMargeBrut() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Alternative Marge Brut : RestauMargin, la gestion complète | 2026"
        description="Marge Brut est gratuit en phase de développement. RestauMargin ajoute mercuriale, stock, menu engineering et HACCP dès 29€/mois. Comparatif détaillé et honnête."
        path="/alternative-marge-brut"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Comparatifs', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Alternative Marge Brut', url: 'https://www.restaumargin.fr/alternative-marge-brut' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'RestauMargin : la meilleure alternative à Marge Brut en 2026',
            description: "Comparatif detaille entre RestauMargin (29 EUR/mois, plateforme operationnelle complete) et Marge Brut (gratuit en phase de developpement, pilotage financier). Tableau 15 criteres, cas d'usage, FAQ.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-09-10',
            dateModified: '2026-09-10',
            wordCount: 2700,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/alternative-marge-brut' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Comparatif Marge Brut vs RestauMargin',
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
                  description: "Gestion des marges, food cost, fiches techniques, mercuriale fournisseurs, stock et IA d'optimisation pour restaurateurs independants et groupes.",
                },
              },
              {
                '@type': 'ListItem',
                position: 2,
                item: {
                  '@type': 'SoftwareApplication',
                  name: 'Marge Brut',
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
                  description: "Logiciel gratuit de food cost, factures IA, P&L et tresorerie pour restaurateurs independants, en phase de developpement active.",
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
          <span className="text-mono-100 font-medium">Alternative Marge Brut</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Comparatif"
        readTime="11 min"
        date="Septembre 2026"
        title="RestauMargin : la meilleure alternative à Marge Brut en 2026"
        accentWord="alternative à Marge Brut"
        subtitle="Marge Brut propose un outil de pilotage financier entièrement gratuit pendant sa phase de développement. Voici un comparatif honnête pour savoir si cette gratuité suffit à votre restaurant, ou si une plateforme opérationnelle complète et éprouvée comme RestauMargin est le meilleur choix à long terme."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-09-10" readTime="11 min" variant="header" />

        {/* ── Encadre TL;DR (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">En 30 secondes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Marge Brut vs RestauMargin : la réponse rapide
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3 text-sm sm:text-base">
            <p className="leading-relaxed">
              <strong className="text-white">Marge Brut</strong> est un <strong>outil gratuit de pilotage financier</strong> en phase de developpement active : food cost, factures lues par IA, P&L quotidien et tresorerie projetee, sans aucun cout ni carte bancaire.
            </p>
            <p className="leading-relaxed">
              <strong className="text-white">RestauMargin</strong> est une <strong>plateforme operationnelle mature</strong> a 29€/mois : food cost, mercuriale fournisseurs avec alertes, gestion de stock, menu engineering, HACCP digital et 19 actions IA, tout inclus et deja en production.
            </p>
            <p className="leading-relaxed pt-2 border-t border-white/20">
              <strong className="text-white">Verdict :</strong> pour tester le pilotage financier sans depenser un centime, Marge Brut est un excellent point d'entree. Pour piloter stock, fournisseurs, carte et hygiene dans un seul outil stable, RestauMargin couvre un perimetre plus large.
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
              { href: '#pourquoi', label: "Pourquoi comparer Marge Brut et RestauMargin ?" },
              { href: '#margebrut', label: "Vue d'ensemble : Marge Brut en 2026" },
              { href: '#restaumargin', label: "Vue d'ensemble : RestauMargin en 2026" },
              { href: '#tableau', label: 'Tableau comparatif détaillé (15 critères)' },
              { href: '#cas-usage', label: "Quel outil pour quel type de restaurateur ?" },
              { href: '#modele-eco', label: 'La gratuité de Marge Brut : ce qu\'il faut savoir' },
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
            Pourquoi comparer Marge Brut et RestauMargin ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Marge Brut (margebrut.fr) est un outil recent qui s'est fait remarquer sur les requetes
              liees au calcul de marge et de food cost, avec une promesse forte : un logiciel de gestion
              complet, gratuit sans limite de temps ni carte bancaire, pendant que l'equipe le developpe.
              Pour un restaurateur qui cherche a arreter les tableurs Excel sans engager de budget
              logiciel, c'est une offre seduisante.
            </p>
            <p>
              Mais "gratuit pendant la phase de developpement" et "plateforme mature et payante" ne
              couvrent pas exactement le meme perimetre ni la meme promesse de perennite. Trois questions
              reviennent chez les restaurateurs qui hesitent entre les deux :
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 mt-8">
            <ReasonCard
              icon={<Package className="w-6 h-6" />}
              title="Le stock et le menu engineering"
              desc="Aucune gestion de stock ni classement des plats (matrice Boston) n'est mentionnee sur le site public de Marge Brut au 10 septembre 2026."
            />
            <ReasonCard
              icon={<Wallet className="w-6 h-6" />}
              title="La duree de la gratuite"
              desc="Marge Brut est gratuit pendant sa phase de developpement, sans date de bascule vers un modele payant annoncee publiquement. C'est un choix d'editeur courant chez les jeunes SaaS, a anticiper."
            />
            <ReasonCard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="Le multi-restaurant et le HACCP"
              desc="La vue multi-etablissements figure dans la roadmap 'a venir' de Marge Brut. Aucun module HACCP digital n'est mentionne non plus."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              Soyons justes : ces manques ne font pas de Marge Brut un mauvais outil, bien au contraire.
              La lecture IA des factures fournisseurs, la tresorerie projetee sur 13 semaines et le P&L
              quotidien sont des fonctionnalites solides, rarement offertes gratuitement ailleurs. Le
              probleme se pose quand votre besoin depasse le pilotage financier pur : gerer un stock,
              classer vos plats par rentabilite, digitaliser votre HACCP, ou ouvrir un deuxieme
              etablissement.
            </p>
            <p>
              C'est cette difference de perimetre qui explique pourquoi nous nous presentons comme une
              <strong> alternative a Marge Brut</strong> pour les restaurateurs qui veulent une plateforme
              operationnelle complete, deja en production depuis plusieurs annees. Voyons les deux
              approches en detail.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Vue d'ensemble Marge Brut ═════════════ */}
        <section id="margebrut" className="mb-16">
          <SectionHeading icon={<Building2 className="w-6 h-6" />} number="2">
            Vue d'ensemble : Marge Brut en 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              Marge Brut se positionne comme un <strong>logiciel de gestion et de pilotage</strong> pour
              restaurateurs independants — restaurants, bistrots, bars a vin, brasseries et cafes. Le
              produit met en avant sa gratuite totale ("gratuit pour tous les restaurateurs, sans carte
              bancaire") pendant sa phase de developpement actuelle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Points forts de Marge Brut</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-emerald-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Entierement gratuit, sans carte bancaire, sans limite de temps</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Food cost en temps reel par recette et par produit</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Lecture IA des factures fournisseurs et controle des livraisons</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>P&L quotidien avec export PDF</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Tresorerie projetee sur 13 semaines</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Gestion d'equipe, planning, conges et extras incluse</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Cave a vin et tarification au verre/bouteille</span></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Limites de Marge Brut</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-amber-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Aucune date de bascule vers un modele payant communiquee</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Aucune gestion de stock ou d'inventaire mentionnee</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de menu engineering (matrice Boston)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de module HACCP digital identifie</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Multi-etablissements encore "a venir", sans date</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Integration caisse encore "en developpement"</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>A noter :</strong> les informations ci-dessus sont issues du site public
            margebrut.fr consulte le 10 septembre 2026. Marge Brut cite lui-meme des chiffres du secteur
            (8 714 defaillances en restauration en 2024, +10% sur un an ; marge nette mediane de 3% en
            2024) pour justifier son approche centree sur le pilotage financier. Si une fonctionnalite
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
              operationnelle et la rentabilite</strong> en restauration. Contrairement a un outil de
              pilotage financier seul, notre plateforme couvre l'ensemble du cycle : ingredients, fiches
              techniques, mercuriale fournisseurs, stock, marges par plat et par carte, menu engineering,
              HACCP et optimisation par IA — tout inclus des le premier palier payant.
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
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Menu engineering (matrice Boston) et HACCP digital inclus</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Multi-restaurant natif avec vue consolidee (plan Business)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>PWA mobile + mode kiosk + scan de factures par OCR</span></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Ce que RestauMargin ne fait pas</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-amber-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de plan gratuit permanent (seulement un essai de 7 jours)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de gestion de cave a vin dediee au verre pres</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de planning d'equipe / conges integre nativement</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de tresorerie projetee sur 13 semaines dediee</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de module de reservation en ligne (utilisez TheFork ou Zenchef)</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Notre conviction :</strong> si votre priorite est le pilotage financier pur
            (tresorerie, P&L, factures) sans budget logiciel, Marge Brut est un choix legitime et bien
            construit. RestauMargin est concu pour les restaurateurs qui veulent piloter aussi leur carte,
            leur stock, leurs fournisseurs et leur conformite hygiene dans un seul outil eprouve.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Tableau comparatif ═════════════ */}
        <section id="tableau" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
            Tableau comparatif détaillé (15 critères)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici une comparaison point par point entre Marge Brut et RestauMargin, basee sur les
              informations publiques disponibles sur margebrut.fr au 10 septembre 2026.
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
                      <MBBadge />
                      Marge Brut
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <ComparisonRow label="Prix actuel" rm="29€/mois" mb="0€ (phase de dev)" winner="mb" />
                <ComparisonRow label="Perennite du prix" rm="Tarif stable, plateforme etablie" mb="Aucune date de bascule payante communiquee" winner="rm" />
                <ComparisonRow label="Essai / accès complet sans CB" rm="7 jours, toutes fonctions" mb="Acces complet gratuit" winner="tie" />
                <ComparisonRow label="Food cost temps reel" rm={true} mb={true} winner="tie" />
                <ComparisonRow label="Lecture IA des factures" rm={true} mb={true} winner="tie" />
                <ComparisonRow label="Mercuriale fournisseurs + alertes prix" rm={true} mb="Controle ecarts uniquement" winner="rm" />
                <ComparisonRow label="Gestion de stock / inventaire" rm={true} mb={false} winner="rm" />
                <ComparisonRow label="P&L quotidien" rm={true} mb={true} winner="tie" />
                <ComparisonRow label="Tresorerie projetee" rm={false} mb="13 semaines" winner="mb" />
                <ComparisonRow label="Menu engineering (matrice Boston)" rm={true} mb={false} winner="rm" />
                <ComparisonRow label="HACCP digital" rm={true} mb={false} winner="rm" />
                <ComparisonRow label="Multi-restaurant" rm={true} mb="A venir (sans date)" winner="rm" />
                <ComparisonRow label="Gestion d'equipe / planning" rm={false} mb={true} winner="mb" />
                <ComparisonRow label="Cave a vin / tarification verre" rm={false} mb={true} winner="mb" />
                <ComparisonRow label="Mobile / PWA kiosk" rm="PWA + mode kiosk balance" mb="Non precise" winner="rm" />
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Lecture du tableau :</strong> Marge Brut gagne sur le prix immediat et sur des
            fonctionnalites de pilotage RH/tresorerie que RestauMargin ne propose pas. RestauMargin gagne
            sur la profondeur operationnelle (stock, mercuriale, menu engineering, HACCP, multi-restaurant)
            et sur la perennite d'un modele payant deja etabli.
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
              title="Vous demarrez et votre priorite est de ne rien depenser"
              recommendation="Marge Brut"
              recoColor="blue"
              desc="Vous ouvrez ou reprenez un etablissement et le budget logiciel n'est pas la priorite du moment. Marge Brut vous donne acces gratuitement a du pilotage financier serieux (food cost, factures, tresorerie) sans aucun engagement."
            />
            <ScenarioCard
              badge="Profil 2"
              title="Vous gérez une carte complète avec fournisseurs et stock actifs"
              recommendation="RestauMargin (Pro)"
              recoColor="emerald"
              desc="Votre carte depasse 15-20 plats, vous devez suivre un stock et etre alerte des qu'un fournisseur augmente ses prix, et vous voulez classer vos plats par rentabilite. Aucune de ces trois briques n'est publiee chez Marge Brut a ce jour."
            />
            <ScenarioCard
              badge="Profil 3"
              title="Vous êtes soumis à des contrôles hygiène réguliers ou gérez plusieurs adresses"
              recommendation="RestauMargin (Pro/Business)"
              recoColor="purple"
              desc="Le HACCP digital et le multi-restaurant sont deux briques structurantes chez RestauMargin, absentes ou encore en roadmap chez Marge Brut. Pour un groupe ou un etablissement soumis a des controles frequents, c'est un critere de choix direct."
            />
          </div>

          <Callout type="info">
            <strong>Notre engagement :</strong> Marge Brut est un outil recent, bien construit sur son
            perimetre, et sa gratuite actuelle est un atout reel pour demarrer sans risque. Notre objectif
            est que vous choisissiez l'outil adapte a votre besoin reel, pas que vous payiez RestauMargin
            par defaut.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : La gratuite en question ═════════════ */}
        <section id="modele-eco" className="mb-16">
          <SectionHeading icon={<Wallet className="w-6 h-6" />} number="6">
            La gratuité de Marge Brut : ce qu'il faut savoir
          </SectionHeading>

          <div className="prose-content">
            <p>
              Marge Brut communique clairement sur sa gratuite : l'outil est "en developpement actif" et
              gratuit pour tous les restaurateurs, sans carte bancaire, sans limite de temps annoncee. Ce
              n'est pas une periode d'essai deguisee — c'est un choix de positionnement assume par
              l'editeur, courant chez les jeunes SaaS qui construisent leur base d'utilisateurs avant
              d'introduire un modele payant.
            </p>
            <p>
              Pour un restaurateur, ce choix presente deux visages. D'un cote, c'est une opportunite reelle
              de piloter son food cost et sa tresorerie sans depenser un centime pendant cette phase. De
              l'autre, cela implique une incertitude structurelle : aucune date de bascule vers un modele
              payant n'est publiee, ce qui signifie que les conditions (prix, fonctionnalites conservees ou
              non) pourraient evoluer sans preavis long une fois le produit sorti de sa phase de
              developpement.
            </p>
            <p>
              Ce n'est pas une critique de Marge Brut — c'est une realite a integrer dans votre decision.
              Si vous batissez votre gestion quotidienne exclusivement autour d'un outil gratuit sans
              modele economique stabilise, prevoyez un plan B (export de vos donnees, alternative connue)
              au cas ou les conditions changeraient. RestauMargin, a l'inverse, fonctionne sur un modele
              d'abonnement etabli depuis plusieurs annees : le prix de 29€/mois est stable et connu a
              l'avance, sans surprise a anticiper.
            </p>
          </div>

          <Callout type="warning">
            <strong>A verifier avant de vous engager sur un outil gratuit :</strong> la possibilite
            d'exporter vos fiches techniques et vos donnees fournisseurs a tout moment, pour ne jamais
            etre bloque si l'editeur change son modele economique.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Prix sur 12 mois ═════════════ */}
        <section id="prix" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="7">
            Comparaison de prix sur 12 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              A date du 10 septembre 2026, la comparaison de prix est simple : Marge Brut est gratuit,
              RestauMargin est payant des le premier jour (apres 7 jours d'essai). La question pertinente
              n'est donc pas seulement le prix affiche aujourd'hui, mais le perimetre fonctionnel couvert
              pour ce prix.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-4 font-bold">Formule</th>
                  <th className="text-right py-4 px-4 font-bold">Prix mensuel</th>
                  <th className="text-right py-4 px-4 font-bold">Prix annuel</th>
                  <th className="text-right py-4 px-4 font-bold">Stock + menu engineering + HACCP ?</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">Marge Brut (phase de dev)</td>
                  <td className="py-3 px-4 text-right">0€</td>
                  <td className="py-3 px-4 text-right">0€</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">Non</td>
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
              Sur le seul critere du prix affiche aujourd'hui, Marge Brut est imbattable : 0€ contre 348€
              par an chez RestauMargin Pro. Mais cette comparaison ne dit rien du perimetre : le stock, le
              menu engineering et le HACCP digital, inclus chez RestauMargin, n'ont pas d'equivalent public
              chez Marge Brut a ce jour. Si votre besoin se limite au food cost, aux factures et a la
              tresorerie, Marge Brut couvre deja l'essentiel gratuitement.
            </p>
          </div>

          <Callout type="info">
            <strong>Le saviez-vous ?</strong> Marge Brut cite lui-meme une marge nette mediane de 3% en
            restauration en 2024, et 8 714 defaillances sectorielles la meme annee (+10% sur un an). Dans
            ce contexte, chaque euro de food cost non suivi pese lourd — quel que soit l'outil choisi pour
            le suivre, l'important est de le faire des le premier jour.
          </Callout>
        </section>

        <BlogAuthor publishedDate="2026-09-10" readTime="11 min" variant="footer" />

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
              La meilleure façon de savoir si RestauMargin est la bonne alternative à Marge Brut pour
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
            <Link to="/alternative-cos-kitchen" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Alternative COS Kitchen</h3>
              <p className="text-xs text-mono-500">Comparatif RestauMargin vs COS Kitchen : freemium vs plateforme complète.</p>
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

function MBBadge() {
  return (
    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">M</div>
  );
}

function ComparisonRow({ label, rm, mb, winner }: {
  label: string;
  rm: boolean | string;
  mb: boolean | string;
  winner: 'rm' | 'mb' | 'tie';
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
      <td className={`py-3.5 px-4 text-center ${winner === 'mb' ? 'bg-blue-50' : ''}`}>
        {renderCell(mb, winner === 'mb')}
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
