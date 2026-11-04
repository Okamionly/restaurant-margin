import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, UtensilsCrossed, Zap, Award, Sparkles, Wheat, Wine, Soup, Clock, Truck, Users } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO — "Logiciel de marge pour restaurant italien"
   Mots-cles cibles : marge restaurant italien / food cost pates /
   rentabilite trattoria / cout plat de pates / coefficient italien
   ~3 100 mots — mode clair, fond blanc, theme W&B
   Distinct de la page Pizzeria : focus trattoria full-service
   (pates fraiches, antipasti, risotto, vins italiens, dolci)
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost idéal pour un restaurant italien ?',
    answer: "Le food cost idéal d'un restaurant italien (trattoria full-service) se situe entre 26 % et 30 %. C'est plus élevé qu'une pizzeria pure (22-25 %) car la carte combine des plats de pâtes à très faible coût matières (15-22 %) avec des antipasti, des risottos et des plats de viande ou poisson plus coûteux (32-40 %). L'enjeu est d'équilibrer le menu mix pour ramener la moyenne pondérée sous 30 %.",
  },
  {
    question: 'Combien coûte un plat de pâtes en restaurant ?',
    answer: "Un plat de pâtes coûte entre 1,10 EUR et 2,80 EUR en coût matières selon la recette. Une spaghetti carbonara revient à environ 1,80 EUR (pâtes sèches 0,40 EUR, guanciale 0,90 EUR, oeufs + pecorino 0,50 EUR), une pasta al pomodoro à 1,10 EUR, une pasta aux fruits de mer à 2,80-3,50 EUR. Vendu 14-18 EUR, un plat de pâtes classique affiche un food cost de 8 à 18 % : c'est le plat le plus rentable de la carte italienne.",
  },
  {
    question: 'Quel coefficient multiplicateur appliquer dans un restaurant italien ?',
    answer: "Le coefficient multiplicateur d'un restaurant italien varie selon la famille de plats : x5 à x8 sur les pâtes sèches (coût faible), x3,5 à x4,5 sur les antipasti et la charcuterie italienne, x3 à x3,5 sur les plats de viande/poisson, et x4 à x5 sur les risottos. Plutôt qu'un coefficient unique, un logiciel comme RestauMargin calcule le coefficient optimal recette par recette pour cibler un food cost global de 28 %.",
  },
  {
    question: 'Pâtes fraîches maison ou pâtes sèches : quel impact sur la marge ?',
    answer: "Les pâtes sèches de qualité (Gragnano IGP) coûtent 0,30-0,50 EUR la portion de 120 g et demandent zéro main-d'oeuvre. Les pâtes fraîches maison coûtent 0,55-0,90 EUR en matières (semoule, oeufs) mais nécessitent 30 à 60 min de travail/jour et un laminoir. Les pâtes fraîches justifient un prix de vente +3 à 5 EUR et un positionnement premium, mais érodent la marge si le coût main-d'oeuvre n'est pas compté. Le bon arbitrage dépend du ticket moyen visé.",
  },
  {
    question: 'Comment gérer la marge sur les vins italiens ?',
    answer: "Le vin est un levier de marge majeur en restaurant italien. Le coefficient classique est x3 à x4 sur la bouteille (un Chianti acheté 6 EUR se vend 18-24 EUR) et x4 à x5 au verre. La carte des vins italiens (Barolo, Brunello, Prosecco, Lambrusco) doit être construite avec 3 niveaux de prix pour capter tous les budgets. Un ratio boissons sain représente 25 à 35 % du CA avec une marge brute de 70-78 %, ce qui rehausse mécaniquement la marge globale de l'établissement.",
  },
  {
    question: 'Quel est le ticket moyen d\'un restaurant italien en France ?',
    answer: "Le ticket moyen d'un restaurant italien en France se situe entre 22 EUR et 38 EUR par couvert selon le positionnement. Une trattoria de quartier tourne autour de 22-28 EUR (entrée ou pâtes + plat + 1 verre), un italien de centre-ville 28-35 EUR, et un italien gastronomique 45-70 EUR. L'ajout d'antipasti à partager et d'un dolce (tiramisu, panna cotta) augmente le ticket de 6 à 10 EUR par table.",
  },
  {
    question: 'Quels sont les plats italiens les plus rentables ?',
    answer: "Les plats italiens les plus rentables sont, dans l'ordre : (1) les pâtes sèches au pomodoro ou aglio e olio (food cost 8-12 %), (2) les pâtes carbonara / cacio e pépé (12-16 %), (3) les risottos (food cost 14-18 % mais temps de cuisson long), (4) les antipasti végétariens (bruschetta, caponata, 15-20 %). Les plats à surveiller sont les fruits de mer, l'osso buco et les plats de bœuf, dont le food cost grimpe à 35-42 %.",
  },
  {
    question: 'Comment limiter le gaspillage en restaurant italien ?',
    answer: "Le gaspillage en restaurant italien provient surtout des antipasti (buffet ou assiette dégustation), du pain et de la mozzarella fraîche à courte DLC. Les leviers : portionner les antipasti à la commande plutôt qu'en buffet, suivre les DLC de la mozzarella et de la charcuterie via un tracker, recycler le pain rassis en bruschetta ou panzanella, et standardiser les grammages de pâtes (120-140 g cru). RestauMargin centralise le suivi DLC et les fiches techniques pour réduire le gaspillage sous 4 %.",
  },
  {
    question: 'Pourquoi un logiciel de marge est-il utile dans un restaurant italien ?',
    answer: "Une carte italienne complète compte 30 à 50 références (antipasti, pâtes, risottos, secondi, dolci) avec des food cost très hétérogènes (8 % à 42 %). Sans logiciel, impossible de piloter la moyenne pondérée ni de réagir aux hausses de prix (huile d'olive, parmesan, charcuterie importée). RestauMargin met à jour les coûts via le scan OCR des factures, calcule le coefficient optimal par plat et alerte quand un plat passe sous la marge cible.",
  },
  {
    question: 'Quels KPI suivre dans un restaurant italien au quotidien ?',
    answer: "Les 6 KPI essentiels d'un restaurant italien : (1) Food cost global cible 26-30 %, (2) Ratio boissons/CA cible 25-35 %, (3) Ticket moyen par couvert (22-38 EUR), (4) Menu mix par famille (part des pâtes rentables vs secondi coûteux), (5) Marge brute par plat phare, (6) Taux de gaspillage matières fraîches (< 4 %). RestauMargin centralise ces 6 KPI dans un tableau de bord temps réel.",
  },
];

export default function LogicielMargeItalien() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Logiciel marge restaurant italien | Food cost pâtes | RestauMargin"
        description="Logiciel pour calculer la marge d'un restaurant italien. Coût pâtes, antipasti, risotto, vins. Food cost cible 26-30%. Essai gratuit 7 jours."
        path="/logiciel-marge-restaurant-italien"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels métier', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            { name: 'Logiciel marge restaurant italien', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant-italien' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour restaurant italien : food cost et rentabilité en 2026',
            description: "Guide complet du calcul de marge pour restaurant italien (trattoria) : décomposition coût d'un plat de pâtes, food cost cible 26-30 %, levier vins italiens, menu mix antipasti/pâtes/secondi, KPI et cas concret.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-06-04',
            dateModified: '2026-06-04',
            wordCount: 3100,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/logiciel-marge-restaurant-italien' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin Restaurant Italien',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Italian Restaurant Margin Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-restaurant-italien',
            description: "Logiciel SaaS de calcul de marge pour restaurant italien : food cost par plat de pâtes, risotto et antipasti, coefficient optimal par recette, gestion carte des vins, suivi menu mix, alertes prix fournisseurs (parmesan, huile d'olive, charcuterie importée), suivi DLC mozzarella.",
            featureList: [
              'Fiches techniques pâtes, risotti, antipasti avec grammages précis',
              'Calcul food cost automatique par plat',
              'Coefficient multiplicateur optimal par famille (pâtes, secondi, vins)',
              'Pilotage menu mix antipasti / primi / secondi / dolci',
              'Gestion carte des vins italiens et marge boissons',
              'Scan factures fournisseurs (OCR) : parmesan, huile, charcuterie',
              'Suivi DLC mozzarella et produits frais importés',
              'KPI spécifiques : food cost, ratio boissons, ticket moyen',
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
          <span className="text-mono-100 font-medium">Logiciel marge restaurant italien</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Restaurant italien"
        readTime="14 min"
        date="Juin 2026"
        title="Logiciel de marge pour restaurant italien : food cost et rentabilité en 2026"
        accentWord="italien"
        subtitle="Le restaurant italien combine des plats de pâtes ultra-rentables (food cost 8-18 %) et des secondi coûteux (35-42 %). Tout l'enjeu : équilibrer le menu mix et activer le levier vins pour viser 30 % de marge nette."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-06-04" readTime="14 min" variant="header" />

        {/* ── Encadre formule rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Repères clés restaurant italien</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les ratios à mémoriser
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost global cible</strong> : 26 % à 30 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Food cost plat de pâtes</strong> : 8 % à 18 % (le plus rentable)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Coefficient vins italiens</strong> : x3 à x4 bouteille, x4 à x5 au verre</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Marge nette saine</strong> : 12 % à 20 %</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Un restaurant italien qui pousse les plats de pâtes et soigne sa carte des vins peut atteindre
            une marge nette de 20 %, bien au-dessus de la moyenne de la restauration traditionnelle.
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
              { href: '#intro', label: 'Pourquoi le restaurant italien est un modèle à fort potentiel' },
              { href: '#food-cost', label: 'Food cost cible : 26-30 %, mais très hétérogène' },
              { href: '#decomposition', label: 'Décomposition coût d\'un plat de pâtes' },
              { href: '#8-plats', label: 'Tableau : 8 plats italiens types et leurs marges' },
              { href: '#pates', label: 'Pâtes fraîches vs sèches : l\'arbitrage marge' },
              { href: '#vins', label: 'Le levier vins italiens : doper la marge globale' },
              { href: '#menu-mix', label: 'Piloter le menu mix antipasti / primi / secondi' },
              { href: '#kpi', label: 'Les 6 KPI à suivre en restaurant italien' },
              { href: '#cas-marseille', label: 'Cas concret : trattoria Marseille, 9 % à 21 % en 8 mois' },
              { href: '#logiciel', label: 'Comment RestauMargin automatise tout' },
              { href: '#faq', label: 'Questions fréquentes restaurant italien' },
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
            Pourquoi le restaurant italien est un modèle à fort potentiel
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le restaurant italien est l'une des cuisines les plus rentables du paysage de la
              restauration française, à condition d'en maîtriser le pilotage. La raison tient à la
              structure même de la carte : une trattoria propose des plats de pâtes dont le coût
              matières est ridiculement bas (1,10 à 2,80 EUR pour une assiette vendue 14-18 EUR),
              à côté de secondi (plats de viande ou poisson) bien plus coûteux. Cette hétérogénéité
              est à la fois la force et le piège du modèle italien.
            </p>
            <p>
              La force : avec un menu mix bien construit, où les pâtes représentent 45 à 60 % des
              ventes, la moyenne pondérée du food cost peut facilement descendre sous 28 %. Ajoutez
              une carte des vins italiens travaillée (Chianti, Barolo, Prosecco) avec un coefficient
              x3 à x4, et la marge globale de l'établissement grimpe nettement au-dessus de la
              moyenne de la restauration traditionnelle (12-15 % de marge nette).
            </p>
            <p>
              Le piège : si le menu mix dérive vers les plats coûteux (fruits de mer, osso buco,
              tagliata de bœuf), si les antipasti génèrent du gaspillage, ou si la carte des vins
              n'est pas valorisée, la rentabilité s'effondre. Beaucoup de restaurateurs italiens
              "qui font le plein" tous les soirs dégagent une marge nette anémique de 6-9 %, faute
              de piloter le bon indicateur : la marge brute par famille de plats, pas seulement le CA.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Dans un restaurant italien, faire passer la part des
              plats de pâtes de 40 % à 55 % des ventes (via menu engineering et suggestions serveurs)
              améliore mécaniquement la marge brute globale de 3 à 5 points. Sur un CA de 400 000 EUR,
              c'est 12 000 à 20 000 EUR de marge supplémentaire, sans rien changer aux prix.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Food cost cible ═════════════ */}
        <section id="food-cost" className="mb-16">
          <SectionHeading icon={<Percent className="w-6 h-6" />} number="2">
            Food cost cible : 26-30 %, mais très hétérogène
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le food cost global d'un restaurant italien full-service doit se situer entre 26 % et
              30 %. C'est légèrement supérieur à une pizzeria pure (22-25 %), car la carte italienne
              est plus large et inclut des plats nettement plus coûteux. Mais ce chiffre global cache
              une réalité essentielle : <strong>le food cost varie de 8 % à 42 % selon la famille de
              plats</strong>.
            </p>
            <p>
              Voici la fourchette de food cost par famille dans un italien typique :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Pâtes sèches (pomodoro, carbonara, cacio e pépé)</strong> : 8 à 16 %.
                Les stars de la rentabilité.
              </li>
              <li>
                <strong>Risotti</strong> : 14 à 18 %. Très rentables mais chronophages (cuisson 18 min).
              </li>
              <li>
                <strong>Antipasti végétariens (bruschetta, caponata, vitello tonnato léger)</strong> :
                15 à 22 %.
              </li>
              <li>
                <strong>Charcuterie et fromages (antipasti misti)</strong> : 30 à 38 %. La burrata et
                le prosciutto San Daniele coûtent cher.
              </li>
              <li>
                <strong>Secondi (osso buco, escalope milanaise, poisson, fruits de mer)</strong> :
                32 à 42 %. À surveiller de près.
              </li>
              <li>
                <strong>Dolci (tiramisu, panna cotta)</strong> : 18 à 25 %.
              </li>
            </ul>
            <p className="mt-4">
              La clé n'est donc pas de viser un food cost uniforme, mais d'<strong>orchestrer le menu
              mix</strong> pour que la moyenne pondérée reste sous 30 %. C'est exactement ce qu'un
              logiciel de marge calcule en temps réel, en croisant les fiches techniques et les
              volumes de vente réels.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <KPICard
              icon={<Percent className="w-5 h-5" />}
              label="Food cost global"
              value="26 - 30 %"
              note="Moyenne pondérée cible"
              color="teal"
            />
            <KPICard
              icon={<Wheat className="w-5 h-5" />}
              label="Food cost pâtes"
              value="8 - 18 %"
              note="La famille la plus rentable"
              color="emerald"
            />
            <KPICard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Food cost secondi"
              value="32 - 42 %"
              note="Viandes, poissons, fruits de mer"
              color="amber"
            />
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Decomposition cout ═════════════ */}
        <section id="decomposition" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            Décomposition coût d'un plat de pâtes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons l'exemple emblématique : les spaghetti alla carbonara, version romaine
              authentique (guanciale, pecorino, oeufs, poivre, pas de crème). Portion de 130 g de
              pâtes sèches crues. Voici la décomposition précise du coût matières, en distinguant
              version standard (pancetta) et version premium (guanciale + pecorino DOP).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Coût matières spaghetti carbonara</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Composant</th>
                  <th className="text-right py-2 px-3 font-semibold">Standard</th>
                  <th className="text-right py-2 px-3 font-semibold">Premium (DOP)</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Pâtes sèches Gragnano IGP (130 g)</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                  <td className="py-2 px-3 text-right">0,55 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Guanciale / pancetta (50 g)</td>
                  <td className="py-2 px-3 text-right">0,70 EUR</td>
                  <td className="py-2 px-3 text-right">1,10 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Pecorino Romano DOP (30 g)</td>
                  <td className="py-2 px-3 text-right">0,45 EUR</td>
                  <td className="py-2 px-3 text-right">0,65 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Oeufs (2 jaunes)</td>
                  <td className="py-2 px-3 text-right">0,30 EUR</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Poivre, huile, garniture</td>
                  <td className="py-2 px-3 text-right">0,10 EUR</td>
                  <td className="py-2 px-3 text-right">0,15 EUR</td>
                </tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50">
                  <td className="py-3 px-3 font-bold text-mono-100">Total coût matières</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-900">1,95 EUR</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-900">2,85 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Analyse rapide :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Version standard vendue 15 EUR : food cost = 1,95 / 15 = <strong>13,0 %</strong></li>
              <li>Version premium vendue 18 EUR : food cost = 2,85 / 18 = <strong>15,8 %</strong></li>
              <li>Marge brute standard : <strong>13,05 EUR (87 %)</strong></li>
              <li>Marge brute premium : <strong>15,15 EUR (84 %)</strong></li>
            </ul>
            <p className="mt-4">
              Un plat de pâtes est tout simplement l'un des plats les plus rentables qui existe en
              restauration : 84 à 87 % de marge brute. C'est pourquoi un restaurant italien a tout
              intérêt à construire son menu engineering autour des pâtes, en les mettant en avant
              dans la carte et dans le discours des serveurs.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : 8 plats types ═════════════ */}
        <section id="8-plats" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            8 plats italiens types et leurs marges
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tableau de référence : 8 plats couvrant toutes les familles de la carte italienne.
              Coûts matières basés sur les prix Metro France et grossistes spécialisés T2 2026, prix
              de vente moyens constatés hors zones premium (Paris, Côte d'Azur).
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
                  { name: 'Spaghetti al pomodoro', cm: '1,10 EUR', pv: '13,00 EUR', fc: '8 %', mb: '11,90 EUR / 92 %' },
                  { name: 'Spaghetti carbonara', cm: '1,95 EUR', pv: '15,00 EUR', fc: '13 %', mb: '13,05 EUR / 87 %' },
                  { name: 'Risotto aux cèpes', cm: '2,60 EUR', pv: '16,50 EUR', fc: '16 %', mb: '13,90 EUR / 84 %' },
                  { name: 'Lasagnes maison', cm: '2,90 EUR', pv: '15,50 EUR', fc: '19 %', mb: '12,60 EUR / 81 %' },
                  { name: 'Antipasti misti (charcuterie/burrata)', cm: '5,40 EUR', pv: '16,00 EUR', fc: '34 %', mb: '10,60 EUR / 66 %' },
                  { name: 'Escalope milanaise', cm: '5,80 EUR', pv: '17,50 EUR', fc: '33 %', mb: '11,70 EUR / 67 %' },
                  { name: 'Linguine fruits de mer', cm: '6,50 EUR', pv: '19,50 EUR', fc: '33 %', mb: '13,00 EUR / 67 %' },
                  { name: 'Tiramisu maison', cm: '1,30 EUR', pv: '7,50 EUR', fc: '17 %', mb: '6,20 EUR / 83 %' },
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
                <strong>Le pomodoro est la machine à marge</strong> (food cost 8 %, marge brute 92 %).
                Souvent sous-estimé, il devrait être mis en avant comme signature simple et authentique.
              </li>
              <li>
                <strong>Les antipasti misti et secondi</strong> plombent la moyenne (33-34 %). Ils sont
                indispensables à l'expérience mais ne doivent pas représenter plus de 30-35 % des ventes.
              </li>
              <li>
                <strong>Le tiramisu</strong> est un dolce ultra-rentable (83 % de marge brute) et facile
                à vendre en suggestion. Chaque dessert vendu ajoute 6 EUR de marge nette quasi pure.
              </li>
              <li>
                <strong>Les linguine fruits de mer</strong> ont un food cost élevé (33 %) mais une marge
                brute en valeur absolue confortable (13 EUR) : à garder comme plat d'appel premium.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Pates fraiches vs seches ═════════════ */}
        <section id="pates" className="mb-16">
          <SectionHeading icon={<Wheat className="w-6 h-6" />} number="5">
            Pâtes fraîches vs sèches : l'arbitrage marge
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est l'une des décisions structurantes d'un restaurant italien. Servir des pâtes
              fraîches maison ou des pâtes sèches de qualité change le positionnement, le prix de
              vente possible, mais aussi le coût réel une fois la main-d'oeuvre intégrée.
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-5">
            <PatesCard
              title="Pâtes sèches (Gragnano IGP)"
              cost="0,30 - 0,55 EUR / portion"
              labor="Zéro main-d'oeuvre"
              pros="Coût faible, zéro perte, conservation longue, qualité constante"
              cons="Positionnement moins premium, prix de vente plafonné"
            />
            <PatesCard
              title="Pâtes fraîches maison"
              cost="0,55 - 0,90 EUR / portion"
              labor="30 - 60 min/jour + laminoir"
              pros="Positionnement premium, prix de vente +3 à 5 EUR, argument marketing"
              cons="Coût main-d'oeuvre réel, DLC courte, dépendance au savoir-faire"
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>L'arbitrage en pratique :</strong> les pâtes sèches de qualité (Gragnano,
              Garofalo, Felicetti) sont parfaitement légitimes et permettent un food cost imbattable.
              Beaucoup d'excellents restaurants italiens les utilisent sans complexe. Les pâtes fraîches
              ne se justifient économiquement que si :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Le ticket moyen visé est supérieur à 28 EUR (positionnement premium) ;</li>
              <li>Le surcout de vente (+3 à 5 EUR/plat) couvre largement les 0,30-0,50 EUR de matières et le temps de production ;</li>
              <li>La production est lissée (fabrication en batch le matin) pour ne pas saturer la brigade au rush.</li>
            </ul>
            <p className="mt-4">
              Un logiciel de marge permet de comparer les deux scénarios en intégrant le coût horaire
              de main-d'oeuvre dans la fiche technique. C'est souvent une révélation : la pâte fraîche
              "maison" coûte en réalité 1,30-1,70 EUR/portion tout compris, soit 3 à 4 fois la pâte sèche.
            </p>

            <Callout type="warning">
              <strong>Piège classique :</strong> annoncer "pâtes fraîches maison" sans répercuter le
              coût réel dans le prix de vente. Beaucoup de restaurateurs italiens vendent leurs pâtes
              fraîches au même prix que les sèches, croyant différencier leur offre, et détruisent
              silencieusement 4 à 6 points de marge.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Levier vins ═════════════ */}
        <section id="vins" className="mb-16">
          <SectionHeading icon={<Wine className="w-6 h-6" />} number="6">
            Le levier vins italiens : doper la marge globale
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le vin est le levier de marge le plus puissant et le plus sous-exploité d'un restaurant
              italien. La cuisine italienne se marie naturellement avec le vin, et le consommateur
              accepte volontiers un verre de Chianti ou de Lambrusco. Pourtant, beaucoup d'établissements
              négligent leur carte des vins et passent à côté d'une mine d'or.
            </p>
            <p>
              Le coefficient classique sur le vin est de <strong>x3 à x4 sur la bouteille</strong> et
              <strong> x4 à x5 au verre</strong>. Concrètement :
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Exemple : marge sur la carte des vins italiens</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Vin</th>
                  <th className="text-right py-2 px-3 font-semibold">Achat HT</th>
                  <th className="text-right py-2 px-3 font-semibold">Vente bouteille</th>
                  <th className="text-right py-2 px-3 font-semibold">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Lambrusco (entrée de gamme)</td>
                  <td className="py-2 px-3 text-right">4,50 EUR</td>
                  <td className="py-2 px-3 text-right">18,00 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">13,50 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Chianti Classico DOCG</td>
                  <td className="py-2 px-3 text-right">7,50 EUR</td>
                  <td className="py-2 px-3 text-right">26,00 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">18,50 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Barolo (haut de gamme)</td>
                  <td className="py-2 px-3 text-right">18,00 EUR</td>
                  <td className="py-2 px-3 text-right">58,00 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">40,00 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Prosecco (verre)</td>
                  <td className="py-2 px-3 text-right">1,10 EUR/verre</td>
                  <td className="py-2 px-3 text-right">6,50 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">5,40 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Une carte des vins italiens bien construite repose sur <strong>3 niveaux de prix</strong> :
              une entrée de gamme accessible (Lambrusco, Montepulciano), un cœur de gamme valorisé
              (Chianti, Valpolicella) et quelques références prestige (Barolo, Brunello di Montalcino,
              Amarone). Ce triptyque capte tous les budgets et fait monter le ticket moyen.
            </p>
            <p>
              Objectif : un <strong>ratio boissons représentant 25 à 35 % du CA</strong>, avec une marge
              brute de 70-78 %. Un restaurant italien qui passe de 20 % à 30 % de ratio boissons gagne
              mécaniquement 3 à 5 points de marge nette globale, car la marge sur le vin est supérieure
              à celle de la cuisine. C'est l'un des leviers les plus rapides à activer.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Menu mix ═════════════ */}
        <section id="menu-mix" className="mb-16">
          <SectionHeading icon={<Soup className="w-6 h-6" />} number="7">
            Piloter le menu mix antipasti / primi / secondi
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le menu mix (répartition des ventes par famille de plats) est le pilier de la rentabilité
              d'un restaurant italien. Comme on l'a vu, les food cost vont de 8 % (pâtes pomodoro) à 42 %
              (fruits de mer) : c'est la <strong>répartition des ventes</strong> qui détermine la marge
              globale, plus encore que les prix individuels.
            </p>
            <p>
              Voici une répartition cible saine pour une trattoria visant 28 % de food cost global :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li><strong>Primi (pâtes + risotti)</strong> : 45 à 55 % des ventes. Le cœur rentable.</li>
              <li><strong>Antipasti</strong> : 15 à 20 % des ventes. À pousser pour le ticket, mais portionner finement.</li>
              <li><strong>Secondi (viandes, poissons)</strong> : 20 à 28 % des ventes. À contenir car food cost élevé.</li>
              <li><strong>Dolci</strong> : taux d'attache 35-50 % (1 dessert pour 2-3 couverts). Marge quasi pure.</li>
            </ul>
            <p className="mt-4">
              Le menu engineering italien consiste à classer chaque plat selon sa popularité et sa
              marge (matrice étoiles / vaches à lait / énigmes / poids morts), puis à agir : mettre en
              avant les pâtes à forte marge (placement carte, suggestions du jour), repositionner ou
              retirer les plats peu rentables et peu vendus, et former les serveurs à suggérer les
              antipasti et dolci à forte marge.
            </p>

            <Callout type="info">
              <strong>Astuce menu engineering :</strong> placez vos 2-3 plats de pâtes les plus rentables
              en haut de la section "Primi" et donnez-leur un nom évocateur (région, histoire). L'œil du
              client se pose d'abord en haut de chaque section : c'est gratuit et ça peut déplacer 5 à 10 %
              des ventes vers vos plats champions.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : KPI ═════════════ */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="8">
            Les 6 KPI à suivre en restaurant italien
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un restaurant italien bien géré pilote 6 indicateurs au quotidien. Sans ces KPI, le
              restaurateur ne voit pas la dérive du menu mix ni l'érosion de marge causée par les
              hausses de prix (huile d'olive, parmesan, charcuterie importée) avant qu'il ne soit
              trop tard.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Percent className="w-5 h-5" />, title: '1. Food cost global', desc: 'Cible 26-30 % en moyenne pondérée. Au-delà, vérifier le menu mix et les prix fournisseurs.' },
              { icon: <Wine className="w-5 h-5" />, title: '2. Ratio boissons / CA', desc: 'Cible 25-35 %. Le levier le plus rapide pour doper la marge nette globale.' },
              { icon: <DollarSign className="w-5 h-5" />, title: '3. Ticket moyen', desc: '22-38 EUR par couvert selon positionnement. Suivre l\'effet antipasti + dolce + vin.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: '4. Menu mix par famille', desc: 'Part des primi (cible 45-55 %) vs secondi coûteux. Clé de la marge globale.' },
              { icon: <TrendingUp className="w-5 h-5" />, title: '5. Marge brute par plat phare', desc: 'Suivre les variations matières (parmesan, huile, charcuterie) sur les plats best-sellers.' },
              { icon: <Clock className="w-5 h-5" />, title: '6. Taux de gaspillage', desc: 'Cible < 4 %. Surveiller mozzarella, charcuterie, pain : DLC courtes et produits frais.' },
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

        {/* ═════════════ SECTION 9 : Cas concret Marseille ═════════════ */}
        <section id="cas-marseille" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="9">
            Cas concret : trattoria Marseille, 9 % à 21 % en 8 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Trattoria de quartier à Marseille (6ème), 70 couverts. Reprise en octobre 2025 par
              Giulia et Paolo, couple de restaurateurs. CA annuel constaté à la reprise : 420 000 EUR,
              marge nette 9 %. Salle toujours pleine le soir, mais rentabilité décevante.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Diagnostic initial (mois 1)</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Food cost réel : 34 % (vs cible 28 %). Menu mix dérive : 35 % de primi seulement.</li>
              <li>Carte très orientée secondi et fruits de mer (poissons, gambas) à fort food cost.</li>
              <li>Ratio boissons : 18 % du CA. Carte des vins pauvre (8 références, peu de marge).</li>
              <li>Antipasti servis en assiette généreuse non portionnee : gaspillage 7 %.</li>
              <li>Aucun suivi prix fournisseurs ni fiches techniques formalisées.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Plan d'action en 4 phases</h3>
            <div className="space-y-4 mt-6">
              <PhaseCard
                phase="Phase 1 (mois 1-2)"
                title="Fiches techniques et standardisation"
                actions={[
                  'Création des fiches techniques des 42 plats via RestauMargin',
                  'Standardisation des grammages (pâtes 130 g, antipasti portionnés)',
                  'Identification des plats poids morts (food cost > 38 %, peu vendus)',
                  'Résultat : food cost passe de 34 % à 30 %',
                ]}
              />
              <PhaseCard
                phase="Phase 2 (mois 3-4)"
                title="Rééquilibrage du menu mix"
                actions={[
                  'Mise en avant carte des 5 plats de pâtes les plus rentables',
                  'Retrait de 6 secondi peu vendus, ajout de 3 risotti rentables',
                  'Formation des serveurs aux suggestions primi + dolci',
                  'Résultat : part des primi montée de 35 % à 50 %',
                ]}
              />
              <PhaseCard
                phase="Phase 3 (mois 5-6)"
                title="Refonte de la carte des vins"
                actions={[
                  'Nouvelle carte 24 références italiennes sur 3 niveaux de prix',
                  'Coefficient harmonisé x3,5 bouteille, x4,5 au verre',
                  'Mise en place de 4 accords mets-vins suggérés par les serveurs',
                  'Résultat : ratio boissons monte de 18 % à 29 %',
                ]}
              />
              <PhaseCard
                phase="Phase 4 (mois 7-8)"
                title="Pilotage en temps réel"
                actions={[
                  'Scan factures OCR via RestauMargin (parmesan, huile, charcuterie)',
                  'Tableau de bord vérifié 2x/semaine (food cost + menu mix + boissons)',
                  'Suivi DLC mozzarella et charcuterie, gaspillage ramené à 3,5 %',
                  'Résultat final : marge nette 21 %',
                ]}
              />
            </div>

            <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-emerald-900 text-lg">Résultats après 8 mois</h3>
              </div>
              <ul className="space-y-2 text-emerald-800 text-sm">
                <li><strong>CA annuel :</strong> 420 000 EUR -- 465 000 EUR (+11 %)</li>
                <li><strong>Food cost :</strong> 34 % -- 28 %</li>
                <li><strong>Marge nette :</strong> 9 % -- 21 % (soit 37 800 EUR -- 97 650 EUR)</li>
                <li><strong>Ratio boissons :</strong> 18 % -- 29 % du CA</li>
                <li><strong>Part des primi (pâtes/risotti) :</strong> 35 % -- 50 % des ventes</li>
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
              RestauMargin est conçu pour la réalité opérationnelle d'un restaurant italien : carte
              large, food cost hétérogènes, levier vins et menu mix à piloter. Voici les 6 modules clés
              qui vous font gagner 8 à 15 heures par mois et 5 à 10 points de marge nette.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Wheat className="w-5 h-5" />, title: 'Fiches techniques italiennes', desc: 'Créez vos recettes (pâtes, risotti, antipasti, dolci) avec grammages précis. Food cost calculé automatiquement.' },
              { icon: <Soup className="w-5 h-5" />, title: 'Pilotage menu mix', desc: 'Visualisez la répartition des ventes par famille (primi, antipasti, secondi) et son impact sur la marge globale.' },
              { icon: <Wine className="w-5 h-5" />, title: 'Gestion carte des vins', desc: 'Suivez la marge sur chaque vin, le coefficient et le ratio boissons/CA. Optimisez vos 3 niveaux de prix.' },
              { icon: <AlertTriangle className="w-5 h-5" />, title: 'Alertes déviation marge', desc: 'Notification dès qu\'un plat passe sous le seuil de marge cible ou qu\'un prix fournisseur (parmesan, huile) augmente.' },
              { icon: <Lightbulb className="w-5 h-5" />, title: 'Scan factures OCR', desc: 'Photographiez vos factures (grossistes italiens, Metro). Les prix charcuterie, fromage et huile se mettent à jour seuls.' },
              { icon: <Clock className="w-5 h-5" />, title: 'Suivi DLC produits frais', desc: 'Tracker des dates limites sur la mozzarella, la burrata et la charcuterie importée pour réduire le gaspillage.' },
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
              Des dizaines de restaurants italiens en France utilisent déjà RestauMargin pour piloter
              leur rentabilité. Gain moyen constaté : <strong>5 à 8 points de marge nette en 8 mois</strong>,
              principalement grâce au rééquilibrage du menu mix et à la valorisation de la carte des vins.
              Pour aller plus loin, lisez notre guide sur le <Link to="/blog/menu-engineering-boston-matrix" className="text-teal-700 underline hover:text-teal-800">menu engineering</Link>,
              comparez avec notre page <Link to="/logiciel-marge-pizzeria" className="text-teal-700 underline hover:text-teal-800">logiciel de marge pour pizzeria</Link> ou
              testez le <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-06-04" readTime="14 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes restaurant italien</h2>
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
              Piloter la marge de votre restaurant italien avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Food cost par plat, menu mix, marge sur les vins, alertes prix, KPI temps réel : tout ce
              qu'il faut pour viser une marge nette supérieure à 18 %.
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
            <Link to="/logiciel-marge-pizzeria" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Logiciel marge pizzeria</h3>
              <p className="text-xs text-mono-500">Food cost pizza, commissions livraison, KPI pizzeria.</p>
            </Link>
            <Link to="/outils/calculateur-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calculateur food cost gratuit</h3>
              <p className="text-xs text-mono-500">Calculez la marge de vos plats en 30 secondes.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Essai gratuit 7 jours</h3>
              <p className="text-xs text-mono-500">Pilotez votre restaurant italien sans carte bancaire.</p>
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

function PatesCard({ title, cost, labor, pros, cons }: {
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
