import { Link } from 'react-router-dom';
import { ChefHat, ArrowRight, Truck, Wallet, FileText, Shield, MapPin, Utensils, TrendingUp, BookOpen, Lightbulb, AlertTriangle, BarChart3, Calculator, Sparkles, CheckCircle, Zap, Target, Pizza, Leaf, Snowflake, Sun, Users, ListChecks } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Ouvrir un food truck en France : guide complet 2026"
   Mots-cles principaux : ouvrir food truck France + rentabilite food truck
   ~3 200 mots — theme W&B teal-600
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quel budget faut-il pour ouvrir un food truck en France en 2026 ?",
    answer: "Comptez entre 30 000 EUR (occasion + amenagement minimaliste) et 80 000 EUR (vehicule neuf cle en main) pour demarrer. Le budget median realiste se situe autour de 50 000-70 000 EUR pour un food truck professionnel avec equipement adapte, tresorerie de demarrage et frais administratifs inclus."
  },
  {
    question: "Quel est le chiffre d'affaires moyen d'un food truck en France ?",
    answer: "Un food truck implante en zone de bureaux genere en moyenne 10 000 a 40 000 EUR de CA mensuel selon l'emplacement, la saison et le concept. Les meilleurs spots parisiens atteignent 50 000 EUR/mois. Comptez 220 a 250 jours d'exploitation effective par an apres deduction des conges et intemperies."
  },
  {
    question: "Quelle est la rentabilite reelle d'un food truck ?",
    answer: "La marge brute se situe entre 65 % et 75 %, similaire a un restaurant traditionnel. La marge nette varie de 15 % a 25 %, generalement superieure a un restaurant fixe grace aux charges fixes reduites (pas de loyer, pas de service en salle). Sur un CA annuel de 200 000 EUR, vous pouvez esperer 30 000 a 50 000 EUR net."
  },
  {
    question: "Faut-il un permis special pour conduire un food truck ?",
    answer: "Le permis B suffit pour tout vehicule de moins de 3,5 tonnes. La majorite des food trucks modernes (Boxer, Sprinter, Jumper amenages) restent sous cette limite. Au-dela, le permis C est obligatoire. La formation HACCP de 14 heures est en revanche obligatoire pour toute manipulation alimentaire."
  },
  {
    question: "Vaut-il mieux acheter un food truck neuf ou d'occasion ?",
    answer: "Le neuf (50 000 a 80 000 EUR) garantit conformite ZFE, fiabilite mecanique et amenagement sur mesure. L'occasion (20 000 a 40 000 EUR) reduit l'investissement initial mais expose a des risques (vehicule hors normes Crit'Air, equipement vieillissant). Pour debuter, l'occasion bien selectionnee est souvent le meilleur compromis."
  },
  {
    question: "Quelles sont les meilleures villes pour lancer un food truck ?",
    answer: "Paris, Lyon, Bordeaux, Lille et Marseille concentrent la plus forte demande. Zones tertiaires (La Defense, Part-Dieu, Euralille), campus universitaires, parcs d'activites et marches alimentaires sont les emplacements les plus rentables. Les villes moyennes (50 000 a 150 000 habitants) offrent moins de concurrence mais des volumes plus faibles."
  },
  {
    question: "Combien gagne reellement un food truckeur ?",
    answer: "Un food truckeur bien implante en zone de bureaux degage 30 000 a 50 000 EUR de remuneration nette annuelle. En activite saisonniere (festivals, marches estivaux), comptez 15 000 a 25 000 EUR. Les marques connues qui exploitent plusieurs trucks atteignent 70 000 EUR+. Le revenu reste tres dependant de l'emplacement et de la saison."
  },
  {
    question: "Quels sont les concepts food truck les plus rentables en 2026 ?",
    answer: "Le burger gourmet reste le plus rentable (marge brute 72-78 %), suivi des bowls healthy (poke, buddha bowl, salades), de la street food asiatique (bao, banh mi) et de la pizza au four a bois mobile. Les concepts vegetariens et locaux gagnent du terrain. Evitez les concepts trop niches en zone non urbaine."
  },
  {
    question: "Comment trouver des emplacements pour son food truck ?",
    answer: "Trois canaux principaux : (1) AOT mairie pour la voie publique (50 a 300 EUR/mois selon la commune), (2) abonnements marches alimentaires (15 a 50 EUR/jour), (3) stationnement prive en parking d'entreprise ou zone d'activite (800 a 3 000 EUR/mois). Les festivals et evenements ponctuels rapportent 200 a 800 EUR/jour avec un volume eleve."
  },
  {
    question: "Le food truck est-il rentable toute l'annee ?",
    answer: "Non. La saisonnalite est forte : pic d'activite entre avril et septembre (+30 a 50 % de CA), ralentissement marque entre novembre et fevrier (-20 a 40 %). Pour lisser, beaucoup de food truckeurs combinent emplacements bureaux toute l'annee + festivals l'ete + evenements prives (mariages, seminaires) l'hiver."
  }
];

export default function BlogFoodTruck() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Ouvrir un food truck en France : guide complet 2026 + rentabilite"
        description="Guide complet pour ouvrir et rentabiliser un food truck en France en 2026 : investissement 30-80k EUR, CA mensuel 10-40k, marge nette 15-25 %, statuts, emplacements, concepts gagnants."
        path="/blog/ouvrir-food-truck-france-guide"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Ouvrir un food truck France 2026', url: 'https://www.restaumargin.fr/blog/ouvrir-food-truck-france-guide' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment ouvrir un food truck en France en 7 etapes',
            description: 'Methode pas-a-pas pour lancer un food truck rentable en France : du concept au demarrage operationnel.',
            totalTime: 'P90D',
            estimatedCost: { '@type': 'MonetaryAmount', currency: 'EUR', value: '50000' },
            tool: ['Business plan', 'Vehicule amenage', 'Formation HACCP', 'Carte commercant ambulant'],
            step: [
              { '@type': 'HowToStep', name: 'Definir le concept et l\'offre', text: 'Choisir une cuisine differenciante (burger, healthy bowl, street food asiatique, pizza), tester les recettes, fixer le ticket moyen cible (10-18 EUR).' },
              { '@type': 'HowToStep', name: 'Construire le business plan', text: 'Calculer investissement, CA previsionnel, marge brute (65-75 %), seuil de rentabilite. Compter 50-70 k EUR de demarrage realiste.' },
              { '@type': 'HowToStep', name: 'Choisir le statut juridique', text: 'Micro-entreprise pour tester (plafond 188 700 EUR HT), EURL/SASU des que l\'investissement depasse 60 000 EUR pour la TVA recuperable.' },
              { '@type': 'HowToStep', name: 'Acheter ou louer le vehicule', text: 'Vehicule neuf cle en main (50-80 k EUR) ou occasion amenagee (20-40 k EUR). Verifier conformite Crit\'Air pour les ZFE.' },
              { '@type': 'HowToStep', name: 'Realiser les formations et demarches', text: 'Formation HACCP 14h obligatoire, carte commercant ambulant (CCI), immatriculation RCS, assurance RC pro, declaration DDPP.' },
              { '@type': 'HowToStep', name: 'Trouver les emplacements', text: 'Demander AOT mairie pour voie publique, contracter abonnements marches, contacter entreprises pour parkings prives.' },
              { '@type': 'HowToStep', name: 'Lancer et industrialiser', text: 'Demarrer en mode test, ajuster carte et portions, construire une communaute Instagram, generaliser sur 220-250 jours/an.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Ouvrir un food truck en France : guide complet 2026',
            description: 'Guide complet pour ouvrir et rentabiliser un food truck en France en 2026 : investissement, CA, marge, statuts, emplacements et concepts.',
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/ouvrir-food-truck-france-guide' },
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
              to="/outils/calculateur-food-cost"
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
          <span className="text-mono-100 font-medium">Ouvrir un food truck France 2026</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Creation"
        readTime="16 min"
        date="Mai 2026"
        title="Ouvrir un food truck en France : guide complet 2026"
        accentWord="food truck"
        subtitle="Marche de 700 M EUR en France, +8 % par an, marge nette 15-25 %. Le food truck rentable n'est pas un camion en mouvement — c'est un mini-restaurant industriel avec un business model precis. Voici le mode d'emploi 2026."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="16 min" variant="header" />

        {/* ── Encadre snippet rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Chiffres cles food truck France 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Ouvrir un food truck en 4 chiffres
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-xs text-teal-100 mb-1">Investissement initial</div>
              <div className="text-2xl font-extrabold text-white">30 000 - 80 000 EUR</div>
              <div className="text-xs text-teal-100 mt-1">Median realiste : 50-70 k EUR</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-xs text-teal-100 mb-1">CA mensuel</div>
              <div className="text-2xl font-extrabold text-white">10 000 - 40 000 EUR</div>
              <div className="text-xs text-teal-100 mt-1">Selon emplacement et saison</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-xs text-teal-100 mb-1">Marge brute</div>
              <div className="text-2xl font-extrabold text-white">65 - 75 %</div>
              <div className="text-xs text-teal-100 mt-1">Similaire restaurant fixe</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-xs text-teal-100 mb-1">Marge nette</div>
              <div className="text-2xl font-extrabold text-white">15 - 25 %</div>
              <div className="text-xs text-teal-100 mt-1">Superieure aux restaurants fixes</div>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Rentabilisation moyenne entre 12 et 24 mois selon la qualite de l'emplacement et la regularite de l'exploitation.
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
              { href: '#marche', label: 'Le marche du food truck en France en 2026' },
              { href: '#modele', label: 'Modele economique : invest, CA, marges' },
              { href: '#etapes', label: 'Les 7 etapes pour ouvrir un food truck' },
              { href: '#vehicule', label: 'Choisir le vehicule : neuf vs occasion' },
              { href: '#statut', label: 'Statut juridique et reglementation' },
              { href: '#emplacements', label: 'Trouver les meilleurs emplacements' },
              { href: '#charges', label: 'Les charges specifiques au food truck' },
              { href: '#saisonnalite', label: 'Saisonnalite : peak ete vs slow hiver' },
              { href: '#concepts', label: 'Concepts qui marchent en 2026' },
              { href: '#roi', label: 'Tableaux d\'investissement et scenarios ROI' },
              { href: '#erreurs', label: 'Les 7 erreurs courantes a eviter' },
              { href: '#faq', label: 'Questions frequentes' },
              { href: '#cta', label: 'Pilotez votre food truck avec RestauMargin' },
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

        {/* ═════════════ SECTION 1 : Marche food truck 2026 ═════════════ */}
        <section id="marche" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Le marche du food truck en France en 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le marche francais du food truck pese desormais pres de 700 millions d'euros en 2026,
              avec une croissance soutenue de +8 % par an. Loin de l'effet de mode des annees 2010,
              le food truck est devenu une categorie a part entiere de la restauration commerciale.
              Selon les estimations de Food Truck France et de Gira Conseil, environ 3 200 camions
              professionnels sont en activite reguliere sur le territoire, contre 1 800 en 2018.
            </p>
            <p>
              Cette croissance s'explique par plusieurs facteurs structurels : montee en gamme de
              la street food, demande croissante pour la restauration nomade en zones tertiaires,
              recherche d'authenticite par les consommateurs, et surtout couts fixes nettement
              inferieurs a ceux d'un restaurant traditionnel. Ouvrir un food truck en France en 2026
              reste l'un des projets les plus accessibles dans la restauration, avec un ticket
              d'entree quatre a cinq fois plus faible qu'un restaurant fixe equivalent.
            </p>
            <p>
              La pression reglementaire s'est neanmoins durcie depuis 2023 : zones a faibles emissions
              (ZFE) dans 11 metropoles, normes HACCP renforcees, controles DDPP plus frequents.
              Cela favorise la professionnalisation du secteur et evince les amateurs.
              C'est paradoxalement une bonne nouvelle pour ceux qui demarrent serieusement.
            </p>

            <Callout type="info">
              <strong>Tendance 2026 :</strong> les food trucks &quot;mono-produit&quot; (un seul concept signature
              decline en variations) surperforment les concepts &quot;catalogue&quot;. Ticket moyen plus eleve,
              productivite superieure, image de marque plus forte.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Modele economique ═════════════ */}
        <section id="modele" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="2">
            Modele economique : investissement, CA, marges
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant de se lancer, il faut comprendre les ordres de grandeur. Voici le modele
              economique type d'un food truck en France en 2026, base sur les donnees agregees
              de 500+ exploitants suivis par RestauMargin et publiees par le SNRC.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            <ModeleCard
              icon={<Wallet className="w-6 h-6" />}
              title="Investissement"
              value="30 - 80 k EUR"
              color="amber"
              desc="Vehicule, amenagement, equipement, stock, tresorerie 3 mois. Median realiste : 50-70 k EUR."
            />
            <ModeleCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="CA mensuel"
              value="10 - 40 k EUR"
              color="emerald"
              desc="Zone bureaux Paris bien implante : 25-35 k EUR. Marches alimentaires : 8-15 k EUR. Festivals : variable."
            />
            <ModeleCard
              icon={<Target className="w-6 h-6" />}
              title="Marge nette"
              value="15 - 25 %"
              color="blue"
              desc="Superieure aux restaurants fixes grace aux charges reduites. Pas de loyer commercial, pas de service en salle."
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Repartition typique des charges</h3>
            <p>
              Pour un food truck qui realise 240 000 EUR de CA HT annuel (typique zone bureaux),
              voici la repartition des charges qui menent a la marge nette.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste de charges</th>
                  <th className="text-right py-3 px-4 font-semibold">Montant annuel</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">% du CA HT</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Chiffre d&apos;affaires HT</td><td className="py-3 px-4 text-right font-semibold">240 000 EUR</td><td className="py-3 px-4 text-right">100 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Matieres premieres (food cost)</td><td className="py-3 px-4 text-right text-red-700">-67 200 EUR</td><td className="py-3 px-4 text-right text-red-700">-28 %</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">= Marge brute</td><td className="py-3 px-4 text-right font-bold text-emerald-900">172 800 EUR</td><td className="py-3 px-4 text-right font-bold text-emerald-900">72 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Personnel (1-2 salaries + charges)</td><td className="py-3 px-4 text-right text-red-700">-60 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-25 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Emplacements (AOT + abonnements)</td><td className="py-3 px-4 text-right text-red-700">-12 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-5 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Carburant + gaz</td><td className="py-3 px-4 text-right text-red-700">-7 200 EUR</td><td className="py-3 px-4 text-right text-red-700">-3 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Assurances + entretien vehicule</td><td className="py-3 px-4 text-right text-red-700">-7 200 EUR</td><td className="py-3 px-4 text-right text-red-700">-3 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Emballages + consommables</td><td className="py-3 px-4 text-right text-red-700">-9 600 EUR</td><td className="py-3 px-4 text-right text-red-700">-4 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">- Amortissement vehicule</td><td className="py-3 px-4 text-right text-red-700">-12 000 EUR</td><td className="py-3 px-4 text-right text-red-700">-5 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 text-red-700">- Marketing + admin + divers</td><td className="py-3 px-4 text-right text-red-700">-9 600 EUR</td><td className="py-3 px-4 text-right text-red-700">-4 %</td></tr>
                <tr className="bg-blue-50"><td className="py-3 px-4 font-bold text-blue-900">= Marge nette avant impot</td><td className="py-3 px-4 text-right font-bold text-blue-900">55 200 EUR</td><td className="py-3 px-4 text-right font-bold text-blue-900">23 %</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Une marge nette de 23 % avant impot represente environ 55 200 EUR pour le gerant.
              C&apos;est significativement plus eleve que la moyenne des restaurants traditionnels
              (5 a 10 % de marge nette). C&apos;est le principal avantage economique du food truck :
              moins de charges fixes, donc plus de cash flow disponible. Pour aller plus loin sur
              le calcul des marges, consultez notre <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800">guide complet du calcul de marge en restauration</Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : 7 etapes pour ouvrir ═════════════ */}
        <section id="etapes" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="3">
            Les 7 etapes pour ouvrir un food truck
          </SectionHeading>

          <div className="prose-content">
            <p>
              Ouvrir un food truck en France suit un parcours assez balise. Comptez 3 a 6 mois
              entre le moment ou vous validez votre concept et le premier service. Voici la
              checklist exhaustive des 7 etapes a respecter dans l&apos;ordre.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Definir le concept et tester les recettes',
                body: "Cuisine differenciante, ticket moyen vise (10-18 EUR), 6 a 10 plats maximum, un plat signature unique. Testez vos recettes en conditions reelles (volume, conservation, rapidite). Le concept doit etre racontable en une phrase : ce qui sort de votre truck doit etre identifiable a 10 metres."
              },
              {
                title: 'Construire le business plan chiffre',
                body: "Investissement (30-80 k EUR), CA previsionnel mensuel et annuel, charges detaillees, seuil de rentabilite, scenarios bas/median/haut, plan de financement (apport, pret, leasing). Comptez 50-70 k EUR de demarrage realiste pour un projet professionnel. Lisez notre guide du budget previsionnel restaurant pour la methode."
              },
              {
                title: 'Choisir le statut juridique',
                body: "Micro-entreprise (plafond 188 700 EUR HT) pour tester sans risque, EURL ou SASU des que l'investissement depasse 60 000 EUR (TVA recuperable, responsabilite limitee). SAS/SARL pour les projets a plusieurs associes. Le choix impacte directement votre fiscalite et vos charges sociales."
              },
              {
                title: 'Acheter ou louer le vehicule amenage',
                body: "Vehicule neuf cle en main (50-80 k EUR, conformite ZFE garantie) ou occasion amenagee (20-40 k EUR, risques a verifier). La location longue duree (1 200-2 500 EUR/mois) permet de demarrer sans gros apport. Verifiez systematiquement la classe Crit'Air avant achat : les vehicules diesel pre-2011 sont exclus de la plupart des ZFE."
              },
              {
                title: 'Realiser les formations et demarches obligatoires',
                body: "Formation HACCP de 14 heures obligatoire (300-500 EUR), permis exploitation alcool si vente de boissons alcoolisees (220 EUR, 20h), carte de commercant ambulant a la CCI (15 EUR), immatriculation RCS, assurance responsabilite civile professionnelle, declaration prealable DDPP."
              },
              {
                title: 'Securiser les premiers emplacements',
                body: "Trois canaux : (1) demande AOT a la mairie pour la voie publique, (2) abonnement aux marches alimentaires via le placier, (3) accords avec entreprises pour parkings prives. Securisez au moins 4 jours/semaine d'emplacements fixes avant le demarrage. Sans emplacement, pas de CA."
              },
              {
                title: 'Lancer en mode test puis industrialiser',
                body: "Demarrez par un mois de tests : ajustez portions, recettes, prix, organisation. Construisez votre communaute Instagram (>1 000 abonnes en 6 mois est un bon objectif). Generalisez ensuite sur 220-250 jours d'exploitation annuelle. Mesurez chaque indicateur (CA jour, marge brute, food cost) des le premier service."
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
            <strong>Conseil de timing :</strong> idealement, lancez votre food truck entre avril et juin
            pour beneficier du pic estival et amortir votre investissement avant le ralentissement
            hivernal. Demarrer en novembre est le pire timing possible.
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : Choisir le vehicule ═════════════ */}
        <section id="vehicule" className="mb-16">
          <SectionHeading icon={<Truck className="w-6 h-6" />} number="4">
            Choisir le vehicule : neuf vs occasion
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le vehicule represente entre 50 % et 70 % de l&apos;investissement initial. C&apos;est
              le poste critique. Trois grandes options coexistent en 2026.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Vehicule neuf cle en main</h3>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed mb-3">
                <strong>Budget :</strong> 50 000 a 80 000 EUR
              </p>
              <p className="text-sm text-emerald-800 leading-relaxed mb-3">
                <strong>Avantages :</strong> conformite ZFE garantie (Crit&apos;Air 1 ou Electrique),
                garantie constructeur, amenagement sur mesure, fiabilite mecanique.
              </p>
              <p className="text-sm text-emerald-800 leading-relaxed">
                <strong>Pour qui :</strong> projets long terme, financement par leasing ou pret bancaire,
                exigences sanitaires elevees.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Vehicule d&apos;occasion amenage</h3>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed mb-3">
                <strong>Budget :</strong> 20 000 a 40 000 EUR
              </p>
              <p className="text-sm text-amber-800 leading-relaxed mb-3">
                <strong>Avantages :</strong> investissement reduit, decote moindre, possibilite de
                tester le projet avant de monter en gamme.
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>Risques :</strong> conformite ZFE a verifier, equipement vieillissant,
                etat sanitaire variable. Faire expertiser obligatoirement.
              </p>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Les 3 types de vehicules dominants en 2026</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li>
                <strong>Citroen Jumper / Peugeot Boxer / Fiat Ducato amenages</strong> : compromis
                ideal 2026. Crit&apos;Air 1 ou 2 selon motorisation. Disponibles en versions amenagees
                de 35 000 a 65 000 EUR. Volume utile 12-15 m3.
              </li>
              <li>
                <strong>Mercedes Sprinter amenage</strong> : haut de gamme, fiabilite reconnue,
                garantie longue. Compter 55 000 a 80 000 EUR. Excellent pour les concepts premium
                ou multi-trucks.
              </li>
              <li>
                <strong>Remorque tractable</strong> : economique (15 000 a 35 000 EUR), pas de
                contraintes ZFE car non motorisee, mobilite limitee par le vehicule tracteur.
                Adaptee aux marches et festivals fixes.
              </li>
            </ul>
            <p>
              Le mythique Citroen Type H et le Renault Estafette restent prises pour leur charme
              vintage, mais leur conformite ZFE est quasi impossible a obtenir. Reservez-les aux
              evenements ponctuels hors zones urbaines reglementees.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Statut juridique ═════════════ */}
        <section id="statut" className="mb-16">
          <SectionHeading icon={<FileText className="w-6 h-6" />} number="5">
            Statut juridique et reglementation
          </SectionHeading>

          <div className="prose-content">
            <p>
              La reglementation pour ouvrir un food truck en France est devenue tres precise depuis
              2023. Aucune zone grise : tout est encadre. Voici les obligations incontournables.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Choix du statut juridique</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li>
                <strong>Micro-entreprise</strong> : charges allegees (22 % en BIC vente), plafond
                188 700 EUR HT, pas de TVA recuperable. Parfait pour tester un concept avec un budget
                limite, mais bloquant si vous investissez lourdement.
              </li>
              <li>
                <strong>EURL ou SASU</strong> : forme la plus adaptee au food truck professionnel.
                TVA recuperable sur l&apos;investissement (-20 % sur le vehicule), responsabilite
                limitee au capital. Comptable obligatoire (1 200-2 000 EUR/an).
              </li>
              <li>
                <strong>SAS ou SARL</strong> : pour les projets a plusieurs associes ou les
                exploitants multi-trucks. Charges sociales plus lourdes mais image professionnelle
                renforcee.
              </li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-6">Demarches obligatoires</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li><strong>Carte de commercant ambulant</strong> : delivree par la CCI, 15 EUR, valide 4 ans, indispensable.</li>
              <li><strong>Formation HACCP 14 heures</strong> : obligatoire pour tout manipulateur alimentaire, 300-500 EUR.</li>
              <li><strong>Permis exploitation alcool</strong> : obligatoire si vente de boissons alcoolisees, 220 EUR, formation 20h.</li>
              <li><strong>Immatriculation RCS</strong> : si EURL/SASU/SAS, en moyenne 200-400 EUR.</li>
              <li><strong>Assurance RC professionnelle</strong> : couverture intoxication, brulures, casse vehicule. 600-1 500 EUR/an.</li>
              <li><strong>Declaration prealable DDPP</strong> : declaration sanitaire obligatoire avant ouverture.</li>
              <li><strong>Autorisation occupation temporaire (AOT)</strong> : pour la voie publique, delivree par la mairie.</li>
            </ul>
          </div>

          <Callout type="warning">
            <strong>Attention reglementation HACCP :</strong> les controles DDPP se sont intensifies en 2024-2025.
            Memes obligations qu&apos;un restaurant fixe : Plan de Maitrise Sanitaire (PMS) a jour, releves
            temperatures quotidiens, lave-mains eau chaude (≥ 35 degC), cuves eau propre + eau usee
            separees, conservation des releves 6 mois minimum. Une amende DDPP coute en moyenne
            1 500 a 7 500 EUR.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : Emplacements ═════════════ */}
        <section id="emplacements" className="mb-16">
          <SectionHeading icon={<MapPin className="w-6 h-6" />} number="6">
            Trouver les meilleurs emplacements
          </SectionHeading>

          <div className="prose-content">
            <p>
              L&apos;emplacement represente 70 % du succes d&apos;un food truck. Un excellent concept
              sur un mauvais emplacement echoue. Un concept moyen sur un excellent emplacement
              reussit. Voici les cinq typologies d&apos;emplacements rentables en France.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            {[
              { type: 'Marches alimentaires', cost: '15-50 EUR/jour', desc: 'Abonnement mairie via le placier. Public stable, fidelite forte, ticket moyen 8-12 EUR. Volume eleve les samedis matin.' },
              { type: 'Zones de bureaux', cost: '0-300 EUR/mois', desc: 'La Defense, Part-Dieu, Euralille. Volume tres haut sur 2 heures (12h-14h). Ticket moyen 9-13 EUR. Fidelisation client critique.' },
              { type: 'Festivals et evenements', cost: '200-800 EUR/jour', desc: 'Volume tres haut (500-1 500 commandes), CA exceptionnel mais saisonnier. Logistique complexe, intermittence forte.' },
              { type: 'Stationnement permanent prive', cost: '800-3 000 EUR/mois', desc: 'Accord avec entreprise, centre commercial, parking ou zone d\'activite. Flux quotidien garanti, visibilite maximale.' },
              { type: 'Tournee digitale Instagram', cost: 'Variable', desc: 'Annonce des emplacements 24h a l\'avance via Instagram. Necessite >2 000 abonnes engages pour fonctionner. Modele growth-hacking.' },
              { type: 'Evenements prives B2B', cost: 'Forfait jour', desc: 'Mariages, seminaires, lancements produit. Tarif forfaitaire 800-3 000 EUR/jour. Lisse la saisonnalite hivernale.' },
            ].map((b, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-mono-100">{b.type}</h3>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{b.cost}</span>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              La regle d&apos;or : combinez 3 a 5 emplacements differents pour repartir le risque
              et lisser le chiffre d&apos;affaires. Un food truck qui ne tient qu&apos;a un seul spot
              est vulnerable a tout changement (travaux, changement de proprietaire, conflit avec
              la mairie). Une bonne combinaison type : 2 jours zone bureaux + 2 jours marches +
              1 jour evenement ponctuel.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Charges specifiques ═════════════ */}
        <section id="charges" className="mb-16">
          <SectionHeading icon={<Wallet className="w-6 h-6" />} number="7">
            Les charges specifiques au food truck
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le food truck a des postes de charges qui n&apos;existent pas dans un restaurant
              traditionnel. Bien les anticiper evite les mauvaises surprises de tresorerie au
              premier trimestre d&apos;exploitation.
            </p>
          </div>

          <div className="mt-8 grid gap-4">
            {[
              { icon: <MapPin className="w-5 h-5" />, label: 'Emplacements (AOT, marches, parkings)', cost: '50 a 200 EUR/jour selon zone', detail: 'Negociable via abonnements annuels. Paris et Lyon sont les plus chers.' },
              { icon: <Truck className="w-5 h-5" />, label: 'Carburant vehicule', cost: '200 a 500 EUR/mois', detail: 'Variable selon kilometrage et type de moteur. Hybride/electrique reduit fortement la facture.' },
              { icon: <Zap className="w-5 h-5" />, label: 'Gaz de cuisine (bouteilles)', cost: '80 a 200 EUR/mois', detail: 'Bouteilles 13 kg ou 35 kg. Necessite contrat avec un fournisseur agree.' },
              { icon: <Shield className="w-5 h-5" />, label: 'Assurances (RC pro + vehicule)', cost: '600 a 1 500 EUR/an', detail: 'Couverture vol, casse, intoxication client, brulure salarie.' },
              { icon: <FileText className="w-5 h-5" />, label: 'Entretien vehicule + revisions', cost: '500 a 1 200 EUR/an', detail: 'Plus important qu\'un vehicule perso car kilometrage et charge superieurs.' },
              { icon: <Utensils className="w-5 h-5" />, label: 'Emballages jetables', cost: '0,15 a 0,40 EUR/commande', detail: 'Boites, couverts compostables, sachets, serviettes. Norme PFAS depuis 2024.' },
              { icon: <Sparkles className="w-5 h-5" />, label: 'Eau et eaux usees', cost: '20 a 50 EUR/mois', detail: 'Recharge cuve eau propre + vidange cuve eau usee dans station agree.' },
              { icon: <Calculator className="w-5 h-5" />, label: 'Logiciel caisse + paiement', cost: '40 a 100 EUR/mois', detail: 'TPE mobile (SumUp, Stripe), logiciel encaissement conforme loi anti-fraude TVA.' },
            ].map((c, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center shrink-0">
                  {c.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                    <h4 className="font-semibold text-mono-100">{c.label}</h4>
                    <span className="text-sm font-bold text-teal-700">{c.cost}</span>
                  </div>
                  <p className="text-sm text-mono-400">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Saisonnalite ═════════════ */}
        <section id="saisonnalite" className="mb-16">
          <SectionHeading icon={<Sun className="w-6 h-6" />} number="8">
            Saisonnalite : peak ete vs slow hiver
          </SectionHeading>

          <div className="prose-content">
            <p>
              La saisonnalite est le facteur le plus sous-estime des nouveaux food truckeurs.
              L&apos;ecart entre un mois d&apos;ete reussi et un mois d&apos;hiver atone peut
              atteindre 60 %. Anticiper cette courbe est vital pour la tresorerie.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-amber-900">Peak ete (mai-septembre)</h3>
              </div>
              <p className="text-2xl font-extrabold text-amber-700 mb-2">+30 a +50 %</p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Festivals, terrasses bondees, evenements exterieurs, marches estivaux.
                Le pic absolu se situe en juillet-aout dans les zones touristiques et
                en juin-septembre dans les zones tertiaires.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-900">Mi-saison (mars-avril, oct-nov)</h3>
              </div>
              <p className="text-2xl font-extrabold text-blue-700 mb-2">CA normal</p>
              <p className="text-sm text-blue-800 leading-relaxed">
                Reference de calcul de la rentabilite annuelle. Cycle bureaux stable,
                meteo encore clemente. Bons mois pour tester de nouveaux plats et
                ajuster la carte.
              </p>
            </div>
            <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Snowflake className="w-5 h-5 text-mono-400" />
                <h3 className="font-bold text-mono-100">Slow hiver (dec-fevrier)</h3>
              </div>
              <p className="text-2xl font-extrabold text-mono-100 mb-2">-20 a -40 %</p>
              <p className="text-sm text-mono-400 leading-relaxed">
                Froid, pluie, conges scolaires, fermetures de bureaux. Beaucoup de food
                truckeurs reduisent leur activite a 2-3 jours par semaine ou se
                reorientent sur l&apos;evenementiel prive (Noel, seminaires).
              </p>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Strategies anti-saisonnalite</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li>
                <strong>Adapter la carte</strong> : plats chauds reconfortants (soupes, currys, ramen)
                en hiver, frais et legers (bowls, salades, wraps) en ete.
              </li>
              <li>
                <strong>Pivoter sur l&apos;evenementiel</strong> : mariages, seminaires entreprise,
                marches de Noel, lancement produit. Tarif forfaitaire 800-3 000 EUR/jour.
              </li>
              <li>
                <strong>Reduire les jours d&apos;exploitation</strong> en hiver pour preserver la
                tresorerie. Mieux vaut faire 3 jours plein qu&apos;un mois entier a perte.
              </li>
              <li>
                <strong>Anticiper la tresorerie</strong> : provisionner 3 mois de charges fixes
                pendant le pic estival pour absorber l&apos;hiver.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Concepts qui marchent ═════════════ */}
        <section id="concepts" className="mb-16">
          <SectionHeading icon={<Utensils className="w-6 h-6" />} number="9">
            Concepts qui marchent en 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tous les concepts ne se valent pas. Voici les categories qui surperforment en France
              en 2026, avec leurs forces, faiblesses et marges typiques observees par RestauMargin.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            {[
              {
                icon: <Utensils className="w-5 h-5" />,
                title: 'Burger gourmet',
                margin: '72-78 %',
                ticket: '12-16 EUR',
                desc: 'Le concept le plus rentable et le plus universel. Pain artisanal, viande tracee, sauces maison. Concurrence forte donc differenciation indispensable (pain noir, fromage AOP, recettes signature).',
                color: 'amber'
              },
              {
                icon: <Leaf className="w-5 h-5" />,
                title: 'Healthy bowl',
                margin: '68-75 %',
                ticket: '11-14 EUR',
                desc: 'Poke bowls, buddha bowls, salades composees. Tres tendance zones tertiaires. Cible feminine 25-45 ans. Necessite logistique fraiche pointue et carte simple.',
                color: 'emerald'
              },
              {
                icon: <Utensils className="w-5 h-5" />,
                title: 'Street food asiatique',
                margin: '70-77 %',
                ticket: '9-14 EUR',
                desc: 'Bao, banh mi, bibimbap, dumplings. Concept tres apprecie en 2026, food cost maitrise (riz, viande, legumes), differenciation forte vs concurrence francaise.',
                color: 'amber'
              },
              {
                icon: <Pizza className="w-5 h-5" />,
                title: 'Pizza au four a bois mobile',
                margin: '75-82 %',
                ticket: '11-15 EUR',
                desc: 'Marge brute exceptionnelle (ingredients peu chers). Necessite four a bois mobile (8 000-15 000 EUR), formation pizzaiolo, productivite 30-50 pizzas/heure.',
                color: 'emerald'
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: 'Concept vegetarien / vegan',
                margin: '70-78 %',
                ticket: '10-14 EUR',
                desc: 'Croissance soutenue 2024-2026 (+15 % par an). Cible engagee, fidele, prete a payer un premium. Faible concurrence dans la plupart des villes hors Paris.',
                color: 'emerald'
              },
              {
                icon: <Sun className="w-5 h-5" />,
                title: 'Cuisine du monde locale',
                margin: '65-73 %',
                ticket: '12-16 EUR',
                desc: 'Mexicain, libanais, marocain, peruvien. Differenciation forte, cible curieuse. Marge plus serree car ingredients specifiques parfois importes.',
                color: 'amber'
              },
            ].map((c, i) => {
              const colors = c.color === 'emerald'
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200';
              const badge = c.color === 'emerald'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700';
              return (
                <div key={i} className={`${colors} border rounded-2xl p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 ${badge} rounded-lg flex items-center justify-center`}>
                        {c.icon}
                      </div>
                      <h3 className="font-bold text-mono-100">{c.title}</h3>
                    </div>
                    <span className={`text-xs ${badge} px-2 py-0.5 rounded-full font-semibold`}>{c.margin}</span>
                  </div>
                  <div className="text-xs text-mono-500 mb-2"><strong>Ticket moyen :</strong> {c.ticket}</div>
                  <p className="text-sm text-mono-400 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>

          <Callout type="info">
            <strong>Tendance forte 2026 :</strong> les concepts &quot;mono-produit decline&quot; (un seul plat
            signature en 4-6 variations) surperforment les cartes catalogue. Exemple : un food truck
            qui ne fait que des bao en 6 variations realisera plus de CA et de marge qu&apos;un truck
            asiatique generaliste. Concentration = expertise = productivite = marge.
          </Callout>
        </section>

        {/* ═════════════ SECTION 10 : Tableaux ROI ═════════════ */}
        <section id="roi" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="10">
            Tableaux d&apos;investissement et scenarios ROI
          </SectionHeading>

          <div className="prose-content">
            <p>
              Trois scenarios chiffres pour visualiser concretement le retour sur investissement
              d&apos;un food truck en France en 2026. Hypotheses 220 jours d&apos;exploitation
              annuelle, food cost 28-30 %.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Indicateur</th>
                  <th className="text-center py-3 px-4 font-semibold">Scenario bas</th>
                  <th className="text-center py-3 px-4 font-semibold">Scenario median</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Scenario haut</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Investissement initial</td><td className="py-3 px-4 text-center">35 000 EUR</td><td className="py-3 px-4 text-center">60 000 EUR</td><td className="py-3 px-4 text-center">80 000 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Type de vehicule</td><td className="py-3 px-4 text-center">Occasion amenagee</td><td className="py-3 px-4 text-center">Boxer amenage neuf</td><td className="py-3 px-4 text-center">Sprinter premium</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Commandes/jour moyennes</td><td className="py-3 px-4 text-center">40</td><td className="py-3 px-4 text-center">70</td><td className="py-3 px-4 text-center">110</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Ticket moyen</td><td className="py-3 px-4 text-center">10 EUR</td><td className="py-3 px-4 text-center">13 EUR</td><td className="py-3 px-4 text-center">15 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">CA annuel HT</td><td className="py-3 px-4 text-center font-semibold">88 000 EUR</td><td className="py-3 px-4 text-center font-semibold">200 200 EUR</td><td className="py-3 px-4 text-center font-semibold">363 000 EUR</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-4 font-bold text-emerald-900">Marge brute (72 %)</td><td className="py-3 px-4 text-center font-bold text-emerald-900">63 360 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-900">144 144 EUR</td><td className="py-3 px-4 text-center font-bold text-emerald-900">261 360 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Total charges (hors matieres)</td><td className="py-3 px-4 text-center text-red-700">-50 000 EUR</td><td className="py-3 px-4 text-center text-red-700">-95 000 EUR</td><td className="py-3 px-4 text-center text-red-700">-180 000 EUR</td></tr>
                <tr className="bg-blue-50"><td className="py-3 px-4 font-bold text-blue-900">Marge nette avant impot</td><td className="py-3 px-4 text-center font-bold text-blue-900">13 360 EUR</td><td className="py-3 px-4 text-center font-bold text-blue-900">49 144 EUR</td><td className="py-3 px-4 text-center font-bold text-blue-900">81 360 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Marge nette %</td><td className="py-3 px-4 text-center font-semibold">15,2 %</td><td className="py-3 px-4 text-center font-semibold">24,5 %</td><td className="py-3 px-4 text-center font-semibold">22,4 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Rentabilisation invest.</td><td className="py-3 px-4 text-center font-semibold text-teal-700">31 mois</td><td className="py-3 px-4 text-center font-semibold text-teal-700">15 mois</td><td className="py-3 px-4 text-center font-semibold text-teal-700">12 mois</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Lecture :</strong> le scenario median (60 000 EUR d&apos;investissement, 70 commandes/jour,
              200 000 EUR de CA) est le plus representatif d&apos;un food truck professionnel en France.
              Il degage environ 49 000 EUR de marge nette avant impot, soit l&apos;equivalent
              d&apos;un salaire net de 30 000 a 35 000 EUR pour le gerant apres charges sociales et impots.
            </p>
            <p>
              Le scenario bas (40 commandes/jour) est viable mais ne permet pas de vivre exclusivement
              du food truck — il convient comme activite complementaire. Le scenario haut (110 commandes/jour)
              n&apos;est atteignable qu&apos;avec un excellent emplacement zone bureaux + une organisation
              parfaitement rodee, generalement a 2 personnes dans le truck.
            </p>
            <p>
              Pour construire votre business plan precisement, telechargez notre <Link to="/blog/budget-previsionnel-restaurant" className="text-teal-700 underline hover:text-teal-800">guide du budget previsionnel restaurant</Link> qui detaille toutes les rubriques a anticiper.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 11 : Erreurs a eviter ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="11">
            Les 7 erreurs courantes a eviter
          </SectionHeading>

          <div className="space-y-6 mt-8">
            <ErreurCard
              number={1}
              title="Sous-estimer l'importance de l'emplacement"
              desc="L'emplacement = 70 % du succes. Beaucoup de food truckeurs investissent 60 000 EUR dans un beau camion mais negligent la recherche d'emplacements. Resultat : un truck magnifique gare au mauvais endroit qui ne fait que 20 commandes/jour. Securisez 4 jours d'emplacements fixes AVANT d'acheter votre vehicule."
            />
            <ErreurCard
              number={2}
              title="Carte trop large"
              desc="Plus de 10 plats au menu = catastrophe operationnelle. Temps de service trop long, gestion stock complexe, productivite divisee par 2. Maximum 6 a 10 plats, un plat signature, des variations a la marge. Les food trucks qui cartonnent en 2026 sont ceux qui sont identifiables a une seule cuisine en une seule phrase."
            />
            <ErreurCard
              number={3}
              title="Negliger les normes HACCP et la conformite ZFE"
              desc="Les controles DDPP se sont intensifies. Un seul manquement (releves temperatures absents, eau usee non separee, formation HACCP expiree) peut couter 1 500 a 7 500 EUR d'amende et fermer le truck. La conformite ZFE est tout aussi critique : un vehicule Crit'Air 3 ou 4 est interdit dans 11 metropoles francaises depuis 2025."
            />
            <ErreurCard
              number={4}
              title="Ne pas peser ni standardiser les portions"
              desc="C'est l'erreur cuisine la plus couteuse. Sans grammages precis, vos portions varient et votre food cost reel devient ingerable. Un cuisinier genereux peut facilement ajouter 20 % de matiere premiere en trop. Sur 70 commandes/jour pendant 220 jours, cela represente facilement 8 000 a 12 000 EUR de marge envolee."
            />
            <ErreurCard
              number={5}
              title="Investir en hiver"
              desc="Demarrer un food truck en novembre-decembre est la pire decision possible. Vous absorbez le froid, la pluie, les conges scolaires sans avoir eu le temps de construire une communaute. Resultat : tresorerie a sec au printemps. Lancez idealement entre avril et juin pour profiter du pic estival."
            />
            <ErreurCard
              number={6}
              title="Negliger Instagram et le digital"
              desc="En 2026, un food truck sans communaute digitale est aveugle. Instagram est l'outil numero 1 : annonce des emplacements, photos plats, stories ambiance, fidelisation. Visez 1 000 abonnes engages a 6 mois, 5 000 a 12 mois. C'est gratuit, c'est efficace, et c'est ce qui fait la difference entre un truck qui survit et un truck qui scale."
            />
            <ErreurCard
              number={7}
              title="Vouloir tout faire seul"
              desc="Au-dela de 60 commandes/jour, etre seul dans le truck est intenable physiquement. Temps de service trop long, qualite qui baisse, stress permanent. Embauchez un equipier (extra ou salarie) des que vous depassez 50 commandes/jour. Le cout est largement compense par l'augmentation du volume et la qualite preservee."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumule :</strong> ces sept erreurs combinees peuvent reduire votre marge nette
            de 50 a 70 %. Un food truck capable de degager 50 000 EUR/an en mode optimal n&apos;en
            generera que 15 000-25 000 EUR si ces erreurs ne sont pas corrigees.
          </Callout>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="16 min" variant="footer" />

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
              Pilotez votre food truck avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Calculateur de marge specifique food truck : food cost mobile, AOT, emballages,
              gestion saisonnalite. Suivi quotidien CA et marges en temps reel.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> &mdash; essai gratuit 14 jours, sans engagement, sans carte bancaire.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-bold rounded-full hover:bg-teal-50 transition-colors text-lg shadow-lg"
              >
                Essai gratuit 14 jours
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/comment-ouvrir-restaurant-guide-complet" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Comment ouvrir un restaurant : guide complet</h3>
              <p className="text-xs text-mono-500">Etapes, budget, licences, equipement, recrutement.</p>
            </Link>
            <Link to="/blog/budget-previsionnel-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Budget previsionnel restaurant</h3>
              <p className="text-xs text-mono-500">Plan financier, rubriques de charges, financement.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant : guide complet</h3>
              <p className="text-xs text-mono-500">Marge brute, food cost, formules, benchmarks.</p>
            </Link>
            <Link to="/blog/strategie-digitale-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Strategie digitale restaurant</h3>
              <p className="text-xs text-mono-500">Instagram, Google My Business, livraison, fidelite.</p>
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

function ModeleCard({ icon, title, value, color, desc }: {
  icon: React.ReactNode; title: string; value: string; color: string; desc: string;
}) {
  const colors: Record<string, { bg: string; text: string; badge: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  };
  const c = colors[color] || colors.emerald;

  return (
    <div className={`${c.bg} rounded-2xl p-6 border border-mono-975`}>
      <div className={`w-10 h-10 ${c.badge} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="font-bold text-mono-100 mb-2">{title}</h3>
      <p className={`text-2xl font-extrabold ${c.text} mb-3`}>{value}</p>
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
