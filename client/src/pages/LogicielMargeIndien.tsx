import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, UtensilsCrossed, Zap, Award, Sparkles, Wheat, Wine, Soup, Clock, Flame } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO — "Logiciel de marge pour restaurant indien"
   Mots-cles cibles : marge restaurant indien / food cost curry /
   rentabilite restaurant indien / cout plat indien / coefficient indien /
   marge biryani naan dal / levier boissons indiennes
   ~3 200 mots — mode clair, fond blanc, theme W&B
   Structure staples ultra-rentables (riz, dal, epices, naan : fc 7-20 %)
   vs proteines cheres (agneau, gambas : fc 30-32 %) + levier base gravy
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost ideal pour un restaurant indien ?',
    answer: "Le food cost ideal d'un restaurant indien se situe entre 28 % et 32 %. Il est modere car la carte repose sur des bases tres economiques : riz basmati, lentilles (dal), pois chiches, epices, legumes et naan affichent un cout matieres tres faible (food cost 7 a 20 %). Ce sont les plats de viande d'agneau et les fruits de mer (gambas) qui font grimper la moyenne (30 a 32 %). L'enjeu est d'equilibrer le menu mix pour maintenir la moyenne ponderee sous 32 %.",
  },
  {
    question: 'Combien coute un curry en restaurant indien ?',
    answer: "Un curry coute entre 1,00 EUR et 6,30 EUR en cout matieres selon la proteine. Un dal makhani (lentilles) revient a environ 1,00 EUR, un chana masala (pois chiches) a 1,20 EUR, un poulet tikka masala a 2,50 EUR, un agneau rogan josh a 5,20 EUR et un curry de gambas a 6,30 EUR. La sauce de base (gravy) commune, preparee en batch, coute 0,45 a 0,70 EUR la portion : c'est le secret d'un food cost maitrise dans un restaurant indien.",
  },
  {
    question: 'Quel coefficient multiplicateur appliquer dans un restaurant indien ?',
    answer: "Le coefficient multiplicateur d'un restaurant indien varie selon la famille : x6 a x10 sur les plats vegetariens (dal, curry de legumes, riz) au cout matieres tres bas, x3 a x3,5 sur les plats d'agneau et de fruits de mer, x4 a x5 sur le poulet, et x10 a x14 sur le naan et le riz basmati. Plutot qu'un coefficient unique, un logiciel comme RestauMargin calcule le coefficient optimal recette par recette pour viser un food cost global de 30 %.",
  },
  {
    question: 'Pourquoi les plats vegetariens indiens sont-ils si rentables ?',
    answer: "Les plats vegetariens indiens (dal, chana masala, palak paneer, curry de legumes) reposent sur des ingredients parmi les moins chers de la restauration : lentilles corail, pois chiches secs, epinards, pommes de terre, epices. Le cout matieres tombe a 0,90 a 1,50 EUR pour une portion vendue 10 a 12 EUR, soit un food cost de 9 a 14 % et une marge brute de 86 a 91 %. La cuisine indienne vegetarienne est structurellement l'une des plus rentables qui existe, a l'image des pates seches en cuisine italienne.",
  },
  {
    question: 'Comment gerer la marge sur les boissons dans un restaurant indien ?',
    answer: "Les boissons sont un levier de marge souvent sous-exploite en restaurant indien car la culture du vin y est faible. Les leviers sont ailleurs : les bieres indiennes (Kingfisher, Cobra) achetees 0,90 a 1,10 EUR se vendent 5,50 a 6,50 EUR (coefficient x5 a x6), le lassi mangue maison coute 0,60 EUR et se vend 4,50 EUR, le the chai coute 0,20 EUR pour 3,50 EUR de vente. Un ratio boissons de 20 a 28 % du CA avec une marge brute de 78 a 85 % rehausse nettement la marge globale.",
  },
  {
    question: 'Faut-il un four tandoor et quel impact sur la marge ?',
    answer: "Le four tandoor est la signature d'un restaurant indien : il permet les naans, le poulet tandoori et les brochettes tikka. Cote marge, le naan est un produit champion (cout matieres 0,25 EUR pour un prix de vente 3,00 a 4,00 EUR, food cost 7 %), et le poulet tandoori se vend bien. Le tandoor consomme de l'energie (gaz ou charbon) qu'il faut integrer au cout complet, mais son rendement marge est excellent des lors qu'il tourne a plein regime au service. RestauMargin permet d'imputer le cout energetique aux fiches techniques tandoor.",
  },
  {
    question: 'Quels sont les plats indiens les plus rentables ?',
    answer: "Les plats indiens les plus rentables sont, dans l'ordre : (1) le naan et le riz basmati (food cost 7 a 11 %), (2) les dals et curries de legumineuses (9 a 14 %), (3) les entrees frites vegetariennes (samosa, pakora, bhaji, 12 a 18 %), (4) le poulet tikka masala et le biryani de poulet (17 a 19 %). Les plats a surveiller sont l'agneau (rogan josh, biryani agneau) et les fruits de mer, dont le food cost grimpe a 30-32 %.",
  },
  {
    question: 'Comment limiter le gaspillage en restaurant indien ?',
    answer: "Le gaspillage en restaurant indien provient surtout du riz basmati cuit en exces, des naans invendus et des sauces de base mal dimensionnees. Les leviers : standardiser les grammages de riz (120-140 g cru par portion), cuire le naan a la commande plutot qu'en avance, dimensionner la production de gravy de base selon les previsions de couverts, et suivre les DLC du paneer, de la creme et des yaourts. RestauMargin centralise le suivi DLC et le dimensionnement des batchs pour ramener le gaspillage sous 4 %.",
  },
  {
    question: 'Pourquoi un logiciel de marge est-il utile dans un restaurant indien ?',
    answer: "Une carte indienne complete compte 40 a 60 references (entrees, dals, curries vegetariens, plats de poulet, agneau et fruits de mer, riz, naans, desserts) avec des food cost tres heterogenes (7 % a 32 %). Sans logiciel, impossible de piloter la moyenne ponderee, ni de standardiser la sauce de base commune, ni de reagir aux hausses de prix (agneau, riz basmati, gambas importees). RestauMargin met a jour les couts via le scan OCR des factures, calcule le coefficient optimal par plat et alerte quand une recette passe sous la marge cible.",
  },
  {
    question: 'Quels KPI suivre dans un restaurant indien au quotidien ?',
    answer: "Les 6 KPI essentiels d'un restaurant indien : (1) Food cost global cible 28-32 %, (2) Ratio boissons/CA cible 20-28 %, (3) Ticket moyen par couvert (18 a 32 EUR), (4) Menu mix par famille (part des plats vegetariens et riz rentables vs plats d'agneau couteux), (5) Marge brute par plat phare (suivi prix agneau, riz basmati, gambas), (6) Taux de gaspillage riz et naan (inferieur a 4 %). RestauMargin centralise ces 6 KPI dans un tableau de bord temps reel.",
  },
];

export default function LogicielMargeIndien() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel marge restaurant indien | Food cost curry | RestauMargin"
        description="Logiciel pour calculer la marge d'un restaurant indien. Cout curry, biryani, naan, dal, boissons. Food cost cible 28-32%. Essai gratuit 7 jours."
        path="/logiciel-marge-restaurant-indien"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels metier', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            { name: 'Logiciel marge restaurant indien', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant-indien' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour restaurant indien : food cost et rentabilite en 2026',
            description: "Guide complet du calcul de marge pour restaurant indien : decomposition cout d'un curry, food cost cible 28-32 %, levier base gravy et boissons, menu mix vegetarien/viande, KPI et cas concret.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-07-16',
            dateModified: '2026-07-16',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/logiciel-marge-restaurant-indien' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin Restaurant Indien',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Indian Restaurant Margin Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-restaurant-indien',
            description: "Logiciel SaaS de calcul de marge pour restaurant indien : food cost par curry, biryani et plat vegetarien, coefficient optimal par recette, gestion de la sauce de base (gravy), suivi menu mix, alertes prix fournisseurs (agneau, riz basmati, gambas, epices), suivi DLC paneer et creme.",
            featureList: [
              'Fiches techniques curries, biryanis, dals, tandoori avec grammages precis',
              'Calcul food cost automatique par plat',
              'Coefficient multiplicateur optimal par famille (vegetarien, poulet, agneau, riz, naan)',
              'Gestion et standardisation de la sauce de base (gravy) en batch',
              'Pilotage menu mix entrees / vegetarien / viande / riz-naan / desserts',
              'Gestion des boissons indiennes et marge (biere, lassi, chai)',
              'Scan factures fournisseurs (OCR) : agneau, riz basmati, gambas, epices',
              'Suivi DLC paneer, creme et yaourts',
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
              <UtensilsCrossed className="w-4 h-4" />
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
          <Link to="/logiciel-marge-restaurant" className="hover:text-teal-600">Logiciels metier</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge restaurant indien</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Restaurant indien"
        readTime="14 min"
        date="Juillet 2026"
        title="Logiciel de marge pour restaurant indien : food cost et rentabilite en 2026"
        accentWord="indien"
        subtitle="Le restaurant indien combine des plats vegetariens ultra-rentables (food cost 9-14 %) et des plats d'agneau ou de fruits de mer couteux (30-32 %). Tout l'enjeu : standardiser la sauce de base, equilibrer le menu mix et activer le levier boissons pour viser 18 % de marge nette."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-07-16" readTime="14 min" variant="header" />

        {/* ── Encadre formule rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Reperes cles restaurant indien</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les ratios a memoriser
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost global cible</strong> : 28 % a 32 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Food cost plats vegetariens</strong> : 9 % a 14 % (les plus rentables)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Coefficient boissons</strong> : x5 a x6 biere, x4 a x5 lassi et chai</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Marge nette saine</strong> : 12 % a 18 %</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Un restaurant indien qui pousse ses plats vegetariens, standardise sa sauce de base et
            valorise ses boissons peut atteindre une marge nette de 18 %, bien au-dessus de la moyenne
            de la restauration traditionnelle.
          </p>
        </div>

        {/* ── Table des matieres ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#intro', label: 'Pourquoi le restaurant indien est un modele a fort potentiel' },
              { href: '#food-cost', label: 'Food cost cible : 28-32 %, mais tres heterogene' },
              { href: '#decomposition', label: 'Decomposition cout d\'un poulet tikka masala' },
              { href: '#10-plats', label: 'Tableau : 10 plats indiens types et leurs marges' },
              { href: '#gravy', label: 'La sauce de base (gravy) : le secret de la marge' },
              { href: '#boissons', label: 'Le levier boissons : biere, lassi, chai' },
              { href: '#menu-mix', label: 'Piloter le menu mix vegetarien / viande / riz' },
              { href: '#kpi', label: 'Les 6 KPI a suivre en restaurant indien' },
              { href: '#cas-lyon', label: 'Cas concret : restaurant indien Lyon, 8 % a 19 % en 8 mois' },
              { href: '#logiciel', label: 'Comment RestauMargin automatise tout' },
              { href: '#faq', label: 'Questions frequentes restaurant indien' },
              { href: '#cta', label: 'Essayer RestauMargin gratuitement' },
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

        {/* ═════════════ SECTION 1 : Intro ═════════════ */}
        <section id="intro" className="mb-16">
          <SectionHeading icon={<UtensilsCrossed className="w-6 h-6" />} number="1">
            Pourquoi le restaurant indien est un modele a fort potentiel
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le restaurant indien est l'une des cuisines les plus rentables du paysage de la
              restauration francaise, a condition d'en maitriser le pilotage. La raison tient a la
              structure meme de la carte : les plats vegetariens (dal, curries de legumes, riz, naan)
              reposent sur des ingredients parmi les moins chers de la restauration (lentilles, pois
              chiches, epices, farine), tandis que les plats d'agneau et de fruits de mer sont
              nettement plus couteux. Cette heterogeneite est a la fois la force et le piege du modele
              indien, exactement comme en cuisine italienne ou les pates cotoient les secondi.
            </p>
            <p>
              La force : avec un menu mix bien construit, ou les plats vegetariens, le poulet, le riz et
              les naans representent 60 a 70 % des ventes, la moyenne ponderee du food cost descend
              facilement sous 30 %. Ajoutez un atout unique a la cuisine indienne, la <strong>sauce de
              base (gravy)</strong> preparee en grande quantite le matin et declinee en dizaines de
              curries, et vous obtenez un modele a la fois rentable et rapide au service.
            </p>
            <p>
              Le piege : si le menu mix derive vers les plats d'agneau et de gambas, si le riz et les
              naans sont produits en exces, ou si chaque cuisinier improvise sa propre sauce de base
              avec un cout variable, la rentabilite s'effondre. Beaucoup de restaurants indiens qui
              affichent complet degagent une marge nette anemique de 6-9 %, faute de piloter le bon
              indicateur : la marge brute par famille de plats, et le cout reel de la sauce de base.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Dans un restaurant indien, faire passer la part des
              plats vegetariens et de poulet de 45 % a 60 % des ventes (via menu engineering et
              suggestions serveurs) ameliore mecaniquement la marge brute globale de 3 a 5 points.
              Sur un CA de 380 000 EUR, c'est 11 000 a 19 000 EUR de marge supplementaire, sans rien
              changer aux prix.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Food cost cible ═════════════ */}
        <section id="food-cost" className="mb-16">
          <SectionHeading icon={<Percent className="w-6 h-6" />} number="2">
            Food cost cible : 28-32 %, mais tres heterogene
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le food cost global d'un restaurant indien doit se situer entre 28 % et 32 %. C'est un
              niveau modere, tire vers le bas par la part importante de plats vegetariens et
              d'accompagnements (riz, naan) a tres faible cout matieres. Mais ce chiffre global cache
              une realite essentielle : <strong>le food cost varie de 7 % a 32 % selon la famille de
              plats</strong>.
            </p>
            <p>
              Voici la fourchette de food cost par famille dans un restaurant indien typique :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Naan et riz basmati</strong> : 7 a 11 %. Les champions absolus de la rentabilite.
              </li>
              <li>
                <strong>Dals et curries de legumineuses (dal makhani, chana masala)</strong> : 9 a 14 %.
              </li>
              <li>
                <strong>Entrees frites vegetariennes (samosa, pakora, onion bhaji)</strong> : 12 a 18 %.
              </li>
              <li>
                <strong>Plats de poulet (tikka masala, biryani, korma)</strong> : 17 a 22 %.
              </li>
              <li>
                <strong>Paneer (palak paneer, paneer tikka)</strong> : 20 a 26 %. Le fromage indien coute cher.
              </li>
              <li>
                <strong>Agneau et fruits de mer (rogan josh, biryani agneau, gambas)</strong> :
                30 a 32 %. A surveiller de pres.
              </li>
            </ul>
            <p className="mt-4">
              La cle n'est donc pas de viser un food cost uniforme, mais d'<strong>orchestrer le menu
              mix</strong> pour que la moyenne ponderee reste sous 32 %. C'est exactement ce qu'un
              logiciel de marge calcule en temps reel, en croisant les fiches techniques et les
              volumes de vente reels.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <KPICard
              icon={<Percent className="w-5 h-5" />}
              label="Food cost global"
              value="28 - 32 %"
              note="Moyenne ponderee cible"
              color="teal"
            />
            <KPICard
              icon={<Wheat className="w-5 h-5" />}
              label="Food cost vegetarien"
              value="9 - 14 %"
              note="La famille la plus rentable"
              color="emerald"
            />
            <KPICard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Food cost agneau"
              value="30 - 32 %"
              note="Agneau, gambas, fruits de mer"
              color="amber"
            />
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Decomposition cout ═════════════ */}
        <section id="decomposition" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            Decomposition cout d'un poulet tikka masala
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons l'exemple emblematique : le poulet tikka masala, plat indien le plus vendu en
              France. Portion de 180 g de poulet marine, sauce masala cremeuse, servi avec riz basmati.
              Voici la decomposition precise du cout matieres, en distinguant version standard (poulet
              standard) et version premium (poulet fermier + basmati haut de gamme).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Cout matieres poulet tikka masala</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Composant</th>
                  <th className="text-right py-2 px-3 font-semibold">Standard</th>
                  <th className="text-right py-2 px-3 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Poulet cuisse desossee (180 g)</td>
                  <td className="py-2 px-3 text-right">1,15 EUR</td>
                  <td className="py-2 px-3 text-right">1,45 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Sauce de base masala (tomate, oignon, creme, epices)</td>
                  <td className="py-2 px-3 text-right">0,65 EUR</td>
                  <td className="py-2 px-3 text-right">0,80 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Riz basmati accompagnement (120 g cru)</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                  <td className="py-2 px-3 text-right">0,55 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Marinade yaourt + garniture (coriandre)</td>
                  <td className="py-2 px-3 text-right">0,25 EUR</td>
                  <td className="py-2 px-3 text-right">0,30 EUR</td>
                </tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50">
                  <td className="py-3 px-3 font-bold text-mono-100">Total cout matieres</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-900">2,45 EUR</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-900">3,10 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Analyse rapide :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Version standard vendue 14,50 EUR : food cost = 2,45 / 14,50 = <strong>16,9 %</strong></li>
              <li>Version premium vendue 17,00 EUR : food cost = 3,10 / 17,00 = <strong>18,2 %</strong></li>
              <li>Marge brute standard : <strong>12,05 EUR (83 %)</strong></li>
              <li>Marge brute premium : <strong>13,90 EUR (82 %)</strong></li>
            </ul>
            <p className="mt-4">
              Le poulet tikka masala est un excellent plat d'appel : populaire, accessible, et avec une
              marge brute de 82 a 83 %. La sauce de base (0,65 EUR) est le poste cle : preparee en
              batch et partagee entre tous les curries au poulet, elle garantit un cout stable et un
              food cost maitrise. C'est le pilier de la rentabilite d'un restaurant indien.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : 10 plats types ═════════════ */}
        <section id="10-plats" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            10 plats indiens types et leurs marges
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tableau de reference : 10 plats couvrant toutes les familles de la carte indienne.
              Couts matieres bases sur les prix Metro France et grossistes indo-pakistanais T3 2026,
              prix de vente moyens constates hors zones premium (Paris centre, Cote d'Azur).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Plat</th>
                  <th className="text-center py-3 px-4 font-semibold">Cout matieres</th>
                  <th className="text-center py-3 px-4 font-semibold">Prix carte</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { name: 'Naan nature', cm: '0,25 EUR', pv: '3,50 EUR', fc: '7 %', mb: '3,25 EUR / 93 %' },
                  { name: 'Riz basmati (portion)', cm: '0,45 EUR', pv: '4,00 EUR', fc: '11 %', mb: '3,55 EUR / 89 %' },
                  { name: 'Dal makhani (lentilles)', cm: '1,00 EUR', pv: '10,50 EUR', fc: '10 %', mb: '9,50 EUR / 90 %' },
                  { name: 'Chana masala (pois chiches)', cm: '1,20 EUR', pv: '11,00 EUR', fc: '11 %', mb: '9,80 EUR / 89 %' },
                  { name: 'Samosa vegetarien (x2)', cm: '0,90 EUR', pv: '6,00 EUR', fc: '15 %', mb: '5,10 EUR / 85 %' },
                  { name: 'Poulet tikka masala', cm: '2,45 EUR', pv: '14,50 EUR', fc: '17 %', mb: '12,05 EUR / 83 %' },
                  { name: 'Poulet biryani', cm: '3,00 EUR', pv: '15,50 EUR', fc: '19 %', mb: '12,50 EUR / 81 %' },
                  { name: 'Agneau rogan josh', cm: '5,20 EUR', pv: '17,50 EUR', fc: '30 %', mb: '12,30 EUR / 70 %' },
                  { name: 'Gambas curry (prawn masala)', cm: '6,30 EUR', pv: '19,50 EUR', fc: '32 %', mb: '13,20 EUR / 68 %' },
                  { name: 'Gulab jamun (dessert)', cm: '0,85 EUR', pv: '6,00 EUR', fc: '14 %', mb: '5,15 EUR / 86 %' },
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
                <strong>Le naan et le riz sont des machines a marge</strong> (food cost 7-11 %, marge
                brute 89-93 %). Chaque naan et chaque portion de riz vendus en accompagnement ajoutent
                de la marge quasi pure. Il faut systematiquement les proposer.
              </li>
              <li>
                <strong>Les plats vegetariens</strong> (dal, chana) affichent 89-90 % de marge brute :
                ce sont les vrais champions rentabilite, souvent sous-valorises dans la carte.
              </li>
              <li>
                <strong>L'agneau et les gambas</strong> plombent la moyenne (30-32 %). Ils sont
                indispensables au prestige de la carte mais ne doivent pas depasser 25-30 % des ventes.
              </li>
              <li>
                <strong>Le gulab jamun</strong> est un dessert ultra-rentable (86 % de marge brute) et
                facile a vendre en suggestion. Chaque dessert ajoute environ 5 EUR de marge quasi pure.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Sauce de base (gravy) ═════════════ */}
        <section id="gravy" className="mb-16">
          <SectionHeading icon={<Soup className="w-6 h-6" />} number="5">
            La sauce de base (gravy) : le secret de la marge
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est l'atout unique de la cuisine indienne, et le levier de marge le plus puissant du
              modele. La plupart des curries (tikka masala, korma, madras, jalfrezi, rogan josh)
              partagent une meme <strong>sauce de base (gravy)</strong> : un fond d'oignon, tomate,
              gingembre, ail et epices, prepare en grande quantite le matin. On la decline ensuite en
              dizaines de plats en ajoutant proteine, creme ou epices specifiques a la commande.
            </p>
            <p>
              Ce systeme change tout : il permet un service ultra-rapide au rush, une consistance
              parfaite du gout, et surtout un <strong>cout matieres maitrise et previsible</strong>.
              Encore faut-il standardiser la recette et dimensionner la production, sinon chaque
              cuisinier improvise et le cout derive.
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-5">
            <GravyCard
              title="Sauce de base maison en batch"
              cost="0,45 - 0,70 EUR / portion"
              labor="2 a 3 h le matin, une seule fois"
              pros="Cout maitrise, gout constant, service rapide au rush, food cost stable"
              cons="Necessite savoir-faire, planification, DLC 3-4 jours au frais"
            />
            <GravyCard
              title="Sauces a la commande ou bases achetees"
              cost="0,90 - 1,50 EUR / portion"
              labor="Faible a nul (si base industrielle)"
              pros="Simplicite, zero prep matinale, flexibilite"
              cons="Cout matieres 2x plus eleve, food cost qui derive, gout moins authentique"
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>L'arbitrage en pratique :</strong> la sauce de base maison est presque toujours
              la bonne decision economique. Elle divise par deux le cout matieres de la partie sauce et
              accelere le service. Le seul vrai cout est la main-d'oeuvre matinale (2-3 h), a repartir
              sur les dizaines de portions produites. Sur 60 a 80 curries servis dans la journee, le
              cout horaire est negligeable a la portion.
            </p>
            <p className="mt-4">
              Un logiciel de marge permet de figer la fiche technique de la gravy de base, d'en calculer
              le cout exact a la portion et de detecter toute derive (hausse du prix des oignons, des
              tomates ou de la creme). C'est souvent une revelation : beaucoup de restaurateurs indiens
              ne connaissent pas le cout reel de leur sauce de base, alors qu'elle entre dans 70 % des
              plats de la carte.
            </p>

            <Callout type="warning">
              <strong>Piege classique :</strong> laisser chaque cuisinier preparer la gravy "au feeling"
              sans fiche technique. Le cout matieres varie alors de 0,45 a 0,90 EUR la portion selon le
              jour et la main, soit 5 a 8 points de food cost qui partent en fumee sans que personne ne
              le voie. Standardiser la sauce de base est le premier chantier marge d'un restaurant indien.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Levier boissons ═════════════ */}
        <section id="boissons" className="mb-16">
          <SectionHeading icon={<Wine className="w-6 h-6" />} number="6">
            Le levier boissons : biere, lassi, chai
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le restaurant indien a un profil boissons particulier : la culture du vin y est faible,
              mais la biere, le lassi et le the chai offrent des marges exceptionnelles. Beaucoup
              d'etablissements negligent ce levier, alors qu'il peut ajouter 3 a 5 points de marge nette
              globale sans effort.
            </p>
            <p>
              Les coefficients sont eleves : <strong>x5 a x6 sur la biere</strong> (indienne ou
              standard), <strong>x4 a x5 sur le lassi et le chai</strong> maison. Concretement :
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Exemple : marge sur les boissons indiennes</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Boisson</th>
                  <th className="text-right py-2 px-3 font-semibold">Achat HT</th>
                  <th className="text-right py-2 px-3 font-semibold">Vente</th>
                  <th className="text-right py-2 px-3 font-semibold">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Biere indienne (Kingfisher, Cobra, 33 cl)</td>
                  <td className="py-2 px-3 text-right">0,95 EUR</td>
                  <td className="py-2 px-3 text-right">6,00 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">5,05 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Lassi mangue maison</td>
                  <td className="py-2 px-3 text-right">0,60 EUR</td>
                  <td className="py-2 px-3 text-right">4,50 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">3,90 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">The chai maison (masala chai)</td>
                  <td className="py-2 px-3 text-right">0,20 EUR</td>
                  <td className="py-2 px-3 text-right">3,50 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">3,30 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Vin (au verre)</td>
                  <td className="py-2 px-3 text-right">0,90 EUR</td>
                  <td className="py-2 px-3 text-right">5,50 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">4,60 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              La strategie boissons d'un restaurant indien repose sur trois piliers : <strong>proposer
              systematiquement la biere</strong> (elle accompagne parfaitement les plats epices), pousser
              le <strong>lassi</strong> (mangue, sale, sucre) comme boisson signature rafraichissante, et
              transformer le <strong>the chai</strong> en fin de repas quasi automatique. Le chai coute
              0,20 EUR et se vend 3,50 EUR : c'est l'une des meilleures marges de tout l'etablissement.
            </p>
            <p>
              Objectif : un <strong>ratio boissons representant 20 a 28 % du CA</strong>, avec une marge
              brute de 78-85 %. Un restaurant indien qui passe de 15 % a 25 % de ratio boissons gagne
              mecaniquement 3 a 5 points de marge nette globale. C'est l'un des leviers les plus rapides
              a activer, et le plus souvent neglige.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Menu mix ═════════════ */}
        <section id="menu-mix" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="7">
            Piloter le menu mix vegetarien / viande / riz
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le menu mix (repartition des ventes par famille de plats) est le pilier de la rentabilite
              d'un restaurant indien. Comme on l'a vu, les food cost vont de 7 % (naan, riz) a 32 %
              (gambas) : c'est la <strong>repartition des ventes</strong> qui determine la marge
              globale, plus encore que les prix individuels.
            </p>
            <p>
              Voici une repartition cible saine pour un restaurant indien visant 30 % de food cost global :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li><strong>Plats vegetariens (dals, curries de legumes, paneer)</strong> : 25 a 35 % des ventes. Le cœur rentable.</li>
              <li><strong>Plats de poulet</strong> : 30 a 40 % des ventes. Rentables et populaires, a mettre en avant.</li>
              <li><strong>Plats d'agneau et fruits de mer</strong> : 20 a 30 % des ventes. A contenir car food cost eleve.</li>
              <li><strong>Riz et naans (accompagnements)</strong> : taux d'attache proche de 100 %. Marge quasi pure a proposer systematiquement.</li>
              <li><strong>Entrees (samosa, pakora) et desserts</strong> : taux d'attache 30-50 %. A pousser en suggestion.</li>
            </ul>
            <p className="mt-4">
              Le menu engineering indien consiste a classer chaque plat selon sa popularite et sa
              marge (matrice etoiles / vaches a lait / enigmes / poids morts), puis a agir : mettre en
              avant les plats vegetariens et de poulet a forte marge (placement carte, formules, thali),
              repositionner ou retirer les plats peu rentables et peu vendus, et former les serveurs a
              proposer systematiquement naan, riz, biere et dessert.
            </p>

            <Callout type="info">
              <strong>Astuce menu engineering :</strong> creez une formule "thali" ou "menu
              decouverte" combinant un plat vegetarien a forte marge, du riz et un naan. Le client y voit
              une belle offre decouverte, vous y voyez un panier a food cost tres bas (18-22 %) qui tire
              la moyenne globale vers le bas tout en augmentant le ticket moyen.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : KPI ═════════════ */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="8">
            Les 6 KPI a suivre en restaurant indien
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un restaurant indien bien gere pilote 6 indicateurs au quotidien. Sans ces KPI, le
              restaurateur ne voit pas la derive du menu mix ni l'erosion de marge causee par les
              hausses de prix (agneau, riz basmati, gambas importees, huile) avant qu'il ne soit
              trop tard.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Percent className="w-5 h-5" />, title: '1. Food cost global', desc: 'Cible 28-32 % en moyenne ponderee. Au-dela, verifier le menu mix et le cout de la sauce de base.' },
              { icon: <Wine className="w-5 h-5" />, title: '2. Ratio boissons / CA', desc: 'Cible 20-28 %. Le levier le plus rapide : biere, lassi et chai a forte marge.' },
              { icon: <DollarSign className="w-5 h-5" />, title: '3. Ticket moyen', desc: '18 a 32 EUR par couvert selon positionnement. Suivre l\'effet naan + riz + boisson + dessert.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: '4. Menu mix par famille', desc: 'Part des plats vegetariens et poulet (cible 55-65 %) vs agneau couteux. Cle de la marge globale.' },
              { icon: <TrendingUp className="w-5 h-5" />, title: '5. Marge brute par plat phare', desc: 'Suivre les variations matieres (agneau, riz basmati, gambas) sur les best-sellers.' },
              { icon: <Clock className="w-5 h-5" />, title: '6. Taux de gaspillage', desc: 'Cible inferieure a 4 %. Surveiller riz cuit en exces, naans invendus, DLC paneer et creme.' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">
                  {kpi.icon}
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{kpi.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{kpi.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Cas concret Lyon ═════════════ */}
        <section id="cas-lyon" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="9">
            Cas concret : restaurant indien Lyon, 8 % a 19 % en 8 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Restaurant indien a Lyon (7eme), 60 couverts. Reprise en octobre 2025 par Amir, chef
              forme a Delhi, et sa compagne Sarah en salle. CA annuel constate a la reprise :
              380 000 EUR, marge nette 8 %. Bonne reputation, salle pleine le vendredi et samedi, mais
              rentabilite decevante en semaine.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Diagnostic initial (mois 1)</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Food cost reel : 35 % (vs cible 30 %). Menu mix derive : trop d'agneau et de gambas.</li>
              <li>Sauce de base non standardisee : chaque service, un cout different, aucune fiche technique.</li>
              <li>Ratio boissons : 14 % du CA. Biere et lassi jamais proposes activement.</li>
              <li>Riz basmati cuit en large exces, naans jetes en fin de service : gaspillage 8 %.</li>
              <li>Aucun suivi des prix fournisseurs (agneau, riz, gambas) ni de fiches techniques formalisees.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Plan d'action en 4 phases</h3>
            <div className="space-y-4 mt-6">
              <PhaseCard
                phase="Phase 1 (mois 1-2)"
                title="Standardiser la sauce de base et les fiches techniques"
                actions={[
                  'Fiche technique figee de la gravy de base via RestauMargin (cout 0,58 EUR/portion)',
                  'Creation des fiches techniques des 48 plats, grammages standardises (riz 130 g cru)',
                  'Identification des plats poids morts (food cost superieur a 33 %, peu vendus)',
                  'Resultat : food cost passe de 35 % a 31 %',
                ]}
              />
              <PhaseCard
                phase="Phase 2 (mois 3-4)"
                title="Reequilibrage du menu mix"
                actions={[
                  'Mise en avant carte des plats vegetariens et de poulet a forte marge',
                  'Creation d\'une formule thali decouverte (food cost 20 %)',
                  'Retrait de 5 plats d\'agneau peu vendus, formation serveurs aux suggestions',
                  'Resultat : part des vegetariens + poulet montee de 45 % a 60 %',
                ]}
              />
              <PhaseCard
                phase="Phase 3 (mois 5-6)"
                title="Activer le levier boissons"
                actions={[
                  'Proposition systematique de biere indienne et lassi a chaque table',
                  'Le chai propose en fin de repas (taux d\'attache monte a 40 %)',
                  'Carte des boissons revue avec coefficient x5 harmonise',
                  'Resultat : ratio boissons monte de 14 % a 24 %',
                ]}
              />
              <PhaseCard
                phase="Phase 4 (mois 7-8)"
                title="Pilotage en temps reel"
                actions={[
                  'Scan factures OCR via RestauMargin (agneau, riz basmati, gambas, epices)',
                  'Tableau de bord verifie 2x/semaine (food cost + menu mix + boissons)',
                  'Dimensionnement du riz et des naans selon previsions, gaspillage a 3,5 %',
                  'Resultat final : marge nette 19 %',
                ]}
              />
            </div>

            <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-emerald-900 text-lg">Resultats apres 8 mois</h3>
              </div>
              <ul className="space-y-2 text-emerald-800 text-sm">
                <li><strong>CA annuel :</strong> 380 000 EUR -- 418 000 EUR (+10 %)</li>
                <li><strong>Food cost :</strong> 35 % -- 30 %</li>
                <li><strong>Marge nette :</strong> 8 % -- 19 % (soit 30 400 EUR -- 79 420 EUR)</li>
                <li><strong>Ratio boissons :</strong> 14 % -- 24 % du CA</li>
                <li><strong>Part vegetariens + poulet :</strong> 45 % -- 60 % des ventes</li>
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
              RestauMargin est concu pour la realite operationnelle d'un restaurant indien : carte
              large, sauce de base a standardiser, food cost heterogenes, levier boissons et menu mix a
              piloter. Voici les 6 modules cles qui vous font gagner 8 a 15 heures par mois et 5 a 10
              points de marge nette.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Soup className="w-5 h-5" />, title: 'Fiches techniques et sauce de base', desc: 'Figez la recette de votre gravy de base et de chaque curry avec grammages precis. Food cost calcule automatiquement.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Pilotage menu mix', desc: 'Visualisez la repartition des ventes par famille (vegetarien, poulet, agneau) et son impact sur la marge globale.' },
              { icon: <Wine className="w-5 h-5" />, title: 'Gestion des boissons', desc: 'Suivez la marge sur biere, lassi et chai, le coefficient et le ratio boissons/CA. Activez le levier le plus rentable.' },
              { icon: <AlertTriangle className="w-5 h-5" />, title: 'Alertes deviation marge', desc: 'Notification des qu\'un plat passe sous le seuil de marge cible ou qu\'un prix fournisseur (agneau, riz, gambas) augmente.' },
              { icon: <Lightbulb className="w-5 h-5" />, title: 'Scan factures OCR', desc: 'Photographiez vos factures (grossistes indo-pakistanais, Metro). Les prix agneau, riz basmati et epices se mettent a jour seuls.' },
              { icon: <Flame className="w-5 h-5" />, title: 'Cout tandoor et suivi DLC', desc: 'Imputez le cout energetique du tandoor aux fiches naan et tandoori, et suivez les DLC du paneer, de la creme et des yaourts.' },
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              Des dizaines de restaurants indiens en France utilisent deja RestauMargin pour piloter
              leur rentabilite. Gain moyen constate : <strong>5 a 8 points de marge nette en 8 mois</strong>,
              principalement grace a la standardisation de la sauce de base, au reequilibrage du menu mix
              et a l'activation du levier boissons. Pour aller plus loin, lisez notre guide sur le <Link to="/blog/menu-engineering-boston-matrix" className="text-teal-700 underline hover:text-teal-800">menu engineering</Link>,
              apprenez a <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800">reduire votre food cost</Link>, comprenez le <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-800">coefficient multiplicateur</Link>,
              comparez avec la page <Link to="/logiciel-marge-restaurant-italien" className="text-teal-700 underline hover:text-teal-800">logiciel de marge pour restaurant italien</Link> ou
              testez le <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-07-16" readTime="14 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes restaurant indien</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ═════════════ CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Piloter la marge de votre restaurant indien avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Food cost par curry, sauce de base standardisee, menu mix, marge sur les boissons, alertes
              prix, KPI temps reel : tout ce qu'il faut pour viser une marge nette superieure a 18 %.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> &mdash; essai gratuit 7 jours, sans engagement, sans carte bancaire.
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
            <Link to="/blog/menu-engineering-boston-matrix" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Menu engineering : optimiser sa carte</h3>
              <p className="text-xs text-mono-500">Matrice etoiles, vaches a lait, enigmes, poids morts.</p>
            </Link>
            <Link to="/logiciel-marge-restaurant-italien" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Logiciel marge restaurant italien</h3>
              <p className="text-xs text-mono-500">Food cost pates, levier vins, menu mix trattoria.</p>
            </Link>
            <Link to="/blog/marge-boissons-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Marge sur les boissons</h3>
              <p className="text-xs text-mono-500">Coefficient et marge brute des boissons en restauration.</p>
            </Link>
            <Link to="/outils/calculateur-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calculateur food cost gratuit</h3>
              <p className="text-xs text-mono-500">Calculez la marge de vos plats en 30 secondes.</p>
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

function GravyCard({ title, cost, labor, pros, cons }: {
  title: string; cost: string; labor: string; pros: string; cons: string;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 transition-colors">
      <h3 className="font-bold text-mono-100 mb-3">{title}</h3>
      <div className="space-y-2 text-xs text-mono-400 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-mono-500">Cout matieres :</span>
          <span>{cost}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-mono-500">Main-d'oeuvre :</span>
          <span>{labor}</span>
        </div>
      </div>
      <div className="space-y-2 text-xs">
        <div className="text-emerald-700"><strong>+ :</strong> {pros}</div>
        <div className="text-red-700"><strong>- :</strong> {cons}</div>
      </div>
    </div>
  );
}

function PhaseCard({ phase, title, actions }: { phase: string; title: string; actions: string[] }) {
  return (
    <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6">
      <div className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1">{phase}</div>
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
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
