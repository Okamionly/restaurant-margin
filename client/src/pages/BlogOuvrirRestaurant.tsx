import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Lightbulb, MapPin, FileText, Building2, Banknote, Scale, FileCheck, Wrench, Users, Megaphone, AlertTriangle, ArrowRight, Calculator, BarChart3, TrendingUp, Calendar, CheckCircle, Award, Sparkles } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Comment ouvrir un restaurant en 2026 : guide complet"
   Mots-clé : comment ouvrir un restaurant, investissement ouverture restaurant
   ~3 300 mots — Schemas FAQ + HowTo + Article + BreadcrumbList
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Combien de temps faut-il pour ouvrir un restaurant ?",
    answer: "Comptez 8 à 14 mois entre la décision et la première fourchette servie. Recherche de local 3-6 mois, démarches administratives 2-4 mois, travaux 2-4 mois. Anticipez 2 mois supplémentaires pour les imprévus (commission de sécurité, retard fournisseurs, recrutement)."
  },
  {
    question: "Faut-il un diplôme de cuisine pour ouvrir un restaurant ?",
    answer: "Non. Aucun diplôme n'est obligatoire en France. Seul le permis d'exploitation (formation 20h) est requis pour servir de l'alcool, et la formation HACCP 14h est exigée pour au moins une personne en cuisine. Mais ne pas avoir d'expérience est statistiquement le premier facteur de fermeture précoce selon l'INSEE."
  },
  {
    question: "Vaut-il mieux acheter un fonds existant ou ouvrir from scratch ?",
    answer: "Reprendre un fonds existant coûte 30-50% plus cher mais évite les travaux lourds, génère un CA dès le jour 1, et facilite l'obtention d'un prêt bancaire. Pour un premier projet, la reprise est souvent plus sûre. Création from scratch : adaptez le concept à 100%, mais 12-18 mois sans CA et risque de fermeture élevé."
  },
  {
    question: "Quel chiffre d'affaires viser la première année ?",
    answer: "Un bistrot de 50 couverts en ville moyenne table sur 350 000 à 500 000€ HT la première année, avec montée en puissance progressive : 60% au T1, 80% au T2, 90% au T3, 100% à partir du T4. Une brasserie urbaine bien placée peut viser 600 000-900 000€ HT."
  },
  {
    question: "Quand sait-on que le restaurant est viable ?",
    answer: "Si à la fin du mois 6 vous tournez à plus de 70% du CA prévisionnel et que votre prime cost (food cost + masse salariale) est sous 65%, le projet est viable. Sinon, plan de redressement immédiat : ajustement carte, négociation fournisseurs, optimisation planning."
  },
  {
    question: "Quel apport personnel minimum pour ouvrir un restaurant ?",
    answer: "30% de l'investissement total est le minimum exigé par les banques. Pour un projet à 150 000€, comptez 45 000€ d'apport personnel. En dessous, votre dossier est refusé. Idéalement, visez 35-40% pour négocier de meilleures conditions de prêt."
  },
  {
    question: "Quelles charges sociales pour un restaurateur ?",
    answer: "En SAS/SASU, le dirigeant cotise au régime général : environ 65-80% de charges sociales sur la rémunération nette. En EURL/SARL gérant majoritaire, environ 45% de charges TNS. Pour les salariés, comptez 42% de charges patronales sur le brut + cotisations HCR spécifiques."
  },
  {
    question: "Combien coûte l'équipement complet d'une cuisine professionnelle ?",
    answer: "Budget total pour 60 couverts : 30 000€ à 120 000€ selon le concept. Piano de cuisson 6-15K€, four mixte 4-12K€, chambre froide 5-15K€, plonge + lave-vaisselle 4-8K€, mobilier salle 5-25K€, équipement bar 3-10K€. Une cuisine de gastro double facilement ces montants."
  },
  {
    question: "Comment financer l'ouverture d'un restaurant sans apport ?",
    answer: "Impossible sans apport en 2026. Aucune banque ne finance 100%. Solutions de contournement : prêt d'honneur (Initiative France, Réseau Entreprendre) jusqu'à 30 000€ à taux zéro, crowdfunding (Tudigo, Wiseed) 10-50K€, love money famille, prêt NACRE 8 000€. Cumulés, ces dispositifs peuvent constituer un apport de 50 000€."
  },
  {
    question: "Quelle est la TVA applicable en restauration en 2026 ?",
    answer: "Restauration sur place : 10% sur la nourriture, 20% sur les boissons alcoolisées. Vente à emporter : 5,5% sur les plats préparés froids destinés à consommation différée, 10% sur les plats chauds. La TVA collectée n'appartient pas au restaurant : calculez toujours vos marges en HT."
  },
  {
    question: "Quel statut juridique choisir pour un restaurant ?",
    answer: "EURL pour un solo (régime TNS, charges optimisées, capital libre), SAS/SASU pour les associés ou la levée de fonds (président assimilé salarié), SARL pour le familial (gérance majoritaire ou minoritaire). Pour un premier restaurant : SASU dans 70% des cas (souplesse + protection sociale)."
  },
  {
    question: "Comment réussir le lancement marketing d'un restaurant ?",
    answer: "Soft opening 2 semaines avant (tests sans recettes), friends & family J-7, pré-lancement digital Instagram + Google Business Profile complet, presse locale invitée J-3. Budget marketing 3 premiers mois : 3-5K€ (photo professionnelle, paid social, partenariats influenceurs locaux). Objectif : 30 avis Google 5 étoiles à J+30."
  }
];

const investissementMoyens = [
  { poste: "Fonds de commerce (reprise)", min: 30000, max: 200000, note: "Variable selon localisation et CA repris" },
  { poste: "Droit au bail (création)", min: 10000, max: 80000, note: "Centre-ville : multiplier par 3-5" },
  { poste: "Travaux et agencement", min: 25000, max: 120000, note: "Plomberie + élec + déco + ventilation" },
  { poste: "Équipement cuisine pro", min: 30000, max: 100000, note: "Piano, four, chambre froide, plonge" },
  { poste: "Mobilier salle", min: 5000, max: 25000, note: "Tables, chaises, banquettes, déco" },
  { poste: "Licences et permis", min: 1500, max: 5000, note: "Permis exploitation + licence IV" },
  { poste: "Caisse enregistreuse + TPE", min: 800, max: 3500, note: "Logiciel certifié NF525 obligatoire" },
  { poste: "Stock initial", min: 3000, max: 12000, note: "2 semaines de matière + boissons" },
  { poste: "Fonds de roulement (BFR)", min: 15000, max: 60000, note: "3 mois de charges minimum" },
  { poste: "Frais juridiques et création", min: 1500, max: 4000, note: "Statuts + Kbis + annonces légales" },
  { poste: "Communication lancement", min: 2000, max: 10000, note: "Site, photo, paid social, presse" },
  { poste: "Assurances année 1", min: 1800, max: 4500, note: "RC pro + multirisque + perte exploitation" }
];

export default function BlogOuvrirRestaurant() {
  const faqSchema = buildFAQSchema(faqItems);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "Comment ouvrir un restaurant", url: "https://www.restaumargin.fr/blog/comment-ouvrir-restaurant-guide-complet" }
  ]);

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Comment ouvrir un restaurant en France en 10 étapes",
    description: "Méthode complète pour créer un restaurant rentable : concept, étude de marché, business plan, financement, licences, équipement, lancement.",
    totalTime: "P12M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: "150000"
    },
    tool: ["Business plan", "Étude de marché", "Calculateur food cost", "Logiciel de gestion restaurant"],
    step: [
      { "@type": "HowToStep", name: "Définir le concept", text: "Une phrase courte qu'un client peut répéter à un ami. Cuisine, cible, gamme de prix, capacité, service." },
      { "@type": "HowToStep", name: "Réaliser une étude de marché", text: "Zone de chalandise, concurrence, flux passants. 5 jours de comptage terrain entre 11h45-14h et 19h-22h." },
      { "@type": "HowToStep", name: "Construire le business plan", text: "30-60 pages, partie financière sur 3 ans, prime cost prévisionnel en première page." },
      { "@type": "HowToStep", name: "Choisir le local", text: "Loyer max 8-10% du CA prévisionnel. Bail 3-6-9 négocié avec franchise loyer 3-6 mois." },
      { "@type": "HowToStep", name: "Trouver le financement", text: "30-40% apport personnel + 40-50% prêt bancaire + 10-15% aides et prêts d'honneur." },
      { "@type": "HowToStep", name: "Choisir le statut juridique", text: "EURL, SARL ou SAS/SASU selon profil. Compter 800-2500€ de frais de création." },
      { "@type": "HowToStep", name: "Obtenir licences et permis", text: "Permis d'exploitation 20h, licence IV pour alcool, déclaration ERP, DDPP, HACCP 14h, PMS." },
      { "@type": "HowToStep", name: "Équiper la cuisine", text: "Budget 30-120K€ pour 60 couverts. Piano, four mixte, chambre froide, plonge, mobilier." },
      { "@type": "HowToStep", name: "Recruter l'équipe", text: "Chef, commis, plongeur, chef de rang, serveurs. Anticiper 16-20K€/mois chargé pour 50 couverts." },
      { "@type": "HowToStep", name: "Lancer et communiquer", text: "Soft opening, friends & family, lancement officiel, presse locale. 30 avis Google à J+30." }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Comment ouvrir un restaurant en 2026 : guide complet étape par étape",
    description: "Les 10 étapes pour ouvrir votre restaurant : business plan, financement, licences, recrutement. Investissement, tableaux et formules pour créer un restaurant rentable.",
    image: "https://www.restaumargin.fr/og-image.png",
    datePublished: "2026-04-27",
    dateModified: "2026-05-26",
    author: { "@type": "Organization", name: "La rédaction RestauMargin", url: "https://www.restaumargin.fr/a-propos" },
    publisher: {
      "@type": "Organization",
      name: "RestauMargin",
      logo: { "@type": "ImageObject", url: "https://www.restaumargin.fr/icon-512.png" }
    },
    wordCount: 3300,
    inLanguage: "fr-FR",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://www.restaumargin.fr/blog/comment-ouvrir-restaurant-guide-complet" }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Comment ouvrir un restaurant en 2026 : guide complet étape par étape"
        description="Les 10 étapes pour ouvrir votre restaurant : business plan, financement, licences, recrutement. Investissement moyen, tableaux chiffrés et formules pour créer un restaurant rentable."
        path="/blog/comment-ouvrir-restaurant-guide-complet"
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
            <Link
              to="/outils/calculateur-food-cost"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer ma marge
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
          <span className="text-mono-100 font-medium">Comment ouvrir un restaurant</span>
        </div>
      </div>

      <BlogArticleHero
        category="Création"
        readTime="18 min"
        date="Mai 2026"
        title="Comment ouvrir un restaurant en 2026 : guide complet étape par étape"
        accentWord="ouvrir un restaurant"
        subtitle="60% des restaurants ferment dans les 3 premières années. Voici les 10 étapes, le budget réaliste, les tableaux d'investissement et les pièges à éviter pour faire partie des 40% qui réussissent."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="18 min" variant="header" />

        {/* Intro */}
        <p className="text-[#374151] text-lg leading-relaxed mb-8 mt-10">
          Saviez-vous que 60% des restaurants ferment dans les 3 premières années en France selon l'INSEE ? Pourtant, chaque mois, près de 1 200 nouveaux établissements ouvrent leurs portes. La différence entre ceux qui survivent et ceux qui disparaissent ne tient pas à la qualité de la cuisine, mais à la rigueur de la préparation. Ouvrir un restaurant en 2026 demande entre <strong>80 000€ et 350 000€ d'investissement</strong> selon le concept et la localisation, une connaissance fine de la réglementation française, et surtout une obsession pour les chiffres dès le premier jour. Ce guide complet vous donne la méthode chronologique, les tableaux d'investissement actualisés et les formules à présenter à votre banquier pour mettre toutes les chances de votre côté.
        </p>

        {/* Encadré chiffres clés */}
        <div className="mt-6 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Chiffres clés ouverture restaurant 2026</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div>
              <div className="text-2xl font-extrabold">8-14 mois</div>
              <div className="text-xs text-teal-100">Durée projet complet</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold">150 000€</div>
              <div className="text-xs text-teal-100">Investissement médian</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold">30-40%</div>
              <div className="text-xs text-teal-100">Apport personnel exigé</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold">8% / CA</div>
              <div className="text-xs text-teal-100">Marge nette cible</div>
            </div>
          </div>
        </div>

        {/* Sommaire */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#concept', label: 'Définir votre concept' },
              { href: '#etude', label: 'Réaliser une étude de marché' },
              { href: '#business-plan', label: 'Construire votre business plan' },
              { href: '#local', label: 'Choisir le local idéal' },
              { href: '#financement', label: 'Trouver le financement' },
              { href: '#statut', label: 'Choisir le statut juridique' },
              { href: '#licences', label: 'Obtenir licences et permis' },
              { href: '#cuisine', label: 'Équiper la cuisine et la salle' },
              { href: '#equipe', label: 'Recruter votre équipe' },
              { href: '#lancement', label: 'Lancer et communiquer' },
              { href: '#investissement', label: 'Tableau complet investissements' },
              { href: '#rentabilite', label: 'Calculer la rentabilité prévisionnelle' },
              { href: '#timeline', label: 'Timeline 12 mois jusqu\'à l\'ouverture' },
              { href: '#erreurs', label: 'Les 7 erreurs à éviter' },
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

        {/* Section 1 — Concept */}
        <section id="concept" className="mb-16">
          <SectionHeading icon={<Lightbulb className="w-6 h-6" />} number="1">
            Définir votre concept de restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tout commence par une promesse claire. Un concept de restaurant tient en une phrase courte qu'un client peut répéter à un ami :
              {' '}<em>"un bistrot de quartier qui sert les meilleurs burgers maison à moins de 18€"</em>. Si vous ne pouvez pas formuler votre concept en une phrase, c'est qu'il n'est pas encore assez clair pour exister. Les concepts vagues ne survivent pas à la confrontation avec le marché.
            </p>
            <p>
              Avant même de chercher un local ou de faire un business plan, prenez 2 à 3 semaines pour répondre aux 6 questions fondatrices. Chaque réponse vous engage sur des dizaines de milliers d'euros d'investissement et plusieurs années d'exploitation.
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {[
              { titre: "Type de cuisine", desc: "Française, méditerranéenne, asiatique, fusion, végétarienne. La spécialisation crée la notoriété." },
              { titre: "Cible client", desc: "Étudiants, employés, familles, touristes, gastronomes. Définit le ticket moyen et l'emplacement." },
              { titre: "Gamme de prix", desc: "12€ (fast-casual), 25€ (bistrot), 45€ (brasserie), 80€+ (gastronomique). Détermine vos charges fixes." },
              { titre: "Type de service", desc: "À table classique, comptoir rapide, click & collect, livraison. Impact direct sur effectif et marge." },
              { titre: "Capacité d'accueil", desc: "30, 60, 100, 150 couverts. Influence loyer, équipement, masse salariale et CA cible." },
              { titre: "Horaires d'ouverture", desc: "Déjeuner seul, soir seul, continu non-stop, brunch week-end. Impacte productivité et break-even." },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5">
                <h3 className="font-bold text-mono-100 mb-2">{item.titre}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <Callout type="info">
            <strong>Règle d'or de la spécialisation :</strong> mieux vaut être le meilleur ramen de votre arrondissement qu'un restaurant moyen qui propose ramen, pasta, salades, burgers et tarama. Les cartes courtes (12-18 plats) génèrent 15-25% de marge brute supplémentaire grâce à la maîtrise du food cost et à la rotation des stocks.
          </Callout>
        </section>

        {/* Section 2 — Étude de marché */}
        <section id="etude" className="mb-16">
          <SectionHeading icon={<MapPin className="w-6 h-6" />} number="2">
            Réaliser une étude de marché sérieuse
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une étude sérieuse coûte entre 0€ (en autonomie avec données INSEE et BPI France) et 5 000€ (cabinet spécialisé). Elle doit répondre à 4 questions concrètes : zone de chalandise, concurrence directe, concurrence indirecte, et flux de passants. Une étude bâclée est la première cause de fermeture à 18 mois selon les chiffres du SNRC.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Les 4 dimensions à analyser</h3>
            <ul className="space-y-2 text-mono-350">
              <li><strong>Zone de chalandise primaire</strong> : 500m à pied autour du local, soit 8-12 minutes. Recensez population, CSP, âges, foyers (données INSEE gratuites).</li>
              <li><strong>Concurrence directe</strong> : tous les restaurants proposant la même cuisine dans la zone. Notez tickets moyens, créneaux, qualité service.</li>
              <li><strong>Concurrence indirecte</strong> : boulangeries, traiteurs, dark kitchens, livraison. Captent une partie de votre demande.</li>
              <li><strong>Flux et saisonnalité</strong> : passants, parkings, transports en commun, événements locaux, vacances scolaires.</li>
            </ul>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6">
            <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-600" />
              Le test terrain qui vaut mille études
            </h3>
            <p className="text-sm text-mono-400 leading-relaxed">
              Passez <strong>5 jours différents</strong> (incluant un samedi et un dimanche) à compter les passants devant votre futur local entre 11h45 et 14h, puis entre 19h et 22h. Notez l'âge moyen, le profil, et combien entrent dans les commerces voisins. Cette donnée brute vaut plus que mille études théoriques et vous permet de calibrer votre CA prévisionnel avec une marge d'erreur inférieure à 15%.
            </p>
          </div>
        </section>

        {/* Section 3 — Business plan */}
        <section id="business-plan" className="mb-16">
          <SectionHeading icon={<FileText className="w-6 h-6" />} number="3">
            Construire un business plan solide
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le business plan est votre boussole et votre meilleur argument pour décrocher un financement bancaire. Comptez 30 à 60 pages, avec une partie financière sur 3 ans détaillée mensuellement la première année. Le {' '}
              <Link to="/blog/budget-previsionnel-restaurant" className="text-teal-700 underline hover:text-teal-800">budget prévisionnel</Link> est le cœur du business plan : c'est lui qui détermine la viabilité du projet.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Structure d'un business plan restaurant gagnant</h3>
            <ol className="list-decimal list-inside space-y-2 text-mono-350">
              <li><strong>Résumé exécutif (2 pages)</strong> — concept, équipe, marché, demande financière, ROI prévu.</li>
              <li><strong>Présentation du porteur de projet (3-4 pages)</strong> — parcours, expérience, motivation, équipe.</li>
              <li><strong>Concept et offre (5-8 pages)</strong> — positionnement, carte type, prix, expérience client.</li>
              <li><strong>Étude de marché (6-10 pages)</strong> — zone, concurrence, cibles, tendances, opportunité.</li>
              <li><strong>Stratégie commerciale (4-6 pages)</strong> — communication, partenariats, fidélisation, digital.</li>
              <li><strong>Partie financière (10-15 pages)</strong> — investissement, CA, charges, EBE, trésorerie, ROI.</li>
              <li><strong>Annexes</strong> — CV, devis fournisseurs, photos local, fiches techniques, contrats.</li>
            </ol>
          </div>

          <div className="bg-mono-975 rounded-xl p-5 mt-6 font-mono text-sm text-mono-100">
            <p className="text-teal-300 mb-2">Le ratio que les banques regardent en premier :</p>
            <p>Prime cost = (Food cost + Masse salariale chargée) / CA HT × 100</p>
            <p className="text-mono-400 mt-2 text-xs">
              {'< 60% : excellent | 60-65% : bon | 65-70% : tendu | > 70% : refus probable'}
            </p>
          </div>

          <div className="prose-content mt-6">
            <p>
              Pour aller plus loin sur la construction de la partie financière, consultez notre guide dédié sur le {' '}
              <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800">calcul de marge restaurant</Link> et notre {' '}
              <Link to="/blog/seuil-rentabilite-restaurant" className="text-teal-700 underline hover:text-teal-800">méthode pour calculer le seuil de rentabilité</Link>.
            </p>
          </div>
        </section>

        {/* Section 4 — Local */}
        <section id="local" className="mb-16">
          <SectionHeading icon={<Building2 className="w-6 h-6" />} number="4">
            Choisir le local idéal
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le local représente entre 40% et 60% du succès d'un restaurant selon une étude GIRA Conseil 2024. Un mauvais emplacement avec une cuisine excellente peut couler le projet, alors qu'un excellent emplacement avec une cuisine correcte survit. Pour autant, un loyer trop élevé étrangle la marge nette : la règle universelle du secteur est claire.
            </p>
          </div>

          <div className="bg-mono-975 rounded-xl p-5 mt-6 font-mono text-sm text-mono-100">
            <p className="text-teal-300 mb-2">Règle du loyer maximum :</p>
            <p>Loyer HT mensuel ≤ 8 à 10% du CA prévisionnel mensuel HT</p>
            <p className="text-mono-400 mt-2 text-xs">
              Exemple : loyer 4 500€ HT/mois → CA mensuel min 50 000€ → CA annuel 600 000€
            </p>
          </div>

          <div className="prose-content mt-6">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Les clauses à négocier dans le bail 3-6-9</h3>
            <ul className="space-y-2 text-mono-350">
              <li><strong>Franchise de loyer 3 à 6 mois</strong> pendant les travaux pour préserver la trésorerie.</li>
              <li><strong>Plafonnement de l'indexation ILC</strong> à 3-5% maximum par an pour éviter les hausses brutales.</li>
              <li><strong>Droit au bail vs pas-de-porte</strong> : négocier l'option la plus favorable selon le contexte.</li>
              <li><strong>Travaux à charge bailleur</strong> pour les gros œuvres (toiture, façade, mise aux normes).</li>
              <li><strong>Clause d'activités large</strong> pour pouvoir faire évoluer le concept sans renégocier.</li>
              <li><strong>Clause de sortie anticipée</strong> en cas de difficultés (rare mais à tenter).</li>
              <li><strong>Dépôt de garantie réduit</strong> à 3 mois si possible (parfois 6 demandés).</li>
            </ul>
          </div>

          <Callout type="warning">
            <strong>Piège fréquent :</strong> ne signez jamais un bail sans avoir vérifié la conformité ERP (Établissement Recevant du Public) et la possibilité d'installer une hotte aspirante avec sortie en toiture. Le coût d'une mise aux normes peut atteindre 30-50K€ et plomber votre budget travaux.
          </Callout>
        </section>

        {/* Section 5 — Financement */}
        <section id="financement" className="mb-16">
          <SectionHeading icon={<Banknote className="w-6 h-6" />} number="5">
            Trouver le financement (apport + prêts + aides)
          </SectionHeading>

          <div className="prose-content">
            <p>
              La structure type d'un plan de financement restaurant en 2026 : 25-35% d'apport personnel, 40-50% de prêt bancaire principal, 5-10% de prêt d'honneur taux zéro, 5-15% de crowdfunding, 3-8% d'aides régionales. Cumuler plusieurs sources réduit la pression sur l'apport et rassure le banquier.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Source de financement</th>
                  <th className="text-center py-3 px-4 font-semibold">% du plan</th>
                  <th className="text-center py-3 px-4 font-semibold">Conditions</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Taux 2026</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { src: "Apport personnel + love money", pct: "30-40%", cond: "Épargne + famille/amis", taux: "—" },
                  { src: "Prêt bancaire restaurant", pct: "40-50%", cond: "Apport 30% + business plan", taux: "4,5-6,5%" },
                  { src: "Prêt d'honneur (Initiative France)", pct: "5-10%", cond: "Comité de sélection", taux: "0%" },
                  { src: "Prêt BPI Création", pct: "5-15%", cond: "Plafonné 50 000€", taux: "Taux bonifié" },
                  { src: "NACRE", pct: "2-5%", cond: "Demandeur d'emploi", taux: "0%" },
                  { src: "Crowdfunding (Tudigo, Wiseed)", pct: "5-15%", cond: "Campagne 8-12 semaines", taux: "6-9%" },
                  { src: "Aides régionales", pct: "2-8%", cond: "Variable par région", taux: "Subvention" },
                  { src: "ACRE (exonération charges)", pct: "—", cond: "Premier projet", taux: "Économie 5-8K€" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.src}</td>
                    <td className="py-3 px-4 text-center">{row.pct}</td>
                    <td className="py-3 px-4 text-center text-xs">{row.cond}</td>
                    <td className="py-3 px-4 text-center font-semibold">{row.taux}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout type="warning">
            <strong>La règle des 30% intangible :</strong> aucune banque ne vous prêtera sans 30% d'apport personnel minimum. Pour un projet à 150 000€, comptez 45 000€ d'apport. Pour un projet à 250 000€, 75 000€. En dessous, votre dossier est refusé d'office, même avec un business plan parfait. Augmentez votre apport via prêt d'honneur (compté comme quasi-fonds propres par les banques).
          </Callout>
        </section>

        {/* Section 6 — Statut juridique */}
        <section id="statut" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="6">
            Choisir le statut juridique adapté
          </SectionHeading>

          <div className="prose-content">
            <p>
              Trois statuts dominent la restauration française. Le choix dépend de votre profil (solo ou associé), de votre projet de croissance (un restaurant ou plusieurs), et de votre situation patrimoniale. Comptez 800 à 2 500€ pour la rédaction des statuts par un avocat ou expert-comptable, 150-250€ de publication légale, et 1 à 2 semaines pour obtenir le Kbis.
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-5">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <h3 className="font-bold text-emerald-900 mb-2">EURL</h3>
              <p className="text-xs text-emerald-800 mb-3">Solo, premier projet</p>
              <ul className="text-xs text-emerald-800 space-y-1.5">
                <li>• Capital libre (1€ min)</li>
                <li>• Charges TNS ~45%</li>
                <li>• Comptabilité simplifiée</li>
                <li>• Pas de cotisations chômage</li>
                <li>• Responsabilité limitée apports</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <h3 className="font-bold text-blue-900 mb-2">SARL</h3>
              <p className="text-xs text-blue-800 mb-3">Familial, gérance partagée</p>
              <ul className="text-xs text-blue-800 space-y-1.5">
                <li>• 2-100 associés</li>
                <li>• Capital libre (1€ min)</li>
                <li>• Gérant majoritaire TNS</li>
                <li>• Cadre légal strict</li>
                <li>• Cession parts encadrée</li>
              </ul>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
              <h3 className="font-bold text-purple-900 mb-2">SAS / SASU</h3>
              <p className="text-xs text-purple-800 mb-3">Croissance, levée de fonds</p>
              <ul className="text-xs text-purple-800 space-y-1.5">
                <li>• Statuts flexibles</li>
                <li>• Président assimilé salarié</li>
                <li>• Charges ~75% (sécu complète)</li>
                <li>• Facilite entrée investisseurs</li>
                <li>• Idéal multi-restaurants</li>
              </ul>
            </div>
          </div>

          <div className="prose-content mt-6">
            <p>
              Pour comprendre les implications de votre statut sur les {' '}
              <Link to="/blog/charges-sociales-restauration" className="text-teal-700 underline hover:text-teal-800">charges sociales en restauration</Link>, consultez notre guide dédié. La différence entre TNS (EURL) et assimilé salarié (SASU) peut représenter 10 000 à 20 000€ par an pour un gérant rémunéré 3 500€ net mensuel.
            </p>
          </div>
        </section>

        {/* Section 7 — Licences */}
        <section id="licences" className="mb-16">
          <SectionHeading icon={<FileCheck className="w-6 h-6" />} number="7">
            Obtenir licences et permis obligatoires
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est l'étape la plus chronophage et la plus sous-estimée par les porteurs de projet : 2 à 4 mois pour l'ensemble. Anticipez dès la signature du bail pour ne pas retarder l'ouverture. Le {' '}
              <strong>permis d'exploitation</strong> est obligatoire avant l'ouverture (formation 20h, 250-400€) et reste valable 10 ans.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Check-list complète des démarches</h3>
            <ul className="space-y-2 text-mono-350">
              <li><strong>Permis d'exploitation</strong> — formation 20h obligatoire pour vendre de l'alcool, 250-400€.</li>
              <li><strong>Licence restaurant complète (IV)</strong> — pour servir tous alcools avec repas, déclaration mairie + douanes.</li>
              <li><strong>Licence III</strong> — uniquement boissons fermentées (vin, bière) si pas de spiritueux.</li>
              <li><strong>Déclaration ERP en mairie</strong> — passage commission de sécurité avant ouverture (1-3 mois).</li>
              <li><strong>Déclaration sanitaire DDPP</strong> — formulaire CERFA n°13984, à déposer 1 mois avant ouverture.</li>
              <li><strong>Plan de Maîtrise Sanitaire (PMS)</strong> — document HACCP obligatoire, rédaction 30-50 pages.</li>
              <li><strong>Formation HACCP 14h</strong> — pour au moins une personne en cuisine, 250-500€.</li>
              <li><strong>Logiciel de caisse certifié NF525</strong> — obligation fiscale depuis 2018, conservation 6 ans.</li>
              <li><strong>Affichages obligatoires</strong> — prix, origine viandes, allergènes, interdiction fumer, alcool mineurs.</li>
              <li><strong>Assurance RC pro + multirisque</strong> — couverture minimum 1,5M€ recommandée.</li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Pour aller plus loin :</strong> consultez notre guide dédié à la {' '}
            <Link to="/blog/haccp-restaurant" className="text-teal-700 underline hover:text-teal-800">méthode HACCP en restauration</Link> et au {' '}
            <Link to="/blog/calendrier-haccp-restaurant-modele-gratuit" className="text-teal-700 underline hover:text-teal-800">calendrier HACCP quotidien</Link>. Une inspection DDPP négative peut entraîner une fermeture administrative en 24-72h.
          </Callout>
        </section>

        {/* Section 8 — Cuisine */}
        <section id="cuisine" className="mb-16">
          <SectionHeading icon={<Wrench className="w-6 h-6" />} number="8">
            Équiper la cuisine et la salle
          </SectionHeading>

          <div className="prose-content">
            <p>
              Budget total pour 60 couverts : <strong>30 000€ à 120 000€</strong> selon le concept et le niveau de finition. La répartition typique : piano 6-15K€, four mixte 4-12K€, chambre froide positive + négative 5-15K€, plonge + lave-vaisselle 4-8K€, mobilier salle 5-25K€, équipement bar 3-10K€.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Équipement</th>
                  <th className="text-center py-3 px-4 font-semibold">Min</th>
                  <th className="text-center py-3 px-4 font-semibold">Standard</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Premium</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { eq: "Piano de cuisson 6 feux", min: "6 000€", std: "10 000€", prem: "15 000€" },
                  { eq: "Four mixte (vapeur/sec)", min: "4 000€", std: "8 000€", prem: "12 000€" },
                  { eq: "Chambre froide positive", min: "3 000€", std: "6 000€", prem: "10 000€" },
                  { eq: "Chambre froide négative", min: "2 500€", std: "5 000€", prem: "8 000€" },
                  { eq: "Plonge inox + douchette", min: "1 500€", std: "3 000€", prem: "5 000€" },
                  { eq: "Lave-vaisselle pro capot", min: "2 500€", std: "5 000€", prem: "8 000€" },
                  { eq: "Hotte aspirante + extraction", min: "4 000€", std: "8 000€", prem: "15 000€" },
                  { eq: "Mobilier salle (60 couverts)", min: "5 000€", std: "12 000€", prem: "25 000€" },
                  { eq: "Bar + tireuse + frigos", min: "3 000€", std: "6 000€", prem: "10 000€" },
                  { eq: "Petit matériel (couteaux, etc.)", min: "1 500€", std: "3 000€", prem: "5 000€" },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.eq}</td>
                    <td className="py-3 px-4 text-center">{row.min}</td>
                    <td className="py-3 px-4 text-center">{row.std}</td>
                    <td className="py-3 px-4 text-center">{row.prem}</td>
                  </tr>
                ))}
                <tr className="bg-teal-50 font-bold">
                  <td className="py-3 px-4 text-teal-900">TOTAL cuisine 60 couverts</td>
                  <td className="py-3 px-4 text-center text-teal-900">33 000€</td>
                  <td className="py-3 px-4 text-center text-teal-900">66 000€</td>
                  <td className="py-3 px-4 text-center text-teal-900">113 000€</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p>
              <strong>Neuf vs occasion :</strong> les sites professionnels (Restomarché, Bazardesresto, Restomania) permettent d'économiser 30 à 50% avec garantie 6-12 mois. Évitez Le Bon Coin pour la cuisson : risque de panne dans les 3 mois et zéro garantie. Pour les chambres froides et lave-vaisselle, l'occasion pro est rentable. Pour le piano et le four mixte, privilégiez le neuf : ce sont les pièces maîtresses et la fiabilité est critique.
            </p>
          </div>
        </section>

        {/* Section 9 — Équipe */}
        <section id="equipe" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="9">
            Recruter votre équipe
          </SectionHeading>

          <div className="prose-content">
            <p>
              Pénurie réelle dans le secteur : 250 000 postes vacants en France en 2026 selon Pôle Emploi. Pour un bistrot 50 couverts, comptez chef (3 200-4 200€), commis (2 100-2 800€), plongeur (1 800-2 100€), chef de rang (2 200-2 800€), serveur (1 800-2 100€) — soit environ <strong>16 800€/mois chargé</strong> pour une équipe minimale.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Grille type des salaires 2026 (brut mensuel)</h3>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste</th>
                  <th className="text-center py-3 px-4 font-semibold">Débutant</th>
                  <th className="text-center py-3 px-4 font-semibold">Confirmé</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Coût total chargé</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Chef de cuisine</td><td className="py-3 px-4 text-center">2 800€</td><td className="py-3 px-4 text-center">4 200€</td><td className="py-3 px-4 text-center">4 000-6 000€</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Second / Sous-chef</td><td className="py-3 px-4 text-center">2 300€</td><td className="py-3 px-4 text-center">3 200€</td><td className="py-3 px-4 text-center">3 300-4 600€</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Commis de cuisine</td><td className="py-3 px-4 text-center">1 900€</td><td className="py-3 px-4 text-center">2 400€</td><td className="py-3 px-4 text-center">2 700-3 400€</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Plongeur</td><td className="py-3 px-4 text-center">1 800€</td><td className="py-3 px-4 text-center">2 100€</td><td className="py-3 px-4 text-center">2 600-3 000€</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Chef de rang</td><td className="py-3 px-4 text-center">2 000€</td><td className="py-3 px-4 text-center">2 800€</td><td className="py-3 px-4 text-center">2 800-4 000€</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Serveur</td><td className="py-3 px-4 text-center">1 800€</td><td className="py-3 px-4 text-center">2 200€</td><td className="py-3 px-4 text-center">2 600-3 100€</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Maître d'hôtel</td><td className="py-3 px-4 text-center">2 600€</td><td className="py-3 px-4 text-center">3 800€</td><td className="py-3 px-4 text-center">3 700-5 400€</td></tr>
              </tbody>
            </table>
          </div>

          <Callout type="warning">
            <strong>Coût caché d'un mauvais recrutement :</strong> un employé qui démissionne dans le mois coûte 2 500 à 4 000€ (recrutement, formation, sous-effectif, ambiance dégradée). Mieux vaut prendre 3 semaines de plus pour le bon profil que de remplacer 3 fois en 6 mois. Pour mesurer l'impact sur votre masse salariale, consultez notre guide sur le {' '}
            <Link to="/blog/reduire-cout-personnel-restaurant" className="text-teal-700 underline hover:text-teal-800">coût du personnel en restauration</Link>.
          </Callout>
        </section>

        {/* Section 10 — Lancement */}
        <section id="lancement" className="mb-16">
          <SectionHeading icon={<Megaphone className="w-6 h-6" />} number="10">
            Lancer et communiquer efficacement
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un lancement réussi se prépare 6 à 8 semaines à l'avance. Quatre phases successives s'enchaînent pour créer une montée en puissance maîtrisée plutôt qu'un démarrage chaotique qui consume la trésorerie. Budget marketing recommandé pour les 3 premiers mois : 3 000 à 8 000€.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Les 4 phases de lancement</h3>
            <ol className="list-decimal list-inside space-y-2 text-mono-350">
              <li><strong>Soft opening (J-14)</strong> — service test sans recette, équipe en rodage, ajustements carte et flux.</li>
              <li><strong>Friends & family (J-7)</strong> — invitation 60-80 proches, repas offert contre retours détaillés et avis Google.</li>
              <li><strong>Pré-lancement digital (J-3 à J-1)</strong> — Instagram + Google Business + presse locale invitée gratuitement.</li>
              <li><strong>Lancement officiel (J)</strong> — ouverture grand public, communication continue, paid social ciblé.</li>
            </ol>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Calendrier 90 jours post-ouverture</h3>
            <ul className="space-y-2 text-mono-350">
              <li><strong>J+1 à J+30</strong> : viser 60% de remplissage, collecter 30 avis Google 5 étoiles, ajuster carte selon retours.</li>
              <li><strong>J+30 à J+60</strong> : viser 80% de remplissage, partenariats locaux (entreprises voisines, hôtels, événements).</li>
              <li><strong>J+60 à J+90</strong> : atteindre rythme de croisière, première analyse comptable sérieuse, ajuster prix si food cost dérive.</li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Levier sous-exploité :</strong> 87% des recherches "restaurant + ville" sur Google se font sur mobile et 64% des clients consultent les avis avant de venir. Un Google Business Profile complet (photos, horaires, menu, réponse à 100% des avis) génère en moyenne +35% de visibilité local et +18% de couverts dès le 2ème mois.
          </Callout>
        </section>

        {/* Section 11 — Tableau investissement */}
        <section id="investissement" className="mb-16">
          <SectionHeading icon={<Banknote className="w-6 h-6" />} number="11">
            Tableau complet des investissements
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la décomposition détaillée du budget d'ouverture d'un restaurant de 50-60 couverts en France métropolitaine en 2026. Les fourchettes sont issues des données BPI France, Fiducial, et de notre base de données RestauMargin (500+ restaurants connectés).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste d'investissement</th>
                  <th className="text-right py-3 px-4 font-semibold">Min</th>
                  <th className="text-right py-3 px-4 font-semibold">Max</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Note</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {investissementMoyens.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.poste}</td>
                    <td className="py-3 px-4 text-right">{row.min.toLocaleString('fr-FR')}€</td>
                    <td className="py-3 px-4 text-right">{row.max.toLocaleString('fr-FR')}€</td>
                    <td className="py-3 px-4 text-xs text-mono-500">{row.note}</td>
                  </tr>
                ))}
                <tr className="bg-teal-50 font-bold">
                  <td className="py-3 px-4 text-teal-900">TOTAL ouverture restaurant</td>
                  <td className="py-3 px-4 text-right text-teal-900">125 600€</td>
                  <td className="py-3 px-4 text-right text-teal-900">624 000€</td>
                  <td className="py-3 px-4 text-xs text-teal-700">Médiane 150-250K€</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p>
              <strong>Ratios de répartition typiques</strong> sur un projet médian à 200 000€ : 40% travaux + agencement, 30% équipement cuisine/salle, 15% fonds de commerce ou droit au bail, 10% fonds de roulement, 5% frais administratifs et lancement. Si votre concept est un fast-casual avec service au comptoir, la part équipement diminue (cuisine plus simple) au profit de la déco et du digital. Si c'est un gastronomique, c'est l'inverse.
            </p>
          </div>
        </section>

        {/* Section 12 — Rentabilité prévisionnelle */}
        <section id="rentabilite" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="12">
            Calculer la rentabilité prévisionnelle
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant d'investir 200 000€, vous devez savoir exactement quel CA est nécessaire pour rentrer dans vos frais et combien vous pouvez espérer gagner. Voici la formule de rentabilité simplifiée à présenter à votre banquier.
            </p>
          </div>

          <div className="bg-mono-975 rounded-xl p-5 mt-6 font-mono text-sm text-mono-100">
            <p className="text-teal-300 mb-2">Formule du seuil de rentabilité (break-even) :</p>
            <p>Seuil = Charges fixes annuelles / (1 - (Food cost + Charges variables))</p>
            <p className="text-mono-400 mt-2 text-xs">
              Exemple : 180 000€ charges fixes / (1 - 0,35) = 277 000€ CA HT minimum
            </p>
          </div>

          <div className="prose-content mt-6">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Exemple chiffré : bistrot 60 couverts</h3>
            <p>
              Hypothèses : ticket moyen 28€ HT, taux remplissage 50% sur 2 services × 26 jours/mois, ouvert 11 mois/an (4 semaines fermeture cumulée).
            </p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste</th>
                  <th className="text-right py-3 px-4 font-semibold">Année 1</th>
                  <th className="text-right py-3 px-4 font-semibold">Année 2</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Année 3</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">CA HT prévisionnel</td><td className="py-3 px-4 text-right">450 000€</td><td className="py-3 px-4 text-right">570 000€</td><td className="py-3 px-4 text-right">620 000€</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Food cost 32%</td><td className="py-3 px-4 text-right text-red-700">-144 000€</td><td className="py-3 px-4 text-right text-red-700">-176 700€</td><td className="py-3 px-4 text-right text-red-700">-186 000€</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">= Marge brute</td><td className="py-3 px-4 text-right font-bold text-emerald-900">306 000€</td><td className="py-3 px-4 text-right font-bold text-emerald-900">393 300€</td><td className="py-3 px-4 text-right font-bold text-emerald-900">434 000€</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Masse salariale 34%</td><td className="py-3 px-4 text-right text-red-700">-153 000€</td><td className="py-3 px-4 text-right text-red-700">-193 800€</td><td className="py-3 px-4 text-right text-red-700">-211 000€</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Loyer + charges</td><td className="py-3 px-4 text-right text-red-700">-48 000€</td><td className="py-3 px-4 text-right text-red-700">-49 500€</td><td className="py-3 px-4 text-right text-red-700">-51 000€</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Énergie + assurances + divers</td><td className="py-3 px-4 text-right text-red-700">-58 500€</td><td className="py-3 px-4 text-right text-red-700">-68 400€</td><td className="py-3 px-4 text-right text-red-700">-74 400€</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Amortissements (5 ans)</td><td className="py-3 px-4 text-right text-red-700">-30 000€</td><td className="py-3 px-4 text-right text-red-700">-30 000€</td><td className="py-3 px-4 text-right text-red-700">-30 000€</td></tr>
                <tr className="bg-blue-50"><td className="py-3 px-4 font-bold text-blue-900">= Résultat avant impôt</td><td className="py-3 px-4 text-right font-bold text-blue-900">16 500€</td><td className="py-3 px-4 text-right font-bold text-blue-900">51 600€</td><td className="py-3 px-4 text-right font-bold text-blue-900">67 600€</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-mono-500">Marge nette</td><td className="py-3 px-4 text-right">3,7%</td><td className="py-3 px-4 text-right">9,1%</td><td className="py-3 px-4 text-right">10,9%</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-6">
            <p>
              <strong>Lecture :</strong> année 1 difficile (marge nette 3,7%), année 2 satisfaisante (9,1%), année 3 confortable (10,9%). C'est le scénario typique d'un restaurant bien lancé. Si vous projetez une marge nette de 15% dès l'année 1, votre business plan est probablement irréaliste — les banques vous le diront. Pour comprendre comment piloter ces marges au quotidien, consultez notre {' '}
              <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800">guide du food cost</Link> et notre {' '}
              <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        {/* Section 13 — Timeline */}
        <section id="timeline" className="mb-16">
          <SectionHeading icon={<Calendar className="w-6 h-6" />} number="13">
            Timeline 12 mois jusqu'à l'ouverture
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici le calendrier idéal pour ouvrir votre restaurant sans stress et sans dépassement budgétaire. Chaque étape conditionne la suivante : ne brûlez pas les étapes, ne lancez pas les travaux sans le financement validé.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {[
              { mois: "M-12", titre: "Décision et concept", desc: "Validation du projet, écriture du concept en 1 phrase, premier panel de 20 clients potentiels." },
              { mois: "M-10", titre: "Étude de marché terrain", desc: "Comptage flux, benchmark concurrence, analyse zone de chalandise INSEE." },
              { mois: "M-8", titre: "Business plan finalisé", desc: "Rédaction complète, prévisionnel financier 3 ans, validation expert-comptable." },
              { mois: "M-7", titre: "Recherche de local", desc: "Visites, étude bail, négociation, signature compromis sous conditions." },
              { mois: "M-6", titre: "Constitution du dossier financier", desc: "RDV banques (minimum 3), prêt d'honneur, demandes aides, crowdfunding lancé." },
              { mois: "M-5", titre: "Financement obtenu + bail signé", desc: "Accord bancaire écrit, signature bail, création société, ouverture compte pro." },
              { mois: "M-4", titre: "Démarches administratives", desc: "Licence IV, permis exploitation, déclaration ERP, DDPP, contrats fournisseurs." },
              { mois: "M-3", titre: "Travaux et équipement", desc: "Démolition, plomberie, électricité, hotte, installations cuisine, mobilier." },
              { mois: "M-2", titre: "Recrutement équipe", desc: "Annonces, entretiens, signature contrats, formation HACCP, équipements vestimentaires." },
              { mois: "M-1", titre: "Tests et soft opening", desc: "Tests recettes, calibrage flux, friends & family, ajustements, photo professionnelle." },
              { mois: "M-0", titre: "Lancement officiel", desc: "Ouverture grand public, campagne paid social, presse locale, monitoring quotidien." },
            ].map((step, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 flex gap-5">
                <div className="w-16 shrink-0 text-center">
                  <div className="text-xs text-teal-600 font-bold">{step.mois}</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-mono-100 mb-1">{step.titre}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 14 — Erreurs */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="14">
            Les 7 erreurs fatales à éviter
          </SectionHeading>

          <div className="space-y-5 mt-8">
            {[
              { num: 1, titre: "Sous-estimer le BFR (besoin en fonds de roulement)", desc: "Sans 3 mois de trésorerie d'avance, le moindre ralentissement (grippe saisonnière, grève, météo) tue le projet. Prévoyez 15 000 à 60 000€ de fonds de roulement selon votre taille. C'est la première cause de fermeture à 8-12 mois." },
              { num: 2, titre: "Ne pas mesurer son food cost dès le jour 1", desc: "Marge brute à 55% au lieu de 70% prévu : sur 500 000€ de CA, c'est 75 000€ de pertes invisibles par an. Mettez en place un suivi food cost hebdomadaire dès l'ouverture, sans exception." },
              { num: 3, titre: "Surcharger la carte avec trop de plats", desc: "Les meilleurs restaurants 2026 fonctionnent avec 12 à 18 plats. Plus de plats = plus de pertes, plus de complexité cuisine, moins de spécialisation, qualité hétérogène. Pour optimiser, lisez notre guide sur le menu engineering." },
              { num: 4, titre: "Négliger les outils digitaux et le SEO local", desc: "Un restaurant sans Google Business à jour perd 30% de clientèle potentielle. Site web optimisé mobile, photos professionnelles, gestion des avis, réservation en ligne : ce sont des bases non négociables en 2026." },
              { num: 5, titre: "Confondre passion culinaire et compétence gestionnaire", desc: "Cuisiner et gérer un restaurant sont deux métiers distincts. Si vous détestez les chiffres, prenez un associé qui les aime, ou recrutez un manager dès le mois 3. 70% des restaurateurs cuisinent bien et gèrent mal." },
              { num: 6, titre: "Ouvrir avec un endettement excessif", desc: "Plus le remboursement mensuel est élevé, plus le seuil de rentabilité monte. Un prêt de 200 000€ sur 7 ans = 2 800€/mois de remboursement. Sans 50K€ de CA mensuel minimum, c'est intenable." },
              { num: 7, titre: "Ne pas piloter ses marges au quotidien", desc: "Sans tableau de bord hebdomadaire (CA, food cost, masse salariale, EBE), on découvre les pertes 3 mois trop tard. À ce stade, la trésorerie est consumée. Utilisez un logiciel de gestion dès le jour 1, pas après le premier exercice comptable." },
            ].map((err, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 flex gap-4">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
                  {err.num}
                </div>
                <div>
                  <h3 className="font-semibold text-mono-100 mb-2">{err.titre}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{err.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Callout type="warning">
            <strong>Impact cumulé :</strong> ces 7 erreurs combinées multiplient par 4 le risque de fermeture à 3 ans. Un porteur de projet qui les évite a 65-70% de chances de succès. Un porteur de projet qui les ignore a moins de 25% de chances de tenir 36 mois. La différence ne tient pas au talent culinaire, mais à la discipline gestionnaire.
          </Callout>
        </section>

        {/* Section automatisation */}
        <section className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="15">
            Piloter son restaurant dès le jour 1
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'erreur classique du restaurateur débutant est de penser que "on verra les chiffres à la fin du mois". Trois mois plus tard, la trésorerie est consumée et on découvre le problème trop tard. RestauMargin a été conçu pour automatiser le pilotage dès le jour 1.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            {[
              { icon: <Calculator className="w-5 h-5" />, t: "Calcul food cost automatique", d: "Vos fiches techniques calculent le food cost en temps réel à partir des prix fournisseurs." },
              { icon: <TrendingUp className="w-5 h-5" />, t: "Suivi marge quotidien", d: "Marge brute, food cost et prime cost actualisés chaque jour, alertes en cas de dérive." },
              { icon: <BarChart3 className="w-5 h-5" />, t: "Menu engineering intégré", d: "Identifiez vos stars, vos chevaux de labour et vos poids morts pour optimiser votre carte." },
              { icon: <Award className="w-5 h-5" />, t: "Scan factures OCR", d: "Photographiez vos factures fournisseurs : les prix sont extraits et fiches techniques mises à jour." },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">{f.icon}</div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{f.t}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="18 min" variant="footer" />

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes sur l'ouverture d'un restaurant</h2>
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
              Lancez votre restaurant avec les bons outils
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin suit votre food cost, votre masse salariale et votre rentabilité en temps réel, dès le premier service. La différence entre un restaurant qui survit et un restaurant qui prospère.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>Essai gratuit 7 jours</strong>, sans engagement, sans carte bancaire.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
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

        {/* Articles connexes */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/budget-previsionnel-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-all">
              <h3 className="font-semibold text-mono-100 mb-1.5">Budget prévisionnel restaurant</h3>
              <p className="text-xs text-mono-500">Méthode complète pour construire et piloter votre budget 12 mois.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-all">
              <h3 className="font-semibold text-mono-100 mb-1.5">Calcul de marge restaurant</h3>
              <p className="text-xs text-mono-500">Formules, benchmarks et cas pratiques pour maîtriser vos ratios.</p>
            </Link>
            <Link to="/blog/seuil-rentabilite-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-all">
              <h3 className="font-semibold text-mono-100 mb-1.5">Seuil de rentabilité</h3>
              <p className="text-xs text-mono-500">Calcul du break-even et nombre de couverts nécessaires.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-all">
              <h3 className="font-semibold text-mono-100 mb-1.5">Guide du food cost</h3>
              <p className="text-xs text-mono-500">Définition, formule, benchmarks et 10 leviers d'optimisation.</p>
            </Link>
          </div>
        </section>

        {/* Sources */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-mono-100 mb-3">Sources et références</h2>
          <ul className="text-xs text-mono-500 space-y-1.5">
            <li>• INSEE — Démographie des entreprises de restauration, données 2024-2025</li>
            <li>• BPI France Création — Guide créateur d'entreprise restauration</li>
            <li>• GIRA Conseil — Étude sectorielle restauration commerciale 2025</li>
            <li>• Fiducial Restauration — Baromètre marges restauration 2024</li>
            <li>• SNRC (Syndicat National de la Restauration Collective) — Chiffres clés 2026</li>
            <li>• Pôle Emploi — Métiers en tension restauration 2026</li>
          </ul>
        </section>

        {/* Nav bas de page */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/blog/budget-previsionnel-restaurant" className="text-sm text-teal-600 hover:underline">Budget prévisionnel restaurant →</Link>
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
