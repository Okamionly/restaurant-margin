import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Users, Zap, ListChecks, Sparkles, ShoppingCart, Building2, PiggyBank } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Regle 30/30/30/10 restaurant — guide complet"
   Mot-cle PAA principal : regle 30 30 30 10 restaurant
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'La regle 30/30/30/10 est-elle adaptee a tous les types de restaurants ?',
    answer: "Non. Cette regle s'applique principalement a la restauration traditionnelle assise avec service a table. Une pizzeria, un fast-food ou un restaurant gastronomique ont des structures de couts tres differentes. La regle 30/30/30/10 est un cadre de reference, pas une obligation. Adaptez les ratios a votre concept (voir tableau benchmarks par segment).",
  },
  {
    question: 'Que comprennent les 30 % de masse salariale exactement ?',
    answer: "Les 30 % de masse salariale englobent le salaire brut + les charges patronales (40-45 % sur le brut en France) + les avantages en nature (repas du personnel valorises a 4,40 EUR/jour environ) + l'interim et les extras. C'est le cout complet employeur, pas seulement le salaire net verse.",
  },
  {
    question: 'Pourquoi 10 % de marge nette et pas plus en restauration ?',
    answer: "La restauration est un secteur a forte intensite humaine et capitalistique : 60 % des couts sont fixes (loyer, personnel, energie). Une marge nette de 10 % est consideree comme excellente. La moyenne reelle du secteur en France oscille entre 4 et 8 %. Atteindre les 10 % de marge nette demande une gestion rigoureuse et un concept solide.",
  },
  {
    question: 'Comment savoir si mon restaurant respecte la regle 30/30/30/10 ?',
    answer: "Recuperez vos comptes de resultat des 12 derniers mois. Calculez : (achats matieres / CA HT) x 100, (masse salariale chargee / CA HT) x 100, (charges fixes hors personnel et matieres / CA HT) x 100. La marge nette est ce qui reste. Si un poste depasse 32-33 %, vous avez un signal d'alerte a creuser.",
  },
  {
    question: 'Que faire si mon food cost depasse 35 % ?',
    answer: "Plusieurs leviers : auditer vos fiches techniques (grammages reels vs theoriques), peser le gaspillage pendant 2 semaines, negocier 3 devis sur vos 10 plus gros postes d'achat, ajuster les prix de vente des plats a faible marge, retirer les plats non-rentables de la carte (menu engineering Boston Matrix), reduire les portions sur les plats premium discrets.",
  },
  {
    question: 'La regle 30/30/30/10 inclut-elle les boissons ?',
    answer: "Oui, la regle s'applique au CA total HT (cuisine + bar). Mais attention : la marge brute sur les boissons est generalement bien meilleure (food cost 18-22 % sur les vins, 25-30 % sur les alcools forts) que sur les plats. Plus votre ratio boissons/cuisine est eleve, plus vous pouvez vous permettre un food cost cuisine eleve. Le mix moyen vise est 25-30 % de CA sur les boissons.",
  },
  {
    question: "Le loyer doit-il representer une part precise des 30 % de charges ?",
    answer: "Oui. Le loyer ideal en restauration represente 6 a 10 % du CA HT. Au-dela de 12 %, il devient tres difficile de degager une marge nette correcte. Dans les zones premium parisiennes ou cote d'azur, certains restaurants paient 15-18 % de loyer : ils doivent compenser par un ticket moyen plus eleve ou un volume plus important.",
  },
  {
    question: "La regle 30/30/30/10 est-elle differente pour les chaines et franchises ?",
    answer: "Oui. Une franchise integre une redevance (5-8 % du CA) + un fonds marketing (2-3 %) qui s'ajoutent aux charges. Le 30 % d'autres charges peut grimper a 35-40 %. En contrepartie, les achats sont mutualises (food cost reduit a 26-28 %) et la masse salariale optimisee par les process. Le 10 % de marge nette reste un objectif realiste pour une franchise performante.",
  },
];

export default function BlogRegle30303010() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Regle 30/30/30/10 restaurant : guide complet 2026 (food cost, personnel, charges, marge)"
        description="Comprendre la regle 30/30/30/10 en restauration : 30% food cost + 30% masse salariale + 30% charges + 10% marge nette. Adaptations par segment, calculs, erreurs courantes."
        path="/blog/regle-30-30-30-10-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Regle 30/30/30/10 restaurant', url: 'https://www.restaumargin.fr/blog/regle-30-30-30-10-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment calculer la regle 30/30/30/10 pour votre restaurant',
            description: "Methode pas-a-pas pour verifier si votre restaurant respecte la regle 30/30/30/10 a partir de vos comptes de resultat.",
            totalTime: 'PT30M',
            tool: ['Compte de resultat 12 mois', 'Tableur ou logiciel RestauMargin', 'Calculatrice'],
            step: [
              { '@type': 'HowToStep', name: 'Reunir vos comptes de resultat', text: "Recuperez votre compte de resultat des 12 derniers mois (ou 3 a 6 derniers mois si demarrage recent). Identifiez le chiffre d'affaires HT total." },
              { '@type': 'HowToStep', name: 'Calculer le ratio food cost', text: "Additionnez tous les achats matieres (denrees alimentaires + boissons). Divisez par le CA HT. Multipliez par 100. Cible : 28-32 %." },
              { '@type': 'HowToStep', name: 'Calculer le ratio masse salariale', text: "Additionnez salaires bruts + charges patronales + interim + avantages en nature. Divisez par le CA HT. Multipliez par 100. Cible : 28-32 %." },
              { '@type': 'HowToStep', name: 'Calculer les autres charges', text: "Additionnez loyer + energie + assurances + marketing + comptable + telecoms + entretien + amortissements + frais bancaires + impots locaux. Divisez par le CA HT. Multipliez par 100. Cible : 28-32 %." },
              { '@type': 'HowToStep', name: 'Verifier la marge nette', text: "Marge nette = 100 - (food cost + masse salariale + autres charges). Si vous obtenez 10 % ou plus, vous respectez la regle. Sinon, identifiez le poste en derive." },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Regle 30/30/30/10 restaurant : guide complet 2026',
            description: "Comprendre la regle 30/30/30/10 en restauration : 30% food cost + 30% masse salariale + 30% charges + 10% marge nette. Adaptations par segment, calculs, erreurs courantes.",
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/regle-30-30-30-10-restaurant' },
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
          <span className="text-mono-100 font-medium">Regle 30/30/30/10 restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Rentabilite"
        readTime="14 min"
        date="Mai 2026"
        title="Regle 30/30/30/10 restaurant : guide complet 2026"
        accentWord="30/30/30/10"
        subtitle="La regle 30/30/30/10 est le cadre de reference pour mesurer la rentabilite d'un restaurant traditionnel. Decouvrez la decomposition des 4 postes, les adaptations par segment et les leviers pour rentrer dans les clous."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="14 min" variant="header" />

        {/* ── Encadre definition rapide (featured snippet target) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Definition rapide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Qu'est-ce que la regle 30/30/30/10 ?
          </h2>
          <p className="text-teal-50 text-base sm:text-lg leading-relaxed">
            La regle 30/30/30/10 en restauration definit la repartition ideale du chiffre d'affaires :
            <strong className="text-white"> 30 % pour le cout matieres (food cost)</strong>,
            <strong className="text-white"> 30 % pour la masse salariale (incluant charges)</strong>,
            <strong className="text-white"> 30 % pour les autres charges fixes</strong> (loyer, energie, assurances),
            et <strong className="text-white">10 % de marge nette</strong> pour le restaurateur.
            C'est un cadre theorique qui sert de reference pour mesurer la rentabilite d'un restaurant traditionnel.
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
              { href: '#definition', label: "Qu'est-ce que la regle 30/30/30/10 ?" },
              { href: '#origine', label: 'Origine et histoire de la regle' },
              { href: '#decomposition', label: 'Decomposition des 4 postes' },
              { href: '#benchmarks', label: 'Tableau benchmarks par segment' },
              { href: '#exemple', label: 'Exemple chiffre : restaurant 500 k EUR de CA' },
              { href: '#calcul', label: 'Comment calculer la regle pour votre restaurant' },
              { href: '#adaptations', label: 'Adaptations selon votre concept' },
              { href: '#leviers', label: '5 leviers pour respecter la regle' },
              { href: '#erreurs', label: 'Erreurs courantes a eviter' },
              { href: '#faq', label: 'Questions frequentes' },
              { href: '#cta', label: 'Pilotez votre rentabilite avec RestauMargin' },
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

        {/* ═════════════ SECTION 1 : Definition ═════════════ */}
        <section id="definition" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Qu'est-ce que la regle 30/30/30/10 en restauration ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              La regle 30/30/30/10 est un cadre de gestion utilise par les restaurateurs pour piloter
              leur rentabilite. Elle decompose chaque euro de chiffre d'affaires HT en quatre postes
              de depenses ou de profit. Sa simplicite est ce qui en fait sa force : trois nombres a
              memoriser pour evaluer la sante financiere de votre etablissement.
            </p>
            <p>
              Concretement, sur 100 EUR encaisses (hors taxes) dans votre restaurant :
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-3">
              <li><strong>30 EUR</strong> doivent partir en achats de denrees alimentaires et boissons (food cost)</li>
              <li><strong>30 EUR</strong> doivent couvrir le personnel (salaires + charges + extras)</li>
              <li><strong>30 EUR</strong> doivent couvrir tous les autres frais fixes (loyer, energie, assurances, marketing, comptable, amortissements)</li>
              <li><strong>10 EUR</strong> doivent rester comme marge nette pour le restaurateur</li>
            </ul>
            <p>
              C'est un objectif et non une regle stricte. Tres peu de restaurants atteignent
              parfaitement cette repartition. La moyenne nationale en France oscille entre
              4 et 8 % de marge nette, ce qui signifie que beaucoup d'etablissements sont en
              derive sur un ou plusieurs postes. La regle 30/30/30/10 sert donc de boussole :
              elle indique la direction, pas une obligation immediate.
            </p>

            <Callout type="info">
              <strong>A retenir :</strong> la regle 30/30/30/10 s'applique au CA HT (hors taxes).
              Calculer en TTC fausserait tous les ratios. En France, la TVA en restauration sur
              place est de 10 %, et de 5,5 % pour la vente a emporter.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Origine ═════════════ */}
        <section id="origine" className="mb-16">
          <SectionHeading icon={<BookOpen className="w-6 h-6" />} number="2">
            Origine et histoire de la regle 30/30/30/10
          </SectionHeading>

          <div className="prose-content">
            <p>
              La regle 30/30/30/10 trouve son origine dans la litterature financiere
              americaine de la restauration, popularisee dans les annees 1980-1990 par
              les cabinets de conseil specialises et les ecoles hotelieres. Elle est
              une declinaison simplifiee du concept de <Link to="/blog/prime-cost-restaurant" className="text-teal-700 underline hover:text-teal-800">prime cost</Link>
              {' '}(food cost + masse salariale), considere comme l'indicateur cle de
              la rentabilite operationnelle.
            </p>
            <p>
              Aux Etats-Unis, on parle plutot de la "rule of thirds" (regle des tiers) :
              un tiers pour la nourriture, un tiers pour le travail, un tiers pour tout
              le reste. Le 10 % de marge nette est une cible europeenne, plus realiste
              dans un contexte fiscal et social plus charge qu'aux Etats-Unis.
            </p>
            <p>
              En France, la regle a ete largement diffusee par les organisations
              professionnelles (UMIH, GNI) et les centres de formation (CCI, CFA hoteliers).
              Elle reste aujourd'hui le cadre de reference le plus enseigne en gestion
              restaurant, meme si les realites du terrain — inflation matieres, hausse
              continue du SMIC, energie volatile — la rendent de plus en plus difficile
              a atteindre sans pilotage rigoureux.
            </p>

            <Callout type="warning">
              <strong>Limite de la regle :</strong> la regle 30/30/30/10 a ete pensee pour
              un restaurant traditionnel avec service a table. Un fast-food, une pizzeria,
              un food truck ou un restaurant gastronomique ont des structures de couts
              fondamentalement differentes (voir tableau benchmarks plus bas).
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Decomposition ═════════════ */}
        <section id="decomposition" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="3">
            Decomposition des 4 postes de la regle
          </SectionHeading>

          <div className="prose-content">
            <p>
              Comprendre en detail ce que recouvre chacun des quatre 30 % et 10 % est
              essentiel pour bien piloter sa rentabilite. Beaucoup de restaurateurs
              sous-estiment certains postes (charges patronales, energie, amortissements)
              et surevaluent leur marge reelle.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            <RatioCard
              icon={<ShoppingCart className="w-6 h-6" />}
              percent="30%"
              title="Food cost"
              color="amber"
              subtitle="Cout matieres premieres"
              items={[
                "Denrees alimentaires (viandes, poissons, fruits, legumes)",
                "Epicerie, condiments, epices, huiles",
                "Boissons (vins, bieres, spiritueux, softs)",
                "Pains, viennoiseries, desserts achetes",
                "Emballages a usage unique (vente a emporter)",
                "Pertes et casses inevitables",
              ]}
            />
            <RatioCard
              icon={<Users className="w-6 h-6" />}
              percent="30%"
              title="Masse salariale"
              color="blue"
              subtitle="Personnel + charges + avantages"
              items={[
                "Salaires bruts (cuisine, service, plonge, directeur)",
                "Charges patronales URSSAF (40-45 % du brut)",
                "Cotisations retraite, prevoyance, mutuelle",
                "Avantages en nature (repas du personnel 4,40 EUR/jour)",
                "Interim, extras, contrats saisonniers",
                "Formation continue, medecine du travail",
              ]}
            />
            <RatioCard
              icon={<Building2 className="w-6 h-6" />}
              percent="30%"
              title="Autres charges"
              color="purple"
              subtitle="Tous les frais fixes hors personnel et matieres"
              items={[
                "Loyer + charges locatives (6-10 % du CA ideal)",
                "Energie : electricite, gaz, eau",
                "Assurances RC pro, multirisque, perte d'exploitation",
                "Marketing : reseaux sociaux, plateformes (TheFork, UberEats)",
                "Comptable, juridique, conseil",
                "Amortissements mobilier et materiel cuisine",
                "Telecoms, internet, logiciel de caisse",
                "Entretien, reparations, blanchisserie linge",
              ]}
            />
            <RatioCard
              icon={<PiggyBank className="w-6 h-6" />}
              percent="10%"
              title="Marge nette"
              color="emerald"
              subtitle="Ce qui reste pour le restaurateur"
              items={[
                "Remuneration du dirigeant",
                "Capacite d'autofinancement (renouvellement materiel)",
                "Remboursement emprunts en cours",
                "Reserves pour aleas (panne, baisse activite)",
                "Distribution de dividendes en SARL/SAS",
                "Impot sur les benefices (IS 15-25 %)",
              ]}
            />
          </div>

          <Callout type="info">
            <strong>Point cle :</strong> les 10 % de marge nette sont la marge avant impot
            sur les societes. Apres IS (15 % jusqu'a 42 500 EUR de benefice, 25 % au-dela
            en 2026), il reste 7,5 a 8,5 % de marge nette apres impot pour le restaurateur.
            C'est ce qui finance la croissance et la remuneration du dirigeant.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Benchmarks par segment ═════════════ */}
        <section id="benchmarks" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="4">
            Tableau benchmarks par segment de restauration
          </SectionHeading>

          <div className="prose-content">
            <p>
              La regle 30/30/30/10 est calibree pour la restauration traditionnelle assise.
              D'autres segments ont des structures tres differentes. Voici les ratios de
              reference observes en France en 2026, issus des etudes sectorielles (Xerfi,
              INSEE, UMIH, GNI).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Segment</th>
                  <th className="text-right py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-right py-3 px-4 font-semibold">Masse sal.</th>
                  <th className="text-right py-3 px-4 font-semibold">Autres charges</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Marge nette</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-emerald-50">
                  <td className="py-3 px-4 font-bold text-emerald-900">Traditionnelle (regle classique)</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">30 %</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">30 %</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">30 %</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-900">10 %</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Bistrot / brasserie</td>
                  <td className="py-3 px-4 text-right">28 %</td>
                  <td className="py-3 px-4 text-right">32 %</td>
                  <td className="py-3 px-4 text-right">30 %</td>
                  <td className="py-3 px-4 text-right font-semibold">10 %</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-medium text-mono-100">Gastronomique (etoiles)</td>
                  <td className="py-3 px-4 text-right">35 %</td>
                  <td className="py-3 px-4 text-right">40 %</td>
                  <td className="py-3 px-4 text-right">22 %</td>
                  <td className="py-3 px-4 text-right font-semibold">3 %</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Fast-food / restauration rapide</td>
                  <td className="py-3 px-4 text-right">28 %</td>
                  <td className="py-3 px-4 text-right">22 %</td>
                  <td className="py-3 px-4 text-right">30 %</td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-700">20 %</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-medium text-mono-100">Pizzeria</td>
                  <td className="py-3 px-4 text-right">25 %</td>
                  <td className="py-3 px-4 text-right">25 %</td>
                  <td className="py-3 px-4 text-right">30 %</td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-700">20 %</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Boulangerie / patisserie</td>
                  <td className="py-3 px-4 text-right">25 %</td>
                  <td className="py-3 px-4 text-right">30 %</td>
                  <td className="py-3 px-4 text-right">35 %</td>
                  <td className="py-3 px-4 text-right font-semibold">10 %</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-medium text-mono-100">Food truck</td>
                  <td className="py-3 px-4 text-right">28 %</td>
                  <td className="py-3 px-4 text-right">20 %</td>
                  <td className="py-3 px-4 text-right">25 %</td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-700">27 %</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Bar a vins / a tapas</td>
                  <td className="py-3 px-4 text-right">26 %</td>
                  <td className="py-3 px-4 text-right">28 %</td>
                  <td className="py-3 px-4 text-right">32 %</td>
                  <td className="py-3 px-4 text-right font-semibold">14 %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Lecture du tableau :</strong> un restaurant gastronomique a typiquement
              un food cost plus eleve (produits nobles, fournisseurs locaux d'exception) et
              une masse salariale enorme (brigade de 8-15 personnes). Sa marge nette est
              tres faible (2-5 %) mais les chefs etoiles misent sur les revenus annexes
              (cours de cuisine, livres, image, consulting) pour atteindre la rentabilite.
            </p>
            <p>
              A l'oppose, une pizzeria ou un fast-food fait du volume avec peu de personnel
              et des matieres optimisees : la marge nette peut atteindre 20 %. C'est pour
              cela que ces concepts sont si attractifs en franchise.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Exemple chiffre ═════════════ */}
        <section id="exemple" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="5">
            Exemple chiffre complet : restaurant 500 k EUR de CA
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons un cas concret : une brasserie de 60 couverts en region, qui realise
              500 000 EUR de CA HT annuel (soit environ 1 850 EUR de CA par jour, ouvert
              270 jours par an). Voici comment la regle 30/30/30/10 se decline en euros et
              quel est l'enjeu reel sur chaque poste.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste</th>
                  <th className="text-right py-3 px-4 font-semibold">% du CA</th>
                  <th className="text-right py-3 px-4 font-semibold">Montant annuel</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Montant mensuel</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Chiffre d'affaires HT</td><td className="py-3 px-4 text-right font-bold">100 %</td><td className="py-3 px-4 text-right font-bold">500 000 EUR</td><td className="py-3 px-4 text-right font-bold">41 667 EUR</td></tr>
                <tr className="bg-amber-50"><td className="py-3 px-4 font-medium text-amber-900">- Food cost (matieres + boissons)</td><td className="py-3 px-4 text-right text-amber-900">30 %</td><td className="py-3 px-4 text-right text-amber-900">150 000 EUR</td><td className="py-3 px-4 text-right text-amber-900">12 500 EUR</td></tr>
                <tr className="bg-blue-50"><td className="py-3 px-4 font-medium text-blue-900">- Masse salariale chargee</td><td className="py-3 px-4 text-right text-blue-900">30 %</td><td className="py-3 px-4 text-right text-blue-900">150 000 EUR</td><td className="py-3 px-4 text-right text-blue-900">12 500 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-mono-100 pl-8">Loyer + charges locatives</td><td className="py-3 px-4 text-right">8 %</td><td className="py-3 px-4 text-right">40 000 EUR</td><td className="py-3 px-4 text-right">3 333 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-mono-100 pl-8">Energie (elec + gaz + eau)</td><td className="py-3 px-4 text-right">5 %</td><td className="py-3 px-4 text-right">25 000 EUR</td><td className="py-3 px-4 text-right">2 083 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-mono-100 pl-8">Marketing + plateformes</td><td className="py-3 px-4 text-right">4 %</td><td className="py-3 px-4 text-right">20 000 EUR</td><td className="py-3 px-4 text-right">1 667 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-mono-100 pl-8">Assurances</td><td className="py-3 px-4 text-right">2 %</td><td className="py-3 px-4 text-right">10 000 EUR</td><td className="py-3 px-4 text-right">833 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-mono-100 pl-8">Comptable + conseil</td><td className="py-3 px-4 text-right">2 %</td><td className="py-3 px-4 text-right">10 000 EUR</td><td className="py-3 px-4 text-right">833 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-mono-100 pl-8">Amortissements + frais financiers</td><td className="py-3 px-4 text-right">5 %</td><td className="py-3 px-4 text-right">25 000 EUR</td><td className="py-3 px-4 text-right">2 083 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-mono-100 pl-8">Telecoms, entretien, divers</td><td className="py-3 px-4 text-right">4 %</td><td className="py-3 px-4 text-right">20 000 EUR</td><td className="py-3 px-4 text-right">1 667 EUR</td></tr>
                <tr className="bg-purple-50"><td className="py-3 px-4 font-bold text-purple-900">= Total autres charges</td><td className="py-3 px-4 text-right font-bold text-purple-900">30 %</td><td className="py-3 px-4 text-right font-bold text-purple-900">150 000 EUR</td><td className="py-3 px-4 text-right font-bold text-purple-900">12 500 EUR</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">= Marge nette avant IS</td><td className="py-3 px-4 text-right font-bold text-emerald-900">10 %</td><td className="py-3 px-4 text-right font-bold text-emerald-900">50 000 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-900">4 167 EUR</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Lecture :</strong> avec une regle 30/30/30/10 respectee, la brasserie
              degage 50 000 EUR de marge nette annuelle, soit environ 4 167 EUR par mois.
              Apres impot sur les societes (15 % jusqu'a 42 500 EUR, 25 % au-dela), il reste
              environ 41 500 EUR pour la remuneration du dirigeant et la capacite d'autofinancement.
            </p>
            <p>
              Si la masse salariale derive de 30 a 35 % (un seul recrutement de plus), la marge
              nette tombe a 5 % : <strong>25 000 EUR/an, soit 2 100 EUR/mois</strong>. Et a 38 %
              de masse salariale, le restaurateur est a l'equilibre... ou en perte. C'est la
              fragilite du modele restauration : chaque point de derive coute tres cher.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Comment calculer ═════════════ */}
        <section id="calcul" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="6">
            Comment calculer la regle pour votre restaurant ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la methode pas-a-pas pour verifier si votre restaurant respecte la regle
              30/30/30/10. Comptez 30 minutes la premiere fois si vos comptes sont a jour,
              plus si vous devez retraiter des donnees.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Reunir vos comptes de resultat des 12 derniers mois',
                body: "Recuperez votre dernier bilan ou un export comptable sur 12 mois glissants. Si vous demarrez, prenez les 3 ou 6 derniers mois. Identifiez la ligne chiffre d'affaires HT total (sans TVA). C'est votre base 100.",
              },
              {
                title: 'Calculer le ratio food cost',
                body: "Additionnez tous les achats matieres : compte 601 (denrees alimentaires) + 602 (boissons) + 6064 (fournitures non stockables) si vous integrez les emballages. Divisez par le CA HT. Multipliez par 100. Cible : 28-32 % en traditionnel, 25 % en pizzeria, 35 % en gastronomique.",
              },
              {
                title: 'Calculer le ratio masse salariale',
                body: "Additionnez les comptes 641 (remunerations brutes) + 645 (charges sociales) + 6411 (interim) + 648 (avantages en nature). Divisez par le CA HT. Multipliez par 100. Cible : 28-32 % en traditionnel.",
              },
              {
                title: 'Calculer le total autres charges',
                body: "Additionnez tout le reste : 612 (loyer), 606 (energie), 616 (assurances), 622 (honoraires comptable), 623 (publicite), 6256 (telecoms), 615 (entretien), 681 (amortissements), 661 (frais financiers), 635 (impots locaux). Divisez par CA HT, multipliez par 100. Cible : 28-32 %.",
              },
              {
                title: "Verifier la marge nette et identifier les derives",
                body: "Marge nette = 100 - (food cost + masse salariale + autres charges). Si vous obtenez 10 % ou plus, vous respectez la regle. Si vous etes a 5 %, identifiez le poste en derive et appliquez les leviers correspondants (voir section 8). Si vous etes a 0 % ou negatif, urgence : auditez complet en moins de 30 jours.",
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
            <strong>Astuce gain de temps :</strong> RestauMargin calcule vos ratios
            automatiquement a partir de vos achats et de votre caisse, sans Excel.
            Vous voyez en temps reel si vous respectez la regle 30/30/30/10 et quels
            postes derivent.{' '}
            <Link to="/login?mode=register" className="underline font-semibold hover:text-teal-700">
              Essai gratuit 7 jours
            </Link>.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Adaptations ═════════════ */}
        <section id="adaptations" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="7">
            Adaptations selon votre concept
          </SectionHeading>

          <div className="prose-content">
            <p>
              La regle 30/30/30/10 est un cadre de reference, pas un dogme. Voici comment
              l'ajuster en fonction de votre concept et de vos contraintes specifiques.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Restaurant a forte intensite vins</h3>
            <p>
              Si les boissons (vins surtout) representent 35 a 45 % de votre CA, vous pouvez
              accepter un food cost cuisine plus eleve (32-34 %) car la marge brute boissons
              compense largement. Cible food cost global : 28 %, masse salariale 30 %, autres
              30 %, marge 12 %.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Restaurant a forte composante a emporter</h3>
            <p>
              La TVA a 5,5 % (au lieu de 10 %) augmente mecaniquement votre marge brute si
              vous gardez le meme prix TTC. Mais les couts d'emballages (boites, sacs, couverts
              jetables, sacs de transport) ajoutent 2 a 4 % au food cost. Cible : food cost
              32 %, masse salariale 26 % (moins de service), autres 30 %, marge 12 %.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Restaurant en franchise</h3>
            <p>
              La redevance franchiseur (5-8 % du CA) et le fonds publicitaire (2-3 %)
              s'ajoutent aux autres charges. Le 30 % grimpe a 35-40 %. En contrepartie, les
              achats centralises baissent le food cost a 26-28 %. Cible franchise mature :
              food cost 27 %, masse salariale 28 %, autres 35 %, marge 10 %.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Restaurant en demarrage (moins de 18 mois)</h3>
            <p>
              Les 18 premiers mois supportent des couts d'investissement initiaux non amortis :
              communication de lancement, formation du personnel, ajustements de la carte,
              gaspillage en hausse. Acceptez une marge nette negative ou faible (0-3 %) pendant
              cette phase, en visant la regle complete a partir du mois 18-24.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : 5 leviers ═════════════ */}
        <section id="leviers" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="8">
            5 leviers pour respecter la regle si vous derivez
          </SectionHeading>

          <div className="prose-content">
            <p>
              Si votre marge nette est inferieure a 5 %, voici les 5 leviers prioritaires
              pour rentrer dans la regle 30/30/30/10. Commencez par celui qui correspond
              au poste le plus en derive identifie dans le diagnostic.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            {[
              {
                num: 1,
                title: "Reduire le food cost (objectif : -2 a -4 points)",
                body: "Auditer les fiches techniques (grammages reels vs theoriques), peser le gaspillage pendant 2 semaines pour identifier les gisements, renegocier 3 devis sur vos 10 plus gros postes d'achat (effet immediat de 3-5 % sur les produits concernes), retirer 2-3 plats non-rentables de la carte. Lien : guide complet sur le food cost dans la section ressources.",
              },
              {
                num: 2,
                title: "Optimiser la masse salariale (objectif : -2 a -3 points)",
                body: "Refaire le planning au quart d'heure pres en fonction de la frequentation reelle (souvent 10-15 % de surstaffing en heures creuses), reduire le turnover (un recrutement coute 3 a 6 mois de salaire en formation et perte de productivite), former la polyvalence cuisine/salle pour reduire les effectifs creux.",
              },
              {
                num: 3,
                title: "Renegocier le loyer ou demenager",
                body: "Si votre loyer depasse 12 % du CA, c'est un blocage structurel. Negociez une baisse en presentant votre compte de resultat (les bailleurs preferent un locataire viable a un local vide). Sinon, planifiez un demenagement vers un local a 8-10 % du CA dans un rayon de 1-2 km pour conserver la clientele.",
              },
              {
                num: 4,
                title: "Augmenter le ticket moyen (objectif : +5 a +10 %)",
                body: "Upselling boissons (verre de vin, eau gazeuse, cafe gourmand), suggestion desserts systematique, ajout d'une formule premium a +30 % du prix moyen, mise en avant des plats a forte marge (menu engineering Boston Matrix). Une hausse de 8 % du ticket moyen ajoute directement 6-7 % de marge nette.",
              },
              {
                num: 5,
                title: "Augmenter la frequence et la rotation des tables",
                body: "Reduire le temps de service en optimisant les process cuisine (mise en place plus rigoureuse, batch cooking), passer de 1 a 1,3 services le midi en pic, ouvrir un 7e jour ou un service supplementaire le soir. Chaque hausse de 10 % du nombre de couverts genere 8-9 % de CA supplementaire sans hausse proportionnelle des charges fixes.",
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 sm:p-6 flex gap-4">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
                  {num}
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-emerald-800 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Erreurs courantes ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="9">
            Erreurs courantes a eviter
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les 5 erreurs les plus frequentes que je rencontre chez les restaurateurs
              qui essaient d'appliquer la regle 30/30/30/10 sans la maitriser.
            </p>
          </div>

          <div className="mt-8 grid gap-4">
            {[
              {
                title: "Calculer en TTC au lieu de HT",
                body: "C'est l'erreur n1. La TVA collectee n'est pas a vous, vous la reversez a l'Etat. Calculer le food cost sur un prix TTC donne un ratio artificiellement bas (-10 % d'erreur en restauration sur place). Tous les ratios de la regle s'appliquent au CA HT.",
              },
              {
                title: "Oublier les charges patronales dans la masse salariale",
                body: "Les charges sociales en CCN HCR representent 40-45 % du salaire brut en France. Un cuisinier paye 2 200 EUR brut coute 3 080 EUR a l'entreprise. Si vous ne comptez que le brut, vous sous-estimez votre masse salariale de 25 % et votre marge nette apparente est fausse.",
              },
              {
                title: "Ne pas integrer les amortissements",
                body: "Le materiel cuisine, le mobilier, les travaux d'amenagement sont amortis sur 5 a 10 ans. C'est une charge non-cash mais reelle : sans amortissement, vous ne pouvez pas renouveler votre materiel quand il casse. Comptez 4-6 % du CA en amortissements.",
              },
              {
                title: "Comparer une journee, une semaine ou un mois aux ratios annuels",
                body: "Les ratios 30/30/30/10 sont des cibles annuelles. Sur une semaine creuse de janvier, votre masse salariale peut atteindre 40 % du CA — c'est normal. Calculez toujours sur 12 mois glissants pour lisser la saisonnalite.",
              },
              {
                title: "Ignorer les revenus annexes (terrasse, prive, evenementiel)",
                body: "Un restaurant qui privatise sa salle 30 fois par an genere 30 000 a 60 000 EUR de CA annexe a tres haute marge (food cost contractualise, masse salariale identique a un service normal). Ces revenus boostent la marge nette et doivent etre suivis a part dans votre comptabilite analytique.",
              },
            ].map((err, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-mono-100 mb-1.5">{err.title}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{err.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="14 min" variant="footer" />

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
              Pilotez votre regle 30/30/30/10 en temps reel
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin connecte vos achats, votre caisse et votre paie pour calculer
              automatiquement vos quatre ratios. Vous voyez si vous respectez la regle,
              quels postes derivent et quels leviers activer en priorite.
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
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant 2026</h3>
              <p className="text-xs text-mono-500">Marge brute, marge nette, food cost et coefficient multiplicateur.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le food cost</h3>
              <p className="text-xs text-mono-500">Definition, formule, benchmarks par segment et 10 leviers de reduction.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le cout personnel</h3>
              <p className="text-xs text-mono-500">Planning, turnover, formation : 5 leviers concrets pour -10 a -20 %.</p>
            </Link>
            <Link to="/blog/prime-cost-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Prime cost : l'indicateur n1</h3>
              <p className="text-xs text-mono-500">Food cost + masse salariale : passer de 72 % a 62 % en 3 mois.</p>
            </Link>
            <Link to="/blog/seuil-rentabilite-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Seuil de rentabilite restaurant</h3>
              <p className="text-xs text-mono-500">Calculer le point mort et le nombre de couverts necessaires.</p>
            </Link>
            <Link to="/outils/calculateur-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calculateur food cost gratuit</h3>
              <p className="text-xs text-mono-500">Outil en ligne pour calculer votre marge en 30 secondes.</p>
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

function RatioCard({ icon, percent, title, color, subtitle, items }: {
  icon: React.ReactNode; percent: string; title: string; color: string; subtitle: string; items: string[];
}) {
  const colors: Record<string, { bg: string; border: string; text: string; badge: string; iconBg: string }> = {
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-600 text-white', iconBg: 'bg-amber-100 text-amber-700' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-600 text-white', iconBg: 'bg-blue-100 text-blue-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-600 text-white', iconBg: 'bg-purple-100 text-purple-700' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-600 text-white', iconBg: 'bg-emerald-100 text-emerald-700' },
  };
  const c = colors[color] || colors.amber;

  return (
    <div className={`${c.bg} ${c.border} border rounded-2xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <span className={`${c.badge} px-4 py-1.5 rounded-full font-extrabold text-lg`}>
          {percent}
        </span>
      </div>
      <h3 className={`font-bold ${c.text} text-xl mb-1`}>{title}</h3>
      <p className={`text-sm ${c.text} opacity-80 mb-4`}>{subtitle}</p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className={`text-sm ${c.text} flex items-start gap-2`}>
            <Percent className="w-3.5 h-3.5 mt-0.5 opacity-60 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
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
