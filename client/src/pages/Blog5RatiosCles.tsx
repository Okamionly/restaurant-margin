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

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Les 5 ratios cles d'un restaurant rentable en 2026"
   Cible : question PAA "Quels sont les 5 ratios cles en restauration ?"
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quels sont les 5 ratios cles a suivre dans un restaurant ?',
    answer:
      "Les 5 ratios cles d'un restaurant sont : (1) le food cost (cout matieres / CA HT, cible 25-35%), (2) le ratio personnel ou masse salariale (charges personnel / CA HT, cible 30-40%), (3) le prime cost (somme des deux precedents, cible 60-65%), (4) le ticket moyen (CA / nombre de couverts, 12-50 EUR selon segment) et (5) le taux d'occupation (couverts servis / capacite theorique, cible 60-90%). Ces 5 ratios diagnostiquent 95% des problemes de rentabilite.",
  },
  {
    question: 'Quelle est la difference entre food cost et prime cost ?',
    answer:
      "Le food cost mesure uniquement le poids des matieres premieres dans le CA (cible 25-35%). Le prime cost ajoute la masse salariale (cible 30-40%). Prime cost = food cost + ratio personnel. Cible globale : 60-65% du CA HT. Au-dela de 70%, le restaurant est structurellement deficitaire car il reste moins de 30% pour couvrir loyer, energie, marketing, taxes et marge nette.",
  },
  {
    question: 'Comment calculer le ticket moyen de mon restaurant ?',
    answer:
      "Ticket moyen = Chiffre d'affaires HT / Nombre de couverts. Si vous avez fait 2 400 EUR de CA HT en service avec 100 couverts servis, votre ticket moyen est de 24 EUR. Suivez-le par service (midi vs soir) et par jour de la semaine. Les ecarts revelent souvent des opportunites d'upselling ou des problemes de carte (mauvais menu engineering).",
  },
  {
    question: "C'est quoi le taux d'occupation d'un restaurant ?",
    answer:
      "Le taux d'occupation est le pourcentage de places assises occupees pendant un service. Formule : (Couverts servis / Capacite theorique) x 100. Capacite theorique = nombre de places x nombre de services. Cible : 60-90% selon le service. Sous 50%, votre concept ou votre marketing posent probleme. Au-dela de 95%, vous refusez du monde et perdez du CA potentiel.",
  },
  {
    question: 'Quel ratio personnel ne pas depasser en restauration ?',
    answer:
      "Le ratio personnel ne devrait pas depasser 40% du CA HT en restauration traditionnelle. Cible ideale : 30-38%. En bistrot : 32-38%. En brasserie : 33-40%. En gastronomique : 40-50% accepte (brigade importante). En fast-food : 25-30%. Au-dela de 45%, votre marge nette devient quasi nulle apres food cost, loyer et charges.",
  },
  {
    question: 'A quelle frequence faut-il suivre ces 5 ratios ?',
    answer:
      "Quotidiennement pour le food cost et le ratio personnel (suivi temps reel). Hebdomadairement pour le prime cost (calcul a froid sur 7 jours). Mensuellement pour le taux d'occupation et le ticket moyen (analyse de tendances). Sur 12 mois glissants pour la marge nette. Un tableau de bord automatise type RestauMargin remonte ces indicateurs sans saisie manuelle.",
  },
  {
    question: 'Quel est le ratio bonus a ajouter aux 5 ratios cles ?',
    answer:
      "Le 6e ratio qui change tout : la rotation des tables. Formule : Nombre de couverts servis / Nombre de places. Une rotation a 1,5x signifie que chaque place a ete utilisee 1,5 fois sur un service. Cible : 1,2-2,0x sur le midi (rapide), 1,0-1,5x sur le soir. Augmenter la rotation de 0,2 sur 100 places equivaut a +20 couverts/service, soit potentiellement +50 000 EUR de CA annuel.",
  },
  {
    question: 'RevPASH, kesako ?',
    answer:
      "Le RevPASH (Revenue Per Available Seat Hour) mesure le revenu genere par siege disponible par heure. Formule : CA HT / (Nombre de places x Nombre d'heures d'ouverture). Indicateur emprunte a l'hotellerie. Un restaurant de 60 places ouvert 5h qui fait 3 000 EUR de CA a un RevPASH de 10 EUR. Permet de comparer service midi vs soir et d'optimiser horaires d'ouverture.",
  },
];

export default function Blog5RatiosCles() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Les 5 ratios cles d'un restaurant rentable en 2026 (avec formules)"
        description="Decouvrez les 5 ratios essentiels pour piloter votre restaurant : food cost, prime cost, ratio personnel, ticket moyen, taux occupation. Formules, benchmarks et seuils d'alerte par segment."
        path="/blog/5-ratios-cles-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: '5 ratios cles restaurant', url: 'https://www.restaumargin.fr/blog/5-ratios-cles-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Les 5 ratios cles d\'un restaurant rentable',
            description: 'Liste ordonnee des 5 indicateurs financiers prioritaires pour piloter la rentabilite d\'un restaurant.',
            numberOfItems: 5,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Food cost', description: 'Cout matieres / CA HT, cible 25-35%' },
              { '@type': 'ListItem', position: 2, name: 'Ratio personnel', description: 'Masse salariale / CA HT, cible 30-40%' },
              { '@type': 'ListItem', position: 3, name: 'Prime cost', description: 'Food cost + Masse salariale, cible 60-65%' },
              { '@type': 'ListItem', position: 4, name: 'Ticket moyen', description: 'CA HT / Nombre de couverts, 12-50 EUR selon segment' },
              { '@type': 'ListItem', position: 5, name: 'Taux d\'occupation', description: 'Couverts servis / capacite theorique, cible 60-90%' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Les 5 ratios cles d'un restaurant rentable en 2026 (avec formules)",
            description: "Guide des 5 indicateurs essentiels pour piloter la rentabilite d'un restaurant : food cost, ratio personnel, prime cost, ticket moyen, taux d'occupation. Formules, benchmarks et seuils d'alerte.",
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
          <span className="text-mono-100 font-medium">5 ratios cles restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Pilotage"
        readTime="15 min"
        date="Mai 2026"
        title="Les 5 ratios cles d'un restaurant rentable en 2026"
        accentWord="ratios"
        subtitle="Food cost, prime cost, ratio personnel, ticket moyen, taux d'occupation. Les 5 indicateurs qui suffisent a diagnostiquer 95% des problemes de rentabilite. Formules, benchmarks et seuils d'alerte par segment."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* ── Featured snippet (50 mots) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Reponse rapide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Quels sont les 5 ratios cles en restauration ?
          </h2>
          <p className="text-teal-50 text-base sm:text-lg leading-relaxed">
            Les 5 ratios cles d'un restaurant en 2026 sont : (1) le <strong className="text-white">food cost</strong> (25-35% du CA),
            (2) le <strong className="text-white">ratio personnel</strong> ou masse salariale (30-40%),
            (3) le <strong className="text-white">prime cost</strong> qui est leur somme (60-65%),
            (4) le <strong className="text-white">ticket moyen</strong> par couvert (12-50 EUR selon segment),
            et (5) le <strong className="text-white">taux d'occupation</strong> (60-90%).
            Ces 5 ratios suffisent a diagnostiquer 95 % des problemes de rentabilite d'un restaurant.
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
              { href: '#intro', label: 'Quels sont les 5 ratios cles en restauration ?' },
              { href: '#ratio-food-cost', label: 'Ratio #1 : Food cost (25-35% du CA HT)' },
              { href: '#ratio-personnel', label: 'Ratio #2 : Ratio personnel (30-40% du CA HT)' },
              { href: '#ratio-prime-cost', label: 'Ratio #3 : Prime cost (60-65% du CA HT)' },
              { href: '#ratio-ticket-moyen', label: 'Ratio #4 : Ticket moyen (EUR par couvert)' },
              { href: '#ratio-occupation', label: "Ratio #5 : Taux d'occupation (60-90%)" },
              { href: '#tableau-recap', label: 'Tableau recap : bon / acceptable / mauvais' },
              { href: '#tracking', label: 'Comment tracker ces 5 ratios au quotidien' },
              { href: '#bonus', label: 'Le ratio bonus #6 : rotation des tables' },
              { href: '#plan-action', label: "Plan d'action : tableau de bord 5 ratios" },
              { href: '#faq', label: 'Questions frequentes' },
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
            Quels sont les 5 ratios cles en restauration ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              On dit souvent qu'un bon restaurateur "a le nez". En realite, derriere chaque restaurant
              rentable se cache un pilotage rigoureux de quelques indicateurs simples. Pas besoin
              de douze tableaux croises dynamiques : <strong>5 ratios suffisent a diagnostiquer
              95 % des problemes de rentabilite</strong> d'un restaurant. Ils permettent en moins
              de 10 minutes par semaine de savoir si vous gagnez de l'argent, ou si vous etes
              en train d'en perdre.
            </p>
            <p>
              Ce guide passe en revue chacun de ces ratios : la formule exacte, le benchmark par
              segment (bistrot, brasserie, pizzeria, gastronomique, fast-food), le seuil d'alerte
              au-dela duquel vous etes en danger, et les leviers d'amelioration concrets. A la
              fin, vous trouverez un tableau recap a imprimer et coller dans votre bureau.
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
            de ce guide couvrent les deux faces de la rentabilite : la <strong>maitrise des couts</strong>
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
              Il mesure le poids des matieres premieres dans votre chiffre d'affaires. C'est l'indicateur
              numero un pour evaluer la qualite de vos achats, de vos fiches techniques et de votre menu engineering.
            </p>
          </div>

          <RatioCard
            num={1}
            title="Food cost"
            formula="(Cout matieres / CA HT) x 100"
            example="180 000 EUR de matieres sur 600 000 EUR de CA = 30%"
            cible="25-35% du CA HT"
            alerte=">38% (zone rouge)"
            color="amber"
          />

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Benchmarks par segment</h3>
            <p>
              Le food cost cible varie selon votre concept. Une pizzeria avec ingredients basiques
              (farine, tomate, mozza) a un food cost bas. Un restaurant gastronomique avec produits
              nobles (foie gras, homard, truffe) accepte un food cost plus eleve.
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
                  { s: 'Pizzeria', c: '22-28%', a: '>32%', note: 'Ingredients peu chers' },
                  { s: 'Coffee shop / boulangerie', c: '20-28%', a: '>30%', note: 'Marge tres elevee' },
                  { s: 'Fast-food', c: '28-32%', a: '>35%', note: 'Standardisation forte' },
                  { s: 'Bistrot', c: '28-33%', a: '>36%', note: 'Carte courte saisonniere' },
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
              <li><strong>Peser systematiquement</strong> les portions avec une balance de cuisine. La pesee a l'oeil coute 3 a 5 points de food cost.</li>
              <li><strong>Tenir a jour les fiches techniques</strong> avec les prix fournisseurs en temps reel. Un prix de beurre passe de 4 a 6 EUR/kg fausse instantanement vos calculs.</li>
              <li><strong>Reduire le gaspillage</strong> via FIFO, pesee des dechets, valorisation des parures.</li>
              <li><strong>Menu engineering</strong> : mettre en avant les plats a fort food cost moins eleve, retirer les "puzzles" (chers et impopulaires).</li>
              <li><strong>Negocier les fournisseurs</strong> tous les 6 mois, mettre en concurrence sur les 5 categories principales (viandes, poissons, fromages, produits secs, boissons).</li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Pour aller plus loin :</strong> consultez notre guide complet
            <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800 ml-1">
              10 strategies pour reduire le food cost
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
              Le ratio personnel est <strong>le second pilier de la rentabilite</strong>. En restauration
              traditionnelle, la masse salariale (chargee, c'est-a-dire incluant les cotisations
              patronales) represente entre 30 % et 40 % du chiffre d'affaires HT. Au-dela de 45 %,
              le restaurant est structurellement deficitaire.
            </p>
          </div>

          <RatioCard
            num={2}
            title="Ratio personnel (masse salariale)"
            formula="(Charges personnel totales / CA HT) x 100"
            example="210 000 EUR de masse salariale chargee sur 600 000 EUR de CA = 35%"
            cible="30-40% du CA HT"
            alerte=">45% (zone rouge)"
            color="blue"
          />

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Que comprendre dans les "charges personnel" ?</h3>
            <p>
              Le ratio personnel doit inclure <strong>l'integralite du cout employeur</strong>, pas seulement
              les salaires nets. Cela comprend :
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-2">
              <li>Salaires bruts (CDI, CDD, extras, apprentis)</li>
              <li>Charges patronales (40-45 % du salaire brut en CCN HCR 2026)</li>
              <li>Primes (anciennete, performance, repas, tickets restaurant)</li>
              <li>Indemnites (conges payes, RTT, anciennete, depart)</li>
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
                  { s: 'Fast-food', c: '22-28%', a: '>32%', note: 'Processus standardise' },
                  { s: 'Pizzeria', c: '28-32%', a: '>36%', note: 'Service rapide' },
                  { s: 'Food truck', c: '22-30%', a: '>34%', note: 'Equipe reduite' },
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
            <h3 className="text-xl font-bold text-mono-100 mb-3">Comment ameliorer son ratio personnel</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Planning optimise</strong> : staffer en fonction des previsions de couverts heure par heure, pas du planning fixe.</li>
              <li><strong>Polyvalence</strong> : former la salle a faire de la mise en place, la cuisine a aider au service rush.</li>
              <li><strong>Reduire le turnover</strong> : un turnover a 60 % (norme du secteur) coute environ 3 000-5 000 EUR par depart en recrutement et formation.</li>
              <li><strong>Apprentissage</strong> : contrats apprentis = aides de l'Etat + cout charge tres reduit (50-80 % SMIC).</li>
              <li><strong>Process</strong> : digitaliser commandes, encaissement, communication cuisine pour gagner 10-15 minutes par couvert.</li>
            </ul>
            <p className="mt-4">
              Approfondissez avec notre article dedie :
              <Link to="/blog/reduire-cout-personnel-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">
                Comment reduire le cout du personnel en restauration
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
              le moins connu des restaurateurs francais. C'est la somme du food cost et du ratio personnel.
              Il represente vos deux plus gros postes de couts : matieres premieres + personnel.
              Au-dela de 70 % du CA, votre marge nette est quasi nulle.
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
              Le prime cost cumule vos deux plus gros postes : <strong>matieres (controlables)</strong> et
              <strong> personnel (controlables)</strong>. Le reste de vos charges (loyer, energie, assurances,
              taxes) est largement <strong>fixe et difficilement compressible</strong>. Si vous arrivez a
              maintenir un prime cost entre 60 % et 65 %, il vous reste 35-40 % pour absorber tout le reste
              et degager une marge nette de 5-15 %.
            </p>
            <p>
              <strong>Regle simple :</strong>
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li><strong>Prime cost &lt; 60 %</strong> : excellent, votre restaurant est tres rentable.</li>
              <li><strong>Prime cost 60-65 %</strong> : bon, marge nette saine de 8-12 %.</li>
              <li><strong>Prime cost 65-70 %</strong> : zone de vigilance, marge nette comprimee a 3-7 %.</li>
              <li><strong>Prime cost &gt; 70 %</strong> : danger, restaurant deficitaire ou survie sur fil.</li>
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
                <tr><td className="py-2 px-3">- Energie + fluides</td><td className="py-2 px-3 text-right">-30 000 EUR</td><td className="py-2 px-3 text-right">-5%</td></tr>
                <tr><td className="py-2 px-3">- Marketing + autres</td><td className="py-2 px-3 text-right">-48 000 EUR</td><td className="py-2 px-3 text-right">-8%</td></tr>
                <tr><td className="py-2 px-3">- Amortissements + frais financiers</td><td className="py-2 px-3 text-right">-24 000 EUR</td><td className="py-2 px-3 text-right">-4%</td></tr>
                <tr className="bg-emerald-50 border-t-2 border-mono-900"><td className="py-3 px-3 font-bold text-emerald-900">Marge nette</td><td className="py-3 px-3 text-right font-bold text-emerald-900">48 000 EUR</td><td className="py-3 px-3 text-right font-bold text-emerald-900">8%</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Le prime cost a 65 % de cet exemple laisse 35 % pour les autres charges. Resultat :
              marge nette de 8 %, ce qui correspond a 48 000 EUR de benefice annuel. Si le meme
              restaurant derive a 72 % de prime cost, la marge nette tombe a 1 % soit 6 000 EUR :
              un evenement imprevu (panne four, contentieux URSSAF) coule l'entreprise.
            </p>
            <p>
              Pour une analyse approfondie, lisez notre guide
              <Link to="/blog/prime-cost-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">
                Prime cost en restauration : l'indicateur n1 de rentabilite
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
              Le ticket moyen mesure <strong>combien depense en moyenne un client</strong> dans votre
              restaurant. Il est determinant pour la rentabilite : 5 EUR de plus en moyenne par client,
              sur 30 000 couverts annuels, c'est 150 000 EUR de CA additionnel — quasi sans cout marginal
              (les charges fixes sont les memes).
            </p>
          </div>

          <RatioCard
            num={4}
            title="Ticket moyen"
            formula="CA HT / Nombre de couverts servis"
            example="600 000 EUR de CA / 25 000 couverts = 24 EUR/couvert"
            cible="12-50 EUR selon segment"
            alerte="Decroissance >5% sur 3 mois"
            color="emerald"
          />

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Benchmarks ticket moyen par segment</h3>
            <p>
              Le ticket moyen depend fortement de votre positionnement. Voici les fourchettes France 2026 :
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {[
              { s: 'Fast-food', tm: '8-14 EUR', note: 'Formule midi standardisee' },
              { s: 'Pizzeria', tm: '14-22 EUR', note: 'Pizza + boisson + dessert' },
              { s: 'Food truck', tm: '10-16 EUR', note: 'Plat unique + boisson' },
              { s: 'Bistrot', tm: '22-32 EUR', note: 'Entree-plat ou plat-dessert' },
              { s: 'Brasserie', tm: '25-38 EUR', note: 'Carte large, vin au verre' },
              { s: 'Restaurant traditionnel', tm: '28-45 EUR', note: 'Menu 3 services + vin' },
              { s: 'Restaurant gastronomique', tm: '60-150 EUR', note: 'Menu degustation + vins' },
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
              <li><strong>Upselling boissons</strong> : passer du verre a la bouteille, proposer accord mets-vins.</li>
              <li><strong>Suggestion desserts</strong> : carte sur table, suggestion verbale, vitrine visible.</li>
              <li><strong>Formules premium</strong> : ajouter une formule a +5 EUR avec entree fromage.</li>
              <li><strong>Cafe gourmand</strong> : excellent ratio cout/prix, augmente le ticket de 3-5 EUR.</li>
              <li><strong>Side dishes</strong> : pommes grenailles, fromage, supplement viande +3 EUR.</li>
              <li><strong>Cocktails signature</strong> : marge 80 %, augmente le panier soir.</li>
              <li><strong>Menu degustation</strong> : remplacer la carte par un menu cadrant 65 EUR.</li>
              <li><strong>Bottle service</strong> : champagne, vin a la table sur reservation soir.</li>
              <li><strong>Design carte</strong> : decoy effect, prix sans signe euro, placement plats hauts.</li>
              <li><strong>Formation upselling</strong> : 1h/mois avec l'equipe salle, scripts pour les suggestions.</li>
            </ol>
            <p className="mt-4">
              Lisez notre article dedie :
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
              Le taux d'occupation mesure <strong>l'utilisation effective de votre capacite</strong>.
              Un restaurant peut avoir un excellent food cost et un excellent ticket moyen, mais
              s'il n'a que 30 % de remplissage, il fera peu de marge en absolu. C'est l'indicateur
              numero un pour les concepts a forts couts fixes (loyer eleve, brigade importante).
            </p>
          </div>

          <RatioCard
            num={5}
            title="Taux d'occupation"
            formula="(Couverts servis / Capacite theorique) x 100"
            example="60 places, 2 services/jour = 120 couverts max. 84 servis = 70%"
            cible="60-90% selon service"
            alerte="<50% (en danger)"
            color="orange"
          />

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Capacite theorique vs reelle</h3>
            <p>
              <strong>Capacite theorique = nombre de places x nombre de services possibles</strong>.
              Exemple : 60 places, 2 services/jour midi + soir = 120 couverts theoriques. Si vous
              servez 84 couverts, votre taux est de 70 %. Important : ce taux varie selon le jour
              (lundi 40 %, vendredi 95 %) et selon le service (midi 65 %, soir 80 % en moyenne).
            </p>
            <p>
              <strong>Astuce :</strong> calculez aussi le <strong>taux d'occupation pondere</strong> en
              ajoutant la rotation. Un restaurant a 100 % d'occupation avec rotation 1,0x = un restaurant
              a 50 % avec rotation 2,0x. Les deux ont la meme rentabilite couverts servis.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg flex items-center gap-2">
              <Gauge className="w-5 h-5 text-teal-600" />
              Le RevPASH : metric avancee
            </h3>
            <p className="text-sm text-mono-400 leading-relaxed mb-4">
              <strong>RevPASH (Revenue Per Available Seat Hour)</strong> = revenu par siege disponible par heure.
              Indicateur emprunte a l'hotellerie qui combine taux d'occupation, ticket moyen et duree
              d'ouverture. Formule : <code className="bg-white px-2 py-0.5 rounded text-mono-100">CA HT / (nombre de places x heures d'ouverture)</code>.
            </p>
            <p className="text-sm text-mono-400 leading-relaxed">
              Exemple : 60 places, 5h d'ouverture (midi 12h-15h + soir 19h-22h), CA HT 3 000 EUR
              sur la journee = RevPASH de 10 EUR. Un bon restaurant urbain vise 12-18 EUR de RevPASH,
              un gastronomique 25-50 EUR.
            </p>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Leviers pour augmenter le taux d'occupation</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Reservations en ligne</strong> 24/7 (TheFork, Zenchef, site direct)</li>
              <li><strong>Formules midi attractives</strong> (entree+plat+dessert a 19,90 EUR) pour fideliser les bureaux du quartier</li>
              <li><strong>Happy hours</strong> entre 18h et 19h30 pour remplir l'entre-deux services</li>
              <li><strong>Programmes fidelite</strong> qui generent 30-40 % du CA recurrent</li>
              <li><strong>Plateformes Google / Instagram</strong> pour acquerir des nouveaux clients</li>
              <li><strong>Privatisation</strong> du restaurant un soir/semaine pour entreprises ou evenements</li>
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
            Tableau recap : les 5 ratios cles a memoriser
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici le tableau a imprimer et coller dans votre bureau ou votre cuisine.
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
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Food cost</td><td className="py-3 px-4 text-center text-emerald-700 font-semibold">&lt;28%</td><td className="py-3 px-4 text-center text-amber-700">28-35%</td><td className="py-3 px-4 text-center text-red-700">&gt;38%</td><td className="py-3 px-4 text-center text-xs">Fiches techniques + pesee + fournisseurs</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Ratio personnel</td><td className="py-3 px-4 text-center text-emerald-700 font-semibold">&lt;32%</td><td className="py-3 px-4 text-center text-amber-700">32-40%</td><td className="py-3 px-4 text-center text-red-700">&gt;45%</td><td className="py-3 px-4 text-center text-xs">Planning + polyvalence + apprentis</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Prime cost</td><td className="py-3 px-4 text-center text-emerald-700 font-semibold">&lt;60%</td><td className="py-3 px-4 text-center text-amber-700">60-65%</td><td className="py-3 px-4 text-center text-red-700">&gt;70%</td><td className="py-3 px-4 text-center text-xs">Optimiser cumul matieres + personnel</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Ticket moyen</td><td className="py-3 px-4 text-center text-emerald-700 font-semibold">Top quartile segment</td><td className="py-3 px-4 text-center text-amber-700">Mediane</td><td className="py-3 px-4 text-center text-red-700">Bottom quartile</td><td className="py-3 px-4 text-center text-xs">Upselling + formules + carte des vins</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Taux occupation</td><td className="py-3 px-4 text-center text-emerald-700 font-semibold">&gt;75%</td><td className="py-3 px-4 text-center text-amber-700">60-75%</td><td className="py-3 px-4 text-center text-red-700">&lt;50%</td><td className="py-3 px-4 text-center text-xs">Reservations + marketing + fidelite</td></tr>
              </tbody>
            </table>
          </div>

          <Callout type="warning">
            <strong>Important :</strong> ces seuils sont des reperes generaux. Une pizzeria avec 22 % de food cost et
            32 % de ratio personnel (prime cost 54 %) peut etre tres rentable. Un gastronomique avec 38 % de
            food cost et 48 % de personnel (prime cost 86 %) sera lui en grave difficulte, sauf si son ticket
            moyen depasse 120 EUR et compense les ratios eleves.
          </Callout>
        </section>

        {/* ═════════════ SECTION 8 : Comment tracker ═════════════ */}
        <section id="tracking" className="mb-16">
          <SectionHeading icon={<Clock className="w-6 h-6" />} number="8">
            Comment tracker ces 5 ratios au quotidien
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avoir les bons ratios ne sert a rien si on ne les suit pas. Voici la frequence
              de mesure recommandee, du suivi temps reel au reporting mensuel.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            {[
              { freq: 'Quotidien', items: ['Food cost (calcul automatique sur fiches techniques)', 'Couverts servis (caisse)', 'CA HT du jour (caisse)', 'Ticket moyen du jour (CA / couverts)'] },
              { freq: 'Hebdomadaire', items: ['Food cost moyen 7 jours', 'Masse salariale planning vs reel', 'Ratio personnel (paie / CA)', 'Prime cost calcule (food cost + ratio personnel)'] },
              { freq: 'Mensuel', items: ['Taux d\'occupation moyen', 'Evolution ticket moyen mois vs mois-1', 'Prime cost mensuel consolide', 'RevPASH calcule'] },
              { freq: 'Trimestriel / Annuel', items: ['Marge brute (CA - food cost)', 'Marge nette (apres toutes charges)', 'Benchmarking vs concurrents (Insee, GIRA)', 'Plan d\'action prochains 3 mois'] },
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
            <strong>Outil recommande :</strong> RestauMargin automatise le calcul des 5 ratios en temps reel
            depuis vos fiches techniques, votre paie et votre caisse. Plus de tableur, plus d'erreur,
            visibilite immediate via dashboard.
          </Callout>
        </section>

        {/* ═════════════ SECTION 9 : Bonus ratio rotation ═════════════ */}
        <section id="bonus" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="9">
            Le ratio bonus #6 (qui change tout) : rotation des tables
          </SectionHeading>

          <div className="prose-content">
            <p>
              Si vous voulez aller au-dela des 5 ratios standards, ajoutez la <strong>rotation des tables</strong>.
              Cet indicateur est invisible dans la plupart des outils mais represente <strong>le levier #1
              d'augmentation de CA sans investir dans la conquete clients</strong>.
            </p>
          </div>

          <RatioCard
            num={6}
            title="Rotation des tables"
            formula="Nombre de couverts servis / Nombre de places assises"
            example="100 places, 130 couverts midi = rotation 1,3x"
            cible="1,2-2,0x au midi, 1,0-1,5x au soir"
            alerte="<1,0x soir (concept a revoir)"
            color="pink"
          />

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Calcul cumule : que represente +0,2 de rotation ?</h3>
            <p>
              Imaginons un restaurant de 80 places. Vous passez d'une rotation moyenne de 1,2 a 1,4
              (+0,2). Sur 80 places et un service par jour, vous servez 16 couverts supplementaires.
              A 25 EUR de ticket moyen, c'est 400 EUR/jour, soit <strong>130 000 EUR de CA annuel
              additionnel</strong>. Avec une marge nette a 8 %, c'est 10 400 EUR de benefice net en plus
              chaque annee — pour quasiment aucun cout marginal (les charges fixes sont les memes).
            </p>
            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Comment augmenter la rotation</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Reduire le temps de service</strong> : envoi des plats sous 12 min, addition pre-calculee avant la demande</li>
              <li><strong>Carte courte</strong> : moins d'hesitation client, commande plus rapide</li>
              <li><strong>Service au verre / cocktail</strong> : moins d'attente debut/fin de repas</li>
              <li><strong>Paiement table</strong> : QR code ou TPE mobile pour eviter l'attente comptoir</li>
              <li><strong>Reservation 2 creneaux</strong> : 19h30 / 21h30, communique au client a la reservation</li>
              <li><strong>Plat unique du jour</strong> : preparation rapide, service en 8 min</li>
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
              Voici un plan d'action en 4 semaines pour mettre en place le suivi des 5 ratios cles
              dans votre restaurant. Inspiration des meilleurs operateurs francais et americains.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Semaine 1 : Etat des lieux',
                body: 'Calculez vos 5 ratios actuels sur les 3 derniers mois. Comparez aux benchmarks. Identifiez les 1-2 ratios les plus eloignes de la cible (ce sont vos quick wins).',
              },
              {
                title: 'Semaine 2 : Outillage',
                body: 'Mettez en place le tracking automatise. Soit un tableur partage (gratuit mais chronophage), soit un outil dedie type RestauMargin (29 EUR/mois, automatisation totale). Connectez caisse + paie + factures fournisseurs.',
              },
              {
                title: 'Semaine 3 : Routine de pilotage',
                body: 'Instaurez une routine hebdomadaire : revue des 5 ratios chaque lundi matin avec l\'equipe encadrement. Definissez objectifs et actions correctives. Affichez le tableau de bord en cuisine.',
              },
              {
                title: 'Semaine 4 : Premieres actions correctives',
                body: 'Lancez vos 3 premieres actions ciblees sur les ratios prioritaires : par exemple peser systematiquement (food cost), renegocier 2 fournisseurs (food cost), tester upselling cafe gourmand (ticket moyen). Mesurez 30 jours apres.',
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
            qui detaille les 5 indicateurs additionnels (marge nette, rotation stocks, NPS, taux de retour client, ratio loyer).
          </Callout>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes</h2>
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
              tous vos KPI en temps reel sur un dashboard unique.
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le food cost</h3>
              <p className="text-xs text-mono-500">10 strategies concretes pour optimiser vos matieres premieres.</p>
            </Link>
            <Link to="/blog/prime-cost-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Prime cost restaurant</h3>
              <p className="text-xs text-mono-500">L'indicateur n1 de la rentabilite, formule et benchmarks.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le cout personnel</h3>
              <p className="text-xs text-mono-500">5 leviers pour reduire votre masse salariale de 10-20%.</p>
            </Link>
            <Link to="/blog/augmenter-ticket-moyen-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Augmenter le ticket moyen</h3>
              <p className="text-xs text-mono-500">10 techniques avec impact chiffre sur le CA annuel.</p>
            </Link>
            <Link to="/blog/taux-occupation-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Taux d'occupation</h3>
              <p className="text-xs text-mono-500">Calcul, benchmarks RevPASH et 8 leviers d'optimisation.</p>
            </Link>
            <Link to="/blog/kpi-restaurateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">10 KPI restaurateur</h3>
              <p className="text-xs text-mono-500">Pour aller plus loin que les 5 ratios cles : marge nette, NPS, rotation.</p>
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
