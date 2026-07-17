import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, TrendingDown, BarChart3, AlertTriangle, Target, ArrowRight, Zap, CheckCircle, Lightbulb, ListChecks, Users, Award, TrendingUp, Building2, Wallet, ChevronRight } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Seuil de rentabilité restaurant : guide complet 2026"
   Mots-clés : seuil de rentabilité restaurant, point mort restaurant,
   break-even restaurant, ratios rentabilité restauration
   ~3 200 mots — mode clair, schema FAQ + HowTo + Article + Breadcrumb
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quelle est la différence entre seuil de rentabilité et point mort ?",
    answer: "Ces deux termes désignent la même réalité financière : le niveau de chiffre d'affaires à partir duquel votre restaurant ne perd plus d'argent. Le seuil de rentabilité s'exprime en euros (CA minimum), le point mort en jours (date à laquelle votre activité devient rentable dans l'année). Si votre seuil est de 300 000 EUR et votre CA annuel prévu de 500 000 EUR, votre point mort tombera vers le 219ème jour de l'année.",
  },
  {
    question: "Quel est le seuil de rentabilité moyen d'un restaurant en France en 2026 ?",
    answer: "Selon les données Fiducial et GIRA 2025, un restaurant traditionnel de 60 couverts atteint son point mort entre le 200ème et le 230ème jour de l'année, soit fin juillet. Les meilleurs (top 25 %) y arrivent dès le 150ème jour (fin mai), les plus fragiles ne l'atteignent jamais. Le seuil de rentabilité mensuel moyen est de 35 000 à 55 000 EUR HT selon la taille et l'emplacement.",
  },
  {
    question: "Comment calculer rapidement mon seuil de rentabilité ?",
    answer: "Formule simple : Seuil = Charges fixes / Taux de marge sur coût variable. Exemple : 18 000 EUR de charges fixes mensuelles et un taux de MCV de 60 % donnent un seuil de 30 000 EUR/mois. Plus votre taux de MCV est élevé, plus votre seuil est bas. Pour automatiser : utilisez RestauMargin qui calcule ce ratio en temps réel à partir de vos données réelles.",
  },
  {
    question: "Mon food cost est à 35 %, est-ce trop élevé ?",
    answer: "35 % est dans la fourchette haute mais acceptable pour un restaurant gastronomique ou une brasserie premium. Pour un fast casual, une pizzeria ou un coffee shop, c'est trop : visez 25 à 30 %. Règle d'or : food cost + masse salariale (prime cost) ne doivent jamais dépasser 65-70 % de votre CA HT, sinon votre marge nette devient mathématiquement impossible.",
  },
  {
    question: "Comment le seuil de rentabilité change-t-il avec la livraison ?",
    answer: "La livraison via plateformes (Uber Eats, Deliveroo) crée un deuxième seuil de rentabilité spécifique. Les commissions plateforme (25 à 30 % du prix de vente TTC) s'ajoutent au coût matières et écrasent votre taux de MCV. Notre conseil : calculez le seuil de votre activité livraison séparément. Une commande à 25 EUR avec 28 % de commission ne rapporte que 18 EUR brut au restaurant.",
  },
  {
    question: "Puis-je calculer mon seuil de rentabilité sans comptable ?",
    answer: "Oui. La formule du seuil de rentabilité ne nécessite pas de formation comptable poussée. Il faut surtout classer correctement vos charges en fixes (loyer, salaires CDI, assurances) et variables (matières, énergie consommée, commissions). Un outil comme RestauMargin automatise cette ventilation à partir de vos factures et calcule le seuil en temps réel dans votre tableau de bord.",
  },
  {
    question: "Mon seuil de rentabilité est trop haut, par où commencer pour le baisser ?",
    answer: "Trois leviers prioritaires dans l'ordre : (1) Renégocier vos 3 plus gros postes fixes (loyer, salaires CDI, assurances) qui pèsent souvent 60 % de vos charges fixes. (2) Améliorer votre taux de MCV en réduisant le food cost de 2 à 4 points (fiches techniques, FIFO, négociation fournisseurs). (3) Augmenter le ticket moyen via upsell (entrée, dessert, boisson). Une optimisation combinée réduit le seuil de 10 à 15 %.",
  },
  {
    question: "Faut-il recalculer son seuil de rentabilité régulièrement ?",
    answer: "Oui, au minimum chaque trimestre, et systématiquement après tout changement majeur : embauche, hausse de loyer, modification de la carte, lancement d'un nouveau canal (livraison, événementiel), revalorisation du SMIC. Un seuil calculé une fois à l'ouverture devient obsolète en 6 mois. Idéalement, suivez-le en continu via un tableau de bord automatisé.",
  },
  {
    question: "Le seuil de rentabilité prend-il en compte ma rémunération de gérant ?",
    answer: "Cela dépend du statut juridique. En EURL/SARL avec un gérant majoritaire TNS, la rémunération est une charge fixe à intégrer dans le calcul. En SAS/SASU, la rémunération du président est une charge si elle est versée en salaire, sinon les dividendes ne sont prélevés que sur le résultat. Notre recommandation : intégrez TOUJOURS votre rémunération cible dans le seuil — sinon vous travaillez gratuitement.",
  },
  {
    question: "Quelle marge de sécurité viser au-delà du seuil de rentabilité ?",
    answer: "Une marge de sécurité de 20 à 30 % est saine. Concrètement, si votre seuil est de 40 000 EUR/mois, visez un CA de 48 000 à 52 000 EUR pour absorber les imprévus (panne, congés, baisse saisonnière). En dessous de 15 % de marge, votre restaurant est en zone rouge. Au-delà de 40 %, vous pouvez envisager des investissements de croissance (recrutement, second établissement).",
  },
];

const howToSteps = [
  {
    name: "Lister toutes les charges fixes du mois",
    text: "Recensez chaque charge fixe : loyer, salaires CDI charges incluses, assurances, abonnements (logiciels, énergie fixe), amortissements, frais bancaires. N'oubliez pas votre rémunération de gérant et les charges sociales TNS. Total à viser : entre 12 000 et 25 000 EUR pour un restaurant indépendant de 50 couverts.",
  },
  {
    name: "Calculer les charges variables en pourcentage du CA",
    text: "Additionnez vos charges variables : food cost (28-33 %), boissons (20-30 %), énergie variable (3-5 %), commissions plateformes (15-30 %), packaging (1-2 %), heures supplémentaires. Exprimez le total en pourcentage du CA HT. La moyenne secteur 2026 est de 38-42 %.",
  },
  {
    name: "Calculer le taux de Marge sur Coût Variable",
    text: "Formule : Taux MCV = (CA - Charges variables) / CA x 100. Exemple : si vos charges variables représentent 40 % du CA, votre taux MCV est de 60 %. Plus ce taux est élevé, plus chaque euro encaissé contribue à couvrir vos charges fixes. Cible : 55 à 65 % en restauration traditionnelle.",
  },
  {
    name: "Calculer le seuil de rentabilité en euros",
    text: "Formule : Seuil de rentabilité (EUR) = Charges fixes / Taux MCV. Exemple : 18 000 EUR de charges fixes / 0,60 = 30 000 EUR. Vous devez réaliser au minimum 30 000 EUR de CA HT mensuel pour ne pas perdre d'argent.",
  },
  {
    name: "Convertir en couverts quotidiens nécessaires",
    text: "Divisez le seuil mensuel par le ticket moyen HT, puis par le nombre de jours d'ouverture. Exemple : 30 000 / 28 EUR / 26 jours = 41 couverts/jour. Comparez à votre capacité réelle pour évaluer la faisabilité.",
  },
  {
    name: "Calculer le point mort calendaire",
    text: "Formule : Point mort (jours) = Seuil annuel / (CA annuel prévu / 365). Si votre seuil annuel est 360 000 EUR et votre CA prévu 600 000 EUR, point mort = 360 000 / (600 000/365) = 219 jours, soit le 7 août. Vous générez vos bénéfices sur les 146 jours restants.",
  },
  {
    name: "Définir votre marge de sécurité et plan d'action",
    text: "Calculez l'écart entre votre CA prévu et votre seuil : Marge de sécurité = (CA - Seuil) / CA x 100. Une marge inférieure à 15 % impose un plan d'action urgent : réduction des charges fixes ou amélioration du taux MCV.",
  },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: "Seuil de rentabilité restaurant : guide complet 2026 (formules + exemples)",
  description: "Comment calculer le seuil de rentabilité de votre restaurant : formules, exemples chiffrés, stratégies pour atteindre la rentabilité plus vite et tableau de bord.",
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'La rédaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
  },
  datePublished: '2026-04-25',
  dateModified: '2026-05-26',
  wordCount: 3200,
  inLanguage: 'fr-FR',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/seuil-rentabilite-restaurant' },
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment calculer le seuil de rentabilité de votre restaurant en 7 étapes',
  description: "Méthode pas-à-pas pour calculer le seuil de rentabilité, le point mort et la marge de sécurité d'un restaurant.",
  totalTime: 'PT30M',
  tool: ['Bilan comptable', 'Tableur ou logiciel RestauMargin', 'Données de caisse'],
  step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
};

export default function BlogSeuilRentabilite() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Seuil de rentabilité restaurant : guide complet 2026 (formules)"
        description="Comment calculer le seuil de rentabilité d'un restaurant : formules, exemples chiffrés, point mort, marge de sécurité et tableau de bord 2026."
        path="/blog/seuil-rentabilite-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Seuil de rentabilité restaurant', url: 'https://www.restaumargin.fr/blog/seuil-rentabilite-restaurant' },
          ]),
          articleSchema,
          howToSchema,
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
              Calculer ma rentabilité
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
          <ChevronRight className="w-3 h-3" />
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-mono-100 font-medium">Seuil de rentabilité restaurant</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Rentabilité"
        readTime="15 min"
        date="Mai 2026"
        title="Seuil de rentabilité restaurant : guide complet 2026"
        accentWord="seuil de rentabilité"
        subtitle="60 % des restaurants ferment dans les 3 premières années. La cause N°1 : ne pas connaître son point mort. Voici la méthode complète, les formules, 3 cas réels chiffrés et le tableau de bord à mettre en place."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-25" updatedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* Encadré formule rapide (featured snippet) */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formule rapide seuil de rentabilité</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">Les 3 formules essentielles à retenir</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Taux MCV (%)</strong> = (CA HT - Charges variables) / CA HT x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Seuil de rentabilité (EUR)</strong> = Charges fixes / Taux MCV</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Point mort (jours)</strong> = Seuil annuel / (CA annuel / 365)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Marge de sécurité (%)</strong> = (CA - Seuil) / CA x 100</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectif standard restauration : taux MCV entre 55 % et 65 %, marge de sécurité supérieure à 20 %.
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
              { href: '#definition', label: "Qu'est-ce que le seuil de rentabilité d'un restaurant ?" },
              { href: '#enjeux', label: "Pourquoi le seuil de rentabilité est critique en 2026" },
              { href: '#composantes', label: 'Charges fixes vs charges variables : la classification' },
              { href: '#formule', label: 'La formule du seuil de rentabilité expliquée' },
              { href: '#howto', label: 'Comment calculer en 7 étapes' },
              { href: '#cas-bistrot', label: "Cas pratique : bistrot parisien 40 couverts" },
              { href: '#cas-pizzeria', label: "Cas pratique : pizzeria quartier" },
              { href: '#cas-gastronomique', label: "Cas pratique : restaurant gastronomique" },
              { href: '#benchmarks', label: "Benchmarks 2026 par type d'établissement" },
              { href: '#reduire', label: "Comment réduire son seuil de rentabilité" },
              { href: '#tableau-bord', label: "Construire un tableau de bord rentabilité" },
              { href: '#erreurs', label: "Les 6 erreurs qui sabotent votre seuil" },
              { href: '#automatiser', label: "Automatiser le suivi avec RestauMargin" },
              { href: '#faq', label: 'Questions fréquentes' },
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

        {/* SECTION 1 : Définition */}
        <section id="definition" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="1">
            Qu'est-ce que le seuil de rentabilité d'un restaurant ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>seuil de rentabilité</strong> (également appelé <strong>point mort</strong> ou <strong>break-even point</strong>)
              est le chiffre d'affaires minimum que votre restaurant doit réaliser pour couvrir l'ensemble de ses charges — ni bénéfice,
              ni perte. C'est l'indicateur de rentabilité le plus fondamental, plus important encore que le CA brut ou le nombre
              de couverts servis.
            </p>
            <p>
              Sous ce seuil, vous perdez de l'argent chaque jour. Au-dessus, vous commencez à dégager du bénéfice.
              Pourtant, selon une étude Fiducial 2025, <strong>seuls 22 % des restaurateurs indépendants connaissent
              précisément leur seuil de rentabilité</strong>. La majorité gère "au feeling" — et le réveil financier
              survient souvent trop tard.
            </p>
            <p>
              Un restaurant qui réalise 18 000 EUR de CA mensuel peut très bien perdre 2 000 EUR si son seuil est à 20 000 EUR.
              Inversement, un établissement à 12 000 EUR de CA peut être rentable si ses charges fixes sont contenues à 6 000 EUR.
              Le CA brut ne dit rien de la rentabilité — seul le seuil de rentabilité tranche.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Un restaurant qui réduit son seuil de rentabilité de 10 % (par exemple en passant
              de 30 000 à 27 000 EUR/mois) gagne 36 000 EUR de marge brute annuelle supplémentaire sans servir un seul couvert
              de plus. C'est l'effet de levier le plus puissant du pilotage financier en restauration.
            </Callout>
          </div>
        </section>

        {/* SECTION 2 : Enjeux 2026 */}
        <section id="enjeux" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="2">
            Pourquoi le seuil de rentabilité est critique en 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              En 2026, le secteur de la restauration subit une triple pression sans précédent qui rend la maîtrise du seuil
              de rentabilité plus vitale que jamais :
            </p>
            <ul>
              <li><strong>Inflation matières premières cumulée :</strong> +22 % sur 3 ans (INSEE 2025). Le beurre, l'huile, les viandes ont explosé.</li>
              <li><strong>Revalorisation du SMIC :</strong> +4 hausses depuis 2023, soit +13 % de masse salariale brute.</li>
              <li><strong>Coûts énergétiques :</strong> volatiles, gaz et électricité ont doublé dans certaines régions.</li>
              <li><strong>Pression livraison :</strong> Uber Eats et Deliveroo prélèvent 25 à 30 % de commission sur chaque commande.</li>
            </ul>
            <p>
              Résultat : la marge nette moyenne des restaurants français est passée de 8 % en 2019 à <strong>3,9 % en 2025</strong>
              (source GIRA Conseil). Dans ce contexte, ne pas connaître son seuil de rentabilité, c'est conduire les yeux fermés
              sur une route de montagne.
            </p>
            <p>
              Pour aller plus loin sur les fondamentaux financiers, consultez aussi notre <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800">guide complet du calcul de marge restaurant</Link> et
              notre <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800">méthode food cost</Link>.
            </p>
          </div>
        </section>

        {/* SECTION 3 : Charges fixes vs variables */}
        <section id="composantes" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="3">
            Charges fixes vs charges variables : la classification
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant d'appliquer la formule du seuil de rentabilité, vous devez classer vos charges en deux catégories.
              Cette ventilation est la base de tout le calcul — une mauvaise classification fausse complètement votre
              seuil de 10 à 20 %.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-blue-900">Charges fixes (CF)</h3>
              </div>
              <p className="text-sm text-blue-800 mb-3"><em>Indépendantes du volume d'activité</em></p>
              <ul className="space-y-2 text-sm text-blue-900">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Loyer + charges locatives (2 000 à 8 000 EUR)</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Salaires CDI charges incluses (5 000 à 20 000 EUR)</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Assurances (RC pro, multirisque) : 300-800 EUR</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Leasing équipements : 400-2 000 EUR</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Amortissements + frais financiers</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Abonnements (caisse, compta, internet) : 150-400 EUR</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Rémunération gérant + charges sociales</span></li>
              </ul>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Charges variables (CV)</h3>
              </div>
              <p className="text-sm text-emerald-800 mb-3"><em>Proportionnelles au CA</em></p>
              <ul className="space-y-2 text-sm text-emerald-900">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Matières premières (food cost) : 25-35 %</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Boissons : 20-30 %</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Énergie variable (cuisson, lavage) : 3-5 %</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Commissions plateformes : 15-30 %</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Heures supplémentaires variables</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Emballages, pailles, serviettes : 1-2 %</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>Commissions de paiement (CB) : 0,5-1 %</span></li>
              </ul>
            </div>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Cas particulier des salaires :</strong> en restauration, les CDI sont fixes mais les extras et les heures
              supplémentaires sont variables. Faites un partage 70 % CDI fixe / 30 % variable pour une approche réaliste.
              Si vous travaillez beaucoup avec des extras pour les services, augmentez la part variable.
            </p>
            <p>
              <strong>Astuce comptable :</strong> certains experts-comptables classent l'énergie en charge fixe (à tort).
              L'énergie variable (cuisson, lavage) augmente avec le nombre de couverts servis : c'est une charge variable.
              Seul l'abonnement de base est fixe.
            </p>
          </div>
        </section>

        {/* SECTION 4 : Formule */}
        <section id="formule" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="4">
            La formule du seuil de rentabilité expliquée
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le calcul du seuil de rentabilité se fait en 4 étapes successives. Chaque étape s'appuie sur la précédente —
              ne sautez aucune.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Étape 1 — Calculer la Marge sur Coût Variable (MCV)</h3>
            <p>
              La MCV représente ce qu'il vous reste après avoir payé les charges variables. C'est ce qui va servir à couvrir
              les charges fixes puis générer du bénéfice.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100 space-y-1">
            <div>MCV (EUR) = CA HT - Charges variables</div>
            <div>Taux MCV (%) = MCV / CA HT x 100</div>
          </div>

          <div className="prose-content">
            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Étape 2 — Calculer le Seuil de Rentabilité</h3>
            <p>
              Une fois le taux MCV connu, le seuil se déduit directement. C'est le CA minimum nécessaire pour absorber
              vos charges fixes.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100">
            Seuil de rentabilité (EUR) = Charges fixes / Taux MCV
          </div>

          <div className="prose-content">
            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Étape 3 — Convertir en couverts quotidiens</h3>
            <p>
              Pour rendre le seuil actionnable, traduisez-le en nombre de couverts à servir chaque jour. C'est ce que votre
              équipe peut visualiser sur le terrain.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100 space-y-1">
            <div>Couverts/mois = Seuil mensuel / Ticket moyen HT</div>
            <div>Couverts/jour = Couverts mois / Jours d'ouverture</div>
          </div>

          <div className="prose-content">
            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Étape 4 — Calculer le Point Mort calendaire</h3>
            <p>
              Le point mort calendaire est la date à laquelle votre restaurant devient rentable dans l'année. Plus il
              est précoce, plus votre marge nette annuelle est élevée.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100">
            Point mort (jours) = Seuil annuel / (CA annuel / 365)
          </div>

          <div className="prose-content mt-6">
            <p>
              Si votre point mort tombe au 220ème jour de l'année (mi-août), vos bénéfices se génèrent uniquement sur
              les 145 jours restants. Plus le point mort est tardif, plus votre marge est fragile face aux imprévus
              (canicule, grève, panne).
            </p>
          </div>
        </section>

        {/* SECTION 5 : HowTo 7 étapes */}
        <section id="howto" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="5">
            Comment calculer en 7 étapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la méthode pas-à-pas pour calculer le seuil de rentabilité de votre restaurant.
              Comptez 30 à 45 minutes la première fois, puis 5 minutes en routine mensuelle.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {howToSteps.map((step, i) => (
              <li key={i} className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7 flex gap-5">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg shadow-md">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-mono-100 text-lg mb-2">{step.name}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <Callout type="info">
            <strong>Gain de temps :</strong> au lieu de refaire ce calcul à la main chaque mois,
            <Link to="/login" className="underline font-semibold hover:text-teal-700"> ouvrez un compte gratuit RestauMargin</Link> qui
            recalcule votre seuil en temps réel à partir de vos factures et de votre caisse.
          </Callout>
        </section>

        {/* SECTION 6 : Cas bistrot */}
        <section id="cas-bistrot" className="mb-16">
          <SectionHeading icon={<Building2 className="w-6 h-6" />} number="6">
            Cas pratique : bistrot parisien 40 couverts
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons le cas du <strong>"Comptoir des Halles"</strong>, un bistrot parisien de 40 couverts ouvert
              6 jours/7, midi + soir. Données réelles d'un client RestauMargin (anonymisé).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste</th>
                  <th className="text-right py-3 px-4 font-semibold">Montant mensuel</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">% du CA</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Chiffre d'affaires HT</td><td className="py-3 px-4 text-right">45 000 EUR</td><td className="py-3 px-4 text-right">100 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Food cost + boissons</td><td className="py-3 px-4 text-right text-red-700">-14 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-31,1 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Énergie variable</td><td className="py-3 px-4 text-right text-red-700">-1 800 EUR</td><td className="py-3 px-4 text-right text-red-700">-4,0 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Emballages + CB</td><td className="py-3 px-4 text-right text-red-700">-450 EUR</td><td className="py-3 px-4 text-right text-red-700">-1,0 %</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">= Marge sur Coût Variable</td><td className="py-3 px-4 text-right font-bold text-emerald-900">28 750 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-900">63,9 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Loyer + charges</td><td className="py-3 px-4 text-right text-red-700">-4 500 EUR</td><td className="py-3 px-4 text-right text-red-700">-10,0 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Salaires CDI + charges</td><td className="py-3 px-4 text-right text-red-700">-9 800 EUR</td><td className="py-3 px-4 text-right text-red-700">-21,8 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Assurances + leasing</td><td className="py-3 px-4 text-right text-red-700">-1 100 EUR</td><td className="py-3 px-4 text-right text-red-700">-2,4 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Abonnements + compta</td><td className="py-3 px-4 text-right text-red-700">-530 EUR</td><td className="py-3 px-4 text-right text-red-700">-1,2 %</td></tr>
                <tr className="bg-blue-50"><td className="py-3 px-4 font-bold text-blue-900">= Total charges fixes</td><td className="py-3 px-4 text-right font-bold text-blue-900">15 930 EUR</td><td className="py-3 px-4 text-right font-bold text-blue-900">35,4 %</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p><strong>Calculs :</strong></p>
            <ul>
              <li>Taux MCV = (45 000 - 16 250) / 45 000 = <strong>63,9 %</strong></li>
              <li>Seuil de rentabilité mensuel = 15 930 / 0,639 = <strong>24 929 EUR</strong></li>
              <li>Couverts seuil/mois = 24 929 / 28 EUR = <strong>890 couverts</strong></li>
              <li>Couverts seuil/jour = 890 / 26 = <strong>34 couverts/jour</strong> (taux d'occupation 85 %)</li>
              <li>Point mort calendaire = 24 929 x 12 / (45 000 x 12 / 365) = <strong>jour 202 (21 juillet)</strong></li>
              <li>Marge de sécurité = (45 000 - 24 929) / 45 000 = <strong>44,6 %</strong></li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Verdict :</strong> ce bistrot est en bonne santé financière. Marge de sécurité de 44,6 %, point mort
            atteint mi-juillet. Les 5,5 derniers mois génèrent la majeure partie du bénéfice annuel. Toute charge fixe
            supplémentaire (embauche, hausse de loyer) doit être calculée à l'aune de cette marge de sécurité.
          </Callout>
        </section>

        {/* SECTION 7 : Cas pizzeria */}
        <section id="cas-pizzeria" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="7">
            Cas pratique : pizzeria de quartier
          </SectionHeading>

          <div className="prose-content">
            <p>
              Cas opposé : une pizzeria de quartier avec 32 places assises, ouverte 6 j/7 soir uniquement + livraison
              quotidienne. Forte part livraison (40 % du CA), food cost très bas mais commissions plateformes lourdes.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste</th>
                  <th className="text-right py-3 px-4 font-semibold">Montant mensuel</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">% du CA</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">CA HT (60 % salle + 40 % livraison)</td><td className="py-3 px-4 text-right">32 000 EUR</td><td className="py-3 px-4 text-right">100 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Food cost (très bas)</td><td className="py-3 px-4 text-right text-red-700">-7 040 EUR</td><td className="py-3 px-4 text-right text-red-700">-22,0 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Commissions plateformes (sur 40 % CA)</td><td className="py-3 px-4 text-right text-red-700">-3 584 EUR</td><td className="py-3 px-4 text-right text-red-700">-11,2 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Énergie + emballages</td><td className="py-3 px-4 text-right text-red-700">-1 760 EUR</td><td className="py-3 px-4 text-right text-red-700">-5,5 %</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">= MCV</td><td className="py-3 px-4 text-right font-bold text-emerald-900">19 616 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-900">61,3 %</td></tr>
                <tr className="bg-blue-50"><td className="py-3 px-4 font-bold text-blue-900">Charges fixes (loyer + 2 CDI + autres)</td><td className="py-3 px-4 text-right font-bold text-blue-900">10 800 EUR</td><td className="py-3 px-4 text-right font-bold text-blue-900">33,8 %</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p><strong>Résultats :</strong></p>
            <ul>
              <li>Seuil de rentabilité = 10 800 / 0,613 = <strong>17 619 EUR/mois</strong></li>
              <li>Couverts/jour pour atteindre le seuil = <strong>23 pizzas/jour</strong> (ticket moyen 25 EUR)</li>
              <li>Marge de sécurité = 44,9 %</li>
              <li>Point mort = jour 200 (19 juillet)</li>
            </ul>
            <p>
              <strong>Effet livraison :</strong> sans la livraison, le taux MCV passerait à 70 % et le seuil tomberait
              à 15 428 EUR. La livraison absorbe 2 200 EUR de seuil de rentabilité supplémentaire.
              C'est le prix à payer pour le volume.
            </p>
          </div>
        </section>

        {/* SECTION 8 : Cas gastronomique */}
        <section id="cas-gastronomique" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="8">
            Cas pratique : restaurant gastronomique
          </SectionHeading>

          <div className="prose-content">
            <p>
              Troisième profil : un restaurant gastronomique de province, 28 places, ouvert 5 jours/7, midi + soir.
              Ticket moyen élevé mais food cost premium et masse salariale lourde.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste</th>
                  <th className="text-right py-3 px-4 font-semibold">Montant mensuel</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">% du CA</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">CA HT (28 cv x 75 EUR x 2 svc x 22 j)</td><td className="py-3 px-4 text-right">92 400 EUR</td><td className="py-3 px-4 text-right">100 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Food cost premium (truffe, foie gras)</td><td className="py-3 px-4 text-right text-red-700">-33 264 EUR</td><td className="py-3 px-4 text-right text-red-700">-36,0 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Boissons (cave)</td><td className="py-3 px-4 text-right text-red-700">-2 772 EUR</td><td className="py-3 px-4 text-right text-red-700">-3,0 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Énergie + autres variables</td><td className="py-3 px-4 text-right text-red-700">-4 158 EUR</td><td className="py-3 px-4 text-right text-red-700">-4,5 %</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">= MCV</td><td className="py-3 px-4 text-right font-bold text-emerald-900">52 206 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-900">56,5 %</td></tr>
                <tr className="bg-blue-50"><td className="py-3 px-4 font-bold text-blue-900">Charges fixes (8 CDI + loyer + autres)</td><td className="py-3 px-4 text-right font-bold text-blue-900">42 000 EUR</td><td className="py-3 px-4 text-right font-bold text-blue-900">45,5 %</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p><strong>Résultats :</strong></p>
            <ul>
              <li>Seuil de rentabilité = 42 000 / 0,565 = <strong>74 336 EUR/mois</strong></li>
              <li>Couverts/jour pour atteindre le seuil = <strong>45 couverts/jour</strong> (taux d'occupation 80 %)</li>
              <li>Marge de sécurité = 19,6 % (zone orange)</li>
              <li>Point mort = jour 294 (21 octobre)</li>
            </ul>
            <p>
              <strong>Verdict :</strong> ce gastronomique est en zone fragile. Le point mort fin octobre signifie que
              seuls les 2 derniers mois génèrent le bénéfice annuel. Une simple baisse de 10 % de fréquentation en
              décembre fait basculer en pertes. Levier prioritaire : améliorer le food cost de 4 points (passer de 36 % à 32 %)
              via menu engineering et négociation fournisseurs.
            </p>
          </div>
        </section>

        {/* SECTION 9 : Benchmarks */}
        <section id="benchmarks" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="9">
            Benchmarks 2026 par type d'établissement
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les fourchettes de seuil de rentabilité observées en France en 2026 selon le type d'établissement.
              Données agrégées GIRA Conseil, Fiducial, INSEE et base RestauMargin (500+ restaurants).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type d'établissement</th>
                  <th className="text-center py-3 px-4 font-semibold">Taux MCV moyen</th>
                  <th className="text-center py-3 px-4 font-semibold">CF / CA</th>
                  <th className="text-center py-3 px-4 font-semibold">Point mort moyen</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge sécurité saine</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { type: 'Pizzeria / Italien', mcv: '60-68 %', cf: '28-35 %', pm: '180-210 j', ms: '> 30 %' },
                  { type: 'Bistrot / Brasserie', mcv: '58-65 %', cf: '32-40 %', pm: '200-230 j', ms: '> 25 %' },
                  { type: 'Restaurant traditionnel', mcv: '55-62 %', cf: '35-42 %', pm: '210-250 j', ms: '> 20 %' },
                  { type: 'Gastronomique', mcv: '52-60 %', cf: '40-50 %', pm: '250-310 j', ms: '> 15 %' },
                  { type: 'Coffee shop', mcv: '65-75 %', cf: '30-38 %', pm: '170-200 j', ms: '> 30 %' },
                  { type: 'Fast casual / Burger', mcv: '60-68 %', cf: '30-38 %', pm: '190-220 j', ms: '> 25 %' },
                  { type: 'Food truck', mcv: '62-72 %', cf: '25-32 %', pm: '160-200 j', ms: '> 30 %' },
                  { type: 'Dark kitchen (100 % livraison)', mcv: '45-55 %', cf: '30-38 %', pm: '230-280 j', ms: '> 18 %' },
                  { type: 'Traiteur / Banquet', mcv: '55-65 %', cf: '30-40 %', pm: '200-240 j', ms: '> 20 %' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.type}</td>
                    <td className="py-3 px-4 text-center">{row.mcv}</td>
                    <td className="py-3 px-4 text-center">{row.cf}</td>
                    <td className="py-3 px-4 text-center">{row.pm}</td>
                    <td className="py-3 px-4 text-center">{row.ms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p>
              <strong>Lecture :</strong> un coffee shop atteint son seuil rapidement (MCV élevé, charges fixes contenues),
              mais avec un ticket moyen bas (4 à 8 EUR). À l'inverse, un gastronomique a un seuil plus élevé mais bénéficie
              d'un ticket moyen de 80 à 150 EUR. Choisissez votre modèle économique en connaissance de cause.
            </p>
          </div>
        </section>

        {/* SECTION 10 : Réduire le seuil */}
        <section id="reduire" className="mb-16">
          <SectionHeading icon={<TrendingDown className="w-6 h-6" />} number="10">
            Comment réduire son seuil de rentabilité
          </SectionHeading>

          <div className="prose-content">
            <p>
              Deux leviers structurels pour baisser votre seuil : <strong>diminuer les charges fixes</strong> ou
              <strong> augmenter le taux de MCV</strong>. Chaque levier produit des effets très différents.
            </p>
            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Levier 1 — Réduire les charges fixes</h3>
            <ul>
              <li><strong>Renégocier le bail commercial :</strong> -500 EUR/mois baisse le seuil de 783 EUR (à 64 % MCV)</li>
              <li><strong>Optimiser les plannings :</strong> ajuster les effectifs aux périodes creuses (-1 000 à 2 000 EUR/mois possible)</li>
              <li><strong>Mutualiser les abonnements :</strong> caisse + gestion + compta dans un outil unique</li>
              <li><strong>Renégocier les assurances :</strong> bilan tous les 2 ans (économie moyenne 15 %)</li>
              <li><strong>Sous-louer un espace inutilisé :</strong> cave, espace dépôt, salle privatisable midi</li>
            </ul>
            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Levier 2 — Augmenter le taux de MCV</h3>
            <ul>
              <li><strong>Passer de 32 % à 28 % de food cost :</strong> +4 points MCV = -2 000 EUR/mois de seuil</li>
              <li><strong>Augmenter le ticket moyen :</strong> +2 EUR sur 900 couverts = +1 800 EUR/mois</li>
              <li><strong>Réduire les pertes matières :</strong> objectif &lt; 2 % (FIFO, pesée des déchets, fiches techniques)</li>
              <li><strong>Internaliser la livraison :</strong> éliminer la commission de 28 %</li>
              <li><strong>Pousser les boissons à forte marge :</strong> coefficient 5 à 7x sur la cave</li>
            </ul>
            <p>
              <strong>Effet combiné :</strong> une optimisation 360° (food cost -3 pts + loyer -500 EUR + ticket moyen +2 EUR)
              peut réduire votre seuil de <strong>12 à 18 %</strong>. Sur notre cas du Comptoir des Halles : passage de 24 929 EUR
              à 20 500 EUR de seuil, soit 4 400 EUR/mois de marge brute supplémentaire (53 000 EUR/an).
            </p>
            <p>
              Pour creuser les KPI à surveiller, consultez notre <Link to="/blog/kpi-restaurateur" className="text-teal-700 underline hover:text-teal-800">guide des 10 KPI restaurant</Link> et
              notre article sur le <Link to="/blog/prime-cost-restaurant" className="text-teal-700 underline hover:text-teal-800">prime cost</Link>.
            </p>
          </div>
        </section>

        {/* SECTION 11 : Tableau de bord */}
        <section id="tableau-bord" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="11">
            Construire un tableau de bord rentabilité
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un seuil de rentabilité calculé une fois par an n'a aucune valeur opérationnelle. Mettez en place un
              tableau de bord vivant qui se met à jour automatiquement et alerte en cas de dérive.
            </p>
            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Indicateurs à suivre quotidiennement</h3>
            <ul>
              <li>CA réalisé jour vs CA seuil quotidien</li>
              <li>Couverts servis vs couverts seuil</li>
              <li>Ticket moyen (alerte si écart &gt; 5 %)</li>
              <li>Compteur "marge de sécurité du mois" en temps réel</li>
            </ul>
            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Indicateurs hebdomadaires</h3>
            <ul>
              <li>Food cost de la semaine (inventaire flash sur les 10 produits stratégiques)</li>
              <li>Taux MCV de la semaine</li>
              <li>Pourcentage de réalisation du seuil mensuel</li>
            </ul>
            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Indicateurs mensuels</h3>
            <ul>
              <li>Recalcul complet du seuil de rentabilité</li>
              <li>Évolution des charges fixes par poste</li>
              <li>Marge de sécurité du mois écoulé</li>
              <li>Point mort calendaire actualisé</li>
            </ul>
            <p>
              Pour aller plus loin sur les indicateurs, lisez notre <Link to="/blog/kpi-essentiels-restaurateur" className="text-teal-700 underline hover:text-teal-800">guide du tableau de bord restaurant</Link>.
            </p>
          </div>
        </section>

        {/* SECTION 12 : Erreurs */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="12">
            Les 6 erreurs qui sabotent votre seuil
          </SectionHeading>

          <div className="space-y-6 mt-8">
            <ErreurCard
              number={1}
              title="Confondre CA et trésorerie"
              desc="Un restaurant peut atteindre son seuil de rentabilité mais manquer de trésorerie si les délais fournisseurs sont mauvais ou si les commissions plateformes sont versées avec 15-30 jours de retard. Suivez en parallèle votre seuil et votre Besoin en Fonds de Roulement (BFR)."
            />
            <ErreurCard
              number={2}
              title="Oublier les charges saisonnières"
              desc="Primes annuelles, congés payés, taxe foncière, redevance audiovisuelle doivent être lissés sur 12 mois et intégrés dans les charges fixes mensuelles. Sinon, votre seuil est sous-estimé de 8 à 12 % et vous avez de mauvaises surprises en juin et décembre."
            />
            <ErreurCard
              number={3}
              title="Ne pas recalculer après un changement majeur"
              desc="Embauche d'un CDI, hausse de loyer, changement de fournisseur principal, lancement d'un canal livraison : tous ces événements modifient le seuil. Refaites le calcul dans les 30 jours qui suivent, sinon vous pilotez avec une donnée obsolète."
            />
            <ErreurCard
              number={4}
              title="Ignorer les commissions de livraison"
              desc="Uber Eats et Deliveroo prélèvent 25 à 30 % de commission sur le prix TTC. Sur un food cost de 30 % et un ticket de 25 EUR, votre marge brute tombe de 70 % à 42 %. Calculez le seuil de votre activité livraison séparément du seuil salle."
            />
            <ErreurCard
              number={5}
              title="Calculer une seule fois à l'ouverture"
              desc="Un seuil de rentabilité calculé à l'ouverture devient obsolète en 6 à 9 mois. Inflation matières, hausse SMIC, renégociation bail, évolution du mix vente : tout bouge. Recalculez au minimum chaque trimestre, idéalement chaque mois."
            />
            <ErreurCard
              number={6}
              title="Ne pas intégrer sa propre rémunération"
              desc="Beaucoup de restaurateurs indépendants oublient d'intégrer leur rémunération de gérant dans les charges fixes. Résultat : ils pensent être rentables alors qu'ils travaillent gratuitement. Intégrez TOUJOURS au minimum 2 500 EUR/mois de rémunération cible."
            />
          </div>
        </section>

        {/* SECTION 13 : Automatiser */}
        <section id="automatiser" className="mb-16">
          <SectionHeading icon={<Zap className="w-6 h-6" />} number="13">
            Automatiser le suivi avec RestauMargin
          </SectionHeading>

          <div className="prose-content">
            <p>
              Calculer son seuil de rentabilité à la main chaque mois prend 2 à 3 heures. Et l'erreur humaine fait perdre
              en précision. RestauMargin centralise tous vos flux financiers et calcule en temps réel :
            </p>
            <ul>
              <li><strong>Le seuil de rentabilité mensuel</strong> mis à jour automatiquement</li>
              <li><strong>Le nombre de couverts quotidiens nécessaires</strong> pour l'atteindre</li>
              <li><strong>Le point mort calendaire</strong> recalculé chaque semaine</li>
              <li><strong>La marge de sécurité</strong> en temps réel avec alerte en cas de dérive</li>
              <li><strong>Le food cost et le prime cost</strong> par plat, par catégorie, par service</li>
              <li><strong>Des alertes</strong> si vos charges variables dérivent de plus de 3 %</li>
            </ul>
            <p>
              Tout est calculé à partir de vos factures fournisseurs, de votre caisse et de vos fiches techniques.
              Aucune saisie manuelle redondante. <Link to="/login" className="text-teal-700 underline hover:text-teal-800 font-semibold">Créez votre compte gratuit RestauMargin</Link> et
              importez vos données en 10 minutes.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <SectionHeading icon={<Lightbulb className="w-6 h-6" />} number="14">
            Questions fréquentes
          </SectionHeading>

          <div className="space-y-5 mt-8">
            {faqItems.map(({ question, answer }) => (
              <div key={question} className="border border-mono-900 rounded-xl p-5 bg-white">
                <p className="font-semibold text-mono-100 mb-2">{question}</p>
                <p className="text-mono-400 text-sm leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div id="cta" className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Calculez votre seuil de rentabilité en 5 minutes</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin intègre le calcul automatique du seuil de rentabilité dans votre tableau de bord : seuil mensuel,
            couverts quotidiens nécessaires, point mort en jours et alertes en temps réel.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Author footer */}
        <BlogAuthor publishedDate="2026-04-25" updatedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* Articles connexes */}
        <div className="mt-12 pt-8 border-t border-mono-900">
          <h3 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Articles connexes
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/blog/calcul-marge-restaurant" className="block p-4 border border-mono-900 rounded-xl hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Calcul marge restaurant : guide complet</p>
              <p className="text-sm text-mono-400">Marge brute, marge nette, food cost, coefficient multiplicateur.</p>
            </Link>
            <Link to="/blog/kpi-restaurateur" className="block p-4 border border-mono-900 rounded-xl hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Les 10 KPI essentiels pour piloter un restaurant</p>
              <p className="text-sm text-mono-400">Food cost, prime cost, RevPASH, ticket moyen et benchmarks 2026.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="block p-4 border border-mono-900 rounded-xl hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Food cost : la méthode complète</p>
              <p className="text-sm text-mono-400">Formules, fiches techniques, pertes et benchmarks 2026.</p>
            </Link>
            <Link to="/blog/prime-cost-restaurant" className="block p-4 border border-mono-900 rounded-xl hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Prime cost : matières + personnel</p>
              <p className="text-sm text-mono-400">L'indicateur ultime de rentabilité opérationnelle.</p>
            </Link>
          </div>
        </div>

        {/* Nav bas */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/outils/calculateur-food-cost" className="text-sm text-teal-600 hover:underline">Calculateur food cost gratuit →</Link>
        </div>
        </article>
      </main>
    </div>
  );
}

/* ── Composants helpers ── */

function SectionHeading({ icon, number, children }: { icon: React.ReactNode; number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs text-teal-600 font-bold uppercase tracking-wider mb-1">Section {number}</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 leading-tight">{children}</h2>
      </div>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = {
    info: 'bg-teal-50 border-teal-300 text-teal-900',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
  };
  return (
    <div className={`my-6 border-l-4 rounded-r-xl p-5 ${styles[type]}`}>
      <p className="text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function ErreurCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6 flex gap-4">
      <div className="w-10 h-10 bg-red-100 text-red-700 rounded-xl flex items-center justify-center shrink-0 font-bold">
        {number}
      </div>
      <div>
        <h3 className="font-bold text-mono-100 text-lg mb-2">{title}</h3>
        <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
