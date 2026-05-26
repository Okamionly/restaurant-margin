import { Link } from 'react-router-dom';
import {
  ChefHat,
  Calculator,
  ArrowRight,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Percent,
  DollarSign,
  Target,
  Award,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   MEGA-FAQ Marge Restaurant 2026 — 25 questions essentielles
   Cible : People Also Ask Google sur "marge restaurant"
   Structure : 25 H2 avec question exacte + reponse featured snippet
   Schema FAQPage massif + Article + BreadcrumbList
   ~4500 mots
   ═══════════════════════════════════════════════════════════════ */

const faq = [
  {
    question: 'Quel est le taux de marge pour un restaurant ?',
    answer:
      "Le taux de marge brute moyen d'un restaurant en France oscille entre 70 % et 75 % sur les solides (plats) et environ 85 % sur les liquides (boissons et vins). La marge nette, apres deduction de toutes les charges, se situe entre 5 % et 15 % selon le type d'etablissement et le format. Un restaurant traditionnel cible 8 a 10 % de marge nette, tandis qu'une restauration rapide peut atteindre 20 a 25 %.",
    extra:
      "Concretement, sur un menu vendu 25 EUR HT, vous payez environ 7,50 EUR de matieres premieres (food cost 30 %), conservez 17,50 EUR de marge brute, puis deduisez personnel (~9 EUR), loyer (~2,50 EUR), energie (~1,25 EUR), assurances et taxes (~2,75 EUR), pour finir avec 2 EUR de marge nette dans la poche. C'est pour cela que le pilotage du food cost et de la masse salariale est si critique.",
  },
  {
    question: 'Quelle est la marge moyenne pour la restauration ?',
    answer:
      "La marge brute moyenne en restauration en France est de 70 % sur le solide et 85 % sur le liquide, donnant une marge brute consolidee autour de 73-75 % du chiffre d'affaires HT. La marge nette, elle, tourne autour de 8 a 10 % en moyenne nationale, avec de fortes variations selon le segment (3-5 % pour le gastronomique, 12-18 % pour la pizzeria).",
    extra:
      "L'INSEE et la GIRA Conseil publient chaque annee des panels de restaurants : les meilleurs 25 % atteignent 12-15 % de marge nette, la mediane est entre 6 et 8 %, et le quartile bas tombe sous 3 %. La difference se joue sur le food cost, le ratio personnel et le taux d'occupation des tables.",
  },
  {
    question: 'Quel est le bon ratio pour un restaurant ?',
    answer:
      "Le bon ratio en restauration suit le prime cost : matieres premieres + masse salariale doivent rester sous 65 % du chiffre d'affaires HT. Concretement, un food cost a 30 % et un cout personnel a 32 % donnent un prime cost de 62 %, ce qui laisse 38 % pour couvrir loyer, energie, charges fixes et marge nette.",
    extra:
      "Au-dela de 70 % de prime cost, l'etablissement devient structurellement non rentable. Les ratios secondaires a surveiller : loyer < 10 % du CA, energie < 5 %, marketing < 3 %, et marge nette > 8 %. Tout depassement de 2-3 points sur un poste se traduit immediatement par une marge nette qui chute.",
  },
  {
    question: 'Quelle est la marge minimum idéale conseillée ?',
    answer:
      "La marge nette minimum conseillee pour assurer la perennite d'un restaurant est de 5 % du chiffre d'affaires HT. En dessous, vous n'avez plus de coussin pour absorber une hausse de matieres premieres, une panne d'equipement ou une saison creuse. L'objectif sain se situe entre 8 % et 12 %, et l'excellence au-dela de 15 %.",
    extra:
      "Pour un restaurant qui realise 500 000 EUR de CA annuel, 5 % de marge nette represente 25 000 EUR. C'est le minimum vital pour remunerer l'exploitant, financer les renouvellements d'equipement et constituer une reserve de tresorerie. Viser 10 % (50 000 EUR) permet de developper l'enseigne ou de retribuer correctement le risque.",
  },
  {
    question: 'Un restaurant est-il rentable ?',
    answer:
      "Oui, un restaurant peut etre tres rentable : la moyenne nationale francaise tourne autour de 8 a 10 % de marge nette, et les meilleurs etablissements depassent 15 %. Cependant, 30 % des restaurants ferment dans les trois premieres annees selon l'INSEE, principalement a cause d'une mauvaise maitrise du food cost, d'un emplacement inadequat ou d'un sous-capitalisation initiale.",
    extra:
      "La rentabilite depend de quatre leviers : (1) un food cost maitrise sous 32 %, (2) un ratio personnel sous 35 %, (3) un loyer raisonnable sous 10 % du CA, (4) un volume suffisant (taux d'occupation > 60 % au service du midi). Avec ces quatre conditions reunies, la marge nette structurelle depasse 10 %.",
  },
  {
    question: 'Quelle est la marge bénéficiaire idéale pour un restaurant ?',
    answer:
      "La marge beneficiaire ideale pour un restaurant se situe entre 10 % et 15 % de marge nette sur le chiffre d'affaires HT. C'est le niveau qui permet de remunerer l'exploitant, d'investir dans l'enseigne et de constituer une tresorerie de securite equivalente a 3 mois de charges fixes.",
    extra:
      "Une marge nette de 10 % sur 600 000 EUR de CA = 60 000 EUR. Sur ce montant, comptez environ 20 000 EUR pour l'impot societes, 20 000 EUR pour la remuneration dirigeant complementaire, et 20 000 EUR pour investissement et reserve. Au-dela de 15 %, vous etes dans le top 10 % du secteur ; en dessous de 5 %, vous etes structurellement fragile.",
  },
  {
    question: 'Quel est le bon taux de marge ?',
    answer:
      "Le bon taux de marge brute pour un restaurant se situe entre 65 % et 75 % du chiffre d'affaires HT, correspondant a un food cost entre 25 % et 35 %. Cette fourchette s'applique a la restauration traditionnelle ; les pizzerias visent 75-85 %, les coffee shops 78-88 %, le gastronomique 60-70 %.",
    extra:
      "Plus important que le taux de marge brute, le taux de marge nette doit etre superieur a 8 %. Un restaurant peut afficher 75 % de marge brute mais ne degager que 2 % de marge nette si ses charges de personnel et son loyer sont demesures. Toujours raisonner en couple marge brute + marge nette.",
  },
  {
    question: "Quel est le bénéfice net moyen d'un restaurant ?",
    answer:
      "Le benefice net moyen d'un restaurant traditionnel francais est de 30 000 a 60 000 EUR par an pour un chiffre d'affaires de 400 000 a 700 000 EUR, soit 7 a 9 % de marge nette. Pour un independant, ce benefice constitue souvent la remuneration du dirigeant, qui s'ajoute a son salaire de base.",
    extra:
      "Pour une chaine ou un groupe de 5 restaurants generant chacun 800 000 EUR de CA, le benefice net consolide peut atteindre 400 000 a 600 000 EUR. Les marges franchisees sont generalement plus faibles (5-7 %) du fait des redevances, mais le volume compense.",
  },
  {
    question: 'Quel secteur fait le plus de marge ?',
    answer:
      "Dans la restauration, les secteurs les plus marges sont la pizzeria (12-18 % de marge nette), le coffee shop (10-16 %), et le fast-food (8-15 %). Ces formats beneficient d'un food cost bas (15-25 %), d'une masse salariale comprimee et d'un volume eleve grace au ticket court et a la rotation rapide des couverts.",
    extra:
      "A l'oppose, le restaurant gastronomique etoile affiche typiquement 3 a 8 % de marge nette malgre des prix eleves, en raison du food cost premium (35-40 %), de la masse salariale lourde (40-50 % du CA) et des charges fixes elevees. Le bistrot traditionnel se situe entre les deux, autour de 6-10 % de marge nette.",
  },
  {
    question: 'Qu\'est-ce que la règle des 30/30/30/10 pour les restaurants ?',
    answer:
      "La regle 30/30/30/10 est un cadre de repartition budgetaire ideal pour un restaurant : 30 % du chiffre d'affaires pour le cout matieres (food cost), 30 % pour la masse salariale, 30 % pour les autres charges (loyer, energie, marketing, assurances, amortissements), et 10 % de marge nette pour le proprietaire. Cette regle est un point de reference universel.",
    extra:
      "Cette regle varie selon le segment : un restaurant gastronomique tend vers 35/40/22/3, une pizzeria vers 22/22/41/15, un fast-food vers 28/24/35/13. La regle 30/30/30/10 fonctionne comme une cible : si l'un des trois 30 deborde, un autre poste doit etre comprime ou les 10 % de marge disparaissent.",
  },
  {
    question: 'Quels sont les 5 ratios clés ?',
    answer:
      "Les 5 ratios cles a piloter en restaurant sont : (1) Food cost (25-35 %), (2) Cout personnel (28-40 %), (3) Prime cost (matieres + personnel, < 65 %), (4) Loyer / CA (< 10 %), (5) Marge nette (> 8 %). Ces cinq indicateurs forment le tableau de bord minimum de tout restaurateur professionnel.",
    extra:
      "On ajoute souvent : ticket moyen, taux d'occupation, productivite par couvert (CA / nombre de couverts servis) et RevPASH (revenue per available seat hour). Ces ratios secondaires permettent d'expliquer la formation de la marge et d'identifier les leviers d'amelioration.",
  },
  {
    question: "Quel est le chiffre d'affaires moyen d'un restaurant ?",
    answer:
      "Le chiffre d'affaires moyen d'un restaurant independant en France en 2026 est d'environ 500 000 EUR HT par an, avec une mediane plus basse autour de 380 000 EUR. Un bistrot urbain genere typiquement 400 000 a 700 000 EUR, une brasserie 700 000 a 1,5 million EUR, et un restaurant gastronomique etoile 1 a 3 millions EUR.",
    extra:
      "Pour atteindre 500 000 EUR de CA annuel, comptez environ 80 couverts par jour a 17 EUR de ticket moyen sur 300 jours d'ouverture. Une pizzeria de quartier qui sert 120 couverts a 12 EUR de ticket atteint le meme volume avec une marge superieure.",
  },
  {
    question: "Quelle est la marge moyenne d'un restaurant ?",
    answer:
      "La marge moyenne d'un restaurant en France est de 70-75 % de marge brute et 8-10 % de marge nette. Ces moyennes masquent de fortes disparites : un quartile bas a 3-5 % de marge nette, la mediane vers 7 %, et un quartile haut au-dessus de 12 %. La marge moyenne sur les boissons et vins atteint 85-90 %.",
    extra:
      "Sur un panel de 1000 restaurants suivis par les organismes professionnels (UMIH, GNI, SNRC), 25 % affichent une marge nette negative en raison de loyers excessifs, de food cost mal maitrise ou de saisonnalite mal anticipee. La maitrise du calcul de marge est donc le premier levier de survie.",
  },
  {
    question: 'Quelle est la marge de gain acceptable ?',
    answer:
      "La marge de gain acceptable en restauration est une marge nette d'au moins 8 % du chiffre d'affaires HT. Ce seuil permet de remunerer l'exploitant, d'investir dans le renouvellement d'equipement et de constituer une reserve face aux aleas. Une marge inferieure a 5 % est consideree comme fragile, et inferieure a 3 % comme critique.",
    extra:
      "Pour comparaison, les autres secteurs : commerce de detail 3-5 %, hotellerie 10-15 %, e-commerce 5-10 %, agences digitales 15-25 %. La restauration est un secteur de marge faible mais de volume eleve, qui exige une discipline operationnelle constante.",
  },
  {
    question: 'Un bénéfice net de 4 % est-il bon ?',
    answer:
      "Un benefice net de 4 % est insuffisant pour un restaurant. C'est en dessous de la moyenne nationale (8-10 %) et trop faible pour absorber les aleas. Sur 500 000 EUR de CA, 4 % represente 20 000 EUR, ce qui couvre a peine la remuneration complementaire du dirigeant et ne laisse rien pour investir.",
    extra:
      "A 4 % de marge nette, une hausse de 5 % du cout matieres ou une baisse de 5 % de frequentation suffit a basculer en deficit. Le plan d'action prioritaire : auditer le food cost (souvent au-dessus de 35 %), reviser le menu engineering pour booster les plats marges, et negocier les fournisseurs. Objectif : remonter a 8-10 % en 6 mois.",
  },
  {
    question: 'Quel est le plat le plus rentable dans un restaurant ?',
    answer:
      "Les plats les plus rentables dans un restaurant sont les pates fraiches, les pizzas, les soupes, les salades composees et les desserts maison. Leur food cost se situe entre 12 % et 25 %, soit une marge brute de 75 % a 88 %. Ces plats utilisent des ingredients peu chers (farine, oeufs, legumes, sucre) transformes en valeur par la creation culinaire.",
    extra:
      "A l'inverse, les viandes nobles (entrecote, magret, agneau) et les poissons (bar, dorade, saint-jacques) affichent un food cost de 35-45 %. Le menu engineering consiste a equilibrer la carte avec des plats stars (forte marge ET forte popularite, ex: lasagnes maison), des chevaux de labour (popularite haute marge moyenne, ex: entrecote), et a eliminer les poids morts.",
  },
  {
    question: "Pourquoi mon restaurant ne rapporte-t-il pas d'argent ?",
    answer:
      "Les 5 causes principales d'un restaurant non rentable sont : (1) un food cost au-dessus de 35 % par manque de fiches techniques, (2) un loyer superieur a 12 % du CA, (3) un sureffectif personnel (> 40 % du CA), (4) un ticket moyen trop bas par rapport aux charges fixes, (5) un taux d'occupation insuffisant (< 50 % au service du midi).",
    extra:
      "Diagnostic en 7 jours : enregistrez tous vos prix de revient et calculez votre food cost reel, comparez votre masse salariale au CA, mesurez votre ticket moyen et votre taux de remplissage par service. Si trois de ces cinq indicateurs sont dans le rouge, la marge nette est negative. Plan d'action : reduire le food cost en priorite (gain typique 3-5 points en 3 mois).",
  },
  {
    question: 'Combien gagne un propriétaire de restaurant ?',
    answer:
      "Un proprietaire de restaurant independant en France gagne typiquement entre 30 000 et 80 000 EUR brut par an, incluant salaire de base (SMIC majore ou 2500-4000 EUR/mois) et benefice net distribue. Pour un restaurant qui realise 500 000 EUR de CA et 10 % de marge nette, le revenu total dirigeant peut atteindre 80 000 a 100 000 EUR.",
    extra:
      "Les ecarts sont importants : un proprietaire de gastronomique etoile peut depasser 200 000 EUR par an, tandis qu'un independant en zone rurale ou non-touristique peut ne degager que 18 000 a 25 000 EUR. La cle est le volume (taux d'occupation), la marge brute (food cost maitrise) et la maitrise du cout personnel.",
  },
  {
    question: "Quel est le bénéfice brut d'un restaurant ?",
    answer:
      "Le benefice brut d'un restaurant est la difference entre le chiffre d'affaires HT et le cout des matieres premieres. Pour un restaurant standard avec 30 % de food cost, le benefice brut represente 70 % du CA HT. Sur 500 000 EUR de CA, cela donne 350 000 EUR de benefice brut.",
    extra:
      "Attention : le benefice brut n'est PAS le benefice net. Il faut encore deduire la masse salariale (~30 %), le loyer (~10 %), l'energie (~5 %), les assurances, les amortissements, les impots. Sur les 350 000 EUR de benefice brut, il restera typiquement 40 000 a 60 000 EUR de benefice net.",
  },
  {
    question: 'Comment savoir si la marge est bonne ?',
    answer:
      "Pour savoir si votre marge est bonne, comparez vos ratios aux benchmarks de votre segment : food cost entre 25 % et 35 %, prime cost (matieres + personnel) sous 65 %, loyer sous 10 % du CA, et marge nette superieure a 8 %. Si ces quatre conditions sont reunies, votre marge est saine.",
    extra:
      "Au-dela des chiffres, trois signaux qualitatifs : (1) votre tresorerie augmente chaque mois, (2) vous pouvez investir sans recourir au credit, (3) vous degagez une remuneration dirigeante decente. Si l'un de ces trois signes manque, votre marge est probablement insuffisante meme si les ratios semblent corrects.",
  },
  {
    question: 'Une marge bénéficiaire de 50 % est-elle excessive ?',
    answer:
      "Une marge beneficiaire NETTE de 50 % serait totalement irrealiste en restauration : le maximum observe sur le marche est de 18-20 % pour les formats les plus optimises (food truck, coffee shop urbain premium). En revanche, une marge BRUTE de 50 % est insuffisante car la cible standard est 70-75 %.",
    extra:
      "Ne confondez pas marge brute (sur le plat avant charges) et marge nette (sur le resultat global apres toutes les charges). Une pizza vendue 10 EUR avec 2 EUR de cout matieres a une marge brute de 80 % mais contribue a une marge nette globale de seulement 10-15 % du CA total du restaurant. Toujours raisonner en moyenne ponderee sur l'ensemble du menu.",
  },
  {
    question: 'Que signifie 50% de marge ?',
    answer:
      "Une marge de 50 % signifie que sur un produit vendu 100 EUR, vous gardez 50 EUR apres avoir paye le cout d'achat ou de production. En restauration, une marge brute de 50 % signifie que 50 % du prix de vente couvre le cout matieres (food cost de 50 %), ce qui est tres au-dessus de la norme (food cost cible 25-35 %).",
    extra:
      "Attention au sens : marge sur prix de vente (50 % de 100 EUR = 50 EUR) vs marge sur cout d'achat (multipliee par 2). En restauration, on utilise toujours la marge sur prix de vente HT pour comparer aux benchmarks. Un coefficient multiplicateur de 2 correspond a une marge brute de 50 %, ce qui est trop faible pour la plupart des formats.",
  },
  {
    question: 'Que dit Warren Buffett à propos des marges ?',
    answer:
      "Warren Buffett valorise particulierement les entreprises a forte marge nette durable, considerant qu'une marge nette superieure a 20 % indique un avantage competitif structurel (moat). Selon lui, les entreprises qui peuvent maintenir des marges elevees sur le long terme sont celles qui meritent un investissement, car elles disposent d'un pouvoir de fixation des prix.",
    extra:
      "Applique a la restauration, ce principe explique pourquoi les chaines integrees verticalement (Starbucks, McDonald's, Chipotle) atteignent des marges operationnelles de 15-22 % grace a leur pouvoir d'achat, leur supply chain optimisee et leur marque. Un restaurant independant peut s'inspirer de ces principes : marque forte, fiches techniques rigoureuses, controle absolu de la qualite.",
  },
  {
    question: "Quelle est la marge moyenne d'un commerçant ?",
    answer:
      "La marge nette moyenne d'un commercant en France varie selon le secteur : 2-4 % pour la grande distribution alimentaire, 5-10 % pour l'epicerie fine et le petit commerce alimentaire, 8-15 % pour le pret-a-porter et les biens d'equipement, 10-18 % pour les commerces specialises (bijouterie, optique, parfumerie).",
    extra:
      "La restauration (marge nette 8-12 %) se situe dans la moyenne haute du commerce de detail, mais avec un cycle de production complexe (transformation des matieres premieres). Comparativement, un commercant de pret-a-porter degage des marges similaires mais avec moins de complexite operationnelle (pas de cuisine, pas de service, pas d'hygiene HACCP).",
  },
  {
    question: 'Quels sont les KPI essentiels pour piloter un restaurant ?',
    answer:
      "Les KPI essentiels pour piloter un restaurant sont : (1) Food cost (%), (2) Cout personnel (%), (3) Prime cost (%), (4) Marge brute (EUR et %), (5) Marge nette (EUR et %), (6) Ticket moyen, (7) Nombre de couverts servis, (8) Taux d'occupation (%), (9) RevPASH (revenue per available seat hour), (10) Coefficient multiplicateur moyen.",
    extra:
      "Ces 10 indicateurs forment le tableau de bord operationnel a suivre chaque semaine. Ils permettent de detecter rapidement une derive (food cost qui passe de 30 a 34 %, ticket moyen qui baisse, taux d'occupation qui chute) et d'agir avant que la marge nette ne s'effondre. RestauMargin automatise ce suivi en temps reel.",
  },
];

// 5 ratios cles en intro
const ratiosCles = [
  { label: 'Food cost', value: '25 - 35 %', desc: 'Cout matieres / CA HT', icon: <Percent className="w-5 h-5" /> },
  { label: 'Cout personnel', value: '28 - 40 %', desc: 'Masse salariale / CA HT', icon: <DollarSign className="w-5 h-5" /> },
  { label: 'Prime cost', value: '< 65 %', desc: 'Matieres + personnel / CA HT', icon: <Target className="w-5 h-5" /> },
  { label: 'Loyer / CA', value: '< 10 %', desc: 'Loyer + charges / CA HT', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Marge nette', value: '> 8 %', desc: 'Resultat net / CA HT', icon: <Award className="w-5 h-5" /> },
];

export default function BlogFAQMargeRestaurant() {
  // Schema FAQPage avec les 25 questions/reponses (reponse complete = answer + extra)
  const faqSchemaItems = faq.map((item) => ({
    question: item.question,
    answer: `${item.answer} ${item.extra}`.trim(),
  }));

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="FAQ Marge Restaurant 2026 : 25 questions essentielles (reponses chefs)"
        description="Toutes les reponses sur la marge restaurant en 2026 : taux moyen, calcul, regle 30/30/30/10, rentabilite, plat le plus rentable, salaire proprietaire. 25 questions essentielles + formules + benchmarks."
        path="/blog/faq-marge-restaurant-25-questions"
        type="article"
        schema={[
          buildFAQSchema(faqSchemaItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'FAQ Marge Restaurant 25 questions', url: 'https://www.restaumargin.fr/blog/faq-marge-restaurant-25-questions' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'FAQ Marge Restaurant 2026 : 25 questions essentielles',
            description: 'Toutes les reponses sur la marge restaurant en 2026 : taux moyen, calcul, regle 30/30/30/10, rentabilite, plat le plus rentable, salaire proprietaire. 25 questions essentielles + formules + benchmarks.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-26',
            dateModified: '2026-05-26',
            wordCount: 4500,
            inLanguage: 'fr-FR',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://www.restaumargin.fr/blog/faq-marge-restaurant-25-questions',
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
              to="/outils/calculateur-marge-restaurant"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer ma marge
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
        <div className="max-w-6xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">FAQ Marge Restaurant 25 questions</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="FAQ"
        readTime="20 min"
        date="Mai 2026"
        title="FAQ Marge Restaurant 2026 : 25 questions essentielles"
        accentWord="Marge"
        subtitle="Toutes les reponses essentielles sur la marge restaurant en 2026 : taux moyen, calcul, regle 30/30/30/10, rentabilite, plat le plus rentable, salaire proprietaire. 25 questions concretes + formules + benchmarks chiffres."
      />

      {/* ── Layout : contenu principal + sidebar sticky ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-05-26" readTime="20 min" variant="header" />

        <div className="grid lg:grid-cols-[1fr_280px] gap-10 mt-8">
          {/* ── Contenu principal ── */}
          <main>
            {/* Intro */}
            <section className="prose-content mb-12">
              <p className="text-lg leading-relaxed text-mono-300">
                Les restaurateurs francais se posent quotidiennement les memes questions sur la marge :
                quel est le taux moyen ? Comment la calculer ? Est-ce qu'un food cost a 32 % est correct ?
                Combien dois-je gagner ? Cette FAQ rassemble les <strong>25 questions essentielles</strong> que se
                pose chaque restaurateur, avec des reponses concretes, chiffrees et issues des donnees
                terrain de plus de 500 restaurants utilisant RestauMargin.
              </p>
              <p>
                Chaque reponse commence par un paragraphe court et factuel pour aller a l'essentiel,
                suivi d'un contexte avec des exemples chiffres concrets. Vous y trouverez les ratios
                a viser, les benchmarks par segment, les leviers d'optimisation et les pieges a eviter.
                Si vous voulez aller plus loin, consultez notre <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800">guide complet du calcul de marge</Link>.
              </p>
            </section>

            {/* Les 5 ratios a retenir */}
            <section className="mb-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Les 5 ratios cles a retenir</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold mb-6">
                Le tableau de bord du restaurateur en 2026
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {ratiosCles.map((r, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2 text-teal-100">
                      {r.icon}
                    </div>
                    <div className="text-xs text-teal-100 font-semibold uppercase tracking-wide mb-1">{r.label}</div>
                    <div className="text-lg font-extrabold text-white mb-1">{r.value}</div>
                    <div className="text-xs text-teal-50 leading-snug">{r.desc}</div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-teal-100 text-sm leading-relaxed">
                Si ces cinq ratios sont dans la cible, votre restaurant est structurellement rentable.
                RestauMargin calcule ces ratios en temps reel a partir de vos fiches techniques et de vos factures.
              </p>
            </section>

            {/* Sommaire mobile */}
            <nav className="mb-12 lg:hidden bg-mono-1000 border border-mono-900 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                Les 25 questions
              </h2>
              <ol className="space-y-2 text-sm text-mono-350">
                {faq.map((item, i) => (
                  <li key={i}>
                    <a href={`#q${i + 1}`} className="hover:text-teal-600 transition-colors flex items-start gap-2">
                      <span className="text-teal-600 font-semibold min-w-[24px]">{i + 1}.</span>
                      {item.question}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* ── 25 questions ── */}
            <article className="space-y-10">
              {faq.map((item, i) => (
                <FAQItem
                  key={i}
                  index={i + 1}
                  question={item.question}
                  answer={item.answer}
                  extra={item.extra}
                />
              ))}
            </article>

            <BlogAuthor publishedDate="2026-05-26" readTime="20 min" variant="footer" />

            {/* ── CTA ── */}
            <section className="mt-16 mb-16">
              <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                  Suivez vos 25 indicateurs avec RestauMargin
                </h2>
                <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
                  Tableau de bord temps reel : food cost, prime cost, marge brute, marge nette,
                  ticket moyen, taux d'occupation. Tout est calcule automatiquement a partir de vos
                  fiches techniques et de vos factures.
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
                    to="/outils/calculateur-marge-restaurant"
                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
                  >
                    <Calculator className="w-5 h-5" />
                    Calculateur gratuit
                  </Link>
                </div>
              </div>
            </section>

            {/* ── A lire aussi ── */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-mono-100 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-teal-600" />
                A lire aussi
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to="/blog/calcul-marge-restaurant"
                  className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
                >
                  <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                    Calcul marge restaurant : guide complet
                  </h3>
                  <p className="text-xs text-mono-500">
                    Formules, food cost, marge brute, marge nette. Exemples chiffres.
                  </p>
                </Link>
                <Link
                  to="/blog/prime-cost-restaurant"
                  className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
                >
                  <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                    Prime cost restaurant
                  </h3>
                  <p className="text-xs text-mono-500">
                    L'indicateur N1 de rentabilite. Benchmarks et plan d'action.
                  </p>
                </Link>
                <Link
                  to="/blog/reduire-food-cost"
                  className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
                >
                  <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                    Reduire le food cost
                  </h3>
                  <p className="text-xs text-mono-500">
                    10 strategies concretes pour gagner 3-5 points de marge brute.
                  </p>
                </Link>
                <Link
                  to="/blog/coefficient-multiplicateur"
                  className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
                >
                  <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                    Coefficient multiplicateur
                  </h3>
                  <p className="text-xs text-mono-500">
                    Tableaux par categorie et cas pratiques.
                  </p>
                </Link>
              </div>
            </section>
          </main>

          {/* ── Sidebar sticky desktop ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-mono-1000 border border-mono-900 rounded-2xl p-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <h2 className="text-sm font-bold text-mono-100 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                Les 25 questions
              </h2>
              <ol className="space-y-1.5 text-sm text-mono-350">
                {faq.map((item, i) => (
                  <li key={i}>
                    <a
                      href={`#q${i + 1}`}
                      className="hover:text-teal-600 transition-colors flex items-start gap-2 py-1 leading-snug"
                    >
                      <span className="text-teal-600 font-semibold min-w-[20px] text-xs pt-0.5">{i + 1}.</span>
                      <span className="text-xs">{item.question}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-5 pt-5 border-t border-mono-900">
                <Link
                  to="/outils/calculateur-marge-restaurant"
                  className="block w-full text-center px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Calculer ma marge
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-mono-500">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">La plateforme de gestion de marge pour les restaurateurs.</p>
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

function FAQItem({
  index,
  question,
  answer,
  extra,
}: {
  index: number;
  question: string;
  answer: string;
  extra: string;
}) {
  return (
    <details
      id={`q${index}`}
      open
      className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7 scroll-mt-24"
    >
      <summary className="cursor-pointer list-none flex items-start gap-4 group">
        <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center shrink-0 font-bold text-base shadow-sm group-hover:bg-teal-100 transition-colors">
          {index}
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-mono-100 leading-snug pt-1.5 group-hover:text-teal-700 transition-colors">
          {question}
        </h2>
      </summary>
      <div className="mt-5 pl-0 sm:pl-14 space-y-3 text-mono-400 leading-relaxed">
        <p className="text-base font-medium text-mono-200 bg-teal-50/50 border-l-4 border-teal-600 px-4 py-3 rounded-r-lg">
          {answer}
        </p>
        <p className="text-sm sm:text-base">{extra}</p>
      </div>
    </details>
  );
}
