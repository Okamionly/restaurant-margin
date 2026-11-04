import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Beef, Zap, Award, Sparkles, Flame, Clock, Truck, Users } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO — "Logiciel de marge pour kebab et doner"
   Mots-cles cibles : logiciel marge kebab / food cost doner /
   sandwicherie marge / gestion broche kebab
   ~2 600 mots — mode clair, fond blanc, theme W&B + accent amber
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost idéal pour un kebab en 2026 ?',
    answer: "Le food cost idéal pour un kebab se situe entre 25 % et 30 %. C'est plus bas qu'un burger fast casual (28-32 %) car la broche permet de rationaliser les portions de viande au gramme près. La marge se gagne sur le volume (100-300 menus/jour) plutôt que sur le ticket moyen. Au-delà de 32 % de food cost, le business devient fragile.",
  },
  {
    question: 'Combien coûte une broche kebab veau-agneau ou poulet ?',
    answer: "Broche veau + agneau (15-20 kg) chez Metro ou grossiste halal : 8 à 12 EUR/kg. Broche poulet mariné (10-15 kg) : 6 à 9 EUR/kg. Une broche veau-agneau de 20 kg coûte donc 160-240 EUR et permet de produire 80 à 100 kebabs (portion 200 g de viande). Coût viande par kebab : 1,80 à 2,40 EUR.",
  },
  {
    question: "Comment décomposer le coût d'un kebab classique en sandwich ?",
    answer: "Décomposition standard kebab sandwich 200 g de viande : pain pita 0,30-0,50 EUR, viande broche 1,80-2,40 EUR, frites portion 0,40 EUR, crudités (salade, tomate, oignon, chou rouge) 0,30 EUR, sauces 0,20 EUR, emballage 0,15 EUR. Total : 3,15 à 3,95 EUR. Vendu 8-10 EUR, food cost réel 35-40 % (légèrement au-delà de la cible).",
  },
  {
    question: 'Marché français du kebab et doner en 2026 : combien pèse-t-il ?',
    answer: "Le marché français du kebab et doner atteint 3 milliards d'euros en 2026 via plus de 25 000 points de vente actifs (Snacking Magazine + Gira Conseil). Croissance annuelle stable de +5 % depuis 2022, portée par la montée en gamme (assiettes premium, falafel, halal certifié) et la livraison plateforme. C'est le 3e segment fast food en France après burger et pizza.",
  },
  {
    question: 'Veau-agneau ou poulet : quel impact sur la marge kebab ?',
    answer: "Broche veau + agneau : 10-12 EUR/kg, image premium, prix de vente 9-12 EUR sandwich. Broche poulet : 6-9 EUR/kg, marge supérieure mais positionnement moins premium, prix de vente 7-10 EUR sandwich. Le mix 70 % veau-agneau + 30 % poulet permet de couvrir toute la clientèle tout en préservant un food cost moyen de 28 %.",
  },
  {
    question: 'Combien de menus kebab par heure peut produire un sandwich shop ?',
    answer: "Un sandwich kebab bien organisé produit 50 à 80 menus par heure en rush. Clé : 1 personne à la broche (découpe + montage), 1 personne aux frites + sauces, 1 personne au comptoir (encaissement + boissons). En version 1 personne (small shop), la productivité tombe à 25-35 menus/heure mais le coût main d'oeuvre est divisé par 3.",
  },
  {
    question: 'Quelle marge sur les boissons et les sides dans un kebab ?',
    answer: "Les boissons sont le levier de marge #1 : Coca 33 cl acheté 0,25 EUR, vendu 2,50 EUR (marge brute 90 %). Sides comme les chicken wings ou bouchées : achat 0,40 EUR, vente 4-5 EUR (marge 88 %). Un kebab qui vend 1 boisson + 1 side à 70 % de ses clients passe sa marge brute moyenne de 65 % à 73 %, et son ticket moyen de 8 EUR à 12 EUR.",
  },
  {
    question: 'Livraison kebab via Uber Eats ou Deliveroo : marge tenable ?',
    answer: "C'est très délicat. Le kebab souffre en livraison : pain qui se ramollit, frites tièdes, sauces qui détrempent. Avec une commission plateforme de 25-30 % et un prix de vente identique à sur place (8-10 EUR), la marge nette chute sous 5 %. Solutions : +15-20 % de surcharge sur les prix livraison, zone de livraison limitée à 2 km, emballage triple (frites à part, sauces à part, pain emballé). Au-delà de 30 commandes/jour, recruter 1 livreur propre devient rentable.",
  },
  {
    question: 'Quels KPI suivre dans un kebab au quotidien ?',
    answer: "Les 5 KPI essentiels kebab : (1) Food cost matière 25-30 %, (2) Ticket moyen 8-12 EUR (sur place) / 12-16 EUR (livraison avec menu), (3) Volume menus/jour 100-300, (4) Productivité cuisine 50-80 menus/heure, (5) Mix attachés (frites + boisson + side). RestauMargin centralise ces KPI et alerte dès qu'un seuil est franchi (rupture broche, hausse prix viande, frites trop chargées).",
  },
  {
    question: 'Pourquoi un logiciel de marge est indispensable pour un kebab ?',
    answer: "Un kebab gère 8-15 références (sandwich, assiette, tacos, durum, salade, menu enfant, frites, boissons), avec des prix viande très volatils (broche +/- 15 % selon saisons et certif halal). RestauMargin scanne les factures grossistes (Metro, Promocash, boucher halal), met à jour les coûts au gramme près et alerte dès qu'un kebab passe sous le seuil de marge.",
  },
];

export default function LogicielMargeKebab() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Logiciel marge kebab doner | Food cost sandwich | RestauMargin"
        description="Logiciel pour calculer marge kebab, doner, sandwicherie. Food cost cible 25-30 %, gestion broche veau-agneau / poulet, productivité menus/heure. Essai gratuit 7 jours."
        path="/logiciel-marge-kebab"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels métier', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            { name: 'Logiciel marge kebab', url: 'https://www.restaumargin.fr/logiciel-marge-kebab' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour kebab et doner en 2026',
            description: "Guide complet du calcul de marge pour kebab et sandwicherie : décomposition coût broche, food cost cible 25-30 %, productivité menus/heure, KPI sandwich shop et exemple illustratif.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 2600,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/logiciel-marge-kebab' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin Kebab',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Kebab Doner Margin Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-kebab',
            description: "Logiciel SaaS de calcul de marge pour kebab et doner : food cost par sandwich, suivi prix broche veau-agneau / poulet, gestion menus combo, productivité menus/heure, KPI sandwich shop, scan factures grossistes halal, alertes prix viande et pain pita.",
            featureList: [
              'Fiches techniques kebab avec grammages précis (pain, viande, frites, crudités, sauces)',
              'Calcul food cost automatique par sandwich / assiette / durum / tacos',
              'Suivi prix broches veau-agneau et poulet en temps réel',
              'Gestion menus combo (sandwich + frites + boisson) et upsell',
              'Scan factures grossistes Metro, Promocash, boucher halal (OCR)',
              'KPI spécifiques kebab : menus/heure, ticket moyen, mix attachés',
              'Alertes déviation prix viande broche, pain pita, sauces',
              'Compatible PWA tablette comptoir et balance Bluetooth',
            ],
            offers: {
              '@type': 'Offer',
              price: '19',
              priceCurrency: 'EUR',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: '19',
                priceCurrency: 'EUR',
                unitText: 'MONTH',
              },
            },
          },
        ]}
      />

      {/* Navbar */}
      <PublicHeader />

      {/* Breadcrumbs visibles */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/logiciel-marge-restaurant" className="hover:text-teal-600">Logiciels métier</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge kebab</span>
        </div>
      </div>

      {/* Hero / H1 */}
      <BlogArticleHero
        category="Kebab / Sandwicherie"
        readTime="13 min"
        date="Mai 2026"
        title="Logiciel de marge pour kebab et doner en 2026"
        accentWord="kebab"
        subtitle="Le marché français du kebab pèse 3 milliards d'euros via 25 000 points de vente (+5 %/an). Mais entre prix broche volatil, commissions livraison et concurrence locale, la marge se joue au gramme près. Méthode, décomposition coût broche et KPI spécifiques sandwich shop."
      />

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="header" />

        {/* Encadre reperes cles */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 via-teal-700 to-amber-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Repères clés kebab et sandwicherie</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les ratios à mémoriser
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost cible kebab</strong> : 25 % à 30 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">2.</span>
              <span><strong className="text-white">Marge brute cible</strong> : 70 % à 75 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">3.</span>
              <span><strong className="text-white">Ticket moyen sur place</strong> : 8 à 12 EUR</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">4.</span>
              <span><strong className="text-white">Volume menus / jour</strong> : 100 à 300 menus</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Un kebab qui maîtrise sa broche, son ratio livraison et ses upsells (frites + boisson + side) peut atteindre 18-20 % de marge nette. Sans pilotage, la marge plafonne sous 6-8 %.
          </p>
        </div>

        {/* Table des matieres */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#marche', label: 'Marché kebab France 2026 : 3 Md EUR et 25 000 points de vente' },
              { href: '#specificites', label: 'Spécificités kebab : food cost 25-30 %, business à fort volume' },
              { href: '#ingredients', label: 'Coûts ingrédients : broche, pain pita, frites, crudités, sauces' },
              { href: '#decomposition', label: 'Décomposition d\'un kebab classique : pain + viande + frites + sauces' },
              { href: '#8-plats', label: 'Tableau : 8 plats kebab (assiette, sandwich, durum, tacos)' },
              { href: '#operationnel', label: 'Spécificités opérationnelles : broche, rotation, productivité' },
              { href: '#boissons', label: 'Boissons et sides : la marge cachée' },
              { href: '#kpi', label: 'Les 5 KPI essentiels d\'un kebab' },
              { href: '#optimisation', label: '5 leviers d\'optimisation : menus combo, livraison, halal' },
              { href: '#cas-lyon', label: 'Exemple illustratif : un kebab de quartier, de 6 % à 19 % de marge nette' },
              { href: '#faq', label: 'Questions fréquentes kebab' },
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

        {/* SECTION 1 : Marche kebab France 2026 */}
        <section id="marche" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Marché kebab France 2026 : 3 Md EUR et 25 000 points de vente
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le kebab n'est plus un simple snack de fin de soirée : c'est devenu le
              <strong> 3e segment fast food de France</strong>, derrière le burger et la pizza,
              devant les sushis et les wraps. En 2026, le marché français du kebab et du doner
              atteint <strong>3 milliards d'euros</strong> (données Snacking Magazine +
              Gira Conseil) via plus de <strong>25 000 points de vente actifs</strong>, avec
              une croissance annuelle stable de <strong>+5 %</strong> depuis 2022.
            </p>
            <p>
              Ce qui change depuis 2020 : la <strong>montée en gamme</strong>. Les enseignes
              comme Berliner Das Original, German Doner Kebab, Mr. Kebab ou Kapadokya
              repositionnent le kebab en concept "fast casual halal" avec des assiettes premium
              (12-16 EUR), des broches haut de gamme tracées, des pains turcs artisanaux et
              une expérience client soignée. La part du kebab vendu en sandwich tombe de 70 %
              à 55 %, au profit des assiettes (28 %), durums (12 %) et tacos (5 %).
            </p>
            <p>
              Côté opérationnel, le kebab est l'un des concepts les plus
              <strong> scalables</strong> du fast food : carte très courte (8-12 références core),
              productivité cuisine élevée (50-80 menus/heure), ticket moyen modéré (8-12 EUR)
              mais volumes massifs (100-300 menus/jour pour un shop bien implanté). La marge
              se joue au gramme près sur la découpe broche, et sur la maîtrise du ratio
              boissons / sides qui ramène 25-35 % du chiffre d'affaires.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Selon une étude IFOP 2025, 65 % des Français ont
              consommé un kebab dans les 12 derniers mois, et 38 % au moins une fois par mois.
              Le kebab est le 2e plat le plus consommé en France après la pizza, devant le
              burger. Le ticket moyen reste accessible (8-12 EUR), ce qui en fait le plat
              préféré des étudiants et actifs en quête de rapport qualité/prix.
            </Callout>
          </div>
        </section>

        {/* SECTION 2 : Specificites kebab */}
        <section id="specificites" className="mb-16">
          <SectionHeading icon={<Percent className="w-6 h-6" />} number="2">
            Spécificités kebab : food cost 25-30 %, business à fort volume
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le food cost (ou ratio matières) d'un kebab se situe entre
              <strong> 25 % et 30 %</strong>. C'est plus bas qu'un burger fast casual (28-32 %)
              car la broche permet une <strong>portion calibrée au gramme près</strong>
              (découpe au couteau électrique ou laser), et les ingrédients d'accompagnement
              (pain, crudités, sauces, frites) sont peu chers. Le kebab a 3 avantages
              structurels :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Volume élevé compense ticket modéré</strong> : un sandwich kebab a
                10 EUR x 200 menus/jour = 2 000 EUR de CA quotidien, soit autant qu'un
                restaurant traditionnel avec 50 couverts à 40 EUR. La rentabilité vient
                du volume, pas du panier.
              </li>
              <li>
                <strong>Carte très courte = stock optimisé</strong> : 8 à 12 références
                core (sandwich, assiette, durum, tacos, menu enfant) + 3 à 4 sides (frites,
                onion rings, samoussa) + 4 à 6 sauces. La rotation matières est rapide,
                le gaspillage limité à 4-6 %.
              </li>
              <li>
                <strong>Broche = portion maîtrisée</strong> : 1 broche veau-agneau de 20 kg
                produit 80 à 100 sandwichs (200 g de viande chacun). La découpe au gramme
                permet un food cost stable, contrairement aux portions servies à la louche
                ou à la main.
              </li>
            </ul>
            <p className="mt-4">
              Mais le piège existe : un food cost qui dérape (au-delà de 32 %) est souvent dû à
              une <strong>broche mal exploitée</strong> (gaspillage des parties non découpées, 6-10 %
              de perte si la broche n'est pas terminée), couplée à un manque de mise à jour des
              prix de vente face à la hausse du veau-agneau (+/- 15 % selon saisons et certif
              halal). C'est exactement le scénario qu'un <strong>logiciel de marge spécialisé
              kebab</strong> évite, en alertant en temps réel sur le ratio viande utilisée /
              viande commandée.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <KPICard
              icon={<Percent className="w-5 h-5" />}
              label="Food cost cible"
              value="25 - 30 %"
              note="-3 a 5 pts vs burger"
              color="emerald"
            />
            <KPICard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Marge brute cible"
              value="70 - 75 %"
              note="Sur place et click & collect"
              color="teal"
            />
            <KPICard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Marge nette après livraison"
              value="4 - 8 %"
              note="Si > 30 % du CA en plateforme"
              color="amber"
            />
          </div>
        </section>

        {/* SECTION 3 : Couts ingredients */}
        <section id="ingredients" className="mb-16">
          <SectionHeading icon={<Beef className="w-6 h-6" />} number="3">
            Coûts ingrédients : broche, pain pita, frites, crudités, sauces
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les prix de référence des ingrédients d'un kebab fast food premium en
              France 2026. Tarifs Metro France + Promocash + grossistes halal (May Halal,
              Madara, boucheries certifiées) mis à jour mai 2026.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Prix de référence ingrédients kebab (grossiste France)</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Ingrédient</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix achat</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût par portion</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Broche veau + agneau (15-20 kg)</td>
                  <td className="py-2 px-3 text-right">10 - 12 EUR/kg</td>
                  <td className="py-2 px-3 text-right">2,00 - 2,40 EUR (200 g)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Broche poulet mariné (10-15 kg)</td>
                  <td className="py-2 px-3 text-right">6 - 9 EUR/kg</td>
                  <td className="py-2 px-3 text-right">1,20 - 1,80 EUR (200 g)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Pain pita / galette turque</td>
                  <td className="py-2 px-3 text-right">0,30 - 0,50 EUR/unité</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Frites surgelées premium (10 mm)</td>
                  <td className="py-2 px-3 text-right">2,60 EUR/kg</td>
                  <td className="py-2 px-3 text-right">0,40 EUR (150 g portion)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Crudités (salade, tomate, oignon, chou rouge)</td>
                  <td className="py-2 px-3 text-right">2 - 3 EUR/kg</td>
                  <td className="py-2 px-3 text-right">0,30 EUR (100 g portion)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Sauces (blanche, samouraï, harissa, ketchup)</td>
                  <td className="py-2 px-3 text-right">3 - 4 EUR/litre</td>
                  <td className="py-2 px-3 text-right">0,20 EUR (50 g 2 sauces)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Emballage (papier aluminium + sachet kraft)</td>
                  <td className="py-2 px-3 text-right">0,12 EUR/set</td>
                  <td className="py-2 px-3 text-right">0,15 EUR (avec serviettes)</td>
                </tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50">
                  <td className="py-3 px-3 font-bold text-mono-100">Total kebab sandwich classique</td>
                  <td className="py-3 px-3 text-right" />
                  <td className="py-3 px-3 text-right font-bold text-amber-900">3,15 - 3,95 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Analyse rapide :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Kebab sandwich veau-agneau vendu 9 EUR sur place : food cost = 3,60 / 9 = <strong>40,0 %</strong> (alerte rouge, repasser le prix à 10 EUR ou alléger la portion)</li>
              <li>Kebab sandwich veau-agneau vendu 10 EUR sur place : food cost = 3,60 / 10 = <strong>36,0 %</strong> (encore élevé, viser 11 EUR)</li>
              <li>Kebab sandwich poulet vendu 9 EUR sur place : food cost = 3,00 / 9 = <strong>33,3 %</strong> (acceptable, marge correcte)</li>
              <li>Assiette kebab veau-agneau vendue 13 EUR : coût matières 4,60 EUR (+1 EUR de viande), food cost = <strong>35,4 %</strong> (encore élevé)</li>
            </ul>
            <p className="mt-4">
              On constate que le ratio food cost réel d'un kebab tourne autour de 33-40 %, soit
              au-dessus de la cible (25-30 %). <strong>Le levier #1</strong> : repasser les prix
              tous les 6 mois, et surtout augmenter le mix attachés boissons + sides qui ramène
              la marge brute moyenne du panier complet vers 70-72 %. C'est exactement ce qu'un
              logiciel comme RestauMargin permet de piloter au quotidien.
            </p>
          </div>
        </section>

        {/* SECTION 4 : Decomposition kebab classique */}
        <section id="decomposition" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="4">
            Décomposition d'un kebab classique : pain + viande + frites + sauces
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la décomposition précise des coûts matières pour un sandwich kebab classique
              vendu entre 9 et 12 EUR sur place. Configuration la plus répandue en France 2026
              (sandwich avec 200 g de viande broche, frites en complément, 2 sauces, crudités mixtes).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Coût matières d'un sandwich kebab classique</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Composant</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût</th>
                  <th className="text-right py-2 px-3 font-semibold">% du total</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Pain pita / galette turque</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                  <td className="py-2 px-3 text-right">11 %</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Viande broche veau-agneau (200 g)</td>
                  <td className="py-2 px-3 text-right">2,20 EUR</td>
                  <td className="py-2 px-3 text-right">61 %</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Frites + crudités (150 g + 100 g)</td>
                  <td className="py-2 px-3 text-right">0,65 EUR</td>
                  <td className="py-2 px-3 text-right">18 %</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Sauces (blanche + samouraï)</td>
                  <td className="py-2 px-3 text-right">0,20 EUR</td>
                  <td className="py-2 px-3 text-right">6 %</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Emballage (aluminium + sachet)</td>
                  <td className="py-2 px-3 text-right">0,15 EUR</td>
                  <td className="py-2 px-3 text-right">4 %</td>
                </tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50">
                  <td className="py-3 px-3 font-bold text-mono-100">Total coût matières</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-900">3,60 EUR</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-900">100 %</td>
                </tr>
                <tr className="bg-emerald-50">
                  <td className="py-3 px-3 font-bold text-mono-100">Prix de vente sur place (cible)</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-900">9 - 12 EUR</td>
                  <td className="py-3 px-3 text-right" />
                </tr>
                <tr className="bg-emerald-50">
                  <td className="py-3 px-3 font-bold text-mono-100">Food cost réel (en %)</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-900">30 - 40 %</td>
                  <td className="py-3 px-3 text-right" />
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Lecture des chiffres :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>La <strong>viande pèse 61 %</strong> du coût matières : c'est le poste #1 à piloter. Une hausse de 10 % du prix de la broche augmente le coût matières de 0,22 EUR par sandwich, soit -2 à -2,5 % de marge brute si le prix de vente ne suit pas.</li>
              <li>Les sauces (6 % du coût) sont négligeables individuellement mais leur recette signature différencie le sandwich shop. Une sauce blanche maison (ail + yaourt + herbes) coûte 0,12 EUR vs 0,20 EUR achetée pré-faite : marge +0,08 EUR x 200 sandwichs/jour = 16 EUR/jour = 480 EUR/mois.</li>
              <li>L'emballage (4 %) explose en livraison : passage à triple emballage (papier alu + boîte + sachet + sauces à part) = 0,40-0,50 EUR au lieu de 0,15 EUR, soit -3 à -4 % de marge brute en livraison.</li>
            </ul>
            <p className="mt-4">
              Un kebab qui vend à 10 EUR sandwich sec a un food cost de 36 %. <strong>Le seul
              moyen de le ramener à 28-30 %</strong> sans toucher au prix ou à la qualité,
              c'est de pousser le menu combo (sandwich + frites + boisson) qui dilue le coût
              viande dans un panier moyen plus élevé. Détail au chapitre 9.
            </p>
          </div>
        </section>

        {/* SECTION 5 : 8 plats kebab */}
        <section id="8-plats" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="5">
            8 plats kebab : assiette, sandwich, durum, tacos
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tableau de référence : 8 recettes kebab couvrant l'intégralité de la carte
              standard d'un sandwich shop français en 2026. Coûts matières basés sur les prix
              Metro France + Promocash + boucher halal T2 2026, prix de vente moyens hors
              zones premium (Paris, Lyon centre, Marseille). Tous les sandwichs incluent
              crudités + sauces, sans frites séparées sauf mention.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Plat</th>
                  <th className="text-center py-3 px-4 font-semibold">Coût matières</th>
                  <th className="text-center py-3 px-4 font-semibold">Prix sur place</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { name: 'Sandwich kebab classique (200 g veau-agneau, pita)', cm: '3,60 EUR', pv: '10,00 EUR', fc: '36 %', mb: '6,40 EUR / 64 %' },
                  { name: 'Sandwich poulet (200 g poulet, pita)', cm: '3,00 EUR', pv: '9,00 EUR', fc: '33 %', mb: '6,00 EUR / 67 %' },
                  { name: 'Assiette kebab (300 g viande, riz, salade composée)', cm: '4,60 EUR', pv: '13,50 EUR', fc: '34 %', mb: '8,90 EUR / 66 %' },
                  { name: 'Durum (galette XL, 250 g viande, frites incluses)', cm: '4,20 EUR', pv: '12,00 EUR', fc: '35 %', mb: '7,80 EUR / 65 %' },
                  { name: 'Tacos français (galette, 200 g viande, frites, cheddar)', cm: '4,40 EUR', pv: '11,50 EUR', fc: '38 %', mb: '7,10 EUR / 62 %' },
                  { name: 'Menu sandwich (sandwich + frites + boisson)', cm: '4,25 EUR', pv: '12,50 EUR', fc: '34 %', mb: '8,25 EUR / 66 %' },
                  { name: 'Menu assiette (assiette + boisson + dessert)', cm: '5,80 EUR', pv: '17,00 EUR', fc: '34 %', mb: '11,20 EUR / 66 %' },
                  { name: 'Falafel sandwich (vegan, 6 boules, pita)', cm: '2,40 EUR', pv: '9,50 EUR', fc: '25 %', mb: '7,10 EUR / 75 %' },
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
              Observations clés :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Le sandwich seul</strong> souffre d'un food cost élevé (33-38 %)
                car la viande pèse trop dans un panier à 9-10 EUR. C'est le piège classique
                du kebab traditionnel.
              </li>
              <li>
                <strong>Les menus combo</strong> (sandwich + frites + boisson) restent à 34 %
                de food cost mais avec un ticket 12,50 EUR. La marge brute en valeur absolue
                passe de 6,40 EUR à 8,25 EUR (+29 %), c'est le levier rentabilité #1.
              </li>
              <li>
                <strong>Le falafel sandwich</strong> affiche le meilleur ratio (25 % de food
                cost) grâce aux pois chiches très bon marché. C'est un win-win : demande
                vegan/végé +18 %/an en France, et marge supérieure de 11 points vs kebab
                classique.
              </li>
              <li>
                <strong>Le tacos français</strong> est rentable en CA (volume) mais le pire
                en food cost (38 %) à cause du cheddar industriel et de la galette XL. À
                vendre en menu (+frites + boisson) pour diluer le ratio.
              </li>
            </ul>
          </div>
        </section>

        {/* SECTION 6 : Specificites operationnelles */}
        <section id="operationnel" className="mb-16">
          <SectionHeading icon={<Flame className="w-6 h-6" />} number="6">
            Spécificités opérationnelles : broche, rotation, productivité
          </SectionHeading>

          <div className="prose-content">
            <p>
              Au-delà du calcul matières pur, trois variables opérationnelles déterminent la
              rentabilité réelle d'un kebab : la <strong>gestion de la broche</strong>
              (préparation, rotation, gaspillage), la <strong>productivité cuisine</strong>
              (menus/heure selon équipe) et la <strong>gestion des deux broches en parallèle</strong>
              (veau-agneau + poulet). Mal calibrés, ces 3 leviers transforment une carte rentable
              sur le papier en gouffre opérationnel.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Préparation et rotation des broches</h3>
            <p>
              Une broche veau-agneau de 20 kg est généralement préparée la veille au soir
              (montage des disques de viande mariné sur la tige) puis cuite pendant le service
              (4-6 heures de cuisson rotative). Réglementation française : la broche peut
              tourner en continu mais doit être <strong>terminée dans la journée</strong>
              (DLC = J0). Tout reste de broche non vendu doit être congelé (découpé en
              portions) ou jeté.
            </p>
            <p>
              Solutions opérationnelles :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li><strong>Dimensionner la broche selon le service</strong> : 1 broche 20 kg pour un shop 150 menus/jour, 2 broches (15 kg + 12 kg) pour un shop 250 menus/jour. Le surdimensionnement = gaspillage de fin de service.</li>
              <li><strong>Découpe au gramme près</strong> : couteau électrique calibré pour découper 200 g exactement. Permet de stabiliser le food cost à 2 % près.</li>
              <li><strong>Récupération fin de broche</strong> : les 1-2 kg restants en fin de service peuvent être découpés en lamelles et intégrés dans des durum ou tacos du lendemain. Marge supplémentaire +0,40 EUR x 5 menus = 2 EUR/jour.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Productivité cuisine : 50 à 80 menus/heure</h3>
            <p>
              Une brigade kebab standard se compose de 3 postes : <strong>broche
              (découpe + montage)</strong>, <strong>frites + sauces</strong> et
              <strong> comptoir (encaissement + boissons)</strong>. Avec un trinome rodé et
              une organisation millimétrée, la productivité atteint <strong>50 à 80 menus
              par heure</strong> en rush sans baisse de qualité. En version 1 seule personne
              (small shop indépendant), la productivité tombe à 25-35 menus/heure.
            </p>
            <p>
              Coût employeur brigade : 2 commis (1 500-1 800 EUR brut/mois chacun) + 1 patron
              au comptoir = environ <strong>6 000-7 500 EUR coût total employeur</strong>
              mensuel. Pour un kebab à 5 000 EUR de CA/jour x 26 jours = 130 000 EUR/mois de
              CA, ce ratio main d'oeuvre tourne autour de 22-25 % (excellent vs 30 % moyenne
              restauration).
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-5">
            <CuissonCard
              title="Broche électrique"
              productivite="80 - 100 sandwichs / broche 20 kg"
              cout="1 500 - 3 500 EUR"
              pros="Cuisson uniforme, peu d'entretien, conforme ERP, croûte Maillard parfaite, découpe rapide au couteau électrique"
              cons="Consommation électrique 3-5 kWh/jour, dépend de la qualité de la broche montée, courbe d'apprentissage découpe"
            />
            <CuissonCard
              title="Broche gaz"
              productivite="80 - 100 sandwichs / broche 20 kg"
              cout="2 000 - 4 500 EUR"
              pros="Coût énergie inférieur (-30 %), cuisson très traditionnelle, image authentique"
              cons="Normes ERP gaz strictes, ventilation requise, entretien hebdomadaire brûleurs, risque incendie supérieur"
            />
          </div>
        </section>

        {/* SECTION 7 : Boissons et sides */}
        <section id="boissons" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="7">
            Boissons et sides : la marge cachée du kebab
          </SectionHeading>

          <div className="prose-content">
            <p>
              Si la viande broche fait l'essentiel du CA visible, ce sont les <strong>boissons
              et sides qui font la marge nette</strong> d'un kebab. Comprendre la rentabilité
              des boissons / sides = comprendre comment passer de 8 % à 18 % de marge nette
              sans toucher au prix du sandwich principal.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Marge brute par catégorie de produit</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Produit</th>
                  <th className="text-right py-2 px-3 font-semibold">Coût achat</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix vente</th>
                  <th className="text-right py-2 px-3 font-semibold">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Coca / Fanta canette 33 cl</td>
                  <td className="py-2 px-3 text-right">0,25 EUR</td>
                  <td className="py-2 px-3 text-right">2,50 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">90 %</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Bouteille eau plate 50 cl</td>
                  <td className="py-2 px-3 text-right">0,20 EUR</td>
                  <td className="py-2 px-3 text-right">2,00 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">90 %</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Ayran / yaourt à boire 25 cl</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                  <td className="py-2 px-3 text-right">2,80 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">86 %</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Chicken wings (6 pièces)</td>
                  <td className="py-2 px-3 text-right">0,80 EUR</td>
                  <td className="py-2 px-3 text-right">5,50 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">85 %</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Nuggets / bouchées poulet (8 pièces)</td>
                  <td className="py-2 px-3 text-right">0,60 EUR</td>
                  <td className="py-2 px-3 text-right">4,50 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">87 %</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Frites portion supplémentaire</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                  <td className="py-2 px-3 text-right">3,50 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">88 %</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Dessert (baklava, tiramisu, mousse)</td>
                  <td className="py-2 px-3 text-right">0,60 EUR</td>
                  <td className="py-2 px-3 text-right">3,50 EUR</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-semibold">83 %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Calcul de l'impact sur la marge nette :</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Sans upsell : ticket moyen 10 EUR (sandwich seul), marge brute 6,40 EUR (64 %).</li>
              <li>Avec upsell boisson : ticket 12,50 EUR (+2,50 EUR), marge brute supplémentaire 2,25 EUR. Total : 8,65 EUR / 12,50 EUR = <strong>69,2 %</strong>.</li>
              <li>Avec upsell boisson + frites + side : ticket 16 EUR (+6 EUR), marge brute totale 11,75 EUR / 16 EUR = <strong>73,4 %</strong>.</li>
              <li>Sur 200 menus/jour avec 70 % de taux d'upsell complet : +840 EUR de marge brute additionnelle quotidienne, soit 25 200 EUR/mois ou 302 400 EUR/an.</li>
            </ul>

            <Callout type="info">
              <strong>Levier le plus puissant :</strong> former l'équipe à proposer
              systématiquement boisson + frites + dessert avec script standardisé
              ("Je vous mets le menu avec boisson et dessert pour 4 EUR de plus ?"). Taux
              d'acceptation moyen : 55-70 % en kebab français. C'est le levier #1 de la
              marge nette, devant la maîtrise du food cost matière.
            </Callout>
          </div>
        </section>

        {/* SECTION 8 : KPI kebab */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="8">
            Les 5 KPI essentiels d'un kebab
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un kebab bien géré pilote 5 indicateurs au quotidien. Sans ces KPI, vous naviguez
              à l'aveugle et détectez les problèmes 3-6 mois après leur apparition, quand la
              marge nette commence à fondre ou que les broches s'accumulent en fin de service.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Percent className="w-5 h-5" />, title: '1. Food cost matière', desc: 'Cible 25-30 % (28 % visé). Au-delà, alerte immédiate. Souvent dû à une hausse broche veau-agneau non répercutée sur prix de vente.' },
              { icon: <DollarSign className="w-5 h-5" />, title: '2. Ticket moyen', desc: 'Sur place : 8-12 EUR sandwich seul, 12-16 EUR avec menu combo. Livraison : 14-20 EUR menu complet. Suivre par canal. Levier upsell direct.' },
              { icon: <Users className="w-5 h-5" />, title: '3. Volume menus / jour', desc: 'Kebab quartier : 80-150/jour. Kebab transit (gare, centre-ville) : 200-400/jour. Mesurer la stabilité jour par jour, pas le total mois.' },
              { icon: <Beef className="w-5 h-5" />, title: '4. Productivité cuisine', desc: '3 personnes en rush : 50-80 menus/heure. Si < 45, problème organisation poste broche ou frites. KPI clé pour optimiser planning équipe.' },
              { icon: <Award className="w-5 h-5" />, title: '5. Mix attachés (frites + boisson + side)', desc: 'Cible 65-75 % des sandwichs vendus en menu complet. Levier principal du ticket moyen et de la marge brute réelle.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Bonus : ratio broche utilisée / commandée', desc: 'Suivre le % de viande broche réellement vendue vs commandée. Si < 90 %, gaspillage important : redimensionner la broche.' },
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

        {/* SECTION 9 : Optimisation */}
        <section id="optimisation" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="9">
            5 leviers d'optimisation : menus combo, livraison, halal
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les 5 leviers prouvés pour passer d'une marge nette kebab moyenne (6-9 %)
              à une marge nette de sandwich shop premium (18-22 %). Mis en oeuvre dans cet ordre,
              ils s'additionnent sans complexité opérationnelle excessive et sans changer le
              concept du shop.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <LevierCard
              number={1}
              title="Menus combo systématiques (sandwich + frites + boisson)"
              desc="Le levier #1 absolu. Sans upsell : ticket moyen 10 EUR. Avec menu proposé systématiquement à 12,50 EUR (+2,50 EUR) : +25 % de CA, +29 % de marge brute par commande. Sur 200 commandes/jour avec 70 % de menus complets : +350 EUR de marge brute supplémentaire quotidienne, soit 10 500 EUR/mois."
            />
            <LevierCard
              number={2}
              title="Optimisation broche : redimensionnement et fin de service"
              desc="Une broche de 20 kg pour 150 menus = 7 kg gaspillés (35 % de perte). Passer à 1 broche 15 kg + 1 broche 12 kg poulet : gaspillage divisé par 3. Économie : 2 EUR/kg gaspillé x 5 kg/jour évités = 10 EUR/jour = 300 EUR/mois. ROI immédiat."
            />
            <LevierCard
              number={3}
              title="Diversification : ajouter falafel + poulet pour élargir la clientèle"
              desc="Le falafel sandwich (food cost 25 %) ramène une clientèle vegan/végé qui évitait le kebab. Le poulet ramène les enfants et clients qui veulent moins gras. Résultat : +20-25 % de panier moyen mensuel sans investissement matériel majeur (juste 1 broche poulet ajoutée à 2 000 EUR)."
            />
            <LevierCard
              number={4}
              title="Halal certifié : labelliser pour accéder à une clientèle captive"
              desc="55 % de la clientèle kebab française privilégie le halal certifié (AVS, Achahada, MHC). La certification coûte 300-800 EUR/an mais ouvre +30-40 % de clientèle potentielle. Sur un shop à 500 000 EUR de CA/an, c'est +150 000 EUR de CA potentiel pour 800 EUR de coût. ROI 187x."
            />
            <LevierCard
              number={5}
              title="Livraison : stratégie multi-plateforme avec prix différenciés"
              desc="Sur place : 10 EUR sandwich. Click & collect : 9,50 EUR (-0,50 EUR, zéro commission). Uber Eats / Deliveroo : 12 EUR (+20 % pour absorber commission 25-30 %). Résultat : la marge brute après commission plateforme remonte de 38 % à 55-60 %. Indispensable dès que > 15 % du CA passe par les plateformes."
            />
          </div>

          <Callout type="info">
            <strong>Combo gagnant :</strong> ces 5 leviers cumulés permettent de passer de
            6-9 % à 18-22 % de marge nette en 6-12 mois. Sur un CA de 600 000 EUR/an, c'est
            entre 54 000 EUR et 78 000 EUR de bénéfice net additionnel. Notre <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800">guide complet réduction food cost</Link> et notre article sur le <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-800">coefficient multiplicateur restaurant</Link> approfondissent ces techniques.
          </Callout>
        </section>

        {/* SECTION 10 : Exemple illustratif */}
        <section id="cas-lyon" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="10">
            Exemple illustratif : un kebab de quartier, de 6 % à 19 % de marge nette
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons un exemple fictif : un kebab sandwich shop de quartier, 28 places assises +
              comptoir click & collect intensif, repris par un ancien chef de cuisine. CA annuel
              de départ :
              <strong> 510 000 EUR, marge nette 6 %</strong>.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Diagnostic initial (mois 1)</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Food cost réel : 38 % (vs cible 28-30 %). Broche surdimensionnee (2 x 25 kg veau-agneau pour 180 menus/jour = 22 % de gaspillage fin de service).</li>
              <li>Ratio livraison : 42 % du CA via Uber Eats + Deliveroo. Commission moyenne 28 %, prix identiques à sur place.</li>
              <li>Aucun suivi prix broche : factures grossiste halal entrées à la main 1 fois par semaine.</li>
              <li>Carte sur-étendue : 18 références (sandwichs, assiettes, durums, tacos, pizzas, paninis). Équipe perdue, productivité 35 menus/heure max.</li>
              <li>Pas de stratégie upsell. Taux d'attache menu combo : 38 %. Pas de différenciation prix par canal. Sauces achetées pré-faites.</li>
              <li>Pas de certif halal officielle (image flou, perte clientèle exigeante).</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Plan d'action en 4 phases</h3>
            <div className="space-y-4 mt-6">
              <PhaseCard
                phase="Phase 1 (mois 1-3)"
                title="Stabilisation broche et carte courte"
                actions={[
                  'Mise en place fiches techniques précises pour les 18 références',
                  'Réduction carte à 11 références core (suppression pizzas, paninis, 2 burgers à faible rotation)',
                  'Passage à 1 broche veau-agneau 18 kg + 1 broche poulet 12 kg (gaspillage divisé par 3)',
                  'Résultat : food cost passe de 38 % à 32 %',
                ]}
              />
              <PhaseCard
                phase="Phase 2 (mois 4-6)"
                title="Stratégie multi-canal et upsell"
                actions={[
                  'Prix différencié : +20 % sur Uber Eats / Deliveroo, -0,50 EUR en click & collect',
                  'Formation équipe upsell systématique (menu combo 12,50 EUR au lieu de sandwich 10 EUR)',
                  'Lancement 4 sauces signature maison (blanche maison, samouraï maison, harissa maison, ail confit)',
                  'Résultat : ticket moyen passe de 10 EUR à 13,20 EUR, ratio livraison plateforme tombe à 31 %',
                ]}
              />
              <PhaseCard
                phase="Phase 3 (mois 7-8)"
                title="Certification halal et diversification"
                actions={[
                  'Obtention certification AVS Halal (480 EUR/an)',
                  'Ajout falafel sandwich vegan (coût 2,40 EUR / prix 9,50 EUR / marge 75 %)',
                  'Suivi des factures fournisseurs (Metro + boucher halal)',
                  'Résultat : clientèle +28 %, food cost 30 %, taux d\'attache menu combo à 72 %',
                ]}
              />
              <PhaseCard
                phase="Phase 4 (mois 9)"
                title="Pilotage en temps réel et fidélisation"
                actions={[
                  'Tableau de bord de marge vérifié 2x/semaine (mercredi + dimanche)',
                  'Alertes prix activées sur broche veau-agneau, pain pita, frites surgelées',
                  'Lancement carte de fidélité (10e menu offert)',
                  'Résultat final : marge nette 19 %, taux de retour client +42 %',
                ]}
              />
            </div>

            <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-emerald-900 text-lg">Résultats de l'exemple après 9 mois</h3>
              </div>
              <ul className="space-y-2 text-emerald-800 text-sm">
                <li><strong>CA annuel :</strong> 510 000 EUR -- 685 000 EUR (+34 %)</li>
                <li><strong>Food cost :</strong> 38 % -- 30 %</li>
                <li><strong>Marge nette :</strong> 6 % -- 19 % (soit 30 600 EUR -- 130 150 EUR)</li>
                <li><strong>Ratio livraison plateforme :</strong> 42 % -- 27 %</li>
                <li><strong>Productivité cuisine :</strong> 35 menus/h -- 75 menus/h</li>
                <li><strong>Ticket moyen sur place :</strong> 10 EUR -- 13,20 EUR</li>
                <li><strong>Taux d'attache menu combo :</strong> 38 % -- 72 %</li>
              </ul>
            </div>

            <p className="mt-6">
              Dans cet exemple, la marge nette triple avec un investissement marginal
              (certification halal + 1 broche poulet). Le levier le plus puissant est la combinaison <strong>carte courte + upsell
              menu combo systématique + différenciation prix par canal + certif halal</strong>.
              Pour creuser la partie livraison, voir notre <Link to="/blog/livraison-restaurant-rentabilite" className="text-teal-700 underline hover:text-teal-800">guide rentabilité livraison restaurant</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="footer" />

        {/* FAQ visible */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes kebab</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-amber-600 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Piloter la marge de votre kebab avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Food cost broche, prix multi-canaux, alertes viande halal, KPI sandwich shop,
              upsell menu combo : tout ce qu'il faut pour garder une marge nette supérieure à 18 %.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>19 EUR/mois</strong> &mdash; essai gratuit 7 jours, sans engagement, sans carte bancaire.
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

        {/* Articles complementaires */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire son food cost : guide complet</h3>
              <p className="text-xs text-mono-500">Méthodes, benchmarks, leviers d'optimisation.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Coefficient multiplicateur restaurant</h3>
              <p className="text-xs text-mono-500">Du coût matières au prix de vente, méthode pas à pas.</p>
            </Link>
            <Link to="/blog/livraison-restaurant-rentabilite" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Livraison restaurant : rentabilité réelle</h3>
              <p className="text-xs text-mono-500">Commissions plateformes, marges, stratégies multi-canal.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Essai gratuit 7 jours</h3>
              <p className="text-xs text-mono-500">Pilotez votre kebab sans carte bancaire requise.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* Footer */}
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

function CuissonCard({ title, productivite, cout, pros, cons }: {
  title: string; productivite: string; cout: string; pros: string; cons: string;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-amber-300 transition-colors">
      <h3 className="font-bold text-mono-100 mb-3">{title}</h3>
      <div className="space-y-2 text-xs text-mono-400 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-mono-500">Productivité :</span>
          <span>{productivite}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-mono-500">Investissement :</span>
          <span>{cout}</span>
        </div>
      </div>
      <div className="space-y-2 text-xs">
        <div className="text-emerald-700"><strong>+ :</strong> {pros}</div>
        <div className="text-red-700"><strong>- :</strong> {cons}</div>
      </div>
    </div>
  );
}

function LevierCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-amber-600 text-white rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
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
