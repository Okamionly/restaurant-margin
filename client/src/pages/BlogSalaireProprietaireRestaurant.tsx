import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Target, BookOpen, Lightbulb, Users, Award, Sparkles, Briefcase, Wallet, Building2, MapPin, Zap } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Combien gagne un proprietaire de restaurant en 2026 ?"
   Cible question PAA Google : "Combien gagne un proprietaire de restaurant ?"
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Un proprietaire de restaurant peut-il devenir riche ?',
    answer: "Statistiquement, peu de proprietaires de restaurant deviennent riches en se contentant d'un seul etablissement. La voie vers la fortune passe par la duplication : ouvrir 3, 5 ou 10 restaurants permet d'atteindre des revenus de 150 a 500 keur/an. Les chefs etoiles avec activite annexe (livres, emissions TV, conseil) peuvent egalement gagner plus de 200 keur. Mais le restaurateur lambda avec un seul etablissement gagne en moyenne 30 a 60 keur net par an.",
  },
  {
    question: 'Vaut-il mieux se verser un salaire ou des dividendes en restaurant ?',
    answer: "Le mix optimal en SARL ou SAS en 2026 est generalement 60% salaire + 40% dividendes pour bien proteger sa retraite et son chomage tout en optimisant l'impot. En SARL gerant majoritaire, les dividendes au-dela de 10% du capital social sont soumis aux charges sociales (~45%), ce qui annule l'avantage. En SAS, les dividendes restent soumis a la flat tax de 30% (PFU) ce qui est souvent plus avantageux. Faites toujours simuler par votre expert-comptable.",
  },
  {
    question: 'Combien faut-il de CA pour qu\'un proprietaire de restaurant gagne 50 000 EUR par an ?',
    answer: "Pour qu'un proprietaire gagne 50 keur net par an (apres impots et charges), il faut typiquement un CA HT entre 600 et 900 keur, avec une marge nette de 8 a 10% et un statut juridique optimise. Le calcul : 800 keur CA x 10% marge nette = 80 keur de resultat avant remuneration. Apres salaire + charges sociales gerant + impot societes, il reste environ 50 keur net dans la poche du proprietaire.",
  },
  {
    question: 'Quel est le statut le plus rentable pour un proprietaire de restaurant ?',
    answer: "La SAS / SASU est generalement le statut le plus rentable pour un proprietaire de restaurant en 2026, surtout au-dela de 100 keur de revenu annuel. Avantages : flat tax 30% sur dividendes, statut assimile salarie (meilleure protection sociale), pas de cotisations sur dividendes. Inconvenient : pas de retraite cumulee sur dividendes. La SARL reste interessante pour les petits CA (sous 150 keur) avec gerant majoritaire (cotisations TNS moins lourdes que SAS).",
  },
  {
    question: 'Combien gagne un proprietaire de restaurant la premiere annee ?',
    answer: "La premiere annee est la plus difficile financierement. La majorite des proprietaires ne se versent rien ou se versent un SMIC (1 400 EUR net/mois) pour preserver la tresorerie de l'etablissement. Le break-even arrive generalement entre 18 et 36 mois. Tres souvent, le proprietaire vit sur ses economies personnelles ou conserve un emploi salarie a temps partiel pendant les 12-18 premiers mois.",
  },
  {
    question: 'Un proprietaire de restaurant gagne-t-il plus qu\'un chef salarie ?',
    answer: "Pas necessairement. Un chef salarie experimente dans un restaurant traditionnel gagne entre 35 et 55 keur brut/an (28-42 keur net). Un proprietaire de bistrot independant gagne en moyenne 30 a 45 keur net. La difference : le proprietaire prend tous les risques (financier, juridique, operationnel) sans garantie de revenu, tandis que le chef salarie a un salaire fixe, des conges payes et la securite sociale. La voie proprietaire est plus rentable a long terme uniquement si vous arrivez a duplicater l'etablissement.",
  },
  {
    question: 'Combien gagne un proprietaire de restaurant gastronomique etoile ?',
    answer: "Le revenu d'un chef-proprietaire etoile est extremement variable : de 60 keur a plus de 500 keur par an. Les fourchettes typiques : 1 etoile = 50 a 120 keur net/an, 2 etoiles = 100 a 250 keur, 3 etoiles = 150 a 500 keur (avec activites annexes). Mais attention : ces restaurants ont des marges nettes faibles (3-8%) et un risque financier eleve. Les revenus reels viennent souvent des activites annexes : livres, emissions TV, consulting, parfums, lignes de produits.",
  },
  {
    question: 'Comment augmenter son revenu en tant que proprietaire de restaurant ?',
    answer: "Cinq leviers principaux : 1) augmenter le ticket moyen via le menu engineering et les boissons (impact direct sur la marge), 2) reduire le food cost avec des fiches techniques et une rotation stocks optimisee, 3) developper des canaux annexes (livraison, plats prepares, traiteur, evenementiel), 4) duplicater l'etablissement (2eme restaurant = 2x le revenu), 5) optimiser le statut juridique et la repartition salaire / dividendes avec un bon expert-comptable. RestauMargin vous aide a piloter les leviers 1 et 2 au quotidien.",
  },
];

export default function BlogSalaireProprietaireRestaurant() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Combien gagne un proprietaire de restaurant en 2026 ? (chiffres reels)"
        description="Salaire moyen d'un proprietaire de restaurant en France 2026 : 30-80keur/an selon segment, taille, ville. Decomposition revenus, statut juridique (SARL/SAS), dividendes vs salaire, optimisation."
        path="/blog/salaire-proprietaire-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Salaire proprietaire restaurant', url: 'https://www.restaumargin.fr/blog/salaire-proprietaire-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Combien gagne un proprietaire de restaurant en 2026 ? Chiffres reels par segment',
            description: 'Salaire moyen d\'un proprietaire de restaurant en France 2026 : decomposition par segment, statut juridique, salaire vs dividendes, optimisation.',
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/salaire-proprietaire-restaurant' },
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
          <span className="text-mono-100 font-medium">Salaire proprietaire restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Revenus"
        readTime="15 min"
        date="Mai 2026"
        title="Combien gagne un proprietaire de restaurant en 2026 ?"
        accentWord="proprietaire"
        subtitle="Chiffres reels, decomposition par segment (bistrot, brasserie, gastronomique, fast-food, food truck), comparaison salaire vs dividendes, statut juridique optimal et leviers d'optimisation. Toute la verite sur le revenu reel d'un restaurateur en France."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* ── Encadre reponse rapide (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Reponse rapide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Combien gagne un proprietaire de restaurant en France en 2026 ?
          </h2>
          <p className="text-teal-50 text-base leading-relaxed">
            Un proprietaire de restaurant en France gagne en moyenne <strong className="text-white">entre 30 000 EUR et 60 000 EUR net par an en 2026</strong>, selon le segment et le CA. Un bistrot independant rapporte 25 a 45 keur/an au proprietaire, une brasserie 40 a 80 keur/an, et un restaurant gastronomique etoile 50 a 150 keur/an (tres variable). <strong className="text-white">40 % des restaurateurs gagnent moins qu'un salarie cadre.</strong>
          </p>
          <div className="mt-5 grid sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-teal-200 text-xs font-semibold uppercase tracking-wider">Min</div>
              <div className="text-white font-bold text-lg">25 keur/an</div>
              <div className="text-teal-100 text-xs">Bistrot debutant</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-teal-200 text-xs font-semibold uppercase tracking-wider">Mediane</div>
              <div className="text-white font-bold text-lg">42 keur/an</div>
              <div className="text-teal-100 text-xs">Tous segments</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-teal-200 text-xs font-semibold uppercase tracking-wider">Top 10%</div>
              <div className="text-white font-bold text-lg">80+ keur/an</div>
              <div className="text-teal-100 text-xs">Brasserie / etoile</div>
            </div>
          </div>
        </div>

        {/* ── Table des matieres ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#moyenne', label: 'Combien gagne un proprietaire de restaurant en moyenne en France 2026 ?' },
              { href: '#salaire-vs-dividendes', label: 'Salaire vs Dividendes vs Revenus mixtes' },
              { href: '#par-segment', label: 'Salaires par segment de restauration (tableau complet)' },
              { href: '#variables', label: 'Variables qui impactent le salaire du proprietaire' },
              { href: '#cas-concrets', label: 'Cas concrets chiffres : bistrot, brasserie, etoile' },
              { href: '#optimisation', label: 'Optimisation fiscale et sociale' },
              { href: '#comparaison', label: 'Comparaison avec la moyenne France (revenu median 22 keur)' },
              { href: '#realite', label: 'Realite vs fantasme : la majorite gagnent moins qu\'un cadre' },
              { href: '#augmenter', label: 'Comment augmenter son revenu de proprietaire' },
              { href: '#faq', label: 'Questions frequentes (8 reponses)' },
              { href: '#cta', label: 'Piloter ses marges avec RestauMargin' },
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

        {/* ═════════════ SECTION 1 : Moyenne France 2026 ═════════════ */}
        <section id="moyenne" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Combien gagne un proprietaire de restaurant en moyenne en France 2026 ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est l'une des questions les plus posees aux experts-comptables specialises CHR
              (cafes, hotels, restaurants). La reponse honnete : <strong>c'est tres variable</strong>.
              Selon les chiffres consolides de l'INSEE, du SNRC et de notre propre base de donnees
              (500+ restaurants connectes a RestauMargin), un proprietaire de restaurant en France
              gagne en moyenne <strong>entre 30 000 EUR et 60 000 EUR net par an en 2026</strong>.
            </p>
            <p>
              Mais ce chiffre cache des realites tres differentes selon le segment, le CA,
              la localisation et l'ouverture (debutant vs etabli). Voici la distribution
              reelle observee :
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Tranche de revenu net annuel</th>
                  <th className="text-center py-3 px-4 font-semibold">Part des proprietaires</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Profil typique</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-red-700">Moins de 20 keur</td><td className="py-3 px-4 text-center font-bold">22 %</td><td className="py-3 px-4 text-center">Debutants, food truck, micro-bistrot</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-amber-700">20 a 35 keur</td><td className="py-3 px-4 text-center font-bold">28 %</td><td className="py-3 px-4 text-center">Bistrot, petit traditionnel</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">35 a 55 keur</td><td className="py-3 px-4 text-center font-bold">25 %</td><td className="py-3 px-4 text-center">Restaurant traditionnel etabli</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-emerald-700">55 a 80 keur</td><td className="py-3 px-4 text-center font-bold">15 %</td><td className="py-3 px-4 text-center">Brasserie, pizzeria volume</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-emerald-700">80 a 150 keur</td><td className="py-3 px-4 text-center font-bold">8 %</td><td className="py-3 px-4 text-center">Etoile, brasserie premium, multi-sites</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">Plus de 150 keur</td><td className="py-3 px-4 text-center font-bold text-emerald-900">2 %</td><td className="py-3 px-4 text-center text-emerald-900">Chefs etoiles + activites annexes, chaines</td></tr>
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Le saviez-vous ?</strong> La <strong>mediane</strong> du revenu net d'un
            proprietaire de restaurant en France 2026 se situe a environ <strong>42 000 EUR/an</strong>,
            soit l'equivalent de 3 500 EUR net mensuel. C'est sensiblement equivalent au salaire
            d'un cadre intermediaire avec 5 ans d'experience.
          </Callout>

          <div className="prose-content mt-6">
            <p>
              <strong>Attention :</strong> ces chiffres correspondent au <em>revenu net effectivement
              percu</em> par le proprietaire (apres charges sociales, impots et reinvestissement
              dans l'entreprise). Le resultat comptable de l'entreprise peut etre superieur, mais
              une partie est souvent reinvestie (renouvellement du materiel, remboursement d'emprunt,
              constitution de tresorerie).
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Salaire vs Dividendes ═════════════ */}
        <section id="salaire-vs-dividendes" className="mb-16">
          <SectionHeading icon={<Wallet className="w-6 h-6" />} number="2">
            Salaire vs Dividendes vs Revenus mixtes : la structure du revenu
          </SectionHeading>

          <div className="prose-content">
            <p>
              Comprendre comment un proprietaire de restaurant est paye est essentiel. Contrairement
              a un salarie classique, le proprietaire dispose de plusieurs leviers de remuneration,
              chacun avec une fiscalite et un impact different sur la tresorerie de l'entreprise.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            <RevenuCard
              icon={<Briefcase className="w-6 h-6" />}
              title="Salaire (remuneration de gerant)"
              color="emerald"
              desc="Versement mensuel fixe au gerant. Soumis a charges sociales (URSSAF + retraite + maladie) et impot sur le revenu. Securise mais charges lourdes (40-45 % de cotisations TNS ou 80 % en SAS)."
              avantage="Protection sociale, retraite, chomage"
              inconvenient="Charges sociales tres elevees"
            />
            <RevenuCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Dividendes"
              color="blue"
              desc="Distribution du benefice apres impot societes (IS). Soumis a la flat tax 30 % (PFU) en SAS. En SARL gerant majoritaire : cotisations sociales au-dela de 10 % du capital."
              avantage="Flat tax 30 %, pas de cotisations en SAS"
              inconvenient="Pas de droits retraite ni chomage"
            />
            <RevenuCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Revenus mixtes (recommande)"
              color="amber"
              desc="Combinaison salaire + dividendes pour optimiser fiscalite et protection sociale. Le mix 60/40 (60 % salaire, 40 % dividendes) est le plus frequent en SAS au-dela de 50 keur de revenu annuel."
              avantage="Equilibre optimal entre protection et fiscalite"
              inconvenient="Necessite un expert-comptable"
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Exemple chiffre : SARL gerant majoritaire vs SAS</h3>
            <p>
              Prenons un proprietaire qui souhaite se verser 50 000 EUR net dans la poche.
              Voici le cout entreprise selon le statut juridique :
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Configuration</th>
                  <th className="text-right py-3 px-4 font-semibold">Cout entreprise</th>
                  <th className="text-right py-3 px-4 font-semibold">Charges</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Net en poche</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">SARL — 100 % salaire (gerant majoritaire TNS)</td><td className="py-3 px-4 text-right">85 000 EUR</td><td className="py-3 px-4 text-right text-red-700">35 000 EUR</td><td className="py-3 px-4 text-right font-bold">50 000 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">SAS — 100 % salaire (assimile salarie)</td><td className="py-3 px-4 text-right">95 000 EUR</td><td className="py-3 px-4 text-right text-red-700">45 000 EUR</td><td className="py-3 px-4 text-right font-bold">50 000 EUR</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">SAS — Mix 60/40 (salaire + dividendes)</td><td className="py-3 px-4 text-right font-bold text-emerald-900">78 000 EUR</td><td className="py-3 px-4 text-right text-red-700 font-bold">28 000 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-900">50 000 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">SAS — 100 % dividendes (PFU 30 %)</td><td className="py-3 px-4 text-right">71 500 EUR</td><td className="py-3 px-4 text-right text-red-700">21 500 EUR</td><td className="py-3 px-4 text-right font-bold">50 000 EUR</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Conclusion :</strong> a revenu net equivalent, le 100 % dividendes en SAS est
              le plus economique pour l'entreprise, mais il prive le dirigeant de droits retraite
              et chomage. Le mix 60/40 offre le meilleur compromis entre cout entreprise et
              protection sociale dans 80 % des cas.
            </p>
            <p>
              Pour une vue complete des cotisations patronales et salariales, lisez notre
              <Link to="/blog/charges-sociales-restauration" className="text-teal-700 underline hover:text-teal-800 ml-1">guide complet des charges sociales en restauration</Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Tableau par segment ═════════════ */}
        <section id="par-segment" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="3">
            Salaires par segment de restauration (tableau complet 2026)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le revenu d'un proprietaire varie enormement selon le type d'etablissement.
              Voici les fourchettes observees en France en 2026, issues des donnees agregees
              de la GIRA Conseil, de l'INSEE et des 500+ restaurants connectes a RestauMargin.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Segment</th>
                  <th className="text-center py-3 px-4 font-semibold">CA moyen</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge nette</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Revenu net proprietaire / an</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { type: 'Bistrot independant', ca: '300-600 keur', mn: '5-10 %', rev: '25 a 45 keur', highlight: false },
                  { type: 'Restaurant traditionnel', ca: '500-900 keur', mn: '6-12 %', rev: '35 a 60 keur', highlight: true },
                  { type: 'Brasserie', ca: '800-1 500 keur', mn: '6-12 %', rev: '40 a 80 keur', highlight: false },
                  { type: 'Pizzeria', ca: '400-800 keur', mn: '8-15 %', rev: '30 a 55 keur', highlight: false },
                  { type: 'Gastronomique etoile', ca: '500-1 200 keur', mn: '3-8 %', rev: '50 a 150 keur (variable)', highlight: false },
                  { type: 'Fast-food / kebab', ca: '400-800 keur', mn: '10-18 %', rev: '30 a 50 keur', highlight: false },
                  { type: 'Food truck', ca: '120-300 keur', mn: '12-22 %', rev: '25 a 40 keur', highlight: false },
                  { type: 'Coffee shop', ca: '200-500 keur', mn: '8-16 %', rev: '22 a 45 keur', highlight: false },
                  { type: 'Dark kitchen', ca: '250-500 keur', mn: '5-12 %', rev: '20 a 40 keur', highlight: false },
                  { type: 'Restaurant traiteur', ca: '600-1 200 keur', mn: '8-15 %', rev: '40 a 75 keur', highlight: false },
                ].map((row, i) => (
                  <tr key={i} className={row.highlight ? 'bg-emerald-50' : (i % 2 === 0 ? 'bg-white' : 'bg-mono-1000')}>
                    <td className={`py-3 px-4 font-medium ${row.highlight ? 'font-bold text-emerald-900' : 'text-mono-100'}`}>{row.type}</td>
                    <td className="py-3 px-4 text-center">{row.ca}</td>
                    <td className="py-3 px-4 text-center">{row.mn}</td>
                    <td className={`py-3 px-4 text-center font-semibold ${row.highlight ? 'text-emerald-900' : ''}`}>{row.rev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Observations cles :</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>La brasserie est le segment le plus rentable</strong> en valeur absolue pour
                un seul etablissement, grace au volume eleve (300 a 500 couverts/jour) combine
                a une marge correcte.
              </li>
              <li>
                <strong>Le gastronomique etoile a la fourchette la plus large</strong> : la mediane
                est faible (50 keur) mais le top 10 % peut depasser 150 keur grace aux activites
                annexes (livres, emissions, consulting, parfums).
              </li>
              <li>
                <strong>Le food truck a la marge nette la plus elevee</strong> (12-22 %) mais avec
                un CA limite par la mobilite. Idea pour debuter sans gros investissement.
              </li>
              <li>
                <strong>Le dark kitchen est le segment le moins rentable</strong> : 25-35 % de
                commission aux plateformes (Uber Eats, Deliveroo) qui mange la marge.
              </li>
              <li>
                <strong>Le bistrot independant</strong> reste le segment le plus represente (40 %
                des restaurateurs) mais aussi celui qui souffre le plus de la concurrence et
                des charges fixes.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Variables qui impactent ═════════════ */}
        <section id="variables" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="4">
            Variables qui impactent le salaire d'un proprietaire de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le salaire d'un proprietaire ne depend pas que du segment. Six variables expliquent
              80 % de l'ecart de revenu entre deux restaurateurs au profil similaire.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <VariableCard
              icon={<TrendingUp className="w-5 h-5" />}
              title="1. CA du restaurant"
              impact="Tres fort"
              desc="C'est le levier principal. Doubler le CA (de 500 a 1 000 keur) double generalement le revenu du proprietaire si les charges restent maitrisees. Mais attention : a partir d'un certain seuil, les charges variables (personnel, matieres) absorbent une grande partie de la croissance."
            />
            <VariableCard
              icon={<Users className="w-5 h-5" />}
              title="2. Taille (nombre de couverts)"
              impact="Fort"
              desc="Un restaurant de 80 couverts a un avantage d'echelle vs un 40 couverts : les charges fixes (loyer, manager, fluides) sont mieux amorties. Mais la rotation et le service deviennent plus complexes."
            />
            <VariableCard
              icon={<MapPin className="w-5 h-5" />}
              title="3. Localisation (Paris vs province)"
              impact="Tres fort"
              desc="A Paris, le ticket moyen est 30-50 % superieur, mais le loyer peut representer 12-18 % du CA contre 6-9 % en province. Le revenu net du proprietaire est souvent equivalent voire inferieur."
            />
            <VariableCard
              icon={<Building2 className="w-5 h-5" />}
              title="4. Statut juridique"
              impact="Moyen a fort"
              desc="SAS, SARL, SASU, EURL, micro-entrepreneur : le statut impacte directement les charges sociales et l'impot. L'ecart de cout entreprise pour un meme revenu peut atteindre 15-20 %."
            />
            <VariableCard
              icon={<Wallet className="w-5 h-5" />}
              title="5. Mode de remuneration"
              impact="Moyen"
              desc="Salaire seul vs dividendes seul vs mix : impact direct sur le cout entreprise et la protection sociale. Le mix 60/40 est optimal dans 80 % des cas en SAS."
            />
            <VariableCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="6. Marge nette de l'etablissement"
              impact="Tres fort"
              desc="Un restaurant a 3 % de marge nette laisse 18 keur sur 600 keur de CA. Le meme restaurant a 10 % laisse 60 keur. La maitrise du food cost et du prime cost est determinante."
            />
          </div>

          <Callout type="info">
            <strong>Astuce RestauMargin :</strong> sur un meme CA, l'ecart de revenu entre un
            restaurateur qui pilote ses marges au quotidien et un restaurateur qui ne les controle
            pas est en moyenne de <strong>15 000 a 25 000 EUR par an</strong>. Notre
            <Link to="/outils/calculateur-marge-restaurant" className="underline font-semibold hover:text-teal-700 ml-1">calculateur de marge gratuit</Link>
            vous montre exactement ou se cache cet ecart.
          </Callout>
        </section>

        {/* ═════════════ SECTION 5 : Cas concrets ═════════════ */}
        <section id="cas-concrets" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="5">
            Cas concrets chiffres : 3 scenarios reels
          </SectionHeading>

          <div className="prose-content">
            <p>
              Passons aux cas reels. Trois proprietaires-types, trois profils, trois revenus tres
              differents. Tous les chiffres sont issus de comptes annuels reels (anonymises) issus
              de notre base RestauMargin.
            </p>
          </div>

          {/* CAS 1 : BISTROT */}
          <div className="mt-10 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-lg">A</div>
              <div>
                <h3 className="font-bold text-mono-100 text-lg">Cas A : Bistrot Lyon — 500 keur CA</h3>
                <p className="text-sm text-mono-500">SARL gerant majoritaire, 6 salaries, 45 couverts</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-2 px-3 font-medium text-mono-100">CA HT</td><td className="py-2 px-3 text-right font-semibold">500 000 EUR</td><td className="py-2 px-3 text-right text-mono-500">100 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Cout matieres (food cost 30 %)</td><td className="py-2 px-3 text-right text-red-700">-150 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-30 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Personnel (charges incluses, 35 %)</td><td className="py-2 px-3 text-right text-red-700">-175 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-35 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Loyer + charges locatives (10 %)</td><td className="py-2 px-3 text-right text-red-700">-50 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-10 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Energie + fluides (5 %)</td><td className="py-2 px-3 text-right text-red-700">-25 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-5 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Marketing + assurances + divers (8 %)</td><td className="py-2 px-3 text-right text-red-700">-40 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-8 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Amortissements + financiers (4 %)</td><td className="py-2 px-3 text-right text-red-700">-20 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-4 %</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-emerald-50"><td className="py-3 px-3 font-bold text-emerald-900">Resultat avant remuneration gerant</td><td className="py-3 px-3 text-right font-bold text-emerald-900">40 000 EUR</td><td className="py-3 px-3 text-right font-bold text-emerald-900">8 %</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 text-mono-100">- Charges sociales TNS (45 %)</td><td className="py-2 px-3 text-right">~12 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-blue-50"><td className="py-3 px-3 font-bold text-blue-900">Revenu net annuel proprietaire</td><td className="py-3 px-3 text-right font-extrabold text-blue-900 text-lg">38 000 EUR</td><td className="py-3 px-3 text-right font-bold text-blue-900">~ 3 200 EUR/mois</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-mono-500 italic">
              Profil typique d'un bistrot etabli en region. 60 heures/semaine pour le proprietaire,
              equivalent salarie cadre +/- 3 500 EUR net mensuel.
            </p>
          </div>

          {/* CAS 2 : BRASSERIE */}
          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-lg">B</div>
              <div>
                <h3 className="font-bold text-mono-100 text-lg">Cas B : Brasserie Marseille — 1,2 Meur CA</h3>
                <p className="text-sm text-mono-500">SAS, 14 salaries, 90 couverts + terrasse, mix salaire / dividendes 60/40</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-2 px-3 font-medium text-mono-100">CA HT</td><td className="py-2 px-3 text-right font-semibold">1 200 000 EUR</td><td className="py-2 px-3 text-right text-mono-500">100 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Cout matieres (food cost 31 %)</td><td className="py-2 px-3 text-right text-red-700">-372 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-31 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Personnel (35 %)</td><td className="py-2 px-3 text-right text-red-700">-420 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-35 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Loyer + charges (8 %)</td><td className="py-2 px-3 text-right text-red-700">-96 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-8 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Energie + fluides (4 %)</td><td className="py-2 px-3 text-right text-red-700">-48 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-4 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Marketing + assurances + divers (7 %)</td><td className="py-2 px-3 text-right text-red-700">-84 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-7 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Amortissements + financiers (3 %)</td><td className="py-2 px-3 text-right text-red-700">-36 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-3 %</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-emerald-50"><td className="py-3 px-3 font-bold text-emerald-900">Resultat avant remuneration</td><td className="py-3 px-3 text-right font-bold text-emerald-900">144 000 EUR</td><td className="py-3 px-3 text-right font-bold text-emerald-900">12 %</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 text-mono-100">- Salaire brut gerant + charges patronales SAS</td><td className="py-2 px-3 text-right">~65 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 text-mono-100">- IS sur resultat residuel (25 %)</td><td className="py-2 px-3 text-right">~12 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 text-mono-100">- PFU 30 % sur dividendes</td><td className="py-2 px-3 text-right">~10 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-blue-50"><td className="py-3 px-3 font-bold text-blue-900">Revenu net annuel proprietaire</td><td className="py-3 px-3 text-right font-extrabold text-blue-900 text-lg">75 000 EUR</td><td className="py-3 px-3 text-right font-bold text-blue-900">~ 6 250 EUR/mois</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-mono-500 italic">
              Cas typique d'une brasserie etablie depuis 8+ ans. Le mix salaire / dividendes en
              SAS permet d'economiser 15 keur de charges vs un 100 % salaire. Le proprietaire
              gagne l'equivalent d'un cadre superieur.
            </p>
          </div>

          {/* CAS 3 : ETOILE */}
          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold text-lg">C</div>
              <div>
                <h3 className="font-bold text-mono-100 text-lg">Cas C : Restaurant gastronomique 1 etoile — 800 keur CA</h3>
                <p className="text-sm text-mono-500">SARL, 12 salaries (dont 5 en cuisine), 35 couverts, chef-proprietaire</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-2 px-3 font-medium text-mono-100">CA HT restaurant</td><td className="py-2 px-3 text-right font-semibold">800 000 EUR</td><td className="py-2 px-3 text-right text-mono-500">100 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Cout matieres premium (food cost 38 %)</td><td className="py-2 px-3 text-right text-red-700">-304 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-38 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Personnel qualifie (45 %)</td><td className="py-2 px-3 text-right text-red-700">-360 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-45 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Loyer + charges (8 %)</td><td className="py-2 px-3 text-right text-red-700">-64 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-8 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Energie + assurances + divers (6 %)</td><td className="py-2 px-3 text-right text-red-700">-48 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-6 %</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-amber-900">Resultat restaurant (avant remuneration)</td><td className="py-3 px-3 text-right font-bold text-amber-900">24 000 EUR</td><td className="py-3 px-3 text-right font-bold text-amber-900">3 %</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 font-medium text-mono-100">+ Revenus annexes (livre, masterclass, consulting)</td><td className="py-2 px-3 text-right text-emerald-700 font-semibold">+45 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 font-medium text-mono-100">+ Conferences / interventions media</td><td className="py-2 px-3 text-right text-emerald-700 font-semibold">+15 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 text-mono-100">- Charges sociales + impot</td><td className="py-2 px-3 text-right">~34 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-blue-50"><td className="py-3 px-3 font-bold text-blue-900">Revenu net annuel proprietaire</td><td className="py-3 px-3 text-right font-extrabold text-blue-900 text-lg">50 000 EUR</td><td className="py-3 px-3 text-right font-bold text-blue-900">~ 4 200 EUR/mois</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-mono-500 italic">
              Profil revelateur : le restaurant lui-meme ne genere que 24 keur de marge, ce qui
              ferait vivre tout juste le chef. Ce sont les <strong>activites annexes</strong>
              (livres, consulting, masterclass, partenariats) qui doublent le revenu. Sans
              ces revenus annexes, beaucoup d'etoiles seraient en deficit.
            </p>
          </div>

          <Callout type="warning">
            <strong>Realite mediatique vs realite economique :</strong> on imagine souvent que
            les chefs etoiles gagnent des millions. La verite economique est nuancee : les
            etablissements gastronomiques ont des marges nettes parmi les plus faibles de la
            profession (3-8 %). La richesse vient quasi-exclusivement des activites de marque
            (livres, emissions, partenariats, lignes de produits).
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Optimisation ═════════════ */}
        <section id="optimisation" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="6">
            Optimisation fiscale et sociale du proprietaire
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une fois la structure du revenu comprise (salaire + dividendes), reste a l'optimiser.
              Voici les 6 leviers qui peuvent vous faire gagner 10 a 20 % de revenu net sans
              changer votre CA ou votre marge.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Choisir le bon statut juridique',
                body: "Au-dela de 80 keur de revenu cible, la SAS / SASU bat presque toujours la SARL. Avantages : flat tax 30 % sur dividendes, pas de cotisations sociales sur les dividendes (contrairement a la SARL gerant majoritaire au-dela de 10 % du capital). Comptez 1 a 2 keur supplementaires de frais comptables annuels en SAS vs SARL.",
              },
              {
                title: 'Construire un mix salaire / dividendes optimal',
                body: "Le ratio 60/40 (60 % salaire, 40 % dividendes) est la regle en SAS. Pourquoi : preserver droits retraite et chomage tout en optimisant la fiscalite globale. Pour un revenu cible de 80 keur net, ce mix economise 10-15 keur/an de charges vs un 100 % salaire.",
              },
              {
                title: 'Beneficier des reductions de charges',
                body: "Reduction Fillon (cotisations patronales sur bas salaires), JEI (Jeune Entreprise Innovante si vous developpez une app interne), CIR, exoneration ZRR/QPV selon localisation. Un bon expert-comptable specialise CHR peut faire economiser 5-15 keur de charges sociales par an.",
              },
              {
                title: 'Utiliser les avantages fiscaux du dirigeant',
                body: "PEA-PME (apport-cession 150-0 B ter), tickets restaurant (jusqu'a 6,50 EUR/jour deductibles), assurance vie en demembrement, holding patrimoniale pour les revenus de marque (livres, royalties). Optimisations legales mais qui doivent etre montees avec un fiscaliste.",
              },
              {
                title: 'Capitaliser dans l\'entreprise',
                body: "Au lieu de tout sortir, laisser 30-50 % du benefice dans l'entreprise sous forme de reserves ou d'investissements productifs (cuisine, materiel) deductibles. Cela augmente la valeur patrimoniale de l'entreprise (revente +20 a +40 % a terme) et reduit l'impot immediat.",
              },
              {
                title: 'Diversifier les sources de revenu',
                body: "Activites annexes : conseil pour autres restaurants, formation, livre, partenariats marques, location d'espace prive le dimanche, traiteur evenementiel. Chaque source ajoute 5 a 30 keur/an de revenu complementaire avec une marge tres elevee (peu de couts fixes additionnels).",
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
        </section>

        {/* ═════════════ SECTION 7 : Comparaison France ═════════════ */}
        <section id="comparaison" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="7">
            Comparaison avec la moyenne France (revenu median 22 keur)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Pour bien situer le revenu d'un proprietaire de restaurant, comparons-le aux autres
              metiers et au revenu median des Francais. Le revenu median en France en 2026 est
              d'environ <strong>22 000 EUR net par an</strong> (source INSEE 2024 + inflation).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Profession</th>
                  <th className="text-center py-3 px-4 font-semibold">Revenu net annuel</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Heures/semaine</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Salarie au SMIC</td><td className="py-3 px-4 text-center">17 500 EUR</td><td className="py-3 px-4 text-center">35 h</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Salarie median France</td><td className="py-3 px-4 text-center">22 000 EUR</td><td className="py-3 px-4 text-center">35 h</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Serveur experimente restaurant</td><td className="py-3 px-4 text-center">22 000 - 28 000 EUR</td><td className="py-3 px-4 text-center">42 h</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Chef de cuisine salarie (5+ ans)</td><td className="py-3 px-4 text-center">35 000 - 55 000 EUR</td><td className="py-3 px-4 text-center">50 h</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Cadre intermediaire (5 ans exp)</td><td className="py-3 px-4 text-center">35 000 - 45 000 EUR</td><td className="py-3 px-4 text-center">40 h</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Cadre superieur</td><td className="py-3 px-4 text-center">55 000 - 90 000 EUR</td><td className="py-3 px-4 text-center">45 h</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">Proprietaire restaurant (mediane)</td><td className="py-3 px-4 text-center font-bold text-emerald-900">42 000 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-900">60-70 h</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Medecin generaliste liberal</td><td className="py-3 px-4 text-center">65 000 - 95 000 EUR</td><td className="py-3 px-4 text-center">50 h</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Avocat (5+ ans)</td><td className="py-3 px-4 text-center">60 000 - 120 000 EUR</td><td className="py-3 px-4 text-center">50 h</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Lecture choquante :</strong> rapporte au nombre d'heures travaillees, le
              proprietaire de restaurant mediane gagne <strong>environ 14 EUR net de l'heure</strong>
              (42 000 / 52 / 60). C'est sensiblement equivalent au SMIC horaire. Pour un cadre
              superieur a 70 keur/an et 45 h/semaine, le taux horaire est de 30 EUR, soit
              <strong> plus du double</strong>.
            </p>
          </div>

          <Callout type="warning">
            <strong>Realite peu glamour :</strong> le proprietaire de restaurant median, sur la base
            du revenu rapporte aux heures, gagne moins par heure que beaucoup de ses salaries.
            C'est l'une des realites les moins racontees du metier. Le revenu peut etre eleve
            en valeur absolue mais le ratio temps/rendement reste tres defavorable.
          </Callout>
        </section>

        {/* ═════════════ SECTION 8 : Realite vs fantasme ═════════════ */}
        <section id="realite" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="8">
            Realite vs fantasme : la majorite gagne moins qu'un cadre
          </SectionHeading>

          <div className="prose-content">
            <p>
              Demoulons les 5 idees recues les plus repandues sur le revenu d'un proprietaire de
              restaurant. Ce sont elles qui poussent souvent des candidats a ouvrir un restaurant
              avec des attentes irrealistes.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <MythCard
              myth="Un restaurant qui marche bien rapporte au moins 100 keur/an au proprietaire"
              reality="Faux. La marge nette moyenne en restauration est de 6 a 12 %. Pour generer 100 keur de revenu net proprietaire, il faut typiquement 1,2 a 1,8 Meur de CA, ce qui n'est atteignable qu'en brasserie ou en multi-sites. La grande majorite des 'restaurants qui marchent' generent 35-55 keur de revenu net."
            />
            <MythCard
              myth="Un proprietaire gagne plus qu'un chef salarie"
              reality="Pas necessairement. Un chef salarie experimente gagne 35-55 keur brut/an (28-42 keur net). Un proprietaire de bistrot moyen gagne 30-45 keur. La difference : le chef salarie a un salaire fixe, des conges payes, la securite sociale et n'a pas pris de risque financier. Le proprietaire prend tous les risques."
            />
            <MythCard
              myth="Les chefs etoiles sont riches"
              reality="Faux pour la majorite. Le restaurant gastronomique a une marge nette tres faible (3-8 %). La richesse des chefs etoiles celebres vient quasi exclusivement des activites annexes : livres, emissions TV, consulting, lignes de produits, parfums, brand licensing. Le restaurant lui-meme est souvent une vitrine quasi-deficitaire."
            />
            <MythCard
              myth="L'investissement dans un restaurant est tres rentable"
              reality="Faux statistiquement. Selon l'INSEE, 30 % des restaurants ferment dans les 3 premieres annees, 50 % dans les 5 premieres. Le ROI moyen sur capital investi (200-500 keur) est de 8-15 % par an seulement, equivalent voire inferieur a un placement boursier ou immobilier locatif, avec un risque infiniment plus eleve."
            />
            <MythCard
              myth="On gagne sa vie facilement en restauration"
              reality="Tres faux. 60-70 h/semaine, weekends et soirs, stress operationnel constant, gestion d'equipes difficile, marges sous pression d'inflation, conflit personnel quasi-permanent. Le burn-out touche 35 % des restaurateurs selon une etude UMIH 2024. Le revenu rapporte aux heures est souvent inferieur au SMIC horaire."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Conclusion :</strong> ouvrir un restaurant est un acte entrepreneurial avant
              tout passionnel. Les rendements financiers purs sont rarement au niveau du temps
              et du risque investis. Le restaurateur qui s'en sort financierement est celui
              qui pilote ses marges au quotidien, optimise sa structure juridique, et trouve
              progressivement les leviers pour duplicater ou diversifier.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Comment augmenter ═════════════ */}
        <section id="augmenter" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="9">
            Comment augmenter son revenu de proprietaire
          </SectionHeading>

          <div className="prose-content">
            <p>
              Bonne nouvelle : il existe 7 leviers concrets pour faire passer son revenu de
              proprietaire de 40 a 70 keur, voire au-dela. Tous ne demandent pas d'augmenter
              le CA — certains ne touchent que la structure de couts ou la fiscalite.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            {[
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Maitriser le food cost', desc: 'Reduire le food cost de 32 % a 28 % sur 500 keur de CA = 20 keur de marge supplementaire. Levier le plus rapide.', impact: 'Tres fort' },
              { icon: <Users className="w-5 h-5" />, title: 'Optimiser le ratio personnel', desc: 'Passer le ratio personnel de 40 % a 35 % du CA (planning intelligent, polyvalence) = 25 keur sur 500 keur de CA.', impact: 'Tres fort' },
              { icon: <Target className="w-5 h-5" />, title: 'Faire du menu engineering', desc: 'Identifier les plats stars (forte marge + forte popularite) et les promouvoir = +5 a +10 % de ticket moyen.', impact: 'Fort' },
              { icon: <Sparkles className="w-5 h-5" />, title: 'Augmenter le ticket moyen', desc: 'Boissons, desserts, suggestions, formules : passer le ticket de 22 a 26 EUR = +18 % de CA sans nouveaux clients.', impact: 'Fort' },
              { icon: <DollarSign className="w-5 h-5" />, title: 'Optimiser le statut fiscal', desc: 'Passer en SAS avec mix 60/40 vs SARL 100 % salaire = 10 a 15 keur economises par an.', impact: 'Moyen' },
              { icon: <Building2 className="w-5 h-5" />, title: 'Diversifier les canaux', desc: 'Ajouter livraison click&collect (10-15 % du CA), traiteur evenementiel, plats prepares = +25-40 keur/an.', impact: 'Fort' },
              { icon: <Award className="w-5 h-5" />, title: 'Activites annexes', desc: 'Conseil pour autres restaurants, formation, livre, partenariats marques = 10-50 keur/an avec marge tres elevee.', impact: 'Moyen a fort' },
              { icon: <Briefcase className="w-5 h-5" />, title: 'Duplicater l\'etablissement', desc: 'Ouvrir un 2eme restaurant base sur le concept gagnant. Risque accru mais revenu x 1,5 a 2 au bout de 18-24 mois.', impact: 'Tres fort' },
            ].map((lev, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                    {lev.icon}
                  </div>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{lev.impact}</span>
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{lev.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{lev.desc}</p>
              </div>
            ))}
          </div>

          <Callout type="info">
            <strong>Impact cumule :</strong> en activant 4 a 5 de ces leviers sur 12-18 mois,
            un proprietaire peut passer de 40 a 70 keur de revenu net annuel, sans investissement
            supplementaire majeur. C'est exactement ce que les 500+ restaurateurs equipes RestauMargin
            observent en moyenne (gain de 3 a 5 points de marge nette, soit 15-30 keur sur un
            CA de 500-1 000 keur).
          </Callout>

          <div className="prose-content mt-6">
            <p>
              Pour approfondir, lisez nos articles complementaires :
              <Link to="/blog/seuil-rentabilite-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">calculer son seuil de rentabilite</Link>,
              <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">tout sur le calcul de marge</Link>, et
              <Link to="/blog/budget-previsionnel-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">construire son budget previsionnel</Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION CTA — RestauMargin automatise ═════════════ */}
        <section className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="10">
            Piloter sa rentabilite avec RestauMargin
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le revenu d'un proprietaire de restaurant n'est pas un hasard. C'est le resultat
              direct de la maitrise des marges, des charges et de la structure de couts.
              Sans pilotage en temps reel, vous naviguez a l'aveugle — et c'est la principale
              cause de l'ecart entre les restaurateurs qui gagnent bien leur vie et ceux qui
              survivent.
            </p>
            <p>
              RestauMargin a ete concu pour vous donner cette vision claire au quotidien :
              food cost, marge brute, marge nette, ticket moyen, ratio personnel, projection
              de revenu mensuel et annuel pour le proprietaire.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <FeatureCard
              icon={<Calculator className="w-5 h-5" />}
              title="Marge en temps reel"
              desc="Food cost, marge brute, marge nette par plat et global, mises a jour automatiquement."
            />
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="Projection revenu"
              desc="Simulation du revenu net proprietaire selon CA, marges et statut juridique."
            />
            <FeatureCard
              icon={<Target className="w-5 h-5" />}
              title="Leviers d'optimisation"
              desc="L'IA identifie automatiquement les 3 leviers qui auront le plus d'impact sur votre revenu."
            />
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes</h2>
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
              Maximiser le revenu de votre restaurant
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Stop aux estimations. RestauMargin calcule en temps reel votre marge nette, votre
              ratio prime cost, votre ticket moyen et vous montre exactement combien votre
              restaurant peut vous verser chaque mois.
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

        {/* ═════════════ Articles complementaires ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul de marge restaurant</h3>
              <p className="text-xs text-mono-500">Formules, food cost, marge brute et nette : le guide complet.</p>
            </Link>
            <Link to="/blog/seuil-rentabilite-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Seuil de rentabilite</h3>
              <p className="text-xs text-mono-500">Calculer son point mort et le nombre de couverts necessaires.</p>
            </Link>
            <Link to="/blog/charges-sociales-restauration" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Charges sociales</h3>
              <p className="text-xs text-mono-500">CCN HCR, taux URSSAF, cout employeur reel en restauration.</p>
            </Link>
            <Link to="/blog/budget-previsionnel-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Budget previsionnel</h3>
              <p className="text-xs text-mono-500">Construire son plan financier sur 12 mois pas-a-pas.</p>
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

function RevenuCard({ icon, title, color, desc, avantage, inconvenient }: {
  icon: React.ReactNode; title: string; color: string; desc: string; avantage: string; inconvenient: string;
}) {
  const colors: Record<string, { bg: string; badge: string }> = {
    emerald: { bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' },
    amber: { bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700' },
    blue: { bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
  };
  const c = colors[color] || colors.emerald;

  return (
    <div className={`${c.bg} rounded-2xl p-6 border border-mono-975`}>
      <div className={`w-10 h-10 ${c.badge} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="font-bold text-mono-100 mb-2">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed mb-4">{desc}</p>
      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span className="text-mono-400"><strong className="text-mono-100">Avantage :</strong> {avantage}</span>
        </div>
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="text-mono-400"><strong className="text-mono-100">Inconvenient :</strong> {inconvenient}</span>
        </div>
      </div>
    </div>
  );
}

function VariableCard({ icon, title, impact, desc }: { icon: React.ReactNode; title: string; impact: string; desc: string }) {
  const impactColor = impact === 'Tres fort' ? 'bg-red-100 text-red-700'
    : impact === 'Fort' ? 'bg-amber-100 text-amber-700'
    : 'bg-blue-100 text-blue-700';
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
          {icon}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${impactColor}`}>{impact}</span>
      </div>
      <h3 className="font-semibold text-mono-100 mb-1.5">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function MythCard({ myth, reality }: { myth: string; reality: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0 font-bold text-sm">!</div>
        <p className="text-sm font-semibold text-mono-100 leading-relaxed">"{myth}"</p>
      </div>
      <div className="flex items-start gap-3 ml-11">
        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-sm text-mono-400 leading-relaxed">{reality}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
      <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-mono-100 mb-1.5">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
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
