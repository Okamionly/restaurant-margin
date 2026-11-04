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
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO — "Logiciel de marge pour boulangerie patisserie"
   Mots-cles : logiciel marge boulangerie, food cost patisserie,
               calcul marge pain, rendement farine
   ~2 800 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost idéal pour une boulangerie pâtisserie ?',
    answer:
      "Le food cost cible d'une boulangerie pâtisserie se situe entre 25 % et 30 %. La boulangerie pure (pains de tradition, baguettes, viennoiseries) tourne autour de 22-28 %, tandis que la pâtisserie fine (entremets, macarons, mille-feuilles) accepte 28-35 % du fait du coût élevé du beurre, des oeufs et du chocolat. La marge brute cible se situe donc entre 65 % et 78 %, sachant que les invendus et la casse peuvent ronger 5-8 points.",
  },
  {
    question: 'Comment calculer le rendement de la farine en boulangerie ?',
    answer:
      "1 kg de farine T65 produit environ 1,3 kg de pain cuit grâce à l'hydratation (60-65 % d'eau). La perte poids dépend du temps de cuisson : une baguette tradition perd 18-22 % de son poids en eau pendant la cuisson. Formule simplifiée : poids pain cuit = (poids farine + poids eau) x (1 - taux d'évaporation). RestauMargin intègre automatiquement ces rendements dans vos fiches techniques.",
  },
  {
    question: "Quel est le coefficient multiplicateur typique d'une boulangerie ?",
    answer:
      "Le coefficient multiplicateur en boulangerie varie de 3 à 4 selon le type de produit. Une baguette tradition vendue 1,20 EUR coûte environ 0,30 EUR en matières premières (coefficient ~4). Un croissant beurre AOP vendu 1,40 EUR coûte 0,45 EUR (coefficient ~3,1). Les pâtisseries fines (entremets, mille-feuilles) sont plus proches de 2,8-3,5 du fait du coût des matières nobles.",
  },
  {
    question: "Comment intégrer le coût de l'énergie du four dans le calcul ?",
    answer:
      "L'énergie représente 3 à 7 % du chiffre d'affaires d'une boulangerie. Pour une intégration précise, calculez : (kWh consommés par fournée) x (prix kWh) / (nombre de pains par fournée) = coût énergie par unité. Un four à sole de 12 m2 consomme environ 4-6 kWh par heure de production. RestauMargin propose un module de coût indirect qui ventile automatiquement l'énergie sur chaque fiche technique.",
  },
  {
    question: 'Comment gérer la volatilité du prix du beurre en pâtisserie ?',
    answer:
      "Le beurre est le poste le plus volatil : prix entre 5 et 11 EUR/kg sur 2023-2026 (variation 120 %). Stratégies : (1) Contractualiser avec une laiterie sur 6 mois, (2) Ajuster vos prix de vente pâtisserie tous les trimestres, (3) Utiliser un beurre concentré 99,8 % MG (rendement +5 %), (4) Activer les alertes prix dans RestauMargin pour déclencher une révision auto de la fiche technique.",
  },
  {
    question: 'Quel taux de pertes et invendus tolérer en boulangerie ?',
    answer:
      "Le taux d'invendus moyen en boulangerie française est de 8 à 12 % du chiffre d'affaires en valeur. Une boulangerie bien gerie reste sous 5 %. Solutions : (1) Loi Garot 2016 (don associations défiscalisé 60 %), (2) Vente flash -50 % en fin de journée, (3) Recyclage en chapelure ou pain perdu, (4) Application TooGoodToGo (panier surprise 3-5 EUR). RestauMargin trace ces invendus et calcule l'impact réel sur votre marge nette.",
  },
  {
    question: 'Comment intégrer la majoration de nuit dans le coût main-d\'oeuvre ?',
    answer:
      "La majoration légale boulangerie pour le travail de nuit (21h-6h) est de 20 % minimum sur le taux horaire de base (convention collective IDCC 0843). Pour un boulanger payé 14 EUR/heure brut, le coût horaire de nuit avec charges patronales atteint 22-24 EUR. Sur une fournée de 8 heures (2h-10h), c'est environ 180 EUR de main-d'oeuvre à ventiler sur la production. RestauMargin calcule ce coût par produit selon le temps de fabrication.",
  },
  {
    question: 'Faut-il différencier farine bio et farine conventionnelle dans les calculs ?',
    answer:
      "Oui impérativement. La farine T65 conventionnelle coûte 0,55-0,80 EUR/kg, tandis que la T65 bio Demeter atteint 1,20-1,80 EUR/kg (+ 100 %). Cette différence impacte directement le coefficient multiplicateur. Une baguette tradition bio doit être vendue 1,80 EUR pour conserver une marge équivalente (vs 1,20 EUR conventionnelle). RestauMargin permet de créer des variantes bio/non-bio sur une même recette avec calcul automatique de l'impact marge.",
  },
  {
    question: 'Quel logiciel pour calculer la marge d\'une boulangerie pâtisserie ?',
    answer:
      "RestauMargin est spécialisé dans le calcul de marge pour boulangeries et pâtisseries : gestion des rendements farine, calcul du coût four/heure, suivi de la volatilité beurre/oeufs, ventilation main-d'oeuvre de nuit avec majoration, alertes de seuil sur invendus. Essai gratuit 7 jours sans CB.",
  },
  {
    question: 'Comment passer de 8 % à 18 % de marge nette en boulangerie ?',
    answer:
      "Exemple illustratif d'une boulangerie à 450 000 EUR de CA : (1) Pesée systématique pâtes et garnitures = +3 points food cost, (2) Renégociation contrat farine annuel = -8 % coût matière, (3) Réduction invendus de 12 % à 4 % via don associations + flash sales = +4 points marge, (4) Snacking midi (sandwichs, pizzas) = +30 % CA sur les mêmes charges fixes, (5) Augmentation 0,10 EUR sur viennoiseries = +18 000 EUR/an. Combinés, ces leviers peuvent permettre de passer de 8 % à 18 % de marge nette.",
  },
];

export default function LogicielMargeBoulangerie() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Logiciel marge boulangerie | Food cost pâtisserie | RestauMargin"
        description="Logiciel de calcul de marge pour boulangeries et pâtisseries. Coût matière, prix de vente, rendement farine. Essai gratuit 7 jours."
        path="/logiciel-marge-boulangerie"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            {
              name: 'Logiciel marge boulangerie pâtisserie',
              url: 'https://www.restaumargin.fr/logiciel-marge-boulangerie',
            },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline:
              'Logiciel de marge pour boulangerie pâtisserie : calculez vos coûts en 2026',
            description:
              "Guide complet du calcul de marge pour boulangeries pâtisseries : food cost, rendement farine, énergie four, main-d'oeuvre nuit. Exemples chiffrés et logiciel dédié.",
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
              'Logiciel de calcul de marge dédié aux boulangeries et pâtisseries. Gestion des rendements farine, coût four, main-d\'oeuvre de nuit, invendus.',
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
      <PublicHeader />

      {/* ── Breadcrumbs visibles ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/logiciel-marge-restaurant" className="hover:text-teal-600">Logiciels</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge boulangerie pâtisserie</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Boulangerie"
        readTime="14 min"
        date="Mai 2026"
        title="Logiciel de marge pour boulangerie pâtisserie : calculez vos coûts en 2026"
        accentWord="boulangerie pâtisserie"
        subtitle="Un logiciel SaaS français dédié aux boulangeries et pâtisseries. Calcul de marge, rendement farine, ventilation coût four et majoration nuit. Essai gratuit 7 jours sans carte bancaire."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="14 min" variant="header" />

        {/* ── Encadre formule rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Formules clés boulangerie pâtisserie</span>
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
              <span><strong className="text-white">Coût pâte / kg</strong> = (Farine + Eau + Sel + Levure) / Poids total pâte</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">3.</span>
              <span><strong className="text-white">Food cost boulangerie</strong> = Coût matières / Prix de vente HT x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">4.</span>
              <span><strong className="text-white">Coefficient multiplicateur</strong> = 3,0 à 4,0 (cible boulangerie)</span>
            </div>
          </div>
          <p className="mt-4 text-amber-100 text-sm">
            Objectif standard boulangerie pâtisserie : food cost entre 25 % et 30 %, marge brute entre 70 % et 75 %, marge nette entre 8 % et 18 %.
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
              { href: '#specificites', label: 'Spécificités du calcul de marge en boulangerie pâtisserie' },
              { href: '#couts', label: 'Coûts spécifiques : farine, beurre, énergie, main-d\'oeuvre nuit' },
              { href: '#formules', label: 'Formules clés : pâte, rendement farine, coefficient' },
              { href: '#exemples', label: 'Exemples chiffrés : baguette, croissant, mille-feuille, macaron' },
              { href: '#kpi', label: 'KPI quotidiens : invendus, casse, taux de retour' },
              { href: '#optimisation', label: 'Optimisation : invendus, snacking, second-day pricing' },
              { href: '#cas', label: 'Exemple illustratif : de 8 % à 18 % de marge nette' },
              { href: '#faq', label: 'Questions fréquentes' },
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
            Spécificités du calcul de marge en boulangerie pâtisserie
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le calcul de marge en boulangerie pâtisserie obéit à des règles très différentes
              de celles d'un restaurant traditionnel. Là où un bistrot doit gérer 30 plats avec
              une variabilité de portions, le boulanger doit piloter 80 à 150 références dont
              chacune a son propre rendement, son coût énergétique et sa durée de conservation.
              Selon la Confédération Nationale de la Boulangerie-Pâtisserie Française, près de
              35 000 boulangeries opèrent en France en 2026, et 22 % d'entre elles affichent une
              marge nette inférieure à 5 % — souvent par défaut d'un suivi rigoureux.
            </p>
            <p>
              Quatre spécificités rendent le calcul de marge boulangerie pâtisserie unique :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-3">
              <li>
                <strong>Le rendement farine</strong> : 1 kg de farine ne produit pas 1 kg de pain,
                mais entre 1,25 et 1,35 kg après incorporation d'eau et évaporation à la cuisson.
              </li>
              <li>
                <strong>L'énergie du four</strong> : 3 à 7 % du chiffre d'affaires, à ventiler
                produit par produit selon le temps de cuisson.
              </li>
              <li>
                <strong>La main-d'oeuvre de nuit</strong> : majoration légale de 20 % minimum
                pour les heures 21h-6h, qui représente 60-80 % du temps de production.
              </li>
              <li>
                <strong>Les invendus quotidiens</strong> : 8 à 12 % du CA en moyenne, qui doivent
                être intégrés au coût réel et non comme une simple perte.
              </li>
            </ul>

            <Callout type="info">
              <strong>Cible food cost boulangerie pâtisserie :</strong> 25 % à 30 %, soit 70 % à 75 %
              de marge brute. La pâtisserie fine accepte 28-35 % du fait du coût matières nobles
              (beurre AOP, oeufs Label Rouge, chocolat Valrhona).
            </Callout>

            <p>
              En 2026, la pression est inédite : le prix du beurre a grimpé de 60 % depuis 2023,
              le prix de la farine de 22 %, et l'énergie reste 40 % au-dessus de son niveau pré-crise.
              Sans logiciel dédié, un boulanger met 6-10 heures par semaine à maintenir ses fiches
              techniques à jour — temps perdu sur la production et le commerce.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Couts specifiques ═════════════ */}
        <section id="couts" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="2">
            Coûts spécifiques : farine, beurre, énergie, main-d'oeuvre nuit
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les quatre postes de coût qui font la différence entre une boulangerie rentable
              et une boulangerie qui s'épuise. Maîtriser leur évolution et leur impact sur la marge
              est la clé d'une gestion sérieuse en 2026.
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
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">T55 (blanche)</td><td className="py-3 px-4 text-right">0,55 EUR/kg</td><td className="py-3 px-4 text-right">1,20 EUR/kg</td><td className="py-3 px-4 text-right">Pâtisserie, pizza</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">T65 (tradition)</td><td className="py-3 px-4 text-right">0,60 EUR/kg</td><td className="py-3 px-4 text-right">1,35 EUR/kg</td><td className="py-3 px-4 text-right">Baguette tradition</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">T80 (bise)</td><td className="py-3 px-4 text-right">0,75 EUR/kg</td><td className="py-3 px-4 text-right">1,60 EUR/kg</td><td className="py-3 px-4 text-right">Pain de campagne</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">T110 (semi-complète)</td><td className="py-3 px-4 text-right">0,90 EUR/kg</td><td className="py-3 px-4 text-right">1,80 EUR/kg</td><td className="py-3 px-4 text-right">Pain complet</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">T150 (intégrale)</td><td className="py-3 px-4 text-right">1,05 EUR/kg</td><td className="py-3 px-4 text-right">2,10 EUR/kg</td><td className="py-3 px-4 text-right">Pain intégral</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-mono-400">
              Source : moyenne des prix farine 2026 négociée par sac 25 kg chez Grands Moulins de Paris,
              Minoterie Suire, Moulins Soufflet. Bio = certification Demeter ou AB.
            </p>
          </div>

          {/* Sous-section : autres matieres */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-mono-100 mb-4 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-amber-600" />
              Levure, beurre, sucre, oeufs : la volatilité 2026
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                {
                  nom: 'Beurre AOP Charentes-Poitou',
                  prix: '9,80 EUR/kg',
                  evolution: '+62 % vs 2023',
                  note: 'Volatilité extrême. Privilégier contrat 6 mois.',
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
                  nom: 'Levure fraîche pressée',
                  prix: '5,80 EUR/kg',
                  evolution: '+12 % vs 2023',
                  note: 'Conserver au frais. Durée de vie 21 jours.',
                  color: 'emerald',
                },
                {
                  nom: 'Chocolat couverture 70 %',
                  prix: '14,50 EUR/kg',
                  evolution: '+85 % vs 2023',
                  note: 'Cacao en crise (côte Ivoire, Ghana). Stocker.',
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
              L'énergie four : 3 à 7 % du chiffre d'affaires
            </h3>
            <div className="prose-content">
              <p>
                Un four à sole de 12 m2 consomme entre 40 et 60 kWh par jour (8 heures de
                production). Au prix moyen de 0,18 EUR/kWh en tarif pro 2026, c'est 7 à 11 EUR
                par jour, soit 200 à 330 EUR par mois rien que pour la cuisson. Pour une boulangerie
                à 35 000 EUR de CA mensuel, l'énergie représente 0,6 à 1 % du CA — bien sous-évaluée.
              </p>
              <p>
                Au total, en incluant pétrins, réfrigérateurs, chambres de pousse et éclairage,
                l'énergie monte à 3-7 % du CA selon la taille de l'atelier. La méthode de calcul
                rigoureuse :
              </p>
              <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 mt-4 font-mono text-sm">
                <div className="text-mono-100 mb-2 font-bold">Coût énergie par fournée :</div>
                <div className="text-mono-400">= kWh consommés x prix kWh</div>
                <div className="text-mono-400">= 5 kWh x 0,18 EUR = <span className="text-orange-600 font-bold">0,90 EUR / fournée</span></div>
                <div className="text-mono-100 mt-3 mb-2 font-bold">Coût énergie par baguette (fournée 100 baguettes) :</div>
                <div className="text-mono-400">= 0,90 EUR / 100 = <span className="text-orange-600 font-bold">0,009 EUR / baguette</span></div>
              </div>
              <p className="mt-4">
                RestauMargin intègre un module de coût indirect qui ventile automatiquement
                l'énergie sur chaque fiche technique selon le temps de cuisson et le type d'équipement.
              </p>
            </div>
          </div>

          {/* Sous-section : main-d'oeuvre */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-mono-100 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Main-d'oeuvre de nuit : la majoration légale 20 %
            </h3>
            <div className="prose-content">
              <p>
                Selon la convention collective Boulangerie-Pâtisserie Artisanale (IDCC 0843), le
                travail entre 21h et 6h ouvre droit à une majoration salariale de 20 % minimum.
                Or, en boulangerie traditionnelle, 60 à 80 % du temps de production se déroule
                entre 2h et 8h du matin.
              </p>
              <p>
                Pour un boulanger payé 14 EUR/heure brut :
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-2">
                <li>Coût horaire jour avec charges patronales (~45 %) : <strong>20,30 EUR/h</strong></li>
                <li>Coût horaire nuit (+20 %) avec charges patronales : <strong>24,40 EUR/h</strong></li>
                <li>Sur fournée 8h (2h-10h), 6h en nuit : (6 x 24,40) + (2 x 20,30) = <strong>187 EUR</strong></li>
                <li>Pour 350 baguettes produites : coût main-d'oeuvre par baguette = <strong>0,53 EUR</strong></li>
              </ul>
              <Callout type="warning">
                <strong>Erreur fréquente :</strong> beaucoup de boulangers calculent leur prix de
                vente uniquement sur le coût matière (0,30 EUR par baguette), ignorant la
                main-d'oeuvre (0,53 EUR), l'énergie (0,01 EUR) et les charges fixes (loyer,
                assurances). Le coût réel d'une baguette tradition est plus proche de 0,95 EUR
                que de 0,30 EUR.
              </Callout>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Formules cles ═════════════ */}
        <section id="formules" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            Formules clés : pâte, rendement farine, coefficient multiplicateur
          </SectionHeading>

          <div className="prose-content">
            <p>
              Maîtriser le calcul de marge boulangerie passe par 4 formules incontournables.
              RestauMargin automatise tous ces calculs, mais il est essentiel de les comprendre
              pour piloter intelligemment votre activité.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <FormulaCard
              title="Coût pâte / kg"
              icon={<Wheat className="w-5 h-5" />}
              formula="(Coût farine + eau + sel + levure + améliorant) / Poids total pâte"
              exemple="Pour 10 kg de pâte baguette tradition : (10 x 0,60 + eau gratuite + 0,20 sel + 5 x 5,80 / 1000 x 200 + 0,10 améliorant) / 16,5 kg pâte = 6,30 / 16,5 = 0,38 EUR/kg pâte"
              color="amber"
            />
            <FormulaCard
              title="Rendement farine"
              icon={<TrendingUp className="w-5 h-5" />}
              formula="Poids pain cuit / Poids farine"
              exemple="10 kg farine + 6,5 kg eau = 16,5 kg pâte. Après cuisson (perte 20 % évaporation) = 13,2 kg pain cuit. Rendement = 13,2 / 10 = 1,32. Soit 1 kg farine = 1,32 kg pain"
              color="emerald"
            />
            <FormulaCard
              title="Marge unitaire baguette"
              icon={<DollarSign className="w-5 h-5" />}
              formula="Prix de vente HT - (Coût pâte + Énergie + Main-d'oeuvre)"
              exemple="Baguette tradition vendue 1,30 EUR TTC (TVA 5,5 % = 1,23 EUR HT). Coût réel = 0,30 matière + 0,01 énergie + 0,53 main-d'oeuvre = 0,84 EUR. Marge = 1,23 - 0,84 = 0,39 EUR (32 % de marge)"
              color="emerald"
            />
            <FormulaCard
              title="Coefficient multiplicateur boulangerie"
              icon={<Percent className="w-5 h-5" />}
              formula="Prix de vente HT / Coût matière"
              exemple="Baguette tradition : 1,23 EUR / 0,30 EUR = 4,1. Croissant beurre : 1,33 EUR / 0,45 EUR = 2,96. Mille-feuille : 4,50 EUR / 1,40 EUR = 3,21. Macaron : 1,90 EUR / 0,55 EUR = 3,45"
              color="amber"
            />
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Exemples chiffres ═════════════ */}
        <section id="exemples" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            Exemples chiffrés : baguette, croissant, mille-feuille, macaron
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici 4 cas pratiques détaillés, qui couvrent les principales catégories d'une
              boulangerie pâtisserie moderne. Tous les calculs sont en HT (TVA 5,5 % en
              boulangerie sur place et à emporter).
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
                  <th className="text-right py-2 px-3 font-semibold">Quantité</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix unitaire</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Farine T65 tradition</td><td className="py-2 px-3 text-right">230 g</td><td className="py-2 px-3 text-right">0,60 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,138 EUR</td></tr>
                <tr><td className="py-2 px-3">Eau (~65 % hydratation)</td><td className="py-2 px-3 text-right">150 ml</td><td className="py-2 px-3 text-right">gratuite</td><td className="py-2 px-3 text-right font-medium">0,001 EUR</td></tr>
                <tr><td className="py-2 px-3">Sel marin de Guerande</td><td className="py-2 px-3 text-right">4,5 g</td><td className="py-2 px-3 text-right">0,80 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,004 EUR</td></tr>
                <tr><td className="py-2 px-3">Levure fraîche</td><td className="py-2 px-3 text-right">3 g</td><td className="py-2 px-3 text-right">5,80 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,017 EUR</td></tr>
                <tr><td className="py-2 px-3">Énergie four (cuisson 22 min)</td><td className="py-2 px-3 text-right">0,05 kWh</td><td className="py-2 px-3 text-right">0,18 EUR/kWh</td><td className="py-2 px-3 text-right font-medium">0,009 EUR</td></tr>
                <tr><td className="py-2 px-3">Main-d'oeuvre (5 min/baguette)</td><td className="py-2 px-3 text-right">5 min</td><td className="py-2 px-3 text-right">24,4 EUR/h</td><td className="py-2 px-3 text-right font-medium">0,200 EUR</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total coût réel</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">0,369 EUR</td></tr>
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
                  <th className="text-right py-2 px-3 font-semibold">Quantité</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix unitaire</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Farine T45 gruau</td><td className="py-2 px-3 text-right">50 g</td><td className="py-2 px-3 text-right">0,75 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,038 EUR</td></tr>
                <tr><td className="py-2 px-3">Beurre AOP Charentes</td><td className="py-2 px-3 text-right">25 g</td><td className="py-2 px-3 text-right">9,80 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,245 EUR</td></tr>
                <tr><td className="py-2 px-3">Sucre</td><td className="py-2 px-3 text-right">5 g</td><td className="py-2 px-3 text-right">1,40 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,007 EUR</td></tr>
                <tr><td className="py-2 px-3">Lait entier</td><td className="py-2 px-3 text-right">15 ml</td><td className="py-2 px-3 text-right">1,30 EUR/L</td><td className="py-2 px-3 text-right font-medium">0,020 EUR</td></tr>
                <tr><td className="py-2 px-3">Levure fraîche + sel + dorure</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right font-medium">0,028 EUR</td></tr>
                <tr><td className="py-2 px-3">Énergie four + chambre pousse</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right font-medium">0,015 EUR</td></tr>
                <tr><td className="py-2 px-3">Main-d'oeuvre (8 min/croissant)</td><td className="py-2 px-3 text-right">8 min</td><td className="py-2 px-3 text-right">24,4 EUR/h</td><td className="py-2 px-3 text-right font-medium">0,325 EUR</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total coût réel</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">0,678 EUR</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-3 font-bold text-emerald-900">Marge brute (1,33 - 0,678)</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-emerald-900">0,652 EUR (49 %)</td></tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm text-mono-400">
              Coefficient multiplicateur : 1,33 / 0,678 = <strong>1,96</strong>. Faible.
              Le croissant beurre AOP est un produit d'appel : il fidélise la clientèle du
              matin mais doit être compensé par des produits à plus forte marge (café, sandwichs).
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
                  <th className="text-right py-2 px-3 font-semibold">Quantité</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix unitaire</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Pâte feuilletée inversée (3 abaisses)</td><td className="py-2 px-3 text-right">90 g</td><td className="py-2 px-3 text-right">~6,50 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,585 EUR</td></tr>
                <tr><td className="py-2 px-3">Crème pâtissière vanille Bourbon</td><td className="py-2 px-3 text-right">120 g</td><td className="py-2 px-3 text-right">~4,80 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,576 EUR</td></tr>
                <tr><td className="py-2 px-3">Sucre glace pour décor</td><td className="py-2 px-3 text-right">8 g</td><td className="py-2 px-3 text-right">2,10 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,017 EUR</td></tr>
                <tr><td className="py-2 px-3">Chocolat noir + glace royale</td><td className="py-2 px-3 text-right">5 g</td><td className="py-2 px-3 text-right">14,50 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,073 EUR</td></tr>
                <tr><td className="py-2 px-3">Énergie cuisson feuilletage</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right font-medium">0,040 EUR</td></tr>
                <tr><td className="py-2 px-3">Main-d'oeuvre (25 min/pièce)</td><td className="py-2 px-3 text-right">25 min</td><td className="py-2 px-3 text-right">24,4 EUR/h</td><td className="py-2 px-3 text-right font-medium">1,017 EUR</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total coût réel</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">2,308 EUR</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-3 font-bold text-emerald-900">Marge brute (4,27 - 2,308)</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-emerald-900">1,962 EUR (46 %)</td></tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm text-mono-400">
              Coefficient multiplicateur : 4,27 / 2,308 = <strong>1,85</strong>. La pâtisserie
              fine est très dépendante de la main-d'oeuvre qualifiée. Optimisation possible :
              produire par batch de 12 mille-feuilles pour réduire le coût horaire unitaire.
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
                  <th className="text-right py-2 px-3 font-semibold">Quantité</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix unitaire</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-2 px-3">Poudre d'amande</td><td className="py-2 px-3 text-right">8 g</td><td className="py-2 px-3 text-right">22 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,176 EUR</td></tr>
                <tr><td className="py-2 px-3">Sucre glace</td><td className="py-2 px-3 text-right">8 g</td><td className="py-2 px-3 text-right">2,10 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,017 EUR</td></tr>
                <tr><td className="py-2 px-3">Blanc d'oeuf (vieilli)</td><td className="py-2 px-3 text-right">6 g</td><td className="py-2 px-3 text-right">8 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,048 EUR</td></tr>
                <tr><td className="py-2 px-3">Ganache chocolat 70 %</td><td className="py-2 px-3 text-right">10 g</td><td className="py-2 px-3 text-right">12 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,120 EUR</td></tr>
                <tr><td className="py-2 px-3">Colorant + arôme</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right font-medium">0,008 EUR</td></tr>
                <tr><td className="py-2 px-3">Énergie (cuisson 13 min)</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right font-medium">0,005 EUR</td></tr>
                <tr><td className="py-2 px-3">Main-d'oeuvre (3 min/macaron en batch)</td><td className="py-2 px-3 text-right">3 min</td><td className="py-2 px-3 text-right">24,4 EUR/h</td><td className="py-2 px-3 text-right font-medium">0,122 EUR</td></tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50"><td className="py-3 px-3 font-bold text-mono-100">Total coût réel</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-amber-900">0,496 EUR</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-3 font-bold text-emerald-900">Marge brute (1,80 - 0,496)</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-emerald-900">1,304 EUR (72 %)</td></tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm text-mono-400">
              Coefficient multiplicateur : 1,80 / 0,496 = <strong>3,63</strong>. Excellent.
              Le macaron est un produit ultra-rentable une fois la production maîtrisée.
              Produit-phare à pousser via vitrine et offre boîte 6/12 pièces.
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
              Sans suivi quotidien, votre marge nette dérive sans que vous vous en apercevez.
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
                action: 'Au-delà de 8 %, ajuster les quantités produites par tranche horaire.',
              },
              {
                kpi: 'Taux de casse',
                cible: '< 1 % du CA',
                formule: 'Valeur casse / CA x 100',
                action: 'Casse > 2 % : revoir le stockage (humidité, manipulations).',
              },
              {
                kpi: 'Coût matière réel (J/J-7)',
                cible: '< 30 % du CA',
                formule: 'Coût achats / CA x 100',
                action: 'Hausse > 2 points : vérifier prix fournisseur ou rendements.',
              },
              {
                kpi: 'Productivité par boulanger',
                cible: '> 80 EUR de CA/heure',
                formule: 'CA / Heures travaillées',
                action: 'En dessous : optimiser process ou former équipe.',
              },
              {
                kpi: 'Ticket moyen client',
                cible: '> 6 EUR',
                formule: 'CA / Nombre tickets',
                action: 'Pousser vente complémentaire (café, salade, dessert).',
              },
              {
                kpi: 'Taux de retour SAV',
                cible: '< 0,5 % des ventes',
                formule: 'Nb retours / Nb ventes x 100',
                action: 'Au-dessus : contrôle qualité cuisson ou conservation.',
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
              Une fois votre marge calculée correctement, place à l'optimisation. Voici 5
              leviers éprouvés pour augmenter de 3 à 8 points votre marge nette.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <OptimisationCard
              number={1}
              title="Transformer les invendus en snacking"
              desc="Le pain de la veille devient pain perdu, croûtons, chapelure (coût matière 0). Les viennoiseries invendues sont réutilisées en bread pudding ou pudding au chocolat. Marge sur ces produits : 80-90 %. Une boulangerie qui transforme 100 % de ses invendus peut récupérer 4-6 % de CA additionnel sans coût matière."
              icon={<PiggyBank className="w-5 h-5" />}
            />
            <OptimisationCard
              number={2}
              title="Partenariat avec associations (Loi Garot 2016)"
              desc="Don des invendus aux Restos du Coeur, Banque Alimentaire ou associations locales : defiscalisation à 60 % de la valeur des dons. Pour 5 000 EUR/an d'invendus donnés, c'est 3 000 EUR de crédit d'impôt. Plus rentable que la perte sèche et impact RSE positif."
              icon={<Award className="w-5 h-5" />}
            />
            <OptimisationCard
              number={3}
              title="Second-day pricing (TooGoodToGo, Phenix)"
              desc="Paniers surprises 3-5 EUR vendus en fin de journée via application. Marge faible (~30 %) mais zéro perte. Une boulangerie moyenne génère 50-150 EUR/jour additionnels via TooGoodToGo, soit 18 000-55 000 EUR/an. RestauMargin trace ces ventes à part dans votre P&L."
              icon={<Sparkles className="w-5 h-5" />}
            />
            <OptimisationCard
              number={4}
              title="Diversification snacking midi (sandwichs, salades, pizzas)"
              desc="Le snacking représente jusqu'à 35 % du CA des boulangeries modernes. Un sandwich vendu 5,50 EUR avec 1,50 EUR de coût matière = 73 % de marge brute. Ces ventes utilisent vos charges fixes déjà existantes (loyer, four, équipe) sans alourdir la structure."
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <OptimisationCard
              number={5}
              title="Pricing intelligent : augmentations trimestrielles ciblées"
              desc="Plutôt que d'augmenter brutalement +0,30 EUR sur tout, augmentez +0,10 EUR sur 3-4 produits à fort volume chaque trimestre (croissants, baguette, éclair). Les clients tolèrent les ajustements progressifs. Sur 12 mois, +0,40 EUR sur 4 produits à 50 ventes/jour = +29 200 EUR/an additionnels."
              icon={<Target className="w-5 h-5" />}
            />
          </div>

          <Callout type="info">
            <strong>Pour aller plus loin :</strong> consultez notre
            <Link to="/blog/coefficient-multiplicateur" className="underline font-semibold hover:text-teal-700 ml-1">guide complet du coefficient multiplicateur</Link>
            et notre article sur
            <Link to="/blog/reduire-food-cost" className="underline font-semibold hover:text-teal-700 ml-1">comment réduire le food cost</Link>.
          </Callout>
        </section>

        {/* ═════════════ SECTION 7 : Exemple illustratif ═════════════ */}
        <section id="cas" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="7">
            Exemple illustratif : une boulangerie de quartier, de 8 % à 18 % de marge nette
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons un exemple fictif : une boulangerie pâtisserie de quartier à 450 000 EUR de
              chiffre d'affaires annuel. Voici ce que pourrait donner l'application des leviers
              décrits plus haut. Chiffres hypothétiques, à titre d'illustration.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-700" />
                <h3 className="font-bold text-red-900">Situation de départ</h3>
              </div>
              <ul className="space-y-2 text-sm text-red-800">
                <li>- Chiffre d'affaires annuel : <strong>450 000 EUR</strong></li>
                <li>- Food cost réel non maîtrisé : <strong>34 %</strong></li>
                <li>- Invendus quotidiens : <strong>12 % du CA</strong></li>
                <li>- Pas de fiches techniques formalisées</li>
                <li>- Prix de vente non revus depuis 18 mois</li>
                <li>- Marge nette : <strong>8 % (36 000 EUR)</strong></li>
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Situation visée</h3>
              </div>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li>- Chiffre d'affaires annuel : <strong>520 000 EUR</strong> (+15 %)</li>
                <li>- Food cost réel optimisé : <strong>28 %</strong></li>
                <li>- Invendus réduits : <strong>4 % du CA</strong></li>
                <li>- 120 fiches techniques avec rendements</li>
                <li>- Augmentations ciblées +0,10 EUR sur 8 produits phares</li>
                <li>- Marge nette : <strong>18 % (93 600 EUR)</strong></li>
              </ul>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Les 5 leviers à actionner</h3>
            <ol className="list-decimal list-inside space-y-2 text-mono-350">
              <li>
                <strong>Pesée systématique des pâtes et garnitures</strong> avec balance connectée :
                gain de 3 points de food cost.
              </li>
              <li>
                <strong>Renégociation annuelle des contrats farine</strong> (Grands Moulins de Paris)
                avec engagement volume : -8 % coût matière.
              </li>
              <li>
                <strong>Partenariat associatif local</strong> + flash sales -50 % après 18h :
                réduction invendus de 12 % à 4 %.
              </li>
              <li>
                <strong>Lancement gamme snacking midi</strong> (8 sandwichs, 4 salades, 2 pizzas) :
                +30 % CA sur les mêmes charges fixes.
              </li>
              <li>
                <strong>Augmentations ciblées +0,10 EUR</strong> sur viennoiseries (croissants,
                pains au chocolat) et baguette tradition : +18 000 EUR/an.
              </li>
            </ol>

            <p className="mt-6 text-mono-350">
              Ordre de grandeur : passer de 8 % de 450 000 EUR à 18 % de 520 000 EUR représenterait
              <strong className="text-emerald-700">environ 57 600 EUR de résultat net annuel supplémentaire</strong>.
              Chaque établissement a ses propres contraintes : ces chiffres ne sont pas un résultat garanti.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="14 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes boulangerie pâtisserie</h2>
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
              Un logiciel SaaS français qui intègre rendement farine, coût four et
              majoration nuit dans le calcul de marge boulangerie pâtisserie.
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
              <p className="text-xs text-mono-500">Méthodes et benchmarks par catégorie de produit.</p>
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
      <PublicFooter />
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
