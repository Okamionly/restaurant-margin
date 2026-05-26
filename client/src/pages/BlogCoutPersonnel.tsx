import { Link } from 'react-router-dom';
import {
  ChefHat,
  BookOpen,
  Users,
  Calendar,
  TrendingDown,
  ArrowRight,
  Calculator,
  Percent,
  Target,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  ListChecks,
  Award,
  FileText,
  Zap,
  Sparkles,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Coût personnel restaurant & masse salariale 2026"
   Mots-clés cibles :
     - coût personnel restaurant
     - masse salariale restauration
     - ratio masse salariale CA HT
     - convention HCR 2026 grille salaire
     - charges patronales restauration 2026
   ~3 200 mots — mode clair, fond blanc, theme W&B teal-600
   Date : 2026-05-26
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quel est le bon ratio coût personnel / CA HT en restauration ?",
    answer:
      "Le ratio cible se situe entre 30 et 35 % du CA HT pour une brasserie ou un bistrot classique, 28-32 % pour le fast-casual et la restauration rapide, et 35-40 % pour la gastronomie. Au-delà de 40 % dans un restaurant traditionnel, votre rentabilité est compromise : il faut intervenir sur le planning, la productivité ou la carte avant tout autre poste.",
  },
  {
    question: "Comment calculer la masse salariale d'un restaurant ?",
    answer:
      "Masse salariale = somme des salaires bruts annuels + charges patronales (42 à 45 % du brut) + avantages en nature (repas, mutuelle, primes). Exemple : un employé à 22 000 EUR brut/an coûte environ 33 400 EUR à l'employeur, soit 37 % de plus que le salaire affiché. La masse salariale réelle se calcule en additionnant ce coût total employé pour chaque membre de l'équipe.",
  },
  {
    question: "Quelles sont les charges patronales en restauration en 2026 ?",
    answer:
      "Les charges patronales en restauration HCR représentent environ 42 à 45 % du salaire brut en 2026. Elles comprennent les cotisations URSSAF (maladie, vieillesse, allocations familiales), la retraite complémentaire AGIRC-ARRCO, l'assurance chômage, la formation professionnelle (1,68 %), la taxe d'apprentissage (0,68 %) et la contribution OPCO. La réduction Fillon ramène ce taux à environ 24-28 % sur les bas salaires (jusqu'à 1,6 SMIC).",
  },
  {
    question: "Quelle est la grille de salaire HCR 2026 ?",
    answer:
      "La convention collective HCR (IDCC 1979) fixe les minimums conventionnels selon 5 niveaux et 4 échelons. Niveau 1 (employé débutant) : environ 1 800 EUR brut/mois. Niveau 2 (employé qualifié) : 1 850 à 1 950 EUR. Niveau 3 (chef de partie, maître d'hôtel) : 2 000 à 2 300 EUR. Niveau 4 (sous-chef) : 2 400 à 2 800 EUR. Niveau 5 (chef de cuisine, directeur) : 2 900 EUR et plus. Ces grilles sont revalorisées chaque année selon l'inflation et le SMIC.",
  },
  {
    question: "Comment réduire la masse salariale sans licencier ?",
    answer:
      "Trois leviers principaux : optimiser le planning par tranches horaires (analyser les flux réels de fréquentation pour ajuster les prises de poste), réduire le turnover (chaque départ coûte 2 000 à 4 000 EUR de recrutement et formation), et améliorer la productivité par la formation (un employé bien formé sert 20 % de couverts en plus à effectif égal). Ces actions combinées permettent d'économiser 10 à 20 % de masse salariale sans toucher aux effectifs.",
  },
  {
    question: "Combien de couverts un serveur peut-il gérer ?",
    answer:
      "En restauration traditionnelle, un serveur expérimenté gère 20 à 30 couverts par service. En brasserie ou bistrot rapide, ce chiffre monte à 35-50 couverts grâce au flux. En gastronomie, on descend à 12-18 couverts pour garantir le niveau de service. Le ratio couverts/serveur est un KPI essentiel : s'il chute, le coût de service par couvert explose mécaniquement.",
  },
  {
    question: "Qu'est-ce qu'un CDDU et quand l'utiliser ?",
    answer:
      "Le CDDU (Contrat à Durée Déterminée d'Usage), aussi appelé contrat d'extra, permet d'embaucher un salarié pour un seul service ou une journée. Il est légal dans la restauration grâce à la convention HCR. Idéal pour absorber les pics du week-end ou les événements ponctuels sans sur-embaucher en CDI. Coût : salaire + 10 % de prime de précarité + 10 % de congés payés.",
  },
  {
    question: "Quelle est la productivité moyenne en restauration (CA / heure travaillée) ?",
    answer:
      "Le CA par heure travaillée varie selon le segment : 45 à 65 EUR/h en bistrot, 55 à 80 EUR/h en brasserie, 80 à 120 EUR/h en gastronomie (ticket moyen élevé), 35 à 55 EUR/h en restauration rapide. C'est le meilleur indicateur de productivité d'une équipe. Si ce chiffre stagne ou baisse, votre planning n'est pas calé sur les flux réels.",
  },
  {
    question: "Comment calculer le coût total employé (CTE) ?",
    answer:
      "CTE = Salaire brut + Charges patronales + Mutuelle + Repas (180 jours × 4,15 EUR) + Heures supp. majorées + Primes + Formation. Pour un employé à 22 000 EUR brut, le CTE atteint environ 33 400 EUR, soit 37 % de plus. C'est ce chiffre qu'il faut utiliser pour calculer votre vraie masse salariale et votre ratio coût personnel / CA HT.",
  },
  {
    question: "Quelles aides à l'embauche existent en restauration en 2026 ?",
    answer:
      "Plusieurs dispositifs : réduction Fillon (allègement de charges sur bas salaires jusqu'à 1,6 SMIC), aide à l'apprentissage (6 000 EUR la première année), contrat de professionnalisation (aide OPCO + exonération partielle), prime d'embauche zone QPV/ZRR (1 500 à 4 000 EUR), aide AGEFIPH pour travailleur handicapé. Renseignez-vous auprès de votre expert-comptable : ces aides peuvent réduire significativement votre coût employeur.",
  },
];

export default function BlogCoutPersonnel() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Coût personnel restaurant 2026 : ratios, masse salariale, optimisation"
        description="Guide complet du coût personnel en restauration : ratio cible 30-35 % CA HT, masse salariale, charges patronales 2026, grille HCR, productivité et 5 leviers d'optimisation."
        path="/blog/reduire-cout-personnel-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Coût personnel restaurant', url: 'https://www.restaumargin.fr/blog/reduire-cout-personnel-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment calculer et optimiser le coût personnel de votre restaurant',
            description:
              "Méthode pas-à-pas pour calculer la masse salariale réelle d'un restaurant, déterminer le ratio coût personnel / CA HT et identifier les leviers d'optimisation sans licenciement.",
            totalTime: 'PT30M',
            tool: ['Logiciel de paie', 'Données de caisse (CA par heure)', 'Tableur ou RestauMargin'],
            step: [
              {
                '@type': 'HowToStep',
                name: 'Lister tous les salariés et leurs salaires bruts annuels',
                text:
                  "Inventoriez chaque membre de l'équipe (cuisine, salle, plonge, encadrement) avec son contrat (CDI, CDD, CDDU, apprenti) et son salaire brut annuel.",
              },
              {
                '@type': 'HowToStep',
                name: 'Ajouter les charges patronales (42-45 % du brut)',
                text:
                  "Pour chaque salarié, ajoutez 42 à 45 % de charges patronales (URSSAF, retraite, chômage, formation). La réduction Fillon ramène ce taux à 24-28 % sur les salaires jusqu'à 1,6 SMIC.",
              },
              {
                '@type': 'HowToStep',
                name: 'Intégrer les avantages en nature et primes',
                text:
                  "Ajoutez les repas (180 jours × 4,15 EUR = 747 EUR/an), la mutuelle obligatoire, les heures supplémentaires majorées (25 % puis 50 %) et les primes (présence, ancienneté, partage des pourboires).",
              },
              {
                '@type': 'HowToStep',
                name: 'Calculer le ratio masse salariale / CA HT',
                text:
                  "Divisez la masse salariale totale (coût total employé pour toute l'équipe) par votre CA HT annuel, multipliez par 100. Comparez à la cible de votre segment (30-35 % brasserie, 28-32 % fast-casual, 35-40 % gastronomie).",
              },
              {
                '@type': 'HowToStep',
                name: 'Identifier les leviers d\'optimisation',
                text:
                  "Si vous dépassez la cible : optimisez le planning (analyse flux par tranches), réduisez le turnover (chaque départ coûte 2 000 à 4 000 EUR), formez l'équipe (productivité +15-20 %), utilisez les CDDU pour les pics et chassez les heures creuses.",
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline:
              'Coût personnel restaurant 2026 : ratios, masse salariale et leviers d\'optimisation',
            description:
              "Guide complet du coût personnel en restauration : définition, ratio cible par type, calcul de la masse salariale, grille HCR 2026, charges patronales, productivité et optimisation sans licenciement.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: {
              '@type': 'Organization',
              name: 'La rédaction RestauMargin',
              url: 'https://www.restaumargin.fr/a-propos',
            },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-27',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.restaumargin.fr/blog/reduire-cout-personnel-restaurant',
            },
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
              to="/login?mode=register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Essai gratuit
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
          <span className="text-mono-100 font-medium">Coût personnel restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="RH & Paie"
        readTime="16 min"
        date="Mai 2026"
        title="Coût personnel restaurant : ratios, masse salariale et optimisation 2026"
        accentWord="coût personnel"
        subtitle="Définition, calcul, ratio cible 30-35 % du CA HT, grille HCR 2026, charges patronales et 5 leviers pour économiser 10 à 20 % de masse salariale sans licencier."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="16 min" variant="header" />

        {/* ── Encadré formule rapide (featured snippet) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
              Formules essentielles coût personnel
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">À retenir absolument</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Ratio coût personnel (%)</strong> = (Masse salariale totale / CA HT) × 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Coût total employé</strong> = Salaire brut × 1,43 (charges 43 %) + repas + primes</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Productivité</strong> = CA HT / Heures travaillées (cible 50-80 EUR/h en brasserie)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Prime cost</strong> = Coût matières + Coût personnel (cible &lt; 65 % CA HT)</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectifs 2026 : 30-35 % en brasserie, 28-32 % en fast-casual, 35-40 % en gastronomie.
            Au-delà : restructurez le planning avant tout licenciement.
          </p>
        </div>

        {/* ── Table des matières ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#definition', label: 'Qu\'est-ce que le coût personnel en restauration ?' },
              { href: '#ratio', label: 'Ratio coût personnel / CA HT : objectifs par type' },
              { href: '#calcul', label: 'Calcul de la masse salariale en 5 étapes' },
              { href: '#hcr', label: 'Convention HCR 2026 : grille des salaires minimums' },
              { href: '#charges', label: 'Charges patronales restauration 2026 : chiffres complets' },
              { href: '#optimisation', label: 'Optimisation : planning, polyvalence, CDDU' },
              { href: '#productivite', label: 'Productivité : CA/heure et couverts/serveur' },
              { href: '#benchmarks', label: 'Benchmarks par type de restaurant' },
              { href: '#erreurs', label: 'Les 5 erreurs qui font exploser la masse salariale' },
              { href: '#faq', label: 'FAQ : 10 questions essentielles' },
              { href: '#cta', label: 'Piloter ses coûts avec RestauMargin' },
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
          <SectionHeading icon={<FileText className="w-6 h-6" />} number="1">
            Qu'est-ce que le coût personnel en restauration ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>coût personnel</strong> (parfois appelé masse salariale chargée ou coût total
              employé) regroupe l'intégralité des dépenses liées aux ressources humaines de votre
              restaurant. Contrairement au simple salaire brut affiché sur la fiche de paie, le coût
              personnel réel intègre les charges patronales, les avantages en nature, les heures
              supplémentaires majorées, la formation et les frais indirects de gestion du personnel.
            </p>
            <p>
              En 2026, dans un secteur où le SMIC a été revalorisé plusieurs fois consécutives et où
              les charges sociales pèsent lourd, comprendre la structure exacte de ce coût n'est plus
              optionnel. C'est le poste numéro un dans 80 % des restaurants traditionnels, devant
              même les matières premières.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Les 7 composantes du coût personnel</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Salaires bruts</strong> (CDI, CDD, CDDU, apprentis, alternants)</li>
              <li><strong>Charges patronales</strong> (URSSAF, retraite, chômage, formation) : 42-45 % du brut</li>
              <li><strong>Avantages en nature</strong> : repas (4,15 EUR/jour en 2026), mutuelle, logement éventuel</li>
              <li><strong>Heures supplémentaires</strong> majorées (25 % puis 50 % au-delà de la 43ème heure)</li>
              <li><strong>Primes</strong> : ancienneté, présence, partage des pourboires, treizième mois éventuel</li>
              <li><strong>Formation professionnelle</strong> : 1,68 % du brut (taxe + cotisation OPCO)</li>
              <li><strong>Coûts indirects</strong> : recrutement, intérim, médecine du travail, équipements (tenues, chaussures)</li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Exemple concret :</strong> un employé à 22 000 EUR brut/an coûte en réalité environ
            33 400 EUR à l'employeur, soit <strong>37 % de plus</strong> que le brut affiché. Pour un
            restaurant de 6 employés, cela représente environ 200 000 EUR de coût réel annuel — bien
            au-delà de la simple addition des salaires bruts.
          </Callout>

          <div className="prose-content mt-6">
            <p>
              Cette différence entre salaire brut et coût total employé est ce qui plombe le plus
              souvent la rentabilité des restaurateurs débutants. Pour un calcul précis de votre
              <Link to="/blog/charges-sociales-restauration" className="text-teal-700 underline hover:text-teal-800 ml-1">
                charges sociales en restauration
              </Link>, consultez notre guide dédié.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Ratio CA HT ═════════════ */}
        <section id="ratio" className="mb-16">
          <SectionHeading icon={<Percent className="w-6 h-6" />} number="2">
            Ratio coût personnel / CA HT : les objectifs par type de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le ratio coût personnel sur chiffre d'affaires hors taxes est <strong>l'indicateur
              numéro un</strong> de la rentabilité d'un restaurant. Il mesure quelle part de chaque
              euro encaissé est consacrée à la rémunération de l'équipe (au sens large : salaires +
              charges + avantages).
            </p>
            <p>
              <strong>Formule :</strong> Ratio coût personnel (%) = (Masse salariale totale chargée / CA HT) × 100
            </p>
            <p>
              Ce ratio doit toujours se calculer en HT (hors taxes), jamais en TTC. La TVA collectée
              ne vous appartient pas, elle est reversée à l'État. La calculer dans le ratio fausserait
              artificiellement la lecture (vous paraîtrez plus performant que la réalité).
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <RatioCard
              type="Fast-casual / Rapide"
              ratio="28-32 %"
              color="emerald"
              description="Service limité, ticket moyen 10-15 EUR, forte rotation. Marge sur volume."
            />
            <RatioCard
              type="Brasserie / Bistrot"
              ratio="30-35 %"
              color="teal"
              description="Standard de la profession. Carte large, service complet, ticket 18-30 EUR."
            />
            <RatioCard
              type="Gastronomique"
              ratio="35-40 %"
              color="amber"
              description="Service haut de gamme, brigade structurée, ticket 60-150 EUR. Ratio plus élevé accepté."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Lecture du ratio :</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li>
                <strong>En dessous de 25 %</strong> : excellent, mais vérifiez la qualité de service
                (sous-effectif fréquent dans cette zone)
              </li>
              <li>
                <strong>25-35 %</strong> : zone saine, vous êtes dans les standards de votre segment
              </li>
              <li>
                <strong>35-40 %</strong> : sous surveillance, identifiez les heures creuses et le
                turnover
              </li>
              <li>
                <strong>Au-delà de 40 %</strong> dans une brasserie ou un bistrot : alerte rouge, la
                rentabilité est compromise. Restructuration immédiate nécessaire.
              </li>
            </ul>
            <p className="mt-4">
              Combiné au food cost, le ratio coût personnel forme le <strong>prime cost</strong>, qui
              ne devrait jamais dépasser 65-70 % du CA HT. Pour comprendre cette notion essentielle,
              lisez notre guide complet sur le
              <Link to="/blog/prime-cost-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">
                prime cost en restauration
              </Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Calcul step-by-step ═════════════ */}
        <section id="calcul" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="3">
            Calcul de la masse salariale en 5 étapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la méthode rigoureuse pour calculer votre masse salariale réelle, applicable à
              tout restaurant. Comptez environ 30 minutes la première fois, puis 5-10 minutes par
              mois pour la mise à jour.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Inventorier tous les contrats actifs',
                body:
                  "Listez chaque salarié avec son nom, son poste, son type de contrat (CDI, CDD, CDDU, apprentissage, professionnalisation, alternance), sa quotité de travail (35h, 39h, temps partiel) et sa rémunération brute mensuelle. N'oubliez pas les apprentis (rémunération à 27-100 % du SMIC selon âge et année) et les extras occasionnels.",
              },
              {
                title: 'Calculer les salaires bruts annuels',
                body:
                  "Multipliez le brut mensuel par 12 (ou 13 si treizième mois conventionnel). Pour les CDDU et extras, additionnez les payes ponctuelles de l'année. Intégrez les augmentations prévues (revalorisation SMIC en janvier, augmentations conventionnelles).",
              },
              {
                title: 'Appliquer les charges patronales',
                body:
                  "Multipliez chaque salaire brut par 1,43 (charges patronales moyennes 43 % en restauration). Pour les salaires jusqu'à 1,6 SMIC (environ 2 800 EUR brut en 2026), appliquez la réduction Fillon : taux effectif autour de 1,27 (27 % de charges au lieu de 43 %).",
              },
              {
                title: 'Ajouter les avantages en nature et primes',
                body:
                  "Repas : 180 jours × 4,15 EUR = 747 EUR/an par salarié à temps plein. Mutuelle obligatoire : environ 35-60 EUR/mois employeur. Heures supp. majorées : 25 % au-delà de 35h jusqu'à 43h, puis 50 %. Primes (ancienneté, présence, treizième mois conventionnel) : variables.",
              },
              {
                title: 'Calculer le ratio masse salariale / CA HT',
                body:
                  "Additionnez tous les coûts totaux employés pour obtenir la masse salariale annuelle chargée. Divisez par le CA HT annuel, multipliez par 100. Comparez à la cible de votre segment (30-35 % brasserie, 28-32 % fast-casual, 35-40 % gastronomie).",
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

          {/* Exemple chiffré */}
          <div className="mt-10 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Exemple : bistrot 600 000 EUR de CA HT, 6 employés</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-white text-mono-350 border-b border-mono-900">
                    <th className="text-left py-2 px-3 font-semibold">Poste</th>
                    <th className="text-right py-2 px-3 font-semibold">Brut annuel</th>
                    <th className="text-right py-2 px-3 font-semibold">Charges 43 %</th>
                    <th className="text-right py-2 px-3 font-semibold">Avantages</th>
                    <th className="text-right py-2 px-3 font-semibold">CTE</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr><td className="py-2 px-3">Chef de cuisine</td><td className="py-2 px-3 text-right">36 000 EUR</td><td className="py-2 px-3 text-right">15 480 EUR</td><td className="py-2 px-3 text-right">1 200 EUR</td><td className="py-2 px-3 text-right font-bold">52 680 EUR</td></tr>
                  <tr><td className="py-2 px-3">Second / commis</td><td className="py-2 px-3 text-right">22 000 EUR</td><td className="py-2 px-3 text-right">9 460 EUR</td><td className="py-2 px-3 text-right">900 EUR</td><td className="py-2 px-3 text-right font-bold">32 360 EUR</td></tr>
                  <tr><td className="py-2 px-3">Plongeur</td><td className="py-2 px-3 text-right">21 600 EUR</td><td className="py-2 px-3 text-right">5 400 EUR (Fillon)</td><td className="py-2 px-3 text-right">800 EUR</td><td className="py-2 px-3 text-right font-bold">27 800 EUR</td></tr>
                  <tr><td className="py-2 px-3">Maître d'hôtel</td><td className="py-2 px-3 text-right">28 000 EUR</td><td className="py-2 px-3 text-right">12 040 EUR</td><td className="py-2 px-3 text-right">1 100 EUR</td><td className="py-2 px-3 text-right font-bold">41 140 EUR</td></tr>
                  <tr><td className="py-2 px-3">Serveur (CDI)</td><td className="py-2 px-3 text-right">22 000 EUR</td><td className="py-2 px-3 text-right">9 460 EUR</td><td className="py-2 px-3 text-right">900 EUR</td><td className="py-2 px-3 text-right font-bold">32 360 EUR</td></tr>
                  <tr><td className="py-2 px-3">Serveur (CDI)</td><td className="py-2 px-3 text-right">21 600 EUR</td><td className="py-2 px-3 text-right">5 400 EUR (Fillon)</td><td className="py-2 px-3 text-right">800 EUR</td><td className="py-2 px-3 text-right font-bold">27 800 EUR</td></tr>
                  <tr className="bg-teal-50 border-t-2 border-teal-300">
                    <td className="py-3 px-3 font-bold text-mono-100">Total masse salariale</td>
                    <td className="py-3 px-3 text-right font-bold">151 200 EUR</td>
                    <td className="py-3 px-3 text-right font-bold">57 240 EUR</td>
                    <td className="py-3 px-3 text-right font-bold">5 700 EUR</td>
                    <td className="py-3 px-3 text-right font-extrabold text-teal-700">214 140 EUR</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-mono-400">
              <strong>Ratio masse salariale / CA HT</strong> = 214 140 / 600 000 × 100 =
              <strong className="text-teal-700"> 35,7 %</strong> — légèrement au-dessus de la cible bistrot
              (30-35 %), à surveiller. Pistes : optimiser le planning du midi en semaine, vérifier la
              productivité du plongeur (polyvalence possible ?), réduire les heures supp.
            </p>
          </div>

          <Callout type="info">
            <strong>Astuce :</strong> RestauMargin intègre un module de pilotage RH qui calcule
            automatiquement votre ratio masse salariale / CA HT en temps réel, à partir de vos données
            de paie et de caisse. Plus besoin de refaire ce tableau chaque mois.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : HCR 2026 ═════════════ */}
        <section id="hcr" className="mb-16">
          <SectionHeading icon={<FileText className="w-6 h-6" />} number="4">
            Convention HCR 2026 : grille des salaires minimums
          </SectionHeading>

          <div className="prose-content">
            <p>
              La <strong>convention collective HCR</strong> (Hôtels, Cafés, Restaurants — IDCC 1979)
              régit les conditions de travail et les minimums conventionnels dans la restauration en
              France. Elle s'applique automatiquement à votre établissement dès lors que votre code
              NAF est lié à la restauration (56.10A, 56.10B, 56.30Z, etc.).
            </p>
            <p>
              Les minimums conventionnels sont structurés en <strong>5 niveaux et 4 échelons</strong>,
              correspondant à des niveaux de qualification et de responsabilité croissants. Ils sont
              revalorisés chaque année par avenant, généralement en lien avec la hausse du SMIC.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Niveau</th>
                  <th className="text-left py-3 px-4 font-semibold">Profils types</th>
                  <th className="text-center py-3 px-4 font-semibold">Brut mensuel min. 2026</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Coût employeur (charges)</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Niveau 1</td>
                  <td className="py-3 px-4">Employé débutant, plongeur, commis débutant</td>
                  <td className="py-3 px-4 text-center">1 800 EUR</td>
                  <td className="py-3 px-4 text-center">≈ 2 290 EUR</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-medium text-mono-100">Niveau 2</td>
                  <td className="py-3 px-4">Employé qualifié, commis confirmé, serveur</td>
                  <td className="py-3 px-4 text-center">1 850 - 1 950 EUR</td>
                  <td className="py-3 px-4 text-center">≈ 2 350 - 2 480 EUR</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Niveau 3</td>
                  <td className="py-3 px-4">Chef de partie, maître d'hôtel, chef de rang</td>
                  <td className="py-3 px-4 text-center">2 000 - 2 300 EUR</td>
                  <td className="py-3 px-4 text-center">≈ 2 860 - 3 290 EUR</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-medium text-mono-100">Niveau 4</td>
                  <td className="py-3 px-4">Sous-chef, second de cuisine, responsable salle</td>
                  <td className="py-3 px-4 text-center">2 400 - 2 800 EUR</td>
                  <td className="py-3 px-4 text-center">≈ 3 430 - 4 000 EUR</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Niveau 5</td>
                  <td className="py-3 px-4">Chef de cuisine, directeur de restaurant</td>
                  <td className="py-3 px-4 text-center">2 900 EUR et +</td>
                  <td className="py-3 px-4 text-center">≈ 4 150 EUR et +</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Particularités HCR à connaître</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li>
                <strong>Durée du travail</strong> : 39h hebdomadaires par défaut (les 4h au-delà de 35h sont
                payées en heures supp. majorées 10 %)
              </li>
              <li>
                <strong>2 jours de repos consécutifs</strong> obligatoires pour les jeunes (-21 ans),
                non consécutifs autorisés pour les adultes
              </li>
              <li>
                <strong>Coupures</strong> : compensées par une indemnité spécifique (environ 10 EUR par coupure)
              </li>
              <li>
                <strong>Repas du personnel</strong> : 2 repas/jour minimum si l'horaire englobe les repas,
                valorisés 4,15 EUR/repas en 2026 (avantage en nature)
              </li>
              <li>
                <strong>Ancienneté</strong> : prime conventionnelle après 3, 6, 10 et 15 ans (1 à 6 % du minimum)
              </li>
              <li>
                <strong>CDDU autorisé</strong> grâce à la convention HCR (contrats à durée déterminée d'usage,
                aussi appelés "extras")
              </li>
            </ul>
            <p className="mt-4">
              Pour rédiger correctement vos contrats conformément à la HCR, consultez notre
              <Link to="/blog/contrat-travail-restauration-guide" className="text-teal-700 underline hover:text-teal-800 ml-1">
                guide du contrat de travail en restauration
              </Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Charges patronales 2026 ═════════════ */}
        <section id="charges" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="5">
            Charges patronales restauration 2026 : chiffres complets
          </SectionHeading>

          <div className="prose-content">
            <p>
              Les <strong>charges patronales</strong> (aussi appelées cotisations sociales employeur)
              s'ajoutent au salaire brut pour former le coût employeur. En restauration HCR, elles
              représentent environ <strong>42 à 45 % du salaire brut</strong> sur les salaires moyens
              et élevés, et descendent à 24-28 % sur les bas salaires grâce à la réduction Fillon.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Cotisation</th>
                  <th className="text-center py-3 px-4 font-semibold">Taux employeur 2026</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Plafond</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4">Maladie, maternité, invalidité</td><td className="py-3 px-4 text-center">7,00 %</td><td className="py-3 px-4">Totalité du brut (taux réduit 7 % si salaire &lt; 2,5 SMIC)</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Vieillesse plafonnée</td><td className="py-3 px-4 text-center">8,55 %</td><td className="py-3 px-4">Dans la limite du PASS (3 925 EUR/mois en 2026)</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">Vieillesse déplafonnée</td><td className="py-3 px-4 text-center">2,02 %</td><td className="py-3 px-4">Totalité du brut</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Allocations familiales</td><td className="py-3 px-4 text-center">3,45 - 5,25 %</td><td className="py-3 px-4">Taux réduit 3,45 % si salaire &lt; 3,5 SMIC</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">Accidents du travail (restauration)</td><td className="py-3 px-4 text-center">1,80 - 3,50 %</td><td className="py-3 px-4">Variable selon sinistralité de l'établissement</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Chômage (Unédic)</td><td className="py-3 px-4 text-center">4,05 %</td><td className="py-3 px-4">Dans la limite de 4 PASS</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">AGS (garantie salaires)</td><td className="py-3 px-4 text-center">0,15 %</td><td className="py-3 px-4">Totalité du brut</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Retraite complémentaire AGIRC-ARRCO</td><td className="py-3 px-4 text-center">4,72 - 12,95 %</td><td className="py-3 px-4">Tranche 1 puis tranche 2</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">CSA (autonomie)</td><td className="py-3 px-4 text-center">0,30 %</td><td className="py-3 px-4">Totalité du brut</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Formation professionnelle</td><td className="py-3 px-4 text-center">1,68 %</td><td className="py-3 px-4">Totalité du brut (taxe + cotisation OPCO)</td></tr>
                <tr className="bg-white"><td className="py-3 px-4">Taxe d'apprentissage</td><td className="py-3 px-4 text-center">0,68 %</td><td className="py-3 px-4">Totalité du brut</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4">Versement mobilité (selon zone)</td><td className="py-3 px-4 text-center">0 - 2,95 %</td><td className="py-3 px-4">Variable selon ville (Paris : 2,95 %)</td></tr>
                <tr className="bg-teal-50 border-t-2 border-teal-300">
                  <td className="py-3 px-4 font-bold text-mono-100">TOTAL (salaire moyen, sans Fillon)</td>
                  <td className="py-3 px-4 text-center font-extrabold text-teal-700">≈ 42-45 %</td>
                  <td className="py-3 px-4 text-mono-400">Selon zone géographique et taux AT</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Réduction Fillon (allègement général) :</strong> sur les salaires inférieurs à
            1,6 SMIC (environ 2 880 EUR brut/mois en 2026), une réduction dégressive est appliquée
            sur les cotisations URSSAF. Le taux effectif de charges patronales descend alors à
            environ <strong>24-28 %</strong> sur les salaires au niveau du SMIC, et remonte
            progressivement jusqu'à 42-45 % vers 1,6 SMIC. C'est un levier majeur pour limiter le
            coût des postes peu qualifiés (plonge, commis, débutants).
          </Callout>

          <div className="prose-content mt-6">
            <p>
              Pour un plongeur au SMIC (21 600 EUR brut/an), les charges patronales tombent à environ
              <strong> 5 400 EUR/an</strong> au lieu de 9 300 EUR — soit une économie de 3 900 EUR par
              poste, simplement grâce au mécanisme légal Fillon. Sur une équipe de 6 personnes dont
              3 au SMIC, c'est près de 12 000 EUR/an d'économie de charges.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Optimisation ═════════════ */}
        <section id="optimisation" className="mb-16">
          <SectionHeading icon={<TrendingDown className="w-6 h-6" />} number="6">
            Optimisation : planning, polyvalence, CDDU
          </SectionHeading>

          <div className="prose-content">
            <p>
              Réduire le coût personnel sans licencier est non seulement possible, c'est même la
              première démarche à entreprendre. Les licenciements coûtent cher (indemnités, conflits,
              perte de savoir-faire) et nuisent au climat social. Voici les 4 leviers les plus
              efficaces.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <LevierCard
              icon={<Calendar className="w-5 h-5" />}
              title="Planning par tranches"
              gain="10-15 %"
              desc="Analysez vos données de caisse sur 8 semaines : CA par heure, couverts par tranche de 30 min. Décalez les prises de poste pour matcher les flux réels. Un décalage de 15 min × 5 jours × 52 sem. = 65 h économisées/employé/an (≈ 1 000 EUR)."
            />
            <LevierCard
              icon={<Users className="w-5 h-5" />}
              title="Polyvalence cuisine-salle"
              gain="5-10 %"
              desc="Former vos employés à plusieurs postes permet de fluidifier les services. Un commis qui aide en salle aux pics, un serveur formé à la plonge en creux : économie d'un poste à plein temps possible sur un restaurant de 6-8 personnes."
            />
            <LevierCard
              icon={<Award className="w-5 h-5" />}
              title="CDDU pour les pics"
              gain="3-8 %"
              desc="Le contrat d'extra (CDDU) permet d'embaucher un serveur pour un seul service. Idéal pour les week-ends chargés sans sur-embaucher en CDI. Coût : salaire + 10 % précarité + 10 % CP."
            />
            <LevierCard
              icon={<Target className="w-5 h-5" />}
              title="Apprentissage / alternance"
              gain="5-12 %"
              desc="Un apprenti coûte 27 à 100 % du SMIC selon âge et année. Aide à l'embauche : 6 000 EUR la première année. Exonération de charges totale pour les TPE. Un apprenti en cuisine = un commis à mi-coût."
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Méthode détaillée du planning par tranches</h3>
            <ol className="list-decimal list-inside space-y-3 text-mono-350">
              <li>
                <strong>Extrayez vos données de caisse</strong> sur 8 semaines : CA par heure et
                couverts par tranche de 30 min. Repérez les pics (généralement 12h-13h30 et 19h30-21h30)
                et les creux.
              </li>
              <li>
                <strong>Tracez la courbe de fréquentation type</strong> par jour de la semaine. Le
                mardi midi diffère du samedi soir : votre planning doit en tenir compte.
              </li>
              <li>
                <strong>Identifiez les tranches en sur-effectif</strong> : moments où l'équipe est
                présente mais le restaurant tourne à moins de 40 % de capacité. C'est là que se
                cachent les économies.
              </li>
              <li>
                <strong>Décalez les prises de poste</strong> de 15 à 30 minutes. Exemple : un serveur
                qui commence à 11h30 au lieu de 11h00 économise 130 h/an.
              </li>
              <li>
                <strong>Utilisez les CDDU pour les pics du week-end</strong> au lieu d'embaucher un
                CDI temps plein pour 2-3 services hebdomadaires.
              </li>
            </ol>
          </div>

          <Callout type="info">
            <strong>Exemple concret :</strong> un bistrot de 45 couverts ajuste son planning le mardi
            et mercredi midi (2 serveurs au lieu de 3 jusqu'à 12h30). Résultat : 104 heures économisées
            par an, soit <strong>1 600 EUR nets</strong> sans toucher à la qualité de service. Sur un
            ratio de 35,7 %, cela ramène le ratio à 35,4 % — un point de marge nette en plus.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Productivité ═════════════ */}
        <section id="productivite" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="7">
            Productivité : CA / heure travaillée et couverts par serveur
          </SectionHeading>

          <div className="prose-content">
            <p>
              La <strong>productivité</strong> est le pendant de l'optimisation : ce n'est pas
              seulement combien vous payez votre équipe, mais combien elle produit. Deux KPI à
              suivre absolument.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">CA HT par heure travaillée</h3>
            <p>
              <strong>Formule :</strong> CA HT mensuel / Total des heures travaillées (équipe complète)
            </p>
            <p>
              Ce KPI mesure la valeur générée par chaque heure de présence de l'équipe, toutes
              fonctions confondues. C'est l'indicateur le plus parlant pour piloter la productivité
              globale.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Segment</th>
                  <th className="text-center py-3 px-4 font-semibold">CA / heure travaillée</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Couverts / serveur / service</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Restauration rapide</td><td className="py-3 px-4 text-center">35 - 55 EUR/h</td><td className="py-3 px-4 text-center">40 - 60 (comptoir)</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Bistrot / Brasserie</td><td className="py-3 px-4 text-center">45 - 80 EUR/h</td><td className="py-3 px-4 text-center">30 - 50</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Restaurant traditionnel</td><td className="py-3 px-4 text-center">55 - 85 EUR/h</td><td className="py-3 px-4 text-center">20 - 30</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Pizzeria</td><td className="py-3 px-4 text-center">50 - 75 EUR/h</td><td className="py-3 px-4 text-center">35 - 55</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Gastronomique</td><td className="py-3 px-4 text-center">80 - 120 EUR/h</td><td className="py-3 px-4 text-center">12 - 18</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Dark kitchen</td><td className="py-3 px-4 text-center">60 - 95 EUR/h</td><td className="py-3 px-4 text-center">N/A (livraison)</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Comment booster la productivité</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li>
                <strong>Mise en place optimisée</strong> : organiser le poste pour minimiser les déplacements.
                Gain : 10-15 % du temps de cuisine par service.
              </li>
              <li>
                <strong>Fiches techniques précises</strong> : éliminent les hésitations et les erreurs
                qui ralentissent le service.
              </li>
              <li>
                <strong>QR code menu</strong> : supprime 10 à 15 minutes de gestion des menus par service.
              </li>
              <li>
                <strong>Terminal de paiement à table</strong> : réduit le temps d'addition de 2 à 4 min
                par table, soit 40 à 80 min économisées sur un service de 20 tables.
              </li>
              <li>
                <strong>Vente additionnelle en salle</strong> : +1,5 à 3 EUR de ticket moyen après 45 min
                de formation. Sur 30 couverts/service, c'est 45 à 90 EUR de CA en plus par service —
                sans augmenter le coût personnel.
              </li>
            </ul>
            <p className="mt-4">
              La formation est l'investissement le plus rentable. Pour aller plus loin, consultez
              notre guide sur la
              <Link to="/blog/formation-personnel-restauration" className="text-teal-700 underline hover:text-teal-800 ml-1">
                formation du personnel en restauration
              </Link>.
            </p>
          </div>

          <Callout type="info">
            <strong>Calcul du ROI d'une formation :</strong> un commis qui passe de 8 à 5 minutes pour
            une garniture économise 3 min × 30 garnitures × 5 services = <strong>75 min/semaine</strong>,
            soit 65 heures/an ≈ <strong>700 EUR de valeur créée</strong> pour 30 minutes de formation
            initiale. ROI immédiat.
          </Callout>
        </section>

        {/* ═════════════ SECTION 8 : Benchmarks par type ═════════════ */}
        <section id="benchmarks" className="mb-16">
          <SectionHeading icon={<TrendingDown className="w-6 h-6" />} number="8">
            Benchmarks coût personnel par type de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les ratios coût personnel observés en France en 2026 sur 9 types d'établissement.
              Données agrégées issues du GIRA Conseil, du SNRC, de la fédération UMIH et de notre
              base RestauMargin (500+ restaurants connectés).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type de restaurant</th>
                  <th className="text-center py-3 px-4 font-semibold">Ratio cible</th>
                  <th className="text-center py-3 px-4 font-semibold">CA/heure travaillée</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Particularités</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { type: 'Restauration rapide', ratio: '25 - 30 %', cah: '35 - 55 EUR/h', notes: 'Effectifs réduits, polyvalence forte' },
                  { type: 'Fast-casual', ratio: '28 - 32 %', cah: '45 - 65 EUR/h', notes: 'Service hybride, ticket moyen 12-18 EUR' },
                  { type: 'Bistrot', ratio: '30 - 35 %', cah: '45 - 70 EUR/h', notes: 'Carte courte, équipe restreinte' },
                  { type: 'Brasserie', ratio: '32 - 38 %', cah: '55 - 80 EUR/h', notes: 'Carte large, amplitude horaire étendue' },
                  { type: 'Restaurant traditionnel', ratio: '32 - 38 %', cah: '55 - 85 EUR/h', notes: 'Service à table classique, ticket 25-40 EUR' },
                  { type: 'Pizzeria', ratio: '25 - 32 %', cah: '50 - 75 EUR/h', notes: 'Production simple, ticket bas, fort volume' },
                  { type: 'Restaurant gastronomique', ratio: '35 - 45 %', cah: '80 - 120 EUR/h', notes: 'Brigade structurée, service haut de gamme' },
                  { type: 'Food truck', ratio: '20 - 28 %', cah: '40 - 65 EUR/h', notes: 'Équipe minimale (1-2 personnes)' },
                  { type: 'Dark kitchen', ratio: '22 - 30 %', cah: '60 - 95 EUR/h', notes: 'Pas de salle, équipe cuisine seule' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.type}</td>
                    <td className="py-3 px-4 text-center">{row.ratio}</td>
                    <td className="py-3 px-4 text-center">{row.cah}</td>
                    <td className="py-3 px-4 text-center text-xs text-mono-500">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Lecture :</strong> ces fourchettes sont des cibles, pas des verdicts. Un
              restaurant gastronomique parisien avec un excellent menu engineering peut tomber à
              32 % de ratio. Un food truck en zone touristique peut avoir un CA/heure à 90 EUR. La
              clef : connaître la cible de votre segment et la dépasser, pas vous y conformer.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Erreurs ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="9">
            Les 5 erreurs qui font exploser la masse salariale
          </SectionHeading>

          <div className="space-y-6 mt-8">
            <ErreurCard
              number={1}
              title="Confondre salaire brut et coût total employé"
              desc="C'est l'erreur la plus répandue. Un employé à 22 000 EUR brut/an coûte en réalité 33 400 EUR à l'employeur. Multiplié par 6 employés, c'est 70 000 EUR de différence — qui passent inaperçus si vous raisonnez uniquement sur les fiches de paie. Toujours calculer en coût total employé chargé."
            />
            <ErreurCard
              number={2}
              title="Ne pas analyser les flux de fréquentation"
              desc="Construire son planning par habitude ou par confort plutôt que par données réelles génère systématiquement des heures creuses payées pour rien. Extraire les CA par heure de votre caisse sur 8 semaines minimum et caler les prises de poste sur les flux : économie immédiate de 10-15 % sur la masse salariale."
            />
            <ErreurCard
              number={3}
              title="Sous-estimer le coût du turnover"
              desc="Un turnover de 80 % dans une équipe de 8 personnes représente jusqu'à 25 600 EUR/an de coûts de remplacement (annonces, tris, entretiens, formation, ralentissements de service pendant l'intégration). C'est souvent supérieur à ce que coûterait une prime de fidélisation, des plannings stables 2 semaines à l'avance ou une amélioration des conditions de travail."
            />
            <ErreurCard
              number={4}
              title="Ignorer la réduction Fillon"
              desc="Sur les salaires inférieurs à 1,6 SMIC, la réduction générale de cotisations (Fillon) ramène les charges patronales de 43 % à 24-28 %. Beaucoup de restaurateurs ne l'appliquent pas correctement ou ne la prennent pas en compte dans leur calcul prévisionnel. Sur 3 employés au SMIC, c'est 12 000 EUR/an d'économies de charges qui passent à la trappe."
            />
            <ErreurCard
              number={5}
              title="Ne pas utiliser les CDDU et l'apprentissage"
              desc="Le CDDU (contrat d'extra) permet d'absorber les pics du week-end sans embaucher un CDI à plein temps. L'apprentissage et l'alternance offrent une main-d'œuvre à coût réduit (27-100 % du SMIC) avec exonération partielle de charges et aide à l'embauche de 6 000 EUR. Ces deux dispositifs combinés peuvent réduire la masse salariale de 8-15 %."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumulé :</strong> ces 5 erreurs combinées peuvent représenter 5 à 8 points
            de ratio coût personnel en trop. Sur un restaurant qui fait 600 000 EUR de CA HT annuel,
            c'est entre <strong>30 000 EUR et 48 000 EUR de masse salariale</strong> en trop chaque
            année — autant de marge nette perdue.
          </Callout>
        </section>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="16 min" variant="footer" />

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
              Pilotez votre masse salariale en temps réel
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin calcule automatiquement votre ratio coût personnel / CA HT, identifie les
              heures creuses, suit la productivité par poste et vous alerte quand vos marges dérivent.
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

        {/* ═════════════ Articles complémentaires ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/charges-sociales-restauration" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Charges sociales restauration</h3>
              <p className="text-xs text-mono-500">Détail complet des cotisations, taux 2026 et réduction Fillon.</p>
            </Link>
            <Link to="/blog/contrat-travail-restauration-guide" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Guide contrat de travail HCR</h3>
              <p className="text-xs text-mono-500">CDI, CDD, CDDU, apprentissage : quel contrat pour quel besoin.</p>
            </Link>
            <Link to="/blog/formation-personnel-restauration" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Formation du personnel</h3>
              <p className="text-xs text-mono-500">OPCO HCR, financements et formations à forte productivité.</p>
            </Link>
            <Link to="/blog/prime-cost-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Prime cost en restauration</h3>
              <p className="text-xs text-mono-500">Maîtriser le prime cost (matières + personnel) sous 65 % du CA.</p>
            </Link>
          </div>
        </section>

        </article>

        {/* Nav bas */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/blog/kpi-essentiels-restaurateur" className="text-sm text-teal-600 hover:underline">Les KPI essentiels →</Link>
        </div>
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

function RatioCard({ type, ratio, color, description }: { type: string; ratio: string; color: string; description: string }) {
  const colors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-700' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900', badge: 'bg-teal-100 text-teal-700' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-700' },
  };
  const c = colors[color] || colors.teal;
  return (
    <div className={`${c.bg} ${c.border} border rounded-2xl p-6`}>
      <h3 className={`font-bold ${c.text} mb-2`}>{type}</h3>
      <div className={`text-3xl font-extrabold ${c.text} mb-2`}>{ratio}</div>
      <div className={`text-xs ${c.badge} px-2 py-0.5 rounded-full inline-block mb-3 font-semibold`}>du CA HT</div>
      <p className={`text-sm ${c.text} opacity-80 leading-relaxed`}>{description}</p>
    </div>
  );
}

function LevierCard({ icon, title, gain, desc }: { icon: React.ReactNode; title: string; gain: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-bold text-mono-100">{title}</h3>
        <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-full">{gain}</span>
      </div>
      <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
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
