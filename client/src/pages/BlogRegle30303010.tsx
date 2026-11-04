import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Users, Zap, ListChecks, Sparkles, ShoppingCart, Building2, PiggyBank } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Regle 30/30/30/10 restaurant — guide complet"
   Mot-cle PAA principal : regle 30 30 30 10 restaurant
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'La règle 30/30/30/10 est-elle adaptée à tous les types de restaurants ?',
    answer: "Non. Cette règle s'applique principalement à la restauration traditionnelle assise avec service à table. Une pizzeria, un fast-food ou un restaurant gastronomique ont des structures de coûts très différentes. La règle 30/30/30/10 est un cadre de référence, pas une obligation. Adaptez les ratios à votre concept (voir tableau benchmarks par segment).",
  },
  {
    question: 'Que comprennent les 30 % de masse salariale exactement ?',
    answer: "Les 30 % de masse salariale englobent le salaire brut + les charges patronales (40-45 % sur le brut en France) + les avantages en nature (repas du personnel valorisés à 4,40 EUR/jour environ) + l'intérim et les extras. C'est le coût complet employeur, pas seulement le salaire net versé.",
  },
  {
    question: 'Pourquoi 10 % de marge nette et pas plus en restauration ?',
    answer: "La restauration est un secteur à forte intensité humaine et capitalistique : 60 % des coûts sont fixes (loyer, personnel, énergie). Une marge nette de 10 % est considérée comme excellente. La moyenne réelle du secteur en France oscille entre 4 et 8 %. Atteindre les 10 % de marge nette demande une gestion rigoureuse et un concept solide.",
  },
  {
    question: 'Comment savoir si mon restaurant respecte la règle 30/30/30/10 ?',
    answer: "Récupérez vos comptes de résultat des 12 derniers mois. Calculez : (achats matières / CA HT) x 100, (masse salariale chargée / CA HT) x 100, (charges fixes hors personnel et matières / CA HT) x 100. La marge nette est ce qui reste. Si un poste dépasse 32-33 %, vous avez un signal d'alerte à creuser.",
  },
  {
    question: 'Que faire si mon food cost dépasse 35 % ?',
    answer: "Plusieurs leviers : auditer vos fiches techniques (grammages réels vs théoriques), peser le gaspillage pendant 2 semaines, négocier 3 devis sur vos 10 plus gros postes d'achat, ajuster les prix de vente des plats à faible marge, retirer les plats non-rentables de la carte (menu engineering Boston Matrix), réduire les portions sur les plats premium discrets.",
  },
  {
    question: 'La règle 30/30/30/10 inclut-elle les boissons ?',
    answer: "Oui, la règle s'applique au CA total HT (cuisine + bar). Mais attention : la marge brute sur les boissons est généralement bien meilleure (food cost 18-22 % sur les vins, 25-30 % sur les alcools forts) que sur les plats. Plus votre ratio boissons/cuisine est élevé, plus vous pouvez vous permettre un food cost cuisine élevé. Le mix moyen visé est 25-30 % de CA sur les boissons.",
  },
  {
    question: "Le loyer doit-il représenter une part précise des 30 % de charges ?",
    answer: "Oui. Le loyer idéal en restauration représente 6 à 10 % du CA HT. Au-delà de 12 %, il devient très difficile de dégager une marge nette correcte. Dans les zones premium parisiennes ou côte d'azur, certains restaurants paient 15-18 % de loyer : ils doivent compenser par un ticket moyen plus élevé ou un volume plus important.",
  },
  {
    question: "La règle 30/30/30/10 est-elle différente pour les chaînes et franchises ?",
    answer: "Oui. Une franchise intègre une redevance (5-8 % du CA) + un fonds marketing (2-3 %) qui s'ajoutent aux charges. Le 30 % d'autres charges peut grimper à 35-40 %. En contrepartie, les achats sont mutualises (food cost réduit à 26-28 %) et la masse salariale optimisée par les process. Le 10 % de marge nette reste un objectif réaliste pour une franchise performante.",
  },
];

export default function BlogRegle30303010() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Règle 30/30/30/10 restaurant : guide complet 2026 (food cost, personnel, charges, marge)"
        description="Comprendre la règle 30/30/30/10 en restauration : 30% food cost + 30% masse salariale + 30% charges + 10% marge nette. Adaptations par segment, calculs, erreurs courantes."
        path="/blog/regle-30-30-30-10-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Règle 30/30/30/10 restaurant', url: 'https://www.restaumargin.fr/blog/regle-30-30-30-10-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment calculer la règle 30/30/30/10 pour votre restaurant',
            description: "Méthode pas-à-pas pour vérifier si votre restaurant respecte la règle 30/30/30/10 à partir de vos comptes de résultat.",
            totalTime: 'PT30M',
            tool: ['Compte de résultat 12 mois', 'Tableur ou logiciel RestauMargin', 'Calculatrice'],
            step: [
              { '@type': 'HowToStep', name: 'Réunir vos comptes de résultat', text: "Récupérez votre compte de résultat des 12 derniers mois (ou 3 à 6 derniers mois si démarrage récent). Identifiez le chiffre d'affaires HT total." },
              { '@type': 'HowToStep', name: 'Calculer le ratio food cost', text: "Additionnez tous les achats matières (denrées alimentaires + boissons). Divisez par le CA HT. Multipliez par 100. Cible : 28-32 %." },
              { '@type': 'HowToStep', name: 'Calculer le ratio masse salariale', text: "Additionnez salaires bruts + charges patronales + intérim + avantages en nature. Divisez par le CA HT. Multipliez par 100. Cible : 28-32 %." },
              { '@type': 'HowToStep', name: 'Calculer les autres charges', text: "Additionnez loyer + énergie + assurances + marketing + comptable + telecoms + entretien + amortissements + frais bancaires + impôts locaux. Divisez par le CA HT. Multipliez par 100. Cible : 28-32 %." },
              { '@type': 'HowToStep', name: 'Vérifier la marge nette', text: "Marge nette = 100 - (food cost + masse salariale + autres charges). Si vous obtenez 10 % ou plus, vous respectez la règle. Sinon, identifiez le poste en dérive." },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Règle 30/30/30/10 restaurant : guide complet 2026',
            description: "Comprendre la règle 30/30/30/10 en restauration : 30% food cost + 30% masse salariale + 30% charges + 10% marge nette. Adaptations par segment, calculs, erreurs courantes.",
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
      <PublicHeader />

      {/* ── Breadcrumbs visibles ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Règle 30/30/30/10 restaurant</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Rentabilité"
        readTime="14 min"
        date="Mai 2026"
        title="Règle 30/30/30/10 restaurant : guide complet 2026"
        accentWord="30/30/30/10"
        subtitle="La règle 30/30/30/10 est le cadre de référence pour mesurer la rentabilité d'un restaurant traditionnel. Découvrez la décomposition des 4 postes, les adaptations par segment et les leviers pour rentrer dans les clous."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="14 min" variant="header" />

        {/* ── Encadre definition rapide (featured snippet target) ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Définition rapide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Qu'est-ce que la règle 30/30/30/10 ?
          </h2>
          <p className="text-teal-50 text-base sm:text-lg leading-relaxed">
            La règle 30/30/30/10 en restauration définit la répartition idéale du chiffre d'affaires :
            <strong className="text-white"> 30 % pour le coût matières (food cost)</strong>,
            <strong className="text-white"> 30 % pour la masse salariale (incluant charges)</strong>,
            <strong className="text-white"> 30 % pour les autres charges fixes</strong> (loyer, énergie, assurances),
            et <strong className="text-white">10 % de marge nette</strong> pour le restaurateur.
            C'est un cadre théorique qui sert de référence pour mesurer la rentabilité d'un restaurant traditionnel.
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
              { href: '#definition', label: "Qu'est-ce que la règle 30/30/30/10 ?" },
              { href: '#origine', label: 'Origine et histoire de la règle' },
              { href: '#decomposition', label: 'Décomposition des 4 postes' },
              { href: '#benchmarks', label: 'Tableau benchmarks par segment' },
              { href: '#exemple', label: 'Exemple chiffré : restaurant 500 k EUR de CA' },
              { href: '#calcul', label: 'Comment calculer la règle pour votre restaurant' },
              { href: '#adaptations', label: 'Adaptations selon votre concept' },
              { href: '#leviers', label: '5 leviers pour respecter la règle' },
              { href: '#erreurs', label: 'Erreurs courantes à éviter' },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Pilotez votre rentabilité avec RestauMargin' },
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
            Qu'est-ce que la règle 30/30/30/10 en restauration ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              La règle 30/30/30/10 est un cadre de gestion utilisé par les restaurateurs pour piloter
              leur rentabilité. Elle décompose chaque euro de chiffre d'affaires HT en quatre postes
              de dépenses ou de profit. Sa simplicité est ce qui en fait sa force : trois nombres à
              mémoriser pour évaluer la santé financière de votre établissement.
            </p>
            <p>
              Concrètement, sur 100 EUR encaissés (hors taxes) dans votre restaurant :
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-3">
              <li><strong>30 EUR</strong> doivent partir en achats de denrées alimentaires et boissons (food cost)</li>
              <li><strong>30 EUR</strong> doivent couvrir le personnel (salaires + charges + extras)</li>
              <li><strong>30 EUR</strong> doivent couvrir tous les autres frais fixes (loyer, énergie, assurances, marketing, comptable, amortissements)</li>
              <li><strong>10 EUR</strong> doivent rester comme marge nette pour le restaurateur</li>
            </ul>
            <p>
              C'est un objectif et non une règle stricte. Très peu de restaurants atteignent
              parfaitement cette répartition. La moyenne nationale en France oscille entre
              4 et 8 % de marge nette, ce qui signifie que beaucoup d'établissements sont en
              dérive sur un ou plusieurs postes. La règle 30/30/30/10 sert donc de boussole :
              elle indique la direction, pas une obligation immédiate.
            </p>

            <Callout type="info">
              <strong>À retenir :</strong> la règle 30/30/30/10 s'applique au CA HT (hors taxes).
              Calculer en TTC fausserait tous les ratios. En France, la TVA en restauration sur
              place est de 10 %, et de 5,5 % pour la vente à emporter.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Origine ═════════════ */}
        <section id="origine" className="mb-16">
          <SectionHeading icon={<BookOpen className="w-6 h-6" />} number="2">
            Origine et histoire de la règle 30/30/30/10
          </SectionHeading>

          <div className="prose-content">
            <p>
              La règle 30/30/30/10 trouve son origine dans la littérature financière
              américaine de la restauration, popularisée dans les années 1980-1990 par
              les cabinets de conseil spécialisés et les écoles hôtelières. Elle est
              une déclinaison simplifiée du concept de <Link to="/blog/prime-cost-restaurant" className="text-teal-700 underline hover:text-teal-800">prime cost</Link>
              {' '}(food cost + masse salariale), considéré comme l'indicateur clé de
              la rentabilité opérationnelle.
            </p>
            <p>
              Aux États-Unis, on parle plutôt de la "rule of thirds" (règle des tiers) :
              un tiers pour la nourriture, un tiers pour le travail, un tiers pour tout
              le reste. Le 10 % de marge nette est une cible européenne, plus réaliste
              dans un contexte fiscal et social plus chargé qu'aux États-Unis.
            </p>
            <p>
              En France, la règle a été largement diffusée par les organisations
              professionnelles (UMIH, GNI) et les centres de formation (CCI, CFA hôteliers).
              Elle reste aujourd'hui le cadre de référence le plus enseigné en gestion
              restaurant, même si les réalités du terrain — inflation matières, hausse
              continue du SMIC, énergie volatile — la rendent de plus en plus difficile
              à atteindre sans pilotage rigoureux.
            </p>

            <Callout type="warning">
              <strong>Limite de la règle :</strong> la règle 30/30/30/10 a été pensée pour
              un restaurant traditionnel avec service à table. Un fast-food, une pizzeria,
              un food truck ou un restaurant gastronomique ont des structures de coûts
              fondamentalement différentes (voir tableau benchmarks plus bas).
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Decomposition ═════════════ */}
        <section id="decomposition" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="3">
            Décomposition des 4 postes de la règle
          </SectionHeading>

          <div className="prose-content">
            <p>
              Comprendre en détail ce que recouvre chacun des quatre 30 % et 10 % est
              essentiel pour bien piloter sa rentabilité. Beaucoup de restaurateurs
              sous-estiment certains postes (charges patronales, énergie, amortissements)
              et surévaluent leur marge réelle.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            <RatioCard
              icon={<ShoppingCart className="w-6 h-6" />}
              percent="30%"
              title="Food cost"
              color="amber"
              subtitle="Coût matières premières"
              items={[
                "Denrées alimentaires (viandes, poissons, fruits, légumes)",
                "Épicerie, condiments, épices, huiles",
                "Boissons (vins, bières, spiritueux, softs)",
                "Pains, viennoiseries, desserts achetés",
                "Emballages à usage unique (vente à emporter)",
                "Pertes et casses inévitables",
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
                "Cotisations retraite, prévoyance, mutuelle",
                "Avantages en nature (repas du personnel 4,40 EUR/jour)",
                "Intérim, extras, contrats saisonniers",
                "Formation continue, médecine du travail",
              ]}
            />
            <RatioCard
              icon={<Building2 className="w-6 h-6" />}
              percent="30%"
              title="Autres charges"
              color="purple"
              subtitle="Tous les frais fixes hors personnel et matières"
              items={[
                "Loyer + charges locatives (6-10 % du CA idéal)",
                "Énergie : électricité, gaz, eau",
                "Assurances RC pro, multirisque, perte d'exploitation",
                "Marketing : réseaux sociaux, plateformes (TheFork, UberEats)",
                "Comptable, juridique, conseil",
                "Amortissements mobilier et matériel cuisine",
                "Telecoms, internet, logiciel de caisse",
                "Entretien, réparations, blanchisserie linge",
              ]}
            />
            <RatioCard
              icon={<PiggyBank className="w-6 h-6" />}
              percent="10%"
              title="Marge nette"
              color="emerald"
              subtitle="Ce qui reste pour le restaurateur"
              items={[
                "Rémunération du dirigeant",
                "Capacité d'autofinancement (renouvellement matériel)",
                "Remboursement emprunts en cours",
                "Réserves pour aléas (panne, baisse activité)",
                "Distribution de dividendes en SARL/SAS",
                "Impôt sur les bénéfices (IS 15-25 %)",
              ]}
            />
          </div>

          <Callout type="info">
            <strong>Point clé :</strong> les 10 % de marge nette sont la marge avant impôt
            sur les sociétés. Après IS (15 % jusqu'à 42 500 EUR de bénéfice, 25 % au-delà
            en 2026), il reste 7,5 à 8,5 % de marge nette après impôt pour le restaurateur.
            C'est ce qui finance la croissance et la rémunération du dirigeant.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Benchmarks par segment ═════════════ */}
        <section id="benchmarks" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="4">
            Tableau benchmarks par segment de restauration
          </SectionHeading>

          <div className="prose-content">
            <p>
              La règle 30/30/30/10 est calibrée pour la restauration traditionnelle assise.
              D'autres segments ont des structures très différentes. Voici les ratios de
              référence observés en France en 2026, issus des études sectorielles (Xerfi,
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
                  <td className="py-3 px-4 font-bold text-emerald-900">Traditionnelle (règle classique)</td>
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
                  <td className="py-3 px-4 font-medium text-mono-100">Gastronomique (étoiles)</td>
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
                  <td className="py-3 px-4 font-medium text-mono-100">Boulangerie / pâtisserie</td>
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
                  <td className="py-3 px-4 font-medium text-mono-100">Bar à vins / à tapas</td>
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
              un food cost plus élevé (produits nobles, fournisseurs locaux d'exception) et
              une masse salariale énorme (brigade de 8-15 personnes). Sa marge nette est
              très faible (2-5 %) mais les chefs étoilés misent sur les revenus annexes
              (cours de cuisine, livres, image, consulting) pour atteindre la rentabilité.
            </p>
            <p>
              À l'opposé, une pizzeria ou un fast-food fait du volume avec peu de personnel
              et des matières optimisées : la marge nette peut atteindre 20 %. C'est pour
              cela que ces concepts sont si attractifs en franchise.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Exemple chiffre ═════════════ */}
        <section id="exemple" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="5">
            Exemple chiffré complet : restaurant 500 k EUR de CA
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons un exemple illustratif : une brasserie de 60 couverts en région, qui réalise
              500 000 EUR de CA HT annuel (soit environ 1 850 EUR de CA par jour, ouvert
              270 jours par an). Voici comment la règle 30/30/30/10 se décline en euros et
              quel est l'enjeu réel sur chaque poste.
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
                <tr className="bg-amber-50"><td className="py-3 px-4 font-medium text-amber-900">- Food cost (matières + boissons)</td><td className="py-3 px-4 text-right text-amber-900">30 %</td><td className="py-3 px-4 text-right text-amber-900">150 000 EUR</td><td className="py-3 px-4 text-right text-amber-900">12 500 EUR</td></tr>
                <tr className="bg-blue-50"><td className="py-3 px-4 font-medium text-blue-900">- Masse salariale chargée</td><td className="py-3 px-4 text-right text-blue-900">30 %</td><td className="py-3 px-4 text-right text-blue-900">150 000 EUR</td><td className="py-3 px-4 text-right text-blue-900">12 500 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-mono-100 pl-8">Loyer + charges locatives</td><td className="py-3 px-4 text-right">8 %</td><td className="py-3 px-4 text-right">40 000 EUR</td><td className="py-3 px-4 text-right">3 333 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-mono-100 pl-8">Énergie (élec + gaz + eau)</td><td className="py-3 px-4 text-right">5 %</td><td className="py-3 px-4 text-right">25 000 EUR</td><td className="py-3 px-4 text-right">2 083 EUR</td></tr>
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
              <strong>Lecture :</strong> avec une règle 30/30/30/10 respectée, la brasserie
              dégage 50 000 EUR de marge nette annuelle, soit environ 4 167 EUR par mois.
              Après impôt sur les sociétés (15 % jusqu'à 42 500 EUR, 25 % au-delà), il reste
              environ 41 500 EUR pour la rémunération du dirigeant et la capacité d'autofinancement.
            </p>
            <p>
              Si la masse salariale dérive de 30 à 35 % (un seul recrutement de plus), la marge
              nette tombe à 5 % : <strong>25 000 EUR/an, soit 2 100 EUR/mois</strong>. Et à 38 %
              de masse salariale, le restaurateur est à l'équilibre... ou en perte. C'est la
              fragilité du modèle restauration : chaque point de dérive coûte très cher.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Comment calculer ═════════════ */}
        <section id="calcul" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="6">
            Comment calculer la règle pour votre restaurant ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la méthode pas-à-pas pour vérifier si votre restaurant respecte la règle
              30/30/30/10. Comptez 30 minutes la première fois si vos comptes sont à jour,
              plus si vous devez retraiter des données.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Réunir vos comptes de résultat des 12 derniers mois',
                body: "Récupérez votre dernier bilan ou un export comptable sur 12 mois glissants. Si vous démarrez, prenez les 3 ou 6 derniers mois. Identifiez la ligne chiffre d'affaires HT total (sans TVA). C'est votre base 100.",
              },
              {
                title: 'Calculer le ratio food cost',
                body: "Additionnez tous les achats matières : compte 601 (denrées alimentaires) + 602 (boissons) + 6064 (fournitures non stockables) si vous intégrez les emballages. Divisez par le CA HT. Multipliez par 100. Cible : 28-32 % en traditionnel, 25 % en pizzeria, 35 % en gastronomique.",
              },
              {
                title: 'Calculer le ratio masse salariale',
                body: "Additionnez les comptes 641 (rémunérations brutes) + 645 (charges sociales) + 6411 (intérim) + 648 (avantages en nature). Divisez par le CA HT. Multipliez par 100. Cible : 28-32 % en traditionnel.",
              },
              {
                title: 'Calculer le total autres charges',
                body: "Additionnez tout le reste : 612 (loyer), 606 (énergie), 616 (assurances), 622 (honoraires comptable), 623 (publicité), 6256 (telecoms), 615 (entretien), 681 (amortissements), 661 (frais financiers), 635 (impôts locaux). Divisez par CA HT, multipliez par 100. Cible : 28-32 %.",
              },
              {
                title: "Vérifier la marge nette et identifier les dérives",
                body: "Marge nette = 100 - (food cost + masse salariale + autres charges). Si vous obtenez 10 % ou plus, vous respectez la règle. Si vous êtes à 5 %, identifiez le poste en dérive et appliquez les leviers correspondants (voir section 8). Si vous êtes à 0 % ou négatif, urgence : auditez complet en moins de 30 jours.",
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
            automatiquement à partir de vos achats et de votre caisse, sans Excel.
            Vous voyez en temps réel si vous respectez la règle 30/30/30/10 et quels
            postes dérivent.{' '}
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
              La règle 30/30/30/10 est un cadre de référence, pas un dogme. Voici comment
              l'ajuster en fonction de votre concept et de vos contraintes spécifiques.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Restaurant à forte intensité vins</h3>
            <p>
              Si les boissons (vins surtout) représentent 35 à 45 % de votre CA, vous pouvez
              accepter un food cost cuisine plus élevé (32-34 %) car la marge brute boissons
              compense largement. Cible food cost global : 28 %, masse salariale 30 %, autres
              30 %, marge 12 %.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Restaurant à forte composante à emporter</h3>
            <p>
              La TVA à 5,5 % (au lieu de 10 %) augmente mécaniquement votre marge brute si
              vous gardez le même prix TTC. Mais les coûts d'emballages (boîtes, sacs, couverts
              jetables, sacs de transport) ajoutent 2 à 4 % au food cost. Cible : food cost
              32 %, masse salariale 26 % (moins de service), autres 30 %, marge 12 %.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Restaurant en franchise</h3>
            <p>
              La redevance franchiseur (5-8 % du CA) et le fonds publicitaire (2-3 %)
              s'ajoutent aux autres charges. Le 30 % grimpe à 35-40 %. En contrepartie, les
              achats centralisés baissent le food cost à 26-28 %. Cible franchise mature :
              food cost 27 %, masse salariale 28 %, autres 35 %, marge 10 %.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Restaurant en démarrage (moins de 18 mois)</h3>
            <p>
              Les 18 premiers mois supportent des coûts d'investissement initiaux non amortis :
              communication de lancement, formation du personnel, ajustements de la carte,
              gaspillage en hausse. Acceptez une marge nette négative ou faible (0-3 %) pendant
              cette phase, en visant la règle complète à partir du mois 18-24.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : 5 leviers ═════════════ */}
        <section id="leviers" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="8">
            5 leviers pour respecter la règle si vous dérivez
          </SectionHeading>

          <div className="prose-content">
            <p>
              Si votre marge nette est inférieure à 5 %, voici les 5 leviers prioritaires
              pour rentrer dans la règle 30/30/30/10. Commencez par celui qui correspond
              au poste le plus en dérive identifié dans le diagnostic.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            {[
              {
                num: 1,
                title: "Réduire le food cost (objectif : -2 à -4 points)",
                body: "Auditer les fiches techniques (grammages réels vs théoriques), peser le gaspillage pendant 2 semaines pour identifier les gisements, renégocier 3 devis sur vos 10 plus gros postes d'achat (effet immédiat de 3-5 % sur les produits concernés), retirer 2-3 plats non-rentables de la carte. Lien : guide complet sur le food cost dans la section ressources.",
              },
              {
                num: 2,
                title: "Optimiser la masse salariale (objectif : -2 à -3 points)",
                body: "Refaire le planning au quart d'heure près en fonction de la fréquentation réelle (souvent 10-15 % de surstaffing en heures creuses), réduire le turnover (un recrutement coûte 3 à 6 mois de salaire en formation et perte de productivité), former la polyvalence cuisine/salle pour réduire les effectifs creux.",
              },
              {
                num: 3,
                title: "Renégocier le loyer ou déménager",
                body: "Si votre loyer dépasse 12 % du CA, c'est un blocage structurel. Négociez une baisse en présentant votre compte de résultat (les bailleurs préfèrent un locataire viable à un local vide). Sinon, planifiez un déménagement vers un local à 8-10 % du CA dans un rayon de 1-2 km pour conserver la clientèle.",
              },
              {
                num: 4,
                title: "Augmenter le ticket moyen (objectif : +5 à +10 %)",
                body: "Upselling boissons (verre de vin, eau gazeuse, café gourmand), suggestion desserts systématique, ajout d'une formule premium à +30 % du prix moyen, mise en avant des plats à forte marge (menu engineering Boston Matrix). Une hausse de 8 % du ticket moyen ajoute directement 6-7 % de marge nette.",
              },
              {
                num: 5,
                title: "Augmenter la fréquence et la rotation des tables",
                body: "Réduire le temps de service en optimisant les process cuisine (mise en place plus rigoureuse, batch cooking), passer de 1 à 1,3 services le midi en pic, ouvrir un 7e jour ou un service supplémentaire le soir. Chaque hausse de 10 % du nombre de couverts génère 8-9 % de CA supplémentaire sans hausse proportionnelle des charges fixes.",
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
            Erreurs courantes à éviter
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les 5 erreurs les plus fréquentes chez les restaurateurs
              qui essaient d'appliquer la règle 30/30/30/10 sans la maîtriser.
            </p>
          </div>

          <div className="mt-8 grid gap-4">
            {[
              {
                title: "Calculer en TTC au lieu de HT",
                body: "C'est l'erreur n1. La TVA collectée n'est pas à vous, vous la reversez à l'État. Calculer le food cost sur un prix TTC donne un ratio artificiellement bas (-10 % d'erreur en restauration sur place). Tous les ratios de la règle s'appliquent au CA HT.",
              },
              {
                title: "Oublier les charges patronales dans la masse salariale",
                body: "Les charges sociales en CCN HCR représentent 40-45 % du salaire brut en France. Un cuisinier payé 2 200 EUR brut coûte 3 080 EUR à l'entreprise. Si vous ne comptez que le brut, vous sous-estimez votre masse salariale de 25 % et votre marge nette apparente est fausse.",
              },
              {
                title: "Ne pas intégrer les amortissements",
                body: "Le matériel cuisine, le mobilier, les travaux d'aménagement sont amortis sur 5 à 10 ans. C'est une charge non-cash mais réelle : sans amortissement, vous ne pouvez pas renouveler votre matériel quand il casse. Comptez 4-6 % du CA en amortissements.",
              },
              {
                title: "Comparer une journée, une semaine ou un mois aux ratios annuels",
                body: "Les ratios 30/30/30/10 sont des cibles annuelles. Sur une semaine creuse de janvier, votre masse salariale peut atteindre 40 % du CA — c'est normal. Calculez toujours sur 12 mois glissants pour lisser la saisonnalité.",
              },
              {
                title: "Ignorer les revenus annexes (terrasse, privé, événementiel)",
                body: "Un restaurant qui privatise sa salle 30 fois par an génère 30 000 à 60 000 EUR de CA annexe à très haute marge (food cost contractualisé, masse salariale identique à un service normal). Ces revenus boostent la marge nette et doivent être suivis à part dans votre comptabilité analytique.",
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
              Pilotez votre règle 30/30/30/10 en temps réel
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin connecte vos achats, votre caisse et votre paie pour calculer
              automatiquement vos quatre ratios. Vous voyez si vous respectez la règle,
              quels postes dérivent et quels leviers activer en priorité.
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
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire le food cost</h3>
              <p className="text-xs text-mono-500">Définition, formule, benchmarks par segment et 10 leviers de réduction.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire le coût personnel</h3>
              <p className="text-xs text-mono-500">Planning, turnover, formation : 5 leviers concrets pour -10 à -20 %.</p>
            </Link>
            <Link to="/blog/prime-cost-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Prime cost : l'indicateur n1</h3>
              <p className="text-xs text-mono-500">Food cost + masse salariale : passer de 72 % à 62 % en 3 mois.</p>
            </Link>
            <Link to="/blog/seuil-rentabilite-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Seuil de rentabilité restaurant</h3>
              <p className="text-xs text-mono-500">Calculer le point mort et le nombre de couverts nécessaires.</p>
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
