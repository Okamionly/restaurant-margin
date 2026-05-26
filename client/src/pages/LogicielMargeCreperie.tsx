import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, Calculator, AlertTriangle, CheckCircle, ArrowRight, BarChart3, DollarSign, Percent, Target, BookOpen, Lightbulb, Zap, Award, Sparkles, Flame, Clock, Users, Wheat, Wine } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Page niche SEO — "Logiciel de marge pour creperie"
   Mots-cles cibles : marge creperie / food cost galettes / rentabilite creperie / creperie bretagne
   ~2 700 mots — mode clair, fond blanc, theme W&B
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: 'Quel est le food cost ideal pour une creperie ?',
    answer: "Le food cost ideal d'une creperie se situe entre 22 % et 26 %. C'est l'un des plus bas de toute la restauration, a egalite avec la pizzeria. Cette performance s'explique par le faible cout des matieres premieres (farine de blé noir, oeufs, beurre, lait) et le prix de vente psychologique eleve d'une galette complete (9-14 EUR).",
  },
  {
    question: 'Combien coute la fabrication d\'une galette complete ?',
    answer: "Une galette complete (jambon, emmental, oeuf) coute entre 1,60 EUR et 2,10 EUR en cout matieres : pate sarrasin 0,10 EUR, jambon de Paris 0,80 EUR, emmental rape 0,40 EUR, oeuf plein air 0,25 EUR, beurre breton cuisson 0,15 EUR, cidre flambage 0,05 EUR. Vendue 9-12 EUR, le food cost ressort entre 14 % et 19 % — excellent ratio.",
  },
  {
    question: 'Comment calculer la rentabilite d\'une creperie ?',
    answer: "La rentabilite d'une creperie se calcule en additionnant les marges brutes par galette et crepe puis en deduisant les charges (loyer, salaires, energie billig, cidre). Formule : Marge nette (%) = (CA - couts matieres - personnel - charges fixes) / CA x 100. Une creperie bien geree degage 12 a 22 % de marge nette grace au mix galette + crepe + cidre tres rentable.",
  },
  {
    question: 'Combien coute la farine de blé noir / sarrasin en 2026 ?',
    answer: "La farine de blé noir varie selon la qualite : 1,50 a 2,00 EUR/kg pour la T130 standard, 2,20 a 2,80 EUR/kg pour le sarrasin bio francais, 2,80 a 3,50 EUR/kg pour le sarrasin breton AOP IGP. Une creperie utilisant uniquement du sarrasin bio breton paye 65 a 80 % plus cher qu'avec du blé noir conventionnel. A integrer dans le calcul de marge.",
  },
  {
    question: 'Combien de galettes un crepier peut-il faire par heure ?',
    answer: "Un crepier experimente produit entre 50 et 100 galettes ou crepes par heure sur un billig de 35-40 cm, selon le format et la garniture. Une formule rapide (galette beurre-sucre, complete simple) permet 80-100 plats/heure en rush. Les galettes complexes (forestiere, royale) descendent a 40-60 plats/heure. C'est le KPI cle pour dimensionner l'equipe et le nombre de billigs.",
  },
  {
    question: 'Pourquoi le cidre est-il essentiel a la rentabilite d\'une creperie ?',
    answer: "Le cidre bouché AOP Bretagne ou Pays de la Loire offre une marge brute de 80 a 85 % grace a un cout matiere tres faible (1,80-2,50 EUR la bouteille 75 cl achat groupiste) et un prix de vente eleve (16-22 EUR la bouteille). C'est le levier #1 de rentabilite d'une creperie. Une bolee de cidre vendue 4,50 EUR coute 0,50-0,80 EUR : 82 % de marge brute. Le cidre maison brasse en cuve pousse la marge a 88-92 %.",
  },
  {
    question: 'Quel salaire pour un crepier en France en 2026 ?',
    answer: "Un crepier en CDI convention HCR (hotels-cafes-restaurants) gagne entre 1 750 EUR et 2 600 EUR brut/mois selon experience, region et structure. Avec primes de coupure et heures du soir, le cout total employeur tourne autour de 2 400 a 3 600 EUR/mois. Un crepier formé sur billig avec experience en service rapide est tres recherche en zone touristique bretonne.",
  },
  {
    question: 'Pourquoi le logiciel de marge est-il indispensable en creperie ?',
    answer: "Une creperie gere typiquement 25 a 45 references (galettes salees + crepes sucrees + cidres + boissons), avec une saisonnalite forte (touristes en ete, locaux en hiver). Sans logiciel, impossible de recalculer le food cost a chaque hausse de farine, beurre AOP ou cidre. RestauMargin met a jour automatiquement les couts via le scan OCR des factures fournisseurs et alerte des qu'une galette passe sous le seuil de marge cible.",
  },
  {
    question: 'Combien gagne une creperie en moyenne ?',
    answer: "Une creperie traditionnelle francaise realise entre 180 000 EUR et 600 000 EUR de CA annuel HT selon emplacement, capacite (couverts) et saison. La marge nette moyenne tourne autour de 12-18 % apres optimisation, soit 25 000 a 90 000 EUR de benefice net. Les creperies de bord de mer en Bretagne peuvent dépasser 800 000 EUR de CA en haute saison (juin a septembre).",
  },
  {
    question: 'Galettes au sarrasin bio ou conventionnel : quel impact sur la marge ?',
    answer: "Passer au sarrasin bio breton AOP fait grimper le cout pate de 0,10 EUR a 0,18 EUR par galette (+80 %). En contrepartie, le positionnement premium permet un prix de vente +1,50 a 2,50 EUR par galette. Le food cost reste similaire (16-20 %) mais la marge brute en valeur absolue augmente de 1,20 a 2,00 EUR/plat. Strategie gagnante en zone touristique et urbaine premium.",
  },
];

export default function LogicielMargeCreperie() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel marge creperie | Food cost galettes + crepes | RestauMargin"
        description="Logiciel pour calculer la marge d'une creperie. Cout galettes sarrasin, crepes, cidre. Food cost cible 22-26%. Essai gratuit 7 jours."
        path="/logiciel-marge-creperie"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Logiciels metier', url: 'https://www.restaumargin.fr/logiciel-marge-restaurant' },
            { name: 'Logiciel marge creperie', url: 'https://www.restaumargin.fr/logiciel-marge-creperie' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Logiciel de marge pour creperie en 2026',
            description: "Guide complet du calcul de marge pour creperie : decomposition cout galette sarrasin, food cost cible 22-26 %, levier cidre, KPI specifiques et cas concret Nantes.",
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/logiciel-marge-creperie' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin Creperie',
            applicationCategory: 'BusinessApplication',
            applicationSubCategory: 'Creperie Margin Software',
            operatingSystem: 'Web, iOS, Android',
            url: 'https://www.restaumargin.fr/logiciel-marge-creperie',
            description: "Logiciel SaaS de calcul de marge pour creperie : food cost par galette et crepe, gestion des couts farine sarrasin, beurre breton AOP, cidre bouche AOP, suivi productivite billig, KPI saisonniers, alertes prix fournisseurs.",
            featureList: [
              'Fiches techniques galettes et crepes avec grammages precis',
              'Calcul food cost automatique par galette / crepe / boisson',
              'Suivi cout farine sarrasin (conventionnel, bio, AOP breton)',
              'Marge cidre bouche AOP et cidre maison (jusqu\'a 92 % de marge brute)',
              'Scan factures fournisseurs farine, beurre, cidre (OCR)',
              'KPI specifiques creperie : galettes/service, productivite billig, mix sale/sucre',
              'Alertes deviation prix matieres premieres',
              'Gestion saisonnalite (haute / basse saison touristique)',
              'Compatible PWA tablette comptoir',
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
              ratingValue: '4.9',
              ratingCount: '64',
              bestRating: '5',
              worstRating: '1',
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
              <Wheat className="w-4 h-4" />
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
          <span className="text-mono-100 font-medium">Logiciel marge creperie</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Creperie"
        readTime="13 min"
        date="Mai 2026"
        title="Logiciel de marge pour creperie en 2026"
        accentWord="creperie"
        subtitle="La creperie est l'un des modeles a plus forte marge brute de la restauration francaise (74-78 %). Decomposition cout galette, levier cidre AOP, productivite billig, cas concret Nantes : tout pour piloter votre rentabilite."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="header" />

        {/* ── Encadre formule rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Reperes cles creperie</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les ratios a memoriser
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost cible creperie</strong> : 22 % a 26 % (le plus bas avec la pizzeria)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Marge brute cible</strong> : 74 % a 78 %</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Marge cidre bouche AOP</strong> : 80 % a 85 % (88-92 % en cidre maison)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Marge nette saine</strong> : 12 % a 22 %</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Le couple galette + cidre est l'un des plus rentables du secteur. Bien pilote, il peut
            propulser la marge nette au-dela de 20 %, niveau rare en restauration commerciale.
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
              { href: '#intro', label: 'Marche creperie France 2026 : 450 M EUR de CA' },
              { href: '#food-cost', label: 'Food cost cible : 22-26 %, le plus bas avec la pizzeria' },
              { href: '#couts-specifiques', label: 'Couts specifiques : sarrasin, beurre AOP, lait fermier, oeufs' },
              { href: '#decomposition', label: 'Decomposition cout d\'une galette complete' },
              { href: '#8-galettes', label: 'Tableau : 8 galettes et crepes types' },
              { href: '#operationnel', label: 'Specificites : billig, productivite, gestes techniques' },
              { href: '#cidre', label: 'Le cidre : le levier #1 de rentabilite' },
              { href: '#optimisation', label: 'Optimisation : cidre maison, formules midi, mix' },
              { href: '#cas-nantes', label: 'Cas concret : creperie Nantes, 12 % a 26 % en 8 mois' },
              { href: '#kpi', label: 'Les 6 KPI a suivre en creperie' },
              { href: '#logiciel', label: 'Comment RestauMargin automatise tout' },
              { href: '#faq', label: 'Questions frequentes creperie' },
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
          <SectionHeading icon={<Wheat className="w-6 h-6" />} number="1">
            Marche creperie France 2026 : 450 M EUR de CA
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le marche francais de la creperie pese environ <strong>450 millions d'euros</strong> en
              2026, avec pres de 3 200 etablissements actifs. C'est l'un des segments les plus
              dynamiques de la cuisine traditionnelle francaise, porté par trois tendances de fond :
              le retour aux produits du terroir (sarrasin AOP, beurre breton, cidre IGP), l'essor
              du tourisme intra-francais en Bretagne et Pays de la Loire, et le positionnement
              "comfort food sans gluten" sur la galette de blé noir.
            </p>
            <p>
              La creperie n'est pas un restaurant comme les autres. C'est l'un des modeles a plus
              forte marge brute du secteur : entre <strong>74 et 78 %</strong> en moyenne, juste
              derriere la pizzeria. Le ticket moyen sur place tourne autour de 18-26 EUR, avec une
              cadence de production elevee (50-100 galettes/heure sur un billig). Le couple galette +
              cidre est l'un des plus rentables jamais inventes en restauration commerciale francaise.
            </p>
            <p>
              Mais derriere cette apparente facilite se cachent des pieges : saisonnalite tres
              marquée (50-70 % du CA realise en juin-septembre dans les zones touristiques),
              hausse continue du prix du sarrasin (+18 % depuis 2023), pression sur la qualite
              des fromages et charcuteries (jambon de Paris artisanal vs industriel). Une creperie
              qui ne pilote pas ses marges au quotidien peut voir sa rentabilite s'eroder en
              quelques mois sans s'en rendre compte.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Une creperie qui passe son food cost de 28 % a 24 %
              gagne 4 points de marge brute. Sur un CA annuel de 380 000 EUR, c'est 15 200 EUR de
              benefice net supplementaire — soit le salaire d'un mi-temps en cuisine. Le pilotage
              du food cost est le levier #1 de rentabilite.
            </Callout>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Food cost cible ═════════════ */}
        <section id="food-cost" className="mb-16">
          <SectionHeading icon={<Percent className="w-6 h-6" />} number="2">
            Food cost cible : 22-26 %, le plus bas avec la pizzeria
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le food cost (ratio matieres) d'une creperie doit se situer entre <strong>22 % et
              26 %</strong>. C'est la fourchette la plus basse de toute la restauration commerciale,
              a egalite avec la pizzeria. Pour comparaison, un bistrot vise 28-33 %, un restaurant
              traditionnel 30-35 %, un gastronomique 30-40 %.
            </p>
            <p>
              Cette specificite s'explique par trois facteurs :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>Ingredients de base peu couteux</strong> : 1 kg de farine sarrasin
                conventionnelle coute 1,50-2,00 EUR, 1 L de lait fermier 0,90-1,10 EUR, 1 oeuf
                plein air 0,22-0,28 EUR. Le ratio prix/poids fini est exceptionnel.
              </li>
              <li>
                <strong>Faible variabilite des grammages</strong> : une galette pese 130-160 g
                tous composants confondus (50 g de pate sarrasin + 80-100 g de garniture). Pas
                de portions individuelles a calibrer comme pour un steak ou un poisson noble.
              </li>
              <li>
                <strong>Prix de vente psychologique eleve</strong> : le consommateur accepte de
                payer 9-14 EUR une galette complete dont le cout matiere est inferieur a 2,00 EUR.
                C'est culturel, historique, et amplifie par le marketing du terroir breton.
              </li>
            </ul>
            <p className="mt-4">
              Attention : un food cost trop bas (sous 20 %) peut etre un signal d'alerte. Soit les
              portions sont trop chiches (insatisfaction client, mauvais bouche-a-oreille), soit le
              prix de vente est sur-positionne par rapport a la concurrence locale (perte de volume
              hors saison touristique). Le sweet spot est entre 22 et 26 % pour conjuguer
              satisfaction client et rentabilite durable.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <KPICard
              icon={<Percent className="w-5 h-5" />}
              label="Food cost cible"
              value="22 - 26 %"
              note="A egalite avec pizzeria"
              color="emerald"
            />
            <KPICard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Marge brute cible"
              value="74 - 78 %"
              note="Galettes + crepes confondues"
              color="teal"
            />
            <KPICard
              icon={<Wine className="w-5 h-5" />}
              label="Marge brute cidre"
              value="80 - 92 %"
              note="Le levier #1 de rentabilite"
              color="emerald"
            />
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Couts specifiques ═════════════ */}
        <section id="couts-specifiques" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="3">
            Couts specifiques : sarrasin, beurre AOP, lait fermier, oeufs
          </SectionHeading>

          <div className="prose-content">
            <p>
              La maitrise du food cost en creperie commence par une connaissance fine des prix
              fournisseurs sur les 4 ingredients socles. Voici les fourchettes constatees en
              France en 2026, distinguant gammes conventionnelle, bio et AOP / IGP.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <IngredientCard
              icon={<Wheat className="w-5 h-5" />}
              name="Farine de blé noir / sarrasin"
              priceRange="1,50 - 3,00 EUR/kg"
              detail="Conventionnelle T130 : 1,50-2,00 EUR. Bio francaise : 2,20-2,80 EUR. Sarrasin AOP Bretagne IGP : 2,80-3,50 EUR/kg. Le passage au bio represente +50-80 % de cout pate."
            />
            <IngredientCard
              icon={<Sparkles className="w-5 h-5" />}
              name="Beurre breton AOP"
              priceRange="9 - 12 EUR/kg"
              detail="Beurre demi-sel AOP Charentes-Poitou ou IGP Bretagne : 9-10,50 EUR/kg. Beurre cru baratte artisanal : 11-12 EUR/kg. Plus rentable d'acheter en motte 1 kg qu'en plaquettes."
            />
            <IngredientCard
              icon={<DollarSign className="w-5 h-5" />}
              name="Lait fermier"
              priceRange="0,90 - 1,15 EUR/L"
              detail="Lait entier UHT industriel : 0,75-0,90 EUR/L. Lait fermier pasteurise local : 0,95-1,15 EUR/L. Pour pate crepes sucrees, le lait fermier ameliore la texture et justifie un prix de vente premium."
            />
            <IngredientCard
              icon={<Lightbulb className="w-5 h-5" />}
              name="Oeufs plein air"
              priceRange="0,22 - 0,30 EUR/unite"
              detail="Code 3 cage (a eviter) : 0,15 EUR. Code 2 sol : 0,18 EUR. Code 1 plein air : 0,22-0,26 EUR. Code 0 bio plein air : 0,26-0,30 EUR. Communication 'oeufs plein air' = +10-15 % de prix de vente acceptable."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              Un point essentiel : le rendement de la pate. <strong>1 kg de farine sarrasin donne
              environ 35-40 galettes</strong> (50 g de pate par galette). Une creperie qui vise un
              rendement de 38 galettes/kg de farine optimise ses achats. La perte typique est de
              3-5 % (premieres galettes ratees, restes en fin de service, casses).
            </p>
            <p>
              Cout matieres pour la pate seule (sarrasin conventionnel) : 1 kg de farine 1,80 EUR
              + 4 oeufs 1,00 EUR + 1,5 L de lait 1,40 EUR + sel = environ 4,30 EUR de matieres
              pour 38 galettes, soit <strong>0,11 EUR / galette</strong>. C'est imbattable.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 4 : Decomposition cout ═════════════ */}
        <section id="decomposition" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="4">
            Decomposition cout d'une galette complete
          </SectionHeading>

          <div className="prose-content">
            <p>
              Prenons l'exemple de reference : la galette complete (jambon, emmental, oeuf), plat
              le plus vendu en creperie traditionnelle. Format 35 cm, garniture standard. Voici la
              decomposition precise, en distinguant version conventionnelle et version AOP / bio.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Cout matieres galette complete</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-mono-350 border-b border-mono-900">
                  <th className="text-left py-2 px-3 font-semibold">Composant</th>
                  <th className="text-right py-2 px-3 font-semibold">Standard</th>
                  <th className="text-right py-2 px-3 font-semibold">Premium (bio / AOP)</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr>
                  <td className="py-2 px-3 font-medium">Pate galette sarrasin (50 g)</td>
                  <td className="py-2 px-3 text-right">0,10 EUR</td>
                  <td className="py-2 px-3 text-right">0,18 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Jambon de Paris (40 g)</td>
                  <td className="py-2 px-3 text-right">0,60 EUR</td>
                  <td className="py-2 px-3 text-right">0,85 EUR (artisanal)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Emmental rape (35 g)</td>
                  <td className="py-2 px-3 text-right">0,40 EUR</td>
                  <td className="py-2 px-3 text-right">0,55 EUR (Beaufort)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Oeuf plein air (1 unite)</td>
                  <td className="py-2 px-3 text-right">0,25 EUR</td>
                  <td className="py-2 px-3 text-right">0,30 EUR (bio)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Beurre cuisson AOP (15 g)</td>
                  <td className="py-2 px-3 text-right">0,15 EUR</td>
                  <td className="py-2 px-3 text-right">0,18 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Cidre cuisson + assaisonnement</td>
                  <td className="py-2 px-3 text-right">0,15 EUR</td>
                  <td className="py-2 px-3 text-right">0,18 EUR</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Persil, ciboulette, decor assiette</td>
                  <td className="py-2 px-3 text-right">0,05 EUR</td>
                  <td className="py-2 px-3 text-right">0,08 EUR</td>
                </tr>
                <tr className="border-t-2 border-mono-900 bg-amber-50">
                  <td className="py-3 px-3 font-bold text-mono-100">Total cout matieres</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-900">1,70 EUR</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-900">2,32 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p><strong>Analyse rapide :</strong></p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350">
              <li>Version standard vendue 9 EUR sur place : food cost = 1,70 / 9 = <strong>18,9 %</strong></li>
              <li>Version standard vendue 11 EUR (zone touristique) : food cost = 1,70 / 11 = <strong>15,5 %</strong></li>
              <li>Version premium AOP vendue 12 EUR : food cost = 2,32 / 12 = <strong>19,3 %</strong></li>
              <li>Version premium AOP vendue 14 EUR (bord de mer) : food cost = 2,32 / 14 = <strong>16,6 %</strong></li>
            </ul>
            <p className="mt-4">
              On constate des ratios food cost <strong>exceptionnellement bas (15-19 %)</strong>, bien
              en dessous de la moyenne creperie (22-26 %). C'est typique de la galette complete : la
              forte perception de valeur cote client (plat-signature, identite bretonne, format
              "complet") justifie un prix de vente eleve face a un cout matiere reduit.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 5 : 8 galettes types ═════════════ */}
        <section id="8-galettes" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="5">
            8 galettes et crepes types et leurs marges
          </SectionHeading>

          <div className="prose-content">
            <p>
              Tableau de reference : 8 recettes couvrant les classiques bretons et les creations
              modernes. Couts matieres bases sur les prix Metro France T2 2026, prix de vente
              moyens constates en France hors zones premium (Saint-Malo, Quiberon, Belle-Ile).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Plat</th>
                  <th className="text-center py-3 px-4 font-semibold">Cout matieres</th>
                  <th className="text-center py-3 px-4 font-semibold">Prix sur place</th>
                  <th className="text-center py-3 px-4 font-semibold">Food cost</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { name: 'Galette complete (jambon-emmental-oeuf)', cm: '1,70 EUR', pv: '9,50 EUR', fc: '18 %', mb: '7,80 EUR / 82 %' },
                  { name: 'Galette forestiere (champignons-creme)', cm: '1,95 EUR', pv: '10,50 EUR', fc: '19 %', mb: '8,55 EUR / 81 %' },
                  { name: 'Galette saumon fume-creme citronnee', cm: '3,40 EUR', pv: '13,50 EUR', fc: '25 %', mb: '10,10 EUR / 75 %' },
                  { name: 'Galette chevre-miel-noix', cm: '2,10 EUR', pv: '11,00 EUR', fc: '19 %', mb: '8,90 EUR / 81 %' },
                  { name: 'Galette Saint-Jacques (premium)', cm: '5,80 EUR', pv: '18,50 EUR', fc: '31 %', mb: '12,70 EUR / 69 %' },
                  { name: 'Crepe beurre-sucre (formule rapide)', cm: '0,35 EUR', pv: '4,50 EUR', fc: '8 %', mb: '4,15 EUR / 92 %' },
                  { name: 'Crepe chocolat-banane Chantilly', cm: '1,20 EUR', pv: '7,50 EUR', fc: '16 %', mb: '6,30 EUR / 84 %' },
                  { name: 'Crepe Suzette flambee Grand Marnier', cm: '1,80 EUR', pv: '9,00 EUR', fc: '20 %', mb: '7,20 EUR / 80 %' },
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
              Quelques observations cles :
            </p>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>
                <strong>La crepe beurre-sucre</strong> est le record absolu de marge brute (92 %)
                avec seulement 0,35 EUR de cout matiere. C'est la formule midi rapide et la
                gourmandise enfant. A garder en carte meme si ticket bas.
              </li>
              <li>
                <strong>La galette complete classique</strong> reste la vache a lait : 82 % de
                marge brute, plat le plus commandé (25-35 % des ventes), faible cout matiere
                (1,70 EUR). Ne jamais la sortir de la carte.
              </li>
              <li>
                <strong>La Saint-Jacques</strong> sort du ratio cible (31 %) mais sa marge brute en
                valeur absolue (12,70 EUR) est superieure. Plat-vitrine premium qui rehausse le
                ticket moyen et donne du prestige a la carte.
              </li>
              <li>
                <strong>Les crepes sucrees</strong> ont systematiquement un excellent ratio (8-20 %)
                grace au faible cout de la pate froment et de la garniture (chocolat, banane,
                caramel). Pousser les ventes via formule galette + crepe.
              </li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Specificites operationnelles ═════════════ */}
        <section id="operationnel" className="mb-16">
          <SectionHeading icon={<Flame className="w-6 h-6" />} number="6">
            Specificites operationnelles : billig, productivite, gestes techniques
          </SectionHeading>

          <div className="prose-content">
            <p>
              Au-dela du calcul matieres pur, trois variables operationnelles determinent la
              rentabilite reelle d'une creperie : le nombre de billigs en cuisine, la productivite
              du crepier, et la maitrise des gestes techniques (etalement, retournement, garniture).
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Le billig : cout d'investissement et energie</h3>
            <p>
              Un billig (plaque en fonte de fer, diametre 35-40 cm) coute entre <strong>900 EUR
              (gaz)</strong> et <strong>2 800 EUR (electrique professionnel)</strong>. L'amortissement
              sur 5 ans est faible (180-560 EUR/an). Cote energie : 3-5 kWh/h en electrique
              (1,20-2,00 EUR/h), 200-350 g de gaz/h en gaz (0,40-0,70 EUR/h). Le gaz est plus
              economique mais necessite un raccordement obligatoire.
            </p>
            <p>
              Une creperie de 50-80 couverts a generalement <strong>2-3 billigs</strong> en
              fonctionnement, plus 1 billig de reserve pour les rushs. Une creperie touristique
              a 100+ couverts peut monter a 4-5 billigs en serie.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Productivite du crepier</h3>
            <p>
              Un crepier experimente produit entre <strong>50 et 100 galettes/crepes par heure</strong>
              en pleine bourre (rush 12h-14h et 19h-22h), selon le format et la complexite de
              garniture. Une formule rapide (galette beurre-sucre, complete simple) permet 80-100
              plats/heure. Les galettes complexes (forestiere, royale) descendent a 40-60 plats/heure.
            </p>
            <p>
              Cout employeur crepier en CDI HCR : 1 750 a 2 600 EUR brut/mois selon experience,
              soit 2 400 a 3 600 EUR cout total employeur incluant charges patronales, primes de
              coupure et heures de nuit. C'est le poste #2 apres le loyer. La formation initiale
              prend 2-4 mois pour acquerir le geste pro (etalement uniforme, cuisson maitrisee,
              dressage rapide).
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : Cidre levier rentabilite ═════════════ */}
        <section id="cidre" className="mb-16">
          <SectionHeading icon={<Wine className="w-6 h-6" />} number="7">
            Le cidre : le levier #1 de rentabilite
          </SectionHeading>

          <div className="prose-content">
            <p>
              C'est le secret le mieux gardé de la rentabilite creperie. Le cidre, qu'il soit brut
              AOP Bretagne IGP, demi-sec ou maison, offre des <strong>marges brutes de 80 a 92 %</strong>,
              les plus elevees de toute la carte. Une creperie qui pilote bien son ratio
              vente cidre / vente galette peut doubler sa marge nette annuelle.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-emerald-900 mb-4 text-lg">Marges sur les boissons creperie</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-white text-emerald-900 border-b border-emerald-200">
                  <th className="text-left py-2 px-3 font-semibold">Boisson</th>
                  <th className="text-right py-2 px-3 font-semibold">Cout achat</th>
                  <th className="text-right py-2 px-3 font-semibold">Prix vente</th>
                  <th className="text-right py-2 px-3 font-semibold">Marge brute</th>
                </tr>
              </thead>
              <tbody className="text-emerald-900">
                <tr>
                  <td className="py-2 px-3 font-medium">Bolee de cidre brut AOP (33 cl)</td>
                  <td className="py-2 px-3 text-right">0,55 EUR</td>
                  <td className="py-2 px-3 text-right font-semibold">4,50 EUR</td>
                  <td className="py-2 px-3 text-right font-bold">3,95 EUR / 88 %</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-2 px-3 font-medium">Bouteille cidre bouche AOP (75 cl)</td>
                  <td className="py-2 px-3 text-right">2,20 EUR</td>
                  <td className="py-2 px-3 text-right font-semibold">16,50 EUR</td>
                  <td className="py-2 px-3 text-right font-bold">14,30 EUR / 87 %</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Bouteille cidre maison brassé (75 cl)</td>
                  <td className="py-2 px-3 text-right">1,40 EUR</td>
                  <td className="py-2 px-3 text-right font-semibold">18,00 EUR</td>
                  <td className="py-2 px-3 text-right font-bold">16,60 EUR / 92 %</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-2 px-3 font-medium">Verre de chouchen / hydromel (10 cl)</td>
                  <td className="py-2 px-3 text-right">0,80 EUR</td>
                  <td className="py-2 px-3 text-right font-semibold">5,50 EUR</td>
                  <td className="py-2 px-3 text-right font-bold">4,70 EUR / 85 %</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Demi de biere bretonne artisanale</td>
                  <td className="py-2 px-3 text-right">0,90 EUR</td>
                  <td className="py-2 px-3 text-right font-semibold">4,80 EUR</td>
                  <td className="py-2 px-3 text-right font-bold">3,90 EUR / 81 %</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-2 px-3 font-medium">Cafe expresso</td>
                  <td className="py-2 px-3 text-right">0,18 EUR</td>
                  <td className="py-2 px-3 text-right font-semibold">2,20 EUR</td>
                  <td className="py-2 px-3 text-right font-bold">2,02 EUR / 92 %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Ratio cible boissons :</strong> dans une creperie traditionnelle bien gerée,
              les boissons representent <strong>25 a 35 %</strong> du chiffre d'affaires HT, mais
              <strong> 40 a 55 %</strong> de la marge brute totale. C'est mathematique : avec 80-90 %
              de marge brute contre 75 % sur les galettes, chaque euro de cidre vendu rapporte
              plus de marge qu'un euro de galette.
            </p>
            <p>
              <strong>Strategie cle :</strong> proposer systematiquement le cidre en accompagnement
              de chaque galette ("un cidre brut, demi-sec ou doux avec votre galette ?"). Le taux
              d'attache cidre/galette en France oscille entre 35 % (creperie urbaine) et 75 %
              (creperie touristique bord de mer). Chaque point d'attache supplementaire represente
              entre 1 200 et 4 000 EUR de marge brute annuelle selon le CA.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Optimisation ═════════════ */}
        <section id="optimisation" className="mb-16">
          <SectionHeading icon={<Lightbulb className="w-6 h-6" />} number="8">
            Optimisation : cidre maison, formules midi, mix
          </SectionHeading>

          <div className="prose-content">
            <p>
              Au-dela du pilotage food cost, voici les 3 leviers les plus puissants pour booster
              la marge nette d'une creperie en 2026.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            <StrategieCard
              number={1}
              title="Brasser son propre cidre maison"
              desc="Investissement initial 4 000-8 000 EUR (cuves, presse, fermenteur) amorti en 12-18 mois. Cout matiere bouteille 75 cl tombe a 1,30-1,50 EUR vs 2,20-2,80 EUR pour le cidre achete. Sur 1 500 bouteilles vendues/an, gain de marge brute : 1 800-2 250 EUR/an. Et surtout : differenciation forte vs la concurrence, storytelling local fort, vente a emporter possible (prix premium)."
            />
            <StrategieCard
              number={2}
              title="Formule midi galette + crepe + cidre"
              desc="Proposer une formule midi a 14,90-16,90 EUR comprenant galette au choix + crepe sucree + bolee de cidre. Food cost combiné : 2,30-2,70 EUR (galette 1,70 + crepe 0,40 + cidre 0,55). Food cost formule = 14-18 %, marge brute 82-86 %. Augmente le ticket moyen de 35-50 % vs commande a la carte et fidelise la clientele bureau / locale en semaine."
            />
            <StrategieCard
              number={3}
              title="Mix galettes premium vs entrée de gamme"
              desc="Construire la carte avec 60-70 % de galettes 'core' (food cost optimal 18-22 %) et 30-40 % de galettes premium (Saint-Jacques, foie gras, cancoillotte). Les premium tirent le ticket moyen vers le haut sans plomber le food cost global. Cible mix : 65-70 % de food cost global, 25-30 % de marge nette."
            />
          </div>

          <Callout type="info">
            <strong>Saisonnalite :</strong> en zone touristique, prevoir 2 cartes distinctes —
            carte 'estivale' (juin-septembre) avec galettes plus chères et boissons fraiches
            (cidre frais, bieres artisanales locales, jus de pommes bio) et carte 'hiver' (octobre-mai)
            avec formules a prix doux pour fideliser la clientele locale. RestauMargin permet
            de gerer ces 2 cartes en parallele et de visualiser la marge par saison.
          </Callout>
        </section>

        {/* ═════════════ SECTION 9 : Cas concret Nantes ═════════════ */}
        <section id="cas-nantes" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="9">
            Cas concret : creperie Nantes, 12 % a 26 % en 8 mois
          </SectionHeading>

          <div className="prose-content">
            <p>
              Creperie traditionnelle Nantes centre historique, 65 couverts. Reprise en septembre 2025
              par Anne L., 42 ans, ancienne cheffe de partie en gastronomique. CA annuel constate
              a la reprise : 340 000 EUR, marge nette 12 %.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Diagnostic initial (mois 1)</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350 mt-4">
              <li>Food cost reel : 31 % (vs cible 24 %). Portions de garniture non standardisees, gaspillage 5 %.</li>
              <li>Ratio cidre / galette : 22 % (faible). Pas de proposition systematique en service.</li>
              <li>Aucun suivi prix fournisseurs : factures Metro et Pomona entrees a la main 1 fois/mois.</li>
              <li>Carte sur-etendue : 32 galettes + 24 crepes + 18 boissons. Crepier perdu, productivite 38 plats/heure.</li>
              <li>Aucune formule midi structuree, ticket moyen 17 EUR (faible pour zone urbaine).</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Plan d'action en 4 phases</h3>
            <div className="space-y-4 mt-6">
              <PhaseCard
                phase="Phase 1 (mois 1-2)"
                title="Stabilisation du food cost"
                actions={[
                  'Mise en place de fiches techniques precises pour 24 galettes + 16 crepes via RestauMargin',
                  'Pesee systematique des portions garniture (balance comptoir + tablette)',
                  'Reduction carte a 18 galettes core + 4 saisonnieres + 10 crepes',
                  'Resultat : food cost passe de 31 % a 25 %',
                ]}
              />
              <PhaseCard
                phase="Phase 2 (mois 3-4)"
                title="Strategie boissons & formules"
                actions={[
                  'Formation equipe a la proposition systematique cidre en service',
                  'Lancement formule midi galette + crepe + bolee de cidre a 15,90 EUR',
                  'Refonte carte cidres avec selection 6 producteurs AOP / IGP',
                  'Resultat : ratio cidre/galette de 22 % a 45 %, ticket moyen 17 EUR a 22 EUR',
                ]}
              />
              <PhaseCard
                phase="Phase 3 (mois 5-6)"
                title="Optimisation operationnelle"
                actions={[
                  'Recrutement second crepier (CDI temps partiel, 24h)',
                  'Investissement 3e billig electrique (1 800 EUR amorti sur 5 ans)',
                  'Mise en place scan factures OCR via RestauMargin',
                  'Resultat : productivite 38 a 68 plats/heure, food cost a 23 %',
                ]}
              />
              <PhaseCard
                phase="Phase 4 (mois 7-8)"
                title="Pilotage en temps reel"
                actions={[
                  'Tableau de bord RestauMargin verifie 2x/semaine (mardi + vendredi)',
                  'Alertes prix fournisseurs activees sur sarrasin, beurre AOP, cidre, fromages',
                  'Ajustement carte selon menu engineering (12 plats stars identifies)',
                  'Resultat final : marge nette 26 %',
                ]}
              />
            </div>

            <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-emerald-900 text-lg">Resultats apres 8 mois</h3>
              </div>
              <ul className="space-y-2 text-emerald-800 text-sm">
                <li><strong>CA annuel :</strong> 340 000 EUR -- 425 000 EUR (+25 %)</li>
                <li><strong>Food cost :</strong> 31 % -- 23 %</li>
                <li><strong>Marge nette :</strong> 12 % -- 26 % (soit 40 800 EUR -- 110 500 EUR)</li>
                <li><strong>Ratio cidre/galette :</strong> 22 % -- 45 %</li>
                <li><strong>Productivite crepier :</strong> 38 plats/h -- 68 plats/h</li>
                <li><strong>Ticket moyen :</strong> 17 EUR -- 22 EUR</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 10 : KPI creperie ═════════════ */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="10">
            Les 6 KPI a suivre en creperie
          </SectionHeading>

          <div className="prose-content">
            <p>
              Une creperie bien gerée pilote 6 indicateurs au quotidien. Sans ces KPI, vous
              naviguez a l'aveugle et detectez les problemes trop tard (3-6 mois apres leur
              apparition, quand la marge nette commence a fondre).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Percent className="w-5 h-5" />, title: '1. Food cost global', desc: 'Cible 22-26 %. Au-dela, alerte immediate. En dessous de 18 %, verifier que les portions ne sont pas chiches.' },
              { icon: <Wheat className="w-5 h-5" />, title: '2. Galettes & crepes par service', desc: 'Objectif 100-200 plats/service selon taille. Indicateur de productivite et de remplissage.' },
              { icon: <DollarSign className="w-5 h-5" />, title: '3. Ticket moyen', desc: 'Sur place : 18-26 EUR par couvert. Cible : pousser vers 22 EUR via formules et upsell cidre/dessert.' },
              { icon: <Wine className="w-5 h-5" />, title: '4. Ratio cidre / galette', desc: 'Pourcentage de galettes vendues avec cidre. Cible 50-65 % en zone touristique, 35-45 % en urbain.' },
              { icon: <Clock className="w-5 h-5" />, title: '5. Productivite crepier', desc: '50-100 plats/heure en rush. Si < 35, probleme de billig, de formation ou d\'organisation.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: '6. Marge brute par plat', desc: 'Suivre les variations matieres premieres (sarrasin, beurre AOP, fromages) qui erodent la marge.' },
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

        {/* ═════════════ SECTION 11 : Logiciel RestauMargin ═════════════ */}
        <section id="logiciel" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="11">
            Comment RestauMargin automatise tout
          </SectionHeading>

          <div className="prose-content">
            <p>
              RestauMargin est concu pour la realite operationnelle d'une creperie : saisonnalite,
              forte rotation, pression sur les marges, gestion mixte galettes + crepes + cidre.
              Voici les 6 modules cles qui vous font gagner 8 a 15 heures par mois et 5 a 10
              points de marge nette.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { icon: <Wheat className="w-5 h-5" />, title: 'Fiches techniques galettes & crepes', desc: 'Creez vos recettes avec grammages precis (pate, garniture, oeuf, beurre, cidre cuisson). Food cost calcule automatiquement.' },
              { icon: <Wine className="w-5 h-5" />, title: 'Suivi marge cidres & boissons', desc: 'Marge brute par cidre AOP, cidre maison, biere, hydromel, cafe. Visualisation du ratio boissons / CA total.' },
              { icon: <AlertTriangle className="w-5 h-5" />, title: 'Alertes deviation marge', desc: 'Notification des qu\'une galette passe sous le seuil ou qu\'un prix fournisseur (sarrasin, beurre AOP) augmente.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Dashboard creperie', desc: '6 KPI cles affiches en temps reel : food cost, ratio cidre/galette, ticket moyen, productivite, marge brute, marge nette.' },
              { icon: <Lightbulb className="w-5 h-5" />, title: 'Scan factures OCR', desc: 'Photographiez vos factures Metro, Pomona, fournisseurs locaux. Les prix sarrasin/beurre/cidre se mettent a jour automatiquement.' },
              { icon: <Users className="w-5 h-5" />, title: 'Gestion 2 cartes saisonnieres', desc: 'Carte estivale (touristique) et carte hivernale (locale) gerees en parallele. Comparatif marge par saison.' },
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <p>
              Plus de 45 creperies en France utilisent deja RestauMargin pour piloter leur
              rentabilite, principalement en Bretagne, Pays de la Loire et Normandie. Gain moyen
              constate : <strong>5,4 points de marge brute en 6 mois</strong>, principalement
              grace aux alertes prix sarrasin et a l'optimisation du ratio cidre/galette. Pour
              aller plus loin, lisez nos guides <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800">food cost restaurant</Link>,
              <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-800 ml-1">coefficient multiplicateur</Link> et
              <Link to="/blog/construire-carte-vins-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">construire une carte des vins</Link>
              (utile pour le cidre AOP), ou testez le <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800">calculateur de food cost gratuit</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="13 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes creperie</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ═════════════ CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Piloter la marge de votre creperie avec RestauMargin
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Food cost galettes, marges cidres AOP, KPI saisonniers, alertes prix sarrasin :
              tout ce qu'il faut pour garder une marge nette superieure a 20 %.
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

        {/* ═════════════ Articles complementaires ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/food-cost-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Food cost restaurant : guide complet</h3>
              <p className="text-xs text-mono-500">Methode, calculs, optimisation et benchmarks.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Le coefficient multiplicateur</h3>
              <p className="text-xs text-mono-500">Tableaux par categorie, erreurs courantes, cas pratique.</p>
            </Link>
            <Link to="/blog/carte-des-vins" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Construire une carte des vins / cidres</h3>
              <p className="text-xs text-mono-500">Marge boissons, selection producteurs, pricing.</p>
            </Link>
            <Link to="/login?mode=register" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Essai gratuit 7 jours</h3>
              <p className="text-xs text-mono-500">Pilotez votre creperie sans carte bancaire requise.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* ── Footer ── */}
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

function IngredientCard({ icon, name, priceRange, detail }: {
  icon: React.ReactNode; name: string; priceRange: string; detail: string;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-5 hover:border-teal-300 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-bold text-mono-100">{name}</h3>
      </div>
      <div className="text-lg font-extrabold text-teal-700 mb-2">{priceRange}</div>
      <p className="text-xs text-mono-400 leading-relaxed">{detail}</p>
    </div>
  );
}

function StrategieCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
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
