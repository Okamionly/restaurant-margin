import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, DollarSign, Target, BookOpen, Lightbulb, Users, Zap, Sparkles, Scale, XCircle, Star, Quote, Building2 } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Comparatif SEO — "RestauMargin : alternative à Lightspeed Restaurant"
   Mot-clé principal : alternative lightspeed
   Mots-clés secondaires : lightspeed vs, restaumargin vs lightspeed, lightspeed restaurant prix
   ~2 600 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Peut-on utiliser RestauMargin et Lightspeed Restaurant en parallele ?",
    answer: "Oui, c'est meme la configuration la plus courante chez nos clients qui ont deja une caisse Lightspeed. Lightspeed Restaurant gere la prise de commande, l'encaissement et le plan de salle. RestauMargin recupere les ventes via integration ou export CSV et calcule la marge reelle par plat servi, le food cost global et l'evolution des couts ingredients. Les deux outils sont complementaires : l'un encaisse, l'autre garantit la rentabilite de chaque plat encaisse.",
  },
  {
    question: "Combien coute RestauMargin par rapport a Lightspeed Restaurant ?",
    answer: "RestauMargin demarre a 29 EUR/mois (formule Pro). Lightspeed Restaurant demarre autour de 89 EUR/mois (formule Starter, 1 caisse) et peut atteindre 200 EUR/mois et plus pour les formules Plus et Premium avec modules avances (multi-resto, KDS, advanced insights). Sur un an, RestauMargin coute 348 EUR contre 1 068 a 2 400 EUR pour Lightspeed selon la formule. La difference de prix s'explique par les scopes : Lightspeed inclut une caisse logicielle complete avec matos, RestauMargin se concentre sur la gestion de la marge.",
  },
  {
    question: "Lightspeed Restaurant calcule-t-il le food cost et les marges ?",
    answer: "Lightspeed propose des rapports de ventes detailles et un module Inventory en option qui suit la consommation theorique des ingredients. C'est une bonne base, mais ce n'est pas un outil de pilotage de marge au sens strict : pas de fiches techniques pesees au gramme, pas de mercuriale fournisseurs avec historique de prix, pas d'IA d'optimisation, pas d'alerte sur derive de food cost en temps reel. Beaucoup de restaurateurs utilisent Lightspeed pour la caisse et ajoutent un outil dedie comme RestauMargin pour la marge.",
  },
  {
    question: "Puis-je connecter RestauMargin a ma caisse Lightspeed ?",
    answer: "Oui. RestauMargin se connecte aux principaux logiciels de caisse francais et internationaux dont Lightspeed Restaurant via export CSV des ventes ou import API selon la formule Lightspeed que vous avez. Les ventes par produit sont rapatriees automatiquement, ce qui permet de calculer la marge reelle par plat en croisant prix de vente Lightspeed et cout matiere RestauMargin. L'integration prend en general 10 a 20 minutes a configurer.",
  },
  {
    question: "RestauMargin propose-t-il un module de caisse / POS ?",
    answer: "Non, ce n'est pas dans notre scope. Nous nous concentrons sur la gestion operationnelle et la rentabilite (marges, food cost, fiches techniques, IA d'optimisation). Si vous avez besoin d'une caisse complete avec encaissement, plan de salle et impression cuisine, Lightspeed Restaurant, Tiller, L'Addition ou Sumup POS sont des choix solides. Beaucoup de nos clients utilisent l'un de ces outils en parallele de RestauMargin.",
  },
  {
    question: "Y a-t-il un essai gratuit chez RestauMargin et chez Lightspeed ?",
    answer: "RestauMargin offre 7 jours d'essai gratuit, sans carte bancaire, avec acces a toutes les fonctionnalites (food cost, IA, mercuriale, multi-restaurant). Lightspeed propose une demo personnalisee avec un commercial et parfois 14 jours d'essai selon les promotions du moment, mais le processus passe systematiquement par un appel commercial. RestauMargin permet de tester reellement le produit avant de payer, sans interaction commerciale obligatoire.",
  },
  {
    question: "Quelle alternative a Lightspeed pour un restaurant qui veut surtout suivre ses marges ?",
    answer: "Si votre vrai besoin est de comprendre pourquoi votre marge brute se degrade malgre des ventes correctes, ce n'est pas une caisse plus chere qui vous aidera. RestauMargin (29 EUR/mois) couvre exactement cette problematique : fiches techniques pesees, food cost theorique vs reel, mercuriale fournisseurs avec alertes sur hausses de prix, menu engineering. Vous pouvez garder votre caisse actuelle, voire une caisse simple type Sumup POS a tres bas cout, et investir le reste du budget logiciel dans le pilotage marge.",
  },
  {
    question: "Lightspeed est-il adapte aux petits restaurants ou aux food trucks ?",
    answer: "Lightspeed Restaurant est puissant et bien adapte aux brasseries, restaurants gastronomiques, chaines et groupes multi-etablissements qui ont besoin d'une caisse complete avec plan de salle, gestion des serveurs et reporting avance. Pour un food truck ou un tres petit restaurant qui veut juste encaisser et suivre sa marge, le tarif et la complexite de Lightspeed sont souvent surdimensionnes. Une caisse legere + RestauMargin couvre 90 % du besoin pour 30 a 60 % du prix.",
  },
  {
    question: "Quelle est la difference entre l'Inventory de Lightspeed et RestauMargin ?",
    answer: "Le module Inventory de Lightspeed suit la consommation theorique des ingredients via le mapping recette / produit vendu. C'est efficace pour les stocks. Mais il ne gere pas la mercuriale fournisseur (historique de prix par fournisseur), ne propose pas d'IA de suggestion de recettes, ne fait pas de menu engineering (Boston Matrix), et n'integre pas l'OCR de factures fournisseurs. RestauMargin va plus loin sur la gestion de la marge, du cout ingredient et de l'optimisation de carte. Beaucoup de restaurateurs utilisent l'Inventory Lightspeed pour le suivi stock et RestauMargin pour le pilotage marge.",
  },
  {
    question: "Quel est le meilleur outil pour un groupe de plusieurs restaurants ?",
    answer: "Pour un groupe, la combinaison la plus efficace est : Lightspeed Restaurant Plus ou Premium pour la caisse multi-site avec consolidation des ventes, et RestauMargin Business (79 EUR/mois) pour la consolidation des marges, le benchmarking entre etablissements et les alertes sur derive de food cost. Les deux outils repondent a des besoins differents et peuvent etre branches sur la meme architecture sans conflit. C'est la configuration la plus puissante du marche pour un groupe de 3 a 10 restaurants.",
  },
];

export default function AlternativeLightspeed() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Alternative Lightspeed Restaurant | RestauMargin food cost | 2026"
        description="Lightspeed = POS premium (89-200€/mois). RestauMargin = gestion marge + food cost (29€/mois). Comparatif 2026."
        path="/alternative-lightspeed"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Comparatifs', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Alternative Lightspeed Restaurant', url: 'https://www.restaumargin.fr/alternative-lightspeed' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Alternative à Lightspeed Restaurant : RestauMargin (29€/mois)',
            description: "Comparatif detaille entre RestauMargin (29 EUR/mois, gestion des marges et food cost) et Lightspeed Restaurant (89-200 EUR/mois, POS complet). Tableau 18 criteres, cas d'usage, FAQ.",
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/alternative-lightspeed' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Comparatif Lightspeed Restaurant vs RestauMargin',
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
                  name: 'Lightspeed Restaurant',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'iPad, Web, iOS, Android',
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
                  description: "Logiciel de caisse (POS) complet pour la restauration : encaissement, plan de salle, gestion serveurs, reporting et modules optionnels (inventory, KDS, loyalty).",
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
          <span className="text-mono-100 font-medium">Alternative Lightspeed Restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Comparatif"
        readTime="11 min"
        date="Mai 2026"
        title="Alternative à Lightspeed Restaurant : RestauMargin (29€/mois)"
        accentWord="Lightspeed Restaurant"
        subtitle="Vous cherchez une alternative à Lightspeed Restaurant plus abordable, ou un outil complémentaire pour piloter vos marges en plus de votre caisse ? Voici un comparatif honnête entre les deux solutions, avec un tableau de 18 critères, des cas d'usage concrets et un comparatif de prix sur 12 mois."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="11 min" variant="header" />

        {/* ── Encadre TL;DR (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">En 30 secondes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Lightspeed Restaurant vs RestauMargin : la réponse rapide
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3 text-sm sm:text-base">
            <p className="leading-relaxed">
              <strong className="text-white">Lightspeed Restaurant</strong> est un excellent <strong>logiciel de caisse (POS) premium</strong> pour la restauration. Tarif : 89 à 200 EUR/mois selon la formule. Il ne pilote pas la marge plat par plat, ni la mercuriale fournisseurs.
            </p>
            <p className="leading-relaxed">
              <strong className="text-white">RestauMargin</strong> est une alternative ou un complément pour ceux qui veulent <strong>gérer leur food cost, leurs fiches techniques et leurs marges</strong>, avec IA et mobile, à 29 EUR/mois. Pas de module caisse.
            </p>
            <p className="leading-relaxed pt-2 border-t border-white/20">
              <strong className="text-white">Verdict :</strong> les deux outils sont complémentaires, pas concurrents. Si vous devez choisir, RestauMargin si la priorité est la marge ; Lightspeed si la priorité est la caisse et l'encaissement.
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
              { href: '#pourquoi', label: "Pourquoi chercher une alternative à Lightspeed ?" },
              { href: '#lightspeed', label: "Vue d'ensemble : Lightspeed Restaurant en 2026" },
              { href: '#restaumargin', label: "Vue d'ensemble : RestauMargin en 2026" },
              { href: '#tableau', label: 'Tableau comparatif détaillé (18 critères)' },
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

        {/* ═════════════ SECTION 1 : Pourquoi alternative ═════════════ */}
        <section id="pourquoi" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Pourquoi chercher une alternative à Lightspeed ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Lightspeed Restaurant est un acteur majeur du logiciel de caisse en restauration. Fruit du
              rachat d'iKentoo en 2019, c'est aujourd'hui l'un des POS les plus utilisés en Europe par les
              brasseries, restaurants gastronomiques et groupes multi-établissements. De nombreux
              restaurateurs en sont satisfaits pour la <strong>partie encaissement</strong>. Alors pourquoi
              tant de recherches autour du terme "alternative Lightspeed Restaurant" en 2026 ?
            </p>
            <p>
              Trois raisons reviennent systématiquement dans les retours de nos utilisateurs :
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 mt-8">
            <ReasonCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Le prix"
              desc="89 à 200 EUR/mois selon la formule et le nombre de caisses, soit 1 068 à 2 400 EUR/an. Pour un restaurant indépendant qui démarre ou un food truck, c'est un poste de dépense difficile à amortir."
            />
            <ReasonCard
              icon={<XCircle className="w-6 h-6" />}
              title="Le scope POS"
              desc="Lightspeed est excellent pour la caisse mais pas focalisé marge. Le module Inventory en option suit les stocks mais ne propose ni mercuriale fournisseurs avec historique, ni IA d'optimisation, ni alertes sur derive de food cost."
            />
            <ReasonCard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="La complexité"
              desc="Plusieurs restaurateurs trouvent l'interface dense et l'onboarding long. Les modules avancés (advanced insights, inventory, KDS) sont en options payantes qui font monter la facture rapidement."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              Soyons clairs : ces points ne font pas de Lightspeed un mauvais produit. Ils signifient
              simplement qu'il ne correspond pas à tous les besoins ni à tous les budgets. Une brasserie
              parisienne avec un fort volume couverts et plusieurs serveurs y trouvera une valeur énorme.
              Un bistrot de quartier ou un food truck qui veut surtout reprendre le contrôle de sa marge
              sur chaque plat aura davantage besoin d'un outil comme RestauMargin, branché ou non sur une
              caisse plus légère.
            </p>
            <p>
              C'est cette différence de scope qui explique pourquoi nous nous présentons comme une
              <strong> alternative à Lightspeed</strong> pour la partie gestion de la marge, sans prétendre
              remplacer son module caisse. Voyons ces deux approches en détail.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Vue d'ensemble Lightspeed ═════════════ */}
        <section id="lightspeed" className="mb-16">
          <SectionHeading icon={<Building2 className="w-6 h-6" />} number="2">
            Vue d'ensemble : Lightspeed Restaurant en 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              Lightspeed Restaurant est positionné comme un <strong>logiciel de caisse (POS) tout-en-un
              pour la restauration</strong>. Le cœur du produit est l'application iPad / iOS de prise de
              commande et d'encaissement, complétée par un plan de salle, une gestion serveurs, du
              reporting et des modules optionnels (Inventory, KDS, Loyalty, Advanced Insights, Payments).
              Plus de 100 000 commerces dans le monde l'utilisent selon Lightspeed, dont une part
              significative de restaurants en France et au Benelux.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Points forts de Lightspeed</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-emerald-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Caisse iPad mature, rapide et stable, conforme à la loi anti-fraude TVA</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Plan de salle visuel avec gestion des serveurs et des couverts</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Gestion multi-restaurant native avec consolidation des ventes</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Module Payments intégré (terminaux Lightspeed) pour fluidifier l'encaissement</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Écosystème d'intégrations large (Deliveroo, Uber Eats, comptabilité, fidelité)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Support en français et accompagnement personnalisé</span></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Limites de Lightspeed</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-amber-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Tarif élevé (89 à 200 EUR/mois) qui grimpe avec les modules optionnels</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de fiches techniques pesées au gramme avec rendements</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de mercuriale fournisseurs avec historique de prix et alertes</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas d'IA dédiée à l'optimisation de marge ou de carte</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de menu engineering ni d'analyse Boston Matrix</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas d'essai gratuit standard, démo commerciale obligatoire</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>À noter :</strong> Lightspeed a ajouté en 2024 plusieurs fonctions de reporting
            avancé (Advanced Insights) qui permettent de croiser ventes et coût matière. C'est utile,
            mais cela reste un module additionnel payant et orienté reporting global, pas un véritable
            outil de pilotage marge plat par plat avec fiches techniques et mercuriale.
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
              chaque plat servi doit être rentable, et vous devez le savoir en temps réel. Notre cœur métier
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
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Multi-restaurant natif avec vue consolidée et benchmarking</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>PWA mobile + mode kiosk balance + scan de factures par OCR</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Connecteur Lightspeed Restaurant pour rapatrier les ventes</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>29 EUR/mois, essai 7 jours sans carte bancaire</span></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Ce que RestauMargin ne fait pas</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-amber-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de module de caisse / POS avec encaissement (utilisez Lightspeed, Tiller, Sumup POS)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de plan de salle ni de gestion des serveurs</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de terminal de paiement intégré</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de KDS (écran cuisine) ni d'impression bons</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de conformité directe loi anti-fraude TVA (rôle de la caisse)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de module fidelité client intégré</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Notre conviction :</strong> un bon outil fait une chose excellemment. RestauMargin
            est conçu pour la gestion des marges et de la rentabilité opérationnelle. Si votre besoin
            principal est la caisse et l'encaissement, Lightspeed, Tiller ou Sumup POS seront plus
            adaptés. L'idéal pour beaucoup de restaurants est de combiner les deux types d'outils.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Tableau comparatif ═════════════ */}
        <section id="tableau" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
            Tableau comparatif détaillé (18 critères)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici une comparaison point par point entre Lightspeed Restaurant et RestauMargin, organisée
              par catégorie fonctionnelle. Les croix et les coches reflètent uniquement la présence d'une
              fonctionnalité dans le produit, pas un jugement de valeur.
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
                      <LightspeedBadge />
                      Lightspeed
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <ComparisonRow label="Prix mensuel (entry)" rm="29 EUR/mois" ls="89 EUR/mois (Starter)" winner="rm" />
                <ComparisonRow label="Prix mensuel (top)" rm="79 EUR/mois (Business)" ls="200 EUR/mois et + (Premium + modules)" winner="rm" />
                <ComparisonRow label="Essai gratuit" rm="7 jours, sans CB" ls="Démo commerciale" winner="rm" />
                <ComparisonRow label="Module caisse / POS" rm={false} ls={true} winner="ls" />
                <ComparisonRow label="Plan de salle / serveurs" rm={false} ls={true} winner="ls" />
                <ComparisonRow label="Terminal de paiement" rm={false} ls={true} winner="ls" />
                <ComparisonRow label="KDS écran cuisine" rm={false} ls="Option payante" winner="ls" />
                <ComparisonRow label="Calcul food cost" rm={true} ls="Module Inventory (option)" winner="rm" />
                <ComparisonRow label="Fiches techniques pesées" rm={true} ls={false} winner="rm" />
                <ComparisonRow label="Mercuriale fournisseurs" rm="Avec historique + alertes" ls={false} winner="rm" />
                <ComparisonRow label="Alertes prix fournisseurs" rm={true} ls={false} winner="rm" />
                <ComparisonRow label="IA + suggestions" rm="19 actions IA" ls={false} winner="rm" />
                <ComparisonRow label="Menu engineering" rm={true} ls={false} winner="rm" />
                <ComparisonRow label="HACCP digital" rm={true} ls={false} winner="rm" />
                <ComparisonRow label="Marge analytics par plat" rm={true} ls="Reporting global" winner="rm" />
                <ComparisonRow label="Scan de factures (OCR)" rm={true} ls={false} winner="rm" />
                <ComparisonRow label="Multi-restaurant" rm={true} ls={true} winner="tie" />
                <ComparisonRow label="Mobile / PWA kiosk" rm="PWA + mode kiosk balance" ls="iPad + iOS classique" winner="rm" />
                <ComparisonRow label="Intégrations livraison" rm="Via connecteur caisse" ls="Native (Deliveroo, Uber Eats)" winner="ls" />
                <ComparisonRow label="Onboarding" rm="Self-service + wizard 5 min" ls="Onboarding accompagné" winner="tie" />
                <ComparisonRow label="Support client" rm="Email + chat, < 4h" ls="Email + téléphone (formules sup.)" winner="tie" />
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Lecture du tableau :</strong> la victoire d'un outil sur un critère reflète la
            présence d'une fonctionnalité native, pas une note qualitative. Lightspeed gagne logiquement
            sur tous les critères "caisse / encaissement / salle" ; RestauMargin gagne sur tous les
            critères "gestion opérationnelle et rentabilité". C'est exactement la complémentarité que
            nous décrivons depuis le début.
          </Callout>
        </section>

        {/* ═════════════ SECTION 5 : Cas d'usage ═════════════ */}
        <section id="cas-usage" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="5">
            Quel outil pour quel type de restaurateur ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Plutôt qu'un verdict unique, voici les trois scénarios les plus fréquents que nous
              observons chez nos prospects et clients. Identifiez le profil le plus proche du vôtre.
            </p>
          </div>

          <div className="grid gap-6 mt-8">
            <ScenarioCard
              badge="Profil 1"
              title="Vous êtes un restaurant indépendant qui veut maîtriser ses marges"
              recommendation="RestauMargin uniquement (caisse légère ou existante)"
              recoColor="emerald"
              desc="Vous avez déjà une caisse simple (Sumup POS, L'Addition, Tiller basique, ou même Lightspeed Starter) et votre vrai problème est le food cost qui dérive avec l'inflation. Vous n'avez pas besoin de payer Lightspeed Premium pour résoudre ce problème. RestauMargin à 29 EUR/mois fait le job sans vous obliger à payer pour des fonctions caisse que vous avez déjà. Économie annuelle estimée vs Lightspeed Premium : 1 800 à 2 000 EUR."
            />
            <ScenarioCard
              badge="Profil 2"
              title="Vous êtes une brasserie avec gros volume et beaucoup de serveurs"
              recommendation="Lightspeed + RestauMargin en complément"
              recoColor="blue"
              desc="Vos opérations dépendent fortement de la caisse et du plan de salle (rotation rapide des couverts, gestion serveurs, encaissement fluide). Lightspeed est légitime pour piloter cette partie. Mais vous voulez aussi suivre vos marges plat par plat et anticiper les hausses fournisseurs. Ajoutez RestauMargin (29 EUR/mois) en parallèle : les ventes sont rapatriées via le connecteur et la marge réelle est calculée automatiquement."
            />
            <ScenarioCard
              badge="Profil 3"
              title="Vous êtes un food truck ou un très petit restaurant"
              recommendation="Caisse simple + RestauMargin"
              recoColor="purple"
              desc="Lightspeed Restaurant est puissant mais surdimensionné pour vos besoins. Une caisse légère type Sumup POS (gratuite + commissions de paiement) ou Square couvre votre besoin d'encaissement. Et vous mettez le budget économisé dans RestauMargin pour comprendre votre marge réelle et optimiser votre carte. Total mensuel : 29 EUR de logiciel + commissions sur paiements, soit 60 à 80 % d'économie vs Lightspeed."
            />
          </div>

          <Callout type="info">
            <strong>Notre engagement :</strong> si après avoir testé RestauMargin pendant les 7 jours
            d'essai vous constatez que votre vrai besoin est la caisse complète et le plan de salle,
            nous vous recommandons honnêtement d'aller chez Lightspeed, Tiller ou L'Addition. Notre
            objectif est que vous ayez le bon outil pour votre besoin, pas que vous payiez RestauMargin
            par défaut.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Témoignages ═════════════ */}
        <section id="temoignages" className="mb-16">
          <SectionHeading icon={<Quote className="w-6 h-6" />} number="6">
            Témoignages de restaurateurs
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici quelques retours représentatifs de clients qui ont fait le choix de RestauMargin
              après avoir évalué Lightspeed ou en complément de Lightspeed. Les prénoms ont été modifiés
              pour préserver l'anonymat des établissements.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            <TestimonialCard
              quote="On a Lightspeed Restaurant Plus depuis 4 ans, on en est satisfait pour la caisse et le plan de salle. Mais l'Inventory ne nous suffisait pas pour piloter la marge. On a ajouté RestauMargin il y a 8 mois et le food cost est passé de 34 à 30 %. Les deux outils tournent en parallèle, RestauMargin récupère les ventes Lightspeed automatiquement."
              author="Yann D."
              role="Brasserie, Nantes"
              rating={5}
            />
            <TestimonialCard
              quote="Pour notre food truck, Lightspeed était trop cher et trop lourd. On a pris Sumup POS pour encaisser et RestauMargin pour piloter la marge. Total 29 EUR/mois de logiciel au lieu de 130 EUR avec Lightspeed Plus. Et on a une visibilité bien meilleure sur quels plats sont rentables."
              author="Imane R."
              role="Food truck, Lille"
              rating={5}
            />
            <TestimonialCard
              quote="Le scan de factures et la mercuriale m'ont fait gagner 5 heures par semaine. Aucun équivalent dans Lightspeed Inventory. L'IA suggère même quand un fournisseur a augmenté ses prix de plus de 5 %. Pour le pilotage marge, c'est sans équivalent dans les outils de caisse classiques."
              author="Thibault G."
              role="Chef-propriétaire, Bordeaux"
              rating={5}
            />
            <TestimonialCard
              quote="Pour notre groupe de 6 restaurants, on utilise Lightspeed Restaurant Plus pour les caisses (consolidation ventes) et RestauMargin Business pour le pilotage marge (consolidation food cost, benchmarking). Les deux outils répondent à des besoins très différents, on n'a jamais eu à choisir."
              author="Claire V."
              role="Directrice d'exploitation, groupe Ouest"
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
                  <td className="py-3 px-4 font-bold text-mono-100">Lightspeed Starter</td>
                  <td className="py-3 px-4 text-right">89 EUR</td>
                  <td className="py-3 px-4 text-right">1 068 EUR</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">+ 720 EUR</td>
                </tr>
                <tr className="bg-mono-1000 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">Lightspeed Essential</td>
                  <td className="py-3 px-4 text-right">129 EUR</td>
                  <td className="py-3 px-4 text-right">1 548 EUR</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">+ 1 200 EUR</td>
                </tr>
                <tr className="bg-white border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">Lightspeed Plus</td>
                  <td className="py-3 px-4 text-right">159 EUR</td>
                  <td className="py-3 px-4 text-right">1 908 EUR</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">+ 1 560 EUR</td>
                </tr>
                <tr className="bg-mono-1000 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">Lightspeed Premium</td>
                  <td className="py-3 px-4 text-right">200 EUR</td>
                  <td className="py-3 px-4 text-right">2 400 EUR</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">+ 2 052 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              L'économie annuelle se situe entre <strong>720 EUR et 2 052 EUR</strong> selon la
              formule Lightspeed à laquelle on compare RestauMargin. Encore une fois, ces économies ne
              sont valables que si vos besoins sont alignés avec le scope de RestauMargin. Si vous
              avez besoin de la caisse, du plan de salle et du terminal de paiement Lightspeed, le
              coût supplémentaire est justifié par le service rendu.
            </p>
            <p>
              Si vous combinez les deux outils (Lightspeed Starter 89 EUR + RestauMargin Pro 29 EUR
              = 118 EUR/mois soit 1 416 EUR/an), vous obtenez un système complet
              <strong> caisse + pilotage marge</strong> pour moins cher qu'une formule Lightspeed
              Essential seule.
            </p>
          </div>

          <Callout type="info">
            <strong>Le saviez-vous ?</strong> Un restaurant qui améliore son food cost de 2 points
            (par exemple de 32 % à 30 %) sur un chiffre d'affaires de 400 000 EUR gagne
            <strong> 8 000 EUR de marge brute supplémentaire par an</strong>. RestauMargin se
            rentabilise donc dès le premier mois d'utilisation sérieuse, indépendamment du coût de
            votre caisse.
          </Callout>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="11 min" variant="footer" />

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
              La meilleure façon de savoir si RestauMargin est la bonne alternative ou le bon
              complément à Lightspeed pour votre restaurant, c'est de l'essayer. Sans carte
              bancaire, sans engagement.
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
            <Link to="/blog/logiciel-caisse-enregistreuse-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Logiciel de caisse restaurant</h3>
              <p className="text-xs text-mono-500">Guide complet : comment choisir sa caisse enregistreuse en 2026.</p>
            </Link>
            <Link to="/blog/logiciel-gestion-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Logiciel de gestion restaurant</h3>
              <p className="text-xs text-mono-500">Panorama des outils de pilotage opérationnel pour restaurateurs.</p>
            </Link>
            <Link to="/alternative-zenchef" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Alternative à Zenchef</h3>
              <p className="text-xs text-mono-500">Comparatif RestauMargin vs Zenchef pour la gestion restaurant.</p>
            </Link>
            <Link to="/pricing" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Tarifs RestauMargin</h3>
              <p className="text-xs text-mono-500">Formules Pro et Business, comparaison détaillée des fonctionnalités.</p>
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

function LightspeedBadge() {
  return (
    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white">L</div>
  );
}

function ComparisonRow({ label, rm, ls, winner }: {
  label: string;
  rm: boolean | string;
  ls: boolean | string;
  winner: 'rm' | 'ls' | 'tie';
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
      <td className={`py-3.5 px-4 text-center ${winner === 'ls' ? 'bg-red-50' : ''}`}>
        {renderCell(ls, winner === 'ls')}
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
