import { Link } from 'react-router-dom';
import {
  ChefHat,
  Calculator,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  BarChart3,
  LineChart,
  Zap,
  AlertTriangle,
  CheckCircle,
  Percent,
  Lightbulb,
  ListChecks,
  Award,
  Sparkles,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Prime cost restaurant : l'indicateur n 1 de rentabilite"
   Mot-cle principal : prime cost restaurant
   ~4 000 mots — terrain SEO quasi-vierge en francais
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Qu'est-ce que le prime cost en restauration ?",
    answer:
      "Le prime cost est la somme du coût des matières premières (food cost + beverage cost) et de la masse salariale chargée, exprimée en pourcentage du chiffre d'affaires hors taxes. Formule : Prime cost (%) = (Food cost + Labour cost) / CA HT x 100. C'est l'indicateur le plus prédictif de la rentabilité d'un restaurant car il regroupe les deux postes qui pèsent 60 à 70 % de vos coûts totaux. Selon la National Restaurant Association américaine, c'est LE ratio à piloter en priorité.",
  },
  {
    question: "Quel prime cost idéal viser pour un restaurant ?",
    answer:
      "Le seuil universel est de 65 % du chiffre d'affaires HT. En dessous, le restaurant est rentable. Au-delà, il est en zone rouge. La cible varie selon le type d'établissement : 52-58 % pour un fast-food, 60-65 % pour un bistrot, 60-67 % pour une brasserie, 67-78 % pour un gastronomique (qui compense par un ticket moyen élevé). Un restaurant qui maintient son prime cost sous 60 % pendant 12 mois consécutifs est considéré comme excellent.",
  },
  {
    question: "Comment calculer le prime cost de mon restaurant ?",
    answer:
      "Quatre étapes : 1) Calculer le food cost réel = (Stock initial + Achats - Stock final) / CA HT x 100. 2) Calculer le labour cost = (Salaires bruts + Charges patronales + Avantages) / CA HT x 100. Attention : utilisez le coût employeur total, pas seulement le brut. 3) Additionner les deux pourcentages. 4) Comparer aux benchmarks de votre type d'établissement. Le calcul doit être fait au minimum mensuellement, ideallement chaque semaine.",
  },
  {
    question: "Différence entre prime cost et food cost ?",
    answer:
      "Le food cost ne mesure que le coût des matières premières (25-35 % du CA en moyenne). Le prime cost ajoute la masse salariale et donne donc une vision plus complète (60-70 % du CA). Un restaurant peut avoir un excellent food cost mais un prime cost catastrophique si la masse salariale est mal gérée. C'est pourquoi le prime cost est considéré comme plus prédictif de la rentabilité globale.",
  },
  {
    question: "Différence entre prime cost et marge brute ?",
    answer:
      "La marge brute ne tient compte que du food cost : Marge brute = (CA - Food cost) / CA. Le prime cost ajoute la masse salariale : Prime cost = (Food cost + Labour cost) / CA. Le prime cost est plus complet car il intègre les deux postes opérationnels majeurs. Mathématiquement : Marge brute - Labour cost = Marge sur prime cost. C'est cette marge qui doit absolument couvrir le loyer, l'énergie, les amortissements et générer le résultat net.",
  },
  {
    question: "Peut-on calculer le prime cost d'un seul plat ?",
    answer:
      "Non, en pratique le prime cost se calcule à l'échelle du restaurant ou d'un service entier, jamais d'un seul plat. La raison : le labour cost n'est pas attribuable à un plat précis. Cuisiniers et serveurs gèrent plusieurs plats simultanément. Pour un plat individuel, on utilise plutôt la marge brute, le food cost et le coefficient multiplicateur. Le prime cost reste un indicateur global de pilotage.",
  },
  {
    question: "Le prime cost inclut-il les pourboires ?",
    answer:
      "Cela dépend du mode de gestion. Si les pourboires sont déclarés et reversés via la fiche de paie (avec charges sociales associées), ils alourdissent le labour cost donc le prime cost. S'ils sont remis directement en main propre sans passer par la paie, ils n'apparaissent pas dans la comptabilité du restaurant et n'impactent ni le labour cost ni le prime cost. En 2026, la tendance réglementaire pousse vers la déclaration systématique.",
  },
  {
    question: "Mon restaurant est saisonnier, quel prime cost viser ?",
    answer:
      "Raisonnez en moyenne annuelle, pas mensuelle. En basse saison (janvier-février ou été pour les stations de ski), le prime cost peut grimper jusqu'à 80 % sans drame, à condition que la haute saison descende à 50-55 %. La moyenne annuelle reste le seul indicateur valable. Astuce : tenez un tableau de suivi avec prime cost cumulé annuel rolling 12 mois pour ne pas paniquer sur les pics saisonniers.",
  },
  {
    question: "Faut-il intégrer le salaire du dirigeant dans le labour cost ?",
    answer:
      "Si le dirigeant se rémunère en salaire via la fiche de paie (gérant majoritaire EURL ou président SASU), oui, intégrez systématiquement ce salaire dans le labour cost. Si le dirigeant se rémunère en dividendes ou en TNS forfait (gérant minoritaire ou TNS), non, mais ajoutez une rémunération de gérant théorique de 3 500 à 5 000 EUR brut/mois pour comparer avec d'autres restaurants et pour calculer le vrai coût de gestion.",
  },
  {
    question: "Quel est le coût employeur réel par rapport au brut ?",
    answer:
      "Le coût employeur réel en France pour un salarié en CHR est d'environ 1,42 fois le brut. Un employé à 2 000 EUR brut coûte environ 2 840 EUR à l'entreprise (salaire + charges patronales + mutuelle + prévoyance + indemnités). Calculer le labour cost uniquement sur le brut est l'erreur la plus répandue : elle sous-estime artificiellement le prime cost de 8 à 12 points, jusqu'à la mauvaise surprise du bilan annuel.",
  },
  {
    question: "Comment réduire son prime cost rapidement ?",
    answer:
      "Quatre leviers prioritaires : 1) Renégocier les 5 plus gros fournisseurs (-2 à -4 points de food cost). 2) Réduire les amplitudes horaires en fermant les services peu rentables (-3 à -5 points de labour cost). 3) Polyvalence cuisine-salle pour optimiser les effectifs (-2 à -4 points de labour cost). 4) Carte courte de 20-25 plats max pour réduire pertes et complexité (-1 à -3 points de food cost). Cumulés sur 90 jours, ces leviers peuvent faire passer un restaurant de 72 % à 62 % de prime cost.",
  },
  {
    question: "À quelle fréquence calculer le prime cost ?",
    answer:
      "Le prime cost doit être calculé au minimum mensuel, ideallement hebdomadaire. Sans suivi rapproché, vous découvrez les dérives 30 à 60 jours trop tard, ce qui représente facilement 5 000 à 15 000 EUR de marge perdue. La méthode : food cost hebdo (via inventaires partiels), labour cost hebdo (via plannings), prime cost mensuel complet (via P&L). Un logiciel automatisé comme RestauMargin permet un suivi en temps réel.",
  },
  {
    question: "Pourquoi le prime cost est-il plus important que la marge brute ?",
    answer:
      "Parce qu'il est plus prédictif de la rentabilité finale. Un restaurant peut avoir une marge brute superbe (72 %) mais une marge nette catastrophique (-2 %) si la masse salariale est démesurée (40 % du CA). Le prime cost intègre les deux postes opérationnels et donne une vision réaliste de la santé du restaurant. Surveiller seulement la marge brute, c'est conduire les yeux bandés sur 50 % du tableau de bord.",
  },
  {
    question: "Quel impact d'un prime cost à 70 % au lieu de 60 % ?",
    answer:
      "Catastrophique. Sur un restaurant à 500 000 EUR de CA HT, 10 points de prime cost en plus, c'est 50 000 EUR de marge brute en moins par an. Comme le restaurant doit encore payer loyer (8 % du CA = 40 000 EUR), énergie (4 % = 20 000 EUR), assurances et divers (4 % = 20 000 EUR), amortissements (3 % = 15 000 EUR), il ne reste rien voire pertes. C'est la principale cause de fermeture des restaurants dans les 3 premières années selon l'INSEE.",
  },
  {
    question: "Le prime cost est-il différent selon la taille du restaurant ?",
    answer:
      "Oui, mais moins qu'on ne pense. Un petit restaurant (200K EUR CA) a typiquement un prime cost 2 à 4 points plus élevé qu'un grand (1M EUR CA) à cause des économies d'échelle sur les achats. Mais la cible reste 65 % pour tous. Les chaînes peuvent descendre à 55 % grâce au volume et à la standardisation. Les restaurants haut de gamme acceptent 70 % grâce au ticket moyen élevé et à la marge sur les boissons.",
  },
];

const howToSteps = [
  { name: "Calculer le food cost réel sur la période", text: "Formule : (Stock initial + Achats - Stock final) / CA HT x 100. Période minimale recommandée : 4 semaines. Plus la période est courte, plus le calcul est sensible aux variations de stock." },
  { name: "Calculer la masse salariale totale chargée", text: "Additionnez salaires bruts + charges patronales (~42 %) + mutuelle + prévoyance + indemnités. Le coût employeur réel est environ 1,42 x le brut. Pour 30 000 EUR de brut, comptez ~42 600 EUR de coût total." },
  { name: "Calculer le labour cost en %", text: "Labour cost (%) = (Masse salariale totale chargée / CA HT) x 100. Cible standard : 28-35 % en restauration traditionnelle. Sous 28 % en fast-food, jusqu'à 45 % en gastronomique." },
  { name: "Additionner food cost + labour cost", text: "Prime cost (%) = Food cost + Labour cost. Exemple : food cost 32 % + labour cost 34 % = prime cost 66 %. Soyez intransigeant sur l'intégration de TOUS les coûts." },
  { name: "Comparer au benchmark de votre type d'établissement", text: "Pizzeria : cible 53-60 %. Bistrot : 60-65 %. Brasserie : 60-67 %. Gastronomique : 67-78 %. Fast-food : 52-58 %. Au-dessus de votre zone rouge sectorielle, action immédiate requise." },
  { name: "Identifier les écarts par rapport au mois précédent", text: "Comparez M vs M-1, M vs M-12, cumul YTD vs YTD N-1. Une dérive de plus de 2 points en un mois doit déclencher une enquête : prix fournisseurs, sur-effectif, baisse du CA, gaspillage." },
  { name: "Mettre en place un plan d'action", text: "Sur food cost : renégociation, mercuriale, fiches techniques, réduction gaspillage. Sur labour cost : plannings au quart d'heure, polyvalence, suppression services peu rentables, optimisation amplitudes." },
  { name: "Suivre l'évolution hebdomadaire", text: "Tableau de bord avec prime cost cumulé, évolution rolling 4 semaines, comparaison avec budget. Sans suivi hebdomadaire, vous découvrez les dérives 30 à 60 jours trop tard." },
  { name: "Recalculer après 4 à 8 semaines d'action", text: "Mesurer l'impact des actions correctives. Si le prime cost a baissé de 2 à 3 points, le plan fonctionne. Si non, ajuster ou amplifier les actions. Itération permanente." },
];

export default function BlogPrimeCost() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Prime cost restaurant : calcul, formule et benchmarks (guide 2026)"
        description="Le prime cost en restauration : l'indicateur n 1 de rentabilité. Formule, calcul détaillé, benchmarks sectoriels et plan d'action pour passer sous les 65 %. Guide complet 2026."
        path="/blog/prime-cost-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Prime cost restaurant', url: 'https://www.restaumargin.fr/blog/prime-cost-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment calculer le prime cost d\'un restaurant en 9 étapes',
            description: 'Méthode complète pour calculer et piloter le prime cost en restauration : food cost réel, labour cost charge, benchmarks sectoriels, plan d\'action correctif.',
            totalTime: 'PT30M',
            tool: ['Comptabilité', 'Plannings personnel', 'Inventaires', 'Tableur ou logiciel RestauMargin'],
            step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Prime cost restaurant : calcul, formule et benchmarks (guide 2026)',
            description: 'Guide complet du prime cost en restauration : définition, formule, exemple chiffré détaillé, benchmarks par type d\'établissement, plan d\'action pour passer sous 65 %.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-14',
            dateModified: '2026-05-26',
            wordCount: 4000,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/prime-cost-restaurant' },
            citation: [
              { '@type': 'CreativeWork', name: 'National Restaurant Association - Prime cost benchmarks 2025' },
              { '@type': 'CreativeWork', name: 'Fiducial - Observatoire de la restauration 2025' },
              { '@type': 'CreativeWork', name: 'INSEE - Secteur 56 hébergement restauration' },
              { '@type': 'CreativeWork', name: 'GIRA Conseil - Tendances restauration France 2026' },
              { '@type': 'CreativeWork', name: 'KPMG - Étude annuelle hôtellerie-restauration 2025' },
            ],
          },
        ]}
      />

      {/* ── Navbar ── */}
      <PublicHeader />

      {/* ── Breadcrumbs ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Prime cost restaurant</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <BlogArticleHero
        category="Prime cost"
        readTime="20 min"
        date="Mai 2026"
        title="Prime cost en restauration : l'indicateur n 1 de rentabilité en 2026"
        accentWord="Prime cost"
        subtitle="Si vous ne deviez suivre qu'un seul indicateur dans votre restaurant, ce serait celui-ci. Voici comment le calculer précisément, le benchmarker par type d'établissement et passer sous les 65 % en 90 jours, étude de cas chiffrée à l'appui."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-04-14" updatedDate="2026-05-26" readTime="20 min" variant="header" />

        {/* ── Intro / Featured snippet ── */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-l-4 border-teal-600 rounded-r-2xl p-5 sm:p-6 my-8">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2">Définition rapide</p>
          <p className="text-base sm:text-lg text-mono-100 leading-relaxed">
            Le <strong>prime cost</strong> est la somme du coût des matières premières (food cost) et de la masse salariale chargée (labour cost), exprimée en pourcentage du chiffre d'affaires hors taxes. <strong>Formule : Prime cost (%) = (Food cost + Labour cost) / CA HT x 100</strong>. Sous 65 %, le restaurant est rentable. Au-delà, il est en zone rouge. C'est l'indicateur le plus prédictif de la rentabilité en restauration.
          </p>
        </div>

        {/* ── Encadre formule visible ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formules essentielles prime cost</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les 5 formules clés à retenir
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Prime cost (%)</strong> = (Food cost + Labour cost) / CA HT x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Food cost</strong> = (Stock initial + Achats - Stock final) / CA HT x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Labour cost</strong> = Masse salariale chargée / CA HT x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Coût employeur réel</strong> = Salaire brut x 1,42 (charges incluses)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">5.</span>
              <span><strong className="text-white">Marge sur prime cost</strong> = 100 - Prime cost (doit être &gt;= 35 %)</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectif standard 2026 : prime cost sous 65 % du CA HT. Excellence : sous 60 %. Zone rouge : au-dessus de 68 %.
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
              { href: '#definition', label: 'Définition du prime cost en restauration' },
              { href: '#pourquoi', label: 'Pourquoi le prime cost est l\'indicateur n 1' },
              { href: '#formule', label: 'Formule détaillée et composantes' },
              { href: '#methode', label: 'Comment calculer le prime cost en 9 étapes' },
              { href: '#exemple', label: 'Exemple chiffré complet : Bistrot Leon' },
              { href: '#benchmarks', label: 'Benchmarks par type de restaurant' },
              { href: '#vs', label: 'Prime cost vs food cost vs marge brute' },
              { href: '#derives', label: 'Pourquoi mon prime cost dérive ?' },
              { href: '#leviers-food', label: 'Réduire le food cost : 6 leviers' },
              { href: '#leviers-labour', label: 'Réduire le labour cost : 7 leviers' },
              { href: '#cas-pratique', label: 'Cas pratique : passer de 72 % à 62 %' },
              { href: '#suivi', label: 'Suivi mensuel vs hebdomadaire' },
              { href: '#outils', label: 'Outils pour automatiser le calcul' },
              { href: '#faq', label: 'FAQ : 15 questions fréquentes' },
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

        {/* ═════════ SECTION 1 : Definition ═════════ */}
        <section id="definition" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-teal-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">1. Définition du prime cost en restauration</h2>
          </div>

          <p>
            Le <strong>prime cost</strong>, parfois traduit en français par "coûts directs opérationnels" ou "coûts primaires", est l'indicateur de gestion le plus important en restauration. La <strong>National Restaurant Association</strong> américaine le considère depuis les années 1980 comme LE ratio à piloter en priorité. En France, il s'est généralisé dans les années 2010 dans les chaînes et les restaurants gastronomiques, puis dans les bistrots indépendants après la crise COVID.
          </p>

          <p>
            Mathématiquement, le prime cost regroupe les deux postes de coûts opérationnels majeurs :
          </p>

          <ul className="space-y-3 my-5">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Percent className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <strong className="text-mono-100">Le food cost</strong> (coût matière) : tout ce que vous achetez pour produire les plats et les boissons. Solides, liquides, vins, alcools, épicerie. <strong>Cible : 25-35 % du CA HT</strong>.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <strong className="text-mono-100">Le labour cost</strong> (coût du personnel) : salaires bruts + charges patronales + mutuelle + prévoyance + indemnités. <strong>Cible : 28-38 % du CA HT</strong>.
              </div>
            </li>
          </ul>

          <p>
            Le prime cost est leur addition. <strong>Cible universelle : sous 65 % du chiffre d'affaires HT</strong>. Au-delà, le restaurant n'a plus assez de marge pour couvrir loyer, énergie, marketing, assurances, amortissements et générer du résultat net.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 my-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900 mb-1">L'erreur classique à éviter</p>
                <p className="text-sm text-amber-800">
                  Calculer le labour cost uniquement sur le salaire brut. En réalité, le <strong>coût employeur réel est environ 1,42 fois le brut</strong> (charges patronales de 42 % en moyenne en France pour le CHR). Un employé à 2 000 EUR brut coûte 2 840 EUR. Sous-estimer ce ratio fait artificiellement baisser le prime cost de 8 à 12 points, jusqu'à la mauvaise surprise du bilan annuel.
                </p>
              </div>
            </div>
          </div>

          <p>
            <strong>Origine du terme</strong> : "prime cost" vient du vocabulaire comptable américain où "prime" signifie "principal", "primaire". Ce sont les coûts directement attribuables à la production et au service. Dans la littérature française, on parle parfois de "ratio matières-personnel" ou de "ratio opérationnel principal", mais le terme anglais reste largement répandu dans la profession.
          </p>
        </section>

        {/* ═════════ SECTION 2 : Pourquoi ═════════ */}
        <section id="pourquoi" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">2. Pourquoi le prime cost est l'indicateur n 1</h2>
          </div>

          <p>
            Quatre raisons fondamentales font du prime cost la référence absolue en gestion de restaurant :
          </p>

          <div className="grid sm:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                <Percent className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="text-base font-bold text-mono-100 mb-2">60 à 70 % de vos coûts</h3>
              <p className="text-sm text-mono-400 leading-relaxed">
                Le prime cost regroupe à lui seul 60 à 70 % de vos coûts totaux. Le piloter, c'est piloter les deux tiers du compte de résultat. Aucun autre indicateur n'a un tel impact.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="text-base font-bold text-mono-100 mb-2">Actionnable au quotidien</h3>
              <p className="text-sm text-mono-400 leading-relaxed">
                Contrairement au loyer (fixe), le food cost et le labour cost peuvent être optimisés chaque jour : négociation, planning, portions, polyvalence. Le restaurateur a un contrôle direct.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5 text-purple-700" />
              </div>
              <h3 className="text-base font-bold text-mono-100 mb-2">Prédictif de la rentabilité finale</h3>
              <p className="text-sm text-mono-400 leading-relaxed">
                Un prime cost à 60 % laisse 40 points de marge pour absorber le loyer, l'énergie et générer du résultat. À 72 %, il n'en reste que 28 : impossible d'être rentable.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-rose-700" />
              </div>
              <h3 className="text-base font-bold text-mono-100 mb-2">Intègre la productivité équipe</h3>
              <p className="text-sm text-mono-400 leading-relaxed">
                Le prime cost mesure aussi la productivité. Servir 80 couverts avec 4 personnes vs 7 personnes change tout. Optimiser le ratio "CA par heure travaillée" est central.
              </p>
            </div>
          </div>

          <p>
            <strong>Démonstration chiffrée</strong> : sur un restaurant à <strong>500 000 EUR de CA HT annuel</strong>, voici l'impact direct de chaque point de prime cost :
          </p>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Prime cost</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Marge sur prime cost</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">En EUR annuel</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['55 %', '45 %', '225 000 EUR', 'Excellent (chaînes optimisées)'],
                  ['60 %', '40 %', '200 000 EUR', 'Très bon (objectif viable)'],
                  ['62 %', '38 %', '190 000 EUR', 'Bon (rentable confortable)'],
                  ['65 %', '35 %', '175 000 EUR', 'Limite (seuil critique)'],
                  ['68 %', '32 %', '160 000 EUR', 'À surveiller (zone rouge)'],
                  ['70 %', '30 %', '150 000 EUR', 'Problème (marge nette < 5 %)'],
                  ['72 %', '28 %', '140 000 EUR', 'Critique (pertes probables)'],
                  ['75 %', '25 %', '125 000 EUR', 'Restaurant en danger'],
                ].map(([pc, m, eur, v], i) => (
                  <tr key={pc} className={`border-t border-mono-975 ${i >= 4 ? 'bg-rose-50' : i >= 3 ? 'bg-amber-50' : ''}`}>
                    <td className="px-4 py-2.5 font-bold text-mono-100">{pc}</td>
                    <td className="px-4 py-2.5 text-teal-700 font-semibold">{m}</td>
                    <td className="px-4 py-2.5 text-mono-350 font-mono">{eur}</td>
                    <td className="px-4 py-2.5 text-mono-500 text-xs">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Entre un prime cost à 60 % et un prime cost à 70 %, la différence est de <strong>50 000 EUR de marge brute annuelle</strong>. Sur 5 ans, c'est 250 000 EUR. Cette marge sert à payer loyer, énergie, marketing et à dégager le résultat net. Sans elle, le restaurant ferme.
          </p>
        </section>

        {/* ═════════ SECTION 3 : Formule ═════════ */}
        <section id="formule" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">3. Formule détaillée et composantes</h2>
          </div>

          <p>
            La formule du prime cost est en apparence simple, mais chaque composante mérite une attention particulière pour éviter les pièges.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Formule principale</h3>
          <div className="bg-mono-100 rounded-xl p-5 my-4 font-mono text-sm text-white text-center">
            Prime Cost (%) = ((Food Cost + Labour Cost) / CA HT) x 100
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Composante 1 : le food cost</h3>
          <p>
            Le food cost intègre l'ensemble des consommables transformés ou revendus :
          </p>
          <ul className="space-y-2 my-3">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Matières solides : viandes, poissons, légumes, féculents, fromages, charcuterie</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Matières liquides : huiles, sauces, fonds, lait, crème, jus de fruits</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Épicerie : farine, sucre, sel, épices, conserves, condiments</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Boissons : vins, alcools, bières, softs, café, thé (parfois séparés en "beverage cost")</span>
            </li>
          </ul>
          <p>
            <strong>Important</strong> : le food cost <strong>n'inclut pas</strong> les consommables d'entretien (lessive, produits vaisselle), les emballages à emporter (facturés séparément en "packaging cost"), ni les fournitures de bureau.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Composante 2 : le labour cost</h3>
          <p>
            Le labour cost intègre l'ensemble des charges liées au personnel, salariés comme non-salariés :
          </p>
          <ul className="space-y-2 my-3">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Salaires bruts (cuisine, salle, plonge, encadrement, comptabilité interne)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Charges patronales (URSSAF, retraite, chômage, accident du travail) : ~42 % du brut</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Mutuelle et prévoyance employeur</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Indemnités (transport, repas, congés payés provisionnes)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Intérim et extras (factures TTC, mais on prend le HT pour le ratio)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Salaire dirigeant si rémunère via la paie (gérant majoritaire EURL, président SASU)</span>
            </li>
          </ul>

          <div className="bg-rose-50 border-l-4 border-rose-400 rounded-r-xl p-5 my-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-rose-900 mb-1">Piège n 1 : le brut au lieu du coût employeur</p>
                <p className="text-sm text-rose-800">
                  Si vous calculez le labour cost sur le brut uniquement (sans les charges patronales), vous sous-estimez le prime cost de 8 à 12 points. <strong>Toujours utiliser le coût employeur réel</strong> : Brut x 1,42 en moyenne pour le CHR français. Pour 30 000 EUR de brut mensuel, comptez ~42 600 EUR de coût total mensuel.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-rose-50 border-l-4 border-rose-400 rounded-r-xl p-5 my-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-rose-900 mb-1">Piège n 2 : oublier le dirigeant TNS</p>
                <p className="text-sm text-rose-800">
                  Si le gérant est en TNS (gérant minoritaire SARL, EI) et se rémunère en dividendes ou prélèvements, ces sommes <strong>ne sont pas dans la paie</strong>. Pour comparer correctement votre restaurant avec d'autres, ajoutez une "rémunération de gérant théorique" de 3 500 à 5 000 EUR brut/mois dans le labour cost.
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Composante 3 : le chiffre d'affaires</h3>
          <p>
            Toujours pris <strong>en HT (hors taxes)</strong>, pour cinq raisons :
          </p>
          <ul className="space-y-1 my-3">
            <li>- La TVA ne vous appartient pas, elle est reversée à l'État</li>
            <li>- En France : TVA 10 % sur place, 5,5 % à emporter, 20 % sur alcools</li>
            <li>- Calculer en TTC fausserait le ratio de 5 à 18 points selon le mix</li>
            <li>- Tous les benchmarks sectoriels sont en HT</li>
            <li>- Votre comptable et votre expert-comptable calculent en HT</li>
          </ul>
        </section>

        {/* ═════════ SECTION 4 : Methode 9 etapes ═════════ */}
        <section id="methode" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ListChecks className="w-6 h-6 text-purple-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">4. Comment calculer le prime cost en 9 étapes</h2>
          </div>

          <p>
            Voici la méthode complète utilisée par les contrôleurs de gestion CHR. Comptez 30 à 45 minutes la première fois, puis 10 à 15 minutes par mois une fois rodé.
          </p>

          <div className="space-y-4 my-8">
            {howToSteps.map((item, i) => (
              <div key={i} className="flex gap-4 bg-white border border-mono-900 rounded-2xl p-5">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 font-extrabold text-lg shadow-md">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-mono-100 !mt-0 !mb-1">{item.name}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed !mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════ SECTION 5 : Exemple Bistrot Leon ═════════ */}
        <section id="exemple" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-rose-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">5. Exemple chiffré complet : Bistrot Leon</h2>
          </div>

          <p>
            Plongeons dans un cas réel et chiffré. Le <strong>Bistrot Leon</strong> est un restaurant traditionnel parisien de 45 couverts, ouvert du mardi au samedi midi et soir. CA annuel HT : <strong>780 000 EUR</strong>. Analysons son prime cost du mois d'avril 2026.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Données d'entrée</h3>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Élément</th>
                  <th className="text-right px-4 py-3 font-semibold text-mono-400">Montant</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Chiffre d\'affaires HT avril 2026', '65 000 EUR', false],
                  ['Stock initial 01/04 (food + boissons)', '4 200 EUR', false],
                  ['Achats avril (food + boissons)', '20 800 EUR', false],
                  ['Stock final 30/04', '3 900 EUR', false],
                  ['Salaires bruts avril (5 ETP)', '15 600 EUR', false],
                  ['Charges patronales (42 %)', '6 552 EUR', false],
                  ['Mutuelle + prévoyance employeur', '780 EUR', false],
                  ['Indemnités transport et repas', '420 EUR', false],
                  ['Salaire gérant brut (SASU)', '4 000 EUR', false],
                  ['Charges patronales gérant', '1 680 EUR', false],
                ].map(([k, v]) => (
                  <tr key={k as string} className="border-t border-mono-975">
                    <td className="px-4 py-2.5 font-medium text-mono-100">{k}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-mono-350">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Calcul détaillé</h3>
          <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-6 my-6 text-white">
            <div className="font-mono text-sm space-y-3">
              <div className="text-teal-100 font-bold uppercase tracking-wider text-xs mb-2">FOOD COST</div>
              <div>Consommation réelle = 4 200 + 20 800 - 3 900 = 21 100 EUR</div>
              <div>Food cost = (21 100 / 65 000) x 100 = <strong className="text-white text-base">32,5 %</strong></div>

              <div className="text-teal-100 font-bold uppercase tracking-wider text-xs mb-2 mt-4 pt-3 border-t border-white/20">LABOUR COST</div>
              <div>Salaires + charges = 15 600 + 6 552 + 780 + 420 = 23 352 EUR</div>
              <div>Salaire gérant charge = 4 000 + 1 680 = 5 680 EUR</div>
              <div>Total labour = 23 352 + 5 680 = 29 032 EUR</div>
              <div>Labour cost = (29 032 / 65 000) x 100 = <strong className="text-white text-base">44,7 %</strong></div>

              <div className="text-teal-100 font-bold uppercase tracking-wider text-xs mb-2 mt-4 pt-3 border-t border-white/20">PRIME COST</div>
              <div className="text-lg font-bold">
                Prime cost = 32,5 + 44,7 = <span className="text-2xl text-amber-200">77,2 %</span>
              </div>
              <div className="text-amber-200 text-xs">Marge sur prime cost = 22,8 % (insuffisant pour couvrir loyer + autres charges)</div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Diagnostic</h3>

          <div className="bg-rose-50 border-l-4 border-rose-500 rounded-r-xl p-5 my-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-rose-900 mb-2">Verdict : ZONE ROUGE CRITIQUE</p>
                <ul className="text-sm text-rose-800 space-y-1">
                  <li>- <strong>Prime cost 77,2 %</strong> contre cible bistrot 60-65 % : dérive de <strong>12 à 17 points</strong></li>
                  <li>- Food cost 32,5 % : limite haute (cible 28-32 %)</li>
                  <li>- Labour cost 44,7 % : très au-dessus de la cible (28-35 %)</li>
                  <li>- Marge sur prime cost : 22,8 % insuffisante pour couvrir loyer (8 %), énergie (4 %), assurances (3 %), amortissements (3 %)</li>
                  <li>- Résultat probable : <strong>-2 à -5 % de marge nette (perte)</strong></li>
                </ul>
                <p className="text-sm text-rose-800 mt-2 font-semibold">
                  Action requise : plan d'action 90 jours pour passer sous 65 %. Voir cas pratique section 11.
                </p>
              </div>
            </div>
          </div>

          <p>
            Cette situation est malheureusement fréquente dans les bistrots indépendants. Une masse salariale trop élevée (souvent par sur-effectif ou amplitudes horaires trop longues), combinée à un food cost limite, fait grimper le prime cost à 75-80 %. C'est exactement ce qui mène <strong>30 % des restaurants à la fermeture dans les 3 premières années</strong> selon l'INSEE.
          </p>
        </section>

        {/* ═════════ SECTION 6 : Benchmarks ═════════ */}
        <section id="benchmarks" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">6. Benchmarks prime cost par type de restaurant</h2>
          </div>

          <p>
            Le prime cost cible varie selon le concept, le ticket moyen et le modèle économique. Voici les fourchettes de référence en France pour 2026, compilées à partir des données <strong>Fiducial</strong>, <strong>INSEE</strong>, <strong>GIRA Conseil</strong> et <strong>National Restaurant Association</strong>.
          </p>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Type d'établissement</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Food cost</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Labour cost</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Prime cost cible</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Zone rouge</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Fast-food / Snack', '25-30 %', '25-30 %', '52-58 %', '> 62 %'],
                  ['Food truck', '25-30 %', '20-28 %', '48-55 %', '> 60 %'],
                  ['Pizzeria / Pasta', '22-28 %', '28-32 %', '53-60 %', '> 65 %'],
                  ['Café / Coffee shop', '20-28 %', '28-32 %', '50-60 %', '> 65 %'],
                  ['Restaurant asiatique', '25-30 %', '30-35 %', '57-65 %', '> 68 %'],
                  ['Bistrot traditionnel', '28-32 %', '30-35 %', '60-65 %', '> 68 %'],
                  ['Brasserie', '28-33 %', '30-37 %', '60-67 %', '> 70 %'],
                  ['Restaurant traditionnel', '30-35 %', '30-37 %', '62-68 %', '> 71 %'],
                  ['Dark kitchen / Livraison', '28-35 %', '20-28 %', '50-60 %', '> 65 %'],
                  ['Restaurant végétarien', '25-32 %', '32-38 %', '60-68 %', '> 72 %'],
                  ['Gastronomique 1 étoile', '30-35 %', '35-42 %', '67-75 %', '> 80 %'],
                  ['Gastronomique 2-3 étoiles', '32-38 %', '40-50 %', '72-82 %', '> 85 %'],
                  ['Hôtel restaurant', '30-38 %', '35-42 %', '67-75 %', '> 80 %'],
                  ['Traiteur / Banquet', '30-38 %', '25-32 %', '57-65 %', '> 70 %'],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-mono-975">
                    <td className="px-4 py-2.5 font-semibold text-mono-100">{row[0]}</td>
                    <td className="px-4 py-2.5 text-mono-350">{row[1]}</td>
                    <td className="px-4 py-2.5 text-mono-350">{row[2]}</td>
                    <td className="px-4 py-2.5 text-teal-700 font-semibold">{row[3]}</td>
                    <td className="px-4 py-2.5 text-rose-600 font-semibold">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            <strong>Lecture critique du tableau</strong> :
          </p>
          <ul className="space-y-2 my-4">
            <li className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>Le <strong>gastronomique tolère un prime cost plus haut</strong> (jusqu'à 75-80 %) grâce au ticket moyen élevé (120-300 EUR) et aux marges sur boissons (40-60 % du CA en vins).</span>
            </li>
            <li className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>Le <strong>fast-food doit absolument rester sous 58 %</strong> car ses marges nettes sont faibles (3-7 %). La moindre dérive le fait basculer en perte.</span>
            </li>
            <li className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>La <strong>dark kitchen</strong> a un labour cost réduit (pas de service en salle) mais doit compter les commissions plateformes (25-35 %) comme charge séparée.</span>
            </li>
            <li className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>Les <strong>brasseries parisiennes</strong> font exception : prime cost souvent à 68-72 % à cause des loyers élevés et du personnel CDI, compensé par un volume de couverts important.</span>
            </li>
          </ul>
        </section>

        {/* ═════════ SECTION 7 : Comparaison ═════════ */}
        <section id="vs" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">7. Prime cost vs food cost vs marge brute vs marge nette</h2>
          </div>

          <p>
            Ces quatre indicateurs sont souvent confondus. Voici la cartographie précise pour piloter chacun à sa place.
          </p>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Indicateur</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Mesure</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Cible</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Fréquence</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-975">
                  <td className="px-4 py-3 font-semibold text-teal-700">Food cost</td>
                  <td className="px-4 py-3 text-mono-500 text-xs">Coût matières seules</td>
                  <td className="px-4 py-3 font-semibold text-mono-100">25-35 %</td>
                  <td className="px-4 py-3 text-mono-500 text-xs">Hebdomadaire</td>
                </tr>
                <tr className="border-t border-mono-975">
                  <td className="px-4 py-3 font-semibold text-emerald-700">Marge brute</td>
                  <td className="px-4 py-3 text-mono-500 text-xs">100 - Food cost</td>
                  <td className="px-4 py-3 font-semibold text-mono-100">65-75 %</td>
                  <td className="px-4 py-3 text-mono-500 text-xs">Hebdomadaire</td>
                </tr>
                <tr className="border-t border-mono-975">
                  <td className="px-4 py-3 font-semibold text-purple-700">Prime cost</td>
                  <td className="px-4 py-3 text-mono-500 text-xs">Matières + masse salariale</td>
                  <td className="px-4 py-3 font-semibold text-mono-100">&lt; 65 %</td>
                  <td className="px-4 py-3 text-mono-500 text-xs">Hebdomadaire</td>
                </tr>
                <tr className="border-t border-mono-975">
                  <td className="px-4 py-3 font-semibold text-blue-700">Marge nette</td>
                  <td className="px-4 py-3 text-mono-500 text-xs">Résultat net / CA HT</td>
                  <td className="px-4 py-3 font-semibold text-mono-100">5-15 %</td>
                  <td className="px-4 py-3 text-mono-500 text-xs">Mensuelle</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            <strong>Schéma mental à retenir</strong> :
          </p>
          <div className="bg-mono-1000 rounded-2xl p-6 my-6">
            <pre className="text-xs sm:text-sm text-mono-350 font-mono leading-relaxed overflow-x-auto">{`CA HT (100 %)
   |
   -- Food cost (25-35 %)        <- Indicateur n 1 cuisine
   |
   = Marge brute (65-75 %)
       |
       -- Labour cost (28-38 %)  <- Indicateur n 2 RH
       |
       = Marge sur prime cost (35 %+)  <- DOIT couvrir tout le reste
           |
           -- Loyer (5-10 %)
           -- Énergie / fluides (3-5 %)
           -- Marketing (1-3 %)
           -- Assurances (1-2 %)
           -- Amortissements (3-5 %)
           -- Frais financiers (1-3 %)
           -- IS / autres taxes (2-4 %)
           |
           = Marge nette (5-15 %)`}</pre>
          </div>

          <p>
            <strong>Pourquoi le prime cost est plus important que la marge brute</strong> ? Parce qu'un restaurant peut avoir une marge brute superbe (72 %) mais une marge nette catastrophique (-2 %) si la masse salariale est démesurée. Le prime cost est le seul indicateur qui intègre les deux postes opérationnels et donne une vision réaliste. <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 font-semibold hover:underline">Voir notre guide complet sur le calcul de marge</Link>.
          </p>
        </section>

        {/* ═════════ SECTION 8 : Derives ═════════ */}
        <section id="derives" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-rose-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">8. Pourquoi mon prime cost dérive ?</h2>
          </div>

          <p>
            Votre prime cost passe de 62 % à 68 % en 4 mois. C'est <strong>50 000 EUR de marge perdue annuelle</strong> sur un restaurant à 800 000 EUR de CA. Voici les 8 causes les plus fréquentes de dérive et leurs signes précurseurs.
          </p>

          <div className="space-y-4 my-6">
            {[
              {
                cause: 'Hausse fournisseurs non répercutée',
                impact: '+1 à +3 pts sur food cost',
                signe: 'Food cost réel monte de 28 à 32 % sans changement de carte',
              },
              {
                cause: 'Sur-effectif en service',
                impact: '+2 à +5 pts sur labour cost',
                signe: 'Ratio CA par heure travaillée passe sous 45 EUR/h',
              },
              {
                cause: 'Amplitudes horaires trop larges',
                impact: '+2 à +4 pts sur labour cost',
                signe: 'Personnel payé 8h alors que coup de feu dure 3h',
              },
              {
                cause: 'Gaspillage alimentaire non maîtrisé',
                impact: '+1 à +3 pts sur food cost',
                signe: 'Écart food cost théorique vs réel supérieur à 3 points',
              },
              {
                cause: 'Augmentation SMIC + revalorisations',
                impact: '+1 à +2 pts sur labour cost',
                signe: 'Masse salariale augmente plus vite que le CA',
              },
              {
                cause: 'Baisse du CA sans ajustement effectifs',
                impact: '+3 à +6 pts sur labour cost',
                signe: 'CA -10 % mais même nombre d\'ETP',
              },
              {
                cause: 'Mix produits défavorable',
                impact: '+1 à +2 pts sur food cost',
                signe: 'Ventes de plats à forte marge en baisse, vins en baisse',
              },
              {
                cause: 'Sur-portions cuisine',
                impact: '+1 à +2 pts sur food cost',
                signe: 'Plaintes "trop copieux" + fiches techniques non respectées',
              },
            ].map((d, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base font-bold text-mono-100 !mt-0 !mb-0">{i + 1}. {d.cause}</h3>
                  <span className="text-xs font-semibold px-2 py-1 bg-rose-100 text-rose-700 rounded-full flex-shrink-0">{d.impact}</span>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed !mb-0"><strong>Signe précurseur :</strong> {d.signe}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════ SECTION 9 : Leviers food ═════════ */}
        <section id="leviers-food" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">9. Réduire le food cost : 6 leviers majeurs</h2>
          </div>

          <p>
            Six leviers actionnables pour faire baisser le food cost de 3 à 6 points en 90 jours.
          </p>

          <div className="space-y-3 my-6">
            {[
              { n: 1, t: 'Renégocier les 5 plus gros fournisseurs', i: '-2 a -4 pts', d: 'Devis annuel chez 2 concurrents pour chaque fournisseur principal. Mise en concurrence réelle. Volume garanti contre remise.' },
              { n: 2, t: 'Supprimer les plats à marge brute < 65 %', i: '-1 a -2 pts', d: 'Analysez chaque plat : ceux dont la marge brute est sous 65 % plombent le mix global. Retirez ou augmentez leur prix.' },
              { n: 3, t: 'Standardiser les fiches techniques', i: '-1 a -3 pts', d: 'Éliminer les sur-portions par fiche technique affichée au mur, balance en cuisine, contrôle hebdomadaire.' },
              { n: 4, t: 'Inventaire hebdomadaire', i: '-0,5 à -2 pts', d: 'Détecte vol, casse, gaspillage. Permet d\'ajuster les commandes en temps réel.' },
              { n: 5, t: 'Mercuriale des 20 ingrédients clés', i: '-1 a -2 pts', d: 'Suivi prix hebdo, achats d\'opportunité, substitution saisonnière.' },
              { n: 6, t: 'Réduction du gaspillage', i: '-1 a -3 pts', d: 'Pesée des déchets, méthode FIFO, traçabilité des sorties poubelles.' },
            ].map((l) => (
              <div key={l.n} className="bg-white border border-mono-900 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-extrabold">
                    {l.n}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <h3 className="text-base font-bold text-mono-100 !mt-0 !mb-0">{l.t}</h3>
                      <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full flex-shrink-0">{l.i}</span>
                    </div>
                    <p className="text-sm text-mono-400 leading-relaxed !mb-0">{l.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p>
            <Link to="/blog/reduire-food-cost" className="text-teal-700 font-semibold hover:underline">Lire le guide complet sur le food cost</Link> pour approfondir les techniques.
          </p>
        </section>

        {/* ═════════ SECTION 10 : Leviers labour ═════════ */}
        <section id="leviers-labour" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">10. Réduire le labour cost : 7 leviers majeurs</h2>
          </div>

          <p>
            Sept leviers actionnables pour faire baisser le labour cost de 4 à 8 points en 90 jours.
          </p>

          <div className="space-y-3 my-6">
            {[
              { n: 1, t: 'Plannings au quart d\'heure près', i: '-2 a -4 pts', d: 'Arrivée 15 min avant le service, départ 15 min après. Pas de présence inutile. Tableur ou logiciel de planning dédié.' },
              { n: 2, t: 'Polyvalence cuisine-salle', i: '-1 a -3 pts', d: 'Former chaque salarié sur 2-3 postes. Permet d\'absorber les pics avec moins d\'effectifs.' },
              { n: 3, t: 'Réduction des amplitudes horaires', i: '-2 a -3 pts', d: 'Fermer entre 14h30 et 18h (creux d\'après-midi). Personnel à domicile au lieu d\'attendre.' },
              { n: 4, t: 'Suppression des services peu rentables', i: '-1 a -3 pts', d: 'Si le service du lundi soir ne fait que 8 couverts, fermer. Personnel et matière ne couvrent même pas les variables.' },
              { n: 5, t: 'Préparation à J-1', i: '-0,5 à -2 pts', d: 'Moins de personnel au coup de feu. Mise en place le matin pour le soir.' },
              { n: 6, t: 'CDD / Extras au lieu de CDI', i: '-1 a -3 pts', d: 'Adapter les effectifs aux pics (vendredi/samedi). Pas de personnel payé à ne rien faire en semaine creuse.' },
              { n: 7, t: 'Apprentis / Contrats aidés', i: '-0,5 à -1,5 pt', d: 'Charges patronales réduites. Coût employeur entre 20 et 35 % plus bas selon les dispositifs.' },
            ].map((l) => (
              <div key={l.n} className="bg-white border border-mono-900 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-extrabold">
                    {l.n}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <h3 className="text-base font-bold text-mono-100 !mt-0 !mb-0">{l.t}</h3>
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex-shrink-0">{l.i}</span>
                    </div>
                    <p className="text-sm text-mono-400 leading-relaxed !mb-0">{l.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-5 my-6">
            <p className="text-sm text-blue-900 leading-relaxed">
              <strong>Indicateurs clés à suivre</strong> : CA par heure travaillée (Bistrot 45-55 EUR/h, Fast casual 60-80 EUR/h, Gastronomique 80-120 EUR/h). Ratio couverts / ETP (Bistrot 35-50, Fast casual 70-100, Gastronomique 8-15).
            </p>
          </div>
        </section>

        {/* ═════════ SECTION 11 : Cas pratique ═════════ */}
        <section id="cas-pratique" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">11. Cas pratique : passer de 72 % à 62 % en 90 jours</h2>
          </div>

          <p>
            Reprenons le <strong>Bistrot Leon</strong> en perte (-1 200 EUR/mois). Plan d'action 90 jours pour gagner 10 points de prime cost et redevenir rentable.
          </p>

          <div className="space-y-4 my-6">
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <h3 className="text-base font-bold text-mono-100 mb-2">Mois 1 : Audit + renégociation</h3>
              <ul className="text-sm text-mono-400 space-y-1.5">
                <li>- Identification des 8 plats à marge faible (food cost &gt; 35 %)</li>
                <li>- Renégociation viande -3 %, fruits/légumes -5 %, vin -2 %</li>
                <li>- Mise en place inventaire hebdomadaire</li>
                <li>- Fiches techniques affichées au mur</li>
                <li>- Pesée des déchets 5 jours/semaine</li>
              </ul>
              <p className="text-sm text-teal-700 mt-3 font-semibold">Résultat mois 1 : food cost 32,5 % vers 30 %, labour cost 44,7 % vers 42 % = prime cost 72 %</p>
            </div>

            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <h3 className="text-base font-bold text-mono-100 mb-2">Mois 2 : Refonte carte + plannings</h3>
              <ul className="text-sm text-mono-400 space-y-1.5">
                <li>- Carte réduite de 30 à 18 plats (moins de complexité + meilleur food cost)</li>
                <li>- Suppression d'un poste de plonge (lave-vaisselle haute performance + polyvalence)</li>
                <li>- Plannings au quart d'heure près (suppression amplitude inutile)</li>
                <li>- Service midi du lundi fermé (perte d'argent)</li>
                <li>- Économie masse salariale : 2 200 EUR/mois</li>
              </ul>
              <p className="text-sm text-teal-700 mt-3 font-semibold">Résultat mois 2 : food cost 30 % vers 29 %, labour cost 42 % vers 35 % = prime cost 64 %</p>
            </div>

            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <h3 className="text-base font-bold text-mono-100 mb-2">Mois 3 : Consolidation + mesure</h3>
              <ul className="text-sm text-mono-400 space-y-1.5">
                <li>- Stabilisation des nouvelles habitudes</li>
                <li>- Menu engineering (promotion des Stars, retrait des Poids morts)</li>
                <li>- Mercuriale hebdomadaire en place</li>
                <li>- Indicateurs de pilotage automatisés via logiciel</li>
              </ul>
              <p className="text-sm text-teal-700 mt-3 font-semibold">Résultat mois 3 : food cost 29 % vers 28,5 %, labour cost 35 % vers 33,5 % = <strong>prime cost 62 %</strong></p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 my-6 text-white text-center">
            <h3 className="text-xl font-extrabold mb-2">Résultat final après 90 jours</h3>
            <div className="font-mono text-sm space-y-1 my-3">
              <div>Avant : Prime cost <span className="line-through text-amber-200">77,2 %</span> -- Résultat -1 200 EUR/mois</div>
              <div>Après : Prime cost <strong className="text-2xl">62 %</strong> -- Résultat <strong className="text-2xl">+5 300 EUR/mois</strong></div>
            </div>
            <p className="text-emerald-50 text-sm">
              <strong>Gain net annuel : +78 000 EUR</strong> sans investissement majeur, juste avec de la rigueur de gestion.
            </p>
          </div>
        </section>

        {/* ═════════ SECTION 12 : Suivi ═════════ */}
        <section id="suivi" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <LineChart className="w-6 h-6 text-cyan-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">12. Suivi mensuel vs hebdomadaire</h2>
          </div>

          <p>
            Calculer le prime cost une fois par an, c'est trop tard. Si vous découvrez en janvier que votre prime cost de l'année précédente était à 71 %, vous avez perdu 12 mois et 30 000 à 60 000 EUR de marge.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Le tableau de bord idéal</h3>

          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Fréquence</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Indicateurs</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Temps</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Quotidien', 'CA, couverts, ticket moyen, ratio CA/heure travaillée', '2 min'],
                  ['Hebdomadaire', 'Food cost réel, labour cost prévisionnel, comparaison budget', '15 min'],
                  ['Mensuel', 'Prime cost complet, marge brute, marge nette, P&L', '30 min'],
                  ['Trimestriel', 'Tendances 13 semaines, comparaison N-1, ajustements stratégiques', '1h'],
                  ['Annuel', 'Bilan, prévision N+1, plan d\'investissement', '4h'],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-mono-975">
                    <td className="px-4 py-2.5 font-semibold text-teal-700">{row[0]}</td>
                    <td className="px-4 py-2.5 text-mono-350 text-xs">{row[1]}</td>
                    <td className="px-4 py-2.5 text-mono-500 text-xs">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Le suivi hebdomadaire permet de détecter une dérive en <strong>2 semaines maximum</strong>. C'est exactement ce que propose RestauMargin : la donnée fraîche, à la semaine, pour piloter avant qu'il ne soit trop tard.
          </p>
        </section>

        {/* ═════════ SECTION 13 : Outils ═════════ */}
        <section id="outils" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">13. Outils pour automatiser le calcul du prime cost</h2>
          </div>

          <p>
            Calculer son prime cost à la main est faisable mais demande beaucoup de discipline. Trois approches existent :
          </p>

          <div className="grid sm:grid-cols-3 gap-4 my-6">
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <h3 className="text-base font-bold text-mono-100 mb-2">Excel + Manuel</h3>
              <p className="text-sm text-mono-400 leading-relaxed mb-3">
                Tableur avec import paie + factures. Bon pour débutants. Demande 2-3h/mois.
              </p>
              <p className="text-xs text-teal-700 font-semibold">Coût : 0 EUR</p>
            </div>
            <div className="bg-white border border-teal-300 rounded-xl p-5 ring-2 ring-teal-100">
              <h3 className="text-base font-bold text-mono-100 mb-2">Logiciel CHR spécialisé</h3>
              <p className="text-sm text-mono-400 leading-relaxed mb-3">
                RestauMargin, Yokitup, Maitre D, Inpulse. Calcul automatique + alertes dérives.
              </p>
              <p className="text-xs text-teal-700 font-semibold">Coût : 39-150 EUR/mois</p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <h3 className="text-base font-bold text-mono-100 mb-2">Expert-comptable CHR</h3>
              <p className="text-sm text-mono-400 leading-relaxed mb-3">
                Suivi mensuel par spécialiste. Excellente qualité mais réactivité limitée.
              </p>
              <p className="text-xs text-teal-700 font-semibold">Coût : 300-800 EUR/mois</p>
            </div>
          </div>
        </section>

        {/* ═════════ CTA milieu ═════════ */}
        <div className="my-12 bg-gradient-to-br from-mono-100 to-mono-200 rounded-2xl p-6 sm:p-8 text-white text-center">
          <Sparkles className="w-10 h-10 text-teal-400 mx-auto mb-3" />
          <h3 className="text-xl sm:text-2xl font-extrabold mb-3">Pilote ton prime cost en 5 min</h3>
          <p className="text-mono-400 text-sm sm:text-base mb-5 max-w-lg mx-auto">
            Avec RestauMargin : food cost en temps réel, labour cost automatisé, prime cost calculé à la semaine, alertes en cas de dérive, benchmarks sectoriels intégrés.
          </p>
          <Link
            to="/outils/calculateur-food-cost"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors"
          >
            Accéder au calculateur gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ═════════ FAQ ═════════ */}
        <section id="faq" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">14. FAQ : 15 questions fréquentes sur le prime cost</h2>
          </div>

          <div className="space-y-3 my-6">
            {faqItems.map((item, i) => (
              <details key={i} className="bg-mono-1000 border border-mono-900 rounded-xl group">
                <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors text-sm">
                  {item.question}
                  <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                </summary>
                <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ═════════ Articles complementaires ═════════ */}
        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 mb-6">Articles complémentaires</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { to: '/blog/reduire-food-cost', t: 'Food cost restaurant : guide complet 2026', d: 'Formule, calcul, benchmarks et 10 leviers pour réduire le food cost.' },
              { to: '/blog/calcul-marge-restaurant', t: 'Calcul de marge restaurant', d: 'Formules, benchmarks et erreurs courantes pour piloter vos marges.' },
              { to: '/blog/coefficient-multiplicateur', t: 'Coefficient multiplicateur en restauration', d: 'Tableaux complets par catégorie de plat pour fixer vos prix.' },
              { to: '/blog/prix-de-vente-restaurant', t: 'Fixer le prix de vente d\'un plat', d: 'Méthode complète avec psychologie du prix et benchmarks 2026.' },
              { to: '/blog/cout-revient-plat-restaurant', t: 'Calculer le coût de revient d\'un plat', d: 'Méthode pas à pas, ratios de perte et fiches techniques.' },
              { to: '/blog/seuil-rentabilite-restaurant', t: 'Seuil de rentabilité d\'un restaurant', d: 'À partir de combien de couverts votre établissement est-il rentable ?' },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
              >
                <h3 className="text-sm font-bold text-mono-100 mb-1 group-hover:text-teal-700 transition-colors !mt-0 !mb-1">{a.t}</h3>
                <p className="text-xs text-mono-500 !mb-0">{a.d}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ═════════ Sources EEAT ═════════ */}
        <section className="mb-14 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4">Sources et références</h2>
          <ul className="space-y-2 text-sm text-mono-400">
            <li>- <strong>National Restaurant Association</strong> : Prime cost benchmarks et méthodologie 2025</li>
            <li>- <strong>Fiducial</strong> : Observatoire de la restauration commerciale France 2025</li>
            <li>- <strong>INSEE</strong> : Comptes nationaux trimestriels - secteur 56 (hébergement-restauration)</li>
            <li>- <strong>GIRA Conseil</strong> : Tendances et chiffres-clés de la restauration France 2026</li>
            <li>- <strong>KPMG</strong> : Étude annuelle hôtellerie-restauration France 2025</li>
            <li>- <strong>UMIH</strong> : Référentiel des ratios de gestion CHR</li>
            <li>- <strong>URSSAF</strong> : Barème charges patronales 2026 secteur HCR</li>
          </ul>
          <p className="text-xs text-mono-500 mt-4 italic">
            Article rédigé par la rédaction RestauMargin. Mis à jour le 26 mai 2026. Méthodologie : croisement des données publiques INSEE, Fiducial et NRA avec les retours terrain de des restaurateurs accompagnés depuis 2025.
          </p>
        </section>

        <BlogAuthor publishedDate="2026-04-14" updatedDate="2026-05-26" readTime="20 min" variant="footer" />

        </article>
      </main>

      {/* ── CTA final ── */}
      <section className="bg-gradient-to-br from-teal-50 to-emerald-50 py-14 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 mb-3 font-satoshi">
            Pilote ton prime cost en temps réel avec RestauMargin
          </h2>
          <p className="text-mono-500 mb-6">
            Calcul automatique food cost + labour cost + prime cost. Comparaison aux benchmarks. Alertes en cas de dérive. Le copilote financier qui transforme un restaurant tendu en restaurant rentable.
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
      <PublicFooter />

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
