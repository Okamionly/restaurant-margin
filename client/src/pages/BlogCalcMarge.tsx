import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Users, Pizza, Beef, Zap, Award, ListChecks, Sparkles } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Comment calculer la marge de votre restaurant en 2026"
   Mot-clé principal : calcul marge restaurant
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost ideal pour un restaurant ?',
    answer: "Le food cost ideal depend de votre type de restaurant. En regle generale, il se situe entre 25 % et 35 %. Une pizzeria peut viser 22-25 %, un restaurant gastronomique acceptera 35-40 %. L'essentiel est qu'il soit coherent avec votre structure de charges globale.",
  },
  {
    question: "Comment calculer la marge brute d'un plat ?",
    answer: "Soustrayez le cout total des ingredients du prix de vente HT du plat. Par exemple, si un plat se vend 18 EUR et que les ingredients coutent 5,40 EUR, la marge brute est de 12,60 EUR, soit 70 %. Formule : Marge brute (%) = (Prix de vente - Cout matieres) / Prix de vente x 100.",
  },
  {
    question: 'Quelle est la difference entre marge brute et marge nette ?',
    answer: 'La marge brute ne deduit que le cout des matieres premieres (food cost). La marge nette deduit en plus toutes les charges : personnel, loyer, energie, assurances, taxes, amortissements. La marge brute en restauration tourne autour de 65-75 % tandis que la marge nette se situe entre 5 et 15 %.',
  },
  {
    question: 'A quelle frequence faut-il recalculer ses marges ?',
    answer: "Idealement chaque semaine pour le food cost global, et a chaque changement de prix fournisseur pour les fiches techniques individuelles. Les variations de prix sur les produits frais peuvent etre rapides. Un outil comme RestauMargin automatise ce suivi en continu.",
  },
  {
    question: 'Comment calculer le coefficient multiplicateur en restauration ?',
    answer: "Le coefficient multiplicateur se calcule en divisant le prix de vente HT par le cout matieres. Inversement : Coefficient = 1 / Food cost cible. Pour un food cost cible de 30 %, le coefficient est de 3,33. Multipliez votre cout matiere par ce coefficient pour obtenir le prix de vente HT.",
  },
  {
    question: 'Quel est le ratio personnel ideal en restauration ?',
    answer: "Le ratio personnel (masse salariale / chiffre d'affaires) se situe idealement entre 30 % et 40 % en restauration traditionnelle. En ajoutant le food cost (25-35 %), ces deux postes representent le prime cost qui ne devrait pas depasser 65-70 % du CA pour garantir une marge nette viable.",
  },
  {
    question: 'Faut-il calculer sa marge en HT ou en TTC ?',
    answer: "Toujours en HT (hors taxes). La TVA collectee ne vous appartient pas, elle est reversee a l'Etat. Calculer votre food cost sur un prix TTC donnerait un ratio artificiellement bas et fausserait votre analyse. En France, la TVA en restauration sur place est de 10 %.",
  },
  {
    question: 'Comment ameliorer sa marge sans augmenter les prix ?',
    answer: "Plusieurs leviers : optimiser les portions avec des fiches techniques precises, negocier les fournisseurs, reduire le gaspillage (FIFO, pesee des dechets), utiliser le menu engineering pour promouvoir les plats a forte marge, substituer certains ingredients sans sacrifier la qualite. RestauMargin identifie ces opportunites automatiquement.",
  },
];

export default function BlogCalcMarge() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Calcul marge restaurant : guide complet 2026 + formule"
        description="Comment calculer la marge de votre restaurant pas a pas : food cost, coefficient multiplicateur, marge brute et nette. Methodes, exemples chiffres et outils gratuits."
        path="/blog/calcul-marge-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Calcul marge restaurant', url: 'https://www.restaumargin.fr/blog/calcul-marge-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment calculer la marge de votre restaurant en 5 etapes',
            description: 'Methode pas-a-pas pour calculer la marge brute et le food cost d\'un plat de restaurant.',
            totalTime: 'PT15M',
            tool: ['Balance de cuisine', 'Calculatrice', 'Tableur ou logiciel RestauMargin'],
            step: [
              { '@type': 'HowToStep', name: 'Lister les ingredients et grammages', text: 'Listez chaque ingredient du plat avec sa quantite exacte en grammes. Pesez systematiquement plutot que d\'estimer.' },
              { '@type': 'HowToStep', name: 'Calculer le cout matieres total', text: 'Pour chaque ingredient, multipliez le grammage par le prix au gramme. Additionnez pour obtenir le cout matieres total.' },
              { '@type': 'HowToStep', name: 'Calculer le food cost', text: 'Divisez le cout matieres par le prix de vente HT, multipliez par 100. Resultat exprime en pourcentage.' },
              { '@type': 'HowToStep', name: 'Calculer la marge brute', text: 'Soustrayez le cout matieres du prix de vente HT pour obtenir la marge brute en euros, ou utilisez la formule (PV - CM) / PV x 100 pour le pourcentage.' },
              { '@type': 'HowToStep', name: 'Comparer aux benchmarks', text: 'Comparez votre food cost a la fourchette cible de votre type de restaurant (25-35 % en moyenne) et ajustez prix ou portions si besoin.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Comment calculer la marge de votre restaurant en 2026',
            description: 'Guide complet du calcul de marge restaurant : marge brute, marge nette, food cost. Formules, exemples chiffres et tableau par type de restaurant.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-14',
            dateModified: '2026-04-27',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/calcul-marge-restaurant' },
          },
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
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
            <Link
              to="/login"
              className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumbs visibles ── */}
      <div className="bg-[#FAFAFA] border-b border-[#E5E7EB] py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-[#737373] flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">Calcul marge restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <header className="bg-gradient-to-b from-teal-50 to-white pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-teal-700 bg-teal-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Guide complet 2026
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] leading-tight mb-6">
            Comment calculer la marge <br className="hidden sm:block" />
            de votre restaurant en 2026
          </h1>
          <p className="text-lg text-[#525252] max-w-2xl mx-auto leading-relaxed">
            Le calcul de marge restaurant est la clef de voute de votre rentabilite.
            Decouvrez les formules, les benchmarks par type d'etablissement, les cas pratiques
            chiffres et les erreurs qui plombent vos benefices.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-[#737373]">
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Par l'equipe RestauMargin</span>
            <span>|</span>
            <span>Mis a jour : avril 2026</span>
            <span>|</span>
            <span>15 min de lecture</span>
          </div>
        </div>
      </header>

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">

        <BlogAuthor publishedDate="2026-04-14" readTime="15 min" variant="header" />

        {/* ── Encadre formule rapide (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formule rapide marge restaurant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            La formule essentielle a retenir
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost (%)</strong> = (Cout matieres / Prix de vente HT) x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Marge brute (%)</strong> = 100 - Food cost</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Coefficient multiplicateur</strong> = Prix de vente / Cout matieres</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Marge nette (%)</strong> = (Resultat net / CA) x 100</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectif standard restauration : food cost entre 25 % et 35 %, marge brute entre 65 % et 75 %, marge nette entre 5 % et 15 %.
          </p>
        </div>

        {/* ── Table des matieres ── */}
        <nav className="my-12 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-[#404040]">
            {[
              { href: '#pourquoi', label: 'Pourquoi la marge est critique pour votre restaurant' },
              { href: '#trois-marges', label: 'Les 3 types de marges a connaitre' },
              { href: '#howto', label: 'Comment calculer la marge en 5 etapes' },
              { href: '#brute-vs-nette', label: 'Marge brute vs marge nette : la difference' },
              { href: '#formules', label: 'Formules de calcul avec exemples chiffres' },
              { href: '#cas-pizza', label: 'Cas pratique chiffre : pizza margherita' },
              { href: '#cas-entrecote', label: 'Cas pratique chiffre : entrecote grillee' },
              { href: '#benchmarks', label: 'Benchmarks marge brute par type de restaurant' },
              { href: '#food-cost-tableau', label: 'Tableau du food cost par type de restaurant' },
              { href: '#erreurs', label: 'Les 5 erreurs courantes qui detruisent votre marge' },
              { href: '#automatiser', label: 'Comment RestauMargin automatise le calcul' },
              { href: '#faq', label: 'Questions frequentes' },
              { href: '#cta', label: 'Calculez votre marge gratuitement' },
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

        {/* ═════════════ SECTION 1 : Introduction ═════════════ */}
        <section id="pourquoi" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Pourquoi la marge est critique pour votre restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Dans la restauration, la difference entre un etablissement rentable et un etablissement
              qui ferme ses portes se joue souvent a quelques points de marge. Selon les chiffres de
              l'INSEE, pres de 30 % des restaurants ferment dans les trois premieres annees. La cause
              numero un ? Une mauvaise maitrise des couts et, par extension, du calcul de marge restaurant.
            </p>
            <p>
              Votre marge, c'est ce qui reste une fois que vous avez paye vos matieres premieres,
              votre personnel, votre loyer et toutes vos charges. C'est votre oxygene financier.
              Sans un suivi rigoureux, vous naviguez a l'aveugle — et les mauvaises surprises
              arrivent toujours au pire moment : hausse du prix du beurre, augmentation du SMIC,
              inflation sur l'energie.
            </p>
            <p>
              En 2026, la pression est plus forte que jamais. L'inflation alimentaire a cumule
              plus de 20 % sur trois ans. Les salaires minimums ont ete revalorises plusieurs fois.
              Les couts energetiques restent volatils. Dans ce contexte, maitriser le calcul de marge
              de votre restaurant n'est plus un luxe : c'est une question de survie.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Un restaurant qui ameliore son food cost de seulement
              2 points (par exemple de 32 % a 30 %) sur un chiffre d'affaires de 500 000 EUR gagne
              10 000 EUR de benefice net supplementaire par an.
            </Callout>

            <p>
              Ce guide vous donne toutes les formules, les benchmarks et les outils pour reprendre
              le controle de vos marges. Que vous dirigiez un bistrot, une brasserie ou un restaurant
              gastronomique, les principes sont les memes — seuls les ratios cibles different.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Les 3 types de marges ═════════════ */}
        <section id="trois-marges" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="2">
            Les 3 types de marges a connaitre
          </SectionHeading>

          <div className="prose-content">
            <p>
              Quand on parle de "marge" en restauration, on melange souvent trois notions differentes.
              Chacune repond a une question precise et vous donne une vision complementaire de votre
              rentabilite. Voici les trois indicateurs que tout restaurateur doit maitriser.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mt-8">
            <MargeCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Marge brute"
              color="emerald"
              desc="C'est la difference entre votre chiffre d'affaires et le cout des matieres premieres. Elle mesure votre capacite a transformer des ingredients en valeur. C'est le premier indicateur a surveiller au quotidien."
              formula="CA - Cout matieres"
              target="65 % a 75 %"
            />
            <MargeCard
              icon={<Percent className="w-6 h-6" />}
              title="Cout matiere (Food Cost)"
              color="amber"
              desc="Le ratio entre le cout de vos ingredients et votre prix de vente. C'est l'indicateur le plus utilise dans la profession. Un food cost maitrise signifie des achats optimises et des fiches techniques respectees."
              formula="Cout ingredients / Prix de vente x 100"
              target="25 % a 35 %"
            />
            <MargeCard
              icon={<Target className="w-6 h-6" />}
              title="Marge nette"
              color="blue"
              desc="Ce qui reste reellement dans votre poche apres toutes les charges : matieres, personnel, loyer, energie, assurances, impots. C'est la mesure ultime de votre rentabilite globale."
              formula="CA - Toutes charges"
              target="5 % a 15 %"
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              La marge brute et le food cost sont les deux faces d'une meme piece : si votre food cost
              est de 30 %, votre marge brute est automatiquement de 70 %. La marge nette, elle, integre
              tout le reste — c'est pourquoi elle est nettement plus basse.
            </p>
            <p>
              Attention a ne pas confondre ces trois indicateurs. Un restaurant peut avoir un excellent
              food cost (28 %) mais une marge nette catastrophique (2 %) si ses charges de personnel
              ou son loyer sont demesures. Le calcul de marge restaurant doit donc toujours etre
              multi-dimensionnel.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION HOWTO : 5 etapes ═════════════ */}
        <section id="howto" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="3">
            Comment calculer la marge en 5 etapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la methode pas-a-pas pour calculer la marge brute et le food cost d'un plat,
              applicable a toute fiche technique. Comptez 10 a 15 minutes par recette la premiere fois,
              puis 2-3 minutes une fois le pli pris.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Lister tous les ingredients et leurs grammages',
                body: "Pour chaque plat, listez chaque ingredient avec sa quantite exacte en grammes ou en millilitres. N'oubliez pas les ingredients de garniture, les sauces, les huiles de cuisson, les epices, les herbes. Plus la fiche est complete, plus le calcul est juste. Pesez systematiquement plutot que d'estimer a l'oeil.",
              },
              {
                title: 'Calculer le cout matieres total',
                body: "Pour chaque ligne, multipliez le grammage par le prix au gramme (ou au millilitre). Exemple : 150 g de bavette a 18 EUR/kg = 0,150 x 18 = 2,70 EUR. Additionnez tous les couts ligne par ligne. Integrez les rendements : un kilo de carottes brutes ne donne que 800 g de carottes epluchees.",
              },
              {
                title: 'Determiner le prix de vente HT',
                body: "Le prix de vente HT s'obtient en retirant la TVA du prix affiche TTC. En France : Prix HT = Prix TTC / 1,10 pour la restauration sur place. Calculez toujours votre marge en HT, jamais en TTC, sinon vous biaisez le ratio.",
              },
              {
                title: 'Calculer le food cost et la marge brute',
                body: "Food cost (%) = (Cout matieres / Prix de vente HT) x 100. Marge brute (%) = 100 - Food cost. Marge brute (EUR) = Prix de vente HT - Cout matieres. Comparez votre ratio a la fourchette cible de votre type d'etablissement.",
              },
              {
                title: 'Comparer, ajuster, repeter',
                body: "Comparez votre food cost aux benchmarks (tableau plus bas). Si vous etes au-dessus de la cible, plusieurs leviers : reduire les portions, negocier avec les fournisseurs, substituer un ingredient, ajuster le prix de vente. Refaites le calcul a chaque changement de prix fournisseur.",
              },
            ].map((step, i) => (
              <li key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-7 flex gap-5">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg shadow-md">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-[#111111] text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-[#525252] leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <Callout type="info">
            <strong>Astuce gain de temps :</strong> au lieu de refaire ce calcul a la main pour chaque plat,
            utilisez le <Link to="/outils/calculateur-food-cost" className="underline font-semibold hover:text-teal-700">calculateur de food cost gratuit RestauMargin</Link>.
            Vous saisissez ingredients, grammages et prix : le food cost et la marge brute s'affichent instantanement.
          </Callout>
        </section>

        {/* ═════════════ SECTION : Marge brute vs marge nette ═════════════ */}
        <section id="brute-vs-nette" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="4">
            Marge brute vs marge nette : la difference
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est la confusion la plus frequente chez les restaurateurs debutants. Et c'est aussi
              celle qui coute le plus cher. Imaginez un restaurant avec un excellent food cost a 28 % :
              la marge brute est de 72 %. Le proprietaire pense gagner 72 cents sur chaque euro vendu.
              En realite, sa marge nette est peut-etre de 4 %. Voici pourquoi.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Marge brute</h3>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed mb-4">
                <strong>Formule :</strong> CA - Cout matieres premieres
              </p>
              <p className="text-sm text-emerald-800 leading-relaxed mb-4">
                <strong>Ce qu'elle mesure :</strong> votre capacite a transformer des ingredients en valeur. Elle ignore toutes les autres charges.
              </p>
              <p className="text-sm text-emerald-800 leading-relaxed">
                <strong>Cible restauration :</strong> 65 % a 75 % du CA HT.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-blue-900">Marge nette</h3>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed mb-4">
                <strong>Formule :</strong> Resultat net / CA HT x 100
              </p>
              <p className="text-sm text-blue-800 leading-relaxed mb-4">
                <strong>Ce qu'elle mesure :</strong> ce qui reste apres TOUTES les charges (personnel, loyer, energie, taxes, amortissements, frais financiers).
              </p>
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong>Cible restauration :</strong> 5 % a 15 % du CA HT.
              </p>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-[#111111] mb-3">Exemple concret de passage marge brute -- marge nette</h3>
            <p>
              Prenons un bistrot avec 600 000 EUR de CA HT et un food cost a 30 %. Voici la repartition typique :
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#F5F5F5] text-[#404040]">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste</th>
                  <th className="text-right py-3 px-4 font-semibold">Montant</th>
                  <th className="text-right py-3 px-4 font-semibold">% du CA</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Cumul</th>
                </tr>
              </thead>
              <tbody className="text-[#404040]">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-[#111111]">Chiffre d'affaires HT</td><td className="py-3 px-4 text-right">600 000 EUR</td><td className="py-3 px-4 text-right">100 %</td><td className="py-3 px-4 text-right">100 %</td></tr>
                <tr className="bg-[#FAFAFA]"><td className="py-3 px-4 text-red-700">- Cout matieres</td><td className="py-3 px-4 text-right text-red-700">-180 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-30 %</td><td className="py-3 px-4 text-right">70 %</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">= Marge brute</td><td className="py-3 px-4 text-right font-bold text-emerald-900">420 000 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-900">70 %</td><td className="py-3 px-4 text-right">70 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Personnel (charges incluses)</td><td className="py-3 px-4 text-right text-red-700">-210 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-35 %</td><td className="py-3 px-4 text-right">35 %</td></tr>
                <tr className="bg-[#FAFAFA]"><td className="py-3 px-4 text-red-700">- Loyer + charges locatives</td><td className="py-3 px-4 text-right text-red-700">-60 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-10 %</td><td className="py-3 px-4 text-right">25 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Energie + fluides</td><td className="py-3 px-4 text-right text-red-700">-30 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-5 %</td><td className="py-3 px-4 text-right">20 %</td></tr>
                <tr className="bg-[#FAFAFA]"><td className="py-3 px-4 text-red-700">- Marketing + assurances + divers</td><td className="py-3 px-4 text-right text-red-700">-48 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-8 %</td><td className="py-3 px-4 text-right">12 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Amortissements + frais financiers</td><td className="py-3 px-4 text-right text-red-700">-24 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-4 %</td><td className="py-3 px-4 text-right">8 %</td></tr>
                <tr className="bg-blue-50"><td className="py-3 px-4 font-bold text-blue-900">= Marge nette</td><td className="py-3 px-4 text-right font-bold text-blue-900">48 000 EUR</td><td className="py-3 px-4 text-right font-bold text-blue-900">8 %</td><td className="py-3 px-4 text-right">8 %</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Vous voyez la difference ? La marge brute est de 70 % (420 000 EUR), la marge nette
              n'est que de 8 % (48 000 EUR). Si vous prenez vos decisions de gestion uniquement sur
              la marge brute, vous risquez de surestimer votre rentabilite reelle d'un facteur 9.
            </p>
            <p>
              <strong>Regle d'or :</strong> pilotez vos prix au quotidien sur le food cost et la marge brute,
              mais validez votre strategie globale (loyer, recrutement, investissement) sur la marge nette.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Formules de calcul ═════════════ */}
        <section id="formules" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="5">
            Formules de calcul avec exemples chiffres
          </SectionHeading>

          <div className="prose-content">
            <p>
              Passons a la pratique. Voici les formules essentielles pour maitriser le calcul de marge
              de votre restaurant, illustrees avec un exemple concret.
            </p>
          </div>

          {/* Exemple concret */}
          <div className="mt-8 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-[#111111] mb-4 text-lg">Exemple : Entrecote grillee</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-[#404040] mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full" />
                Prix de vente HT : <strong className="text-[#111111]">24,00 EUR</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                Cout matieres premieres : <strong className="text-[#111111]">7,20 EUR</strong>
              </div>
            </div>

            <div className="space-y-6">
              <FormulaBlock
                label="Food Cost (%)"
                formula="(Cout matieres / Prix de vente) x 100"
                calcul="(7,20 / 24,00) x 100"
                resultat="30 %"
                verdict="Objectif atteint"
                color="emerald"
              />
              <FormulaBlock
                label="Marge brute (EUR)"
                formula="Prix de vente - Cout matieres"
                calcul="24,00 - 7,20"
                resultat="16,80 EUR"
                verdict="Bonne marge unitaire"
                color="emerald"
              />
              <FormulaBlock
                label="Marge brute (%)"
                formula="(Marge brute / Prix de vente) x 100"
                calcul="(16,80 / 24,00) x 100"
                resultat="70 %"
                verdict="Excellent ratio"
                color="emerald"
              />
              <FormulaBlock
                label="Coefficient multiplicateur"
                formula="Prix de vente / Cout matieres"
                calcul="24,00 / 7,20"
                resultat="3,33"
                verdict="Standard restauration"
                color="amber"
              />
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-[#111111] mb-3">
              La methode du coefficient multiplicateur
            </h3>
            <p>
              Le coefficient multiplicateur est un raccourci tres utilise en restauration.
              Il permet de fixer rapidement un prix de vente a partir du cout matiere.
              Le principe est simple : vous multipliez le cout de vos ingredients par un coefficient
              (generalement entre 3 et 4) pour obtenir votre prix de vente HT.
            </p>
            <p>
              <strong>Formule :</strong> Prix de vente HT = Cout matieres x Coefficient multiplicateur
            </p>
            <p>
              Un coefficient de 3,0 correspond a un food cost de 33 %. Un coefficient de 4,0 correspond
              a un food cost de 25 %. Plus le coefficient est eleve, plus votre marge est confortable —
              mais attention a ne pas deconnecter vos prix du marche et des attentes clients. Pour
              approfondir, lisez notre <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-800">guide complet du coefficient multiplicateur</Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION : Cas pratique pizza ═════════════ */}
        <section id="cas-pizza" className="mb-16">
          <SectionHeading icon={<Pizza className="w-6 h-6" />} number="6">
            Cas pratique chiffre : pizza margherita
          </SectionHeading>

          <div className="prose-content">
            <p>
              Calculons la marge sur une pizza margherita classique vendue 11 EUR TTC dans une pizzeria
              parisienne. La TVA restauration sur place est de 10 %, donc le prix HT est de 10 EUR.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-[#111111] mb-4 text-lg">Decomposition du cout matieres</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-[#404040] border-b border-[#E5E7EB]">
                  <th className="text-left py-2 px-3 font-semibold">Ingredient</th>
                  <th className="text-right py-2 px-3 font-semibold">Quantite</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix au kg/L</th>
                  <th className="text-right py-2 px-3 font-semibold">Cout</th>
                </tr>
              </thead>
              <tbody className="text-[#404040]">
                <tr><td className="py-2 px-3">Pate (farine, eau, levure, sel, huile)</td><td className="py-2 px-3 text-right">230 g</td><td className="py-2 px-3 text-right">1,20 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,28 EUR</td></tr>
                <tr><td className="py-2 px-3">Sauce tomate</td><td className="py-2 px-3 text-right">80 g</td><td className="py-2 px-3 text-right">3,50 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,28 EUR</td></tr>
                <tr><td className="py-2 px-3">Mozzarella fior di latte</td><td className="py-2 px-3 text-right">100 g</td><td className="py-2 px-3 text-right">8,80 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,88 EUR</td></tr>
                <tr><td className="py-2 px-3">Basilic frais</td><td className="py-2 px-3 text-right">3 feuilles</td><td className="py-2 px-3 text-right">25 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,05 EUR</td></tr>
                <tr><td className="py-2 px-3">Huile d'olive vierge</td><td className="py-2 px-3 text-right">5 ml</td><td className="py-2 px-3 text-right">7 EUR/L</td><td className="py-2 px-3 text-right font-medium">0,04 EUR</td></tr>
                <tr><td className="py-2 px-3">Sel + origan + assaisonnement</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right font-medium">0,05 EUR</td></tr>
                <tr className="border-t-2 border-[#E5E7EB] bg-amber-50"><td className="py-3 px-3 font-bold text-[#111111]">Total cout matieres</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">1,58 EUR</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Calculs :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-[#404040]">
              <li>Food cost = 1,58 / 10,00 x 100 = <strong>15,8 %</strong></li>
              <li>Marge brute (EUR) = 10,00 - 1,58 = <strong>8,42 EUR</strong></li>
              <li>Marge brute (%) = 8,42 / 10,00 x 100 = <strong>84,2 %</strong></li>
              <li>Coefficient multiplicateur = 10,00 / 1,58 = <strong>6,33</strong></li>
            </ul>
            <p className="mt-4">
              Avec un food cost de 15,8 % et une marge brute de 84,2 %, cette pizza est extremement rentable.
              C'est typique de la pizzeria : les ingredients de base (farine, tomate, mozzarella) coutent peu
              et le client est habitue a un certain prix. Le defi reel d'une pizzeria n'est pas le food cost
              mais la productivite (nombre de pizzas a l'heure) et le prime cost combine personnel + matieres.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION : Cas pratique entrecote ═════════════ */}
        <section id="cas-entrecote" className="mb-16">
          <SectionHeading icon={<Beef className="w-6 h-6" />} number="7">
            Cas pratique chiffre : entrecote grillee
          </SectionHeading>

          <div className="prose-content">
            <p>
              Maintenant l'entrecote grillee servie dans une brasserie a 28 EUR TTC, soit environ 25,45 EUR HT.
              Cas oppose a la pizza : un produit nobre, cher au kilo, avec une marge plus serree.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-[#111111] mb-4 text-lg">Decomposition du cout matieres</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-[#404040] border-b border-[#E5E7EB]">
                  <th className="text-left py-2 px-3 font-semibold">Ingredient</th>
                  <th className="text-right py-2 px-3 font-semibold">Quantite</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix au kg/L</th>
                  <th className="text-right py-2 px-3 font-semibold">Cout</th>
                </tr>
              </thead>
              <tbody className="text-[#404040]">
                <tr><td className="py-2 px-3">Entrecote bovin charolais (parage 92 %)</td><td className="py-2 px-3 text-right">220 g</td><td className="py-2 px-3 text-right">28 EUR/kg</td><td className="py-2 px-3 text-right font-medium">6,70 EUR</td></tr>
                <tr><td className="py-2 px-3">Frites maison</td><td className="py-2 px-3 text-right">200 g</td><td className="py-2 px-3 text-right">2,80 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,56 EUR</td></tr>
                <tr><td className="py-2 px-3">Beurre de cuisson</td><td className="py-2 px-3 text-right">15 g</td><td className="py-2 px-3 text-right">8 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,12 EUR</td></tr>
                <tr><td className="py-2 px-3">Sauce au poivre (creme + cognac + poivre)</td><td className="py-2 px-3 text-right">60 g</td><td className="py-2 px-3 text-right">~6 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,36 EUR</td></tr>
                <tr><td className="py-2 px-3">Salade verte + tomate cerise</td><td className="py-2 px-3 text-right">50 g</td><td className="py-2 px-3 text-right">5 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,25 EUR</td></tr>
                <tr><td className="py-2 px-3">Sel, poivre, fleur de sel</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right font-medium">0,06 EUR</td></tr>
                <tr className="border-t-2 border-[#E5E7EB] bg-amber-50"><td className="py-3 px-3 font-bold text-[#111111]">Total cout matieres</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">8,05 EUR</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Calculs :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-[#404040]">
              <li>Food cost = 8,05 / 25,45 x 100 = <strong>31,6 %</strong></li>
              <li>Marge brute (EUR) = 25,45 - 8,05 = <strong>17,40 EUR</strong></li>
              <li>Marge brute (%) = 17,40 / 25,45 x 100 = <strong>68,4 %</strong></li>
              <li>Coefficient multiplicateur = 25,45 / 8,05 = <strong>3,16</strong></li>
            </ul>
            <p className="mt-4">
              Food cost de 31,6 %, marge brute de 68,4 % : conforme aux benchmarks brasserie (28-33 % de food cost).
              La marge brute en valeur absolue (17,40 EUR) est superieure a celle de la pizza (8,42 EUR), mais
              le coefficient multiplicateur est presque deux fois plus faible. Conclusion : ne jugez jamais
              la rentabilite d'un plat sur un seul indicateur. Un plat haut de gamme avec coefficient bas peut
              etre tres rentable en valeur absolue.
            </p>
          </div>

          <Callout type="info">
            <strong>Comparaison pizza vs entrecote :</strong> la pizza a un meilleur ratio (84 % de marge brute)
            mais ne rapporte que 8,42 EUR par vente. L'entrecote rapporte 17,40 EUR par vente. Si vous vendez
            50 pizzas et 30 entrecotes par jour, marge brute pizza = 421 EUR, marge brute entrecote = 522 EUR.
            Le menu engineering vous aide a piloter ce mix correctement.
          </Callout>
        </section>

        {/* ═════════════ SECTION : Benchmarks par type ═════════════ */}
        <section id="benchmarks" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="8">
            Benchmarks marge brute par type de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les ratios de marge brute observes en France en 2026 sur 6 types d'etablissement.
              Ces fourchettes sont issues des donnees agregees de la GIRA Conseil, du SNRC et de notre
              propre base de donnees RestauMargin (500+ restaurants connectes).
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {[
              { type: 'Pizzeria', mb: '72 - 85 %', fc: '15 - 28 %', notes: 'Marge la plus forte. Ingredients peu couteux, ticket moyen 12-18 EUR.' },
              { type: 'Brasserie', mb: '67 - 72 %', fc: '28 - 33 %', notes: 'Standard de la profession. Carte large, food cost moyen, volume important.' },
              { type: 'Restaurant gastronomique', mb: '60 - 70 %', fc: '30 - 40 %', notes: 'Produits premium (truffe, foie gras, poisson noble). Marge nette fragile.' },
              { type: 'Food truck', mb: '70 - 78 %', fc: '22 - 30 %', notes: 'Faibles charges fixes mais volume contraint par la mobilite et les emplacements.' },
              { type: 'Coffee shop', mb: '78 - 88 %', fc: '12 - 22 %', notes: 'Boisson + snacking. Marge tres elevee mais ticket moyen bas (4-8 EUR).' },
              { type: 'Bistrot', mb: '65 - 72 %', fc: '28 - 35 %', notes: 'Cuisine traditionnelle. Carte courte, ticket moyen 18-30 EUR.' },
            ].map((b, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-[#111111]">{b.type}</h3>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{b.mb}</span>
                </div>
                <div className="text-xs text-[#737373] mb-2"><strong>Food cost cible :</strong> {b.fc}</div>
                <p className="text-sm text-[#525252] leading-relaxed">{b.notes}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Interpretation :</strong> ces fourchettes ne sont pas des verites absolues. Un restaurant
              gastronomique parisien avec un excellent menu engineering peut depasser 75 % de marge brute. Une
              brasserie en zone touristique peut tomber a 60 % si elle ne maitrise pas ses approvisionnements.
              L'objectif n'est pas d'etre dans la moyenne mais d'etre dans le top tier de votre categorie.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Tableau food cost ═════════════ */}
        <section id="food-cost-tableau" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="9">
            Tableau du food cost par type de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tableau complet des benchmarks pour le calcul de marge restaurant en France, 2026.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#F5F5F5] text-[#404040]">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type de restaurant</th>
                  <th className="text-center py-3 px-4 font-semibold">Food Cost cible</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge brute cible</th>
                  <th className="text-center py-3 px-4 font-semibold">Coefficient</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge nette</th>
                </tr>
              </thead>
              <tbody className="text-[#404040]">
                {[
                  { type: 'Restauration rapide / Fast-food', fc: '25 - 30 %', mb: '70 - 75 %', coef: '3,3 - 4,0', mn: '8 - 15 %' },
                  { type: 'Bistrot / Brasserie', fc: '28 - 33 %', mb: '67 - 72 %', coef: '3,0 - 3,6', mn: '5 - 12 %' },
                  { type: 'Restaurant traditionnel', fc: '30 - 35 %', mb: '65 - 70 %', coef: '2,9 - 3,3', mn: '5 - 10 %' },
                  { type: 'Pizzeria / Creperie', fc: '15 - 28 %', mb: '72 - 85 %', coef: '3,6 - 6,5', mn: '10 - 18 %' },
                  { type: 'Coffee shop', fc: '12 - 22 %', mb: '78 - 88 %', coef: '4,5 - 8,0', mn: '8 - 16 %' },
                  { type: 'Restaurant gastronomique', fc: '30 - 40 %', mb: '60 - 70 %', coef: '2,5 - 3,3', mn: '3 - 10 %' },
                  { type: 'Food truck', fc: '22 - 30 %', mb: '70 - 78 %', coef: '3,3 - 4,5', mn: '8 - 18 %' },
                  { type: 'Dark kitchen / Livraison', fc: '28 - 35 %', mb: '65 - 72 %', coef: '2,9 - 3,6', mn: '5 - 12 %' },
                  { type: 'Traiteur / Banquet', fc: '30 - 38 %', mb: '62 - 70 %', coef: '2,6 - 3,3', mn: '8 - 15 %' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                    <td className="py-3 px-4 font-medium text-[#111111]">{row.type}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-center">{row.mb}</td>
                    <td className="py-3 px-4 text-center">{row.coef}</td>
                    <td className="py-3 px-4 text-center">{row.mn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Quelques observations cles :
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#404040] mt-4">
              <li>
                <strong>Pizzerias et coffee shops</strong> ont les meilleurs ratios mais des tickets
                moyens bas. Le defi est le volume.
              </li>
              <li>
                <strong>Le gastronomique</strong> a un food cost plus eleve (produits premium) mais
                compense par des prix de vente eleves. Marge nette fragile (charges personnel a 40-50 %).
              </li>
              <li>
                <strong>Les dark kitchens</strong> economisent sur le loyer et le service mais cedent
                25-35 % de commission aux plateformes (Uber Eats, Deliveroo). Marge nette comprimee.
              </li>
              <li>
                <strong>Le traiteur</strong> beneficie d'economies d'echelle mais doit absorber des
                couts logistiques (transport, materiel, personnel extra).
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 10 : Erreurs courantes ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="10">
            Les 5 erreurs courantes qui detruisent votre marge
          </SectionHeading>

          <div className="space-y-6 mt-8">
            <ErreurCard
              number={1}
              title="Ne pas peser les ingredients"
              desc="C'est l'erreur la plus repandue et la plus couteuse. Sans pesee systematique, vos portions varient d'un service a l'autre. Un cuisinier genereux peut facilement ajouter 20 % de matiere premiere en trop sur chaque assiette. Sur un mois, cela represente des milliers d'euros de marge envolee. La solution : des fiches techniques avec des grammages precis et une balance dans chaque poste de travail."
            />
            <ErreurCard
              number={2}
              title="Ignorer les pertes et le gaspillage"
              desc="Epluchures, parures, invendus, casse, vol — ces pertes invisibles peuvent representer 5 a 10 % de vos achats. Si vous n'integrez pas ces pertes dans votre calcul de marge restaurant, vous sous-estimez systematiquement votre food cost reel. Chaque ingredient a un rendement (un kilo de carottes brutes ne donne que 800 g de carottes epluchees). Integrer ces rendements dans vos fiches techniques est indispensable."
            />
            <ErreurCard
              number={3}
              title="Ne pas mettre a jour les prix fournisseurs"
              desc="Les prix des matieres premieres changent chaque semaine, parfois chaque jour pour les produits frais. Si votre fiche technique indique un prix de beurre a 4 EUR/kg alors qu'il est passe a 6 EUR/kg, votre calcul de marge est faux de 50 % sur cet ingredient. Idealement, votre outil de gestion doit etre connecte a vos factures fournisseurs pour mettre a jour les prix en temps reel."
            />
            <ErreurCard
              number={4}
              title="Confondre marge brute et marge nette"
              desc="Un food cost de 28 % ne signifie pas que vous gagnez 72 centimes sur chaque euro. Il vous reste encore a payer le personnel (30 a 45 % du CA), le loyer (8 a 12 %), l'energie (3 a 6 %), les assurances, les taxes et les frais divers. Beaucoup de restaurateurs fixent leurs prix uniquement sur le food cost et decouvrent trop tard que leur marge nette est quasi nulle."
            />
            <ErreurCard
              number={5}
              title="Ne pas analyser la rentabilite plat par plat"
              desc="Tous vos plats ne se valent pas. Certains ont une marge de 80 %, d'autres de 50 %. Si vous ne faites pas le menu engineering (analyse croisee popularite / rentabilite), vous risquez de promouvoir vos plats les moins rentables. Une carte bien construite met en avant les plats a forte marge et accompagne strategiquement les plats d'appel a faible marge."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumule :</strong> ces cinq erreurs combinees peuvent representer
            une perte de 8 a 15 points de marge brute. Sur un restaurant qui fait 600 000 EUR
            de CA annuel, c'est entre 48 000 EUR et 90 000 EUR de benefice potentiel qui disparait.
          </Callout>

          <div className="prose-content mt-6">
            <p>
              Pour aller plus loin sur la reduction de food cost, lisez notre article dedie :
              <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800 ml-1">
                10 strategies pour reduire le food cost
              </Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 11 : RestauMargin automatise ═════════════ */}
        <section id="automatiser" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="11">
            Comment RestauMargin automatise le calcul de marge
          </SectionHeading>

          <div className="prose-content">
            <p>
              Faire tous ces calculs a la main, sur un tableur Excel, c'est possible — mais
              extremement chronophage et source d'erreurs. C'est exactement pour cela que
              RestauMargin a ete concu : automatiser le calcul de marge restaurant de bout en bout.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              {
                icon: <Calculator className="w-5 h-5" />,
                title: 'Fiches techniques automatiques',
                desc: 'Creez vos recettes avec les grammages exacts. Le food cost se calcule automatiquement a partir des prix fournisseurs en temps reel.'
              },
              {
                icon: <TrendingUp className="w-5 h-5" />,
                title: 'Suivi de marge en temps reel',
                desc: 'Visualisez votre marge brute, votre food cost et votre marge nette au jour le jour, par plat, par categorie ou sur l\'ensemble du menu.'
              },
              {
                icon: <BarChart3 className="w-5 h-5" />,
                title: 'Menu Engineering integre',
                desc: 'Identifiez vos stars, chevaux de labour, enigmes et poids morts. Optimisez votre carte pour maximiser la marge globale.'
              },
              {
                icon: <AlertTriangle className="w-5 h-5" />,
                title: 'Alertes de deviation',
                desc: 'Recevez une alerte quand un prix fournisseur augmente et impacte votre marge au-dela du seuil que vous avez defini.'
              },
              {
                icon: <DollarSign className="w-5 h-5" />,
                title: 'Scan de factures (OCR)',
                desc: 'Photographiez vos factures fournisseurs : les prix sont extraits automatiquement et vos fiches techniques sont mises a jour.'
              },
              {
                icon: <Target className="w-5 h-5" />,
                title: 'Simulateur de prix',
                desc: 'Testez l\'impact d\'un changement de prix ou de fournisseur sur votre marge avant de prendre la decision.'
              },
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-[#111111] mb-1.5">{feat.title}</h3>
                <p className="text-sm text-[#525252] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              L'objectif de RestauMargin est de vous faire passer du calcul manuel (tableur,
              calculette, estimations approximatives) a un systeme automatise, precis et en temps
              reel. Vous gagnez du temps, vous gagnez en precision, et surtout vous gagnez
              en marge.
            </p>
            <p>
              Plus de 500 restaurants en France utilisent deja RestauMargin pour piloter leur
              rentabilite. Le gain moyen constate est de 3 a 5 points de marge brute dans les
              6 premiers mois d'utilisation, grace a une meilleure maitrise des portions,
              des achats et de la construction du menu. Decouvrez nos
              <Link to="/pricing" className="text-teal-700 underline hover:text-teal-800 ml-1">tarifs RestauMargin</Link>
              ou commencez tout de suite avec le
              <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800 ml-1">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-14" readTime="15 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions frequentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Automatiser ce calcul avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Stop au tableur. RestauMargin calcule votre food cost, votre marge brute et votre
              coefficient en temps reel, sur tous vos plats, automatiquement.
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
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/reduire-food-cost" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le food cost en 10 strategies</h3>
              <p className="text-xs text-[#737373]">Fiches techniques, negociation, gaspillage, menu engineering.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">Le coefficient multiplicateur</h3>
              <p className="text-xs text-[#737373]">Tableaux par categorie, erreurs courantes et cas pratique.</p>
            </Link>
            <Link to="/blog/prix-de-vente-restaurant" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">Calculer le prix de vente d'un plat</h3>
              <p className="text-xs text-[#737373]">Methodes coefficient, marge cible, pricing psychologique.</p>
            </Link>
            <Link to="/outils/calculateur-food-cost" className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-[#111111] mb-1.5 group-hover:text-teal-700 transition-colors">Calculateur food cost gratuit</h3>
              <p className="text-xs text-[#737373]">Outil en ligne pour calculer votre marge en 30 secondes.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#FAFAFA] border-t border-[#E5E7EB] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-[#737373]">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-[#111111] font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">
            La plateforme de gestion de marge pour les restaurateurs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#A3A3A3]">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions legales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialite</Link>
          </div>
          <p className="mt-6 text-xs text-[#A3A3A3]">
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
      <h2 className="text-2xl font-bold text-[#111111]">
        <span className="text-teal-600 mr-2">{number}.</span>
        {children}
      </h2>
    </div>
  );
}

function MargeCard({ icon, title, color, desc, formula, target }: {
  icon: React.ReactNode; title: string; color: string; desc: string; formula: string; target: string;
}) {
  const colors: Record<string, { bg: string; text: string; badge: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  };
  const c = colors[color] || colors.emerald;

  return (
    <div className={`${c.bg} rounded-2xl p-6 border border-[#F5F5F5]`}>
      <div className={`w-10 h-10 ${c.badge} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="font-bold text-[#111111] mb-2">{title}</h3>
      <p className="text-sm text-[#525252] leading-relaxed mb-4">{desc}</p>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#737373] font-medium">Formule :</span>
          <code className="bg-white/70 px-2 py-0.5 rounded text-[#404040]">{formula}</code>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#737373] font-medium">Objectif :</span>
          <span className={`${c.badge} px-2 py-0.5 rounded font-semibold`}>{target}</span>
        </div>
      </div>
    </div>
  );
}

function FormulaBlock({ label, formula, calcul, resultat, verdict, color }: {
  label: string; formula: string; calcul: string; resultat: string; verdict: string; color: string;
}) {
  const verdictColor = color === 'emerald' ? 'text-emerald-600' : 'text-amber-600';
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5">
      <h4 className="font-semibold text-[#111111] mb-2">{label}</h4>
      <div className="text-sm text-[#737373] mb-1">
        <span className="font-medium">Formule :</span> {formula}
      </div>
      <div className="text-sm text-[#737373] mb-2">
        <span className="font-medium">Calcul :</span> {calcul}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xl font-extrabold text-[#111111]">{resultat}</span>
        <span className={`text-sm font-semibold ${verdictColor} flex items-center gap-1`}>
          <CheckCircle className="w-4 h-4" />
          {verdict}
        </span>
      </div>
    </div>
  );
}

function ErreurCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-[#111111] mb-1.5">{title}</h3>
        <p className="text-sm text-[#525252] leading-relaxed">{desc}</p>
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
    <details className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl group">
      <summary className="px-5 py-4 font-semibold text-[#111111] cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-[#A3A3A3] group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-[#525252] leading-relaxed">{a}</p>
    </details>
  );
}
