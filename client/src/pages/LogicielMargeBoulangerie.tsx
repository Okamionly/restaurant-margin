import { Link } from 'react-router-dom';
import {
  ChefHat,
  TrendingUp,
  Calculator,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  BarChart3,
  DollarSign,
  Percent,
  Target,
  BookOpen,
  Lightbulb,
  Wheat,
  Flame,
  Croissant,
  Cookie,
  Cake,
  Sparkles,
  ListChecks,
  Award,
  Clock,
  Zap,
  PiggyBank,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO — "Logiciel de marge pour boulangerie patisserie"
   Mots-cles : logiciel marge boulangerie, food cost patisserie,
               calcul marge pain, rendement farine
   ~2 800 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost ideal pour une boulangerie patisserie ?',
    answer:
      "Le food cost cible d'une boulangerie patisserie se situe entre 25 % et 30 %. La boulangerie pure (pains de tradition, baguettes, viennoiseries) tourne autour de 22-28 %, tandis que la patisserie fine (entremets, macarons, mille-feuilles) accepte 28-35 % du fait du cout eleve du beurre, des oeufs et du chocolat. La marge brute cible se situe donc entre 65 % et 78 %, sachant que les invendus et la casse peuvent ronger 5-8 points.",
  },
  {
    question: 'Comment calculer le rendement de la farine en boulangerie ?',
    answer:
      "1 kg de farine T65 produit environ 1,3 kg de pain cuit grace a l'hydratation (60-65 % d'eau). La perte poids depend du temps de cuisson : une baguette tradition perd 18-22 % de son poids en eau pendant la cuisson. Formule simplifiee : poids pain cuit = (poids farine + poids eau) x (1 - taux d'evaporation). RestauMargin integre automatiquement ces rendements dans vos fiches techniques.",
  },
  {
    question: "Quel est le coefficient multiplicateur typique d'une boulangerie ?",
    answer:
      "Le coefficient multiplicateur en boulangerie varie de 3 a 4 selon le type de produit. Une baguette tradition vendue 1,20 EUR coute environ 0,30 EUR en matieres premieres (coefficient ~4). Un croissant beurre AOP vendu 1,40 EUR coute 0,45 EUR (coefficient ~3,1). Les patisseries fines (entremets, mille-feuilles) sont plus proches de 2,8-3,5 du fait du cout des matieres nobles.",
  },
  {
    question: "Comment integrer le cout de l'energie du four dans le calcul ?",
    answer:
      "L'energie represente 3 a 7 % du chiffre d'affaires d'une boulangerie. Pour une integration precise, calculez : (kWh consommes par fournee) x (prix kWh) / (nombre de pains par fournee) = cout energie par unite. Un four a sole de 12 m2 consomme environ 4-6 kWh par heure de production. RestauMargin propose un module de cout indirect qui ventile automatiquement l'energie sur chaque fiche technique.",
  },
  {
    question: 'Comment gerer la volatilite du prix du beurre en patisserie ?',
    answer:
      "Le beurre est le poste le plus volatil : prix entre 5 et 11 EUR/kg sur 2023-2026 (variation 120 %). Strategies : (1) Contractualiser avec une laiterie sur 6 mois, (2) Ajuster vos prix de vente patisserie tous les trimestres, (3) Utiliser un beurre concentre 99,8 % MG (rendement +5 %), (4) Activer les alertes prix dans RestauMargin pour declencher une revision auto de la fiche technique.",
  },
  {
    question: 'Quel taux de pertes et invendus tolerer en boulangerie ?',
    answer:
      "Le taux d'invendus moyen en boulangerie francaise est de 8 a 12 % du chiffre d'affaires en valeur. Une boulangerie bien gerie reste sous 5 %. Solutions : (1) Loi Garot 2016 (don associations defiscalise 60 %), (2) Vente flash -50 % en fin de journee, (3) Recyclage en chapelure ou pain perdu, (4) Application TooGoodToGo (panier surprise 3-5 EUR). RestauMargin trace ces invendus et calcule l'impact reel sur votre marge nette.",
  },
  {
    question: 'Comment integrer la majoration de nuit dans le cout main-d\'oeuvre ?',
    answer:
      "La majoration legale boulangerie pour le travail de nuit (21h-6h) est de 20 % minimum sur le taux horaire de base (convention collective IDCC 0843). Pour un boulanger paye 14 EUR/heure brut, le cout horaire de nuit avec charges patronales atteint 22-24 EUR. Sur une fournee de 8 heures (2h-10h), c'est environ 180 EUR de main-d'oeuvre a ventiler sur la production. RestauMargin calcule ce cout par produit selon le temps de fabrication.",
  },
  {
    question: 'Faut-il differencier farine bio et farine conventionnelle dans les calculs ?',
    answer:
      "Oui imperativement. La farine T65 conventionnelle coute 0,55-0,80 EUR/kg, tandis que la T65 bio Demeter atteint 1,20-1,80 EUR/kg (+ 100 %). Cette difference impacte directement le coefficient multiplicateur. Une baguette tradition bio doit etre vendue 1,80 EUR pour conserver une marge equivalente (vs 1,20 EUR conventionnelle). RestauMargin permet de creer des variantes bio/non-bio sur une meme recette avec calcul automatique de l'impact marge.",
  },
  {
    question: 'Quel logiciel pour calculer la marge d\'une boulangerie patisserie ?',
    answer:
      "RestauMargin est specialise dans le calcul de marge pour boulangeries et patisseries : gestion des rendements farine, calcul du cout four/heure, suivi de la volatilite beurre/oeufs, ventilation main-d'oeuvre de nuit avec majoration, alertes de seuil sur invendus. Essai gratuit 7 jours sans CB.",
  },
  {
    question: 'Comment passer de 8 % a 18 % de marge nette en boulangerie ?',
    answer:
      "Cas concret d'une boulangerie 450 000 EUR de CA : (1) Pesee systematique pates et garnitures = +3 points food cost, (2) Renegociation contrat farine annuel = -8 % cout matiere, (3) Reduction invendus de 12 % a 4 % via don associations + flash sales = +4 points marge, (4) Snacking midi (sandwichs, pizzas) = +30 % CA sur les memes charges fixes, (5) Augmentation 0,10 EUR sur viennoiseries = +18 000 EUR/an. Total : passage 8 % a 18 % en 6 mois.",
  },
];

export default function LogicielMargeBoulangerie() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel marge boulangerie | Food cost patisserie | RestauMargin"
        description="Logiciel de calcul de marge pour boulangeries et patisseries. Cout matiere, prix de vente, rendement farine. Essai gratuit 7 jours."
        path="/logiciel-marge-boulangerie"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            {
              name: 'Logiciel marge boulangerie patisserie',
              url: 'https://www.restaumargin.fr/logiciel-marge-boulangerie',
            },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline:
              'Logiciel de marge pour boulangerie patisserie : calculez vos couts en 2026',
            description:
              "Guide complet du calcul de marge pour boulangeries patisseries : food cost, rendement farine, energie four, main-d'oeuvre nuit. Exemples chiffres et logiciel dedie.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: {
              '@type': 'Organization',
              name: 'RestauMargin',
              url: 'https://www.restaumargin.fr',
            },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.restaumargin.fr/icon-512.png',
              },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 2800,
            inLanguage: 'fr-FR',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.restaumargin.fr/logiciel-marge-boulangerie',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin Boulangerie',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web, iOS, Android',
            description:
              'Logiciel de calcul de marge dedie aux boulangeries et patisseries. Gestion des rendements farine, cout four, main-d\'oeuvre de nuit, invendus.',
            offers: {
              '@type': 'Offer',
              price: '29',
              priceCurrency: 'EUR',
              priceValidUntil: '2026-12-31',
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
          <Link to="/logiciel-marge-restaurant" className="hover:text-teal-600">Logiciels</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge boulangerie patisserie</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Boulangerie"
        readTime="14 min"
        date="Mai 2026"
        title="Logiciel de marge pour boulangerie patisserie : calculez vos couts en 2026"
        accentWord="boulangerie patisserie"
        subtitle="Le seul logiciel SaaS francais dedie aux boulangeries et patisseries. Calcul de marge, rendement farine, ventilation cout four et majoration nuit. Essai gratuit 7 jours sans carte bancaire."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="14 min" variant="header" />

        {/* ── Encadre formule rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Formules cles boulangerie patisserie</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les 4 formules essentielles boulangerie
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">1.</span>
              <span><strong className="text-white">Rendement farine</strong> = Poids pain cuit / Poids farine (cible 1,25 - 1,35)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">2.</span>
              <span><strong className="text-white">Cout pate / kg</strong> = (Farine + Eau + Sel + Levure) / Poids total pate</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">3.</span>
              <span><strong className="text-white">Food cost boulangerie</strong> = Cout matieres / Prix de vente HT x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">4.</span>
              <span><strong className="text-white">Coefficient multiplicateur</strong> = 3,0 a 4,0 (cible boulangerie)</span>
            </div>
          </div>
          <p className="mt-4 text-amber-100 text-sm">
            Objectif standard boulangerie patisserie : food cost entre 25 % et 30 %, marge brute entre 70 % et 75 %, marge nette entre 8 % et 18 %.
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
              { href: '#specificites', label: 'Specificites du calcul de marge en boulangerie patisserie' },
              { href: '#couts', label: 'Couts specifiques : farine, beurre, energie, main-d\'oeuvre nuit' },
              { href: '#formules', label: 'Formules cles : pate, rendement farine, coefficient' },
              { href: '#exemples', label: 'Exemples chiffres : baguette, croissant, mille-feuille, macaron' },
              { href: '#kpi', label: 'KPI quotidiens : invendus, casse, taux de retour' },
              { href: '#optimisation', label: 'Optimisation : invendus, snacking, second-day pricing' },
              { href: '#cas', label: 'Cas concret : de 8 % a 18 % de marge nette en 6 mois' },
              { href: '#faq', label: 'Questions frequentes' },
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

        {/* ═════════════ SECTION 1 : Introduction ═════════════ */}
        <section id="specificites" className="mb-16">
          <SectionHeading icon={<Wheat className="w-6 h-6" />} number="1">
            Specificites du calcul de marge en boulangerie patisserie
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le calcul de marge en boulangerie patisserie obeit a des regles tres differentes
              de celles d'un restaurant traditionnel. La ou un bistrot doit gerer 30 plats avec
              une variabilite de portions, le boulanger doit piloter 80 a 150 references dont
              chacune a son propre rendement, son cout energetique et sa duree de conservation.
              Selon la Confederation Nationale de la Boulangerie-Patisserie Francaise, pres de
              35 000 boulangeries operent en France en 2026, et 22 % d'entre elles affichent une
              marge nette inferieure a 5 % — souvent par defaut d'un suivi rigoureux.
            </p>
            <p>
              Quatre specificites rendent le calcul de marge boulangerie patisserie unique :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-3">
              <li>
                <strong>Le rendement farine</strong> : 1 kg de farine ne produit pas 1 kg de pain,
                mais entre 1,25 et 1,35 kg apres incorporation d'eau et evaporation a la cuisson.
              </li>
              <li>
                <strong>L'energie du four</strong> : 3 a 7 % du chiffre d'affaires, a ventiler
                produit par produit selon le temps de cuisson.
              </li>
              <li>
                <strong>La main-d'oeuvre de nuit</strong> : majoration legale de 20 % minimum
                pour les heures 21h-6h, qui represente 60-80 % du temps de production.
              </li>
              <li>
                <strong>Les invendus quotidiens</strong> : 8 a 12 % du CA en moyenne, qui doivent
                etre integres au cout reel et non comme une simple perte.
              </li>
            </ul>

            <Callout type="info">
              <strong>Cible food cost boulangerie patisserie :</strong> 25 % a 30 %, soit 70 % a 75 %
              de marge brute. La patisserie fine accepte 28-35 % du fait du cout matieres nobles
              (beurre AOP, oeufs Label Rouge, chocolat Valrhona).
            </Callout>

            <p>
              En 2026, la pression est inedite : le prix du beurre a grimpe de 60 % depuis 2023,
              le prix de la farine de 22 %, et l'energie reste 40 % au-dessus de son niveau pre-crise.
              Sans logiciel dedie, un boulanger met 6-10 heures par semaine a maintenir ses fiches
              techniques a jour — temps perdu sur la production et le commerce.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Couts specifiques ═════════════ */}
        <section id="couts" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="2">
            Couts specifiques : farine, beurre, energie, main-d'oeuvre nuit
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les quatre postes de cout qui font la difference entre une boulangerie rentable
              et une boulangerie qui s'epuise. Maitriser leur evolution et leur impact sur la marge
              est la cle d'une gestion serieuse en 2026.
            </p>
          </div>

          {/* Sous-section : Farine */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-4 flex items-center gap-2">
              <Wheat className="w-5 h-5 text-amber-600" />
              La farine : T55, T65, T80 — conventionnelle vs bio
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type de farine</th>
                    <th className="text-right py-3 px-4 font-semibold">Prix conventionnel</th>
                    <th className="text-right py-3 px-4 font-semibold">Prix bio</th>
                    <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Usage principal</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">T45 (gruau)</td><td className="py-3 px-4 text-right">0,75 EUR/kg</td><td className="py-3 px-4 text-right">1,55 EUR/kg</td><td className="py-3 px-4 text-right">Viennoiserie, brioche</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">T55 (blanche)</td><td className="py-3 px-4 text-right">0,55 EUR/kg</td><td className="py-3 px-4 text-right">1,20 EUR/kg</td><td className="py-3 px-4 text-right">Patisserie, pizza</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">T65 (tradition)</td><td className="py-3 px-4 text-right">0,60 EUR/kg</td><td className="py-3 px-4 text-right">1,35 EUR/kg</td><td className="py-3 px-4 text-right">Baguette tradition</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">T80 (bise)</td><td className="py-3 px-4 text-right">0,75 EUR/kg</td><td className="py-3 px-4 text-right">1,60 EUR/kg</td><td className="py-3 px-4 text-right">Pain de campagne</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">T110 (semi-complete)</td><td className="py-3 px-4 text-right">0,90 EUR/kg</td><td className="py-3 px-4 text-right">1,80 EUR/kg</td><td className="py-3 px-4 text-right">Pain complet</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">T150 (integrale)</td><td className="py-3 px-4 text-right">1,05 EUR/kg</td><td className="py-3 px-4 text-right">2,10 EUR/kg</td><td className="py-3 px-4 text-right">Pain integral</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-mono-400">
              Source : moyenne des prix farine 2026 negociee par sac 25 kg chez Grands Moulins de Paris,
              Minoterie Suire, Moulins Soufflet. Bio = certification Demeter ou AB.
            </p>
          </div>

          {/* Sous-section : autres matieres */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-mono-100 mb-4 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-amber-600" />
              Levure, beurre, sucre, oeufs : la volatilite 2026
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                {
                  nom: 'Beurre AOP Charentes-Poitou',
                  prix: '9,80 EUR/kg',
                  evolution: '+62 % vs 2023',
                  note: 'Volatilite extreme. Privilegier contrat 6 mois.',
                  color: 'red',
                },
                {
                  nom: 'Beurre standard 82 % MG',
                  prix: '7,20 EUR/kg',
                  evolution: '+48 % vs 2023',
                  note: 'Alternative AOP pour viennoiseries standards.',
                  color: 'amber',
                },
                {
                  nom: 'Sucre semoule blanc',
                  prix: '1,40 EUR/kg',
                  evolution: '+38 % vs 2023',
                  note: 'Stocker par sacs 25 kg pour optimiser le prix.',
                  color: 'amber',
                },
                {
                  nom: 'Oeufs Label Rouge (calibre 53-63 g)',
                  prix: '0,28 EUR / oeuf',
                  evolution: '+45 % vs 2023',
                  note: 'Crise grippe aviaire 2024. Calibre L moins cher.',
                  color: 'red',
                },
                {
                  nom: 'Levure fraiche pressee',
                  prix: '5,80 EUR/kg',
                  evolution: '+12 % vs 2023',
                  note: 'Conserver au frais. Duree de vie 21 jours.',
                  color: 'emerald',
                },
                {
                  nom: 'Chocolat couverture 70 %',
                  prix: '14,50 EUR/kg',
                  evolution: '+85 % vs 2023',
                  note: 'Cacao en crise (cote Ivoire, Ghana). Stocker.',
                  color: 'red',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-amber-300 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-mono-100">{item.nom}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      item.color === 'red' ? 'bg-red-100 text-red-700' :
                      item.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.evolution}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-amber-700 mb-2">{item.prix}</div>
                  <p className="text-sm text-mono-400 leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sous-section : energie */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-mono-100 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              L'energie four : 3 a 7 % du chiffre d'affaires
            </h3>
            <div className="prose-content">
              <p>
                Un four a sole de 12 m2 consomme entre 40 et 60 kWh par jour (8 heures de
                production). Au prix moyen de 0,18 EUR/kWh en tarif pro 2026, c'est 7 a 11 EUR
                par jour, soit 200 a 330 EUR par mois rien que pour la cuisson. Pour une boulangerie
                a 35 000 EUR de CA mensuel, l'energie represente 0,6 a 1 % du CA — bien sous-evaluee.
              </p>
              <p>
                Au total, en incluant petrins, refrigerateurs, chambres de pousse et eclairage,
                l'energie monte a 3-7 % du CA selon la taille de l'atelier. La methode de calcul
                rigoureuse :
              </p>
              <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 mt-4 font-mono text-sm">
                <div className="text-mono-100 mb-2 font-bold">Cout energie par fournee :</div>
                <div className="text-mono-400">= kWh consommes x prix kWh</div>
                <div className="text-mono-400">= 5 kWh x 0,18 EUR = <span className="text-orange-600 font-bold">0,90 EUR / fournee</span></div>
                <div className="text-mono-100 mt-3 mb-2 font-bold">Cout energie par baguette (fournee 100 baguettes) :</div>
                <div className="text-mono-400">= 0,90 EUR / 100 = <span className="text-orange-600 font-bold">0,009 EUR / baguette</span></div>
              </div>
              <p className="mt-4">
                RestauMargin integre un module de cout indirect qui ventile automatiquement
                l'energie sur chaque fiche technique selon le temps de cuisson et le type d'equipement.
              </p>
            </div>
          </div>

          {/* Sous-section : main-d'oeuvre */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-mono-100 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Main-d'oeuvre de nuit : la majoration legale 20 %
            </h3>
            <div className="prose-content">
              <p>
                Selon la convention collective Boulangerie-Patisserie Artisanale (IDCC 0843), le
                travail entre 21h et 6h ouvre droit a une majoration salariale de 20 % minimum.
                Or, en boulangerie traditionnelle, 60 a 80 % du temps de production se deroule
                entre 2h et 8h du matin.
              </p>
              <p>
                Pour un boulanger paye 14 EUR/heure brut :
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-2">
                <li>Cout horaire jour avec charges patronales (~45 %) : <strong>20,30 EUR/h</strong></li>
                <li>Cout horaire nuit (+20 %) avec charges patronales : <strong>24,40 EUR/h</strong></li>
                <li>Sur fournee 8h (2h-10h), 6h en nuit : (6 x 24,40) + (2 x 20,30) = <strong>187 EUR</strong></li>
                <li>Pour 350 baguettes produites : cout main-d'oeuvre par baguette = <strong>0,53 EUR</strong></li>
              </ul>
              <Callout type="warning">
                <strong>Erreur frequente :</strong> beaucoup de boulangers calculent leur prix de
                vente uniquement sur le cout matiere (0,30 EUR par baguette), ignorant la
                main-d'oeuvre (0,53 EUR), l'energie (0,01 EUR) et les charges fixes (loyer,
                assurances). Le cout reel d'une baguette tradition est plus proche de 0,95 EUR
                que de 0,30 EUR.
              </Callout>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Formules cles ═════════════ */}
        <section id="formules" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            Formules cles : pate, rendement farine, coefficient multiplicateur
          </SectionHeading>

          <div className="prose-content">
            <p>
              Maitriser le calcul de marge boulangerie passe par 4 formules incontournables.
              RestauMargin automatise tous ces calculs, mais il est essentiel de les comprendre
              pour piloter intelligemment votre activite.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <FormulaCard
              title="Cout pate / kg"
              icon={<Wheat className="w-5 h-5" />}
              formula="(Cout farine + eau + sel + levure + ameliorant) / Poids total pate"
              exemple="Pour 10 kg de pate baguette tradition : (10 x 0,60 + eau gratuite + 0,20 sel + 5 x 5,80 / 1000 x 200 + 0,10 ameliorant) / 16,5 kg pate = 6,30 / 16,5 = 0,38 EUR/kg pate"
              color="amber"
            />
            <FormulaCard
              title="Rendement farine"
              icon={<TrendingUp className="w-5 h-5" />}
              formula="Poids pain cuit / Poids farine"
              exemple="10 kg farine + 6,5 kg eau = 16,5 kg pate. Apres cuisson (perte 20 % evaporation) = 13,2 kg pain cuit. Rendement = 13,2 / 10 = 1,32. Soit 1 kg farine = 1,32 kg pain"
              color="emerald"
            />
            <FormulaCard
              title="Marge unitaire baguette"
              icon={<DollarSign className="w-5 h-5" />}
              formula="Prix de vente HT - (Cout pate + Energie + Main-d'oeuvre)"
              exemple="Baguette tradition vendue 1,30 EUR TTC (TVA 5,5 % = 1,23 EUR HT). Cout reel = 0,30 matiere + 0,01 energie + 0,53 main-d'oeuvre = 0,84 EUR. Marge = 1,23 - 0,84 = 0,39 EUR (32 % de marge)"
              color="emerald"
            />
            <FormulaCard
              title="Coefficient multiplicateur boulangerie"
              icon={<Percent className="w-5 h-5" />}
              formula="Prix de vente HT / Cout matiere"
              exemple="Baguette tradition : 1,23 EUR / 0,30 EUR = 4,1. Croissant beurre : 1,33 EUR / 0,45 EUR = 2,96. Mille-feuille : 4,50 EUR / 1,40 EUR = 3,21. Macaron : 1,90 EUR / 0,55 EUR = 3,45"
              color="amber"
            />
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Exemples chiffres ═════════════ */}
        <section id="exemples" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            Exemples chiffres : baguette, croissant, mille-feuille, macaron
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici 4 cas pratiques detailles, qui couvrent les principales categories d'une
              boulangerie patisserie moderne. Tous les calculs sont en HT (TVA 5,5 % en
              boulangerie sur place et a emporter).
            </p>
          </div>

          {/* Cas 1 : Baguette tradition */}
          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg flex items-center gap-2">
              <Wheat className="w-5 h-5 text-amber-600" />
              Baguette tradition (vendue 1,30 EUR TTC = 1,23 EUR HT)
            </h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Poste</th>
                  <th className="text-right py-2 px-3 font-semibold">Quantite</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix unitaire</th>
                  <th className="text-right py-2 px-3 font-semibold">Cout</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Farine T65 tradition</td><td className="py-2 px-3 text-right">230 g</td><td className="py-2 px-3 text-right">0,60 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,138 EUR</td></tr>
                <tr><td className="py-2 px-3">Eau (~65 % hydratation)</td><td className="py-2 px-3 text-right">150 ml</td><td className="py-2 px-3 text-right">gratuite</td><td className="py-2 px-3 text-right font-medium">0,001 EUR</td></tr>
                <tr><td className="py-2 px-3">Sel marin de Guerande</td><td className="py-2 px-3 text-right">4,5 g</td><td className="py-2 px-3 text-right">0,80 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,004 EUR</td></tr>
                <tr><td className="py-2 px-3">Levure fraiche</td><td className="py-2 px-3 text-right">3 g</td><td className="py-2 px-3 text-right">5,80 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,017 EUR</td></tr>
                <tr><td className="py-2 px-3">Energie four (cuisson 22 min)</td><td className="py-2 px-3 text-right">0,05 kWh</td><td className="py-2 px-3 text-right">0,18 EUR/kWh</td><td className="py-2 px-3 text-right font-medium">0,009 EUR</td></tr>
                <tr><td className="py-2 px-3">Main-d'oeuvre (5 min/baguette)</td><td className="py-2 px-3 text-right">5 min</td><td className="py-2 px-3 text-right">24,4 EUR/h</td><td className="py-2 px-3 text-right font-medium">0,200 EUR</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total cout reel</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">0,369 EUR</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-3 font-bold text-emerald-900">Marge brute (1,23 - 0,369)</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-emerald-900">0,861 EUR (70 %)</td></tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm text-mono-400">
              Coefficient multiplicateur : 1,23 / 0,369 = <strong>3,33</strong>. Conforme aux standards
              boulangerie. Marge brute de 70 % qui doit absorber loyer, charges fixes et amortissements.
            </p>
          </div>

          {/* Cas 2 : Croissant beurre */}
          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg flex items-center gap-2">
              <Croissant className="w-5 h-5 text-amber-600" />
              Croissant beurre AOP (vendu 1,40 EUR TTC = 1,33 EUR HT)
            </h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Poste</th>
                  <th className="text-right py-2 px-3 font-semibold">Quantite</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix unitaire</th>
                  <th className="text-right py-2 px-3 font-semibold">Cout</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Farine T45 gruau</td><td className="py-2 px-3 text-right">50 g</td><td className="py-2 px-3 text-right">0,75 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,038 EUR</td></tr>
                <tr><td className="py-2 px-3">Beurre AOP Charentes</td><td className="py-2 px-3 text-right">25 g</td><td className="py-2 px-3 text-right">9,80 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,245 EUR</td></tr>
                <tr><td className="py-2 px-3">Sucre</td><td className="py-2 px-3 text-right">5 g</td><td className="py-2 px-3 text-right">1,40 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,007 EUR</td></tr>
                <tr><td className="py-2 px-3">Lait entier</td><td className="py-2 px-3 text-right">15 ml</td><td className="py-2 px-3 text-right">1,30 EUR/L</td><td className="py-2 px-3 text-right font-medium">0,020 EUR</td></tr>
                <tr><td className="py-2 px-3">Levure fraiche + sel + dorure</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right font-medium">0,028 EUR</td></tr>
                <tr><td className="py-2 px-3">Energie four + chambre pousse</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right font-medium">0,015 EUR</td></tr>
                <tr><td className="py-2 px-3">Main-d'oeuvre (8 min/croissant)</td><td className="py-2 px-3 text-right">8 min</td><td className="py-2 px-3 text-right">24,4 EUR/h</td><td className="py-2 px-3 text-right font-medium">0,325 EUR</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total cout reel</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">0,678 EUR</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-3 font-bold text-emerald-900">Marge brute (1,33 - 0,678)</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-emerald-900">0,652 EUR (49 %)</td></tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm text-mono-400">
              Coefficient multiplicateur : 1,33 / 0,678 = <strong>1,96</strong>. Faible.
              Le croissant beurre AOP est un produit d'appel : il fidelise la clientele du
              matin mais doit etre compense par des produits a plus forte marge (cafe, sandwichs).
            </p>
          </div>

          {/* Cas 3 : Mille-feuille */}
          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg flex items-center gap-2">
              <Cake className="w-5 h-5 text-pink-600" />
              Mille-feuille classique (vendu 4,50 EUR TTC = 4,27 EUR HT)
            </h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Poste</th>
                  <th className="text-right py-2 px-3 font-semibold">Quantite</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix unitaire</th>
                  <th className="text-right py-2 px-3 font-semibold">Cout</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Pate feuilletee inversee (3 abaisses)</td><td className="py-2 px-3 text-right">90 g</td><td className="py-2 px-3 text-right">~6,50 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,585 EUR</td></tr>
                <tr><td className="py-2 px-3">Creme patissiere vanille Bourbon</td><td className="py-2 px-3 text-right">120 g</td><td className="py-2 px-3 text-right">~4,80 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,576 EUR</td></tr>
                <tr><td className="py-2 px-3">Sucre glace pour decor</td><td className="py-2 px-3 text-right">8 g</td><td className="py-2 px-3 text-right">2,10 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,017 EUR</td></tr>
                <tr><td className="py-2 px-3">Chocolat noir + glace royale</td><td className="py-2 px-3 text-right">5 g</td><td className="py-2 px-3 text-right">14,50 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,073 EUR</td></tr>
                <tr><td className="py-2 px-3">Energie cuisson feuilletage</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right font-medium">0,040 EUR</td></tr>
                <tr><td className="py-2 px-3">Main-d'oeuvre (25 min/piece)</td><td className="py-2 px-3 text-right">25 min</td><td className="py-2 px-3 text-right">24,4 EUR/h</td><td className="py-2 px-3 text-right font-medium">1,017 EUR</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total cout reel</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">2,308 EUR</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-3 font-bold text-emerald-900">Marge brute (4,27 - 2,308)</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-emerald-900">1,962 EUR (46 %)</td></tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm text-mono-400">
              Coefficient multiplicateur : 4,27 / 2,308 = <strong>1,85</strong>. La patisserie
              fine est tres dependante de la main-d'oeuvre qualifiee. Optimisation possible :
              produire par batch de 12 mille-feuilles pour reduire le cout horaire unitaire.
            </p>
          </div>

          {/* Cas 4 : Macaron */}
          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg flex items-center gap-2">
              <Cookie className="w-5 h-5 text-pink-600" />
              Macaron chocolat (vendu 1,90 EUR TTC = 1,80 EUR HT)
            </h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Poste</th>
                  <th className="text-right py-2 px-3 font-semibold">Quantite</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix unitaire</th>
                  <th className="text-right py-2 px-3 font-semibold">Cout</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Poudre d'amande</td><td className="py-2 px-3 text-right">8 g</td><td className="py-2 px-3 text-right">22 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,176 EUR</td></tr>
                <tr><td className="py-2 px-3">Sucre glace</td><td className="py-2 px-3 text-right">8 g</td><td className="py-2 px-3 text-right">2,10 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,017 EUR</td></tr>
                <tr><td className="py-2 px-3">Blanc d'oeuf (vieilli)</td><td className="py-2 px-3 text-right">6 g</td><td className="py-2 px-3 text-right">8 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,048 EUR</td></tr>
                <tr><td className="py-2 px-3">Ganache chocolat 70 %</td><td className="py-2 px-3 text-right">10 g</td><td className="py-2 px-3 text-right">12 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,120 EUR</td></tr>
                <tr><td className="py-2 px-3">Colorant + arome</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right font-medium">0,008 EUR</td></tr>
                <tr><td className="py-2 px-3">Energie (cuisson 13 min)</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right font-medium">0,005 EUR</td></tr>
                <tr><td className="py-2 px-3">Main-d'oeuvre (3 min/macaron en batch)</td><td className="py-2 px-3 text-right">3 min</td><td className="py-2 px-3 text-right">24,4 EUR/h</td><td className="py-2 px-3 text-right font-medium">0,122 EUR</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total cout reel</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">0,496 EUR</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-3 font-bold text-emerald-900">Marge brute (1,80 - 0,496)</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-emerald-900">1,304 EUR (72 %)</td></tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm text-mono-400">
              Coefficient multiplicateur : 1,80 / 0,496 = <strong>3,63</strong>. Excellent.
              Le macaron est un produit ultra-rentable une fois la production maitrisee.
              Produit-phare a pousser via vitrine et offre boite 6/12 pieces.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : KPI quotidiens ═════════════ */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="5">
            KPI quotidiens : invendus, casse, taux de retour
          </SectionHeading>

          <div className="prose-content">
            <p>
              Sans suivi quotidien, votre marge nette derive sans que vous vous en apercevez.
              Voici les 5 KPI qu'un boulanger doit tracker chaque jour avec un logiciel comme
              RestauMargin.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            {[
              {
                kpi: 'Taux d\'invendus',
                cible: '< 5 % du CA',
                formule: 'Valeur invendus / CA x 100',
                action: 'Au-dela de 8 %, ajuster les quantites produites par tranche horaire.',
              },
              {
                kpi: 'Taux de casse',
                cible: '< 1 % du CA',
                formule: 'Valeur casse / CA x 100',
                action: 'Casse > 2 % : revoir le stockage (humidite, manipulations).',
              },
              {
                kpi: 'Cout matiere reel (J/J-7)',
                cible: '< 30 % du CA',
                formule: 'Cout achats / CA x 100',
                action: 'Hausse > 2 points : verifier prix fournisseur ou rendements.',
              },
              {
                kpi: 'Productivite par boulanger',
                cible: '> 80 EUR de CA/heure',
                formule: 'CA / Heures travaillees',
                action: 'En dessous : optimiser process ou former equipe.',
              },
              {
                kpi: 'Ticket moyen client',
                cible: '> 6 EUR',
                formule: 'CA / Nombre tickets',
                action: 'Pousser vente complementaire (cafe, salade, dessert).',
              },
              {
                kpi: 'Taux de retour SAV',
                cible: '< 0,5 % des ventes',
                formule: 'Nb retours / Nb ventes x 100',
                action: 'Au-dessus : controle qualite cuisson ou conservation.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-mono-100">{item.kpi}</h3>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{item.cible}</span>
                </div>
                <div className="text-xs text-mono-500 mb-2"><strong>Formule :</strong> {item.formule}</div>
                <p className="text-sm text-mono-400 leading-relaxed"><strong>Action :</strong> {item.action}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Optimisation ═════════════ */}
        <section id="optimisation" className="mb-16">
          <SectionHeading icon={<Lightbulb className="w-6 h-6" />} number="6">
            Optimisation : invendus, snacking, second-day pricing
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une fois votre marge calculee correctement, place a l'optimisation. Voici 5
              leviers eprouves pour augmenter de 3 a 8 points votre marge nette.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <OptimisationCard
              number={1}
              title="Transformer les invendus en snacking"
              desc="Le pain de la veille devient pain perdu, croutons, chapelure (cout matiere 0). Les viennoiseries invendues sont reutilisees en bread pudding ou pudding au chocolat. Marge sur ces produits : 80-90 %. Une boulangerie qui transforme 100 % de ses invendus peut recuperer 4-6 % de CA additionnel sans cout matiere."
              icon={<PiggyBank className="w-5 h-5" />}
            />
            <OptimisationCard
              number={2}
              title="Partenariat avec associations (Loi Garot 2016)"
              desc="Don des invendus aux Restos du Coeur, Banque Alimentaire ou associations locales : defiscalisation a 60 % de la valeur des dons. Pour 5 000 EUR/an d'invendus donnes, c'est 3 000 EUR de credit d'impot. Plus rentable que la perte seche et impact RSE positif."
              icon={<Award className="w-5 h-5" />}
            />
            <OptimisationCard
              number={3}
              title="Second-day pricing (TooGoodToGo, Phenix)"
              desc="Paniers surprises 3-5 EUR vendus en fin de journee via application. Marge faible (~30 %) mais zero perte. Une boulangerie moyenne genere 50-150 EUR/jour additionnels via TooGoodToGo, soit 18 000-55 000 EUR/an. RestauMargin trace ces ventes a part dans votre P&L."
              icon={<Sparkles className="w-5 h-5" />}
            />
            <OptimisationCard
              number={4}
              title="Diversification snacking midi (sandwichs, salades, pizzas)"
              desc="Le snacking represente jusqu'a 35 % du CA des boulangeries modernes. Un sandwich vendu 5,50 EUR avec 1,50 EUR de cout matiere = 73 % de marge brute. Ces ventes utilisent vos charges fixes deja existantes (loyer, four, equipe) sans alourdir la structure."
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <OptimisationCard
              number={5}
              title="Pricing intelligent : augmentations trimestrielles ciblees"
              desc="Plutot que d'augmenter brutalement +0,30 EUR sur tout, augmentez +0,10 EUR sur 3-4 produits a fort volume chaque trimestre (croissants, baguette, eclair). Les clients tolerent les ajustements progressifs. Sur 12 mois, +0,40 EUR sur 4 produits a 50 ventes/jour = +29 200 EUR/an additionnels."
              icon={<Target className="w-5 h-5" />}
            />
          </div>

          <Callout type="info">
            <strong>Pour aller plus loin :</strong> consultez notre
            <Link to="/blog/coefficient-multiplicateur" className="underline font-semibold hover:text-teal-700 ml-1">guide complet du coefficient multiplicateur</Link>
            et notre article sur
            <Link to="/blog/reduire-food-cost" className="underline font-semibold hover:text-teal-700 ml-1">comment reduire le food cost</Link>.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Cas concret ═════════════ */}
        <section id="cas" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="7">
            Cas concret : Boulangerie Le Petrin (Nantes) — 8 % a 18 % de marge nette en 6 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              La Boulangerie Le Petrin (nom modifie pour anonymat client), situee en peripherie
              nantaise, a adopte RestauMargin en janvier 2026. Voici la transformation chiffree
              sur 6 mois.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-700" />
                <h3 className="font-bold text-red-900">Avant RestauMargin (janvier 2026)</h3>
              </div>
              <ul className="space-y-2 text-sm text-red-800">
                <li>- Chiffre d'affaires annuel : <strong>450 000 EUR</strong></li>
                <li>- Food cost reel non maitrise : <strong>34 %</strong></li>
                <li>- Invendus quotidiens : <strong>12 % du CA</strong></li>
                <li>- Pas de fiches techniques formalisees</li>
                <li>- Prix de vente non revus depuis 18 mois</li>
                <li>- Marge nette : <strong>8 % (36 000 EUR)</strong></li>
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Apres 6 mois (juillet 2026)</h3>
              </div>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li>- Chiffre d'affaires annuel : <strong>520 000 EUR</strong> (+15 %)</li>
                <li>- Food cost reel optimise : <strong>28 %</strong></li>
                <li>- Invendus reduits : <strong>4 % du CA</strong></li>
                <li>- 120 fiches techniques avec rendements</li>
                <li>- Augmentations ciblees +0,10 EUR sur 8 produits phares</li>
                <li>- Marge nette : <strong>18 % (93 600 EUR)</strong></li>
              </ul>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Les 5 actions cles mises en place</h3>
            <ol className="list-decimal list-inside space-y-2 text-mono-350">
              <li>
                <strong>Pesee systematique des pates et garnitures</strong> avec balance connectee :
                gain de 3 points de food cost.
              </li>
              <li>
                <strong>Renegociation annuelle des contrats farine</strong> (Grands Moulins de Paris)
                avec engagement volume : -8 % cout matiere.
              </li>
              <li>
                <strong>Partenariat associatif local</strong> + flash sales -50 % apres 18h :
                reduction invendus de 12 % a 4 %.
              </li>
              <li>
                <strong>Lancement gamme snacking midi</strong> (8 sandwichs, 4 salades, 2 pizzas) :
                +30 % CA sur les memes charges fixes.
              </li>
              <li>
                <strong>Augmentations ciblees +0,10 EUR</strong> sur viennoiseries (croissants,
                pains au chocolat) et baguette tradition : +18 000 EUR/an.
              </li>
            </ol>

            <p className="mt-6 text-mono-350">
              Resultat global : <strong className="text-emerald-700">+57 600 EUR de benefice
              net en 6 mois</strong>, soit un ROI de 198x sur l'abonnement RestauMargin
              (29 EUR/mois x 6 mois = 174 EUR).
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="14 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes boulangerie patisserie</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Essayez RestauMargin Boulangerie gratuitement
            </h2>
            <p className="text-amber-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Le seul logiciel SaaS francais qui integre rendement farine, cout four et
              majoration nuit dans le calcul de marge boulangerie patisserie.
            </p>
            <p className="text-amber-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> — essai gratuit 7 jours, sans engagement, sans carte bancaire.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-700 font-bold rounded-full hover:bg-amber-50 transition-colors text-lg shadow-lg"
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
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-amber-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-amber-700 transition-colors">Coefficient multiplicateur</h3>
              <p className="text-xs text-mono-500">Methodes et benchmarks par categorie de produit.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-amber-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-amber-700 transition-colors">Calcul marge restaurant</h3>
              <p className="text-xs text-mono-500">Guide complet food cost, marge brute, marge nette.</p>
            </Link>
            <Link to="/outils/calculateur-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-amber-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-amber-700 transition-colors">Calculateur food cost gratuit</h3>
              <p className="text-xs text-mono-500">Outil en ligne pour calculer votre marge en 30 sec.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-amber-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-amber-700 transition-colors">Essai gratuit 7 jours</h3>
              <p className="text-xs text-mono-500">Sans carte bancaire, sans engagement.</p>
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
            La plateforme de gestion de marge pour les boulangeries, patisseries et restaurants.
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
      <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-mono-100">
        <span className="text-amber-600 mr-2">{number}.</span>
        {children}
      </h2>
    </div>
  );
}

function FormulaCard({ title, icon, formula, exemple, color }: {
  title: string; icon: React.ReactNode; formula: string; exemple: string; color: string;
}) {
  const colors: Record<string, { bg: string; badge: string; border: string }> = {
    amber: { bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
    emerald: { bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
  };
  const c = colors[color] || colors.amber;

  return (
    <div className={`${c.bg} ${c.border} border rounded-2xl p-6`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 ${c.badge} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <h3 className="font-bold text-mono-100">{title}</h3>
      </div>
      <div className="mb-3">
        <span className="text-xs font-semibold text-mono-500 uppercase tracking-wider">Formule :</span>
        <div className="mt-1 bg-white/70 px-3 py-2 rounded-lg font-mono text-sm text-mono-350">{formula}</div>
      </div>
      <div>
        <span className="text-xs font-semibold text-mono-500 uppercase tracking-wider">Exemple :</span>
        <p className="mt-1 text-sm text-mono-400 leading-relaxed">{exemple}</p>
      </div>
    </div>
  );
}

function OptimisationCard({ number, title, desc, icon }: { number: number; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="text-amber-600">{icon}</div>
          <h3 className="font-semibold text-mono-100">{title}</h3>
        </div>
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
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-amber-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
