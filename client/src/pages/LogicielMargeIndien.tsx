import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, UtensilsCrossed, Zap, Award, Sparkles, Wheat, Wine, Soup, Clock, Flame } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

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
    question: 'Quel est le food cost idéal pour un restaurant indien ?',
    answer: "Le food cost idéal d'un restaurant indien se situe entre 28 % et 32 %. Il est modéré car la carte repose sur des bases très économiques : riz basmati, lentilles (dal), pois chiches, épices, légumes et naan affichent un coût matières très faible (food cost 7 à 20 %). Ce sont les plats de viande d'agneau et les fruits de mer (gambas) qui font grimper la moyenne (30 à 32 %). L'enjeu est d'équilibrer le menu mix pour maintenir la moyenne pondérée sous 32 %.",
  },
  {
    question: 'Combien coûte un curry en restaurant indien ?',
    answer: "Un curry coûte entre 1,00 EUR et 6,30 EUR en coût matières selon la protéine. Un dal makhani (lentilles) revient à environ 1,00 EUR, un chana masala (pois chiches) à 1,20 EUR, un poulet tikka masala à 2,50 EUR, un agneau rogan josh à 5,20 EUR et un curry de gambas à 6,30 EUR. La sauce de base (gravy) commune, préparée en batch, coûte 0,45 à 0,70 EUR la portion : c'est le secret d'un food cost maîtrisé dans un restaurant indien.",
  },
  {
    question: 'Quel coefficient multiplicateur appliquer dans un restaurant indien ?',
    answer: "Le coefficient multiplicateur d'un restaurant indien varie selon la famille : x6 à x10 sur les plats végétariens (dal, curry de légumes, riz) au coût matières très bas, x3 à x3,5 sur les plats d'agneau et de fruits de mer, x4 à x5 sur le poulet, et x10 à x14 sur le naan et le riz basmati. Plutôt qu'un coefficient unique, un logiciel comme RestauMargin calcule le coefficient optimal recette par recette pour viser un food cost global de 30 %.",
  },
  {
    question: 'Pourquoi les plats végétariens indiens sont-ils si rentables ?',
    answer: "Les plats végétariens indiens (dal, chana masala, palak paneer, curry de légumes) reposent sur des ingrédients parmi les moins chers de la restauration : lentilles corail, pois chiches secs, épinards, pommes de terre, épices. Le coût matières tombe à 0,90 à 1,50 EUR pour une portion vendue 10 à 12 EUR, soit un food cost de 9 à 14 % et une marge brute de 86 à 91 %. La cuisine indienne végétarienne est structurellement l'une des plus rentables qui existe, à l'image des pâtes sèches en cuisine italienne.",
  },
  {
    question: 'Comment gérer la marge sur les boissons dans un restaurant indien ?',
    answer: "Les boissons sont un levier de marge souvent sous-exploité en restaurant indien car la culture du vin y est faible. Les leviers sont ailleurs : les bières indiennes (Kingfisher, Cobra) achetées 0,90 à 1,10 EUR se vendent 5,50 à 6,50 EUR (coefficient x5 à x6), le lassi mangue maison coûte 0,60 EUR et se vend 4,50 EUR, le thé chai coûte 0,20 EUR pour 3,50 EUR de vente. Un ratio boissons de 20 à 28 % du CA avec une marge brute de 78 à 85 % rehausse nettement la marge globale.",
  },
  {
    question: 'Faut-il un four tandoor et quel impact sur la marge ?',
    answer: "Le four tandoor est la signature d'un restaurant indien : il permet les naans, le poulet tandoori et les brochettes tikka. Côté marge, le naan est un produit champion (coût matières 0,25 EUR pour un prix de vente 3,00 à 4,00 EUR, food cost 7 %), et le poulet tandoori se vend bien. Le tandoor consomme de l'énergie (gaz ou charbon) qu'il faut intégrer au coût complet, mais son rendement marge est excellent dès lors qu'il tourne à plein régime au service. RestauMargin permet d'imputer le coût énergétique aux fiches techniques tandoor.",
  },
  {
    question: 'Quels sont les plats indiens les plus rentables ?',
    answer: "Les plats indiens les plus rentables sont, dans l'ordre : (1) le naan et le riz basmati (food cost 7 à 11 %), (2) les dals et curries de légumineuses (9 à 14 %), (3) les entrées frites végétariennes (samosa, pakora, bhaji, 12 à 18 %), (4) le poulet tikka masala et le biryani de poulet (17 à 19 %). Les plats à surveiller sont l'agneau (rogan josh, biryani agneau) et les fruits de mer, dont le food cost grimpe à 30-32 %.",
  },
  {
    question: 'Comment limiter le gaspillage en restaurant indien ?',
    answer: "Le gaspillage en restaurant indien provient surtout du riz basmati cuit en excès, des naans invendus et des sauces de base mal dimensionnées. Les leviers : standardiser les grammages de riz (120-140 g cru par portion), cuire le naan à la commande plutôt qu'en avance, dimensionner la production de gravy de base selon les prévisions de couverts, et suivre les DLC du paneer, de la crème et des yaourts. RestauMargin centralise le suivi DLC et le dimensionnement des batchs pour ramener le gaspillage sous 4 %.",
  },
  {
    question: 'Pourquoi un logiciel de marge est-il utile dans un restaurant indien ?',
    answer: "Une carte indienne complète compte 40 à 60 références (entrées, dals, curries végétariens, plats de poulet, agneau et fruits de mer, riz, naans, desserts) avec des food cost très hétérogènes (7 % à 32 %). Sans logiciel, impossible de piloter la moyenne pondérée, ni de standardiser la sauce de base commune, ni de réagir aux hausses de prix (agneau, riz basmati, gambas importées). RestauMargin met à jour les coûts via le scan OCR des factures, calcule le coefficient optimal par plat et alerte quand une recette passe sous la marge cible.",
  },
  {
    question: 'Quels KPI suivre dans un restaurant indien au quotidien ?',
    answer: "Les 6 KPI essentiels d'un restaurant indien : (1) Food cost global cible 28-32 %, (2) Ratio boissons/CA cible 20-28 %, (3) Ticket moyen par couvert (18 à 32 EUR), (4) Menu mix par famille (part des plats végétariens et riz rentables vs plats d'agneau coûteux), (5) Marge brute par plat phare (suivi prix agneau, riz basmati, gambas), (6) Taux de gaspillage riz et naan (inférieur à 4 %). RestauMargin centralise ces 6 KPI dans un tableau de bord temps réel.",
  },
];

export default function LogicielMargeIndien() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Logiciel marge restaurant indien | Food cost curry | RestauMargin"
        description="Logiciel pour calculer la marge d'un restaurant indien. Coût curry, biryani, naan, dal, boissons. Food cost cible 28-32%. Essai gratuit 7 jours."
        path="/logiciel-marge-restaurant-indien"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels métier', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            { name: 'Logiciel marge restaurant indien', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant-indien' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour restaurant indien : food cost et rentabilité en 2026',
            description: "Guide complet du calcul de marge pour restaurant indien : décomposition coût d'un curry, food cost cible 28-32 %, levier base gravy et boissons, menu mix végétarien/viande, KPI et exemple illustratif.",
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
            description: "Logiciel SaaS de calcul de marge pour restaurant indien : food cost par curry, biryani et plat végétarien, coefficient optimal par recette, gestion de la sauce de base (gravy), suivi menu mix, alertes prix fournisseurs (agneau, riz basmati, gambas, épices), suivi DLC paneer et crème.",
            featureList: [
              'Fiches techniques curries, biryanis, dals, tandoori avec grammages précis',
              'Calcul food cost automatique par plat',
              'Coefficient multiplicateur optimal par famille (végétarien, poulet, agneau, riz, naan)',
              'Gestion et standardisation de la sauce de base (gravy) en batch',
              'Pilotage menu mix entrées / végétarien / viande / riz-naan / desserts',
              'Gestion des boissons indiennes et marge (bière, lassi, chai)',
              'Scan factures fournisseurs (OCR) : agneau, riz basmati, gambas, épices',
              'Suivi DLC paneer, crème et yaourts',
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
      <PublicHeader />

      {/* ── Breadcrumbs visibles ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/logiciel-marge-restaurant" className="hover:text-teal-600">Logiciels métier</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge restaurant indien</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Restaurant indien"
        readTime="14 min"
        date="Juillet 2026"
        title="Logiciel de marge pour restaurant indien : food cost et rentabilité en 2026"
        accentWord="indien"
        subtitle="Le restaurant indien combine des plats végétariens ultra-rentables (food cost 9-14 %) et des plats d'agneau ou de fruits de mer coûteux (30-32 %). Tout l'enjeu : standardiser la sauce de base, équilibrer le menu mix et activer le levier boissons pour viser 18 % de marge nette."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-07-16" readTime="14 min" variant="header" />

        {/* ── Encadre formule rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Repères clés restaurant indien</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les ratios à mémoriser
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost global cible</strong> : 28 % à 32 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Food cost plats végétariens</strong> : 9 % à 14 % (les plus rentables)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Coefficient boissons</strong> : x5 à x6 bière, x4 à x5 lassi et chai</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Marge nette saine</strong> : 12 % à 18 %</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Un restaurant indien qui pousse ses plats végétariens, standardise sa sauce de base et
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
              { href: '#intro', label: 'Pourquoi le restaurant indien est un modèle à fort potentiel' },
              { href: '#food-cost', label: 'Food cost cible : 28-32 %, mais très hétérogène' },
              { href: '#decomposition', label: 'Décomposition coût d\'un poulet tikka masala' },
              { href: '#10-plats', label: 'Tableau : 10 plats indiens types et leurs marges' },
              { href: '#gravy', label: 'La sauce de base (gravy) : le secret de la marge' },
              { href: '#boissons', label: 'Le levier boissons : bière, lassi, chai' },
              { href: '#menu-mix', label: 'Piloter le menu mix végétarien / viande / riz' },
              { href: '#kpi', label: 'Les 6 KPI à suivre en restaurant indien' },
              { href: '#cas-lyon', label: 'Exemple illustratif : un restaurant indien de quartier, de 8 % à 19 % de marge nette' },
              { href: '#logiciel', label: 'Comment RestauMargin automatise tout' },
              { href: '#faq', label: 'Questions fréquentes restaurant indien' },
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
            Pourquoi le restaurant indien est un modèle à fort potentiel
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le restaurant indien est l'une des cuisines les plus rentables du paysage de la
              restauration française, à condition d'en maîtriser le pilotage. La raison tient à la
              structure même de la carte : les plats végétariens (dal, curries de légumes, riz, naan)
              reposent sur des ingrédients parmi les moins chers de la restauration (lentilles, pois
              chiches, épices, farine), tandis que les plats d'agneau et de fruits de mer sont
              nettement plus coûteux. Cette hétérogénéité est à la fois la force et le piège du modèle
              indien, exactement comme en cuisine italienne où les pâtes côtoient les secondi.
            </p>
            <p>
              La force : avec un menu mix bien construit, où les plats végétariens, le poulet, le riz et
              les naans représentent 60 à 70 % des ventes, la moyenne pondérée du food cost descend
              facilement sous 30 %. Ajoutez un atout unique à la cuisine indienne, la <strong>sauce de
              base (gravy)</strong> préparée en grande quantité le matin et déclinée en dizaines de
              curries, et vous obtenez un modèle à la fois rentable et rapide au service.
            </p>
            <p>
              Le piège : si le menu mix dérive vers les plats d'agneau et de gambas, si le riz et les
              naans sont produits en excès, ou si chaque cuisinier improvise sa propre sauce de base
              avec un coût variable, la rentabilité s'effondre. Beaucoup de restaurants indiens qui
              affichent complet dégagent une marge nette anémique de 6-9 %, faute de piloter le bon
              indicateur : la marge brute par famille de plats, et le coût réel de la sauce de base.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Dans un restaurant indien, faire passer la part des
              plats végétariens et de poulet de 45 % à 60 % des ventes (via menu engineering et
              suggestions serveurs) améliore mécaniquement la marge brute globale de 3 à 5 points.
              Sur un CA de 380 000 EUR, c'est 11 000 à 19 000 EUR de marge supplémentaire, sans rien
              changer aux prix.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Food cost cible ═════════════ */}
        <section id="food-cost" className="mb-16">
          <SectionHeading icon={<Percent className="w-6 h-6" />} number="2">
            Food cost cible : 28-32 %, mais très hétérogène
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le food cost global d'un restaurant indien doit se situer entre 28 % et 32 %. C'est un
              niveau modéré, tiré vers le bas par la part importante de plats végétariens et
              d'accompagnements (riz, naan) à très faible coût matières. Mais ce chiffre global cache
              une réalité essentielle : <strong>le food cost varie de 7 % à 32 % selon la famille de
              plats</strong>.
            </p>
            <p>
              Voici la fourchette de food cost par famille dans un restaurant indien typique :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Naan et riz basmati</strong> : 7 à 11 %. Les champions absolus de la rentabilité.
              </li>
              <li>
                <strong>Dals et curries de légumineuses (dal makhani, chana masala)</strong> : 9 à 14 %.
              </li>
              <li>
                <strong>Entrées frites végétariennes (samosa, pakora, onion bhaji)</strong> : 12 à 18 %.
              </li>
              <li>
                <strong>Plats de poulet (tikka masala, biryani, korma)</strong> : 17 à 22 %.
              </li>
              <li>
                <strong>Paneer (palak paneer, paneer tikka)</strong> : 20 à 26 %. Le fromage indien coûte cher.
              </li>
              <li>
                <strong>Agneau et fruits de mer (rogan josh, biryani agneau, gambas)</strong> :
                30 à 32 %. À surveiller de près.
              </li>
            </ul>
            <p className="mt-4">
              La clé n'est donc pas de viser un food cost uniforme, mais d'<strong>orchestrer le menu
              mix</strong> pour que la moyenne pondérée reste sous 32 %. C'est exactement ce qu'un
              logiciel de marge calcule en temps réel, en croisant les fiches techniques et les
              volumes de vente réels.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <KPICard
              icon={<Percent className="w-5 h-5" />}
              label="Food cost global"
              value="28 - 32 %"
              note="Moyenne pondérée cible"
              color="teal"
            />
            <KPICard
              icon={<Wheat className="w-5 h-5" />}
              label="Food cost végétarien"
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
            Décomposition coût d'un poulet tikka masala
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons l'exemple emblématique : le poulet tikka masala, plat indien le plus vendu en
              France. Portion de 180 g de poulet mariné, sauce masala crémeuse, servi avec riz basmati.
              Voici la décomposition précise du coût matières, en distinguant version standard (poulet
              standard) et version premium (poulet fermier + basmati haut de gamme).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Coût matières poulet tikka masala</h3>
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
                  <td className="py-2 px-3 font-medium">Poulet cuisse désossée (180 g)</td>
                  <td className="py-2 px-3 text-right">1,15 EUR</td>
                  <td className="py-2 px-3 text-right">1,45 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Sauce de base masala (tomate, oignon, crème, épices)</td>
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
                  <td className="py-3 px-3 font-bold text-mono-100">Total coût matières</td>
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
              marge brute de 82 à 83 %. La sauce de base (0,65 EUR) est le poste clé : préparée en
              batch et partagée entre tous les curries au poulet, elle garantit un coût stable et un
              food cost maîtrisé. C'est le pilier de la rentabilité d'un restaurant indien.
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
              Tableau de référence : 10 plats couvrant toutes les familles de la carte indienne.
              Coûts matières basés sur les prix Metro France et grossistes indo-pakistanais T3 2026,
              prix de vente moyens constatés hors zones premium (Paris centre, Côte d'Azur).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Plat</th>
                  <th className="text-center py-3 px-4 font-semibold">Coût matières</th>
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
                  { name: 'Samosa végétarien (x2)', cm: '0,90 EUR', pv: '6,00 EUR', fc: '15 %', mb: '5,10 EUR / 85 %' },
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
              Quelques observations clés :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Le naan et le riz sont des machines à marge</strong> (food cost 7-11 %, marge
                brute 89-93 %). Chaque naan et chaque portion de riz vendus en accompagnement ajoutent
                de la marge quasi pure. Il faut systématiquement les proposer.
              </li>
              <li>
                <strong>Les plats végétariens</strong> (dal, chana) affichent 89-90 % de marge brute :
                ce sont les vrais champions rentabilité, souvent sous-valorisés dans la carte.
              </li>
              <li>
                <strong>L'agneau et les gambas</strong> plombent la moyenne (30-32 %). Ils sont
                indispensables au prestige de la carte mais ne doivent pas dépasser 25-30 % des ventes.
              </li>
              <li>
                <strong>Le gulab jamun</strong> est un dessert ultra-rentable (86 % de marge brute) et
                facile à vendre en suggestion. Chaque dessert ajoute environ 5 EUR de marge quasi pure.
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
              modèle. La plupart des curries (tikka masala, korma, madras, jalfrezi, rogan josh)
              partagent une même <strong>sauce de base (gravy)</strong> : un fond d'oignon, tomate,
              gingembre, ail et épices, préparé en grande quantité le matin. On la décline ensuite en
              dizaines de plats en ajoutant protéine, crème ou épices spécifiques à la commande.
            </p>
            <p>
              Ce système change tout : il permet un service ultra-rapide au rush, une consistance
              parfaite du goût, et surtout un <strong>coût matières maîtrisé et prévisible</strong>.
              Encore faut-il standardiser la recette et dimensionner la production, sinon chaque
              cuisinier improvise et le coût dérive.
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-5">
            <GravyCard
              title="Sauce de base maison en batch"
              cost="0,45 - 0,70 EUR / portion"
              labor="2 à 3 h le matin, une seule fois"
              pros="Coût maîtrisé, goût constant, service rapide au rush, food cost stable"
              cons="Nécessite savoir-faire, planification, DLC 3-4 jours au frais"
            />
            <GravyCard
              title="Sauces à la commande ou bases achetées"
              cost="0,90 - 1,50 EUR / portion"
              labor="Faible à nul (si base industrielle)"
              pros="Simplicité, zéro prep matinale, flexibilité"
              cons="Coût matières 2x plus élevé, food cost qui dérive, goût moins authentique"
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>L'arbitrage en pratique :</strong> la sauce de base maison est presque toujours
              la bonne décision économique. Elle divise par deux le coût matières de la partie sauce et
              accélère le service. Le seul vrai coût est la main-d'oeuvre matinale (2-3 h), à répartir
              sur les dizaines de portions produites. Sur 60 à 80 curries servis dans la journée, le
              coût horaire est négligeable à la portion.
            </p>
            <p className="mt-4">
              Un logiciel de marge permet de figer la fiche technique de la gravy de base, d'en calculer
              le coût exact à la portion et de détecter toute dérive (hausse du prix des oignons, des
              tomates ou de la crème). C'est souvent une révélation : beaucoup de restaurateurs indiens
              ne connaissent pas le coût réel de leur sauce de base, alors qu'elle entre dans 70 % des
              plats de la carte.
            </p>

            <Callout type="warning">
              <strong>Piège classique :</strong> laisser chaque cuisinier préparer la gravy "au feeling"
              sans fiche technique. Le coût matières varie alors de 0,45 à 0,90 EUR la portion selon le
              jour et la main, soit 5 à 8 points de food cost qui partent en fumée sans que personne ne
              le voie. Standardiser la sauce de base est le premier chantier marge d'un restaurant indien.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Levier boissons ═════════════ */}
        <section id="boissons" className="mb-16">
          <SectionHeading icon={<Wine className="w-6 h-6" />} number="6">
            Le levier boissons : bière, lassi, chai
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le restaurant indien a un profil boissons particulier : la culture du vin y est faible,
              mais la bière, le lassi et le thé chai offrent des marges exceptionnelles. Beaucoup
              d'établissements négligent ce levier, alors qu'il peut ajouter 3 à 5 points de marge nette
              globale sans effort.
            </p>
            <p>
              Les coefficients sont élevés : <strong>x5 à x6 sur la bière</strong> (indienne ou
              standard), <strong>x4 à x5 sur le lassi et le chai</strong> maison. Concrètement :
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
                  <td className="py-2 px-3 font-medium">Bière indienne (Kingfisher, Cobra, 33 cl)</td>
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
                  <td className="py-2 px-3 font-medium">Thé chai maison (masala chai)</td>
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
              La stratégie boissons d'un restaurant indien repose sur trois piliers : <strong>proposer
              systématiquement la bière</strong> (elle accompagne parfaitement les plats épicés), pousser
              le <strong>lassi</strong> (mangue, salé, sucré) comme boisson signature rafraîchissante, et
              transformer le <strong>thé chai</strong> en fin de repas quasi automatique. Le chai coûte
              0,20 EUR et se vend 3,50 EUR : c'est l'une des meilleures marges de tout l'établissement.
            </p>
            <p>
              Objectif : un <strong>ratio boissons représentant 20 à 28 % du CA</strong>, avec une marge
              brute de 78-85 %. Un restaurant indien qui passe de 15 % à 25 % de ratio boissons gagne
              mécaniquement 3 à 5 points de marge nette globale. C'est l'un des leviers les plus rapides
              à activer, et le plus souvent négligé.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Menu mix ═════════════ */}
        <section id="menu-mix" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="7">
            Piloter le menu mix végétarien / viande / riz
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le menu mix (répartition des ventes par famille de plats) est le pilier de la rentabilité
              d'un restaurant indien. Comme on l'a vu, les food cost vont de 7 % (naan, riz) à 32 %
              (gambas) : c'est la <strong>répartition des ventes</strong> qui détermine la marge
              globale, plus encore que les prix individuels.
            </p>
            <p>
              Voici une répartition cible saine pour un restaurant indien visant 30 % de food cost global :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li><strong>Plats végétariens (dals, curries de légumes, paneer)</strong> : 25 à 35 % des ventes. Le cœur rentable.</li>
              <li><strong>Plats de poulet</strong> : 30 à 40 % des ventes. Rentables et populaires, à mettre en avant.</li>
              <li><strong>Plats d'agneau et fruits de mer</strong> : 20 à 30 % des ventes. À contenir car food cost élevé.</li>
              <li><strong>Riz et naans (accompagnements)</strong> : taux d'attache proche de 100 %. Marge quasi pure à proposer systématiquement.</li>
              <li><strong>Entrées (samosa, pakora) et desserts</strong> : taux d'attache 30-50 %. À pousser en suggestion.</li>
            </ul>
            <p className="mt-4">
              Le menu engineering indien consiste à classer chaque plat selon sa popularité et sa
              marge (matrice étoiles / vaches à lait / énigmes / poids morts), puis à agir : mettre en
              avant les plats végétariens et de poulet à forte marge (placement carte, formules, thali),
              repositionner ou retirer les plats peu rentables et peu vendus, et former les serveurs à
              proposer systématiquement naan, riz, bière et dessert.
            </p>

            <Callout type="info">
              <strong>Astuce menu engineering :</strong> créez une formule "thali" ou "menu
              découverte" combinant un plat végétarien à forte marge, du riz et un naan. Le client y voit
              une belle offre découverte, vous y voyez un panier à food cost très bas (18-22 %) qui tire
              la moyenne globale vers le bas tout en augmentant le ticket moyen.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : KPI ═════════════ */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="8">
            Les 6 KPI à suivre en restaurant indien
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un restaurant indien bien géré pilote 6 indicateurs au quotidien. Sans ces KPI, le
              restaurateur ne voit pas la dérive du menu mix ni l'érosion de marge causée par les
              hausses de prix (agneau, riz basmati, gambas importées, huile) avant qu'il ne soit
              trop tard.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Percent className="w-5 h-5" />, title: '1. Food cost global', desc: 'Cible 28-32 % en moyenne pondérée. Au-delà, vérifier le menu mix et le coût de la sauce de base.' },
              { icon: <Wine className="w-5 h-5" />, title: '2. Ratio boissons / CA', desc: 'Cible 20-28 %. Le levier le plus rapide : bière, lassi et chai à forte marge.' },
              { icon: <DollarSign className="w-5 h-5" />, title: '3. Ticket moyen', desc: '18 à 32 EUR par couvert selon positionnement. Suivre l\'effet naan + riz + boisson + dessert.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: '4. Menu mix par famille', desc: 'Part des plats végétariens et poulet (cible 55-65 %) vs agneau coûteux. Clé de la marge globale.' },
              { icon: <TrendingUp className="w-5 h-5" />, title: '5. Marge brute par plat phare', desc: 'Suivre les variations matières (agneau, riz basmati, gambas) sur les best-sellers.' },
              { icon: <Clock className="w-5 h-5" />, title: '6. Taux de gaspillage', desc: 'Cible inférieure à 4 %. Surveiller riz cuit en excès, naans invendus, DLC paneer et crème.' },
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

        {/* ═════════════ SECTION 9 : Exemple illustratif ═════════════ */}
        <section id="cas-lyon" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="9">
            Exemple illustratif : un restaurant indien de quartier, de 8 % à 19 % de marge nette
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons un exemple fictif : un restaurant indien de 60 couverts, repris par un chef et
              son associé en salle. CA annuel de départ : 380 000 EUR, marge nette 8 %. Bonne réputation, salle pleine le vendredi et samedi, mais
              rentabilité décevante en semaine.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Diagnostic initial (mois 1)</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Food cost réel : 35 % (vs cible 30 %). Menu mix dérive : trop d'agneau et de gambas.</li>
              <li>Sauce de base non standardisée : chaque service, un coût différent, aucune fiche technique.</li>
              <li>Ratio boissons : 14 % du CA. Bière et lassi jamais proposés activement.</li>
              <li>Riz basmati cuit en large excès, naans jetés en fin de service : gaspillage 8 %.</li>
              <li>Aucun suivi des prix fournisseurs (agneau, riz, gambas) ni de fiches techniques formalisées.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Plan d'action en 4 phases</h3>
            <div className="space-y-4 mt-6">
              <PhaseCard
                phase="Phase 1 (mois 1-2)"
                title="Standardiser la sauce de base et les fiches techniques"
                actions={[
                  'Fiche technique figée de la gravy de base (coût 0,58 EUR/portion)',
                  'Création des fiches techniques des 48 plats, grammages standardisés (riz 130 g cru)',
                  'Identification des plats poids morts (food cost supérieur à 33 %, peu vendus)',
                  'Résultat : food cost passe de 35 % à 31 %',
                ]}
              />
              <PhaseCard
                phase="Phase 2 (mois 3-4)"
                title="Rééquilibrage du menu mix"
                actions={[
                  'Mise en avant carte des plats végétariens et de poulet à forte marge',
                  'Création d\'une formule thali découverte (food cost 20 %)',
                  'Retrait de 5 plats d\'agneau peu vendus, formation serveurs aux suggestions',
                  'Résultat : part des végétariens + poulet montée de 45 % à 60 %',
                ]}
              />
              <PhaseCard
                phase="Phase 3 (mois 5-6)"
                title="Activer le levier boissons"
                actions={[
                  'Proposition systématique de bière indienne et lassi à chaque table',
                  'Le chai proposé en fin de repas (taux d\'attache monté à 40 %)',
                  'Carte des boissons revue avec coefficient x5 harmonisé',
                  'Résultat : ratio boissons monte de 14 % à 24 %',
                ]}
              />
              <PhaseCard
                phase="Phase 4 (mois 7-8)"
                title="Pilotage en temps réel"
                actions={[
                  'Suivi des factures fournisseurs (agneau, riz basmati, gambas, épices)',
                  'Tableau de bord vérifié 2x/semaine (food cost + menu mix + boissons)',
                  'Dimensionnement du riz et des naans selon prévisions, gaspillage à 3,5 %',
                  'Résultat final : marge nette 19 %',
                ]}
              />
            </div>

            <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-emerald-900 text-lg">Résultats de l'exemple après 8 mois</h3>
              </div>
              <ul className="space-y-2 text-emerald-800 text-sm">
                <li><strong>CA annuel :</strong> 380 000 EUR -- 418 000 EUR (+10 %)</li>
                <li><strong>Food cost :</strong> 35 % -- 30 %</li>
                <li><strong>Marge nette :</strong> 8 % -- 19 % (soit 30 400 EUR -- 79 420 EUR)</li>
                <li><strong>Ratio boissons :</strong> 14 % -- 24 % du CA</li>
                <li><strong>Part végétariens + poulet :</strong> 45 % -- 60 % des ventes</li>
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
              RestauMargin est conçu pour la réalité opérationnelle d'un restaurant indien : carte
              large, sauce de base à standardiser, food cost hétérogènes, levier boissons et menu mix à
              piloter. Voici les 6 modules clés.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Soup className="w-5 h-5" />, title: 'Fiches techniques et sauce de base', desc: 'Figez la recette de votre gravy de base et de chaque curry avec grammages précis. Food cost calculé automatiquement.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Pilotage menu mix', desc: 'Visualisez la répartition des ventes par famille (végétarien, poulet, agneau) et son impact sur la marge globale.' },
              { icon: <Wine className="w-5 h-5" />, title: 'Gestion des boissons', desc: 'Suivez la marge sur bière, lassi et chai, le coefficient et le ratio boissons/CA. Activez le levier le plus rentable.' },
              { icon: <AlertTriangle className="w-5 h-5" />, title: 'Alertes déviation marge', desc: 'Notification dès qu\'un plat passe sous le seuil de marge cible ou qu\'un prix fournisseur (agneau, riz, gambas) augmente.' },
              { icon: <Lightbulb className="w-5 h-5" />, title: 'Scan factures OCR', desc: 'Photographiez vos factures (grossistes indo-pakistanais, Metro). Les prix agneau, riz basmati et épices se mettent à jour seuls.' },
              { icon: <Flame className="w-5 h-5" />, title: 'Coût tandoor et suivi DLC', desc: 'Imputez le coût énergétique du tandoor aux fiches naan et tandoori, et suivez les DLC du paneer, de la crème et des yaourts.' },
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
              Les trois leviers les plus puissants restent la standardisation de la sauce de base, le
              rééquilibrage du menu mix et l'activation du levier boissons. Pour aller plus loin, lisez notre guide sur le <Link to="/blog/menu-engineering-boston-matrix" className="text-teal-700 underline hover:text-teal-800">menu engineering</Link>,
              apprenez à <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800">réduire votre food cost</Link>, comprenez le <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-800">coefficient multiplicateur</Link>,
              comparez avec la page <Link to="/logiciel-marge-restaurant-italien" className="text-teal-700 underline hover:text-teal-800">logiciel de marge pour restaurant italien</Link> ou
              testez le <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-07-16" readTime="14 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes restaurant indien</h2>
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
              Food cost par curry, sauce de base standardisée, menu mix, marge sur les boissons, alertes
              prix, KPI temps réel : tout ce qu'il faut pour viser une marge nette supérieure à 18 %.
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
              <p className="text-xs text-mono-500">Matrice étoiles, vaches à lait, énigmes, poids morts.</p>
            </Link>
            <Link to="/logiciel-marge-restaurant-italien" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Logiciel marge restaurant italien</h3>
              <p className="text-xs text-mono-500">Food cost pâtes, levier vins, menu mix trattoria.</p>
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
          <span className="font-semibold text-mono-500">Coût matières :</span>
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
