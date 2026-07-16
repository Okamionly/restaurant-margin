import { Link } from 'react-router-dom';
import { ChefHat, Cpu, ShieldCheck, Layers, Zap, BarChart3, ArrowRight, BookOpen, AlertTriangle, CheckCircle, Award, Star, Users, Calculator } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Logiciel de caisse restaurant : comparatif 2026"
   Mot-cles principaux : logiciel caisse restaurant, meilleur logiciel restaurant,
   comparatif logiciel restaurant
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quel est le meilleur logiciel de caisse pour restaurant en 2026 ?",
    answer: "Il n'existe pas de meilleur logiciel de caisse pour restaurant en absolu : tout depend de votre format. Pour un restaurant indépendant traditionnel ou de bistronomie, Zelty offre le meilleur compromis prix-fonctionnalites-ecosysteme francais (49-89 €/mois). Pour un food truck ou un snack, SumUp POS suffit largement (39 €/mois). Pour une chaine ou du fast casual, Innovorder ou Lightspeed Restaurant sont incontournables. Pour la pilotage des marges en complement de la caisse, RestauMargin se branche sur n'importe quelle caisse via export CSV."
  },
  {
    question: "Faut-il acheter ou louer son materiel de caisse ?",
    answer: "La location-financement (LOA ou LLD) est dominante en 2026 : 50 a 100 €/mois pour un kit complet (terminal iPad ou Android + tiroir-caisse + imprimante thermique + douchette code-barres). Achat direct possible chez SumUp, Zettle, Square ou Cashpad pour 250 a 450 € selon le kit. L'achat est plus rentable au-dela de 24 mois, mais la location inclut souvent maintenance et remplacement materiel."
  },
  {
    question: "Une caisse iPad est-elle aussi fiable qu'un terminal dedie ?",
    answer: "Oui, en 2026, la fiabilite est equivalente. La quasi-totalite des leaders du marche (Zelty, L'Addition, Lightspeed, Cashpad, Tiller/SumUp) tournent sur iPad ou tablette Android. La fiabilite depend surtout de trois facteurs : une connexion internet stable (fibre conseillee), une box 4G de secours, et un onduleur sur la caisse principale. Le terminal dedie type Casio TE-7000 reste plus robuste en cuisine mais moins flexible et plus cher a la migration."
  },
  {
    question: "Combien de temps pour migrer d'une caisse a une autre ?",
    answer: "Comptez 2 a 4 semaines pour une migration propre : import du catalogue produits, parametrage TVA et categories, formation des equipes (2-4h par utilisateur), periode de test parallele (1 semaine), bascule definitive. La premiere semaine de fermeture estivale ou de conges hivernaux est le classique pour eviter les pertes d'exploitation. Prevoyez 500 a 1500 € de prestation d'integration selon l'editeur."
  },
  {
    question: "Mon expert-comptable peut-il imposer un logiciel precis ?",
    answer: "Non, votre expert-comptable n'a pas le droit d'imposer un logiciel de caisse. En revanche, il peut facturer plus cher si votre caisse n'exporte pas un Fichier des Ecritures Comptables (FEC) propre au format DGFiP. Verifiez systematiquement la compatibilite avant de signer : Pennylane, Tiime, Cegid Loop, ACD ou Sage accueillent l'export FEC de tous les leaders. Demandez un test d'export avant signature."
  },
  {
    question: "Qu'est-ce que la certification NF525 et est-elle obligatoire ?",
    answer: "La norme NF525 est une certification AFNOR pour les logiciels de caisse, attestant des fonctions d'inalterabilite, de securisation, de conservation et d'archivage des donnees. Depuis le 1er janvier 2018 (article 88 de la LFI 2016), tout assujetti a la TVA qui utilise un logiciel de caisse doit detenir soit une attestation de l'editeur, soit un certificat NF525 delivre par un organisme accredite. Le defaut de conformite expose a une amende de 7 500 € par caisse non conforme."
  },
  {
    question: "Quelle caisse pour un restaurant qui ouvre en 2026 ?",
    answer: "Pour un restaurant indépendant qui ouvre en 2026, trois choix tiennent la route : Zelty pour un bistronomie ou traditionnel (compromis prix-fonctionnalites optimal), SumUp POS pour un food truck ou un concept itinerant (cout d'entree le plus bas), Cashpad pour un restaurant qui veut une solution francaise avec une UX moderne. Evitez les solutions trop low-cost sans connecteur Deliveroo/Uber Eats : vous le payerez en double-saisie."
  },
  {
    question: "Combien coute un logiciel de caisse pour restaurant ?",
    answer: "Les fourchettes en 2026 : entree de gamme 29-49 €/mois (SumUp, Zettle, Hiboutik), milieu de gamme 49-99 €/mois (Zelty, L'Addition, Cashpad, Square), haut de gamme 99-249 €/mois (Lightspeed Restaurant, Innovorder, Toast). A cela il faut ajouter le materiel (50-100 €/mois en location ou 1000-3000 € a l'achat), les frais de paiement carte bancaire (1,2 a 2,5 %), et eventuellement les modules complementaires (livraison, fidelite, reservation)."
  },
  {
    question: "Toast et Square sont-ils disponibles en France ?",
    answer: "Square Restaurant est disponible en France depuis 2021 avec une offre limitee (pas de NF525 native sur tous les modules — verifier au cas par cas). Toast reste principalement americain en 2026 et n'est pas adapte au marche francais (pas de NF525, pas d'integration Deliveroo France native, support en anglais). Pour la restauration francaise, privilegiez les editeurs francais (Zelty, L'Addition, Cashpad, Innovorder, Tiller/SumUp) ou europeens etablis (Lightspeed, Zettle)."
  },
  {
    question: "Un logiciel de caisse calcule-t-il les marges automatiquement ?",
    answer: "Tres rarement de maniere complete. La caisse vous dit combien vous vendez : elle ne croise pas les ventes avec les couts d'achat des matieres premieres ni avec les fiches techniques precises. Pour piloter votre marge brute par plat et votre food cost reel, il faut soit un module marges integre (rare et basique chez les editeurs POS), soit un logiciel specialise comme RestauMargin qui se branche en aval de la caisse via import CSV. C'est la difference entre savoir ce qu'on vend et savoir ce qu'on gagne."
  },
  {
    question: "Que se passe-t-il en cas de coupure internet ?",
    answer: "Les bonnes solutions disposent d'un mode offline (cache local) qui permet de continuer a prendre des commandes et a encaisser meme sans internet. La synchronisation se fait automatiquement au retour de la connexion. Verifiez ce point avant de signer — c'est critique en zone rurale ou pour les food trucks. Zelty, L'Addition, Lightspeed et Cashpad gerent le mode offline ; certaines solutions cloud uniquement (Square sur certains modules) bloquent en cas de coupure."
  },
  {
    question: "Comment integrer ma caisse a Deliveroo, Uber Eats et Just Eat ?",
    answer: "Trois approches : (1) l'integration native incluse dans la caisse (Zelty, Innovorder, L'Addition la proposent en standard), (2) un middleware specialise comme Deliverect ou Otter qui consolide toutes les plateformes (49-149 €/mois), (3) le double-ecran manuel — a eviter, source d'erreurs et de pertes de temps. Le ROI de l'integration native ou via middleware est tres rapide des que vous depassez 30 commandes livraison par semaine."
  }
];

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
  { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
  { name: 'Logiciel de caisse restaurant', url: 'https://www.restaumargin.fr/blog/logiciel-caisse-enregistreuse-restaurant' },
]);

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment choisir un logiciel de caisse pour restaurant en 7 etapes',
  description: 'Methode structuree pour selectionner un logiciel de caisse conforme NF525 adapte a votre format de restaurant.',
  totalTime: 'PT30M',
  tool: ['Cahier des charges', 'Comparatif fournisseurs', 'Tableau Excel ou Notion'],
  step: [
    { '@type': 'HowToStep', name: 'Definir votre format et votre volume', text: 'Bistrot 30 couverts, brasserie 80 couverts, fast casual 200 commandes/jour ou multi-sites : chaque format appelle une categorie de solution. Le volume conditionne directement le tarif et les fonctionnalites requises.' },
    { '@type': 'HowToStep', name: 'Lister les canaux de vente', text: 'Sur place uniquement ou + livraison Deliveroo/Uber Eats/Just Eat, click and collect, QR code a table, bornes self-service ? Plus vous avez de canaux, plus l integration native devient critique.' },
    { '@type': 'HowToStep', name: 'Verifier la certification NF525', text: 'Exigez un certificat NF525 a jour ou une attestation editeur conforme article 286-I-3 bis du CGI. Sans, vous risquez 7 500 € d amende par caisse. Demandez le numero de certification.' },
    { '@type': 'HowToStep', name: 'Verifier l export FEC et la compatibilite expert-comptable', text: 'Exigez un export Fichier des Ecritures Comptables (FEC) au format DGFiP. Verifiez aussi la compatibilite directe avec votre logiciel comptable (Pennylane, Tiime, Sage, Cegid).' },
    { '@type': 'HowToStep', name: 'Tester en demo reelle avec votre carte', text: 'Refusez les demos pre-machees : demandez un acces test avec votre vraie carte (10-30 produits), votre vraie TVA, vos vrais menus. Vous decouvrirez les frictions reelles.' },
    { '@type': 'HowToStep', name: 'Comparer le cout total (TCO) sur 3 ans', text: 'Additionnez : abonnement mensuel x 36 + materiel achete ou loue + frais de paiement (1,2 a 2,5 % du CA) + modules complementaires + cout de formation. Un logiciel a 49 €/mois peut couter plus cher qu un autre a 89 €/mois sur 3 ans.' },
    { '@type': 'HowToStep', name: 'Lancer un test parallele avant la bascule', text: 'Pendant 1 semaine, faites tourner l ancienne caisse et la nouvelle en parallele sur un service. Vous detecterez les ecarts de ticket moyen, les bugs de menus complexes et les angles morts de la migration.' },
  ],
};

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'RestauMargin',
  description: 'Logiciel de pilotage des marges et du food cost pour restaurant. Se connecte a votre logiciel de caisse pour transformer vos donnees de ventes en marge nette pilotable.',
  brand: { '@type': 'Brand', name: 'RestauMargin' },
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'EUR',
    lowPrice: '0',
    highPrice: '49',
    offerCount: '3',
    offers: [
      { '@type': 'Offer', name: 'Gratuit', price: '0', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Starter', price: '19', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Pro', price: '49', priceCurrency: 'EUR' },
    ],
  },

};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Logiciel de caisse restaurant : comparatif 2026 (8 solutions, NF525, prix)',
  description: 'Comparatif complet des meilleurs logiciels de caisse pour restaurant en 2026 : Toast, Square, Lightspeed, Zelty, L Addition, Cashpad, SumUp, Tiller. Prix, fonctionnalites, NF525, integrations.',
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
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/logiciel-caisse-enregistreuse-restaurant' },
};

export default function BlogLogicielCaisse() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Logiciel de caisse restaurant : comparatif 2026 (8 solutions, NF525, prix)"
        description="Comparatif complet 2026 des logiciels de caisse pour restaurant : Toast, Square, Lightspeed, Zelty, L'Addition, Cashpad, SumUp, Tiller. Prix, fonctionnalites, NF525, integrations livraison."
        path="/blog/logiciel-caisse-enregistreuse-restaurant"
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
          <span className="text-mono-100 font-medium">Logiciel de caisse restaurant</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Outils"
        readTime="15 min"
        date="Avril 2026"
        title="Logiciel de caisse restaurant : comparatif 2026 des 8 meilleures solutions"
        accentWord="logiciel de caisse"
        subtitle="Toast, Square, Lightspeed, Zelty, L'Addition, Cashpad, SumUp, Tiller : le comparatif complet 2026. Prix, fonctionnalites, certification NF525, integrations livraison et pieges a eviter avant de signer."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* Encadre formule rapide / TL;DR */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">TL;DR — recommandations 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">Quel logiciel de caisse choisir selon votre profil ?</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div><strong className="text-white">Bistrot / bistronomie indépendant :</strong> Zelty (49-89 €/mois)</div>
            <div><strong className="text-white">Brasserie / restaurant traditionnel :</strong> L'Addition Pro (79 €) ou Cashpad (69 €)</div>
            <div><strong className="text-white">Fast casual / chaine :</strong> Innovorder (89-249 €) ou Lightspeed Pro (149 €)</div>
            <div><strong className="text-white">Food truck / snack itinerant :</strong> SumUp POS (39 €) ou Zettle (29 €)</div>
            <div><strong className="text-white">Restaurant gastronomique multi-sites :</strong> Lightspeed Restaurant (149-189 €)</div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Toutes ces solutions sont conformes NF525. Le choix se joue sur le format, le volume et les canaux de vente.
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
              { href: '#strategique', label: 'Pourquoi la caisse est strategique en 2026' },
              { href: '#nf525', label: 'NF525, loi anti-fraude TVA et obligations legales' },
              { href: '#criteres', label: 'Les 9 criteres pour choisir un logiciel de caisse' },
              { href: '#comparatif', label: 'Comparatif detaille de 8 solutions (Toast, Square, Lightspeed...)' },
              { href: '#tableau-prix', label: 'Tableau comparatif prix et fonctionnalites' },
              { href: '#leaders', label: 'Focus leaders FR : Zelty, L Addition, Cashpad' },
              { href: '#chaines', label: 'Solutions chaines : Lightspeed Restaurant, Innovorder' },
              { href: '#nomades', label: 'Solutions nomades : SumUp, Zettle, Tiller' },
              { href: '#int-livraison', label: 'Integrations Deliveroo / Uber Eats / Just Eat' },
              { href: '#materiel', label: 'Materiel et hardware : achat ou location ?' },
              { href: '#migration', label: 'Migrer d une caisse a une autre : checklist' },
              { href: '#integration', label: 'Connecter la caisse au calcul de marge' },
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
            <strong>90 % des decisions de pilotage d un restaurant se prennent a partir de donnees issues de la caisse.</strong> Et pourtant, plus d un restaurateur francais sur trois utilise encore un systeme qui n exporte pas ses donnees, ne se synchronise pas avec sa comptabilite, ou n est pas en regle avec la norme NF525. Ce <strong>comparatif logiciel restaurant 2026</strong> passe au crible les 8 solutions les plus utilisees en France : Toast, Square, Lightspeed Restaurant, Zelty, L Addition, Cashpad, iZettle (PayPal), Tiller (SumUp). Vous y trouverez les prix reels, les fonctionnalites differenciantes, les certifications, les pieges a eviter et la matrice de decision adaptee a votre format.
          </p>

          {/* Section 1 */}
          <section id="strategique" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">1. Pourquoi la caisse est strategique en 2026</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              Le logiciel de caisse n est plus un simple outil d encaissement. C est devenu le <strong>systeme nerveux central de votre restaurant</strong>. Tout transite par lui : les ventes par plat, la performance des serveurs, la rotation par table, les modes de paiement, les remises, les annulations, les flux livraison. Sans ces donnees, vous pilotez a l aveugle.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              Une etude G2 publiee en mars 2026 montre que les restaurants equipes d un POS moderne (Zelty, Lightspeed, Toast, Square) affichent en moyenne <strong>+12 % de ticket moyen</strong> et <strong>-23 % d erreurs de commande</strong> par rapport a ceux qui utilisent un terminal dedie ancien ou un systeme manuel. La difference vient des ventes additionnelles suggerees, des modificateurs precis (cuisson, allergenes) et de l envoi en cuisine fiabilise via KDS.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">Au-dela de la conformite, votre logiciel de caisse est :</p>
            <ul className="space-y-2 text-[#374151] mb-6">
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /><span>La <strong>source unique de verite</strong> de vos ventes (par plat, par serveur, par service, par heure)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /><span>Le <strong>declencheur de votre comptabilite</strong> (export FEC, journaux de vente)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /><span>Le <strong>coeur de votre pilotage marges</strong> (food cost, marge brute par plat, mix-margin)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /><span>Le <strong>hub omnicanal</strong> (sur place, click and collect, livraison, QR a table)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" /><span>Le <strong>cockpit RH</strong> (productivite serveurs, pourboires, plages horaires)</span></li>
            </ul>
            <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl p-5">
              <p className="text-sm font-semibold text-red-700 mb-1">Sans certification NF525 ou attestation editeur</p>
              <p className="text-sm text-red-700">Risque de 7 500 € d amende <strong>par caisse non conforme</strong> selon l article 1770 duodecies du Code general des impots. Le controle DGCCRF peut viser plusieurs caisses dans un meme etablissement.</p>
            </div>
          </section>

          {/* Section 2 — NF525 */}
          <section id="nf525" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">2. NF525, loi anti-fraude TVA et obligations legales</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              La norme NF525 a ete instauree par l <strong>article 88 de la Loi de Finances 2016</strong>, entree en vigueur au 1er janvier 2018, puis renforcee en 2024 par le decret n°2024-411 sur le controle DGCCRF. Elle impose a tout assujetti TVA utilisant un logiciel de caisse de detenir soit un <strong>certificat NF525 delivre par AFNOR</strong>, soit une <strong>attestation individuelle de l editeur</strong> conformement a l article 286-I-3 bis du CGI.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              Concretement, votre logiciel doit garantir quatre proprietes : <strong>inalterabilite</strong> (impossibilite de modifier une vente apres validation), <strong>securisation</strong> (chiffrement et tracabilite), <strong>conservation</strong> (archivage 6 ans minimum) et <strong>archivage</strong> (export FEC au format DGFiP).
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Sources reglementaires officielles :</strong>
            </p>
            <ul className="space-y-2 text-[#374151] mb-4 text-sm">
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span>DGFiP — Bulletin officiel des finances publiques (BOI-TVA-DECLA-30-10-30)</span></li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span>AFNOR — Referentiel NF525 (Z 70-001)</span></li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span>DGCCRF — Guide controle restaurants 2024</span></li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" /><span>Article 286-I-3 bis du Code general des impots (CGI)</span></li>
            </ul>
            <p className="text-[#374151] leading-relaxed">
              <strong>Astuce conformite :</strong> demandez systematiquement le <strong>numero de certificat NF525</strong> avant de signer. Verifiez-le sur le site AFNOR (nf-logiciel.afnor.org). Toutes les solutions du comparatif ci-dessous (Lightspeed, Zelty, L Addition, Cashpad, Innovorder, SumUp, Zettle, Square FR, Tiller) sont conformes. Toast US ne l est pas par defaut.
            </p>
          </section>

          {/* Section 3 — Criteres */}
          <section id="criteres" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">3. Les 9 criteres pour choisir un logiciel de caisse</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-5">
              Avant de comparer les solutions, formalisez vos exigences sur ces 9 criteres. Vous gagnerez 2 a 3 demonstrations inutiles.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                { num: '1', titre: 'Conformite NF525', desc: 'Certificat AFNOR ou attestation editeur. Non negociable.' },
                { num: '2', titre: 'Export FEC + comptable', desc: 'Format DGFiP + connecteur Pennylane, Tiime, Sage, Cegid.' },
                { num: '3', titre: 'Export CSV ventes detaillees', desc: 'Par plat, par jour, par service. Critique pour piloter les marges.' },
                { num: '4', titre: 'Integrations livraison', desc: 'Deliveroo, Uber Eats, Just Eat natives ou via middleware.' },
                { num: '5', titre: 'Mode offline', desc: 'Continuer a encaisser sans internet. Critique en zone rurale.' },
                { num: '6', titre: 'Plan de salle + KDS', desc: 'Visualisation tables + ecran cuisine pour la chauffe.' },
                { num: '7', titre: 'Gestion utilisateurs', desc: 'Droits differencies serveurs, managers, comptable. Cloisonnement caisse.' },
                { num: '8', titre: 'Reporting et analytics', desc: 'Ventes par heure, par produit, comparaison N-1, cohortes.' },
                { num: '9', titre: 'API ouverte', desc: 'Connexions futures (RestauMargin, fidelite, RH). Webhook + REST.' },
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

          {/* Section 4 — Comparatif detaille */}
          <section id="comparatif" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">4. Comparatif detaille des 8 solutions</h2>
            </div>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">Toast — non disponible serieusement en France</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Leader americain (60 % de parts de marche US), Toast n a pas franchi le pas francais en 2026. Pas de certification NF525, support uniquement anglais, integrations Deliveroo France absentes. <strong>A oublier pour la restauration FR.</strong> Reservez Toast a un projet aux Etats-Unis ou au Canada.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">Square Restaurant — 0 a 89 €/mois + commissions</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Disponible en France depuis 2021, Square Restaurant propose une offre gratuite (sans frais d abonnement, 1,75 % par transaction CB) et des plans Plus a 89 €/mois. Hardware compact, UX moderne. <strong>Limite</strong> : NF525 partielle selon modules, pas de connecteur Deliveroo France natif, support telephonique en horaires US. Bon choix pour un food truck ou un concept simple, pas pour un restaurant complexe.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">Lightspeed Restaurant — 69 a 189 €/mois</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              La <strong>Rolls des caisses</strong> pour restaurant etabli ou multi-sites. Cloud natif, multi-etablissements en standard, module stocks solide, reporting avance (cohortes, ventes par heure, marge par plat basique). Integrations livraison via partenaire Lightspeed Delivery Connect. Plans : Essentials 69 €, Plus 149 €, Pro 189 €. <strong>Limite</strong> : cout eleve pour un independant, courbe d apprentissage de 2-3 semaines.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">Zelty — 49 a 89 €/mois</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Le meilleur compromis pour 80 % des restaurants francais indépendants en 2026.</strong> Editeur 100 % francais, support FR reactif (chat + telephone), click and collect natif inclus, connecteurs Deliveroo / Uber Eats / Just Eat / Frichti en standard, app iPad rapide. Plans : Light 49 €, Pro 79 €, Premium 89 €. <strong>Limite</strong> : hardware impose (iPad uniquement), pas de version Android.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">L Addition — 39 a 89 €/mois</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Tres simple a prendre en main (30 minutes de formation suffisent pour un serveur), tarif d entree attractif. <strong>Rachete par Zelty en 2023</strong>, l avenir produit converge avec Zelty — les nouvelles fonctionnalites arrivent en priorite sur Zelty puis sont retroportees. Bon choix pour demarrer simple, surtout pour un repreneur qui veut un changement de caisse rapide sans formation lourde.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">Cashpad — 39 a 79 €/mois</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Solution francaise montante en 2026. UX moderne, interface tactile fluide, plan de salle premium, gestion serveurs et pourboires native. Integrations Deliveroo et Uber Eats. Connecteurs Pennylane et Tiime directs. Tres bon rapport qualite-prix, surtout pour un brasserie / bistronomie de 50-120 couverts.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">SumUp POS (ex-Tiller) — 39 €+/mois + commissions 1,49-2,75 %</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Hardware tout-en-un (terminal de paiement + caisse + imprimante 80 mm integree), mise en route en 1 journee, pas d engagement long. <strong>Parfait pour demarrer ou pour un food truck.</strong> Tiller a ete rachete par SumUp en 2021 et integre dans la suite SumUp POS. <strong>Limite</strong> : a l etroit des qu on depasse 60 couverts/service ou des qu on a plus de 3 serveurs simultanes.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">iZettle Pro (PayPal) — 29 a 59 €/mois + 1,75 %</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Cout d entree le plus bas du marche. Hardware compact (terminal Zettle Reader 2), integration PayPal et Stripe natives, app iPad et Android. Excellent pour activites saisonnieres, marches estivaux, evenementiel. <strong>Limite</strong> : pas pour un restaurant traditionnel a 200 couverts par service, plan de salle limite, integrations livraison absentes.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mt-6 mb-2">Innovorder — 89 a 249 €/mois</h3>
            <p className="text-[#374151] leading-relaxed">
              Specialiste de la <strong>restauration omnicanal et chaines</strong>. Bornes de commande self-service, kiosks digitaux, click and collect tres matures, module KDS (Kitchen Display System) puissant, integration Deliveroo et Uber Eats native. Tres utilise par les chaines de fast casual (Five Guys, Bagelstein, Big Fernand). <strong>Surdimensionne pour un independant traditionnel.</strong>
            </p>
          </section>

          {/* Section 5 — Tableau comparatif */}
          <section id="tableau-prix" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">5. Tableau comparatif prix et fonctionnalites</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-5">
              Synthese des 8 solutions analysees. Prix indicatifs hors taxe pour 1 caisse, sans materiel. Sources : G2 (mars 2026), Capterra (avril 2026), demos editeurs.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-mono-900 mb-6">
              <table className="w-full text-sm">
                <thead className="bg-mono-1000 text-mono-100">
                  <tr>
                    <th className="text-left p-3 font-semibold">Solution</th>
                    <th className="text-left p-3 font-semibold">Prix /mois</th>
                    <th className="text-left p-3 font-semibold">NF525</th>
                    <th className="text-left p-3 font-semibold">Deliveroo</th>
                    <th className="text-left p-3 font-semibold">Offline</th>
                    <th className="text-left p-3 font-semibold">Note G2</th>
                  </tr>
                </thead>
                <tbody className="text-[#374151]">
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>Lightspeed</strong></td><td className="p-3">69-189 €</td><td className="p-3">Oui</td><td className="p-3">Connect</td><td className="p-3">Oui</td><td className="p-3">4,4 / 5</td>
                  </tr>
                  <tr className="border-t border-mono-900 bg-emerald-50/30">
                    <td className="p-3"><strong>Zelty</strong></td><td className="p-3">49-89 €</td><td className="p-3">Oui</td><td className="p-3">Natif</td><td className="p-3">Oui</td><td className="p-3">4,6 / 5</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>L Addition</strong></td><td className="p-3">39-89 €</td><td className="p-3">Oui</td><td className="p-3">Natif</td><td className="p-3">Oui</td><td className="p-3">4,3 / 5</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>Cashpad</strong></td><td className="p-3">39-79 €</td><td className="p-3">Oui</td><td className="p-3">Natif</td><td className="p-3">Oui</td><td className="p-3">4,5 / 5</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>Innovorder</strong></td><td className="p-3">89-249 €</td><td className="p-3">Oui</td><td className="p-3">Natif</td><td className="p-3">Oui</td><td className="p-3">4,2 / 5</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>SumUp / Tiller</strong></td><td className="p-3">39 €+</td><td className="p-3">Oui</td><td className="p-3">Partiel</td><td className="p-3">Oui</td><td className="p-3">4,0 / 5</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>iZettle</strong></td><td className="p-3">29-59 €</td><td className="p-3">Oui</td><td className="p-3">Non</td><td className="p-3">Partiel</td><td className="p-3">3,9 / 5</td>
                  </tr>
                  <tr className="border-t border-mono-900">
                    <td className="p-3"><strong>Square FR</strong></td><td className="p-3">0-89 €</td><td className="p-3">Partiel</td><td className="p-3">Non</td><td className="p-3">Oui</td><td className="p-3">4,1 / 5</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-mono-400 italic">
              Sources : <a href="https://www.g2.com/categories/restaurant-pos" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">G2 — Restaurant POS</a>, <a href="https://www.capterra.fr/directory/30900/restaurant-pos/software" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Capterra France — Logiciels de caisse restaurant</a>, demos editeurs avril 2026.
            </p>
          </section>

          {/* Section 6 — Focus leaders FR */}
          <section id="leaders" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">6. Focus leaders FR : Zelty, L Addition, Cashpad</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              Pour un restaurant indépendant francais traditionnel ou bistronomie, ce sont les trois solutions a court-lister. Toutes francaises, NF525 certifies, integrations Deliveroo natives, exports FEC propres, supports FR.
            </p>
            <ul className="space-y-3 text-[#374151] mb-4">
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" /><span><strong>Zelty</strong> est le choix par defaut si vous voulez l ecosysteme le plus complet et le plus connecte. C est celui que recommandent le plus souvent les experts-comptables familiers de la restauration.</span></li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" /><span><strong>L Addition</strong> est le choix de la simplicite et du tarif d entree (39 €/mois). Parfait pour un solo qui n a pas besoin de modules avances.</span></li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" /><span><strong>Cashpad</strong> est l outsider montant, avec une UX moderne tres apprecie des restaurateurs moins de 40 ans. A surveiller, surtout pour ses futures integrations marges.</span></li>
            </ul>
            <p className="text-[#374151] leading-relaxed">
              Pour piloter les marges en complement de l une de ces trois caisses, <Link to="/login" className="text-teal-600 hover:underline font-semibold">RestauMargin</Link> se branche via export CSV ou API. Le calcul food cost et marge brute par plat s effectue automatiquement chaque matin a partir des ventes de la veille — sans aucune ressaisie.
            </p>
          </section>

          {/* Section 7 — Solutions chaines */}
          <section id="chaines" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">7. Solutions chaines : Lightspeed Restaurant et Innovorder</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              Pour un groupe multi-sites ou un fast casual qui industrialise, deux options serieuses :
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Lightspeed Restaurant Pro (149-189 €/mois)</strong> est la solution premium pour les groupes de 3 a 50 etablissements. Centralisation des menus, consolidation des reportings, gestion multi-TVA, pilotage par franchise. Excellent pour la bistronomie premium et les groupes restauration urbaine.
            </p>
            <p className="text-[#374151] leading-relaxed">
              <strong>Innovorder (89-249 €/mois)</strong> est la <strong>reference du fast casual omnicanal</strong>. Bornes self-service, kiosk digital, KDS cuisine puissant, click and collect mature. Utilise par les plus grandes chaines francaises (Five Guys, Big Fernand, Bagelstein, Eat Salad). Si vous industrialiser et que les bornes self-service sont au coeur de votre experience, Innovorder est le choix.
            </p>
          </section>

          {/* Section 8 — Nomades */}
          <section id="nomades" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">8. Solutions nomades : SumUp, Zettle, Tiller</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              Pour un food truck, un snack saisonnier, un concept itinerant ou un point de vente eveneementiel, trois solutions tiennent la route :
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>SumUp POS (ex-Tiller)</strong> reste le standard. Hardware compact, batterie autonome, 4G integree sur certains modeles. Le kit Tiller Air (terminal + caisse + imprimante 80 mm + tiroir-caisse) sort autour de 550 € en achat, ou 39 €/mois en location.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Zettle by PayPal</strong> propose les commissions les plus basses du marche (1,75 % par transaction). Hardware Zettle Reader 2 a 79 € one-shot, app iPad ou Android gratuite. Parfait pour demarrer.
            </p>
            <p className="text-[#374151] leading-relaxed">
              <strong>Square Reader</strong> reste pertinent pour un solo qui encaisse moins de 5 000 €/mois (offre gratuite, commission 1,75 %). Au-dela, les editeurs francais reprennent l avantage par leurs integrations livraison et leur SAV en francais.
            </p>
          </section>

          {/* Section 9 — Integrations livraison */}
          <section id="int-livraison" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-pink-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">9. Integrations Deliveroo, Uber Eats et Just Eat</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              En 2026, la <strong>livraison represente 15 a 35 % du CA</strong> selon les formats. Une integration native ou via middleware est devenue critique pour eviter la double-saisie (source d erreurs et de perte de temps).
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Solutions avec integration native</strong> (Deliveroo + Uber Eats + Just Eat) : Zelty, L Addition, Cashpad, Innovorder. Aucun middleware n est necessaire — les commandes arrivent directement dans la caisse.
            </p>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Solutions avec middleware</strong> : Lightspeed Restaurant (via Lightspeed Delivery Connect), Square (via Otter ou Deliverect), iZettle (via Deliverect). Comptez 49 a 149 €/mois supplementaires pour le middleware.
            </p>
            <p className="text-[#374151] leading-relaxed">
              Le ROI d une integration livraison est tres rapide : a partir de 30 commandes plateformes par semaine, vous economisez 8 a 12 heures par mois sur la double-saisie, soit 200 a 300 € de cout salarial.
            </p>
          </section>

          {/* Section 10 — Materiel */}
          <section id="materiel" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">10. Materiel et hardware : achat ou location ?</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              Le hardware represente souvent un budget plus important que le logiciel sur les 3 premieres annees.
            </p>
            <div className="bg-mono-1000 rounded-xl p-5 mb-4 text-sm space-y-2 text-[#374151]">
              <p><strong>Kit complet typique (iPad 10,2 + tiroir-caisse + imprimante 80 mm + douchette code-barres + support iPad)</strong></p>
              <p>Achat one-shot : 900 a 1 800 € HT</p>
              <p>Location-financement (LOA) 36 mois : 45 a 90 €/mois</p>
              <p>Location longue duree (LLD) avec maintenance incluse : 60 a 120 €/mois</p>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Recommandation 2026 :</strong> achat one-shot si vous prevoyez de garder le materiel 4+ ans (rentable des le mois 24). Location-financement si vous voulez preserver votre tresorerie et lisser la depense. LLD si vous voulez la tranquillite et le remplacement materiel inclus.
            </p>
            <p className="text-[#374151] leading-relaxed">
              <strong>Hardware critique a ne pas negliger :</strong> onduleur (UPS) sur la caisse principale (50-150 €), box 4G de secours (20-40 €/mois), routeur Wi-Fi double-bande professionnel (200-400 €). Ces trois elements vous evitent les pertes d exploitation en cas de coupure.
            </p>
          </section>

          {/* Section 11 — Migration */}
          <section id="migration" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">11. Migrer d une caisse a une autre : checklist</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              La migration est souvent <strong>plus longue qu annonce</strong>. Comptez 2 a 4 semaines de bout en bout :
            </p>
            <ol className="space-y-3 text-[#374151] mb-4">
              <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span><span><strong>Export du catalogue de l ancienne caisse</strong> (CSV ou Excel). Verifiez la coherence des codes produits.</span></li>
              <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span><span><strong>Import dans la nouvelle caisse</strong>. Allouez 4-8h selon la complexite du menu.</span></li>
              <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span><span><strong>Parametrage TVA, modificateurs, menus complexes</strong>. C est ici que les pieges apparaissent.</span></li>
              <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">4</span><span><strong>Formation des equipes</strong> (2-4h par utilisateur). Designez un referent par site.</span></li>
              <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">5</span><span><strong>Test parallele sur 1 semaine</strong>. Comparez les tickets moyens, detectez les ecarts.</span></li>
              <li className="flex items-start gap-2"><span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">6</span><span><strong>Bascule definitive</strong> souvent un lundi apres fermeture dimanche, ou pendant une semaine de fermeture estivale.</span></li>
            </ol>
            <p className="text-[#374151] leading-relaxed">
              Prevoyez 500 a 1 500 € de prestation d integration si vous deleguez. La plupart des editeurs francais (Zelty, L Addition, Cashpad) incluent l onboarding dans le tarif d abonnement la premiere annee.
            </p>
          </section>

          {/* Section 12 — Integration RestauMargin */}
          <section id="integration" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">12. Connecter la caisse au calcul de marge</h2>
            </div>
            <p className="text-[#374151] leading-relaxed mb-4">
              <strong>Posseder une excellente caisse ne suffit pas.</strong> La caisse vous dit combien vous vendez ; elle ne vous dit <em>pas</em> combien vous gagnez. Pour passer du CA a la marge nette, il faut croiser les ventes avec :
            </p>
            <ul className="space-y-2 text-[#374151] mb-5">
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" /><span>Les <Link to="/blog/fiche-technique-cuisine-restaurant" className="text-teal-600 hover:underline">fiches techniques</Link> (composition exacte de chaque plat)</span></li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" /><span>Les couts d achat actualises (factures fournisseurs)</span></li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" /><span>Le <Link to="/blog/food-cost-restaurant-comment-calculer" className="text-teal-600 hover:underline">food cost</Link> reel (mesure du cout matieres)</span></li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" /><span>Le <Link to="/blog/inventaire-restaurant" className="text-teal-600 hover:underline">stock reel</Link> et les pertes (gaspillage, casse, offerts)</span></li>
            </ul>
            <p className="text-[#374151] leading-relaxed mb-4"><strong>Workflow type avec RestauMargin :</strong></p>
            <div className="bg-mono-1000 rounded-xl p-5 mb-4 font-mono text-sm text-mono-100 space-y-1">
              <div>1. Soir → caisse exporte CSV ventes (ou API si supportee)</div>
              <div>2. RestauMargin importe + croise fiches techniques + factures</div>
              <div>3. Matin → dashboard food cost veille + alertes derive prix</div>
              <div>4. Decisions operationnelles sur donnees fiables, pas a la louche</div>
            </div>
            <p className="text-[#374151] leading-relaxed">
              <Link to="/blog/calcul-marge-restaurant" className="text-teal-600 hover:underline">Le guide complet du calcul de marge restaurant</Link> detaille la methode pas a pas, avec des exemples chiffres sur la pizza margherita, l entrecote grillee et le menu du jour.
            </p>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-mono-100">Questions frequentes — logiciel de caisse restaurant</h2>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Vos donnees de caisse meritent un outil qui les transforme en marge</h2>
            <p className="text-teal-100 mb-6 text-base leading-relaxed max-w-2xl mx-auto">
              RestauMargin s integre avec votre logiciel de caisse pour calculer automatiquement food cost, marge brute par plat et alertes en temps reel. Version gratuite a vie pour les indépendants.
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
              <Link to="/blog/logiciel-gestion-restaurant" className="block border border-mono-900 rounded-xl p-4 hover:border-teal-500 transition-colors">
                <p className="text-xs font-semibold text-teal-600 uppercase mb-1">Comparatif</p>
                <p className="font-semibold text-mono-100">Logiciel de gestion restaurant : guide 2026</p>
              </Link>
              <Link to="/blog/calcul-marge-restaurant" className="block border border-mono-900 rounded-xl p-4 hover:border-teal-500 transition-colors">
                <p className="text-xs font-semibold text-teal-600 uppercase mb-1">Guide</p>
                <p className="font-semibold text-mono-100">Calcul marge restaurant : formules et exemples</p>
              </Link>
              <Link to="/blog/food-cost-restaurant-comment-calculer" className="block border border-mono-900 rounded-xl p-4 hover:border-teal-500 transition-colors">
                <p className="text-xs font-semibold text-teal-600 uppercase mb-1">Food cost</p>
                <p className="font-semibold text-mono-100">Food cost restaurant : comment le calculer</p>
              </Link>
              <Link to="/blog/inventaire-restaurant" className="block border border-mono-900 rounded-xl p-4 hover:border-teal-500 transition-colors">
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
