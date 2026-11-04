import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, DollarSign, Target, BookOpen, Lightbulb, Users, Zap, Sparkles, Scale, XCircle, Building2 } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Comparatif SEO — "RestauMargin : la meilleure alternative à Zenchef"
   Mot-clé principal : alternative zenchef
   Mots-clés secondaires : zenchef vs, restaumargin vs zenchef, alternative zenchef pas cher
   ~2 800 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Peut-on utiliser RestauMargin et Zenchef en parallèle ?",
    answer: "Oui, les deux outils se combinent sans difficulté. Zenchef gère votre présence en ligne (réservations, marketing), tandis que RestauMargin pilote vos opérations internes (food cost, fiches techniques, marges). Les deux outils sont complémentaires : l'un capte les clients, l'autre garantit que chaque couvert servi est rentable. Aucune intégration native n'existe entre les deux, mais ils n'ont pas besoin d'échanger de données pour coexister.",
  },
  {
    question: "Combien coûte RestauMargin par rapport à Zenchef ?",
    answer: "RestauMargin commence à 29 EUR/mois (formule Pro). Zenchef démarre autour de 89 EUR/mois pour la formule Essential et peut atteindre 189 EUR/mois pour la formule Premium avec marketing avancé. Sur un an, RestauMargin coûte 348 EUR contre 1 068 à 2 268 EUR pour Zenchef. La différence de prix s'explique par les scopes différents : Zenchef inclut un site web et un module réservation, RestauMargin se concentre sur la rentabilité opérationnelle.",
  },
  {
    question: "Zenchef gère-t-il le food cost et les marges ?",
    answer: "Non. Zenchef est spécialisé dans la gestion de la relation client (réservations en ligne, fiche Google, marketing email, gestion des avis). Il n'intègre ni calcul de food cost, ni fiches techniques, ni gestion de mercuriale fournisseurs, ni menu engineering. Pour la gestion des marges, il faut un outil dédié comme RestauMargin ou un tableur Excel.",
  },
  {
    question: "Puis-je migrer mes données de Zenchef vers RestauMargin ?",
    answer: "Les deux outils ne stockent pas les mêmes données, donc la question de migration ne se pose pas vraiment. Zenchef garde vos réservations et votre base clients ; RestauMargin gère vos ingrédients, recettes, fiches techniques et factures. Vous pouvez tout à fait conserver Zenchef pour les réservations et ajouter RestauMargin par-dessus sans rien casser.",
  },
  {
    question: "RestauMargin propose-t-il un module réservation en ligne ?",
    answer: "Non, ce n'est pas dans notre scope. Nous nous concentrons sur la gestion opérationnelle et la rentabilité (marges, food cost, fiches techniques, IA d'optimisation). Si vous avez besoin d'un module réservation, Zenchef, TheFork ou SevenRooms sont des choix solides. RestauMargin s'utilise sans difficulté en parallèle de l'un de ces outils.",
  },
  {
    question: "Y a-t-il un essai gratuit chez RestauMargin et chez Zenchef ?",
    answer: "RestauMargin offre 7 jours d'essai gratuit, sans carte bancaire, avec accès à toutes les fonctionnalités (food cost, IA, mercuriale, multi-restaurant). Zenchef ne propose pas d'essai gratuit standard, mais une démo personnalisée avec un commercial. RestauMargin permet donc de tester réellement le produit avant de payer, sans interaction commerciale obligatoire.",
  },
  {
    question: "Quelle alternative à Zenchef est la plus adaptée à un restaurant indépendant ?",
    answer: "Pour un restaurant indépendant qui souhaite reprendre le contrôle de ses marges sans exploser son budget logiciel, RestauMargin est un excellent choix. Pour la partie réservation, TheFork (gratuit jusqu'à un certain volume) ou Resy (modèle freemium) sont des alternatives plus accessibles que Zenchef.",
  },
  {
    question: "Comment RestauMargin se compare-t-il à Zenchef sur la qualité du support ?",
    answer: "Les deux outils proposent un support en français par email et chat. RestauMargin inclut le support dans toutes les formules, y compris la formule Pro à 29 EUR. Zenchef réserve une partie de son accompagnement (formation, onboarding personnalisé) aux formules supérieures.",
  },
  {
    question: "Existe-t-il une intégration entre RestauMargin et un logiciel de caisse ?",
    answer: "RestauMargin se connecte aux principaux logiciels de caisse français (Tiller, L'Addition, Lightspeed Restaurant, Sumup) pour importer automatiquement les ventes et calculer les marges réelles par plat vendu. Zenchef, lui, s'intègre principalement avec les systèmes de réservation et les CRM marketing. Les deux outils répondent à des besoins différents et peuvent être branchés sur la même caisse sans conflit.",
  },
  {
    question: "Quel est le meilleur outil pour un groupe de plusieurs restaurants ?",
    answer: "RestauMargin gère nativement les multi-restaurants avec une vue consolidée (food cost groupe, comparaison entre établissements, alertes sur dérive de marges). Zenchef propose aussi une vue groupe pour la partie réservation et marketing. Pour un groupe de 3 à 10 restaurants, il est possible de combiner les deux : RestauMargin pour piloter les marges par établissement, Zenchef pour centraliser la gestion clientèle.",
  },
];

export default function AlternativeZenchef() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Alternative Zenchef : RestauMargin (29€/mois) | Comparatif 2026"
        description="Vous cherchez une alternative à Zenchef plus abordable et plus complète ? RestauMargin offre gestion des marges + food cost + IA dès 29€/mois. Comparatif complet."
        path="/alternative-zenchef"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Comparatifs', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Alternative Zenchef', url: 'https://www.restaumargin.fr/alternative-zenchef' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'RestauMargin : la meilleure alternative à Zenchef en 2026',
            description: "Comparatif détaillé entre RestauMargin (29 EUR/mois, gestion des marges + IA) et Zenchef (89-189 EUR/mois, réservations + marketing). Tableau 15 critères, cas d'usage, FAQ.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 2800,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/alternative-zenchef' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Comparatif Zenchef vs RestauMargin',
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
                  name: 'Zenchef',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web, iOS, Android',
                  offers: {
                    '@type': 'Offer',
                    price: '89',
                    priceCurrency: 'EUR',
                    priceSpecification: {
                      '@type': 'UnitPriceSpecification',
                      price: '89',
                      priceCurrency: 'EUR',
                      unitText: 'MONTH',
                    },
                  },
                  description: "Plateforme de réservation en ligne, site web restaurant, marketing email et gestion de la relation client pour la restauration.",
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
          <span className="text-mono-100 font-medium">Alternative Zenchef</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Comparatif"
        readTime="12 min"
        date="Mai 2026"
        title="RestauMargin : la meilleure alternative à Zenchef en 2026"
        accentWord="alternative à Zenchef"
        subtitle="Vous cherchez une alternative à Zenchef plus abordable, plus complète sur la gestion des marges et plus accessible ? Voici un comparatif honnête et détaillé entre les deux outils, avec un tableau de 15 critères et plusieurs cas d'usage concrets."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="12 min" variant="header" />

        {/* ── Encadre TL;DR (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">En 30 secondes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Zenchef vs RestauMargin : la réponse rapide
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3 text-sm sm:text-base">
            <p className="leading-relaxed">
              <strong className="text-white">Zenchef</strong> est un excellent outil pour la <strong>réservation en ligne et le marketing</strong>. Tarif : 89 à 189 EUR/mois. Il ne gère ni food cost, ni fiches techniques, ni marges.
            </p>
            <p className="leading-relaxed">
              <strong className="text-white">RestauMargin</strong> est une alternative à Zenchef pour ceux qui veulent <strong>gérer leurs marges, leur food cost et leurs fournisseurs</strong>, avec IA et mobile, à 29 EUR/mois. Pas de module réservation.
            </p>
            <p className="leading-relaxed pt-2 border-t border-white/20">
              <strong className="text-white">Verdict :</strong> les deux outils sont complémentaires, pas concurrents. Si vous devez choisir, RestauMargin si la priorité est la rentabilité ; Zenchef si la priorité est l'acquisition client.
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
              { href: '#pourquoi', label: "Pourquoi chercher une alternative à Zenchef ?" },
              { href: '#zenchef', label: "Vue d'ensemble : Zenchef en 2026" },
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

        {/* ═════════════ SECTION 1 : Pourquoi alternative ═════════════ */}
        <section id="pourquoi" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Pourquoi chercher une alternative à Zenchef ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Zenchef est un acteur historique de la restauration en France. Lancé en 2010, il s'est imposé
              comme l'une des solutions de référence pour la <strong>réservation en ligne</strong>, la
              création de site web restaurant et la gestion marketing. De nombreux restaurateurs l'utilisent
              quotidiennement avec satisfaction. Alors pourquoi tant de recherches autour du terme
              "alternative Zenchef" en 2026 ?
            </p>
            <p>
              Trois raisons expliquent en général cette recherche :
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 mt-8">
            <ReasonCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Le prix"
              desc="89 à 189 EUR/mois selon la formule, soit 1 068 à 2 268 EUR/an. Pour un restaurant indépendant qui démarre ou qui doit serrer son budget logiciel, c'est un poste de dépense significatif."
            />
            <ReasonCard
              icon={<XCircle className="w-6 h-6" />}
              title="Le scope limité"
              desc="Zenchef est excellent pour les réservations et le marketing, mais ne couvre ni le food cost, ni les fiches techniques, ni la gestion des marges. Il faut un deuxième outil pour ces fonctions critiques."
            />
            <ReasonCard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="La complexité"
              desc="L'interface peut sembler chargée et l'onboarding long. Les fonctionnalités avancées (marketing automation, segmentation) demandent du temps de formation."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              Soyons clairs : ces points ne font pas de Zenchef un mauvais produit. Ils signifient simplement
              qu'il ne correspond pas à tous les besoins. Un restaurant gastronomique parisien avec un fort
              volume de réservations et un budget marketing significatif y trouvera une valeur énorme. Un
              bistrot de quartier qui veut surtout reprendre le contrôle de sa marge sur chaque plat aura
              davantage besoin d'un outil comme RestauMargin.
            </p>
            <p>
              C'est cette différence de scope qui explique pourquoi nous nous présentons comme une
              <strong> alternative à Zenchef</strong> pour la partie gestion opérationnelle, sans prétendre
              remplacer son module réservation. Voyons ces deux approches en détail.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Vue d'ensemble Zenchef ═════════════ */}
        <section id="zenchef" className="mb-16">
          <SectionHeading icon={<Building2 className="w-6 h-6" />} number="2">
            Vue d'ensemble : Zenchef en 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              Zenchef est positionné comme une <strong>plateforme tout-en-un pour la relation client en
              restauration</strong>. Le coeur du produit est le module de réservation en ligne, complété par
              un site web restaurant, des outils marketing et un CRM clientèle. Plus de 8 000 restaurants
              l'utilisent en Europe selon leur site officiel.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Points forts de Zenchef</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-emerald-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Module réservation en ligne mature, intégré à Google et TripAdvisor</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Création de site web restaurant clé en main</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Marketing email et SMS automatisé (campagnes d'anniversaire, relances)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Gestion centralisée des avis clients (Google, TripAdvisor, La Fourchette)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>CRM avec segmentation et historique client détaillé</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Marque établie, support en français, accompagnement personnalisé</span></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Limites de Zenchef</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-amber-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Aucun calcul de food cost ni gestion de marges</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de fiches techniques pour les recettes</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de mercuriale fournisseurs ni d'historique de prix</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de menu engineering ni d'analyse Boston Matrix</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Tarif élevé pour un restaurant indépendant (89 à 189 EUR/mois)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas d'essai gratuit standard, démo commerciale obligatoire</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>À noter :</strong> Zenchef a annoncé en 2024 plusieurs partenariats avec des
            solutions de caisse pour offrir un suivi des ventes par couvert, mais l'analyse de marge
            par plat reste hors de leur scope produit. La rentabilité opérationnelle n'est pas leur
            promesse.
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
              opérationnelle et la rentabilité</strong> en restauration. Notre promesse tient en une phrase :
              chaque plat servi doit être rentable, et vous devez le savoir en temps réel. Notre coeur métier
              couvre les marges, le food cost, les fiches techniques, la mercuriale fournisseurs et
              l'optimisation par IA.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Points forts de RestauMargin</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-emerald-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Calcul automatique du food cost et de la marge brute, par plat et global</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Fiches techniques digitales illimitées, avec ingrédients pesés et rendements</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Mercuriale fournisseurs intégrée, avec historique de prix et alertes</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>19 actions IA pour suggérer recettes, optimiser marges, détecter anomalies</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Multi-restaurant natif avec vue consolidée</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>PWA mobile + mode kiosk + scan de factures par OCR</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>29 EUR/mois, essai 7 jours sans carte bancaire</span></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Ce que RestauMargin ne fait pas</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-amber-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de module de réservation en ligne (utilisez TheFork, Resy ou Zenchef)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de création de site web restaurant</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de marketing email automatisé (campagnes anniversaire, etc.)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de gestion centralisée des avis Google et TripAdvisor</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de fiche Google My Business intégrée</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de SMS de rappel client</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Notre conviction :</strong> un bon outil fait une chose excellemment. RestauMargin
            est conçu pour la gestion des marges et de la rentabilité opérationnelle. Si votre besoin
            principal est la réservation et le marketing, Zenchef ou TheFork seront plus adaptés.
            L'idéal pour beaucoup de restaurants est de combiner les deux types d'outils.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Tableau comparatif ═════════════ */}
        <section id="tableau" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
            Tableau comparatif détaillé (15 critères)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici une comparaison point par point entre Zenchef et RestauMargin, organisée par catégorie
              fonctionnelle. Les croix et les coches reflètent uniquement la présence d'une fonctionnalité
              dans le produit, pas un jugement de valeur.
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
                      <Calendar2 />
                      Zenchef
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <ComparisonRow label="Prix mensuel (entry)" rm="29 EUR/mois" zc="89 EUR/mois" winner="rm" />
                <ComparisonRow label="Prix mensuel (top)" rm="79 EUR/mois (Business)" zc="189 EUR/mois (Premium)" winner="rm" />
                <ComparisonRow label="Essai gratuit" rm="7 jours, sans CB" zc="Démo commerciale" winner="rm" />
                <ComparisonRow label="Calcul food cost" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Fiches techniques" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Gestion des stocks" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Mercuriale fournisseurs" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="IA + suggestions" rm="19 actions IA" zc="Limitée au marketing" winner="rm" />
                <ComparisonRow label="Menu engineering" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="HACCP digital" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Réservations en ligne" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Site web restaurant" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Marketing email/SMS" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Gestion avis Google" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Multi-restaurant" rm={true} zc={true} winner="tie" />
                <ComparisonRow label="Mobile / PWA kiosk" rm="PWA + mode kiosk balance" zc="App mobile classique" winner="rm" />
                <ComparisonRow label="Scan de factures (OCR)" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Onboarding" rm="Self-service + wizard 5 min" zc="Onboarding accompagné" winner="zc" />
                <ComparisonRow label="Support client" rm="Email + chat" zc="Email + téléphone (formules premium)" winner="tie" />
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Lecture du tableau :</strong> la victoire d'un outil sur un critère reflète la
            présence d'une fonctionnalité native, pas une note qualitative. Zenchef gagne logiquement
            sur tous les critères "acquisition client" ; RestauMargin gagne sur tous les critères
            "gestion opérationnelle et rentabilité". C'est exactement la complémentarité que nous
            décrivons depuis le début.
          </Callout>
        </section>

        {/* ═════════════ SECTION 5 : Cas d'usage ═════════════ */}
        <section id="cas-usage" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="5">
            Quel outil pour quel type de restaurateur ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Plutôt qu'un verdict unique, voici trois scénarios types.
              Identifiez le profil le plus proche du vôtre.
            </p>
          </div>

          <div className="grid gap-6 mt-8">
            <ScenarioCard
              badge="Profil 1"
              title="Vous êtes un restaurant indépendant qui veut maîtriser ses marges"
              recommendation="RestauMargin uniquement"
              recoColor="emerald"
              desc="Vous avez déjà un module réservation (TheFork gratuit, page Google Réservation, ou tout simplement le téléphone) et votre vrai problème est le food cost qui dérive avec l'inflation. RestauMargin résout ce problème pour 29 EUR/mois sans vous obliger à payer pour des fonctions que vous n'utilisez pas. Économie annuelle estimée vs Zenchef Essential : 720 EUR."
            />
            <ScenarioCard
              badge="Profil 2"
              title="Vous êtes un restaurant gastronomique avec un fort volume de réservations"
              recommendation="Zenchef + RestauMargin en complément"
              recoColor="blue"
              desc="Vos couverts dépendent fortement des réservations en ligne et du marketing automatisé. Zenchef est légitime pour piloter cette partie. Mais vous voulez aussi suivre vos marges plat par plat et savoir si votre carte est rentable. Ajoutez RestauMargin (29 EUR/mois) en parallèle : les deux outils se complètent parfaitement, sans intégration nécessaire."
            />
            <ScenarioCard
              badge="Profil 3"
              title="Vous êtes un groupe de 3 à 10 restaurants"
              recommendation="RestauMargin (Business) + Zenchef Premium"
              recoColor="purple"
              desc="Vous avez besoin d'une vue consolidée des marges et d'un benchmarking entre établissements (RestauMargin Business à 79 EUR/mois multi-resto). Vous avez aussi besoin d'une gestion centralisée des réservations et d'une marque uniforme sur le web (Zenchef Premium)."
            />
          </div>

          <Callout type="info">
            <strong>Notre engagement :</strong> si après avoir testé RestauMargin pendant les 7 jours
            d'essai vous constatez que votre vrai besoin est la réservation et non la gestion des
            marges, nous vous recommandons honnêtement d'aller chez Zenchef ou TheFork. Notre objectif
            est que vous ayez le bon outil pour votre besoin, pas que vous payiez RestauMargin par
            défaut.
          </Callout>
        </section>


        {/* ═════════════ SECTION 7 : Prix sur 12 mois ═════════════ */}
        <section id="prix" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="6">
            Comparaison de prix sur 12 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'écart de prix annuel entre les deux solutions est significatif. Voici le détail
              comparé sur un an pour les formules d'entrée et les formules haut de gamme.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-4 font-bold">Formule</th>
                  <th className="text-right py-4 px-4 font-bold">Prix mensuel</th>
                  <th className="text-right py-4 px-4 font-bold">Prix annuel</th>
                  <th className="text-right py-4 px-4 font-bold">Écart vs RestauMargin</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-emerald-50 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-emerald-900">RestauMargin Pro</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">29 EUR</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">348 EUR</td>
                  <td className="py-3 px-4 text-right text-emerald-700">Référence</td>
                </tr>
                <tr className="bg-emerald-50/40 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-emerald-900">RestauMargin Business</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">79 EUR</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">948 EUR</td>
                  <td className="py-3 px-4 text-right text-emerald-700">+ 600 EUR</td>
                </tr>
                <tr className="bg-white border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">Zenchef Essential</td>
                  <td className="py-3 px-4 text-right">89 EUR</td>
                  <td className="py-3 px-4 text-right">1 068 EUR</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">+ 720 EUR</td>
                </tr>
                <tr className="bg-mono-1000 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">Zenchef Standard</td>
                  <td className="py-3 px-4 text-right">139 EUR</td>
                  <td className="py-3 px-4 text-right">1 668 EUR</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">+ 1 320 EUR</td>
                </tr>
                <tr className="bg-white border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">Zenchef Premium</td>
                  <td className="py-3 px-4 text-right">189 EUR</td>
                  <td className="py-3 px-4 text-right">2 268 EUR</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">+ 1 920 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              L'économie annuelle se situe entre <strong>720 EUR et 1 920 EUR</strong> selon la
              formule Zenchef à laquelle on compare RestauMargin. Encore une fois, ces économies ne
              sont valables que si vos besoins sont alignés avec le scope de RestauMargin. Si vous
              avez besoin du module réservation et du marketing de Zenchef, le coût supplémentaire
              est justifié par le service rendu.
            </p>
            <p>
              Si vous combinez les deux outils (Zenchef Essential 89 EUR + RestauMargin Pro 29 EUR
              = 118 EUR/mois soit 1 416 EUR/an), vous obtenez un système complet
              <strong> acquisition client + rentabilité opérationnelle</strong> pour moins cher
              qu'une formule Zenchef Standard seule.
            </p>
          </div>

          <Callout type="info">
            <strong>Le saviez-vous ?</strong> Un restaurant qui améliore son food cost de 2 points
            (par exemple de 32 % à 30 %) sur un chiffre d'affaires de 400 000 EUR gagne
            <strong> 8 000 EUR de marge brute supplémentaire par an</strong>. RestauMargin se
            rentabilise donc dès le premier mois d'utilisation sérieuse.
          </Callout>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="12 min" variant="footer" />

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
              La meilleure façon de savoir si RestauMargin est la bonne alternative à Zenchef pour
              votre restaurant, c'est de l'essayer. Sans carte bancaire, sans engagement.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> à partir du 8e jour si vous décidez de continuer.
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
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Coefficient multiplicateur</h3>
              <p className="text-xs text-mono-500">Tableaux par catégorie, erreurs courantes et cas pratique chiffré.</p>
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

function Calendar2() {
  return (
    <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-bold text-white">Z</div>
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
