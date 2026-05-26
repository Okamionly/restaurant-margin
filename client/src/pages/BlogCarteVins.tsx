import { Link } from 'react-router-dom';
import {
  ChefHat,
  Wine,
  TrendingUp,
  Calculator,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  BookOpen,
  ListChecks,
  BarChart3,
  Grape,
  Sparkles,
  Eye,
  Target,
  Award,
  Zap,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Carte des vins restaurant : maximiser la marge 2026"
   Mot-cle principal : carte des vins restaurant
   ~3 200 mots — light/dark mode, W&B, Tailwind, theme cinematic
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Combien de references mettre sur une carte des vins de restaurant ?",
    answer:
      "Pour un bistrot de 30 a 50 couverts : 20 a 30 references suffisent. Une brasserie de 50 a 120 couverts : 40 a 60 references. Un gastronomique avec sommelier : 80 a 150 references. Au-dela, etude Cornell University 2014 montre que les ventes baissent : le client est paralyse et commande la bouteille qu'il connait deja, generalement la moins rentable. Le format compact (20-40 refs) genere plus de CA boissons que le format catalogue (100+).",
  },
  {
    question: "Quel coefficient multiplicateur appliquer sur les vins ?",
    answer:
      "Le coefficient varie de 2,5x a 5x le prix d'achat HT selon la gamme. Entree de gamme (5-8 EUR achat) : 4 a 5x. Milieu (10-18 EUR) : 3 a 3,5x. Premium (20-50 EUR) : 2,5 a 3x. Tres haute gamme (50 EUR+) : 2 a 2,5x. Plus la bouteille est chere, plus le coefficient doit etre bas pour rester acceptable. Une bouteille a 80 EUR achat vendue 240 EUR (3x) genere plus de marge brute qu'a 400 EUR (5x) qui ne se vendra pas.",
  },
  {
    question: "Faut-il avoir une cave a vins physique pour un restaurant ?",
    answer:
      "Non. Une cave physique est justifiee seulement au-dela de 80 references ou pour un positionnement gastronomique fort. Pour 80 % des restaurants francais, un cellier de service refrigere (60-150 bouteilles) avec livraisons hebdomadaires des fournisseurs suffit largement. Cout d'une cave physique : 8 000 a 25 000 EUR amortis sur 10 ans. Cout d'un cellier de service : 1 200 a 3 500 EUR amortis sur 5 ans. Choisissez selon votre rotation.",
  },
  {
    question: "Peut-on vendre ses propres vins au restaurant (vins du domaine familial) ?",
    answer:
      "Oui, c'est legal en France avec la licence boissons appropriee (licence IV ou III selon votre etablissement). Un vin maison cree un lien fort avec votre identite de marque et peut generer une marge superieure a 70 % puisque vous controlez la chaine de valeur de bout en bout. Pensez a faire valider l'etiquetage par les services veterinaires et la DDPP, et tenez une comptabilite separee pour le vin du domaine vs le vin achete chez les negociants.",
  },
  {
    question: "Comment integrer les vins bio et nature sur la carte ?",
    answer:
      "Reservez 15 a 20 % des references aux vins bio et nature en 2026 (vs 5 % il y a 5 ans). Leur prix d'achat est legerement superieur (+10 a 20 %) mais leur valeur percue plus elevee permet de maintenir le coefficient habituel. Bonus : les clients qui privilegient le bio sont moins sensibles au prix et plus fideles (taux de revisite +25 %). Mettez en avant l'origine, le vigneron, et la certification (Demeter, Ecocert, Nature et Progres) dans la description.",
  },
  {
    question: "A quelle frequence renouveler sa carte des vins ?",
    answer:
      "Faites une revision complete 2 fois par an : en avril (sortie des nouveaux blancs et roses) et en octobre (sortie des nouveaux rouges et millesimes precedents). Entre ces revisions, remplacez les references epuisees ou a faible rotation au fil de l'eau. Une carte qui n'evolue pas est perdue : les habitues s'ennuient et arretent de commander de nouvelles bouteilles. Visez 25 a 35 % de turnover annuel des references pour conserver la fraicheur.",
  },
  {
    question: "Comment calculer la marge brute sur le vin au verre ?",
    answer:
      "Pour le vin au verre, appliquez un prix equivalent a 1/4 du prix de la bouteille (et non 1/5) pour compenser les 10 a 20 % de pertes liees a l'oxydation, au gout, et aux verres servis trop pleins. Exemple : bouteille a 28 EUR vendue, 1 verre standard = 12,5 cl, soit 6 verres par bouteille. Prix unitaire : 28/4 = 7 EUR. Marge brute par bouteille de 6 verres : 42 EUR (vs 28 EUR vendue en bouteille). Le verre est plus rentable que la bouteille pour le restaurateur.",
  },
  {
    question: "Quels sont les criteres pour selectionner un fournisseur de vins ?",
    answer:
      "Cinq criteres pour un negociant fiable : (1) Garantie de stock 6 mois minimum sur les references commandees, (2) Delais de livraison rapides (48-72h), (3) Conditions de paiement souples (30 a 60 jours), (4) Service de conseil sommellerie inclus, (5) Reprise des invendus en cas de bouchonnage ou non-conformite. Privilegiez 2 a 3 fournisseurs maximum pour beneficier de volumes negocies, plutot que 10 fournisseurs avec des conditions standards.",
  },
  {
    question: "Comment ecrire les descriptions de vins sur la carte ?",
    answer:
      "Trois principes : (1) Court (1 a 2 lignes maximum), (2) Concret et sensoriel (notes de fruits rouges, vanille, charpente), (3) Accord met-vin suggere ('ideal avec nos pieces de boeuf'). Evitez le jargon technique (taux d'extraction, malolactique, ph) qui rebute 70 % des clients. Exemple : 'Bordeaux charnu, notes de fruits noirs et de vanille, parfait avec votre cote de boeuf' bat 'AOC Saint-Estephe 2020, elevage 18 mois en barriques' pour la conversion commerciale.",
  },
  {
    question: "Quel est le ROI d'une bonne carte des vins ?",
    answer:
      "Une carte bien construite peut faire passer le ratio boissons de 18 a 30 % du CA total restaurant. Sur un etablissement a 600 000 EUR de CA, c'est 72 000 EUR de CA boissons additionnels. Avec une marge brute moyenne de 68 % sur le vin, c'est environ 49 000 EUR de marge brute additionnelle par an. ROI : massif. Le travail de structuration de la carte (selection, pricing, presentation) prend 40 a 60 heures la premiere fois, puis 8 heures par revision semestrielle.",
  },
];

export default function BlogCarteVins() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Carte des vins restaurant : guide complet pour maximiser la marge 2026"
        description="Comment construire une carte des vins rentable : nombre de references, coefficients multiplicateurs, rotation cave, presentation. Tableaux par gamme, accords mets-vins, ROI."
        path="/blog/construire-carte-vins-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Carte des vins restaurant', url: 'https://www.restaumargin.fr/blog/construire-carte-vins-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment monter une carte des vins restaurant rentable en 7 etapes',
            description: 'Methode pas-a-pas pour construire une carte des vins generant 25 a 40 % du CA boissons avec une marge brute de 65 a 75 %.',
            totalTime: 'PT8H',
            tool: ['Caisse / TPV', 'Logiciel de gestion stock', 'Fichier clients (CRM)', 'Liste des plats du menu', 'Catalogues fournisseurs'],
            step: [
              { '@type': 'HowToStep', name: 'Definir le positionnement et la cible', text: 'Analysez votre cuisine, votre ticket moyen, votre clientele type. Un bistrot a 30 EUR de ticket moyen n\'a pas la meme carte qu\'un gastronomique a 90 EUR.' },
              { '@type': 'HowToStep', name: 'Determiner le nombre de references cibles', text: 'Bistrot 30-50 couverts : 20-30 refs. Brasserie 50-120 : 40-60 refs. Gastronomique : 80-150 refs. Adaptez selon votre stockage et votre rotation.' },
              { '@type': 'HowToStep', name: 'Etablir la repartition par couleur', text: 'Modele de base : 40 % rouges, 30 % blancs, 15 % effervescents, 10 % roses, 5 % vins doux/oranges. Ajustez selon votre cuisine.' },
              { '@type': 'HowToStep', name: 'Definir les 3 gammes de prix', text: 'Entree de gamme (33 % des refs, 24-48 EUR TTC), milieu (33 %, 36-75 EUR), premium (33 %, 60-180 EUR). Chaque gamme = un tiers du stock en valeur.' },
              { '@type': 'HowToStep', name: 'Calculer les prix de vente avec coefficient', text: 'Appliquez les coefficients 4-5x pour entree, 3-3,5x milieu, 2,5-3x premium, 2-2,5x tres haute gamme. Verifiez chaque marge brute par bouteille.' },
              { '@type': 'HowToStep', name: 'Selectionner les references chez 2-3 fournisseurs', text: 'Privilegiez les fournisseurs garantissant 6 mois de stock, livraisons 48-72h, et reprise des invendus. Negociez les volumes par ligne.' },
              { '@type': 'HowToStep', name: 'Rediger la carte et former l\'equipe de salle', text: 'Descriptions courtes (1-2 lignes), prix integres au texte, organisation par couleur puis par gamme. Formez 5 accords mets-vins cles a tous les serveurs.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Carte des vins restaurant : comment la construire pour maximiser la marge en 2026',
            description: 'Guide complet de la carte des vins restaurant : selection, coefficient multiplicateur, rotation, presentation. Tableaux benchmarks et accords mets-vins.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-22',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/construire-carte-vins-restaurant' },
          },
        ]}
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
              to="/login"
              className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors"
            >
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
          <span className="text-mono-100 font-medium">Carte des vins restaurant</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Boissons et rentabilite"
        readTime="13 min"
        date="Mai 2026"
        title="Carte des vins restaurant : comment maximiser la marge en 2026"
        accentWord="Carte des vins"
        subtitle="La carte des vins represente 25 a 40 % du CA boissons d'un restaurant. Bien construite, elle peut atteindre 65 a 75 % de marge brute. Decouvrez les coefficients, la rotation cave, la presentation et les accords qui transforment votre cave en machine a marge."
      />

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-22" updatedDate="2026-05-26" readTime="13 min" variant="header" />

        {/* Encadre formule rapide */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Les coefficients essentiels carte des vins</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les 4 multiplicateurs a maitriser
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Entree de gamme (5-8 EUR achat)</strong> : coefficient x4 a x5 -- vente 24-48 EUR TTC</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Milieu de gamme (10-18 EUR achat)</strong> : coefficient x3 a x3,5 -- vente 36-75 EUR TTC</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Premium (20-50 EUR achat)</strong> : coefficient x2,5 a x3 -- vente 60-180 EUR TTC</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Vin au verre</strong> : 1/4 du prix bouteille (compense oxydation 10-20 %)</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectif global carte des vins : 65 a 75 % de marge brute, 8 a 12 rotations annuelles de la cave.
          </p>
        </div>

        {/* Table des matieres */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#enjeux', label: 'Pourquoi la carte des vins est strategique' },
              { href: '#references', label: 'Combien de references mettre sur votre carte' },
              { href: '#repartition', label: 'Repartition par couleur et par gamme' },
              { href: '#coefficient', label: 'Calculer la marge et fixer les prix' },
              { href: '#howto', label: 'Monter sa carte en 7 etapes' },
              { href: '#selection', label: 'Selectionner les bons vins et fournisseurs' },
              { href: '#accords', label: 'Accords mets-vins : la science des combinaisons' },
              { href: '#rotation', label: 'Rotation de cave et eviter les stocks morts' },
              { href: '#presentation', label: 'Presenter votre carte pour vendre plus' },
              { href: '#cas', label: 'Cas pratique chiffre : brasserie 80 couverts' },
              { href: '#erreurs', label: '6 erreurs qui plombent une carte des vins' },
              { href: '#faq', label: 'Questions frequentes' },
              { href: '#cta', label: 'Automatiser le suivi avec RestauMargin' },
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

        {/* ═════════════ SECTION 1 : Enjeux ═════════════ */}
        <section id="enjeux" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Pourquoi la carte des vins est strategique pour votre restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Vous perdez de l'argent sur votre carte des vins sans le savoir. Un restaurateur
              francais sur deux sous-evalue ses vins, laisse sa cave tourner trop lentement, ou
              propose une carte mal structuree qui dilue les ventes au lieu de les concentrer sur
              les references rentables. La carte des vins represente pourtant <strong>25 a 40 %
              du chiffre d'affaires boissons</strong> d'un restaurant traditionnel selon les donnees
              de la GIRA Conseil et du SNRC (Syndicat National de la Restauration Commerciale).
            </p>
            <p>
              Bien construite, une carte des vins peut atteindre des marges brutes de 65 a 75 %,
              soit le double de ce qu'on observe sur les plats. C'est mathematiquement l'un des
              centres de profit les plus puissants d'un restaurant. Un bistrot qui fait 600 000 EUR
              de CA total avec 18 % de ratio boissons mediocre genere 108 000 EUR de CA boissons,
              dont environ 65 000 EUR de marge brute. En passant le ratio a 30 % avec une carte
              optimisee, c'est 180 000 EUR de CA, dont <strong>122 000 EUR de marge brute</strong>.
              Le gain : 57 000 EUR de marge brute additionnelle par an, sans aucun investissement
              en personnel ou en surface supplementaire.
            </p>
            <p>
              En 2026, le contexte renforce cet enjeu. L'inflation des matieres premieres a comprime
              les marges sur les plats. Les charges fixes (loyer, energie, salaires) ont augmente
              de 18 % en moyenne depuis 2022 selon l'INSEE. La carte des vins reste l'un des rares
              leviers de marge ou le restaurateur garde le controle complet : selection, pricing,
              promotion, presentation. C'est le terrain de jeu strategique a ne pas negliger.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Les restaurants etoiles Michelin realisent en moyenne
              45 a 60 % de leur CA via la carte des vins et autres boissons premium (champagnes,
              spiritueux d'exception, accords mets-vins). C'est la raison pour laquelle la sommellerie
              est un investissement strategique majeur pour le segment haut de gamme : un sommelier
              competent finance largement son salaire grace au CA boissons additionnel.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Nombre de references ═════════════ */}
        <section id="references" className="mb-16">
          <SectionHeading icon={<Wine className="w-6 h-6" />} number="2">
            Combien de references mettre sur votre carte des vins
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une etude classique de la Cornell University (2014, mise a jour 2023) montre que les
              cartes de 20 a 40 references generent <strong>plus de ventes</strong> que les listes
              de 100 vins. Au-dela, le client est paralyse par le paradoxe du choix (theorise par
              Barry Schwartz) et commande la bouteille qu'il connait deja -- souvent la moins
              rentable car la plus consommee donc la moins differenciante.
            </p>
            <p>
              Le bon nombre de references depend principalement de trois variables : la taille de
              votre etablissement, votre positionnement, et la rotation possible de votre cave.
              Voici les fourchettes recommandees observees chez les clients RestauMargin et confirmees
              par les guides Hachette et Bettane et Desseauve.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type d'etablissement</th>
                  <th className="text-center py-3 px-4 font-semibold">Couverts/jour</th>
                  <th className="text-center py-3 px-4 font-semibold">Nb references ideal</th>
                  <th className="text-center py-3 px-4 font-semibold">Stock moyen (bouteilles)</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Investissement cave</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Cafe / Coffee shop</td><td className="py-3 px-4 text-center">50-100</td><td className="py-3 px-4 text-center">8-15</td><td className="py-3 px-4 text-center">40-80</td><td className="py-3 px-4 text-center">300-700 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Bistrot</td><td className="py-3 px-4 text-center">30-80</td><td className="py-3 px-4 text-center">20-30</td><td className="py-3 px-4 text-center">100-180</td><td className="py-3 px-4 text-center">1 200-3 500 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Brasserie</td><td className="py-3 px-4 text-center">80-150</td><td className="py-3 px-4 text-center">40-60</td><td className="py-3 px-4 text-center">200-400</td><td className="py-3 px-4 text-center">3 500-8 000 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Restaurant traditionnel</td><td className="py-3 px-4 text-center">60-120</td><td className="py-3 px-4 text-center">35-50</td><td className="py-3 px-4 text-center">180-350</td><td className="py-3 px-4 text-center">3 000-7 500 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Gastronomique (sans sommelier)</td><td className="py-3 px-4 text-center">40-80</td><td className="py-3 px-4 text-center">60-100</td><td className="py-3 px-4 text-center">350-700</td><td className="py-3 px-4 text-center">8 000-25 000 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Gastronomique (avec sommelier)</td><td className="py-3 px-4 text-center">40-80</td><td className="py-3 px-4 text-center">100-200</td><td className="py-3 px-4 text-center">600-1 500</td><td className="py-3 px-4 text-center">20 000-80 000 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Etoile Michelin</td><td className="py-3 px-4 text-center">25-60</td><td className="py-3 px-4 text-center">200-600</td><td className="py-3 px-4 text-center">1 500-8 000</td><td className="py-3 px-4 text-center">80 000-500 000 EUR</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Regle d'or :</strong> visez 4 a 6 semaines de stock maximum sur chaque
              reference (sauf vins de garde). Une bouteille qui dort plus de 60 jours dans votre
              cave est un mauvais investissement : elle immobilise du cash, occupe de l'espace, et
              ne contribue pas au CA. Mieux vaut une carte courte avec rotation rapide qu'une carte
              longue avec stocks morts.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Repartition ═════════════ */}
        <section id="repartition" className="mb-16">
          <SectionHeading icon={<Grape className="w-6 h-6" />} number="3">
            Repartition par couleur et par gamme de prix
          </SectionHeading>

          <div className="prose-content">
            <p>
              La repartition par couleur de votre carte doit refleter votre cuisine. Un restaurant
              de poissons et fruits de mer aura plus de blancs. Un steakhouse aura plus de rouges.
              Voici les proportions de reference, valables pour une carte de 25 a 50 references.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Couleur</th>
                  <th className="text-center py-3 px-4 font-semibold">Bistrot / Brasserie</th>
                  <th className="text-center py-3 px-4 font-semibold">Cuisine mediterraneenne</th>
                  <th className="text-center py-3 px-4 font-semibold">Steakhouse / Brasserie viande</th>
                  <th className="text-center py-3 px-4 font-semibold">Poissons / Fruits de mer</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Gastronomique</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Rouges</td><td className="py-3 px-4 text-center">40 %</td><td className="py-3 px-4 text-center">35 %</td><td className="py-3 px-4 text-center font-semibold text-emerald-700">55 %</td><td className="py-3 px-4 text-center">15 %</td><td className="py-3 px-4 text-center">40 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Blancs</td><td className="py-3 px-4 text-center">30 %</td><td className="py-3 px-4 text-center">35 %</td><td className="py-3 px-4 text-center">20 %</td><td className="py-3 px-4 text-center font-semibold text-emerald-700">55 %</td><td className="py-3 px-4 text-center">35 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Effervescents</td><td className="py-3 px-4 text-center">15 %</td><td className="py-3 px-4 text-center">10 %</td><td className="py-3 px-4 text-center">10 %</td><td className="py-3 px-4 text-center">15 %</td><td className="py-3 px-4 text-center">15 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Roses</td><td className="py-3 px-4 text-center">10 %</td><td className="py-3 px-4 text-center">15 %</td><td className="py-3 px-4 text-center">10 %</td><td className="py-3 px-4 text-center">10 %</td><td className="py-3 px-4 text-center">5 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Liquoreux / Oranges / Nature</td><td className="py-3 px-4 text-center">5 %</td><td className="py-3 px-4 text-center">5 %</td><td className="py-3 px-4 text-center">5 %</td><td className="py-3 px-4 text-center">5 %</td><td className="py-3 px-4 text-center">5 %</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Les 3 gammes de prix : la regle des tiers</h3>
            <p>
              Repartissez vos references en trois gammes de prix : entree, milieu, premium. Chaque
              tiers represente environ un tiers de votre stock en valeur. Cette structure permet
              de couvrir toutes les sensibilites budgetaires sans dispersion.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-mono-350 mt-4 leading-relaxed">
              <li>
                <strong>Tier 1 - Entree de gamme</strong> : prix de vente TTC 24 a 48 EUR. Cible
                les clients budget-conscious ou la commande "rapide". Volume eleve, marge unitaire
                moyenne mais multipliee par la rotation. Coefficient 4 a 5x.
              </li>
              <li>
                <strong>Tier 2 - Milieu de gamme</strong> : prix de vente TTC 36 a 75 EUR. Le coeur
                de la carte, le plus consomme par les habitues et les groupes. Marge unitaire elevee,
                rotation rapide. Coefficient 3 a 3,5x. C'est ici que vous devez mettre votre meilleure
                selection en termes rapport qualite-prix.
              </li>
              <li>
                <strong>Tier 3 - Premium</strong> : prix de vente TTC 60 a 180 EUR. Cible les
                occasions, les couples, les clients VIP, les comptes d'entreprise. Marge unitaire
                exceptionnelle mais rotation plus lente. Coefficient 2,5 a 3x. Limitez le stock pour
                eviter l'immobilisation.
              </li>
              <li>
                <strong>Tier 4 (optionnel) - Tres haute gamme / Trophees</strong> : 180 EUR et plus.
                3 a 5 references "vitrine" pour les amateurs eclaires. Coefficient 2 a 2,5x.
                Renouvellement rare, presence symbolique.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Coefficient et marge ═════════════ */}
        <section id="coefficient" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="4">
            Calculer la marge sur les vins et fixer les prix
          </SectionHeading>

          <div className="prose-content">
            <p>
              La methode du coefficient multiplicateur est universellement utilisee en sommellerie.
              Elle s'applique au prix d'achat HT (hors TVA) puis vous ajoutez la TVA de 20 % sur
              les boissons alcoolisees en restauration sur place pour obtenir le prix de vente TTC.
            </p>

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 my-6 font-mono text-sm text-teal-900">
              <strong>Formule de base :</strong><br />
              Prix de vente TTC = Prix d'achat HT x Coefficient x 1,20 (TVA 20 %)
            </div>

            <p>
              <strong>Exemple concret :</strong> bouteille de Cotes-du-Rhone village achetee 8 EUR
              HT x 3,5 = 28 EUR HT -- 33,60 EUR TTC. Marge brute par bouteille : 33,60 - 8 = 25,60 EUR,
              soit <strong>76,2 % de marge brute</strong>. Sur une rotation de 8 bouteilles par mois
              (96/an), cette reference genere 2 458 EUR de marge brute annuelle.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Tableau des coefficients par gamme</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Gamme</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix achat HT</th>
                  <th className="text-right py-2 px-3 font-semibold">Coefficient</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix vente HT</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix vente TTC</th>
                  <th className="text-right py-2 px-3 font-semibold">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Entree (basse)</td><td className="py-2 px-3 text-right">5 EUR</td><td className="py-2 px-3 text-right">x5</td><td className="py-2 px-3 text-right">25 EUR</td><td className="py-2 px-3 text-right font-medium">30 EUR</td><td className="py-2 px-3 text-right font-bold text-emerald-700">80 %</td></tr>
                <tr><td className="py-2 px-3">Entree (haute)</td><td className="py-2 px-3 text-right">8 EUR</td><td className="py-2 px-3 text-right">x4</td><td className="py-2 px-3 text-right">32 EUR</td><td className="py-2 px-3 text-right font-medium">38,40 EUR</td><td className="py-2 px-3 text-right font-bold text-emerald-700">75 %</td></tr>
                <tr><td className="py-2 px-3">Milieu (basse)</td><td className="py-2 px-3 text-right">10 EUR</td><td className="py-2 px-3 text-right">x3,5</td><td className="py-2 px-3 text-right">35 EUR</td><td className="py-2 px-3 text-right font-medium">42 EUR</td><td className="py-2 px-3 text-right font-bold text-emerald-700">71 %</td></tr>
                <tr><td className="py-2 px-3">Milieu (haute)</td><td className="py-2 px-3 text-right">18 EUR</td><td className="py-2 px-3 text-right">x3</td><td className="py-2 px-3 text-right">54 EUR</td><td className="py-2 px-3 text-right font-medium">64,80 EUR</td><td className="py-2 px-3 text-right font-bold text-emerald-700">67 %</td></tr>
                <tr><td className="py-2 px-3">Premium (basse)</td><td className="py-2 px-3 text-right">25 EUR</td><td className="py-2 px-3 text-right">x3</td><td className="py-2 px-3 text-right">75 EUR</td><td className="py-2 px-3 text-right font-medium">90 EUR</td><td className="py-2 px-3 text-right font-bold text-emerald-700">67 %</td></tr>
                <tr><td className="py-2 px-3">Premium (haute)</td><td className="py-2 px-3 text-right">50 EUR</td><td className="py-2 px-3 text-right">x2,5</td><td className="py-2 px-3 text-right">125 EUR</td><td className="py-2 px-3 text-right font-medium">150 EUR</td><td className="py-2 px-3 text-right font-bold text-emerald-700">60 %</td></tr>
                <tr><td className="py-2 px-3">Tres haute gamme</td><td className="py-2 px-3 text-right">100 EUR</td><td className="py-2 px-3 text-right">x2,2</td><td className="py-2 px-3 text-right">220 EUR</td><td className="py-2 px-3 text-right font-medium">264 EUR</td><td className="py-2 px-3 text-right font-bold text-emerald-700">55 %</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Le vin au verre : 1/4 et non 1/5</h3>
            <p>
              Pour le vin au verre, la regle classique est de diviser le prix de la bouteille par
              le nombre de verres servis (typiquement 6 verres de 12,5 cl par bouteille standard
              de 75 cl). Mais cette regle <strong>sous-estime systematiquement votre marge</strong>
              car elle ne compense pas les pertes liees a l'oxydation, aux verres servis trop pleins,
              et aux bouteilles ouvertes en fin de service sans rotation.
            </p>
            <p>
              <strong>Methode recommandee :</strong> divisez par 4 (et non 5 ou 6). Exemple : une
              bouteille vendue 28 EUR donne un prix au verre de 28/4 = <strong>7 EUR le verre</strong>.
              Marge brute par bouteille vendue au verre : 6 verres x 7 EUR = 42 EUR (vs 28 EUR
              vendue en bouteille). Le verre est <strong>50 % plus rentable</strong> que la bouteille.
              Encouragez vos serveurs a le proposer.
            </p>
          </div>

          <Callout type="info">
            <strong>Le coefficient n'est pas magique.</strong> Si vos clients arbitrent fortement
            sur le prix (zone touristique, clientele jeune, brunch), baissez les coefficients
            d'entree et milieu de gamme a 3,5-4x pour stimuler le volume. Si vous etes en zone
            premium (capitale, station de ski huppe), vous pouvez monter a 4,5-5x sans difficulte.
            Le bon coefficient est celui qui maximise le CA total (volume x marge unitaire), pas
            celui qui maximise la marge unitaire seule. Pour approfondir, lisez notre article sur
            le <Link to="/blog/coefficient-multiplicateur" className="underline font-semibold hover:text-teal-700">coefficient multiplicateur en restauration</Link>.
          </Callout>
        </section>

        {/* ═════════════ SECTION HOWTO ═════════════ */}
        <section id="howto" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="5">
            Monter sa carte des vins en 7 etapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la methodologie operationnelle pour construire ou refondre votre carte des vins.
              Comptez 40 a 60 heures de travail la premiere fois, puis 8 heures par revision
              semestrielle. C'est un investissement qui se rentabilise en 2 a 3 mois.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Definir le positionnement et la cible',
                body: "Analysez votre cuisine, votre ticket moyen, votre clientele type, votre quartier. Un bistrot a 30 EUR de ticket moyen n'a pas la meme carte qu'un gastronomique a 90 EUR. Documentez ce positionnement en 3 phrases avant tout achat. C'est votre boussole pour tous les arbitrages a venir.",
              },
              {
                title: 'Determiner le nombre de references cibles',
                body: "Utilisez le tableau de la section 2 : bistrot 20-30 refs, brasserie 40-60, gastronomique 80-150. Adaptez selon votre stockage physique disponible (cave, cellier, reserve) et la rotation realiste compte tenu de votre volume de couverts. Toujours partir de la capacite de rotation, pas de l'espace disponible.",
              },
              {
                title: 'Etablir la repartition par couleur',
                body: "Utilisez le tableau de la section 3 selon votre type de cuisine. Reglez les bornes (rouges 35-45 %, blancs 25-35 %, effervescents 10-20 %, roses 5-15 %, autres 5-10 %). N'oubliez pas les vins sans alcool ou bio si votre cible est jeune urbaine (15 % en 2026 selon TheFork).",
              },
              {
                title: 'Definir les 3 gammes de prix',
                body: "Repartissez vos references en tiers : entree 33 %, milieu 33 %, premium 33 %. Chaque tiers doit representer environ un tiers du stock en valeur. Verifiez qu'il n'y a pas de trou (ex : aucune bouteille entre 45 et 80 EUR) qui forcerait le client a aller chercher ailleurs.",
              },
              {
                title: 'Calculer les prix de vente avec coefficient',
                body: "Appliquez les coefficients du tableau section 4 selon la gamme. Verifiez chaque marge brute par bouteille. Recommencez le calcul pour les vins au verre (coefficient 1/4 de la bouteille). Documentez chaque prix dans un tableur ou un outil comme RestauMargin.",
              },
              {
                title: 'Selectionner les references chez 2-3 fournisseurs',
                body: "Privilegiez 2-3 fournisseurs maximum pour beneficier de volumes negocies. Criteres : garantie de stock 6 mois, livraisons 48-72h, conditions de paiement 30-60 jours, conseil sommellerie inclus, reprise des invendus. Demandez systematiquement des degustations gratuites avant achat.",
              },
              {
                title: 'Rediger la carte et former l\'equipe de salle',
                body: "Descriptions courtes (1-2 lignes), prix integres au texte, organisation par couleur puis par gamme. Formez 5 accords mets-vins cles a tous les serveurs en 30 minutes. L'equipe doit etre capable de recommander spontanement une bouteille adaptee au plat principal du client.",
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

        {/* ═════════════ SECTION 6 : Selection ═════════════ */}
        <section id="selection" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="6">
            Selectionner les bons vins et les bons fournisseurs
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un vin qui reste en cave plus de 45 jours est un vin mal selectionne. <strong>Chaque
              reference doit se vendre au minimum 2 fois par semaine</strong> pour un restaurant de
              50 couverts en service du soir, soit 100 bouteilles par an et par reference. Si vous
              etes en dessous, soit la reference est mal positionnee dans la carte, soit elle ne
              correspond pas a votre clientele.
            </p>
            <p>
              Voici les 5 criteres operationnels pour selectionner une reference qui va se vendre.
            </p>
          </div>

          <ol className="list-decimal pl-6 space-y-3 text-mono-350 mt-6 leading-relaxed">
            <li>
              <strong>Adequation avec votre cuisine.</strong> Un restaurant mediterraneen a besoin
              de blancs frais (Languedoc, Provence, Catalogne) et de rouges du sud (Cotes-du-Rhone,
              Faugeres), pas de Bordeaux tanniques. Un steakhouse parisien a besoin de rouges
              charpentes (Saint-Estephe, Pomerol, Hermitage). Verifiez chaque achat contre votre
              menu existant.
            </li>
            <li>
              <strong>Prix d'achat sous 15 % du ticket moyen hors boisson.</strong> Si votre ticket
              moyen est 35 EUR, vos entrees de gamme ne doivent pas depasser 5,25 EUR d'achat
              (35 x 15 %). Au-dela, le prix de vente devient incoherent avec le positionnement de
              votre carte plats.
            </li>
            <li>
              <strong>Fournisseur fiable</strong> avec garantie de stock 6 mois. Une rupture de
              stock sur une reference qui marche tue votre marge : vous devez la remplacer en
              urgence par une reference plus chere ou moins adaptee. Demandez ce critere par ecrit.
            </li>
            <li>
              <strong>Lisibilite pour le client.</strong> Etiquettes claires, appellations connues
              (Saint-Emilion, Sancerre, Chablis) ou cepages evidents (Chardonnay, Merlot, Syrah).
              Les clients ne sont pas sommeliers : ils achetent ce qu'ils reconnaissent. Reservez
              les references confidentielles aux gastronomiques.
            </li>
            <li>
              <strong>Visibilite production / vigneron.</strong> En 2026, 60 % des clients francais
              veulent connaitre le vigneron derriere la bouteille (etude France AgriMer 2025).
              Privilegiez les domaines avec une histoire, un site web, une presence reseaux.
              Mentionnez le vigneron dans la description sur la carte.
            </li>
          </ol>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Les 5 sources d'approvisionnement</h3>
            <ul className="list-disc pl-6 space-y-2 text-mono-350 mt-4 leading-relaxed">
              <li>
                <strong>Negociants regionaux</strong> (Beaune, Bordeaux, Avignon, Carcassonne) :
                excellent rapport qualite-prix, large gamme, conseils sommellerie. Conditions de
                paiement 30-60 jours. Adapte a 80 % des restaurants.
              </li>
              <li>
                <strong>Cooperatives</strong> : prix tres competitifs sur les entrees de gamme et
                les volumes. Qualite variable selon la cooperative. Tester avant de s'engager.
              </li>
              <li>
                <strong>Vignerons en direct</strong> : histoire, traçabilite, exclusivite locale.
                Conditions de paiement moins souples (cash ou 30 jours). Ideal pour les references
                d'identite.
              </li>
              <li>
                <strong>Salons professionnels</strong> (Vinexpo, Wine Paris, Millesime Bio) : pour
                renouveler la carte avec des decouvertes annuelles. Acces aux primeurs et previews.
              </li>
              <li>
                <strong>Plateformes B2B specialisees</strong> (Vivino Business, Wine Lister Pro) :
                pour les vins de garde et les references rares. Prix variables, verifier les frais
                de port et de conservation.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Accords mets-vins ═════════════ */}
        <section id="accords" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="7">
            Accords mets-vins : la science qui augmente les ventes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un serveur capable de recommander spontanement "le Cotes-du-Rhone blanc avec le bar"
              augmente les ventes au verre de 15 a 20 % mecaniquement. La sommellerie n'est pas
              reservee aux etoiles : meme un bistrot peut former son equipe a 5 accords cles en
              30 minutes. Voici les associations fondamentales a maitriser.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Plat / Categorie</th>
                  <th className="text-left py-3 px-4 font-semibold">Accord classique</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Accord audacieux (sur recommandation)</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Huitres / fruits de mer</td><td className="py-3 px-4">Muscadet, Chablis, Sancerre</td><td className="py-3 px-4">Champagne brut nature, Manzanilla</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Saumon / poisson gras</td><td className="py-3 px-4">Pouilly-Fume, Meursault</td><td className="py-3 px-4">Pinot noir leger, Cremant rose</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Bar / poisson blanc</td><td className="py-3 px-4">Sancerre, Chablis Premier Cru</td><td className="py-3 px-4">Cotes-du-Rhone blanc, Vermentino</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Volaille rotie</td><td className="py-3 px-4">Bourgogne rouge, Beaujolais</td><td className="py-3 px-4">Vouvray sec, Pinot Gris d'Alsace</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Boeuf / Cote de boeuf</td><td className="py-3 px-4">Bordeaux, Saint-Joseph</td><td className="py-3 px-4">Cahors, Madiran (tanins)</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Agneau</td><td className="py-3 px-4">Pauillac, Pomerol, Cahors</td><td className="py-3 px-4">Syrah du Rhone, Languedoc</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Gibier</td><td className="py-3 px-4">Saint-Emilion, Pomerol vieux</td><td className="py-3 px-4">Bandol vieux, Hermitage</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Fromages affines (camembert, brie)</td><td className="py-3 px-4">Bourgogne rouge leger</td><td className="py-3 px-4">Cidre brut, Vouvray demi-sec</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Fromages bleu / Roquefort</td><td className="py-3 px-4">Sauternes, Banyuls</td><td className="py-3 px-4">Porto LBV, Maury vintage</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Desserts chocolat</td><td className="py-3 px-4">Banyuls, Maury, Rasteau</td><td className="py-3 px-4">Porto LBV, Pedro Ximenez</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Desserts fruits rouges</td><td className="py-3 px-4">Champagne rose, Cremant rose</td><td className="py-3 px-4">Bugey-Cerdon, Brachetto d'Acqui</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Cuisine asiatique / epicee</td><td className="py-3 px-4">Riesling alsace, Gewurztraminer</td><td className="py-3 px-4">Vouvray sec, Cremant brut</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Astuce operationnelle :</strong> imprimez ce tableau en format A4 plastifie
              et placez-le en cuisine et au passe. Vos serveurs s'y referent en 5 secondes pour
              proposer un accord. Tracker le taux d'attachement boissons par serveur permet
              d'identifier les meilleurs et de partager les bonnes pratiques en briefing.
            </p>
            <p>
              Pour des accords plus pointus (cuisine fusion, plats signature de votre chef), faites
              appel a un sommelier consultant 1 jour par an. Cout : 500 a 1 200 EUR. Retour sur
              investissement : 10 a 30x sur 12 mois grace aux ventes additionnelles.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Rotation ═════════════ */}
        <section id="rotation" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="8">
            Rotation de cave : eviter les stocks morts et optimiser le cash-flow
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un restaurateur qui commande 200 bouteilles d'avance pour 2 mois immobilise souvent
              2 000 a 4 000 EUR inutilement. Cet argent dormant ne genere pas de CA, alors qu'il
              pourrait servir a financer du personnel, du marketing, ou un nouveau service. La
              gestion de rotation de cave est l'un des leviers de cash-flow les plus negliges en
              restauration.
            </p>

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 my-6 font-mono text-sm text-teal-900">
              <strong>Formule :</strong><br />
              Taux de rotation = Ventes annuelles (en valeur) / Stock moyen (en valeur)
            </div>

            <p>
              Un bon taux de rotation se situe entre <strong>8 et 12 fois par an</strong>, soit 4 a
              6 semaines de stock maximum. En dessous de 6 rotations, votre cave est trop chargee.
              Au-dessus de 15, vous risquez la rupture de stock sur les references qui marchent.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Methode pour assainir votre cave (audit 90 jours)</h3>
          </div>

          <ol className="list-decimal pl-6 space-y-3 text-mono-350 mt-6 leading-relaxed">
            <li>
              <strong>Listez toutes vos bouteilles</strong> avec leur date d'entree en stock,
              quantite restante, prix d'achat, prix de vente, marge brute. Utilisez un outil dedie
              ou un tableur structure.
            </li>
            <li>
              <strong>Identifiez les references immobiles depuis 60 jours.</strong> Calculez les
              rotations annualisees : si une reference vendue 3 fois en 90 jours, c'est 12 ventes/an
              -- a comparer au seuil minimum de 100 ventes/an (2/semaine).
            </li>
            <li>
              <strong>Categorisez les references en 3 buckets</strong> : "Stars" (rotation rapide,
              forte marge), "Vaches a lait" (rotation moyenne, marge correcte, fond de carte),
              "Poids morts" (rotation faible). Les poids morts doivent etre soldes.
            </li>
            <li>
              <strong>Solde les poids morts</strong> en "selection du sommelier" du jour, en accord
              avec le menu du jour, ou en happy hour. Acceptez de baisser le coefficient a 2,5x
              pour ecouler le stock plutot que de l'immobiliser.
            </li>
            <li>
              <strong>Ne recommandez jamais une nouvelle reference</strong> sans avoir d'abord
              ecoule le stock existant. Cette discipline evite l'effet boule de neige des stocks
              morts qui s'accumulent.
            </li>
          </ol>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">La regle FIFO appliquee a la cave</h3>
            <p>
              Marquez vos clayettes avec les dates d'entree en stock. Servez systematiquement les
              bouteilles les plus anciennes en premier. Cette regle FIFO (First In, First Out)
              evite les bouteilles oubliees en fond de cave et les surprises a l'inventaire.
              Decouvrez le principe complet dans notre article sur <Link to="/blog/methode-fifo-gestion-stocks-restaurant" className="text-teal-700 underline hover:text-teal-800">la methode FIFO en restauration</Link>.
            </p>
          </div>

          <Callout type="info">
            <strong>Logiciel de gestion de cave :</strong> au-dela de 50 references, investissez
            dans un outil dedie (Cellar Tracker, Vinexpo Cellar Manager, ou module integre RestauMargin).
            ROI tres rapide : -30 % de stocks morts en moyenne, gain de 800 a 2 500 EUR/an de cash
            libere. L'outil paie son cout des le 2e mois.
          </Callout>
        </section>

        {/* ═════════════ SECTION 9 : Presentation ═════════════ */}
        <section id="presentation" className="mb-16">
          <SectionHeading icon={<Eye className="w-6 h-6" />} number="9">
            Presenter votre carte des vins pour vendre plus
          </SectionHeading>

          <div className="prose-content">
            <p>
              La position d'un vin sur la carte influence jusqu'a <strong>30 % de la decision
              d'achat</strong> selon les etudes en neuromarketing restauration (Wansink 2017, mise
              a jour Cornell 2023). Une mise en page mediocre peut diviser par 2 vos ventes d'une
              meme bouteille. Voici les principes de presentation a maitriser.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">A faire</h3>
              </div>
              <ul className="space-y-2 text-sm text-emerald-800 leading-relaxed">
                <li>Integrer les prix dans la description (pas en colonne)</li>
                <li>Mettre les vins rentables en 2e position</li>
                <li>Descriptions de 1 a 2 lignes max</li>
                <li>Encadre "Coup de coeur" avec 3-4 vins</li>
                <li>Organisation par couleur puis gamme</li>
                <li>Mentionner le vigneron quand pertinent</li>
                <li>Format compact A4 + carte digitale QR code</li>
                <li>Mises a jour 2x/an minimum</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-700" />
                <h3 className="font-bold text-red-900">A eviter</h3>
              </div>
              <ul className="space-y-2 text-sm text-red-800 leading-relaxed">
                <li>Prix en colonne droite (focalise l'attention)</li>
                <li>Bordeaux en haut de page systematiquement</li>
                <li>Descriptions techniques (Ph, sulfites, etc.)</li>
                <li>Carte de 100+ references sans hierarchisation</li>
                <li>Police trop petite (sub-10pt)</li>
                <li>Vins epuises laisses sur la carte</li>
                <li>Format A3 plie en 6 (trop encombrant)</li>
                <li>Memorisation impossible par les serveurs</li>
              </ul>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">La regle de la deuxieme position</h3>
            <p>
              Quand un client hesite entre plusieurs vins d'une meme categorie, <strong>40 % choisissent
              la deuxieme option</strong> de la liste (etude Cornell 2021). Placez donc vos vins
              les plus rentables (ceux a forte marge unitaire et bonne rotation) en deuxieme
              position de chaque section, pas en premiere. C'est un principe gratuit qui ameliore
              le mix de marge brute de 5 a 8 % en 6 mois.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 10 : Cas pratique ═════════════ */}
        <section id="cas" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="10">
            Cas pratique chiffre : brasserie 80 couverts a Lille
          </SectionHeading>

          <div className="prose-content">
            <p>
              Decortiquons l'impact d'une carte des vins refondue sur une brasserie lilloise de
              80 couverts. Ce cas est inspire d'un client RestauMargin, anonymise.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Etat initial (avant refonte)</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-mono-350 text-sm">
              <li>120 references (trop nombreuses, beaucoup de doublons)</li>
              <li>Stock cave : 6 800 EUR (12 semaines = rotation 4,3x/an, trop bas)</li>
              <li>Ratio boissons / CA : 18 % (faible)</li>
              <li>CA vins annuel : 156 000 EUR</li>
              <li>Marge brute moyenne vins : 58 % (en dessous du benchmark)</li>
              <li>Marge brute vins annuelle : 90 480 EUR</li>
              <li>Stocks morts identifies : 1 800 EUR (27 references mortes)</li>
            </ul>
          </div>

          <div className="mt-6 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Actions de refonte (mois 1 a 4)</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-mono-350 text-sm">
              <li>Reduction a 50 references (selection plus stricte, suppression doublons)</li>
              <li>Ajustement coefficients : +0,3 sur l'entree de gamme, +0,2 sur le milieu</li>
              <li>Refonte presentation carte (prix integres, descriptions courtes)</li>
              <li>Formation equipe salle aux 5 accords mets-vins cles (1 session 30 min)</li>
              <li>Mise en avant "Coup de coeur du sommelier" sur 4 references rotatives</li>
              <li>Activation FIFO en cave + marquage dates entree</li>
              <li>Solde des 27 references mortes en "selection 25 % off"</li>
            </ul>
          </div>

          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-emerald-900 mb-4 text-lg">Resultats apres 12 mois</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-emerald-800 text-sm">
              <li>50 references actives (rotation moyenne <strong>9,2x/an</strong>)</li>
              <li>Stock cave : <strong>3 400 EUR</strong> (-50 % de cash immobilise)</li>
              <li>Ratio boissons / CA : <strong>28 %</strong> (+10 points)</li>
              <li>CA vins annuel : <strong>248 000 EUR</strong> (+59 %)</li>
              <li>Marge brute moyenne vins : <strong>69 %</strong> (+11 points)</li>
              <li>Marge brute vins annuelle : <strong>171 120 EUR</strong> (+80 640 EUR)</li>
              <li>Taux d'attachement boissons : <strong>92 % des couverts</strong> (vs 68 % avant)</li>
              <li>Cash libere via reduction stock : <strong>3 400 EUR</strong></li>
            </ul>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Bilan financier :</strong> investissement total dans la refonte (consultant
              sommelier + outils + formation) : 2 800 EUR. Gain de marge brute additionnelle :
              80 640 EUR sur 12 mois. ROI : <strong>28x</strong>. Et c'est sans compter le cash
              libere par la reduction du stock immobilise. Une refonte de carte des vins reussie
              est l'un des meilleurs investissements qu'un restaurant puisse faire.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 11 : Erreurs ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="11">
            Les 6 erreurs qui plombent une carte des vins
          </SectionHeading>

          <div className="space-y-6 mt-8">
            <ErreurCard
              number={1}
              title="Carte trop longue : 100+ references"
              desc="Le paradoxe du choix paralyse le client : il commande la bouteille qu'il connait deja, generalement la moins rentable. Au-dessus de 60 references, vous diluez les ventes sans gagner en couverture. Resserrez a 30-50 references bien selectionnees : vos ventes augmenteront mecaniquement de 15-25 %."
            />
            <ErreurCard
              number={2}
              title="Coefficient unique applique a toute la carte"
              desc="Appliquer un coefficient de 4x sur toutes les bouteilles (du Cotes-du-Rhone a 5 EUR achat au Grand Cru a 80 EUR achat) tue la carte premium : un Grand Cru a 320 EUR TTC ne se vendra jamais. Modulez : 4-5x sur entree, 3-3,5x sur milieu, 2,5-3x sur premium, 2-2,5x sur tres haute gamme. Sinon vous perdez les ventes a forte marge unitaire."
            />
            <ErreurCard
              number={3}
              title="Vins epuises laisses sur la carte"
              desc="Quand un serveur doit annoncer 'desolé, on n'a plus ce vin', le client est decu et choisit souvent une option moins chere par frustration. Mettez a jour votre carte chaque semaine. Outil simple : un sticker rouge sur la version table le temps de la reimpression. Au-dela de 3 refs epuisees, refondez la carte."
            />
            <ErreurCard
              number={4}
              title="Equipe de salle non formee sur la carte"
              desc="Si vos serveurs ne connaissent pas les 10 references les plus rentables, ne savent pas proposer un accord met-vin, ou ne maitrisent pas les bases de la sommellerie, votre carte ne sera vendue qu'a 60 % de son potentiel. 1 heure de formation par mois + un cahier des accords plastifie en cuisine = +15-20 % de CA boissons."
            />
            <ErreurCard
              number={5}
              title="Carte de bordeaux dans un restaurant mediterraneen"
              desc="L'erreur la plus frequente : la carte ne correspond pas a la cuisine. Un Saint-Estephe puissant n'accompagne pas un risotto aux fruits de mer ou un tajine d'agneau. Verifiez chaque reference contre votre menu : si l'accord n'est pas evident, supprimez-la. La coherence cuisine-cave augmente les ventes de 20 % en 6 mois."
            />
            <ErreurCard
              number={6}
              title="Pas de suivi de rotation : stocks morts qui s'accumulent"
              desc="Sans audit trimestriel de rotation, les references mortes s'accumulent et finissent par representer 15-25 % du stock en valeur. C'est du cash immobilise qui pourrait servir a autre chose. Faites un audit chaque 90 jours : listez, identifiez les < 100 ventes/an, soldez-les en 'selection du sommelier' a -25 %."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumule :</strong> ces 6 erreurs combinees peuvent reduire votre marge
            brute carte des vins de 12 a 20 points. Sur une brasserie qui fait 200 000 EUR de CA
            vins, c'est <strong>24 000 a 40 000 EUR de marge brute perdue par an</strong>. La
            discipline d'execution est ce qui distingue une carte rentable d'une carte mediocre.
          </Callout>
        </section>

        <BlogAuthor publishedDate="2026-05-22" updatedDate="2026-05-26" readTime="13 min" variant="footer" />

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Optimisez la rentabilite de votre carte des vins
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin centralise le suivi de votre cave : coefficients, marges brutes par
              reference, rotation, stocks morts. Identifiez les bouteilles qui tirent vos profits
              vers le bas et celles qui marchent.
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
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </section>

        {/* Articles complementaires */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant</h3>
              <p className="text-xs text-mono-500">Food cost, marge brute et nette : guide complet.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Coefficient multiplicateur</h3>
              <p className="text-xs text-mono-500">Methode complete par categorie.</p>
            </Link>
            <Link to="/blog/menu-engineering-boston-matrix" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Menu engineering</h3>
              <p className="text-xs text-mono-500">Stars, vaches a lait, dilemmes, poids morts.</p>
            </Link>
            <Link to="/blog/augmenter-ticket-moyen-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Augmenter le ticket moyen</h3>
              <p className="text-xs text-mono-500">10 leviers d'upsell et cross-sell.</p>
            </Link>
            <Link to="/blog/methode-fifo-gestion-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Methode FIFO restaurant</h3>
              <p className="text-xs text-mono-500">Rotation, gaspillage, peremption.</p>
            </Link>
            <Link to="/blog/fideliser-clients-restaurant-strategies" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Fideliser ses clients restaurant</h3>
              <p className="text-xs text-mono-500">Programmes, CRM, anniversaires, KPI.</p>
            </Link>
            <Link to="/blog/taux-occupation-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Taux d'occupation restaurant</h3>
              <p className="text-xs text-mono-500">Calcul, benchmarks et 8 leviers.</p>
            </Link>
            <Link to="/login" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Essayer RestauMargin</h3>
              <p className="text-xs text-mono-500">Essai gratuit 7 jours, sans engagement.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* Footer */}
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
