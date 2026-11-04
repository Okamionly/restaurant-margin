import { Link } from 'react-router-dom';
import { ChefHat, Calculator, AlertTriangle, CheckCircle, ArrowRight, Percent, Target, BookOpen, Lightbulb, Zap, Truck, Users, UtensilsCrossed, FileText, PartyPopper } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO — "Logiciel de marge pour traiteur"
   Mots-cles cibles : marge traiteur / food cost traiteur / rentabilite traiteur / devis traiteur
   ~2 900 mots — mode clair, fond blanc, theme W&B
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost idéal pour un traiteur ?',
    answer: "Le food cost idéal d'un traiteur se situe entre 28 % et 35 % selon le type de prestation. Un cocktail dînatoire premium tourne autour de 28-30 %, un buffet d'entreprise 30-33 %, et une prestation mariage haut de gamme peut monter à 33-35 % à cause des produits nobles (foie gras, saumon, champagne). Contrairement à la restauration assise, le traiteur doit intégrer le coût de la main d'oeuvre événementielle et de la logistique dans son calcul de rentabilité, pas seulement le food cost matières.",
  },
  {
    question: 'Comment calculer le prix d\'une prestation traiteur ?',
    answer: "Le prix d'une prestation traiteur se calcule en additionnant quatre postes : (1) le coût matières premières (food cost), (2) la main d'oeuvre de production et de service (cuisiniers, extras, maître d'hôtel), (3) la logistique (transport, location de matériel, vaisselle), puis on applique un coefficient multiplicateur global de 3,5 à 4,5 sur le coût matières OU une marge brute cible de 65-72 % sur le prix total. La formule recommandée : Prix HT = coût matières x coefficient + coûts directs main d'oeuvre et logistique + marge de sécurité 10-15 %.",
  },
  {
    question: 'Quelle marge nette espérer en traiteur événementiel ?',
    answer: "Un traiteur événementiel bien géré dégage entre 12 % et 20 % de marge nette. Beaucoup de traiteurs affichent une marge brute correcte (65-70 %) mais une marge nette faible (4-8 %) car ils sous-estiment systématiquement le coût de la main d'oeuvre extra, des heures supplémentaires de week-end et du transport. La maîtrise de ces coûts variables est le principal levier de rentabilité du métier.",
  },
  {
    question: 'Comment chiffrer le coût de la main d\'oeuvre dans un devis traiteur ?',
    answer: "Le coût de la main d'oeuvre traiteur se chiffre en heures réelles x taux horaire charge. Comptez 25-35 EUR/heure charge pour un cuisinier, 18-25 EUR/heure pour un extra de service, et n'oubliez pas les heures de préparation en amont (souvent 1,5 à 2x les heures de prestation). Pour un cocktail de 100 personnes, prévoyez 3-4 personnes en service pendant 5 heures + 2 cuisiniers sur 8 heures de production : soit 40 à 50 heures de main d'oeuvre à intégrer dans le devis.",
  },
  {
    question: 'Quel coefficient multiplicateur appliquer en traiteur ?',
    answer: "Le coefficient multiplicateur traiteur se situe entre 3,5 et 4,5 sur le coût matières, soit plus élevé que la restauration assise classique (coefficient 3-3,5). Cette différence s'explique par les coûts cachés du métier : transport, location de matériel, vaisselle, perte sur invendus de buffet, et surtout la main d'oeuvre événementielle ponctuelle. Un coefficient de 4 sur les matières est un bon point de départ, à affiner selon la prestation.",
  },
  {
    question: 'Comment gérer le gaspillage et les invendus en traiteur buffet ?',
    answer: "Le gaspillage en traiteur buffet représente 8 à 15 % des matières produites si rien n'est suivi. Pour le maîtriser : calibrez les quantités à 1,1-1,2x le nombre de convives (et non 1,5x par sécurité excessive), suivez les retours par type de plat sur plusieurs prestations, et intégrez un taux de perte réaliste dans vos fiches techniques. Un logiciel de marge permet de stocker ce taux de gaspillage par recette et de l'inclure automatiquement dans le coût réel.",
  },
  {
    question: 'Faut-il facturer la location de matériel séparément ?',
    answer: "Oui, il est fortement recommandé de détailler la location de matériel (mange-debout, vaisselle, nappage, chauffe-plats, tireuse) en ligne distincte du devis traiteur. Cela améliore la lisibilité pour le client, évite de noyer ces coûts dans le prix au couvert, et protège votre marge si le client annule une partie de la prestation. Comptez 2 à 6 EUR/personne de location matériel selon le niveau de la prestation.",
  },
  {
    question: 'Quels KPI suivre dans une activité traiteur ?',
    answer: "Les 6 KPI essentiels d'un traiteur : (1) Food cost par prestation (cible 28-35 %), (2) Coût main d'oeuvre / CA prestation (cible inférieure à 30 %), (3) Marge brute par type de prestation (cocktail vs buffet vs mariage), (4) Ticket moyen par convive, (5) Taux de transformation des devis (cible supérieure à 35 %), (6) Taux de gaspillage par prestation. RestauMargin centralise ces indicateurs et compare la rentabilité réelle de chaque type d'événement.",
  },
  {
    question: 'Comment différencier la marge entre cocktail, buffet et plateau-repas ?',
    answer: "Chaque format traiteur a une structure de marge distincte. Le plateau-repas individuel a le food cost le plus élevé (35-40 %) mais une logistique simple et une main d'oeuvre faible. Le cocktail dînatoire a un bon food cost (28-30 %) mais demande beaucoup de main d'oeuvre de service. Le buffet d'entreprise offre le meilleur compromis (food cost 30-33 %, main d'oeuvre modérée). Une activité traiteur rentable équilibre ces trois formats selon la saison et la demande.",
  },
  {
    question: 'Pourquoi un logiciel de marge est-il indispensable pour un traiteur ?',
    answer: "Un traiteur jongle avec des dizaines de fiches techniques, des devis sur mesure, des produits à prix volatils (saumon, foie gras, fruits de mer) et une main d'oeuvre ponctuelle difficile à chiffrer. Sans logiciel, chaque devis est un pari sur la rentabilité. RestauMargin calcule automatiquement le coût réel de chaque prestation (matières + main d'oeuvre + logistique), met à jour les prix via le scan OCR des factures, et alerte dès qu'une prestation passe sous le seuil de marge cible.",
  },
];

export default function LogicielMargeTraiteur() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Logiciel marge traiteur | Food cost et devis traiteur | RestauMargin"
        description="Logiciel pour calculer la marge d'un traiteur événementiel. Coût prestation, main d'oeuvre, devis, food cost cible 28-35%. Essai gratuit 7 jours."
        path="/logiciel-marge-traiteur"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels métier', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            { name: 'Logiciel marge traiteur', url: 'https://www.restaumargin.fr/logiciel-marge-traiteur' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour traiteur : food cost, devis et rentabilité en 2026',
            description: "Guide complet du calcul de marge pour traiteur événementiel : décomposition du coût d'une prestation, food cost cible 28-35 %, chiffrage de la main d'oeuvre, méthode de devis, KPI spécifiques et exemple illustratif.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-28',
            dateModified: '2026-05-28',
            wordCount: 2900,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/logiciel-marge-traiteur' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin Traiteur',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Catering Margin Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-traiteur',
            description: "Logiciel SaaS de calcul de marge pour traiteur événementiel : food cost par prestation, chiffrage de la main d'oeuvre et de la logistique, génération de devis rentables, suivi de la marge par type d'événement (cocktail, buffet, mariage, plateau-repas), scan OCR des factures fournisseurs, KPI traiteur.",
            featureList: [
              'Fiches techniques par prestation avec grammages et taux de perte',
              'Calcul du coût réel : matières + main d\'oeuvre + logistique',
              'Chiffrage de la main d\'oeuvre événementielle (cuisiniers, extras, service)',
              'Coefficient multiplicateur ajustable par type de prestation',
              'Suivi de la marge par format (cocktail, buffet, mariage, plateau-repas)',
              'Scan factures fournisseurs (OCR) produits volatils',
              'KPI traiteur : food cost, coût MO/CA, taux de transformation devis',
              'Compatible PWA tablette en cuisine et sur événement',
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
      <PublicHeader />

      {/* ── Breadcrumbs visibles ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/logiciel-marge-restaurant" className="hover:text-teal-600">Logiciels métier</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge traiteur</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Traiteur"
        readTime="14 min"
        date="Mai 2026"
        title="Logiciel de marge pour traiteur : food cost, devis et rentabilité en 2026"
        accentWord="traiteur"
        subtitle="Le métier de traiteur a une économie unique : forte marge brute apparente mais main d'oeuvre événementielle et logistique qui rongent la marge nette. Méthode de calcul, décomposition du coût d'une prestation, chiffrage de devis et exemple illustratif."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-28" readTime="14 min" variant="header" />

        {/* ── Featured snippet / Reperes ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Repères clés traiteur</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les ratios à mémoriser
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost cible traiteur</strong> : 28 % à 35 % selon prestation</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Coefficient multiplicateur</strong> : 3,5 à 4,5 sur le coût matières</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Coût main d'oeuvre / CA</strong> : à maintenir sous 30 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Marge nette saine</strong> : 12 % à 20 %</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Un traiteur peut afficher 68 % de marge brute et perdre de l'argent : tout se joue
            sur la maîtrise de la main d'oeuvre événementielle et de la logistique.
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
              { href: '#intro', label: 'Pourquoi le traiteur est un métier de marge à part' },
              { href: '#food-cost', label: 'Food cost cible : 28-35 % selon la prestation' },
              { href: '#decomposition', label: 'Décomposition du coût réel d\'une prestation' },
              { href: '#formats', label: 'Tableau : 6 formats de prestation et leurs marges' },
              { href: '#main-oeuvre', label: 'Le piège de la main d\'oeuvre événementielle' },
              { href: '#devis', label: 'Le devis traiteur : chiffrer sans se tromper' },
              { href: '#kpi', label: 'Les 6 KPI à suivre en traiteur' },
              { href: '#cas-bordeaux', label: 'Exemple illustratif : un traiteur événementiel, de 6 % à 19 % de marge nette' },
              { href: '#logiciel', label: 'Comment RestauMargin automatise tout' },
              { href: '#faq', label: 'Questions fréquentes traiteur' },
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
          <SectionHeading icon={<PartyPopper className="w-6 h-6" />} number="1">
            Pourquoi le traiteur est un métier de marge à part
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le métier de traiteur ressemble en apparence à celui d'un restaurant : on achète des
              matières premières, on les transforme, on les vend avec une marge. Mais la réalité
              économique est radicalement différente. Un restaurant assis vend des couverts à la
              chaîne, dans un lieu fixe, avec une équipe permanente. Un traiteur, lui, produit des
              prestations ponctuelles, sur mesure, hors les murs, avec une main d'oeuvre qui
              varie d'un événement à l'autre.
            </p>
            <p>
              Cette spécificité crée un piège de rentabilité classique : le traiteur regarde son
              food cost matières (souvent excellent, autour de 30 %), conclut qu'il gagne bien sa
              vie, puis découvre en fin d'année une marge nette ridicule. La raison ? Il a oublié
              d'intégrer le coût réel de la main d'oeuvre événementielle, du transport, de la
              location de matériel et du gaspillage de buffet dans le calcul de chaque prestation.
            </p>
            <p>
              Calculer la marge d'un traiteur ne se limite donc jamais au food cost. Il faut
              raisonner par prestation complète, en additionnant quatre postes de coût : les
              matières premières, la main d'oeuvre de production et de service, la logistique
              (transport, matériel, vaisselle) et les coûts cachés (perte, casse, déplacements).
              C'est seulement après avoir consolidé ces quatre postes qu'on connaît la marge nette
              réelle d'un cocktail, d'un buffet ou d'un mariage.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Sur une prestation de mariage facturée 90 EUR/convive,
              un traiteur qui maîtrise sa main d'oeuvre dégage 16-20 EUR de marge nette par convive.
              Un traiteur qui sous-estimé ses extras et heures sup tombe à 4-6 EUR : pour 120
              convives, c'est une différence de 1 400 à 1 700 EUR de bénéfice sur un seul événement.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Food cost ═════════════ */}
        <section id="food-cost" className="mb-16">
          <SectionHeading icon={<Percent className="w-6 h-6" />} number="2">
            Food cost cible : 28-35 % selon la prestation
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le food cost (ratio matières premières) d'un traiteur se situe entre 28 % et 35 %
              du prix de vente HT, mais cette fourchette varie fortement selon le type de
              prestation. Contrairement à une pizzeria ou un fast-food qui visent un food cost
              unique, le traiteur doit raisonner format par format.
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Cocktail dînatoire premium</strong> : food cost 28-30 %. Petites pièces
                soignées, dressage minutieux, mais coût matières maîtrisé par bouchée.
              </li>
              <li>
                <strong>Buffet d'entreprise</strong> : food cost 30-33 %. Volume plus important,
                gaspillage à surveiller, produits de gamme moyenne.
              </li>
              <li>
                <strong>Prestation mariage / gastronomique</strong> : food cost 33-35 %. Produits
                nobles (foie gras, saumon, Saint-Jacqués, champagne) qui tirent le ratio vers le haut.
              </li>
              <li>
                <strong>Plateau-repas individuel</strong> : food cost 35-40 %. Le plus élevé, car
                portion calibrée généreuse et emballage individuel, mais logistique simple.
              </li>
            </ul>
            <p className="mt-4">
              La clé est de comprendre que le food cost n'est qu'un des quatre postes de coût. Un
              plateau-repas à 38 % de food cost peut être plus rentable qu'un cocktail à 28 % si le
              cocktail mobilise quatre extras pendant cinq heures. C'est pourquoi le traiteur doit
              suivre la <strong>marge nette par prestation</strong>, et non le food cost isolé.
            </p>

            <Callout type="warning">
              <strong>Erreur fréquente :</strong> beaucoup de traiteurs appliquent le même
              coefficient multiplicateur à toutes leurs prestations. Résultat : ils sur-marginent
              les plateaux-repas (et perdent des marchés) et sous-marginent les mariages (et
              travaillent à perte les week-ends charges). Chaque format mérite son propre coefficient.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Decomposition ═════════════ */}
        <section id="decomposition" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            Décomposition du coût réel d'une prestation
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons un exemple concret : un cocktail dînatoire de 100 personnes, 12 pièces par
              personne, facture 45 EUR HT/convive (soit 4 500 EUR HT). Voici comment se décompose
              le coût réel de cette prestation, poste par poste.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead className="bg-mono-1000 text-mono-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Poste de coût</th>
                  <th className="text-right px-4 py-3 font-semibold">Montant</th>
                  <th className="text-right px-4 py-3 font-semibold">% du CA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mono-900">
                <tr>
                  <td className="px-4 py-3 text-mono-300">Matières premières (food cost)</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-100">1 320 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-400">29 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-mono-300">Main d'oeuvre production (2 cuisiniers x 8 h)</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-100">480 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-400">11 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-mono-300">Main d'oeuvre service (4 extras x 5 h)</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-100">440 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-400">10 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-mono-300">Logistique (transport + matériel + vaisselle)</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-100">360 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-400">8 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-mono-300">Coûts cachés (perte, casse, déplacements)</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-100">180 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-400">4 %</td>
                </tr>
                <tr className="bg-teal-50">
                  <td className="px-4 py-3 font-bold text-mono-100">Marge nette</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-teal-700">1 720 EUR</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-teal-700">38 %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Cet exemple montre une prestation très bien gérée (38 % de marge nette). Mais il
              suffit de doubler le temps de service (mauvaise estimation), d'ajouter une heure de
              route ou de gaspiller 15 % des matières pour que cette marge fonde de moitié. C'est
              précisément ce que la plupart des traiteurs ne voient pas, faute de suivre chaque
              poste de coût prestation par prestation.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Formats ═════════════ */}
        <section id="formats" className="mb-16">
          <SectionHeading icon={<UtensilsCrossed className="w-6 h-6" />} number="4">
            Tableau : 6 formats de prestation et leurs marges
          </SectionHeading>

          <div className="prose-content">
            <p>
              Chaque format de prestation traiteur a une structure de coût différente. Voici un
              comparatif des 6 formats les plus courants, avec leur food cost typique, leur
              intensité de main d'oeuvre et la marge nette atteignable lorsqu'ils sont bien gérés.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-mono-1000 text-mono-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Format</th>
                  <th className="text-right px-4 py-3 font-semibold">Ticket/convive</th>
                  <th className="text-right px-4 py-3 font-semibold">Food cost</th>
                  <th className="text-center px-4 py-3 font-semibold">Main d'oeuvre</th>
                  <th className="text-right px-4 py-3 font-semibold">Marge nette</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mono-900">
                <tr>
                  <td className="px-4 py-3 font-medium text-mono-100">Plateau-repas</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">14-22 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">35-40 %</td>
                  <td className="px-4 py-3 text-center text-emerald-700">Faible</td>
                  <td className="px-4 py-3 text-right font-mono text-teal-700">15-22 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-mono-100">Cocktail dînatoire</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">35-60 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">28-30 %</td>
                  <td className="px-4 py-3 text-center text-amber-700">Forte</td>
                  <td className="px-4 py-3 text-right font-mono text-teal-700">14-20 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-mono-100">Buffet d'entreprise</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">22-38 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">30-33 %</td>
                  <td className="px-4 py-3 text-center text-amber-700">Modérée</td>
                  <td className="px-4 py-3 text-right font-mono text-teal-700">16-22 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-mono-100">Mariage</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">70-130 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">33-35 %</td>
                  <td className="px-4 py-3 text-center text-red-700">Très forte</td>
                  <td className="px-4 py-3 text-right font-mono text-teal-700">12-18 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-mono-100">Brunch / petit-déjeuner</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">12-25 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">30-34 %</td>
                  <td className="px-4 py-3 text-center text-amber-700">Modérée</td>
                  <td className="px-4 py-3 text-right font-mono text-teal-700">14-20 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-mono-100">Séminaire (pause + déjeuner)</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">30-55 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">29-33 %</td>
                  <td className="px-4 py-3 text-center text-amber-700">Modérée</td>
                  <td className="px-4 py-3 text-right font-mono text-teal-700">15-21 %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Leçon à retenir : le buffet d'entreprise et le séminaire offrent souvent le meilleur
              rapport rentabilité / complexité. Le mariage, malgré son ticket élevé, est le format
              le plus risqué sur la marge nette à cause de l'intensité de la main d'oeuvre et des
              exigences de qualité. Un traiteur rentable équilibre son carnet de commandes entre
              ces formats plutôt que de courir uniquement après les gros mariages.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Main d'oeuvre ═════════════ */}
        <section id="main-oeuvre" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="5">
            Le piège de la main d'oeuvre événementielle
          </SectionHeading>

          <div className="prose-content">
            <p>
              La main d'oeuvre est le principal poste qui détruit la marge d'un traiteur, et le plus
              difficile à chiffrer. Contrairement à un restaurant qui a une équipe fixe, le traiteur
              recrute des extras à la prestation, paie des heures de nuit et de week-end majorées,
              et doit compter le temps de production en amont (souvent ignoré dans les devis).
            </p>
            <p>
              Voici les taux horaires charges à intégrer dans chaque prestation :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li><strong>Cuisinier / chef de partie</strong> : 25-35 EUR/heure charge</li>
              <li><strong>Extra de service</strong> : 18-25 EUR/heure charge</li>
              <li><strong>Maître d'hôtel</strong> : 28-38 EUR/heure charge</li>
              <li><strong>Plongeur / commis</strong> : 16-20 EUR/heure charge</li>
            </ul>
            <p className="mt-4">
              Le piège classique : oublier les heures de préparation. Pour un cocktail de 100
              personnes, les 5 heures de service visibles cachent souvent 12 à 16 heures de
              production en amont (mise en place, dressage, découpe). Sans compter le temps de
              chargement, de route et de démontage. Un traiteur qui ne facture que les heures de
              service "perd" 60 à 70 % du temps de travail réel.
            </p>

            <Callout type="warning">
              <strong>Règle d'or :</strong> pour chiffrer la main d'oeuvre d'une prestation,
              multipliez les heures de service par 2 à 2,5 pour obtenir le temps de travail total
              (production + service + logistique). Un cocktail de 5 h de service représente en
              réalité 11 à 13 h de travail effectif par personne mobilisée.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Devis ═════════════ */}
        <section id="devis" className="mb-16">
          <SectionHeading icon={<FileText className="w-6 h-6" />} number="6">
            Le devis traiteur : chiffrer sans se tromper
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le devis est le moment de vérité du traiteur. Un devis mal chiffré engage la
              rentabilité de tout l'événement, sans rattrapage possible une fois signé. Voici la
              méthode en 4 étapes pour chiffrer une prestation rentable à coup sûr.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <StepCard number={1} title="Calculer le coût matières réel">
              Additionnez le coût de chaque ingrédient via vos fiches techniques, en intégrant un
              taux de perte réaliste (5-12 % selon le format). C'est la base du chiffrage.
            </StepCard>
            <StepCard number={2} title="Chiffrer la main d'oeuvre en heures réelles">
              Estimez les heures de production, de service et de logistique, puis multipliez par les
              taux horaires charges. N'oubliez jamais les heures de préparation en amont.
            </StepCard>
            <StepCard number={3} title="Lister la logistique en ligne distincte">
              Transport, location de matériel, vaisselle, nappage, chauffe-plats : détaillez ces
              coûts séparément (2-6 EUR/convive) pour protéger la marge en cas d'annulation partielle.
            </StepCard>
            <StepCard number={4} title="Appliquer le coefficient et la marge de sécurité">
              Appliquez un coefficient multiplicateur de 3,5-4,5 sur le coût matières, ajoutez les
              coûts directs de main d'oeuvre et de logistique, puis une marge de sécurité de 10-15 %
              pour absorber les imprévus.
            </StepCard>
          </div>

          <div className="prose-content mt-8">
            <p>
              La formule synthétique du devis traiteur rentable :
            </p>
            <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-4 font-mono text-sm text-mono-200">
              Prix HT = (coût matières x coefficient) + main d'oeuvre + logistique + marge de sécurité
            </div>
            <p>
              Un logiciel de marge comme RestauMargin permet de générer ce calcul automatiquement
              pour chaque devis, en partant des fiches techniques et en ajustant le coefficient
              selon le format. Vous savez instantanément si une prestation atteint votre seuil de
              marge cible avant même d'envoyer le devis au client.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : KPI ═════════════ */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="7">
            Les 6 KPI à suivre en traiteur
          </SectionHeading>

          <div className="prose-content">
            <p>
              Piloter une activité traiteur sans indicateurs, c'est avancer à l'aveugle. Voici les
              6 KPI à suivre prestation après prestation pour garder le contrôle de la rentabilité.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <KpiCard icon={<Percent className="w-5 h-5" />} title="Food cost par prestation" target="Cible : 28-35 %">
              Le ratio matières premières, calculé par format (cocktail, buffet, mariage).
            </KpiCard>
            <KpiCard icon={<Users className="w-5 h-5" />} title="Coût main d'oeuvre / CA" target="Cible : inférieur à 30 %">
              Le poste qui détruit la marge si mal maîtrisé. À suivre prestation par prestation.
            </KpiCard>
            <KpiCard icon={<FileText className="w-5 h-5" />} title="Taux de transformation des devis" target="Cible : supérieur à 35 %">
              Le ratio devis signés / devis envoyés. Mesure la justesse de votre positionnement prix.
            </KpiCard>
            <KpiCard icon={<UtensilsCrossed className="w-5 h-5" />} title="Marge brute par format" target="Cible : 65-72 %">
              Comparez la rentabilité réelle de chaque type d'événement pour arbitrer votre carnet.
            </KpiCard>
            <KpiCard icon={<Truck className="w-5 h-5" />} title="Taux de gaspillage" target="Cible : inférieur à 8 %">
              Les invendus de buffet et les pertes de production, à suivre pour calibrer les quantités.
            </KpiCard>
            <KpiCard icon={<Calculator className="w-5 h-5" />} title="Ticket moyen par convive" target="Suivi mensuel">
              L'indicateur de montée en gamme et de pouvoir de négociation commerciale.
            </KpiCard>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Exemple illustratif ═════════════ */}
        <section id="cas-bordeaux" className="mb-16">
          <SectionHeading icon={<TrendingUpIcon />} number="8">
            Exemple illustratif : un traiteur événementiel, de 6 % à 19 % de marge nette
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons un exemple fictif : un traiteur événementiel régional,
              35 prestations par mois en moyenne, 480 000 EUR de chiffre d'affaires annuel. À son
              point de départ, l'entreprise affichait une marge nette de seulement 6 %, malgré une
              marge brute apparente de 68 %.
            </p>
            <p>
              Le diagnostic a révélé trois fuites majeures :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Main d'oeuvre sous-estimée</strong> : les devis ne facturaient que les
                heures de service, ignorant 60 % du temps de travail réel (production, logistique).
              </li>
              <li>
                <strong>Coefficient uniforme</strong> : le même coefficient appliquait sur les
                mariages (à perte) et les plateaux-repas (sur-marginés, perte de marchés).
              </li>
              <li>
                <strong>Gaspillage non suivi</strong> : 14 % de perte sur les buffets, jamais
                intégrée dans le coût réel des prestations.
              </li>
            </ul>
            <p className="mt-4">
              Les actions menées sur 12 mois :
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <PhaseCard
              phase="Mois 1-3"
              title="Chiffrage main d'oeuvre"
              actions={[
                'Intégration des heures de production dans chaque devis',
                'Taux horaires chargés par poste',
                'Modèle de devis 4 postes',
              ]}
            />
            <PhaseCard
              phase="Mois 4-8"
              title="Coefficients par format"
              actions={[
                'Coefficient ajusté par type de prestation',
                'Re-tarification des plateaux-repas',
                'Repositionnement des mariages',
              ]}
            />
            <PhaseCard
              phase="Mois 9-12"
              title="Pilotage continu"
              actions={[
                'Suivi gaspillage par prestation',
                'Tableau de bord 6 KPI',
                'Arbitrage du carnet de commandes',
              ]}
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              Dans cet exemple, au bout de 12 mois, la marge nette passe de 6 % à 19 %, sans
              augmenter le chiffre d'affaires. Sur 480 000 EUR de CA, c'est un bénéfice net qui
              passe de 28 800 EUR à 91 200 EUR, soit <strong>62 400 EUR de profit supplémentaire
              annuel</strong>, uniquement en chiffrant correctement les coûts cachés et en
              ajustant les coefficients par format.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 9 : Logiciel ═════════════ */}
        <section id="logiciel" className="mb-16">
          <SectionHeading icon={<Zap className="w-6 h-6" />} number="9">
            Comment RestauMargin automatise le calcul de marge traiteur
          </SectionHeading>

          <div className="prose-content">
            <p>
              RestauMargin a été pensé pour la complexité spécifique du métier de traiteur. La
              différence avec un tableur Excel artisanal : tout est automatisé, mis à jour en temps
              réel et accessible depuis une tablette en cuisine ou sur un événement.
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Fiches techniques par prestation</strong> avec grammages, taux de perte et
                coût matières recalculé à chaque variation de prix fournisseur.
              </li>
              <li>
                <strong>Chiffrage de la main d'oeuvre</strong> intégré au calcul de marge :
                heures de production, service, logistique x taux horaires charges.
              </li>
              <li>
                <strong>Coefficient ajustable par format</strong> pour ne plus appliquer le même
                multiplicateur à un mariage et à un plateau-repas.
              </li>
              <li>
                <strong>Scan OCR des factures</strong> fournisseurs pour suivre les prix volatils
                (saumon, foie gras, fruits de mer) et alerter en cas de dérive.
              </li>
              <li>
                <strong>Tableau de bord 6 KPI traiteur</strong> avec comparaison de la marge nette
                réelle par type de prestation.
              </li>
              <li>
                <strong>PWA mobile</strong> : consultez vos fiches et vos marges directement sur
                l'événement, sans connexion permanente.
              </li>
            </ul>
            <p className="mt-4">
              Résultat : chaque devis devient une décision éclairée. Vous savez avant de l'envoyer
              si la prestation atteint votre seuil de marge cible, et vous arrêtez de travailler à
              perte les week-ends charges.
            </p>
          </div>
        </section>

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes traiteur</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Piloter la marge de votre activité traiteur avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Food cost par prestation, chiffrage de la main d'oeuvre, coefficient par format,
              devis rentables, suivi de la marge nette : tout ce qu'il faut pour garder une marge
              nette supérieure à 15 % sur chaque événement.
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

        {/* Articles complementaires */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul de marge restaurant</h3>
              <p className="text-xs text-mono-500">Le guide de référence du calcul de marge en restauration.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Coefficient multiplicateur restaurant</h3>
              <p className="text-xs text-mono-500">Du coût matières au prix de vente, méthode pas à pas.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire son food cost</h3>
              <p className="text-xs text-mono-500">Méthodes, benchmarks, leviers d'optimisation.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Essai gratuit 7 jours</h3>
              <p className="text-xs text-mono-500">Pilotez votre activité traiteur sans carte bancaire requise.</p>
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

function TrendingUpIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5" />
    </svg>
  );
}

function StepCard({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-mono-100 mb-1.5">{title}</h3>
        <p className="text-sm text-mono-400 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function KpiCard({ icon, title, target, children }: { icon: React.ReactNode; title: string; target: string; children: React.ReactNode }) {
  return (
    <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-bold text-mono-100 text-sm">{title}</h3>
      </div>
      <div className="text-xs font-semibold text-teal-600 mb-2">{target}</div>
      <p className="text-xs text-mono-500 leading-relaxed">{children}</p>
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
