import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, DollarSign, Target, BookOpen, Lightbulb, Users, Zap, Sparkles, Scale, XCircle, Building2, Package, Wallet } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

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
    answer: "Marge Brut (margebrut.fr) est un logiciel français de gestion et pilotage pour restaurateurs indépendants, axé sur le contrôle du food cost, des marges et de la rentabilité. Il propose des fiches techniques avec prix de revient au centime, une lecture par IA des factures fournisseurs, un P&L quotidien et une trésorerie projetée sur 13 semaines.",
  },
  {
    question: "Marge Brut est-il vraiment gratuit ?",
    answer: "Oui, au 10 septembre 2026, Marge Brut est entièrement gratuit, sans carte bancaire requise et sans fonctionnalité bridée, pendant sa phase de développement active. L'éditeur ne communique aucune date de passage à un modèle payant sur son site public — c'est un point important à surveiller si vous bâtissez votre gestion quotidienne sur cet outil.",
  },
  {
    question: "Quelle est la différence entre Marge Brut et RestauMargin ?",
    answer: "Marge Brut est un outil jeune, gratuit pendant sa phase de développement, avec un périmètre orienté pilotage financier : food cost, P&L, trésorerie, factures IA et gestion d'équipe. RestauMargin est une plateforme payante (19 €/mois, tarif public fixe, offre unique) qui ajoute la mercuriale fournisseurs avec alertes de hausse de prix, la gestion de stock complète, le menu engineering (matrice Boston), le HACCP digital et 19 actions IA — des fonctionnalités que Marge Brut ne mentionne pas sur son site.",
  },
  {
    question: "Marge Brut propose-t-il la gestion de stock et le menu engineering ?",
    answer: "Non, ni la gestion de stock (inventaire, valorisation, alertes de rupture) ni le menu engineering (classement des plats stars/vaches à lait/énigmes/poids morts) ne figurent parmi les fonctionnalités publiées de Marge Brut au 10 septembre 2026. RestauMargin inclut les deux dans l'offre unique à 19 €/mois.",
  },
  {
    question: "Marge Brut gère-t-il le HACCP et la conformité hygiène ?",
    answer: "Aucune fonctionnalité HACCP (relevés de température, checklists hygiène, traçabilité) n'est mentionnée sur le site de Marge Brut. RestauMargin propose un module HACCP digital inclus dans son abonnement, ce qui évite de jongler entre plusieurs outils pour la gestion financière et la conformité réglementaire.",
  },
  {
    question: "Marge Brut restera-t-il gratuit longtemps ?",
    answer: "L'éditeur communique une gratuité pendant la phase de développement, sans engagement ni date annoncée de bascule vers un modèle payant. C'est une situation fréquente chez les jeunes éditeurs SaaS : le produit est gratuit le temps d'acquérir des utilisateurs et des retours, puis un modèle payant est introduit une fois la base installée. Rien ne garantit que les fonctionnalités actuellement gratuites le resteront indéfiniment.",
  },
  {
    question: "Quel outil gère le mieux les fournisseurs ?",
    answer: "Marge Brut propose une lecture IA des factures fournisseurs avec contrôle des livraisons et quantification des écarts en euros — une fonctionnalité solide. RestauMargin va plus loin avec une mercuriale fournisseurs complète : historique de prix par produit et par fournisseur, alertes automatiques dès qu'un prix augmente, et scan OCR des factures, le tout inclus dès le premier palier payant.",
  },
  {
    question: "Marge Brut convient-il à un groupe de plusieurs restaurants ?",
    answer: "Pas encore de manière native : la vue multi-établissements figure dans la roadmap \"à venir\" de Marge Brut, sans date de disponibilité publiée. RestauMargin gère déjà le multi-restaurant avec une vue consolidée des marges dans la même offre unique à 19 €/mois.",
  },
  {
    question: "Puis-je migrer mes données de Marge Brut vers RestauMargin ?",
    answer: "Les deux outils manipulent le même type de données de base (ingrédients, recettes, fiches techniques, fournisseurs). Une migration manuelle est possible en reprenant vos fiches techniques existantes. Notre équipe support peut vous accompagner pour ce transfert pendant votre essai gratuit de 7 jours.",
  },
  {
    question: "Quel outil choisir pour débuter sans budget ?",
    answer: "Si votre priorité absolue est de ne rien dépenser tant que votre activité se stabilise, Marge Brut est un choix légitime : c'est aujourd'hui un outil gratuit et fonctionnel pour le food cost, les factures et la trésorerie. Si vous gériez déjà une carte complète avec fournisseurs multiples et que vous voulez aussi le stock, le menu engineering et le HACCP dans un seul outil, l'essai gratuit de 7 jours de RestauMargin vous permet de comparer sans engagement.",
  },
];

export default function AlternativeMargeBrut() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Alternative Marge Brut : RestauMargin, la gestion complète | 2026"
        description="Marge Brut est gratuit en phase de développement. RestauMargin ajoute mercuriale, stock, menu engineering et HACCP pour 19 €/mois. Comparatif détaillé et honnête."
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
            description: "Comparatif détaillé entre RestauMargin (19 EUR/mois, plateforme opérationnelle complète) et Marge Brut (gratuit en phase de développement, pilotage financier). Tableau 15 critères, cas d'usage, FAQ.",
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
                    price: '19',
                    priceCurrency: 'EUR',
                    priceSpecification: {
                      '@type': 'UnitPriceSpecification',
                      price: '19',
                      priceCurrency: 'EUR',
                      unitText: 'MONTH',
                    },
                  },
                  description: "Gestion des marges, food cost, fiches techniques, mercuriale fournisseurs, stock et IA d'optimisation pour restaurateurs indépendants et groupes.",
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
                  description: "Logiciel gratuit de food cost, factures IA, P&L et trésorerie pour restaurateurs indépendants, en phase de développement active.",
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
        subtitle="Marge Brut propose un outil de pilotage financier entièrement gratuit pendant sa phase de développement. Voici un comparatif honnête pour savoir si cette gratuité suffit à votre restaurant, ou si une plateforme opérationnelle complète comme RestauMargin est le meilleur choix."
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
              <strong className="text-white">Marge Brut</strong> est un <strong>outil gratuit de pilotage financier</strong> en phase de développement active : food cost, factures lues par IA, P&L quotidien et trésorerie projetée, sans aucun coût ni carte bancaire.
            </p>
            <p className="leading-relaxed">
              <strong className="text-white">RestauMargin</strong> est une <strong>plateforme opérationnelle complète</strong> à 19 €/mois : food cost, mercuriale fournisseurs avec alertes, gestion de stock, menu engineering, HACCP digital et 19 actions IA, tout inclus.
            </p>
            <p className="leading-relaxed pt-2 border-t border-white/20">
              <strong className="text-white">Verdict :</strong> pour tester le pilotage financier sans dépenser un centime, Marge Brut est un excellent point d'entrée. Pour piloter stock, fournisseurs, carte et hygiène dans un seul outil, RestauMargin couvre un périmètre plus large.
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
              Marge Brut (margebrut.fr) est un outil récent qui s'est fait remarquer sur les requêtes
              liées au calcul de marge et de food cost, avec une promesse forte : un logiciel de gestion
              complet, gratuit sans limite de temps ni carte bancaire, pendant que l'équipe le développe.
              Pour un restaurateur qui cherche à arrêter les tableurs Excel sans engager de budget
              logiciel, c'est une offre séduisante.
            </p>
            <p>
              Mais "gratuit pendant la phase de développement" et "plateforme payante à tarif fixe" ne
              couvrent pas exactement le même périmètre ni la même promesse de pérennité. Trois questions
              se posent quand on hésite entre les deux :
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 mt-8">
            <ReasonCard
              icon={<Package className="w-6 h-6" />}
              title="Le stock et le menu engineering"
              desc="Aucune gestion de stock ni classement des plats (matrice Boston) n'est mentionnée sur le site public de Marge Brut au 10 septembre 2026."
            />
            <ReasonCard
              icon={<Wallet className="w-6 h-6" />}
              title="La durée de la gratuité"
              desc="Marge Brut est gratuit pendant sa phase de développement, sans date de bascule vers un modèle payant annoncée publiquement. C'est un choix d'éditeur courant chez les jeunes SaaS, à anticiper."
            />
            <ReasonCard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="Le multi-restaurant et le HACCP"
              desc="La vue multi-établissements figure dans la roadmap 'à venir' de Marge Brut. Aucun module HACCP digital n'est mentionné non plus."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              Soyons justes : ces manques ne font pas de Marge Brut un mauvais outil, bien au contraire.
              La lecture IA des factures fournisseurs, la trésorerie projetée sur 13 semaines et le P&L
              quotidien sont des fonctionnalités solides, rarement offertes gratuitement ailleurs. Le
              problème se pose quand votre besoin dépasse le pilotage financier pur : gérer un stock,
              classer vos plats par rentabilité, digitaliser votre HACCP, ou ouvrir un deuxième
              établissement.
            </p>
            <p>
              C'est cette différence de périmètre qui explique pourquoi nous nous présentons comme une
              <strong> alternative à Marge Brut</strong> pour les restaurateurs qui veulent une plateforme
              opérationnelle complète. Voyons les deux
              approches en détail.
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
              restaurateurs indépendants — restaurants, bistrots, bars à vin, brasseries et cafés. Le
              produit met en avant sa gratuité totale ("gratuit pour tous les restaurateurs, sans carte
              bancaire") pendant sa phase de développement actuelle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Points forts de Marge Brut</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-emerald-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Entièrement gratuit, sans carte bancaire, sans limite de temps</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Food cost en temps réel par recette et par produit</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Lecture IA des factures fournisseurs et contrôle des livraisons</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>P&L quotidien avec export PDF</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Trésorerie projetée sur 13 semaines</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Gestion d'équipe, planning, congés et extras incluse</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Cave à vin et tarification au verre/bouteille</span></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Limites de Marge Brut</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-amber-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Aucune date de bascule vers un modèle payant communiquée</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Aucune gestion de stock ou d'inventaire mentionnée</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de menu engineering (matrice Boston)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de module HACCP digital identifié</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Multi-établissements encore "à venir", sans date</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Intégration caisse encore "en développement"</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>À noter :</strong> les informations ci-dessus sont issues du site public
            margebrut.fr consulté le 10 septembre 2026. Marge Brut cite lui-même des chiffres du secteur
            (8 714 défaillances en restauration en 2024, +10% sur un an ; marge nette médiane de 3% en
            2024) pour justifier son approche centrée sur le pilotage financier. Si une fonctionnalité
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
              opérationnelle et la rentabilité</strong> en restauration. Contrairement à un outil de
              pilotage financier seul, notre plateforme couvre l'ensemble du cycle : ingrédients, fiches
              techniques, mercuriale fournisseurs, stock, marges par plat et par carte, menu engineering,
              HACCP et optimisation par IA — tout inclus dès le premier palier payant.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Points forts de RestauMargin</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-emerald-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Fiches techniques et menus illimités dans l'offre unique (19 €/mois)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Mercuriale fournisseurs avec historique de prix et alertes, incluse dès l'entrée</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Gestion de stock complète (inventaire, valorisation, alertes rupture)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>19 actions IA : suggestions recettes, optimisation marges, détection d'anomalies</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Menu engineering (matrice Boston) et HACCP digital inclus</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Multi-restaurant natif avec vue consolidée (inclus)</span></li>
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
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de gestion de cave à vin dédiée au verre près</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de planning d'équipe / congés intégré nativement</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de trésorerie projetée sur 13 semaines dédiée</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de module de réservation en ligne (utilisez TheFork ou Zenchef)</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Notre conviction :</strong> si votre priorité est le pilotage financier pur
            (trésorerie, P&L, factures) sans budget logiciel, Marge Brut est un choix légitime et bien
            construit. RestauMargin est conçu pour les restaurateurs qui veulent piloter aussi leur carte,
            leur stock, leurs fournisseurs et leur conformité hygiène dans un seul outil.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Tableau comparatif ═════════════ */}
        <section id="tableau" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
            Tableau comparatif détaillé (15 critères)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici une comparaison point par point entre Marge Brut et RestauMargin, basée sur les
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
                <ComparisonRow label="Prix actuel" rm="19 €/mois" mb="0€ (phase de dev)" winner="mb" />
                <ComparisonRow label="Pérennité du prix" rm="Tarif public fixe (19 €/mois)" mb="Aucune date de bascule payante communiquée" winner="rm" />
                <ComparisonRow label="Essai / accès complet sans CB" rm="7 jours, toutes fonctions" mb="Accès complet gratuit" winner="tie" />
                <ComparisonRow label="Food cost temps réel" rm={true} mb={true} winner="tie" />
                <ComparisonRow label="Lecture IA des factures" rm={true} mb={true} winner="tie" />
                <ComparisonRow label="Mercuriale fournisseurs + alertes prix" rm={true} mb="Contrôle écarts uniquement" winner="rm" />
                <ComparisonRow label="Gestion de stock / inventaire" rm={true} mb={false} winner="rm" />
                <ComparisonRow label="P&L quotidien" rm={true} mb={true} winner="tie" />
                <ComparisonRow label="Trésorerie projetée" rm={false} mb="13 semaines" winner="mb" />
                <ComparisonRow label="Menu engineering (matrice Boston)" rm={true} mb={false} winner="rm" />
                <ComparisonRow label="HACCP digital" rm={true} mb={false} winner="rm" />
                <ComparisonRow label="Multi-restaurant" rm={true} mb="À venir (sans date)" winner="rm" />
                <ComparisonRow label="Gestion d'équipe / planning" rm={false} mb={true} winner="mb" />
                <ComparisonRow label="Cave à vin / tarification verre" rm={false} mb={true} winner="mb" />
                <ComparisonRow label="Mobile / PWA kiosk" rm="PWA + mode kiosk balance" mb="Non précisé" winner="rm" />
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Lecture du tableau :</strong> Marge Brut gagne sur le prix immédiat et sur des
            fonctionnalités de pilotage RH/trésorerie que RestauMargin ne propose pas. RestauMargin gagne
            sur la profondeur opérationnelle (stock, mercuriale, menu engineering, HACCP, multi-restaurant)
            et sur la lisibilité d'un tarif payant déjà fixe.
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
              title="Vous démarrez et votre priorité est de ne rien dépenser"
              recommendation="Marge Brut"
              recoColor="blue"
              desc="Vous ouvrez ou reprenez un établissement et le budget logiciel n'est pas la priorité du moment. Marge Brut vous donne accès gratuitement à du pilotage financier sérieux (food cost, factures, trésorerie) sans aucun engagement."
            />
            <ScenarioCard
              badge="Profil 2"
              title="Vous gérez une carte complète avec fournisseurs et stock actifs"
              recommendation="RestauMargin (Pro)"
              recoColor="emerald"
              desc="Votre carte dépasse 15-20 plats, vous devez suivre un stock et être alerté dès qu'un fournisseur augmente ses prix, et vous voulez classer vos plats par rentabilité. Aucune de ces trois briques n'est publiée chez Marge Brut à ce jour."
            />
            <ScenarioCard
              badge="Profil 3"
              title="Vous êtes soumis à des contrôles hygiène réguliers ou gérez plusieurs adresses"
              recommendation="RestauMargin"
              recoColor="purple"
              desc="Le HACCP digital et le multi-restaurant sont deux briques structurantes chez RestauMargin, absentes ou encore en roadmap chez Marge Brut. Pour un groupe ou un établissement soumis à des contrôles fréquents, c'est un critère de choix direct."
            />
          </div>

          <Callout type="info">
            <strong>Notre engagement :</strong> Marge Brut est un outil récent, bien construit sur son
            périmètre, et sa gratuité actuelle est un atout réel pour démarrer sans risque. Notre objectif
            est que vous choisissiez l'outil adapté à votre besoin réel, pas que vous payiez RestauMargin
            par défaut.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : La gratuite en question ═════════════ */}
        <section id="modele-eco" className="mb-16">
          <SectionHeading icon={<Wallet className="w-6 h-6" />} number="6">
            La gratuité de Marge Brut : ce qu'il faut savoir
          </SectionHeading>

          <div className="prose-content">
            <p>
              Marge Brut communique clairement sur sa gratuité : l'outil est "en développement actif" et
              gratuit pour tous les restaurateurs, sans carte bancaire, sans limite de temps annoncée. Ce
              n'est pas une période d'essai déguisée — c'est un choix de positionnement assumé par
              l'éditeur, courant chez les jeunes SaaS qui construisent leur base d'utilisateurs avant
              d'introduire un modèle payant.
            </p>
            <p>
              Pour un restaurateur, ce choix présente deux visages. D'un côté, c'est une opportunité réelle
              de piloter son food cost et sa trésorerie sans dépenser un centime pendant cette phase. De
              l'autre, cela implique une incertitude structurelle : aucune date de bascule vers un modèle
              payant n'est publiée, ce qui signifie que les conditions (prix, fonctionnalités conservées ou
              non) pourraient évoluer sans préavis long une fois le produit sorti de sa phase de
              développement.
            </p>
            <p>
              Ce n'est pas une critique de Marge Brut — c'est une réalité à intégrer dans votre décision.
              Si vous bâtissez votre gestion quotidienne exclusivement autour d'un outil gratuit sans
              modèle économique stabilisé, prévoyez un plan B (export de vos données, alternative connue)
              au cas où les conditions changeraient. RestauMargin, à l'inverse, fonctionne sur un abonnement
              payant au tarif public : 19 €/mois, connu à l'avance.
            </p>
          </div>

          <Callout type="warning">
            <strong>À vérifier avant de vous engager sur un outil gratuit :</strong> la possibilité
            d'exporter vos fiches techniques et vos données fournisseurs à tout moment, pour ne jamais
            être bloqué si l'éditeur change son modèle économique.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Prix sur 12 mois ═════════════ */}
        <section id="prix" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="7">
            Comparaison de prix sur 12 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              À date du 10 septembre 2026, la comparaison de prix est simple : Marge Brut est gratuit,
              RestauMargin est payant dès le premier jour (après 7 jours d'essai). La question pertinente
              n'est donc pas seulement le prix affiché aujourd'hui, mais le périmètre fonctionnel couvert
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
                  <td className="py-3 px-4 font-bold text-emerald-900">RestauMargin (offre unique)</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">19 €</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">228 €</td>
                  <td className="py-3 px-4 text-right text-emerald-700 font-semibold">Oui, + multi-resto</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Sur le seul critère du prix affiché aujourd'hui, Marge Brut est imbattable : 0€ contre 228 €
              par an chez RestauMargin. Mais cette comparaison ne dit rien du périmètre : le stock, le
              menu engineering et le HACCP digital, inclus chez RestauMargin, n'ont pas d'équivalent public
              chez Marge Brut à ce jour. Si votre besoin se limite au food cost, aux factures et à la
              trésorerie, Marge Brut couvre déjà l'essentiel gratuitement.
            </p>
          </div>

          <Callout type="info">
            <strong>Le saviez-vous ?</strong> Marge Brut cite lui-même une marge nette médiane de 3% en
            restauration en 2024, et 8 714 défaillances sectorielles la même année (+10% sur un an). Dans
            ce contexte, chaque euro de food cost non suivi pèse lourd — quel que soit l'outil choisi pour
            le suivre, l'important est de le faire dès le premier jour.
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
              <strong>19 €/mois</strong> à partir du 8e jour si vous décidez de continuer.
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
              <p className="text-xs text-mono-500">Une seule offre à 19 €/mois, toutes les fonctionnalités.</p>
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
