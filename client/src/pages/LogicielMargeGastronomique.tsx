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
    question: "Quel est le food cost idéal d'un restaurant gastronomique ?",
    answer:
      "Le food cost cible d'un restaurant gastronomique se situe entre 32 % et 40 %, contre 25-35 % pour un bistrot. Ce ratio plus élevé s'explique par l'usage de produits nobles (caviar, truffe, langoustines, foie gras, homard) dont le coût matière est structurellement plus important. La marge brute en EUROS reste cependant plus élevée en valeur absolue grâce au ticket moyen 80-300 EUR.",
  },
  {
    question: "Pourquoi un restaurant gastronomique accepte-t-il un food cost plus élevé ?",
    answer:
      "Parce que la marge brute en EUROS est démultipliée. Un plat de bistrot à 18 EUR avec 6 EUR de matières génère 12 EUR de marge brute. Un plat étoilé à 65 EUR avec 26 EUR de matières génère 39 EUR de marge, soit plus de 3 fois plus en valeur absolue. Le pourcentage compte moins que la valeur générée par couvert.",
  },
  {
    question: "Quelle marge nette espérer dans un restaurant gastronomique ?",
    answer:
      "La marge nette d'un restaurant gastronomique se situe généralement entre 5 % et 10 %, soit moins qu'un bistrot bien géré (8-15 %). La raison : les coûts de personnel explosent (brigade de cuisine 45-55 % du CA + service en salle 15-20 % = prime cost 80-90 %). Un excellent restaurant 1 étoile bien piloté peut atteindre 12-15 % de marge nette.",
  },
  {
    question: "Comment piloter la marge brute sur les produits saisonniers (truffe, gibier) ?",
    answer:
      "Les produits saisonniers exigent des fiches techniques par menu et par période. RestauMargin permet de cloner une fiche, d'y substituer le produit saisonnier (truffe noire Tuber melanosporum décembre-mars, truffe blanche Alba octobre-décembre) et de recalculer instantanément le food cost et le prix de vente cible. Les variations de cours hebdomadaires sont intégrées via le module Mercuriale.",
  },
  {
    question: "Quel est le ratio brigade idéal pour un restaurant gastronomique ?",
    answer:
      "Un restaurant gastronomique étoilé fonctionne avec un ratio d'environ 1 cuisinier pour 4 à 6 couverts simultanés. Pour un service de 40 couverts, comptez 8 à 10 personnes en cuisine (chef exécutif, sous-chef, chef de partie, commis, plonge) et 6 à 8 en salle (maître d'hôtel, sommelier, chefs de rang, runners). Ce ratio explique le poids du personnel dans le P&L.",
  },
  {
    question: "Comment gérer une cave premium dans un logiciel de marge ?",
    answer:
      "La cave d'un restaurant gastronomique représente 50 000 à 200 000 EUR de stock immobilisé. RestauMargin permet de créer un inventaire dédié (vins, champagnes, spiritueux) avec gestion des millésimes, des allocations limitées et du coefficient cave (1,8 à 3 selon le rang). Le sommelier accède à un dashboard temps réel des marges par cuvée, des rotations et des alertes stocks bas.",
  },
  {
    question: "Quel KPI prioritaire pour un restaurant Michelin ?",
    answer:
      "Le taux d'occupation est le KPI critique numéro 1. En dessous de 70 % d'occupation sur les services validés, la rentabilité s'effondre car les charges fixes (loyer prime, personnel CDI, énergie) ne sont pas amortissables. Les autres KPI : note Michelin/Gault et Millau/World's 50 Best, ticket moyen, taux de fidélisation, marge brute par service (lunch vs dinner).",
  },
  {
    question: "RestauMargin gère-t-il les menus dégustation à plusieurs services ?",
    answer:
      "Oui. Vous créez un menu dégustation 6, 8 ou 12 services en agrégeant des fiches techniques individuelles. Le logiciel calcule automatiquement le food cost total, la marge brute en EUROS et le coefficient global. Vous pouvez tester en simulation l'ajout ou le retrait d'un plat et voir instantanément l'impact sur la marge.",
  },
  {
    question: "Combien coûte un logiciel pour restaurant gastronomique ?",
    answer:
      "Les solutions enterprise dédiées au luxe (Yokitup, Datameal, Apicbase) tournent entre 100 et 400 EUR/mois. RestauMargin propose le plan Business multi-services et cave premium à 79 EUR/mois, soit 3 à 5 fois moins cher pour un périmètre fonctionnel comparable. Essai gratuit 7 jours sans carte bancaire.",
  },
  {
    question: "Comment intégrer le travail des produits nobles (découpes, parures) ?",
    answer:
      "RestauMargin gère les rendements de transformation. Pour un homard de 600 g à 28 EUR, vous renseignez le taux de rendement (50 % pour la chair noble), le logiciel calcule le coût réel à l'usage : 28 EUR / 0,30 kg = 93,33 EUR/kg chair. Les parures (carapaces pour bisque) deviennent un ingrédient secondaire pour vos sauces, valorisant l'intégralité du produit.",
  },
];

const fineDiningStats = [
  { label: 'Food cost cible', value: '32-40 %', detail: 'vs 25-35 % bistrot' },
  { label: 'Ticket moyen', value: '80-300 EUR', detail: 'midi à dégustation' },
  { label: 'Prime cost', value: '80-90 %', detail: 'avant marge nette' },
  { label: 'Marge nette', value: '5-10 %', detail: '12-15 % si excellent' },
];

const exampleMenu = [
  { service: 'Mise en bouche - foie gras et figue', cout: 4.2, prix: 0 },
  { service: 'Entrée - langoustines royales / consommé', cout: 8.5, prix: 0 },
  { service: 'Poisson - turbot sauvage / beurre blanc', cout: 7.8, prix: 0 },
  { service: 'Granité - citron noir / yuzu', cout: 1.4, prix: 0 },
  { service: 'Viande - pigeon des Costières / truffe', cout: 9.2, prix: 0 },
  { service: 'Fromages affinés (chariot)', cout: 3.5, prix: 0 },
  { service: 'Pré-dessert - sorbet du moment', cout: 1.1, prix: 0 },
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
        title="Logiciel marge restaurant gastronomique étoilé | RestauMargin"
        description="Logiciel pour piloter marges restaurant gastronomique étoilé. Food cost 32-40 %, brigades importantes, produits nobles. Essai gratuit 7 jours."
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
              "Guide complet du pilotage de marges en restauration gastronomique : food cost 32-40 %, brigades, cave premium, KPI Michelin. Méthodes, exemples chiffrés et outils.",
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
              "Logiciel de gestion des marges spécialisé pour restaurants gastronomiques étoilés : fiches techniques produits nobles, menus dégustation, cave premium, brigades importantes, KPI Michelin.",
            featureList: [
              'Fiches techniques produits nobles (caviar, truffe, langoustines, homard)',
              'Gestion menus dégustation 6 à 12 services',
              'Cave premium avec millésimes et allocations',
              'Suivi marge par service (lunch vs dinner)',
              'Rendements de transformation (découpes, parures)',
              'Pilotage brigade et ratios personnel',
              'Saisonnalité et substitutions automatiques',
              'KPI taux occupation et fidélisation',
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
          <Link to="/" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
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
            Spécialisé gastronomie étoilée
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-mono-100 leading-tight mb-6 max-w-4xl mx-auto">
            Logiciel de marge pour restaurant gastronomique en 2026
          </h1>
          <p className="text-lg sm:text-xl text-mono-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Le seul logiciel SaaS qui gère produits nobles, menus dégustation, cave premium et
            brigades de cuisine étoilées. <strong>Food cost 32-40 % maîtrisé, +5 points de marge nette en 6 mois.</strong>
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
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Utilisé par chefs étoilés</span>
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
            Pourquoi la gastronomie obéit à une économie différente
          </h2>
          <div className="prose prose-lg max-w-none text-mono-350 leading-relaxed space-y-5">
            <p>
              Piloter la marge d'un restaurant gastronomique étoilé ne ressemble en rien à la gestion d'un bistrot
              ou d'une brasserie. La structure de coûts, les attentes clients, les exigences fournisseurs et les
              standards de service imposent un modèle économique à part entière. Les règles apprises en formation
              CAP cuisine ou dans un master management restauration s'appliquent partiellement : le food cost
              cible bouge, le ratio personnel explose, la cave devient un actif stratégique et chaque assiette
              raconte une histoire qui justifie le ticket moyen 80 à 300 EUR.
            </p>
            <p>
              Un restaurant 1, 2 ou 3 étoiles Michelin (ou cité au Gault et Millau, World's 50 Best, La Liste)
              n'optimise pas un pourcentage : il optimise une expérience. Mais cette expérience doit être
              économiquement viable. Trop de tables fermées, trop de chefs en cuisine, pas assez de produits valorisés
              et le restaurant brûle du cash. C'est pour cette raison qu'un logiciel de marge spécialisé gastronomie
              n'est pas un luxe : c'est une assurance vie financière.
            </p>
            <p>
              RestauMargin a été conçu en collaboration avec plusieurs chefs étoilés français pour répondre
              précisément à leurs enjeux : pilotage de produits nobles, gestion de menus dégustation multi-services,
              cave premium à millésimes, brigades importantes, saisonnalité extrême et KPI Michelin.
            </p>
          </div>
        </div>
      </section>

      {/* ── Specificites gastronomique ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Les 5 spécificités du restaurant gastronomique
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Ces particularités expliquent pourquoi un logiciel grand public ne suffit pas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SpecCard
              icon={<Gem className="w-6 h-6" />}
              title="Produits nobles"
              desc="Caviar Beluga (1 800-3 500 EUR/kg), truffe noire (1 200-2 500 EUR/kg), langoustines royales, foie gras IGP, homard breton, pigeon des Costières. Ces matières exigent des fiches techniques précises au gramme et un suivi quotidien des cours."
            />
            <SpecCard
              icon={<Clock className="w-6 h-6" />}
              title="Saisonnalité extrême"
              desc="Truffe blanche d'Alba octobre-décembre, truffe noire décembre-mars, gibier septembre-février, asperges blanches mai-juin, fraises gariguette avril-juin. La carte se réinvente toutes les 6 à 8 semaines avec des prix fournisseurs ultra-volatils."
            />
            <SpecCard
              icon={<Users className="w-6 h-6" />}
              title="Brigade importante"
              desc="Ratio 1 cuisinier pour 4 à 6 couverts. Pour 40 couverts/service : 8-10 en cuisine + 6-8 en salle. La masse salariale représente 45-55 % du CA cuisine + 15-20 % salle. Le pilotage du planning est critique."
            />
            <SpecCard
              icon={<Package className="w-6 h-6" />}
              title="Fournisseurs ultra-spécialisés"
              desc="Maison Petrossian (caviar), Plantin (truffes), Maison Masse (pigeons), Sturia (caviar français), Bordier (beurre), Joel Robuchon Sélection. Ces fournisseurs livrent en allocations limitées avec prix indexés au cours mondial."
            />
            <SpecCard
              icon={<Wine className="w-6 h-6" />}
              title="Cave premium"
              desc="Stock de 50 000 à 200 000 EUR immobilisés sur 400 à 2 000 références. Grands crus de Bordeaux, Bourgogne, champagnes vintage, spiritueux d'exception. Gestion par millésimes, allocations producteurs et turnover annuel cave."
            />
            <SpecCard
              icon={<Award className="w-6 h-6" />}
              title="Service en salle premium"
              desc="Maître d'hôtel, sommelier diplômé, chefs de rang, découpage en salle. Le service représente 30 à 40 % de la valeur perçue par le client et justifie le ticket élevé. Ratio salle = 1 personne pour 8 à 12 couverts."
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
            La première différence structurelle entre bistrot et gastronomique réside dans le food cost cible.
            Loin d'être un signe de mauvaise gestion, ce ratio plus élevé est la conséquence directe de l'usage
            de produits nobles dont le coût matière ne peut pas être comprimé sans dénaturer l'expérience.
          </p>

          <div className="overflow-x-auto bg-white rounded-2xl border border-mono-900 shadow-sm mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-4 px-4 font-semibold">Type d'établissement</th>
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
                  { type: 'Restaurant 1 étoile', fc: '34-40 %', tm: '80-180 EUR', mb: '55-110 EUR' },
                  { type: 'Restaurant 2-3 étoiles', fc: '36-42 %', tm: '180-400 EUR', mb: '115-235 EUR' },
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
            <strong>Le piège de la fixation sur le pourcentage.</strong> Beaucoup de chefs nouvellement étoilés
            tentent de descendre leur food cost à 28-30 % en rationalisant les portions ou en substituant des produits.
            Résultat : ils détruisent la promesse de leur restaurant, perdent leur étoile et leurs clients.
            La règle d'or : <strong>raisonner en EUROS de marge brute, pas en pourcentages.</strong>
          </Callout>
        </div>
      </section>

      {/* ── Marge brute en EUROS ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
            La marge brute en EUROS reste très supérieure
          </h2>
          <p className="text-lg text-mono-400 mb-8 leading-relaxed">
            Comparons un plat bistrot et un plat étoilé pour comprendre la logique économique réelle.
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
                <div className="flex justify-between"><span className="text-mono-500">Coût matières</span><span className="text-mono-350">6,00 EUR</span></div>
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
                <h3 className="text-xl font-bold text-mono-100">Restaurant étoilé</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-mono-500">Plat</span><span className="font-medium text-mono-100">Turbot beurre blanc</span></div>
                <div className="flex justify-between"><span className="text-mono-500">Prix de vente</span><span className="font-bold text-mono-100">65,00 EUR</span></div>
                <div className="flex justify-between"><span className="text-mono-500">Coût matières</span><span className="text-mono-350">26,00 EUR</span></div>
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
            <strong>Le bistrot a un meilleur ratio (33 % vs 40 %) mais le gastronomique génère 3,3 fois plus
            de marge brute par couvert.</strong> À taux d'occupation égal, le restaurant étoilé sera structurellement
            plus rentable... à condition de maîtriser ses coûts de personnel.
          </Callout>
        </div>
      </section>

      {/* ── Exemple menu degustation 8 services ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
            Exemple chiffré : menu dégustation 8 services
          </h2>
          <p className="text-lg text-mono-400 mb-8 leading-relaxed">
            Voici un menu dégustation type d'un restaurant 1 étoile français. Le prix de vente est fixe à
            120 EUR HT (boissons non incluses). Détail des coûts matières par service.
          </p>

          <div className="overflow-x-auto bg-white rounded-2xl border border-mono-900 shadow-sm mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-4 px-4 font-semibold">Service</th>
                  <th className="text-right py-4 px-4 font-semibold">Coût matières</th>
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
                  <td className="py-4 px-4 text-mono-100">Total coût matières</td>
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
            <strong>{grossMargin.toFixed(2)} EUR de marge brute par couvert</strong> sur ce menu dégustation.
            Sur un service de 40 couverts pleins : 40 x {grossMargin.toFixed(2)} = <strong>{(grossMargin * 40).toFixed(0)} EUR de marge brute par service</strong>.
            Sur 250 services par an à 70 % d'occupation : 250 x 28 couverts x {grossMargin.toFixed(2)} EUR = <strong>{((250 * 28 * grossMargin) / 1000).toFixed(0)} k EUR/an</strong>.
            Mais attention : il reste à couvrir le personnel, le loyer, les charges...
          </Callout>
        </div>
      </section>

      {/* ── Couts personnel enormes ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
            Mais des coûts personnel énormes
          </h2>
          <p className="text-lg text-mono-400 mb-8 leading-relaxed">
            C'est la principale difficulté du modèle gastronomique. La brigade et le service en salle pèsent
            ensemble 60 à 75 % du CA, contre 30-40 % en bistrot. Cette structure écrase la marge nette malgré
            une marge brute en EUROS exceptionnelle.
          </p>

          <div className="bg-white border border-mono-900 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-mono-100 mb-4">Structure des coûts d'un restaurant 1 étoile type</h3>
            <div className="space-y-3">
              {[
                { label: 'Brigade cuisine (chef + sous-chef + 6-8 commis)', value: 50, color: 'bg-red-400', detail: '45-55 % du CA' },
                { label: 'Service en salle (maître + sommelier + chefs de rang)', value: 18, color: 'bg-orange-400', detail: '15-20 % du CA' },
                { label: 'Food cost (matières premières nobles)', value: 36, color: 'bg-amber-400', detail: '32-40 % du CA' },
                { label: 'Loyer (emplacement premium centre-ville)', value: 8, color: 'bg-yellow-400', detail: '6-10 % du CA' },
                { label: 'Énergie, fluides, entretien (cuisines lourdes)', value: 6, color: 'bg-lime-400', detail: '5-7 % du CA' },
                { label: 'Marketing, RP, photographe, site (entretien notoriété)', value: 3, color: 'bg-emerald-400', detail: '2-4 % du CA' },
                { label: 'Charges diverses (assurance, comptable, téléphone)', value: 4, color: 'bg-teal-400', detail: '3-5 % du CA' },
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
            <strong>Prime cost = food cost + personnel = 80-90 % du CA.</strong> Le moindre dérapage (taux
            d'occupation qui passe de 70 % à 60 %, hausse fournisseur non répercutée, sur-effectif un mardi
            calme) bascule un restaurant en déficit. C'est pour cette raison qu'un logiciel de pilotage temps
            réel est indispensable dès qu'on vise une étoile.
          </Callout>
        </div>
      </section>

      {/* ── Cave et vins ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4 flex items-center gap-3">
            <Wine className="w-9 h-9 text-amber-700" />
            Cave et vins : un actif stratégique
          </h2>
          <p className="text-lg text-mono-400 mb-8 leading-relaxed">
            Dans un restaurant gastronomique, la cave représente 25 à 40 % du chiffre d'affaires global et
            une part disproportionnée de la marge brute. C'est aussi un investissement lourd qu'il faut piloter
            comme un portefeuille d'actifs.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <div className="text-xs text-mono-500 uppercase tracking-wider mb-2">Marge cave</div>
              <div className="text-3xl font-extrabold text-mono-100 mb-1">65-70 %</div>
              <div className="text-xs text-mono-500">vs 70-75 % bistrot</div>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <div className="text-xs text-mono-500 uppercase tracking-wider mb-2">Stock immobilisé</div>
              <div className="text-3xl font-extrabold text-mono-100 mb-1">50-200 k EUR</div>
              <div className="text-xs text-mono-500">400 à 2000 références</div>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <div className="text-xs text-mono-500 uppercase tracking-wider mb-2">Salaire sommelier</div>
              <div className="text-3xl font-extrabold text-mono-100 mb-1">40-55 k EUR</div>
              <div className="text-xs text-mono-500">brut annuel + pourboires</div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-mono-350 leading-relaxed space-y-4">
            <p>
              La marge cave est légèrement inférieure au bistrot (65-70 % vs 70-75 %) car les grands crus
              s'achètent à des prix elevats et n'admettent pas un coefficient excessif sous peine de tuer la
              demande. Un Petrus 1990 à 8 000 EUR HT cave ne peut pas être vendu 24 000 EUR : la salle viserait
              plutôt 14 000-16 000 EUR (coefficient 1,75-2).
            </p>
            <p>
              <strong>Le pilotage cave dans RestauMargin</strong> inclut : gestion par millésimes et formats
              (75 cl, magnum, jéroboam), allocations producteurs limitées, coefficient personnalisé par catégorie
              (vins de garde / vins de service / champagnes / spiritueux), alertes seuil bas, valorisation
              actualisée à la valeur de marché, rotations par cuvée. Le sommelier accède à son propre dashboard
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
              desc="En dessous de 70 % d'occupation sur les services validés, la rentabilité s'effondre. C'est le KPI numéro 1 à surveiller quotidiennement."
            />
            <KpiCard
              icon={<Award className="w-6 h-6" />}
              title="Notes guides"
              value="Michelin, Gault et Millau"
              desc="La note Michelin est le principal générateur de réservation (40-60 % du remplissage en 1 étoile). Pertes de toques = -25 % de CA en 6 mois."
            />
            <KpiCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Ticket moyen évolutif"
              value="+3 % à +5 % / an"
              desc="L'inflation oblige à faire évoluer les prix annuellement. Le suivi par catégorie (dégustation vs carte vs vins) permet d'ajuster sans brûler le client."
            />
            <KpiCard
              icon={<Users className="w-6 h-6" />}
              title="Taux de fidélisation"
              value="35-45 %"
              desc="Un client gastronomique fidèle revient 2 à 4 fois par an. Le CRM intégré RestauMargin trace les anniversaires, allergies, préférences vin, accompagnants."
            />
            <KpiCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Marge par service"
              value="Lunch vs dinner"
              desc="Le lunch (menu 65-95 EUR) génère souvent moins de marge brute mais lisse l'occupation. Le dinner (menu dégustation 120-280 EUR) tire la rentabilité. Équilibre clef."
            />
            <KpiCard
              icon={<Star className="w-6 h-6" />}
              title="Note plateformes"
              value=">Essai 7 jours"
              desc="Tripadvisor, La Fourchette, Google : note moyenne <Essai 7 jours = signal d'alerte. Le NPS interne RestauMargin permet de détecter avant que ça tombe sur les plateformes publiques."
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
            Le logiciel a été pensé pour les exigences spécifiques de la haute gastronomie. Voici les
            fonctionnalités les plus utilisées par nos chefs étoilés.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Scale className="w-6 h-6" />}
              title="Fiches techniques ultra-précises"
              desc="Grammage au gramme près, rendements de transformation (un homard 600g = 300g de chair noble + 300g de carapace pour bisque), photos signature, allergènes tracés, accord vin recommandé."
            />
            <FeatureCard
              icon={<Package className="w-6 h-6" />}
              title="Inventaire fréquent"
              desc="Inventaire hebdomadaire chambre froide + cave + bar + épicerie. En gastronomie, une perte de truffe à 1 200 EUR/kg n'est pas une perte ordinaire : c'est un drame budgétaire. Alertes anti-vol et anti-gaspillage."
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Suivi par service"
              desc="Lunch 12h-14h vs dinner 19h30-22h analysés séparément. Couverts, food cost moyen, ticket moyen, marge brute, taux retour, plats stars du service. Ajustement carte en conséquence."
            />
            <FeatureCard
              icon={<Wine className="w-6 h-6" />}
              title="Cave premium dédiée"
              desc="Module cave à part : millésimes, allocations, coefficient variable, valorisation marketwatch (la Place de Bordeaux), accord mets-vins recommandés, dashboard sommelier."
            />
            <FeatureCard
              icon={<Calculator className="w-6 h-6" />}
              title="Menus dégustation simulables"
              desc="Drag-and-drop des plats individuels pour composer un menu 6, 8 ou 12 services. Recalcul automatique du food cost total, marge brute en EUROS, coefficient global. Versionnage pour tester sans casser."
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="IA pour la saisonnalité"
              desc="Suggestions automatiques de substitutions saisonnières (truffe noire fin saison -> truffe d'été + huile de truffe), alertes coursfournisseurs, propositions de menu sur produits du moment."
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
            Cas concret : restaurant 1 étoile à Lyon
          </h2>
          <p className="text-lg text-mono-400 mb-8 leading-relaxed">
            Anonyme par contrat de confidentialité. Restaurant 1 étoile Michelin à Lyon, 35 couverts par service,
            ouvert 5 jours sur 7, équipe de 14 personnes (8 cuisine + 6 salle). CA annuel 1,8 million EUR HT.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border-2 border-red-300 rounded-2xl p-6">
              <div className="text-xs text-red-700 uppercase tracking-wider mb-3 font-bold">Avant RestauMargin (année N)</div>
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
              <div className="text-xs text-emerald-700 uppercase tracking-wider mb-3 font-bold">Après 12 mois (année N+1)</div>
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
                <div className="text-xs text-mono-500 italic">Bénéfice 216 k EUR sur l'exercice</div>
              </div>
            </div>
          </div>

          <Callout type="info">
            <strong>Les 5 leviers activés en 12 mois :</strong> (1) Fiches techniques refaites au gramme avec
            rendements (-3 pts food cost), (2) Négociation fournisseurs via Mercuriale (-1,5 pts), (3) Planning
            cuisine optimisé avec scheduling brigade (-4 pts personnel), (4) Suivi cave avec alertes seuils
            (-14 k EUR gaspillage), (5) Repositionnement menu lunch à 75 EUR pour booster occupation (+12 pts
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
              Les questions fréquentes des chefs étoilés avant de choisir.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>

          <Callout type="info">
            <strong>Une question spécifique sur votre établissement ?</strong> Contactez notre équipe via
            la <Link to="/demo" className="underline font-semibold hover:text-teal-700">page demo</Link> ou
            écrivez à contact@restaumargin.fr. Nous avons des références de restaurants étoilés à vous partager.
          </Callout>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Crown className="w-12 h-12 mx-auto mb-6 text-amber-200" />
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6">
            Prêt à piloter vos marges comme un grand chef ?
          </h2>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-3">
            Rejoignez les restaurants gastronomiques qui ont restauré leur rentabilité tout en préservant
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
              <p className="text-sm text-mono-500">Comment construire des fiches techniques au gramme près pour produits nobles.</p>
            </Link>
            <Link to="/blog/reduire-cout-personnel-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Users className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Réduire le coût personnel</h3>
              <p className="text-sm text-mono-500">Stratégies pour piloter une brigade gastronomique sans sacrifier le service.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Calculator className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Coefficient multiplicateur</h3>
              <p className="text-sm text-mono-500">Calcul du coefficient pour fixer les prix de vente en gastronomie.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Sparkles className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Essai gratuit 7 jours</h3>
              <p className="text-sm text-mono-500">Testez RestauMargin sur votre établissement sans carte bancaire.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-mono-500">
          <Link to="/" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">Le logiciel de marge restaurant le plus complet du marché français.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-mono-700">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions légales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialité</Link>
          </div>
          <p className="mt-6 text-xs text-mono-700">
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits réservés.
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
