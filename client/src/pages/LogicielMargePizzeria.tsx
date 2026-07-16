import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Pizza, Zap, Award, ListChecks, Sparkles, Flame, Clock, Truck, Users } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO — "Logiciel de marge pour pizzeria"
   Mots-cles cibles : marge pizzeria / food cost pizza / rentabilite pizzeria
   ~2 700 mots — mode clair, fond blanc, theme W&B
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost ideal pour une pizzeria ?',
    answer: "Le food cost ideal d'une pizzeria se situe entre 22 % et 25 %. C'est le plus bas de tous les types de restauration grace au cout tres faible des ingredients de base (farine, tomate, mozzarella). Un food cost superieur a 28 % traduit soit une fuite (portions excessives, gaspillage), soit un prix de vente trop bas pour la zone de chalandise.",
  },
  {
    question: 'Combien coute la fabrication d\'une pizza margherita ?',
    answer: "Une pizza margherita classique de 290 a 320 g coute entre 2,90 EUR et 4,30 EUR en cout matieres : pate 0,30-0,50 EUR, sauce tomate San Marzano 0,40-0,60 EUR, mozzarella fior di latte ou di bufala 1,50-2,50 EUR, basilic + huile d'olive 0,30 EUR, et emballage carton si livraison 0,40 EUR. Vendue 12-16 EUR, le food cost ressort entre 19 % et 27 %.",
  },
  {
    question: 'Comment calculer la rentabilite d\'une pizzeria ?',
    answer: "La rentabilite d'une pizzeria se calcule en additionnant les marges brutes par pizza puis en deduisant les charges fixes (loyer, salaires, energie, four). Formule simple : Marge nette (%) = (CA - couts matieres - personnel - charges fixes) / CA x 100. Une pizzeria bien geree degage 10 a 18 % de marge nette, mais ce chiffre s'effondre si les commissions livraison ne sont pas maitrisees.",
  },
  {
    question: 'Quelle commission prennent Uber Eats et Deliveroo sur une pizza ?',
    answer: "Uber Eats et Deliveroo prelevent entre 25 % et 32 % de commission sur chaque pizza vendue via leur plateforme en France. Sur une pizza vendue 14 EUR, c'est 3,50 a 4,48 EUR qui partent en commission, sans compter la TVA. Solution : appliquer un prix differencie (+15 a 20 % sur les plateformes), pousser le click & collect ou monter sa propre livraison locale.",
  },
  {
    question: 'Combien de pizzas un pizzaiolo peut-il faire par heure ?',
    answer: "Un pizzaiolo experimente produit entre 60 et 100 pizzas par heure en pleine bourre (rush 12h-14h ou 19h-22h), selon le format de four et le type de pate (precuite vs au crochet). En moyenne sur un service complet, on compte 40 a 60 pizzas/heure. C'est le KPI cle pour dimensionner l'equipe et le four.",
  },
  {
    question: 'Four a bois ou four electrique pour pizzeria : quel impact sur la marge ?',
    answer: "Un four a bois coute 8 000 a 25 000 EUR a l'achat et brule 30 a 60 kg de bois/jour (35-70 EUR/jour). Il offre un produit haut de gamme justifiant un prix de vente eleve (15-22 EUR/pizza) mais demande un pizzaiolo qualifie. Un four electrique coute 4 000 a 12 000 EUR, consomme 8 a 15 kWh/h (3-6 EUR/h en heure pleine) et est plus simple a operer. Le four electrique offre un meilleur ratio rentabilite/simplicite pour une pizzeria volume.",
  },
  {
    question: 'Quel salaire pour un pizzaiolo en France ?',
    answer: "Un pizzaiolo en CDI HCR (convention collective hotels-cafes-restaurants) gagne entre 1 800 EUR et 2 800 EUR brut/mois selon experience, region et structure (proprietaire ou employe). Avec primes de coupure et heures de nuit, le cout total employeur tourne autour de 2 500 a 3 800 EUR/mois. C'est le poste #2 de la pizzeria apres le loyer.",
  },
  {
    question: 'Pourquoi le logiciel de marge est-il indispensable en pizzeria ?',
    answer: "Une pizzeria gere 20 a 40 references de pizzas avec des combinaisons d'ingredients variables. Sans logiciel, impossible de recalculer le food cost a chaque hausse de farine, de tomate ou de mozzarella. RestauMargin met a jour automatiquement les couts via le scan OCR des factures fournisseurs et alerte des qu'une pizza passe sous le seuil de marge cible.",
  },
  {
    question: 'Comment differencier ses prix entre sur place, click & collect et livraison ?',
    answer: "Strategie classique pizzeria : prix de reference sur place (ex : 12 EUR), -1 EUR en click & collect pour inciter au retrait (11 EUR), +2 a 3 EUR sur Uber Eats/Deliveroo pour absorber la commission (14-15 EUR). RestauMargin permet de gerer des grilles de prix par canal de distribution et de visualiser la marge nette reelle apres commission plateforme.",
  },
  {
    question: 'Quels KPI suivre dans une pizzeria au quotidien ?',
    answer: "Les 6 KPI essentiels d'une pizzeria : (1) Food cost global cible 22-25 %, (2) Pizzas/service (objectif 80-150 selon taille), (3) Ticket moyen sur place (16-25 EUR/couvert), (4) Ratio livraison vs sur place (cible < 40 % pour preserver la marge), (5) Cout matieres par pizza vs prix de vente, (6) Productivite pizzaiolo (pizzas/heure). RestauMargin centralise ces 6 KPI dans un tableau de bord temps reel.",
  },
];

export default function LogicielMargePizzeria() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel marge pizzeria | Food cost pizza | RestauMargin"
        description="Logiciel pour calculer la marge d'une pizzeria. Cout pate, garniture, livraison. Food cost cible 22-25%. Essai gratuit 7 jours."
        path="/logiciel-marge-pizzeria"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels metier', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            { name: 'Logiciel marge pizzeria', url: 'https://www.restaumargin.fr/logiciel-marge-pizzeria' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour pizzeria : food cost et rentabilite en 2026',
            description: "Guide complet du calcul de marge pour pizzeria : decomposition cout pizza, food cost cible 22-25 %, piege commissions livraison, KPI specifiques et cas concret Lyon.",
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
              'Fiches techniques pizza avec grammages precis (pate, sauce, fromage, garniture)',
              'Calcul food cost automatique par pizza',
              'Grille tarifaire multi-canal (sur place, retrait, livraison plateforme)',
              'Suivi marge nette apres commission Uber Eats / Deliveroo',
              'Scan factures fournisseurs farine, tomate, mozzarella (OCR)',
              'KPI specifiques pizzeria : pizzas/service, ticket moyen, ratio livraison',
              'Alertes deviation prix matieres premieres',
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
              <Pizza className="w-4 h-4" />
              Essai gratuit 7 jours
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
          <Link to="/logiciel-marge-restaurant" className="hover:text-teal-600">Logiciels metier</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge pizzeria</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Pizzeria"
        readTime="13 min"
        date="Mai 2026"
        title="Logiciel de marge pour pizzeria : food cost et rentabilite en 2026"
        accentWord="pizzeria"
        subtitle="La pizzeria est un business a tres forte marge brute (75-80 %) mais avec un piege redoutable : les commissions livraison qui peuvent ramener la marge nette a zero. Methode, decomposition cout, KPI et cas concret."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="header" />

        {/* ── Encadre formule rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Reperes cles pizzeria</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les ratios a memoriser
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost cible pizzeria</strong> : 22 % a 25 % (le plus bas de la restauration)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Marge brute cible</strong> : 75 % a 80 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Commission Uber Eats / Deliveroo</strong> : 25 % a 32 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Marge nette saine</strong> : 10 % a 18 %</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Une pizzeria qui ne maitrise pas son ratio livraison vs sur place voit sa marge nette s'effondrer
            sous les 5 %, malgre une marge brute apparente excellente.
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
              { href: '#intro', label: 'Pourquoi la pizzeria est un business a part' },
              { href: '#food-cost', label: 'Food cost cible : 22-25 %, le plus bas du marche' },
              { href: '#decomposition', label: 'Decomposition cout d\'une pizza margherita' },
              { href: '#8-pizzas', label: 'Tableau : 8 pizzas types et leurs marges' },
              { href: '#operationnel', label: 'Specificites operationnelles : pate, four, pizzaiolo' },
              { href: '#livraison', label: 'Le piege mortel des plateformes de livraison' },
              { href: '#kpi', label: 'Les 6 KPI a suivre en pizzeria' },
              { href: '#cas-lyon', label: 'Cas concret : pizzeria Lyon, 8 % a 24 % en 9 mois' },
              { href: '#logiciel', label: 'Comment RestauMargin automatise tout' },
              { href: '#faq', label: 'Questions frequentes pizzeria' },
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
            Pourquoi la pizzeria est un business a part
          </SectionHeading>

          <div className="prose-content">
            <p>
              La pizzeria n'est pas un restaurant comme les autres. C'est l'un des modeles a plus
              forte marge brute du secteur de la restauration : entre 75 et 80 % en moyenne,
              contre 65-70 % pour une brasserie classique et 60-65 % pour un gastronomique. La raison
              est mathematique : les ingredients de base (farine, eau, levure, tomate, mozzarella)
              coutent peu, le ticket moyen est confortable (16-25 EUR sur place), et la cadence
              de production est elevee.
            </p>
            <p>
              Mais derriere cette apparente facilite se cache un piege redoutable : les commissions
              des plateformes de livraison. Une pizzeria qui realise 60 % de son chiffre d'affaires
              via Uber Eats ou Deliveroo voit sa marge nette s'effondrer de 18 % a moins de 4 %,
              malgre des prix de vente eleves. C'est ce qui explique pourquoi tant de pizzerias
              "qui tournent bien" ferment leurs portes apres 2 ou 3 ans : le proprietaire confond
              chiffre d'affaires et benefice reel.
            </p>
            <p>
              Le calcul de marge pizzeria exige donc une rigueur particuliere. Il faut suivre
              non seulement le food cost classique, mais aussi le mix canal (sur place / click & collect
              / livraison plateforme / livraison propre), la productivite du pizzaiolo et le cout
              energetique du four (bois vs electrique vs gaz). Sans logiciel dedie, c'est une
              gageure operationnelle.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Une pizzeria qui passe de 60 % a 40 % de ventes
              en livraison plateforme (en developpant le click & collect) recupere mecaniquement
              5 a 7 points de marge nette annuelle. Sur un CA de 350 000 EUR, c'est 17 500 a
              24 500 EUR de benefice supplementaire.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Food cost cible ═════════════ */}
        <section id="food-cost" className="mb-16">
          <SectionHeading icon={<Percent className="w-6 h-6" />} number="2">
            Food cost cible : 22-25 %, le plus bas du marche
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le food cost (ou ratio matieres) d'une pizzeria doit se situer entre 22 % et 25 %.
              C'est la fourchette la plus basse de toute la restauration commerciale. Pour
              comparaison, un bistrot vise 28-33 %, un restaurant traditionnel 30-35 %, un
              gastronomique 30-40 %.
            </p>
            <p>
              Cette specificite s'explique par trois facteurs :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Ingredients peu couteux</strong> : 1 kg de farine T45 coute 1,00-1,40 EUR,
                1 kg de mozzarella fior di latte 7-10 EUR, 1 kg de tomate San Marzano 3-5 EUR.
                Le ratio prix/poids fini est exceptionnel.
              </li>
              <li>
                <strong>Faible variabilite des grammages</strong> : une pizza standard pese 290-330 g
                tous composants confondus. Pas de portions individuelles a calibrer comme pour un
                steak ou un poisson.
              </li>
              <li>
                <strong>Prix de vente psychologique eleve</strong> : le consommateur accepte de
                payer 12-18 EUR une pizza qui coute 3 EUR a produire. C'est culturel et historique.
              </li>
            </ul>
            <p className="mt-4">
              Mais attention : un food cost trop bas (sous 20 %) peut etre un signal d'alerte. Soit
              les portions sont trop chiches (insatisfaction client, churn rapide), soit le prix de
              vente est sur-positionne par rapport a la concurrence locale (perte de volume).
              Le sweet spot est entre 22 et 25 % pour conjuguer satisfaction client et rentabilite.
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
              label="Marge nette apres livraison"
              value="3 - 8 %"
              note="Si > 40 % du CA en plateforme"
              color="amber"
            />
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Decomposition cout ═════════════ */}
        <section id="decomposition" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            Decomposition cout d'une pizza margherita
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons l'exemple de reference : la pizza margherita napolitaine. Format 30 cm,
              poids fini 300 g environ. Voici la decomposition precise des couts matieres,
              en distinguant version standard (mozzarella fior di latte) et version premium
              (mozzarella di bufala).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Cout matieres pizza margherita</h3>
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
                  <td className="py-2 px-3 font-medium">Pate (farine + eau + levure + sel + huile)</td>
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
                  <td className="py-3 px-3 font-bold text-mono-100">Total cout matieres</td>
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
              recette pour cibler la meme zone de food cost et faciliter le pilotage.
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
              Tableau de reference : 8 recettes de pizza couvrant les classiques italiens et les
              creations modernes. Couts matieres bases sur les prix Metro France T2 2026, prix
              de vente moyens constates en France hors zones premium (Paris, Cote d'Azur).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Pizza</th>
                  <th className="text-center py-3 px-4 font-semibold">Cout matieres</th>
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
                  { name: 'Vegetarienne (legumes grilles)', cm: '3,20 EUR', pv: '13,50 EUR', fc: '24 %', mb: '10,30 EUR / 76 %' },
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
              Quelques observations cles :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>La truffe est le plat d'appel</strong> qui sort du ratio cible (31 %), mais
                la marge brute en valeur absolue (15,20 EUR) est superieure. A garder en carte pour
                rehausser le ticket moyen et donner du prestige.
              </li>
              <li>
                <strong>La margherita standard</strong> est le meilleur ratio (23 %) et reste la
                plus vendue (typiquement 25-35 % des ventes d'une pizzeria). C'est votre vache a lait.
              </li>
              <li>
                <strong>Les calzones</strong> ont un food cost plus eleve (27 %) du fait de la double
                couche de pate et de la garniture plus dense. A facturer 1-2 EUR de plus que les
                pizzas equivalentes.
              </li>
              <li>
                <strong>La vegetarienne</strong> conserve un excellent ratio (24 %) tout en repondant
                a une demande croissante. Win-win.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Specificites operationnelles ═════════════ */}
        <section id="operationnel" className="mb-16">
          <SectionHeading icon={<Flame className="w-6 h-6" />} number="5">
            Specificites operationnelles : pate, four, pizzaiolo
          </SectionHeading>

          <div className="prose-content">
            <p>
              Au-dela du calcul matieres pur, trois variables operationnelles determinent la
              rentabilite reelle d'une pizzeria : le rendement de la pate, le type de four et
              la productivite du pizzaiolo. Ces trois leviers, mal calibres, peuvent transformer
              une carte rentable sur le papier en gouffre financier dans la realite.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Rendement de la pate</h3>
            <p>
              La regle de base : 1 kg de farine T45 ou caputo Saccorosso donne 4 a 5 patons de
              200-230 g chacun, soit 4 a 5 pizzas. La perte typique est de 5 a 8 % (pesees
              imprecises, pates abimees, restes en fin de service). Une pizzeria qui vise un
              rendement de 4,8 patons/kg de farine optimise ses achats.
            </p>
            <p>
              Cout matieres pour la pate seule : 1 kg de farine premium 1,40 EUR + 25 g levure
              0,15 EUR + 15 g sel + 30 ml huile 0,25 EUR + eau = environ 1,90 EUR de matieres
              pour 4,8 patons, soit <strong>0,40 EUR / paton</strong>.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Four a bois vs electrique vs gaz</h3>
            <p>
              Le choix du four impacte directement la marge nette. Comparaison :
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-5">
            <FourCard
              title="Four a bois"
              priceRange="8 000 - 25 000 EUR"
              dailyCost="35 - 70 EUR/jour"
              pros="Produit premium, prix de vente +20-30 %, image authentique"
              cons="Pizzaiolo qualifie obligatoire, courbe d'apprentissage, normes ERP"
            />
            <FourCard
              title="Four electrique"
              priceRange="4 000 - 12 000 EUR"
              dailyCost="20 - 45 EUR/jour"
              pros="Simple a operer, regularite parfaite, faible maintenance"
              cons="Cuisson moins typique, justification prix premium difficile"
            />
            <FourCard
              title="Four gaz"
              priceRange="3 500 - 10 000 EUR"
              dailyCost="15 - 35 EUR/jour"
              pros="Cout faible, montee en temperature rapide, polyvalent"
              cons="Cuisson intermediaire, dependance prix du gaz, alimentation gaz necessaire"
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Productivite du pizzaiolo</h3>
            <p>
              Un pizzaiolo experimente peut produire 60 a 100 pizzas par heure en pleine bourre
              (rush 12h-14h et 19h-22h), avec un pic a 120-140 pizzas/heure dans les grosses
              structures equipees de fours a 6 sources. En moyenne sur un service complet
              incluant les temps morts, on compte 40 a 60 pizzas/heure.
            </p>
            <p>
              Cout employeur pizzaiolo en CDI HCR : 1 800 a 2 800 EUR brut/mois selon experience,
              soit 2 500 a 3 800 EUR cout total employeur incluant charges patronales, primes de
              coupure et heures de nuit. C'est le poste #2 apres le loyer. Une pizzeria qui peine
              a recruter (et c'est le cas de 70 % des etablissements en 2026) doit absolument
              automatiser tout ce qui peut l'etre : prise de commande, paiement, gestion stocks.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Piege livraison ═════════════ */}
        <section id="livraison" className="mb-16">
          <SectionHeading icon={<Truck className="w-6 h-6" />} number="6">
            Le piege mortel des plateformes de livraison
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est le sujet qui tue silencieusement les pizzerias francaises depuis 2019. Uber Eats,
              Deliveroo et Just Eat ponctionnent entre <strong>25 % et 32 % de commission</strong> sur
              chaque commande. Calculons l'impact reel sur une pizza margherita vendue 14 EUR TTC
              en livraison.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-red-900 mb-4 text-lg">Cas concret : pizza margherita 14 EUR sur Uber Eats (commission 30 %)</h3>
            <table className="w-full text-sm border-collapse">
              <tbody className="text-red-900">
                <tr>
                  <td className="py-2 px-3 font-medium">Prix vente affiche TTC</td>
                  <td className="py-2 px-3 text-right font-semibold">14,00 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">- TVA 10 % (livraison emportee)</td>
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
                  <td className="py-2 px-3">- Cout matieres + emballage</td>
                  <td className="py-2 px-3 text-right">-3,30 EUR</td>
                </tr>
                <tr className="bg-white border-t-2 border-red-200">
                  <td className="py-3 px-3 font-bold">= Marge brute reelle apres commission</td>
                  <td className="py-3 px-3 text-right font-bold">5,61 EUR (44 %)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Verdict : la meme pizza qui genere 9,20 EUR de marge brute sur place (77 %) ne
              degage plus que <strong>5,61 EUR (44 %)</strong> en livraison plateforme. C'est une
              perte de 39 % de la marge unitaire. Une pizzeria qui realise 60 % de son CA en
              livraison voit donc sa marge brute pondaree chuter de 75 % a environ 57 %.
            </p>
            <p>
              Et la marge nette ? Apres deduction du personnel (30-40 % du CA), du loyer (8-12 %),
              de l'energie (4-6 %) et des autres charges, il ne reste plus que <strong>2 a 5 %</strong>
              de marge nette dans le pire scenario. Soit le double du seuil de mortalite des
              etablissements.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">3 strategies pour limiter la casse</h3>
            <div className="space-y-4 mt-6">
              <StrategieCard
                number={1}
                title="Prix differencie par canal"
                desc="Appliquer +15 a 20 % de prix sur Uber Eats / Deliveroo. La pizza margherita vendue 12 EUR sur place passe a 14,50 EUR en livraison plateforme. Le client accepte ce surplus comme un prix de la commodite. Resultat : la marge brute apres commission remonte a 60-65 %."
              />
              <StrategieCard
                number={2}
                title="Pousser le click & collect"
                desc="Mettre en place un systeme de commande en ligne (RestauMargin propose un module integre) et offrir -1 EUR sur la pizza si retrait en pizzeria. Zero commission plateforme, marge brute preservee a 77 %. Cibler 25-35 % du CA en click & collect en 6 mois."
              />
              <StrategieCard
                number={3}
                title="Livraison propre sur zone restreinte"
                desc="Recruter 1-2 livreurs en CDI temps partiel (cout 1 200-1 800 EUR/mois) pour assurer la livraison dans un rayon de 3 km. Rentable au-dela de 30-40 livraisons/jour. Marge brute preservee a 70-72 % apres deduction cout livreur."
              />
            </div>

            <Callout type="warning">
              <strong>Piege a eviter :</strong> ne pas s'inscrire sur les plateformes "pour tester".
              Sans strategie de prix differencie ni gestion du mix canal, vous detruisez votre
              marge sans vous en rendre compte. Le logiciel RestauMargin alerte automatiquement
              quand le ratio livraison plateforme depasse le seuil critique.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : KPI pizzeria ═════════════ */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="7">
            Les 6 KPI a suivre en pizzeria
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une pizzeria bien geree pilote 6 indicateurs au quotidien. Sans ces KPI, vous
              naviguez a l'aveugle et detectez les problemes trop tard (3-6 mois apres leur
              apparition, quand la marge nette commence a fondre).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Percent className="w-5 h-5" />, title: '1. Food cost global', desc: 'Cible 22-25 %. Au-dela, alerte immediate. En dessous, verifier que les portions ne sont pas chiches.' },
              { icon: <Pizza className="w-5 h-5" />, title: '2. Pizzas par service', desc: 'Objectif 80-150 pizzas/service selon taille. Indicateur de productivite et de remplissage.' },
              { icon: <DollarSign className="w-5 h-5" />, title: '3. Ticket moyen', desc: 'Sur place : 16-25 EUR par couvert. En livraison : 22-35 EUR par commande. Suivre par canal.' },
              { icon: <Truck className="w-5 h-5" />, title: '4. Ratio livraison vs sur place', desc: 'Maintenir sous 40 % pour preserver la marge nette. Alerte des que > 50 %.' },
              { icon: <Clock className="w-5 h-5" />, title: '5. Productivite pizzaiolo', desc: '40-60 pizzas/heure en moyenne, 80-100 en rush. Si < 30, probleme de four ou d\'organisation.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: '6. Marge brute par pizza', desc: 'Suivre les variations matieres premieres (farine, mozzarella) qui erodent la marge.' },
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
            Cas concret : pizzeria Lyon, 8 % a 24 % en 9 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Pizzeria familiale Lyon 7eme arrondissement, 90 couverts. Reprise en septembre 2025
              par Marco D., 38 ans, ancien chef de cuisine. CA annuel constate a la reprise :
              280 000 EUR, marge nette 8 %.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Diagnostic initial (mois 1)</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Food cost reel : 32 % (vs cible 24 %). Portions non standardisees, gaspillage 6 %.</li>
              <li>Ratio livraison : 65 % du CA via Uber Eats + Deliveroo. Commission moyenne 28 %.</li>
              <li>Aucun suivi prix fournisseurs : factures Metro entrees a la main 1 fois/trimestre.</li>
              <li>Carte sur-etendue : 38 pizzas + 12 pates + 8 desserts. Pizzaiolo perdu, productivite 28 pizzas/heure.</li>
              <li>Pas de click & collect. Pas de site web. Pas de strategie reseaux sociaux.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Plan d'action en 4 phases</h3>
            <div className="space-y-4 mt-6">
              <PhaseCard
                phase="Phase 1 (mois 1-2)"
                title="Stabilisation du food cost"
                actions={[
                  'Mise en place de fiches techniques precises pour les 38 pizzas via RestauMargin',
                  'Pesee systematique des portions (balance comptoir + tablette)',
                  'Reduction carte a 22 pizzas core + 4 saisonnieres',
                  'Resultat : food cost passe de 32 % a 26 %',
                ]}
              />
              <PhaseCard
                phase="Phase 2 (mois 3-4)"
                title="Strategie multi-canal"
                actions={[
                  'Lancement click & collect via site web RestauMargin',
                  'Prix differencie : +18 % sur Uber Eats / Deliveroo',
                  'Campagne flyers locaux pour pousser le click & collect (-1 EUR)',
                  'Resultat : ratio livraison plateforme tombe de 65 % a 42 %',
                ]}
              />
              <PhaseCard
                phase="Phase 3 (mois 5-7)"
                title="Optimisation operationnelle"
                actions={[
                  'Recrutement aide-pizzaiolo pour pre-preparation patons',
                  'Investissement four a 4 sources (8 200 EUR)',
                  'Mise en place scan factures OCR via RestauMargin',
                  'Resultat : productivite 28 a 52 pizzas/heure, food cost a 24 %',
                ]}
              />
              <PhaseCard
                phase="Phase 4 (mois 8-9)"
                title="Pilotage en temps reel"
                actions={[
                  'Tableau de bord RestauMargin verifie 2x/semaine (lundi + jeudi)',
                  'Alertes prix fournisseurs activees sur farine, mozzarella, tomate',
                  'Ajustement carte trimestriel selon menu engineering',
                  'Resultat final : marge nette 24 %',
                ]}
              />
            </div>

            <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-emerald-900 text-lg">Resultats apres 9 mois</h3>
              </div>
              <ul className="space-y-2 text-emerald-800 text-sm">
                <li><strong>CA annuel :</strong> 280 000 EUR -- 365 000 EUR (+30 %)</li>
                <li><strong>Food cost :</strong> 32 % -- 24 %</li>
                <li><strong>Marge nette :</strong> 8 % -- 24 % (soit 22 400 EUR -- 87 600 EUR)</li>
                <li><strong>Ratio livraison plateforme :</strong> 65 % -- 38 %</li>
                <li><strong>Productivite pizzaiolo :</strong> 28 pizzas/h -- 52 pizzas/h</li>
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
              RestauMargin est concu pour la realite operationnelle d'une pizzeria : multi-canal,
              forte rotation, pression sur les marges. Voici les 6 modules cles qui vous font
              gagner 8 a 15 heures par mois et 5 a 10 points de marge nette.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Pizza className="w-5 h-5" />, title: 'Fiches techniques pizza', desc: 'Creez vos recettes avec grammages precis (pate, sauce, fromage, garniture). Food cost calcule automatiquement.' },
              { icon: <Truck className="w-5 h-5" />, title: 'Grille tarifaire multi-canal', desc: 'Definissez vos prix par canal : sur place / click & collect / Uber Eats / Deliveroo. Marge nette calculee en temps reel.' },
              { icon: <AlertTriangle className="w-5 h-5" />, title: 'Alertes deviation marge', desc: 'Recevez une notification des qu\'une pizza passe sous le seuil de marge cible ou qu\'un prix fournisseur augmente.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Dashboard pizzeria', desc: '6 KPI cles affiches en temps reel : food cost, ratio livraison, ticket moyen, productivite, marge brute, marge nette.' },
              { icon: <Lightbulb className="w-5 h-5" />, title: 'Scan factures OCR', desc: 'Photographiez vos factures Metro, Pomodoro, Eurochef. Les prix farine/tomate/mozzarella se mettent a jour automatiquement.' },
              { icon: <Users className="w-5 h-5" />, title: 'Click & collect integre', desc: 'Site web de commande clef en main inclus. Zero commission. Compatible avec votre tablette comptoir.' },
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
              Plus de 80 pizzerias en France utilisent deja RestauMargin pour piloter leur
              rentabilite. Gain moyen constate : <strong>5,8 points de marge brute en 6 mois</strong>,
              principalement grace aux alertes prix et a l'optimisation du mix canal. Pour aller
              plus loin, lisez notre guide complet sur <Link to="/blog/livraison-restaurant-rentabilite" className="text-teal-700 underline hover:text-teal-800">la rentabilite de la livraison en restauration</Link> ou
              testez le <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes pizzeria</h2>
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
              Food cost, prix multi-canaux, alertes plateforme, KPI temps reel : tout ce qu'il
              faut pour garder une marge nette superieure a 15 %.
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
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le food cost en 10 strategies</h3>
              <p className="text-xs text-mono-500">Fiches techniques, negociation, gaspillage, menu engineering.</p>
            </Link>
            <Link to="/blog/livraison-restaurant-rentabilite" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Livraison restaurant : rentabilite reelle</h3>
              <p className="text-xs text-mono-500">Commissions, marges, strategies multi-canal.</p>
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
          <span className="font-semibold text-mono-500">Cout energie :</span>
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
