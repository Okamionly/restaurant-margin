import { Link } from 'react-router-dom';
import { ChefHat, Calculator, AlertTriangle, CheckCircle, ArrowRight, Percent, Target, BookOpen, Lightbulb, Zap, Truck, Users, UtensilsCrossed, FileText, PartyPopper } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO — "Logiciel de marge pour traiteur"
   Mots-cles cibles : marge traiteur / food cost traiteur / rentabilite traiteur / devis traiteur
   ~2 900 mots — mode clair, fond blanc, theme W&B
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost ideal pour un traiteur ?',
    answer: "Le food cost ideal d'un traiteur se situe entre 28 % et 35 % selon le type de prestation. Un cocktail dinatoire premium tourne autour de 28-30 %, un buffet d'entreprise 30-33 %, et une prestation mariage haut de gamme peut monter a 33-35 % a cause des produits nobles (foie gras, saumon, champagne). Contrairement a la restauration assise, le traiteur doit integrer le cout de la main d'oeuvre evenementielle et de la logistique dans son calcul de rentabilite, pas seulement le food cost matieres.",
  },
  {
    question: 'Comment calculer le prix d\'une prestation traiteur ?',
    answer: "Le prix d'une prestation traiteur se calcule en additionnant quatre postes : (1) le cout matieres premieres (food cost), (2) la main d'oeuvre de production et de service (cuisiniers, extras, maitre d'hotel), (3) la logistique (transport, location de materiel, vaisselle), puis on applique un coefficient multiplicateur global de 3,5 a 4,5 sur le cout matieres OU une marge brute cible de 65-72 % sur le prix total. La formule recommandee : Prix HT = cout matieres x coefficient + couts directs main d'oeuvre et logistique + marge de securite 10-15 %.",
  },
  {
    question: 'Quelle marge nette espérer en traiteur evenementiel ?',
    answer: "Un traiteur evenementiel bien gere degage entre 12 % et 20 % de marge nette. Beaucoup de traiteurs affichent une marge brute correcte (65-70 %) mais une marge nette faible (4-8 %) car ils sous-estiment systematiquement le cout de la main d'oeuvre extra, des heures supplementaires de week-end et du transport. La maitrise de ces couts variables est le principal levier de rentabilite du metier.",
  },
  {
    question: 'Comment chiffrer le cout de la main d\'oeuvre dans un devis traiteur ?',
    answer: "Le cout de la main d'oeuvre traiteur se chiffre en heures reelles x taux horaire charge. Comptez 25-35 EUR/heure charge pour un cuisinier, 18-25 EUR/heure pour un extra de service, et n'oubliez pas les heures de preparation en amont (souvent 1,5 a 2x les heures de prestation). Pour un cocktail de 100 personnes, prevoyez 3-4 personnes en service pendant 5 heures + 2 cuisiniers sur 8 heures de production : soit 40 a 50 heures de main d'oeuvre a integrer dans le devis.",
  },
  {
    question: 'Quel coefficient multiplicateur appliquer en traiteur ?',
    answer: "Le coefficient multiplicateur traiteur se situe entre 3,5 et 4,5 sur le cout matieres, soit plus eleve que la restauration assise classique (coefficient 3-3,5). Cette difference s'explique par les couts caches du metier : transport, location de materiel, vaisselle, perte sur invendus de buffet, et surtout la main d'oeuvre evenementielle ponctuelle. Un coefficient de 4 sur les matieres est un bon point de depart, a affiner selon la prestation.",
  },
  {
    question: 'Comment gerer le gaspillage et les invendus en traiteur buffet ?',
    answer: "Le gaspillage en traiteur buffet represente 8 a 15 % des matieres produites si rien n'est suivi. Pour le maitriser : calibrez les quantites a 1,1-1,2x le nombre de convives (et non 1,5x par securite excessive), suivez les retours par type de plat sur plusieurs prestations, et integrez un taux de perte realiste dans vos fiches techniques. Un logiciel de marge permet de stocker ce taux de gaspillage par recette et de l'inclure automatiquement dans le cout reel.",
  },
  {
    question: 'Faut-il facturer la location de materiel separement ?',
    answer: "Oui, il est fortement recommande de detailler la location de materiel (mange-debout, vaisselle, nappage, chauffe-plats, tireuse) en ligne distincte du devis traiteur. Cela ameliore la lisibilite pour le client, evite de noyer ces couts dans le prix au couvert, et protege votre marge si le client annule une partie de la prestation. Comptez 2 a 6 EUR/personne de location materiel selon le niveau de la prestation.",
  },
  {
    question: 'Quels KPI suivre dans une activite traiteur ?',
    answer: "Les 6 KPI essentiels d'un traiteur : (1) Food cost par prestation (cible 28-35 %), (2) Cout main d'oeuvre / CA prestation (cible inferieure a 30 %), (3) Marge brute par type de prestation (cocktail vs buffet vs mariage), (4) Ticket moyen par convive, (5) Taux de transformation des devis (cible superieure a 35 %), (6) Taux de gaspillage par prestation. RestauMargin centralise ces indicateurs et compare la rentabilite reelle de chaque type d'evenement.",
  },
  {
    question: 'Comment differencier la marge entre cocktail, buffet et plateau-repas ?',
    answer: "Chaque format traiteur a une structure de marge distincte. Le plateau-repas individuel a le food cost le plus eleve (35-40 %) mais une logistique simple et une main d'oeuvre faible. Le cocktail dinatoire a un bon food cost (28-30 %) mais demande beaucoup de main d'oeuvre de service. Le buffet d'entreprise offre le meilleur compromis (food cost 30-33 %, main d'oeuvre moderee). Une activite traiteur rentable equilibre ces trois formats selon la saison et la demande.",
  },
  {
    question: 'Pourquoi un logiciel de marge est-il indispensable pour un traiteur ?',
    answer: "Un traiteur jongle avec des dizaines de fiches techniques, des devis sur mesure, des produits a prix volatils (saumon, foie gras, fruits de mer) et une main d'oeuvre ponctuelle difficile a chiffrer. Sans logiciel, chaque devis est un pari sur la rentabilite. RestauMargin calcule automatiquement le cout reel de chaque prestation (matieres + main d'oeuvre + logistique), met a jour les prix via le scan OCR des factures, et alerte des qu'une prestation passe sous le seuil de marge cible.",
  },
];

export default function LogicielMargeTraiteur() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel marge traiteur | Food cost et devis traiteur | RestauMargin"
        description="Logiciel pour calculer la marge d'un traiteur evenementiel. Cout prestation, main d'oeuvre, devis, food cost cible 28-35%. Essai gratuit 7 jours."
        path="/logiciel-marge-traiteur"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels metier', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            { name: 'Logiciel marge traiteur', url: 'https://www.restaumargin.fr/logiciel-marge-traiteur' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour traiteur : food cost, devis et rentabilite en 2026',
            description: "Guide complet du calcul de marge pour traiteur evenementiel : decomposition du cout d'une prestation, food cost cible 28-35 %, chiffrage de la main d'oeuvre, methode de devis, KPI specifiques et cas concret Bordeaux.",
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
            description: "Logiciel SaaS de calcul de marge pour traiteur evenementiel : food cost par prestation, chiffrage de la main d'oeuvre et de la logistique, generation de devis rentables, suivi de la marge par type d'evenement (cocktail, buffet, mariage, plateau-repas), scan OCR des factures fournisseurs, KPI traiteur.",
            featureList: [
              'Fiches techniques par prestation avec grammages et taux de perte',
              'Calcul du cout reel : matieres + main d\'oeuvre + logistique',
              'Chiffrage de la main d\'oeuvre evenementielle (cuisiniers, extras, service)',
              'Coefficient multiplicateur ajustable par type de prestation',
              'Suivi de la marge par format (cocktail, buffet, mariage, plateau-repas)',
              'Scan factures fournisseurs (OCR) produits volatils',
              'KPI traiteur : food cost, cout MO/CA, taux de transformation devis',
              'Compatible PWA tablette en cuisine et sur evenement',
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
              <PartyPopper className="w-4 h-4" />
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
          <Link to="/logiciel-marge-restaurant" className="hover:text-teal-600">Logiciels metier</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel marge traiteur</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Traiteur"
        readTime="14 min"
        date="Mai 2026"
        title="Logiciel de marge pour traiteur : food cost, devis et rentabilite en 2026"
        accentWord="traiteur"
        subtitle="Le metier de traiteur a une economie unique : forte marge brute apparente mais main d'oeuvre evenementielle et logistique qui rongent la marge nette. Methode de calcul, decomposition du cout d'une prestation, chiffrage de devis et cas concret."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-28" readTime="14 min" variant="header" />

        {/* ── Featured snippet / Reperes ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Reperes cles traiteur</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les ratios a memoriser
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost cible traiteur</strong> : 28 % a 35 % selon prestation</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Coefficient multiplicateur</strong> : 3,5 a 4,5 sur le cout matieres</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Cout main d'oeuvre / CA</strong> : a maintenir sous 30 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Marge nette saine</strong> : 12 % a 20 %</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Un traiteur peut afficher 68 % de marge brute et perdre de l'argent : tout se joue
            sur la maitrise de la main d'oeuvre evenementielle et de la logistique.
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
              { href: '#intro', label: 'Pourquoi le traiteur est un metier de marge a part' },
              { href: '#food-cost', label: 'Food cost cible : 28-35 % selon la prestation' },
              { href: '#decomposition', label: 'Decomposition du cout reel d\'une prestation' },
              { href: '#formats', label: 'Tableau : 6 formats de prestation et leurs marges' },
              { href: '#main-oeuvre', label: 'Le piege de la main d\'oeuvre evenementielle' },
              { href: '#devis', label: 'Le devis traiteur : chiffrer sans se tromper' },
              { href: '#kpi', label: 'Les 6 KPI a suivre en traiteur' },
              { href: '#cas-bordeaux', label: 'Cas concret : traiteur Bordeaux, 6 % a 19 % en 12 mois' },
              { href: '#logiciel', label: 'Comment RestauMargin automatise tout' },
              { href: '#faq', label: 'Questions frequentes traiteur' },
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
            Pourquoi le traiteur est un metier de marge a part
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le metier de traiteur ressemble en apparence a celui d'un restaurant : on achete des
              matieres premieres, on les transforme, on les vend avec une marge. Mais la realite
              economique est radicalement differente. Un restaurant assis vend des couverts a la
              chaine, dans un lieu fixe, avec une equipe permanente. Un traiteur, lui, produit des
              prestations ponctuelles, sur mesure, hors les murs, avec une main d'oeuvre qui
              varie d'un evenement a l'autre.
            </p>
            <p>
              Cette specificite cree un piege de rentabilite classique : le traiteur regarde son
              food cost matieres (souvent excellent, autour de 30 %), conclut qu'il gagne bien sa
              vie, puis decouvre en fin d'annee une marge nette ridicule. La raison ? Il a oublie
              d'integrer le cout reel de la main d'oeuvre evenementielle, du transport, de la
              location de materiel et du gaspillage de buffet dans le calcul de chaque prestation.
            </p>
            <p>
              Calculer la marge d'un traiteur ne se limite donc jamais au food cost. Il faut
              raisonner par prestation complete, en additionnant quatre postes de cout : les
              matieres premieres, la main d'oeuvre de production et de service, la logistique
              (transport, materiel, vaisselle) et les couts caches (perte, casse, deplacements).
              C'est seulement apres avoir consolide ces quatre postes qu'on connait la marge nette
              reelle d'un cocktail, d'un buffet ou d'un mariage.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Sur une prestation de mariage facturee 90 EUR/convive,
              un traiteur qui maitrise sa main d'oeuvre degage 16-20 EUR de marge nette par convive.
              Un traiteur qui sous-estime ses extras et heures sup tombe a 4-6 EUR : pour 120
              convives, c'est une difference de 1 400 a 1 700 EUR de benefice sur un seul evenement.
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
              Le food cost (ratio matieres premieres) d'un traiteur se situe entre 28 % et 35 %
              du prix de vente HT, mais cette fourchette varie fortement selon le type de
              prestation. Contrairement a une pizzeria ou un fast-food qui visent un food cost
              unique, le traiteur doit raisonner format par format.
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Cocktail dinatoire premium</strong> : food cost 28-30 %. Petites pieces
                soignees, dressage minutieux, mais cout matieres maitrise par bouchee.
              </li>
              <li>
                <strong>Buffet d'entreprise</strong> : food cost 30-33 %. Volume plus important,
                gaspillage a surveiller, produits de gamme moyenne.
              </li>
              <li>
                <strong>Prestation mariage / gastronomique</strong> : food cost 33-35 %. Produits
                nobles (foie gras, saumon, Saint-Jacques, champagne) qui tirent le ratio vers le haut.
              </li>
              <li>
                <strong>Plateau-repas individuel</strong> : food cost 35-40 %. Le plus eleve, car
                portion calibree genereuse et emballage individuel, mais logistique simple.
              </li>
            </ul>
            <p className="mt-4">
              La cle est de comprendre que le food cost n'est qu'un des quatre postes de cout. Un
              plateau-repas a 38 % de food cost peut etre plus rentable qu'un cocktail a 28 % si le
              cocktail mobilise quatre extras pendant cinq heures. C'est pourquoi le traiteur doit
              suivre la <strong>marge nette par prestation</strong>, et non le food cost isole.
            </p>

            <Callout type="warning">
              <strong>Erreur frequente :</strong> beaucoup de traiteurs appliquent le meme
              coefficient multiplicateur a toutes leurs prestations. Resultat : ils sur-marginent
              les plateaux-repas (et perdent des marches) et sous-marginent les mariages (et
              travaillent a perte les week-ends charges). Chaque format merite son propre coefficient.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Decomposition ═════════════ */}
        <section id="decomposition" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            Decomposition du cout reel d'une prestation
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons un exemple concret : un cocktail dinatoire de 100 personnes, 12 pieces par
              personne, facture 45 EUR HT/convive (soit 4 500 EUR HT). Voici comment se decompose
              le cout reel de cette prestation, poste par poste.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead className="bg-mono-1000 text-mono-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Poste de cout</th>
                  <th className="text-right px-4 py-3 font-semibold">Montant</th>
                  <th className="text-right px-4 py-3 font-semibold">% du CA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mono-900">
                <tr>
                  <td className="px-4 py-3 text-mono-300">Matieres premieres (food cost)</td>
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
                  <td className="px-4 py-3 text-mono-300">Logistique (transport + materiel + vaisselle)</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-100">360 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-400">8 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-mono-300">Couts caches (perte, casse, deplacements)</td>
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
              Cet exemple montre une prestation tres bien geree (38 % de marge nette). Mais il
              suffit de doubler le temps de service (mauvaise estimation), d'ajouter une heure de
              route ou de gaspiller 15 % des matieres pour que cette marge fonde de moitie. C'est
              precisement ce que la plupart des traiteurs ne voient pas, faute de suivre chaque
              poste de cout prestation par prestation.
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
              Chaque format de prestation traiteur a une structure de cout differente. Voici un
              comparatif des 6 formats les plus courants, avec leur food cost typique, leur
              intensite de main d'oeuvre et la marge nette atteignable lorsqu'ils sont bien geres.
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
                  <td className="px-4 py-3 font-medium text-mono-100">Cocktail dinatoire</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">35-60 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">28-30 %</td>
                  <td className="px-4 py-3 text-center text-amber-700">Forte</td>
                  <td className="px-4 py-3 text-right font-mono text-teal-700">14-20 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-mono-100">Buffet d'entreprise</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">22-38 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">30-33 %</td>
                  <td className="px-4 py-3 text-center text-amber-700">Moderee</td>
                  <td className="px-4 py-3 text-right font-mono text-teal-700">16-22 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-mono-100">Mariage</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">70-130 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">33-35 %</td>
                  <td className="px-4 py-3 text-center text-red-700">Tres forte</td>
                  <td className="px-4 py-3 text-right font-mono text-teal-700">12-18 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-mono-100">Brunch / petit-dejeuner</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">12-25 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">30-34 %</td>
                  <td className="px-4 py-3 text-center text-amber-700">Moderee</td>
                  <td className="px-4 py-3 text-right font-mono text-teal-700">14-20 %</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-mono-100">Seminaire (pause + dejeuner)</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">30-55 EUR</td>
                  <td className="px-4 py-3 text-right font-mono text-mono-300">29-33 %</td>
                  <td className="px-4 py-3 text-center text-amber-700">Moderee</td>
                  <td className="px-4 py-3 text-right font-mono text-teal-700">15-21 %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Lecon a retenir : le buffet d'entreprise et le seminaire offrent souvent le meilleur
              rapport rentabilite / complexite. Le mariage, malgre son ticket eleve, est le format
              le plus risque sur la marge nette a cause de l'intensite de la main d'oeuvre et des
              exigences de qualite. Un traiteur rentable equilibre son carnet de commandes entre
              ces formats plutot que de courir uniquement apres les gros mariages.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : Main d'oeuvre ═════════════ */}
        <section id="main-oeuvre" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="5">
            Le piege de la main d'oeuvre evenementielle
          </SectionHeading>

          <div className="prose-content">
            <p>
              La main d'oeuvre est le principal poste qui detruit la marge d'un traiteur, et le plus
              difficile a chiffrer. Contrairement a un restaurant qui a une equipe fixe, le traiteur
              recrute des extras a la prestation, paie des heures de nuit et de week-end majorees,
              et doit compter le temps de production en amont (souvent ignore dans les devis).
            </p>
            <p>
              Voici les taux horaires charges a integrer dans chaque prestation :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li><strong>Cuisinier / chef de partie</strong> : 25-35 EUR/heure charge</li>
              <li><strong>Extra de service</strong> : 18-25 EUR/heure charge</li>
              <li><strong>Maitre d'hotel</strong> : 28-38 EUR/heure charge</li>
              <li><strong>Plongeur / commis</strong> : 16-20 EUR/heure charge</li>
            </ul>
            <p className="mt-4">
              Le piege classique : oublier les heures de preparation. Pour un cocktail de 100
              personnes, les 5 heures de service visibles cachent souvent 12 a 16 heures de
              production en amont (mise en place, dressage, decoupe). Sans compter le temps de
              chargement, de route et de demontage. Un traiteur qui ne facture que les heures de
              service "perd" 60 a 70 % du temps de travail reel.
            </p>

            <Callout type="warning">
              <strong>Regle d'or :</strong> pour chiffrer la main d'oeuvre d'une prestation,
              multipliez les heures de service par 2 a 2,5 pour obtenir le temps de travail total
              (production + service + logistique). Un cocktail de 5 h de service represente en
              realite 11 a 13 h de travail effectif par personne mobilisee.
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
              Le devis est le moment de verite du traiteur. Un devis mal chiffre engage la
              rentabilite de tout l'evenement, sans rattrapage possible une fois signe. Voici la
              methode en 4 etapes pour chiffrer une prestation rentable a coup sur.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <StepCard number={1} title="Calculer le cout matieres reel">
              Additionnez le cout de chaque ingredient via vos fiches techniques, en integrant un
              taux de perte realiste (5-12 % selon le format). C'est la base du chiffrage.
            </StepCard>
            <StepCard number={2} title="Chiffrer la main d'oeuvre en heures reelles">
              Estimez les heures de production, de service et de logistique, puis multipliez par les
              taux horaires charges. N'oubliez jamais les heures de preparation en amont.
            </StepCard>
            <StepCard number={3} title="Lister la logistique en ligne distincte">
              Transport, location de materiel, vaisselle, nappage, chauffe-plats : detaillez ces
              couts separement (2-6 EUR/convive) pour proteger la marge en cas d'annulation partielle.
            </StepCard>
            <StepCard number={4} title="Appliquer le coefficient et la marge de securite">
              Appliquez un coefficient multiplicateur de 3,5-4,5 sur le cout matieres, ajoutez les
              couts directs de main d'oeuvre et de logistique, puis une marge de securite de 10-15 %
              pour absorber les imprevus.
            </StepCard>
          </div>

          <div className="prose-content mt-8">
            <p>
              La formule synthetique du devis traiteur rentable :
            </p>
            <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-4 font-mono text-sm text-mono-200">
              Prix HT = (cout matieres x coefficient) + main d'oeuvre + logistique + marge de securite
            </div>
            <p>
              Un logiciel de marge comme RestauMargin permet de generer ce calcul automatiquement
              pour chaque devis, en partant des fiches techniques et en ajustant le coefficient
              selon le format. Vous savez instantanement si une prestation atteint votre seuil de
              marge cible avant meme d'envoyer le devis au client.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : KPI ═════════════ */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="7">
            Les 6 KPI a suivre en traiteur
          </SectionHeading>

          <div className="prose-content">
            <p>
              Piloter une activite traiteur sans indicateurs, c'est avancer a l'aveugle. Voici les
              6 KPI a suivre prestation apres prestation pour garder le controle de la rentabilite.
            </p>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <KpiCard icon={<Percent className="w-5 h-5" />} title="Food cost par prestation" target="Cible : 28-35 %">
              Le ratio matieres premieres, calcule par format (cocktail, buffet, mariage).
            </KpiCard>
            <KpiCard icon={<Users className="w-5 h-5" />} title="Cout main d'oeuvre / CA" target="Cible : inferieur a 30 %">
              Le poste qui detruit la marge si mal maitrise. A suivre prestation par prestation.
            </KpiCard>
            <KpiCard icon={<FileText className="w-5 h-5" />} title="Taux de transformation des devis" target="Cible : superieur a 35 %">
              Le ratio devis signes / devis envoyes. Mesure la justesse de votre positionnement prix.
            </KpiCard>
            <KpiCard icon={<UtensilsCrossed className="w-5 h-5" />} title="Marge brute par format" target="Cible : 65-72 %">
              Comparez la rentabilite reelle de chaque type d'evenement pour arbitrer votre carnet.
            </KpiCard>
            <KpiCard icon={<Truck className="w-5 h-5" />} title="Taux de gaspillage" target="Cible : inferieur a 8 %">
              Les invendus de buffet et les pertes de production, a suivre pour calibrer les quantites.
            </KpiCard>
            <KpiCard icon={<Calculator className="w-5 h-5" />} title="Ticket moyen par convive" target="Suivi mensuel">
              L'indicateur de montee en gamme et de pouvoir de negociation commerciale.
            </KpiCard>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Cas concret ═════════════ */}
        <section id="cas-bordeaux" className="mb-16">
          <SectionHeading icon={<TrendingUpIcon />} number="8">
            Cas concret : traiteur Bordeaux, 6 % a 19 % en 12 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons le cas representatif d'un traiteur evenementiel de la region bordelaise,
              35 prestations par mois en moyenne, 480 000 EUR de chiffre d'affaires annuel. A son
              point de depart, l'entreprise affichait une marge nette de seulement 6 %, malgre une
              marge brute apparente de 68 %.
            </p>
            <p>
              Le diagnostic a revele trois fuites majeures :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Main d'oeuvre sous-estimee</strong> : les devis ne facturaient que les
                heures de service, ignorant 60 % du temps de travail reel (production, logistique).
              </li>
              <li>
                <strong>Coefficient uniforme</strong> : le meme coefficient appliquait sur les
                mariages (a perte) et les plateaux-repas (sur-margines, perte de marches).
              </li>
              <li>
                <strong>Gaspillage non suivi</strong> : 14 % de perte sur les buffets, jamais
                integree dans le cout reel des prestations.
              </li>
            </ul>
            <p className="mt-4">
              Les actions menees sur 12 mois :
            </p>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <PhaseCard
              phase="Mois 1-3"
              title="Chiffrage main d'oeuvre"
              actions={[
                'Integration des heures de production dans chaque devis',
                'Taux horaires charges par poste',
                'Modele de devis 4 postes',
              ]}
            />
            <PhaseCard
              phase="Mois 4-8"
              title="Coefficients par format"
              actions={[
                'Coefficient ajuste par type de prestation',
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
              Resultat au bout de 12 mois : la marge nette est passee de 6 % a 19 %, sans
              augmenter le chiffre d'affaires. Sur 480 000 EUR de CA, c'est un benefice net qui
              passe de 28 800 EUR a 91 200 EUR, soit <strong>62 400 EUR de profit supplementaire
              annuel</strong>, uniquement en chiffrant correctement les couts caches et en
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
              RestauMargin a ete pense pour la complexite specifique du metier de traiteur. La
              difference avec un tableur Excel artisanal : tout est automatise, mis a jour en temps
              reel et accessible depuis une tablette en cuisine ou sur un evenement.
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Fiches techniques par prestation</strong> avec grammages, taux de perte et
                cout matieres recalcule a chaque variation de prix fournisseur.
              </li>
              <li>
                <strong>Chiffrage de la main d'oeuvre</strong> integre au calcul de marge :
                heures de production, service, logistique x taux horaires charges.
              </li>
              <li>
                <strong>Coefficient ajustable par format</strong> pour ne plus appliquer le meme
                multiplicateur a un mariage et a un plateau-repas.
              </li>
              <li>
                <strong>Scan OCR des factures</strong> fournisseurs pour suivre les prix volatils
                (saumon, foie gras, fruits de mer) et alerter en cas de derive.
              </li>
              <li>
                <strong>Tableau de bord 6 KPI traiteur</strong> avec comparaison de la marge nette
                reelle par type de prestation.
              </li>
              <li>
                <strong>PWA mobile</strong> : consultez vos fiches et vos marges directement sur
                l'evenement, sans connexion permanente.
              </li>
            </ul>
            <p className="mt-4">
              Resultat : chaque devis devient une decision eclairee. Vous savez avant de l'envoyer
              si la prestation atteint votre seuil de marge cible, et vous arretez de travailler a
              perte les week-ends charges.
            </p>
          </div>
        </section>

        {/* ═════════════ FAQ ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes traiteur</h2>
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
              Piloter la marge de votre activite traiteur avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Food cost par prestation, chiffrage de la main d'oeuvre, coefficient par format,
              devis rentables, suivi de la marge nette : tout ce qu'il faut pour garder une marge
              nette superieure a 15 % sur chaque evenement.
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
              <p className="text-xs text-mono-500">Le guide de reference du calcul de marge en restauration.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Coefficient multiplicateur restaurant</h3>
              <p className="text-xs text-mono-500">Du cout matieres au prix de vente, methode pas a pas.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire son food cost</h3>
              <p className="text-xs text-mono-500">Methodes, benchmarks, leviers d'optimisation.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Essai gratuit 7 jours</h3>
              <p className="text-xs text-mono-500">Pilotez votre activite traiteur sans carte bancaire requise.</p>
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
            La plateforme de gestion de marge pour les restaurateurs et traiteurs.
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
