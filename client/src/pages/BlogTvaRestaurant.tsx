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
      "En restauration, trois taux de TVA coexistent en 2026 : 10 % pour les produits alimentaires et boissons non alcoolisees consommes immediatement (sur place ou a emporter chaud), 5,5 % pour les produits alimentaires vendus dans un conditionnement permettant la conservation (consommation differee), et 20 % pour toutes les boissons alcoolisees, quel que soit le mode de consommation. Le taux depend de la nature du produit et du moment de consommation, pas du seul fait de manger sur place.",
  },
  {
    question: "Quelle TVA sur place et a emporter ?",
    answer:
      "Sur place, la consommation est par definition immediate : le taux est de 10 % pour la nourriture et les boissons sans alcool. A emporter, le critere n'est pas le fait de quitter le local mais la destination du produit. Un plat chaud ou un sandwich destine a etre mange tout de suite reste a 10 %. Un produit conditionne pour etre conserve (bocal, plat sous-vide a rechauffer, boisson en bouteille fermee) passe a 5,5 %. L'alcool reste a 20 % dans tous les cas.",
  },
  {
    question: "Pourquoi l'alcool est-il taxe a 20 % au restaurant ?",
    answer:
      "Les boissons alcoolisees sont exclues du taux reduit de la restauration. Vin, biere, cidre, spiritueux, cocktails et aperitifs sont soumis au taux normal de 20 % de TVA, qu'ils soient servis au verre, en bouteille, sur place ou a emporter. Le seul critere est la presence d'alcool. C'est pour cela qu'un restaurateur doit imperativement ventiler la part alcool de son chiffre d'affaires pour ne pas surpayer ou sous-declarer sa TVA.",
  },
  {
    question: "Le food cost se calcule-t-il en HT ou en TTC a cause de la TVA ?",
    answer:
      "Toujours en HT. La TVA collectee sur vos ventes ne vous appartient pas : vous la reversez a l'Etat. Calculer une marge ou un food cost sur un prix TTC gonfle artificiellement le chiffre d'affaires et fausse le ratio. De la meme maniere, le cout matiere est pris en HT puisque la TVA sur vos achats est recuperable (TVA deductible). Marge, food cost, coefficient multiplicateur : tout se raisonne hors taxes.",
  },
  {
    question: "Qu'est-ce que l'obligation de ventilation de la TVA ?",
    answer:
      "Un restaurateur qui vend des produits a des taux differents (10 % pour la nourriture, 20 % pour l'alcool, parfois 5,5 % pour de la vente conditionnee) doit ventiler son chiffre d'affaires taux par taux. S'il ne tient pas cette ventilation, l'administration fiscale applique le taux le plus eleve (20 %) sur l'ensemble des recettes. Un logiciel de caisse parametre correctement et un suivi des ventes par categorie sont donc indispensables.",
  },
  {
    question: "Quelle TVA pour la livraison de repas (UberEats, Deliveroo) ?",
    answer:
      "La TVA sur les repas livres suit la meme logique que la vente a emporter : 10 % pour un plat chaud destine a une consommation immediate, 5,5 % pour un produit conditionne a conserver, 20 % pour l'alcool. La commission preleve par la plateforme (souvent 25 a 35 %) est, elle, soumise a 20 % de TVA, mais cette TVA est generalement deductible pour le restaurateur. Attention a bien distinguer la TVA sur la vente et la TVA sur la commission.",
  },
  {
    question: "La TVA payee sur mes achats est-elle recuperable ?",
    answer:
      "Oui. La TVA que vous payez a vos fournisseurs (matieres premieres, energie, materiel, loyers soumis a TVA, commissions de plateformes) est une TVA deductible que vous recuperez. Concretement, vous reversez a l'Etat la difference entre la TVA collectee sur vos ventes et la TVA deductible sur vos achats. C'est pour cette raison que tous les calculs de rentabilite se font en HT.",
  },
  {
    question: "Quelle TVA sur les menus comprenant un plat et une boisson alcoolisee ?",
    answer:
      "Pour un menu a prix unique incluant par exemple un plat (10 %) et un verre de vin (20 %), il faut ventiler le prix du menu entre les deux taux de maniere economiquement justifiee, generalement au prorata des prix pratiques a la carte. Appliquer 10 % sur la totalite du menu vin compris est une erreur frequente qui expose a un redressement. Un parametrage caisse adapte automatise cette ventilation.",
  },
  {
    question: "Quel taux de TVA pour le petit-dejeuner et les viennoiseries ?",
    answer:
      "Un petit-dejeuner servi et consomme sur place releve du taux de 10 % (cafe, jus, tartines, viennoiseries consommees immediatement). Le pain et les viennoiseries vendus a emporter, non destines a une consommation immediate, relevent du taux de 5,5 % en tant que produits alimentaires de base. La encore, c'est la destination du produit qui determine le taux, pas uniquement le type de produit.",
  },
  {
    question: "Quelles sanctions en cas de mauvaise application de la TVA ?",
    answer:
      "Une erreur de taux ou une absence de ventilation peut entrainer un redressement fiscal : rappel de TVA sur la periode controlee (jusqu'a 3 ans), majoration de 10 a 40 % selon la bonne ou mauvaise foi, et interets de retard. En pratique, l'administration applique le taux le plus eleve sur les recettes non ventilees. Un suivi rigoureux de la TVA par categorie de produit est donc autant une question de conformite que de rentabilite.",
  },
  {
    question: "La TVA change-t-elle quelque chose a ma marge brute ?",
    answer:
      "Indirectement, oui. La marge brute se calcule en HT, donc la TVA ne la modifie pas mathematiquement. Mais le taux de TVA affecte votre prix TTC affiche au client : a marge HT egale, un produit a 20 % de TVA sera plus cher en vitrine qu'un produit a 10 %. C'est un parametre a integrer dans votre strategie de prix, surtout sur la carte des vins et des cocktails ou la TVA a 20 % pese sur le prix percu.",
  },
  {
    question: "Comment parametrer correctement la TVA dans mon logiciel de caisse ?",
    answer:
      "Associez chaque produit ou famille de produits a son taux : 10 % pour les plats et softs, 20 % pour les alcools, 5,5 % pour la vente conditionnee a emporter le cas echeant. Verifiez que les menus a prix fixe ventilent automatiquement la part alcool. Editez chaque mois un journal de TVA par taux pour votre comptable. Un logiciel de gestion couple a la caisse, comme RestauMargin, permet de croiser ventes par taux, marges HT et food cost en un seul tableau de bord.",
  },
];

export default function BlogTvaRestaurant() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="TVA restaurant 2026 : taux 10%, 5,5% et 20% expliques (sur place, a emporter, alcool)"
        description="Quel taux de TVA appliquer en restauration en 2026 ? 10 % consommation immediate, 5,5 % vente conditionnee, 20 % alcool. Regles sur place vs a emporter, ventilation, exemple chiffre et impact sur la marge."
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
            headline: 'TVA restaurant 2026 : taux 10%, 5,5% et 20% expliques',
            description:
              "Guide complet de la TVA en restauration 2026 : les trois taux applicables, la regle sur place vs a emporter, le cas de l'alcool, l'obligation de ventilation, la TVA deductible sur les achats et l'impact sur le calcul de la marge.",
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
              { '@type': 'CreativeWork', name: 'Code general des impots - article 279 (taux reduit restauration)' },
              { '@type': 'CreativeWork', name: 'BOFiP - TVA applicable aux ventes a consommer sur place' },
              { '@type': 'CreativeWork', name: 'UMIH - referentiel TVA secteur CHR' },
              { '@type': 'CreativeWork', name: 'GHR - Groupement des Hotelleries et Restaurations' },
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
        category="Fiscalite"
        readTime="16 min"
        date="Juin 2026"
        title="TVA restaurant 2026 : les taux 10 %, 5,5 % et 20 % expliques simplement"
        accentWord="TVA"
        subtitle="Sur place, a emporter, boissons alcoolisees, livraison : quel taux appliquer a quoi, pourquoi la ventilation est obligatoire, et comment la TVA influence vraiment le calcul de votre marge."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-06-01" updatedDate="2026-06-01" readTime="16 min" variant="header" />

        {/* ── Intro / Featured snippet ── */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-l-4 border-teal-600 rounded-r-2xl p-5 sm:p-6 my-8">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2">Reponse rapide</p>
          <p className="text-base sm:text-lg text-mono-100 leading-relaxed">
            En restauration, <strong>trois taux de TVA</strong> coexistent en 2026 : <strong>10 %</strong> pour la nourriture et les boissons sans alcool consommees immediatement (sur place ou a emporter chaud), <strong>5,5 %</strong> pour les produits alimentaires conditionnes pour la conservation (consommation differee), et <strong>20 %</strong> pour toutes les boissons alcoolisees. Le taux depend de la nature du produit et du moment de consommation, pas du seul fait de manger sur place.
          </p>
        </div>

        {/* ── Encadre 3 taux ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Les 3 taux a retenir</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">TVA restauration : 10 %, 5,5 % et 20 %</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold min-w-[52px]">10 %</span>
              <span>Nourriture et boissons <strong className="text-white">sans alcool</strong> a consommation immediate (sur place, plat chaud a emporter, livraison chaude)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold min-w-[52px]">5,5 %</span>
              <span>Produits alimentaires <strong className="text-white">conditionnes pour la conservation</strong> (consommation differee : bocaux, plats sous-vide, pain a emporter)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold min-w-[52px]">20 %</span>
              <span>Toutes les <strong className="text-white">boissons alcoolisees</strong> : vin, biere, spiritueux, cocktails, sur place comme a emporter</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Regle d'or : le critere n'est pas "sur place ou a emporter" mais "le produit est-il destine a une consommation immediate ou differee", plus le cas particulier de l'alcool toujours a 20 %.
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
              { href: '#sur-place', label: 'TVA sur place vs a emporter : la vraie regle' },
              { href: '#dix', label: 'Le taux a 10 % : consommation immediate' },
              { href: '#cinq', label: 'Le taux a 5,5 % : consommation differee' },
              { href: '#vingt', label: 'Le taux a 20 % : les boissons alcoolisees' },
              { href: '#cas', label: 'Cas particuliers : livraison, menus, petit-dejeuner' },
              { href: '#ventilation', label: "L'obligation de ventilation de la TVA" },
              { href: '#marge', label: 'TVA et calcul de la marge : HT ou TTC ?' },
              { href: '#exemple', label: 'Exemple chiffre : ventiler un ticket de caisse' },
              { href: '#deductible', label: 'La TVA deductible sur vos achats' },
              { href: '#erreurs', label: 'Les erreurs courantes et les sanctions' },
              { href: '#faq', label: 'FAQ : 12 questions frequentes' },
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
              Contrairement a une idee recue, il n'existe pas un seul taux de TVA "restauration". En France, en 2026, un restaurateur jongle avec <strong>trois taux differents</strong> selon ce qu'il vend et la maniere dont le produit est consomme. Maitriser cette distinction est la base de votre conformite fiscale, mais aussi de votre pilotage de marge, puisque tous vos calculs de rentabilite se font hors taxes.
            </p>
            <p>
              Voici une vue d'ensemble des trois taux et de leur perimetre d'application :
            </p>
            <div className="overflow-x-auto my-6">
              <table className="text-sm sm:text-base">
                <thead className="bg-mono-1000">
                  <tr>
                    <th className="text-left p-3 font-bold text-mono-100">Taux</th>
                    <th className="text-left p-3 font-bold text-mono-100">S'applique a</th>
                    <th className="text-left p-3 font-bold text-mono-100">Exemples</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 font-bold text-teal-700">10 %</td>
                    <td className="p-3">Nourriture et boissons sans alcool a consommer immediatement</td>
                    <td className="p-3">Plat sur place, sandwich chaud a emporter, soda au verre, cafe, menu du jour</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-teal-700">5,5 %</td>
                    <td className="p-3">Produits alimentaires conditionnes pour la conservation</td>
                    <td className="p-3">Plat sous-vide a rechauffer, bocal, pain et viennoiserie a emporter, conserves</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-teal-700">20 %</td>
                    <td className="p-3">Toutes les boissons alcoolisees, sans exception</td>
                    <td className="p-3">Verre de vin, biere, cocktail, bouteille a emporter, digestif</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Retenez cette logique : <strong>la nature du produit</strong> (alimentaire ou alcool) et <strong>le moment de consommation</strong> (immediate ou differee) determinent le taux. Le simple fait que le client emporte ou non son repas ne suffit jamais a trancher.
            </p>
          </section>

          {/* ═════════ SECTION 2 : Sur place vs a emporter ═════════ */}
          <section id="sur-place" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <ShoppingBag className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">TVA sur place vs a emporter : la vraie regle</h2>
            </div>
            <p>
              C'est la confusion numero un en restauration rapide. Beaucoup de gerants pensent qu'un produit consomme sur place est a 10 % et qu'un produit emporte tombe automatiquement a 5,5 %. <strong>C'est faux.</strong> Le critere n'est pas l'endroit ou le client mange, mais la <strong>destination du produit</strong> : est-il fait pour etre consomme immediatement, ou est-il conditionne pour etre conserve ?
            </p>
            <p>
              Un exemple concret : un sandwich chaud vendu a un client qui le mange tout de suite dans la rue reste a <strong>10 %</strong>, exactement comme s'il l'avait mange en salle. A l'inverse, un plat sous-vide a rechauffer a la maison, conditionne pour la conservation, releve du <strong>5,5 %</strong>. Le fait que le produit "quitte le local" ne change rien.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-5 my-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="m-0 text-mono-100">
                  <strong>Piege classique de la vente a emporter :</strong> appliquer 5,5 % a toute commande emportee. Sur la plupart des ventes de restauration rapide (plats chauds, menus consommes dans la foulee), le taux correct est 10 %. Appliquer 5,5 % par erreur, c'est sous-collecter la TVA et s'exposer a un redressement.
                </p>
              </div>
            </div>
            <p>
              La distinction sur place / a emporter compte surtout pour le confort de service et le prix affiche, mais pour la TVA, posez-vous toujours la bonne question : <strong>consommation immediate ou differee, et y a-t-il de l'alcool ?</strong>
            </p>
          </section>

          {/* ═════════ SECTION 3 : 10 % ═════════ */}
          <section id="dix" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <UtensilsCrossed className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Le taux a 10 % : la consommation immediate</h2>
            </div>
            <p>
              Le taux de <strong>10 %</strong> est de loin le plus frequent en restauration. Il couvre l'essentiel de l'activite d'un restaurant traditionnel, d'une brasserie, d'un fast-food ou d'un food truck. Il s'applique aux <strong>produits alimentaires et boissons non alcoolisees destines a etre consommes immediatement</strong>.
            </p>
            <p>Relevent du taux de 10 % :</p>
            <ul>
              <li>Tous les plats servis et consommes sur place (entrees, plats, desserts, menus) ;</li>
              <li>Les plats chauds vendus a emporter ou en livraison pour une consommation immediate ;</li>
              <li>Les sandwichs, salades, burgers, pizzas a consommer tout de suite ;</li>
              <li>Les boissons sans alcool servies a table ou au comptoir : sodas, jus, eaux, cafe, the, chocolat ;</li>
              <li>Le petit-dejeuner consomme sur place.</li>
            </ul>
            <p>
              Pour le restaurateur, c'est le taux de reference : sur un service classique sans vin ni biere, la quasi-totalite du ticket est a 10 %. C'est aussi ce taux qui sert de base au raisonnement HT pour le <Link to="/blog/reduire-food-cost" className="text-teal-700 font-semibold hover:underline">calcul du food cost</Link> et de la marge.
            </p>
          </section>

          {/* ═════════ SECTION 4 : 5,5 % ═════════ */}
          <section id="cinq" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Receipt className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Le taux a 5,5 % : la consommation differee</h2>
            </div>
            <p>
              Le taux reduit de <strong>5,5 %</strong> est celui des <strong>produits alimentaires destines a une consommation differee</strong>, c'est-a-dire conditionnes dans un emballage permettant la conservation. C'est le taux des produits alimentaires de base et de l'epicerie, pas celui de la restauration immediate.
            </p>
            <p>Relevent du taux de 5,5 % :</p>
            <ul>
              <li>Les plats prepares vendus dans un conditionnement permettant la conservation (sous-vide, bocaux, conserves a rechauffer plus tard) ;</li>
              <li>Le pain, les viennoiseries et la patisserie vendus a emporter sans consommation immediate ;</li>
              <li>Les produits d'epicerie fine vendus en boutique (confitures, terrines, sauces en pot) ;</li>
              <li>Les boissons non alcoolisees vendues en conditionnement ferme destine a la conservation (bouteille d'eau ou de jus a emporter scellee).</li>
            </ul>
            <p>
              Pour un restaurant qui developpe une offre "epicerie", "plats a emporter a rechauffer" ou "vente de bocaux maison", ce taux devient pertinent. Mais attention : un plat chaud servi pour etre mange tout de suite ne bascule jamais a 5,5 %, meme emporte. C'est l'erreur la plus frequente et la plus couteuse.
            </p>
          </section>

          {/* ═════════ SECTION 5 : 20 % ═════════ */}
          <section id="vingt" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Wine className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Le taux a 20 % : les boissons alcoolisees</h2>
            </div>
            <p>
              Toutes les <strong>boissons alcoolisees</strong> sont exclues du taux reduit de la restauration et soumises au taux normal de <strong>20 %</strong>. Le seul critere est la presence d'alcool : peu importe que la boisson soit servie au verre ou en bouteille, sur place ou a emporter.
            </p>
            <p>Sont concernes a 20 % :</p>
            <ul>
              <li>Le vin (au verre, au pichet, a la bouteille) ;</li>
              <li>La biere et le cidre ;</li>
              <li>Les spiritueux, digestifs et aperitifs ;</li>
              <li>Les cocktails alcoolises ;</li>
              <li>Le champagne et les vins effervescents.</li>
            </ul>
            <div className="bg-teal-50 border-l-4 border-teal-500 rounded-r-2xl p-5 my-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="m-0 text-mono-100">
                  <strong>Consequence pour votre carte des vins :</strong> a marge HT egale, un verre de vin supporte 20 % de TVA contre 10 % pour un soft. Le prix TTC affiche est donc mecaniquement plus eleve. C'est un parametre central de votre <Link to="/blog/construire-carte-vins-restaurant" className="text-teal-700 font-semibold hover:underline">strategie de carte des vins</Link> et de pricing boissons.
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
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Cas particuliers : livraison, menus, petit-dejeuner</h2>
            </div>
            <h3 className="text-lg font-bold text-mono-100 mt-6 mb-2">La livraison de repas</h3>
            <p>
              Les repas livres via une plateforme (UberEats, Deliveroo) ou en propre suivent la logique de la vente a emporter : <strong>10 %</strong> pour un plat chaud a consommation immediate, <strong>5,5 %</strong> pour un produit conditionne a conserver, <strong>20 %</strong> pour l'alcool. La commission preleve par la plateforme est soumise a 20 %, mais cette TVA est en general deductible. Pensez a bien distinguer la TVA sur la vente au client de la TVA sur la commission. Voir notre guide sur la <Link to="/blog/livraison-restaurant-rentabilite" className="text-teal-700 font-semibold hover:underline">rentabilite de la livraison</Link>.
            </p>
            <h3 className="text-lg font-bold text-mono-100 mt-6 mb-2">Les menus a prix unique avec alcool</h3>
            <p>
              Un menu a prix fixe incluant un plat (10 %) et un verre de vin (20 %) doit etre <strong>ventile</strong> entre les deux taux, generalement au prorata des prix pratiques a la carte. Appliquer 10 % sur la totalite du menu, vin compris, est une erreur classique qui expose a un redressement.
            </p>
            <h3 className="text-lg font-bold text-mono-100 mt-6 mb-2">Le petit-dejeuner et les viennoiseries</h3>
            <p>
              Un petit-dejeuner consomme sur place est a <strong>10 %</strong> (cafe, jus, tartines, viennoiseries mangees immediatement). Le pain et les viennoiseries vendus a emporter sans consommation immediate relevent du <strong>5,5 %</strong>. La destination du produit, encore une fois, prime sur le type de produit.
            </p>
            <h3 className="text-lg font-bold text-mono-100 mt-6 mb-2">Les distributeurs automatiques</h3>
            <p>
              Les produits alimentaires et boissons sans alcool vendus en distributeur automatique relevent en general du taux de 10 % lorsqu'ils sont destines a une consommation immediate. La encore, la nature du produit et son mode de consommation determinent le taux.
            </p>
          </section>

          {/* ═════════ SECTION 7 : Ventilation ═════════ */}
          <section id="ventilation" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <FileText className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">L'obligation de ventilation de la TVA</h2>
            </div>
            <p>
              Des lors que vous vendez des produits a des taux differents, vous devez <strong>ventiler votre chiffre d'affaires taux par taux</strong>. C'est une obligation, pas une option. La regle de l'administration est sans appel :
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-5 my-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="m-0 text-mono-100">
                  <strong>En l'absence de ventilation, le taux le plus eleve s'applique a l'ensemble des recettes.</strong> Concretement, si vous ne separez pas la nourriture (10 %) de l'alcool (20 %), l'administration peut taxer la totalite de votre chiffre d'affaires a 20 %. La difference se chiffre vite en milliers d'euros par an.
                </p>
              </div>
            </div>
            <p>
              En pratique, la ventilation passe par un <Link to="/blog/logiciel-caisse-enregistreuse-restaurant" className="text-teal-700 font-semibold hover:underline">logiciel de caisse</Link> correctement parametre : chaque produit ou famille de produits est associe a son taux, et le systeme edite un journal de TVA par taux. Ce journal alimente ensuite votre declaration et le travail de votre comptable.
            </p>
            <p>
              Au-dela de la conformite, cette ventilation est un atout de pilotage : elle vous permet de connaitre la part exacte de chaque categorie (food, softs, alcool) dans votre chiffre d'affaires, donnee essentielle pour votre <Link to="/blog/menu-engineering-boston-matrix-restaurant" className="text-teal-700 font-semibold hover:underline">menu engineering</Link>.
            </p>
          </section>

          {/* ═════════ SECTION 8 : TVA et marge ═════════ */}
          <section id="marge" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Scale className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">TVA et calcul de la marge : HT ou TTC ?</h2>
            </div>
            <p>
              La question revient en boucle chez les restaurateurs : faut-il calculer sa marge en HT ou en TTC ? La reponse est sans ambiguite : <strong>toujours en HT</strong>. La TVA collectee sur vos ventes ne vous appartient pas, vous la reversez a l'Etat. L'integrer dans le calcul de marge gonflerait artificiellement votre chiffre d'affaires et fausserait tous vos ratios.
            </p>
            <p>
              Le raisonnement correct est le suivant :
            </p>
            <ul>
              <li><strong>Prix de vente HT</strong> = Prix TTC / (1 + taux de TVA). Pour un plat affiche 16,50 EUR TTC a 10 %, le prix HT est de 15 EUR.</li>
              <li><strong>Cout matiere en HT</strong> : la TVA sur vos achats est recuperable, donc vous raisonnez sur le prix d'achat hors taxes.</li>
              <li><strong>Food cost</strong> = (Cout matiere HT / Prix de vente HT) x 100.</li>
              <li><strong>Marge brute</strong> = 100 - food cost.</li>
            </ul>
            <p>
              Indirectement, la TVA influence quand meme votre strategie de prix : a marge HT identique, un produit a 20 % de TVA (un cocktail) sera plus cher en vitrine qu'un produit a 10 % (un soft). Le client, lui, voit le prix TTC. Bien comprendre cette mecanique vous aide a fixer des prix coherents. Pour aller plus loin, consultez notre guide complet sur <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 font-semibold hover:underline">le calcul de marge en restaurant</Link> et sur <Link to="/blog/prix-de-vente-restaurant" className="text-teal-700 font-semibold hover:underline">la fixation du prix de vente</Link>.
            </p>
          </section>

          {/* ═════════ SECTION 9 : Exemple chiffre ═════════ */}
          <section id="exemple" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Calculator className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Exemple chiffre : ventiler un ticket de caisse</h2>
            </div>
            <p>
              Prenons un ticket classique de brasserie. Un client commande un menu (entree, plat, dessert) a 32 EUR TTC et un verre de vin a 7 EUR TTC. Voici comment ventiler ce ticket et en deduire la TVA collectee :
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
              Sur ce ticket de 39 EUR TTC, vous collectez <strong>4,08 EUR de TVA</strong> (2,91 EUR a 10 % + 1,17 EUR a 20 %) que vous reverserez a l'Etat. Votre chiffre d'affaires reel HT est de <strong>34,92 EUR</strong> : c'est ce montant qui sert de base a vos calculs de marge et de food cost.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-5 my-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="m-0 text-mono-100">
                  Si vous aviez applique 10 % a tout le ticket par defaut (vin compris), vous auriez sous-declare la TVA sur l'alcool. A l'inverse, sans ventilation et avec controle, c'est 20 % sur les 39 EUR qui serait reclame, soit 6,50 EUR de TVA au lieu de 4,08 EUR.
                </p>
              </div>
            </div>
          </section>

          {/* ═════════ SECTION 10 : TVA deductible ═════════ */}
          <section id="deductible" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">La TVA deductible sur vos achats</h2>
            </div>
            <p>
              La TVA n'est pas qu'une charge : la TVA que vous payez sur vos achats professionnels est <strong>recuperable</strong>. On parle de TVA deductible. Concretement, vous reversez a l'Etat la <strong>difference</strong> entre la TVA collectee sur vos ventes et la TVA deductible sur vos depenses.
            </p>
            <p>Sont generalement deductibles :</p>
            <ul>
              <li>La TVA sur les matieres premieres (souvent a 5,5 % pour l'alimentaire et 20 % pour l'alcool et certains produits) ;</li>
              <li>La TVA sur l'energie (electricite, gaz) ;</li>
              <li>La TVA sur le materiel, l'equipement de cuisine et le mobilier ;</li>
              <li>La TVA sur les commissions des plateformes de livraison ;</li>
              <li>La TVA sur certaines prestations (entretien, maintenance, logiciels).</li>
            </ul>
            <p>
              C'est precisement parce que la TVA sur les achats est recuperable que vous raisonnez en HT pour evaluer votre cout matiere et votre marge. Un suivi propre de la TVA deductible, facture par facture, optimise votre tresorerie. Le <Link to="/blog/logiciel-gestion-restaurant" className="text-teal-700 font-semibold hover:underline">scan OCR des factures fournisseurs</Link> permet d'automatiser ce releve et d'eviter les oublis.
            </p>
          </section>

          {/* ═════════ SECTION 11 : Erreurs et sanctions ═════════ */}
          <section id="erreurs" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Les erreurs courantes et les sanctions</h2>
            </div>
            <p>Voici les erreurs de TVA les plus frequemment relevees en restauration, et leurs consequences :</p>
            <ul>
              <li><strong>Appliquer 5,5 % a toute la vente a emporter :</strong> faux pour les plats chauds a consommation immediate (10 %). Sous-collecte de TVA.</li>
              <li><strong>Oublier le 20 % sur l'alcool :</strong> taxer le vin a 10 % comme la nourriture est une erreur tres surveillee par l'administration.</li>
              <li><strong>Ne pas ventiler les menus avec boisson alcoolisee :</strong> le menu doit etre reparti entre 10 % et 20 %.</li>
              <li><strong>Absence de ventilation globale :</strong> declenche l'application du taux le plus eleve sur l'ensemble des recettes.</li>
              <li><strong>Calculer sa marge en TTC :</strong> erreur de gestion (pas fiscale) qui fausse tous les ratios de rentabilite.</li>
            </ul>
            <p>
              En cas de controle, une mauvaise application de la TVA expose a un <strong>rappel de TVA</strong> sur la periode verifiee (jusqu'a trois ans), assorti d'une <strong>majoration de 10 a 40 %</strong> selon la bonne ou mauvaise foi, et d'<strong>interets de retard</strong>. La rigueur sur la TVA est donc autant une affaire de conformite que de rentabilite.
            </p>
            <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 my-8">
              <p className="m-0 text-sm text-mono-350">
                <strong className="text-mono-100">Bon a savoir :</strong> les taux et regles presentes ici correspondent au cadre applicable en France en 2026. La fiscalite evolue : pour toute situation specifique (traiteur, hotellerie, vente combinee, regimes particuliers), validez toujours votre parametrage avec votre expert-comptable. Cet article a une vocation pedagogique et ne remplace pas un conseil fiscal personnalise.
              </p>
            </div>
          </section>

          {/* ═════════ FAQ ═════════ */}
          <section id="faq" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <BookOpen className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">FAQ : 12 questions frequentes sur la TVA en restauration</h2>
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
            <h2 className="text-xl font-bold text-mono-100 mb-4">Sources et references</h2>
            <ul className="text-sm">
              <li>- <strong>Code general des impots</strong> : article 279 - taux reduit applicable a la restauration</li>
              <li>- <strong>BOFiP</strong> : doctrine sur la TVA des ventes a consommer sur place et a emporter</li>
              <li>- <strong>UMIH</strong> : Union des Metiers et des Industries de l'Hotellerie - referentiel TVA du secteur CHR</li>
              <li>- <strong>GHR</strong> : Groupement des Hotelleries et Restaurations - guides de gestion 2026</li>
            </ul>
            <p className="text-xs text-mono-500 mt-4 italic">
              Article redige par la redaction RestauMargin. Publie le 1er juin 2026. Notre methodologie : croisement des textes fiscaux en vigueur et des retours terrain de restaurateurs accompagnes par RestauMargin. Ce contenu est informatif et ne se substitue pas a l'avis de votre expert-comptable.
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
            RestauMargin ventile tes ventes par taux, calcule tes marges en HT, scanne tes factures fournisseurs pour la TVA deductible et detecte les derives de food cost. La conformite et la rentabilite au meme endroit.
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
          <Link to="/landing" className="flex items-center gap-1.5 hover:text-teal-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour a l'accueil
          </Link>
          <p>&copy; {new Date().getFullYear()} RestauMargin - Le copilote rentabilite de votre restaurant</p>
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
