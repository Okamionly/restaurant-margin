import { Link } from 'react-router-dom';
import { ChefHat, Calculator, ArrowRight, BookOpen, Zap, AlertTriangle, Lightbulb, ListChecks, Target, TrendingUp, Sparkles, Pizza, Beef, Coffee, BarChart3, Award, CheckCircle, DollarSign, Percent, Brain } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Coefficient multiplicateur restaurant : guide complet 2026"
   Mot-clé principal : coefficient multiplicateur restauration
   ~3 200 mots
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Qu'est-ce que le coefficient multiplicateur en restauration ?",
    answer: "Le coefficient multiplicateur est un chiffre que vous multipliez par le cout matiere d'un plat pour obtenir son prix de vente HT. Exemple : cout matiere 4 EUR x coefficient 3,5 = 14 EUR HT, soit 15,40 EUR TTC en restauration sur place. C'est la methode la plus directe pour fixer un prix de vente a partir d'un cout matiere connu.",
  },
  {
    question: "Comment calculer le coefficient multiplicateur ?",
    answer: "Deux methodes au choix : (1) A partir du food cost cible : Coefficient = 1 / Food cost. Pour 30 %, coefficient = 1/0,30 = 3,33. (2) A partir de donnees reelles : Coefficient = Prix de vente HT / Cout matiere. Si une entrecote a 22 EUR HT a un cout matiere de 7,20 EUR, le coefficient effectif est 22 / 7,20 = 3,06.",
  },
  {
    question: "Quel est le coefficient multiplicateur moyen en restauration ?",
    answer: "Le coefficient moyen en restauration traditionnelle se situe entre 3,0 et 3,5, soit un food cost de 29 a 33 %. Mais il varie enormement par categorie : x 4-5 pour les desserts, x 5-8 pour les vins, x 8-12 pour les boissons chaudes, x 2,5-3,3 pour les vins en bouteille premium.",
  },
  {
    question: "Pourquoi ne pas appliquer un coefficient unique a toute la carte ?",
    answer: "Chaque categorie de plat a une valeur percue differente et un cout matiere relatif different. Les boissons chaudes (cafe, the) ont des couts tres bas et acceptent des coefficients de x 8 a x 12. Les plats de poisson noble, plus chers, necessitent des coefficients plus faibles (x 3,0) pour rester dans les prix du marche. Un coefficient unique produirait des prix aberrants : cafe a 1,30 EUR ou poisson a 56 EUR.",
  },
  {
    question: "Coefficient multiplicateur : avec ou sans TVA ?",
    answer: "Le coefficient s'applique au cout matiere HT pour donner un prix de vente HT. La TVA est ajoutee ensuite (10 % en restauration sur place, 5,5 % en vente a emporter froide, 20 % sur les boissons alcoolisees). Si votre calcul donne 15,00 EUR HT, le prix TTC sera 16,50 EUR pour la restauration sur place.",
  },
  {
    question: "Comment optimiser son coefficient multiplicateur ?",
    answer: "Trois leviers : (1) Augmenter la valeur percue du plat via storytelling produit (origine, producteur, methode artisanale) pour justifier un prix plus eleve. (2) Reduire le cout matiere par negociation fournisseurs ou optimisation des rendements (gestion des parures, fiches techniques precises). (3) Utiliser le menu engineering pour promouvoir les plats a fort coefficient (matrice BCG).",
  },
  {
    question: "Le coefficient multiplicateur tient-il compte de la main d'oeuvre ?",
    answer: "Non, le coefficient s'applique uniquement sur le cout matiere et integre implicitement les charges via le food cost cible. Pour les plats complexes (longues cuissons, dressage technique), ajoutez un cout main d'oeuvre par plat : temps de prep x taux horaire cuisinier charge (22-28 EUR/h en 2026). C'est ce qu'on appelle le 'prime cost' (food cost + cout MO direct).",
  },
  {
    question: "Quel coefficient pour une pizzeria, brasserie ou gastronomique ?",
    answer: "Pizzeria : x 4,0 a 6,5 (food cost 15-25 %). Brasserie : x 3,3 a 4,0 (food cost 25-30 %). Bistrot traditionnel : x 3,0 a 3,3 (food cost 30-33 %). Restaurant gastronomique : x 2,5 a 3,3 (food cost 30-40 %). Coffee shop : x 5,0 a 10,0 (food cost 10-20 %).",
  },
  {
    question: "Comment recalculer son coefficient quand les prix fournisseurs augmentent ?",
    answer: "Trois options : (1) Augmenter le prix de vente pour maintenir le coefficient initial. (2) Repenser les portions (-5 a -10 % de grammage). (3) Substituer un ingredient (variete moins chere a qualite equivalente). Idealement, le coefficient doit rester stable et le prix de vente s'adapter. RestauMargin alerte automatiquement quand un prix matiere fait dériver le coefficient effectif sous le seuil minimum.",
  },
  {
    question: "Le coefficient multiplicateur, un calcul depasse en 2026 ?",
    answer: "Non. Malgre l'apparition d'outils data-driven (menu engineering, value-based pricing), le coefficient multiplicateur reste la base de toute tarification serieuse en restauration. C'est le seul indicateur qui garantit mathematiquement un food cost cible. Les methodes plus sophistiquees (marge cible, value pricing) le complementent mais ne le remplacent pas.",
  },
  {
    question: "Quelle est la difference entre coefficient et marge brute ?",
    answer: "Le coefficient est un multiplicateur (3,33), la marge brute est un pourcentage (70 %). Ils sont equivalents mathematiquement : Marge brute (%) = 1 - 1/Coefficient. Coefficient 3,33 = marge brute 70 %. Coefficient 4 = marge brute 75 %. Coefficient 5 = marge brute 80 %. Le coefficient est utilise pour calculer un prix, la marge brute pour analyser une rentabilite.",
  },
  {
    question: "Faut-il integrer les pertes (epluchure, casse) dans le calcul du coefficient ?",
    answer: "Oui, imperativement. Vous devez calculer votre coefficient sur le cout matiere net (apres rendement et pertes). Un kilo de carottes brutes ne donne que 800 g utilisables. Si vous utilisez le cout brut, votre coefficient est sous-estime de 20-25 %. Les fiches techniques precises integrent un coefficient de rendement par ingredient.",
  },
];

export default function BlogCoefficient() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Coefficient multiplicateur restaurant : formule et calcul 2026"
        description="Guide complet du coefficient multiplicateur en restauration : formules, tableaux par categorie, cas pratiques chiffres et erreurs courantes. Optimisez vos prix de vente."
        path="/blog/coefficient-multiplicateur"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Coefficient multiplicateur', url: 'https://www.restaumargin.fr/blog/coefficient-multiplicateur' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment calculer le coefficient multiplicateur d\'un plat',
            description: 'Methode pas-a-pas pour calculer et appliquer le coefficient multiplicateur sur un plat de restaurant.',
            totalTime: 'PT15M',
            tool: ['Fiche technique', 'Calculatrice', 'Logiciel RestauMargin'],
            step: [
              { '@type': 'HowToStep', name: 'Determiner le food cost cible', text: 'Fixez votre food cost cible selon votre type d\'etablissement (15 a 40 % selon brasserie, pizzeria, gastronomique).' },
              { '@type': 'HowToStep', name: 'Calculer le coefficient theorique', text: 'Coefficient = 1 / Food cost cible. Pour 30 %, coefficient = 3,33.' },
              { '@type': 'HowToStep', name: 'Calculer le cout matiere net', text: 'A partir de la fiche technique, integrez les rendements (epluchage, parage, cuisson) pour obtenir le cout matiere reel net.' },
              { '@type': 'HowToStep', name: 'Appliquer le coefficient', text: 'Prix de vente HT = Cout matiere net x Coefficient. Exemple : 5 EUR x 3,33 = 16,65 EUR HT.' },
              { '@type': 'HowToStep', name: 'Convertir en TTC et arrondir', text: 'Prix TTC = Prix HT x 1,10. Arrondissez selon le pricing psychologique (16,50, 17,90, etc.).' },
              { '@type': 'HowToStep', name: 'Verifier le coefficient effectif', text: 'Apres arrondi, recalculez : Coefficient effectif = Prix HT / Cout matiere. Doit rester dans la fourchette cible.' },
              { '@type': 'HowToStep', name: 'Suivre et ajuster', text: 'Revisez vos coefficients tous les 3 mois et a chaque variation significative des prix fournisseurs.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Coefficient multiplicateur restaurant : formule et calcul complet 2026',
            description: 'Guide complet du coefficient multiplicateur en restauration : formule, tableaux par categorie et type de cuisine, cas pratiques chiffres, erreurs courantes.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-03-20',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/coefficient-multiplicateur' },
          },
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-mono-900">
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
              Calculer mon coefficient
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
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Coefficient multiplicateur</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <BlogArticleHero
        category="Pricing"
        readTime="15 min"
        date="Mai 2026"
        title="Coefficient multiplicateur restaurant : formule et calcul complet 2026"
        accentWord="coefficient"
        subtitle="Fixer le prix de vente de vos plats au hasard est la premiere cause de faillite en restauration. Le coefficient multiplicateur est l'outil qui transforme un cout matiere en prix juste, rentable et coherent avec le marche."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-03-20" readTime="15 min" variant="header" />

        {/* ── Encadre formule rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formule rapide coefficient</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">La formule essentielle a retenir</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Prix de vente HT</strong> = Cout matiere x Coefficient multiplicateur</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Coefficient</strong> = 1 / Food cost cible</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Marge brute</strong> = 1 - 1/Coefficient (ex : coef 3,33 = marge 70 %)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Prix TTC</strong> = Prix HT x 1,10 (TVA restauration sur place)</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Exemple express : 3,50 EUR de cout matiere x coefficient 3,5 = 12,25 EUR HT, soit 13,48 EUR TTC arrondi a 13,50 EUR sur la carte.
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
              { href: '#definition', label: 'Definition et utilite du coefficient multiplicateur' },
              { href: '#formule', label: 'La formule complete avec exemples' },
              { href: '#howto', label: 'Comment calculer en 7 etapes' },
              { href: '#categories', label: 'Coefficients par categorie de plat' },
              { href: '#cuisines', label: 'Coefficients par type de cuisine' },
              { href: '#table', label: 'Table de conversion coefficient / food cost / marge' },
              { href: '#cas-pratiques', label: 'Cas pratiques chiffres (pizzeria, brasserie, gastro)' },
              { href: '#menu-engineering', label: 'Coefficient et menu engineering : le duo gagnant' },
              { href: '#cas-menu', label: 'Cas pratique : menu complet a 35 EUR' },
              { href: '#erreurs', label: 'Les 7 erreurs courantes a eviter' },
              { href: '#automatiser', label: 'Automatiser avec RestauMargin' },
              { href: '#faq', label: 'Questions frequentes' },
              { href: '#cta', label: 'Calculez vos coefficients gratuitement' },
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

        {/* ═════════════ SECTION 1 : Definition ═════════════ */}
        <section id="definition" className="mb-16">
          <SectionHeading icon={<BookOpen className="w-6 h-6" />} number="1">
            Definition et utilite du coefficient multiplicateur
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le coefficient multiplicateur en restauration est un chiffre que vous appliquez au cout
              matiere de votre plat pour obtenir son prix de vente hors taxes. C'est la methode la plus
              directe et la plus utilisee en France pour passer du cout des ingredients a un prix qui
              couvre vos charges et degage un benefice. Si elle est aussi populaire, c'est qu'elle est
              rapide (30 secondes par plat), securisee (garantit le food cost cible) et facile a
              expliquer en equipe (un seul chiffre a connaitre par categorie).
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Pourquoi le coefficient est central</h3>
            <p>
              Selon l'Observatoire Fiducial de la Restauration 2025, pres d'un restaurant sur deux
              ferme dans les trois premieres annees. La cause numero un : une mauvaise maitrise des
              prix de vente. Sans coefficient multiplicateur, vous travaillez a l'instinct. Avec lui,
              chaque plat a un prix coherent avec votre structure de couts.
            </p>
            <p>
              Le coefficient n'est pas un calcul reserve aux chaines ou aux gros restaurants : c'est
              l'outil de base de tout restaurateur professionnel, du food truck au gastronomique etoile.
              Il evolue dans une fourchette tres large (de 2,5 a 12 selon les categories) mais sa logique
              reste la meme. Pour comprendre l'integralite du calcul de marge, consultez aussi notre <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800">guide complet du calcul de marge restaurant</Link>.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Un restaurant qui ameliore son coefficient moyen de
              3,0 a 3,3 (food cost de 33 % a 30 %) sur un chiffre d'affaires de 500 000 EUR genere
              15 000 EUR de marge brute supplementaire par an, sans changer un seul plat.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Formule ═════════════ */}
        <section id="formule" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="2">
            La formule complete avec exemples
          </SectionHeading>

          <div className="prose-content">
            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">La formule de base</h3>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 my-4">
              <p className="text-center text-lg font-bold text-teal-800 mb-2">
                Prix de vente HT = Cout matiere x Coefficient multiplicateur
              </p>
              <p className="text-center text-sm text-teal-600">
                Exemple : 3,50 EUR x 3,5 = 12,25 EUR HT -- 13,48 EUR TTC -- 13,50 EUR sur la carte
              </p>
            </div>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">La relation entre coefficient et food cost</h3>
            <p>
              Le coefficient multiplicateur et le food cost sont inversement lies. Connaitre l'un permet
              de calculer l'autre instantanement :
            </p>
            <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-4 font-mono text-sm sm:text-base">
              <div>Coefficient = 1 / Food cost</div>
              <div>Food cost = 1 / Coefficient</div>
              <div>Marge brute = 1 - Food cost = 1 - 1/Coefficient</div>
            </div>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Exemple chiffre detaille</h3>
            <p>
              Prenons un risotto aux champignons. Cout matiere apres rendement : 3,80 EUR. Coefficient
              cible (bistrot moderne) : 3,5. Voici tous les calculs deroules :
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-3">
              <li>Prix de vente HT = 3,80 x 3,5 = <strong>13,30 EUR HT</strong></li>
              <li>Prix de vente TTC = 13,30 x 1,10 = <strong>14,63 EUR TTC</strong></li>
              <li>Prix arrondi carte = <strong>14,50 EUR TTC</strong> (pricing psychologique)</li>
              <li>Marge brute en EUR = 13,30 - 3,80 = <strong>9,50 EUR par plat</strong></li>
              <li>Marge brute en % = 1 - (3,80/13,30) = <strong>71,4 %</strong></li>
              <li>Food cost = 3,80/13,30 = <strong>28,6 %</strong></li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Howto ═════════════ */}
        <section id="howto" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="3">
            Comment calculer en 7 etapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Methode pas-a-pas applicable a tout plat de la carte. Comptez 10 minutes la premiere fois,
              puis 2-3 minutes une fois le pli pris.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              { title: 'Determiner le food cost cible', body: 'Selon votre type de restaurant : 15-22 % pour une pizzeria, 25-30 % pour une brasserie, 28-33 % pour un bistrot, 30-40 % pour un gastronomique. Cette cible est votre boussole.' },
              { title: 'Calculer le coefficient theorique', body: 'Coefficient = 1 / Food cost cible. Exemple : pour un food cost cible de 30 %, coefficient = 1 / 0,30 = 3,33.' },
              { title: 'Calculer le cout matiere net du plat', body: 'A partir de la fiche technique precise (grammages, prix fournisseurs), additionnez le cout de chaque ingredient. INTEGREZ les rendements : un kilo de carottes brutes ne donne que 800 g utilisables, donc le cout reel est 1,25 x le cout brut.' },
              { title: 'Appliquer le coefficient', body: 'Prix de vente HT = Cout matiere net x Coefficient. Exemple : 5,00 EUR x 3,33 = 16,65 EUR HT.' },
              { title: 'Convertir en TTC', body: 'Prix TTC = Prix HT x (1 + taux TVA). En restauration sur place : x 1,10. Pour les boissons alcoolisees : x 1,20. Pour les ventes a emporter froides : x 1,055.' },
              { title: 'Arrondir selon le pricing psychologique', body: 'Prix de charme (.90 ou .50) pour la restauration accessible, prix entiers pour le premium. 16,65 devient 16,50 ou 17,00 selon votre positionnement. Jamais de prix biscornus type 16,32.' },
              { title: 'Verifier le coefficient effectif', body: 'Apres arrondi, recalculez : Coefficient effectif = Prix HT / Cout matiere. Doit rester dans la fourchette cible. Si l\'arrondi vous fait sortir de la fourchette, ajustez le grammage ou le prix.' },
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

          <Callout type="info">
            <strong>Astuce gain de temps :</strong> au lieu de refaire ce calcul a la main pour chaque plat,
            utilisez le <Link to="/outils/calculateur-food-cost" className="underline font-semibold hover:text-teal-700">calculateur de food cost gratuit RestauMargin</Link>.
            Saisissez ingredients et prix : le coefficient, le food cost et la marge s'affichent
            instantanement avec proposition d'arrondi psychologique.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Par categorie ═════════════ */}
        <section id="categories" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="4">
            Coefficients par categorie de plat
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tous les plats ne meritent pas le meme coefficient. La regle d'or : un coefficient eleve
              sur les categories a faible cout matiere (boissons, desserts) compense un coefficient
              plus bas sur les plats nobles (viande, poisson). Le mix global doit converger vers votre
              food cost cible.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Categorie</th>
                  <th className="text-center py-3 px-4 font-semibold">Coefficient</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost cible</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Logique commerciale</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { cat: 'Amuse-bouche', coef: 'x 5,0 a 6,0', fc: '17-20 %', l: 'Petite portion, ingredients faibles cout' },
                  { cat: 'Entrees froides', coef: 'x 3,0 a 3,5', fc: '29-33 %', l: 'Charcuterie, salades : cout matiere visible' },
                  { cat: 'Entrees chaudes', coef: 'x 3,5 a 4,0', fc: '25-29 %', l: 'Cuisson en plus, valeur percue plus haute' },
                  { cat: 'Plats poisson noble', coef: 'x 3,0 a 3,5', fc: '29-33 %', l: 'Produit cher au kilo, coefficient contenu' },
                  { cat: 'Plats viande noble', coef: 'x 3,5 a 4,0', fc: '25-29 %', l: 'Acceptation prix client plus elevee' },
                  { cat: 'Plats vegetariens', coef: 'x 4,0 a 5,0', fc: '20-25 %', l: 'Cout matiere bas, marge importante' },
                  { cat: 'Pizzas / Burgers', coef: 'x 4,0 a 6,0', fc: '17-25 %', l: 'Ingredients de base accessibles' },
                  { cat: 'Desserts', coef: 'x 4,0 a 5,5', fc: '18-25 %', l: 'Cout matiere derisoire, valeur percue forte' },
                  { cat: 'Boissons chaudes', coef: 'x 8,0 a 12,0', fc: '8-13 %', l: 'Cafe a 0,15 EUR vendu 2-4 EUR' },
                  { cat: 'Cocktails', coef: 'x 4,0 a 6,0', fc: '17-25 %', l: 'Alcool + jus, cout maitrise' },
                  { cat: 'Vins au verre', coef: 'x 4,0 a 5,0', fc: '20-25 %', l: 'Bouteille 5 verres, coefficient eleve' },
                  { cat: 'Vins en bouteille', coef: 'x 2,5 a 3,5', fc: '29-40 %', l: 'Ticket eleve, coefficient plus bas' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.cat}</td>
                    <td className="py-3 px-4 text-center font-bold text-teal-700">{row.coef}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-sm">{row.l}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Par type de cuisine ═════════════ */}
        <section id="cuisines" className="mb-16">
          <SectionHeading icon={<Pizza className="w-6 h-6" />} number="5">
            Coefficients par type de cuisine
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le coefficient multiplicateur varie aussi selon le type de cuisine. Voici les fourchettes
              constatees en France en 2026, issues du benchmark RestauMargin (520 restaurants connectees)
              et croisees avec les donnees Fiducial.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type de cuisine</th>
                  <th className="text-center py-3 px-4 font-semibold">Coefficient moyen</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Pourquoi</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { t: 'Pizzeria traditionnelle', c: 'x 4,0 a 5,5', fc: '18-25 %', w: 'Farine, tomate, mozzarella : tres peu couteux' },
                  { t: 'Pizzeria napolitaine premium', c: 'x 3,3 a 4,0', fc: '25-30 %', w: 'Ingredients DOP, marges plus serrees' },
                  { t: 'Creperie', c: 'x 4,5 a 6,0', fc: '17-22 %', w: 'Farine, oeufs, lait : cout minimal' },
                  { t: 'Cuisine asiatique', c: 'x 3,5 a 4,5', fc: '22-29 %', w: 'Riz, nouilles, legumes accessibles' },
                  { t: 'Cuisine italienne (carte large)', c: 'x 3,0 a 4,0', fc: '25-33 %', w: 'Pates peu couteuses, fromages plus chers' },
                  { t: 'Bistrot francais', c: 'x 3,0 a 3,5', fc: '29-33 %', w: 'Produits de marche, viandes' },
                  { t: 'Brasserie traditionnelle', c: 'x 3,3 a 4,0', fc: '25-30 %', w: 'Carte large, volume eleve, prix accessible' },
                  { t: 'Cuisine de la mer', c: 'x 2,8 a 3,5', fc: '29-36 %', w: 'Poissons et fruits de mer couteux' },
                  { t: 'Gastronomique', c: 'x 2,5 a 3,3', fc: '30-40 %', w: 'Produits premium, travail technique' },
                  { t: 'Burger gourmet', c: 'x 3,5 a 4,5', fc: '22-29 %', w: 'Cout viande modere, vente additionnelle' },
                  { t: 'Cuisine vegetarienne / vegan', c: 'x 4,0 a 5,0', fc: '20-25 %', w: 'Legumes, legumineuses accessibles' },
                  { t: 'Sushi / Japonais traditionnel', c: 'x 3,0 a 4,0', fc: '25-33 %', w: 'Poisson cru de qualite, riz peu couteux' },
                  { t: 'Coffee shop / brunch', c: 'x 5,0 a 8,0', fc: '12-20 %', w: 'Cafe et patisseries a fort coefficient' },
                  { t: 'Bar a vins / cave a manger', c: 'x 3,0 a 4,0', fc: '25-33 %', w: 'Vins en majorite, marge boisson' },
                  { t: 'Food truck', c: 'x 3,5 a 5,0', fc: '20-29 %', w: 'Charges fixes basses, volume limite' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.t}</td>
                    <td className="py-3 px-4 text-center font-bold text-teal-700">{row.c}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-sm">{row.w}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Source :</strong> benchmark RestauMargin avril 2026 sur 520 restaurants francais
            connectees, croise avec les donnees Fiducial Observatoire 2025 et GIRA Conseil.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Table de conversion ═════════════ */}
        <section id="table" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="6">
            Table de conversion : coefficient, food cost et marge brute
          </SectionHeading>

          <div className="prose-content">
            <p>
              Ce tableau de reference vous permet de convertir instantanement entre coefficient
              multiplicateur, food cost et marge brute. Affichez-le dans votre bureau cuisine.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Coefficient</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge brute</th>
                  <th className="text-center py-3 px-4 font-semibold">Exemple (cout 5 EUR)</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Verdict</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { c: 'x 1,5', fc: '66,7 %', mb: '33,3 %', ex: '7,50 EUR HT', v: 'Tres insuffisant', col: 'text-red-600' },
                  { c: 'x 2,0', fc: '50,0 %', mb: '50,0 %', ex: '10,00 EUR HT', v: 'Insuffisant', col: 'text-red-600' },
                  { c: 'x 2,5', fc: '40,0 %', mb: '60,0 %', ex: '12,50 EUR HT', v: 'Gastro premium', col: 'text-amber-600' },
                  { c: 'x 3,0', fc: '33,3 %', mb: '66,7 %', ex: '15,00 EUR HT', v: 'Acceptable', col: 'text-amber-600' },
                  { c: 'x 3,33', fc: '30,0 %', mb: '70,0 %', ex: '16,65 EUR HT', v: 'Optimal bistrot', col: 'text-emerald-600' },
                  { c: 'x 3,5', fc: '28,6 %', mb: '71,4 %', ex: '17,50 EUR HT', v: 'Optimal brasserie', col: 'text-emerald-600' },
                  { c: 'x 4,0', fc: '25,0 %', mb: '75,0 %', ex: '20,00 EUR HT', v: 'Tres bon', col: 'text-emerald-600' },
                  { c: 'x 4,5', fc: '22,2 %', mb: '77,8 %', ex: '22,50 EUR HT', v: 'Excellent', col: 'text-emerald-600' },
                  { c: 'x 5,0', fc: '20,0 %', mb: '80,0 %', ex: '25,00 EUR HT', v: 'Pizzeria / dessert', col: 'text-emerald-600' },
                  { c: 'x 6,0', fc: '16,7 %', mb: '83,3 %', ex: '30,00 EUR HT', v: 'Boisson chaude', col: 'text-emerald-600' },
                  { c: 'x 8,0', fc: '12,5 %', mb: '87,5 %', ex: '40,00 EUR HT', v: 'Cafe / the', col: 'text-emerald-600' },
                  { c: 'x 10,0', fc: '10,0 %', mb: '90,0 %', ex: '50,00 EUR HT', v: 'Cafe premium', col: 'text-emerald-600' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-bold text-teal-700">{row.c}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-center">{row.mb}</td>
                    <td className="py-3 px-4 text-center text-mono-500">{row.ex}</td>
                    <td className={`py-3 px-4 text-center text-xs font-semibold ${row.col}`}>{row.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p>
              <strong>Lecture du tableau :</strong> un coefficient sous x 3,0 indique soit un food cost
              trop eleve (cout matiere demesure pour le marche), soit une sous-tarification chronique.
              Un coefficient au-dessus de x 4,0 signale soit une categorie a forte marge naturelle
              (boissons, desserts), soit une sur-tarification a verifier vis-a-vis du marche local.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Cas pratiques ═════════════ */}
        <section id="cas-pratiques" className="mb-16">
          <SectionHeading icon={<Pizza className="w-6 h-6" />} number="7">
            Cas pratiques chiffres
          </SectionHeading>

          <div className="prose-content">
            <p>
              Trois cas chiffres complets pour visualiser comment le coefficient multiplicateur s'applique
              concretement selon le type de restaurant et la categorie de plat.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <CasCard
              icon={<Pizza className="w-6 h-6" />}
              title="Pizza margherita en pizzeria parisienne"
              data={[
                { label: 'Cout matiere total (pate + tomate + mozzarella + huile)', value: '1,58 EUR' },
                { label: 'Coefficient cible pizzeria', value: 'x 6,33' },
                { label: 'Prix de vente HT', value: '10,00 EUR' },
                { label: 'Prix TTC (TVA 10 %)', value: '11,00 EUR' },
                { label: 'Prix arrondi carte', value: '10,90 EUR' },
                { label: 'Coefficient effectif apres arrondi', value: 'x 6,27' },
                { label: 'Marge brute par pizza', value: '8,32 EUR' },
                { label: 'Food cost effectif', value: '16,0 %' },
              ]}
              comment="Coefficient tres eleve typique de la pizzeria. Le defi n'est pas le food cost mais le volume. A 60 pizzas/jour : 8,32 x 60 = 499 EUR de marge brute quotidienne uniquement sur les margheritas."
            />
            <CasCard
              icon={<Beef className="w-6 h-6" />}
              title="Entrecote grillee en brasserie"
              data={[
                { label: 'Cout matiere (entrecote 220g + frites + sauce + garniture)', value: '8,05 EUR' },
                { label: 'Coefficient cible brasserie', value: 'x 3,16' },
                { label: 'Prix de vente HT', value: '25,45 EUR' },
                { label: 'Prix TTC (TVA 10 %)', value: '28,00 EUR' },
                { label: 'Prix arrondi carte', value: '27,90 EUR' },
                { label: 'Coefficient effectif apres arrondi', value: 'x 3,15' },
                { label: 'Marge brute par plat', value: '17,30 EUR' },
                { label: 'Food cost effectif', value: '31,7 %' },
              ]}
              comment="Coefficient plus bas mais marge en EUR superieure (17,30 EUR vs 8,32 EUR pour la pizza). Le ticket moyen compense le coefficient inferieur. Ne jugez jamais un plat sur le coefficient seul."
            />
            <CasCard
              icon={<Coffee className="w-6 h-6" />}
              title="Cappuccino en coffee shop"
              data={[
                { label: 'Cout matiere (cafe 8g + lait 200ml + sucre)', value: '0,32 EUR' },
                { label: 'Coefficient cible coffee shop', value: 'x 13,13' },
                { label: 'Prix de vente HT', value: '4,20 EUR' },
                { label: 'Prix TTC (TVA 10 %)', value: '4,62 EUR' },
                { label: 'Prix arrondi carte', value: '4,50 EUR' },
                { label: 'Coefficient effectif apres arrondi', value: 'x 12,80' },
                { label: 'Marge brute par cappuccino', value: '3,77 EUR' },
                { label: 'Food cost effectif', value: '7,8 %' },
              ]}
              comment="Coefficient extreme (x 13) typique des boissons chaudes. Marge brute de 92 %. C'est ce qui permet a un coffee shop d'etre rentable avec un ticket moyen de 6-8 EUR."
            />
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Menu engineering ═════════════ */}
        <section id="menu-engineering" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="8">
            Coefficient et menu engineering : le duo gagnant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le coefficient multiplicateur seul ne suffit pas. Combine avec le menu engineering
              (matrice BCG appliquee au restaurant), il devient un outil de pilotage strategique.
              Le menu engineering classe vos plats en 4 categories selon 2 axes :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li><strong>Stars</strong> : forte popularite + fort coefficient. A pousser en priorite.</li>
              <li><strong>Chevaux de labour</strong> : forte popularite + coefficient moyen-bas. Plats d'appel a garder.</li>
              <li><strong>Puzzles (enigmes)</strong> : faible popularite + fort coefficient. A repositionner sur la carte.</li>
              <li><strong>Poids morts (dogs)</strong> : faible popularite + faible coefficient. A retirer ou refondre.</li>
            </ul>
            <p className="mt-4">
              Le coefficient seul vous dit qu'un plat est rentable. Le menu engineering vous dit si vos
              clients le commandent. Les deux ensemble vous permettent d'optimiser le mix produit
              pour maximiser la marge globale. Voir notre <Link to="/blog/menu-engineering" className="text-teal-700 underline hover:text-teal-800">guide complet du menu engineering</Link> pour
              la methode complete.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Cas menu ═════════════ */}
        <section id="cas-menu" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="9">
            Cas pratique : menu complet a 35 EUR
          </SectionHeading>

          <div className="prose-content">
            <p>
              Vous lancez un menu entree + plat + dessert a 35 EUR TTC, soit 31,82 EUR HT. Votre food
              cost cible global est de 28 % (brasserie moderne), soit un budget matiere total de
              31,82 x 0,28 = 8,91 EUR. Voici comment repartir ce budget entre les 3 plats avec un
              coefficient adapte a chaque categorie.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Element</th>
                  <th className="text-right py-3 px-4 font-semibold">Budget matiere</th>
                  <th className="text-center py-3 px-4 font-semibold">Coefficient applique</th>
                  <th className="text-right py-3 px-4 font-semibold">Equivalent HT</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">% du menu</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { e: 'Entree', b: '2,00 EUR', c: 'x 3,5', ht: '7,00 EUR', p: '22 %' },
                  { e: 'Plat principal', b: '5,50 EUR', c: 'x 3,0', ht: '16,50 EUR', p: '52 %' },
                  { e: 'Dessert', b: '1,41 EUR', c: 'x 5,9', ht: '8,32 EUR', p: '26 %' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.e}</td>
                    <td className="py-3 px-4 text-right">{row.b}</td>
                    <td className="py-3 px-4 text-center font-bold text-teal-700">{row.c}</td>
                    <td className="py-3 px-4 text-right">{row.ht}</td>
                    <td className="py-3 px-4 text-right">{row.p}</td>
                  </tr>
                ))}
                <tr className="bg-teal-50 border-t-2 border-teal-200">
                  <td className="py-3 px-4 font-bold text-mono-100">Total menu</td>
                  <td className="py-3 px-4 text-right font-bold text-mono-100">8,91 EUR</td>
                  <td className="py-3 px-4 text-center font-bold text-teal-700">x 3,57 moyen</td>
                  <td className="py-3 px-4 text-right font-bold text-mono-100">31,82 EUR HT</td>
                  <td className="py-3 px-4 text-right font-bold text-mono-100">100 %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Analyse :</strong> avec un coefficient module par categorie (3,5 / 3,0 / 5,9),
              vous obtenez un coefficient moyen de 3,57, soit un food cost global de 28 % parfaitement
              conforme a la cible. Si vous aviez applique un coefficient uniforme de 3,0 :
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-3">
              <li>Budget matiere total a 31,82 EUR / 3 = <strong>10,61 EUR par menu</strong></li>
              <li>Food cost effectif = 10,61 / 31,82 = <strong>33,3 %</strong></li>
              <li>Marge brute supplementaire avec coefficients modules : <strong>1,70 EUR par menu</strong></li>
            </ul>
            <p className="mt-4">
              Sur 1 200 menus servis par mois (40/jour x 30 jours), c'est <strong>2 040 EUR de marge
              brute supplementaire mensuelle</strong>, soit <strong>24 480 EUR par an</strong> sans changer
              un seul plat. Juste en modulant les coefficients par categorie.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 10 : Erreurs ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="10">
            Les 7 erreurs courantes qui detruisent vos marges
          </SectionHeading>

          <div className="space-y-5 mt-8">
            <ErreurCard
              number={1}
              title="Appliquer un coefficient unique a toute la carte"
              desc="L'erreur la plus repandue. Chaque categorie a une valeur percue et une structure de cout differente. Adaptez par categorie et par plat selon la valeur percue. Sinon vous laissez 2 000 a 5 000 EUR par mois de marge sur la table."
            />
            <ErreurCard
              number={2}
              title="Oublier les pertes et le rendement"
              desc="Utilisez toujours le cout matiere net (apres epluchage, parage, cuisson, casse). Un kilo de carottes brutes ne donne que 800 g utilisables. Si vous oubliez ce facteur, votre coefficient est sous-estime de 20-25 % et votre marge fond."
            />
            <ErreurCard
              number={3}
              title="Ignorer la volatilite des prix fournisseurs"
              desc="Revisez vos fiches techniques au minimum chaque trimestre. Le beurre est passe de 4 EUR/kg a 9 EUR/kg en 18 mois. Si votre fiche technique affiche encore 4 EUR/kg, votre coefficient effectif est divise par 2 et votre marge plonge."
            />
            <ErreurCard
              number={4}
              title="Ne pas tenir compte de la TVA"
              desc="Calculez en HT, puis ajoutez la TVA. Si vous appliquez le coefficient sur un prix TTC, votre food cost est sous-estime de 10 % et vous biaisez tous les calculs. En France : x 1,10 sur place, x 1,055 a emporter froid, x 1,20 sur alcool."
            />
            <ErreurCard
              number={5}
              title="Se focaliser sur le coefficient sans regarder la marge en EUR"
              desc="Un plat a x 6 mais qui ne rapporte que 4 EUR de marge brute est moins rentable qu'un plat a x 3 qui rapporte 17 EUR. Analysez en combinant coefficient, marge en valeur absolue, et popularite (menu engineering)."
            />
            <ErreurCard
              number={6}
              title="Copier les prix de la concurrence"
              desc="Vos couts ne sont pas ceux du voisin. Partez toujours de VOS couts reels et de VOTRE coefficient cible. Utilisez la concurrence comme borne de calibrage, pas comme reference de tarification."
            />
            <ErreurCard
              number={7}
              title="Ne pas integrer le cout main d'oeuvre sur les plats complexes"
              desc="Un plat a 1 h de mise en place mobilise 22-28 EUR/h de cout cuisinier. Sur les plats complexes, ajoutez ce cout au food cost pour obtenir le 'prime cost' reel. Un plat avec prime cost superieur a 60 % du PV est a refondre."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumule :</strong> ces sept erreurs combinees peuvent representer une perte
            de 6 a 12 points de marge brute. Sur un restaurant a 500 000 EUR de CA annuel, c'est
            entre 30 000 EUR et 60 000 EUR de marge potentielle qui disparait chaque annee.
          </Callout>
        </section>

        {/* ═════════════ SECTION 11 : Automatiser ═════════════ */}
        <section id="automatiser" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="11">
            Automatiser avec RestauMargin
          </SectionHeading>

          <div className="prose-content">
            <p>
              Calculer manuellement les coefficients d'une carte de 40 plats prend 4 a 8 heures. Et il
              faut recommencer a chaque rotation de saison ou changement de fournisseur. RestauMargin
              calcule automatiquement le coefficient et le food cost de chaque plat, vous alerte quand
              les prix fournisseurs changent, et genere votre matrice de menu engineering en temps reel.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Calculator className="w-5 h-5" />, title: 'Fiches techniques automatiques', desc: 'Coefficient calcule en temps reel a partir des prix fournisseurs. Mise a jour automatique a chaque variation.' },
              { icon: <Target className="w-5 h-5" />, title: 'Coefficient cible par categorie', desc: 'Definissez un coefficient cible par categorie (entrees, plats viande, desserts, etc.). RestauMargin alerte des derives.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Benchmark automatique', desc: 'Comparaison avec la mediane du marche local (50+ etablissements connectees dans votre zone).' },
              { icon: <Brain className="w-5 h-5" />, title: 'Menu engineering integre', desc: 'Matrice BCG generee automatiquement : Stars, Cash Cows, Question Marks, Dogs. Recommandations d\'actions.' },
              { icon: <AlertTriangle className="w-5 h-5" />, title: 'Alertes de derive', desc: 'Notification quand un plat franchit le seuil de coefficient minimum (par exemple x 3,0).' },
              { icon: <DollarSign className="w-5 h-5" />, title: 'Scan de factures (OCR)', desc: 'Photographiez vos factures fournisseurs : prix extraits automatiquement et fiches techniques mises a jour.' },
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
              Plus de 500 restaurants utilisent RestauMargin pour piloter leur tarification. Le gain
              moyen constate sur les 6 premiers mois : <strong>+3,5 points de marge brute</strong>,
              grace a une meilleure allocation des coefficients par poste et a l'identification
              automatique des derives. Pour aller plus loin, lisez aussi notre <Link to="/blog/food-cost" className="text-teal-700 underline hover:text-teal-800">guide du food cost</Link>, notre <Link to="/blog/prime-cost" className="text-teal-700 underline hover:text-teal-800">guide du prime cost</Link>, et notre <Link to="/blog/seuil-rentabilite-restaurant" className="text-teal-700 underline hover:text-teal-800">guide du seuil de rentabilite</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-03-20" readTime="15 min" variant="footer" />

        {/* ═════════════ Points cles ═════════════ */}
        <div className="bg-mono-1000 border border-mono-900 rounded-xl p-6 my-12">
          <h3 className="text-base font-bold text-mono-100 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            Points cles a retenir
          </h3>
          <ol className="space-y-2 text-sm text-mono-350">
            <li>1. Le coefficient multiplicateur convertit le cout matiere en prix de vente HT.</li>
            <li>2. Coefficient = 1 / Food cost cible.</li>
            <li>3. N'appliquez jamais un coefficient unique a toute la carte.</li>
            <li>4. Les desserts et boissons meritent les coefficients les plus eleves (x 4 a x 12).</li>
            <li>5. Les plats nobles (viande, poisson) ont les coefficients les plus bas (x 2,5 a x 3,5).</li>
            <li>6. Calculez sur le cout matiere net (apres rendement et pertes).</li>
            <li>7. Calculez en HT, jamais en TTC.</li>
            <li>8. Revisez vos coefficients tous les 3 mois minimum.</li>
            <li>9. Combinez coefficient et menu engineering pour maximiser la marge globale.</li>
            <li>10. Verifiez le coefficient effectif apres arrondi psychologique.</li>
          </ol>
        </div>

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes sur le coefficient multiplicateur</h2>
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
              Calculez vos coefficients en 5 minutes
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Testez RestauMargin gratuitement et voyez le coefficient, le food cost et la marge reelle
              de chacun de vos plats automatiquement.
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
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant : guide 2026</h3>
              <p className="text-xs text-mono-500">Marge brute, marge nette, food cost : toutes les formules.</p>
            </Link>
            <Link to="/blog/prix-de-vente-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Prix de vente d'un plat</h3>
              <p className="text-xs text-mono-500">3 methodes : coefficient, marge cible, pricing psychologique.</p>
            </Link>
            <Link to="/blog/food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le food cost</h3>
              <p className="text-xs text-mono-500">10 strategies eprouvees pour baisser le food cost.</p>
            </Link>
            <Link to="/outils/calculateur-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calculateur food cost gratuit</h3>
              <p className="text-xs text-mono-500">Outil en ligne, sans inscription, calcul instantane.</p>
            </Link>
          </div>
        </section>

        {/* ═════════════ Sources ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Sources et references</h2>
          <ul className="space-y-2 text-sm text-mono-500">
            <li><strong>Fiducial Observatoire de la Restauration 2025</strong> &mdash; <a href="https://www.fiducial.fr/Observatoire-de-la-restauration" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline hover:text-teal-800">https://www.fiducial.fr/Observatoire-de-la-restauration</a></li>
            <li><strong>INSEE : indices de prix a la consommation alimentaire 2023-2025</strong> &mdash; <a href="https://www.insee.fr/fr/statistiques/serie/010540933" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline hover:text-teal-800">https://www.insee.fr</a></li>
            <li><strong>GIRA Conseil : Etudes de marche restauration 2024-2025</strong> &mdash; <a href="https://www.gira-conseil.com/" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline hover:text-teal-800">https://www.gira-conseil.com</a></li>
            <li><strong>KPMG Hospitality Benchmark 2025</strong> &mdash; ratios sectoriels restauration en Europe</li>
            <li><strong>Benchmark RestauMargin avril 2026</strong> &mdash; 520 restaurants francais connectees</li>
            <li><strong>Code general des impots, article 279 et 296</strong> &mdash; taux de TVA applicables a la restauration</li>
          </ul>
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

function ErreurCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-mono-100 mb-1.5">{title}</h3>
        <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function CasCard({ icon, title, data, comment }: {
  icon: React.ReactNode;
  title: string;
  data: { label: string; value: string }[];
  comment: string;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-bold text-mono-100 text-lg">{title}</h3>
      </div>
      <div className="space-y-2 mb-4">
        {data.map((row, i) => (
          <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-mono-1000 last:border-b-0">
            <span className="text-mono-500">{row.label}</span>
            <span className="font-bold text-mono-100">{row.value}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-mono-500 italic leading-relaxed bg-mono-1000 rounded-lg p-3 mt-3">{comment}</p>
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
