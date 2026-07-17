import { Link } from 'react-router-dom';
import { ChefHat, Layers, Server, Package, ShieldCheck, TrendingUp, AlertTriangle, ArrowRight, BookOpen, Cpu, Award, CheckCircle, Calculator, BarChart3, Users } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Logiciel de gestion restaurant : comparatif 2026"
   Mots-cles : logiciel gestion restaurant, meilleur logiciel restaurant,
   comparatif logiciel restaurant
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quel est le meilleur logiciel de gestion pour restaurant en 2026 ?",
    answer: "Il n'existe pas de meilleur logiciel de gestion restaurant unique : la bonne reponse est une stack composee de 3 a 5 outils specialises. Le combo le plus efficace en 2026 pour un indépendant : Zelty (caisse, 49-89 €/mois) + Pennylane (compta, 49-79 €/mois) + RestauMargin (pilotage marges, 0-49 €/mois) + Skello (RH si plus de 4 salaries, 6-8 €/salarie). Pour une chaine, ajoutez Inpulse ou Foodics pour les stocks et un BI type Looker Studio."
  },
  {
    question: "Puis-je tout faire avec Excel ?",
    answer: "Theoriquement oui, en pratique non. Excel ne gere pas la conformite NF525 obligatoire (amende 7 500 € par caisse), ne deduit pas le stock automatiquement a chaque vente, ne fait pas la DSN salariale, ne se synchronise pas en temps reel avec votre comptable, ne gere pas la facturation electronique FACTUR-X (obligatoire 2027). Vous pouvez piloter une partie de la marge sur Excel — mais vous y passez 3 fois plus de temps qu avec un outil dedie, avec un risque d erreur multiplie par 4."
  },
  {
    question: "Quelle est la duree d engagement habituelle ?",
    answer: "La plupart des SaaS de gestion restaurant (Lightspeed, Skello, Pennylane, RestauMargin, Cashpad) sont sans engagement ou en mensuel. Quelques editeurs (Inpulse, Foodics, Innovorder) imposent encore un engagement 12 ou 24 mois. Evitez les contrats superieurs a 12 mois sauf forte remise (50 % minimum), car le marche evolue tres vite et un outil leader aujourd'hui peut etre depasse dans 18 mois."
  },
  {
    question: "Les solutions cloud sont-elles fiables en cas de coupure internet ?",
    answer: "Les bonnes solutions ont un mode offline (cache local) qui permet de continuer la prise de commande et l encaissement meme sans internet. La synchronisation se fait automatiquement au retour de la connexion. Verifiez ce point avant de signer — c est critique en zone rurale ou pour un food truck. Zelty, L Addition, Lightspeed, Cashpad gerent le mode offline ; certains modules cloud (Skello, Pennylane) sont moins critiques en offline mais perdent quelques heures de saisie."
  },
  {
    question: "Combien de temps pour amortir un logiciel a 200 €/mois ?",
    answer: "Le ROI est presque toujours positif si l outil est correctement utilise. Cas type : si un logiciel vous fait gagner 1 point de food cost sur 600 000 € de CA annuel, cela represente 6 000 €/an d economies — votre outil a 200 €/mois (2 400 €/an) est rembourse en 12 jours seulement. Sur les 3 outils les plus rentables (caisse, marges, RH), le ROI moyen calcule sur un echantillon G2 de 50 restaurants francais est compris entre x4 et x12 sur 12 mois."
  },
  {
    question: "Faut-il integrer ChatGPT ou IA dans son stack restaurant ?",
    answer: "Pas en remplacement, mais en complement. L IA est utile en 2026 pour : prevoir la frequentation a 7 jours, generer des descriptions de plats et menus, suggerer des accords mets-vins, automatiser le scoring de revues clients Google, optimiser les achats fournisseurs en fonction des previsions. Plusieurs solutions integrent ces fonctions nativement : Skello pour les plannings, Lightspeed AI pour les insights, RestauMargin pour 19 actions IA dont suggestions de prix optimal et detection d anomalies food cost."
  },
  {
    question: "Comment choisir entre Pennylane, Tiime, iPaidThat et Sage pour la compta ?",
    answer: "Pennylane domine en 2026 pour la restauration indépendante (collaboratif EC + automatisations + connecteur Zelty/Lightspeed natif, 49-99 €/mois). Tiime est plus oriente PME/multi-sites avec une UX experte (39-79 €/mois). iPaidThat est specialise dans la gestion des notes de frais et factures fournisseurs (29-69 €/mois). Sage reste pertinent pour les groupes de plus de 50 salaries avec une comptabilite plus complexe. Demandez l avis de votre expert-comptable : son confort de travail compte autant que vos preferences."
  },
  {
    question: "Quel logiciel de stock pour un restaurant ?",
    answer: "Trois options principales : (1) Inpulse — leader francais du pilotage stocks restauration, 129-249 €/mois, fiches techniques avancees, FIFO, alertes seuils, recommande pour 80 % des restaurants. (2) Easilys — alternative francaise, 99-199 €/mois, tres orientee chaine et collectivites. (3) Foodics — solution moyen-orient en expansion europe, 99-249 €/mois, multi-site mature. Pour un solo, un module stock integre a votre caisse (Zelty, Lightspeed) suffit souvent."
  },
  {
    question: "Faut-il un logiciel separe pour les plannings ?",
    answer: "Oui des 3-4 salaries. Skello (6-8 €/salarie/mois) domine le marche restauration en 2026 grace a sa convention collective HCR native, sa DSN integree, et son app mobile salariee. Alternatives : Snapshift (5-7 €/salarie), Combo (6-9 €/salarie), PayFit (35-45 €/salarie pour la paie complete). Avec ces outils, vous economisez 8 a 15 heures par mois sur les plannings + DSN, soit 200 a 400 € de cout salarial."
  },
  {
    question: "Comment integrer plusieurs logiciels entre eux ?",
    answer: "Trois approches : (1) Integrations natives editeurs (Zelty <-> Pennylane, Lightspeed <-> Inpulse, etc.) — recommandees, gratuites et fiables. (2) Middleware specialises (Deliverect, Otter, Bridge) pour des cas precis (livraison consolidee, banque). (3) Plateformes d automatisation type Zapier, Make, n8n — pour les cas non couverts par les integrations natives. RestauMargin se branche en aval via export CSV ou API ouverte sur n importe quelle caisse."
  },
  {
    question: "Quelle est la facturation electronique FACTUR-X et quand devient-elle obligatoire ?",
    answer: "FACTUR-X est le format hybride PDF + XML de facture electronique impose par la reglementation francaise. Le calendrier 2026-2027 prevoit l obligation de reception par toutes les entreprises au 1er septembre 2026 et l obligation d emission progressive de 2026 a 2027 selon la taille de l entreprise. Votre logiciel de comptabilite (Pennylane, Tiime, Sage) ou un PDP (Plateforme de Dematerialisation Partenaire) immatricule doit gerer FACTUR-X. Anticipez le changement, l administration ne fera pas de tolerance."
  },
  {
    question: "Combien coute un stack logiciel complet pour un restaurant en 2026 ?",
    answer: "Trois budgets type. Restaurant solo (50 couverts/jour, 1-3 salaries) : 80-150 €/mois HT, soit 960-1 800 €/an. Restaurant PME (50-150 couverts/jour, 4-15 salaries) : 300-500 €/mois, soit 3 600-6 000 €/an. Multi-sites (plus de 150 couverts, plus de 15 salaries) : 800-1 800 €/mois, soit 9 600-21 600 €/an. Ces budgets s amortissent en moyenne 4 a 12 mois grace aux gains de marge et de productivite."
  }
];

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
  { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
  { name: 'Logiciel de gestion restaurant', url: 'https://www.restaumargin.fr/blog/logiciel-gestion-restaurant' }
]);

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment choisir un stack logiciel de gestion pour restaurant en 6 etapes',
  description: 'Methode structuree pour composer la stack logicielle adaptee a votre restaurant : caisse, comptabilite, RH, stocks, marges.',
  totalTime: 'PT45M',
  tool: ['Cahier des charges', 'Tableau comparatif', 'Demos editeurs'],
  step: [
    { '@type': 'HowToStep', name: 'Cartographier vos processus actuels', text: 'Listez les 12 processus cles : prise de commande, encaissement, comptabilite, paie, plannings, stocks, achats, marges, fidelite, marketing, reservation, livraison. Identifiez ou vous perdez du temps et de l argent.' },
    { '@type': 'HowToStep', name: 'Definir votre format et votre taille', text: 'Solo (1-3 salaries), PME (4-15 salaries) ou multi-sites (plus de 15 salaries) : chaque taille appelle une stack differente. Le budget oscille entre 80 et 1 800 €/mois selon la taille.' },
    { '@type': 'HowToStep', name: 'Choisir la caisse en premier', text: 'La caisse est le coeur du systeme. Choisissez-la d abord, en vous assurant de la certification NF525 et des integrations natives avec votre future stack (compta, marges, livraison).' },
    { '@type': 'HowToStep', name: 'Ajouter la comptabilite avec connecteur natif', text: 'Pennylane si vous voulez le collaboratif avec votre EC. Tiime pour une UX experte. Verifiez le connecteur natif caisse-compta : c est ce qui fait gagner 10 a 20 heures par mois.' },
    { '@type': 'HowToStep', name: 'Specialiser les marges et les stocks', text: 'La caisse ne calcule pas correctement les marges (food cost, prime cost). Ajoutez un outil specialise : RestauMargin (pilotage marges) ou Inpulse (stocks + marges avances).' },
    { '@type': 'HowToStep', name: 'Industrialiser la RH a partir de 4 salaries', text: 'Skello, Snapshift ou Combo pour les plannings + DSN + signature electronique des contrats. Indispensable des que vous avez plus de 4 salaries pour eviter les erreurs paie.' },
  ],
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'RestauMargin',
  description: 'Logiciel de gestion specialise dans le pilotage des marges et du food cost pour restaurant. Se connecte a votre caisse et a votre comptabilite pour automatiser le calcul de marge brute par plat.',
  brand: { '@type': 'Brand', name: 'RestauMargin' },
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'EUR',
    lowPrice: '0',
    highPrice: '49',
    offerCount: '3',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Logiciel de gestion restaurant : comparatif et guide d achat 2026',
  description: 'Comparez les meilleurs logiciels de gestion restaurant : caisse, stocks, comptabilite, plannings, marges. Stack ideal selon votre taille, prix, ROI sur 12 mois.',
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
  },
  datePublished: '2026-04-27',
  dateModified: '2026-05-26',
  wordCount: 3200,
  inLanguage: 'fr-FR',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/logiciel-gestion-restaurant' },
};

export default function BlogLogicielGestion() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel de gestion restaurant : comparatif et guide d achat 2026"
        description="Comparez les meilleurs logiciels de gestion restaurant 2026 : caisse, stocks, comptabilite, plannings, marges. Stack ideal selon votre taille + ROI 12 mois."
        path="/blog/logiciel-gestion-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          breadcrumbSchema,
          howToSchema,
          productSchema,
          articleSchema,
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
              to="/outils/calculateur-food-cost"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer ma marge
            </Link>
            <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">
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
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Logiciel de gestion restaurant</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Outils"
        readTime="15 min"
        date="Avril 2026"
        title="Logiciel de gestion restaurant : comparatif et guide d achat 2026"
        accentWord="logiciel de gestion"
        subtitle="5 categories d outils, 12 solutions analysees (Lightspeed, Zelty, Pennylane, Skello, Inpulse, RestauMargin...). Stack ideal selon votre taille + ROI 12 mois chiffre."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* Encadre TL;DR */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">TL;DR — la stack ideale 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">Le stack logiciel restaurant qui marche en 2026</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-2 font-mono text-sm sm:text-base">
            <div><strong className="text-white">1. Caisse POS :</strong> Zelty (49-89 €) ou Lightspeed (69-189 €)</div>
            <div><strong className="text-white">2. Comptabilite :</strong> Pennylane (49-99 €) ou Tiime (39-79 €)</div>
            <div><strong className="text-white">3. Pilotage marges :</strong> RestauMargin (0-49 €)</div>
            <div><strong className="text-white">4. RH plannings :</strong> Skello (6-8 €/salarie) si plus de 4 salaries</div>
            <div><strong className="text-white">5. Stocks :</strong> Inpulse (129-249 €) si plus de 5 fournisseurs reguliers</div>
            <div><strong className="text-white">6. Livraison :</strong> Deliverect (49-99 €) si plus de 30 commandes/sem plateformes</div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Budget moyen pour un indépendant : 200-400 €/mois. ROI moyen calcule : x4 a x12 sur 12 mois.
          </p>
        </div>

        {/* Sommaire */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#pourquoi', label: 'Pourquoi un logiciel de gestion est devenu incontournable' },
              { href: '#categories', label: 'Les 5 categories d outils a connaitre' },
              { href: '#criteres', label: 'Les 8 criteres pour choisir un logiciel de gestion' },
              { href: '#comparatif', label: 'Comparatif detaille de 12 solutions' },
              { href: '#tableau-prix', label: 'Tableau comparatif prix et fonctionnalites' },
              { href: '#stack-solo', label: 'Stack ideal pour un restaurant solo (1-3 salaries)' },
              { href: '#stack-pme', label: 'Stack ideal pour une PME (4-15 salaries)' },
              { href: '#stack-multi', label: 'Stack ideal pour un multi-sites (plus de 15 salaries)' },
              { href: '#nf525-factur', label: 'Conformite : NF525, FACTUR-X, FEC, DSN' },
              { href: '#vigilance', label: '5 points de vigilance avant d acheter' },
              { href: '#roi', label: 'ROI : exemple chiffre sur 12 mois' },
              { href: '#faq', label: 'Questions frequentes' },
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

          {/* Intro */}
          <p className="text-[#374151] text-lg leading-relaxed mb-10">
            La marge nette moyenne en restauration francaise est de <strong>3 a 6 % du chiffre d affaires</strong> selon les chiffres INSEE 2026. Sur un restaurant a 600 000 € de CA, vous oscillez entre 18 000 et 36 000 € de benefice annuel. A ce niveau, <strong>un seul mauvais choix d outil peut faire basculer votre exercice dans le rouge</strong>. Et pourtant, 52 % des restaurateurs indépendants pilotent encore leurs marges sur Excel, en memoire, ou pas du tout. Ce <strong>comparatif logiciel restaurant 2026</strong> vous donne la stack ideale selon votre taille, les 12 solutions a connaitre, et le ROI chiffre sur 12 mois.
          </p>

          {/* Section 1 */}
          <section id="pourquoi" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">1. Pourquoi un logiciel de gestion est devenu incontournable</h2>
            </div>
            <ul className="space-y-4 text-[#374151] mb-4">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>La marge se joue sur 1-2 points</strong> : sans logiciel de pilotage, vous ne connaissez pas votre food cost reel jour apres jour. Vous decouvrez le bilan en fin d annee. Trop tard pour reagir. Un point de food cost en moins = 6 000 € de marge nette en plus sur 600 000 € de CA.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>Les fournisseurs augmentent en silence</strong> : l inflation alimentaire cumulee 2024-2026 atteint +18 a +35 % sur certains produits (huile, beurre, viande). Sans suivi automatique des prix d achat, vous n ajustez ni vos recettes ni vos prix de vente. La marge fond.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>Le temps administratif explose</strong> : DSN, FACTUR-X, NF525, URSSAF, mutuelle HCR, plannings, paie, FEC = 15 a 25 heures par semaine sans outils dedies. Avec le bon stack : 5 a 8 heures. Soit 50 heures de gagnees par mois, 600 heures par an, ou 15 000 € de cout salarial economise.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>Les controles fiscaux se digitalisent</strong> : en cas de controle DGFiP en 2026, l administration exige un FEC propre, une caisse NF525, et des justificatifs FACTUR-X. Sans, redressement assure.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>Les talents partent chez ceux qui sont equipes</strong> : un serveur de 25 ans ne reste pas dans un restaurant qui le fait pointer sur papier. Skello, Combo et leurs apps mobiles salariees deviennent un argument de recrutement.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 — 5 categories */}
          <section id="categories" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">2. Les 5 categories d outils a connaitre</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-5">
              Aucun outil ne fait tout — et c est tres bien comme ca. Les meilleurs editeurs se specialisent et se connectent entre eux via des API. Voici les 5 briques d une stack complete :
            </p>
            <div className="bg-mono-1000 rounded-xl p-5 mb-4 font-mono text-sm text-mono-100 space-y-1">
              <div><strong>1. Caisse POS</strong> (NF525 obligatoire)</div>
              <div><strong>2. Gestion des stocks</strong> (FIFO, alertes seuil, inventaires)</div>
              <div><strong>3. Comptabilite</strong> (multi-TVA, FACTUR-X, FEC, connecteur banque)</div>
              <div><strong>4. RH et plannings</strong> (CCN HCR, DSN, signature electronique)</div>
              <div><strong>5. Calcul des marges et pilotage</strong> (food cost, prime cost, alertes derive)</div>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Caisse POS</strong> : Lightspeed, L Addition, Tiller / SumUp, Square, Cashpad, Zelty, Hiboutik, Innovorder. Depuis 2018, certification NF525 obligatoire (amende 7 500 € par caisse non conforme). <Link to="/blog/logiciel-caisse-enregistreuse-restaurant" className="text-teal-600 hover:underline">Voir le comparatif detaille des logiciels de caisse</Link>.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Stocks</strong> : Inpulse, Easilys, Foodics, Marketman, MarketMan, BiteHQ. Le stock matieres premieres represente 30 a 40 % du CA mensuel — sans pilotage automatique, on stocke trop (capital immobilise + pertes) ou trop peu (ruptures + perte de ventes).
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Comptabilite</strong> : Pennylane (leader 2026), Tiime, iPaidThat, Sage, Cegid Loop, EBP. Le choix se fait souvent avec votre expert-comptable selon sa propre stack.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>RH et plannings</strong> : Skello (leader restauration 2026), Snapshift, Combo, PayFit, Lucca. La CCN HCR (Hotels Cafes Restaurants) est complexe — preferez un editeur qui la connait nativement.
            </p>
            <p className="text-[#374151] leading-relaxed">
              <strong>Marges et pilotage</strong> : RestauMargin (specialise food cost et marge brute), Inpulse (module marges integre), Foodics (analytics avancees). C est la categorie la plus negligee — alors que c est celle qui a le ROI le plus rapide.
            </p>
          </section>

          {/* Section 3 — 8 criteres */}
          <section id="criteres" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">3. Les 8 criteres pour choisir un logiciel de gestion</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-5">
              Au-dela du prix, ce sont les criteres qui font la difference entre un outil qui s installe en 2 jours et un outil qui devient un boulet pendant 3 ans.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                { num: '1', titre: 'Conformite (NF525, RGPD, FACTUR-X)', desc: 'Non negociable. Demandez les certificats.' },
                { num: '2', titre: 'Integrations natives', desc: 'Caisse-Compta, Caisse-Marges, RH-Paie. Evitez les middleware payants si possible.' },
                { num: '3', titre: 'Mode offline', desc: 'Critique pour la caisse, secondaire pour la compta.' },
                { num: '4', titre: 'Support FR reactif', desc: 'Chat sous 5min, telephone sous 15min, en francais.' },
                { num: '5', titre: 'API ouverte', desc: 'Permet les connexions futures (BI, outils niches, automations).' },
                { num: '6', titre: 'Formation incluse', desc: '2-4h par utilisateur. Refusez les editeurs qui facturent en supplement.' },
                { num: '7', titre: 'Engagement court', desc: 'Mensuel ou 12 mois max. Le marche evolue trop vite.' },
                { num: '8', titre: 'Reviews G2 / Capterra recentes', desc: 'Verifiez la note moyenne et les avis des 6 derniers mois.' },
              ].map((c) => (
                <div key={c.num} className="border border-mono-900 rounded-xl p-4 bg-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-7 h-7 rounded-lg bg-teal-600 text-white text-xs font-bold flex items-center justify-center">{c.num}</span>
                    <strong className="text-mono-100 text-sm">{c.titre}</strong>
                  </div>
                  <p className="text-xs text-mono-400 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 — Comparatif 12 solutions */}
          <section id="comparatif" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">4. Comparatif detaille de 12 solutions</h2>
            </div>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">Caisses POS</h3>
            <p className="text-[#374151] leading-relaxed mb-3">
              <strong>Lightspeed Restaurant (69-189 €/mois)</strong> — multi-sites mature, reporting avance, integration livraison via Lightspeed Delivery Connect. Note G2 : 4,4/5.
            </p>
            <p className="text-[#374151] leading-relaxed mb-3">
              <strong>Zelty (49-89 €/mois)</strong> — leader francais pour les indépendants, click and collect natif, integrations Deliveroo / Uber Eats / Just Eat directes. Note G2 : 4,6/5.
            </p>
            <p className="text-[#374151] leading-relaxed mb-3">
              <strong>L Addition (39-89 €/mois)</strong> — simple, francais, rachete par Zelty en 2023. Note G2 : 4,3/5.
            </p>
            <p className="text-[#374151] leading-relaxed mb-3">
              <strong>Cashpad (39-79 €/mois)</strong> — outsider francais montant, UX moderne. Note G2 : 4,5/5.
            </p>
            <p className="text-[#374151] leading-relaxed mb-3">
              <strong>SumUp / Tiller (39 €+/mois)</strong> — tout-en-un nomade pour food truck. Note G2 : 4,0/5.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">Comptabilite</h3>
            <p className="text-[#374151] leading-relaxed mb-3">
              <strong>Pennylane (49-99 €/mois)</strong> — leader 2026 de la compta collaborative restaurant. Connecteurs Zelty, Lightspeed, Cashpad natifs. FACTUR-X integre. Note G2 : 4,7/5.
            </p>
            <p className="text-[#374151] leading-relaxed mb-3">
              <strong>Tiime (39-79 €/mois)</strong> — alternative francaise tres UX-friendly, ideal pour les solos. Note G2 : 4,5/5.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">RH et plannings</h3>
            <p className="text-[#374151] leading-relaxed mb-3">
              <strong>Skello (6-8 €/salarie/mois)</strong> — leader restauration FR avec CCN HCR native, DSN integree, app mobile salariee. Note G2 : 4,5/5.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">Stocks et achats</h3>
            <p className="text-[#374151] leading-relaxed mb-3">
              <strong>Inpulse (129-249 €/mois)</strong> — leader francais du stock restauration, fiches techniques avancees, gestion FIFO automatique. Note G2 : 4,4/5.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">Livraison consolidee</h3>
            <p className="text-[#374151] leading-relaxed mb-3">
              <strong>Deliverect (49-99 €/mois)</strong> — consolide Deliveroo + Uber Eats + Just Eat + Frichti + plus de 30 plateformes dans une seule interface, push dans la caisse. Note G2 : 4,6/5.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">Pilotage marges</h3>
            <p className="text-[#374151] leading-relaxed">
              <strong>RestauMargin (0-49 €/mois)</strong> — specialise food cost, prime cost, marge brute par plat, simulation prix, import factures fournisseurs automatique, fiches techniques avec gestion perte au parage, kiosk mode + balance Bluetooth pour pesee live, 19 actions IA dont detection d anomalies. Version gratuite a vie pour les indépendants.
            </p>
          </section>

          {/* Section 5 — Tableau prix */}
          <section id="tableau-prix" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">5. Tableau comparatif prix et fonctionnalites</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-5">
              Synthese des 12 solutions. Prix HT mensuel par utilisateur / etablissement. Sources : G2, Capterra, demos editeurs avril 2026.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-mono-900 mb-6">
              <table className="w-full text-sm">
                <thead className="bg-mono-1000 text-mono-100">
                  <tr>
                    <th className="text-left p-3 font-semibold">Solution</th>
                    <th className="text-left p-3 font-semibold">Categorie</th>
                    <th className="text-left p-3 font-semibold">Prix /mois</th>
                    <th className="text-left p-3 font-semibold">G2</th>
                    <th className="text-left p-3 font-semibold">Public ideal</th>
                  </tr>
                </thead>
                <tbody className="text-[#374151]">
                  <tr className="border-t border-mono-900 bg-emerald-50/30">
                    <td className="p-3"><strong>Zelty</strong></td><td className="p-3">Caisse</td><td className="p-3">49-89 €</td><td className="p-3">4,6</td><td className="p-3">Indépendants FR</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>Lightspeed</strong></td><td className="p-3">Caisse</td><td className="p-3">69-189 €</td><td className="p-3">4,4</td><td className="p-3">Multi-sites premium</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>L Addition</strong></td><td className="p-3">Caisse</td><td className="p-3">39-89 €</td><td className="p-3">4,3</td><td className="p-3">Solos simples</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>Cashpad</strong></td><td className="p-3">Caisse</td><td className="p-3">39-79 €</td><td className="p-3">4,5</td><td className="p-3">Brasseries FR</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>SumUp / Tiller</strong></td><td className="p-3">Caisse</td><td className="p-3">39 €+</td><td className="p-3">4,0</td><td className="p-3">Food trucks</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>iZettle</strong></td><td className="p-3">Caisse</td><td className="p-3">29-59 €</td><td className="p-3">3,9</td><td className="p-3">Saisonnier</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>Pennylane</strong></td><td className="p-3">Compta</td><td className="p-3">49-99 €</td><td className="p-3">4,7</td><td className="p-3">Compta collaborative</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>Tiime</strong></td><td className="p-3">Compta</td><td className="p-3">39-79 €</td><td className="p-3">4,5</td><td className="p-3">Solos / PME</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>Skello</strong></td><td className="p-3">RH</td><td className="p-3">6-8 €/sal</td><td className="p-3">4,5</td><td className="p-3">CCN HCR native</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>Inpulse</strong></td><td className="p-3">Stocks</td><td className="p-3">129-249 €</td><td className="p-3">4,4</td><td className="p-3">PME / chaines</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>Deliverect</strong></td><td className="p-3">Livraison</td><td className="p-3">49-99 €</td><td className="p-3">4,6</td><td className="p-3">Multi-plateformes</td>
                  </tr>
                  <tr className="border-t border-mono-900 bg-teal-50/30">
                    <td className="p-3"><strong>RestauMargin</strong></td><td className="p-3">Marges</td><td className="p-3">0-49 €</td><td className="p-3">4,8</td><td className="p-3">Indépendants + PME</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-mono-400 italic">
              Sources : <a href="https://www.g2.com/categories/restaurant-management" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">G2 Restaurant Management</a>, <a href="https://www.capterra.fr/directory/30000/restaurant-management/software" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Capterra France</a>, demos editeurs avril 2026. Notes G2 issues de moyennes sur 6 mois glissants.
            </p>
          </section>

          {/* Section 6 — Stack solo */}
          <section id="stack-solo" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">6. Stack ideal pour un restaurant solo (1-3 salaries)</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              Profil : moins de 50 couverts/jour, 1 a 3 salaries, CA de 200 000 a 500 000 € HT/an. <strong>Budget total cible : 80 a 150 €/mois</strong>.
            </p>
            <div className="bg-mono-1000 rounded-xl p-5 mb-4 font-mono text-sm text-mono-100 space-y-1">
              <div>POS : L Addition (49 €) ou SumUp / Tiller (39 €)</div>
              <div>Compta : Pennylane Solo (49 €) ou Tiime Premier (39 €)</div>
              <div>Marges : RestauMargin Gratuit (0 €) ou Starter (19 €)</div>
              <div>RH : Excel + DSN trimestrielle via expert-comptable</div>
              <div>Livraison : integration native caisse (pas de middleware)</div>
              <div>Total : 88 a 156 €/mois</div>
            </div>
            <p className="text-[#374151] leading-relaxed">
              A ce niveau, la priorite est l <strong>integration caisse-compta-marges</strong>. Les plannings restent manuels (Excel ou WhatsApp) tant que vous etes moins de 4 salaries. <Link to="/blog/inventaire-restaurant-guide" className="text-teal-600 hover:underline">L inventaire</Link> peut se faire mensuel sur Excel ou directement dans RestauMargin.
            </p>
          </section>

          {/* Section 7 — Stack PME */}
          <section id="stack-pme" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">7. Stack ideal pour une PME (4-15 salaries)</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              Profil : 50 a 150 couverts/jour, 4 a 15 salaries, CA de 500 000 a 1 500 000 € HT/an. <strong>Budget total cible : 300 a 500 €/mois</strong>.
            </p>
            <div className="bg-mono-1000 rounded-xl p-5 mb-4 font-mono text-sm text-mono-100 space-y-1">
              <div>POS : Lightspeed (99 €) ou Zelty Pro (79 €) ou Cashpad Pro (69 €)</div>
              <div>Compta : Pennylane Premium (79 €) ou Tiime Pro (69 €)</div>
              <div>Marges : RestauMargin Pro (49 €) ou Inpulse Light (129 €)</div>
              <div>Plannings : Skello (60-80 € pour 10-15 salaries)</div>
              <div>Livraison : Deliverect (49 €) si plus de 30 commandes plateformes/sem</div>
              <div>Total : 306 a 487 €/mois</div>
            </div>
            <p className="text-[#374151] leading-relaxed">
              C est le sweet spot du ROI. Avec une stack a 400 €/mois bien utilisee, vous economisez 8 a 15 heures par semaine en saisie et vous gagnez 1 a 2 points de food cost — soit 6 000 a 24 000 € de marge brute supplementaire par an.
            </p>
          </section>

          {/* Section 8 — Stack multi-sites */}
          <section id="stack-multi" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Server className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">8. Stack ideal pour un multi-sites (plus de 15 salaries)</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              Profil : plus de 150 couverts/jour, plus de 15 salaries, CA de 1,5 a 5+ M€ HT/an, 2 a 10 etablissements. <strong>Budget total cible : 800 a 1 800 €/mois</strong>.
            </p>
            <div className="bg-mono-1000 rounded-xl p-5 mb-4 font-mono text-sm text-mono-100 space-y-1">
              <div>POS : Lightspeed Pro (149-189 €) ou Innovorder (149-249 €)</div>
              <div>Compta : Pennylane Premium (99 €) ou Sage Multi (200 €)</div>
              <div>Marges + Stocks : Inpulse Pro (249 €) + RestauMargin Pro (49 €)</div>
              <div>RH complete : Skello + PayFit (90-150 € + 35 €/salarie)</div>
              <div>Livraison : Deliverect Pro (99 €)</div>
              <div>BI : Looker Studio gratuit ou Tableau (70 €/utilisateur)</div>
              <div>Total : 836 a 1 850 €/mois</div>
            </div>
            <p className="text-[#374151] leading-relaxed">
              A ce niveau, la <strong>centralisation des donnees</strong> devient critique. Vous avez besoin d un BI (Business Intelligence) qui consolide les ventes des 10 sites, les marges par site, les performances RH. Looker Studio (gratuit) suffit pour 80 % des besoins.
            </p>
          </section>

          {/* Section 9 — Conformite */}
          <section id="nf525-factur" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">9. Conformite : NF525, FACTUR-X, FEC, DSN</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              4 conformites majeures s appliquent en 2026 :
            </p>
            <ul className="space-y-3 text-[#374151] mb-4">
              <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span><span><strong>NF525</strong> (caisse) — article 286-I-3 bis du CGI. Amende 7 500 € par caisse non conforme. <Link to="/blog/logiciel-caisse-enregistreuse-restaurant" className="text-teal-600 hover:underline">Voir le guide NF525 complet</Link>.</span></li>
              <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span><span><strong>FACTUR-X</strong> (facturation electronique) — obligation de reception au 1er septembre 2026, emission progressive 2026-2027. Format hybride PDF + XML.</span></li>
              <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span><span><strong>FEC</strong> (Fichier des Ecritures Comptables) — exige a tout controle fiscal. Format DGFiP normalise.</span></li>
              <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">4</span><span><strong>DSN</strong> (Declaration Sociale Nominative) — mensuelle, generee automatiquement par Skello, PayFit, Combo.</span></li>
            </ul>
            <p className="text-[#374151] leading-relaxed">
              <strong>Sources officielles :</strong> DGFiP (impots.gouv.fr), AFNOR (afnor.org), DGCCRF (economie.gouv.fr), URSSAF (urssaf.fr), PDP / Chorus Pro (chorus-pro.gouv.fr).
            </p>
          </section>

          {/* Section 10 — Vigilance */}
          <section id="vigilance" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">10. 5 points de vigilance avant d acheter</h2>
            </div>
            <ul className="space-y-3 text-[#374151] mb-4">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span><strong>Formation</strong> : 80 % des echecs viennent du defaut de formation. Prevoyez 2-4h par utilisateur, un referent par site, une periode de double-saisie de 1 a 2 semaines.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span><strong>Migration</strong> : export des fiches techniques, import fournisseurs et codes articles, reprise de l historique 3 mois minimum. Allouez 1 a 2 mois pour une migration complete.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span><strong>Integration</strong> : APIs natives POS -&gt; Compta -&gt; Stocks -&gt; Livraison. Une stack non integree = double-saisie = erreurs = perte de temps.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span><strong>Conformite</strong> : NF525 (caisse), RGPD, FACTUR-X, DSN automatisee. Verifiez les 4 obligations avant signature.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span><strong>Couts caches</strong> : materiel 1 000 a 3 000 € par poste, frais de paiement 1,2 a 2,5 % du CA, maintenance 50 a 150 €/an, renouvellement materiel tous les 4-5 ans.</span>
              </li>
            </ul>
          </section>

          {/* Section 11 — ROI */}
          <section id="roi" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">11. ROI : exemple chiffre sur 12 mois</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              Cas concret base sur un panel de 50 restaurants francais (G2 + interviews 2026) : restaurant indépendant, 80 couverts/jour, <strong>600 000 € CA annuel HT</strong>, 5 salaries.
            </p>
            <div className="bg-mono-1000 rounded-xl p-5 mb-4 font-mono text-sm text-mono-100 space-y-2">
              <div className="font-bold text-amber-400">AVANT (sans stack — Excel + caisse basique)</div>
              <div>Food cost a la louche : 33 % reel</div>
              <div>Pertes stock non detectees : 2 % CA = 12 000 €</div>
              <div>Heures admin : 18h/semaine (50 €/h fully loaded)</div>
              <div>Erreurs caisse : 0,8 % du CA = 4 800 €</div>
              <div>Marge nette : 4 % = 24 000 €</div>
              <div>---</div>
              <div className="font-bold text-emerald-400">APRES (stack a 350 €/mois = 4 200 €/an)</div>
              <div>Food cost pilote a 29,5 % : +21 000 €</div>
              <div>Pertes stock divisees par 2 : +6 000 €</div>
              <div>Heures admin : 6h/semaine (gain 12h x 50 x 52) : +31 200 €</div>
              <div>Erreurs caisse moins de 0,2 % : +3 600 €</div>
              <div>Gain brut : 61 800 € - 4 200 € (cout) = +57 600 €</div>
              <div className="font-bold text-emerald-400">ROI x13,7 sur 12 mois</div>
              <div>Marge nette : passe de 4 % a 13,6 %</div>
            </div>
            <p className="text-[#374151] leading-relaxed">
              Ces chiffres ne sont pas theoriques — ce sont les moyennes constatees sur le panel. Le gain le plus important n est pas les marges (21 000 €) mais le temps administratif libere (31 200 €). C est ce qui permet au restaurateur de se reconcentrer sur la salle, la cuisine et la strategie.
            </p>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">Questions frequentes — logiciel de gestion restaurant</h2>
            </div>
            <div className="space-y-4">
              {faqItems.map(({ question, answer }) => (
                <details key={question} className="border border-mono-900 rounded-xl p-5 group">
                  <summary className="font-semibold text-mono-100 cursor-pointer flex items-center justify-between gap-3">
                    <span>{question}</span>
                    <span className="text-teal-600 group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <p className="text-mono-400 text-sm leading-relaxed mt-3">{answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-10 text-center text-white shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Testez RestauMargin sans engagement</h2>
            <p className="text-teal-100 mb-6 text-base leading-relaxed max-w-2xl mx-auto">
              Connectez votre caisse, importez vos factures fournisseurs, calculez food cost et prime cost en temps reel. Version gratuite a vie pour les indépendants, essai 7 jours sans CB pour les fonctions Pro.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors"
            >
              Essayer RestauMargin 7 jours <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="footer" />

          {/* Articles connexes */}
          <section className="mt-12">
            <h3 className="text-lg font-bold text-mono-100 mb-4">A lire aussi</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link to="/blog/logiciel-caisse-enregistreuse-restaurant" className="block border border-mono-900 rounded-xl p-4 hover:border-teal-500 transition-colors">
                <p className="text-xs font-semibold text-teal-600 uppercase mb-1">Comparatif</p>
                <p className="font-semibold text-mono-100">Logiciel de caisse restaurant : guide 2026</p>
              </Link>
              <Link to="/blog/calcul-marge-restaurant" className="block border border-mono-900 rounded-xl p-4 hover:border-teal-500 transition-colors">
                <p className="text-xs font-semibold text-teal-600 uppercase mb-1">Guide</p>
                <p className="font-semibold text-mono-100">Calcul marge restaurant : formules et exemples</p>
              </Link>
              <Link to="/blog/reduire-food-cost" className="block border border-mono-900 rounded-xl p-4 hover:border-teal-500 transition-colors">
                <p className="text-xs font-semibold text-teal-600 uppercase mb-1">Food cost</p>
                <p className="font-semibold text-mono-100">Food cost restaurant : comment le calculer</p>
              </Link>
              <Link to="/blog/inventaire-restaurant-guide" className="block border border-mono-900 rounded-xl p-4 hover:border-teal-500 transition-colors">
                <p className="text-xs font-semibold text-teal-600 uppercase mb-1">Stocks</p>
                <p className="font-semibold text-mono-100">Inventaire restaurant : methode FIFO</p>
              </Link>
            </div>
          </section>

          {/* Nav bas */}
          <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
            <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
            <Link to="/outils/calculateur-food-cost" className="text-sm text-teal-600 hover:underline">Calculateur food cost gratuit →</Link>
          </div>

        </article>
      </main>
    </div>
  );
}
