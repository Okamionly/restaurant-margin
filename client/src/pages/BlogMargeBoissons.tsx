import { Link } from 'react-router-dom';
import {
  ChefHat,
  Calculator,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Percent,
  Coffee,
  Wine,
  Beer,
  Martini,
  CupSoda,
  GlassWater,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Scale,
  Lightbulb,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Quelle marge sur les boissons au restaurant ?"
   Question PAA ciblee : "Quelle marge sur les boissons au restaurant ?"
   ~3 300 mots — featured snippet first, EEAT, schema FAQ + Article
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quelle marge sur les boissons au restaurant ?",
    answer:
      "Les boissons sont la catégorie la plus rentable d'un restaurant, avec une marge brute moyenne de 80 à 90 % contre 65 à 75 % sur la nourriture. Concrètement, un café ou un soft affiche un food cost de 8 à 12 % (coefficient de x8 à x15), une bière pression environ 18 % (coefficient x5 à x6), un verre de vin autour de 20 % (coefficient x4 à x5) et un cocktail environ 25 % (coefficient x4 à x5). Toutes ces valeurs se raisonnent en HT.",
  },
  {
    question: "Quelle est la boisson la plus rentable au restaurant ?",
    answer:
      "Le café est de loin la boisson la plus rentable. Un expresso coûte environ 0,15 à 0,25 EUR de matière (grain, eau, énergie) et se vend 2 à 2,50 EUR, soit un food cost de 8 à 12 % et un coefficient de x10 à x15. Les softs et l'eau minérale suivent de très près. À l'inverse, le vin à la bouteille et les cocktails ont un pourcentage de marge plus faible, mais dégagent une marge en euros beaucoup plus élevée par vente.",
  },
  {
    question: "Comment calculer la marge d'une boisson ?",
    answer:
      "La marge brute d'une boisson se calcule en HT : Marge brute % = (Prix de vente HT - Coût matière HT) / Prix de vente HT x 100. Le food cost est le complément : Food cost % = Coût matière HT / Prix de vente HT x 100. Exemple : un soft acheté 0,40 EUR HT et vendu 4 EUR TTC (soit 3,64 EUR HT à 10 % de TVA) affiche un food cost de 11 % et une marge brute de 89 %.",
  },
  {
    question: "Quel coefficient multiplicateur appliquer sur les boissons ?",
    answer:
      "En pratique, les restaurateurs appliquent des coefficients très élevés sur les boissons : x8 à x15 sur le café et les softs, x5 à x6 sur la bière pression, x4 à x5 sur le vin au verre et les cocktails, x3 à x4 sur le vin à la bouteille. Le coefficient se calcule sur le coût d'achat HT et sert à positionner un prix de vente cohérent avec votre gamme et votre zone de chalandise.",
  },
  {
    question: "Quelle marge sur le vin au restaurant ?",
    answer:
      "Le vin se pilote à deux niveaux. Au verre, la marge brute atteint 75 à 82 % (coefficient x4 à x5) : une bouteille achetée 6 EUR donne 6 verres, soit environ 1 EUR de coût par verre vendu 6 EUR. À la bouteille, le pourcentage de marge est plus faible (coefficient x3 à x4) mais la marge en euros est bien supérieure. Beaucoup d'établissements pratiquent une marge additive fixe (par exemple +18 à +22 EUR par bouteille) plutôt qu'un coefficient sur les grands crus.",
  },
  {
    question: "Quelle marge sur la bière au restaurant ?",
    answer:
      "La bière pression est très rentable : un demi de 25 cl coûte 0,50 à 0,80 EUR de matière et se vend 3,50 à 5 EUR, soit un food cost autour de 15 à 20 % (coefficient x5 à x6) et une marge brute de 80 à 85 %. La bière en bouteille est un peu moins margée que la pression car le coût unitaire d'achat est plus élevé, mais elle évite les pertes liées au tirage et au nettoyage des lignes.",
  },
  {
    question: "Pourquoi les boissons sont-elles plus rentables que la nourriture ?",
    answer:
      "Parce que le coût matière d'une boisson est très faible par rapport à son prix de vente, et parce qu'une boisson demande peu de main-d'oeuvre et de transformation. Un café ou un verre de soda ne mobilise ni brigade, ni cuisson, ni fiche technique complexe. La nourriture, elle, supporte un coût matière plus lourd et un temps de préparation élevé. C'est pour cela que les boissons sont le vrai moteur de marge d'un restaurant.",
  },
  {
    question: "Comment la TVA à 20 % sur l'alcool affecte-t-elle la marge ?",
    answer:
      "La TVA n'affecte pas mathématiquement la marge, qui se calcule en HT. Mais l'alcool est soumis à 20 % de TVA contre 10 % pour les softs et la nourriture. À marge HT égale, un verre de vin ou un cocktail est donc mécaniquement plus cher en vitrine qu'un soft. Il faut intégrer cet écart dans votre stratégie de prix et ventiler correctement la part alcool de votre chiffre d'affaires.",
  },
  {
    question: "Quelle marge sur les cocktails ?",
    answer:
      "Un cocktail coûte en général 2 à 3 EUR d'ingrédients (spiritueux, sirops, fruits, glace) et se vend 10 à 14 EUR TTC, soit un food cost autour de 22 à 27 % (coefficient x4 à x5) et une marge brute de 73 à 78 %. C'est un pourcentage plus faible que le café, mais la marge en euros par cocktail est l'une des plus élevées de la carte. La régularité des dosages, via un doseur et des fiches techniques, est la clé pour tenir cette marge.",
  },
  {
    question: "Comment augmenter la marge sur les boissons de mon restaurant ?",
    answer:
      "Cinq leviers principaux : soigner le mix de vente (pousser café, softs et boissons chaudes à forte marge), standardiser les dosages pour éviter la surconsommation, ajuster reguliement les prix face à l'inflation fournisseurs, construire une carte des vins avec une marge additive maîtrisée, et suivre les pertes (casse, tirage, péremption). Un pilotage précis du food cost par boisson, dans un tableau de bord, permet de détecter les dérives avant qu'elles ne pèsent sur le résultat.",
  },
  {
    question: "Quel food cost viser sur les boissons ?",
    answer:
      "Le food cost cible des boissons se situe globalement entre 20 et 25 % tous liquides confondus, contre 28 à 35 % sur la nourriture. Dans le détail : viser 8 à 12 % sur le café et les softs, 15 à 20 % sur la bière, 20 à 25 % sur le vin au verre et 22 à 27 % sur les cocktails. Un food cost boissons global supérieur à 30 % signale un problème de prix, de dosage ou de pertes à corriger.",
  },
  {
    question: "Faut-il calculer la marge des boissons en HT ou en TTC ?",
    answer:
      "Toujours en HT, comme pour la nourriture. La TVA collectée (10 % sur les softs, 20 % sur l'alcool) ne vous appartient pas : vous la reversez à l'État. La calculer dans la marge gonflerait artificiellement votre chiffre d'affaires. Le coût d'achat est lui aussi pris en HT puisque la TVA sur vos achats est récupérable. Marge, food cost et coefficient : tout se raisonne hors taxes.",
  },
];

export default function BlogMargeBoissons() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Marge sur les boissons au restaurant 2026 : café, soft, bière, vin, cocktails"
        description="Quelle marge sur les boissons au restaurant ? Marge brute de 80 à 90 %, coefficients x4 à x15 selon la boisson. Café, softs, bière, vin au verre, cocktails : food cost cible, exemples chiffrés et 7 leviers pour booster votre marge liquide."
        path="/blog/marge-boissons-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Marge sur les boissons', url: 'https://www.restaumargin.fr/blog/marge-boissons-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Quelle marge sur les boissons au restaurant ? Guide complet 2026',
            description:
              "Guide complet de la marge sur les boissons en restauration 2026 : marge brute, food cost et coefficient par boisson (café, soft, bière, vin, cocktails), impact de la TVA à 20 % sur l'alcool et leviers pour maximiser la marge liquide.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-07-06',
            dateModified: '2026-07-06',
            wordCount: 3300,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/marge-boissons-restaurant' },
            citation: [
              { '@type': 'CreativeWork', name: 'UMIH - Union des Métiers et des Industries de l Hôtellerie, référentiel de gestion CHR' },
              { '@type': 'CreativeWork', name: 'GHR - Groupement des Hôtelleries et Restaurations, guides de gestion 2026' },
              { '@type': 'CreativeWork', name: 'INSEE - données sur la consommation hors domicile' },
              { '@type': 'CreativeWork', name: 'Code général des impôts - article 279, taux de TVA en restauration' },
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
          <span className="text-mono-100 font-medium">Marge sur les boissons</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <BlogArticleHero
        category="Marges"
        readTime="16 min"
        date="Juillet 2026"
        title="Quelle marge sur les boissons au restaurant ?"
        accentWord="boissons"
        subtitle="Café, softs, bière, vin au verre, cocktails : pourquoi le liquide est le vrai moteur de rentabilité de votre établissement, quelle marge et quel coefficient viser sur chaque boisson, et comment maximiser cette marge en 2026."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-07-06" updatedDate="2026-07-06" readTime="16 min" variant="header" />

        {/* ── Intro / Featured snippet ── */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-l-4 border-teal-600 rounded-r-2xl p-5 sm:p-6 my-8">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2">Réponse rapide</p>
          <p className="text-base sm:text-lg text-mono-100 leading-relaxed">
            Au restaurant, les boissons offrent les <strong>marges les plus élevées</strong> : environ <strong>80 à 90 % de marge brute</strong> contre 65 à 75 % sur la nourriture. Un café ou un soft affiche un coefficient de <strong>x8 à x15</strong> (food cost 8 à 12 %), une bière pression <strong>x5 à x6</strong>, un verre de vin <strong>x4 à x5</strong> et un cocktail <strong>x4 à x5</strong>. Les boissons sont donc le vrai moteur de rentabilité d'un établissement, à condition de les piloter en HT et de maîtriser les dosages.
          </p>
        </div>

        {/* ── Encadre chiffres cles ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Les marges à retenir</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">Marge brute par type de boisson</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold min-w-[92px]">Café / softs</span>
              <span>Marge brute <strong className="text-white">88 à 92 %</strong> - food cost 8 à 12 % - coefficient x8 à x15</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold min-w-[92px]">Bière</span>
              <span>Marge brute <strong className="text-white">80 à 85 %</strong> - food cost 15 à 20 % - coefficient x5 à x6</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold min-w-[92px]">Vin au verre</span>
              <span>Marge brute <strong className="text-white">75 à 82 %</strong> - food cost 18 à 25 % - coefficient x4 à x5</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold min-w-[92px]">Cocktails</span>
              <span>Marge brute <strong className="text-white">73 à 78 %</strong> - food cost 22 à 27 % - coefficient x4 à x5</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Toutes ces valeurs se raisonnent en HT. Le pourcentage de marge est un indicateur ; la marge en euros par vente compte tout autant pour votre résultat.
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
              { href: '#moteur', label: 'Pourquoi les boissons sont le moteur de marge du restaurant' },
              { href: '#base', label: 'Marge brute, food cost et coefficient : la base en HT' },
              { href: '#softs', label: 'La marge sur les softs (sodas, jus, eaux)' },
              { href: '#cafe', label: 'La marge sur le café et le thé : le champion caché' },
              { href: '#biere', label: 'La marge sur la bière : pression vs bouteille' },
              { href: '#vin', label: 'La marge sur le vin : au verre vs à la bouteille' },
              { href: '#cocktails', label: 'La marge sur les cocktails et spiritueux' },
              { href: '#tableau', label: 'Tableau recap : coefficient et food cost par boisson' },
              { href: '#tva', label: 'TVA à 20 % sur l alcool : l impact sur le prix affiché' },
              { href: '#leviers', label: '7 leviers pour augmenter la marge de vos boissons' },
              { href: '#erreurs', label: 'Les erreurs qui plombent la marge boissons' },
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
          {/* ═════════ SECTION 1 : Moteur de marge ═════════ */}
          <section id="moteur" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <TrendingUp className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Pourquoi les boissons sont le moteur de marge du restaurant</h2>
            </div>
            <p>
              Beaucoup de restaurateurs concentrent toute leur attention sur l'assiette, alors que la vraie rentabilité se joue souvent dans le verre. La raison est simple : <strong>le coût matière d'une boisson est très faible</strong> par rapport à son prix de vente, et sa préparation ne mobilise ni brigade, ni cuisson, ni fiche technique complexe. Un café ne demande pas de temps de cuisson, un soda ne se dégrade pas comme un produit frais, et un verre de vin se sert en quelques secondes.
            </p>
            <p>
              Concrètement, la marge brute sur les boissons atteint couramment <strong>80 à 90 %</strong>, quand la nourriture plafonne autour de <strong>65 à 75 %</strong>. Sur un ticket moyen, un café et un soft ajoutés à la fin du repas peuvent doubler la marge en euros du client, sans quasiment aucun coût supplémentaire. C'est pourquoi les établissements les plus rentables ne sont pas forcément ceux qui vendent les plats les plus chers, mais ceux qui <strong>maîtrisent le mix de vente boissons</strong>.
            </p>
            <p>
              Cette mécanique explique une règle bien connue du secteur : un café offert peut coûter 0,20 EUR au restaurateur mais fidéliser un client qui reviendra consommer un repas complet à plusieurs dizaines d'euros. La boisson est un formidable levier de marge, mais aussi un outil relationnel. Encore faut-il la piloter avec la même rigueur que la carte, en raisonnant en HT et en suivant le <Link to="/blog/reduire-food-cost" className="text-teal-700 font-semibold hover:underline">food cost</Link> de chaque référence.
            </p>
          </section>

          {/* ═════════ SECTION 2 : La base en HT ═════════ */}
          <section id="base" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Scale className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Marge brute, food cost et coefficient : la base en HT</h2>
            </div>
            <p>
              Avant d'entrer dans le détail par boisson, posons les trois indicateurs clés. Ils se calculent tous <strong>hors taxes</strong>, car la TVA que vous collectez ne vous appartient pas et la TVA sur vos achats est récupérable.
            </p>
            <ul>
              <li><strong>Food cost (coût matière)</strong> = Coût d'achat HT / Prix de vente HT x 100. C'est le pourcentage de votre prix consacré à la matière.</li>
              <li><strong>Marge brute</strong> = 100 - food cost. C'est ce qui reste pour couvrir les charges et dégager du bénéfice.</li>
              <li><strong>Coefficient multiplicateur</strong> = Prix de vente / Coût d'achat. Un café acheté 0,20 EUR et vendu 2 EUR HT à un coefficient de x10.</li>
            </ul>
            <p>
              Prenons un exemple concret et complet. Un soft en canette est acheté <strong>0,40 EUR HT</strong> et vendu <strong>4 EUR TTC</strong>. Comme la TVA sur un soft est de 10 %, le prix de vente HT est de 4 / 1,10 = <strong>3,64 EUR HT</strong>. Le food cost est donc de 0,40 / 3,64 = <strong>11 %</strong>, la marge brute de <strong>89 %</strong>, et le coefficient d'environ x9 sur le coût d'achat.
            </p>
            <div className="bg-teal-50 border-l-4 border-teal-500 rounded-r-2xl p-5 my-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="m-0 text-mono-100">
                  <strong>Attention au piège de l'alcool :</strong> pour une boisson alcoolisée vendue TTC, divisez par 1,20 (TVA 20 %) et non par 1,10 pour obtenir le prix HT. Mélanger les taux fausse le calcul. Pour tout comprendre, voir notre guide <Link to="/blog/tva-restaurant" className="text-teal-700 font-semibold hover:underline">TVA restaurant 2026</Link>.
                </p>
              </div>
            </div>
            <p>
              Le coefficient multiplicateur reste l'outil le plus rapide pour fixer un prix. Sur les boissons, il est bien plus élevé que sur la nourriture : là où un plat tourne autour de x3 à x4, une boisson chaude ou un soft peut atteindre x10 à x15. Pour approfondir la méthode, consultez notre article dédié au <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 font-semibold hover:underline">coefficient multiplicateur en restauration</Link>.
            </p>
          </section>

          {/* ═════════ SECTION 3 : Softs ═════════ */}
          <section id="softs" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <CupSoda className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">La marge sur les softs (sodas, jus, eaux)</h2>
            </div>
            <p>
              Les boissons sans alcool sont, avec le café, les championnes de la marge. Un <strong>soda en canette de 33 cl</strong> est acheté entre 0,35 et 0,55 EUR HT et se vend entre 3,50 et 4,50 EUR TTC. Cela donne un food cost de <strong>10 à 14 %</strong> et une marge brute proche de <strong>88 %</strong>. Même constat pour les jus de fruits et les eaux minérales, ou l'eau plate en bouteille, dont le coût d'achat est dérisoire face au prix affiché.
            </p>
            <p>
              Deux points d'attention pour protéger cette marge. D'abord, l'eau : proposer une <strong>eau du robinet gratuite</strong> est une obligation, mais mettre en avant une carte d'eaux minérales et pétillantes soignée génère une marge importante sans effort de service. Ensuite, les softs au verre (sirops, limonades maison) offrent un coût matière encore plus bas que les canettes, mais demandent une régularité de dosage pour ne pas rogner la marge.
            </p>
            <p>
              Les softs sont soumis à la <strong>TVA à 10 %</strong>, comme la nourriture consommée sur place, et non à 20 %. C'est un avantage : à marge HT égale, un soft est moins cher en vitrine qu'une boisson alcoolisée, ce qui facilite la vente additionnelle. Pensez à bien les intégrer dans votre <Link to="/blog/menu-engineering-boston-matrix" className="text-teal-700 font-semibold hover:underline">menu engineering</Link> pour les mettre en avant au bon endroit de la carte.
            </p>
          </section>

          {/* ═════════ SECTION 4 : Cafe ═════════ */}
          <section id="cafe" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Coffee className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">La marge sur le café et le thé : le champion caché</h2>
            </div>
            <p>
              Le café est la boisson la plus rentable de toute la carte, et pourtant la plus sous-estimée. Un <strong>expresso</strong> mobilise environ 7 grammes de café. À un prix d'achat de 20 à 30 EUR le kilo de grain, cela représente <strong>0,15 à 0,25 EUR</strong> de matière, énergie et eau comprises. Vendu 2 à 2,50 EUR, il affiche un food cost de <strong>8 à 12 %</strong>, une marge brute de <strong>90 %</strong> et un coefficient qui grimpe à x10, voire x15.
            </p>
            <p>
              Le thé est logiquement dans la même catégorie : un sachet ou une dose de thé en vrac coûte quelques centimes et se vend 3 à 4,50 EUR. Les <strong>boissons chaudes</strong> sont donc un formidable relais de marge, surtout en fin de repas ou hors des heures de service classiques (petit-déjeuner, pause de l'après-midi).
            </p>
            <div className="bg-teal-50 border-l-4 border-teal-500 rounded-r-2xl p-5 my-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="m-0 text-mono-100">
                  <strong>Le levier du café gourmand :</strong> associer un expresso (coût 0,20 EUR) à trois mini-desserts (coût 1,50 EUR) et le vendre 7 à 9 EUR reste très margée tout en augmentant le ticket moyen. C'est l'un des meilleurs rapports marge / satisfaction de la restauration.
                </p>
              </div>
            </div>
            <p>
              Attention toutefois : la qualité du café est devenue un critère de réputation. Économiser 0,05 EUR sur un grain bas de gamme pour ruiner l'expérience de fin de repas est une fausse économie. La marge sur le café est tellement confortable qu'elle laisse la place à un produit de qualité tout en restant très rentable.
            </p>
          </section>

          {/* ═════════ SECTION 5 : Biere ═════════ */}
          <section id="biere" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Beer className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">La marge sur la bière : pression vs bouteille</h2>
            </div>
            <p>
              La bière est un pilier de marge, surtout en pression. Un <strong>demi de 25 cl</strong> tire d'un fût coûte environ <strong>0,50 à 0,80 EUR</strong> de matière et se vend 3,50 à 5 EUR TTC. En HT (TVA 20 %, car alcool), cela donne un prix d'environ 2,90 à 4,15 EUR et un food cost de <strong>15 à 20 %</strong>, soit une marge brute de 80 à 85 % et un coefficient de x5 à x6.
            </p>
            <p>
              La <strong>bière en bouteille</strong> à un coût d'achat unitaire plus élevé (0,60 à 1,20 EUR selon la référence) et une marge en pourcentage un peu plus faible que la pression. En revanche, elle évite les pertes liées au tirage, au réglage du col de mousse et au nettoyage des lignes. Le choix entre pression et bouteille est donc autant une question de marge que de gestion des pertes et de positionnement (bière artisanale, importée, etc.).
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-5 my-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="m-0 text-mono-100">
                  <strong>Le poste de perte à surveiller :</strong> sur la pression, le col de mousse trop généreux, les fonds de fût mal gérés et les verres offerts non tracés peuvent faire grimper le food cost réel bien au-dessus de 20 %. Un suivi des fais (pertes) par fût est indispensable pour ne pas confondre marge théorique et marge réelle.
                </p>
              </div>
            </div>
          </section>

          {/* ═════════ SECTION 6 : Vin ═════════ */}
          <section id="vin" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Wine className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">La marge sur le vin : au verre vs à la bouteille</h2>
            </div>
            <p>
              Le vin se pilote à deux niveaux, avec deux logiques de marge très différentes.
            </p>
            <h3 className="text-lg font-bold text-mono-100 mt-6 mb-2">Le vin au verre : le pourcentage le plus rentable</h3>
            <p>
              Une bouteille de 75 cl permet de servir environ <strong>6 verres de 12,5 cl</strong>. Une bouteille achetée 6 EUR HT revient donc à <strong>1 EUR de coût par verre</strong>. Vendu 6 EUR TTC (5 EUR HT), ce verre affiche un food cost de <strong>20 %</strong>, une marge brute de 80 % et un coefficient d'environ x5. Le vin au verre est donc l'une des meilleures armes de marge de la carte, à condition de respecter le dosage : un verre trop généreux fait fondre la marge instantanément.
            </p>
            <h3 className="text-lg font-bold text-mono-100 mt-6 mb-2">Le vin à la bouteille : la marge en euros</h3>
            <p>
              À la bouteille, le pourcentage de marge est plus faible (coefficient x3 à x4), mais la <strong>marge en euros est bien supérieure</strong>. Une bouteille achetée 8 EUR et vendue 26 EUR TTC dégage une marge brute d'environ 18 EUR sur une seule vente. Beaucoup d'établissements pratiquent d'ailleurs une <strong>marge additive fixe</strong> sur les grands crus (par exemple +18 à +25 EUR par bouteille) plutôt qu'un coefficient, pour ne pas afficher des prix dissuasifs sur les références chères.
            </p>
            <p>
              La construction d'une carte des vins est un art à part entière : il faut équilibrer les références d'appel à forte rotation, les valeurs sûres à marge confortable et quelques belles bouteilles à marge en euros élevée. Notre guide dédié à la <Link to="/blog/construire-carte-vins-restaurant" className="text-teal-700 font-semibold hover:underline">construction d'une carte des vins rentable</Link> détaille cette stratégie.
            </p>
          </section>

          {/* ═════════ SECTION 7 : Cocktails ═════════ */}
          <section id="cocktails" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Martini className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">La marge sur les cocktails et spiritueux</h2>
            </div>
            <p>
              Les cocktails ont un pourcentage de marge un peu plus faible que le café, mais une <strong>marge en euros parmi les plus élevées de la carte</strong>. Un cocktail coûte en général <strong>2 à 3 EUR</strong> d'ingrédients (spiritueux, sirops, jus, fruits frais, glace) et se vend 10 à 14 EUR TTC. En HT (TVA 20 %), cela donne un food cost de <strong>22 à 27 %</strong>, une marge brute de 73 à 78 % et un coefficient de x4 à x5.
            </p>
            <p>
              Les <strong>spiritueux au verre</strong> (whisky, rhum, gin) sont eux très rentables : une dose de 4 cl issue d'une bouteille de 70 cl (soit environ 17 doses) revient à un coût unitaire faible, pour un prix de vente élevé. La clé de la marge sur les alcools forts est la <strong>régularité du dosage</strong> : un doseur, une balance ou des fiches techniques strictes évitent la surconsommation qui ronge la marge sans que le client le remarque.
            </p>
            <div className="bg-teal-50 border-l-4 border-teal-500 rounded-r-2xl p-5 my-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="m-0 text-mono-100">
                  <strong>Standardisez chaque recette de cocktail</strong> comme une fiche technique de cuisine : quantités exactes, coût matière calculé, prix de vente cible. Un cocktail servi à l'oeil peut passer de 25 % à 40 % de food cost sans que personne ne s'en aperçoive avant l'inventaire.
                </p>
              </div>
            </div>
          </section>

          {/* ═════════ SECTION 8 : Tableau recap ═════════ */}
          <section id="tableau" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <GlassWater className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Tableau recap : coefficient et food cost par boisson</h2>
            </div>
            <p>
              Voici une synthèse des ordres de grandeur observés en restauration française en 2026. Ces valeurs sont indicatives : elles varient selon votre positionnement, votre zone et vos fournisseurs. Elles donnent néanmoins des repères fiables pour construire vos prix.
            </p>
            <div className="overflow-x-auto my-6">
              <table className="text-sm sm:text-base">
                <thead className="bg-mono-1000">
                  <tr>
                    <th className="text-left p-3 font-bold text-mono-100">Boisson</th>
                    <th className="text-left p-3 font-bold text-mono-100">Coût matière HT</th>
                    <th className="text-left p-3 font-bold text-mono-100">Prix vente TTC</th>
                    <th className="text-left p-3 font-bold text-mono-100">Food cost</th>
                    <th className="text-left p-3 font-bold text-mono-100">Coefficient</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 font-semibold">Expresso</td>
                    <td className="p-3">0,20 EUR</td>
                    <td className="p-3">2,20 EUR</td>
                    <td className="p-3 text-teal-700 font-semibold">8 à 12 %</td>
                    <td className="p-3">x10 à x15</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Soft / canette 33 cl</td>
                    <td className="p-3">0,40 EUR</td>
                    <td className="p-3">4,00 EUR</td>
                    <td className="p-3 text-teal-700 font-semibold">10 à 14 %</td>
                    <td className="p-3">x8 à x10</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Eau minérale 50 cl</td>
                    <td className="p-3">0,45 EUR</td>
                    <td className="p-3">3,50 EUR</td>
                    <td className="p-3 text-teal-700 font-semibold">12 à 15 %</td>
                    <td className="p-3">x7 à x8</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Bière pression 25 cl</td>
                    <td className="p-3">0,65 EUR</td>
                    <td className="p-3">4,00 EUR</td>
                    <td className="p-3 text-teal-700 font-semibold">15 à 20 %</td>
                    <td className="p-3">x5 à x6</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Vin au verre 12,5 cl</td>
                    <td className="p-3">1,00 EUR</td>
                    <td className="p-3">6,00 EUR</td>
                    <td className="p-3 text-teal-700 font-semibold">18 à 25 %</td>
                    <td className="p-3">x4 à x5</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Vin bouteille 75 cl</td>
                    <td className="p-3">8,00 EUR</td>
                    <td className="p-3">26,00 EUR</td>
                    <td className="p-3 text-teal-700 font-semibold">30 à 40 %</td>
                    <td className="p-3">x3 à x4</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Cocktail</td>
                    <td className="p-3">2,50 EUR</td>
                    <td className="p-3">12,00 EUR</td>
                    <td className="p-3 text-teal-700 font-semibold">22 à 27 %</td>
                    <td className="p-3">x4 à x5</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              La lecture de ce tableau confirme une hiérarchie claire : le café et les softs sont les rois du pourcentage de marge, le vin à la bouteille et les cocktails sont les rois de la marge en euros. Un bon pilotage joue sur les deux tableaux, en surveillant le <strong>food cost boissons global</strong>, qui doit rester entre 20 et 25 % tous liquides confondus.
            </p>
          </section>

          {/* ═════════ SECTION 9 : TVA ═════════ */}
          <section id="tva" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Percent className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">TVA à 20 % sur l'alcool : l'impact sur le prix affiché</h2>
            </div>
            <p>
              Toutes les boissons ne sont pas soumises au même taux de TVA, et cela change la donne pour votre prix affiché. Les <strong>boissons sans alcool</strong> (softs, café, thé, jus, eaux) consommées immédiatement relèvent de la <strong>TVA à 10 %</strong>. Les <strong>boissons alcoolisées</strong> (vin, bière, cocktails, spiritueux) sont, elles, soumises au taux normal de <strong>20 %</strong>, quel que soit le mode de consommation.
            </p>
            <p>
              Mathématiquement, la TVA ne change pas votre marge, qui se calcule en HT. Mais elle change le <strong>prix TTC que voit le client</strong>. À marge HT identique, une boisson alcoolisée supporte 20 % de TVA contre 10 % pour un soft : elle est donc mécaniquement plus chère en vitrine. C'est un paramètre à intégrer dans votre stratégie de prix, particulièrement sur la carte des vins et des cocktails.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl p-5 my-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="m-0 text-mono-100">
                  <strong>L'obligation de ventilation :</strong> si vous ne séparez pas la part alcool (20 %) de la part sans alcool (10 %) dans votre chiffre d'affaires, l'administration peut appliquer le taux le plus élevé sur l'ensemble de vos recettes. Un logiciel de caisse bien paramétré est indispensable. Tout est détaillé dans notre guide <Link to="/blog/tva-restaurant" className="text-teal-700 font-semibold hover:underline">TVA restaurant 2026</Link>.
                </p>
              </div>
            </div>
            <p>
              En résumé : raisonnez toujours vos marges en HT, mais gardez un oeil sur le prix TTC final. Un cocktail à 20 % de TVA doit rester cohérent avec la perception de valeur de votre clientèle, sous peine de freiner la vente malgré une excellente marge théorique.
            </p>
          </section>

          {/* ═════════ SECTION 10 : Leviers ═════════ */}
          <section id="leviers" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <Lightbulb className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">7 leviers pour augmenter la marge de vos boissons</h2>
            </div>
            <p>
              La marge sur les boissons est déjà confortable, mais elle laisse beaucoup de gains à portée de main. Voici sept leviers concrets, du plus rapide au plus structurant.
            </p>
            <ol>
              <li><strong>Soigner le mix de vente.</strong> Poussez les boissons à plus forte marge (café, softs, boissons chaudes) via la suggestion du personnel et la place sur la carte. Une hausse de quelques points du taux d'attachement boissons a un impact direct sur le résultat.</li>
              <li><strong>Standardiser les dosages.</strong> Doseurs, verres calibrés, fiches techniques de cocktails : la surconsommation invisible est l'ennemi numéro un de la marge liquide.</li>
              <li><strong>Ajuster les prix face à l'inflation.</strong> Les tarifs fournisseurs bougent. Réévaluez vos prix de vente au moins deux fois par an pour ne pas subir la hausse des coûts d'achat.</li>
              <li><strong>Construire une carte des vins à marge additive maîtrisée.</strong> Utilisez une marge en euros fixe sur les références chères et un coefficient sur les vins d'appel.</li>
              <li><strong>Suivre les pertes.</strong> Casse, fonds de fût, péremption des jus frais, verres offerts non tracés : chaque perte non suivie gonfle le food cost réel.</li>
              <li><strong>Créer des offres à forte marge.</strong> Café gourmand, formule boisson + plat, happy hour cible sur les liquides margée : autant de leviers d'augmentation du ticket moyen.</li>
              <li><strong>Piloter le food cost par boisson.</strong> Suivez chaque référence dans un tableau de bord pour repérer immédiatement une dérive avant qu'elle ne pèse sur le résultat.</li>
            </ol>
            <p>
              Ces leviers ne demandent pas d'investissement lourd : ils reposent sur la <strong>rigueur de pilotage</strong>. C'est précisément ce que permet un outil qui calcule le food cost de chaque boisson, croise les coûts d'achat en HT et alerte sur les dérives. Pour aller plus loin sur la mécanique des prix, voir aussi notre guide sur la <Link to="/blog/prix-de-vente-restaurant" className="text-teal-700 font-semibold hover:underline">fixation du prix de vente d'un plat</Link>.
            </p>
          </section>

          {/* ═════════ SECTION 11 : Erreurs ═════════ */}
          <section id="erreurs" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">Les erreurs qui plombent la marge boissons</h2>
            </div>
            <p>Malgré une marge théorique confortable, plusieurs erreurs fréquentes rongent la rentabilité réelle des boissons :</p>
            <ul>
              <li><strong>Calculer la marge en TTC :</strong> l'erreur de gestion la plus courante. Mélanger 10 % (softs) et 20 % (alcool) sans passer en HT fausse tous les ratios.</li>
              <li><strong>Servir à l'oeil :</strong> un verre de vin trop plein, un cocktail sans doseur, un demi mal tiré : la surconsommation invisible peut ajouter 5 à 15 points de food cost.</li>
              <li><strong>Ne pas actualiser les prix :</strong> garder les mêmes tarifs pendant deux ans face à une inflation fournisseurs continue, c'est laisser filer la marge sans s'en rendre compte.</li>
              <li><strong>Négliger les pertes :</strong> fonds de fût, casse, jus frais périmés, offerts non tracés. La marge théorique et la marge réelle divergent vite sans suivi.</li>
              <li><strong>Sous-exploiter le café et les softs :</strong> ne pas proposer systématiquement une boisson chaude ou un soft en fin de repas, c'est passer à côté de la marge la plus facile de la maison.</li>
              <li><strong>Oublier de ventiler la TVA :</strong> risque fiscal réel, avec application possible du taux le plus élevé sur l'ensemble des recettes.</li>
            </ul>
            <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 my-8">
              <p className="m-0 text-sm text-mono-350">
                <strong className="text-mono-100">Bon à savoir :</strong> les coûts d'achat, prix de vente et pourcentages présentés dans cet article sont des ordres de grandeur observés en restauration française en 2026. Ils varient selon votre positionnement, votre zone de chalandise et vos fournisseurs. Utilisez-les comme repères, mais calculez toujours vos propres ratios à partir de vos factures réelles.
              </p>
            </div>
          </section>

          {/* ═════════ FAQ ═════════ */}
          <section id="faq" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <BookOpen className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 m-0">FAQ : 12 questions fréquentes sur la marge des boissons</h2>
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
              <li>- <strong>UMIH</strong> : Union des Métiers et des Industries de l'Hôtellerie - référentiel de gestion du secteur CHR</li>
              <li>- <strong>GHR</strong> : Groupement des Hôtelleries et Restaurations - guides de gestion 2026</li>
              <li>- <strong>INSEE</strong> : données sur la consommation hors domicile et les prix à la consommation</li>
              <li>- <strong>Code général des impôts</strong> : article 279 - taux de TVA applicable en restauration</li>
            </ul>
            <p className="text-xs text-mono-500 mt-4 italic">
              Article rédigé par la rédaction RestauMargin. Publié le 6 juillet 2026. Notre méthodologie : croisement des référentiels de gestion du secteur CHR et des retours terrain de restaurateurs accompagnés par RestauMargin. Les valeurs chiffrées sont indicatives et ne remplacent pas le calcul de vos propres ratios à partir de vos factures.
            </p>
          </section>

          <BlogAuthor publishedDate="2026-07-06" updatedDate="2026-07-06" readTime="16 min" variant="footer" />
        </article>
      </main>

      {/* ── CTA final ── */}
      <section className="bg-gradient-to-br from-teal-50 to-emerald-50 py-14 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 mb-3 font-satoshi">
            Pilote la marge de chaque boisson en HT, sans tableur
          </h2>
          <p className="text-mono-500 mb-6">
            RestauMargin calcule le food cost de vos softs, cafés, bières, vins et cocktails, croise vos coûts d'achat en HT, ventile la TVA et détecte les dérives de marge. Le liquide devient enfin un moteur de rentabilité piloté.
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
