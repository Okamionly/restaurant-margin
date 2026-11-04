import { Link } from 'react-router-dom';
import {
  ChefHat,
  Calculator,
  ArrowRight,
  Check,
  Sparkles,
  Wine,
  Beef,
  Salad,
  Croissant,
  Soup,
  Truck,
  Fish,
  Carrot,
  Store,
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  Lightbulb,
  Receipt,
  Bell,
  ListChecks,
  Award,
  Users,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Landing niche SEO — Logiciel marge bistrot et brasserie
   Mots-cles cibles : marge bistrot, marge brasserie, food cost
   bistrot francais, rentabilite brasserie
   ~2 700 mots, ton expert cuisine francaise
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel food cost viser pour un bistrot français en 2026 ?',
    answer:
      "La fourchette cible pour un bistrot ou une brasserie française est de 28 à 32 %. En dessous de 28 %, vous risquez de dégrader la qualité perçue (produits frais quotidiens, viande Charolaise, poisson sauvage). Au-delà de 32 %, votre marge brute devient insuffisante pour absorber le poids du personnel en cuisine française (souvent 38-42 % du CA). Le bistrot bien géré stabilise son food cost autour de 30 % avec un prime cost à 65 %.",
  },
  {
    question: 'Comment optimiser la marge sur un boeuf bourguignon ?',
    answer:
      "Le boeuf bourguignon est un plat marge-friendly s'il est correctement paramétré. Avec une joue ou un paleron Charolais à 12 EUR/kg, une portion de 180 g de viande crue (après réduction 30 % à la cuisson), légumes 80 g, vin 100 ml, fond 50 ml : coût matières total environ 5,20 EUR. Vendu 19 EUR HT (20,90 EUR TTC) en formule plat, food cost 27 %. Astuce : préparer en grande masse (gain 30 % sur temps cuisson), congeler en portions individuelles.",
  },
  {
    question: 'Comment gérer les fournisseurs multiples d\'un bistrot ?',
    answer:
      "Un bistrot type travaille avec 6 à 12 fournisseurs : maraîcher local (quotidien), boucher de quartier (2-3x/semaine), poissonnerie (2-3x/semaine), cave indépendante, épicier sec, fromager, MIN (marché de gros) en complément. Un logiciel comme RestauMargin centralise les bordereaux via scan OCR et compare les prix sur la durée (module Mercuriale). Vous détectez les hausses anormales et négociez en position de force.",
  },
  {
    question: 'Quelle marge cible sur la carte des vins ?',
    answer:
      "En bistrot/brasserie, la marge cible sur le vin se situe entre 70 et 75 % (coefficient 3 à 4). Pour une bouteille achetée 6 EUR HT chez votre cave, vente carte autour de 24-28 EUR TTC. Le vin au verre offre une marge encore meilleure (75-80 %) : bouteille 75 cl = 5 verres de 15 cl, prix verre 6-9 EUR. La carafe maison (vin domaine éclaté) est un produit signature à fort rendement.",
  },
  {
    question: 'Comment gérer la saisonnalité forte en cuisine française ?',
    answer:
      "La cuisine française repose sur la saison (asperges en avril, gibier en automne, truffe en hiver, tomate été). Une carte changeante hebdomadaire ou bi-mensuelle est la norme. Un logiciel comme RestauMargin permet de créer rapidement de nouvelles fiches techniques et de calculer la marge avant le passage en carte. Le module Menu Calendrier planifie les rotations. Astuce : 70 % de la carte fixe (classiques) + 30 % saisonnier renouvelé.",
  },
  {
    question: 'Quel est le ticket moyen d\'un bistrot rentable en 2026 ?',
    answer:
      "Un bistrot urbain (Paris, Lyon, grandes métropoles) vise un ticket moyen entre 28 et 38 EUR TTC midi et 35 à 55 EUR TTC soir. En province, 22 à 32 EUR midi et 28 à 42 EUR soir. La formule du jour (entrée + plat ou plat + dessert) doit représenter 60-70 % des couverts du midi. La carte des vins booste le ticket de 15-25 % le soir.",
  },
  {
    question: 'Faut-il proposer une formule du jour ?',
    answer:
      "Oui, sans hésiter. La formule du jour assure un rendement de 70-80 % des couverts midi et permet de tourner les produits frais (anti-gaspillage). Recommandation : 2 entrées, 2 plats, 2 desserts maximum (rotation hebdomadaire). Prix attractif (16-22 EUR formule plat-dessert en province, 19-26 EUR à Paris). Le food cost de la formule peut être légèrement plus élevé (32-35 %) compensé par le volume.",
  },
  {
    question: 'Comment intégrer le nose-to-tail pour améliorer la marge ?',
    answer:
      "Le nose-to-tail (utilisation intégrale de l\'animal) est un puissant levier marge en bistrot. Acheter un demi-cochon ou un agneau entier vous donne un prix au kilo 30-40 % inférieur aux pièces découpées. Vous valorisez les morceaux nobles (filet, côte, gigot) en plats premium et les morceaux abats/bas-morceaux (joue, paleron, langue) en spécialités bistrot à forte marge. RestauMargin gère les découpes via fiches techniques composées.",
  },
  {
    question: 'Combien de temps prend la gestion des marges sans logiciel ?',
    answer:
      "Sur Excel ou papier, un chef-propriétaire de bistrot passe en moyenne 5 à 8 heures par semaine sur la gestion des marges : saisie bordereaux fournisseurs, mise à jour des fiches techniques, recalcul des food costs, comparaison fournisseurs. Avec RestauMargin (scan OCR, mise à jour automatique, alertes), ce temps tombe à 1 heure par semaine. Soit 200 heures gagnées par an pour vous concentrer sur la cuisine et la salle.",
  },
  {
    question: 'RestauMargin est-il adapté à un bistrot indépendant ?',
    answer:
      "Oui, c\'est même notre coeur de cible. RestauMargin a été conçu pour les bistrots et brasseries indépendants (1 à 3 établissements). Le plan Pro à 29 EUR/mois couvre tous les besoins : fiches techniques illimitées, scan factures, alertes prix, menu engineering, gestion de la carte des vins. Essai gratuit 7 jours sans carte bancaire.",
  },
];

// Tableau de 10 plats bistrot type
const platsTypes = [
  { plat: 'Boeuf bourguignon', cout: '5,20 EUR', prix: '19,00 EUR', foodCost: '27 %', marge: '13,80 EUR' },
  { plat: 'Salade nicoise', cout: '3,80 EUR', prix: '14,00 EUR', foodCost: '27 %', marge: '10,20 EUR' },
  { plat: 'Steak frites entrecôte', cout: '6,50 EUR', prix: '22,00 EUR', foodCost: '30 %', marge: '15,50 EUR' },
  { plat: 'Confit de canard', cout: '6,20 EUR', prix: '21,00 EUR', foodCost: '30 %', marge: '14,80 EUR' },
  { plat: 'Cassoulet maison', cout: '5,80 EUR', prix: '20,00 EUR', foodCost: '29 %', marge: '14,20 EUR' },
  { plat: 'Magret de canard', cout: '7,20 EUR', prix: '24,00 EUR', foodCost: '30 %', marge: '16,80 EUR' },
  { plat: 'Sole meunière (200g)', cout: '8,50 EUR', prix: '28,00 EUR', foodCost: '30 %', marge: '19,50 EUR' },
  { plat: 'Tartare de boeuf', cout: '5,40 EUR', prix: '18,00 EUR', foodCost: '30 %', marge: '12,60 EUR' },
  { plat: 'Crème brûlée', cout: '1,20 EUR', prix: '8,00 EUR', foodCost: '15 %', marge: '6,80 EUR' },
  { plat: 'Tarte Tatin', cout: '1,50 EUR', prix: '9,00 EUR', foodCost: '17 %', marge: '7,50 EUR' },
];

export default function LogicielMargeBistrot() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Logiciel marge bistrot brasserie | Food cost cuisine française | RestauMargin"
        description="Logiciel de gestion marge bistrot et brasserie. Suivi food cost cuisine française, fiches techniques, fournisseurs. Essai gratuit 7 jours."
        path="/logiciel-marge-bistrot"
        type="website"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciel marge bistrot brasserie', url: 'https://www.restaumargin.fr/logiciel-marge-bistrot' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour bistrot et brasserie en 2026',
            description:
              'Guide complet sur la gestion des marges en bistrot et brasserie : food cost cible 28-32 %, décomposition coût des plats classiques (boeuf bourguignon, salade nicoise, steak frites), gestion des fournisseurs locaux, carte des vins.',
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
              '@id': 'https://www.restaumargin.fr/logiciel-marge-bistrot',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin pour bistrot et brasserie',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Restaurant Management Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-bistrot',
            description:
              'Logiciel de gestion des marges spécifiquement adapté aux bistrots et brasseries françaises : fiches techniques cuisine française, suivi des prix fournisseurs locaux (maraîcher, boucher, poissonnier), gestion carte des vins, menu du jour.',
            featureList: [
              'Fiches techniques cuisine française (boeuf bourguignon, confit, cassoulet)',
              'Gestion multi-fournisseurs locaux (boucher, maraîcher, poissonnerie)',
              'Suivi marge carte des vins (coefficient 3-4)',
              'Menu du jour avec rotation produits frais',
              'Alertes hausse prix viande/poisson',
              'Scan factures OCR Metro, Transgourmet, Sysco',
              'Calcul rendement nose-to-tail',
              'Reporting prime cost bistrot (cible 65 %)',
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
          },
        ]}
      />

      {/* ── Navbar ── */}
      <PublicHeader />

      {/* ── Breadcrumbs ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-6xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge bistrot et brasserie</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className="bg-gradient-to-b from-amber-50 via-white to-white pt-16 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-amber-800 bg-amber-100 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Spécialiste bistrot et brasserie française
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-mono-100 leading-tight mb-6 max-w-4xl mx-auto">
            Logiciel de marge pour bistrot et brasserie en 2026
          </h1>
          <p className="text-lg sm:text-xl text-mono-400 max-w-3xl mx-auto leading-relaxed mb-8">
            La solution SaaS dédiée aux <strong>bistrots français</strong> et <strong>brasseries traditionnelles</strong>.
            Suivi food cost cible 28-32 %, fournisseurs locaux multiples, carte des vins, menu du jour.
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
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Fiches techniques illimitées</span>
          </div>
        </div>
      </header>

      {/* ── Section 1 : Intro ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-6">
            Le bistrot français : un modèle rentable mais exigeant
          </h2>
          <p className="text-lg text-mono-400 leading-relaxed mb-4">
            Le <strong>bistrot français</strong> est l'institution culinaire emblématique de notre pays.
            Format classique avec sa carte ardoise, ses plats canailles, sa cave et sa salle conviviale,
            il représente plus de 38 000 établissements en France. Mais derrière l'image bonhomme se cache
            une mécanique de gestion redoutable : marges serrées, charges élevées, produits frais quotidiens
            à tourner, équipe de cuisine française coûteuse.
          </p>
          <p className="text-lg text-mono-400 leading-relaxed mb-4">
            La rentabilité d'un bistrot ou d'une brasserie repose sur un <strong>food cost cible de 28 à 32 %</strong>.
            En dessous, vous dégradez la qualité perçue (produits surgelés, viande première zone, vin standard).
            Au-dessus, vous ne couvrez plus vos charges. Cette fourchette étroite exige un pilotage permanent
            des prix matières, des fiches techniques et des fournisseurs.
          </p>
          <p className="text-lg text-mono-400 leading-relaxed">
            <strong>RestauMargin</strong> a été pensé pour cette réalité, celle des bistrots
            et brasseries indépendants. Découvrez comment notre logiciel automatise la gestion spécifique
            de la cuisine française.
          </p>

          <Callout type="info">
            <strong>Chiffre clé :</strong> Un bistrot urbain bien géré réalise entre 350 000 et 800 000 EUR de CA annuel
            avec une marge nette de 10 à 15 %. Soit 35 000 à 120 000 EUR de résultat net par établissement.
          </Callout>
        </div>
      </section>

      {/* ── Section 2 : Specificites cuisine francaise ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Spécificités coûts de la cuisine française
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              4 caractéristiques structurantes qui différencient le bistrot des autres types de restauration.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Fish className="w-6 h-6" />,
                title: 'Produits frais quotidiens',
                desc:
                  "Poisson sauvage (sole, bar, dorade), viande de boucherie (Charolaise, Limousine), légumes du jour. Pas de stocks longs, livraisons 4-6 fois/semaine.",
              },
              {
                icon: <Carrot className="w-6 h-6" />,
                title: 'Saisonnalité forte',
                desc:
                  "Asperges en avril, gibier en automne, truffe en hiver, tomates en été. La carte évolue tous les mois minimum, voire chaque semaine pour les meilleurs établissements.",
              },
              {
                icon: <Truck className="w-6 h-6" />,
                title: 'Fournisseurs locaux multiples',
                desc:
                  "6 à 12 fournisseurs différents : maraîcher de Rungis, boucher de quartier, poissonnerie, cave indépendante, fromager, épicier. Pas de centrale unique.",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: 'Carte changeante',
                desc:
                  "Mix carte fixe (70 %) + plats du jour saisonniers (30 %). Renouvellement hebdomadaire minimum. Nécessite des fiches techniques rapides à créer.",
              },
            ].map((spec, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center mb-4">
                  {spec.icon}
                </div>
                <h3 className="font-bold text-mono-100 mb-2">{spec.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3 : Decomposition cout plats classiques ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
            Décomposition coût de 5 plats classiques bistrot
          </h2>
          <p className="text-lg text-mono-400 mb-12">
            Analyse détaillée des marges sur les emblèmes de la cuisine française. Tous les chiffres sont
            calculés sur des prix fournisseurs réels (Rungis, boucheries de quartier).
          </p>

          <div className="space-y-6">
            <PlatBox
              icon={<Beef className="w-5 h-5" />}
              title="Boeuf bourguignon"
              ingredients={[
                'Joue ou paleron Charolais 12 EUR/kg : 180 g cru = 2,16 EUR',
                'Garniture (oignons, carottes, lardons, champignons) : 1,20 EUR',
                'Vin rouge cuisine (Côtes du Rhone) : 100 ml = 0,80 EUR',
                'Fond brun maison + bouquet garni + épices : 0,30 EUR',
                'Pommes de terre vapeur (180 g) : 0,40 EUR',
                'Énergie cuisson 3h + main d\'oeuvre (allocated) : 0,34 EUR',
              ]}
              coutTotal="5,20 EUR"
              prixVente="19,00 EUR"
              foodCost="27 %"
              marge="13,80 EUR"
              color="amber"
            />

            <PlatBox
              icon={<Salad className="w-5 h-5" />}
              title="Salade nicoise"
              ingredients={[
                'Thon rouge frais qualité sashimi 28 EUR/kg : 80 g = 2,24 EUR',
                'Tomates anciennes (3 variétés) : 100 g = 0,40 EUR',
                'Oeuf bio mollet : 0,35 EUR',
                'Olives Taggiasche + anchois : 0,30 EUR',
                'Mesclun + radis + ciboulette : 0,30 EUR',
                'Huile olive AOP + assaisonnement : 0,21 EUR',
              ]}
              coutTotal="3,80 EUR"
              prixVente="14,00 EUR"
              foodCost="27 %"
              marge="10,20 EUR"
              color="emerald"
            />

            <PlatBox
              icon={<Beef className="w-5 h-5" />}
              title="Steak frites entrecôte"
              ingredients={[
                'Entrecôte Charolaise 200 g (achat 22 EUR/kg) : 4,40 EUR',
                'Frites maison Bintje (200 g cuites, 350 g crues) : 0,60 EUR',
                'Beurre maître d\'hôtel maison : 0,30 EUR',
                'Sel fleur de sel + poivre Sarawak : 0,15 EUR',
                'Salade verte garniture (40 g) : 0,15 EUR',
                'Huile cuisson frites + énergie : 0,90 EUR',
              ]}
              coutTotal="6,50 EUR"
              prixVente="22,00 EUR"
              foodCost="30 %"
              marge="15,50 EUR"
              color="amber"
            />

            <PlatBox
              icon={<Croissant className="w-5 h-5" />}
              title="Crème brûlée"
              ingredients={[
                'Crème liquide 35 % MG (150 ml) : 0,45 EUR',
                'Jaunes d\'oeufs (3 jaunes bio) : 0,30 EUR',
                'Sucre roux + cassonade brûlage : 0,15 EUR',
                'Gousse de vanille Bourbon (1/4) : 0,25 EUR',
                'Ramequin + manutention : 0,05 EUR',
              ]}
              coutTotal="1,20 EUR"
              prixVente="8,00 EUR"
              foodCost="15 %"
              marge="6,80 EUR"
              color="amber"
            />

            <PlatBox
              icon={<Soup className="w-5 h-5" />}
              title="Tarte Tatin"
              ingredients={[
                'Pommes Reinette du Mans (300 g) : 0,75 EUR',
                'Pâte brisée maison (90 g) : 0,25 EUR',
                'Sucre roux + beurre (caramel) : 0,30 EUR',
                'Vanille + épices + cidre : 0,15 EUR',
                'Boule glace vanille accompagnement : 0,05 EUR',
              ]}
              coutTotal="1,50 EUR"
              prixVente="9,00 EUR"
              foodCost="17 %"
              marge="7,50 EUR"
              color="amber"
            />
          </div>

          <Callout type="info">
            <strong>Insight pricing :</strong> Les desserts (food cost 15-20 %) compensent largement les plats
            de viande/poisson (food cost 28-32 %). Pousser le dessert via suggestion serveur améliore le food cost
            moyen de 2 à 3 points sur le ticket.
          </Callout>
        </div>
      </section>

      {/* ── Section 4 : Tableau 10 plats type ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Tableau de 10 plats bistrot type : coûts et marges
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Référence complète avec coût matières, prix de vente et food cost calculés pour 2026.
            </p>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-mono-900 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-4 px-4 font-semibold">Plat</th>
                  <th className="text-right py-4 px-4 font-semibold">Coût matières</th>
                  <th className="text-right py-4 px-4 font-semibold">Prix vente HT</th>
                  <th className="text-right py-4 px-4 font-semibold">Food cost</th>
                  <th className="text-right py-4 px-4 font-semibold">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {platsTypes.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.plat}</td>
                    <td className="py-3 px-4 text-right">{row.cout}</td>
                    <td className="py-3 px-4 text-right">{row.prix}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                        {row.foodCost}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-700">{row.marge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-mono-500 mt-4 text-center">
            Prix calculés sur la base des tarifs fournisseurs Rungis et boucheries de quartier (mai 2026).
            Variation possible selon région et qualité produit.
          </p>
        </div>
      </section>

      {/* ── Section 5 : Gestion fournisseurs ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Gestion fournisseurs spécifique bistrot
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Un bistrot ne travaille pas avec une centrale unique. La diversification fournisseurs garantit
              la qualité, mais multiplie les bordereaux à saisir.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Carrot className="w-6 h-6" />,
                title: 'Maraîcher local',
                freq: 'Quotidien',
                desc:
                  "Légumes du marché (MIN Rungis, marché local) ou direct producteur. Prix variables selon saison. 5-7 livraisons/semaine.",
              },
              {
                icon: <Beef className="w-6 h-6" />,
                title: 'Boucher de quartier',
                freq: '2-3x/semaine',
                desc:
                  "Viande de qualité tracée (Charolaise, Limousine, Aubrac). Découpes sur mesure. Permet le nose-to-tail. Prix premium mais marge sur originalité.",
              },
              {
                icon: <Fish className="w-6 h-6" />,
                title: 'Poissonnerie',
                freq: '2-3x/semaine',
                desc:
                  "Poisson sauvage de criées (Bretagne, Méditerranée). Prix très volatils selon saison/météo. Nécessite un suivi prix quotidien.",
              },
              {
                icon: <Wine className="w-6 h-6" />,
                title: 'Cave indépendante',
                freq: 'Mensuel',
                desc:
                  "Vignerons sélectionnés hors GD. Prix négociés, exclusivités. Critère de différenciation clé pour la carte des vins.",
              },
            ].map((fournisseur, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center mb-3">
                  {fournisseur.icon}
                </div>
                <h3 className="font-bold text-mono-100 mb-1">{fournisseur.title}</h3>
                <p className="text-xs text-teal-700 font-semibold uppercase tracking-wider mb-3">{fournisseur.freq}</p>
                <p className="text-sm text-mono-400 leading-relaxed">{fournisseur.desc}</p>
              </div>
            ))}
          </div>

          <Callout type="warning">
            <strong>Piège courant :</strong> Sans suivi formalisé, un bistrot peut perdre 1,5 à 3 points de food cost
            par an juste sur les hausses fournisseurs non répercutées. Sur un CA de 500 000 EUR, c'est 7 500 à 15 000 EUR
            de marge brute envolée chaque année.
          </Callout>
        </div>
      </section>

      {/* ── Section 6 : Carte des vins ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center">
              <Wine className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100">
              Carte des vins : marge cible 70-75 %
            </h2>
          </div>
          <p className="text-lg text-mono-400 leading-relaxed mb-6">
            La carte des vins représente <strong>20 à 35 % du CA</strong> d'un bistrot et offre la
            <strong> meilleure marge brute du restaurant</strong> (70-75 %). C'est le levier numéro 1 de rentabilité,
            souvent sous-exploité faute de pilotage.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Vin à la bouteille
              </h3>
              <ul className="space-y-2 text-sm text-mono-400">
                <li>Coefficient cible : <strong>3 à 4</strong></li>
                <li>Achat 6 EUR HT chez vigneron - vente 24-28 EUR TTC</li>
                <li>Marge brute : 70 % (16-19 EUR par bouteille)</li>
                <li>Garniture carte : 15-25 références suffit</li>
              </ul>
            </div>

            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <Wine className="w-5 h-5 text-purple-600" />
                Vin au verre / carafe
              </h3>
              <ul className="space-y-2 text-sm text-mono-400">
                <li>Marge encore plus élevée : <strong>75-80 %</strong></li>
                <li>1 bouteille 75 cl = 5 verres de 15 cl</li>
                <li>Prix verre : 6 à 9 EUR (selon gamme)</li>
                <li>Carafe maison : produit signature, fort rendement</li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Astuce sommelier :</strong> Le ratio idéal est de 3 références vin au verre (1 blanc + 2 rouges)
            renouvelées tous les 15 jours. Cela crée de la nouveauté pour les habitués et booste le ticket moyen de 20-30 %.
            <Link to="/blog/construire-carte-vins-restaurant" className="block mt-2 text-teal-700 font-semibold underline">
              Lire notre guide complet sur la carte des vins
            </Link>
          </Callout>
        </div>
      </section>

      {/* ── Section 7 : KPI bistrot ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              KPI bistrot : les chiffres à piloter
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              5 indicateurs clés à suivre chaque semaine pour garantir la rentabilité.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                kpi: 'Food cost',
                cible: '28-32 %',
                desc: 'Ratio coût matières / CA HT. Au-delà de 32 %, alerte rouge. En dessous de 28 %, risque qualité.',
                color: 'amber',
              },
              {
                kpi: 'Prime cost',
                cible: '< 65 %',
                desc: 'Food cost + coût personnel. Indicateur clé de la viabilité : au-delà de 70 %, le bistrot ne dégage plus de marge nette.',
                color: 'red',
              },
              {
                kpi: 'Ticket moyen midi',
                cible: '22-30 EUR TTC',
                desc: 'Province : 22-28 EUR. Paris : 28-38 EUR. Boosté par formule du jour + vin au verre.',
                color: 'teal',
              },
              {
                kpi: 'Ticket moyen soir',
                cible: '35-55 EUR TTC',
                desc: 'À la carte + entrée-plat-dessert + vin. La carte des vins représente 30 % du ticket soir.',
                color: 'purple',
              },
              {
                kpi: 'Couverts/jour',
                cible: '40-80',
                desc: 'Un bistrot de 35 couverts vise 2 services pleins (70 couverts). Soirée : 1 à 1,5 service.',
                color: 'emerald',
              },
              {
                kpi: 'Marge nette',
                cible: '10-15 %',
                desc: 'Après charges totales (loyer, personnel, énergie, taxes). Un bistrot bien géré atteint 12-15 %.',
                color: 'emerald',
              },
            ].map((k, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="text-xs font-semibold uppercase tracking-wider text-mono-500 mb-2">{k.kpi}</div>
                <div className={`text-3xl font-extrabold mb-3 ${
                  k.color === 'amber' ? 'text-amber-700' :
                  k.color === 'red' ? 'text-red-700' :
                  k.color === 'teal' ? 'text-teal-700' :
                  k.color === 'purple' ? 'text-purple-700' :
                  'text-emerald-700'
                }`}>
                  {k.cible}
                </div>
                <p className="text-sm text-mono-400 leading-relaxed">{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 8 : Optimisation cuisine francaise ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              Leviers d'optimisation spécifiques cuisine française
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              4 techniques éprouvées pour gagner 2 à 4 points de marge brute sans dégrader la qualité.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: <Beef className="w-6 h-6" />,
                title: 'Nose-to-tail : utiliser tout l\'animal',
                desc:
                  "Acheter un demi-cochon ou un agneau entier réduit le prix au kilo de 30-40 % par rapport aux pièces découpées. Vous valorisez les morceaux nobles (filet, côte) en plats premium et les morceaux moins demandés (joue, paleron, langue) en spécialités à forte marge. Demande un savoir-faire de découpe et une organisation de production en grandes masses.",
                impact: '+2 à 3 points marge brute',
              },
              {
                icon: <ListChecks className="w-6 h-6" />,
                title: 'Fiches techniques précises et calibrées',
                desc:
                  "Le bistrot souffre souvent du 'à la louche' qui détruit les marges. Pesée systématique au gramme, portions standardisées, recettes documentées : c'est la base. Une portion mal calibrée de 20 g de viande supplémentaire sur 100 couverts = 100 EUR de matière gaspillée/jour, 36 000 EUR/an.",
                impact: '+1 à 2 points marge brute',
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'Menu du jour : tourner les produits frais',
                desc:
                  "Une formule 2 plats (16-22 EUR) renouvelée chaque midi permet d'écouler les produits frais avant gaspillage. 70-80 % des couverts midi prennent la formule. Food cost légèrement plus élevé (32-35 %) compensé par le volume et zéro perte matière. Carte du soir reste à la carte pour les marges premium.",
                impact: 'Réduction 60 % du gaspillage matière',
              },
              {
                icon: <Wine className="w-6 h-6" />,
                title: 'Vin au verre et carafe maison',
                desc:
                  "Proposer 3 références au verre (1 blanc, 2 rouges) augmente le taux de prise de boisson de 35 % à 55 %. La carafe maison (assemblage 2-3 vignerons) crée un produit signature non comparable, marge 80 %. Astuce : ardoise hebdomadaire des vins du moment.",
                impact: 'Ticket moyen +20 à 30 %',
              },
            ].map((levier, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    {levier.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-mono-100 mb-2 text-lg">{levier.title}</h3>
                    <p className="text-sm text-mono-400 leading-relaxed mb-3">{levier.desc}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                      <Award className="w-3.5 h-3.5" />
                      {levier.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 9 : Exemple illustratif bistrot ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-3xl p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">Exemple illustratif</div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100">
                  Un bistrot de quartier : de 11 % à 22 % de marge nette
                </h2>
              </div>
            </div>

            <p className="text-lg text-mono-400 leading-relaxed mb-6">
              Prenons un exemple fictif : un bistrot urbain de 38 couverts, tenu par un chef-propriétaire
              qui gère tout sur Excel, voit sa marge nette descendre à <strong>11 %</strong> malgré un CA
              de 720 000 EUR. Voici ce que pourrait donner l'application méthodique des leviers ci-dessus.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-mono-900 rounded-xl p-5">
                <h3 className="font-bold text-mono-100 mb-3 text-sm uppercase tracking-wider">Situation avant</h3>
                <ul className="space-y-2 text-sm text-mono-400">
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-1">●</span> Food cost 38 %</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-1">●</span> Prime cost 78 %</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-1">●</span> Marge nette 11 %</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-1">●</span> 6h/semaine sur Excel</li>
                  <li className="flex items-start gap-2"><span className="text-red-500 mt-1">●</span> Ticket moyen midi 24 EUR</li>
                </ul>
              </div>

              <div className="bg-white border border-emerald-200 rounded-xl p-5">
                <h3 className="font-bold text-emerald-800 mb-3 text-sm uppercase tracking-wider">Situation visée</h3>
                <ul className="space-y-2 text-sm text-mono-400">
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">●</span> Food cost <strong>29 %</strong></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">●</span> Prime cost <strong>64 %</strong></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">●</span> Marge nette <strong>22 %</strong></li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">●</span> 1h/semaine pilotage</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-1">●</span> Ticket moyen midi <strong>28 EUR</strong></li>
                </ul>
              </div>
            </div>

            <h3 className="font-bold text-mono-100 mb-3 mt-6">Leviers à actionner :</h3>
            <ol className="space-y-2 text-sm text-mono-400 list-decimal list-inside ml-2">
              <li>Numérisation des fiches techniques avec calcul food cost automatique</li>
              <li>Scan factures OCR : repérer les hausses fournisseurs non répercutées (boucher, poissonnerie)</li>
              <li>Refonte carte des vins : passage de 8 à 14 références verre, marge moyenne portée à 76 %</li>
              <li>Menu du jour structure : 2 plats midi à 22 EUR, taux de prise 78 %, zéro gaspillage</li>
              <li>Négociation maraîcher (contrat hebdo) : -8 % sur les légumes, +5 % de fraîcheur</li>
              <li>Revalorisation de 6 plats menu : ajustement portions et prix +1 à 2 EUR</li>
              <li>Mise en place nose-to-tail (1 demi-cochon/semaine) : 3 nouvelles spécialités à forte marge</li>
            </ol>

            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-sm text-emerald-900 leading-relaxed">
                <strong>Ordre de grandeur :</strong> à CA quasi stable (720k à 750k EUR), passer de 11 % à 22 %
                de marge nette ferait passer le résultat net d'environ 79 000 EUR à 165 000 EUR par an.
                Chiffres hypothétiques, à titre d'illustration : chaque établissement a ses propres contraintes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 10 : Fonctionnalites RestauMargin specifiques bistrot ── */}
      <section className="py-16 px-4 bg-mono-1000">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              RestauMargin pour bistrot et brasserie
            </h2>
            <p className="text-lg text-mono-400 max-w-2xl mx-auto">
              Toutes les fonctionnalités adaptées à la cuisine française traditionnelle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Calculator className="w-6 h-6" />, title: 'Fiches techniques FR', desc: 'Boeuf bourguignon, confit, cassoulet : modèles prêts pour la cuisine française.' },
              { icon: <Receipt className="w-6 h-6" />, title: 'Scan factures fournisseurs', desc: 'Bordereaux Metro, Transgourmet, Pomona, Sysco + bouchers locaux.' },
              { icon: <Wine className="w-6 h-6" />, title: 'Carte des vins', desc: 'Suivi marge bouteille + verre, alertes hausse, gestion cave.' },
              { icon: <Truck className="w-6 h-6" />, title: 'Multi-fournisseurs', desc: '12 fournisseurs simultanés gérés facilement. Comparatif prix.' },
              { icon: <Target className="w-6 h-6" />, title: 'Menu engineering', desc: 'Identifier vos stars (forte marge + forte vente) vs poids morts.' },
              { icon: <Bell className="w-6 h-6" />, title: 'Alertes prix viande', desc: 'Notification temps réel quand le prix de la viande/poisson change.' },
              { icon: <Sparkles className="w-6 h-6" />, title: 'IA cuisine française', desc: 'Suggestions de recettes saisonnières et optimisation de portions.' },
              { icon: <Users className="w-6 h-6" />, title: 'Multi-restaurants', desc: 'Pour les groupes de 2-3 brasseries : reporting consolidé.' },
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

      {/* ── FAQ ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-mono-100 mb-4">
              FAQ : marge bistrot et brasserie
            </h2>
            <p className="text-lg text-mono-400">
              Les 10 questions les plus posées par les chefs-propriétaires de bistrots.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>

          <Callout type="info">
            <strong>Une question spécifique sur votre bistrot ?</strong> Contactez notre équipe via la{' '}
            <Link to="/demo" className="underline font-semibold hover:text-teal-700">page demo</Link> ou écrivez à
            contact@restaumargin.fr. conseil personnalisé gratuit.
          </Callout>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6">
            Prêt à doubler la marge nette de votre bistrot ?
          </h2>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto mb-3">
            Structurez la gestion de votre bistrot ou de votre brasserie avec RestauMargin.
          </p>
          <p className="text-teal-50 mb-10">
            Essai gratuit 7 jours - Sans carte bancaire - Modèles fiches techniques cuisine française inclus
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login?mode=register"
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Calculator className="w-8 h-8 text-teal-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Coefficient multiplicateur</h3>
              <p className="text-sm text-mono-500">Méthode complète pour fixer le prix de vente à partir du coût matières.</p>
            </Link>
            <Link to="/blog/construire-carte-vins-restaurant" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <Wine className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Carte des vins</h3>
              <p className="text-sm text-mono-500">Construire une carte rentable : structure, marges, rotations.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 hover:border-teal-300 hover:shadow-sm transition-all group">
              <TrendingUp className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-mono-100 mb-2 group-hover:text-teal-700 transition-colors">Réduire le food cost</h3>
              <p className="text-sm text-mono-500">10 leviers concrets pour optimiser votre coût matières.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-teal-600 text-white border border-teal-700 rounded-2xl p-6 hover:bg-teal-700 transition-all group">
              <Sparkles className="w-8 h-8 text-teal-100 mb-3" />
              <h3 className="font-bold mb-2">Essayer gratuitement</h3>
              <p className="text-sm text-teal-100">7 jours d'essai sans carte bancaire. Tout RestauMargin Pro inclus.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <PublicFooter />
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

function PlatBox({
  icon,
  title,
  ingredients,
  coutTotal,
  prixVente,
  foodCost,
  marge,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  ingredients: string[];
  coutTotal: string;
  prixVente: string;
  foodCost: string;
  marge: string;
  color: 'amber' | 'emerald';
}) {
  const bgColor = color === 'amber' ? 'bg-amber-50' : 'bg-emerald-50';
  const textColor = color === 'amber' ? 'text-amber-800' : 'text-emerald-800';

  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6 hover:border-teal-300 transition-colors">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 ${bgColor} ${textColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <h3 className="font-bold text-mono-100 text-xl flex-1">{title}</h3>
      </div>

      <ul className="space-y-1.5 text-sm text-mono-400 mb-5 ml-2">
        {ingredients.map((ing, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-teal-600 mt-1">●</span>
            <span>{ing}</span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-mono-900">
        <div>
          <div className="text-xs text-mono-500 uppercase tracking-wider mb-1">Coût total</div>
          <div className="font-bold text-mono-100">{coutTotal}</div>
        </div>
        <div>
          <div className="text-xs text-mono-500 uppercase tracking-wider mb-1">Prix vente HT</div>
          <div className="font-bold text-mono-100">{prixVente}</div>
        </div>
        <div>
          <div className="text-xs text-mono-500 uppercase tracking-wider mb-1">Food cost</div>
          <div className={`font-bold ${color === 'amber' ? 'text-amber-700' : 'text-emerald-700'}`}>{foodCost}</div>
        </div>
        <div>
          <div className="text-xs text-mono-500 uppercase tracking-wider mb-1">Marge brute</div>
          <div className="font-bold text-emerald-700">{marge}</div>
        </div>
      </div>
    </div>
  );
}
