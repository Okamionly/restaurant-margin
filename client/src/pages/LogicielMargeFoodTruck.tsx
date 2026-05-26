import { Link } from 'react-router-dom';
import {
  ChefHat,
  Calculator,
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Cloud,
  BarChart3,
  Receipt,
  Bell,
  Users,
  Star,
  AlertTriangle,
  Lightbulb,
  Brain,
  TrendingUp,
  Target,
  Truck,
  MapPin,
  CloudRain,
  Calendar,
  Package,
  Flame,
  Euro,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Landing niche — Logiciel marge food truck
   Mot-clé principal : logiciel marge food truck
   Différencié de BlogFoodTruck (guide créa) — focus produit/logiciel
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Pourquoi un logiciel de marge specifique pour food truck ?",
    answer:
      "Un food truck a des contraintes uniques qu'un logiciel resto generaliste ignore : capacite limitee (50-150 couverts/service), dependance meteo, multi-emplacements avec couts variables, absence de loyer fixe remplacee par location quotidienne (50-200 EUR/jour), saisonnalite marquee, et flux de production en chaine ultra-rapide. RestauMargin integre tous ces parametres pour calculer une marge realiste, emplacement par emplacement.",
  },
  {
    question: "Quel food cost cible pour un food truck en 2026 ?",
    answer:
      "Le food cost cible food truck se situe entre 28 % et 33 %, soit legerement plus bas qu'un restaurant traditionnel (30-35 %). Cette discipline est necessaire car les charges fixes sont plus faibles, donc la marge brute par plat doit financer la mobilite, le carburant, l'amortissement vehicule, les permis ambulants et la location des emplacements. Un burger food truck a 11 EUR pour 3,30 EUR de cout matieres = 30 % de food cost, ratio idealement vise.",
  },
  {
    question: "Le logiciel gere-t-il plusieurs emplacements ?",
    answer:
      "Oui. RestauMargin permet de creer un emplacement par lieu (marche du samedi, zone bureaux la Defense, festival d'ete, etc.) avec ses propres couts (loyer journalier, electricite forfaitaire, deplacement), son CA par service et son taux de retour client. Vous obtenez un classement automatique des emplacements les plus rentables et un seuil de rentabilite par lieu.",
  },
  {
    question: "Comment integrer la meteo dans le calcul de marge ?",
    answer:
      "Le module previsions analyse votre historique CA croise avec la meteo locale (API OpenWeather integree) pour predire votre niveau d'activite : un samedi pluvieux en zone bureaux baisse de 40-60 %, un dimanche ensoleille en zone festival monte de 80-120 %. Le logiciel ajuste vos previsions de stock et alerte sur le risque de gaspillage / rupture par service.",
  },
  {
    question: "Combien coute le logiciel pour un food truck independant ?",
    answer:
      "RestauMargin Pro coute 29 EUR/mois pour un food truck independant : illimite en plats, emplacements, fiches techniques et scans de factures. L'investissement se rentabilise des le premier mois en evitant ne serait-ce qu'un gaspillage par mauvaise estimation meteo (15-30 EUR economises par service). Essai gratuit 7 jours sans carte bancaire.",
  },
  {
    question: "Le logiciel fonctionne-t-il dans le camion sans Wi-Fi ?",
    answer:
      "Oui. RestauMargin est une PWA (Progressive Web App) avec mode hors-ligne complet. Vous saisissez vos commandes, encaissements et stocks dans le truck meme sans 4G. La synchronisation se fait automatiquement des que vous retrouvez du reseau (retour au laboratoire ou zone couverte). Aucune donnee perdue.",
  },
  {
    question: "Comment gerer la preparation centralisee en laboratoire ?",
    answer:
      "Le module laboratoire permet de declarer une production en amont (ex : 30 kg de boulettes preparees lundi pour 5 services semaine). Le logiciel deduit automatiquement du stock laboratoire a chaque vente, calcule le taux d'utilisation reel vs prevu, et detecte le gaspillage de production. Ideal pour les food trucks avec laboratoire fixe declare DDPP.",
  },
  {
    question: "Que faire si je vends en evenementiel B2B (festivals, mariages) ?",
    answer:
      "Le mode evenementiel cree un projet ponctuel avec ses propres prix (souvent forfait global ou prix groupe), son cout matieres dedie, sa marge cible (40-50 % brute typique pour B2B), et son rapport de rentabilite post-event. Vous facturez le client B2B directement depuis le logiciel et tracez la marge nette evenement / evenement.",
  },
  {
    question: "Peut-on suivre le carburant et le gaz comme charges variables ?",
    answer:
      "Oui. Le module charges variables food truck distingue carburant deplacement (km parcouru x cout/km), gaz cuisson (bouteilles butane/propane consommees par service), eau, electricite forfait emplacement. Ces couts s'imputent automatiquement sur le bon emplacement pour un calcul de marge nette par lieu fiable.",
  },
  {
    question: "Le logiciel est-il certifie pour la conformite hygiene HACCP ?",
    answer:
      "RestauMargin inclut un module HACCP food truck adapte : releves temperature frigo / chambre froide / vehicule (obligatoire ambulant), tracabilite lots reception, plan de nettoyage, formation 14h validee. Vous generez les rapports DDPP en 2 clics en cas de controle. Conforme reglementation 2026 (paquet hygiene UE).",
  },
];

const testimonials = [
  {
    name: 'Julien Mercier',
    role: 'Fondateur Food Truck',
    company: 'Burger Brothers, Lyon',
    text: "Avant RestauMargin, je tournais a 18 % de marge nette en pensant en faire 25. Le logiciel m'a montre que mon emplacement du jeudi soir etait deficitaire : 80 EUR de location + 60 EUR de carburant pour 280 EUR de CA. J'ai bascule sur la zone Confluence, je suis a 28 % de marge nette aujourd'hui.",
    rating: 5,
  },
  {
    name: 'Camille Dufour',
    role: 'Cheffe-proprietaire',
    company: 'La Roulotte Bio, Bordeaux',
    text: "Le mode hors-ligne dans le camion change tout. Plus de Wi-Fi qui rame en plein service. Je rentre mes ventes en temps reel, le food cost s'ajuste, et le soir au laboratoire tout est consolide. Gain de 4h/semaine sur la compta.",
    rating: 5,
  },
  {
    name: 'Karim Benali',
    role: 'Gerant 2 trucks',
    company: 'Couscous Express, Marseille',
    text: "Le multi-truck consolide tout. Je vois en un coup d'oeil quel truck gagne le plus, quel emplacement plombe, quel plat ne se vend pas. Resultat : j'ai retire 3 plats de la carte, gagne 5 points de marge brute en 4 mois.",
    rating: 5,
  },
];

const platsFoodTruck = [
  { plat: 'Burger signature 150g', cout: '3,30 EUR', pv: '11 EUR', foodCost: '30 %', marge: '7,70 EUR' },
  { plat: 'Burger vegan / poulet', cout: '2,80 EUR', pv: '10 EUR', foodCost: '28 %', marge: '7,20 EUR' },
  { plat: 'Tacos M (boeuf + frites)', cout: '2,40 EUR', pv: '9 EUR', foodCost: '27 %', marge: '6,60 EUR' },
  { plat: 'Bowl healthy poulet', cout: '3,10 EUR', pv: '11,50 EUR', foodCost: '27 %', marge: '8,40 EUR' },
  { plat: 'Pizza napolitaine 28cm', cout: '2,90 EUR', pv: '12 EUR', foodCost: '24 %', marge: '9,10 EUR' },
  { plat: 'Wrap saumon avocat', cout: '3,40 EUR', pv: '11 EUR', foodCost: '31 %', marge: '7,60 EUR' },
  { plat: 'Frites maison portion', cout: '0,60 EUR', pv: '4 EUR', foodCost: '15 %', marge: '3,40 EUR' },
  { plat: 'Boisson canette / verre', cout: '0,60 EUR', pv: '3 EUR', foodCost: '20 %', marge: '2,40 EUR' },
];

export default function LogicielMargeFoodTruck() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel marge food truck | Food cost + emplacements | RestauMargin"
        description="Logiciel pour calculer marge food truck. Specificites mobile, emplacements, meteo. Essai gratuit 7 jours."
        path="/logiciel-marge-food-truck"
        type="website"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciel marge food truck', url: 'https://www.restaumargin.fr/logiciel-marge-food-truck' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour food truck en 2026',
            description:
              "Logiciel SaaS specialise food truck : calcul food cost (28-33 %), gestion multi-emplacements, ajustement meteo, evenementiel B2B, mode hors-ligne dans le camion.",
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
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.restaumargin.fr/logiciel-marge-food-truck',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin Food Truck',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Food Truck Management Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-food-truck',
            description:
              "Logiciel de gestion des marges specifique food truck : calcul food cost, multi-emplacements, ajustement meteo, evenementiel B2B, HACCP ambulant, mode hors-ligne.",
            featureList: [
              'Calcul food cost food truck (cible 28-33 %)',
              'Multi-emplacements avec couts variables',
              "Ajustement automatique meteo (OpenWeather API)",
              'Mode hors-ligne complet dans le camion',
              'Gestion laboratoire / preparation centralisee',
              'Mode evenementiel B2B (festivals, mariages)',
              'Suivi carburant, gaz, eau, electricite',
              'HACCP ambulant et tracabilite lots',
              'Multi-trucks (consolidation parc)',
              'Saisonnalite et previsions ventes',
            ],
            offers: [
              {
                '@type': 'Offer',
                name: 'Pro',
                price: '29',
                priceCurrency: 'EUR',
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: '29',
                  priceCurrency: 'EUR',
                  unitText: 'MONTH',
                },
              },
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '47',
              bestRating: '5',
              worstRating: '1',
            },
          },
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className="hidden sm:inline-flex text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors"
            >
              Tarifs
            </Link>
            <Link
              to="/demo"
              className="hidden sm:inline-flex text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors"
            >
              Demo
            </Link>
            <Link
              to="/signup"
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
          <span className="text-mono-100 font-medium">Logiciel marge food truck</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className="bg-gradient-to-b from-teal-50 via-white to-white pt-16 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-teal-700 bg-teal-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <Truck className="w-3.5 h-3.5" />
            Specialise food truck France 2026
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-mono-100 leading-tight mb-6 max-w-4xl mx-auto">
            Logiciel de marge pour food truck en 2026
          </h1>
          <p className="text-lg sm:text-xl text-mono-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Calculez le food cost reel de chaque plat, pilotez plusieurs emplacements,
            ajustez vos previsions a la meteo. <strong>Le seul logiciel pense pour la mobilite et la saisonnalite food truck.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/signup"
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
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Mode hors-ligne dans le camion</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Multi-emplacements illimites</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4,8/5 (47 avis food truckeurs)</span>
          </div>
        </div>
      </header>

      {/* ── Intro marche food truck ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Le food truck en France : 700 M EUR, +8 %/an
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Un marche en pleine expansion qui exige une gestion ultra-fine pour rester rentable.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white border border-mono-900 rounded-2xl p-6 text-center">
              <Euro className="w-8 h-8 text-teal-600 mx-auto mb-3" />
              <div className="text-3xl font-extrabold text-mono-100 mb-1">700 M EUR</div>
              <div className="text-sm text-mono-500">CA annuel food truck France 2026</div>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-6 text-center">
              <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <div className="text-3xl font-extrabold text-mono-100 mb-1">+8 %/an</div>
              <div className="text-sm text-mono-500">Croissance moyenne 2022-2026</div>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-6 text-center">
              <Truck className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <div className="text-3xl font-extrabold text-mono-100 mb-1">~ 22 000</div>
              <div className="text-sm text-mono-500">Food trucks actifs en France</div>
            </div>
          </div>

          <div className="prose-content text-mono-400 leading-relaxed">
            <p>
              Le food truck n'est plus un effet de mode : c'est un format restauration mature,
              porte par la demande urbaine d'offre rapide et qualitative. Mais derriere l'image
              romantique du camion libre, la realite est exigeante : marges serrees, dependance
              meteo, rotation rapide, contraintes reglementaires lourdes.
            </p>
            <p className="mt-4">
              La difference entre un food truck rentable et un food truck en survie tient en
              quelques points de marge nette : 18 % vs 28 % sur 250 000 EUR de CA represente
              25 000 EUR/an de revenu reel pour l'exploitant. Un logiciel adapte fait la difference.
            </p>
          </div>
        </div>
      </section>

      {/* ── Specificites food truck ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              4 specificites qui changent tout
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Un food truck ne se gere pas comme un restaurant traditionnel. Voici pourquoi.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Capacite limitee : 50 a 150 couverts/service',
                desc:
                  "Contrairement a un resto de 60 couverts qui peut faire 2 services (= 120 couverts/jour), le food truck a un plafond physique impose par le format. Chaque commande perdue est definitive. Le calcul de marge doit integrer ce plafond pour ne pas surestimer le seuil de rentabilite.",
              },
              {
                icon: <CloudRain className="w-6 h-6" />,
                title: 'Meteo dependant',
                desc:
                  "Une pluie un samedi midi peut effondrer votre CA de 50 %. Un logiciel de marge food truck doit integrer l'historique meteo et ajuster les previsions de stock et de ventes en consequence. RestauMargin connecte l'API OpenWeather a vos emplacements pour des previsions fiables.",
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: 'Multi-emplacements',
                desc:
                  "Un truck typique tourne sur 5 a 12 emplacements differents par mois : marche du samedi, zone bureaux du midi, festival d'ete, fete de quartier. Chaque lieu a ses propres couts (loyer journalier, electricite, eau) et son propre CA potentiel. La marge nette varie de -10 % a +35 % d'un emplacement a l'autre.",
              },
              {
                icon: <ChefHat className="w-6 h-6" />,
                title: 'Pas de salle, pas de service en salle',
                desc:
                  "Aucun couvert, dressage minimal, emballage a emporter obligatoire. Les fiches techniques sont differentes (portion calibree pour emporter), le couvert est remplace par un emballage ecolo (0,20 a 0,40 EUR/commande), et la masse salariale est concentree en cuisine (pas de salle). Le calcul de marge brute doit refleter ces specificites.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-mono-100 mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Food cost cible ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-10 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
                Cible food cost food truck
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">
              Food cost food truck : la fourchette gagnante 28 a 33 %
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                <div className="text-4xl font-extrabold mb-1">28 %</div>
                <div className="text-sm text-teal-100">Plancher rentable</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-5 text-center border-2 border-white">
                <div className="text-4xl font-extrabold mb-1">30 %</div>
                <div className="text-sm text-white font-semibold">Cible standard</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center">
                <div className="text-4xl font-extrabold mb-1">33 %</div>
                <div className="text-sm text-teal-100">Plafond critique</div>
              </div>
            </div>
            <p className="text-teal-50 text-sm leading-relaxed">
              Au-dela de 33 %, votre marge brute ne couvre plus les charges variables food truck
              (carburant, gaz, location emplacement). En dessous de 28 %, vous risquez de baisser
              la qualite produit et de perdre la fidelite client — fatal en food truck ou la
              reputation locale est la cle.
            </p>
          </div>
        </div>
      </section>

      {/* ── Marge brute en euros ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Marge brute en euros : food truck &gt; resto traditionnel
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Avec moins de charges fixes, le food truck peut convertir une marge brute par plat
              superieure en marge nette positive plus rapidement.
            </p>
          </div>

          <div className="bg-white border border-mono-900 rounded-2xl overflow-hidden">
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-mono-900">
              <div className="p-8">
                <div className="text-xs font-bold uppercase tracking-wider text-mono-500 mb-3">
                  Restaurant traditionnel 60 couverts
                </div>
                <div className="space-y-2 text-sm text-mono-350">
                  <div className="flex justify-between"><span>Burger 14 EUR</span><span className="font-mono">14,00 EUR</span></div>
                  <div className="flex justify-between text-mono-500"><span>- Cout matieres 35 %</span><span className="font-mono">-4,90 EUR</span></div>
                  <div className="flex justify-between font-bold text-mono-100 border-t border-mono-900 pt-2"><span>Marge brute</span><span className="font-mono">9,10 EUR</span></div>
                  <div className="flex justify-between text-mono-500"><span>- Loyer + charges fixes (estim. 4 EUR/couvert)</span><span className="font-mono">-4,00 EUR</span></div>
                  <div className="flex justify-between text-mono-500"><span>- Personnel salle 1,5 EUR/couvert</span><span className="font-mono">-1,50 EUR</span></div>
                  <div className="flex justify-between font-bold text-emerald-700 border-t border-mono-900 pt-2"><span>Marge nette / plat</span><span className="font-mono">3,60 EUR</span></div>
                </div>
              </div>
              <div className="p-8 bg-teal-50">
                <div className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-3">
                  Food truck 80 couverts/service
                </div>
                <div className="space-y-2 text-sm text-mono-350">
                  <div className="flex justify-between"><span>Burger 11 EUR</span><span className="font-mono">11,00 EUR</span></div>
                  <div className="flex justify-between text-mono-500"><span>- Cout matieres 30 %</span><span className="font-mono">-3,30 EUR</span></div>
                  <div className="flex justify-between font-bold text-mono-100 border-t border-mono-900 pt-2"><span>Marge brute</span><span className="font-mono">7,70 EUR</span></div>
                  <div className="flex justify-between text-mono-500"><span>- Loyer emplacement (estim. 1 EUR/couvert)</span><span className="font-mono">-1,00 EUR</span></div>
                  <div className="flex justify-between text-mono-500"><span>- Carburant + gaz</span><span className="font-mono">-0,40 EUR</span></div>
                  <div className="flex justify-between font-bold text-emerald-700 border-t border-mono-900 pt-2"><span>Marge nette / plat</span><span className="font-mono">6,30 EUR</span></div>
                </div>
              </div>
            </div>
          </div>

          <Callout type="info">
            <strong>L'arbitrage food truck est gagnant</strong> sur la marge nette par plat
            (6,30 EUR vs 3,60 EUR), mais penalise par le plafond de couverts/jour (80 vs 120).
            Le logiciel RestauMargin calcule ce trade-off automatiquement pour chaque emplacement.
          </Callout>
        </div>
      </section>

      {/* ── Decomposition burger food truck ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Decomposition reelle : un burger food truck 11 EUR
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Cas pratique chiffre d'un burger signature en food truck artisanal.
            </p>
          </div>

          <div className="bg-white border border-mono-900 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000 text-mono-500 text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-semibold">Composant</th>
                  <th className="text-left py-3 px-4 font-semibold">Detail</th>
                  <th className="text-right py-3 px-4 font-semibold">Cout</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { c: 'Steak hache 150g', d: 'Boeuf race a viande, fournisseur local', p: '1,20 EUR' },
                  { c: 'Pain artisan brioche', d: 'Boulanger partenaire, livraison J', p: '0,40 EUR' },
                  { c: 'Cheddar + salade + tomate + oignons + sauce maison', d: '30g cheddar, 10g salade, 1 rondelle tomate, oignons confits', p: '0,80 EUR' },
                  { c: 'Frites maison portion', d: 'Pomme de terre Bintje, double cuisson', p: '0,60 EUR' },
                  { c: 'Emballage ecolo', d: 'Boite kraft compostable + serviette', p: '0,30 EUR' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.c}</td>
                    <td className="py-3 px-4 text-mono-500 text-xs">{row.d}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-mono-100">{row.p}</td>
                  </tr>
                ))}
                <tr className="bg-teal-50 border-t-2 border-teal-600">
                  <td className="py-4 px-4 font-extrabold text-mono-100">COUT MATIERES TOTAL</td>
                  <td className="py-4 px-4 text-xs text-teal-700 font-semibold">Y compris emballage</td>
                  <td className="py-4 px-4 text-right font-mono font-extrabold text-teal-700 text-lg">3,30 EUR</td>
                </tr>
                <tr className="bg-emerald-50">
                  <td className="py-4 px-4 font-extrabold text-mono-100">PRIX DE VENTE TTC</td>
                  <td className="py-4 px-4 text-xs text-emerald-700 font-semibold">
                    Food cost = 3,30 / 11 = <strong>30 %</strong>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-extrabold text-emerald-700 text-lg">11,00 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout type="warning">
            <strong>Erreur frequente :</strong> oublier l'emballage dans le food cost. A 0,30 EUR /
            commande sur 80 couverts/jour = 24 EUR/jour, soit 5 760 EUR/an. RestauMargin integre
            automatiquement l'emballage dans chaque fiche technique food truck.
          </Callout>
        </div>
      </section>

      {/* ── Tableau 8 plats ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              8 plats food truck types : food cost et marge
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Benchmark des plats les plus vendus en food truck en 2026.
            </p>
          </div>

          <div className="bg-white border border-mono-900 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000 text-mono-500 text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-semibold">Plat</th>
                  <th className="text-right py-3 px-4 font-semibold">Cout matieres</th>
                  <th className="text-right py-3 px-4 font-semibold">Prix vente</th>
                  <th className="text-right py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-right py-3 px-4 font-semibold">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {platsFoodTruck.map((p, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{p.plat}</td>
                    <td className="py-3 px-4 text-right font-mono">{p.cout}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">{p.pv}</td>
                    <td className="py-3 px-4 text-right font-mono">
                      <span className={`px-2 py-0.5 rounded ${parseFloat(p.foodCost) <= 30 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {p.foodCost}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">{p.marge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Charges specifiques ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Charges specifiques food truck a integrer
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Quatre postes que l'on retrouve en food truck mais pas en restaurant fixe.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-mono-100 mb-2 text-lg">Location emplacement (50-200 EUR/jour)</h3>
              <p className="text-sm text-mono-400 leading-relaxed">
                Variable selon la typologie : marche communal 30-80 EUR, zone bureaux negociee
                40-120 EUR/jour, festival haut de gamme 150-500 EUR. C'est la charge variable n.1 a
                imputer par emplacement pour calculer la marge nette reelle de chaque lieu.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-mono-100 mb-2 text-lg">Carburant + gaz cuisson</h3>
              <p className="text-sm text-mono-400 leading-relaxed">
                Le truck consomme entre 8 et 14 L/100 km en charge. Pour 50 km/jour aller-retour
                = 5-7 EUR/jour de carburant. Gaz cuisson : 1 bouteille butane 13 kg (30 EUR) tient
                4-6 services soit ~6 EUR/service. Ces charges variables doivent etre imputees au
                pro-rata du CA par emplacement.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-mono-100 mb-2 text-lg">Pas de loyer fixe = avantage cle</h3>
              <p className="text-sm text-mono-400 leading-relaxed">
                Contrairement a un resto qui paie 2 000-8 000 EUR/mois meme en cas de mauvaise
                affluence, le food truck ne paie l'emplacement que les jours ou il y est. C'est
                l'avantage structurel n.1 : flexibilite totale de la charge fixe principale.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-mono-100 mb-2 text-lg">Permis et assurances ambulants</h3>
              <p className="text-sm text-mono-400 leading-relaxed">
                Carte commercant ambulant (60 EUR/4 ans), assurance RC pro food truck (600-1 200
                EUR/an), controle technique pro (180 EUR/an), redevance occupation domaine public
                annuelle (200-500 EUR si abonnement marche). Total : ~1 500-2 500 EUR/an a amortir
                sur chaque service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Optimisation food truck ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              4 leviers d'optimisation marge food truck
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Les pratiques eprouvees par les food trucks les plus rentables de France.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Menu court (8-12 items)',
                desc:
                  "Limiter la carte a 8-12 plats reduit drastiquement le stock immobilise, accelere le service (75 commandes/h vs 45 avec carte de 25 plats), et concentre la maitrise sur quelques recettes parfaites. Toutes les marques food truck premium suivent cette regle.",
              },
              {
                icon: <Package className="w-6 h-6" />,
                title: 'Preparation centralisee',
                desc:
                  "Le laboratoire fixe (declare DDPP) permet de pre-produire 60-80 % des composants en amont (sauces, marinades, garnitures, pates). Resultat : 30 % de productivite en plus dans le truck, qualite homogene, gaspillage divise par 2.",
              },
              {
                icon: <Calendar className="w-6 h-6" />,
                title: 'Saisonnalite (printemps-ete peak)',
                desc:
                  "Le food truck genere 65-75 % de son CA annuel entre avril et septembre. Le logiciel doit anticiper ce pic (recrutement saisonnier, stock major, multi-emplacements festivals) et lisser l'hiver (B2B evenementiel, marches couverts, pause active).",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Evenementiel B2B',
                desc:
                  "Festivals, mariages, seminaires d'entreprise : marges nettes 35-50 % vs 18-28 % en service public. Forfait global negocie en amont, pas de risque meteo, paiement garanti. Cible : 25-35 % du CA en evenementiel pour stabiliser la rentabilite.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-mono-100 mb-2">{item.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KPI food truck ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              KPI cles food truck a suivre dans le logiciel
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Les 5 indicateurs qui pilotent la rentabilite reelle.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                kpi: 'Couverts par service',
                cible: '60 a 120 selon emplacement',
                desc: 'Mesure la capacite reelle exploitee. En dessous de 50, l\'emplacement est probablement deficitaire.',
              },
              {
                kpi: 'Ticket moyen',
                cible: '11 a 16 EUR food truck',
                desc: 'Plus eleve que street food (8-10 EUR) grace au combo plat + accompagnement + boisson. A optimiser via upselling.',
              },
              {
                kpi: 'Taux de retour client',
                cible: '> 35 % en emplacement fixe',
                desc: 'Reservation, fidelite carte, presence reseaux sociaux. Le taux de retour est le predicteur n.1 de CA stable.',
              },
              {
                kpi: 'CA par emplacement',
                cible: 'CA / (couts emplacement + charges variables) > 4',
                desc: 'Ratio de rentabilite par lieu. Sous 3, supprimer ou renegocier l\'emplacement.',
              },
              {
                kpi: 'Food cost reel hebdomadaire',
                cible: '28 a 33 %',
                desc: 'Calcule sur cout matieres consomme / CA reel. Au-dela de 35 %, alerte : derive achats ou portions.',
              },
            ].map((row, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5 flex gap-4">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center shrink-0 font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                    <h3 className="font-bold text-mono-100">{row.kpi}</h3>
                    <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-1 rounded">
                      Cible : {row.cible}
                    </span>
                  </div>
                  <p className="text-sm text-mono-400 leading-relaxed">{row.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cas concret Lyon ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Cas concret
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Food truck Lyon : 18 % a 28 % de marge nette en 4 mois
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Comment Burger Brothers Lyon a gagne 10 points de marge nette grace au logiciel.
            </p>
          </div>

          <div className="bg-white border border-mono-900 rounded-2xl p-8 sm:p-10">
            <div className="grid sm:grid-cols-3 gap-6 mb-8 text-center">
              <div>
                <div className="text-xs uppercase tracking-wider text-mono-500 mb-1">Avant RestauMargin</div>
                <div className="text-4xl font-extrabold text-mono-100">18 %</div>
                <div className="text-xs text-mono-500">marge nette</div>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="w-10 h-10 text-teal-600" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-emerald-700 mb-1">Apres 4 mois</div>
                <div className="text-4xl font-extrabold text-emerald-700">28 %</div>
                <div className="text-xs text-emerald-700 font-semibold">marge nette</div>
              </div>
            </div>

            <div className="space-y-4 text-sm text-mono-400 leading-relaxed">
              <p>
                <strong className="text-mono-100">Le diagnostic :</strong> Julien tournait sur 7
                emplacements/semaine et pensait gagner correctement sa vie. Le logiciel a revele
                que 2 emplacements (jeudi soir Brotteaux + dimanche brunch Tete d'Or) etaient
                deficitaires nets, plombant la rentabilite globale.
              </p>
              <p>
                <strong className="text-mono-100">Les actions :</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Suppression de 2 emplacements deficitaires identifies par la matrice rentabilite</li>
                <li>Ajout 1 emplacement Confluence le vendredi midi (test 4 semaines validees)</li>
                <li>Renegociation prix steak (-12 %) suite alerte hausse fournisseur</li>
                <li>Carte reduite de 18 a 10 plats, focus sur 4 best-sellers</li>
                <li>Mise en place mode evenementiel B2B (3 mariages d'ete reserves)</li>
              </ul>
              <p>
                <strong className="text-mono-100">Le resultat :</strong> +12 000 EUR de marge nette
                annualisee, soit un ROI logiciel x35 des le premier semestre. CA stable a 215 000
                EUR/an, mais marge nette passee de 38 700 EUR a 60 200 EUR.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fonctionnalites cles ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Les 8 fonctionnalites food truck du logiciel
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Tout pense pour la mobilite, la saisonnalite et la rentabilite par emplacement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <MapPin className="w-6 h-6" />, title: 'Multi-emplacements', desc: 'Cout/jour par lieu, CA par service, classement rentabilite.' },
              { icon: <CloudRain className="w-6 h-6" />, title: 'Module meteo', desc: 'API OpenWeather pour previsions ventes et alertes gaspillage.' },
              { icon: <Calculator className="w-6 h-6" />, title: 'Fiches techniques mobiles', desc: 'Portion calibree emporter, emballage integre, allergenes.' },
              { icon: <Receipt className="w-6 h-6" />, title: 'Scan factures OCR', desc: 'Photographiez bordereaux Metro, Promocash, Sysco depuis le truck.' },
              { icon: <Cloud className="w-6 h-6" />, title: 'Mode hors-ligne', desc: 'PWA fonctionnelle sans Wi-Fi, sync auto au retour reseau.' },
              { icon: <Brain className="w-6 h-6" />, title: '19 actions IA', desc: 'Suggestions menu, optimisation marges, commande vocale.' },
              { icon: <Bell className="w-6 h-6" />, title: 'Alertes intelligentes', desc: 'Hausse prix fournisseur, derive food cost, stock critique.' },
              { icon: <BarChart3 className="w-6 h-6" />, title: 'Reporting multi-truck', desc: 'Consolidation parc, comparaison performance, KPI temps reel.' },
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 transition-colors">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-mono-100 mb-2">{feat.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Temoignages ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Ce que disent les food truckeurs RestauMargin
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, k) => (
                    <Star key={k} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-mono-350 leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <div className="font-bold text-mono-100 text-sm">{t.name}</div>
                  <div className="text-xs text-mono-500">{t.role}</div>
                  <div className="text-xs text-teal-700 font-medium">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              FAQ logiciel marge food truck
            </h2>
            <p className="text-lg text-mono-400">
              Les questions specifiques food truck avant l'inscription.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>

          <Callout type="info">
            <strong>Une question food truck specifique ?</strong> Contactez l'equipe via la{' '}
            <Link to="/demo" className="underline font-semibold hover:text-teal-700">page demo</Link>{' '}
            ou ecrivez a contact@restaumargin.fr. Reponse sous 4h ouvrees.
          </Callout>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6">
            Pret a piloter la marge de votre food truck ?
          </h2>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto mb-3">
            Rejoignez les food truckeurs qui ont gagne en moyenne 8 points de marge nette
            en 6 mois grace au logiciel RestauMargin.
          </p>
          <p className="text-teal-50 mb-10">
            Essai gratuit 7 jours - Sans carte bancaire - Mode hors-ligne dans le camion inclus
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-teal-700 font-extrabold rounded-full hover:bg-teal-50 transition-colors text-lg shadow-2xl"
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
          <div className="grid sm:grid-cols-3 gap-6">
            <Link
              to="/blog/ouvrir-food-truck-france-guide"
              className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <Truck className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">
                Ouvrir un food truck en France : guide 2026
              </h3>
              <p className="text-sm text-mono-500">
                Reglementation, couts, emplacements, statuts juridiques. Guide complet de creation.
              </p>
            </Link>
            <Link
              to="/blog/reduire-food-cost"
              className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <Calculator className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">
                Reduire son food cost restaurant
              </h3>
              <p className="text-sm text-mono-500">
                10 leviers concrets pour faire baisser son food cost de 3 a 5 points sans toucher
                a la qualite.
              </p>
            </Link>
            <Link
              to="/signup"
              className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <Sparkles className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">
                Demarrer l'essai gratuit 7 jours
              </h3>
              <p className="text-sm text-mono-500">
                Sans carte bancaire. Toutes les fonctionnalites food truck activees immediatement.
              </p>
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
          <p className="mb-4">Le logiciel de marge specialise food truck en France.</p>
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

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles =
    type === 'info'
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
