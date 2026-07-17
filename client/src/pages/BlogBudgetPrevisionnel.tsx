import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Calculator, FileSpreadsheet, TrendingDown, Target, AlertTriangle, ArrowRight, Lightbulb, CheckCircle, BarChart3, TrendingUp, Banknote, Calendar, ListChecks, Sparkles, Award } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Budget prévisionnel restaurant : guide complet 2026"
   Mots-clé : budget prévisionnel restaurant, business plan restaurant
   ~3 200 mots — Schemas FAQ + HowTo + Article + BreadcrumbList
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quand commencer son budget prévisionnel ?",
    answer: "Pour une création de restaurant, démarrez 6 à 9 mois avant l'ouverture, en parallèle de la recherche de financement. Pour un restaurant existant, idéalement en novembre pour l'année suivante avec validation en décembre. Une révision dans les 30 jours après le démarrage est obligatoire pour caler les hypothèses sur la réalité."
  },
  {
    question: "Combien de temps pour construire un budget prévisionnel ?",
    answer: "2 à 3 jours pleins la première fois, dont 1 journée d'étude (loyers, salaires, ratios sectoriels). Les années suivantes, une journée suffit en partant du précédent. Si vous utilisez un logiciel comme RestauMargin, la mise à jour mensuelle se fait en 30 minutes."
  },
  {
    question: "Mon comptable peut-il faire mon budget à ma place ?",
    answer: "Il peut vous aider à le mettre en forme et à valider la cohérence comptable, mais il ne peut pas prévoir vos couverts, votre ticket moyen, votre saisonnalité ni vos arbitrages opérationnels. Le budget doit être co-construit : vous apportez la connaissance terrain, le comptable apporte la rigueur des chiffres et la conformité fiscale."
  },
  {
    question: "Que faire si le réel dévie de 15% du budget pendant 2 mois ?",
    answer: "Reforecast complet immédiat. Soit le budget était irréaliste (à corriger pour les 10 mois suivants), soit la réalité a changé (nouveau concurrent, perte d'un service midi entreprise, hausse fournisseur) et il faut un plan d'action en 30 jours avec leviers commerciaux et économies de charges."
  },
  {
    question: "Quelle est la différence entre budget prévisionnel et business plan ?",
    answer: "Le business plan est un document de vente : il convainc une banque, couvre 3 à 5 ans, n'est jamais réactualisé. Le budget prévisionnel est un outil de pilotage : 12 mois glissants, révisé chaque mois, arbitre les décisions du quotidien. Le BP intègre la stratégie, le budget intègre les chiffres opérationnels."
  },
  {
    question: "Quel logiciel utiliser pour faire son budget prévisionnel ?",
    answer: "Excel ou Google Sheets pour démarrer (gratuit, flexible). Pour le pilotage continu, un logiciel métier comme RestauMargin permet de connecter les achats, les ventes et les charges en temps réel sans ressaisie. Pour de très grosses structures multi-sites, Sage ou Cegid sont des standards."
  },
  {
    question: "Que faire d'un budget prévisionnel après l'avoir construit ?",
    answer: "Le piloter chaque semaine. CA réel vs budget hebdo, variance food cost hebdo, masse salariale hebdo. Tous les mois, revue complète ligne par ligne dans les 10 jours suivant la clôture. Tous les trimestres, reforecast complet des 9 mois suivants en intégrant les écarts constatés."
  },
  {
    question: "Comment intégrer la saisonnalité dans le budget ?",
    answer: "Multipliez le CA mensuel moyen par un coefficient saisonnier : janvier 0,75 / février 0,82 / mars 0,95 / avril 1,02 / mai 1,10 / juin 1,15 / juillet 1,08 / août 0,70 / septembre 1,02 / octobre 1,10 / novembre 1,06 / décembre 1,25. Ajustez selon votre zone (touristique, bureaux, étudiants)."
  },
  {
    question: "Quel pourcentage du CA pour chaque poste de charges ?",
    answer: "Food cost 28-32%, masse salariale chargée 30-38%, loyer 8-10%, énergie 4-6%, marketing 1-3%, assurances 1-2%, frais bancaires 0,5-1,5%, amortissements 4-6%, autres charges 3-5%. Le total charges doit rester sous 92% pour générer une marge nette de 8%+."
  },
  {
    question: "Comment construire le budget la première année d'ouverture ?",
    answer: "Phase 1 (M1-M3) : ramp-up à 60% du CA cible, masse salariale incompressible 100%. Phase 2 (M4-M6) : 80% du CA, ajustements équipe. Phase 3 (M7-M12) : 90-100% du CA, équilibre opérationnel. Prévoyez 15-25K€ de trésorerie de sécurité pour absorber les écarts."
  },
  {
    question: "Quand reforcaster son budget prévisionnel ?",
    answer: "Trois moments obligatoires : après le mois 1 (premières données réelles), à la fin du T1 (calage saisonnalité), et au T3 (préparation année suivante). Tout écart cumulé supérieur à 10% sur 2 mois consécutifs déclenche un reforecast immédiat."
  },
  {
    question: "Quels indicateurs présenter à la banque avec le budget ?",
    answer: "EBE (excédent brut d'exploitation), CAF (capacité d'autofinancement), seuil de rentabilité, ratio prime cost, marge brute, marge nette, point mort en nombre de couverts. La banque regarde le ratio remboursement / CAF (doit être < 33%) et la trésorerie minimale (jamais sous 3 semaines de charges)."
  }
];

export default function BlogBudgetPrevisionnel() {
  const faqSchema = buildFAQSchema(faqItems);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Budget prévisionnel restaurant", url: "https://www.restaumargin.fr/blog/budget-previsionnel-restaurant" }
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Comment construire un budget prévisionnel restaurant",
    description: "Méthode complète pour construire et piloter le budget prévisionnel d'un restaurant : CA, charges, saisonnalité, indicateurs de pilotage.",
    totalTime: "P3D",
    tool: ["Tableur Excel ou Google Sheets", "Calculateur food cost", "Logiciel de gestion restaurant"],
    step: [
      { "@type": "HowToStep", name: "Définir les hypothèses de CA", text: "Couverts × ticket moyen × jours d'ouverture, ajusté du taux de remplissage par service." },
      { "@type": "HowToStep", name: "Estimer le food cost", text: "Cible 28-32% du CA selon le concept, à confirmer avec fiches techniques et prix fournisseurs." },
      { "@type": "HowToStep", name: "Construire la masse salariale", text: "Brut chargé +42% de charges patronales, fourchette 30-38% du CA HT cible." },
      { "@type": "HowToStep", name: "Lister les charges fixes", text: "Loyer, énergie, eau, assurances, abonnements, comptable, marketing, amortissements." },
      { "@type": "HowToStep", name: "Calculer l'EBE et la marge nette", text: "EBE = CA - food cost - masse salariale - charges fixes. Marge nette = résultat net / CA × 100." },
      { "@type": "HowToStep", name: "Intégrer la saisonnalité", text: "Multiplier le CA mensuel moyen par les coefficients saisonniers du secteur restauration." },
      { "@type": "HowToStep", name: "Mettre en place le pilotage", text: "Suivi hebdo CA + food cost, revue mensuelle complète, reforecast trimestriel." }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Budget prévisionnel restaurant : comment le construire et le piloter en 2026",
    description: "Guide complet du budget prévisionnel restaurant : structure, méthode, exemple 12 mois, ratios cibles et pilotage mensuel. Tableaux chiffrés et formules.",
    image: "https://www.restaumargin.fr/og-image.png",
    datePublished: "2026-04-27",
    dateModified: "2026-05-26",
    author: { "@type": "Organization", name: "La rédaction RestauMargin", url: "https://www.restaumargin.fr/a-propos" },
    publisher: {
      "@type": "Organization",
      name: "RestauMargin",
      logo: { "@type": "ImageObject", url: "https://www.restaumargin.fr/icon-512.png" }
    },
    wordCount: 3200,
    inLanguage: "fr-FR",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.restaumargin.fr/blog/budget-previsionnel-restaurant" }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Budget prévisionnel restaurant : guide complet 2026 + tableau 12 mois"
        description="Construisez et pilotez votre budget prévisionnel restaurant : structure, méthode bottom-up, tableau 12 mois, ratios cibles, saisonnalité. Formules et exemples chiffrés."
        path="/blog/budget-previsionnel-restaurant"
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
            <Link to="/outils/calculateur-food-cost" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors">
              <Calculator className="w-4 h-4" />
              Calculateur food cost
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
          <span className="text-mono-100 font-medium">Budget prévisionnel restaurant</span>
        </div>
      </div>

      <BlogArticleHero
        category="Gestion financière"
        readTime="16 min"
        date="Mai 2026"
        title="Budget prévisionnel restaurant : comment le construire et le piloter en 2026"
        accentWord="budget"
        subtitle="L'outil de pilotage qui transforme l'intuition en décision et l'incertitude en marge de manœuvre. Guide complet, méthode bottom-up, tableau 12 mois et ratios cibles 2026."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="16 min" variant="header" />

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8 mt-10">
          Sept restaurants sur dix qui ferment dans les trois premières années n'ont jamais construit de budget prévisionnel digne de ce nom selon une étude Fiducial 2024. Ils se sont lancés avec un business plan poli pour la banque, puis ont navigué à vue. Le budget prévisionnel restaurant n'est pas un document mort : c'est l'outil qui transforme l'intuition en décision et l'incertitude en marge de manœuvre. Cet article vous donne la méthode complète, les ratios cibles 2026, un exemple chiffré sur 12 mois, et la mécanique de pilotage hebdomadaire qui sépare les restaurants qui durent de ceux qui disparaissent.
        </p>

        {/* Encadré formule */}
        <div className="mt-6 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formule essentielle budget restaurant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les 5 équations du budget prévisionnel
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">CA HT mensuel</strong> = Couverts × Ticket moyen × Jours ouverts</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Marge brute</strong> = CA - Food cost (cible 28-32% du CA)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">EBE</strong> = Marge brute - Masse salariale - Charges fixes</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Résultat net</strong> = EBE - Amortissements - Frais financiers - IS</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">5.</span>
              <span><strong className="text-white">Marge nette (%)</strong> = (Résultat net / CA HT) × 100</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectif 2026 : marge brute 68-72%, EBE 12-18% du CA, marge nette 5-12%.
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
              { href: '#pourquoi', label: 'Pourquoi le budget prévisionnel est la base du pilotage' },
              { href: '#difference', label: 'Business plan vs budget prévisionnel : les différences' },
              { href: '#structure', label: 'Structure complète d\'un budget prévisionnel' },
              { href: '#methode', label: 'Méthode bottom-up vs top-down' },
              { href: '#construire', label: 'Comment construire son budget en 7 étapes' },
              { href: '#ratios', label: 'Ratios cibles 2026 par type de restaurant' },
              { href: '#exemple', label: 'Exemple complet sur 12 mois chiffrés' },
              { href: '#saisonnalite', label: 'Intégrer la saisonnalité du restaurant' },
              { href: '#pilotage', label: 'Pilotage budget vs réel : la mécanique' },
              { href: '#derives', label: 'Les 7 postes qui dérivent en pratique' },
              { href: '#reforecast', label: 'Quand et comment reforecaster' },
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

        {/* Section 1 — Pourquoi */}
        <section id="pourquoi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="1">
            Pourquoi le budget prévisionnel est la base du pilotage
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un restaurant brûle du cash en permanence : loyer, salaires, matières, énergie, abonnements. Sans projection, vous découvrez les problèmes avec deux mois de retard, quand le tableau de bord comptable arrive. À ce moment-là, la perte est consommée et la trésorerie déjà entamée. Le budget prévisionnel inverse cette logique : <strong>vous décidez à l'avance ce que doit être le mois prochain, puis vérifiez chaque semaine que la réalité s'y conforme</strong>.
            </p>
            <p>
              Cette discipline change fondamentalement votre rapport au temps. Au lieu de réagir à des écarts subis, vous anticipez, vous arbitrez, vous décidez. C'est la différence entre piloter un avion aux instruments et conduire les yeux fermés.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Les 5 bénéfices concrets du budget prévisionnel</h3>
            <ul className="space-y-3 text-mono-350">
              <li><strong>Anticipation de trésorerie</strong> : voir venir un mois faible (janvier, août) trois semaines avant et provisionner les charges fixes correspondantes.</li>
              <li><strong>Discipline d'équipe</strong> : un chef qui sait qu'il a 12 000€ pour le mois ne commande pas comme s'il y avait 15 000€. Le budget responsabilise.</li>
              <li><strong>Crédibilité bancaire</strong> : présenter un suivi budget vs réel double la probabilité d'obtenir un découvert ou un prêt complémentaire.</li>
              <li><strong>Décisions d'investissement éclairées</strong> : recruter, racheter du matériel, ouvrir un second site — toutes ces décisions passent par le budget.</li>
              <li><strong>Détection précoce des dérives</strong> : un food cost qui passe de 30% à 33% pendant 2 mois représente 7 000€ perdus sur 600K€ de CA. Sans budget, vous le découvrez trop tard.</li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Le saviez-vous ?</strong> Les restaurants qui suivent un budget mensuel ont un taux de survie à 5 ans de 62% selon BPI France, contre 28% pour ceux qui n'en suivent pas. C'est le facteur le plus discriminant après l'emplacement.
          </Callout>
        </section>

        {/* Section 2 — Différence BP / Budget */}
        <section id="difference" className="mb-16">
          <SectionHeading icon={<FileSpreadsheet className="w-6 h-6" />} number="2">
            Business plan vs budget prévisionnel
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est la confusion la plus fréquente chez les porteurs de projet. Le business plan est un document de vente : il convainc une banque, couvre 3 à 5 ans, n'est jamais réactualisé une fois validé. Le budget prévisionnel est un outil de pilotage : 12 mois glissants, révisé chaque mois, arbitre les décisions du quotidien. Les deux documents ne s'opposent pas, ils se complètent.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Critère</th>
                  <th className="text-left py-3 px-4 font-semibold">Business plan</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Budget prévisionnel</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Horizon</td><td className="py-3 px-4">3 à 5 ans</td><td className="py-3 px-4">12 mois glissants</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Objectif principal</td><td className="py-3 px-4">Convaincre les financeurs</td><td className="py-3 px-4">Piloter au quotidien</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Niveau de détail</td><td className="py-3 px-4">Annuel ou trimestriel</td><td className="py-3 px-4">Mensuel et hebdomadaire</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Fréquence mise à jour</td><td className="py-3 px-4">Une fois (sauf grosse révision)</td><td className="py-3 px-4">Chaque mois</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Audience</td><td className="py-3 px-4">Banque, investisseurs, partenaires</td><td className="py-3 px-4">Gérant, équipe, comptable</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Format</td><td className="py-3 px-4">30-60 pages narratif + financier</td><td className="py-3 px-4">Tableur structuré 50-100 lignes</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Hypothèses</td><td className="py-3 px-4">Optimistes (scénario base)</td><td className="py-3 px-4">Réalistes (engagement chiffré)</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Coût construction</td><td className="py-3 px-4">2 000-5 000€ (accompagnement)</td><td className="py-3 px-4">0-500€ (autonomie ou conseil léger)</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p>
              <strong>Règle pratique :</strong> votre business plan définit la stratégie sur 3 ans, votre budget prévisionnel exécute cette stratégie sur 12 mois. Si vous voulez ouvrir un restaurant, consultez notre {' '}
              <Link to="/blog/comment-ouvrir-restaurant-guide-complet" className="text-teal-700 underline hover:text-teal-800">guide complet pour ouvrir un restaurant</Link> qui couvre le business plan et la création.
            </p>
          </div>
        </section>

        {/* Section 3 — Structure */}
        <section id="structure" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            Structure complète d'un budget prévisionnel
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un budget prévisionnel restaurant tient en cinq blocs, suivant la logique du compte de résultat. Chaque bloc se décompose en lignes opérationnelles que vous pouvez piloter au quotidien. La discipline est de ne jamais regrouper des lignes hétérogènes : un loyer dans la même case que les abonnements digitaux empêche le pilotage fin.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center font-bold">1</span>
                Recettes prévisionnelles
              </h3>
              <ul className="text-sm text-mono-400 space-y-1.5 list-disc list-inside ml-2">
                <li>CA salle midi (couverts × ticket moyen midi × jours ouverts)</li>
                <li>CA salle soir (couverts × ticket moyen soir × jours ouverts)</li>
                <li>CA bar et apéritifs (souvent 8-15% du CA total)</li>
                <li>CA livraison / click & collect (commission plateformes déduite)</li>
                <li>CA événementiel et privatisations (privatisations, séminaires, mariages)</li>
                <li>Recettes annexes (formation, conseil, droits image)</li>
              </ul>
            </div>

            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center font-bold">2</span>
                Achats matières (food cost et beverage cost)
              </h3>
              <ul className="text-sm text-mono-400 space-y-1.5 list-disc list-inside ml-2">
                <li>Achats viandes et poissons (15-22% du CA selon concept)</li>
                <li>Achats fruits, légumes, féculents (4-8%)</li>
                <li>Achats crémerie et œufs (3-5%)</li>
                <li>Épicerie, condiments, surgelés (2-4%)</li>
                <li>Boissons sans alcool, vins, bières, spiritueux (8-12% du CA boissons)</li>
                <li>Petites fournitures cuisine (3-5K€/an : couteaux, plats, contenants)</li>
              </ul>
            </div>

            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-rose-100 text-rose-700 rounded-lg flex items-center justify-center font-bold">3</span>
                Masse salariale (charges incluses)
              </h3>
              <ul className="text-sm text-mono-400 space-y-1.5 list-disc list-inside ml-2">
                <li>Salaires bruts cuisine (chef, second, commis, plongeur)</li>
                <li>Salaires bruts salle (maître d'hôtel, chef de rang, serveurs)</li>
                <li>Charges patronales (+42% sur le brut en moyenne secteur HCR)</li>
                <li>Rémunération gérant (selon statut TNS ou assimilé salarié)</li>
                <li>Heures supplémentaires et extras (3-5% enveloppe spécifique)</li>
                <li>Mutuelle, prévoyance, formation continue, médecine du travail</li>
              </ul>
            </div>

            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold">4</span>
                Charges fixes et services extérieurs
              </h3>
              <ul className="text-sm text-mono-400 space-y-1.5 list-disc list-inside ml-2">
                <li>Loyer + charges locatives (8-10% du CA cible)</li>
                <li>Électricité, gaz, eau (4-6% du CA)</li>
                <li>Assurances RC pro + multirisque (1-2%)</li>
                <li>Honoraires comptable + juridique (1-2%)</li>
                <li>Abonnements logiciels (caisse, gestion, paie, marketing)</li>
                <li>Marketing et communication (1-3% du CA)</li>
                <li>Entretien, réparations, blanchisserie (2-4%)</li>
                <li>Frais bancaires et terminal CB (0,5-1,5%)</li>
              </ul>
            </div>

            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold">5</span>
                Résultats et indicateurs de pilotage
              </h3>
              <ul className="text-sm text-mono-400 space-y-1.5 list-disc list-inside ml-2">
                <li>Marge brute et marge brute %</li>
                <li>EBE (excédent brut d'exploitation) et EBE/CA</li>
                <li>Résultat avant impôt et marge nette</li>
                <li>Trésorerie de fin de mois (cumul)</li>
                <li>Prime cost (food cost + masse salariale)</li>
                <li>Indicateurs opérationnels (TM, couverts/jour, taux remplissage)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4 — Méthode bottom-up vs top-down */}
        <section id="methode" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="4">
            Méthode bottom-up vs top-down
          </SectionHeading>

          <div className="prose-content">
            <p>
              Deux méthodes de construction coexistent. Les utiliser conjointement permet de tester la cohérence du budget : si les deux convergent à moins de 10%, le budget est crédible. Sinon, il y a un problème de surestimation des recettes ou de sous-estimation des charges.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-emerald-900 mb-3 text-lg">Méthode Bottom-up</h3>
              <p className="text-sm text-emerald-800 mb-4">Partir de la capacité physique du restaurant et estimer les couverts.</p>
              <div className="bg-white/60 rounded-xl p-4 font-mono text-xs text-emerald-900 space-y-1.5">
                <div>60 couverts × 2 services × 26 jours = 3 120 capacité</div>
                <div>Taux remplissage 55% = 1 716 couverts/mois</div>
                <div>1 716 × 28€ ticket moyen = 48 048€ HT</div>
                <div className="border-t border-emerald-300 pt-1.5 font-bold">CA mensuel cible = 48 048€</div>
              </div>
              <p className="text-xs text-emerald-700 mt-3">Avantage : ancré dans la réalité opérationnelle. Limite : peut sous-estimer le potentiel.</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="font-bold text-blue-900 mb-3 text-lg">Méthode Top-down</h3>
              <p className="text-sm text-blue-800 mb-4">Partir des charges fixes incompressibles et de l'objectif de marge.</p>
              <div className="bg-white/60 rounded-xl p-4 font-mono text-xs text-blue-900 space-y-1.5">
                <div>Charges fixes 18 000 + Salaires 14 000 = 32 000</div>
                <div>+ EBE cible 5 000 = besoin marge brute 37 000</div>
                <div>Marge brute = 70% du CA</div>
                <div className="border-t border-blue-300 pt-1.5 font-bold">CA mini = 37 000 / 0,70 = 52 857€</div>
              </div>
              <p className="text-xs text-blue-700 mt-3">Avantage : oriente sur l'objectif. Limite : peut surestimer la demande.</p>
            </div>
          </div>

          <Callout type="info">
            <strong>Comment réconcilier les deux ?</strong> Si bottom-up donne 48K et top-down 53K, il manque 5K de CA pour atteindre la rentabilité cible. Trois leviers : augmenter le ticket moyen de 3€, ajouter 1 service privatisé par semaine, ou réduire les charges fixes de 3 500€ par mois. Le budget est l'arbitrage entre ces leviers.
          </Callout>
        </section>

        {/* Section 5 — 7 étapes */}
        <section id="construire" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="5">
            Comment construire son budget en 7 étapes
          </SectionHeading>

          <div className="space-y-5 mt-8">
            {[
              { num: 1, titre: "Définir les hypothèses de CA", desc: "Couverts × ticket moyen × jours d'ouverture, ajusté du taux de remplissage par service. Distinguez midi/soir, semaine/week-end. Ajoutez les services annexes (livraison, événementiel) avec leurs propres taux de marge." },
              { num: 2, titre: "Estimer le food cost cible", desc: "28-32% du CA pour un bistrot classique, 30-38% pour un gastronomique, 22-28% pour une pizzeria. À confirmer avec vos fiches techniques et les prix fournisseurs actuels. Notre guide sur le food cost détaille la méthode." },
              { num: 3, titre: "Construire la masse salariale détaillée", desc: "Listez chaque poste avec brut mensuel et charges (×1,42). Anticipez les augmentations conventionnelles HCR au 1er janvier et 1er juillet. Prévoyez 3-5% d'enveloppe extras et heures supplémentaires." },
              { num: 4, titre: "Lister exhaustivement les charges fixes", desc: "Loyer, énergie, eau, assurances, abonnements, comptable, marketing, entretien. Ne regroupez pas, ne lissez pas : 8% de charges fixes mal détaillées = 50 000€ d'écart annuel sur 600K€ de CA." },
              { num: 5, titre: "Calculer l'EBE et la marge nette", desc: "EBE = CA - food cost - masse salariale - charges fixes. Marge nette = EBE - amortissements - frais financiers - IS. La marge nette cible 2026 en restauration : 5-12% selon le concept." },
              { num: 6, titre: "Intégrer la saisonnalité mois par mois", desc: "Multipliez le CA mensuel moyen par les coefficients saisonniers (voir tableau plus bas). Adaptez selon votre zone : zone touristique amplifie juillet-août, zone bureaux amplifie sept-juin et déprime juillet-août." },
              { num: 7, titre: "Mettre en place le pilotage hebdo/mensuel", desc: "Tableau de bord hebdomadaire : CA, food cost, masse salariale. Revue mensuelle complète dans les 10 jours suivant la clôture. Reforecast trimestriel. Sans pilotage, le budget est un document mort." },
            ].map((step, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6 flex gap-5">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg shadow-md">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-mono-100 text-lg mb-2">{step.titre}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 — Ratios cibles */}
        <section id="ratios" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="6">
            Ratios cibles 2026 par type de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Ces benchmarks sont issus des données BPI France, Fiducial, GIRA Conseil et de notre base de données RestauMargin (500+ restaurants connectés). Ils sont à adapter à votre contexte local et à votre niveau de gamme.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type de restaurant</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-center py-3 px-4 font-semibold">Masse salariale</th>
                  <th className="text-center py-3 px-4 font-semibold">Loyer</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge nette</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { type: "Fast-food / restauration rapide", fc: "25-30%", ms: "25-32%", l: "8-12%", mn: "8-15%" },
                  { type: "Bistrot / brasserie urbaine", fc: "28-33%", ms: "32-38%", l: "8-10%", mn: "5-12%" },
                  { type: "Restaurant traditionnel", fc: "30-35%", ms: "34-40%", l: "7-10%", mn: "5-10%" },
                  { type: "Pizzeria / créperie", fc: "22-28%", ms: "28-34%", l: "8-12%", mn: "10-18%" },
                  { type: "Coffee shop / brunch", fc: "20-26%", ms: "30-38%", l: "10-14%", mn: "8-16%" },
                  { type: "Restaurant gastronomique", fc: "32-40%", ms: "40-48%", l: "6-9%", mn: "3-10%" },
                  { type: "Food truck", fc: "22-30%", ms: "25-32%", l: "2-5%", mn: "10-18%" },
                  { type: "Dark kitchen / livraison", fc: "28-35%", ms: "22-28%", l: "5-8%", mn: "5-12%" },
                  { type: "Traiteur / banquet", fc: "30-38%", ms: "30-36%", l: "5-8%", mn: "8-15%" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.type}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-center">{row.ms}</td>
                    <td className="py-3 px-4 text-center">{row.l}</td>
                    <td className="py-3 px-4 text-center font-semibold">{row.mn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p>
              <strong>Lecture clé :</strong> le prime cost (food cost + masse salariale) ne devrait jamais dépasser 70% du CA HT. Au-delà, la marge nette devient structurellement insuffisante pour absorber les autres charges. Pour approfondir le pilotage du food cost, consultez notre guide {' '}
              <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800">food cost en restauration</Link> et notre {' '}
              <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        {/* Section 7 — Exemple 12 mois */}
        <section id="exemple" className="mb-16">
          <SectionHeading icon={<FileSpreadsheet className="w-6 h-6" />} number="7">
            Exemple complet sur 12 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Restaurant 60 couverts, urbain (Lyon centre), bistronomie, ticket moyen 28€ HT. Hypothèses : food cost 30%, masse salariale 35%, loyer 4 000€/mois, autres charges fixes 9 500€/mois. Lecture détaillée mois par mois, intégrant la saisonnalité moyenne du secteur restauration urbaine.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-2 px-3 font-semibold rounded-tl-xl">Mois</th>
                  <th className="text-right py-2 px-3 font-semibold">CA HT</th>
                  <th className="text-right py-2 px-3 font-semibold">Food cost</th>
                  <th className="text-right py-2 px-3 font-semibold">Salaires</th>
                  <th className="text-right py-2 px-3 font-semibold">Ch. fixes</th>
                  <th className="text-right py-2 px-3 font-semibold rounded-tr-xl">EBE</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { m: "Janvier", ca: 38000, fc: 11400, sal: 17000, cf: 13500, ebe: -3900 },
                  { m: "Février", ca: 42000, fc: 12600, sal: 17000, cf: 13500, ebe: -1100 },
                  { m: "Mars", ca: 48000, fc: 14400, sal: 17500, cf: 13500, ebe: 2600 },
                  { m: "Avril", ca: 52000, fc: 15600, sal: 18000, cf: 13500, ebe: 4900 },
                  { m: "Mai", ca: 56000, fc: 16800, sal: 18500, cf: 13500, ebe: 7200 },
                  { m: "Juin", ca: 58000, fc: 17400, sal: 19000, cf: 13500, ebe: 8100 },
                  { m: "Juillet", ca: 54000, fc: 16200, sal: 18500, cf: 13500, ebe: 5800 },
                  { m: "Août", ca: 36000, fc: 10800, sal: 14000, cf: 13500, ebe: -2300 },
                  { m: "Septembre", ca: 52000, fc: 15600, sal: 18000, cf: 13500, ebe: 4900 },
                  { m: "Octobre", ca: 56000, fc: 16800, sal: 18500, cf: 13500, ebe: 7200 },
                  { m: "Novembre", ca: 54000, fc: 16200, sal: 18500, cf: 13500, ebe: 5800 },
                  { m: "Décembre", ca: 64000, fc: 19200, sal: 20000, cf: 13500, ebe: 11300 },
                ].map((row, i) => (
                  <tr key={i} className={row.ebe < 0 ? 'bg-red-50' : (i % 2 === 0 ? 'bg-white' : 'bg-mono-1000')}>
                    <td className="py-2 px-3 font-medium text-mono-100">{row.m}</td>
                    <td className="py-2 px-3 text-right">{row.ca.toLocaleString('fr-FR')}€</td>
                    <td className="py-2 px-3 text-right">{row.fc.toLocaleString('fr-FR')}€</td>
                    <td className="py-2 px-3 text-right">{row.sal.toLocaleString('fr-FR')}€</td>
                    <td className="py-2 px-3 text-right">{row.cf.toLocaleString('fr-FR')}€</td>
                    <td className={`py-2 px-3 text-right font-semibold ${row.ebe < 0 ? 'text-red-700' : 'text-emerald-700'}`}>{row.ebe.toLocaleString('fr-FR')}€</td>
                  </tr>
                ))}
                <tr className="bg-teal-50 font-bold">
                  <td className="py-3 px-3 text-teal-900">TOTAL ANNEE</td>
                  <td className="py-3 px-3 text-right text-teal-900">610 000€</td>
                  <td className="py-3 px-3 text-right text-teal-900">183 000€</td>
                  <td className="py-3 px-3 text-right text-teal-900">214 500€</td>
                  <td className="py-3 px-3 text-right text-teal-900">162 000€</td>
                  <td className="py-3 px-3 text-right text-teal-900">50 500€</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p>
              <strong>Analyse :</strong> EBE annuel 50 500€ soit 8,3% du CA. Mois déficitaires (janvier, février, août) compensés par mai, juin, octobre et décembre. La trésorerie cumulée doit anticiper le creux de janvier-février : provisionnez 15-20K€ minimum à fin décembre pour absorber ces deux mois sans difficulté.
            </p>
            <p className="mt-3">
              <strong>Ce que cette simulation ne montre pas :</strong> les amortissements (~6 000€/an), les frais financiers du prêt bancaire (~12 000€/an), et l'IS sur le bénéfice. Marge nette finale après ces déductions : ~5-6% soit 30-35K€ net. C'est le standard d'un restaurant correctement géré, pas un cas exceptionnel.
            </p>
          </div>
        </section>

        {/* Section 8 — Saisonnalité */}
        <section id="saisonnalite" className="mb-16">
          <SectionHeading icon={<Calendar className="w-6 h-6" />} number="8">
            Intégrer la saisonnalité du restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              La saisonnalité est le piège classique du budget restaurant. Diviser le CA annuel par 12 donne une vision fausse de la trésorerie. Un budget qui ignore la saisonnalité mène à l'asphyxie en janvier et août, quand les charges fixes restent identiques mais que le CA chute de 25-40%.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Coefficients saisonniers moyens restauration urbaine</h3>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Mois</th>
                  <th className="text-center py-3 px-4 font-semibold">Bistrot urbain</th>
                  <th className="text-center py-3 px-4 font-semibold">Zone bureaux</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Zone touristique</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { m: "Janvier", b: "0,75", bu: "0,72", t: "0,55" },
                  { m: "Février", b: "0,82", bu: "0,85", t: "0,60" },
                  { m: "Mars", b: "0,95", bu: "0,98", t: "0,80" },
                  { m: "Avril", b: "1,02", bu: "1,00", t: "1,10" },
                  { m: "Mai", b: "1,10", bu: "1,05", t: "1,25" },
                  { m: "Juin", b: "1,15", bu: "1,10", t: "1,35" },
                  { m: "Juillet", b: "1,08", bu: "0,75", t: "1,80" },
                  { m: "Août", b: "0,70", bu: "0,50", t: "1,90" },
                  { m: "Septembre", b: "1,02", bu: "1,15", t: "1,10" },
                  { m: "Octobre", b: "1,10", bu: "1,12", t: "0,95" },
                  { m: "Novembre", b: "1,06", bu: "1,10", t: "0,80" },
                  { m: "Décembre", b: "1,25", bu: "1,18", t: "0,80" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-2 px-4 font-medium text-mono-100">{row.m}</td>
                    <td className="py-2 px-4 text-center">{row.b}</td>
                    <td className="py-2 px-4 text-center">{row.bu}</td>
                    <td className="py-2 px-4 text-center">{row.t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout type="warning">
            <strong>Asymétrie majeure</strong> à comprendre : un restaurant en zone bureaux (La Défense, Part-Dieu) perd 50% de son CA en août quand les actifs sont en vacances. Un restaurant en zone touristique (Honfleur, Annecy) fait à l'inverse 90% de plus en août qu'en moyenne. Votre budget doit refléter cette asymétrie, pas la moyenne nationale.
          </Callout>
        </section>

        {/* Section 9 — Pilotage */}
        <section id="pilotage" className="mb-16">
          <SectionHeading icon={<TrendingDown className="w-6 h-6" />} number="9">
            Pilotage budget vs réel
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un budget non piloté est un document mort. Le pilotage repose sur trois rythmes complémentaires : hebdomadaire pour les indicateurs vitaux, mensuel pour la revue complète, trimestriel pour le reforecast stratégique.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <h3 className="font-bold text-emerald-900 mb-3">Hebdomadaire</h3>
              <ul className="text-xs text-emerald-800 space-y-1.5 list-disc list-inside">
                <li>CA réel vs budget</li>
                <li>Variance food cost</li>
                <li>Heures travaillées vs prévues</li>
                <li>Trésorerie à 30 jours</li>
                <li>Top 3 produits vendus</li>
              </ul>
              <p className="text-xs text-emerald-700 mt-3 italic">15 min chaque lundi matin</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <h3 className="font-bold text-blue-900 mb-3">Mensuel</h3>
              <ul className="text-xs text-blue-800 space-y-1.5 list-disc list-inside">
                <li>Revue complète ligne par ligne</li>
                <li>Calcul EBE et marge nette</li>
                <li>Analyse écarts &gt; 5%</li>
                <li>Décisions correctives 30 jours</li>
                <li>Réunion équipe encadrement</li>
              </ul>
              <p className="text-xs text-blue-700 mt-3 italic">3 heures avant le 10 du mois</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
              <h3 className="font-bold text-purple-900 mb-3">Trimestriel</h3>
              <ul className="text-xs text-purple-800 space-y-1.5 list-disc list-inside">
                <li>Reforecast complet 9 mois</li>
                <li>Ajustement saisonnalité</li>
                <li>Plan d'actions structurel</li>
                <li>Présentation banque si besoin</li>
                <li>Décisions investissement</li>
              </ul>
              <p className="text-xs text-purple-700 mt-3 italic">1 journée pleine tous les 3 mois</p>
            </div>
          </div>

          <div className="bg-mono-975 rounded-xl p-5 mt-8 font-mono text-sm text-mono-100">
            <p className="text-teal-300 mb-2">Seuils d'action sur les écarts :</p>
            <p>Écart {'<'} 5% = surveillance, pas d'action immédiate</p>
            <p>Écart 5-10% = analyse cause + correction mineure</p>
            <p>Écart 10-15% = décision opérationnelle dans les 7 jours</p>
            <p>Écart {'>'} 15% deux mois = reforecast immédiat + plan d'urgence</p>
          </div>
        </section>

        {/* Section 10 — Postes qui dérivent */}
        <section id="derives" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="10">
            Les 7 postes qui dérivent en pratique
          </SectionHeading>

          <div className="space-y-5 mt-8">
            {[
              { num: 1, titre: "Énergie (gaz + électricité + eau)", desc: "4-6% du CA en saison normale, jusqu'à 8% en cas de tension tarifaire. Audit énergétique avant ouverture, contrats annuels indexés. Une hotte mal réglée consomme 20-30% de plus." },
              { num: 2, titre: "Salaires extras et heures supplémentaires", desc: "Enveloppe explicite 3-5% du CA, suivi hebdomadaire. Sans cadrage, peut atteindre 8-10% en saison haute. Le pilotage hebdo des heures travaillées est non négociable." },
              { num: 3, titre: "Pertes matières et démarques inconnues", desc: "Inventaire mensuel + écart food cost théorique vs réel. Une démarque de 3-5% est normale, au-delà c'est un problème de procédure (vol, gaspillage, mauvaise rotation). Suivez les ratios via {' '}", link: "/blog/inventaire-restaurant-guide", linkText: "notre guide de l'inventaire restaurant" },
              { num: 4, titre: "Réparations et maintenance imprévues", desc: "Provision 1-2% du CA en compte épargne dédié. Une chambre froide qui lâche en plein été = 1 500-3 000€ d'intervention express + perte marchandise. Anticipez." },
              { num: 5, titre: "Marketing et communication", desc: "Budget annuel ET mensuel, ROI mesuré sur chaque action. Les paid social mal pilotés peuvent doubler le budget sans amélioration du CA. Tracking obligatoire : code promo, QR code, formulaire." },
              { num: 6, titre: "Abonnements logiciels et SaaS", desc: "Caisse, gestion, paie, réservation, livraison, marketing. Total facile à atteindre 300-600€/mois soit 1-2% du CA. Auditez chaque trimestre pour éliminer les doublons." },
              { num: 7, titre: "Frais bancaires et commissions", desc: "TPE, commission CB, paiements Edenred/Swile, plateformes livraison. Total entre 1,5% et 3% du CA. Négociez chaque année avec votre banque." },
            ].map((post, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 flex gap-4">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
                  {post.num}
                </div>
                <div>
                  <h3 className="font-semibold text-mono-100 mb-2">{post.titre}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">
                    {post.desc}
                    {post.link && (
                      <Link to={post.link} className="text-teal-700 underline hover:text-teal-800">{post.linkText}</Link>
                    )}
                    {post.link && '.'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Callout type="warning">
            <strong>Effet cumulé :</strong> ces 7 postes mal pilotés peuvent représenter 8-12 points de marge nette perdus. Sur un CA de 600 000€, c'est entre 48 000€ et 72 000€ qui disparaissent silencieusement. C'est la différence entre un restaurant rentable et un restaurant à l'équilibre.
          </Callout>
        </section>

        {/* Section 11 — Reforecast */}
        <section id="reforecast" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="11">
            Quand et comment reforecaster
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le reforecast est l'exercice de réajustement du budget à mi-parcours. Trois moments obligatoires dans l'année, plus tout reforecast d'urgence en cas de dérive structurelle.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Les 3 reforecasts standards</h3>
            <ul className="space-y-3 text-mono-350">
              <li><strong>Reforecast M+1</strong> : après le premier mois complet d'exploitation. Confronter les hypothèses au réel, ajuster les 11 mois suivants.</li>
              <li><strong>Reforecast fin T1</strong> : après 3 mois, calage de la saisonnalité réelle observée. Ajuster les 9 mois suivants.</li>
              <li><strong>Reforecast fin T3</strong> : préparation du budget de l'année suivante, intégration des données 9 mois réels + hypothèses Q4.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Reforecast d'urgence : déclencheurs</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li>Écart cumulé &gt; 10% sur 2 mois consécutifs (CA, food cost, masse salariale)</li>
              <li>Évolution structurelle du marché (nouveau concurrent direct, perte d'un service midi)</li>
              <li>Choc externe (canicule, grève, événement majeur, crise sanitaire)</li>
              <li>Décision d'investissement non prévue (rachat matériel, recrutement, travaux)</li>
            </ul>
          </div>
        </section>

        {/* Section 12 — RestauMargin */}
        <section className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="12">
            Automatiser le pilotage avec RestauMargin
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tenir manuellement un budget mensuel + pilotage hebdo, c'est 8 à 12 heures par mois. C'est faisable mais chronophage. RestauMargin automatise ces tâches en connectant vos achats, vos ventes et vos charges.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            {[
              { icon: <Calculator className="w-5 h-5" />, t: "Budget annuel pré-rempli", d: "Hypothèses standards par type de restaurant, ajustables en 30 minutes." },
              { icon: <TrendingUp className="w-5 h-5" />, t: "Suivi temps réel budget vs réel", d: "Dashboard automatique mis à jour à chaque encaissement et chaque facture." },
              { icon: <Award className="w-5 h-5" />, t: "Alertes écarts > 5%", d: "Notification instantanée dès qu'un poste dérive du budget initial." },
              { icon: <BarChart3 className="w-5 h-5" />, t: "Reforecast en 1 clic", d: "Génération automatique du reforecast en intégrant les données réelles." },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">{f.icon}</div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{f.t}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="16 min" variant="footer" />

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes sur le budget prévisionnel</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Pilotez votre budget en temps réel
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin centralise vos achats, votre food cost et vos marges pour comparer chaque jour le réel au prévu, sans ressaisie.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>Essai gratuit 7 jours</strong>, sans engagement, sans carte bancaire.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-bold rounded-full hover:bg-teal-50 transition-colors text-lg shadow-lg">
                Essai gratuit 7 jours
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/outils/calculateur-food-cost" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                <Calculator className="w-5 h-5" />
                Calculateur gratuit
              </Link>
            </div>
          </div>
        </section>

        {/* Articles connexes */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/comment-ouvrir-restaurant-guide-complet" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-all">
              <h3 className="font-semibold text-mono-100 mb-1.5">Ouvrir un restaurant</h3>
              <p className="text-xs text-mono-500">Guide complet en 10 étapes pour créer un restaurant rentable.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-all">
              <h3 className="font-semibold text-mono-100 mb-1.5">Calcul de marge restaurant</h3>
              <p className="text-xs text-mono-500">Formules, benchmarks et cas pratiques pour vos ratios.</p>
            </Link>
            <Link to="/blog/seuil-rentabilite-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-all">
              <h3 className="font-semibold text-mono-100 mb-1.5">Seuil de rentabilité</h3>
              <p className="text-xs text-mono-500">Calcul du break-even et nombre de couverts nécessaires.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-all">
              <h3 className="font-semibold text-mono-100 mb-1.5">Guide du food cost</h3>
              <p className="text-xs text-mono-500">Définition, formule, benchmarks et leviers d'optimisation.</p>
            </Link>
          </div>
        </section>

        {/* Sources */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-mono-100 mb-3">Sources et références</h2>
          <ul className="text-xs text-mono-500 space-y-1.5">
            <li>• INSEE — Démographie et résultats des entreprises restauration 2024-2025</li>
            <li>• BPI France Création — Référentiel financier restauration commerciale</li>
            <li>• GIRA Conseil — Étude sectorielle marges restauration 2025</li>
            <li>• Fiducial Restauration — Baromètre des charges et marges 2024</li>
            <li>• SNRC — Convention collective HCR et grille salaires 2026</li>
            <li>• Banque de France — Taux et conditions de crédit aux PME restauration</li>
          </ul>
        </section>

        {/* Nav bas de page */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/blog/calcul-marge-restaurant" className="text-sm text-teal-600 hover:underline">Calcul de marge restaurant →</Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mt-6 text-xs text-mono-700">
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* Sous-composants */

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

