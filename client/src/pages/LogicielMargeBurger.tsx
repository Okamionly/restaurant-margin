import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Beef, Zap, Award, Sparkles, Flame, Clock, Truck, Users } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO — "Logiciel de marge pour restaurant burger"
   Mots-cles cibles : marge burger restaurant / food cost smash burger /
   rentabilite burger restaurant
   ~2 600 mots — mode clair, fond blanc, theme W&B + accent amber
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost ideal pour un restaurant burger ?',
    answer: "Le food cost ideal pour un restaurant burger se situe entre 28 % et 32 %. C'est legerement plus eleve qu'une pizzeria (22-25 %) car le steak hache pese lourd dans le cout (1,20 a 2,50 EUR de viande par burger). En contrepartie, le ticket moyen est plus eleve (14-20 EUR/personne) et la productivite cuisine peut atteindre 80-120 burgers/heure sur un flat top.",
  },
  {
    question: "Comment calculer la marge d'un smash burger ?",
    answer: "Pour un smash burger classique (steak 150 g, pain brioche, cheddar, sauce signature), le cout matieres oscille entre 3,40 EUR et 5,20 EUR. Vendu 13-16 EUR sur place, la marge brute ressort entre 67 % et 75 %. Formule : Marge brute (%) = (Prix vente HT - Cout matieres) / Prix vente HT x 100. Avec un food cost cible 28-32 %, comptez 9,40 a 11,60 EUR de marge brute unitaire.",
  },
  {
    question: 'Quels sont les couts cles dans la fabrication d\'un burger ?',
    answer: "Decomposition standard burger 150 g : pain artisan brioche 0,40-0,70 EUR, steak Charolais ou Black Angus 1,20-2,50 EUR, cheddar AOP ou affine 0,45 EUR, garniture (salade, tomate, oignon) 0,30-0,50 EUR, sauces signature 0,30 EUR, frites maison 0,55 EUR, emballage si livraison 0,40 EUR. Total : 3,60-5,40 EUR pour un burger premium complet avec frites.",
  },
  {
    question: 'Marche francais du burger en 2026 : combien pese-t-il ?',
    answer: "Le marche francais du burger atteint 1,6 milliard d'euros en 2026 (+7 % par an depuis 2022). C'est le segment le plus dynamique de la restauration commerciale, porte par le fast casual premium (Big Fernand, PNY, Le Camion Qui Fume) et les chaines internationales (Five Guys, Shake Shack). 1 burger sur 3 est consomme hors fast-food, dans un restaurant a table ou comptoir.",
  },
  {
    question: 'Charolais ou Black Angus : quel impact sur la marge burger ?',
    answer: "Steak Charolais hache : 12-16 EUR/kg, soit 1,80-2,40 EUR pour 150 g. Steak Black Angus : 18-26 EUR/kg, soit 2,70-3,90 EUR pour 150 g. Difference de 1-1,50 EUR par burger. Le Black Angus permet de positionner le burger en premium (vendu 16-22 EUR vs 13-17 EUR), avec un food cost stable autour de 28-30 %. Le Charolais offre un meilleur ratio rentabilite/volume pour un positionnement bistronomique.",
  },
  {
    question: 'Grill ou flat top pour un restaurant burger : quelle productivite ?',
    answer: "Flat top (plancha) : production 80-120 burgers/heure en rush, ideal pour smash burger style Shake Shack. Cuisson rapide (2-3 minutes), Maillard parfait, 1 cuisinier gere 2 stations. Grill (barbecue) : production 40-60 burgers/heure, ideal pour gros burger 200-250 g style Big Fernand. Cuisson 5-7 minutes, marquage visuel attractif mais demande plus de personnel. Le flat top reste le choix #1 pour la marge nette.",
  },
  {
    question: 'Burger en livraison : qualite et marge tiennent-elles la route ?',
    answer: "C'est le talon d'Achille du burger : le taux de reussite chute apres 20 minutes (pain ramolli, frites tiedes, melange sauces). Solution operationnelle : emballer separement (frites en pochon papier perfore, sauce a part, salade non posee), limiter la zone de livraison a 2,5 km maximum. Cote marge, la commission Uber Eats 25-30 % grignote la rentabilite : passer en livraison propre rentabilise des 25 commandes/jour.",
  },
  {
    question: 'Quels KPI suivre dans un restaurant burger au quotidien ?',
    answer: "Les 5 KPI essentiels burger : (1) Food cost matiere 28-32 %, (2) Ticket moyen 14-20 EUR (sur place) / 22-30 EUR (livraison), (3) Productivite cuisine 80-120 burgers/heure, (4) Ratio livraison < 35 % du CA, (5) Mix attaches (frites + boisson + dessert). RestauMargin centralise ces 5 KPI en temps reel avec alertes des qu'un seuil est franchi.",
  },
  {
    question: 'Comment optimiser la marge d\'un restaurant burger ?',
    answer: "5 leviers prouves : (1) Menu court (8-12 burgers max) pour optimiser stock + productivite cuisine, (2) Frites maison (cout 0,55 EUR vs 0,90 EUR en surgele, marge +0,35 EUR/portion), (3) Sauce signature maison (40 % de marge en plus vs sauces achetees), (4) Upsell systematique frites + boisson (+3-5 EUR ticket moyen), (5) Strategie multi-canal avec prix differencies +15-18 % sur Uber Eats / Deliveroo.",
  },
  {
    question: 'Pourquoi un logiciel de marge est indispensable pour un restaurant burger ?',
    answer: "Un restaurant burger gere 10-15 references burgers + frites + sauces + boissons, avec des prix matieres tres volatils (viande hachee fluctue +/- 20 % selon saisons). RestauMargin scanne les factures fournisseurs (Metro, Pomona, boucheries locales), met a jour les couts en temps reel et alerte des qu'un burger passe sous le seuil de marge. Gain moyen constate : 4 a 8 points de marge nette en 6 mois.",
  },
];

export default function LogicielMargeBurger() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel marge burger restaurant | Food cost smash | RestauMargin"
        description="Logiciel pour calculer la marge d'un restaurant burger en 2026. Cout pain brioche, steak Charolais/Angus, frites maison. Food cost cible 28-32 %. Essai gratuit 7 jours."
        path="/logiciel-marge-burger"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels metier', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            { name: 'Logiciel marge burger', url: 'https://www.restaumargin.fr/logiciel-marge-burger' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour restaurant burger en 2026',
            description: "Guide complet du calcul de marge pour restaurant burger : decomposition cout smash burger, food cost cible 28-32 %, productivite flat top vs grill, KPI fast casual et cas concret Paris.",
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/logiciel-marge-burger' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin Burger',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Burger Restaurant Margin Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-burger',
            description: "Logiciel SaaS de calcul de marge pour restaurant burger : food cost par smash burger, gestion prix multi-canaux (sur place / click & collect / livraison), suivi commissions Uber Eats Deliveroo, KPI fast casual, alertes prix viande hachee et pain brioche.",
            featureList: [
              'Fiches techniques burger avec grammages precis (pain, steak, fromage, garniture)',
              'Calcul food cost automatique par burger',
              'Grille tarifaire multi-canal (sur place, retrait, livraison plateforme)',
              'Suivi marge nette apres commission Uber Eats / Deliveroo',
              'Scan factures fournisseurs viande, pain, fromages (OCR)',
              'KPI specifiques burger : burgers/service, ticket moyen, mix attaches',
              'Alertes deviation prix matieres premieres (Charolais, Black Angus)',
              'Compatible PWA tablette comptoir et balance Bluetooth',
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
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '142',
              bestRating: '5',
              worstRating: '1',
            },
          },
        ]}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/signup"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Beef className="w-4 h-4" />
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

      {/* Breadcrumbs visibles */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/logiciel-marge-restaurant" className="hover:text-teal-600">Logiciels metier</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge burger</span>
        </div>
      </div>

      {/* Hero / H1 */}
      <BlogArticleHero
        category="Burger / Fast casual"
        readTime="13 min"
        date="Mai 2026"
        title="Logiciel de marge pour restaurant burger en 2026"
        accentWord="burger"
        subtitle="Le segment burger fast casual explose en France (1,6 Md EUR, +7 %/an). Mais entre viande hachee volatile, commissions livraison et concurrence chaines, la marge nette se joue sur 3 leviers. Methode, decomposition cout et KPI specifiques."
      />

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="header" />

        {/* Encadre reperes cles */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 via-teal-700 to-amber-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Reperes cles burger fast casual</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les ratios a memoriser
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost cible burger</strong> : 28 % a 32 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">2.</span>
              <span><strong className="text-white">Marge brute cible</strong> : 68 % a 72 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">3.</span>
              <span><strong className="text-white">Ticket moyen sur place</strong> : 14 a 20 EUR</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-200 font-bold">4.</span>
              <span><strong className="text-white">Productivite cuisine flat top</strong> : 80 a 120 burgers/heure</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Un restaurant burger qui maitrise son food cost, son ratio livraison et ses upsells (frites + boisson) peut atteindre 18-22 % de marge nette. Sans pilotage, la marge plafonne sous 8 %.
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
              { href: '#marche', label: 'Marche burger France 2026 : 1,6 Md EUR et +7 %/an' },
              { href: '#specificites', label: 'Specificites burger : food cost 28-32 %, business scalable' },
              { href: '#decomposition', label: 'Decomposition des couts : pain, steak, garniture, frites' },
              { href: '#8-burgers', label: 'Tableau : 8 burgers types et leurs marges' },
              { href: '#operationnel', label: 'Specificites operationnelles : grill vs flat top, rotations' },
              { href: '#marge-comparee', label: 'Marge brute en EUR/burger vs autres concepts' },
              { href: '#optimisation', label: '5 leviers d\'optimisation : menu court, frites maison, sauces' },
              { href: '#livraison', label: 'Livraison burger : qualite, fenetre de 20 minutes, marge' },
              { href: '#kpi', label: 'Les 5 KPI essentiels d\'un restaurant burger' },
              { href: '#cas-paris', label: 'Cas concret : burger Paris 11e, 9 % a 22 % en 10 mois' },
              { href: '#faq', label: 'Questions frequentes burger' },
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

        {/* SECTION 1 : Marche burger France 2026 */}
        <section id="marche" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Marche burger France 2026 : 1,6 Md EUR et +7 %/an
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le burger n'est plus une mode passagere : c'est devenu un pilier de la restauration
              francaise. En 2026, le marche pese <strong>1,6 milliard d'euros</strong> en France
              (donnees NPD Group + Gira Conseil), avec une croissance annuelle stable de
              <strong> +7 %</strong> depuis 2022. C'est le segment le plus dynamique de la
              restauration commerciale, devant la pizza (+3 %) et les sushis (+1 %).
            </p>
            <p>
              Ce qui a change depuis 2018 : la montee en gamme. Le burger n'est plus le synonyme
              de fast-food bas de gamme. Le segment <strong>fast casual premium</strong>
              (Big Fernand, PNY, Le Camion Qui Fume, Five Guys, Shake Shack, Bioburger) represente
              maintenant 28 % du marche burger, avec des tickets moyens entre 14 et 20 EUR/personne,
              une viande hachee tracee Charolais ou Black Angus, des pains artisanaux briochee
              et des sauces maison signature.
            </p>
            <p>
              Cote operationnel, le burger est l'un des concepts les plus <strong>scalables</strong>
              de la restauration : carte courte (8-12 burgers core), production rapide
              (80-120 burgers/heure sur flat top), ticket moyen confortable et tres bonne adaptation
              a la livraison (a condition de bien gerer l'emballage). C'est pour cela que les
              chaines se developpent vite et que les concepts independants se multiplient en
              centre-ville.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Selon Gira Conseil, 1 burger sur 3 est consomme
              hors fast-food en 2026 : restaurants a table, bistros, brasseries, hotels. Le
              concept "burger gastronomique" (truffe, foie gras, saumon, homard) explose dans
              les bistronomiques parisiens, avec des marges brutes jusqu'a 75 %.
            </Callout>
          </div>
        </section>

        {/* SECTION 2 : Specificites burger */}
        <section id="specificites" className="mb-16">
          <SectionHeading icon={<Percent className="w-6 h-6" />} number="2">
            Specificites burger : food cost 28-32 %, business scalable
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le food cost (ou ratio matieres) d'un restaurant burger se situe entre
              <strong> 28 % et 32 %</strong>. C'est plus eleve qu'une pizzeria (22-25 %)
              car le steak hache pese lourd dans le cout matieres (40-50 % du cout total
              d'un burger). En contrepartie, le burger a 3 avantages structurels :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Productivite cuisine elevee</strong> : sur un flat top, un cuisinier
                produit 80 a 120 burgers par heure en rush. Pour comparaison, une pizza
                au four traditionnel demande 4 a 5 minutes vs 2 a 3 minutes pour un smash
                burger.
              </li>
              <li>
                <strong>Ticket moyen confortable</strong> : 14 a 20 EUR/personne sur place,
                22 a 30 EUR en livraison (avec frites + boisson). Soit 30 a 50 % plus eleve
                qu'une pizzeria classique.
              </li>
              <li>
                <strong>Carte courte = stock optimise</strong> : 8 a 12 burgers core, 3 a 4
                sides (frites maison, onion rings, salade), 4 a 6 sauces signature. La
                rotation matieres est rapide, le gaspillage limite a 3-5 %.
              </li>
            </ul>
            <p className="mt-4">
              Mais le piege existe : un food cost qui derape (au-dela de 34 %) est souvent du a une
              hausse de viande hachee Charolais ou Black Angus (qui peut bouger de +/- 20 %
              selon les saisons), couplee a un manque de mise a jour des prix de vente.
              C'est exactement le scenario qu'un <strong>logiciel de marge specialise
              burger</strong> evite, en alertant en temps reel.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <KPICard
              icon={<Percent className="w-5 h-5" />}
              label="Food cost cible"
              value="28 - 32 %"
              note="+3 a 5 pts vs pizzeria"
              color="emerald"
            />
            <KPICard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Marge brute cible"
              value="68 - 72 %"
              note="Sur place et click & collect"
              color="teal"
            />
            <KPICard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Marge nette apres livraison"
              value="6 - 12 %"
              note="Si > 35 % du CA en plateforme"
              color="amber"
            />
          </div>
        </section>

        {/* SECTION 3 : Decomposition des couts */}
        <section id="decomposition" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            Decomposition des couts : pain, steak, garniture, frites
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la decomposition precise des couts matieres pour un burger fast casual
              premium type smash burger, vendu entre 13 et 18 EUR sur place. Prix bases sur
              les tarifs Metro France + grossistes specialises (Pomona, Davigel) en mai 2026.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Cout matieres d'un smash burger premium 150 g + frites</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Composant</th>
                  <th className="text-right py-2 px-3 font-semibold">Standard (Charolais)</th>
                  <th className="text-right py-2 px-3 font-semibold">Premium (Black Angus)</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Pain artisan brioche (80-90 g)</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                  <td className="py-2 px-3 text-right">0,70 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Steak hache 150 g (Charolais / Black Angus)</td>
                  <td className="py-2 px-3 text-right">1,20 - 2,00 EUR</td>
                  <td className="py-2 px-3 text-right">2,50 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Cheddar AOP affine 25 g</td>
                  <td className="py-2 px-3 text-right">0,45 EUR</td>
                  <td className="py-2 px-3 text-right">0,45 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Salade, tomate, oignon rouge, cornichons</td>
                  <td className="py-2 px-3 text-right">0,30 EUR</td>
                  <td className="py-2 px-3 text-right">0,50 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Sauces signature (burger + ketchup ou mayo maison)</td>
                  <td className="py-2 px-3 text-right">0,30 EUR</td>
                  <td className="py-2 px-3 text-right">0,30 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Frites maison (Bintje fraiche, 150 g portion)</td>
                  <td className="py-2 px-3 text-right">0,55 EUR</td>
                  <td className="py-2 px-3 text-right">0,55 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Emballage (si livraison : boite + pochon frites + sachet)</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                </tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50">
                  <td className="py-3 px-3 font-bold text-mono-100">Total cout matieres avec frites</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-900">3,60 - 4,40 EUR</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-900">5,40 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Analyse rapide :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Smash burger Charolais + frites vendu 14 EUR sur place : food cost = 4,00 / 14 = <strong>28,6 %</strong></li>
              <li>Smash burger Charolais + frites vendu 16 EUR en livraison : food cost = 4,40 / 16 = <strong>27,5 %</strong></li>
              <li>Burger Black Angus + frites vendu 18 EUR sur place : food cost = 5,40 / 18 = <strong>30,0 %</strong></li>
              <li>Burger Black Angus + frites vendu 21 EUR en livraison : food cost = 5,80 / 21 = <strong>27,6 %</strong></li>
            </ul>
            <p className="mt-4">
              On constate que le ratio food cost reste dans la fourchette cible (28-32 %) quel que
              soit le positionnement, a condition d'ajuster correctement le prix de vente.
              <strong> Le piege le plus frequent</strong> : un proprietaire qui passe du Charolais
              au Black Angus pour ameliorer la qualite, sans repasser le prix de vente. Resultat :
              food cost qui explose a 35-38 %, marge nette qui fond.
            </p>
          </div>
        </section>

        {/* SECTION 4 : 8 burgers types */}
        <section id="8-burgers" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            8 burgers types et leurs marges
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tableau de reference : 8 recettes de burger couvrant les classiques americains
              et les creations fast casual premium qui marchent en France 2026. Couts matieres
              bases sur les prix Metro France T2 2026, prix de vente moyens hors zones premium
              (Paris centre, Cote d'Azur). Tous prix avec frites maison incluses.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Burger</th>
                  <th className="text-center py-3 px-4 font-semibold">Cout matieres</th>
                  <th className="text-center py-3 px-4 font-semibold">Prix sur place</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { name: 'Classic (steak Charolais 150 g, cheddar, salade-tomate-oignon)', cm: '3,60 EUR', pv: '13,00 EUR', fc: '28 %', mb: '9,40 EUR / 72 %' },
                  { name: 'Cheese (double cheddar, sauce burger maison)', cm: '4,00 EUR', pv: '14,00 EUR', fc: '29 %', mb: '10,00 EUR / 71 %' },
                  { name: 'Bacon (cheddar + bacon croustillant 25 g)', cm: '4,40 EUR', pv: '15,00 EUR', fc: '29 %', mb: '10,60 EUR / 71 %' },
                  { name: 'Veggie (steak vegetal poelé, cheddar vegan)', cm: '3,20 EUR', pv: '13,50 EUR', fc: '24 %', mb: '10,30 EUR / 76 %' },
                  { name: 'Truffe (Black Angus + cheddar + creme truffe)', cm: '7,80 EUR', pv: '22,00 EUR', fc: '35 %', mb: '14,20 EUR / 65 %' },
                  { name: 'Saumon (pave saumon, cream cheese, aneth, oignon rouge)', cm: '6,20 EUR', pv: '19,00 EUR', fc: '33 %', mb: '12,80 EUR / 67 %' },
                  { name: 'Poulet pane (filet panko, sauce gribiche, salade)', cm: '3,80 EUR', pv: '14,50 EUR', fc: '26 %', mb: '10,70 EUR / 74 %' },
                  { name: 'Smash (double steak 80 g, cheddar fondu, oignon caramelise)', cm: '4,20 EUR', pv: '15,00 EUR', fc: '28 %', mb: '10,80 EUR / 72 %' },
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
              Observations cles :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Le burger truffe</strong> sort de la fourchette cible (35 %), mais
                la marge brute en valeur absolue (14,20 EUR) est superieure de 50 % au burger
                classique. A garder en carte comme plat d'appel image qui rehausse le ticket moyen.
              </li>
              <li>
                <strong>Le burger veggie</strong> affiche le meilleur ratio (24 % de food cost)
                grace au steak vegetal moins cher que la viande Charolais. C'est un win-win :
                demande croissante (+22 %/an en France) et marge superieure.
              </li>
              <li>
                <strong>Le smash burger</strong> (double steak 80 g chacun) est le best-seller
                actuel : prix de vente 15 EUR, marge brute 10,80 EUR, food cost 28 %. Format
                qui plait visuellement et qui se prete bien a la livraison.
              </li>
              <li>
                <strong>Les burgers Charolais</strong> (Classic, Cheese, Bacon, Smash) restent
                les piliers du business avec des food cost stables 28-29 %. Vache a lait du
                restaurant burger francais.
              </li>
            </ul>
          </div>
        </section>

        {/* SECTION 5 : Specificites operationnelles */}
        <section id="operationnel" className="mb-16">
          <SectionHeading icon={<Flame className="w-6 h-6" />} number="5">
            Specificites operationnelles : grill vs flat top, rotations
          </SectionHeading>

          <div className="prose-content">
            <p>
              Au-dela du calcul matieres pur, trois variables operationnelles determinent la
              rentabilite reelle d'un restaurant burger : le type de cuisson (grill vs flat top),
              la rotation des stocks de viande hachee et la productivite de la brigade. Mal
              calibres, ces trois leviers peuvent transformer une carte rentable sur le papier
              en gouffre financier dans la realite.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Grill vs flat top : quelle productivite ?</h3>
            <p>
              Le choix de la cuisson impacte directement la productivite cuisine et donc la
              marge nette. Comparaison :
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-5">
            <CuissonCard
              title="Flat top (plancha)"
              productivite="80 - 120 burgers/heure"
              cout="3 500 - 9 000 EUR"
              pros="Smash burger parfait, cuisson 2-3 min, Maillard ideal, 1 cuisinier gere 2 stations, faible maintenance"
              cons="Cuisson moins visuelle, marquage absent, perception fast-food si mal positionne"
            />
            <CuissonCard
              title="Grill (barbecue)"
              productivite="40 - 60 burgers/heure"
              cout="4 500 - 14 000 EUR"
              pros="Marquage grill visuel attractif, gout fume, justifie un prix premium (+2-4 EUR), image qualitative"
              cons="Cuisson 5-7 min, demande plus de personnel, maintenance grille, normes ERP gaz/charbon"
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Rotation des stocks de viande hachee</h3>
            <p>
              La viande hachee est l'ingredient le plus delicat d'un restaurant burger.
              Reglementation francaise : <strong>DLC (date limite de consommation) de J+1
              maximum apres hachage</strong> pour la viande hachee fraiche conservee entre
              0 et 4 degrees C. Au-dela, vous etes en infraction et risquez fermeture
              administrative + amendes lourdes.
            </p>
            <p>
              Solutions operationnelles :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li><strong>Hachage maison quotidien</strong> : commander le muscle entier (bavette, paleron, gite), hacher chaque matin pour la journee. Cout +0,20-0,40 EUR/burger mais traçabilite parfaite et marge superieure.</li>
              <li><strong>Hachage fournisseur quotidien</strong> : livraison fraiche tous les jours par le boucher (Metro, Pomona, boucherie locale). Cout stable, pas de manutention.</li>
              <li><strong>Surgelation portion individuelle</strong> : steaks 150 g surgeles individuellement. Cout matieres +15-25 % mais zero perte, gestion stock simple. Solution typique des chaines (Five Guys, Steak'n Shake).</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Productivite de la brigade burger</h3>
            <p>
              Une brigade burger standard se compose de 3 postes : <strong>plancher (cuisson)</strong>,
              <strong> assembleur (montage)</strong> et <strong>fryer (frites)</strong>. Avec un
              flat top double et un fryer 2 cuves, une brigade de 3 personnes produit
              <strong> 100 a 140 burgers par heure</strong> en rush sans baisse de qualite.
            </p>
            <p>
              Cout employeur brigade : 2 commis cuisine (1 600-2 000 EUR brut/mois chacun)
              + 1 chef de partie (2 200-2 800 EUR brut/mois) = environ <strong>8 000-10 500 EUR
              cout total employeur</strong> mensuel. C'est le poste #2 apres le loyer. Une
              brigade bien rodee est la cle d'une marge nette superieure a 18 %.
            </p>
          </div>
        </section>

        {/* SECTION 6 : Marge comparee */}
        <section id="marge-comparee" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="6">
            Marge brute en EUR/burger vs autres concepts
          </SectionHeading>

          <div className="prose-content">
            <p>
              Pour comprendre la specificite economique du burger, comparons la marge brute
              unitaire avec d'autres concepts de restauration commerciale. Les chiffres ci-dessous
              sont des moyennes constatees en France 2026 sur 200+ etablissements.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Concept</th>
                  <th className="text-center py-3 px-4 font-semibold">Ticket moyen</th>
                  <th className="text-center py-3 px-4 font-semibold">Marge brute %</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge brute EUR</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { name: 'Restaurant burger fast casual', ticket: '14 - 20 EUR', mbp: '68 - 72 %', mbe: '10 - 14 EUR' },
                  { name: 'Pizzeria classique', ticket: '12 - 18 EUR', mbp: '75 - 78 %', mbe: '9 - 14 EUR' },
                  { name: 'Bistrot traditionnel', ticket: '20 - 32 EUR', mbp: '65 - 70 %', mbe: '13 - 22 EUR' },
                  { name: 'Brasserie', ticket: '25 - 35 EUR', mbp: '67 - 72 %', mbe: '17 - 25 EUR' },
                  { name: 'Coffee shop / snacking', ticket: '6 - 12 EUR', mbp: '78 - 88 %', mbe: '5 - 10 EUR' },
                  { name: 'Restaurant gastronomique', ticket: '60 - 120 EUR', mbp: '60 - 70 %', mbe: '36 - 84 EUR' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.name}</td>
                    <td className="py-3 px-4 text-center">{row.ticket}</td>
                    <td className="py-3 px-4 text-center">{row.mbp}</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-semibold">{row.mbe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Verdict :</strong> le burger fast casual se positionne dans le top tier
              de la rentabilite unitaire grace a un excellent ratio prix de vente / cout
              matieres + productivite cuisine elevee. Sa marge brute unitaire (10-14 EUR)
              est comparable a celle d'une pizzeria, mais avec une productivite cuisine
              2x superieure et un ticket moyen 20-30 % plus eleve.
            </p>
            <p>
              C'est pour cela que les chaines comme Five Guys, Shake Shack, Big Fernand ou
              PNY se developpent aussi vite : le modele economique tient la route, meme dans
              les zones a loyer eleve (Paris centre, La Defense, Lyon Confluence).
            </p>
          </div>
        </section>

        {/* SECTION 7 : Optimisation */}
        <section id="optimisation" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="7">
            5 leviers d'optimisation : menu court, frites maison, sauces
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les 5 leviers prouves pour passer d'une marge nette burger moyenne (8-12 %)
              a une marge nette de fast casual premium (18-22 %). Mis en oeuvre dans cet ordre,
              ils s'additionnent sans complexite operationnelle excessive.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <LevierCard
              number={1}
              title="Menu court : 8 a 12 burgers maximum"
              desc="Une carte courte (8-12 burgers core + 3-4 sides + 4-6 sauces) optimise le stock (rotation rapide viande hachee), la productivite cuisine (moins de SKU a memoriser) et le menu engineering (focus sur les best-sellers). Big Fernand a 8 burgers, Five Guys 4, Shake Shack 5. Vos clients ne veulent pas le choix, ils veulent le bon burger."
            />
            <LevierCard
              number={2}
              title="Frites maison vs surgelees"
              desc="Frites maison Bintje fraiche : cout matieres 0,55 EUR/portion 150 g. Frites surgelees premium : 0,90 EUR/portion. Marge supplementaire : 0,35 EUR/portion x 80 ventes/jour = 28 EUR/jour = 850 EUR/mois. Sur 1 an : 10 200 EUR de marge brute en plus. ROI eplucheuse industrielle (1 500 EUR) : 2 mois."
            />
            <LevierCard
              number={3}
              title="Sauces signature maison"
              desc="Sauce burger maison (mayo + ketchup + cornichons haches + epices) : cout 0,15 EUR/portion 30 g. Sauce achetee Heinz : 0,28 EUR/portion. Marge +0,13 EUR/sauce x 2 sauces/burger x 80 burgers/jour = 21 EUR/jour = 630 EUR/mois. Sur 1 an : 7 560 EUR. En plus, signature gustative differenciante."
            />
            <LevierCard
              number={4}
              title="Upsell systematique frites + boisson + dessert"
              desc="Sans upsell : ticket moyen 14 EUR (burger seul). Avec upsell (formule burger + frites + boisson + 1 dessert sur 3 commandes) : ticket moyen 19 EUR (+5 EUR). Sur 80 commandes/jour : +400 EUR de CA/jour, dont 280 EUR de marge brute additionnelle. Sur 1 an : 84 000 EUR. C'est le levier #1 absolu."
            />
            <LevierCard
              number={5}
              title="Prix differencie par canal de distribution"
              desc="Sur place : 15 EUR. Click & collect : 14 EUR (-1 EUR pour inciter au retrait, zero commission). Uber Eats / Deliveroo : 17,50 EUR (+15-18 % pour absorber la commission 25-30 %). Resultat : la marge brute apres commission plateforme remonte de 44 % a 60-65 %. Indispensable des que > 20 % du CA passe par les plateformes."
            />
          </div>

          <Callout type="info">
            <strong>Combo gagnant :</strong> ces 5 leviers cumules permettent de passer de
            8-12 % a 18-22 % de marge nette en 6-12 mois. Sur un CA de 480 000 EUR/an, c'est
            entre 28 800 EUR et 48 000 EUR de benefice net additionnel. C'est exactement ce
            que <Link to="/blog/strategie-digitale-restaurant" className="text-teal-700 underline hover:text-teal-800">notre guide strategie digitale restaurant</Link> detaille pour la partie multi-canal.
          </Callout>
        </section>

        {/* SECTION 8 : Livraison burger */}
        <section id="livraison" className="mb-16">
          <SectionHeading icon={<Truck className="w-6 h-6" />} number="8">
            Livraison burger : qualite, fenetre de 20 minutes, marge
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le burger est l'un des produits les plus delicats a livrer. Contrairement a la
              pizza (qui reste presentable 30-40 minutes apres production) ou aux sushis (qui
              se mangent froids), le burger souffre d'un <strong>taux de reussite qui chute
              apres 20 minutes</strong> : pain ramolli par la vapeur, frites tiedes, melange
              sauces qui detrempe la garniture, fromage qui fige.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-5">
            <QualiteCard
              icon={<Clock className="w-5 h-5" />}
              titre="0 - 15 minutes"
              statut="Qualite optimale"
              note="Pain croustillant, frites chaudes, fromage fondant. Experience equivalente sur place."
              color="emerald"
            />
            <QualiteCard
              icon={<AlertTriangle className="w-5 h-5" />}
              titre="15 - 25 minutes"
              statut="Qualite degradee"
              note="Pain qui se ramollit legerement, frites tiedes, sauces qui detrempent. Acceptable mais en dessous des attentes."
              color="amber"
            />
            <QualiteCard
              icon={<AlertTriangle className="w-5 h-5" />}
              titre="> 25 minutes"
              statut="Qualite degradee critique"
              note="Pain detrempe, frites froides molles, fromage fige. Risque elevee de plainte client + 1 etoile."
              color="red"
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">3 strategies pour reussir la livraison burger</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Emballage separe :</strong> burger dans boite kraft hermetique avec
                trous de ventilation (evite condensation), frites dans pochon papier perfore
                (preserve croustillant), sauces a part en pots individuels (le client assaisonne
                a l'arrivee). Cout +0,10 EUR/commande mais reduction plaintes de 60 %.
              </li>
              <li>
                <strong>Zone de livraison restreinte :</strong> limiter a 2,5 km maximum
                (10-15 min en scooter en milieu urbain). Au-dela, refuser la commande plutot
                que risquer une mauvaise experience. Indicateur cle : temps moyen du paiement
                a la remise client = <strong>22 min ou moins</strong>.
              </li>
              <li>
                <strong>Livraison propre vs plateforme :</strong> au-dela de 25 commandes/jour
                en livraison, recruter 1 livreur en CDI temps partiel (cout 1 200-1 600 EUR/mois)
                devient plus rentable que payer 25-30 % de commission a Uber Eats. Bonus : controle
                qualite total + relation client directe + 0 commission.
              </li>
            </ul>

            <Callout type="warning">
              <strong>Erreur frequente :</strong> accepter les commandes Uber Eats au-dela de 4 km
              "parce que ca rentre". Le temps de livraison depasse 30 minutes, le client
              recoit un burger detrempe, vous prenez une note 1 etoile qui penalise votre
              classement plateforme pendant 6 mois. Mieux vaut refuser que livrer mal.
            </Callout>
          </div>
        </section>

        {/* SECTION 9 : KPI burger */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="9">
            Les 5 KPI essentiels d'un restaurant burger
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un restaurant burger bien gere pilote 5 indicateurs au quotidien. Sans ces KPI,
              vous naviguez a l'aveugle et detectez les problemes 3-6 mois apres leur apparition,
              quand la marge nette commence a fondre.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Percent className="w-5 h-5" />, title: '1. Food cost matiere', desc: 'Cible 28-32 %. Au-dela, alerte immediate. Souvent du a une hausse viande hachee non repercutee sur prix de vente.' },
              { icon: <DollarSign className="w-5 h-5" />, title: '2. Ticket moyen', desc: 'Sur place : 14-20 EUR. Livraison : 22-30 EUR. Suivre par canal. Levier upsell direct.' },
              { icon: <Beef className="w-5 h-5" />, title: '3. Productivite cuisine', desc: 'Flat top : 80-120 burgers/heure rush. Grill : 40-60. Si < seuil, probleme organisation ou equipement.' },
              { icon: <Truck className="w-5 h-5" />, title: '4. Ratio livraison vs sur place', desc: 'Maintenir sous 35 % pour preserver la marge nette. Alerte automatique des que > 40 %.' },
              { icon: <Award className="w-5 h-5" />, title: '5. Mix attaches (frites + boisson + dessert)', desc: 'Cible 75 % des burgers vendus en formule. Levier principal du ticket moyen et de la marge brute.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Bonus : marge brute par burger', desc: 'Suivre individuellement les 8-12 burgers pour detecter ceux qui derapent (viande hachee, fromages premium).' },
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

        {/* SECTION 10 : Cas concret Paris */}
        <section id="cas-paris" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="10">
            Cas concret : burger Paris 11e, 9 % a 22 % en 10 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Restaurant burger fast casual, Paris 11e arrondissement, 55 couverts + comptoir
              click & collect. Reprise en juillet 2025 par Sarah K., 32 ans, ex-marketing
              manager passionnee de cuisine. CA annuel constate a la reprise :
              <strong> 420 000 EUR, marge nette 9 %</strong>.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Diagnostic initial (mois 1)</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Food cost reel : 36 % (vs cible 30 %). Gaspillage viande hachee 7 %, portions non standardisees.</li>
              <li>Ratio livraison : 52 % du CA via Uber Eats + Deliveroo. Commission moyenne 29 %.</li>
              <li>Aucun suivi prix viande hachee : factures boucher entrees a la main 1 fois/mois.</li>
              <li>Carte sur-etendue : 16 burgers + 6 sides + 3 desserts. Brigade perdue, productivite 45 burgers/heure.</li>
              <li>Pas de strategie upsell. Pas de differenciation prix par canal. Sauces achetees Heinz.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Plan d'action en 4 phases</h3>
            <div className="space-y-4 mt-6">
              <PhaseCard
                phase="Phase 1 (mois 1-3)"
                title="Stabilisation du food cost et carte courte"
                actions={[
                  'Mise en place fiches techniques precises pour les 16 burgers via RestauMargin',
                  'Reduction carte a 9 burgers core + 3 saisonniers (suppression 7 burgers a faible rotation)',
                  'Hachage maison quotidien (commande muscle entier Charolais boucher local)',
                  'Resultat : food cost passe de 36 % a 31 %',
                ]}
              />
              <PhaseCard
                phase="Phase 2 (mois 4-6)"
                title="Strategie multi-canal et upsell"
                actions={[
                  'Prix differencie : +18 % sur Uber Eats / Deliveroo, -1 EUR en click & collect',
                  'Formation equipe upsell systematique (formule burger + frites + boisson 19 EUR)',
                  'Lancement sauces signature maison (4 sauces : burger, BBQ fume, gribiche, mayo truffe)',
                  'Resultat : ticket moyen passe de 14 EUR a 19 EUR, ratio livraison plateforme tombe a 38 %',
                ]}
              />
              <PhaseCard
                phase="Phase 3 (mois 7-8)"
                title="Optimisation operationnelle"
                actions={[
                  'Recrutement 1 commis cuisine supplementaire (renfort plancher rush)',
                  'Investissement eplucheuse industrielle 1 500 EUR + passage frites maison Bintje',
                  'Mise en place scan factures OCR via RestauMargin (Metro + boucher local)',
                  'Resultat : productivite 45 a 95 burgers/heure, food cost a 29 %',
                ]}
              />
              <PhaseCard
                phase="Phase 4 (mois 9-10)"
                title="Pilotage en temps reel et fidelisation"
                actions={[
                  'Tableau de bord RestauMargin verifie 2x/semaine (mardi + samedi)',
                  'Alertes prix activees sur viande hachee, cheddar AOP, pain brioche',
                  'Lancement programme fidelite (10e burger offert) via QR code RestauMargin',
                  'Resultat final : marge nette 22 %, taux de retour client +35 %',
                ]}
              />
            </div>

            <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-emerald-900 text-lg">Resultats apres 10 mois</h3>
              </div>
              <ul className="space-y-2 text-emerald-800 text-sm">
                <li><strong>CA annuel :</strong> 420 000 EUR -- 580 000 EUR (+38 %)</li>
                <li><strong>Food cost :</strong> 36 % -- 29 %</li>
                <li><strong>Marge nette :</strong> 9 % -- 22 % (soit 37 800 EUR -- 127 600 EUR)</li>
                <li><strong>Ratio livraison plateforme :</strong> 52 % -- 31 %</li>
                <li><strong>Productivite cuisine :</strong> 45 burgers/h -- 95 burgers/h</li>
                <li><strong>Ticket moyen sur place :</strong> 14 EUR -- 19 EUR</li>
              </ul>
            </div>

            <p className="mt-6">
              Sarah a triple sa marge nette en 10 mois avec un investissement marginal
              (eplucheuse + 1 commis + abonnement RestauMargin a 29 EUR/mois). Le levier le
              plus puissant a ete la combinaison <strong>carte courte + upsell systematique +
              differenciation prix par canal</strong>. Pour creuser la partie livraison,
              voir notre <Link to="/blog/livraison-restaurant-rentabilite" className="text-teal-700 underline hover:text-teal-800">guide rentabilite livraison restaurant</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="footer" />

        {/* FAQ visible */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes burger</h2>
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
              Piloter la marge de votre restaurant burger avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Food cost burger, prix multi-canaux, alertes viande hachee, KPI fast casual,
              upsell formule : tout ce qu'il faut pour garder une marge nette superieure a 18 %.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> &mdash; essai gratuit 7 jours, sans engagement, sans carte bancaire.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
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
            <Link to="/blog/food-cost-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Food cost restaurant : guide complet</h3>
              <p className="text-xs text-mono-500">Methodes, benchmarks, leviers d'optimisation.</p>
            </Link>
            <Link to="/blog/livraison-restaurant-rentabilite" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Livraison restaurant : rentabilite reelle</h3>
              <p className="text-xs text-mono-500">Commissions plateformes, marges, strategies multi-canal.</p>
            </Link>
            <Link to="/blog/strategie-digitale-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Strategie digitale restaurant</h3>
              <p className="text-xs text-mono-500">Click & collect, programme fidelite, reseaux sociaux.</p>
            </Link>
            <Link to="/signup" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Essai gratuit 7 jours</h3>
              <p className="text-xs text-mono-500">Pilotez votre burger restaurant sans carte bancaire requise.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* Footer */}
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

function CuissonCard({ title, productivite, cout, pros, cons }: {
  title: string; productivite: string; cout: string; pros: string; cons: string;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-amber-300 transition-colors">
      <h3 className="font-bold text-mono-100 mb-3">{title}</h3>
      <div className="space-y-2 text-xs text-mono-400 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-mono-500">Productivite :</span>
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

function QualiteCard({ icon, titre, statut, note, color }: {
  icon: React.ReactNode; titre: string; statut: string; note: string; color: 'emerald' | 'amber' | 'red';
}) {
  const colors: Record<string, { bg: string; badge: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-900' },
    amber: { bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', text: 'text-amber-900' },
    red: { bg: 'bg-red-50', badge: 'bg-red-100 text-red-700', text: 'text-red-900' },
  };
  const c = colors[color];
  return (
    <div className={`${c.bg} rounded-2xl p-5 border border-mono-975`}>
      <div className={`w-9 h-9 ${c.badge} rounded-lg flex items-center justify-center mb-2`}>
        {icon}
      </div>
      <div className="text-xs font-semibold uppercase tracking-wider text-mono-500 mb-1">{titre}</div>
      <div className={`text-base font-extrabold ${c.text} mb-2`}>{statut}</div>
      <div className="text-xs text-mono-500 leading-relaxed">{note}</div>
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
