import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, TrendingUp, Wine, Utensils, Sparkles, Coffee, BookOpen as BookIcon, GraduationCap, Star, Shield, ArrowRight, AlertTriangle, Lightbulb, Target, BarChart3, CheckCircle, Users, DollarSign } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Ticket moyen restaurant : calcul + 10 techniques"
   Mots-cles : ticket moyen restaurant calcul, comment augmenter ticket moyen
   ~3 100 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Comment calculer le ticket moyen d'un restaurant ?",
    answer: "Ticket moyen = Chiffre d'affaires (HT ou TTC) / Nombre de couverts servis. Toujours diviser par le nombre de couverts, jamais par le nombre d'additions (sinon biais : une table de 4 pese autant qu'un solo). Calculez separement midi et soir : l'ecart typique est de 30-45 %. Utilisez du HT pour comparer entre etablissements (les TVA different selon les boissons).",
  },
  {
    question: "Quel est le ticket moyen normal pour un restaurant en France ?",
    answer: "Selon le segment : bistrot 22-48 EUR, brasserie 25-58 EUR, pizzeria 18-32 EUR, sushi a la carte 28-65 EUR, gastronomique 1 etoile 65-160 EUR. Toujours interpreter midi/soir separement. En zone touristique, ajoutez 15-25 %. En zone bureau midi, ticket moyen plus bas mais volume plus eleve.",
  },
  {
    question: "Mon ticket moyen baisse depuis 6 mois, que faire ?",
    answer: "Trois pistes principales : (1) cannibalisation par une formule trop bon marche qui detourne les clients de la carte ; (2) baisse de la prise de boissons (bouteilles vers carafes) ; (3) changement de profil clientele (passage du business au familial). Comparer midi et soir separement aide a identifier la zone problematique. Verifier aussi le mix de plats vendus.",
  },
  {
    question: "Comment mesurer l'efficacite d'une nouvelle technique d'upselling ?",
    answer: "Comparez le ticket moyen sur 2 semaines avant et 2 semaines apres la mise en place. Segmentez par jour de la semaine (un mardi vs un mardi) car les profils diffuserent. Une hausse superieure a 5 % est statistiquement significative. Si possible, A/B testez : moitie de l'equipe applique la technique, l'autre non, vous comparez les tickets generes.",
  },
  {
    question: "Faut-il augmenter ses prix ou augmenter le ticket moyen ?",
    answer: "Les deux sont des leviers complementaires. Combiner legere hausse de prix annuelle (3-4 % pour suivre l'inflation) plus travail continu sur le ticket via les 10 techniques d'upselling est la strategie la plus durable. Une hausse de prix brute risque la perte de clients (elasticite prix), alors qu'augmenter le ticket via upselling preserve la perception value-for-money.",
  },
  {
    question: "Comment ne pas frustrer le client en proposant trop de produits ?",
    answer: "Maximum 3 suggestions durant un repas : a l'arrivee (aperitif/eau), entre commande et plat (vin ou entree a partager), en fin de plat (dessert et cafe). Au-dela, l'experience devient pesante et la perception passe de service attentionne a forcage commercial. Respectez systematiquement les refus, n'insistez jamais sur un produit refuse.",
  },
  {
    question: "Le digital peut-il aider a augmenter le ticket moyen ?",
    answer: "Oui, enormement. La commande au QR code ou tablette montre toujours toutes les options et boissons, suggere automatiquement des desserts et accompagnements, propose des accords mets-vins. Augmente le ticket de 8 a 15 % par rapport a une prise de commande traditionnelle. Particulierement efficace sur le dessert (+25 % de prise) et les boissons additionnelles (+18 %).",
  },
  {
    question: "Quel est l'impact d'une hausse de ticket moyen de 5 EUR ?",
    answer: "Pour un restaurant a 1 200 couverts/mois : +5 EUR x 1 200 = +6 000 EUR de CA/mois, soit 72 000 EUR/an. Avec un food cost incremental de 30 % (boissons et desserts ont un food cost plus bas que les plats), la marge nette additionnelle est de 50 400 EUR/an. C'est l'equivalent de 1,5 salaire charge sans aucun cout d'acquisition supplementaire.",
  },
  {
    question: "Quelles boissons ont la meilleure marge en restauration ?",
    answer: "Cafe et digestifs (marge 80-92 %), vins au verre haut de gamme (marge 72-80 %), eaux gazeuses bouteille (marge 88-94 %), cocktails maison (marge 75-85 %), bieres pression (marge 75-82 %). La biere bouteille et les softs en bouteille ont des marges plus faibles (60-70 %). Concentrez vos efforts d'upselling sur les categories a marge maximale.",
  },
  {
    question: "Comment former mon equipe a l'upselling sans pression ?",
    answer: "Quatre sessions de 2 heures sur 2 mois : (1) connaissance produits et accords, (2) scripts d'upselling adaptes a votre carte, (3) gestion d'objections clients, (4) lecture de la table (cible business vs famille vs couple). Mettez en place un incentive financier sur les ventes additionnelles (1 % du delta de CA upselle). Faites des roleplays mensuels. Le but est de transformer la suggestion en service, pas en forcage.",
  },
];

export default function BlogTicketMoyen() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Ticket moyen restaurant : calcul + 10 techniques pour l'augmenter"
        description="Comment calculer et augmenter le ticket moyen de votre restaurant : formules, benchmarks par type, 10 techniques d'upselling ethique, cas pratique chiffre +50 400 EUR/an."
        path="/blog/augmenter-ticket-moyen-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: "Accueil", url: "https://www.restaumargin.fr/" },
            { name: "Blog", url: "https://www.restaumargin.fr/blog" },
            { name: "Ticket moyen restaurant", url: "https://www.restaumargin.fr/blog/augmenter-ticket-moyen-restaurant" }
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment augmenter le ticket moyen de son restaurant en 6 etapes',
            description: 'Methode complete pour calculer, analyser et augmenter le ticket moyen d\'un restaurant via l\'upselling ethique et le menu engineering.',
            totalTime: 'PT60M',
            tool: ['Outil de caisse / POS', 'Tableur', 'Cartes des vins et menus', 'RestauMargin pour le suivi automatique'],
            step: [
              { '@type': 'HowToStep', name: 'Calculer son ticket moyen actuel', text: 'Divisez le chiffre d\'affaires (HT) par le nombre de couverts sur 30 jours minimum. Separez midi/soir et par jour de la semaine pour identifier les segments faibles.' },
              { '@type': 'HowToStep', name: 'Benchmarker contre son segment', text: 'Comparez votre ticket moyen aux benchmarks 2026 de votre type de restaurant. Identifiez l\'ecart en EUR et en pourcentage.' },
              { '@type': 'HowToStep', name: 'Identifier les leviers prioritaires', text: 'Analysez votre menu mix : taux de prise d\'entree, de dessert, de boissons. Repérez les categories sous-performantes vs les normes professionnelles (70 % entree, 60 % dessert, 1,5 boissons par couvert).' },
              { '@type': 'HowToStep', name: 'Implementer 3 techniques d\'upselling', text: 'Choisissez 3 techniques parmi les 10 (upselling boissons, suggestions desserts, formules premium...) et formez l\'equipe sur scripts precis. Roleplays obligatoires avant deploiement.' },
              { '@type': 'HowToStep', name: 'Suivre les KPIs pendant 4 semaines', text: 'Mesurez chaque semaine : ticket moyen midi/soir, taux de prise par categorie, marge brute par couvert. Identifiez ce qui marche et ce qui ne marche pas.' },
              { '@type': 'HowToStep', name: 'Ajuster et passer aux techniques suivantes', text: 'Apres 4 semaines de stabilisation, deployez 2-3 nouvelles techniques. Iterez par cycles de 4 semaines pendant 6 mois pour atteindre votre ticket cible.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Ticket moyen restaurant : calcul et 10 techniques pour l\'augmenter',
            description: 'Guide complet du ticket moyen restaurant : definition, formule de calcul, benchmarks par type d\'etablissement, 10 techniques d\'upselling ethique, cas pratique chiffre, KPIs a suivre.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-27',
            dateModified: '2026-05-26',
            wordCount: 3100,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/augmenter-ticket-moyen-restaurant' },
          },
        ]}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/outils/calculateur-food-cost"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer mes marges
            </Link>
            <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">
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
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Ticket moyen restaurant</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Revenus"
        readTime="14 min"
        date="Avril 2026 - Mise a jour mai 2026"
        title="Ticket moyen restaurant : calcul + 10 techniques pour l'augmenter"
        accentWord="ticket moyen"
        subtitle="+3 EUR de ticket moyen sur 800 couverts/mois = +28 800 EUR de CA annuel sur des couverts deja acquis, avec marge nette quasi pure. Le levier le plus rentable et le plus sous-exploite de la restauration."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="14 min" variant="header" />

        {/* Encadre formule rapide */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Ticket moyen restaurant en 1 minute</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            La formule essentielle a retenir
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div>
              <strong className="text-white">Ticket moyen (EUR)</strong> = CA HT / Nombre de couverts servis
            </div>
            <div>
              <strong className="text-white">Indicateur d'evolution</strong> = (Ticket N - Ticket N-1) / Ticket N-1 x 100
            </div>
          </div>
          <p className="mt-4 text-teal-50 text-sm">
            Toujours diviser par les <strong className="text-white">couverts</strong>, jamais par les additions.
            Calculer separement midi et soir (ecart 30-45 %). Comparer en HT pour benchmarker.
          </p>
        </div>

        {/* Table des matieres */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#definition', label: 'Definition et calcul du ticket moyen restaurant' },
              { href: '#actionnable', label: "Pourquoi c'est plus actionnable que le volume" },
              { href: '#impact', label: "Calcul d'impact d'une hausse de 3 EUR (cas pratique)" },
              { href: '#benchmarks', label: 'Benchmarks 2026 par type de restaurant' },
              { href: '#howto', label: 'Comment augmenter son ticket moyen en 6 etapes' },
              { href: '#techniques', label: 'Les 10 techniques d\'upselling a deployer' },
              { href: '#tableau', label: 'Tableau d\'impact selon volume de couverts' },
              { href: '#kpi', label: 'KPIs et indicateurs a suivre semaine apres semaine' },
              { href: '#ethique', label: 'Upselling ethique : la frontiere a ne pas franchir' },
              { href: '#outils', label: 'Outils digitaux pour piloter son ticket moyen' },
              { href: '#faq', label: 'Questions frequentes' },
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

        {/* Intro */}
        <div className="prose-content mb-14">
          <p>
            Beaucoup de restaurateurs cherchent a remplir davantage la salle (plus dur, plus couteux
            en marketing) plutot qu'a valoriser chaque client deja present. Pourtant, augmenter le
            <strong> ticket moyen restaurant </strong>de 3-5 EUR genere des revenus quasi-purs : ces
            euros supplementaires arrivent sur des couverts deja acquis, sur des charges fixes deja
            payees (loyer, salaires de structure, energie). La marge nette additionnelle est donc
            spectaculaire : <strong>70-80 % du delta</strong> de CA tombe en marge nette, contre 8-12 %
            en moyenne sur un CA classique.
          </p>
          <p>
            Selon les donnees Fiducial 2025, le ticket moyen national en restauration commerciale est
            de 24,80 EUR HT au dejeuner et 36,40 EUR HT au diner. Pourtant, ces chiffres masquent une
            disparite enorme : entre un restaurant peu performant (18 EUR/dejeuner) et un restaurant
            optimise (32 EUR/dejeuner), l'ecart est de <strong>14 EUR par couvert</strong>. Sur 1 000
            couverts mensuels, c'est 168 000 EUR de CA annuel d'ecart, pour des charges fixes
            quasi-identiques.
          </p>
          <p>
            Dans ce guide, vous trouverez la formule exacte de calcul, les benchmarks par segment,
            une methode HowTo en 6 etapes, les <strong>10 techniques d'upselling</strong> les plus
            efficaces (avec leur impact chiffre), un cas pratique +50 400 EUR/an, et la frontiere
            ethique a ne pas franchir. Pour aller plus loin, consultez aussi notre guide du
            <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">calcul de marge restaurant</Link>
            et notre article sur le
            <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-800 ml-1">coefficient multiplicateur</Link>.
          </p>
        </div>

        {/* Section 1 - Définition */}
        <section id="definition" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="1">
            Definition et calcul du ticket moyen restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>ticket moyen restaurant</strong> est l'indicateur cle de la valorisation
              de chaque client. Il se distingue du panier moyen (qui peut englober plusieurs personnes
              sur une meme addition) et constitue le KPI le plus surveille apres le chiffre d'affaires
              global.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6">
            <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal-600" />
              Formule de calcul
            </h3>
            <div className="bg-white rounded-xl p-4 text-center font-mono text-base sm:text-lg font-semibold text-teal-700 border border-teal-100 mb-3">
              Ticket moyen = CA HT (ou TTC) / Nombre de couverts servis
            </div>
            <p className="text-sm text-mono-400 leading-relaxed">
              Toujours diviser par le <strong>nombre de couverts</strong>, jamais par le nombre
              d'additions. Une table de 4 represente 4 couverts (un par personne) et non 1 (l'addition).
              Le ticket moyen midi est typiquement <strong>30-45 % inferieur</strong> au soir :
              suivez-les separement pour piloter correctement.
            </p>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">HT ou TTC ?</h3>
            <p>
              Pour comparer entre etablissements, utilisez le ticket moyen <strong>HT</strong> car les
              taux de TVA different selon les boissons (5,5 % sur eau plate, 10 % sur plat sur place,
              20 % sur alcools). Pour vos analyses internes (suivi semaine vs semaine du meme
              etablissement), le TTC est plus simple. Choisissez une convention et tenez-la.
            </p>
            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Variantes utiles a calculer</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Ticket moyen par service</strong> : midi vs soir, ecart typique 30-45 %</li>
              <li><strong>Ticket moyen par jour</strong> : lundi vs samedi, ecart typique 20-40 %</li>
              <li><strong>Ticket moyen par segment</strong> : sur place vs livraison, terrasse vs salle</li>
              <li><strong>Ticket moyen par categorie de plat</strong> : entree, plat, dessert, boisson</li>
              <li><strong>Ratio boissons/CA total</strong> : viser 25-35 % (en-dessous = sous-exploitation)</li>
              <li><strong>Taux de prise dessert</strong> : viser 55-65 % (en-dessous = potentiel inexploité)</li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Le piege classique :</strong> calculer un ticket moyen global qui melange midi
            (deque rapide a 20 EUR) et soir (carte completee a 45 EUR). Vous obtenez un chiffre flou
            qui masque les vrais problemes. Si votre soir tombe de 45 a 40 EUR mais que le midi grimpe
            de 20 a 25 EUR, votre moyenne ne bouge pas, mais vous avez perdu 5 EUR de marge sur le
            service le plus rentable. Toujours segmenter.
          </Callout>
        </section>

        {/* Section 2 - Pourquoi actionnable */}
        <section id="actionnable" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="2">
            Pourquoi c'est plus actionnable que le volume
          </SectionHeading>

          <div className="prose-content">
            <p>
              Pour augmenter son chiffre d'affaires, un restaurateur a deux leviers principaux :
              augmenter le volume (plus de couverts) ou augmenter le ticket moyen (plus de chiffre
              par couvert). Le second est bien plus rentable et plus rapide a deployer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-red-900">Augmenter le volume (+10 %)</h3>
              </div>
              <ul className="space-y-2 text-sm text-red-800">
                <li>Cout marketing eleve (acquisition client)</li>
                <li>Charges variables proportionnelles (matieres, personnel extra)</li>
                <li>Risque de saturation cuisine et qualite</li>
                <li>Investissement possible en capacite</li>
                <li>Delai de retour : 6-12 mois</li>
                <li>Marge nette additionnelle : 8-12 % du delta CA</li>
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-emerald-900">Augmenter le ticket moyen (+10 %)</h3>
              </div>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li>Cout marketing nul (clients deja acquis)</li>
                <li>Charges variables limitees au food cost (less than 35 %)</li>
                <li>Aucun stress operationnel supplementaire</li>
                <li>Aucun investissement (juste formation equipe)</li>
                <li>Delai de retour : 4-8 semaines</li>
                <li><strong>Marge nette additionnelle : 65-75 % du delta CA</strong></li>
              </ul>
            </div>
          </div>

          <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-5 mt-6">
            <p className="text-sm font-bold text-emerald-700 mb-1">La regle d'or</p>
            <p className="text-sm text-emerald-700">
              Pour un restaurant qui tourne deja bien (taux de remplissage greater than 65 %), augmenter
              le ticket est statistiquement <strong>3 a 5 fois plus rentable</strong> que d'augmenter
              le volume. C'est pourquoi les chaines pro (Big Mama, Cojean, Big Fernand) investissent
              massivement dans l'upselling avant de chercher a multiplier les couverts.
            </p>
          </div>
        </section>

        {/* Section 3 - Cas pratique */}
        <section id="impact" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="3">
            Calcul d'impact d'une hausse de 3 EUR (cas pratique)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Mettons des chiffres reels sur la table avec un cas concret : <strong>Le Marais</strong>,
              brasserie parisienne de 60 couverts, ouverte 6 jours sur 7, midi et soir.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Situation actuelle</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Couverts/mois', value: '1 200' },
                { label: 'Ticket moyen actuel', value: '31 EUR' },
                { label: 'CA mensuel HT', value: '37 200 EUR' },
                { label: 'Food cost', value: '32 %' },
              ].map((f, i) => (
                <div key={i} className="bg-white rounded-xl p-3 border border-mono-900">
                  <p className="text-xs text-mono-500 mb-1">{f.label}</p>
                  <p className="font-bold text-mono-100">{f.value}</p>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-mono-100 mb-4 text-lg pt-4 border-t border-mono-900">Apres deploiement upselling : +3 EUR de ticket</h3>
            <div className="space-y-3 mb-6">
              <div className="bg-white rounded-xl p-4 border border-mono-900 flex justify-between items-center">
                <span className="text-mono-100">Nouveau ticket moyen</span>
                <span className="font-bold text-emerald-700">34 EUR (+9,7 %)</span>
              </div>
              <div className="bg-white rounded-xl p-4 border border-mono-900 flex justify-between items-center">
                <span className="text-mono-100">CA mensuel HT additionnel</span>
                <span className="font-bold text-emerald-700">+3 600 EUR</span>
              </div>
              <div className="bg-white rounded-xl p-4 border border-mono-900 flex justify-between items-center">
                <span className="text-mono-100">CA annuel HT additionnel</span>
                <span className="font-bold text-emerald-700">+43 200 EUR</span>
              </div>
              <div className="bg-white rounded-xl p-4 border border-mono-900 flex justify-between items-center">
                <span className="text-mono-100">Food cost incremental (30 % sur deltas)</span>
                <span className="text-red-700">-12 960 EUR</span>
              </div>
              <div className="bg-white rounded-xl p-4 border border-mono-900 flex justify-between items-center">
                <span className="text-mono-100">Cout personnel additionnel</span>
                <span className="text-red-700">0 EUR (deja en poste)</span>
              </div>
              <div className="bg-white rounded-xl p-4 border border-mono-900 flex justify-between items-center">
                <span className="text-mono-100">Charges fixes additionnelles</span>
                <span className="text-red-700">0 EUR (deja payees)</span>
              </div>
              <div className="bg-emerald-100 rounded-xl p-4 border border-emerald-300 flex justify-between items-center">
                <span className="font-bold text-emerald-900">MARGE NETTE ANNUELLE ADDITIONNELLE</span>
                <span className="font-extrabold text-emerald-900 text-lg">+30 240 EUR</span>
              </div>
            </div>

            <p className="text-sm text-mono-400 leading-relaxed">
              <strong>Pour aller plus loin sur le volume :</strong> sur 2 000 couverts/mois (restaurant
              plus important), la marge nette additionnelle annuelle serait de +50 400 EUR. Sur 3 000
              couverts, +75 600 EUR. C'est l'equivalent de 1 a 2 salaires charges, generes sans aucun
              investissement initial.
            </p>
          </div>
        </section>

        {/* Section 4 - Benchmarks */}
        <section id="benchmarks" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            Benchmarks 2026 par type de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les fourchettes de ticket moyen observees en France en 2026, sources Fiducial,
              GIRA Conseil et base RestauMargin (500+ restaurants connectes). Ces chiffres sont en
              HT, hors zone touristique premium ou ils peuvent etre majores de 15-25 %.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type de restaurant</th>
                  <th className="text-center py-3 px-4 font-semibold">Ticket midi (HT)</th>
                  <th className="text-center py-3 px-4 font-semibold">Ticket soir (HT)</th>
                  <th className="text-center py-3 px-4 font-semibold">Taux prise dessert</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Ratio boisson/CA</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { type: 'Bistrot quartier', midi: '22-32 EUR', soir: '32-48 EUR', dessert: '55-65 %', boiss: '28-34 %' },
                  { type: 'Brasserie traditionnelle', midi: '25-35 EUR', soir: '38-58 EUR', dessert: '58-68 %', boiss: '30-38 %' },
                  { type: 'Pizzeria assise', midi: '18-25 EUR', soir: '22-32 EUR', dessert: '38-48 %', boiss: '22-28 %' },
                  { type: 'Restaurant traditionnel', midi: '24-32 EUR', soir: '35-52 EUR', dessert: '60-70 %', boiss: '28-35 %' },
                  { type: 'Bistronomie', midi: '32-45 EUR', soir: '55-85 EUR', dessert: '70-80 %', boiss: '35-45 %' },
                  { type: 'Sushi a la carte', midi: '28-40 EUR', soir: '38-65 EUR', dessert: '25-35 %', boiss: '20-28 %' },
                  { type: 'Gastronomique 1 etoile', midi: '65-95 EUR', soir: '95-160 EUR', dessert: '85-95 %', boiss: '40-55 %' },
                  { type: 'Fast casual', midi: '12-18 EUR', soir: '14-22 EUR', dessert: '20-30 %', boiss: '25-32 %' },
                  { type: 'Coffee shop', midi: '8-15 EUR', soir: 'N/A', dessert: 'N/A', boiss: '60-75 %' },
                  { type: 'Food truck', midi: '10-16 EUR', soir: '12-20 EUR', dessert: '15-25 %', boiss: '20-28 %' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.type}</td>
                    <td className="py-3 px-4 text-center">{row.midi}</td>
                    <td className="py-3 px-4 text-center">{row.soir}</td>
                    <td className="py-3 px-4 text-center">{row.dessert}</td>
                    <td className="py-3 px-4 text-center">{row.boiss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Comment interpreter votre position :</strong></p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Dans le bas de fourchette</strong> : potentiel d'amelioration evident,
                appliquez les 10 techniques prioritairement.
              </li>
              <li>
                <strong>Au milieu</strong> : situation correcte mais optimisable, focus sur 3-4
                techniques alignees a votre positionnement.
              </li>
              <li>
                <strong>En haut de fourchette</strong> : vous etes au top de votre segment. Concentrez-vous
                sur le menu engineering et la fidelisation.
              </li>
              <li>
                <strong>Au-dela de la fourchette</strong> : verifiez que vos prix ne sont pas trop eleves
                vs votre positionnement, sinon risque de perte de clientele.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5 - HowTo */}
        <section id="howto" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="5">
            Comment augmenter son ticket moyen en 6 etapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la methode pas-a-pas pour deployer une strategie d'augmentation du ticket moyen
              dans votre etablissement. Comptez 6 semaines pour les premiers resultats visibles,
              6 mois pour atteindre votre objectif.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: "Calculer votre ticket moyen actuel par segment",
                body: "Sortez les donnees de votre POS sur 30 jours minimum. Calculez le ticket moyen global, puis par service (midi/soir), par jour de la semaine (lundi a dimanche), et par segment client (terrasse/salle, sur place/livraison). Identifiez vos points faibles : un mardi soir a 24 EUR alors que votre samedi est a 42 EUR signale un potentiel sous-exploite.",
              },
              {
                title: "Benchmarker contre votre segment",
                body: "Comparez vos chiffres aux fourchettes 2026 (tableau ci-dessus). Calculez l'ecart en EUR et en %. Un bistrot a 28 EUR midi (fourchette 22-32) est en milieu, un a 22 EUR est en bas. Quantifiez le potentiel theorique : si vous montez du bas vers le haut de votre fourchette, combien de CA additionnel ?",
              },
              {
                title: "Analyser votre menu mix",
                body: "Sortez le detail des ventes : combien de prises d'entree, de plat, de dessert, de boissons (et leur type). Calculez les taux : prise entree (cible 65-75 %), prise dessert (cible 55-65 %), nombre de boissons par couvert (cible 1,5-2,5). Reperez les categories sous-performantes. C'est la qui se trouvent vos leviers prioritaires.",
              },
              {
                title: "Choisir 3 techniques d'upselling adaptees",
                body: "Selon votre analyse : ticket faible cause par boissons basses -- technique 1 (upselling carafe vers bouteille). Dessert sous-performant -- technique 7 (cafe et digestif systematiques). Faute de formule premium -- technique 5 (formule dejeuner premium). Choisissez 3 techniques, pas plus. Vouloir tout faire en meme temps fait echouer l'equipe.",
              },
              {
                title: "Former l'equipe : scripts, roleplays, incentives",
                body: "Quatre sessions de 2 heures sur 2 mois : connaissance produits, scripts upselling (avec mots exacts), gestion d'objections, lecture de la table. Faites des roleplays par binomes. Mettez en place un incentive financier : 1 % du delta de CA upselle reverse a l'equipe (a partager mensuellement). Sans incentive, motivation tombe.",
              },
              {
                title: "Mesurer pendant 4 semaines, iterer, deployer plus",
                body: "Suivez chaque semaine vos KPIs (ticket moyen midi/soir, taux de prise, ratio boissons). Identifiez ce qui marche et ce qui ne marche pas. Apres 4 semaines de stabilisation, deployez 2-3 nouvelles techniques. Iterez par cycles de 4 semaines pendant 6 mois. Objectif realiste : +15-25 % de ticket moyen en 6 mois.",
              },
            ].map((step, i) => (
              <li key={i} className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7 flex gap-5">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg shadow-md">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-mono-100 text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Section 6 - 10 techniques */}
        <section id="techniques" className="mb-16">
          <SectionHeading icon={<Wine className="w-6 h-6" />} number="6">
            Les 10 techniques d'upselling a deployer
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les 10 techniques les plus efficaces, classees par impact moyen sur le ticket
              (decroissant). Chacune indique l'impact typique observe sur la base RestauMargin.
            </p>
          </div>

          <div className="space-y-5 mt-8">
            {[
              { num: 1, icon: <Wine className="w-4 h-4 text-purple-600" />, title: "Upselling boissons : carafe vers bouteille", impact: "+1,50 a +3 EUR/couvert", desc: '"Une grande bouteille pour la table ?" - Une bouteille a 32 EUR = meme CA que 4 verres mais marge superieure et reincitation a recommander. Script type : "Pour votre table, je vous suggere [nom du vin], qui se marie tres bien avec [plat commande]." Toujours nommer le vin precisement.' },
              { num: 2, icon: <Utensils className="w-4 h-4 text-purple-600" />, title: "Suggerer entrees et desserts systematiquement", impact: "+4 a +7 EUR/couvert", desc: 'La regle des 70 % : viser 70 % de prise d\'entree et 60 % de prise de dessert. Approche : "Vous prendrez peut-etre une entree avec votre plat ?" + suggestion specifique adaptee. Pour le dessert : presenter le chariot ou apporter physiquement la carte des desserts (taux +35 %).' },
              { num: 3, icon: <Star className="w-4 h-4 text-purple-600" />, title: 'Construire une formule "offre complete"', impact: "+6 a +12 EUR/couvert", desc: "Plat 22 EUR + dessert 8 EUR + cafe 3 EUR = 33 EUR a la carte -- formule a 32 EUR. L'addition gonfle (vs juste plat), food cost incremental faible. Le client a la sensation d'avoir economise 1 EUR, vous gagnez 10 EUR de CA supplementaire vs prise plat seul." },
              { num: 4, icon: <Wine className="w-4 h-4 text-purple-600" />, title: "Carte des vins intelligente", impact: "+3 a +6 EUR/couvert", desc: "3 niveaux de prix (entree 22-28 EUR, milieu 35-48 EUR, haut 60-90 EUR), accords mets-vins suggeres par plat, vins au verre de qualite (15cl a 8-12 EUR), 3 coups de coeur du chef. Eviter les cartes trop longues qui paralysent le choix (effet decision fatigue)." },
              { num: 5, icon: <DollarSign className="w-4 h-4 text-purple-600" />, title: "Formule dejeuner premium", impact: "+4 a +7 EUR/couvert midi", desc: 'Ajouter une formule 24-29 EUR a cote du 15-19 EUR habituel. Effet "ancrage" : 30-40 % des clients basculent vers la formule superieure (entree + plat + dessert + cafe + verre de vin). La formule basse devient le minimum, pas le standard. Booste mecaniquement le ticket midi.' },
              { num: 6, icon: <Sparkles className="w-4 h-4 text-purple-600" />, title: "Plats du jour a marge elevee", impact: "+1 a +2 EUR de marge/couvert", desc: 'Annonce oralement par le serveur a l\'arrivee, taux de prise 35-50 % (effet effort de recherche economise + suggestion implicite). Choisissez-le pour sa marge brute (food cost inferieur a 25 %), pas necessairement pour son prix de vente. C\'est la votre meilleur generateur de marge.' },
              { num: 7, icon: <Coffee className="w-4 h-4 text-purple-600" />, title: "Cafe et digestif systematiques", impact: "+3 a +6 EUR/couvert", desc: "Marges 80-92 % - les categories les plus rentables de la restauration. Cafe avec mignardise = ticket 5-6 EUR pour 80 centimes de food cost. Digestif (grappa, armagnac, calvados) = 8-12 EUR pour 1,50 EUR de cout. Script type : 'Un cafe et eventuellement un petit digestif pour cloturer ?'" },
              { num: 8, icon: <BookIcon className="w-4 h-4 text-purple-600" />, title: "Design de carte (menu engineering)", impact: "+2 a +4 EUR/couvert", desc: 'Lecture en Z (regard naturel haut-gauche puis bas-droite), plats Stars positionnes dans ces zones, prix sans le signe EUR (38 plutot que 38 EUR : reduction de l\'effet \"prix\"), descriptions de 12-18 mots emotionnelles (+28 % de prise sur le meme plat). Eviter les visuels d\'argent (additions stylisees).' },
              { num: 9, icon: <GraduationCap className="w-4 h-4 text-purple-600" />, title: "Former intensivement la salle", impact: "+3 a +6 EUR/couvert", desc: '4 sessions de 2 heures : produits (chaque plat goute par toute l\'equipe), scripts upselling, vins (rudiments de degustation et accords), gestion d\'objections. Incentive sur ventes additionnelles (1-3 % du delta CA). Roleplays mensuels obligatoires. C\'est l\'investissement le plus rentable.' },
              { num: 10, icon: <Star className="w-4 h-4 text-purple-600" />, title: "Offres speciales premium", impact: "+1 a +3 EUR/couvert moyen", desc: 'Plateau anniversaire (45 EUR), magnum du chef (130 EUR a partager a 6), soiree accord mets-vins (65 EUR), menu degustation (48 EUR). Booste le panier moyen sur creneaux specifiques (couples, anniversaires, groupes). Communique via reseaux sociaux et site web.' },
            ].map((tech) => (
              <div key={tech.num} className="border border-mono-900 rounded-xl p-5 bg-white">
                <div className="flex items-start gap-3 mb-2">
                  <span className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0">{tech.num}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-mono-100 mb-1 flex items-center gap-2">{tech.icon} {tech.title}</p>
                    <p className="text-xs font-bold text-emerald-700 mb-2">{tech.impact}</p>
                    <p className="text-mono-400 text-sm leading-relaxed">{tech.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Callout type="info">
            <strong>Ne deployez pas tout en meme temps :</strong> commencez par 2-3 techniques alignees
            a votre diagnostic initial. Stabilisez sur 4-6 semaines, mesurez l'impact, puis ajoutez
            d'autres techniques. Vouloir tout faire d'un coup epuise l'equipe et brouille les KPIs.
          </Callout>
        </section>

        {/* Section 7 - Tableau d'impact */}
        <section id="tableau" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="7">
            Tableau d'impact selon volume de couverts
          </SectionHeading>

          <div className="prose-content">
            <p>
              Combien generera concretement une hausse de votre ticket moyen ? Voici la projection
              en marge nette additionnelle annuelle (food cost incremental hypothese 30 %, charges
              fixes deja absorbees).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Hausse ticket</th>
                  <th className="text-center py-3 px-4 font-semibold">500 couv./mois</th>
                  <th className="text-center py-3 px-4 font-semibold">800 couv./mois</th>
                  <th className="text-center py-3 px-4 font-semibold">1 200 couv./mois</th>
                  <th className="text-center py-3 px-4 font-semibold">2 000 couv./mois</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">3 000 couv./mois</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { hausse: '+2 EUR', v500: '+8 400 EUR', v800: '+13 440 EUR', v1200: '+20 160 EUR', v2000: '+33 600 EUR', v3000: '+50 400 EUR' },
                  { hausse: '+3 EUR', v500: '+12 600 EUR', v800: '+20 160 EUR', v1200: '+30 240 EUR', v2000: '+50 400 EUR', v3000: '+75 600 EUR' },
                  { hausse: '+5 EUR', v500: '+21 000 EUR', v800: '+33 600 EUR', v1200: '+50 400 EUR', v2000: '+84 000 EUR', v3000: '+126 000 EUR' },
                  { hausse: '+7 EUR', v500: '+29 400 EUR', v800: '+47 040 EUR', v1200: '+70 560 EUR', v2000: '+117 600 EUR', v3000: '+176 400 EUR' },
                  { hausse: '+10 EUR', v500: '+42 000 EUR', v800: '+67 200 EUR', v1200: '+100 800 EUR', v2000: '+168 000 EUR', v3000: '+252 000 EUR' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-bold text-mono-100">{row.hausse}</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-semibold">{row.v500}</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-semibold">{row.v800}</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-semibold">{row.v1200}</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-semibold">{row.v2000}</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-semibold">{row.v3000}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Un restaurant a 1 200 couverts/mois qui reussit +5 EUR de ticket genere
              <strong> 50 400 EUR de marge nette annuelle additionnelle</strong>. C'est l'equivalent
              de 1,5 salaire charge, sans cout d'acquisition, sans investissement. Multiplie par
              5-10 ans d'exploitation, c'est entre 252 000 EUR et 504 000 EUR de marge nette qui
              entrent dans votre poche grace a une discipline operationnelle sur l'upselling.
            </p>
          </div>
        </section>

        {/* Section 8 - KPIs */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="8">
            KPIs et indicateurs a suivre semaine apres semaine
          </SectionHeading>

          <div className="prose-content">
            <p>
              Pour piloter efficacement, suivez ces 10 KPIs chaque semaine. Ils donnent une vue
              360 degres sur votre ticket et permettent d'identifier rapidement les derives.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {[
              { kpi: 'Ticket moyen midi (HT)', cible: 'Selon segment', frequence: 'Hebdo' },
              { kpi: 'Ticket moyen soir (HT)', cible: 'Selon segment', frequence: 'Hebdo' },
              { kpi: 'Taux de prise entree', cible: '65-75 %', frequence: 'Hebdo' },
              { kpi: 'Taux de prise dessert', cible: '55-65 %', frequence: 'Hebdo' },
              { kpi: 'Nombre de boissons / couvert', cible: '1,5 - 2,5', frequence: 'Hebdo' },
              { kpi: 'Ratio boissons / CA total', cible: '28-38 %', frequence: 'Mensuel' },
              { kpi: 'Taux de prise formule premium', cible: '> 30 %', frequence: 'Hebdo' },
              { kpi: 'Taux de prise cafe + digestif', cible: '45-55 %', frequence: 'Hebdo' },
              { kpi: 'Taux de retour client (90 jours)', cible: '> 35 %', frequence: 'Mensuel' },
              { kpi: 'Note moyenne avis en ligne', cible: '> 4,3 / 5', frequence: 'Mensuel' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-4">
                <p className="font-bold text-mono-100 text-sm mb-2">{item.kpi}</p>
                <div className="flex gap-2 text-xs">
                  <span className="bg-teal-50 text-teal-700 px-2 py-1 rounded-full font-medium">Cible : {item.cible}</span>
                  <span className="bg-mono-1000 text-mono-500 px-2 py-1 rounded-full">Fréquence : {item.frequence}</span>
                </div>
              </div>
            ))}
          </div>

          <Callout type="warning">
            <strong>L'indicateur a ne JAMAIS sacrifier : taux de retour client.</strong> Si votre
            ticket moyen monte mais que le taux de retour baisse, vous avez franchi la ligne de
            l'upselling agressif. C'est un signal d'alarme. Stabilisez immediatement et reformez
            l'equipe sur les principes ethiques.
          </Callout>
        </section>

        {/* Section 9 - Ethique */}
        <section id="ethique" className="mb-16">
          <SectionHeading icon={<Shield className="w-6 h-6" />} number="9">
            Upselling ethique : la frontiere a ne pas franchir
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'upselling agressif detruit la fidelisation. Un client qui sort en ayant l'impression
              qu'on lui a "vendu" plutot que servi ne revient pas. La frontiere entre suggestion et
              forcage est subtile mais cruciale : c'est elle qui differencie un service attentionne
              d'un piege commercial.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            {[
              { num: 1, title: 'Ne jamais forcer', desc: "Une suggestion non prise est respectée immédiatement. Pas de relance, pas d'insistance, pas de regard reprochateur. Le client doit se sentir libre de refuser sans culpabilité." },
              { num: 2, title: 'Suggérer, pas imposer', desc: 'Éviter "vous voulez la mousse ou la tarte ?" qui force le choix entre deux desserts. Préférer "vous prendrez peut-être un dessert ?" qui laisse la liberté de refuser entièrement.' },
              { num: 3, title: 'Adapter au profil client', desc: "Lire la table : déjeuner d'affaires (suggérer vin et café), couple anniversaire (suggérer bouteille premium), famille avec enfants (proposer formule enfant, dessert partagé), client modeste (rester sur formule simple sans pousser)." },
              { num: 4, title: 'Ne pas mentir', desc: 'Pas de "fait maison" exagéré, pas de fausse rareté ("il ne nous reste plus que 2 magrets"), pas de récit fictif sur la provenance des produits. La confiance perdue ne revient jamais.' },
              { num: 5, title: 'Annoncer les prix', desc: '"Plat du jour à 24 EUR" est éthique. "Plat du jour" sans prix devant un client qui découvre l\'addition à 28 EUR : déceptif. Toujours dire le prix sur les suggestions hors carte.' },
            ].map((rule) => (
              <div key={rule.num} className="flex gap-4 bg-white border border-mono-900 rounded-xl p-5">
                <span className="w-8 h-8 bg-rose-100 text-rose-700 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">{rule.num}</span>
                <div>
                  <p className="font-bold text-mono-100 mb-1">{rule.title}</p>
                  <p className="text-sm text-mono-400 leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-l-4 border-rose-400 bg-rose-50 rounded-r-xl p-5 mt-6">
            <p className="text-sm font-bold text-rose-700 mb-2">Le KPI ethique : le taux de retour client</p>
            <p className="text-sm text-rose-700">
              Un bon restaurant maintient un taux de retour client (clients qui reviennent dans les
              90 jours) <strong>supérieur à 35 %</strong> tout en faisant grimper son ticket moyen.
              Si vous voyez le ticket monter mais le retour client chuter, vous avez franchi la ligne.
              Stop immediat, retour aux fondamentaux ethiques, et reformation de l'equipe.
            </p>
          </div>
        </section>

        {/* Section 10 - Outils digitaux */}
        <section id="outils" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="10">
            Outils digitaux pour piloter son ticket moyen
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le pilotage manuel a ses limites. Un outil de gestion automatise comme RestauMargin
              connecte a votre POS calcule en temps reel votre ticket moyen, vos taux de prise par
              categorie, et vous alerte sur les derives. C'est un copilote indispensable pour
              progresser sur la duree.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {[
              { icon: <BarChart3 className="w-5 h-5 text-teal-600" />, title: 'Dashboard ticket moyen', desc: 'Suivi en temps reel midi/soir/semaine, evolution sur 12 mois, comparaison N vs N-1.' },
              { icon: <Target className="w-5 h-5 text-teal-600" />, title: 'Analyse menu mix', desc: 'Taux de prise par categorie et par plat, identification automatique des Stars / Puzzles / Dogs.' },
              { icon: <Wine className="w-5 h-5 text-teal-600" />, title: 'Suivi du ratio boissons', desc: 'Visualisation immediate du % boissons sur CA total, par service, par jour de semaine.' },
              { icon: <Users className="w-5 h-5 text-teal-600" />, title: 'Performance par serveur', desc: 'Ticket moyen genere par membre d\'equipe, pour identifier les top performers en upselling.' },
              { icon: <AlertTriangle className="w-5 h-5 text-teal-600" />, title: 'Alertes derives', desc: 'Notifications si le ticket moyen chute de plus de 5 % sur une semaine vs la moyenne historique.' },
              { icon: <DollarSign className="w-5 h-5 text-teal-600" />, title: 'Simulateur d\'impact', desc: 'Tester en amont l\'impact d\'une hausse de prix, d\'ajout de formule, d\'une nouvelle technique.' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border border-mono-900 rounded-xl p-4">
                <div className="shrink-0 mt-0.5">{f.icon}</div>
                <div>
                  <p className="text-mono-100 font-semibold text-sm mb-1">{f.title}</p>
                  <p className="text-xs text-mono-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="14 min" variant="footer" />

        {/* FAQ visible */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes sur le ticket moyen</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ── Sources ── */}
        <section className="mb-16 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h3 className="text-base font-bold text-mono-100 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sources et references
          </h3>
          <ul className="space-y-2 text-sm text-mono-400">
            <li>Fiducial Restauration - Etude annuelle des marges et tickets moyens (2025)</li>
            <li>GIRA Conseil - Benchmarks operationnels restauration 2025</li>
            <li>INSEE - Indicateurs de consommation hors domicile (2024-2025)</li>
            <li>Hospitality ON - Etude sur l'upselling et menu engineering 2025</li>
            <li>Base interne RestauMargin : 500+ restaurants connectes, 1,2M+ couverts analyses</li>
            <li>Etudes academiques sur le menu engineering (Pavesic, Smith, Cornell University)</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-center text-white mb-16">
          <ChefHat className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Pilotez votre ticket moyen comme un pro</h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto text-base leading-relaxed">
            Suivi automatique du ticket moyen par jour, par service et par categorie de plat.
            Identification des plats Stars, Puzzles et Dogs. Calcul d'impact de chaque action sur le resultat.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-8 py-3.5 rounded-full hover:bg-teal-50 transition-colors text-base"
            >
              Essayer gratuitement 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/outils/calculateur-food-cost"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Calculateur gratuit
            </Link>
          </div>
          <p className="text-teal-200 text-sm mt-4">Sans carte bancaire - Configuration en 5 minutes</p>
        </div>

        {/* Articles liés */}
        <section>
          <h2 className="text-xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/calcul-marge-restaurant" className="group bg-white border border-mono-900 hover:border-teal-300 rounded-2xl p-5 transition-colors">
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Marges</span>
              <p className="font-semibold text-mono-100 mt-1 group-hover:text-teal-600 transition-colors text-sm">Calculer la marge de son restaurant</p>
            </Link>
            <Link to="/blog/food-cost" className="group bg-white border border-mono-900 hover:border-teal-300 rounded-2xl p-5 transition-colors">
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Food cost</span>
              <p className="font-semibold text-mono-100 mt-1 group-hover:text-teal-600 transition-colors text-sm">Food cost en restauration : guide</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="group bg-white border border-mono-900 hover:border-teal-300 rounded-2xl p-5 transition-colors">
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Pricing</span>
              <p className="font-semibold text-mono-100 mt-1 group-hover:text-teal-600 transition-colors text-sm">Le coefficient multiplicateur</p>
            </Link>
            <Link to="/blog/fiche-technique-restaurant" className="group bg-white border border-mono-900 hover:border-teal-300 rounded-2xl p-5 transition-colors">
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Fiches</span>
              <p className="font-semibold text-mono-100 mt-1 group-hover:text-teal-600 transition-colors text-sm">Fiche technique restaurant : guide</p>
            </Link>
          </div>
        </section>

        {/* Nav bas */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">- Tous les articles</Link>
          <Link to="/blog/prevision-ventes-restaurant" className="text-sm text-teal-600 hover:underline">Prevision des ventes -</Link>
        </div>

        </article>
      </main>

      {/* Footer */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">La plateforme de gestion de marge pour les restaurateurs.</p>
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
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
