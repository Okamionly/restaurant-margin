import { Link } from 'react-router-dom';
import {
  ChefHat,
  Calculator,
  ArrowRight,
  Check,
  Sparkles,
  Star,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Target,
  Award,
  Wine,
  Users,
  Scale,
  Gem,
  Crown,
  Utensils,
  Clock,
  BarChart3,
  Package,
  FileText,
  Brain,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO — Logiciel marge restaurant gastronomique
   Mots-cles cibles :
     - marge restaurant gastronomique
     - food cost etoile
     - rentabilite restaurant haut de gamme
     - gestion restaurant gastronomique
   Intent : niche, ~2 800 mots
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quel est le food cost ideal d'un restaurant gastronomique ?",
    answer:
      "Le food cost cible d'un restaurant gastronomique se situe entre 32 % et 40 %, contre 25-35 % pour un bistrot. Ce ratio plus eleve s'explique par l'usage de produits nobles (caviar, truffe, langoustines, foie gras, homard) dont le cout matiere est structurellement plus important. La marge brute en EUROS reste cependant plus elevee en valeur absolue grace au ticket moyen 80-300 EUR.",
  },
  {
    question: "Pourquoi un restaurant gastronomique accepte-t-il un food cost plus eleve ?",
    answer:
      "Parce que la marge brute en EUROS est demultipliee. Un plat de bistrot a 18 EUR avec 6 EUR de matieres genere 12 EUR de marge brute. Un plat etoile a 65 EUR avec 26 EUR de matieres genere 39 EUR de marge, soit plus de 3 fois plus en valeur absolue. Le pourcentage compte moins que la valeur generee par couvert.",
  },
  {
    question: "Quelle marge nette esperer dans un restaurant gastronomique ?",
    answer:
      "La marge nette d'un restaurant gastronomique se situe generalement entre 5 % et 10 %, soit moins qu'un bistrot bien gere (8-15 %). La raison : les couts de personnel explosent (brigade de cuisine 45-55 % du CA + service en salle 15-20 % = prime cost 80-90 %). Un excellent restaurant 1 etoile bien pilote peut atteindre 12-15 % de marge nette.",
  },
  {
    question: "Comment piloter la marge brute sur les produits saisonniers (truffe, gibier) ?",
    answer:
      "Les produits saisonniers exigent des fiches techniques par menu et par periode. RestauMargin permet de cloner une fiche, d'y substituer le produit saisonnier (truffe noire Tuber melanosporum decembre-mars, truffe blanche Alba octobre-decembre) et de recalculer instantanement le food cost et le prix de vente cible. Les variations de cours hebdomadaires sont integrees via le module Mercuriale.",
  },
  {
    question: "Quel est le ratio brigade ideal pour un restaurant gastronomique ?",
    answer:
      "Un restaurant gastronomique etoile fonctionne avec un ratio d'environ 1 cuisinier pour 4 a 6 couverts simultanes. Pour un service de 40 couverts, comptez 8 a 10 personnes en cuisine (chef executif, sous-chef, chef de partie, commis, plonge) et 6 a 8 en salle (maitre d'hotel, sommelier, chefs de rang, runners). Ce ratio explique le poids du personnel dans le P&L.",
  },
  {
    question: "Comment gerer une cave premium dans un logiciel de marge ?",
    answer:
      "La cave d'un restaurant gastronomique represente 50 000 a 200 000 EUR de stock immobilise. RestauMargin permet de creer un inventaire dedie (vins, champagnes, spiritueux) avec gestion des millesimes, des allocations limitees et du coefficient cave (1,8 a 3 selon le rang). Le sommelier accede a un dashboard temps reel des marges par cuvee, des rotations et des alertes stocks bas.",
  },
  {
    question: "Quel KPI prioritaire pour un restaurant Michelin ?",
    answer:
      "Le taux d'occupation est le KPI critique numero 1. En dessous de 70 % d'occupation sur les services valides, la rentabilite s'effondre car les charges fixes (loyer prime, personnel CDI, energie) ne sont pas amortissables. Les autres KPI : note Michelin/Gault et Millau/World's 50 Best, ticket moyen, taux de fidelisation, marge brute par service (lunch vs dinner).",
  },
  {
    question: "RestauMargin gere-t-il les menus degustation a plusieurs services ?",
    answer:
      "Oui. Vous creez un menu degustation 6, 8 ou 12 services en agregeant des fiches techniques individuelles. Le logiciel calcule automatiquement le food cost total, la marge brute en EUROS et le coefficient global. Vous pouvez tester en simulation l'ajout ou le retrait d'un plat et voir instantanement l'impact sur la marge.",
  },
  {
    question: "Combien coute un logiciel pour restaurant gastronomique ?",
    answer:
      "Les solutions enterprise dediees au luxe (Yokitup, Datameal, Apicbase) tournent entre 100 et 400 EUR/mois. RestauMargin propose le plan Business multi-services et cave premium a 79 EUR/mois, soit 3 a 5 fois moins cher pour un perimetre fonctionnel comparable. Essai gratuit 7 jours sans carte bancaire.",
  },
  {
    question: "Comment integrer le travail des produits nobles (decoupes, parures) ?",
    answer:
      "RestauMargin gere les rendements de transformation. Pour un homard de 600 g a 28 EUR, vous renseignez le taux de rendement (50 % pour la chair noble), le logiciel calcule le cout reel a l'usage : 28 EUR / 0,30 kg = 93,33 EUR/kg chair. Les parures (carapaces pour bisque) deviennent un ingredient secondaire pour vos sauces, valorisant l'integralite du produit.",
  },
];

const fineDiningStats = [
  { label: 'Food cost cible', value: '32-40 %', detail: 'vs 25-35 % bistrot' },
  { label: 'Ticket moyen', value: '80-300 EUR', detail: 'midi a degustation' },
  { label: 'Prime cost', value: '80-90 %', detail: 'avant marge nette' },
  { label: 'Marge nette', value: '5-10 %', detail: '12-15 % si excellent' },
];

const exampleMenu = [
  { service: 'Mise en bouche - foie gras et figue', cout: 4.2, prix: 0 },
  { service: 'Entree - langoustines royales / consomme', cout: 8.5, prix: 0 },
  { service: 'Poisson - turbot sauvage / beurre blanc', cout: 7.8, prix: 0 },
  { service: 'Granite - citron noir / yuzu', cout: 1.4, prix: 0 },
  { service: 'Viande - pigeon des Costieres / truffe', cout: 9.2, prix: 0 },
  { service: 'Fromages affines (chariot)', cout: 3.5, prix: 0 },
  { service: 'Pre-dessert - sorbet du moment', cout: 1.1, prix: 0 },
  { service: 'Dessert signature - chocolat / piment', cout: 2.3, prix: 0 },
];

export default function LogicielMargeGastronomique() {
  const totalCost = exampleMenu.reduce((sum, s) => sum + s.cout, 0);
  const sellingPrice = 120;
  const foodCost = ((totalCost / sellingPrice) * 100).toFixed(1);
  const grossMargin = sellingPrice - totalCost;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel marge restaurant gastronomique etoile | RestauMargin"
        description="Logiciel pour piloter marges restaurant gastronomique etoile. Food cost 32-40 %, brigades importantes, produits nobles. Essai gratuit 7 jours."
        path="/logiciel-marge-gastronomique"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciel marge restaurant', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            { name: 'Restaurant gastronomique', url: 'https://www.restaumargin.fr/logiciel-marge-gastronomique' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour restaurant gastronomique en 2026',
            description:
              "Guide complet du pilotage de marges en restauration gastronomique : food cost 32-40 %, brigades, cave premium, KPI Michelin. Methodes, exemples chiffres et outils.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 2800,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/logiciel-marge-gastronomique' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin pour gastronomie',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Fine Dining Management Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-gastronomique',
            description:
              "Logiciel de gestion des marges specialise pour restaurants gastronomiques etoiles : fiches techniques produits nobles, menus degustation, cave premium, brigades importantes, KPI Michelin.",
            featureList: [
              'Fiches techniques produits nobles (caviar, truffe, langoustines, homard)',
              'Gestion menus degustation 6 a 12 services',
              'Cave premium avec millesimes et allocations',
              'Suivi marge par service (lunch vs dinner)',
              'Rendements de transformation (decoupes, parures)',
              'Pilotage brigade et ratios personnel',
              'Saisonnalite et substitutions automatiques',
              'KPI taux occupation et fidelisation',
            ],
            offers: {
              '@type': 'Offer',
              name: 'Business',
              price: '79',
              priceCurrency: 'EUR',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '79',
                priceCurrency: 'EUR',
                unitText: 'MONTH',
              },
            },
          },
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/pricing" className="hidden sm:inline-flex text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">
              Tarifs
            </Link>
            <Link to="/demo" className="hidden sm:inline-flex text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">
              Demo
            </Link>
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              Essai gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Breadcrumbs ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-6xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/logiciel-marge-restaurant" className="hover:text-teal-600">Logiciel marge restaurant</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Restaurant gastronomique</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className="bg-gradient-to-b from-amber-50 via-white to-white pt-16 pb-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-amber-800 bg-amber-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <Crown className="w-3.5 h-3.5" />
            Specialise gastronomie etoilee
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-mono-100 leading-tight mb-6 max-w-4xl mx-auto">
            Logiciel de marge pour restaurant gastronomique en 2026
          </h1>
          <p className="text-lg sm:text-xl text-mono-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Le seul logiciel SaaS qui gere produits nobles, menus degustation, cave premium et
            brigades de cuisine etoilees. <strong>Food cost 32-40 % maitrise, +5 points de marge nette en 6 mois.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-colors text-lg shadow-lg shadow-teal-600/30"
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-mono-100 text-mono-100 font-semibold rounded-full hover:bg-mono-100 hover:text-white transition-colors"
            >
              Voir la demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-mono-500">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Sans carte bancaire</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Sans engagement</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Utilise par chefs etoiles</span>
          </div>
        </div>
      </header>

      {/* ── KPI hero ── */}
      <section className="py-12 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fineDiningStats.map((stat, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6 text-center">
                <div className="text-3xl font-extrabold text-mono-100 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-teal-700 mb-1">{stat.label}</div>
                <div className="text-xs text-mono-500">{stat.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Intro : structure differente ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-6">
            Pourquoi la gastronomie obeit a une economie differente
          </h2>
          <div className="prose prose-lg max-w-none text-mono-350 leading-relaxed space-y-5">
            <p>
              Piloter la marge d'un restaurant gastronomique etoile ne ressemble en rien a la gestion d'un bistrot
              ou d'une brasserie. La structure de couts, les attentes clients, les exigences fournisseurs et les
              standards de service imposent un modele economique a part entiere. Les regles apprises en formation
              CAP cuisine ou dans un master management restauration s'appliquent partiellement : le food cost
              cible bouge, le ratio personnel explose, la cave devient un actif strategique et chaque assiette
              raconte une histoire qui justifie le ticket moyen 80 a 300 EUR.
            </p>
            <p>
              Un restaurant 1, 2 ou 3 etoiles Michelin (ou cite au Gault et Millau, World's 50 Best, La Liste)
              n'optimise pas un pourcentage : il optimise une experience. Mais cette experience doit etre
              economiquement viable. Trop de tables fermees, trop de chefs en cuisine, pas assez de produits valorises
              et le restaurant brule du cash. C'est pour cette raison qu'un logiciel de marge specialise gastronomie
              n'est pas un luxe : c'est une assurance vie financiere.
            </p>
            <p>
              RestauMargin a ete concu en collaboration avec plusieurs chefs etoiles francais pour repondre
              precisement a leurs enjeux : pilotage de produits nobles, gestion de menus degustation multi-services,
              cave premium a millesimes, brigades importantes, saisonnalite extreme et KPI Michelin.
            </p>
          </div>
        </div>
      </section>

      {/* ── Specificites gastronomique ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Les 5 specificites du restaurant gastronomique
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Ces particularites expliquent pourquoi un logiciel grand public ne suffit pas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SpecCard
              icon={<Gem className="w-6 h-6" />}
              title="Produits nobles"
              desc="Caviar Beluga (1 800-3 500 EUR/kg), truffe noire (1 200-2 500 EUR/kg), langoustines royales, foie gras IGP, homard breton, pigeon des Costieres. Ces matieres exigent des fiches techniques precises au gramme et un suivi quotidien des cours."
            />
            <SpecCard
              icon={<Clock className="w-6 h-6" />}
              title="Saisonnalite extreme"
              desc="Truffe blanche d'Alba octobre-decembre, truffe noire decembre-mars, gibier septembre-fevrier, asperges blanches mai-juin, fraises gariguette avril-juin. La carte se reinvente toutes les 6 a 8 semaines avec des prix fournisseurs ultra-volatils."
            />
            <SpecCard
              icon={<Users className="w-6 h-6" />}
              title="Brigade importante"
              desc="Ratio 1 cuisinier pour 4 a 6 couverts. Pour 40 couverts/service : 8-10 en cuisine + 6-8 en salle. La masse salariale represente 45-55 % du CA cuisine + 15-20 % salle. Le pilotage du planning est critique."
            />
            <SpecCard
              icon={<Package className="w-6 h-6" />}
              title="Fournisseurs ultra-specialises"
              desc="Maison Petrossian (caviar), Plantin (truffes), Maison Masse (pigeons), Sturia (caviar francais), Bordier (beurre), Joel Robuchon Selection. Ces fournisseurs livrent en allocations limitees avec prix indexes au cours mondial."
            />
            <SpecCard
              icon={<Wine className="w-6 h-6" />}
              title="Cave premium"
              desc="Stock de 50 000 a 200 000 EUR immobilises sur 400 a 2 000 references. Grands crus de Bordeaux, Bourgogne, champagnes vintage, spiritueux d'exception. Gestion par millesimes, allocations producteurs et turnover annuel cave."
            />
            <SpecCard
              icon={<Award className="w-6 h-6" />}
              title="Service en salle premium"
              desc="Maitre d'hotel, sommelier diplome, chefs de rang, decoupage en salle. Le service represente 30 a 40 % de la valeur percue par le client et justifie le ticket eleve. Ratio salle = 1 personne pour 8 a 12 couverts."
            />
          </div>
        </div>
      </section>

      {/* ── Food cost 32-40 % ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
            Food cost cible : 32-40 % (vs 25-35 % en bistrot)
          </h2>
          <p className="text-lg text-mono-400 mb-8 leading-relaxed">
            La premiere difference structurelle entre bistrot et gastronomique reside dans le food cost cible.
            Loin d'etre un signe de mauvaise gestion, ce ratio plus eleve est la consequence directe de l'usage
            de produits nobles dont le cout matiere ne peut pas etre comprime sans denaturer l'experience.
          </p>

          <div className="overflow-x-auto bg-white rounded-2xl border border-mono-900 shadow-sm mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-4 px-4 font-semibold">Type d'etablissement</th>
                  <th className="text-center py-4 px-4 font-semibold">Food cost cible</th>
                  <th className="text-center py-4 px-4 font-semibold">Ticket moyen</th>
                  <th className="text-center py-4 px-4 font-semibold">Marge brute moyenne</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { type: 'Fast food', fc: '28-32 %', tm: '10-15 EUR', mb: '7-11 EUR' },
                  { type: 'Bistrot traditionnel', fc: '28-33 %', tm: '25-40 EUR', mb: '17-28 EUR' },
                  { type: 'Brasserie', fc: '30-35 %', tm: '30-50 EUR', mb: '20-35 EUR' },
                  { type: 'Restaurant semi-gastro', fc: '32-37 %', tm: '60-90 EUR', mb: '40-60 EUR' },
                  { type: 'Restaurant 1 etoile', fc: '34-40 %', tm: '80-180 EUR', mb: '55-110 EUR' },
                  { type: 'Restaurant 2-3 etoiles', fc: '36-42 %', tm: '180-400 EUR', mb: '115-235 EUR' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.type}</td>
                    <td className="py-3 px-4 text-center">{row.fc}</td>
                    <td className="py-3 px-4 text-center">{row.tm}</td>
                    <td className="py-3 px-4 text-center font-semibold text-teal-700">{row.mb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Le piege de la fixation sur le pourcentage.</strong> Beaucoup de chefs nouvellement etoiles
            tentent de descendre leur food cost a 28-30 % en rationalisant les portions ou en substituant des produits.
            Resultat : ils detruisent la promesse de leur restaurant, perdent leur etoile et leurs clients.
            La regle d'or : <strong>raisonner en EUROS de marge brute, pas en pourcentages.</strong>
          </Callout>
        </div>
      </section>

      {/* ── Marge brute en EUROS ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
            La marge brute en EUROS reste tres superieure
          </h2>
          <p className="text-lg text-mono-400 mb-8 leading-relaxed">
            Comparons un plat bistrot et un plat etoile pour comprendre la logique economique reelle.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white border border-mono-900 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Utensils className="w-8 h-8 text-mono-400" />
                <h3 className="text-xl font-bold text-mono-100">Bistrot</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-mono-500">Plat</span><span className="font-medium text-mono-100">Steak frites</span></div>
                <div className="flex justify-between"><span className="text-mono-500">Prix de vente</span><span className="font-bold text-mono-100">18,00 EUR</span></div>
                <div className="flex justify-between"><span className="text-mono-500">Cout matieres</span><span className="text-mono-350">6,00 EUR</span></div>
                <div className="flex justify-between"><span className="text-mono-500">Food cost</span><span className="text-mono-350">33 %</span></div>
                <hr className="border-mono-900" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-mono-100">Marge brute</span>
                  <span className="font-extrabold text-emerald-600">12,00 EUR</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-amber-400 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-8 h-8 text-amber-500" />
                <h3 className="text-xl font-bold text-mono-100">Restaurant etoile</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-mono-500">Plat</span><span className="font-medium text-mono-100">Turbot beurre blanc</span></div>
                <div className="flex justify-between"><span className="text-mono-500">Prix de vente</span><span className="font-bold text-mono-100">65,00 EUR</span></div>
                <div className="flex justify-between"><span className="text-mono-500">Cout matieres</span><span className="text-mono-350">26,00 EUR</span></div>
                <div className="flex justify-between"><span className="text-mono-500">Food cost</span><span className="text-mono-350">40 %</span></div>
                <hr className="border-mono-900" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-mono-100">Marge brute</span>
                  <span className="font-extrabold text-emerald-600">39,00 EUR</span>
                </div>
                <div className="text-xs text-amber-700 font-semibold text-right">3,3x plus de marge en EUROS</div>
              </div>
            </div>
          </div>

          <Callout type="info">
            <strong>Le bistrot a un meilleur ratio (33 % vs 40 %) mais le gastronomique genere 3,3 fois plus
            de marge brute par couvert.</strong> A taux d'occupation egal, le restaurant etoile sera structurellement
            plus rentable... a condition de maitriser ses couts de personnel.
          </Callout>
        </div>
      </section>

      {/* ── Exemple menu degustation 8 services ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
            Exemple chiffre : menu degustation 8 services
          </h2>
          <p className="text-lg text-mono-400 mb-8 leading-relaxed">
            Voici un menu degustation type d'un restaurant 1 etoile francais. Le prix de vente est fixe a
            120 EUR HT (boissons non incluses). Detail des couts matieres par service.
          </p>

          <div className="overflow-x-auto bg-white rounded-2xl border border-mono-900 shadow-sm mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-4 px-4 font-semibold">Service</th>
                  <th className="text-right py-4 px-4 font-semibold">Cout matieres</th>
                  <th className="text-right py-4 px-4 font-semibold">% du total</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {exampleMenu.map((s, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 text-mono-100">{s.service}</td>
                    <td className="py-3 px-4 text-right font-mono">{s.cout.toFixed(2)} EUR</td>
                    <td className="py-3 px-4 text-right text-mono-500">{((s.cout / totalCost) * 100).toFixed(1)} %</td>
                  </tr>
                ))}
                <tr className="bg-amber-50 font-bold border-t-2 border-amber-300">
                  <td className="py-4 px-4 text-mono-100">Total cout matieres</td>
                  <td className="py-4 px-4 text-right text-mono-100 text-lg">{totalCost.toFixed(2)} EUR</td>
                  <td className="py-4 px-4 text-right text-mono-100">100 %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-mono-900 rounded-2xl p-6 text-center">
              <div className="text-xs text-mono-500 uppercase tracking-wider mb-2">Prix de vente HT</div>
              <div className="text-3xl font-extrabold text-mono-100">{sellingPrice} EUR</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <div className="text-xs text-amber-800 uppercase tracking-wider mb-2">Food cost</div>
              <div className="text-3xl font-extrabold text-amber-800">{foodCost} %</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <div className="text-xs text-emerald-800 uppercase tracking-wider mb-2">Marge brute / couvert</div>
              <div className="text-3xl font-extrabold text-emerald-700">{grossMargin.toFixed(2)} EUR</div>
            </div>
          </div>

          <Callout type="info">
            <strong>{grossMargin.toFixed(2)} EUR de marge brute par couvert</strong> sur ce menu degustation.
            Sur un service de 40 couverts pleins : 40 x {grossMargin.toFixed(2)} = <strong>{(grossMargin * 40).toFixed(0)} EUR de marge brute par service</strong>.
            Sur 250 services par an a 70 % d'occupation : 250 x 28 couverts x {grossMargin.toFixed(2)} EUR = <strong>{((250 * 28 * grossMargin) / 1000).toFixed(0)} k EUR/an</strong>.
            Mais attention : il reste a couvrir le personnel, le loyer, les charges...
          </Callout>
        </div>
      </section>

      {/* ── Couts personnel enormes ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
            Mais des couts personnel enormes
          </h2>
          <p className="text-lg text-mono-400 mb-8 leading-relaxed">
            C'est la principale difficulte du modele gastronomique. La brigade et le service en salle pesent
            ensemble 60 a 75 % du CA, contre 30-40 % en bistrot. Cette structure ecrase la marge nette malgre
            une marge brute en EUROS exceptionnelle.
          </p>

          <div className="bg-white border border-mono-900 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-mono-100 mb-4">Structure des couts d'un restaurant 1 etoile type</h3>
            <div className="space-y-3">
              {[
                { label: 'Brigade cuisine (chef + sous-chef + 6-8 commis)', value: 50, color: 'bg-red-400', detail: '45-55 % du CA' },
                { label: 'Service en salle (maitre + sommelier + chefs de rang)', value: 18, color: 'bg-orange-400', detail: '15-20 % du CA' },
                { label: 'Food cost (matieres premieres nobles)', value: 36, color: 'bg-amber-400', detail: '32-40 % du CA' },
                { label: 'Loyer (emplacement premium centre-ville)', value: 8, color: 'bg-yellow-400', detail: '6-10 % du CA' },
                { label: 'Energie, fluides, entretien (cuisines lourdes)', value: 6, color: 'bg-lime-400', detail: '5-7 % du CA' },
                { label: 'Marketing, RP, photographe, site (entretien notoriete)', value: 3, color: 'bg-emerald-400', detail: '2-4 % du CA' },
                { label: 'Charges diverses (assurance, comptable, telephone)', value: 4, color: 'bg-teal-400', detail: '3-5 % du CA' },
                { label: 'Marge nette restante', value: 5, color: 'bg-cyan-500', detail: '5-10 % du CA' },
              ].map((row, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-mono-350 font-medium">{row.label}</span>
                    <span className="text-mono-500 text-xs">{row.detail}</span>
                  </div>
                  <div className="h-6 bg-mono-1000 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${row.color} flex items-center justify-end pr-3 text-xs font-bold text-white`}
                      style={{ width: `${row.value * 1.5}%` }}
                    >
                      {row.value} %
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Callout type="warning">
            <strong>Prime cost = food cost + personnel = 80-90 % du CA.</strong> Le moindre derapage (taux
            d'occupation qui passe de 70 % a 60 %, hausse fournisseur non repercutee, sur-effectif un mardi
            calme) bascule un restaurant en deficit. C'est pour cette raison qu'un logiciel de pilotage temps
            reel est indispensable des qu'on vise une etoile.
          </Callout>
        </div>
      </section>

      {/* ── Cave et vins ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4 flex items-center gap-3">
            <Wine className="w-9 h-9 text-amber-700" />
            Cave et vins : un actif strategique
          </h2>
          <p className="text-lg text-mono-400 mb-8 leading-relaxed">
            Dans un restaurant gastronomique, la cave represente 25 a 40 % du chiffre d'affaires global et
            une part disproportionnee de la marge brute. C'est aussi un investissement lourd qu'il faut piloter
            comme un portefeuille d'actifs.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <div className="text-xs text-mono-500 uppercase tracking-wider mb-2">Marge cave</div>
              <div className="text-3xl font-extrabold text-mono-100 mb-1">65-70 %</div>
              <div className="text-xs text-mono-500">vs 70-75 % bistrot</div>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <div className="text-xs text-mono-500 uppercase tracking-wider mb-2">Stock immobilise</div>
              <div className="text-3xl font-extrabold text-mono-100 mb-1">50-200 k EUR</div>
              <div className="text-xs text-mono-500">400 a 2000 references</div>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <div className="text-xs text-mono-500 uppercase tracking-wider mb-2">Salaire sommelier</div>
              <div className="text-3xl font-extrabold text-mono-100 mb-1">40-55 k EUR</div>
              <div className="text-xs text-mono-500">brut annuel + pourboires</div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-mono-350 leading-relaxed space-y-4">
            <p>
              La marge cave est legerement inferieure au bistrot (65-70 % vs 70-75 %) car les grands crus
              s'achetent a des prix elevats et n'admettent pas un coefficient excessif sous peine de tuer la
              demande. Un Petrus 1990 a 8 000 EUR HT cave ne peut pas etre vendu 24 000 EUR : la salle viserait
              plutot 14 000-16 000 EUR (coefficient 1,75-2).
            </p>
            <p>
              <strong>Le pilotage cave dans RestauMargin</strong> inclut : gestion par millesimes et formats
              (75 cl, magnum, jeroboam), allocations producteurs limitees, coefficient personnalise par categorie
              (vins de garde / vins de service / champagnes / spiritueux), alertes seuil bas, valorisation
              actualisee a la valeur de marche, rotations par cuvee. Le sommelier accede a son propre dashboard
              avec marges, ventes, conseils accords mets-vins.
            </p>
          </div>
        </div>
      </section>

      {/* ── KPI etoile ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-8">
            Les KPI critiques du restaurant Michelin
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <KpiCard
              icon={<Target className="w-6 h-6" />}
              title="Taux d'occupation"
              value="70 % minimum"
              desc="En dessous de 70 % d'occupation sur les services valides, la rentabilite s'effondre. C'est le KPI numero 1 a surveiller quotidiennement."
            />
            <KpiCard
              icon={<Award className="w-6 h-6" />}
              title="Notes guides"
              value="Michelin, Gault et Millau"
              desc="La note Michelin est le principal generateur de reservation (40-60 % du remplissage en 1 etoile). Pertes de toques = -25 % de CA en 6 mois."
            />
            <KpiCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Ticket moyen evolutif"
              value="+3 % a +5 % / an"
              desc="L'inflation oblige a faire evoluer les prix annuellement. Le suivi par categorie (degustation vs carte vs vins) permet d'ajuster sans bruler le client."
            />
            <KpiCard
              icon={<Users className="w-6 h-6" />}
              title="Taux de fidelisation"
              value="35-45 %"
              desc="Un client gastronomique fidele revient 2 a 4 fois par an. Le CRM integre RestauMargin trace les anniversaires, allergies, preferences vin, accompagnants."
            />
            <KpiCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Marge par service"
              value="Lunch vs dinner"
              desc="Le lunch (menu 65-95 EUR) genere souvent moins de marge brute mais lisse l'occupation. Le dinner (menu degustation 120-280 EUR) tire la rentabilite. Equilibre clef."
            />
            <KpiCard
              icon={<Star className="w-6 h-6" />}
              title="Note plateformes"
              value=">4,7 / 5"
              desc="Tripadvisor, La Fourchette, Google : note moyenne <4,7 / 5 = signal d'alerte. Le NPS interne RestauMargin permet de detecter avant que ca tombe sur les plateformes publiques."
            />
          </div>
        </div>
      </section>

      {/* ── Pilotage avec RestauMargin ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
            Pilotage d'un restaurant gastronomique avec RestauMargin
          </h2>
          <p className="text-lg text-mono-400 mb-12 leading-relaxed">
            Le logiciel a ete pense pour les exigences specifiques de la haute gastronomie. Voici les
            fonctionnalites les plus utilisees par nos chefs etoiles.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Scale className="w-6 h-6" />}
              title="Fiches techniques ultra-precises"
              desc="Grammage au gramme pres, rendements de transformation (un homard 600g = 300g de chair noble + 300g de carapace pour bisque), photos signature, allergenes traces, accord vin recommande."
            />
            <FeatureCard
              icon={<Package className="w-6 h-6" />}
              title="Inventaire frequent"
              desc="Inventaire hebdomadaire chambre froide + cave + bar + epicerie. En gastronomie, une perte de truffe a 1 200 EUR/kg n'est pas une perte ordinaire : c'est un drame budgetaire. Alertes anti-vol et anti-gaspillage."
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Suivi par service"
              desc="Lunch 12h-14h vs dinner 19h30-22h analyses separement. Couverts, food cost moyen, ticket moyen, marge brute, taux retour, plats stars du service. Ajustement carte en consequence."
            />
            <FeatureCard
              icon={<Wine className="w-6 h-6" />}
              title="Cave premium dediee"
              desc="Module cave a part : millesimes, allocations, coefficient variable, valorisation marketwatch (la Place de Bordeaux), accord mets-vins recommandes, dashboard sommelier."
            />
            <FeatureCard
              icon={<Calculator className="w-6 h-6" />}
              title="Menus degustation simulables"
              desc="Drag-and-drop des plats individuels pour composer un menu 6, 8 ou 12 services. Recalcul automatique du food cost total, marge brute en EUROS, coefficient global. Versionnage pour tester sans casser."
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="IA pour la saisonnalite"
              desc="Suggestions automatiques de substitutions saisonnieres (truffe noire fin saison -> truffe d'ete + huile de truffe), alertes coursfournisseurs, propositions de menu sur produits du moment."
            />
          </div>

          <div className="text-center mt-12">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-colors text-lg shadow-lg shadow-teal-600/30"
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Cas concret 1 etoile ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
            Cas concret : restaurant 1 etoile a Lyon
          </h2>
          <p className="text-lg text-mono-400 mb-8 leading-relaxed">
            Anonyme par contrat de confidentialite. Restaurant 1 etoile Michelin a Lyon, 35 couverts par service,
            ouvert 5 jours sur 7, equipe de 14 personnes (8 cuisine + 6 salle). CA annuel 1,8 million EUR HT.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border-2 border-red-300 rounded-2xl p-6">
              <div className="text-xs text-red-700 uppercase tracking-wider mb-3 font-bold">Avant RestauMargin (annee N)</div>
              <div className="space-y-2 text-sm text-mono-350">
                <div className="flex justify-between"><span>Food cost</span><span className="font-semibold">43 % (au-dessus cible)</span></div>
                <div className="flex justify-between"><span>Personnel</span><span className="font-semibold">52 % du CA</span></div>
                <div className="flex justify-between"><span>Charges fixes</span><span className="font-semibold">22 % du CA</span></div>
                <div className="flex justify-between"><span>Taux occupation</span><span className="font-semibold">62 %</span></div>
                <div className="flex justify-between"><span>Gaspillage cave</span><span className="font-semibold">18 k EUR/an</span></div>
                <hr className="border-mono-900 my-2" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-mono-100">Marge nette</span>
                  <span className="font-extrabold text-red-700">-2 %</span>
                </div>
                <div className="text-xs text-mono-500 italic">Perte de 36 k EUR sur l'exercice</div>
              </div>
            </div>

            <div className="bg-white border-2 border-emerald-300 rounded-2xl p-6">
              <div className="text-xs text-emerald-700 uppercase tracking-wider mb-3 font-bold">Apres 12 mois (annee N+1)</div>
              <div className="space-y-2 text-sm text-mono-350">
                <div className="flex justify-between"><span>Food cost</span><span className="font-semibold">37 % (-6 pts)</span></div>
                <div className="flex justify-between"><span>Personnel</span><span className="font-semibold">46 % du CA</span></div>
                <div className="flex justify-between"><span>Charges fixes</span><span className="font-semibold">21 % du CA</span></div>
                <div className="flex justify-between"><span>Taux occupation</span><span className="font-semibold">74 % (+12 pts)</span></div>
                <div className="flex justify-between"><span>Gaspillage cave</span><span className="font-semibold">4 k EUR/an</span></div>
                <hr className="border-mono-900 my-2" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-mono-100">Marge nette</span>
                  <span className="font-extrabold text-emerald-700">+12 %</span>
                </div>
                <div className="text-xs text-mono-500 italic">Benefice 216 k EUR sur l'exercice</div>
              </div>
            </div>
          </div>

          <Callout type="info">
            <strong>Les 5 leviers actives en 12 mois :</strong> (1) Fiches techniques refaites au gramme avec
            rendements (-3 pts food cost), (2) Negociation fournisseurs via Mercuriale (-1,5 pts), (3) Planning
            cuisine optimise avec scheduling brigade (-4 pts personnel), (4) Suivi cave avec alertes seuils
            (-14 k EUR gaspillage), (5) Repositionnement menu lunch a 75 EUR pour booster occupation (+12 pts
            occupation). ROI du logiciel : 250 fois l'abonnement annuel.
          </Callout>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              FAQ logiciel marge restaurant gastronomique
            </h2>
            <p className="text-lg text-mono-400">
              Les questions frequentes des chefs etoiles avant de choisir.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>

          <Callout type="info">
            <strong>Une question specifique sur votre etablissement ?</strong> Contactez notre equipe via
            la <Link to="/demo" className="underline font-semibold hover:text-teal-700">page demo</Link> ou
            ecrivez a contact@restaumargin.fr. Nous avons des references de restaurants etoiles a vous partager.
          </Callout>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Crown className="w-12 h-12 mx-auto mb-6 text-amber-200" />
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6">
            Pret a piloter vos marges comme un grand chef ?
          </h2>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-3">
            Rejoignez les restaurants gastronomiques qui ont restaure leur rentabilite tout en preservant
            l'excellence de leur cuisine.
          </p>
          <p className="text-amber-50 mb-10">
            Essai gratuit 7 jours - Sans carte bancaire - Sans engagement
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-amber-800 font-extrabold rounded-full hover:bg-amber-50 transition-colors text-lg shadow-2xl"
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-10 py-5 border-2 border-white/40 text-white font-bold rounded-full hover:bg-white/10 transition-colors text-lg"
            >
              Voir la demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Maillage interne ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-mono-100 mb-8 text-center">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/blog/fiche-technique-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <FileText className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Fiche technique restaurant</h3>
              <p className="text-sm text-mono-500">Comment construire des fiches techniques au gramme pres pour produits nobles.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Users className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Reduire le cout personnel</h3>
              <p className="text-sm text-mono-500">Strategies pour piloter une brigade gastronomique sans sacrifier le service.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Calculator className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Coefficient multiplicateur</h3>
              <p className="text-sm text-mono-500">Calcul du coefficient pour fixer les prix de vente en gastronomie.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Sparkles className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Essai gratuit 7 jours</h3>
              <p className="text-sm text-mono-500">Testez RestauMargin sur votre etablissement sans carte bancaire.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-mono-500">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">Le logiciel de marge restaurant le plus complet du marche francais.</p>
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

function SpecCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-amber-300 hover:shadow-md transition-all">
      <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-mono-100 mb-2 text-lg">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-md transition-all">
      <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-mono-100 mb-2 text-lg">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function KpiCard({ icon, title, value, desc }: { icon: React.ReactNode; title: string; value: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-mono-100">{title}</h3>
          <div className="text-lg font-extrabold text-teal-700">{value}</div>
        </div>
      </div>
      <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = type === 'info'
    ? 'bg-blue-50 border-blue-200 text-blue-800'
    : 'bg-amber-50 border-amber-200 text-amber-800';
  const Icon = type === 'info' ? Lightbulb : AlertTriangle;
  return (
    <div className={`${styles} border rounded-xl p-5 mt-8 flex gap-3 text-sm leading-relaxed`}>
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
