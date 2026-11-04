import { Link } from 'react-router-dom';
import {
  ChefHat,
  TrendingUp,
  Calculator,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Target,
  BookOpen,
  Lightbulb,
  Users,
  Zap,
  ListChecks,
  Sparkles,
  Layers,
  Activity,
  Gauge,
  Clock,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Les 5 ratios cles d'un restaurant rentable en 2026"
   Cible : question PAA "Quels sont les 5 ratios cles en restauration ?"
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quels sont les 5 ratios clés à suivre dans un restaurant ?',
    answer:
      "Les 5 ratios clés d'un restaurant sont : (1) le food cost (coût matières / CA HT, cible 25-35%), (2) le ratio personnel ou masse salariale (charges personnel / CA HT, cible 30-40%), (3) le prime cost (somme des deux précédents, cible 60-65%), (4) le ticket moyen (CA / nombre de couverts, 12-50 EUR selon segment) et (5) le taux d'occupation (couverts servis / capacité théorique, cible 60-90%). Ces 5 ratios diagnostiquent 95% des problèmes de rentabilité.",
  },
  {
    question: 'Quelle est la différence entre food cost et prime cost ?',
    answer:
      "Le food cost mesure uniquement le poids des matières premières dans le CA (cible 25-35%). Le prime cost ajoute la masse salariale (cible 30-40%). Prime cost = food cost + ratio personnel. Cible globale : 60-65% du CA HT. Au-delà de 70%, le restaurant est structurellement déficitaire car il reste moins de 30% pour couvrir loyer, énergie, marketing, taxes et marge nette.",
  },
  {
    question: 'Comment calculer le ticket moyen de mon restaurant ?',
    answer:
      "Ticket moyen = Chiffre d'affaires HT / Nombre de couverts. Si vous avez fait 2 400 EUR de CA HT en service avec 100 couverts servis, votre ticket moyen est de 24 EUR. Suivez-le par service (midi vs soir) et par jour de la semaine. Les écarts révèlent souvent des opportunités d'upselling ou des problèmes de carte (mauvais menu engineering).",
  },
  {
    question: "C'est quoi le taux d'occupation d'un restaurant ?",
    answer:
      "Le taux d'occupation est le pourcentage de places assises occupées pendant un service. Formule : (Couverts servis / Capacité théorique) x 100. Capacité théorique = nombre de places x nombre de services. Cible : 60-90% selon le service. Sous 50%, votre concept ou votre marketing posent problème. Au-delà de 95%, vous refusez du monde et perdez du CA potentiel.",
  },
  {
    question: 'Quel ratio personnel ne pas dépasser en restauration ?',
    answer:
      "Le ratio personnel ne devrait pas dépasser 40% du CA HT en restauration traditionnelle. Cible idéale : 30-38%. En bistrot : 32-38%. En brasserie : 33-40%. En gastronomique : 40-50% accepté (brigade importante). En fast-food : 25-30%. Au-delà de 45%, votre marge nette devient quasi nulle après food cost, loyer et charges.",
  },
  {
    question: 'À quelle fréquence faut-il suivre ces 5 ratios ?',
    answer:
      "Quotidiennement pour le food cost et le ratio personnel (suivi temps réel). Hebdomadairement pour le prime cost (calcul à froid sur 7 jours). Mensuellement pour le taux d'occupation et le ticket moyen (analyse de tendances). Sur 12 mois glissants pour la marge nette. Un tableau de bord automatisé type RestauMargin remonte ces indicateurs sans saisie manuelle.",
  },
  {
    question: 'Quel est le ratio bonus à ajouter aux 5 ratios clés ?',
    answer:
      "Le 6e ratio qui change tout : la rotation des tables. Formule : Nombre de couverts servis / Nombre de places. Une rotation à 1,5x signifie que chaque place a été utilisée 1,5 fois sur un service. Cible : 1,2-2,0x sur le midi (rapide), 1,0-1,5x sur le soir. Augmenter la rotation de 0,2 sur 100 places équivaut à +20 couverts/service, soit potentiellement +50 000 EUR de CA annuel.",
  },
  {
    question: 'RevPASH, kesako ?',
    answer:
      "Le RevPASH (Revenue Per Available Seat Hour) mesure le revenu généré par siège disponible par heure. Formule : CA HT / (Nombre de places x Nombre d'heures d'ouverture). Indicateur emprunté à l'hôtellerie. Un restaurant de 60 places ouvert 5h qui fait 3 000 EUR de CA a un RevPASH de 10 EUR. Permet de comparer service midi vs soir et d'optimiser horaires d'ouverture.",
  },
];

export default function Blog5RatiosCles() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Les 5 ratios clés d'un restaurant rentable en 2026 (avec formules)"
        description="Découvrez les 5 ratios essentiels pour piloter votre restaurant : food cost, prime cost, ratio personnel, ticket moyen, taux occupation. Formules, benchmarks et seuils d'alerte par segment."
        path="/blog/5-ratios-cles-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: '5 ratios clés restaurant', url: 'https://www.restaumargin.fr/blog/5-ratios-cles-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Les 5 ratios clés d\'un restaurant rentable',
            description: 'Liste ordonnée des 5 indicateurs financiers prioritaires pour piloter la rentabilité d\'un restaurant.',
            numberOfItems: 5,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Food cost', description: 'Coût matières / CA HT, cible 25-35%' },
              { '@type': 'ListItem', position: 2, name: 'Ratio personnel', description: 'Masse salariale / CA HT, cible 30-40%' },
              { '@type': 'ListItem', position: 3, name: 'Prime cost', description: 'Food cost + Masse salariale, cible 60-65%' },
              { '@type': 'ListItem', position: 4, name: 'Ticket moyen', description: 'CA HT / Nombre de couverts, 12-50 EUR selon segment' },
              { '@type': 'ListItem', position: 5, name: 'Taux d\'occupation', description: 'Couverts servis / capacité théorique, cible 60-90%' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Les 5 ratios clés d'un restaurant rentable en 2026 (avec formules)",
            description: "Guide des 5 indicateurs essentiels pour piloter la rentabilité d'un restaurant : food cost, ratio personnel, prime cost, ticket moyen, taux d'occupation. Formules, benchmarks et seuils d'alerte.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/5-ratios-cles-restaurant' },
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
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">5 ratios clés restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Pilotage"
        readTime="15 min"
        date="Mai 2026"
        title="Les 5 ratios clés d'un restaurant rentable en 2026"
        accentWord="ratios"
        subtitle="Food cost, prime cost, ratio personnel, ticket moyen, taux d'occupation. Les 5 indicateurs qui suffisent à diagnostiquer 95% des problèmes de rentabilité. Formules, benchmarks et seuils d'alerte par segment."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* ── Featured snippet (50 mots) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Réponse rapide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Quels sont les 5 ratios clés en restauration ?
          </h2>
          <p className="text-teal-50 text-base sm:text-lg leading-relaxed">
            Les 5 ratios clés d'un restaurant en 2026 sont : (1) le <strong className="text-white">food cost</strong> (25-35% du CA),
            (2) le <strong className="text-white">ratio personnel</strong> ou masse salariale (30-40%),
            (3) le <strong className="text-white">prime cost</strong> qui est leur somme (60-65%),
            (4) le <strong className="text-white">ticket moyen</strong> par couvert (12-50 EUR selon segment),
            et (5) le <strong className="text-white">taux d'occupation</strong> (60-90%).
            Ces 5 ratios suffisent à diagnostiquer 95 % des problèmes de rentabilité d'un restaurant.
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
              { href: '#intro', label: 'Quels sont les 5 ratios clés en restauration ?' },
              { href: '#ratio-food-cost', label: 'Ratio #1 : Food cost (25-35% du CA HT)' },
              { href: '#ratio-personnel', label: 'Ratio #2 : Ratio personnel (30-40% du CA HT)' },
              { href: '#ratio-prime-cost', label: 'Ratio #3 : Prime cost (60-65% du CA HT)' },
              { href: '#ratio-ticket-moyen', label: 'Ratio #4 : Ticket moyen (EUR par couvert)' },
              { href: '#ratio-occupation', label: "Ratio #5 : Taux d'occupation (60-90%)" },
              { href: '#tableau-recap', label: 'Tableau recap : bon / acceptable / mauvais' },
              { href: '#tracking', label: 'Comment tracker ces 5 ratios au quotidien' },
              { href: '#bonus', label: 'Le ratio bonus #6 : rotation des tables' },
              { href: '#plan-action', label: "Plan d'action : tableau de bord 5 ratios" },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Automatiser le suivi des 5 ratios' },
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

        {/* ═════════════ SECTION 1 : Intro / featured snippet ═════════════ */}
        <section id="intro" className="mb-16">
          <SectionHeading icon={<Layers className="w-6 h-6" />} number="1">
            Quels sont les 5 ratios clés en restauration ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              On dit souvent qu'un bon restaurateur "a le nez". En réalité, derrière chaque restaurant
              rentable se cache un pilotage rigoureux de quelques indicateurs simples. Pas besoin
              de douze tableaux croisés dynamiques : <strong>5 ratios suffisent à diagnostiquer
              95 % des problèmes de rentabilité</strong> d'un restaurant. Ils permettent en moins
              de 10 minutes par semaine de savoir si vous gagnez de l'argent, ou si vous êtes
              en train d'en perdre.
            </p>
            <p>
              Ce guide passe en revue chacun de ces ratios : la formule exacte, le benchmark par
              segment (bistrot, brasserie, pizzeria, gastronomique, fast-food), le seuil d'alerte
              au-delà duquel vous êtes en danger, et les leviers d'amélioration concrets. À la
              fin, vous trouverez un tableau recap à imprimer et coller dans votre bureau.
            </p>
          </div>

          <div className="grid sm:grid-cols-5 gap-3 mt-8">
            {[
              { num: '1', label: 'Food cost', value: '25-35%', icon: <DollarSign className="w-5 h-5" /> },
              { num: '2', label: 'Ratio personnel', value: '30-40%', icon: <Users className="w-5 h-5" /> },
              { num: '3', label: 'Prime cost', value: '60-65%', icon: <Layers className="w-5 h-5" /> },
              { num: '4', label: 'Ticket moyen', value: '12-50 EUR', icon: <Target className="w-5 h-5" /> },
              { num: '5', label: "Taux d'occupation", value: '60-90%', icon: <Activity className="w-5 h-5" /> },
            ].map((r, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-4 text-center hover:border-teal-300 transition-colors">
                <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center mx-auto mb-2">
                  {r.icon}
                </div>
                <div className="text-xs font-semibold text-teal-600 mb-1">RATIO #{r.num}</div>
                <div className="font-bold text-mono-100 text-sm mb-1">{r.label}</div>
                <div className="text-xs text-mono-500">{r.value}</div>
              </div>
            ))}
          </div>

          <Callout type="info">
            <strong>Pourquoi 5 et pas 10 ?</strong> Trop d'indicateurs paralysent. Les 5 ratios
            de ce guide couvrent les deux faces de la rentabilité : la <strong>maîtrise des coûts</strong>
            (food cost, ratio personnel, prime cost) et l'<strong>optimisation des revenus</strong>
            (ticket moyen, taux d'occupation). Au quotidien, c'est tout ce dont vous avez besoin
            pour piloter.
          </Callout>
        </section>

        {/* ═════════════ SECTION 2 : Food cost ═════════════ */}
        <section id="ratio-food-cost" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="2">
            Ratio #1 : Food cost (25-35% du CA HT)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le food cost est <strong>le ratio le plus connu et le plus suivi en restauration</strong>.
              Il mesure le poids des matières premières dans votre chiffre d'affaires. C'est l'indicateur
              numéro un pour évaluer la qualité de vos achats, de vos fiches techniques et de votre menu engineering.
            </p>
          </div>

          <RatioCard
            num={1}
            title="Food cost"
            formula="(Coût matières / CA HT) x 100"
            example="180 000 EUR de matières sur 600 000 EUR de CA = 30%"
            cible="25-35% du CA HT"
            alerte=">38% (zone rouge)"
            color="amber"
          />

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Benchmarks par segment</h3>
            <p>
              Le food cost cible varie selon votre concept. Une pizzeria avec ingrédients basiques
              (farine, tomate, mozza) a un food cost bas. Un restaurant gastronomique avec produits
              nobles (foie gras, homard, truffe) accepte un food cost plus élevé.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Segment</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost cible</th>
                  <th className="text-center py-3 px-4 font-semibold">Seuil alerte</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Commentaire</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { s: 'Pizzeria', c: '22-28%', a: '>32%', note: 'Ingrédients peu chers' },
                  { s: 'Coffee shop / boulangerie', c: '20-28%', a: '>30%', note: 'Marge très élevée' },
                  { s: 'Fast-food', c: '28-32%', a: '>35%', note: 'Standardisation forte' },
                  { s: 'Bistrot', c: '28-33%', a: '>36%', note: 'Carte courte saisonnière' },
                  { s: 'Brasserie', c: '30-35%', a: '>38%', note: 'Carte large, volume' },
                  { s: 'Gastronomique', c: '32-40%', a: '>43%', note: 'Produits nobles' },
                  { s: 'Sushi / japonais', c: '30-38%', a: '>42%', note: 'Poisson frais cher' },
                  { s: 'Food truck', c: '25-32%', a: '>35%', note: 'Faibles charges fixes' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.s}</td>
                    <td className="py-3 px-4 text-center text-teal-700 font-semibold">{row.c}</td>
                    <td className="py-3 px-4 text-center text-red-700 font-semibold">{row.a}</td>
                    <td className="py-3 px-4 text-center text-xs">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Comment faire baisser son food cost</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Peser systématiquement</strong> les portions avec une balance de cuisine. La pesée à l'oeil coûte 3 à 5 points de food cost.</li>
              <li><strong>Tenir à jour les fiches techniques</strong> avec les prix fournisseurs en temps réel. Un prix de beurre passé de 4 à 6 EUR/kg fausse instantanément vos calculs.</li>
              <li><strong>Réduire le gaspillage</strong> via FIFO, pesée des déchets, valorisation des parures.</li>
              <li><strong>Menu engineering</strong> : mettre en avant les plats à fort food cost moins élevé, retirer les "puzzles" (chers et impopulaires).</li>
              <li><strong>Négocier les fournisseurs</strong> tous les 6 mois, mettre en concurrence sur les 5 catégories principales (viandes, poissons, fromages, produits secs, boissons).</li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Pour aller plus loin :</strong> consultez notre guide complet
            <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800 ml-1">
              10 stratégies pour réduire le food cost
            </Link>
            et utilisez notre
            <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800 ml-1">
              calculateur de food cost gratuit
            </Link>.
          </Callout>
        </section>

        {/* ═════════════ SECTION 3 : Ratio personnel ═════════════ */}
        <section id="ratio-personnel" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="3">
            Ratio #2 : Ratio personnel / masse salariale (30-40% du CA HT)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le ratio personnel est <strong>le second pilier de la rentabilité</strong>. En restauration
              traditionnelle, la masse salariale (chargée, c'est-à-dire incluant les cotisations
              patronales) représente entre 30 % et 40 % du chiffre d'affaires HT. Au-delà de 45 %,
              le restaurant est structurellement déficitaire.
            </p>
          </div>

          <RatioCard
            num={2}
            title="Ratio personnel (masse salariale)"
            formula="(Charges personnel totales / CA HT) x 100"
            example="210 000 EUR de masse salariale chargée sur 600 000 EUR de CA = 35%"
            cible="30-40% du CA HT"
            alerte=">45% (zone rouge)"
            color="blue"
          />

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Que comprendre dans les "charges personnel" ?</h3>
            <p>
              Le ratio personnel doit inclure <strong>l'intégralité du coût employeur</strong>, pas seulement
              les salaires nets. Cela comprend :
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-2">
              <li>Salaires bruts (CDI, CDD, extras, apprentis)</li>
              <li>Charges patronales (40-45 % du salaire brut en CCN HCR 2026)</li>
              <li>Primes (ancienneté, performance, repas, tickets restaurant)</li>
              <li>Indemnités (congés payés, RTT, ancienneté, départ)</li>
              <li>Formations et frais professionnels</li>
              <li>Avantages en nature (repas, logement)</li>
            </ul>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Segment</th>
                  <th className="text-center py-3 px-4 font-semibold">Ratio personnel cible</th>
                  <th className="text-center py-3 px-4 font-semibold">Seuil alerte</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Note</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { s: 'Fast-food', c: '22-28%', a: '>32%', note: 'Processus standardisé' },
                  { s: 'Pizzeria', c: '28-32%', a: '>36%', note: 'Service rapide' },
                  { s: 'Food truck', c: '22-30%', a: '>34%', note: 'Équipe réduite' },
                  { s: 'Bistrot', c: '32-38%', a: '>42%', note: 'Cuisine + service' },
                  { s: 'Brasserie', c: '33-40%', a: '>44%', note: 'Carte large, brigades' },
                  { s: 'Restaurant traditionnel', c: '35-42%', a: '>46%', note: 'Service complet' },
                  { s: 'Gastronomique', c: '40-50%', a: '>54%', note: 'Brigade importante, MOF' },
                  { s: 'Dark kitchen', c: '20-26%', a: '>30%', note: 'Pas de service salle' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.s}</td>
                    <td className="py-3 px-4 text-center text-teal-700 font-semibold">{row.c}</td>
                    <td className="py-3 px-4 text-center text-red-700 font-semibold">{row.a}</td>
                    <td className="py-3 px-4 text-center text-xs">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Comment améliorer son ratio personnel</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Planning optimisé</strong> : staffer en fonction des prévisions de couverts heure par heure, pas du planning fixe.</li>
              <li><strong>Polyvalence</strong> : former la salle à faire de la mise en place, la cuisine à aider au service rush.</li>
              <li><strong>Réduire le turnover</strong> : un turnover à 60 % (norme du secteur) coûte environ 3 000-5 000 EUR par départ en recrutement et formation.</li>
              <li><strong>Apprentissage</strong> : contrats apprentis = aides de l'État + coût charge très réduit (50-80 % SMIC).</li>
              <li><strong>Process</strong> : digitaliser commandes, encaissement, communication cuisine pour gagner 10-15 minutes par couvert.</li>
            </ul>
            <p className="mt-4">
              Approfondissez avec notre article dédié :
              <Link to="/blog/reduire-cout-personnel-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">
                Comment réduire le coût du personnel en restauration
              </Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Prime cost ═════════════ */}
        <section id="ratio-prime-cost" className="mb-16">
          <SectionHeading icon={<Layers className="w-6 h-6" />} number="4">
            Ratio #3 : Prime cost (60-65% du CA HT)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le prime cost est <strong>le ratio le plus important en restauration</strong>, et pourtant
              le moins connu des restaurateurs français. C'est la somme du food cost et du ratio personnel.
              Il représente vos deux plus gros postes de coûts : matières premières + personnel.
              Au-delà de 70 % du CA, votre marge nette est quasi nulle.
            </p>
          </div>

          <RatioCard
            num={3}
            title="Prime cost"
            formula="Food cost + Ratio personnel"
            example="30% food cost + 35% personnel = 65% prime cost"
            cible="60-65% du CA HT"
            alerte=">70% (zone rouge)"
            color="purple"
          />

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Pourquoi le prime cost est l'indicateur n1</h3>
            <p>
              Le prime cost cumule vos deux plus gros postes : <strong>matières (contrôlables)</strong> et
              <strong> personnel (contrôlables)</strong>. Le reste de vos charges (loyer, énergie, assurances,
              taxes) est largement <strong>fixe et difficilement compressible</strong>. Si vous arrivez à
              maintenir un prime cost entre 60 % et 65 %, il vous reste 35-40 % pour absorber tout le reste
              et dégager une marge nette de 5-15 %.
            </p>
            <p>
              <strong>Règle simple :</strong>
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li><strong>Prime cost &lt; 60 %</strong> : excellent, votre restaurant est très rentable.</li>
              <li><strong>Prime cost 60-65 %</strong> : bon, marge nette saine de 8-12 %.</li>
              <li><strong>Prime cost 65-70 %</strong> : zone de vigilance, marge nette comprimée à 3-7 %.</li>
              <li><strong>Prime cost &gt; 70 %</strong> : danger, restaurant déficitaire ou survie sur fil.</li>
            </ul>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Exemple complet : bistrot 600 000 EUR CA</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Poste</th>
                  <th className="text-right py-2 px-3 font-semibold">Montant</th>
                  <th className="text-right py-2 px-3 font-semibold">% du CA</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-2 px-3 font-medium">CA HT</td><td className="py-2 px-3 text-right font-bold">600 000 EUR</td><td className="py-2 px-3 text-right font-bold">100%</td></tr>
                <tr><td className="py-2 px-3">- Food cost</td><td className="py-2 px-3 text-right">-180 000 EUR</td><td className="py-2 px-3 text-right">-30%</td></tr>
                <tr><td className="py-2 px-3">- Masse salariale</td><td className="py-2 px-3 text-right">-210 000 EUR</td><td className="py-2 px-3 text-right">-35%</td></tr>
                <tr className="bg-purple-50"><td className="py-2 px-3 font-bold text-purple-900">= Prime cost</td><td className="py-2 px-3 text-right font-bold text-purple-900">390 000 EUR</td><td className="py-2 px-3 text-right font-bold text-purple-900">65%</td></tr>
                <tr><td className="py-2 px-3">- Loyer + charges</td><td className="py-2 px-3 text-right">-60 000 EUR</td><td className="py-2 px-3 text-right">-10%</td></tr>
                <tr><td className="py-2 px-3">- Énergie + fluides</td><td className="py-2 px-3 text-right">-30 000 EUR</td><td className="py-2 px-3 text-right">-5%</td></tr>
                <tr><td className="py-2 px-3">- Marketing + autres</td><td className="py-2 px-3 text-right">-48 000 EUR</td><td className="py-2 px-3 text-right">-8%</td></tr>
                <tr><td className="py-2 px-3">- Amortissements + frais financiers</td><td className="py-2 px-3 text-right">-24 000 EUR</td><td className="py-2 px-3 text-right">-4%</td></tr>
                <tr className="bg-emerald-50 border-t-2 border-mono-900"><td className="py-3 px-3 font-bold text-emerald-900">Marge nette</td><td className="py-3 px-3 text-right font-bold text-emerald-900">48 000 EUR</td><td className="py-3 px-3 text-right font-bold text-emerald-900">8%</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Le prime cost à 65 % de cet exemple laisse 35 % pour les autres charges. Résultat :
              marge nette de 8 %, ce qui correspond à 48 000 EUR de bénéfice annuel. Si le même
              restaurant dérive à 72 % de prime cost, la marge nette tombe à 1 % soit 6 000 EUR :
              un événement imprévu (panne four, contentieux URSSAF) coule l'entreprise.
            </p>
            <p>
              Pour une analyse approfondie, lisez notre guide
              <Link to="/blog/prime-cost-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">
                Prime cost en restauration : l'indicateur n1 de rentabilité
              </Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Ticket moyen ═════════════ */}
        <section id="ratio-ticket-moyen" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="5">
            Ratio #4 : Ticket moyen (EUR par couvert)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le ticket moyen mesure <strong>combien dépense en moyenne un client</strong> dans votre
              restaurant. Il est déterminant pour la rentabilité : 5 EUR de plus en moyenne par client,
              sur 30 000 couverts annuels, c'est 150 000 EUR de CA additionnel — quasi sans coût marginal
              (les charges fixes sont les mêmes).
            </p>
          </div>

          <RatioCard
            num={4}
            title="Ticket moyen"
            formula="CA HT / Nombre de couverts servis"
            example="600 000 EUR de CA / 25 000 couverts = 24 EUR/couvert"
            cible="12-50 EUR selon segment"
            alerte="Décroissance >5% sur 3 mois"
            color="emerald"
          />

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Benchmarks ticket moyen par segment</h3>
            <p>
              Le ticket moyen dépend fortement de votre positionnement. Voici les fourchettes France 2026 :
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {[
              { s: 'Fast-food', tm: '8-14 EUR', note: 'Formule midi standardisée' },
              { s: 'Pizzeria', tm: '14-22 EUR', note: 'Pizza + boisson + dessert' },
              { s: 'Food truck', tm: '10-16 EUR', note: 'Plat unique + boisson' },
              { s: 'Bistrot', tm: '22-32 EUR', note: 'Entrée-plat ou plat-dessert' },
              { s: 'Brasserie', tm: '25-38 EUR', note: 'Carte large, vin au verre' },
              { s: 'Restaurant traditionnel', tm: '28-45 EUR', note: 'Menu 3 services + vin' },
              { s: 'Restaurant gastronomique', tm: '60-150 EUR', note: 'Menu dégustation + vins' },
              { s: 'Coffee shop', tm: '6-12 EUR', note: 'Boisson + viennoiserie' },
            ].map((b, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-mono-100 text-sm">{b.s}</div>
                  <div className="text-xs text-mono-500">{b.note}</div>
                </div>
                <span className="text-teal-700 font-bold text-sm">{b.tm}</span>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">10 leviers pour augmenter le ticket moyen</h3>
            <ol className="list-decimal list-inside space-y-2 text-mono-350">
              <li><strong>Upselling boissons</strong> : passer du verre à la bouteille, proposer accord mets-vins.</li>
              <li><strong>Suggestion desserts</strong> : carte sur table, suggestion verbale, vitrine visible.</li>
              <li><strong>Formules premium</strong> : ajouter une formule à +5 EUR avec entrée fromage.</li>
              <li><strong>Café gourmand</strong> : excellent ratio coût/prix, augmente le ticket de 3-5 EUR.</li>
              <li><strong>Side dishes</strong> : pommes grenailles, fromage, supplément viande +3 EUR.</li>
              <li><strong>Cocktails signature</strong> : marge 80 %, augmente le panier soir.</li>
              <li><strong>Menu dégustation</strong> : remplacer la carte par un menu cadrant 65 EUR.</li>
              <li><strong>Bottle service</strong> : champagne, vin à la table sur réservation soir.</li>
              <li><strong>Design carte</strong> : decoy effect, prix sans signe euro, placement plats hauts.</li>
              <li><strong>Formation upselling</strong> : 1h/mois avec l'équipe salle, scripts pour les suggestions.</li>
            </ol>
            <p className="mt-4">
              Lisez notre article dédié :
              <Link to="/blog/augmenter-ticket-moyen-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">
                10 techniques pour augmenter le ticket moyen
              </Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Taux d'occupation ═════════════ */}
        <section id="ratio-occupation" className="mb-16">
          <SectionHeading icon={<Activity className="w-6 h-6" />} number="6">
            Ratio #5 : Taux d'occupation (60-90% selon service)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le taux d'occupation mesure <strong>l'utilisation effective de votre capacité</strong>.
              Un restaurant peut avoir un excellent food cost et un excellent ticket moyen, mais
              s'il n'a que 30 % de remplissage, il fera peu de marge en absolu. C'est l'indicateur
              numéro un pour les concepts à forts coûts fixes (loyer élevé, brigade importante).
            </p>
          </div>

          <RatioCard
            num={5}
            title="Taux d'occupation"
            formula="(Couverts servis / Capacité théorique) x 100"
            example="60 places, 2 services/jour = 120 couverts max. 84 servis = 70%"
            cible="60-90% selon service"
            alerte="<50% (en danger)"
            color="orange"
          />

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Capacité théorique vs réelle</h3>
            <p>
              <strong>Capacité théorique = nombre de places x nombre de services possibles</strong>.
              Exemple : 60 places, 2 services/jour midi + soir = 120 couverts théoriques. Si vous
              servez 84 couverts, votre taux est de 70 %. Important : ce taux varie selon le jour
              (lundi 40 %, vendredi 95 %) et selon le service (midi 65 %, soir 80 % en moyenne).
            </p>
            <p>
              <strong>Astuce :</strong> calculez aussi le <strong>taux d'occupation pondéré</strong> en
              ajoutant la rotation. Un restaurant à 100 % d'occupation avec rotation 1,0x = un restaurant
              à 50 % avec rotation 2,0x. Les deux ont la même rentabilité couverts servis.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg flex items-center gap-2">
              <Gauge className="w-5 h-5 text-teal-600" />
              Le RevPASH : metric avancée
            </h3>
            <p className="text-sm text-mono-400 leading-relaxed mb-4">
              <strong>RevPASH (Revenue Per Available Seat Hour)</strong> = revenu par siège disponible par heure.
              Indicateur emprunté à l'hôtellerie qui combine taux d'occupation, ticket moyen et durée
              d'ouverture. Formule : <code className="bg-white px-2 py-0.5 rounded text-mono-100">CA HT / (nombre de places x heures d'ouverture)</code>.
            </p>
            <p className="text-sm text-mono-400 leading-relaxed">
              Exemple : 60 places, 5h d'ouverture (midi 12h-15h + soir 19h-22h), CA HT 3 000 EUR
              sur la journée = RevPASH de 10 EUR. Un bon restaurant urbain vise 12-18 EUR de RevPASH,
              un gastronomique 25-50 EUR.
            </p>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Leviers pour augmenter le taux d'occupation</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Réservations en ligne</strong> 24/7 (TheFork, Zenchef, site direct)</li>
              <li><strong>Formules midi attractives</strong> (entrée+plat+dessert à 19,90 EUR) pour fidéliser les bureaux du quartier</li>
              <li><strong>Happy hours</strong> entre 18h et 19h30 pour remplir l'entre-deux services</li>
              <li><strong>Programmes fidélité</strong> qui génèrent 30-40 % du CA récurrent</li>
              <li><strong>Plateformes Google / Instagram</strong> pour acquérir des nouveaux clients</li>
              <li><strong>Privatisation</strong> du restaurant un soir/semaine pour entreprises ou événements</li>
            </ul>
            <p className="mt-4">
              Pour aller plus loin :
              <Link to="/blog/taux-occupation-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">
                Taux d'occupation restaurant : calcul, benchmarks et 8 leviers
              </Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Tableau recap ═════════════ */}
        <section id="tableau-recap" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="7">
            Tableau recap : les 5 ratios clés à mémoriser
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici le tableau à imprimer et coller dans votre bureau ou votre cuisine.
              Les seuils sont valides pour la France 2026, restauration traditionnelle.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Ratio</th>
                  <th className="text-center py-3 px-4 font-semibold text-emerald-700">Bon</th>
                  <th className="text-center py-3 px-4 font-semibold text-amber-700">Acceptable</th>
                  <th className="text-center py-3 px-4 font-semibold text-red-700">Mauvais</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Food cost</td><td className="py-3 px-4 text-center text-emerald-700 font-semibold">&lt;28%</td><td className="py-3 px-4 text-center text-amber-700">28-35%</td><td className="py-3 px-4 text-center text-red-700">&gt;38%</td><td className="py-3 px-4 text-center text-xs">Fiches techniques + pesée + fournisseurs</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Ratio personnel</td><td className="py-3 px-4 text-center text-emerald-700 font-semibold">&lt;32%</td><td className="py-3 px-4 text-center text-amber-700">32-40%</td><td className="py-3 px-4 text-center text-red-700">&gt;45%</td><td className="py-3 px-4 text-center text-xs">Planning + polyvalence + apprentis</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Prime cost</td><td className="py-3 px-4 text-center text-emerald-700 font-semibold">&lt;60%</td><td className="py-3 px-4 text-center text-amber-700">60-65%</td><td className="py-3 px-4 text-center text-red-700">&gt;70%</td><td className="py-3 px-4 text-center text-xs">Optimiser cumul matières + personnel</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Ticket moyen</td><td className="py-3 px-4 text-center text-emerald-700 font-semibold">Top quartile segment</td><td className="py-3 px-4 text-center text-amber-700">Médiane</td><td className="py-3 px-4 text-center text-red-700">Bottom quartile</td><td className="py-3 px-4 text-center text-xs">Upselling + formules + carte des vins</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Taux occupation</td><td className="py-3 px-4 text-center text-emerald-700 font-semibold">&gt;75%</td><td className="py-3 px-4 text-center text-amber-700">60-75%</td><td className="py-3 px-4 text-center text-red-700">&lt;50%</td><td className="py-3 px-4 text-center text-xs">Réservations + marketing + fidélité</td></tr>
              </tbody>
            </table>
          </div>

          <Callout type="warning">
            <strong>Important :</strong> ces seuils sont des repères généraux. Une pizzeria avec 22 % de food cost et
            32 % de ratio personnel (prime cost 54 %) peut être très rentable. Un gastronomique avec 38 % de
            food cost et 48 % de personnel (prime cost 86 %) sera lui en grave difficulté, sauf si son ticket
            moyen dépasse 120 EUR et compense les ratios élevés.
          </Callout>
        </section>

        {/* ═════════════ SECTION 8 : Comment tracker ═════════════ */}
        <section id="tracking" className="mb-16">
          <SectionHeading icon={<Clock className="w-6 h-6" />} number="8">
            Comment tracker ces 5 ratios au quotidien
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avoir les bons ratios ne sert à rien si on ne les suit pas. Voici la fréquence
              de mesure recommandée, du suivi temps réel au reporting mensuel.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            {[
              { freq: 'Quotidien', items: ['Food cost (calcul automatique sur fiches techniques)', 'Couverts servis (caisse)', 'CA HT du jour (caisse)', 'Ticket moyen du jour (CA / couverts)'] },
              { freq: 'Hebdomadaire', items: ['Food cost moyen 7 jours', 'Masse salariale planning vs réel', 'Ratio personnel (paie / CA)', 'Prime cost calculé (food cost + ratio personnel)'] },
              { freq: 'Mensuel', items: ['Taux d\'occupation moyen', 'Évolution ticket moyen mois vs mois-1', 'Prime cost mensuel consolidé', 'RevPASH calculé'] },
              { freq: 'Trimestriel / Annuel', items: ['Marge brute (CA - food cost)', 'Marge nette (après toutes charges)', 'Benchmarking vs concurrents (Insee, GIRA)', 'Plan d\'action prochains 3 mois'] },
            ].map((bloc, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5">
                <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  {bloc.freq}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-mono-350">
                  {bloc.items.map((it, j) => <li key={j}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <Callout type="info">
            <strong>Outil recommandé :</strong> RestauMargin automatise le calcul des 5 ratios en temps réel
            depuis vos fiches techniques, votre paie et votre caisse. Plus de tableur, plus d'erreur,
            visibilité immédiate via dashboard.
          </Callout>
        </section>

        {/* ═════════════ SECTION 9 : Bonus ratio rotation ═════════════ */}
        <section id="bonus" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="9">
            Le ratio bonus #6 (qui change tout) : rotation des tables
          </SectionHeading>

          <div className="prose-content">
            <p>
              Si vous voulez aller au-delà des 5 ratios standards, ajoutez la <strong>rotation des tables</strong>.
              Cet indicateur est invisible dans la plupart des outils mais représente <strong>le levier #1
              d'augmentation de CA sans investir dans la conquête clients</strong>.
            </p>
          </div>

          <RatioCard
            num={6}
            title="Rotation des tables"
            formula="Nombre de couverts servis / Nombre de places assises"
            example="100 places, 130 couverts midi = rotation 1,3x"
            cible="1,2-2,0x au midi, 1,0-1,5x au soir"
            alerte="<1,0x soir (concept à revoir)"
            color="pink"
          />

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Calcul cumulé : que représente +0,2 de rotation ?</h3>
            <p>
              Imaginons un restaurant de 80 places. Vous passez d'une rotation moyenne de 1,2 à 1,4
              (+0,2). Sur 80 places et un service par jour, vous servez 16 couverts supplémentaires.
              À 25 EUR de ticket moyen, c'est 400 EUR/jour, soit <strong>130 000 EUR de CA annuel
              additionnel</strong>. Avec une marge nette à 8 %, c'est 10 400 EUR de bénéfice net en plus
              chaque année — pour quasiment aucun coût marginal (les charges fixes sont les mêmes).
            </p>
            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Comment augmenter la rotation</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Réduire le temps de service</strong> : envoi des plats sous 12 min, addition pré-calculée avant la demande</li>
              <li><strong>Carte courte</strong> : moins d'hésitation client, commande plus rapide</li>
              <li><strong>Service au verre / cocktail</strong> : moins d'attente début/fin de repas</li>
              <li><strong>Paiement table</strong> : QR code ou TPE mobile pour éviter l'attente comptoir</li>
              <li><strong>Réservation 2 créneaux</strong> : 19h30 / 21h30, communiqué au client à la réservation</li>
              <li><strong>Plat unique du jour</strong> : préparation rapide, service en 8 min</li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 10 : Plan d'action ═════════════ */}
        <section id="plan-action" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="10">
            Plan d'action : construire votre tableau de bord 5 ratios
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici un plan d'action en 4 semaines pour mettre en place le suivi des 5 ratios clés
              dans votre restaurant. Inspiration des meilleurs opérateurs français et américains.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Semaine 1 : État des lieux',
                body: 'Calculez vos 5 ratios actuels sur les 3 derniers mois. Comparez aux benchmarks. Identifiez les 1-2 ratios les plus éloignés de la cible (ce sont vos quick wins).',
              },
              {
                title: 'Semaine 2 : Outillage',
                body: 'Mettez en place le tracking automatisé. Soit un tableur partagé (gratuit mais chronophage), soit un outil dédié type RestauMargin (19 EUR/mois, automatisation totale). Connectez caisse + paie + factures fournisseurs.',
              },
              {
                title: 'Semaine 3 : Routine de pilotage',
                body: 'Instaurez une routine hebdomadaire : revue des 5 ratios chaque lundi matin avec l\'équipe encadrement. Définissez objectifs et actions correctives. Affichez le tableau de bord en cuisine.',
              },
              {
                title: 'Semaine 4 : Premières actions correctives',
                body: 'Lancez vos 3 premières actions ciblées sur les ratios prioritaires : par exemple peser systématiquement (food cost), renégocier 2 fournisseurs (food cost), tester upselling café gourmand (ticket moyen). Mesurez 30 jours après.',
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
            <strong>Pour aller plus loin :</strong> consultez notre article
            <Link to="/blog/kpi-restaurateur" className="text-teal-700 underline hover:text-teal-800 ml-1">
              Les 10 KPI essentiels pour piloter son restaurant
            </Link>
            qui détaille les 5 indicateurs additionnels (marge nette, rotation stocks, NPS, taux de retour client, ratio loyer).
          </Callout>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
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
              Automatisez le suivi des 5 ratios avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Food cost, ratio personnel, prime cost, ticket moyen, taux d'occupation :
              tous vos KPI en temps réel sur un dashboard unique.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>19 EUR/mois</strong> &mdash; essai gratuit 7 jours, sans engagement, sans carte bancaire.
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire le food cost</h3>
              <p className="text-xs text-mono-500">10 stratégies concrètes pour optimiser vos matières premières.</p>
            </Link>
            <Link to="/blog/prime-cost-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Prime cost restaurant</h3>
              <p className="text-xs text-mono-500">L'indicateur n1 de la rentabilité, formule et benchmarks.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire le coût personnel</h3>
              <p className="text-xs text-mono-500">5 leviers pour réduire votre masse salariale de 10-20%.</p>
            </Link>
            <Link to="/blog/augmenter-ticket-moyen-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Augmenter le ticket moyen</h3>
              <p className="text-xs text-mono-500">10 techniques avec impact chiffré sur le CA annuel.</p>
            </Link>
            <Link to="/blog/taux-occupation-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Taux d'occupation</h3>
              <p className="text-xs text-mono-500">Calcul, benchmarks RevPASH et 8 leviers d'optimisation.</p>
            </Link>
            <Link to="/blog/kpi-restaurateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">10 KPI restaurateur</h3>
              <p className="text-xs text-mono-500">Pour aller plus loin que les 5 ratios clés : marge nette, NPS, rotation.</p>
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

function RatioCard({ num, title, formula, example, cible, alerte, color }: {
  num: number;
  title: string;
  formula: string;
  example: string;
  cible: string;
  alerte: string;
  color: string;
}) {
  const colors: Record<string, { bg: string; border: string; badge: string; accent: string }> = {
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', accent: 'text-amber-700' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', accent: 'text-blue-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', accent: 'text-purple-700' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', accent: 'text-emerald-700' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', accent: 'text-orange-700' },
    pink: { bg: 'bg-pink-50', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700', accent: 'text-pink-700' },
  };
  const c = colors[color] || colors.amber;
  return (
    <div className={`mt-6 ${c.bg} border ${c.border} rounded-2xl p-6 sm:p-8`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${c.badge} rounded-xl flex items-center justify-center font-bold`}>
          #{num}
        </div>
        <h3 className={`font-bold text-lg ${c.accent}`}>{title}</h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-xs font-semibold text-mono-500 uppercase tracking-wider mb-1">Formule</div>
          <div className="font-mono bg-white/70 px-3 py-2 rounded-lg text-mono-100 text-sm">{formula}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-mono-500 uppercase tracking-wider mb-1">Exemple</div>
          <div className="text-mono-350 text-sm">{example}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-mono-500 uppercase tracking-wider mb-1">Cible</div>
          <div className={`${c.badge} px-3 py-1.5 rounded-lg font-semibold text-sm inline-block`}>{cible}</div>
        </div>
        <div>
          <div className="text-xs font-semibold text-mono-500 uppercase tracking-wider mb-1">Seuil alerte</div>
          <div className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-semibold text-sm inline-block flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3.5 h-3.5" />
            {alerte}
          </div>
        </div>
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
    <details className="bg-mono-1000 border border-mono-900 rounded-xl group">
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
