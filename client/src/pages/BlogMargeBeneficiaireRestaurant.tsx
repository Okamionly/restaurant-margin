import { Link } from 'react-router-dom';
import {
  ChefHat,
  TrendingUp,
  Calculator,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  BarChart3,
  DollarSign,
  Percent,
  Target,
  BookOpen,
  Lightbulb,
  Zap,
  HelpCircle,
  Scale,
  Landmark,
  ExternalLink,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Marge benefice restaurant : quel est l'ideal 2026 ?"
   Ciblage PAA (People Also Ask) : 4 questions Google exactes
   ~3 200 mots — W&B teal-600
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quelle est la marge beneficiaire ideale pour un restaurant ?',
    answer:
      "La marge beneficiaire ideale d'un restaurant en France 2026 se situe entre 8 % et 15 % en net pour un restaurant traditionnel, et entre 15 % et 25 % pour la restauration rapide. La marge brute (avant charges) atteint 65-75 % sur les solides et 85 % sur les boissons. Une marge nette inferieure a 5 % est consideree comme fragile, tandis qu'au-dela de 20 % le modele est exceptionnel.",
  },
  {
    question: 'Un benefice net de 4 % est-il bon pour un restaurant ?',
    answer:
      "Un benefice net de 4 % est en dessous de la cible ideale pour un restaurant en 2026 (8-15 %). Ce niveau indique soit un modele economique fragile, soit des charges non maitrisees. A 4 %, le restaurateur tire un revenu modeste et n'a aucune marge pour absorber un imprevu. Toutefois, 4 % est meilleur que la moyenne nationale reelle (3-5 %), car beaucoup de restaurants sont a l'equilibre ou en perte.",
  },
  {
    question: 'Une marge beneficiaire de 50 % est-elle excessive pour un restaurant ?',
    answer:
      "Une marge beneficiaire de 50 % en NET est techniquement quasi-impossible dans la restauration traditionnelle francaise. En revanche, 50 % peut etre realiste sur certains plats individuels (marge brute 70-90 %) ou en restauration rapide specialisee. La confusion vient souvent du melange entre marge BRUTE (50 % oui) et marge NETTE (50 % impossible).",
  },
  {
    question: 'Que signifie 50% de marge en restauration ?',
    answer:
      "50 % de marge signifie que sur chaque euro de vente, 50 centimes restent apres deduction des couts. La precision est cruciale : 50 % de marge brute signifie 50 cents restant apres le cout matieres (realiste, c'est meme bas pour la restauration), tandis que 50 % de marge nette signifie 50 cents apres TOUS les couts (tres rare hors restauration rapide ultra-specialisee).",
  },
  {
    question: 'Quelle est la marge minimum ideale conseillee pour un restaurant ?',
    answer:
      "La marge nette minimum conseillee pour un restaurant viable a long terme est de 8 %. En dessous, le restaurateur n'a pas la capacite d'absorber les chocs externes (inflation matieres, panne equipement, baisse de frequentation). En dessous de 5 %, on parle de zone rouge : la moindre perturbation peut faire basculer l'etablissement en perte. Au-dessus de 12 %, le modele est solide.",
  },
  {
    question: 'Quel est le benefice net moyen d\'un restaurant en France ?',
    answer:
      "D'apres les donnees INSEE 2026 et les fédérations professionnelles, le benefice net moyen d'un restaurant francais se situe autour de 3 a 5 % du chiffre d'affaires. Ce chiffre cache de fortes disparites : restauration rapide 8-12 %, restauration traditionnelle 4-8 %, gastronomie 2-5 %. Pres de 30 % des restaurants sont a l'equilibre ou en perte.",
  },
  {
    question: 'Comment passer de 4 % a 12 % de marge nette ?',
    answer:
      "Passer de 4 % a 12 % de marge nette demande d'attaquer 4 leviers simultanement : (1) reduire le food cost de 2-3 points via fiches techniques et pesee systematique, (2) optimiser la masse salariale via planning intelligent et polyvalence, (3) augmenter le ticket moyen via menu engineering et upsell, (4) negocier les charges fixes (loyer, energie, assurances). Comptez 6-12 mois pour un effet durable.",
  },
  {
    question: 'La marge restaurant est-elle meilleure que dans le commerce ?',
    answer:
      "Non, la marge nette en restauration (5-15 %) est globalement plus faible que dans le commerce de detail (5-10 %), les services aux entreprises (10-25 %), ou le luxe (25-40 %). La restauration est un secteur dur : charges de personnel elevees (35-45 % du CA), couts fixes lourds (loyer, energie), saisonnalite. Mais c'est aussi un secteur avec barrieres a l'entree faibles et une vraie valeur ajoutee humaine.",
  },
];

export default function BlogMargeBeneficiaireRestaurant() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Marge bénéficiaire restaurant : quel est l'idéal en 2026 ? (avec exemples)"
        description="La marge bénéficiaire idéale d'un restaurant en France 2026 : 5-15% en net selon segment. Un bénéfice de 4% est-il acceptable ? Une marge de 50% est-elle réaliste ? Réponses claires + exemples chiffrés."
        path="/blog/marge-beneficiaire-restaurant-ideal"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Marge bénéficiaire restaurant idéale', url: 'https://www.restaumargin.fr/blog/marge-beneficiaire-restaurant-ideal' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Marge bénéficiaire restaurant : quel est l'idéal en 2026 ?",
            description: "La marge beneficiaire ideale d'un restaurant en France 2026 : 5-15% en net selon segment. Un benefice de 4% est-il acceptable ? Une marge de 50% est-elle realiste ?",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-07-12',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/marge-beneficiaire-restaurant-ideal' },
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
              to="/outils/calculateur-marge-restaurant"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer ma marge
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
          <span className="text-mono-100 font-medium">Marge bénéficiaire restaurant idéale</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Rentabilité"
        readTime="14 min"
        date="Mai 2026"
        title="Marge bénéficiaire restaurant : quel est l'idéal en 2026 ?"
        accentWord="bénéficiaire"
        subtitle="Quelle marge viser ? Un bénéfice de 4 % est-il acceptable ? Une marge de 50 % est-elle excessive ? Réponses claires avec exemples chiffrés par segment de restauration en France 2026."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" updatedDate="2026-07-12" readTime="14 min" variant="header" />

        {/* ── Featured snippet 50 mots ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Réponse rapide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Quelle est la marge bénéficiaire idéale d'un restaurant ?
          </h2>
          <p className="text-teal-50 leading-relaxed text-base sm:text-lg">
            La marge bénéficiaire idéale d'un restaurant en France 2026 se situe entre <strong className="text-white">8 % et 15 % en net</strong> pour un restaurant traditionnel, et entre <strong className="text-white">15 % et 25 %</strong> pour la restauration rapide. La marge brute (avant charges) atteint <strong className="text-white">65-75 % sur les solides</strong> et <strong className="text-white">85 % sur les boissons</strong>. Une marge nette inférieure à 5 % est considérée comme fragile, tandis qu'au-delà de 20 % le modèle est exceptionnel.
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
              { href: '#ideal', label: "Quelle est la marge bénéficiaire idéale pour un restaurant en 2026 ?" },
              { href: '#types-marges', label: 'Différence entre marge brute, marge d\'exploitation, marge nette' },
              { href: '#moyenne', label: 'Quel est le bénéfice net moyen d\'un restaurant ? (INSEE 2026)' },
              { href: '#4pourcent', label: 'Un bénéfice net de 4 % est-il bon pour un restaurant ?' },
              { href: '#minimum', label: 'Quelle est la marge minimum idéale conseillée ?' },
              { href: '#50pourcent', label: 'Une marge bénéficiaire de 50 % est-elle excessive ?' },
              { href: '#diagnostic', label: 'Auto-diagnostic en 5 questions' },
              { href: '#signifie-50', label: 'Que signifie 50 % de marge en restauration ?' },
              { href: '#vs-secteurs', label: 'Comparaison restauration vs autres secteurs' },
              { href: '#4-vers-12', label: 'Comment passer de 4 % à 12 % de marge nette' },
              { href: '#faq', label: 'FAQ complémentaire (8 questions)' },
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

        {/* ═════════════ SECTION 1 : Marge ideale ═════════════ */}
        <section id="ideal" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="1">
            Quelle est la marge bénéficiaire idéale pour un restaurant en 2026 ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              La question revient en permanence : "quelle marge dois-je viser dans mon restaurant ?".
              La réponse dépend d'abord du type d'indicateur (brute ou nette) et ensuite de votre
              segment de restauration. Voici les fourchettes idéales observées en France en 2026,
              sur la base des données INSEE, GIRA Conseil et SNRC.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Segment</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge brute cible</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge nette cible</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Top tier (rare)</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { type: 'Restauration rapide / Fast-food', brute: '70 - 75 %', nette: '15 - 25 %', top: '> 25 %' },
                  { type: 'Bistrot / Brasserie', brute: '67 - 72 %', nette: '8 - 12 %', top: '> 15 %' },
                  { type: 'Restaurant traditionnel', brute: '65 - 70 %', nette: '5 - 10 %', top: '> 12 %' },
                  { type: 'Pizzeria', brute: '72 - 85 %', nette: '10 - 18 %', top: '> 20 %' },
                  { type: 'Coffee shop', brute: '78 - 88 %', nette: '8 - 16 %', top: '> 18 %' },
                  { type: 'Restaurant gastronomique', brute: '60 - 70 %', nette: '3 - 8 %', top: '> 10 %' },
                  { type: 'Food truck', brute: '70 - 78 %', nette: '8 - 18 %', top: '> 20 %' },
                  { type: 'Dark kitchen / Livraison', brute: '65 - 72 %', nette: '5 - 12 %', top: '> 15 %' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.type}</td>
                    <td className="py-3 px-4 text-center">{row.brute}</td>
                    <td className="py-3 px-4 text-center font-semibold text-teal-700">{row.nette}</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-bold">{row.top}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>À retenir :</strong> la marge bénéficiaire ne signifie rien sans préciser
            "brute" ou "nette". 95 % des confusions sur ce sujet viennent de là. La marge brute
            (avant charges) est toujours élevée en restauration (65-85 %), la marge nette (après
            tout) est toujours plus modeste (5-15 %).
          </Callout>

          <div className="prose-content mt-6">
            <p>
              Pour comprendre comment calculer ces marges précisément et passer du chiffre d'affaires
              au résultat net, consultez notre <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800">guide complet du calcul de marge restaurant</Link> qui détaille chaque étape avec exemples chiffrés.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Types de marges ═════════════ */}
        <section id="types-marges" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="2">
            Différence entre marge brute, marge d'exploitation, marge nette
          </SectionHeading>

          <div className="prose-content">
            <p>
              Trois marges, trois niveaux de précision, trois utilités différentes. Quand on parle
              de "marge bénéficiaire" en restauration, on confond souvent ces trois indicateurs. Voici
              ce qu'ils mesurent et comment les distinguer.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mt-8">
            <MargeCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Marge brute"
              color="emerald"
              desc="CA - Coût matières premières. C'est la première marge, la plus simple. Elle indique combien il vous reste APRÈS achats d'ingrédients mais AVANT toutes les autres charges. Outil quotidien pour piloter les achats et les prix."
              formula="CA - Coût matières"
              target="65 % à 85 %"
            />
            <MargeCard
              icon={<Percent className="w-6 h-6" />}
              title="Marge d'exploitation (EBE)"
              color="amber"
              desc="Marge brute - charges d'exploitation (personnel, loyer, énergie, fournitures). N'inclut pas les amortissements ni les frais financiers. C'est la rentabilité opérationnelle pure. Bon indicateur pour comparer plusieurs établissements."
              formula="MB - charges expl."
              target="10 % à 25 %"
            />
            <MargeCard
              icon={<Target className="w-6 h-6" />}
              title="Marge nette"
              color="blue"
              desc="Résultat net / CA HT. C'est ce qui reste APRÈS TOUT : matières, salaires, loyer, énergie, amortissements, taxes, frais financiers. C'est le bénéfice réel que vous pouvez sortir, réinvestir ou capitaliser."
              formula="Résultat net / CA × 100"
              target="5 % à 15 %"
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Exemple chiffré : restaurant traditionnel 600 000 EUR de CA</h3>
            <p>
              Voici comment les trois marges se calculent en cascade sur un bistrot moyen :
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste</th>
                  <th className="text-right py-3 px-4 font-semibold">Montant</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">% du CA</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Chiffre d'affaires HT</td><td className="py-3 px-4 text-right">600 000 EUR</td><td className="py-3 px-4 text-right">100 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Coût matières</td><td className="py-3 px-4 text-right text-red-700">-180 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-30 %</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">= Marge brute</td><td className="py-3 px-4 text-right font-bold text-emerald-900">420 000 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-900">70 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Personnel + charges</td><td className="py-3 px-4 text-right text-red-700">-210 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-35 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Loyer + énergie + divers</td><td className="py-3 px-4 text-right text-red-700">-138 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-23 %</td></tr>
                <tr className="bg-amber-50"><td className="py-3 px-4 font-bold text-amber-900">= Marge d'exploitation (EBE)</td><td className="py-3 px-4 text-right font-bold text-amber-900">72 000 EUR</td><td className="py-3 px-4 text-right font-bold text-amber-900">12 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Amortissements + frais financiers + impôts</td><td className="py-3 px-4 text-right text-red-700">-24 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-4 %</td></tr>
                <tr className="bg-blue-50"><td className="py-3 px-4 font-bold text-blue-900">= Marge nette (résultat net)</td><td className="py-3 px-4 text-right font-bold text-blue-900">48 000 EUR</td><td className="py-3 px-4 text-right font-bold text-blue-900">8 %</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Vous voyez l'écart : 70 % de marge brute, 12 % de marge d'exploitation, 8 % de marge
              nette. Ces trois pourcentages sont tous "votre marge" — mais ils ne mesurent pas la
              même chose. Confondre brute et nette, c'est l'erreur n°1 du restaurateur débutant.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Benefice net moyen ═════════════ */}
        <section id="moyenne" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="3">
            Quel est le bénéfice net moyen d'un restaurant en 2026 ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant de répondre, attention : "moyenne nationale" cache d'énormes écarts. Un food
              truck peut sortir 15 % de marge nette quand un restaurant gastronomique parisien
              s'essouffle à 3 %. Voici les chiffres réels remontés en 2026 par les fédérations
              professionnelles et l'INSEE.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {[
              { type: 'Moyenne nationale (tous segments)', valeur: '3 - 5 %', desc: 'Tirée vers le bas par 30 % d\'établissements à l\'équilibre ou en perte.' },
              { type: 'Restauration rapide', valeur: '8 - 12 %', desc: 'Faible food cost (25 %), volume élevé, faible personnel par couvert.' },
              { type: 'Restauration traditionnelle', valeur: '4 - 8 %', desc: 'Personnel lourd (35-40 % CA), charges fixes significatives.' },
              { type: 'Pizzeria / Coffee shop', valeur: '8 - 15 %', desc: 'Excellente marge brute (75-85 %), ticket moyen bas mais volume.' },
              { type: 'Gastronomie / Étoilé', valeur: '2 - 5 %', desc: 'Produits nobles, personnel ultra-qualifié, faibles couverts/service.' },
              { type: 'Food truck / Dark kitchen', valeur: '5 - 12 %', desc: 'Faibles charges fixes mais commissions plateformes (25-30 %).' },
            ].map((row, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-mono-100">{row.type}</h3>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{row.valeur}</span>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed">{row.desc}</p>
              </div>
            ))}
          </div>

          <Callout type="warning">
            <strong>Chiffre brutal :</strong> selon les chiffres INSEE et BPCE 2026, près de
            30 % des restaurants ferment dans les 3 premières années. La cause numéro 1 ?
            Une marge nette insuffisante pour absorber les chocs (inflation, panne, baisse de
            fréquentation). La marge bénéficiaire n'est pas un luxe : c'est votre coussin de survie.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : 4% bon ou pas ═════════════ */}
        <section id="4pourcent" className="mb-16">
          <SectionHeading icon={<HelpCircle className="w-6 h-6" />} number="4">
            Un bénéfice net de 4 % est-il bon pour un restaurant ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              <strong>Réponse directe :</strong> un bénéfice net de 4 % est en dessous de la cible
              idéale pour un restaurant en 2026 (8-15 %). Ce niveau indique soit un modèle économique
              fragile, soit des charges non maîtrisées. À 4 %, le restaurateur tire un revenu modeste
              et n'a aucune marge pour absorber un imprévu. Toutefois, 4 % est meilleur que la moyenne
              nationale réelle (3-5 %), car beaucoup de restaurants sont à l'équilibre ou en perte.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Le positif</h3>
              </div>
              <ul className="text-sm text-emerald-800 leading-relaxed space-y-2">
                <li><strong>Vous êtes bénéficiaire</strong> — la majorité ne l'est pas.</li>
                <li><strong>Vous battez la moyenne nationale</strong> (3-5 %).</li>
                <li><strong>Sur 600 000 EUR de CA</strong>, 4 % = 24 000 EUR/an de bénéfice.</li>
                <li><strong>Une amélioration de 4 points</strong> est tout à fait atteignable.</li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Le négatif</h3>
              </div>
              <ul className="text-sm text-amber-800 leading-relaxed space-y-2">
                <li><strong>Zone fragile :</strong> en dessous de 5 % = zone rouge.</li>
                <li><strong>Pas de coussin</strong> en cas de hausse matières ou baisse CA.</li>
                <li><strong>Capacité d'investissement quasi nulle</strong> (rénovation, embauche).</li>
                <li><strong>Rémunération du dirigeant souvent ridicule</strong> rapportée aux heures.</li>
              </ul>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Comment savoir si vos 4 % sont OK pour votre situation</h3>
            <p>
              4 % n'est pas le même chiffre selon votre segment et votre taille. Si vous êtes :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Restaurant gastronomique étoilé :</strong> 4 % est dans la norme du
                segment, parfois même bon. Le modèle est intrinsèquement fragile.
              </li>
              <li>
                <strong>Bistrot ou brasserie traditionnelle :</strong> 4 % est insuffisant. La
                cible doit être 8-12 %. Cherchez les fuites côté food cost ou personnel.
              </li>
              <li>
                <strong>Pizzeria, food truck, coffee shop :</strong> 4 % est très en dessous. Ces
                segments doivent générer 10-18 % de marge nette. Il y a un problème structurel.
              </li>
              <li>
                <strong>Restaurant rapide / fast-food :</strong> 4 % est alarmant. Cible 15-25 %.
                Probablement un food cost dérapant ou un loyer trop élevé.
              </li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Diagnostic rapide :</strong> avec 4 % de marge nette, votre <Link to="/blog/prime-cost-restaurant" className="text-teal-700 underline hover:text-teal-800">prime cost (matières + personnel)</Link> dépasse probablement 70 %. C'est le premier endroit où chercher.
            Un prime cost à 65 % libère immédiatement 5 points de marge nette.
          </Callout>
        </section>

        {/* ═════════════ SECTION 5 : Marge minimum ═════════════ */}
        <section id="minimum" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="5">
            Quelle est la marge minimum idéale conseillée pour un restaurant ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              <strong>La marge nette minimum conseillée pour un restaurant viable à long terme
              est de 8 %.</strong> En dessous, le restaurateur n'a pas la capacité d'absorber les
              chocs externes. Voici la grille de lecture utilisée par les experts-comptables
              spécialisés en restauration.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <ZoneRow zone="Zone rouge" range="< 3 %" color="red" desc="Survie. Le moindre choc (panne, inflation, baisse fréquentation) fait basculer en perte. Action immédiate requise sur food cost + personnel." />
            <ZoneRow zone="Zone orange" range="3 % - 5 %" color="amber" desc="Fragile. Bénéficiaire mais sans coussin. Pas de capacité d'investissement, rémunération dirigeant faible. Plan de redressement sur 6-12 mois." />
            <ZoneRow zone="Zone jaune" range="5 % - 8 %" color="yellow" desc="Acceptable mais perfectible. Stabilité opérationnelle. Capacité d'investissement limitée. Identifier 2-3 leviers d'optimisation prioritaires." />
            <ZoneRow zone="Zone verte" range="8 % - 12 %" color="emerald" desc="Cible recommandée. Modèle sain, capacité d'investissement, rémunération correcte du dirigeant. Suivi régulier des KPI suffit." />
            <ZoneRow zone="Zone excellence" range="12 % - 20 %" color="teal" desc="Top tier. Modèle performant, capacité de croissance, peut financer ouverture 2e site. Continuer le menu engineering et l'optimisation continue." />
            <ZoneRow zone="Zone exceptionnelle" range="> 20 %" color="blue" desc="Très rare en restauration traditionnelle. Modèle franchisable ou ultra-spécialisé (concept fort, niche premium, restauration rapide automatisée)." />
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Pourquoi 8 % et pas 5 % ?</strong> Une marge nette de 8 % vous permet
              d'absorber : (1) une inflation matières de 5 % sans répercuter immédiatement sur
              vos prix, (2) une baisse de fréquentation de 10 % sur 3 mois sans déstabiliser
              votre trésorerie, (3) un investissement de 30 000 EUR sur fonds propres tous les
              2-3 ans pour entretenir l'outil. À 5 %, ces trois éléments ne sont pas couverts.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : 50% excessive ═════════════ */}
        <section id="50pourcent" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="6">
            Une marge bénéficiaire de 50 % est-elle excessive pour un restaurant ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              <strong>Réponse directe :</strong> une marge bénéficiaire de 50 % en NET est
              techniquement quasi-impossible dans la restauration traditionnelle française. En
              revanche, 50 % peut être réaliste sur certains plats individuels (marge brute 70-90 %)
              ou en restauration rapide spécialisée. La confusion vient souvent du mélange entre
              marge BRUTE (50 % oui) et marge NETTE (50 % impossible).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">50 % en marge brute</h3>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed mb-3">
                <strong>Réaliste, voire même un peu bas.</strong> La marge brute standard en
                restauration est de 65-75 %. À 50 %, votre{' '}
                <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800">food cost</Link>{' '}
                est de 50 %, ce qui est
                excessif et indique un problème de pricing ou d'achats.
              </p>
              <p className="text-sm text-emerald-800 leading-relaxed">
                <strong>Cible normale :</strong> 65-85 % selon le segment.
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-700" />
                <h3 className="font-bold text-red-900">50 % en marge nette</h3>
              </div>
              <p className="text-sm text-red-800 leading-relaxed mb-3">
                <strong>Quasi-impossible en restauration classique.</strong> Cela voudrait dire
                que vos charges totales (personnel, loyer, énergie, taxes, etc.) ne représentent
                que 50 % du CA. Sachant que le personnel seul fait 30-40 %, c'est mathématiquement
                hors de portée.
              </p>
              <p className="text-sm text-red-800 leading-relaxed">
                <strong>Cible normale :</strong> 5-15 %. Au-delà de 20 % = exceptionnel.
              </p>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Cas où 50 % de marge est réaliste</h3>
            <p>
              Il existe quelques contextes où parler de "50 % de marge" a du sens :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Sur un plat unique :</strong> une pizza margherita à 12 EUR avec 1,80 EUR
                de coût matières = 85 % de marge brute. C'est par plat, pas global.
              </li>
              <li>
                <strong>Sur les boissons :</strong> une bière pression à 6 EUR avec 0,80 EUR
                de coût matières = 87 % de marge brute. Standard du marché.
              </li>
              <li>
                <strong>Restauration rapide automatisée :</strong> certains modèles ultra-optimisés
                (vending machines, kiosques sans personnel) peuvent atteindre 30-40 % de marge nette.
                Mais 50 % reste exceptionnel.
              </li>
              <li>
                <strong>Franchises matures :</strong> certaines franchises de fast-food très
                rentables sortent 20-25 % de marge nette par site. Pas 50 %.
              </li>
            </ul>
          </div>

          <Callout type="warning">
            <strong>Quand quelqu'un vous parle de "50 % de marge" :</strong> demandez TOUJOURS de
            quelle marge il parle (brute, exploitation, nette) et sur quoi (un plat, une catégorie,
            le restaurant entier). Sans cette précision, le chiffre ne veut rien dire.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Auto-diagnostic ═════════════ */}
        <section id="diagnostic" className="mb-16">
          <SectionHeading icon={<CheckCircle className="w-6 h-6" />} number="7">
            Comment savoir si votre marge est bonne (auto-diagnostic 5 questions)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici 5 questions à vous poser pour évaluer si votre marge bénéficiaire est saine
              ou si elle cache un problème structurel. Répondez honnêtement.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            {[
              {
                q: "Votre marge nette est-elle supérieure à 8 % ?",
                positive: "Bravo, vous êtes dans la cible recommandée. Continuez le suivi régulier.",
                negative: "Vous êtes en zone fragile. Audit prime cost (matières + personnel) requis.",
              },
              {
                q: "Votre food cost est-il entre 25 % et 35 % ?",
                positive: "Excellent. Votre marge brute est dans la fourchette saine (65-75 %).",
                negative: "Si > 35 %, vos achats ou vos portions dérapent. Si < 25 %, vous pouvez peut-être réduire vos prix pour booster le volume.",
              },
              {
                q: "Votre masse salariale est-elle entre 30 % et 40 % du CA ?",
                positive: "Bon ratio. Personnel maîtrisé tout en assurant un service de qualité.",
                negative: "Si > 40 %, planning à revoir + polyvalence à développer. Si < 30 %, attention à la qualité de service.",
              },
              {
                q: "Votre loyer est-il inférieur à 12 % du CA ?",
                positive: "OK. Charge locative dans la norme.",
                negative: "Si > 12 %, soit le CA est trop bas pour le loyer payé, soit il faut renégocier le bail (ou déménager).",
              },
              {
                q: "Vos amortissements + frais financiers sont-ils inférieurs à 5 % du CA ?",
                positive: "Modèle financier sain, peu endetté.",
                negative: "Si > 5 %, l'endettement pèse trop. Renégocier les prêts ou réduire le rythme d'investissement.",
              },
            ].map((row, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-mono-100 mb-3">{row.q}</h3>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <strong className="text-emerald-900">Oui :</strong>
                        <p className="text-emerald-800 mt-1">{row.positive}</p>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <strong className="text-amber-900">Non :</strong>
                        <p className="text-amber-800 mt-1">{row.negative}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Callout type="info">
            <strong>Score :</strong> 5/5 oui = modèle excellent. 4/5 = sain. 3/5 = optimisations
            possibles. 2/5 = audit complet recommandé. 0-1/5 = redressement urgent. Pour
            approfondir le diagnostic, lisez notre guide des <Link to="/blog/kpi-restaurateur" className="text-teal-700 underline hover:text-teal-800">KPI restaurateur essentiels</Link>.
          </Callout>
        </section>

        {/* ═════════════ SECTION 8 : 50% signification ═════════════ */}
        <section id="signifie-50" className="mb-16">
          <SectionHeading icon={<HelpCircle className="w-6 h-6" />} number="8">
            Que signifie 50 % de marge en restauration ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              <strong>50 % de marge signifie que sur chaque euro de vente, 50 centimes restent
              après déduction des coûts.</strong> La précision est cruciale : 50 % de marge brute
              signifie 50 cents restant après le coût matières (réaliste, c'est même bas pour la
              restauration), tandis que 50 % de marge nette signifie 50 cents après TOUS les coûts
              (très rare hors restauration rapide ultra-spécialisée).
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Exemple chiffré : plat à 20 EUR HT</h3>
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-bold text-emerald-900 mb-2">Si 50 % = marge brute</h4>
                <p className="text-sm text-emerald-800 mb-2">
                  Prix vente HT : 20 EUR. Coût matières : 10 EUR. Marge brute : 10 EUR (50 %).
                </p>
                <p className="text-xs text-emerald-700">
                  <strong>Verdict :</strong> faible pour la restauration. La cible est 65-75 %.
                  Food cost à 50 % = problème de pricing ou d'achats.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-bold text-amber-900 mb-2">Si 50 % = marge nette sur le plat</h4>
                <p className="text-sm text-amber-800 mb-2">
                  Sur 20 EUR de vente : 10 EUR de bénéfice net après TOUTES les charges
                  (matières + part personnel + part loyer + part énergie + taxes).
                </p>
                <p className="text-xs text-amber-700">
                  <strong>Verdict :</strong> exceptionnel. Possible uniquement sur des plats à
                  très haute valeur ajoutée (cocktails signature, plats de prestige) dans
                  des restaurants premium ultra-optimisés.
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h4 className="font-bold text-red-900 mb-2">Si 50 % = marge nette globale du restaurant</h4>
                <p className="text-sm text-red-800 mb-2">
                  Pour 600 000 EUR de CA : 300 000 EUR de bénéfice net annuel.
                </p>
                <p className="text-xs text-red-700">
                  <strong>Verdict :</strong> impossible en restauration classique en France. Les
                  charges fixes (personnel, loyer, charges sociales) représentent au minimum
                  50-60 % du CA. Mathématiquement hors de portée.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Comparaison sectorielle ═════════════ */}
        <section id="vs-secteurs" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="9">
            Comparaison restauration vs autres secteurs
          </SectionHeading>

          <div className="prose-content">
            <p>
              La restauration est-elle un bon business comparé à d'autres secteurs ? Voici les
              marges nettes moyennes par secteur d'activité en France en 2026.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Secteur</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge nette moyenne</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Observations</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Luxe / haute joaillerie</td><td className="py-3 px-4 text-center font-bold text-emerald-700">25 - 40 %</td><td className="py-3 px-4">Marges très élevées, volumes faibles, marketing lourd.</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Logiciels / SaaS</td><td className="py-3 px-4 text-center font-bold text-emerald-700">15 - 35 %</td><td className="py-3 px-4">Frais marginaux faibles, scalabilité élevée.</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Services aux entreprises</td><td className="py-3 px-4 text-center font-bold text-teal-700">10 - 25 %</td><td className="py-3 px-4">Conseil, IT, gestion. Personnel qualifié.</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">E-commerce</td><td className="py-3 px-4 text-center font-bold text-teal-700">5 - 15 %</td><td className="py-3 px-4">Marketing acquisition lourd, logistique.</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Commerce de détail</td><td className="py-3 px-4 text-center font-bold text-amber-700">3 - 8 %</td><td className="py-3 px-4">Concurrence forte, loyers commerciaux.</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100"><strong>Restauration</strong></td><td className="py-3 px-4 text-center font-bold text-teal-700">5 - 15 %</td><td className="py-3 px-4">Personnel lourd, saisonnalité, charges fixes.</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Hôtellerie</td><td className="py-3 px-4 text-center font-bold text-amber-700">5 - 12 %</td><td className="py-3 px-4">Capex lourd, dépendance occupation.</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">BTP / Construction</td><td className="py-3 px-4 text-center font-bold text-amber-700">3 - 8 %</td><td className="py-3 px-4">Cycles longs, risques chantier.</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Grande distribution</td><td className="py-3 px-4 text-center font-bold text-red-700">1 - 4 %</td><td className="py-3 px-4">Volumes énormes, marges unitaires faibles.</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Conclusion :</strong> la restauration n'est pas le secteur le plus rentable
              en marge nette pure (5-15 %), mais elle reste meilleure que la grande distribution
              ou le BTP, et comparable à l'e-commerce ou l'hôtellerie. C'est surtout un secteur
              à barrière d'entrée faible et à forte valeur humaine ajoutée — ce qui explique
              pourquoi tant de personnes s'y lancent.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 10 : 4 vers 12 ═════════════ */}
        <section id="4-vers-12" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="10">
            Comment passer de 4 % à 12 % de marge nette en 6 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Gagner 8 points de marge nette en 6 mois est ambitieux mais atteignable. Voici la
              feuille de route en 4 axes prioritaires, ordonnés par impact et facilité d'exécution.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            {[
              {
                num: 1,
                title: "Réduire le food cost de 2-3 points (mois 1-2)",
                desc: "Audit complet des fiches techniques avec pesée systématique. Identification des plats où le food cost dérape (> 35 %). Renégociation top 5 fournisseurs. Réduction des portions de 5-10 % sur les plats peu critiques. Impact attendu : +2 à 3 points de marge nette.",
              },
              {
                num: 2,
                title: "Optimiser la masse salariale de 3-4 points (mois 2-3)",
                desc: "Planning dynamique selon affluence prévue. Développement polyvalence (service/cuisine). Réduction des heures supplémentaires non productives. Embauche à temps partiel pour les pics. Impact attendu : +2 à 3 points de marge nette.",
              },
              {
                num: 3,
                title: "Augmenter le ticket moyen de 8-15 % (mois 3-5)",
                desc: "Menu engineering complet : promotion des plats à forte marge brute. Formation équipe sur l'upsell (entrée, dessert, café). Refonte de la carte avec ancrages prix. Tests A/B sur les desserts et boissons. Impact attendu : +2 à 3 points de marge nette.",
              },
              {
                num: 4,
                title: "Négocier les charges fixes (mois 4-6)",
                desc: "Renégociation loyer (clause d'échelle mobile, prolongation contre baisse). Audit énergétique (LED, programmation thermostat, écogestes équipe). Renégociation assurances et abonnements (téléphonie, logiciels, banque). Impact attendu : +1 à 2 points de marge nette.",
              },
            ].map((step) => (
              <div key={step.num} className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7 flex gap-5">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg shadow-md">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-mono-100 text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Callout type="info">
            <strong>Impact cumulé attendu :</strong> +7 à +11 points de marge nette en 6 mois.
            Sur un CA de 600 000 EUR, c'est 42 000 à 66 000 EUR de bénéfice supplémentaire par an.
            Le plan est réaliste mais demande de la rigueur. RestauMargin vous accompagne sur
            chacun de ces axes avec des outils dédiés.
          </Callout>

          <div className="prose-content mt-6">
            <p>
              Pour aller plus loin, consultez nos guides spécialisés :
              <Link to="/blog/seuil-rentabilite-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">seuil de rentabilité</Link>,
              <Link to="/blog/prime-cost-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">prime cost (food + personnel)</Link>,
              et <Link to="/blog/kpi-restaurateur" className="text-teal-700 underline hover:text-teal-800 ml-1">KPI essentiels du restaurateur</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" updatedDate="2026-07-12" readTime="14 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">FAQ complémentaire (8 questions)</h2>
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
              Calculez votre marge bénéficiaire en temps réel
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin calcule automatiquement votre marge brute, marge d'exploitation et
              marge nette sur tous vos plats, en temps réel.
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
                to="/outils/calculateur-marge-restaurant"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Calculateur gratuit
              </Link>
            </div>
          </div>
        </section>

        {/* ═════════════ Sources & references (E-E-A-T Trust) ═════════════ */}
        <section className="mb-16" aria-labelledby="sources-references">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <h2 id="sources-references" className="text-2xl font-bold text-mono-100">Sources &amp; references</h2>
          </div>
          <p className="text-sm text-mono-500 mb-6 max-w-3xl">
            Les fourchettes de marge brute et nette, taux de TVA et seuils de rentabilite cites dans ce guide s'appuient
            sur des sources officielles et professionnelles reconnues du secteur, recoupees avec les donnees agregees de
            RestauMargin (400+ etablissements francais). Ces references sont verifiables et mises a jour pour 2026.
          </p>

          <ul className="grid sm:grid-cols-2 gap-4 mb-6">
            <li>
              <a
                href="https://www.economie.gouv.fr/particuliers/impots-et-fiscalite/gerer-mes-autres-impots-et-taxes/tva-quels-sont-les-taux-de-votre-quotidien"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group h-full"
              >
                <ExternalLink className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>
                  <span className="block font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">economie.gouv.fr — Taux de TVA</span>
                  <span className="block text-xs text-mono-500 mt-1">Source officielle des taux 5,5 % / 10 % / 20 % appliques en restauration, base du calcul de marge en HT.</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://www.insee.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group h-full"
              >
                <ExternalLink className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>
                  <span className="block font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">INSEE</span>
                  <span className="block text-xs text-mono-500 mt-1">Statistiques nationales sur la restauration, la demographie des entreprises et les taux de defaillance.</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://www.umih.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group h-full"
              >
                <ExternalLink className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>
                  <span className="block font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">UMIH</span>
                  <span className="block text-xs text-mono-500 mt-1">Union des Metiers et des Industries de l'Hotellerie — reference des usages et ratios de rentabilite du secteur CHR.</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://www.lhotellerie-restauration.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group h-full"
              >
                <ExternalLink className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>
                  <span className="block font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">L'Hotellerie-Restauration</span>
                  <span className="block text-xs text-mono-500 mt-1">Presse professionnelle de reference (marges brutes et nettes, coefficients, seuils de rentabilite).</span>
                </span>
              </a>
            </li>
          </ul>

          <p className="text-xs text-mono-500 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Methodologie editoriale, sources internes et responsable de la publication detailles sur notre page{' '}
              <Link to="/a-propos" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">Qui sommes-nous</Link>.
            </span>
          </p>
        </section>

        {/* ═════════════ Articles complementaires ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul de marge restaurant</h3>
              <p className="text-xs text-mono-500">Formules, food cost, coefficient multiplicateur, benchmarks par type.</p>
            </Link>
            <Link to="/blog/seuil-rentabilite-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Seuil de rentabilité restaurant</h3>
              <p className="text-xs text-mono-500">Point mort, charges fixes vs variables, formule et cas pratiques.</p>
            </Link>
            <Link to="/blog/prime-cost-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Prime cost restaurant</h3>
              <p className="text-xs text-mono-500">Matières + personnel : l'indicateur clef à 60-65 % du CA.</p>
            </Link>
            <Link to="/blog/kpi-restaurateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">KPI restaurateur essentiels</h3>
              <p className="text-xs text-mono-500">Les indicateurs à suivre chaque semaine pour piloter la rentabilité.</p>
            </Link>
          </div>
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
          <p className="mb-4">
            La plateforme de gestion de marge pour les restaurateurs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-mono-700">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions légales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialité</Link>
          </div>
          <p className="mt-6 text-xs text-mono-700">
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits réservés.
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
    <div className={`${c.bg} rounded-2xl p-6 border border-mono-975`}>
      <div className={`w-10 h-10 ${c.badge} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="font-bold text-mono-100 mb-2">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed mb-4">{desc}</p>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-mono-500 font-medium">Formule :</span>
          <code className="bg-white/70 px-2 py-0.5 rounded text-mono-350">{formula}</code>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-mono-500 font-medium">Objectif :</span>
          <span className={`${c.badge} px-2 py-0.5 rounded font-semibold`}>{target}</span>
        </div>
      </div>
    </div>
  );
}

function ZoneRow({ zone, range, color, desc }: { zone: string; range: string; color: string; desc: string }) {
  const colors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', badge: 'bg-red-100 text-red-700' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-700' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', badge: 'bg-yellow-100 text-yellow-700' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-700' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900', badge: 'bg-teal-100 text-teal-700' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-700' },
  };
  const c = colors[color] || colors.amber;

  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4`}>
      <div className="flex items-center gap-3 sm:min-w-[220px]">
        <span className={`${c.badge} px-3 py-1 rounded-full font-bold text-sm`}>{range}</span>
        <h3 className={`font-bold ${c.text}`}>{zone}</h3>
      </div>
      <p className={`text-sm ${c.text} leading-relaxed flex-1`}>{desc}</p>
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
