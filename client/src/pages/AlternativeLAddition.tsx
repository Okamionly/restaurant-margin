import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, DollarSign, Target, BookOpen, Lightbulb, Users, Zap, Sparkles, Scale, XCircle, Star, Quote, Building2 } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Comparatif SEO — "Alternative à L'Addition : RestauMargin pour piloter vos marges"
   Mot-clé principal : alternative l'addition
   Mots-clés secondaires : l'addition vs, restaumargin vs laddition, l'addition caisse restaurant prix
   ~2 600 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "L'Addition et RestauMargin sont-ils concurrents ou complementaires ?",
    answer: "Les deux outils sont avant tout complementaires. L'Addition est un logiciel de caisse (POS) qui prend la commande, encaisse, gere les tables et imprime les tickets. RestauMargin gere ce qui se passe avant et apres le service : fiches techniques, food cost, mercuriale fournisseurs, marges par plat. Beaucoup de restaurateurs utilisent L'Addition en caisse et RestauMargin pour le pilotage financier. Aucune integration native n'existe encore entre les deux, mais ils n'ont pas besoin d'echanger automatiquement pour coexister.",
  },
  {
    question: "Combien coute L'Addition par rapport a RestauMargin ?",
    answer: "L'Addition propose plusieurs formules generalement comprises entre 89 EUR et 159 EUR par mois et par caisse, hors materiel (tablette, imprimante, tiroir). RestauMargin commence a 29 EUR/mois pour la formule Pro, sans materiel obligatoire. Sur un an, RestauMargin coute 348 EUR contre 1 068 a 1 908 EUR pour L'Addition selon la formule choisie. La difference s'explique par la nature differente des deux produits : L'Addition est une caisse complete avec hardware ; RestauMargin est un outil de pilotage financier 100 % logiciel.",
  },
  {
    question: "L'Addition gere-t-il le food cost et les marges plat par plat ?",
    answer: "L'Addition propose un module statistiques avec le top des plats vendus, le chiffre d'affaires par categorie et l'historique d'encaissement. Il permet aussi d'associer un cout matiere indicatif par plat, mais la gestion fine des fiches techniques (ingredients peses, rendements, allergenes) et la mise a jour automatique du food cost en fonction des prix fournisseurs n'est pas son metier. Pour cela, il faut un outil dedie comme RestauMargin, qui se concentre sur la rentabilite operationnelle reelle, pas seulement sur l'encaissement.",
  },
  {
    question: "Peut-on remplacer entierement L'Addition par RestauMargin ?",
    answer: "Non. RestauMargin n'est pas une caisse enregistreuse. Nous ne gerons ni la prise de commande sur tablette, ni l'encaissement carte bancaire, ni l'edition de tickets clients, ni la certification fiscale NF525. Si vous cherchez a remplacer votre POS, regardez plutot des concurrents directs de L'Addition comme Tiller, Sumup POS, Lightspeed Restaurant ou Innovorder. RestauMargin se branche au-dessus de votre caisse pour transformer les ventes en analyse de marges.",
  },
  {
    question: "L'Addition et RestauMargin peuvent-ils echanger les donnees automatiquement ?",
    answer: "Une integration directe n'est pas encore disponible cote L'Addition cote API publique grand public, mais il est possible d'importer les ventes via export CSV hebdomadaire. RestauMargin sait lire ces fichiers et les rapprocher des fiches techniques pour calculer la marge reelle par plat vendu. C'est un setup utilise par plusieurs de nos clients qui tournent sur L'Addition en salle et RestauMargin en back-office.",
  },
  {
    question: "L'Addition est-il certifie NF525 et conforme a la loi anti-fraude TVA ?",
    answer: "Oui, L'Addition est un logiciel de caisse certifie NF525 et conforme aux obligations francaises (loi de finances 2018, anti-fraude TVA). C'est l'un de ses points forts pour les restaurateurs qui veulent etre serein cote fiscalite. RestauMargin n'a pas besoin de cette certification car nous ne sommes pas un logiciel d'encaissement : nous ne gerons aucun flux de paiement client final.",
  },
  {
    question: "Quel est le meilleur outil pour un restaurant qui ouvre en 2026 ?",
    answer: "Pour ouvrir un restaurant en 2026, vous avez besoin de trois briques : un POS de caisse certifie NF525 (L'Addition, Tiller, Sumup, Lightspeed), un module reservation (TheFork, Zenchef ou Google), un outil de pilotage des marges (RestauMargin). Beaucoup de chefs commettent l'erreur de prendre seulement une caisse et de gerer leurs marges sur Excel. Le ROI de RestauMargin se paie en general en moins d'un mois grace au gain de food cost (1 a 3 points typiquement).",
  },
  {
    question: "Y a-t-il un essai gratuit chez L'Addition et chez RestauMargin ?",
    answer: "RestauMargin offre 7 jours d'essai gratuit, sans carte bancaire, avec acces a toutes les fonctionnalites (food cost, fiches techniques, IA, mercuriale, multi-restaurant). L'Addition ne propose pas d'essai gratuit standard et passe par une demo personnalisee suivie d'un devis sur mesure incluant le hardware. RestauMargin permet donc de tester reellement le produit avant de payer, sans interaction commerciale obligatoire.",
  },
  {
    question: "L'Addition gere-t-il le multi-restaurant et la consolidation ?",
    answer: "Oui, L'Addition propose une console centrale pour les groupes avec plusieurs etablissements (ventes consolidees, parametrage central des cartes, droits par site). RestauMargin gere lui aussi le multi-restaurant nativement avec vue consolidee des marges, benchmarking inter-etablissements et alertes de derive. Les deux outils sont valables pour les groupes, mais sur des perimetres differents : L'Addition pour la consolidation des ventes et la coherence operationnelle, RestauMargin pour la rentabilite par site.",
  },
  {
    question: "Quel support client chez L'Addition vs RestauMargin ?",
    answer: "L'Addition dispose d'une force commerciale et d'un support 7j/7 en francais, avec installation sur site et formation incluses dans les formules superieures. RestauMargin propose un support email et chat en francais avec un temps de reponse moyen inferieur a 4 heures en jours ouvres, inclus dans toutes les formules (y compris Pro a 29 EUR). Nous compensons l'absence de support telephonique par une UX simple et un onboarding self-service de 5 minutes.",
  },
];

export default function AlternativeLAddition() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Alternative L'Addition | RestauMargin food cost 29€/mois | 2026"
        description="L'Addition = POS français leader. RestauMargin = gestion food cost + marges. Comparatif honnête 2026."
        path="/alternative-laddition"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Comparatifs', url: 'https://www.restaumargin.fr/blog' },
            { name: "Alternative L'Addition", url: 'https://www.restaumargin.fr/alternative-laddition' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Alternative a L'Addition : RestauMargin pour piloter vos marges",
            description: "Comparatif detaille entre L'Addition (POS de caisse leader en France, 89-159 EUR/mois) et RestauMargin (food cost + marges + IA, 29 EUR/mois). Tableau 18 criteres, cas d'usage, FAQ.",
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/alternative-laddition' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: "Comparatif L'Addition vs RestauMargin",
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
                  name: "L'Addition",
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'iPad, iOS',
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
                  description: "Logiciel de caisse (POS) certifie NF525 pour restaurants, brasseries et bars. Gestion des commandes, encaissement, plan de salle, ticket dematerialise.",
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
          <span className="text-mono-100 font-medium">Alternative L'Addition</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Comparatif"
        readTime="11 min"
        date="Mai 2026"
        title="Alternative à L'Addition : RestauMargin pour piloter vos marges"
        accentWord="L'Addition"
        subtitle="L'Addition est l'un des leaders du logiciel de caisse pour la restauration en France. RestauMargin est l'outil complémentaire (ou alternatif) qui pilote vos marges, votre food cost et votre rentabilité. Voici un comparatif honnête entre les deux solutions en 2026."
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
            L'Addition vs RestauMargin : la réponse rapide
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3 text-sm sm:text-base">
            <p className="leading-relaxed">
              <strong className="text-white">L'Addition</strong> est un excellent <strong>logiciel de caisse (POS)</strong> certifié NF525, utilisé par plus de 5 000 restaurants en France. Tarif : 89 à 159 EUR/mois par caisse + matériel. Il ne pilote pas le food cost ni les marges plat par plat.
            </p>
            <p className="leading-relaxed">
              <strong className="text-white">RestauMargin</strong> est une alternative complémentaire pour <strong>piloter vos marges, votre food cost et vos fiches techniques</strong>, avec IA et mobile, à 29 EUR/mois. Pas de fonction de caisse.
            </p>
            <p className="leading-relaxed pt-2 border-t border-white/20">
              <strong className="text-white">Verdict :</strong> les deux outils ne sont pas concurrents directs. Gardez L'Addition pour la salle, ajoutez RestauMargin pour le back-office et la rentabilité.
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
              { href: '#pourquoi', label: "Pourquoi chercher une alternative à L'Addition ?" },
              { href: '#laddition', label: "Vue d'ensemble : L'Addition en 2026" },
              { href: '#restaumargin', label: "Vue d'ensemble : RestauMargin en 2026" },
              { href: '#tableau', label: 'Tableau comparatif détaillé (18 critères)' },
              { href: '#cas-usage', label: "Quel outil pour quel type de restaurateur ?" },
              { href: '#prix', label: 'Comparaison de prix sur 12 mois' },
              { href: '#temoignages', label: 'Témoignages de restaurateurs' },
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
            Pourquoi chercher une alternative à L'Addition ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'Addition est l'un des acteurs majeurs du logiciel de caisse pour la restauration en France.
              Fondée en 2011, l'entreprise équipe aujourd'hui plus de 5 000 restaurants, brasseries et bars
              dans l'Hexagone. Son application iPad est devenue une référence pour la prise de commande,
              l'encaissement et la gestion de salle. Alors pourquoi tant de recherches autour du terme
              "alternative L'Addition" en 2026 ?
            </p>
            <p>
              Trois raisons reviennent systématiquement dans les retours de nos utilisateurs :
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 mt-8">
            <ReasonCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Le prix par caisse"
              desc="89 à 159 EUR/mois par caisse, sans compter le matériel iPad, imprimante ticket et tiroir. Pour un restaurant à plusieurs postes (bar, salle, terrasse), la facture grimpe vite au-delà de 200 EUR/mois."
            />
            <ReasonCard
              icon={<XCircle className="w-6 h-6" />}
              title="Le scope caisse uniquement"
              desc="L'Addition est excellent pour la salle et l'encaissement, mais n'est pas conçu pour piloter le food cost, gérer les fiches techniques précises ou suivre les marges par plat dans la durée. Il faut un deuxième outil."
            />
            <ReasonCard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="L'ecosystème iPad"
              desc="L'Addition repose sur iPad. Si vous voulez utiliser une tablette Android, un PC de comptoir ou une PWA mobile pour vos chefs, ce n'est pas son terrain naturel. Vous restez dépendant du matériel Apple."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              Soyons clairs : ces points ne font pas de L'Addition un mauvais produit, au contraire. C'est
              probablement le POS le plus mature du marché français, avec une certification NF525 solide,
              un support en français et une expérience iPad très soignée. Mais comme tout outil spécialisé,
              il a un périmètre clair : <strong>l'encaissement et la gestion de salle</strong>. La rentabilité
              opérationnelle, elle, se joue en cuisine et au back-office.
            </p>
            <p>
              C'est exactement la raison pour laquelle nous nous présentons comme une
              <strong> alternative à L'Addition</strong> pour la partie pilotage des marges, sans prétendre
              remplacer son module de caisse. Voyons ces deux approches en détail.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Vue d'ensemble L'Addition ═════════════ */}
        <section id="laddition" className="mb-16">
          <SectionHeading icon={<Building2 className="w-6 h-6" />} number="2">
            Vue d'ensemble : L'Addition en 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'Addition se positionne comme une <strong>solution de caisse complète pour la
              restauration</strong>. Le coeur du produit est l'application iPad de prise de commande
              et d'encaissement, complétée par un plan de salle digital, un ticket dématérialisé,
              un module statistiques et une console centrale pour les groupes. La société est française,
              basée à Paris, et reste l'une des références du marché en 2026.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Points forts de L'Addition</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-emerald-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>POS iPad robuste, certifié NF525, conforme loi anti-fraude TVA</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Plus de 5 000 restaurants équipés en France, marque établie</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Application mobile pour la prise de commande à table</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Ticket dématérialisé conforme loi du 1er août 2023</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Plan de salle digital, gestion des additions partagées</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Console centrale multi-restaurant pour les groupes</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Support 7j/7 en français, installation et formation incluses</span></li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Limites de L'Addition</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-amber-800 leading-relaxed">
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Food cost limité à un coût matière statique par plat</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de fiches techniques détaillées avec rendements et allergènes</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de mercuriale fournisseurs ni d'historique de prix</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas d'IA pour suggérer optimisations marges ou alerter sur dérives</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Tarif élevé par caisse (89 à 159 EUR/mois + matériel)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Écosystème iPad imposé, pas de version Android native</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas d'essai gratuit standard, démo commerciale et devis sur mesure</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>À noter :</strong> L'Addition propose un module statistiques avec le top des plats
            vendus et l'évolution du chiffre d'affaires, mais l'analyse fine de la marge brute par plat
            (en lien avec les prix fournisseurs réels) reste hors de leur scope. C'est exactement le
            terrain que couvre RestauMargin en complément.
          </Callout>
        </section>

        {/* ═════════════ SECTION 3 : Vue d'ensemble RestauMargin ═════════════ */}
        <section id="restaumargin" className="mb-16">
          <SectionHeading icon={<ChefHat className="w-6 h-6" />} number="3">
            Vue d'ensemble : RestauMargin en 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              RestauMargin se positionne comme la <strong>solution de référence pour la gestion
              opérationnelle et la rentabilité</strong> en restauration. Notre promesse tient en une
              phrase : chaque plat servi doit être rentable, et vous devez le savoir en temps réel.
              Notre coeur métier couvre les marges, le food cost, les fiches techniques, la mercuriale
              fournisseurs et l'optimisation par IA.
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
                <li className="flex gap-2"><span className="font-bold mt-0.5">+</span><span>Multi-restaurant natif avec vue consolidée des marges</span></li>
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
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de fonction de caisse enregistreuse (utilisez L'Addition, Tiller ou Sumup)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de certification NF525 (pas nécessaire, on n'encaisse pas)</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas d'édition de tickets clients ni de gestion TPE</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de plan de salle digital ni de gestion des couverts</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas d'intégration automatique avec les TPE bancaires</span></li>
                <li className="flex gap-2"><span className="font-bold mt-0.5">-</span><span>Pas de ticket dématérialisé conforme à la loi du 1er août 2023</span></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Notre conviction :</strong> un bon outil fait une chose excellemment. RestauMargin
            est conçu pour la gestion des marges et de la rentabilité opérationnelle. Si votre besoin
            principal est la caisse et l'encaissement, L'Addition reste un excellent choix. L'idéal
            pour la plupart des restaurants est de combiner les deux types d'outils.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Tableau comparatif ═════════════ */}
        <section id="tableau" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="4">
            Tableau comparatif détaillé (18 critères)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici une comparaison point par point entre L'Addition et RestauMargin, organisée par
              catégorie fonctionnelle. Les croix et les coches reflètent uniquement la présence d'une
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
                      <LadditionBadge />
                      L'Addition
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <ComparisonRow label="Prix mensuel (entry)" rm="29 EUR/mois" zc="89 EUR/mois/caisse" winner="rm" />
                <ComparisonRow label="Prix mensuel (top)" rm="79 EUR/mois (Business)" zc="159 EUR/mois/caisse" winner="rm" />
                <ComparisonRow label="Matériel requis" rm="Aucun (web + PWA)" zc="iPad + imprimante + tiroir" winner="rm" />
                <ComparisonRow label="Essai gratuit" rm="7 jours, sans CB" zc="Démo commerciale" winner="rm" />
                <ComparisonRow label="Calcul food cost détaillé" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Fiches techniques avec rendements" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Mercuriale fournisseurs" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="IA + 19 actions intelligentes" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Menu engineering" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="Scan factures (OCR)" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="HACCP digital" rm={true} zc={false} winner="rm" />
                <ComparisonRow label="POS / Caisse enregistreuse" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Certification NF525" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Plan de salle digital" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Ticket dématérialisé" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Encaissement TPE" rm={false} zc={true} winner="zc" />
                <ComparisonRow label="Multi-restaurant" rm={true} zc={true} winner="tie" />
                <ComparisonRow label="Mobile / PWA" rm="PWA tout device" zc="App iPad uniquement" winner="rm" />
                <ComparisonRow label="Support" rm="Email + chat < 4h" zc="7j/7 + installation" winner="zc" />
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Lecture du tableau :</strong> la victoire d'un outil sur un critère reflète la
            présence d'une fonctionnalité native, pas une note qualitative. L'Addition gagne logiquement
            sur tous les critères "caisse et encaissement" ; RestauMargin gagne sur tous les critères
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
              Plutôt qu'un verdict unique, voici les trois scénarios les plus fréquents que nous
              observons chez nos prospects et clients. Identifiez le profil le plus proche du vôtre.
            </p>
          </div>

          <div className="grid gap-6 mt-8">
            <ScenarioCard
              badge="Profil 1"
              title="Vous avez déjà L'Addition et vous voulez piloter vos marges"
              recommendation="Ajoutez RestauMargin par-dessus"
              recoColor="emerald"
              desc="Vous tournez sur L'Addition depuis quelques mois ou quelques années, votre salle est bien gérée, mais vous ne savez pas vraiment quelle est votre marge réelle plat par plat. Vous exportez vos ventes en CSV depuis L'Addition et vous les rapprochez de vos fiches techniques dans RestauMargin. Coût supplémentaire : 29 EUR/mois. ROI typique : moins de 30 jours grâce au gain de food cost."
            />
            <ScenarioCard
              badge="Profil 2"
              title="Vous ouvrez un nouveau restaurant en 2026"
              recommendation="L'Addition + RestauMargin en parallèle dès le démarrage"
              recoColor="blue"
              desc="Vous avez besoin d'une caisse certifiée NF525 dès l'ouverture pour encaisser légalement (L'Addition fait très bien le job, comptez 89 à 159 EUR/mois par poste). Vous avez aussi besoin d'un outil pour construire vos fiches techniques, fixer vos prix de vente et surveiller votre food cost dès le jour 1 (RestauMargin à 29 EUR/mois). Total : 118 EUR/mois pour un setup complet salle + cuisine."
            />
            <ScenarioCard
              badge="Profil 3"
              title="Vous cherchez une alternative moins chère à L'Addition"
              recommendation="POS alternatif + RestauMargin"
              recoColor="purple"
              desc="Si le tarif L'Addition vous semble trop élevé et que vous cherchez à réduire votre budget logiciel, regardez Tiller, Sumup POS ou Lightspeed Restaurant côté caisse. Combinez avec RestauMargin pour le pilotage des marges. Cette combinaison vous donne un setup complet aux alentours de 60 à 90 EUR/mois, soit deux à trois fois moins cher qu'un L'Addition Premium."
            />
          </div>

          <Callout type="info">
            <strong>Notre engagement :</strong> nous ne cherchons pas à vous faire abandonner L'Addition.
            Si votre POS fonctionne bien et que vos équipes sont formées, gardez-le. RestauMargin
            s'ajoute à votre stack sans rien casser. Notre objectif est que vous ayez un système
            cohérent salle + back-office, pas que vous changiez tout d'un coup.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Prix sur 12 mois ═════════════ */}
        <section id="prix" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="6">
            Comparaison de prix sur 12 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'écart de prix annuel entre les deux solutions est significatif. Voici le détail
              comparé sur un an pour les formules d'entrée et les formules haut de gamme, hors
              matériel pour L'Addition.
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
                  <td className="py-3 px-4 font-bold text-mono-100">L'Addition Essential</td>
                  <td className="py-3 px-4 text-right">89 EUR</td>
                  <td className="py-3 px-4 text-right">1 068 EUR</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">+ 720 EUR</td>
                </tr>
                <tr className="bg-mono-1000 border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">L'Addition Pro</td>
                  <td className="py-3 px-4 text-right">119 EUR</td>
                  <td className="py-3 px-4 text-right">1 428 EUR</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">+ 1 080 EUR</td>
                </tr>
                <tr className="bg-white border-t border-mono-900">
                  <td className="py-3 px-4 font-bold text-mono-100">L'Addition Premium</td>
                  <td className="py-3 px-4 text-right">159 EUR</td>
                  <td className="py-3 px-4 text-right">1 908 EUR</td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">+ 1 560 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              L'écart annuel se situe entre <strong>720 EUR et 1 560 EUR</strong> selon la formule
              L'Addition à laquelle on compare RestauMargin. Encore une fois, ces écarts ne sont pas
              à interpréter comme une économie pure : les deux outils ne couvrent pas le même besoin.
              Si vous voulez un POS, L'Addition reste justifié à son tarif.
            </p>
            <p>
              Si vous combinez les deux outils (L'Addition Essential 89 EUR + RestauMargin Pro 29 EUR
              = 118 EUR/mois soit 1 416 EUR/an), vous obtenez un système complet
              <strong> caisse certifiée + pilotage des marges</strong> pour moins cher qu'un L'Addition
              Premium seul.
            </p>
          </div>

          <Callout type="info">
            <strong>Le saviez-vous ?</strong> Un restaurant qui améliore son food cost de 2 points
            (par exemple de 32 % à 30 %) sur un chiffre d'affaires de 400 000 EUR gagne
            <strong> 8 000 EUR de marge brute supplémentaire par an</strong>. RestauMargin se
            rentabilise donc dès le premier mois d'utilisation sérieuse, et le combo
            L'Addition + RestauMargin reste très largement positif côté ROI.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Témoignages ═════════════ */}
        <section id="temoignages" className="mb-16">
          <SectionHeading icon={<Quote className="w-6 h-6" />} number="7">
            Témoignages de restaurateurs
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici quelques retours représentatifs de clients qui ont fait le choix de RestauMargin
              en complément de L'Addition (ou en alternative à un autre POS). Les prénoms ont été
              modifiés pour préserver l'anonymat des établissements.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            <TestimonialCard
              quote="L'Addition est notre caisse depuis 2019, on en est très contents pour la salle et le service. Mais on ne savait jamais vraiment quelle était notre marge réelle sur les plats. Depuis qu'on a ajouté RestauMargin, on a gagné 3 points de food cost en 4 mois. Les deux outils se complètent parfaitement."
              author="Antoine R."
              role="Brasserie de centre-ville, Toulouse"
              rating={5}
            />
            <TestimonialCard
              quote="On a ouvert il y a 6 mois avec L'Addition pour la caisse et RestauMargin pour les fiches techniques. C'est le combo qu'on nous avait recommandé en école hôtelière. Je passe environ 30 minutes par semaine sur RestauMargin et je sais exactement où je gagne et où je perds."
              author="Léa S."
              role="Restaurant bistronomique, Nantes"
              rating={5}
            />
            <TestimonialCard
              quote="Pour notre groupe de 5 brasseries, on a la console centrale L'Addition pour suivre les ventes et RestauMargin Business pour suivre les marges site par site. Le benchmarking entre établissements nous a permis d'identifier deux restaurants en sous-performance qu'on a redressés en un trimestre."
              author="Stéphane G."
              role="Directeur d'exploitation, groupe Île-de-France"
              rating={5}
            />
            <TestimonialCard
              quote="On envisageait L'Addition Premium à 159 EUR/mois pour avoir les statistiques avancées. Finalement on est resté sur L'Addition Essential à 89 EUR et on a pris RestauMargin à 29 EUR. Total 118 EUR au lieu de 159 EUR, avec en plus toutes les fonctionnalités food cost qu'on n'aurait pas eues même en Premium."
              author="Inès B."
              role="Gérante de bistrot, Lille"
              rating={5}
            />
          </div>
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
              La meilleure façon de savoir si RestauMargin est le bon complément de L'Addition
              pour votre restaurant, c'est de l'essayer. Sans carte bancaire, sans engagement.
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
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Logiciel caisse enregistreuse</h3>
              <p className="text-xs text-mono-500">Guide d'achat 2026 : critères, certifications NF525 et comparatif des principaux POS.</p>
            </Link>
            <Link to="/blog/logiciel-gestion-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Logiciel gestion restaurant</h3>
              <p className="text-xs text-mono-500">Panorama complet : caisse, marges, réservations, marketing — quel outil pour quel besoin.</p>
            </Link>
            <Link to="/alternative-zenchef" className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Alternative Zenchef</h3>
              <p className="text-xs text-mono-500">RestauMargin vs Zenchef : comparatif honnête sur la gestion des marges et les réservations.</p>
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

function LadditionBadge() {
  return (
    <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-[10px] font-bold text-white">L</div>
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
      <td className={`py-3.5 px-4 text-center ${winner === 'zc' ? 'bg-rose-50' : ''}`}>
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
