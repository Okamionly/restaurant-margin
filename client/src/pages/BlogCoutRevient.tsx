import { Link } from 'react-router-dom';
import {
  ChefHat,
  BookOpen,
  Calculator,
  Scissors,
  Table,
  RefreshCw,
  AlertTriangle,
  ClipboardList,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Lightbulb,
  Beef,
  Pizza,
  Salad,
  Cookie,
  Sparkles,
  Target,
  Percent,
  DollarSign,
  Zap,
  ListChecks,
  Award,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Coût de revient restaurant : guide complet 2026"
   Mot-clé principal : coût de revient restaurant
   ~3 500 mots — mode clair, fond blanc, typo lisible, teal-600
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quelle est la différence entre coût de revient et food cost ?",
    answer: "Le coût de revient est la somme totale en euros de tous les coûts pour produire un plat (matières premières + main d'œuvre directe + emballage + énergie + amortissements). Le food cost est uniquement le ratio matières premières / prix de vente HT exprimé en pourcentage. Le coût de revient est une valeur absolue (8,20 €), le food cost est un pourcentage (32 %). Le coût de revient sert à calculer la marge unitaire, le food cost à comparer la rentabilité entre plats.",
  },
  {
    question: "Comment calculer le coût de revient d'un plat étape par étape ?",
    answer: "Cinq étapes : 1) Lister tous les ingrédients avec quantités nettes (après parage et perte cuisson). 2) Appliquer le prix d'achat HT moyen pondéré 3 mois. 3) Ajouter la main d'œuvre directe (temps de production × coût horaire chargé). 4) Inclure l'emballage (barquette livraison, serviette, à-côtés). 5) Ajouter une quote-part d'énergie et fluides (0,15 à 0,30 € par couvert). Total = coût de revient unitaire.",
  },
  {
    question: "Faut-il intégrer la main-d'œuvre dans le coût de revient ?",
    answer: "Oui, dans la définition stricte du coût de revient complet. La main-d'œuvre directe (temps cuisinier pour préparer le plat) fait partie du coût de production. Comptez environ 2 à 5 minutes par plat × coût horaire chargé (22 à 28 € en France). Pour un coût horaire de 25 € et 3 minutes : 1,25 € de main-d'œuvre par plat. Si vous calculez uniquement le food cost (matières), excluez la main-d'œuvre.",
  },
  {
    question: "Quel est le ratio cible de coût de revient en restauration ?",
    answer: "Le coût de revient complet (matières + main d'œuvre + emballage + énergie) devrait représenter 55 à 65 % du prix de vente HT pour garantir une marge nette positive après loyer et charges fixes. Décomposition typique : food cost 30 %, main d'œuvre directe 12 %, emballage 3 %, énergie 5 %, divers 5 %. Le reste (35-45 %) couvre loyer, marketing, taxes et marge nette (5-15 %).",
  },
  {
    question: "Comment intégrer les pertes au parage et à la cuisson ?",
    answer: "Distinguez la quantité brute achetée et la quantité nette servie. Exemple : filet de poisson entier acheté 18 €/kg avec 65 % de pertes (arêtes, peau, parure) → prix réel utilisable 51,40 €/kg (18 / 0,35). Pour chaque ingrédient, calculez le rendement = poids net / poids brut. Ratio courants : viandes 70-90 %, poissons entiers 30-50 %, légumes racines 75-85 %, salades 65-75 %.",
  },
  {
    question: "Faut-il intégrer le coût de l'huile de cuisson dans la fiche technique ?",
    answer: "Oui, mais sous forme de forfait moyen (0,10 à 0,20 € par portion) car le pesage exact à chaque cuisson est irréaliste. Calculez votre consommation mensuelle d'huile et divisez par le nombre de couverts. Idem pour le sel, poivre, herbes : forfait global de 0,05 à 0,15 € par plat.",
  },
  {
    question: "Comment gérer un plat à plusieurs garnitures interchangeables ?",
    answer: "Créez une fiche technique par variante. Le filet de bœuf avec frites, gratin dauphinois ou légumes grillés a 3 coûts différents. Calculez la moyenne pondérée selon la fréquence de chaque garniture vendue. Si 50 % choisissent frites (1,20 €), 30 % gratin (1,80 €) et 20 % légumes (2,30 €), coût moyen garniture = 1,60 €.",
  },
  {
    question: "Mon coût calculé est 8,20 € mais je ressens que ça coûte plus cher. Pourquoi ?",
    answer: "Vous oubliez probablement : sauce et fonds (0,50-1 €), pain et beurre offerts (0,30 €), pertes au dressage (5-8 %), erreurs de portionnage (10-15 % d'écart), vol et casse (2-4 %), gaspillage matière première (3-7 %). Le coût réel est souvent 15-25 % au-dessus du calcul théorique. Faites un inventaire mensuel pour mesurer l'écart.",
  },
  {
    question: "À quelle fréquence faut-il recalculer le coût de revient ?",
    answer: "Idéalement mensuellement pour les produits frais (viandes, poissons, légumes saisonniers) dont les prix bougent vite. Trimestriellement pour fromages, charcuterie et produits secs. Annuellement pour vins et alcools. Sans cette mise à jour, votre food cost peut dériver de 28 % vers 34 % en 6 mois — soit 6 points de marge brute perdus sans s'en rendre compte.",
  },
  {
    question: "Quels outils utiliser pour calculer le coût de revient ?",
    answer: "Trois niveaux : 1) Tableur Excel ou Google Sheets pour 1-10 plats (gratuit mais chronophage). 2) Application gratuite comme le calculateur food cost RestauMargin pour calculs ponctuels. 3) Logiciel de gestion comme RestauMargin pour gérer toute la carte avec mise à jour automatique des prix fournisseurs, alertes de dérive, menu engineering et analyse de rentabilité. Le passage au logiciel se justifie dès 15+ plats actifs.",
  },
];

export default function BlogCoutRevient() {
  const faqSchema = buildFAQSchema(faqItems);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
    { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
    { name: "Coût de revient restaurant", url: 'https://www.restaumargin.fr/blog/cout-revient-plat-restaurant' },
  ]);

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Comment calculer le coût de revient d\'un plat de restaurant en 5 étapes',
    description: "Méthode pas-à-pas pour calculer le coût de revient complet d'un plat : matières, main d'œuvre, emballage, énergie.",
    totalTime: 'PT20M',
    tool: ['Balance de cuisine', 'Calculatrice', 'Fiches techniques', 'Logiciel RestauMargin'],
    step: [
      {
        '@type': 'HowToStep',
        name: 'Lister tous les ingrédients et grammages nets',
        text: "Listez chaque ingrédient avec sa quantité nette (après parage et perte cuisson). Pesez systématiquement, n'estimez jamais.",
      },
      {
        '@type': 'HowToStep',
        name: 'Appliquer le prix d\'achat moyen pondéré HT',
        text: 'Pour chaque ingrédient, multipliez la quantité nette par le prix d\'achat moyen pondéré sur 3 mois, frais de port inclus.',
      },
      {
        '@type': 'HowToStep',
        name: 'Ajouter la main d\'œuvre directe',
        text: 'Mesurez le temps de production par plat (2-5 min) et multipliez par le coût horaire chargé du cuisinier (22-28 €/h).',
      },
      {
        '@type': 'HowToStep',
        name: 'Inclure l\'emballage et les à-côtés',
        text: 'Pain, beurre, serviette, barquette livraison, sauce et fond : forfait 0,30 à 0,80 € par couvert.',
      },
      {
        '@type': 'HowToStep',
        name: 'Ajouter quote-part énergie et amortissements',
        text: 'Énergie de cuisson et amortissement matériel : forfait 0,15 à 0,30 € par couvert. Total = coût de revient complet.',
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: "Coût de revient restaurant : guide complet 2026 (formule + 5 exemples)",
    description: "Calculez précisément le coût de revient de chaque plat de votre carte : formule, méthode pas à pas, 5 exemples chiffrés (burger, salade, pizza, pâtes, dessert), erreurs courantes, outils.",
    image: 'https://www.restaumargin.fr/og-image.png',
    author: { '@type': 'Organization', name: 'La rédaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
    publisher: {
      '@type': 'Organization',
      name: 'RestauMargin',
      logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
    },
    datePublished: '2026-05-26',
    dateModified: '2026-05-26',
    wordCount: 3500,
    inLanguage: 'fr-FR',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/cout-revient-plat-restaurant' },
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Coût de revient restaurant : guide complet 2026 (formule + exemples)"
        description="Comment calculer le coût de revient d'un plat de restaurant : formule, méthode pas à pas, 5 exemples chiffrés (burger, salade, pizza, pâtes, dessert). Erreurs courantes, ratio cible, outils."
        path="/blog/cout-revient-plat-restaurant"
        type="article"
        schema={[faqSchema, breadcrumbSchema, howToSchema, articleSchema]}
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
              Calculer un coût
            </Link>
            <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs visibles */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Coût de revient restaurant</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Marges"
        readTime="18 min"
        date="Mai 2026"
        title="Coût de revient restaurant : guide complet 2026 (formule + exemples)"
        accentWord="coût de revient"
        subtitle="Méthode pas à pas, formule complète, 5 exemples chiffrés (burger, salade niçoise, pizza margherita, pâtes carbonara, fondant chocolat) avec tableaux matière + main d'œuvre + emballage. Erreurs courantes, ratios cibles et outils pour automatiser."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8">
          Combien coûte <strong>réellement</strong> votre plat phare ? Si vous avez répondu à la louche, vous faites comme <strong>70 % des restaurateurs indépendants</strong> — et vous perdez probablement entre 1 500 € et 4 000 € par mois sur des plats mal calculés. Le <strong>coût de revient d'un plat</strong> n'est pas un chiffre approximatif : c'est le socle de toute votre tarification, de votre marge brute et de votre rentabilité. Ce guide complet vous donne la formule exacte, la méthode pas à pas, 5 exemples chiffrés sur des plats classiques de la cuisine française et tous les outils pour reprendre le contrôle.
        </p>

        {/* Encadré formule rapide */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formule essentielle</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            La formule du coût de revient complet
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Coût matières</strong> = Σ (Qté nette × Prix d'achat HT)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Main d'œuvre directe</strong> = Temps × Coût horaire chargé</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Emballage + à-côtés</strong> = 0,30 à 0,80 € / couvert</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Énergie + amortissements</strong> = 0,15 à 0,30 € / couvert</span>
            </div>
            <div className="flex items-start gap-2 pt-2 border-t border-white/20">
              <span className="text-teal-200 font-bold">=</span>
              <span><strong className="text-white">COÛT DE REVIENT COMPLET</strong> en € / portion</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectif : coût de revient complet entre 55 % et 65 % du prix de vente HT pour garantir une marge nette positive après loyer, marketing et charges fixes.
          </p>
        </div>

        {/* Sommaire */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#definition', label: "Définition du coût de revient + formule complète" },
              { href: '#methode', label: "Méthode de calcul pas à pas en 5 étapes" },
              { href: '#exemple-burger', label: "Exemple 1 : burger maison gourmand" },
              { href: '#exemple-salade', label: "Exemple 2 : salade niçoise" },
              { href: '#exemple-pizza', label: "Exemple 3 : pizza margherita" },
              { href: '#exemple-pates', label: "Exemple 4 : pâtes carbonara" },
              { href: '#exemple-dessert', label: "Exemple 5 : fondant au chocolat" },
              { href: '#perte', label: "Le ratio de perte (parage, cuisson, déchets)" },
              { href: '#erreurs', label: "Les 7 erreurs courantes à éviter" },
              { href: '#optimisation', label: "10 stratégies pour optimiser le coût de revient" },
              { href: '#food-cost-diff', label: "Coût de revient vs food cost : la différence" },
              { href: '#ratio-cible', label: "Ratios cibles par type de restaurant" },
              { href: '#outils', label: "Outils pour automatiser le calcul" },
              { href: '#faq', label: "Questions fréquentes (FAQ 10 réponses)" },
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

        {/* ═════════════ SECTION 1 : Définition ═════════════ */}
        <section id="definition" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="1">
            Définition du coût de revient + formule complète
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#374151] leading-relaxed mb-4">
              Le <strong>coût de revient d'un plat</strong> est la somme totale de toutes les charges directes nécessaires pour produire une portion vendue : matières premières, main d'œuvre de cuisine, emballage, énergie de cuisson et amortissement du matériel. C'est une valeur absolue exprimée en euros par portion (ex : 8,20 € pour un steak frites), à différencier du food cost qui est un pourcentage.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              Comprendre cette notion est capital car elle conditionne toute votre stratégie de tarification. Sans coût de revient précis, vous fixez vos prix à l'aveugle, vous comparez mal vos plats entre eux et vous ne savez pas si une hausse fournisseur va éroder votre marge.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-mono-100 mb-4">Les 5 composantes du coût de revient complet</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                  <span className="font-bold text-teal-700 text-sm">1</span>
                </div>
                <div>
                  <p className="font-semibold text-mono-100">Coût matières premières (60-70 % du coût total)</p>
                  <p className="text-sm text-mono-400">Tous les ingrédients utilisés, mesurés en quantité nette (après parage et perte cuisson), valorisés au prix d'achat moyen pondéré HT sur 3 mois.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                  <span className="font-bold text-teal-700 text-sm">2</span>
                </div>
                <div>
                  <p className="font-semibold text-mono-100">Main d'œuvre directe (15-25 % du coût total)</p>
                  <p className="text-sm text-mono-400">Temps de production effectif × coût horaire chargé du cuisinier. En France, comptez 22-28 €/h pour un cuisinier expérimenté charges incluses.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                  <span className="font-bold text-teal-700 text-sm">3</span>
                </div>
                <div>
                  <p className="font-semibold text-mono-100">Emballage et à-côtés (5-10 % du coût total)</p>
                  <p className="text-sm text-mono-400">Pain offert, beurre, serviette, barquette livraison, sauce, décor d'assiette : forfait moyen 0,30 à 0,80 € par couvert servi.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                  <span className="font-bold text-teal-700 text-sm">4</span>
                </div>
                <div>
                  <p className="font-semibold text-mono-100">Énergie de cuisson (3-5 % du coût total)</p>
                  <p className="text-sm text-mono-400">Gaz, électricité, eau utilisés pour la préparation : quote-part calculée sur conso mensuelle / nombre couverts. Environ 0,15 à 0,30 €/couvert.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                  <span className="font-bold text-teal-700 text-sm">5</span>
                </div>
                <div>
                  <p className="font-semibold text-mono-100">Amortissements matériel (1-3 % du coût total)</p>
                  <p className="text-sm text-mono-400">Quote-part du four, piano, robots, vaisselle : amortissement annuel / nombre couverts. Souvent inclus dans l'énergie pour simplifier.</p>
                </div>
              </div>
            </div>
          </div>

          <Callout type="info">
            <strong>Distinction importante :</strong> certains restaurateurs utilisent le terme "coût de revient" uniquement pour les matières (équivalent au food cost en valeur absolue). D'autres utilisent la définition complète incluant main d'œuvre et énergie. Pour la rentabilité réelle, privilégiez toujours la définition complète.
          </Callout>
        </section>

        {/* ═════════════ SECTION 2 : Méthode pas à pas ═════════════ */}
        <section id="methode" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="2">
            Méthode de calcul pas à pas en 5 étapes
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#374151] leading-relaxed mb-4">
              Voici la méthode opérationnelle pour calculer le coût de revient complet de n'importe quel plat de votre carte. Comptez 15 à 25 minutes par fiche la première fois, puis 5 minutes une fois le pli pris. Cette méthode est utilisée par tous les chefs et contrôleurs de gestion en restauration professionnelle.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Lister TOUS les ingrédients sans exception',
                body: "Listez chaque ingrédient avec sa quantité exacte en grammes ou millilitres : ingrédients principaux, garnitures, sauces, marinades, huiles de cuisson, épices, herbes, condiments, décor d'assiette. Plus la fiche est complète, plus le calcul est juste. Les \"petits\" ingrédients (huile, sel, herbes) représentent souvent 5-10 % du coût réel. Pesez systématiquement plutôt que d'estimer à l'œil.",
              },
              {
                title: 'Peser les quantités NETTES (après parage et cuisson)',
                body: "Distinguez la quantité brute achetée et la quantité nette servie. Après parage (gras, nerfs, arêtes, peau), après cuisson si le poids diminue (viande perd 25-35 % à la cuisson), après dénoyautage ou épluchage. Un filet de bœuf entier de 2 kg ne donne que 1,2 kg de portions servies = ratio de perte 40 %. Sans intégrer ce ratio, vous sous-estimez votre coût matière de 40 %.",
              },
              {
                title: "Appliquer le prix d'achat HT moyen pondéré 3 mois",
                body: "Pour chaque ingrédient, utilisez le prix d'achat HT moyen pondéré sur les 3 derniers mois (frais de port et livraison inclus). Cela lisse les variations ponctuelles. Si vous achetez à plusieurs fournisseurs, calculez la moyenne pondérée par volume acheté. Toujours en HT (la TVA est récupérable). Mettez à jour mensuellement pour les produits frais.",
              },
              {
                title: "Ajouter la main d'œuvre directe + emballage",
                body: "Mesurez le temps réel de production par plat (utilisez un chronomètre sur 5 préparations). Pour un plat à 3 minutes et un cuisinier à 25 €/h chargé : 3/60 × 25 = 1,25 €. Ajoutez ensuite l'emballage : pain offert 0,15 €, beurre 0,12 €, décor 0,10 €, barquette livraison 0,35 € le cas échéant. Total emballage moyen : 0,30 à 0,80 €.",
              },
              {
                title: "Inclure énergie + amortissements + total final",
                body: "Quote-part énergie = (facture mensuelle gaz + élec / nombre couverts mois). Compte tenu d'une facture moyenne de 1500 € pour 5000 couverts = 0,30 €/couvert. Quote-part amortissements matériel (four, piano, robots) = environ 0,05 à 0,15 €/couvert. Additionnez les 5 composantes : COÛT DE REVIENT COMPLET = matières + main d'œuvre + emballage + énergie + amortissements.",
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

          <Callout type="info">
            <strong>Astuce gain de temps :</strong> au lieu de refaire ce calcul à la main pour chaque plat, utilisez le <Link to="/outils/calculateur-food-cost" className="underline font-semibold hover:text-teal-700">calculateur de food cost gratuit RestauMargin</Link>. Vous saisissez ingrédients, grammages, prix, temps de production : le coût de revient complet et la marge s'affichent instantanément.
          </Callout>
        </section>

        {/* ═════════════ EXEMPLES — Section intro ═════════════ */}
        <section className="mb-12">
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-mono-100 mb-3 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-teal-600" />
              5 exemples chiffrés de plats français
            </h2>
            <p className="text-[#374151] leading-relaxed">
              Passons à la pratique avec 5 plats représentatifs de la cuisine française servie en bistrot ou brasserie. Chaque exemple détaille le coût matière ligne par ligne, la main d'œuvre, l'emballage et le coût de revient complet. Tous les prix sont en HT au mai 2026, conformes aux mercuriales Metro et Sysco.
            </p>
          </div>
        </section>

        {/* ═════════════ EXEMPLE 1 : Burger ═════════════ */}
        <section id="exemple-burger" className="mb-16">
          <SectionHeading icon={<Beef className="w-6 h-6" />} number="3">
            Exemple 1 : burger maison gourmand
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#374151] leading-relaxed mb-4">
              Burger boeuf charolais 180 g, cheddar, bacon, oignons confits, sauce maison, frites maison. Prix de vente affiché : 17,90 € TTC (soit 16,27 € HT).
            </p>
          </div>

          <div className="mt-6 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Décomposition du coût de revient complet</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Poste</th>
                  <th className="text-right py-2 px-3 font-semibold">Détail</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Steak haché charolais</td><td className="py-2 px-3 text-right">180 g × 14,50 €/kg</td><td className="py-2 px-3 text-right font-medium">2,61 €</td></tr>
                <tr><td className="py-2 px-3">Pain brioche artisan</td><td className="py-2 px-3 text-right">95 g × 6,80 €/kg</td><td className="py-2 px-3 text-right font-medium">0,65 €</td></tr>
                <tr><td className="py-2 px-3">Cheddar affiné 12 mois</td><td className="py-2 px-3 text-right">35 g × 18,50 €/kg</td><td className="py-2 px-3 text-right font-medium">0,65 €</td></tr>
                <tr><td className="py-2 px-3">Bacon fumé</td><td className="py-2 px-3 text-right">30 g × 22,00 €/kg</td><td className="py-2 px-3 text-right font-medium">0,66 €</td></tr>
                <tr><td className="py-2 px-3">Oignons confits maison</td><td className="py-2 px-3 text-right">40 g × 4,50 €/kg</td><td className="py-2 px-3 text-right font-medium">0,18 €</td></tr>
                <tr><td className="py-2 px-3">Sauce burger maison</td><td className="py-2 px-3 text-right">25 g × 8,00 €/kg</td><td className="py-2 px-3 text-right font-medium">0,20 €</td></tr>
                <tr><td className="py-2 px-3">Frites maison Bintje</td><td className="py-2 px-3 text-right">200 g net × 3,20 €/kg</td><td className="py-2 px-3 text-right font-medium">0,64 €</td></tr>
                <tr><td className="py-2 px-3">Salade + cornichons + tomate</td><td className="py-2 px-3 text-right">30 g</td><td className="py-2 px-3 text-right font-medium">0,18 €</td></tr>
                <tr><td className="py-2 px-3">Huile de friture (forfait)</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right font-medium">0,15 €</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total matières</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">5,92 €</td></tr>
                <tr><td className="py-2 px-3">Main d'œuvre directe</td><td className="py-2 px-3 text-right">4 min × 25 €/h</td><td className="py-2 px-3 text-right font-medium">1,67 €</td></tr>
                <tr><td className="py-2 px-3">Emballage + à-côtés</td><td className="py-2 px-3 text-right">serviette + ramequin sauce</td><td className="py-2 px-3 text-right font-medium">0,25 €</td></tr>
                <tr><td className="py-2 px-3">Énergie + amortissements</td><td className="py-2 px-3 text-right">forfait</td><td className="py-2 px-3 text-right font-medium">0,30 €</td></tr>
                <tr className="border-t-2 border-mono-900 bg-teal-50"><td className="py-3 px-3 font-bold text-mono-100">COÛT DE REVIENT COMPLET</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-teal-900 text-base">8,14 €</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p><strong>Analyse :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Food cost matières seules = 5,92 / 16,27 × 100 = <strong>36,4 %</strong> (élevé pour brasserie)</li>
              <li>Coût de revient complet / prix HT = 8,14 / 16,27 × 100 = <strong>50,0 %</strong></li>
              <li>Marge brute (HT - matières) = 16,27 - 5,92 = <strong>10,35 €</strong></li>
              <li>Marge nette unitaire (HT - coût revient complet) = 16,27 - 8,14 = <strong>8,13 €</strong></li>
              <li>Coefficient multiplicateur = 16,27 / 5,92 = <strong>2,75</strong> (acceptable burger gourmand)</li>
            </ul>
            <p className="mt-4">
              <strong>Décision :</strong> food cost matières à 36,4 % est trop élevé pour une brasserie classique. Options : passer le prix à 19,90 € TTC (food cost retombe à 32,7 %), réduire le grammage steak à 150 g (-0,44 €), ou négocier le charolais à 13 €/kg (-0,27 €). Le burger reste rentable en valeur absolue (8,13 € de marge nette) mais le ratio doit être optimisé.
            </p>
          </div>
        </section>

        {/* ═════════════ EXEMPLE 2 : Salade niçoise ═════════════ */}
        <section id="exemple-salade" className="mb-16">
          <SectionHeading icon={<Salad className="w-6 h-6" />} number="4">
            Exemple 2 : salade niçoise
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#374151] leading-relaxed mb-4">
              Classique brasserie : thon mi-cuit, oeuf dur, haricots verts, pommes de terre, tomates, anchois, olives noires, vinaigrette. Prix de vente : 16,50 € TTC (15,00 € HT).
            </p>
          </div>

          <div className="mt-6 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Décomposition du coût de revient complet</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Poste</th>
                  <th className="text-right py-2 px-3 font-semibold">Détail</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Thon rouge mi-cuit</td><td className="py-2 px-3 text-right">100 g net × 28 €/kg</td><td className="py-2 px-3 text-right font-medium">2,80 €</td></tr>
                <tr><td className="py-2 px-3">Salade mesclun</td><td className="py-2 px-3 text-right">80 g × 9,00 €/kg</td><td className="py-2 px-3 text-right font-medium">0,72 €</td></tr>
                <tr><td className="py-2 px-3">Tomates cerises grappes</td><td className="py-2 px-3 text-right">120 g × 4,80 €/kg</td><td className="py-2 px-3 text-right font-medium">0,58 €</td></tr>
                <tr><td className="py-2 px-3">Haricots verts extra-fins</td><td className="py-2 px-3 text-right">70 g × 7,50 €/kg</td><td className="py-2 px-3 text-right font-medium">0,53 €</td></tr>
                <tr><td className="py-2 px-3">Pommes de terre rate</td><td className="py-2 px-3 text-right">90 g × 2,80 €/kg</td><td className="py-2 px-3 text-right font-medium">0,25 €</td></tr>
                <tr><td className="py-2 px-3">Œuf bio (½ œuf)</td><td className="py-2 px-3 text-right">0,5 × 0,40 €/œuf</td><td className="py-2 px-3 text-right font-medium">0,20 €</td></tr>
                <tr><td className="py-2 px-3">Anchois à l'huile</td><td className="py-2 px-3 text-right">15 g × 24 €/kg</td><td className="py-2 px-3 text-right font-medium">0,36 €</td></tr>
                <tr><td className="py-2 px-3">Olives noires Taggiasche</td><td className="py-2 px-3 text-right">25 g × 16 €/kg</td><td className="py-2 px-3 text-right font-medium">0,40 €</td></tr>
                <tr><td className="py-2 px-3">Vinaigrette maison (huile + vinaigre + moutarde)</td><td className="py-2 px-3 text-right">20 ml</td><td className="py-2 px-3 text-right font-medium">0,18 €</td></tr>
                <tr><td className="py-2 px-3">Basilic, ciboulette, fleur de sel</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right font-medium">0,12 €</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total matières</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">6,14 €</td></tr>
                <tr><td className="py-2 px-3">Main d'œuvre directe</td><td className="py-2 px-3 text-right">5 min × 25 €/h</td><td className="py-2 px-3 text-right font-medium">2,08 €</td></tr>
                <tr><td className="py-2 px-3">Emballage + à-côtés</td><td className="py-2 px-3 text-right">pain + serviette</td><td className="py-2 px-3 text-right font-medium">0,25 €</td></tr>
                <tr><td className="py-2 px-3">Énergie + amortissements</td><td className="py-2 px-3 text-right">forfait (peu de cuisson)</td><td className="py-2 px-3 text-right font-medium">0,15 €</td></tr>
                <tr className="border-t-2 border-mono-900 bg-teal-50"><td className="py-3 px-3 font-bold text-mono-100">COÛT DE REVIENT COMPLET</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-teal-900 text-base">8,62 €</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p><strong>Analyse :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Food cost matières seules = 6,14 / 15,00 × 100 = <strong>40,9 %</strong> (très élevé, alerte)</li>
              <li>Coût de revient complet / prix HT = 8,62 / 15,00 × 100 = <strong>57,5 %</strong></li>
              <li>Marge brute (HT - matières) = 15,00 - 6,14 = <strong>8,86 €</strong></li>
              <li>Marge nette unitaire = 15,00 - 8,62 = <strong>6,38 €</strong></li>
            </ul>
            <p className="mt-4">
              <strong>Décision :</strong> le thon rouge représente 46 % du coût matière. Options : remplacer par thon albacore (15 €/kg au lieu de 28) = économie 1,30 € qui ramène food cost à 32,2 %. Ou repositionner en plat premium à 19,50 € TTC = food cost 34,4 %. La salade niçoise est un piège classique : produit \"léger\" en perception mais ingrédients coûteux (thon, anchois, olives premium, mesclun).
            </p>
          </div>
        </section>

        {/* ═════════════ EXEMPLE 3 : Pizza ═════════════ */}
        <section id="exemple-pizza" className="mb-16">
          <SectionHeading icon={<Pizza className="w-6 h-6" />} number="5">
            Exemple 3 : pizza margherita
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#374151] leading-relaxed mb-4">
              Pizzeria authentique, pâte fermentée 48h, mozzarella fior di latte, sauce tomate San Marzano. Prix de vente : 12,50 € TTC (11,36 € HT).
            </p>
          </div>

          <div className="mt-6 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Décomposition du coût de revient complet</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Poste</th>
                  <th className="text-right py-2 px-3 font-semibold">Détail</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Pâte (farine T00, eau, levure, sel, huile)</td><td className="py-2 px-3 text-right">230 g × 1,40 €/kg</td><td className="py-2 px-3 text-right font-medium">0,32 €</td></tr>
                <tr><td className="py-2 px-3">Sauce tomate San Marzano</td><td className="py-2 px-3 text-right">90 g × 4,20 €/kg</td><td className="py-2 px-3 text-right font-medium">0,38 €</td></tr>
                <tr><td className="py-2 px-3">Mozzarella fior di latte</td><td className="py-2 px-3 text-right">110 g × 9,50 €/kg</td><td className="py-2 px-3 text-right font-medium">1,05 €</td></tr>
                <tr><td className="py-2 px-3">Basilic frais</td><td className="py-2 px-3 text-right">5 feuilles</td><td className="py-2 px-3 text-right font-medium">0,08 €</td></tr>
                <tr><td className="py-2 px-3">Huile d'olive vierge extra</td><td className="py-2 px-3 text-right">8 ml × 8 €/L</td><td className="py-2 px-3 text-right font-medium">0,06 €</td></tr>
                <tr><td className="py-2 px-3">Sel, origan, parmesan râpé</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right font-medium">0,12 €</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total matières</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">2,01 €</td></tr>
                <tr><td className="py-2 px-3">Main d'œuvre directe</td><td className="py-2 px-3 text-right">2,5 min × 25 €/h</td><td className="py-2 px-3 text-right font-medium">1,04 €</td></tr>
                <tr><td className="py-2 px-3">Emballage + à-côtés</td><td className="py-2 px-3 text-right">carton si à emporter</td><td className="py-2 px-3 text-right font-medium">0,15 €</td></tr>
                <tr><td className="py-2 px-3">Énergie four à pizza</td><td className="py-2 px-3 text-right">forfait</td><td className="py-2 px-3 text-right font-medium">0,35 €</td></tr>
                <tr className="border-t-2 border-mono-900 bg-teal-50"><td className="py-3 px-3 font-bold text-mono-100">COÛT DE REVIENT COMPLET</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-teal-900 text-base">3,55 €</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p><strong>Analyse :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Food cost matières = 2,01 / 11,36 × 100 = <strong>17,7 %</strong> (excellent, typique pizzeria)</li>
              <li>Coût de revient complet / prix HT = 3,55 / 11,36 × 100 = <strong>31,3 %</strong></li>
              <li>Marge brute (HT - matières) = 11,36 - 2,01 = <strong>9,35 €</strong></li>
              <li>Marge nette unitaire = 11,36 - 3,55 = <strong>7,81 €</strong></li>
              <li>Coefficient multiplicateur = 11,36 / 2,01 = <strong>5,65</strong> (très élevé, normal pizza)</li>
            </ul>
            <p className="mt-4">
              <strong>Décision :</strong> la pizza margherita est extrêmement rentable en ratio (food cost 17,7 %) mais moyennement en valeur absolue (7,81 € de marge nette). Le défi d'une pizzeria n'est pas le coût matière mais le volume : il faut vendre 50-80 pizzas par service pour atteindre la rentabilité. Le coût main d'œuvre + énergie représente 39 % du coût total, à optimiser via productivité (préparation en série, four bien chaud).
            </p>
          </div>
        </section>

        {/* ═════════════ EXEMPLE 4 : Pâtes ═════════════ */}
        <section id="exemple-pates" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="6">
            Exemple 4 : pâtes carbonara authentiques
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#374151] leading-relaxed mb-4">
              Recette romaine traditionnelle : spaghetti, guanciale, jaunes d'œuf, pecorino romano, poivre noir. Prix de vente : 15,90 € TTC (14,45 € HT).
            </p>
          </div>

          <div className="mt-6 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Décomposition du coût de revient complet</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Poste</th>
                  <th className="text-right py-2 px-3 font-semibold">Détail</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Spaghetti artisanaux</td><td className="py-2 px-3 text-right">130 g × 3,80 €/kg</td><td className="py-2 px-3 text-right font-medium">0,49 €</td></tr>
                <tr><td className="py-2 px-3">Guanciale (joue de porc séchée)</td><td className="py-2 px-3 text-right">60 g × 32 €/kg</td><td className="py-2 px-3 text-right font-medium">1,92 €</td></tr>
                <tr><td className="py-2 px-3">Jaunes d'œuf bio (3 jaunes)</td><td className="py-2 px-3 text-right">3 × 0,30 €</td><td className="py-2 px-3 text-right font-medium">0,90 €</td></tr>
                <tr><td className="py-2 px-3">Pecorino romano DOP</td><td className="py-2 px-3 text-right">40 g × 24 €/kg</td><td className="py-2 px-3 text-right font-medium">0,96 €</td></tr>
                <tr><td className="py-2 px-3">Parmigiano reggiano 24 mois</td><td className="py-2 px-3 text-right">15 g × 28 €/kg</td><td className="py-2 px-3 text-right font-medium">0,42 €</td></tr>
                <tr><td className="py-2 px-3">Poivre noir frais moulu</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right font-medium">0,08 €</td></tr>
                <tr><td className="py-2 px-3">Sel gros pour eau de cuisson</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right font-medium">0,03 €</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total matières</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">4,80 €</td></tr>
                <tr><td className="py-2 px-3">Main d'œuvre directe</td><td className="py-2 px-3 text-right">3 min × 25 €/h</td><td className="py-2 px-3 text-right font-medium">1,25 €</td></tr>
                <tr><td className="py-2 px-3">Emballage + à-côtés</td><td className="py-2 px-3 text-right">pain + serviette</td><td className="py-2 px-3 text-right font-medium">0,20 €</td></tr>
                <tr><td className="py-2 px-3">Énergie + amortissements</td><td className="py-2 px-3 text-right">forfait (cuisson 10 min)</td><td className="py-2 px-3 text-right font-medium">0,25 €</td></tr>
                <tr className="border-t-2 border-mono-900 bg-teal-50"><td className="py-3 px-3 font-bold text-mono-100">COÛT DE REVIENT COMPLET</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-teal-900 text-base">6,50 €</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p><strong>Analyse :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Food cost matières = 4,80 / 14,45 × 100 = <strong>33,2 %</strong> (limite haute)</li>
              <li>Coût de revient complet / prix HT = 6,50 / 14,45 × 100 = <strong>45,0 %</strong></li>
              <li>Marge brute (HT - matières) = 14,45 - 4,80 = <strong>9,65 €</strong></li>
              <li>Marge nette unitaire = 14,45 - 6,50 = <strong>7,95 €</strong></li>
            </ul>
            <p className="mt-4">
              <strong>Décision :</strong> le guanciale et le pecorino DOP représentent 60 % du coût matière. Substitution possible par pancetta (22 €/kg) et grana padano (18 €/kg) = économie 1,20 € qui ramène food cost à 24,9 % — mais perte d'authenticité et de positionnement. Si vous vendez \"carbonara romaine traditionnelle\", justifiez le prix à 17,90 € TTC et conservez les produits nobles. Le storytelling vaut 2-3 points de food cost.
            </p>
          </div>
        </section>

        {/* ═════════════ EXEMPLE 5 : Dessert ═════════════ */}
        <section id="exemple-dessert" className="mb-16">
          <SectionHeading icon={<Cookie className="w-6 h-6" />} number="7">
            Exemple 5 : fondant au chocolat coeur coulant
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#374151] leading-relaxed mb-4">
              Grand classique brasserie : fondant chocolat noir 70 %, crème anglaise vanille, boule de glace vanille, tuile aux amandes. Prix de vente : 8,90 € TTC (8,09 € HT).
            </p>
          </div>

          <div className="mt-6 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Décomposition du coût de revient complet</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Poste</th>
                  <th className="text-right py-2 px-3 font-semibold">Détail</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Chocolat noir 70 % Valrhona</td><td className="py-2 px-3 text-right">60 g × 18 €/kg</td><td className="py-2 px-3 text-right font-medium">1,08 €</td></tr>
                <tr><td className="py-2 px-3">Beurre AOP Charentes-Poitou</td><td className="py-2 px-3 text-right">50 g × 9,50 €/kg</td><td className="py-2 px-3 text-right font-medium">0,48 €</td></tr>
                <tr><td className="py-2 px-3">Œufs bio (1 entier + 1 jaune)</td><td className="py-2 px-3 text-right">1,5 × 0,40 €</td><td className="py-2 px-3 text-right font-medium">0,60 €</td></tr>
                <tr><td className="py-2 px-3">Sucre semoule</td><td className="py-2 px-3 text-right">40 g × 1,10 €/kg</td><td className="py-2 px-3 text-right font-medium">0,04 €</td></tr>
                <tr><td className="py-2 px-3">Farine T55</td><td className="py-2 px-3 text-right">15 g × 1,40 €/kg</td><td className="py-2 px-3 text-right font-medium">0,02 €</td></tr>
                <tr><td className="py-2 px-3">Crème anglaise (lait + jaune + vanille)</td><td className="py-2 px-3 text-right">40 ml</td><td className="py-2 px-3 text-right font-medium">0,55 €</td></tr>
                <tr><td className="py-2 px-3">Glace vanille Madagascar artisanale</td><td className="py-2 px-3 text-right">60 g × 14 €/L</td><td className="py-2 px-3 text-right font-medium">0,84 €</td></tr>
                <tr><td className="py-2 px-3">Tuile aux amandes maison</td><td className="py-2 px-3 text-right">1 pièce</td><td className="py-2 px-3 text-right font-medium">0,25 €</td></tr>
                <tr><td className="py-2 px-3">Décor (sucre glace, fruits rouges)</td><td className="py-2 px-3 text-right">~</td><td className="py-2 px-3 text-right font-medium">0,30 €</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total matières</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">4,16 €</td></tr>
                <tr><td className="py-2 px-3">Main d'œuvre directe (mise en place + dressage)</td><td className="py-2 px-3 text-right">3,5 min × 25 €/h</td><td className="py-2 px-3 text-right font-medium">1,46 €</td></tr>
                <tr><td className="py-2 px-3">Emballage + à-côtés</td><td className="py-2 px-3 text-right">cuillère décor</td><td className="py-2 px-3 text-right font-medium">0,10 €</td></tr>
                <tr><td className="py-2 px-3">Énergie + amortissements</td><td className="py-2 px-3 text-right">forfait four 8 min</td><td className="py-2 px-3 text-right font-medium">0,18 €</td></tr>
                <tr className="border-t-2 border-mono-900 bg-teal-50"><td className="py-3 px-3 font-bold text-mono-100">COÛT DE REVIENT COMPLET</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-teal-900 text-base">5,90 €</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p><strong>Analyse :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Food cost matières = 4,16 / 8,09 × 100 = <strong>51,4 %</strong> (critique !)</li>
              <li>Coût de revient complet / prix HT = 5,90 / 8,09 × 100 = <strong>72,9 %</strong></li>
              <li>Marge brute (HT - matières) = 8,09 - 4,16 = <strong>3,93 €</strong></li>
              <li>Marge nette unitaire = 8,09 - 5,90 = <strong>2,19 €</strong></li>
            </ul>
            <p className="mt-4">
              <strong>Décision :</strong> piège classique du dessert. Les desserts ont des food cost très variables et souvent élevés à cause des produits nobles (chocolat Valrhona, vanille Madagascar, beurre AOP). Options : 1) Remonter le prix à 10,50 € TTC = food cost 43,5 %. 2) Substituer le chocolat (12 €/kg au lieu de 18) = économie 0,36 €. 3) Réduire la glace à 40 g = économie 0,28 €. 4) Supprimer la tuile décor = économie 0,25 €. Cumul = food cost 43 % atteignable. Les desserts sont souvent vendus pour augmenter le ticket moyen, pas pour leur marge ratio.
            </p>
          </div>

          <Callout type="warning">
            <strong>Synthèse 5 exemples :</strong> les ratios coût de revient complet vont de 31,3 % (pizza) à 72,9 % (fondant chocolat). La salade niçoise et le fondant sont à recalibrer. La pizza et les pâtes carbonara sont rentables. Le burger est à la limite. Cette analyse plat par plat est indispensable — ne jugez jamais une carte sur la moyenne globale.
          </Callout>
        </section>

        {/* ═════════════ SECTION : Ratio de perte ═════════════ */}
        <section id="perte" className="mb-16">
          <SectionHeading icon={<Scissors className="w-6 h-6" />} number="8">
            Le ratio de perte (parage, cuisson, déchets)
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#374151] leading-relaxed mb-4">
              On n'achète <strong>jamais</strong> la quantité finalement servie. Entre l'arrivée du produit en cuisine et l'assiette client, il y a parage, dénoyautage, épluchage, perte cuisson, perte au dressage. Ignorer ces ratios c'est sous-estimer son coût matière de 20 à 50 %.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Ratios de perte par catégorie de produit</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Produit</th>
                  <th className="text-right py-2 px-3 font-semibold">Rendement net</th>
                  <th className="text-right py-2 px-3 font-semibold">Perte totale</th>
                  <th className="text-right py-2 px-3 font-semibold">Multiplicateur prix</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Filet de bœuf entier</td><td className="py-2 px-3 text-right">55-65 %</td><td className="py-2 px-3 text-right">35-45 %</td><td className="py-2 px-3 text-right font-medium">×1,8</td></tr>
                <tr><td className="py-2 px-3">Magret de canard</td><td className="py-2 px-3 text-right">70-80 %</td><td className="py-2 px-3 text-right">20-30 %</td><td className="py-2 px-3 text-right font-medium">×1,3</td></tr>
                <tr><td className="py-2 px-3">Côte de bœuf à l'os</td><td className="py-2 px-3 text-right">65-75 %</td><td className="py-2 px-3 text-right">25-35 %</td><td className="py-2 px-3 text-right font-medium">×1,4</td></tr>
                <tr><td className="py-2 px-3">Dorade royale entière</td><td className="py-2 px-3 text-right">35-45 %</td><td className="py-2 px-3 text-right">55-65 %</td><td className="py-2 px-3 text-right font-medium">×2,5</td></tr>
                <tr><td className="py-2 px-3">Saint-Jacques avec coquille</td><td className="py-2 px-3 text-right">15-20 %</td><td className="py-2 px-3 text-right">80-85 %</td><td className="py-2 px-3 text-right font-medium">×6</td></tr>
                <tr><td className="py-2 px-3">Saumon entier vidé</td><td className="py-2 px-3 text-right">55-65 %</td><td className="py-2 px-3 text-right">35-45 %</td><td className="py-2 px-3 text-right font-medium">×1,8</td></tr>
                <tr><td className="py-2 px-3">Champignons de Paris</td><td className="py-2 px-3 text-right">75-85 %</td><td className="py-2 px-3 text-right">15-25 %</td><td className="py-2 px-3 text-right font-medium">×1,2</td></tr>
                <tr><td className="py-2 px-3">Pommes de terre Bintje</td><td className="py-2 px-3 text-right">80-85 %</td><td className="py-2 px-3 text-right">15-20 %</td><td className="py-2 px-3 text-right font-medium">×1,2</td></tr>
                <tr><td className="py-2 px-3">Carottes</td><td className="py-2 px-3 text-right">75-85 %</td><td className="py-2 px-3 text-right">15-25 %</td><td className="py-2 px-3 text-right font-medium">×1,2</td></tr>
                <tr><td className="py-2 px-3">Salade verte (laitue, batavia)</td><td className="py-2 px-3 text-right">65-75 %</td><td className="py-2 px-3 text-right">25-35 %</td><td className="py-2 px-3 text-right font-medium">×1,4</td></tr>
                <tr><td className="py-2 px-3">Poireaux entiers</td><td className="py-2 px-3 text-right">55-65 %</td><td className="py-2 px-3 text-right">35-45 %</td><td className="py-2 px-3 text-right font-medium">×1,8</td></tr>
                <tr><td className="py-2 px-3">Asperges blanches</td><td className="py-2 px-3 text-right">60-70 %</td><td className="py-2 px-3 text-right">30-40 %</td><td className="py-2 px-3 text-right font-medium">×1,5</td></tr>
              </tbody>
            </table>
          </div>

          <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-5 my-6">
            <p className="text-sm font-semibold text-red-700 mb-2">Calcul concret avec exemple Saint-Jacques</p>
            <p className="text-sm text-red-600">Saint-Jacques avec coquille achetées 35 €/kg, rendement 18 % (chair seule). Prix réel utilisable = 35 / 0,18 = <strong>194,40 €/kg de chair</strong>. Beaucoup de restaurateurs facturent leur fiche technique à 35 €/kg — d'où des marges totalement noyées. Pour une portion de 80 g de chair : coût réel matière = 15,55 € (et non 2,80 €).</p>
          </div>

          <div className="prose-content">
            <p><strong>Méthode de mesure du rendement :</strong></p>
            <ol className="list-decimal list-inside space-y-1.5 text-mono-350">
              <li>Pesez le produit brut à la réception (avec emballage déduit).</li>
              <li>Effectuez le parage / épluchage / désarêtage normal.</li>
              <li>Pesez le produit net utilisable.</li>
              <li>Rendement = Poids net / Poids brut × 100.</li>
              <li>Refaites 3-5 fois sur 1-2 mois pour une moyenne fiable.</li>
              <li>Intégrez ce ratio dans chaque fiche technique.</li>
            </ol>
          </div>
        </section>

        {/* ═════════════ SECTION : Erreurs courantes ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="9">
            Les 7 erreurs courantes à éviter
          </SectionHeading>

          <div className="space-y-5 mt-8">
            <ErreurCard
              number={1}
              title="Ne pas peser les ingrédients"
              desc="L'erreur la plus répandue et la plus coûteuse. Sans pesée systématique, vos portions varient de 15-25 % d'un service à l'autre. Un cuisinier généreux ajoute facilement 20 % de matière en trop. Sur 100 plats/jour pendant un mois, cela représente 2 000 à 5 000 € de marge envolée. La solution : fiches techniques avec grammages précis et balance dans chaque poste."
            />
            <ErreurCard
              number={2}
              title="Ignorer les pertes au parage et à la cuisson"
              desc="Épluchures, parures, arêtes, peau, perte cuisson : ces pertes invisibles peuvent représenter 30-60 % du poids brut acheté. Si vous calculez sur le poids acheté plutôt que sur le poids servi, vous sous-estimez systématiquement votre food cost réel de 20 à 40 %. Chaque ingrédient doit avoir son ratio de rendement dans la fiche technique."
            />
            <ErreurCard
              number={3}
              title="Ne pas mettre à jour les prix fournisseurs"
              desc="Les prix bougent chaque semaine, parfois chaque jour pour les produits frais. Si votre fiche dit beurre 4 €/kg et qu'il est passé à 8 €/kg en 18 mois, votre calcul est faux de 100 % sur cet ingrédient. Idéalement, votre logiciel doit être connecté aux factures fournisseurs avec mise à jour en temps réel ou OCR scan."
            />
            <ErreurCard
              number={4}
              title="Oublier la main d'œuvre directe"
              desc="Vous calculez le food cost matières mais pas le coût de revient complet. Un plat à 30 % de food cost peut avoir 25 % de main d'œuvre s'il est très technique (mise en place 20 min). Coût de revient complet réel = 55 %, pas 30 %. Pour les plats à forte main d'œuvre (terrine maison, pâté en croûte, ravioles), c'est crucial."
            />
            <ErreurCard
              number={5}
              title="Sous-estimer les à-côtés (pain, beurre, sauce)"
              desc="Pain offert (0,15 €), beurre (0,12 €), pichet d'eau (0,05 €), café offert (0,08 €), petits-fours (0,20 €), sauce d'accompagnement (0,30 €) : total 0,90 € par couvert que beaucoup oublient. Sur 200 couverts/jour = 5 400 €/mois d'à-côtés non comptabilisés. C'est 1 à 2 points de marge brute."
            />
            <ErreurCard
              number={6}
              title="Ne pas faire d'inventaire mensuel"
              desc="Sans inventaire, vous ne mesurez pas l'écart entre food cost théorique (calculé sur fiches techniques) et food cost réel (calculé sur achats - inventaire). Un écart > 3 points = signal d'alerte : vol, gaspillage, erreurs de portionnage, fournisseur qui a augmenté ses prix sans prévenir. L'inventaire mensuel est non négociable."
            />
            <ErreurCard
              number={7}
              title="Ne pas analyser plat par plat"
              desc="Vous regardez le food cost global (28 % par exemple) sans creuser plat par plat. Or vous avez peut-être des plats à 18 % (boissons, pizza) et d'autres à 45 % (poissons nobles, foie gras). Le menu engineering croise popularité × rentabilité pour identifier les stars, chevaux de labour, énigmes et poids morts."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumulé :</strong> ces 7 erreurs combinées peuvent représenter une perte de 8 à 15 points de marge brute. Sur un restaurant qui fait 600 000 € de CA annuel, c'est entre 48 000 € et 90 000 € de bénéfice net potentiel qui disparait chaque année.
          </Callout>

          <div className="prose-content mt-6">
            <p>
              Pour aller plus loin sur la réduction du food cost, lisez notre guide :
              <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800 ml-1">
                10 stratégies pour réduire le food cost en restauration
              </Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION : Optimisation ═════════════ */}
        <section id="optimisation" className="mb-16">
          <SectionHeading icon={<Lightbulb className="w-6 h-6" />} number="10">
            10 stratégies pour optimiser le coût de revient
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#374151] leading-relaxed mb-6">
              Une fois le coût de revient mesuré précisément, voici 10 leviers d'optimisation classés par ordre d'impact, de plus simple à plus complexe à mettre en œuvre.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Standardiser les portions", desc: "Balance dans chaque poste + fiches techniques avec grammages précis. Réduction immédiate de 5-10 % du gaspillage matière.", impact: "+2 à 4 points de marge brute" },
              { title: "Renégocier les fournisseurs", desc: "Comparez 3 fournisseurs par catégorie. Demandez des conditions volume. Négociez les frais de port. Économie typique 5-12 % sur le poste matières.", impact: "+1,5 à 4 points de marge" },
              { title: "Mettre en place un FIFO strict", desc: "First In First Out : les produits arrivés en premier sortent en premier. Évite la péremption et le gaspillage. Étiquetage daté obligatoire sur tous les bacs.", impact: "+1 à 3 points de marge" },
              { title: "Calculer le rendement par produit", desc: "Mesurez systématiquement les ratios de perte au parage / cuisson. Intégrez-les dans les fiches techniques. Vous facturez le bon prix au client.", impact: "+2 à 5 points de marge" },
              { title: "Substituer les ingrédients premium", desc: "Identifier les ingrédients qui pèsent 40 %+ du coût matière. Tester des substitutions sans dégrader la qualité perçue (ex: pancetta vs guanciale).", impact: "+1 à 4 points de marge" },
              { title: "Faire du menu engineering", desc: "Matrice popularité × rentabilité : promouvoir les stars (forte marge + forte popularité), retirer les poids morts (faible des deux).", impact: "+2 à 6 points de marge" },
              { title: "Optimiser le coefficient multiplicateur", desc: "Calculer le coefficient idéal par plat (3,0 à 4,5). Ajuster les prix de vente pour atteindre le food cost cible (28-32 %).", impact: "+3 à 8 points de marge" },
              { title: "Réduire les pertes par lots", desc: "Préparer en lots de tailles adaptées à la demande prévisible. Conserver sous vide ou en cellule. Évite les surplus en fin de service.", impact: "+1 à 2 points de marge" },
              { title: "Former le personnel cuisine", desc: "Formation continue sur portions, gestes économes, anti-gaspillage. Une équipe formée gaspille 30 % de moins qu'une équipe non formée.", impact: "+1 à 3 points de marge" },
              { title: "Digitaliser et automatiser", desc: "Logiciel comme RestauMargin qui calcule en temps réel, alerte aux dérives, suggère des optimisations basées sur IA. ROI 3-6 mois.", impact: "+3 à 8 points de marge" },
            ].map((s, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-colors">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-teal-700">{i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-mono-100 flex-1">{s.title}</h3>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed mb-3">{s.desc}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full inline-flex">
                  <TrendingUp className="w-3 h-3" />
                  {s.impact}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION : Coût de revient vs food cost ═════════════ */}
        <section id="food-cost-diff" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="11">
            Coût de revient vs food cost : la différence
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#374151] leading-relaxed mb-4">
              Les deux notions sont souvent confondues mais répondent à des questions différentes. Comprendre cette distinction vous évite des erreurs stratégiques majeures.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Percent className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Food cost</h3>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed mb-3">
                <strong>Définition :</strong> ratio (en %) entre le coût des matières premières et le prix de vente HT.
              </p>
              <p className="text-sm text-amber-800 leading-relaxed mb-3">
                <strong>Formule :</strong> (Coût matières / Prix vente HT) × 100
              </p>
              <p className="text-sm text-amber-800 leading-relaxed mb-3">
                <strong>Exemple :</strong> Pizza 11,36 € HT avec 2,01 € de matières = food cost 17,7 %
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>À quoi ça sert :</strong> comparer la rentabilité matière entre plats, fixer un coefficient multiplicateur, suivre l'évolution mensuelle de l'efficacité achats.
              </p>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-teal-900">Coût de revient complet</h3>
              </div>
              <p className="text-sm text-teal-800 leading-relaxed mb-3">
                <strong>Définition :</strong> somme en euros de TOUS les coûts directs pour produire une portion (matières + MO + emballage + énergie).
              </p>
              <p className="text-sm text-teal-800 leading-relaxed mb-3">
                <strong>Formule :</strong> Matières + Main d'œuvre + Emballage + Énergie
              </p>
              <p className="text-sm text-teal-800 leading-relaxed mb-3">
                <strong>Exemple :</strong> Pizza coût de revient complet = 2,01 + 1,04 + 0,15 + 0,35 = 3,55 €
              </p>
              <p className="text-sm text-teal-800 leading-relaxed">
                <strong>À quoi ça sert :</strong> calculer la marge nette unitaire réelle, décider si un plat doit être maintenu, retiré ou repositionné. Indicateur ultime de rentabilité.
              </p>
            </div>
          </div>

          <Callout type="info">
            <strong>Règle d'or :</strong> pilotez vos achats et négociations fournisseurs au quotidien sur le food cost. Pilotez vos décisions stratégiques (carte, prix, suppression de plats) sur le coût de revient complet. Les deux sont complémentaires, pas substituables.
          </Callout>
        </section>

        {/* ═════════════ SECTION : Ratio cible ═════════════ */}
        <section id="ratio-cible" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="12">
            Ratios cibles par type de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#374151] leading-relaxed mb-6">
              Voici les benchmarks 2026 du coût de revient (matières seules et complet) par type d'établissement. Sources : GIRA Conseil, SNRC et base de données RestauMargin (500+ restaurants connectés).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type de restaurant</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost cible</th>
                  <th className="text-center py-3 px-4 font-semibold">Coût revient complet</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge brute</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge nette</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { type: 'Restauration rapide / Fast-food', fc: '25 - 30 %', cr: '45 - 55 %', mb: '70 - 75 %', mn: '8 - 15 %' },
                  { type: 'Bistrot / Brasserie', fc: '28 - 33 %', cr: '50 - 60 %', mb: '67 - 72 %', mn: '5 - 12 %' },
                  { type: 'Restaurant traditionnel', fc: '30 - 35 %', cr: '52 - 62 %', mb: '65 - 70 %', mn: '5 - 10 %' },
                  { type: 'Pizzeria / Crêperie', fc: '15 - 28 %', cr: '35 - 50 %', mb: '72 - 85 %', mn: '10 - 18 %' },
                  { type: 'Coffee shop', fc: '12 - 22 %', cr: '30 - 45 %', mb: '78 - 88 %', mn: '8 - 16 %' },
                  { type: 'Restaurant gastronomique', fc: '30 - 40 %', cr: '55 - 70 %', mb: '60 - 70 %', mn: '3 - 10 %' },
                  { type: 'Food truck', fc: '22 - 30 %', cr: '40 - 55 %', mb: '70 - 78 %', mn: '8 - 18 %' },
                  { type: 'Dark kitchen / Livraison', fc: '28 - 35 %', cr: '60 - 75 %', mb: '65 - 72 %', mn: '5 - 12 %' },
                  { type: 'Traiteur / Banquet', fc: '30 - 38 %', cr: '55 - 70 %', mb: '62 - 70 %', mn: '8 - 15 %' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.type}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-center">{row.cr}</td>
                    <td className="py-3 px-4 text-center">{row.mb}</td>
                    <td className="py-3 px-4 text-center">{row.mn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p><strong>Lecture du tableau :</strong></p>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li>Pour une brasserie, viser un coût de revient complet entre 50 et 60 % du prix de vente HT.</li>
              <li>Au-delà de 65 %, la marge nette est compromise (loyer, marketing, charges fixes mangent le reste).</li>
              <li>Le gastronomique a un food cost plus élevé (produits nobles) mais compense par des prix de vente supérieurs.</li>
              <li>Les dark kitchens souffrent : commissions plateformes (25-35 %) gonflent le coût de revient complet.</li>
            </ul>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 mt-6">
            <h3 className="font-bold text-mono-100 mb-4">Matrice de décision plat par plat</h3>
            <ul className="space-y-2 text-[#374151]">
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Food cost &lt; 22 % : très rentable, mettre en avant (suggestion serveurs, photo carte)</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> 22-28 % : optimal, maintenir</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> 28-32 % : acceptable, surveiller</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 32-35 % : limite haute, recalculer / négocier / ajuster portion</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> 35-40 % : alerte, revoir recette ou augmenter prix</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> &gt; 40 % : critique, retirer de la carte ou refonte complète</li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION : Outils ═════════════ */}
        <section id="outils" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="13">
            Outils pour automatiser le calcul
          </SectionHeading>

          <div className="prose-content">
            <p className="text-[#374151] leading-relaxed mb-6">
              Trois niveaux d'outillage selon la taille de votre carte et votre niveau d'organisation. Le bon outil dépend du volume (nombre de plats actifs) et de la fréquence de mise à jour des prix fournisseurs.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-6">
            <div className="bg-white border border-mono-900 rounded-2xl p-5">
              <div className="w-10 h-10 bg-mono-1000 rounded-lg flex items-center justify-center text-mono-400 mb-3">
                <Table className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-mono-100 mb-2">1. Tableur Excel/Sheets</h3>
              <p className="text-sm text-mono-400 leading-relaxed mb-3">Gratuit, flexible. Bien pour 1-10 plats. Chronophage à maintenir, source d'erreurs (formules cassées, prix non actualisés).</p>
              <p className="text-xs font-semibold text-mono-400">Adapté : moins de 10 plats actifs</p>
            </div>
            <div className="bg-teal-50 border-2 border-teal-300 rounded-2xl p-5">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-700 mb-3">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-teal-900 mb-2">2. Calculateur gratuit RestauMargin</h3>
              <p className="text-sm text-teal-800 leading-relaxed mb-3">Outil web gratuit, sans inscription. Saisissez ingrédients + grammages + prix, le food cost et la marge s'affichent.</p>
              <p className="text-xs font-semibold text-teal-700 mb-3">Adapté : calculs ponctuels, simulations rapides</p>
              <Link to="/outils/calculateur-food-cost" className="text-xs font-semibold text-teal-700 underline hover:text-teal-900">
                Essayer le calculateur →
              </Link>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-5">
              <div className="w-10 h-10 bg-mono-1000 rounded-lg flex items-center justify-center text-mono-400 mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-mono-100 mb-2">3. Logiciel RestauMargin</h3>
              <p className="text-sm text-mono-400 leading-relaxed mb-3">Gestion complète de toute la carte. OCR factures, prix temps réel, alertes de dérive, menu engineering, IA.</p>
              <p className="text-xs font-semibold text-mono-400">Adapté : 15+ plats actifs, gestion pro</p>
            </div>
          </div>

          <div className="prose-content">
            <p>
              Pour approfondir : lisez nos guides
              <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-800 ml-1">guide du coefficient multiplicateur</Link>,
              <Link to="/blog/fiche-technique-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">comment créer une fiche technique</Link>,
              <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">calcul de marge restaurant</Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <SectionHeading icon={<BookOpen className="w-6 h-6" />} number="14">
            Questions fréquentes (FAQ)
          </SectionHeading>

          <div className="space-y-4 mt-8">
            {faqItems.map(({ question, answer }) => (
              <div key={question} className="border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-colors">
                <p className="font-semibold text-mono-100 mb-2">{question}</p>
                <p className="text-sm text-mono-400 leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        </article>

        {/* CTA */}
        <div id="cta" className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-10 text-center text-white shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Calculez vos coûts de revient en quelques clics</h2>
          <p className="text-teal-100 mb-6 text-sm sm:text-base leading-relaxed max-w-[560px] mx-auto">
            RestauMargin importe vos factures fournisseurs par OCR, génère vos fiches techniques avec gestion des pertes au parage, calcule automatiquement le coût de revient complet (matières + main d'œuvre + énergie) et alerte quand un plat dérive au-dessus du seuil cible.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
            >
              Essayer gratuitement <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/outils/calculateur-food-cost"
              className="inline-flex items-center justify-center gap-2 bg-teal-800 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-900 transition-colors text-sm border border-teal-500"
            >
              <Calculator className="w-4 h-4" />
              Calculateur gratuit
            </Link>
          </div>
          <p className="text-teal-200 text-xs mt-5">Sans carte bancaire — 14 jours gratuits — Sans engagement</p>
        </div>

        {/* Nav bas de page */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles du blog</Link>
          <div className="flex gap-4 text-sm">
            <Link to="/blog/reduire-food-cost" className="text-teal-600 hover:underline">Réduire le food cost →</Link>
            <Link to="/blog/coefficient-multiplicateur" className="text-teal-600 hover:underline">Coefficient multiplicateur →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ═══════════ Composants utilitaires ═══════════ */

function SectionHeading({ icon, number, children }: { icon: React.ReactNode; number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">Section {number}</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 leading-tight">{children}</h2>
      </div>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning' | 'success'; children: React.ReactNode }) {
  const styles = {
    info: 'border-teal-300 bg-teal-50 text-teal-900',
    warning: 'border-amber-300 bg-amber-50 text-amber-900',
    success: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  };
  const Icon = type === 'warning' ? AlertTriangle : type === 'success' ? CheckCircle : Lightbulb;
  return (
    <div className={`border-l-4 rounded-r-xl p-5 my-6 ${styles[type]}`}>
      <div className="flex gap-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function ErreurCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-red-300 transition-colors flex gap-5">
      <div className="w-12 h-12 bg-red-100 text-red-700 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-bold text-mono-100 text-lg mb-2">{title}</h3>
        <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
