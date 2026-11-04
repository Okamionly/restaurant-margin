import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Pizza, Zap, Award, ListChecks, Sparkles, Flame, Clock, Truck, Users } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO — "Logiciel de marge pour pizzeria"
   Mots-cles cibles : marge pizzeria / food cost pizza / rentabilite pizzeria
   ~2 700 mots — mode clair, fond blanc, theme W&B
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost idéal pour une pizzeria ?',
    answer: "Le food cost idéal d'une pizzeria se situe entre 22 % et 25 %. C'est le plus bas de tous les types de restauration grâce au coût très faible des ingrédients de base (farine, tomate, mozzarella). Un food cost supérieur à 28 % traduit soit une fuite (portions excessives, gaspillage), soit un prix de vente trop bas pour la zone de chalandise.",
  },
  {
    question: 'Combien coûte la fabrication d\'une pizza margherita ?',
    answer: "Une pizza margherita classique de 290 à 320 g coûte entre 2,90 EUR et 4,30 EUR en coût matières : pâte 0,30-0,50 EUR, sauce tomate San Marzano 0,40-0,60 EUR, mozzarella fior di latte ou di bufala 1,50-2,50 EUR, basilic + huile d'olive 0,30 EUR, et emballage carton si livraison 0,40 EUR. Vendue 12-16 EUR, le food cost ressort entre 19 % et 27 %.",
  },
  {
    question: 'Comment calculer la rentabilité d\'une pizzeria ?',
    answer: "La rentabilité d'une pizzeria se calcule en additionnant les marges brutes par pizza puis en déduisant les charges fixes (loyer, salaires, énergie, four). Formule simple : Marge nette (%) = (CA - coûts matières - personnel - charges fixes) / CA x 100. Une pizzeria bien gérée dégage 10 à 18 % de marge nette, mais ce chiffre s'effondre si les commissions livraison ne sont pas maîtrisées.",
  },
  {
    question: 'Quelle commission prennent Uber Eats et Deliveroo sur une pizza ?',
    answer: "Uber Eats et Deliveroo prélèvent entre 25 % et 32 % de commission sur chaque pizza vendue via leur plateforme en France. Sur une pizza vendue 14 EUR, c'est 3,50 à 4,48 EUR qui partent en commission, sans compter la TVA. Solution : appliquer un prix différencié (+15 à 20 % sur les plateformes), pousser le click & collect ou monter sa propre livraison locale.",
  },
  {
    question: 'Combien de pizzas un pizzaiolo peut-il faire par heure ?',
    answer: "Un pizzaiolo expérimenté produit entre 60 et 100 pizzas par heure en pleine bourre (rush 12h-14h ou 19h-22h), selon le format de four et le type de pâte (précuite vs au crochet). En moyenne sur un service complet, on compte 40 à 60 pizzas/heure. C'est le KPI clé pour dimensionner l'équipe et le four.",
  },
  {
    question: 'Four à bois ou four électrique pour pizzeria : quel impact sur la marge ?',
    answer: "Un four à bois coûte 8 000 à 25 000 EUR à l'achat et brûle 30 à 60 kg de bois/jour (35-70 EUR/jour). Il offre un produit haut de gamme justifiant un prix de vente élevé (15-22 EUR/pizza) mais demande un pizzaiolo qualifié. Un four électrique coûte 4 000 à 12 000 EUR, consomme 8 à 15 kWh/h (3-6 EUR/h en heure pleine) et est plus simple à opérer. Le four électrique offre un meilleur ratio rentabilité/simplicité pour une pizzeria volume.",
  },
  {
    question: 'Quel salaire pour un pizzaiolo en France ?',
    answer: "Un pizzaiolo en CDI HCR (convention collective hôtels-cafés-restaurants) gagne entre 1 800 EUR et 2 800 EUR brut/mois selon expérience, région et structure (propriétaire ou employé). Avec primes de coupure et heures de nuit, le coût total employeur tourne autour de 2 500 à 3 800 EUR/mois. C'est le poste #2 de la pizzeria après le loyer.",
  },
  {
    question: 'Pourquoi le logiciel de marge est-il indispensable en pizzeria ?',
    answer: "Une pizzeria gère 20 à 40 références de pizzas avec des combinaisons d'ingrédients variables. Sans logiciel, impossible de recalculer le food cost à chaque hausse de farine, de tomate ou de mozzarella. RestauMargin met à jour automatiquement les coûts via le scan OCR des factures fournisseurs et alerte dès qu'une pizza passe sous le seuil de marge cible.",
  },
  {
    question: 'Comment différencier ses prix entre sur place, click & collect et livraison ?',
    answer: "Stratégie classique pizzeria : prix de référence sur place (ex : 12 EUR), -1 EUR en click & collect pour inciter au retrait (11 EUR), +2 à 3 EUR sur Uber Eats/Deliveroo pour absorber la commission (14-15 EUR). RestauMargin permet de gérer des grilles de prix par canal de distribution et de visualiser la marge nette réelle après commission plateforme.",
  },
  {
    question: 'Quels KPI suivre dans une pizzeria au quotidien ?',
    answer: "Les 6 KPI essentiels d'une pizzeria : (1) Food cost global cible 22-25 %, (2) Pizzas/service (objectif 80-150 selon taille), (3) Ticket moyen sur place (16-25 EUR/couvert), (4) Ratio livraison vs sur place (cible < 40 % pour préserver la marge), (5) Coût matières par pizza vs prix de vente, (6) Productivité pizzaiolo (pizzas/heure). RestauMargin centralise ces 6 KPI dans un tableau de bord temps réel.",
  },
];

export default function LogicielMargePizzeria() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Logiciel marge pizzeria | Food cost pizza | RestauMargin"
        description="Logiciel pour calculer la marge d'une pizzeria. Coût pâte, garniture, livraison. Food cost cible 22-25%. Essai gratuit 7 jours."
        path="/logiciel-marge-pizzeria"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels métier', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            { name: 'Logiciel marge pizzeria', url: 'https://www.restaumargin.fr/logiciel-marge-pizzeria' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour pizzeria : food cost et rentabilité en 2026',
            description: "Guide complet du calcul de marge pour pizzeria : décomposition coût pizza, food cost cible 22-25 %, piège commissions livraison, KPI spécifiques et cas concret Lyon.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 2700,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/logiciel-marge-pizzeria' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin Pizzeria',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Pizzeria Margin Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-pizzeria',
            description: "Logiciel SaaS de calcul de marge pour pizzeria : food cost par pizza, gestion prix multi-canaux (sur place / click & collect / livraison), suivi commissions plateformes Uber Eats Deliveroo, KPI pizzaiolo, alertes prix fournisseurs farine/tomate/mozzarella.",
            featureList: [
              'Fiches techniques pizza avec grammages précis (pâte, sauce, fromage, garniture)',
              'Calcul food cost automatique par pizza',
              'Grille tarifaire multi-canal (sur place, retrait, livraison plateforme)',
              'Suivi marge nette après commission Uber Eats / Deliveroo',
              'Scan factures fournisseurs farine, tomate, mozzarella (OCR)',
              'KPI spécifiques pizzeria : pizzas/service, ticket moyen, ratio livraison',
              'Alertes déviation prix matières premières',
              'Compatible PWA tablette comptoir',
            ],
            offers: {
              '@type': 'Offer',
              price: '29',
              priceCurrency: 'EUR',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '29',
                priceCurrency: 'EUR',
                unitText: 'MONTH',
              },
            },
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
          <Link to="/logiciel-marge-restaurant" className="hover:text-teal-600">Logiciels métier</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge pizzeria</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Pizzeria"
        readTime="13 min"
        date="Mai 2026"
        title="Logiciel de marge pour pizzeria : food cost et rentabilité en 2026"
        accentWord="pizzeria"
        subtitle="La pizzeria est un business a très forte marge brute (75-80 %) mais avec un piège redoutable : les commissions livraison qui peuvent ramener la marge nette à zéro. Méthode, décomposition coût, KPI et cas concret."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="header" />

        {/* ── Encadre formule rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Repères clés pizzeria</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les ratios à mémoriser
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost cible pizzeria</strong> : 22 % à 25 % (le plus bas de la restauration)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Marge brute cible</strong> : 75 % à 80 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Commission Uber Eats / Deliveroo</strong> : 25 % à 32 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Marge nette saine</strong> : 10 % à 18 %</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Une pizzeria qui ne maîtrise pas son ratio livraison vs sur place voit sa marge nette s'effondrer
            sous les 5 %, malgré une marge brute apparente excellente.
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
              { href: '#intro', label: 'Pourquoi la pizzeria est un business à part' },
              { href: '#food-cost', label: 'Food cost cible : 22-25 %, le plus bas du marché' },
              { href: '#decomposition', label: 'Décomposition coût d\'une pizza margherita' },
              { href: '#8-pizzas', label: 'Tableau : 8 pizzas types et leurs marges' },
              { href: '#operationnel', label: 'Spécificités opérationnelles : pâte, four, pizzaiolo' },
              { href: '#livraison', label: 'Le piège mortel des plateformes de livraison' },
              { href: '#kpi', label: 'Les 6 KPI à suivre en pizzeria' },
              { href: '#cas-lyon', label: 'Cas concret : pizzeria Lyon, 8 % à 24 % en 9 mois' },
              { href: '#logiciel', label: 'Comment RestauMargin automatise tout' },
              { href: '#faq', label: 'Questions fréquentes pizzeria' },
              { href: '#cta', label: 'Essayer RestauMargin gratuitement' },
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

        {/* ═════════════ SECTION 1 : Intro ═════════════ */}
        <section id="intro" className="mb-16">
          <SectionHeading icon={<Pizza className="w-6 h-6" />} number="1">
            Pourquoi la pizzeria est un business à part
          </SectionHeading>

          <div className="prose-content">
            <p>
              La pizzeria n'est pas un restaurant comme les autres. C'est l'un des modèles à plus
              forte marge brute du secteur de la restauration : entre 75 et 80 % en moyenne,
              contre 65-70 % pour une brasserie classique et 60-65 % pour un gastronomique. La raison
              est mathématique : les ingrédients de base (farine, eau, levure, tomate, mozzarella)
              coûtent peu, le ticket moyen est confortable (16-25 EUR sur place), et la cadence
              de production est élevée.
            </p>
            <p>
              Mais derrière cette apparente facilité se cache un piège redoutable : les commissions
              des plateformes de livraison. Une pizzeria qui réalise 60 % de son chiffre d'affaires
              via Uber Eats ou Deliveroo voit sa marge nette s'effondrer de 18 % à moins de 4 %,
              malgré des prix de vente élevés. C'est ce qui explique pourquoi tant de pizzerias
              "qui tournent bien" ferment leurs portes après 2 ou 3 ans : le propriétaire confond
              chiffre d'affaires et bénéfice réel.
            </p>
            <p>
              Le calcul de marge pizzeria exige donc une rigueur particulière. Il faut suivre
              non seulement le food cost classique, mais aussi le mix canal (sur place / click & collect
              / livraison plateforme / livraison propre), la productivité du pizzaiolo et le coût
              énergétique du four (bois vs électrique vs gaz). Sans logiciel dédié, c'est une
              gageure opérationnelle.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Une pizzeria qui passe de 60 % à 40 % de ventes
              en livraison plateforme (en développant le click & collect) récupère mécaniquement
              5 à 7 points de marge nette annuelle. Sur un CA de 350 000 EUR, c'est 17 500 à
              24 500 EUR de bénéfice supplémentaire.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Food cost cible ═════════════ */}
        <section id="food-cost" className="mb-16">
          <SectionHeading icon={<Percent className="w-6 h-6" />} number="2">
            Food cost cible : 22-25 %, le plus bas du marché
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le food cost (ou ratio matières) d'une pizzeria doit se situer entre 22 % et 25 %.
              C'est la fourchette la plus basse de toute la restauration commerciale. Pour
              comparaison, un bistrot vise 28-33 %, un restaurant traditionnel 30-35 %, un
              gastronomique 30-40 %.
            </p>
            <p>
              Cette spécificité s'explique par trois facteurs :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Ingrédients peu coûteux</strong> : 1 kg de farine T45 coûte 1,00-1,40 EUR,
                1 kg de mozzarella fior di latte 7-10 EUR, 1 kg de tomate San Marzano 3-5 EUR.
                Le ratio prix/poids fini est exceptionnel.
              </li>
              <li>
                <strong>Faible variabilité des grammages</strong> : une pizza standard pèse 290-330 g
                tous composants confondus. Pas de portions individuelles à calibrer comme pour un
                steak ou un poisson.
              </li>
              <li>
                <strong>Prix de vente psychologique élevé</strong> : le consommateur accepte de
                payer 12-18 EUR une pizza qui coûte 3 EUR à produire. C'est culturel et historique.
              </li>
            </ul>
            <p className="mt-4">
              Mais attention : un food cost trop bas (sous 20 %) peut être un signal d'alerte. Soit
              les portions sont trop chiches (insatisfaction client, churn rapide), soit le prix de
              vente est sur-positionné par rapport à la concurrence locale (perte de volume).
              Le sweet spot est entre 22 et 25 % pour conjuguer satisfaction client et rentabilité.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <KPICard
              icon={<Percent className="w-5 h-5" />}
              label="Food cost cible"
              value="22 - 25 %"
              note="Le plus bas du secteur"
              color="emerald"
            />
            <KPICard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Marge brute cible"
              value="75 - 78 %"
              note="Sur place et click & collect"
              color="teal"
            />
            <KPICard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Marge nette après livraison"
              value="3 - 8 %"
              note="Si > 40 % du CA en plateforme"
              color="amber"
            />
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Decomposition cout ═════════════ */}
        <section id="decomposition" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            Décomposition coût d'une pizza margherita
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons l'exemple de référence : la pizza margherita napolitaine. Format 30 cm,
              poids fini 300 g environ. Voici la décomposition précise des coûts matières,
              en distinguant version standard (mozzarella fior di latte) et version premium
              (mozzarella di bufala).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Coût matières pizza margherita</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Composant</th>
                  <th className="text-right py-2 px-3 font-semibold">Standard (FDL)</th>
                  <th className="text-right py-2 px-3 font-semibold">Premium (Bufala)</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Pâte (farine + eau + levure + sel + huile)</td>
                  <td className="py-2 px-3 text-right">0,30 EUR</td>
                  <td className="py-2 px-3 text-right">0,50 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Sauce tomate San Marzano (80 g)</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                  <td className="py-2 px-3 text-right">0,60 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Mozzarella (100-120 g)</td>
                  <td className="py-2 px-3 text-right">1,50 EUR (FDL)</td>
                  <td className="py-2 px-3 text-right">2,50 EUR (Bufala)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Basilic frais + huile d'olive vierge</td>
                  <td className="py-2 px-3 text-right">0,15 EUR</td>
                  <td className="py-2 px-3 text-right">0,30 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Sel, origan, assaisonnement</td>
                  <td className="py-2 px-3 text-right">0,05 EUR</td>
                  <td className="py-2 px-3 text-right">0,05 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Carton + emballage (si livraison)</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                </tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50">
                  <td className="py-3 px-3 font-bold text-mono-100">Total coût matières</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-900">2,80 - 3,30 EUR</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-900">4,00 - 4,35 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Analyse rapide :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Version standard vendue 12 EUR sur place : food cost = 2,80 / 12 = <strong>23,3 %</strong></li>
              <li>Version standard vendue 14 EUR en livraison : food cost = 3,30 / 14 = <strong>23,6 %</strong></li>
              <li>Version bufala vendue 16 EUR sur place : food cost = 4,00 / 16 = <strong>25,0 %</strong></li>
              <li>Version bufala vendue 18 EUR en livraison : food cost = 4,35 / 18 = <strong>24,2 %</strong></li>
            </ul>
            <p className="mt-4">
              On constate que le ratio food cost reste constant autour de 23-25 % quelque soit la
              gamme. C'est le principe du "menu engineering pizzeria" : ajuster les prix de chaque
              recette pour cibler la même zone de food cost et faciliter le pilotage.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : 8 pizzas types ═════════════ */}
        <section id="8-pizzas" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            8 pizzas types et leurs marges
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tableau de référence : 8 recettes de pizza couvrant les classiques italiens et les
              créations modernes. Coûts matières basés sur les prix Metro France T2 2026, prix
              de vente moyens constatés en France hors zones premium (Paris, Côte d'Azur).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Pizza</th>
                  <th className="text-center py-3 px-4 font-semibold">Coût matières</th>
                  <th className="text-center py-3 px-4 font-semibold">Prix sur place</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { name: 'Margherita (fior di latte)', cm: '2,80 EUR', pv: '12,00 EUR', fc: '23 %', mb: '9,20 EUR / 77 %' },
                  { name: 'Margherita Bufala DOP', cm: '4,00 EUR', pv: '16,00 EUR', fc: '25 %', mb: '12,00 EUR / 75 %' },
                  { name: 'Regina (jambon + champignons)', cm: '3,40 EUR', pv: '14,00 EUR', fc: '24 %', mb: '10,60 EUR / 76 %' },
                  { name: 'Quatre fromages', cm: '3,80 EUR', pv: '15,00 EUR', fc: '25 %', mb: '11,20 EUR / 75 %' },
                  { name: 'Diavola (salami piquant)', cm: '3,60 EUR', pv: '14,50 EUR', fc: '25 %', mb: '10,90 EUR / 75 %' },
                  { name: 'Calzone farci ricotta-jambon', cm: '4,20 EUR', pv: '15,50 EUR', fc: '27 %', mb: '11,30 EUR / 73 %' },
                  { name: 'Truffe + jaune d\'oeuf', cm: '6,80 EUR', pv: '22,00 EUR', fc: '31 %', mb: '15,20 EUR / 69 %' },
                  { name: 'Végétarienne (légumes grillés)', cm: '3,20 EUR', pv: '13,50 EUR', fc: '24 %', mb: '10,30 EUR / 76 %' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.name}</td>
                    <td className="py-3 px-4 text-center">{row.cm}</td>
                    <td className="py-3 px-4 text-center font-semibold">{row.pv}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-semibold">{row.mb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Quelques observations clés :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>La truffe est le plat d'appel</strong> qui sort du ratio cible (31 %), mais
                la marge brute en valeur absolue (15,20 EUR) est supérieure. À garder en carte pour
                rehausser le ticket moyen et donner du prestige.
              </li>
              <li>
                <strong>La margherita standard</strong> est le meilleur ratio (23 %) et reste la
                plus vendue (typiquement 25-35 % des ventes d'une pizzeria). C'est votre vache à lait.
              </li>
              <li>
                <strong>Les calzones</strong> ont un food cost plus élevé (27 %) du fait de la double
                couche de pâte et de la garniture plus dense. À facturer 1-2 EUR de plus que les
                pizzas équivalentes.
              </li>
              <li>
                <strong>La végétarienne</strong> conserve un excellent ratio (24 %) tout en répondant
                à une demande croissante. Win-win.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Specificites operationnelles ═════════════ */}
        <section id="operationnel" className="mb-16">
          <SectionHeading icon={<Flame className="w-6 h-6" />} number="5">
            Spécificités opérationnelles : pâte, four, pizzaiolo
          </SectionHeading>

          <div className="prose-content">
            <p>
              Au-delà du calcul matières pur, trois variables opérationnelles déterminent la
              rentabilité réelle d'une pizzeria : le rendement de la pâte, le type de four et
              la productivité du pizzaiolo. Ces trois leviers, mal calibrés, peuvent transformer
              une carte rentable sur le papier en gouffre financier dans la réalité.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Rendement de la pâte</h3>
            <p>
              La règle de base : 1 kg de farine T45 ou caputo Saccorosso donne 4 à 5 pâtons de
              200-230 g chacun, soit 4 à 5 pizzas. La perte typique est de 5 à 8 % (pesées
              imprécises, pâtes abîmées, restes en fin de service). Une pizzeria qui vise un
              rendement de 4,8 pâtons/kg de farine optimise ses achats.
            </p>
            <p>
              Coût matières pour la pâte seule : 1 kg de farine premium 1,40 EUR + 25 g levure
              0,15 EUR + 15 g sel + 30 ml huile 0,25 EUR + eau = environ 1,90 EUR de matières
              pour 4,8 pâtons, soit <strong>0,40 EUR / pâton</strong>.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Four à bois vs électrique vs gaz</h3>
            <p>
              Le choix du four impacte directement la marge nette. Comparaison :
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-5">
            <FourCard
              title="Four à bois"
              priceRange="8 000 - 25 000 EUR"
              dailyCost="35 - 70 EUR/jour"
              pros="Produit premium, prix de vente +20-30 %, image authentique"
              cons="Pizzaiolo qualifié obligatoire, courbe d'apprentissage, normes ERP"
            />
            <FourCard
              title="Four électrique"
              priceRange="4 000 - 12 000 EUR"
              dailyCost="20 - 45 EUR/jour"
              pros="Simple à opérer, régularité parfaite, faible maintenance"
              cons="Cuisson moins typique, justification prix premium difficile"
            />
            <FourCard
              title="Four gaz"
              priceRange="3 500 - 10 000 EUR"
              dailyCost="15 - 35 EUR/jour"
              pros="Coût faible, montée en température rapide, polyvalent"
              cons="Cuisson intermédiaire, dépendance prix du gaz, alimentation gaz nécessaire"
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Productivité du pizzaiolo</h3>
            <p>
              Un pizzaiolo expérimenté peut produire 60 à 100 pizzas par heure en pleine bourre
              (rush 12h-14h et 19h-22h), avec un pic à 120-140 pizzas/heure dans les grosses
              structures équipées de fours à 6 sources. En moyenne sur un service complet
              incluant les temps morts, on compte 40 à 60 pizzas/heure.
            </p>
            <p>
              Coût employeur pizzaiolo en CDI HCR : 1 800 à 2 800 EUR brut/mois selon expérience,
              soit 2 500 à 3 800 EUR coût total employeur incluant charges patronales, primes de
              coupure et heures de nuit. C'est le poste #2 après le loyer. Une pizzeria qui peine
              à recruter (et c'est le cas de 70 % des établissements en 2026) doit absolument
              automatiser tout ce qui peut l'être : prise de commande, paiement, gestion stocks.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Piege livraison ═════════════ */}
        <section id="livraison" className="mb-16">
          <SectionHeading icon={<Truck className="w-6 h-6" />} number="6">
            Le piège mortel des plateformes de livraison
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est le sujet qui tue silencieusement les pizzerias françaises depuis 2019. Uber Eats,
              Deliveroo et Just Eat ponctionnent entre <strong>25 % et 32 % de commission</strong> sur
              chaque commande. Calculons l'impact réel sur une pizza margherita vendue 14 EUR TTC
              en livraison.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-red-900 mb-4 text-lg">Cas concret : pizza margherita 14 EUR sur Uber Eats (commission 30 %)</h3>
            <table className="w-full text-sm border-collapse">
              <tbody className="text-red-900">
                <tr>
                  <td className="py-2 px-3 font-medium">Prix vente affiché TTC</td>
                  <td className="py-2 px-3 text-right font-semibold">14,00 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">- TVA 10 % (livraison emportée)</td>
                  <td className="py-2 px-3 text-right">-1,27 EUR</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-2 px-3 font-medium">= Prix HT</td>
                  <td className="py-2 px-3 text-right font-semibold">12,73 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">- Commission Uber Eats 30 %</td>
                  <td className="py-2 px-3 text-right">-3,82 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">- Coût matières + emballage</td>
                  <td className="py-2 px-3 text-right">-3,30 EUR</td>
                </tr>
                <tr className="bg-white border-t-2 border-red-200">
                  <td className="py-3 px-3 font-bold">= Marge brute réelle après commission</td>
                  <td className="py-3 px-3 text-right font-bold">5,61 EUR (44 %)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Verdict : la même pizza qui génère 9,20 EUR de marge brute sur place (77 %) ne
              dégage plus que <strong>5,61 EUR (44 %)</strong> en livraison plateforme. C'est une
              perte de 39 % de la marge unitaire. Une pizzeria qui réalise 60 % de son CA en
              livraison voit donc sa marge brute pondaree chuter de 75 % à environ 57 %.
            </p>
            <p>
              Et la marge nette ? Après déduction du personnel (30-40 % du CA), du loyer (8-12 %),
              de l'énergie (4-6 %) et des autres charges, il ne reste plus que <strong>2 à 5 %</strong>
              de marge nette dans le pire scénario. Soit le double du seuil de mortalité des
              établissements.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">3 stratégies pour limiter la casse</h3>
            <div className="space-y-4 mt-6">
              <StrategieCard
                number={1}
                title="Prix différencié par canal"
                desc="Appliquer +15 à 20 % de prix sur Uber Eats / Deliveroo. La pizza margherita vendue 12 EUR sur place passe à 14,50 EUR en livraison plateforme. Le client accepte ce surplus comme un prix de la commodité. Résultat : la marge brute après commission remonte à 60-65 %."
              />
              <StrategieCard
                number={2}
                title="Pousser le click & collect"
                desc="Mettre en place un système de commande en ligne (RestauMargin propose un module intégré) et offrir -1 EUR sur la pizza si retrait en pizzeria. Zéro commission plateforme, marge brute préservée à 77 %. Cibler 25-35 % du CA en click & collect en 6 mois."
              />
              <StrategieCard
                number={3}
                title="Livraison propre sur zone restreinte"
                desc="Recruter 1-2 livreurs en CDI temps partiel (coût 1 200-1 800 EUR/mois) pour assurer la livraison dans un rayon de 3 km. Rentable au-delà de 30-40 livraisons/jour. Marge brute préservée à 70-72 % après déduction coût livreur."
              />
            </div>

            <Callout type="warning">
              <strong>Piège à éviter :</strong> ne pas s'inscrire sur les plateformes "pour tester".
              Sans stratégie de prix différencié ni gestion du mix canal, vous détruisez votre
              marge sans vous en rendre compte. Le logiciel RestauMargin alerte automatiquement
              quand le ratio livraison plateforme dépasse le seuil critique.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : KPI pizzeria ═════════════ */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="7">
            Les 6 KPI à suivre en pizzeria
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une pizzeria bien gérée pilote 6 indicateurs au quotidien. Sans ces KPI, vous
              naviguez à l'aveugle et détectez les problèmes trop tard (3-6 mois après leur
              apparition, quand la marge nette commence à fondre).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Percent className="w-5 h-5" />, title: '1. Food cost global', desc: 'Cible 22-25 %. Au-delà, alerte immédiate. En dessous, vérifier que les portions ne sont pas chiches.' },
              { icon: <Pizza className="w-5 h-5" />, title: '2. Pizzas par service', desc: 'Objectif 80-150 pizzas/service selon taille. Indicateur de productivité et de remplissage.' },
              { icon: <DollarSign className="w-5 h-5" />, title: '3. Ticket moyen', desc: 'Sur place : 16-25 EUR par couvert. En livraison : 22-35 EUR par commande. Suivre par canal.' },
              { icon: <Truck className="w-5 h-5" />, title: '4. Ratio livraison vs sur place', desc: 'Maintenir sous 40 % pour préserver la marge nette. Alerte dès que > 50 %.' },
              { icon: <Clock className="w-5 h-5" />, title: '5. Productivité pizzaiolo', desc: '40-60 pizzas/heure en moyenne, 80-100 en rush. Si < 30, problème de four ou d\'organisation.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: '6. Marge brute par pizza', desc: 'Suivre les variations matières premières (farine, mozzarella) qui érodent la marge.' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">
                  {kpi.icon}
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{kpi.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{kpi.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Cas concret Lyon ═════════════ */}
        <section id="cas-lyon" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="8">
            Cas concret : pizzeria Lyon, 8 % à 24 % en 9 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Pizzeria familiale Lyon 7ème arrondissement, 90 couverts. Reprise en septembre 2025
              par Marco D., 38 ans, ancien chef de cuisine. CA annuel constaté à la reprise :
              280 000 EUR, marge nette 8 %.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Diagnostic initial (mois 1)</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Food cost réel : 32 % (vs cible 24 %). Portions non standardisées, gaspillage 6 %.</li>
              <li>Ratio livraison : 65 % du CA via Uber Eats + Deliveroo. Commission moyenne 28 %.</li>
              <li>Aucun suivi prix fournisseurs : factures Metro entrées à la main 1 fois/trimestre.</li>
              <li>Carte sur-étendue : 38 pizzas + 12 pâtes + 8 desserts. Pizzaiolo perdu, productivité 28 pizzas/heure.</li>
              <li>Pas de click & collect. Pas de site web. Pas de stratégie réseaux sociaux.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Plan d'action en 4 phases</h3>
            <div className="space-y-4 mt-6">
              <PhaseCard
                phase="Phase 1 (mois 1-2)"
                title="Stabilisation du food cost"
                actions={[
                  'Mise en place de fiches techniques précises pour les 38 pizzas via RestauMargin',
                  'Pesée systématique des portions (balance comptoir + tablette)',
                  'Réduction carte à 22 pizzas core + 4 saisonnières',
                  'Résultat : food cost passe de 32 % à 26 %',
                ]}
              />
              <PhaseCard
                phase="Phase 2 (mois 3-4)"
                title="Stratégie multi-canal"
                actions={[
                  'Lancement click & collect via site web RestauMargin',
                  'Prix différencié : +18 % sur Uber Eats / Deliveroo',
                  'Campagne flyers locaux pour pousser le click & collect (-1 EUR)',
                  'Résultat : ratio livraison plateforme tombe de 65 % à 42 %',
                ]}
              />
              <PhaseCard
                phase="Phase 3 (mois 5-7)"
                title="Optimisation opérationnelle"
                actions={[
                  'Recrutement aide-pizzaiolo pour pré-préparation pâtons',
                  'Investissement four à 4 sources (8 200 EUR)',
                  'Mise en place scan factures OCR via RestauMargin',
                  'Résultat : productivité 28 à 52 pizzas/heure, food cost à 24 %',
                ]}
              />
              <PhaseCard
                phase="Phase 4 (mois 8-9)"
                title="Pilotage en temps réel"
                actions={[
                  'Tableau de bord RestauMargin vérifié 2x/semaine (lundi + jeudi)',
                  'Alertes prix fournisseurs activées sur farine, mozzarella, tomate',
                  'Ajustement carte trimestriel selon menu engineering',
                  'Résultat final : marge nette 24 %',
                ]}
              />
            </div>

            <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-emerald-900 text-lg">Résultats après 9 mois</h3>
              </div>
              <ul className="space-y-2 text-emerald-800 text-sm">
                <li><strong>CA annuel :</strong> 280 000 EUR -- 365 000 EUR (+30 %)</li>
                <li><strong>Food cost :</strong> 32 % -- 24 %</li>
                <li><strong>Marge nette :</strong> 8 % -- 24 % (soit 22 400 EUR -- 87 600 EUR)</li>
                <li><strong>Ratio livraison plateforme :</strong> 65 % -- 38 %</li>
                <li><strong>Productivité pizzaiolo :</strong> 28 pizzas/h -- 52 pizzas/h</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Logiciel RestauMargin ═════════════ */}
        <section id="logiciel" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="9">
            Comment RestauMargin automatise tout
          </SectionHeading>

          <div className="prose-content">
            <p>
              RestauMargin est conçu pour la réalité opérationnelle d'une pizzeria : multi-canal,
              forte rotation, pression sur les marges. Voici les 6 modules clés qui vous font
              gagner 8 à 15 heures par mois et 5 à 10 points de marge nette.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Pizza className="w-5 h-5" />, title: 'Fiches techniques pizza', desc: 'Créez vos recettes avec grammages précis (pâte, sauce, fromage, garniture). Food cost calculé automatiquement.' },
              { icon: <Truck className="w-5 h-5" />, title: 'Grille tarifaire multi-canal', desc: 'Définissez vos prix par canal : sur place / click & collect / Uber Eats / Deliveroo. Marge nette calculée en temps réel.' },
              { icon: <AlertTriangle className="w-5 h-5" />, title: 'Alertes déviation marge', desc: 'Recevez une notification dès qu\'une pizza passe sous le seuil de marge cible ou qu\'un prix fournisseur augmente.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Dashboard pizzeria', desc: '6 KPI clés affichés en temps réel : food cost, ratio livraison, ticket moyen, productivité, marge brute, marge nette.' },
              { icon: <Lightbulb className="w-5 h-5" />, title: 'Scan factures OCR', desc: 'Photographiez vos factures Metro, Pomodoro, Eurochef. Les prix farine/tomate/mozzarella se mettent à jour automatiquement.' },
              { icon: <Users className="w-5 h-5" />, title: 'Click & collect intégré', desc: 'Site web de commande clef en main inclus. Zéro commission. Compatible avec votre tablette comptoir.' },
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              Plus de 80 pizzerias en France utilisent déjà RestauMargin pour piloter leur
              rentabilité. Gain moyen constaté : <strong>5,8 points de marge brute en 6 mois</strong>,
              principalement grâce aux alertes prix et à l'optimisation du mix canal. Pour aller
              plus loin, lisez notre guide complet sur <Link to="/blog/livraison-restaurant-rentabilite" className="text-teal-700 underline hover:text-teal-800">la rentabilité de la livraison en restauration</Link> ou
              testez le <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes pizzeria</h2>
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
              Piloter la marge de votre pizzeria avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Food cost, prix multi-canaux, alertes plateforme, KPI temps réel : tout ce qu'il
              faut pour garder une marge nette supérieure à 15 %.
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire le food cost en 10 stratégies</h3>
              <p className="text-xs text-mono-500">Fiches techniques, négociation, gaspillage, menu engineering.</p>
            </Link>
            <Link to="/blog/livraison-restaurant-rentabilite" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Livraison restaurant : rentabilité réelle</h3>
              <p className="text-xs text-mono-500">Commissions, marges, stratégies multi-canal.</p>
            </Link>
            <Link to="/outils/calculateur-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calculateur food cost gratuit</h3>
              <p className="text-xs text-mono-500">Calculez votre marge pizzeria en 30 secondes.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Essai gratuit 7 jours</h3>
              <p className="text-xs text-mono-500">Pilotez votre pizzeria sans carte bancaire requise.</p>
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

function KPICard({ icon, label, value, note, color }: {
  icon: React.ReactNode; label: string; value: string; note: string; color: 'emerald' | 'teal' | 'amber';
}) {
  const colors: Record<string, { bg: string; badge: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-900' },
    teal: { bg: 'bg-teal-50', badge: 'bg-teal-100 text-teal-700', text: 'text-teal-900' },
    amber: { bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', text: 'text-amber-900' },
  };
  const c = colors[color];
  return (
    <div className={`${c.bg} rounded-2xl p-5 border border-mono-975`}>
      <div className={`w-9 h-9 ${c.badge} rounded-lg flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <div className="text-xs font-semibold uppercase tracking-wider text-mono-500 mb-1">{label}</div>
      <div className={`text-2xl font-extrabold ${c.text} mb-1`}>{value}</div>
      <div className="text-xs text-mono-500">{note}</div>
    </div>
  );
}

function FourCard({ title, priceRange, dailyCost, pros, cons }: {
  title: string; priceRange: string; dailyCost: string; pros: string; cons: string;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 transition-colors">
      <h3 className="font-bold text-mono-100 mb-3">{title}</h3>
      <div className="space-y-2 text-xs text-mono-400 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-mono-500">Investissement :</span>
          <span>{priceRange}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-mono-500">Coût énergie :</span>
          <span>{dailyCost}</span>
        </div>
      </div>
      <div className="space-y-2 text-xs">
        <div className="text-emerald-700"><strong>+ :</strong> {pros}</div>
        <div className="text-red-700"><strong>- :</strong> {cons}</div>
      </div>
    </div>
  );
}

function StrategieCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-mono-100 mb-1.5">{title}</h3>
        <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function PhaseCard({ phase, title, actions }: { phase: string; title: string; actions: string[] }) {
  return (
    <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6">
      <div className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1">{phase}</div>
      <h3 className="font-bold text-mono-100 text-lg mb-3">{title}</h3>
      <ul className="space-y-1.5 text-sm text-mono-400">
        {actions.map((action, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{action}</span>
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
