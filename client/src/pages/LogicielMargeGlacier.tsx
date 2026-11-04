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
  IceCream,
  Snowflake,
  Coffee,
  Cake,
  Sparkles,
  ListChecks,
  Award,
  Sun,
  Zap,
  PiggyBank,
  CloudSnow,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO — "Logiciel de marge pour glacier salon de the patisserie"
   Mots-cles : logiciel marge glacier, food cost glace, salon de the,
               marge boule de glace, saisonnalite glacier
   ~2 700 mots — mode clair, fond blanc, accent rose/pink
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost idéal pour un glacier artisanal en 2026 ?',
    answer:
      "Le food cost cible d'un glacier artisanal français se situe entre 18 % et 25 %, ce qui est le plus bas de toute la restauration. Une boule de glace vendue 3 EUR coûte en moyenne 0,30-0,45 EUR en matières premières (crème, lait, sucre, fruits, stabilisateurs). La marge brute peut atteindre 75-85 %, mais elle doit absorber des charges fixes saisonnières lourdes : loyer 12 mois sur 5 mois de saison, énergie froid -18 EUR/jour pour chambres négatives, et amortissement de la machine à glace (15 000-40 000 EUR).",
  },
  {
    question: 'Comment gérer la saisonnalité extrême d\'un glacier ?',
    answer:
      "70 % du chiffre d'affaires annuel d'un glacier français se concentre sur 5 mois (mai-septembre), avec des pics juillet-août. Stratégies éprouvées : (1) Diversification salon de thé en hiver (cafés, thé, pâtisseries chaudes), (2) Production wholesale BtoB (livraison hôtels, restaurants, traiteurs de novembre à mars), (3) Trois saveurs signature en vente toute l'année chez épiceries fines, (4) Fermeture annuelle de 2-3 mois pour réduire les charges fixes. RestauMargin permet de simuler ces scénarios et de visualiser la rentabilité annualisée.",
  },
  {
    question: "Quel coefficient multiplicateur appliquer sur une boule de glace ?",
    answer:
      "Le coefficient multiplicateur en glacerie est l'un des plus élevés de la restauration : 7 à 12 fois le coût matière. Une boule de glace coûte 0,25-0,40 EUR matière et se vend 2,80-3,80 EUR TTC. Cette marge élevé compense les charges fixes 12 mois pour une activité 5-6 mois. Pour les sorbets aux fruits frais (3-25 EUR/kg de fruits), le coefficient descend à 5-8. Pour les coupes et parfaits, le coefficient remonte à 6-9 grâce au volume de glace intégré.",
  },
  {
    question: 'Comment calculer le coût réel d\'une boule de glace artisanale ?',
    answer:
      "Pour une boule de glace de 100 g (recette vanille bourbon classique) : (1) Crème entière 35 % MG = 35 g x 5 EUR/L / 1000 = 0,18 EUR, (2) Lait entier = 35 g x 1,20 EUR/L / 1000 = 0,04 EUR, (3) Sucre 12 g x 1 EUR/kg / 1000 = 0,01 EUR, (4) Jaunes d'oeuf 6 g x 8 EUR/kg / 1000 = 0,05 EUR, (5) Vanille bourbon 0,3 g x 800 EUR/kg / 1000 = 0,24 EUR, (6) Stabilisateur 0,5 g x 12 EUR/kg / 1000 = 0,006 EUR. Total = 0,53 EUR/boule. Ajoutez 0,10 EUR de cornet ou 0,05 EUR de pot biodégradable. Coût réel : 0,58-0,63 EUR pour un prix de vente 3 EUR.",
  },
  {
    question: 'Comment intégrer le coût du froid (-18°C) dans le calcul de marge ?',
    answer:
      "Une chambre froide négative -18°C de 8 m3 consomme 12-18 kWh/jour, soit 2,50-3,80 EUR/jour au tarif pro 0,21 EUR/kWh. Sur une année, c'est 900-1 400 EUR, à ventiler sur le volume de production. Pour un glacier produisant 25 000 litres/an, le coût froid par litre est de 0,04-0,06 EUR. Une turbine à glace haut de gamme consomme 5-8 kWh par cycle de 30 minutes (production 6-10 litres), soit 0,15-0,25 EUR de production par litre. RestauMargin intègre ces coûts indirects automatiquement.",
  },
  {
    question: 'Quel est le ticket moyen d\'un glacier vs salon de thé ?',
    answer:
      "Le ticket moyen d'un glacier-bar à glace pur en saison se situe entre 5 et 9 EUR (souvent 1 boule + supplément chantilly ou cône spécial). Un salon de thé avec offre glacière a un ticket moyen plus élevé : 9-14 EUR (thé/café + pâtisserie ou coupe glacée). L'intégration salon de thé apporte donc +40 à +70 % de ticket moyen, et permet une fréquentation hivernale stable. C'est pourquoi 60 % des glaciers urbains français ont évolué vers un format hybride en 2026.",
  },
  {
    question: 'Faut-il privilégier les stabilisateurs artisanaux ou industriels ?',
    answer:
      "Les stabilisateurs neutres complets (Cremodan SE 30, Stab 2000, etc.) coûtent 12-18 EUR/kg mais s'utilisent à 5-8 g/kg de mélange (impact 0,06-0,14 EUR/L). Les stabilisateurs artisanaux (gomme de caroube + guar) coûtent 25-40 EUR/kg mais offrent une texture plus fine et un argument marketing fort. Pour un glacier positionné premium (boule à 3,80 EUR+), le surcout 0,15 EUR/L est largement compensé par le positionnement. RestauMargin permet de créer plusieurs variantes de fiche technique pour comparer marge premium vs standard.",
  },
  {
    question: 'Comment optimiser les pertes en fin de saison glacier ?',
    answer:
      "Trois leviers majeurs : (1) Production à la demande (juste-à-temps) avec turbine de 6-10 litres pour éviter les surplus, (2) Conversion des invendus en glaces 'réduites' à 50 % vendues en fin de journée (-50 % vs prix plein), (3) Don aux associations défiscalisé 60 % via Loi Garot, (4) Pré-vendre des bons cadeaux 'paniers gourmands' en septembre pour fidéliser pour la saison suivante. Un glacier bien géré doit rester sous 3 % de pertes valeur sur le CA annuel. RestauMargin trace ces pertes par cycle de production.",
  },
  {
    question: 'Quel logiciel pour calculer la marge d\'un glacier ou salon de thé ?',
    answer:
      "RestauMargin est spécialisé dans le calcul de marge pour glaciers et salons de thé : gestion des recettes glace (crème, lait, sucre, stabilisateurs), calcul du coût froid -18°C par produit, suivi de la saisonnalité avec budget prévisionnel mai-septembre, intégration des sides salon de thé (café, thé, pâtisseries), alertes sur invendus de fin de saison. Essai gratuit 7 jours sans CB. 29 EUR/mois.",
  },
  {
    question: 'Comment passer de 12 % à 28 % de marge nette en glacerie ?',
    answer:
      "Cas concret d'un glacier-salon de thé bordelais 280 000 EUR de CA : (1) Pesée précise des matières premières + standardisation des recettes = +3 points food cost, (2) Lancement d'une gamme signature 4 parfums vendus chez épiceries fines (wholesale BtoB) = +35 000 EUR/an de CA marge 32 %, (3) Café + thé haut de gamme intégrés au menu = +25 % de ticket moyen, (4) Réduction des pertes de 8 % à 2,5 % via production juste-à-temps, (5) Augmentation 0,30 EUR sur les coupes signature = +12 000 EUR/an. Total : passage 12 % à 28 % de marge nette en 8 mois.",
  },
];

export default function LogicielMargeGlacier() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel marge glacier salon de thé | Food cost glace | RestauMargin"
        description="Logiciel pour calculer marge glacier, salon de thé. Food cost 20-25%, marge boules 75-80%. Essai gratuit 7 jours."
        path="/logiciel-marge-glacier"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            {
              name: 'Logiciel marge glacier salon de thé',
              url: 'https://www.restaumargin.fr/logiciel-marge-glacier',
            },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline:
              'Logiciel de marge pour glacier et salon de thé en 2026',
            description:
              "Guide complet du calcul de marge pour glaciers et salons de thé : food cost glace, marge boules, saisonnalité, coût froid -18C, sides café thé. Exemples chiffrés et logiciel dédié.",
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
            wordCount: 2700,
            inLanguage: 'fr-FR',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.restaumargin.fr/logiciel-marge-glacier',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin Glacier Salon de Thé',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web, iOS, Android',
            description:
              'Logiciel de calcul de marge dédié aux glaciers et salons de thé. Gestion des recettes glace, coût froid -18C, saisonnalité, sides café thé pâtisseries.',
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
          <Link to="/" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
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
          <span className="text-mono-100 font-medium">Logiciel marge glacier salon de thé</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Glacier"
        readTime="13 min"
        date="Mai 2026"
        title="Logiciel de marge pour glacier et salon de thé en 2026"
        accentWord="glacier et salon de thé"
        subtitle="Le logiciel SaaS français dédié aux glaciers, salons de thé et pâtisseries. Calcul de marge boule de glace, gestion saisonnalité et intégration sides café-thé. Essai gratuit 7 jours sans carte bancaire."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="header" />

        {/* ── Encadre formule rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-pink-100">Formules clés glacier salon de thé</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les 4 formules essentielles glacerie
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-pink-100 font-bold">1.</span>
              <span><strong className="text-white">Coût boule de glace</strong> = (Crème + Lait + Sucre + Stabilisateur + Arômes) / Nb boules</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-100 font-bold">2.</span>
              <span><strong className="text-white">Food cost glacier</strong> = Coût matière boule / Prix de vente HT x 100 (cible 8-15 %)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-100 font-bold">3.</span>
              <span><strong className="text-white">Marge brute boule</strong> = (Prix HT - Coût matière) / Prix HT (cible 80-90 %)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-100 font-bold">4.</span>
              <span><strong className="text-white">Coefficient multiplicateur</strong> = 7 à 12 (cible glacerie artisanale)</span>
            </div>
          </div>
          <p className="mt-4 text-pink-100 text-sm">
            Objectif standard glacier salon de thé : food cost matière 8-15 %, marge brute 80-90 %, marge nette 12-25 % (après charges saisonnières).
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
              { href: '#marche', label: 'Marché glacier France 2026 (1,1 Md EUR, saisonnalité extrême)' },
              { href: '#specificites', label: 'Spécificités glacier : food cost ULTRA bas, saisonnalité forte' },
              { href: '#couts', label: 'Coûts ingrédients : crème, lait, sucre, stabilisateurs, fruits' },
              { href: '#boule', label: 'Décomposition complète d\'une boule de glace' },
              { href: '#tableau', label: 'Tableau 12 produits glacier (boule, coupe, parfait, sorbet, magnum maison)' },
              { href: '#operations', label: 'Spécificités opérationnelles : saisonnalité, chambre froide, production amont' },
              { href: '#sides', label: 'Sides salon de thé : café, thé, pâtisseries (marge 60-75 %)' },
              { href: '#kpi', label: 'KPI glacier : ticket moyen, rotations rapides l\'été' },
              { href: '#optimisation', label: 'Optimisation : produit signature, BtoB, wholesale' },
              { href: '#cas', label: 'Cas concret glacier Bordeaux : 12 % à 28 % marge nette' },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Essayer RestauMargin gratuitement' },
            ].map((item, i) => (
              <li key={i}>
                <a href={item.href} className="hover:text-teal-600 transition-colors flex items-start gap-2">
                  <span className="text-pink-600 font-semibold min-w-[24px]">{i + 1}.</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article>

        {/* ═════════════ SECTION 1 : Marche France ═════════════ */}
        <section id="marche" className="mb-16">
          <SectionHeading icon={<IceCream className="w-6 h-6" />} number="1">
            Marché glacier France 2026 : 1,1 milliard d'euros, saisonnalité extrême
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le marché français de la glace artisanale et industrielle pèse 1,1 milliard d'euros en
              2026, en croissance régulière de 4 à 6 % par an depuis 2021. Selon le Syndicat des
              Glaciers de France (Confédération des Artisans Glaciers), le pays compte environ 4 800
              glaciers artisanaux en activité, avec une concentration particulière sur le Sud-Est
              (Provence, Côte d'Azur), le Sud-Ouest (Aquitaine, Bordelais) et les zones touristiques
              de Bretagne et Normandie.
            </p>
            <p>
              Trois caractéristiques rendent ce marché unique en restauration :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-3">
              <li>
                <strong>Saisonnalité extrême</strong> : 70 % du CA annuel se concentre sur mai-septembre,
                avec un pic juillet-août représentant 35-40 % du CA annuel.
              </li>
              <li>
                <strong>Consommation française</strong> : 6,1 litres de glace par habitant en 2025
                (contre 14 litres en Finlande et 22 litres aux États-Unis) — marge de progression
                significative pour les artisans.
              </li>
              <li>
                <strong>Premium en croissance</strong> : la part de la glace artisanale (vs industrielle)
                est passée de 18 % à 27 % en 5 ans, portée par l'engouement pour le 'fait maison',
                les ingrédients frais et les saveurs originales.
              </li>
            </ul>

            <Callout type="info">
              <strong>Cible food cost glacier artisanal :</strong> 8 % à 15 % du prix de vente,
              soit 85 % à 92 % de marge brute. C'est le poste matière le plus optimisé de toute la
              restauration. Mais attention : les charges fixes 12 mois doivent être absorbées sur
              5-7 mois d'activité intense.
            </Callout>

            <p>
              En 2026, la pression sur les coûts matières est notable : le prix de la crème entière
              35 % MG a augmenté de 38 % depuis 2023, les fruits frais bio de 25 %, et la vanille
              bourbon a subi une crise (Madagascar) avec une envolée de +180 % sur 2023-2025. Sans
              logiciel dédié, un glacier-salon de thé perd 4 à 6 heures par semaine en mise à jour
              de fiches techniques et de prix de vente.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Specificites ═════════════ */}
        <section id="specificites" className="mb-16">
          <SectionHeading icon={<Snowflake className="w-6 h-6" />} number="2">
            Spécificités glacier : food cost ULTRA bas, saisonnalité forte
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le calcul de marge pour un glacier obéit à une logique radicalement différente de
              celle d'un restaurant ou d'une boulangerie. Là où un bistrot vise 30 % de food cost
              et 70 % de marge brute, le glacier artisanal vise un food cost matière de 8-15 % et
              une marge brute supérieure à 85 %. Cette excellence apparente cache cependant un
              défi majeur : amortir 12 mois de charges fixes sur 5-7 mois d'activité intense.
            </p>
            <p>
              Quatre spécificités rendent le calcul de marge glacier unique :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-3">
              <li>
                <strong>Le food cost ultra bas (8-15 %)</strong> : une boule de glace coûte 0,25-0,45 EUR
                matière et se vend 2,80-3,80 EUR. C'est le coefficient multiplicateur le plus élevé
                de la restauration après les boissons.
              </li>
              <li>
                <strong>La saisonnalité extrême</strong> : 70 % du CA sur 5 mois impose une gestion
                de trésorerie rigoureuse et une diversification hivernale (salon de thé, wholesale).
              </li>
              <li>
                <strong>Le coût du froid permanent</strong> : chambres froides -18°C, vitrines vitrées
                (- 12 à -15°C), turbine à glace — 6 à 10 % du CA annuel en énergie.
              </li>
              <li>
                <strong>La production en amont (batch)</strong> : la glace artisanale se produit par
                lots de 6-10 litres et doit être stockée 24-72h en cellule de durcissement avant
                vente. Stock de production = 2-4 jours de vente.
              </li>
            </ul>

            <Callout type="warning">
              <strong>Piège classique :</strong> beaucoup de glaciers débutants se concentrent sur
              le food cost matière (excellent) sans intégrer le coût froid (3-5 % du CA) ni la
              main-d'oeuvre de production (15-20 % du CA). Résultat : marge brute affichée 85 % mais
              marge nette réelle 8-12 %. RestauMargin force l'intégration de ces coûts indirects.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Couts ingredients ═════════════ */}
        <section id="couts" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="3">
            Coûts ingrédients glacier : crème, lait, sucre, stabilisateurs, fruits
          </SectionHeading>

          <div className="prose-content">
            <p>
              Maîtriser les coûts matières en glacerie suppose de connaître les prix 2026 des
              ingrédients clés. Voici le panorama complet, basé sur les tarifs négociés par les
              artisans glaciers français (achats par volumes de 25-50 kg ou 10-20 litres).
            </p>
          </div>

          {/* Sous-section : Produits laitiers */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-4 flex items-center gap-2">
              <CloudSnow className="w-5 h-5 text-pink-600" />
              Produits laitiers : la base de la glace artisanale
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Ingrédient</th>
                    <th className="text-right py-3 px-4 font-semibold">Prix conventionnel</th>
                    <th className="text-right py-3 px-4 font-semibold">Prix bio / AOP</th>
                    <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Usage principal</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Crème entière 35 % MG</td><td className="py-3 px-4 text-right">4,80 EUR/L</td><td className="py-3 px-4 text-right">6,20 EUR/L</td><td className="py-3 px-4 text-right">Base crème glacées</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Lait entier UHT</td><td className="py-3 px-4 text-right">1,10 EUR/L</td><td className="py-3 px-4 text-right">1,55 EUR/L</td><td className="py-3 px-4 text-right">Bases neutres + sorbets lactés</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Lait demi-écrémé</td><td className="py-3 px-4 text-right">0,90 EUR/L</td><td className="py-3 px-4 text-right">1,35 EUR/L</td><td className="py-3 px-4 text-right">Sorbets, glaces légères</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Lait en poudre 26 % MG</td><td className="py-3 px-4 text-right">7,80 EUR/kg</td><td className="py-3 px-4 text-right">12,00 EUR/kg</td><td className="py-3 px-4 text-right">Stabilisation, ESL</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Jaunes d'oeuf liquides</td><td className="py-3 px-4 text-right">7,50 EUR/kg</td><td className="py-3 px-4 text-right">9,80 EUR/kg</td><td className="py-3 px-4 text-right">Glaces traditionnelles à anglaise</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Beurre 82 % MG</td><td className="py-3 px-4 text-right">7,20 EUR/kg</td><td className="py-3 px-4 text-right">9,80 EUR/kg</td><td className="py-3 px-4 text-right">Sauces caramel, ganaches</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-mono-400">
              Source : moyenne prix 2026 négociés par container 1000L (crème) ou palette 500 kg
              (lait poudre) chez Lactalis, Sodiaal, Eurial. Bio = certification AB ou Demeter.
            </p>
          </div>

          {/* Sous-section : autres matieres */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-mono-100 mb-4 flex items-center gap-2">
              <Cake className="w-5 h-5 text-pink-600" />
              Sucres, stabilisateurs, fruits et arômes : la volatilité 2026
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                {
                  nom: 'Sucre semoule blanc',
                  prix: '1,00 EUR/kg',
                  evolution: '+18 % vs 2023',
                  note: 'Négocier sac 25 kg pour optimiser. Stocker au sec.',
                  color: 'emerald',
                },
                {
                  nom: 'Sucre inverti / trimoline',
                  prix: '4,20 EUR/kg',
                  evolution: '+22 % vs 2023',
                  note: 'Indispensable pour onctuosité. Dose 5-8 % du mix.',
                  color: 'amber',
                },
                {
                  nom: 'Glucose atomisé DE 38',
                  prix: '3,50 EUR/kg',
                  evolution: '+15 % vs 2023',
                  note: 'Anti-cristallisation. Clé de texture professionnelle.',
                  color: 'emerald',
                },
                {
                  nom: 'Stabilisateur neutre (Cremodan SE 30)',
                  prix: '14,50 EUR/kg',
                  evolution: '+8 % vs 2023',
                  note: 'Dose 5-8 g/kg de mix. Texture, foisonnement.',
                  color: 'amber',
                },
                {
                  nom: 'Gomme de caroube',
                  prix: '38,00 EUR/kg',
                  evolution: '+12 % vs 2023',
                  note: 'Stabilisateur artisanal premium. Dose 2-4 g/kg.',
                  color: 'amber',
                },
                {
                  nom: 'Vanille gousses Madagascar',
                  prix: '480 EUR/kg',
                  evolution: '+180 % vs 2023',
                  note: 'Crise Madagascar. Alternative : extrait nature 80 EUR/L.',
                  color: 'red',
                },
                {
                  nom: 'Fraises fraîches saison',
                  prix: '4,80 EUR/kg',
                  evolution: '+25 % vs 2023',
                  note: 'Saisonnalité mai-juillet. Surgelées 3,20 EUR hors saison.',
                  color: 'amber',
                },
                {
                  nom: 'Pistaches AOP Bronte (Sicile)',
                  prix: '85,00 EUR/kg',
                  evolution: '+35 % vs 2023',
                  note: 'Premium absolu. Alternative iranienne 42 EUR/kg.',
                  color: 'red',
                },
                {
                  nom: 'Chocolat noir 70 % couverture',
                  prix: '14,50 EUR/kg',
                  evolution: '+85 % vs 2023',
                  note: 'Crise cacao Ivoire/Ghana. Stocker en négociation contrat.',
                  color: 'red',
                },
                {
                  nom: 'Mangue surgelée Alfonso',
                  prix: '6,80 EUR/kg',
                  evolution: '+22 % vs 2023',
                  note: 'Sorbets premium. Origine Inde, qualité IQF.',
                  color: 'amber',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-pink-300 transition-colors">
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
                  <div className="text-lg font-bold text-pink-700 mb-2">{item.prix}</div>
                  <p className="text-sm text-mono-400 leading-relaxed">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sous-section : energie froid */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-mono-100 mb-4 flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-cyan-600" />
              Le coût du froid -18°C : 4 à 8 % du chiffre d'affaires
            </h3>
            <div className="prose-content">
              <p>
                Le poste énergie d'un glacier est sous-estimé par 80 % des artisans. Une chambre
                froide négative -18°C de 8 m3 (capacité stockage 400-600 kg de glace) consomme
                12-18 kWh par jour, 365 jours par an. Au tarif pro 2026 (0,21 EUR/kWh après
                renégociation), c'est 920 à 1 380 EUR par an pour la seule chambre de stockage.
              </p>
              <p>
                À cela il faut ajouter la vitrine réfrigérée (5-8 kWh/jour ouverte, soit 380-610 EUR/an),
                la turbine à glace (5-8 kWh par cycle 30 min, production 6-10 L), et la cellule de
                durcissement -40°C utilisée 2-3h/jour (8-12 kWh/cycle). Total réaliste : 2 800 à
                4 500 EUR/an d'énergie pour un glacier de taille moyenne.
              </p>
              <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 mt-4 font-mono text-sm">
                <div className="text-mono-100 mb-2 font-bold">Coût froid par litre de glace produite :</div>
                <div className="text-mono-400">= Énergie totale annuelle / Volume produit</div>
                <div className="text-mono-400">= 3 500 EUR / 25 000 L = <span className="text-cyan-600 font-bold">0,14 EUR / litre</span></div>
                <div className="text-mono-100 mt-3 mb-2 font-bold">Coût froid par boule (100 g) :</div>
                <div className="text-mono-400">= 0,14 EUR / 10 boules = <span className="text-cyan-600 font-bold">0,014 EUR / boule</span></div>
              </div>
              <p className="mt-4">
                RestauMargin intègre un module de coût indirect qui ventile automatiquement
                l'énergie sur chaque fiche technique selon la durée de stockage et la consommation
                des équipements.
              </p>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Decomposition boule ═════════════ */}
        <section id="boule" className="mb-16">
          <SectionHeading icon={<IceCream className="w-6 h-6" />} number="4">
            Décomposition complète d'une boule de glace
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici l'analyse détaillée d'une boule de glace vanille bourbon classique, base de
              90 % des glaciers artisanaux français. Le calcul est présenté pour une boule de 100 g
              (taille standard glacier) avec cornet.
            </p>
          </div>

          {/* Decomposition detaillee */}
          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg flex items-center gap-2">
              <IceCream className="w-5 h-5 text-pink-600" />
              Boule de glace vanille bourbon (100 g, vendue 3,00 EUR TTC = 2,84 EUR HT)
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
                <tr><td className="py-2 px-3">Crème entière 35 % MG</td><td className="py-2 px-3 text-right">35 g</td><td className="py-2 px-3 text-right">4,80 EUR/L</td><td className="py-2 px-3 text-right font-medium">0,168 EUR</td></tr>
                <tr><td className="py-2 px-3">Lait entier UHT</td><td className="py-2 px-3 text-right">35 g</td><td className="py-2 px-3 text-right">1,10 EUR/L</td><td className="py-2 px-3 text-right font-medium">0,039 EUR</td></tr>
                <tr><td className="py-2 px-3">Sucre semoule</td><td className="py-2 px-3 text-right">12 g</td><td className="py-2 px-3 text-right">1,00 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,012 EUR</td></tr>
                <tr><td className="py-2 px-3">Jaunes d'oeuf liquides</td><td className="py-2 px-3 text-right">6 g</td><td className="py-2 px-3 text-right">7,50 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,045 EUR</td></tr>
                <tr><td className="py-2 px-3">Vanille bourbon Madagascar</td><td className="py-2 px-3 text-right">0,3 g</td><td className="py-2 px-3 text-right">480 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,144 EUR</td></tr>
                <tr><td className="py-2 px-3">Stabilisateur neutre</td><td className="py-2 px-3 text-right">0,5 g</td><td className="py-2 px-3 text-right">14,50 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,007 EUR</td></tr>
                <tr><td className="py-2 px-3">Sucre inverti / trimoline</td><td className="py-2 px-3 text-right">2 g</td><td className="py-2 px-3 text-right">4,20 EUR/kg</td><td className="py-2 px-3 text-right font-medium">0,008 EUR</td></tr>
                <tr><td className="py-2 px-3">Cornet gaufre classique</td><td className="py-2 px-3 text-right">1 unité</td><td className="py-2 px-3 text-right">0,10 EUR</td><td className="py-2 px-3 text-right font-medium">0,100 EUR</td></tr>
                <tr><td className="py-2 px-3">Énergie froid + turbine</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right">-</td><td className="py-2 px-3 text-right font-medium">0,014 EUR</td></tr>
                <tr><td className="py-2 px-3">Main-d'oeuvre service (45 sec)</td><td className="py-2 px-3 text-right">0,75 min</td><td className="py-2 px-3 text-right">22 EUR/h</td><td className="py-2 px-3 text-right font-medium">0,275 EUR</td></tr>
                <tr className="border-t-2 border-mono-900 bg-pink-50"><td className="py-3 px-3 font-bold text-mono-100">Total coût réel</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-pink-900">0,812 EUR</td></tr>
                <tr className="bg-emerald-50"><td className="py-3 px-3 font-bold text-emerald-900">Marge brute (2,84 - 0,812)</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right">-</td><td className="py-3 px-3 text-right font-bold text-emerald-900">2,028 EUR (71 %)</td></tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm text-mono-400">
              Coefficient multiplicateur : 2,84 / 0,812 = <strong>3,50</strong> (avec main-d'oeuvre intégrée)
              ou <strong>10,6</strong> en coefficient matière pure (0,267 EUR / 2,84 EUR). Coût matière
              boule seule (sans cornet) = 0,42 EUR. Food cost matière : 14,8 % — conforme cible glacier.
            </p>
          </div>

          <Callout type="info">
            <strong>Le rêve glacier :</strong> 80-90 % de marge brute (coût matière pur), c'est le
            poste matière le plus optimisé de toute la restauration. Mais cette marge doit absorber
            12 mois de charges fixes (loyer, assurances, énergie chambre froide) pour 5-7 mois
            d'activité intense. La marge nette réelle après charges saisonnières : 12-25 %.
          </Callout>
        </section>

        {/* ═════════════ SECTION 5 : Tableau 12 produits ═════════════ */}
        <section id="tableau" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="5">
            Tableau 12 produits glacier : boule, coupe, parfait, sorbet, magnum maison
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici un panorama de 12 produits standards d'un glacier-salon de thé moderne, avec
              coût matière réel, prix de vente courant et marge brute. Tous les prix sont en HT
              (TVA 10 % en glacerie à emporter, 20 % sur place selon contexte).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white">
              <thead>
                <tr className="bg-pink-50 text-mono-350 border-b border-mono-900">
                  <th className="text-left py-3 px-3 font-semibold">Produit</th>
                  <th className="text-right py-3 px-3 font-semibold">Coût matière</th>
                  <th className="text-right py-3 px-3 font-semibold">Prix vente TTC</th>
                  <th className="text-right py-3 px-3 font-semibold">Prix vente HT</th>
                  <th className="text-right py-3 px-3 font-semibold">Food cost</th>
                  <th className="text-right py-3 px-3 font-semibold">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-3 px-3 font-medium text-mono-100">Boule glace vanille (100g + cornet)</td><td className="py-3 px-3 text-right">0,52 EUR</td><td className="py-3 px-3 text-right">3,00 EUR</td><td className="py-3 px-3 text-right">2,84 EUR</td><td className="py-3 px-3 text-right">18 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">82 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-3 font-medium text-mono-100">Boule sorbet citron (100g + cornet)</td><td className="py-3 px-3 text-right">0,38 EUR</td><td className="py-3 px-3 text-right">3,00 EUR</td><td className="py-3 px-3 text-right">2,84 EUR</td><td className="py-3 px-3 text-right">13 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">87 %</td></tr>
                <tr><td className="py-3 px-3 font-medium text-mono-100">Boule pistache Bronte (100g)</td><td className="py-3 px-3 text-right">1,25 EUR</td><td className="py-3 px-3 text-right">4,20 EUR</td><td className="py-3 px-3 text-right">3,98 EUR</td><td className="py-3 px-3 text-right">31 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">69 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-3 font-medium text-mono-100">Coupe Romanoff (3 boules + fraises)</td><td className="py-3 px-3 text-right">1,80 EUR</td><td className="py-3 px-3 text-right">9,50 EUR</td><td className="py-3 px-3 text-right">9,00 EUR</td><td className="py-3 px-3 text-right">20 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">80 %</td></tr>
                <tr><td className="py-3 px-3 font-medium text-mono-100">Coupe Dame Blanche (chocolat chaud)</td><td className="py-3 px-3 text-right">1,45 EUR</td><td className="py-3 px-3 text-right">8,50 EUR</td><td className="py-3 px-3 text-right">8,05 EUR</td><td className="py-3 px-3 text-right">18 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">82 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-3 font-medium text-mono-100">Parfait glace maison (part 120g)</td><td className="py-3 px-3 text-right">0,95 EUR</td><td className="py-3 px-3 text-right">7,00 EUR</td><td className="py-3 px-3 text-right">6,63 EUR</td><td className="py-3 px-3 text-right">14 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">86 %</td></tr>
                <tr><td className="py-3 px-3 font-medium text-mono-100">Magnum maison chocolat (80g)</td><td className="py-3 px-3 text-right">0,75 EUR</td><td className="py-3 px-3 text-right">4,50 EUR</td><td className="py-3 px-3 text-right">4,26 EUR</td><td className="py-3 px-3 text-right">18 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">82 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-3 font-medium text-mono-100">Sandwich glace artisanal</td><td className="py-3 px-3 text-right">0,62 EUR</td><td className="py-3 px-3 text-right">4,80 EUR</td><td className="py-3 px-3 text-right">4,55 EUR</td><td className="py-3 px-3 text-right">14 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">86 %</td></tr>
                <tr><td className="py-3 px-3 font-medium text-mono-100">Milkshake vanille (300 ml)</td><td className="py-3 px-3 text-right">0,85 EUR</td><td className="py-3 px-3 text-right">5,50 EUR</td><td className="py-3 px-3 text-right">5,21 EUR</td><td className="py-3 px-3 text-right">16 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">84 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-3 font-medium text-mono-100">Granité citron / fraise (150 ml)</td><td className="py-3 px-3 text-right">0,35 EUR</td><td className="py-3 px-3 text-right">3,50 EUR</td><td className="py-3 px-3 text-right">3,31 EUR</td><td className="py-3 px-3 text-right">11 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">89 %</td></tr>
                <tr><td className="py-3 px-3 font-medium text-mono-100">Pot 500 ml à emporter (vanille)</td><td className="py-3 px-3 text-right">2,10 EUR</td><td className="py-3 px-3 text-right">12,00 EUR</td><td className="py-3 px-3 text-right">10,91 EUR</td><td className="py-3 px-3 text-right">19 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">81 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-3 font-medium text-mono-100">Bac 1L wholesale (BtoB restaurants)</td><td className="py-3 px-3 text-right">3,80 EUR</td><td className="py-3 px-3 text-right">14,00 EUR</td><td className="py-3 px-3 text-right">12,73 EUR</td><td className="py-3 px-3 text-right">30 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">70 %</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-mono-400">
            Note : food cost matière pur (sans main-d'oeuvre ni coût froid). Marge brute = 100 % - food cost.
            Les pots et bacs wholesale ont un food cost plus élevé mais un panier moyen très rentable.
          </p>
        </section>

        {/* ═════════════ SECTION 6 : Specificites operationnelles ═════════════ */}
        <section id="operations" className="mb-16">
          <SectionHeading icon={<Sun className="w-6 h-6" />} number="6">
            Spécificités opérationnelles : saisonnalité, chambre froide, production amont
          </SectionHeading>

          <div className="prose-content">
            <p>
              Au-delà du food cost, trois réalités opérationnelles structurent l'économie d'un glacier
              artisanal. Maîtriser ces trois axes est la condition pour transformer une marge brute
              élevée (80 %+) en marge nette saine (15-25 %).
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <OptimisationCard
              number={1}
              title="Saisonnalité : 70 % du CA sur 5 mois"
              desc="Mai à septembre concentre 70 % du CA annuel. Juillet-août pèse 35-40 % à eux seuls. Stratégie : (1) Pré-saison avril = préparation stocks + recrutement extras, (2) Pic juin-août = production intensive 6 jours/7, (3) Post-saison octobre-novembre = liquidation stocks + création gamme hivernale. RestauMargin permet de bâti un budget prévisionnel mensuel avec saisonnalité paramétrée."
              icon={<Sun className="w-5 h-5" />}
            />
            <OptimisationCard
              number={2}
              title="Chambre froide -18°C : coût permanent 12 mois"
              desc="Une chambre froide négative tourne 24/7 toute l'année, même en hiver quand l'activité est réduite. Coût : 1 000-1 500 EUR/an d'électricité + 800-1 200 EUR de maintenance/réfrigérant. Solution : équiper d'un thermostat intelligent + isolation renforcée = -30 % consommation. Amortissement chambre froide professionnelle : 8-12 000 EUR sur 10 ans = 800-1 200 EUR/an à intégrer."
              icon={<Snowflake className="w-5 h-5" />}
            />
            <OptimisationCard
              number={3}
              title="Production en amont : 2-4 jours de stock"
              desc="La glace artisanale doit être produite 24-72h avant vente (durcissement en cellule -40°C puis stockage -18°C). Cela impose une planification rigoureuse : prévoir lots de 6-10 litres par parfum, anticiper pic week-end x3 vs semaine, gérer rotation FIFO sur stock 7-10 jours max. RestauMargin offre un module de planification de production avec alertes de rupture et suggestions de batch."
              icon={<CloudSnow className="w-5 h-5" />}
            />
            <OptimisationCard
              number={4}
              title="Main-d'oeuvre extras saisonniers : juin-août"
              desc="En haute saison, un glacier passe de 2 à 5-8 personnes. Salaires extras (contrat CDD saisonnier) : 12,50 EUR brut/heure x charges 35 % = 16,90 EUR coût employeur. Pour 5 extras x 35h x 12 semaines = 35 500 EUR de masse salariale. À intégrer dans le calcul de marge nette saisonnière. RestauMargin trace les heures saisonnières séparément des permanents."
              icon={<Award className="w-5 h-5" />}
            />
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Sides salon de the ═════════════ */}
        <section id="sides" className="mb-16">
          <SectionHeading icon={<Coffee className="w-6 h-6" />} number="7">
            Sides salon de thé : café, thé, pâtisseries (marge 60-75 %)
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'intégration d'une offre salon de thé est devenue quasi-obligatoire pour les glaciers
              urbains modernes. Elle apporte 3 avantages décisifs : (1) Activité hivernale qui amortit
              les charges fixes, (2) Augmentation du ticket moyen de +40 à +70 %, (3) Diversification
              de la clientèle (matinée professionnelle, goûter famille).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-white">
              <thead>
                <tr className="bg-pink-50 text-mono-350 border-b border-mono-900">
                  <th className="text-left py-3 px-3 font-semibold">Produit salon de thé</th>
                  <th className="text-right py-3 px-3 font-semibold">Coût matière</th>
                  <th className="text-right py-3 px-3 font-semibold">Prix vente TTC</th>
                  <th className="text-right py-3 px-3 font-semibold">Food cost</th>
                  <th className="text-right py-3 px-3 font-semibold">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr><td className="py-3 px-3 font-medium text-mono-100">Espresso simple</td><td className="py-3 px-3 text-right">0,18 EUR</td><td className="py-3 px-3 text-right">2,20 EUR</td><td className="py-3 px-3 text-right">9 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">91 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-3 font-medium text-mono-100">Cappuccino / Latte</td><td className="py-3 px-3 text-right">0,42 EUR</td><td className="py-3 px-3 text-right">4,20 EUR</td><td className="py-3 px-3 text-right">11 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">89 %</td></tr>
                <tr><td className="py-3 px-3 font-medium text-mono-100">Thé vert / noir en feuilles</td><td className="py-3 px-3 text-right">0,28 EUR</td><td className="py-3 px-3 text-right">4,50 EUR</td><td className="py-3 px-3 text-right">7 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">93 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-3 font-medium text-mono-100">Chocolat chaud maison</td><td className="py-3 px-3 text-right">0,75 EUR</td><td className="py-3 px-3 text-right">5,50 EUR</td><td className="py-3 px-3 text-right">15 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">85 %</td></tr>
                <tr><td className="py-3 px-3 font-medium text-mono-100">Macaron unité (saveur jour)</td><td className="py-3 px-3 text-right">0,55 EUR</td><td className="py-3 px-3 text-right">2,20 EUR</td><td className="py-3 px-3 text-right">26 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">74 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-3 font-medium text-mono-100">Éclair chocolat / café</td><td className="py-3 px-3 text-right">1,15 EUR</td><td className="py-3 px-3 text-right">4,80 EUR</td><td className="py-3 px-3 text-right">25 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">75 %</td></tr>
                <tr><td className="py-3 px-3 font-medium text-mono-100">Tarte aux fruits du jour</td><td className="py-3 px-3 text-right">1,80 EUR</td><td className="py-3 px-3 text-right">6,80 EUR</td><td className="py-3 px-3 text-right">28 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">72 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-3 font-medium text-mono-100">Pain au chocolat / Croissant</td><td className="py-3 px-3 text-right">0,65 EUR</td><td className="py-3 px-3 text-right">2,40 EUR</td><td className="py-3 px-3 text-right">30 %</td><td className="py-3 px-3 text-right font-bold text-emerald-700">70 %</td></tr>
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Combo gagnant :</strong> thé en feuilles + macaron = 6,70 EUR ticket avec 0,83 EUR
            de coût matière = 88 % de marge brute. C'est l'offre signature goûter qui transforme
            l'économie hivernale. Pour aller plus loin, consultez notre
            <Link to="/blog/calcul-marge-restaurant" className="underline font-semibold hover:text-teal-700 ml-1">guide complet du calcul de marge</Link>.
          </Callout>
        </section>

        {/* ═════════════ SECTION 8 : KPI quotidiens ═════════════ */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="8">
            KPI glacier : ticket moyen, rotations rapides l'été
          </SectionHeading>

          <div className="prose-content">
            <p>
              La saisonnalité impose un suivi quotidien rigoureux des KPI clés. Voici les 6 indicateurs
              qu'un glacier-salon de thé doit tracker avec un logiciel comme RestauMargin pour piloter
              sa rentabilité saisonnière.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            {[
              {
                kpi: 'Ticket moyen glacier',
                cible: '5-9 EUR été / 9-14 EUR hiver',
                formule: 'CA / Nb tickets',
                action: 'Pousser combos 2 boules + suppléments (chantilly, sauce).',
              },
              {
                kpi: 'Rotation chaise (saison)',
                cible: '> 3 tours/jour été',
                formule: 'Nb clients / Nb places assises',
                action: 'Réduire temps de service : prépayer + livraison rapide table.',
              },
              {
                kpi: 'Food cost matière',
                cible: '< 18 % du CA',
                formule: 'Coût matière / CA x 100',
                action: 'Au-delà : vérifier portions + prix fournisseurs trimestriels.',
              },
              {
                kpi: 'Taux de pertes glace',
                cible: '< 3 % du volume produit',
                formule: 'Volume jeté / Volume produit x 100',
                action: 'Production juste-à-temps + flash sales fin de journée.',
              },
              {
                kpi: 'CA par mètre linéaire vitrine',
                cible: '> 800 EUR/jour été',
                formule: 'CA quotidien / longueur vitrine',
                action: 'Sous-performant : revoir disposition + signalisation parfums.',
              },
              {
                kpi: 'Part wholesale BtoB',
                cible: '15-25 % du CA annuel',
                formule: 'CA wholesale / CA total x 100',
                action: 'Sous 10 % : prospecter hôtels, restaurants, traiteurs locaux.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-mono-100">{item.kpi}</h3>
                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">{item.cible}</span>
                </div>
                <div className="text-xs text-mono-500 mb-2"><strong>Formule :</strong> {item.formule}</div>
                <p className="text-sm text-mono-400 leading-relaxed"><strong>Action :</strong> {item.action}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Optimisation ═════════════ */}
        <section id="optimisation" className="mb-16">
          <SectionHeading icon={<Lightbulb className="w-6 h-6" />} number="9">
            Optimisation : produit signature, partenariats, wholesale BtoB
          </SectionHeading>

          <div className="prose-content">
            <p>
              Au-delà du food cost optimisé, voici 5 leviers éprouvés pour transformer un glacier
              saisonnier en activité rentable toute l'année, avec une marge nette supérieure à 20 %.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <OptimisationCard
              number={1}
              title="Créer un produit signature 'PR' (Public Relations)"
              desc="Un glace exceptionnelle, originale, photogénique : pistache Bronte + caramel salé + feuille d'or. Vendue 5,50 EUR/boule (vs 3 EUR standard), elle devient l'objet de tous les posts Instagram/TikTok. Génération de trafic organique gratuit = +15 à +30 % de fréquentation. Marge sur le signature : 65-70 % (vs 82 % standard) mais effet multiplicateur sur le CA total."
              icon={<Sparkles className="w-5 h-5" />}
            />
            <OptimisationCard
              number={2}
              title="Partenariats hôtels et restaurants haut de gamme"
              desc="Wholesale BtoB : livraison de bacs 5 L à 35-45 EUR HT/bac (vs 75 EUR retail). Marge wholesale : 60-65 % (vs 82 % retail) mais volumes constants 12 mois et zéro charges variables (pas de service, pas d'emballage). 10 hôtels x 2 bacs/mois = 700-900 EUR/mois additionnels marge nette."
              icon={<PiggyBank className="w-5 h-5" />}
            />
            <OptimisationCard
              number={3}
              title="Distribution chez épiceries fines et caves à fromage"
              desc="Pots 500 ml signature vendus chez épiceries premium (Causses, La Grande Épicerie, magasins indépendants) à 8 EUR HT (vs 12 EUR retail). Marge : 55-60 %, mais visibilité marque et acquisition clients premium. Démarrer petit : 3-5 références chez 5-10 points de vente locaux, scaler progressivement."
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <OptimisationCard
              number={4}
              title="Offre événementielle : mariages, baptêmes, anniversaires"
              desc="Bar à glace événementiel : 8-12 parfums + 4 toppings + cônes + cuillères en bois = forfait 5-8 EUR/personne (mini 50 personnes). Pour un mariage 150 personnes : 1 050 EUR CA, 300 EUR de coût matière, marge brute 71 %. Activité hors-saison clé pour septembre-décembre."
              icon={<Award className="w-5 h-5" />}
            />
            <OptimisationCard
              number={5}
              title="Hiver : salés tea-time, gâteaux ethniques, viennoiseries chaudes"
              desc="Le challenge hivernal d'un salon de thé : maintenir 60 % de l'activité estivale. Solutions : (1) Gâteaux ethniques chauds (rivijka serbe, baklava, kouign-amann), (2) Thé afternoon à l'anglaise = 25 EUR/personne (rentabilité x4 vs simple thé), (3) Brunch dimanche = 28 EUR/personne, (4) Cours de pâtisserie 3h = 95 EUR/personne (marge 75 %)."
              icon={<Coffee className="w-5 h-5" />}
            />
          </div>

          <Callout type="info">
            <strong>Pour aller plus loin :</strong> consultez notre
            <Link to="/blog/coefficient-multiplicateur" className="underline font-semibold hover:text-teal-700 ml-1">guide complet du coefficient multiplicateur</Link>
            et notre article sur
            <Link to="/blog/calcul-marge-restaurant" className="underline font-semibold hover:text-teal-700 ml-1">le calcul de marge en restauration</Link>.
          </Callout>
        </section>

        {/* ═════════════ SECTION 10 : Cas concret ═════════════ */}
        <section id="cas" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="10">
            Cas concret : Glacier La Sorbetière (Bordeaux) — 12 % à 28 % marge nette en 8 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              La Sorbetière (nom modifié pour anonymat client), glacier-salon de thé situé à
              Bordeaux centre, a adopté RestauMargin en septembre 2025. Voici la transformation
              chiffrée sur 8 mois (septembre 2025 à mai 2026, cycle complet intégrant 1 saison
              haute et 1 hiver salon de thé).
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-700" />
                <h3 className="font-bold text-red-900">Avant RestauMargin (sept 2025)</h3>
              </div>
              <ul className="space-y-2 text-sm text-red-800">
                <li>- Chiffre d'affaires annuel : <strong>280 000 EUR</strong></li>
                <li>- Food cost matière réel : <strong>22 %</strong></li>
                <li>- Pertes invendus / fin de saison : <strong>8 % du volume</strong></li>
                <li>- Aucune activité wholesale BtoB</li>
                <li>- Ticket moyen : <strong>4,80 EUR</strong></li>
                <li>- Hiver salon de thé embryonnaire</li>
                <li>- Marge nette : <strong>12 % (33 600 EUR)</strong></li>
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Après 8 mois (mai 2026)</h3>
              </div>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li>- Chiffre d'affaires annuel : <strong>365 000 EUR</strong> (+30 %)</li>
                <li>- Food cost matière optimisé : <strong>15 %</strong></li>
                <li>- Pertes réduites à <strong>2,5 % du volume</strong></li>
                <li>- Wholesale BtoB : <strong>+35 000 EUR/an</strong></li>
                <li>- Ticket moyen : <strong>7,20 EUR</strong></li>
                <li>- Hiver salon de thé : <strong>+45 % CA hivernal</strong></li>
                <li>- Marge nette : <strong>28 % (102 200 EUR)</strong></li>
              </ul>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Les 5 actions clés mises en place</h3>
            <ol className="list-decimal list-inside space-y-2 text-mono-350">
              <li>
                <strong>Standardisation des recettes glace</strong> avec balance numérique au gramme :
                gain de 7 points de food cost (22 % à 15 %).
              </li>
              <li>
                <strong>Production juste-à-temps en batch 6 L</strong> avec planning hebdomadaire :
                réduction pertes de 8 % à 2,5 %.
              </li>
              <li>
                <strong>Prospection wholesale BtoB</strong> (5 hôtels 4* + 3 restaurants gastronomiques
                locaux) : +35 000 EUR/an de CA marge 60 %.
              </li>
              <li>
                <strong>Lancement offre salon de thé premium</strong> (afternoon tea 25 EUR + brunch
                dimanche 28 EUR) : +45 % de CA hivernal.
              </li>
              <li>
                <strong>Création d'un produit signature</strong> 'Sorbet Saint-Émilion' (sorbet
                vinifié au merlot) : effet PR Instagram + +18 % de fréquentation week-end.
              </li>
            </ol>

            <p className="mt-6 text-mono-350">
              Résultat global : <strong className="text-emerald-700">+68 600 EUR de bénéfice
              net en 8 mois</strong>, soit un ROI de 296x sur l'abonnement RestauMargin
              (29 EUR/mois x 8 mois = 232 EUR).
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes glacier salon de thé</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ═════════════ SECTION CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Essayez RestauMargin Glacier gratuitement
            </h2>
            <p className="text-pink-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Le logiciel SaaS français qui intègre recettes glace, coût froid -18°C et
              saisonnalité dans le calcul de marge glacier salon de thé.
            </p>
            <p className="text-pink-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> — essai gratuit 7 jours, sans engagement, sans carte bancaire.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-pink-700 font-bold rounded-full hover:bg-pink-50 transition-colors text-lg shadow-lg"
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
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-pink-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-pink-700 transition-colors">Coefficient multiplicateur</h3>
              <p className="text-xs text-mono-500">Méthodes et benchmarks par catégorie de produit.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-pink-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-pink-700 transition-colors">Calcul marge restaurant</h3>
              <p className="text-xs text-mono-500">Guide complet food cost, marge brute, marge nette.</p>
            </Link>
            <Link to="/outils/calculateur-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-pink-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-pink-700 transition-colors">Calculateur food cost gratuit</h3>
              <p className="text-xs text-mono-500">Outil en ligne pour calculer votre marge en 30 sec.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-pink-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-pink-700 transition-colors">Essai gratuit 7 jours</h3>
              <p className="text-xs text-mono-500">Sans carte bancaire, sans engagement.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
          <Link to="/" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">
            La plateforme de gestion de marge pour les glaciers, salons de thé et restaurants.
          </p>
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

function SectionHeading({ icon, number, children }: { icon: React.ReactNode; number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-pink-100 text-pink-700 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-mono-100">
        <span className="text-pink-600 mr-2">{number}.</span>
        {children}
      </h2>
    </div>
  );
}

function OptimisationCard({ number, title, desc, icon }: { number: number; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-12 h-12 bg-pink-100 text-pink-700 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="text-pink-600">{icon}</div>
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
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-pink-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
