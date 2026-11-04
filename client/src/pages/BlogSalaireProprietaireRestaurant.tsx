import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Target, BookOpen, Lightbulb, Users, Award, Sparkles, Briefcase, Wallet, Building2, MapPin, Zap } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Combien gagne un proprietaire de restaurant en 2026 ?"
   Cible question PAA Google : "Combien gagne un proprietaire de restaurant ?"
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Un propriétaire de restaurant peut-il devenir riche ?',
    answer: "Statistiquement, peu de propriétaires de restaurant deviennent riches en se contentant d'un seul établissement. La voie vers la fortune passe par la duplication : ouvrir 3, 5 ou 10 restaurants permet d'atteindre des revenus de 150 à 500 keur/an. Les chefs étoilés avec activité annexe (livres, émissions TV, conseil) peuvent également gagner plus de 200 keur. Mais le restaurateur lambda avec un seul établissement gagne en moyenne 30 à 60 keur net par an.",
  },
  {
    question: 'Vaut-il mieux se verser un salaire ou des dividendes en restaurant ?',
    answer: "Le mix optimal en SARL ou SAS en 2026 est généralement 60% salaire + 40% dividendes pour bien protéger sa retraite et son chômage tout en optimisant l'impôt. En SARL gérant majoritaire, les dividendes au-delà de 10% du capital social sont soumis aux charges sociales (~45%), ce qui annule l'avantage. En SAS, les dividendes restent soumis à la flat tax de 30% (PFU) ce qui est souvent plus avantageux. Faites toujours simuler par votre expert-comptable.",
  },
  {
    question: 'Combien faut-il de CA pour qu\'un propriétaire de restaurant gagne 50 000 EUR par an ?',
    answer: "Pour qu'un propriétaire gagne 50 keur net par an (après impôts et charges), il faut typiquement un CA HT entre 600 et 900 keur, avec une marge nette de 8 à 10% et un statut juridique optimisé. Le calcul : 800 keur CA x 10% marge nette = 80 keur de résultat avant rémunération. Après salaire + charges sociales gérant + impôt sociétés, il reste environ 50 keur net dans la poche du propriétaire.",
  },
  {
    question: 'Quel est le statut le plus rentable pour un propriétaire de restaurant ?',
    answer: "La SAS / SASU est généralement le statut le plus rentable pour un propriétaire de restaurant en 2026, surtout au-delà de 100 keur de revenu annuel. Avantages : flat tax 30% sur dividendes, statut assimilé salarié (meilleure protection sociale), pas de cotisations sur dividendes. Inconvénient : pas de retraite cumulée sur dividendes. La SARL reste intéressante pour les petits CA (sous 150 keur) avec gérant majoritaire (cotisations TNS moins lourdes que SAS).",
  },
  {
    question: 'Combien gagne un propriétaire de restaurant la première année ?',
    answer: "La première année est la plus difficile financièrement. La majorité des propriétaires ne se versent rien ou se versent un SMIC (1 400 EUR net/mois) pour préserver la trésorerie de l'établissement. Le break-even arrive généralement entre 18 et 36 mois. Très souvent, le propriétaire vit sur ses économies personnelles ou conserve un emploi salarié à temps partiel pendant les 12-18 premiers mois.",
  },
  {
    question: 'Un propriétaire de restaurant gagne-t-il plus qu\'un chef salarié ?',
    answer: "Pas nécessairement. Un chef salarié expérimenté dans un restaurant traditionnel gagne entre 35 et 55 keur brut/an (28-42 keur net). Un propriétaire de bistrot indépendant gagne en moyenne 30 à 45 keur net. La différence : le propriétaire prend tous les risques (financier, juridique, opérationnel) sans garantie de revenu, tandis que le chef salarié a un salaire fixe, des congés payés et la sécurité sociale. La voie propriétaire est plus rentable à long terme uniquement si vous arrivez à duplicater l'établissement.",
  },
  {
    question: 'Combien gagne un propriétaire de restaurant gastronomique étoilé ?',
    answer: "Le revenu d'un chef-propriétaire étoilé est extrêmement variable : de 60 keur à plus de 500 keur par an. Les fourchettes typiques : 1 étoile = 50 à 120 keur net/an, 2 étoiles = 100 à 250 keur, 3 étoiles = 150 à 500 keur (avec activités annexes). Mais attention : ces restaurants ont des marges nettes faibles (3-8%) et un risque financier élevé. Les revenus réels viennent souvent des activités annexes : livres, émissions TV, consulting, parfums, lignes de produits.",
  },
  {
    question: 'Comment augmenter son revenu en tant que propriétaire de restaurant ?',
    answer: "Cinq leviers principaux : 1) augmenter le ticket moyen via le menu engineering et les boissons (impact direct sur la marge), 2) réduire le food cost avec des fiches techniques et une rotation stocks optimisée, 3) développer des canaux annexes (livraison, plats préparés, traiteur, événementiel), 4) duplicater l'établissement (2ème restaurant = 2x le revenu), 5) optimiser le statut juridique et la répartition salaire / dividendes avec un bon expert-comptable. RestauMargin vous aide à piloter les leviers 1 et 2 au quotidien.",
  },
];

export default function BlogSalaireProprietaireRestaurant() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Combien gagne un propriétaire de restaurant en 2026 ? (chiffres réels)"
        description="Salaire moyen d'un propriétaire de restaurant en France 2026 : 30-80keur/an selon segment, taille, ville. Décomposition revenus, statut juridique (SARL/SAS), dividendes vs salaire, optimisation."
        path="/blog/salaire-proprietaire-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Salaire propriétaire restaurant', url: 'https://www.restaumargin.fr/blog/salaire-proprietaire-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Combien gagne un propriétaire de restaurant en 2026 ? Chiffres réels par segment',
            description: 'Salaire moyen d\'un propriétaire de restaurant en France 2026 : décomposition par segment, statut juridique, salaire vs dividendes, optimisation.',
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
      <PublicHeader />

      {/* ── Breadcrumbs visibles ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Salaire propriétaire restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Revenus"
        readTime="15 min"
        date="Mai 2026"
        title="Combien gagne un propriétaire de restaurant en 2026 ?"
        accentWord="propriétaire"
        subtitle="Chiffres réels, décomposition par segment (bistrot, brasserie, gastronomique, fast-food, food truck), comparaison salaire vs dividendes, statut juridique optimal et leviers d'optimisation. Toute la vérité sur le revenu réel d'un restaurateur en France."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* ── Encadre reponse rapide (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Réponse rapide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Combien gagne un propriétaire de restaurant en France en 2026 ?
          </h2>
          <p className="text-teal-50 text-base leading-relaxed">
            Un propriétaire de restaurant en France gagne en moyenne <strong className="text-white">entre 30 000 EUR et 60 000 EUR net par an en 2026</strong>, selon le segment et le CA. Un bistrot indépendant rapporte 25 à 45 keur/an au propriétaire, une brasserie 40 à 80 keur/an, et un restaurant gastronomique étoilé 50 à 150 keur/an (très variable). <strong className="text-white">40 % des restaurateurs gagnent moins qu'un salarié cadre.</strong>
          </p>
          <div className="mt-5 grid sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-teal-200 text-xs font-semibold uppercase tracking-wider">Min</div>
              <div className="text-white font-bold text-lg">25 keur/an</div>
              <div className="text-teal-100 text-xs">Bistrot débutant</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-teal-200 text-xs font-semibold uppercase tracking-wider">Médiane</div>
              <div className="text-white font-bold text-lg">42 keur/an</div>
              <div className="text-teal-100 text-xs">Tous segments</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-teal-200 text-xs font-semibold uppercase tracking-wider">Top 10%</div>
              <div className="text-white font-bold text-lg">80+ keur/an</div>
              <div className="text-teal-100 text-xs">Brasserie / étoilé</div>
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
              { href: '#moyenne', label: 'Combien gagne un propriétaire de restaurant en moyenne en France 2026 ?' },
              { href: '#salaire-vs-dividendes', label: 'Salaire vs Dividendes vs Revenus mixtes' },
              { href: '#par-segment', label: 'Salaires par segment de restauration (tableau complet)' },
              { href: '#variables', label: 'Variables qui impactent le salaire du propriétaire' },
              { href: '#cas-concrets', label: 'Exemples illustratifs chiffrés : bistrot, brasserie, étoilé' },
              { href: '#optimisation', label: 'Optimisation fiscale et sociale' },
              { href: '#comparaison', label: 'Comparaison avec la moyenne France (revenu médian 22 keur)' },
              { href: '#realite', label: 'Réalité vs fantasme : la majorité gagnent moins qu\'un cadre' },
              { href: '#augmenter', label: 'Comment augmenter son revenu de propriétaire' },
              { href: '#faq', label: 'Questions fréquentes (8 réponses)' },
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
            Combien gagne un propriétaire de restaurant en moyenne en France 2026 ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est l'une des questions les plus posées aux experts-comptables spécialisés CHR
              (cafés, hôtels, restaurants). La réponse honnête : <strong>c'est très variable</strong>.
              Selon les ordres de grandeur publiés (INSEE, SNRC), un propriétaire de restaurant en France
              gagne en moyenne <strong>entre 30 000 EUR et 60 000 EUR net par an en 2026</strong>.
            </p>
            <p>
              Mais ce chiffre cache des réalités très différentes selon le segment, le CA,
              la localisation et l'ouverture (débutant vs établi). Voici une distribution
              indicative :
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Tranche de revenu net annuel</th>
                  <th className="text-center py-3 px-4 font-semibold">Part des propriétaires</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Profil typique</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-red-700">Moins de 20 keur</td><td className="py-3 px-4 text-center font-bold">22 %</td><td className="py-3 px-4 text-center">Débutants, food truck, micro-bistrot</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-amber-700">20 à 35 keur</td><td className="py-3 px-4 text-center font-bold">28 %</td><td className="py-3 px-4 text-center">Bistrot, petit traditionnel</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">35 à 55 keur</td><td className="py-3 px-4 text-center font-bold">25 %</td><td className="py-3 px-4 text-center">Restaurant traditionnel établi</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-emerald-700">55 à 80 keur</td><td className="py-3 px-4 text-center font-bold">15 %</td><td className="py-3 px-4 text-center">Brasserie, pizzeria volume</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-emerald-700">80 à 150 keur</td><td className="py-3 px-4 text-center font-bold">8 %</td><td className="py-3 px-4 text-center">Étoile, brasserie premium, multi-sites</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">Plus de 150 keur</td><td className="py-3 px-4 text-center font-bold text-emerald-900">2 %</td><td className="py-3 px-4 text-center text-emerald-900">Chefs étoilés + activités annexes, chaînes</td></tr>
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Le saviez-vous ?</strong> La <strong>médiane</strong> du revenu net d'un
            propriétaire de restaurant en France 2026 se situe à environ <strong>42 000 EUR/an</strong>,
            soit l'équivalent de 3 500 EUR net mensuel. C'est sensiblement équivalent au salaire
            d'un cadre intermédiaire avec 5 ans d'expérience.
          </Callout>

          <div className="prose-content mt-6">
            <p>
              <strong>Attention :</strong> ces chiffres correspondent au <em>revenu net effectivement
              perçu</em> par le propriétaire (après charges sociales, impôts et reinvestissement
              dans l'entreprise). Le résultat comptable de l'entreprise peut être supérieur, mais
              une partie est souvent réinvestie (renouvellement du matériel, remboursement d'emprunt,
              constitution de trésorerie).
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
              Comprendre comment un propriétaire de restaurant est payé est essentiel. Contrairement
              à un salarié classique, le propriétaire dispose de plusieurs leviers de rémunération,
              chacun avec une fiscalité et un impact différent sur la trésorerie de l'entreprise.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            <RevenuCard
              icon={<Briefcase className="w-6 h-6" />}
              title="Salaire (rémunération de gérant)"
              color="emerald"
              desc="Versement mensuel fixe au gérant. Soumis à charges sociales (URSSAF + retraite + maladie) et impôt sur le revenu. Sécurisé mais charges lourdes (40-45 % de cotisations TNS ou 80 % en SAS)."
              avantage="Protection sociale, retraite, chômage"
              inconvenient="Charges sociales très élevées"
            />
            <RevenuCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Dividendes"
              color="blue"
              desc="Distribution du bénéfice après impôt sociétés (IS). Soumis à la flat tax 30 % (PFU) en SAS. En SARL gérant majoritaire : cotisations sociales au-delà de 10 % du capital."
              avantage="Flat tax 30 %, pas de cotisations en SAS"
              inconvenient="Pas de droits retraite ni chômage"
            />
            <RevenuCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Revenus mixtes (recommandé)"
              color="amber"
              desc="Combinaison salaire + dividendes pour optimiser fiscalité et protection sociale. Le mix 60/40 (60 % salaire, 40 % dividendes) est le plus fréquent en SAS au-delà de 50 keur de revenu annuel."
              avantage="Équilibre optimal entre protection et fiscalité"
              inconvenient="Nécessite un expert-comptable"
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Exemple chiffré : SARL gérant majoritaire vs SAS</h3>
            <p>
              Prenons un propriétaire qui souhaite se verser 50 000 EUR net dans la poche.
              Voici le coût entreprise selon le statut juridique :
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Configuration</th>
                  <th className="text-right py-3 px-4 font-semibold">Coût entreprise</th>
                  <th className="text-right py-3 px-4 font-semibold">Charges</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Net en poche</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">SARL — 100 % salaire (gérant majoritaire TNS)</td><td className="py-3 px-4 text-right">85 000 EUR</td><td className="py-3 px-4 text-right text-red-700">35 000 EUR</td><td className="py-3 px-4 text-right font-bold">50 000 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">SAS — 100 % salaire (assimilé salarié)</td><td className="py-3 px-4 text-right">95 000 EUR</td><td className="py-3 px-4 text-right text-red-700">45 000 EUR</td><td className="py-3 px-4 text-right font-bold">50 000 EUR</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">SAS — Mix 60/40 (salaire + dividendes)</td><td className="py-3 px-4 text-right font-bold text-emerald-900">78 000 EUR</td><td className="py-3 px-4 text-right text-red-700 font-bold">28 000 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-900">50 000 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">SAS — 100 % dividendes (PFU 30 %)</td><td className="py-3 px-4 text-right">71 500 EUR</td><td className="py-3 px-4 text-right text-red-700">21 500 EUR</td><td className="py-3 px-4 text-right font-bold">50 000 EUR</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Conclusion :</strong> à revenu net équivalent, le 100 % dividendes en SAS est
              le plus économique pour l'entreprise, mais il prive le dirigeant de droits retraite
              et chômage. Le mix 60/40 offre le meilleur compromis entre coût entreprise et
              protection sociale dans 80 % des cas.
            </p>
            <p>
              Pour une vue complète des cotisations patronales et salariales, lisez notre
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
              Le revenu d'un propriétaire varie énormément selon le type d'établissement.
              Voici des fourchettes indicatives pour la France en 2026, établies à partir des
              publications de la GIRA Conseil et de l'INSEE.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Segment</th>
                  <th className="text-center py-3 px-4 font-semibold">CA moyen</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge nette</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Revenu net propriétaire / an</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { type: 'Bistrot indépendant', ca: '300-600 keur', mn: '5-10 %', rev: '25 à 45 keur', highlight: false },
                  { type: 'Restaurant traditionnel', ca: '500-900 keur', mn: '6-12 %', rev: '35 à 60 keur', highlight: true },
                  { type: 'Brasserie', ca: '800-1 500 keur', mn: '6-12 %', rev: '40 à 80 keur', highlight: false },
                  { type: 'Pizzeria', ca: '400-800 keur', mn: '8-15 %', rev: '30 à 55 keur', highlight: false },
                  { type: 'Gastronomique étoilé', ca: '500-1 200 keur', mn: '3-8 %', rev: '50 à 150 keur (variable)', highlight: false },
                  { type: 'Fast-food / kebab', ca: '400-800 keur', mn: '10-18 %', rev: '30 à 50 keur', highlight: false },
                  { type: 'Food truck', ca: '120-300 keur', mn: '12-22 %', rev: '25 à 40 keur', highlight: false },
                  { type: 'Coffee shop', ca: '200-500 keur', mn: '8-16 %', rev: '22 à 45 keur', highlight: false },
                  { type: 'Dark kitchen', ca: '250-500 keur', mn: '5-12 %', rev: '20 à 40 keur', highlight: false },
                  { type: 'Restaurant traiteur', ca: '600-1 200 keur', mn: '8-15 %', rev: '40 à 75 keur', highlight: false },
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
              <strong>Observations clés :</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>La brasserie est le segment le plus rentable</strong> en valeur absolue pour
                un seul établissement, grâce au volume élevé (300 à 500 couverts/jour) combiné
                à une marge correcte.
              </li>
              <li>
                <strong>Le gastronomique étoilé a la fourchette la plus large</strong> : la médiane
                est faible (50 keur) mais le top 10 % peut dépasser 150 keur grâce aux activités
                annexes (livres, émissions, consulting, parfums).
              </li>
              <li>
                <strong>Le food truck a la marge nette la plus élevée</strong> (12-22 %) mais avec
                un CA limité par la mobilité. Idea pour débuter sans gros investissement.
              </li>
              <li>
                <strong>Le dark kitchen est le segment le moins rentable</strong> : 25-35 % de
                commission aux plateformes (Uber Eats, Deliveroo) qui mange la marge.
              </li>
              <li>
                <strong>Le bistrot indépendant</strong> reste le segment le plus représenté (40 %
                des restaurateurs) mais aussi celui qui souffre le plus de la concurrence et
                des charges fixes.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Variables qui impactent ═════════════ */}
        <section id="variables" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="4">
            Variables qui impactent le salaire d'un propriétaire de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le salaire d'un propriétaire ne dépend pas que du segment. Six variables expliquent
              80 % de l'écart de revenu entre deux restaurateurs au profil similaire.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <VariableCard
              icon={<TrendingUp className="w-5 h-5" />}
              title="1. CA du restaurant"
              impact="Très fort"
              desc="C'est le levier principal. Doubler le CA (de 500 à 1 000 keur) double généralement le revenu du propriétaire si les charges restent maîtrisées. Mais attention : à partir d'un certain seuil, les charges variables (personnel, matières) absorbent une grande partie de la croissance."
            />
            <VariableCard
              icon={<Users className="w-5 h-5" />}
              title="2. Taille (nombre de couverts)"
              impact="Fort"
              desc="Un restaurant de 80 couverts a un avantage d'échelle vs un 40 couverts : les charges fixes (loyer, manager, fluides) sont mieux amorties. Mais la rotation et le service deviennent plus complexes."
            />
            <VariableCard
              icon={<MapPin className="w-5 h-5" />}
              title="3. Localisation (Paris vs province)"
              impact="Très fort"
              desc="À Paris, le ticket moyen est 30-50 % supérieur, mais le loyer peut représenter 12-18 % du CA contre 6-9 % en province. Le revenu net du propriétaire est souvent équivalent voire inférieur."
            />
            <VariableCard
              icon={<Building2 className="w-5 h-5" />}
              title="4. Statut juridique"
              impact="Moyen à fort"
              desc="SAS, SARL, SASU, EURL, micro-entrepreneur : le statut impacte directement les charges sociales et l'impôt. L'écart de coût entreprise pour un même revenu peut atteindre 15-20 %."
            />
            <VariableCard
              icon={<Wallet className="w-5 h-5" />}
              title="5. Mode de rémunération"
              impact="Moyen"
              desc="Salaire seul vs dividendes seul vs mix : impact direct sur le coût entreprise et la protection sociale. Le mix 60/40 est optimal dans 80 % des cas en SAS."
            />
            <VariableCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="6. Marge nette de l'établissement"
              impact="Très fort"
              desc="Un restaurant à 3 % de marge nette laisse 18 keur sur 600 keur de CA. Le même restaurant à 10 % laisse 60 keur. La maîtrise du food cost et du prime cost est déterminante."
            />
          </div>

          <Callout type="info">
            <strong>Astuce RestauMargin :</strong> sur un même CA, l'écart de revenu entre un
            restaurateur qui pilote ses marges au quotidien et un restaurateur qui ne les contrôle
            pas peut représenter <strong>15 000 à 25 000 EUR par an</strong>. Notre
            <Link to="/outils/calculateur-marge-restaurant" className="underline font-semibold hover:text-teal-700 ml-1">calculateur de marge gratuit</Link>
            vous montre exactement où se cache cet écart.
          </Callout>
        </section>

        {/* ═════════════ SECTION 5 : Cas concrets ═════════════ */}
        <section id="cas-concrets" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="5">
            Exemples illustratifs chiffrés : 3 scénarios types
          </SectionHeading>

          <div className="prose-content">
            <p>
              Passons aux exemples. Trois propriétaires-types fictifs, trois profils, trois revenus très
              différents. Les chiffres sont construits à titre d'illustration, à partir des ordres de
              grandeur publics du secteur : ce ne sont pas des comptes d'établissements réels.
            </p>
          </div>

          {/* CAS 1 : BISTROT */}
          <div className="mt-10 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-lg">A</div>
              <div>
                <h3 className="font-bold text-mono-100 text-lg">Cas A : Bistrot en région — 500 keur CA</h3>
                <p className="text-sm text-mono-500">SARL gérant majoritaire, 6 salariés, 45 couverts</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-2 px-3 font-medium text-mono-100">CA HT</td><td className="py-2 px-3 text-right font-semibold">500 000 EUR</td><td className="py-2 px-3 text-right text-mono-500">100 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Coût matières (food cost 30 %)</td><td className="py-2 px-3 text-right text-red-700">-150 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-30 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Personnel (charges incluses, 35 %)</td><td className="py-2 px-3 text-right text-red-700">-175 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-35 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Loyer + charges locatives (10 %)</td><td className="py-2 px-3 text-right text-red-700">-50 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-10 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Énergie + fluides (5 %)</td><td className="py-2 px-3 text-right text-red-700">-25 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-5 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Marketing + assurances + divers (8 %)</td><td className="py-2 px-3 text-right text-red-700">-40 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-8 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Amortissements + financiers (4 %)</td><td className="py-2 px-3 text-right text-red-700">-20 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-4 %</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-emerald-50"><td className="py-3 px-3 font-bold text-emerald-900">Résultat avant rémunération gérant</td><td className="py-3 px-3 text-right font-bold text-emerald-900">40 000 EUR</td><td className="py-3 px-3 text-right font-bold text-emerald-900">8 %</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 text-mono-100">- Charges sociales TNS (45 %)</td><td className="py-2 px-3 text-right">~12 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-blue-50"><td className="py-3 px-3 font-bold text-blue-900">Revenu net annuel propriétaire</td><td className="py-3 px-3 text-right font-extrabold text-blue-900 text-lg">38 000 EUR</td><td className="py-3 px-3 text-right font-bold text-blue-900">~ 3 200 EUR/mois</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-mono-500 italic">
              Profil typique d'un bistrot établi en région. 60 heures/semaine pour le propriétaire,
              équivalent salarié cadre +/- 3 500 EUR net mensuel.
            </p>
          </div>

          {/* CAS 2 : BRASSERIE */}
          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-lg">B</div>
              <div>
                <h3 className="font-bold text-mono-100 text-lg">Cas B : Brasserie urbaine — 1,2 Meur CA</h3>
                <p className="text-sm text-mono-500">SAS, 14 salariés, 90 couverts + terrasse, mix salaire / dividendes 60/40</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-2 px-3 font-medium text-mono-100">CA HT</td><td className="py-2 px-3 text-right font-semibold">1 200 000 EUR</td><td className="py-2 px-3 text-right text-mono-500">100 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Coût matières (food cost 31 %)</td><td className="py-2 px-3 text-right text-red-700">-372 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-31 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Personnel (35 %)</td><td className="py-2 px-3 text-right text-red-700">-420 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-35 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Loyer + charges (8 %)</td><td className="py-2 px-3 text-right text-red-700">-96 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-8 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Énergie + fluides (4 %)</td><td className="py-2 px-3 text-right text-red-700">-48 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-4 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Marketing + assurances + divers (7 %)</td><td className="py-2 px-3 text-right text-red-700">-84 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-7 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Amortissements + financiers (3 %)</td><td className="py-2 px-3 text-right text-red-700">-36 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-3 %</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-emerald-50"><td className="py-3 px-3 font-bold text-emerald-900">Résultat avant rémunération</td><td className="py-3 px-3 text-right font-bold text-emerald-900">144 000 EUR</td><td className="py-3 px-3 text-right font-bold text-emerald-900">12 %</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 text-mono-100">- Salaire brut gérant + charges patronales SAS</td><td className="py-2 px-3 text-right">~65 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 text-mono-100">- IS sur résultat résiduel (25 %)</td><td className="py-2 px-3 text-right">~12 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 text-mono-100">- PFU 30 % sur dividendes</td><td className="py-2 px-3 text-right">~10 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-blue-50"><td className="py-3 px-3 font-bold text-blue-900">Revenu net annuel propriétaire</td><td className="py-3 px-3 text-right font-extrabold text-blue-900 text-lg">75 000 EUR</td><td className="py-3 px-3 text-right font-bold text-blue-900">~ 6 250 EUR/mois</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-mono-500 italic">
              Cas typique d'une brasserie établie depuis 8+ ans. Le mix salaire / dividendes en
              SAS permet d'économiser 15 keur de charges vs un 100 % salaire. Le propriétaire
              gagne l'équivalent d'un cadre supérieur.
            </p>
          </div>

          {/* CAS 3 : ETOILE */}
          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold text-lg">C</div>
              <div>
                <h3 className="font-bold text-mono-100 text-lg">Cas C : Restaurant gastronomique 1 étoile — 800 keur CA</h3>
                <p className="text-sm text-mono-500">SARL, 12 salariés (dont 5 en cuisine), 35 couverts, chef-propriétaire</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-2 px-3 font-medium text-mono-100">CA HT restaurant</td><td className="py-2 px-3 text-right font-semibold">800 000 EUR</td><td className="py-2 px-3 text-right text-mono-500">100 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Coût matières premium (food cost 38 %)</td><td className="py-2 px-3 text-right text-red-700">-304 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-38 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Personnel qualifié (45 %)</td><td className="py-2 px-3 text-right text-red-700">-360 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-45 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Loyer + charges (8 %)</td><td className="py-2 px-3 text-right text-red-700">-64 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-8 %</td></tr>
                  <tr className="bg-white"><td className="py-2 px-3 text-red-700">Énergie + assurances + divers (6 %)</td><td className="py-2 px-3 text-right text-red-700">-48 000 EUR</td><td className="py-2 px-3 text-right text-red-700">-6 %</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-amber-900">Résultat restaurant (avant rémunération)</td><td className="py-3 px-3 text-right font-bold text-amber-900">24 000 EUR</td><td className="py-3 px-3 text-right font-bold text-amber-900">3 %</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 font-medium text-mono-100">+ Revenus annexes (livre, masterclass, consulting)</td><td className="py-2 px-3 text-right text-emerald-700 font-semibold">+45 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 font-medium text-mono-100">+ Conférences / interventions média</td><td className="py-2 px-3 text-right text-emerald-700 font-semibold">+15 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-3 text-mono-100">- Charges sociales + impôt</td><td className="py-2 px-3 text-right">~34 000 EUR</td><td className="py-2 px-3 text-right">-</td></tr>
                  <tr className="border-t-2 border-mono-900 bg-blue-50"><td className="py-3 px-3 font-bold text-blue-900">Revenu net annuel propriétaire</td><td className="py-3 px-3 text-right font-extrabold text-blue-900 text-lg">50 000 EUR</td><td className="py-3 px-3 text-right font-bold text-blue-900">~ 4 200 EUR/mois</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-mono-500 italic">
              Profil révélateur : le restaurant lui-même ne génère que 24 keur de marge, ce qui
              ferait vivre tout juste le chef. Ce sont les <strong>activités annexes</strong>
              (livres, consulting, masterclass, partenariats) qui doublent le revenu. Sans
              ces revenus annexes, beaucoup d'étoiles seraient en déficit.
            </p>
          </div>

          <Callout type="warning">
            <strong>Réalité médiatique vs réalité économique :</strong> on imagine souvent que
            les chefs étoilés gagnent des millions. La vérité économique est nuancée : les
            établissements gastronomiques ont des marges nettes parmi les plus faibles de la
            profession (3-8 %). La richesse vient quasi-exclusivement des activités de marque
            (livres, émissions, partenariats, lignes de produits).
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Optimisation ═════════════ */}
        <section id="optimisation" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="6">
            Optimisation fiscale et sociale du propriétaire
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une fois la structure du revenu comprise (salaire + dividendes), reste à l'optimiser.
              Voici les 6 leviers qui peuvent vous faire gagner 10 à 20 % de revenu net sans
              changer votre CA ou votre marge.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Choisir le bon statut juridique',
                body: "Au-delà de 80 keur de revenu cible, la SAS / SASU bat presque toujours la SARL. Avantages : flat tax 30 % sur dividendes, pas de cotisations sociales sur les dividendes (contrairement à la SARL gérant majoritaire au-delà de 10 % du capital). Comptez 1 à 2 keur supplémentaires de frais comptables annuels en SAS vs SARL.",
              },
              {
                title: 'Construire un mix salaire / dividendes optimal',
                body: "Le ratio 60/40 (60 % salaire, 40 % dividendes) est la règle en SAS. Pourquoi : préserver droits retraite et chômage tout en optimisant la fiscalité globale. Pour un revenu cible de 80 keur net, ce mix économise 10-15 keur/an de charges vs un 100 % salaire.",
              },
              {
                title: 'Bénéficier des réductions de charges',
                body: "Réduction Fillon (cotisations patronales sur bas salaires), JEI (Jeune Entreprise Innovante si vous développez une app interne), CIR, exonération ZRR/QPV selon localisation. Un bon expert-comptable spécialisé CHR peut faire économiser 5-15 keur de charges sociales par an.",
              },
              {
                title: 'Utiliser les avantages fiscaux du dirigeant',
                body: "PEA-PME (apport-cession 150-0 B ter), tickets restaurant (jusqu'à 6,50 EUR/jour déductibles), assurance vie en démembrement, holding patrimoniale pour les revenus de marque (livres, royalties). Optimisations légales mais qui doivent être montées avec un fiscaliste.",
              },
              {
                title: 'Capitaliser dans l\'entreprise',
                body: "Au lieu de tout sortir, laisser 30-50 % du bénéfice dans l'entreprise sous forme de réserves ou d'investissements productifs (cuisine, matériel) déductibles. Cela augmente la valeur patrimoniale de l'entreprise (revente +20 à +40 % à terme) et réduit l'impôt immédiat.",
              },
              {
                title: 'Diversifier les sources de revenu',
                body: "Activités annexes : conseil pour autres restaurants, formation, livre, partenariats marques, location d'espace privé le dimanche, traiteur événementiel. Chaque source ajoute 5 à 30 keur/an de revenu complémentaire avec une marge très élevée (peu de coûts fixes additionnels).",
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
            Comparaison avec la moyenne France (revenu médian 22 keur)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Pour bien situer le revenu d'un propriétaire de restaurant, comparons-le aux autres
              métiers et au revenu médian des Français. Le revenu médian en France en 2026 est
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
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Salarié au SMIC</td><td className="py-3 px-4 text-center">17 500 EUR</td><td className="py-3 px-4 text-center">35 h</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Salarié médian France</td><td className="py-3 px-4 text-center">22 000 EUR</td><td className="py-3 px-4 text-center">35 h</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Serveur expérimenté restaurant</td><td className="py-3 px-4 text-center">22 000 - 28 000 EUR</td><td className="py-3 px-4 text-center">42 h</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Chef de cuisine salarié (5+ ans)</td><td className="py-3 px-4 text-center">35 000 - 55 000 EUR</td><td className="py-3 px-4 text-center">50 h</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Cadre intermédiaire (5 ans exp)</td><td className="py-3 px-4 text-center">35 000 - 45 000 EUR</td><td className="py-3 px-4 text-center">40 h</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Cadre supérieur</td><td className="py-3 px-4 text-center">55 000 - 90 000 EUR</td><td className="py-3 px-4 text-center">45 h</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">Propriétaire restaurant (médiane)</td><td className="py-3 px-4 text-center font-bold text-emerald-900">42 000 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-900">60-70 h</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Médecin généraliste libéral</td><td className="py-3 px-4 text-center">65 000 - 95 000 EUR</td><td className="py-3 px-4 text-center">50 h</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Avocat (5+ ans)</td><td className="py-3 px-4 text-center">60 000 - 120 000 EUR</td><td className="py-3 px-4 text-center">50 h</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Lecture choquante :</strong> rapporté au nombre d'heures travaillées, le
              propriétaire de restaurant médiane gagne <strong>environ 14 EUR net de l'heure</strong>
              (42 000 / 52 / 60). C'est sensiblement équivalent au SMIC horaire. Pour un cadre
              supérieur à 70 keur/an et 45 h/semaine, le taux horaire est de 30 EUR, soit
              <strong> plus du double</strong>.
            </p>
          </div>

          <Callout type="warning">
            <strong>Réalité peu glamour :</strong> le propriétaire de restaurant médian, sur la base
            du revenu rapporté aux heures, gagne moins par heure que beaucoup de ses salariés.
            C'est l'une des réalités les moins racontées du métier. Le revenu peut être élevé
            en valeur absolue mais le ratio temps/rendement reste très défavorable.
          </Callout>
        </section>

        {/* ═════════════ SECTION 8 : Realite vs fantasme ═════════════ */}
        <section id="realite" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="8">
            Réalité vs fantasme : la majorité gagne moins qu'un cadre
          </SectionHeading>

          <div className="prose-content">
            <p>
              Démoulons les 5 idées reçues les plus répandues sur le revenu d'un propriétaire de
              restaurant. Ce sont elles qui poussent souvent des candidats à ouvrir un restaurant
              avec des attentes irréalistes.
            </p>
          </div>

          <div className="space-y-6 mt-8">
            <MythCard
              myth="Un restaurant qui marche bien rapporte au moins 100 keur/an au propriétaire"
              reality="Faux. La marge nette moyenne en restauration est de 6 à 12 %. Pour générer 100 keur de revenu net propriétaire, il faut typiquement 1,2 à 1,8 Meur de CA, ce qui n'est atteignable qu'en brasserie ou en multi-sites. La grande majorité des 'restaurants qui marchent' génèrent 35-55 keur de revenu net."
            />
            <MythCard
              myth="Un propriétaire gagne plus qu'un chef salarié"
              reality="Pas nécessairement. Un chef salarié expérimenté gagne 35-55 keur brut/an (28-42 keur net). Un propriétaire de bistrot moyen gagne 30-45 keur. La différence : le chef salarié a un salaire fixe, des congés payés, la sécurité sociale et n'a pas pris de risque financier. Le propriétaire prend tous les risques."
            />
            <MythCard
              myth="Les chefs étoilés sont riches"
              reality="Faux pour la majorité. Le restaurant gastronomique a une marge nette très faible (3-8 %). La richesse des chefs étoilés célèbres vient quasi exclusivement des activités annexes : livres, émissions TV, consulting, lignes de produits, parfums, brand licensing. Le restaurant lui-même est souvent une vitrine quasi-déficitaire."
            />
            <MythCard
              myth="L'investissement dans un restaurant est très rentable"
              reality="Faux statistiquement. Selon l'INSEE, 30 % des restaurants ferment dans les 3 premières années, 50 % dans les 5 premières. Le ROI moyen sur capital investi (200-500 keur) est de 8-15 % par an seulement, équivalent voire inférieur à un placement boursier ou immobilier locatif, avec un risque infiniment plus élevé."
            />
            <MythCard
              myth="On gagne sa vie facilement en restauration"
              reality="Très faux. 60-70 h/semaine, weekends et soirs, stress opérationnel constant, gestion d'équipes difficile, marges sous pression d'inflation, conflit personnel quasi-permanent. Le burn-out touche 35 % des restaurateurs selon une étude UMIH 2024. Le revenu rapporté aux heures est souvent inférieur au SMIC horaire."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Conclusion :</strong> ouvrir un restaurant est un acte entrepreneurial avant
              tout passionnel. Les rendements financiers purs sont rarement au niveau du temps
              et du risque investis. Le restaurateur qui s'en sort financièrement est celui
              qui pilote ses marges au quotidien, optimise sa structure juridique, et trouve
              progressivement les leviers pour duplicater ou diversifier.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Comment augmenter ═════════════ */}
        <section id="augmenter" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="9">
            Comment augmenter son revenu de propriétaire
          </SectionHeading>

          <div className="prose-content">
            <p>
              Bonne nouvelle : il existe 7 leviers concrets pour faire passer son revenu de
              propriétaire de 40 à 70 keur, voire au-delà. Tous ne demandent pas d'augmenter
              le CA — certains ne touchent que la structure de coûts ou la fiscalité.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            {[
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Maîtriser le food cost', desc: 'Réduire le food cost de 32 % à 28 % sur 500 keur de CA = 20 keur de marge supplémentaire. Levier le plus rapide.', impact: 'Très fort' },
              { icon: <Users className="w-5 h-5" />, title: 'Optimiser le ratio personnel', desc: 'Passer le ratio personnel de 40 % à 35 % du CA (planning intelligent, polyvalence) = 25 keur sur 500 keur de CA.', impact: 'Très fort' },
              { icon: <Target className="w-5 h-5" />, title: 'Faire du menu engineering', desc: 'Identifier les plats stars (forte marge + forte popularité) et les promouvoir = +5 à +10 % de ticket moyen.', impact: 'Fort' },
              { icon: <Sparkles className="w-5 h-5" />, title: 'Augmenter le ticket moyen', desc: 'Boissons, desserts, suggestions, formules : passer le ticket de 22 à 26 EUR = +18 % de CA sans nouveaux clients.', impact: 'Fort' },
              { icon: <DollarSign className="w-5 h-5" />, title: 'Optimiser le statut fiscal', desc: 'Passer en SAS avec mix 60/40 vs SARL 100 % salaire = 10 à 15 keur économisés par an.', impact: 'Moyen' },
              { icon: <Building2 className="w-5 h-5" />, title: 'Diversifier les canaux', desc: 'Ajouter livraison click&collect (10-15 % du CA), traiteur événementiel, plats préparés = +25-40 keur/an.', impact: 'Fort' },
              { icon: <Award className="w-5 h-5" />, title: 'Activités annexes', desc: 'Conseil pour autres restaurants, formation, livre, partenariats marques = 10-50 keur/an avec marge très élevée.', impact: 'Moyen à fort' },
              { icon: <Briefcase className="w-5 h-5" />, title: 'Duplicater l\'établissement', desc: 'Ouvrir un 2ème restaurant basé sur le concept gagnant. Risque accru mais revenu x 1,5 à 2 au bout de 18-24 mois.', impact: 'Très fort' },
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
            <strong>Impact cumulé :</strong> en activant 4 à 5 de ces leviers sur 12-18 mois,
            un propriétaire peut passer de 40 à 70 keur de revenu net annuel, sans investissement
            supplémentaire majeur : 3 à 5 points de marge nette représentent 15-30 keur sur un
            CA de 500-1 000 keur.
          </Callout>

          <div className="prose-content mt-6">
            <p>
              Pour approfondir, lisez nos articles complémentaires :
              <Link to="/blog/seuil-rentabilite-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">calculer son seuil de rentabilité</Link>,
              <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">tout sur le calcul de marge</Link>, et
              <Link to="/blog/budget-previsionnel-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">construire son budget prévisionnel</Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION CTA — RestauMargin automatise ═════════════ */}
        <section className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="10">
            Piloter sa rentabilité avec RestauMargin
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le revenu d'un propriétaire de restaurant n'est pas un hasard. C'est le résultat
              direct de la maîtrise des marges, des charges et de la structure de coûts.
              Sans pilotage en temps réel, vous naviguez à l'aveugle — et c'est la principale
              cause de l'écart entre les restaurateurs qui gagnent bien leur vie et ceux qui
              survivent.
            </p>
            <p>
              RestauMargin a été conçu pour vous donner cette vision claire au quotidien :
              food cost, marge brute, marge nette, ticket moyen, ratio personnel, projection
              de revenu mensuel et annuel pour le propriétaire.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <FeatureCard
              icon={<Calculator className="w-5 h-5" />}
              title="Marge en temps réel"
              desc="Food cost, marge brute, marge nette par plat et global, mises à jour automatiquement."
            />
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="Projection revenu"
              desc="Simulation du revenu net propriétaire selon CA, marges et statut juridique."
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
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
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
              Stop aux estimations. RestauMargin calcule en temps réel votre marge nette, votre
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
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Seuil de rentabilité</h3>
              <p className="text-xs text-mono-500">Calculer son point mort et le nombre de couverts nécessaires.</p>
            </Link>
            <Link to="/blog/charges-sociales-restauration" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Charges sociales</h3>
              <p className="text-xs text-mono-500">CCN HCR, taux URSSAF, coût employeur réel en restauration.</p>
            </Link>
            <Link to="/blog/budget-previsionnel-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Budget prévisionnel</h3>
              <p className="text-xs text-mono-500">Construire son plan financier sur 12 mois pas-à-pas.</p>
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
          <span className="text-mono-400"><strong className="text-mono-100">Inconvénient :</strong> {inconvenient}</span>
        </div>
      </div>
    </div>
  );
}

function VariableCard({ icon, title, impact, desc }: { icon: React.ReactNode; title: string; impact: string; desc: string }) {
  const impactColor = impact === 'Très fort' ? 'bg-red-100 text-red-700'
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
