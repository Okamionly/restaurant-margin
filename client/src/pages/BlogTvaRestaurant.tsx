import { Link } from 'react-router-dom';
import {
  ChefHat,
  Calculator,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Percent,
  Receipt,
  Wine,
  ShoppingBag,
  UtensilsCrossed,
  AlertTriangle,
  CheckCircle,
  Scale,
  Lightbulb,
  Truck,
  FileText,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "TVA restaurant 2026 : taux 10%, 5,5% et 20%"
   Question PAA ciblee : "Quel est le taux de TVA en restauration ?"
   ~3 400 mots — featured snippet first, EEAT, schema FAQ + Article
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quel est le taux de TVA en restauration en 2026 ?",
    answer:
      "En restauration, trois taux de TVA coexistent en 2026 : 10 % pour les produits alimentaires et boissons non alcoolisées consommés immédiatement (sur place ou à emporter chaud), 5,5 % pour les produits alimentaires vendus dans un conditionnement permettant la conservation (consommation différée), et 20 % pour toutes les boissons alcoolisées, quel que soit le mode de consommation. Le taux dépend de la nature du produit et du moment de consommation, pas du seul fait de manger sur place.",
  },
  {
    question: "Quelle TVA sur place et à emporter ?",
    answer:
      "Sur place, la consommation est par définition immédiate : le taux est de 10 % pour la nourriture et les boissons sans alcool. À emporter, le critère n'est pas le fait de quitter le local mais la destination du produit. Un plat chaud ou un sandwich destiné à être mangé tout de suite reste à 10 %. Un produit conditionné pour être conservé (bocal, plat sous-vide à réchauffer, boisson en bouteille fermée) passe à 5,5 %. L'alcool reste à 20 % dans tous les cas.",
  },
  {
    question: "Pourquoi l'alcool est-il taxe à 20 % au restaurant ?",
    answer:
      "Les boissons alcoolisées sont exclues du taux réduit de la restauration. Vin, bière, cidre, spiritueux, cocktails et apéritifs sont soumis au taux normal de 20 % de TVA, qu'ils soient servis au verre, en bouteille, sur place ou à emporter. Le seul critère est la présence d'alcool. C'est pour cela qu'un restaurateur doit impérativement ventiler la part alcool de son chiffre d'affaires pour ne pas surpayer ou sous-déclarer sa TVA.",
  },
  {
    question: "Le food cost se calcule-t-il en HT ou en TTC à cause de la TVA ?",
    answer:
      "Toujours en HT. La TVA collectée sur vos ventes ne vous appartient pas : vous la reversez à l'État. Calculer une marge ou un food cost sur un prix TTC gonfle artificiellement le chiffre d'affaires et fausse le ratio. De la même manière, le coût matière est pris en HT puisque la TVA sur vos achats est récupérable (TVA déductible). Marge, food cost, coefficient multiplicateur : tout se raisonne hors taxes.",
  },
  {
    question: "Qu'est-ce que l'obligation de ventilation de la TVA ?",
    answer:
      "Un restaurateur qui vend des produits à des taux différents (10 % pour la nourriture, 20 % pour l'alcool, parfois 5,5 % pour de la vente conditionnée) doit ventiler son chiffre d'affaires taux par taux. S'il ne tient pas cette ventilation, l'administration fiscale applique le taux le plus élevé (20 %) sur l'ensemble des recettes. Un logiciel de caisse paramétré correctement et un suivi des ventes par catégorie sont donc indispensables.",
  },
  {
    question: "Quelle TVA pour la livraison de repas (UberEats, Deliveroo) ?",
    answer:
      "La TVA sur les repas livrés suit la même logique que la vente à emporter : 10 % pour un plat chaud destiné à une consommation immédiate, 5,5 % pour un produit conditionné à conserver, 20 % pour l'alcool. La commission prélevé par la plateforme (souvent 25 à 35 %) est, elle, soumise à 20 % de TVA, mais cette TVA est généralement déductible pour le restaurateur. Attention à bien distinguer la TVA sur la vente et la TVA sur la commission.",
  },
  {
    question: "La TVA payée sur mes achats est-elle récupérable ?",
    answer:
      "Oui. La TVA que vous payez à vos fournisseurs (matières premières, énergie, matériel, loyers soumis à TVA, commissions de plateformes) est une TVA déductible que vous récupérez. Concrètement, vous reversez à l'État la différence entre la TVA collectée sur vos ventes et la TVA déductible sur vos achats. C'est pour cette raison que tous les calculs de rentabilité se font en HT.",
  },
  {
    question: "Quelle TVA sur les menus comprenant un plat et une boisson alcoolisée ?",
    answer:
      "Pour un menu à prix unique incluant par exemple un plat (10 %) et un verre de vin (20 %), il faut ventiler le prix du menu entre les deux taux de manière économiquement justifiée, généralement au prorata des prix pratiqués à la carte. Appliquer 10 % sur la totalité du menu vin compris est une erreur fréquente qui expose à un redressement. Un paramétrage caisse adapté automatise cette ventilation.",
  },
  {
    question: "Quel taux de TVA pour le petit-déjeuner et les viennoiseries ?",
    answer:
      "Un petit-déjeuner servi et consommé sur place relève du taux de 10 % (café, jus, tartines, viennoiseries consommées immédiatement). Le pain et les viennoiseries vendus à emporter, non destinés à une consommation immédiate, relèvent du taux de 5,5 % en tant que produits alimentaires de base. La encore, c'est la destination du produit qui détermine le taux, pas uniquement le type de produit.",
  },
  {
    question: "Quelles sanctions en cas de mauvaise application de la TVA ?",
    answer:
      "Une erreur de taux ou une absence de ventilation peut entraîner un redressement fiscal : rappel de TVA sur la période contrôlée (jusqu'à 3 ans), majoration de 10 à 40 % selon la bonne ou mauvaise foi, et intérêts de retard. En pratique, l'administration applique le taux le plus élevé sur les recettes non ventilées. Un suivi rigoureux de la TVA par catégorie de produit est donc autant une question de conformité que de rentabilité.",
  },
  {
    question: "La TVA change-t-elle quelque chose à ma marge brute ?",
    answer:
      "Indirectement, oui. La marge brute se calcule en HT, donc la TVA ne la modifie pas mathématiquement. Mais le taux de TVA affecte votre prix TTC affiché au client : à marge HT égale, un produit à 20 % de TVA sera plus cher en vitrine qu'un produit à 10 %. C'est un paramètre à intégrer dans votre stratégie de prix, surtout sur la carte des vins et des cocktails où la TVA à 20 % pèse sur le prix perçu.",
  },
  {
    question: "Comment paramétrer correctement la TVA dans mon logiciel de caisse ?",
    answer:
      "Associez chaque produit ou famille de produits à son taux : 10 % pour les plats et softs, 20 % pour les alcools, 5,5 % pour la vente conditionnée à emporter le cas échéant. Vérifiez que les menus à prix fixe ventilent automatiquement la part alcool. Éditez chaque mois un journal de TVA par taux pour votre comptable. Un logiciel de gestion couplé à la caisse, comme RestauMargin, permet de croiser ventes par taux, marges HT et food cost en un seul tableau de bord.",
  },
];

export default function BlogTvaRestaurant() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="TVA restaurant 2026 : taux 10%, 5,5% et 20% expliqués (sur place, à emporter, alcool)"
        description="Quel taux de TVA appliquer en restauration en 2026 ? 10 % consommation immédiate, 5,5 % vente conditionnée, 20 % alcool. Règles sur place vs à emporter, ventilation, exemple chiffré et impact sur la marge."
        path="/blog/tva-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'TVA restaurant', url: 'https://www.restaumargin.fr/blog/tva-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'TVA restaurant 2026 : taux 10%, 5,5% et 20% expliqués',
            description:
              "Guide complet de la TVA en restauration 2026 : les trois taux applicables, la règle sur place vs à emporter, le cas de l'alcool, l'obligation de ventilation, la TVA déductible sur les achats et l'impact sur le calcul de la marge.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-06-01',
            dateModified: '2026-06-01',
            wordCount: 3400,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/tva-restaurant' },
            citation: [
              { '@type': 'CreativeWork', name: 'Code général des impôts - article 279 (taux réduit restauration)' },
              { '@type': 'CreativeWork', name: 'BOFiP - TVA applicable aux ventes à consommer sur place' },
              { '@type': 'CreativeWork', name: 'UMIH - référentiel TVA secteur CHR' },
              { '@type': 'CreativeWork', name: 'GHR - Groupement des Hôtelleries et Restaurations' },
            ],
          },
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/outils/calculateur-food-cost"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer ma marge
            </Link>
            <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumbs ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">TVA restaurant</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <BlogArticleHero
        category="Fiscalité"
        readTime="16 min"
        date="Juin 2026"
        title="TVA restaurant 2026 : les taux 10 %, 5,5 % et 20 % expliqués simplement"
        accentWord="TVA"
        subtitle="Sur place, à emporter, boissons alcoolisées, livraison : quel taux appliquer à quoi, pourquoi la ventilation est obligatoire, et comment la TVA influence vraiment le calcul de votre marge."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-06-01" updatedDate="2026-06-01" readTime="16 min" variant="header" />

        {/* ── Intro / Featured snippet ── */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-l-4 border-teal-600 rounded-r-2xl p-5 sm:p-6 my-8">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2">Réponse rapide</p>
          <p className="text-base sm:text-lg text-mono-100 leading-relaxed">
            En restauration, <strong>trois taux de TVA</strong> coexistent en 2026 : <strong>10 %</strong> pour la nourriture et les boissons sans alcool consommées immédiatement (sur place ou à emporter chaud), <strong>5,5 %</strong> pour les produits alimentaires conditionnés pour la conservation (consommation différée), et <strong>20 %</strong> pour toutes les boissons alcoolisées. Le taux dépend de la nature du produit et du moment de consommation, pas du seul fait de manger sur place.
          </p>
        </div>

        {/* ── Encadre 3 taux ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Les 3 taux à retenir</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">TVA restauration : 10 %, 5,5 % et 20 %</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold min-w-[52px]">10 %</span>
              <span>Nourriture et boissons <strong className="text-white">sans alcool</strong> à consommation immédiate (sur place, plat chaud à emporter, livraison chaude)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold min-w-[52px]">5,5 %</span>
              <span>Produits alimentaires <strong className="text-white">conditionnés pour la conservation</strong> (consommation différée : bocaux, plats sous-vide, pain à emporter)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold min-w-[52px]">20 %</span>
              <span>Toutes les <strong className="text-white">boissons alcoolisées</strong> : vin, bière, spiritueux, cocktails, sur place comme à emporter</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Règle d'or : le critère n'est pas "sur place ou à emporter" mais "le produit est-il destiné à une consommation immédiate ou différée", plus le cas particulier de l'alcool toujours à 20 %.
          </p>
        </div>

        {/* ── Sommaire ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#taux', label: 'Les 3 taux de TVA en restauration' },
              { href: '#sur-place', label: 'TVA sur place vs à emporter : la vraie règle' },
              { href: '#dix', label: 'Le taux à 10 % : consommation immédiate' },
              { href: '#cinq', label: 'Le taux à 5,5 % : consommation différée' },
              { href: '#vingt', label: 'Le taux à 20 % : les boissons alcoolisées' },
              { href: '#cas', label: 'Cas particuliers : livraison, menus, petit-déjeuner' },
              { href: '#ventilation', label: "L'obligation de ventilation de la TVA" },
              { href: '#marge', label: 'TVA et calcul de la marge : HT ou TTC ?' },
              { href: '#exemple', label: 'Exemple chiffré : ventiler un ticket de caisse' },
              { href: '#deductible', label: 'La TVA déductible sur vos achats' },
              { href: '#erreurs', label: 'Les erreurs courantes et les sanctions' },
              { href: '#faq', label: 'FAQ : 12 questions fréquentes' },
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

        <article className="prose-article">
          {/* ═════════ SECTION 1 : Les 3 taux ═════════ */}
          <section id="taux" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Percent className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Les 3 taux de TVA en restauration</h2>
            </div>
            <p>
              Contrairement à une idée reçue, il n'existe pas un seul taux de TVA "restauration". En France, en 2026, un restaurateur jongle avec <strong>trois taux différents</strong> selon ce qu'il vend et la manière dont le produit est consommé. Maîtriser cette distinction est la base de votre conformité fiscale, mais aussi de votre pilotage de marge, puisque tous vos calculs de rentabilité se font hors taxes.
            </p>
            <p>
              Voici une vue d'ensemble des trois taux et de leur périmètre d'application :
            </p>
            <div className="overflow-x-auto my-6">
              <table className="text-sm sm:text-base">
                <thead className="bg-mono-1000">
                  <tr>
                    <th className="text-left p-3 font-bold text-mono-100">Taux</th>
                    <th className="text-left p-3 font-bold text-mono-100">S'applique à</th>
                    <th className="text-left p-3 font-bold text-mono-100">Exemples</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 font-bold text-teal-700">10 %</td>
                    <td className="p-3">Nourriture et boissons sans alcool à consommer immédiatement</td>
                    <td className="p-3">Plat sur place, sandwich chaud à emporter, soda au verre, café, menu du jour</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-teal-700">5,5 %</td>
                    <td className="p-3">Produits alimentaires conditionnés pour la conservation</td>
                    <td className="p-3">Plat sous-vide à réchauffer, bocal, pain et viennoiserie à emporter, conserves</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-teal-700">20 %</td>
                    <td className="p-3">Toutes les boissons alcoolisées, sans exception</td>
                    <td className="p-3">Verre de vin, bière, cocktail, bouteille à emporter, digestif</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Retenez cette logique : <strong>la nature du produit</strong> (alimentaire ou alcool) et <strong>le moment de consommation</strong> (immédiate ou différée) déterminent le taux. Le simple fait que le client emporte ou non son repas ne suffit jamais à trancher.
            </p>
          </section>

          {/* ═════════ SECTION 2 : Sur place vs a emporter ═════════ */}
          <section id="sur-place" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <ShoppingBag className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">TVA sur place vs à emporter : la vraie règle</h2>
            </div>
            <p>
              C'est la confusion numéro un en restauration rapide. Beaucoup de gérants pensent qu'un produit consommé sur place est à 10 % et qu'un produit emporté tombe automatiquement à 5,5 %. <strong>C'est faux.</strong> Le critère n'est pas l'endroit où le client mange, mais la <strong>destination du produit</strong> : est-il fait pour être consommé immédiatement, ou est-il conditionné pour être conservé ?
            </p>
            <p>
              Un exemple concret : un sandwich chaud vendu à un client qui le mange tout de suite dans la rue reste à <strong>10 %</strong>, exactement comme s'il l'avait mangé en salle. À l'inverse, un plat sous-vide à réchauffer à la maison, conditionné pour la conservation, relève du <strong>5,5 %</strong>. Le fait que le produit "quitte le local" ne change rien.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-5 my-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="m-0 text-mono-100">
                  <strong>Piège classique de la vente à emporter :</strong> appliquer 5,5 % à toute commande emportée. Sur la plupart des ventes de restauration rapide (plats chauds, menus consommés dans la foulée), le taux correct est 10 %. Appliquer 5,5 % par erreur, c'est sous-collecter la TVA et s'exposer à un redressement.
                </p>
              </div>
            </div>
            <p>
              La distinction sur place / à emporter compte surtout pour le confort de service et le prix affiché, mais pour la TVA, posez-vous toujours la bonne question : <strong>consommation immédiate ou différée, et y a-t-il de l'alcool ?</strong>
            </p>
          </section>

          {/* ═════════ SECTION 3 : 10 % ═════════ */}
          <section id="dix" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <UtensilsCrossed className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Le taux à 10 % : la consommation immédiate</h2>
            </div>
            <p>
              Le taux de <strong>10 %</strong> est de loin le plus fréquent en restauration. Il couvre l'essentiel de l'activité d'un restaurant traditionnel, d'une brasserie, d'un fast-food ou d'un food truck. Il s'applique aux <strong>produits alimentaires et boissons non alcoolisées destinés à être consommés immédiatement</strong>.
            </p>
            <p>Relèvent du taux de 10 % :</p>
            <ul>
              <li>Tous les plats servis et consommés sur place (entrées, plats, desserts, menus) ;</li>
              <li>Les plats chauds vendus à emporter ou en livraison pour une consommation immédiate ;</li>
              <li>Les sandwichs, salades, burgers, pizzas à consommer tout de suite ;</li>
              <li>Les boissons sans alcool servies à table ou au comptoir : sodas, jus, eaux, café, thé, chocolat ;</li>
              <li>Le petit-déjeuner consommé sur place.</li>
            </ul>
            <p>
              Pour le restaurateur, c'est le taux de référence : sur un service classique sans vin ni bière, la quasi-totalité du ticket est à 10 %. C'est aussi ce taux qui sert de base au raisonnement HT pour le <Link to="/blog/reduire-food-cost" className="text-teal-700 font-semibold hover:underline">calcul du food cost</Link> et de la marge.
            </p>
          </section>

          {/* ═════════ SECTION 4 : 5,5 % ═════════ */}
          <section id="cinq" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Receipt className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Le taux à 5,5 % : la consommation différée</h2>
            </div>
            <p>
              Le taux réduit de <strong>5,5 %</strong> est celui des <strong>produits alimentaires destinés à une consommation différée</strong>, c'est-à-dire conditionnés dans un emballage permettant la conservation. C'est le taux des produits alimentaires de base et de l'épicerie, pas celui de la restauration immédiate.
            </p>
            <p>Relèvent du taux de 5,5 % :</p>
            <ul>
              <li>Les plats préparés vendus dans un conditionnement permettant la conservation (sous-vide, bocaux, conserves à réchauffer plus tard) ;</li>
              <li>Le pain, les viennoiseries et la pâtisserie vendus à emporter sans consommation immédiate ;</li>
              <li>Les produits d'épicerie fine vendus en boutique (confitures, terrines, sauces en pot) ;</li>
              <li>Les boissons non alcoolisées vendues en conditionnement fermé destiné à la conservation (bouteille d'eau ou de jus à emporter scellée).</li>
            </ul>
            <p>
              Pour un restaurant qui développe une offre "épicerie", "plats à emporter à réchauffer" ou "vente de bocaux maison", ce taux devient pertinent. Mais attention : un plat chaud servi pour être mangé tout de suite ne bascule jamais à 5,5 %, même emporté. C'est l'erreur la plus fréquente et la plus coûteuse.
            </p>
          </section>

          {/* ═════════ SECTION 5 : 20 % ═════════ */}
          <section id="vingt" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Wine className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Le taux à 20 % : les boissons alcoolisées</h2>
            </div>
            <p>
              Toutes les <strong>boissons alcoolisées</strong> sont exclues du taux réduit de la restauration et soumises au taux normal de <strong>20 %</strong>. Le seul critère est la présence d'alcool : peu importe que la boisson soit servie au verre ou en bouteille, sur place ou à emporter.
            </p>
            <p>Sont concernés à 20 % :</p>
            <ul>
              <li>Le vin (au verre, au pichet, à la bouteille) ;</li>
              <li>La bière et le cidre ;</li>
              <li>Les spiritueux, digestifs et apéritifs ;</li>
              <li>Les cocktails alcoolisés ;</li>
              <li>Le champagne et les vins effervescents.</li>
            </ul>
            <div className="bg-teal-50 border-l-4 border-teal-500 rounded-r-2xl p-5 my-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="m-0 text-mono-100">
                  <strong>Conséquence pour votre carte des vins :</strong> à marge HT égale, un verre de vin supporte 20 % de TVA contre 10 % pour un soft. Le prix TTC affiché est donc mécaniquement plus élevé. C'est un paramètre central de votre <Link to="/blog/construire-carte-vins-restaurant" className="text-teal-700 font-semibold hover:underline">stratégie de carte des vins</Link> et de pricing boissons.
                </p>
              </div>
            </div>
            <p>
              C'est aussi pour cela que la <strong>ventilation</strong> de la part alcool dans le chiffre d'affaires est cruciale : sans elle, vous risquez de payer 20 % sur l'ensemble de vos recettes.
            </p>
          </section>

          {/* ═════════ SECTION 6 : Cas particuliers ═════════ */}
          <section id="cas" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Truck className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Cas particuliers : livraison, menus, petit-déjeuner</h2>
            </div>
            <h3 className="text-lg font-bold text-mono-100 mt-6 mb-2">La livraison de repas</h3>
            <p>
              Les repas livrés via une plateforme (UberEats, Deliveroo) ou en propre suivent la logique de la vente à emporter : <strong>10 %</strong> pour un plat chaud à consommation immédiate, <strong>5,5 %</strong> pour un produit conditionné à conserver, <strong>20 %</strong> pour l'alcool. La commission prélevé par la plateforme est soumise à 20 %, mais cette TVA est en général déductible. Pensez à bien distinguer la TVA sur la vente au client de la TVA sur la commission. Voir notre guide sur la <Link to="/blog/livraison-restaurant-rentabilite" className="text-teal-700 font-semibold hover:underline">rentabilité de la livraison</Link>.
            </p>
            <h3 className="text-lg font-bold text-mono-100 mt-6 mb-2">Les menus à prix unique avec alcool</h3>
            <p>
              Un menu à prix fixe incluant un plat (10 %) et un verre de vin (20 %) doit être <strong>ventilé</strong> entre les deux taux, généralement au prorata des prix pratiqués à la carte. Appliquer 10 % sur la totalité du menu, vin compris, est une erreur classique qui expose à un redressement.
            </p>
            <h3 className="text-lg font-bold text-mono-100 mt-6 mb-2">Le petit-déjeuner et les viennoiseries</h3>
            <p>
              Un petit-déjeuner consommé sur place est à <strong>10 %</strong> (café, jus, tartines, viennoiseries mangées immédiatement). Le pain et les viennoiseries vendus à emporter sans consommation immédiate relèvent du <strong>5,5 %</strong>. La destination du produit, encore une fois, prime sur le type de produit.
            </p>
            <h3 className="text-lg font-bold text-mono-100 mt-6 mb-2">Les distributeurs automatiques</h3>
            <p>
              Les produits alimentaires et boissons sans alcool vendus en distributeur automatique relèvent en général du taux de 10 % lorsqu'ils sont destinés à une consommation immédiate. La encore, la nature du produit et son mode de consommation déterminent le taux.
            </p>
          </section>

          {/* ═════════ SECTION 7 : Ventilation ═════════ */}
          <section id="ventilation" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <FileText className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">L'obligation de ventilation de la TVA</h2>
            </div>
            <p>
              Dès lors que vous vendez des produits à des taux différents, vous devez <strong>ventiler votre chiffre d'affaires taux par taux</strong>. C'est une obligation, pas une option. La règle de l'administration est sans appel :
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-5 my-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="m-0 text-mono-100">
                  <strong>En l'absence de ventilation, le taux le plus élevé s'applique à l'ensemble des recettes.</strong> Concrètement, si vous ne séparez pas la nourriture (10 %) de l'alcool (20 %), l'administration peut taxer la totalité de votre chiffre d'affaires à 20 %. La différence se chiffre vite en milliers d'euros par an.
                </p>
              </div>
            </div>
            <p>
              En pratique, la ventilation passe par un <Link to="/blog/logiciel-caisse-enregistreuse-restaurant" className="text-teal-700 font-semibold hover:underline">logiciel de caisse</Link> correctement paramétré : chaque produit ou famille de produits est associé à son taux, et le système édite un journal de TVA par taux. Ce journal alimente ensuite votre déclaration et le travail de votre comptable.
            </p>
            <p>
              Au-delà de la conformité, cette ventilation est un atout de pilotage : elle vous permet de connaître la part exacte de chaque catégorie (food, softs, alcool) dans votre chiffre d'affaires, donnée essentielle pour votre <Link to="/blog/menu-engineering-boston-matrix-restaurant" className="text-teal-700 font-semibold hover:underline">menu engineering</Link>.
            </p>
          </section>

          {/* ═════════ SECTION 8 : TVA et marge ═════════ */}
          <section id="marge" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Scale className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">TVA et calcul de la marge : HT ou TTC ?</h2>
            </div>
            <p>
              La question revient en boucle chez les restaurateurs : faut-il calculer sa marge en HT ou en TTC ? La réponse est sans ambiguïté : <strong>toujours en HT</strong>. La TVA collectée sur vos ventes ne vous appartient pas, vous la reversez à l'État. L'intégrer dans le calcul de marge gonflerait artificiellement votre chiffre d'affaires et fausserait tous vos ratios.
            </p>
            <p>
              Le raisonnement correct est le suivant :
            </p>
            <ul>
              <li><strong>Prix de vente HT</strong> = Prix TTC / (1 + taux de TVA). Pour un plat affiché 16,50 EUR TTC à 10 %, le prix HT est de 15 EUR.</li>
              <li><strong>Coût matière en HT</strong> : la TVA sur vos achats est récupérable, donc vous raisonnez sur le prix d'achat hors taxes.</li>
              <li><strong>Food cost</strong> = (Coût matière HT / Prix de vente HT) x 100.</li>
              <li><strong>Marge brute</strong> = 100 - food cost.</li>
            </ul>
            <p>
              Indirectement, la TVA influence quand même votre stratégie de prix : à marge HT identique, un produit à 20 % de TVA (un cocktail) sera plus cher en vitrine qu'un produit à 10 % (un soft). Le client, lui, voit le prix TTC. Bien comprendre cette mécanique vous aide à fixer des prix cohérents. Pour aller plus loin, consultez notre guide complet sur <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 font-semibold hover:underline">le calcul de marge en restaurant</Link> et sur <Link to="/blog/prix-de-vente-restaurant" className="text-teal-700 font-semibold hover:underline">la fixation du prix de vente</Link>.
            </p>
          </section>

          {/* ═════════ SECTION 9 : Exemple chiffre ═════════ */}
          <section id="exemple" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Calculator className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Exemple chiffré : ventiler un ticket de caisse</h2>
            </div>
            <p>
              Prenons un ticket classique de brasserie. Un client commande un menu (entrée, plat, dessert) à 32 EUR TTC et un verre de vin à 7 EUR TTC. Voici comment ventiler ce ticket et en déduire la TVA collectée :
            </p>
            <div className="overflow-x-auto my-6">
              <table className="text-sm sm:text-base">
                <thead className="bg-mono-1000">
                  <tr>
                    <th className="text-left p-3 font-bold text-mono-100">Poste</th>
                    <th className="text-left p-3 font-bold text-mono-100">Taux</th>
                    <th className="text-left p-3 font-bold text-mono-100">TTC</th>
                    <th className="text-left p-3 font-bold text-mono-100">HT</th>
                    <th className="text-left p-3 font-bold text-mono-100">TVA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3">Menu (nourriture)</td>
                    <td className="p-3 font-semibold text-teal-700">10 %</td>
                    <td className="p-3">32,00 EUR</td>
                    <td className="p-3">29,09 EUR</td>
                    <td className="p-3">2,91 EUR</td>
                  </tr>
                  <tr>
                    <td className="p-3">Verre de vin (alcool)</td>
                    <td className="p-3 font-semibold text-teal-700">20 %</td>
                    <td className="p-3">7,00 EUR</td>
                    <td className="p-3">5,83 EUR</td>
                    <td className="p-3">1,17 EUR</td>
                  </tr>
                  <tr className="bg-teal-50">
                    <td className="p-3 font-bold">Total ticket</td>
                    <td className="p-3">-</td>
                    <td className="p-3 font-bold">39,00 EUR</td>
                    <td className="p-3 font-bold">34,92 EUR</td>
                    <td className="p-3 font-bold">4,08 EUR</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Sur ce ticket de 39 EUR TTC, vous collectez <strong>4,08 EUR de TVA</strong> (2,91 EUR à 10 % + 1,17 EUR à 20 %) que vous reverserez à l'État. Votre chiffre d'affaires réel HT est de <strong>34,92 EUR</strong> : c'est ce montant qui sert de base à vos calculs de marge et de food cost.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-5 my-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="m-0 text-mono-100">
                  Si vous aviez appliqué 10 % à tout le ticket par défaut (vin compris), vous auriez sous-déclaré la TVA sur l'alcool. À l'inverse, sans ventilation et avec contrôle, c'est 20 % sur les 39 EUR qui serait réclamé, soit 6,50 EUR de TVA au lieu de 4,08 EUR.
                </p>
              </div>
            </div>
          </section>

          {/* ═════════ SECTION 10 : TVA deductible ═════════ */}
          <section id="deductible" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">La TVA déductible sur vos achats</h2>
            </div>
            <p>
              La TVA n'est pas qu'une charge : la TVA que vous payez sur vos achats professionnels est <strong>récupérable</strong>. On parle de TVA déductible. Concrètement, vous reversez à l'État la <strong>différence</strong> entre la TVA collectée sur vos ventes et la TVA déductible sur vos dépenses.
            </p>
            <p>Sont généralement déductibles :</p>
            <ul>
              <li>La TVA sur les matières premières (souvent à 5,5 % pour l'alimentaire et 20 % pour l'alcool et certains produits) ;</li>
              <li>La TVA sur l'énergie (électricité, gaz) ;</li>
              <li>La TVA sur le matériel, l'équipement de cuisine et le mobilier ;</li>
              <li>La TVA sur les commissions des plateformes de livraison ;</li>
              <li>La TVA sur certaines prestations (entretien, maintenance, logiciels).</li>
            </ul>
            <p>
              C'est précisément parce que la TVA sur les achats est récupérable que vous raisonnez en HT pour évaluer votre coût matière et votre marge. Un suivi propre de la TVA déductible, facture par facture, optimise votre trésorerie. Le <Link to="/blog/logiciel-gestion-restaurant" className="text-teal-700 font-semibold hover:underline">scan OCR des factures fournisseurs</Link> permet d'automatiser ce relevé et d'éviter les oublis.
            </p>
          </section>

          {/* ═════════ SECTION 11 : Erreurs et sanctions ═════════ */}
          <section id="erreurs" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Les erreurs courantes et les sanctions</h2>
            </div>
            <p>Voici les erreurs de TVA les plus fréquemment relevées en restauration, et leurs conséquences :</p>
            <ul>
              <li><strong>Appliquer 5,5 % à toute la vente à emporter :</strong> faux pour les plats chauds à consommation immédiate (10 %). Sous-collecte de TVA.</li>
              <li><strong>Oublier le 20 % sur l'alcool :</strong> taxer le vin à 10 % comme la nourriture est une erreur très surveillée par l'administration.</li>
              <li><strong>Ne pas ventiler les menus avec boisson alcoolisée :</strong> le menu doit être réparti entre 10 % et 20 %.</li>
              <li><strong>Absence de ventilation globale :</strong> déclenche l'application du taux le plus élevé sur l'ensemble des recettes.</li>
              <li><strong>Calculer sa marge en TTC :</strong> erreur de gestion (pas fiscale) qui fausse tous les ratios de rentabilité.</li>
            </ul>
            <p>
              En cas de contrôle, une mauvaise application de la TVA expose à un <strong>rappel de TVA</strong> sur la période vérifiée (jusqu'à trois ans), assorti d'une <strong>majoration de 10 à 40 %</strong> selon la bonne ou mauvaise foi, et d'<strong>intérêts de retard</strong>. La rigueur sur la TVA est donc autant une affaire de conformité que de rentabilité.
            </p>
            <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 my-8">
              <p className="m-0 text-sm text-mono-350">
                <strong className="text-mono-100">Bon à savoir :</strong> les taux et règles présentés ici correspondent au cadre applicable en France en 2026. La fiscalité évolue : pour toute situation spécifique (traiteur, hôtellerie, vente combinée, régimes particuliers), validez toujours votre paramétrage avec votre expert-comptable. Cet article a une vocation pédagogique et ne remplace pas un conseil fiscal personnalisé.
              </p>
            </div>
          </section>

          {/* ═════════ FAQ ═════════ */}
          <section id="faq" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <BookOpen className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">FAQ : 12 questions fréquentes sur la TVA en restauration</h2>
            </div>
            <div className="space-y-5">
              {faqItems.map((item, i) => (
                <div key={i} className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-mono-100 mb-2 mt-0">{item.question}</h3>
                  <p className="m-0 text-mono-350">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ═════════ Sources ═════════ */}
          <section className="mb-14">
            <h2 className="text-xl font-bold text-mono-100 mb-4">Sources et références</h2>
            <ul className="text-sm">
              <li>- <strong>Code général des impôts</strong> : article 279 - taux réduit applicable à la restauration</li>
              <li>- <strong>BOFiP</strong> : doctrine sur la TVA des ventes à consommer sur place et à emporter</li>
              <li>- <strong>UMIH</strong> : Union des Métiers et des Industries de l'Hôtellerie - référentiel TVA du secteur CHR</li>
              <li>- <strong>GHR</strong> : Groupement des Hôtelleries et Restaurations - guides de gestion 2026</li>
            </ul>
            <p className="text-xs text-mono-500 mt-4 italic">
              Article rédigé par la rédaction RestauMargin. Publié le 1er juin 2026. Notre méthodologie : croisement des textes fiscaux en vigueur et des retours terrain de restaurateurs accompagnés par RestauMargin. Ce contenu est informatif et ne se substitue pas à l'avis de votre expert-comptable.
            </p>
          </section>

          <BlogAuthor publishedDate="2026-06-01" updatedDate="2026-06-01" readTime="16 min" variant="footer" />
        </article>
      </main>

      {/* ── CTA final ── */}
      <section className="bg-gradient-to-br from-teal-50 to-emerald-50 py-14 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 mb-3 font-satoshi">
            Pilote ta marge HT et ta TVA dans un seul tableau de bord
          </h2>
          <p className="text-mono-500 mb-6">
            RestauMargin ventile tes ventes par taux, calcule tes marges en HT, scanne tes factures fournisseurs pour la TVA déductible et détecte les dérives de food cost. La conformité et la rentabilité au même endroit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/outils/calculateur-food-cost"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-teal-300 text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Calculateur gratuit
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
            >
              Essayer RestauMargin
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-mono-900 py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-mono-700">
          <Link to="/" className="flex items-center gap-1.5 hover:text-teal-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <p>&copy; {new Date().getFullYear()} RestauMargin - Le copilote rentabilité de votre restaurant</p>
        </div>
      </footer>

      <style>{`
        .prose-article p {
          color: #475569;
          line-height: 1.75;
          margin-bottom: 1rem;
          font-size: 1rem;
        }
        .prose-article ul, .prose-article ol {
          color: #475569;
          line-height: 1.75;
          margin-bottom: 1rem;
          padding-left: 1.25rem;
        }
        .prose-article li {
          margin-bottom: 0.375rem;
        }
        .prose-article strong {
          color: #0f172a;
          font-weight: 600;
        }
        .prose-article a {
          color: #0d9488;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .prose-article a:hover {
          color: #0f766e;
        }
        .prose-article table {
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          overflow: hidden;
          width: 100%;
        }
        .prose-article th, .prose-article td {
          border-bottom: 1px solid #f1f5f9;
        }
      `}</style>
    </div>
  );
}
