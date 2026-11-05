import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Building2, Calculator, CheckCircle, ChefHat, ClipboardList, Scale, Target, XCircle, Zap } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Comparatif SEO — "Alternative à Inpulse"
   Mot-clé principal : alternative inpulse
   Mots-clés secondaires : inpulse restaurant prix, inpulse vs, logiciel food cost indépendant

   Faits sur Inpulse relevés le 2026-11-05 sur inpulse.ai (tarifs, intégrations,
   accueil). Faits sur RestauMargin relevés dans le code (api/index.ts,
   Pricing.tsx, MenuEngineering.tsx). Pas de connecteur de caisse ni de prévision
   par produit côté RestauMargin : c'est écrit, ne pas l'adoucir.
   ═══════════════════════════════════════════════════════════════ */

const INPULSE_TARIFS = 'https://en.inpulse.ai/tarifs';
const INPULSE_INTEGRATIONS = 'https://www.inpulse.ai/integrations';

const faqItems = [
  {
    question: "Quel est le prix d'Inpulse ?",
    answer: "Inpulse ne publie aucun prix sur sa page tarifs au 5 novembre 2026 : elle présente trois offres (Starter, Scale, Enterprise) et renvoie vers un échange commercial. Le montant dépend donc d'un devis. RestauMargin affiche un tarif unique de 19 € par mois, avec un essai de 7 jours sans carte bancaire.",
  },
  {
    question: "RestauMargin remplace-t-il Inpulse ?",
    answer: "Pas pour tout le monde. RestauMargin couvre les fiches techniques, le food cost, la mercuriale, la lecture des factures, l'inventaire et les commandes fournisseurs par e-mail. Il ne fait ni prévision de ventes par produit, ni planning de production, ni commande EDI, ni connexion directe à la caisse. Si votre réseau repose sur ces fonctions, Inpulse reste le bon choix.",
  },
  {
    question: "RestauMargin se connecte-t-il à ma caisse comme Inpulse ?",
    answer: "Non, RestauMargin ne propose pas de connecteur direct de caisse. Pour l'analyse de la carte, vous exportez vos ventes depuis votre caisse puis vous collez les données au format CSV dans le module d'ingénierie de menu. Inpulse, lui, liste de nombreuses caisses et agrégateurs connectés sur sa page intégrations.",
  },
  {
    question: "Inpulse est-il adapté à un restaurant indépendant ?",
    answer: "Inpulse se présente comme une plateforme destinée aux chaînes de restaurants et de boulangeries, mais son formulaire de contact prévoit aussi la tranche de 1 à 3 points de vente. Un indépendant peut donc le solliciter. La vraie question est de savoir si vous utiliserez les prévisions et l'automatisation au point de justifier un outil pensé pour le réseau.",
  },
  {
    question: "Quelle différence entre le food cost de RestauMargin et celui d'Inpulse ?",
    answer: "RestauMargin part de vos fiches techniques et des prix de vos factures pour calculer le coût et la marge de chaque plat. Inpulse relie en plus les ventes de caisse, les achats et les inventaires pour analyser automatiquement les écarts de consommation entre théorie et réalité, ce qui demande une connexion de caisse et une discipline d'inventaire régulière.",
  },
  {
    question: "Peut-on gérer plusieurs restaurants avec RestauMargin ?",
    answer: "Oui, plusieurs établissements peuvent être rattachés à un seul compte, sans supplément : l'offre à 19 € par mois est la même pour un ou plusieurs sites. Pour un réseau qui a besoin de droits avancés, de multi-devises, de plusieurs fuseaux horaires ou d'un chef de projet dédié, l'offre Enterprise d'Inpulse répond mieux.",
  },
  {
    question: "Y a-t-il un essai gratuit chez Inpulse et chez RestauMargin ?",
    answer: "RestauMargin propose un essai de 7 jours sans carte bancaire et sans engagement. Sur son site, Inpulse met en avant la demande de démonstration et la prise de rendez-vous avec un expert. Nous n'avons pas trouvé d'essai libre annoncé sur ses pages publiques au 5 novembre 2026 : demandez-le lors de l'échange commercial.",
  },
  {
    question: "Faut-il une balance connectée pour utiliser RestauMargin ?",
    answer: "Non. Les fiches techniques se remplissent au clavier, à la voix ou à partir de vos factures. La station de pesée, qui associe une tablette et une balance Bluetooth, reste une option de confort pour peser les ingrédients directement en cuisine.",
  },
  {
    question: "Comment récupérer mes recettes si je quitte un autre logiciel ?",
    answer: "Commencez par demander à votre éditeur actuel un export de vos fiches recettes et de vos mercuriales. Sur RestauMargin, les prix d'un fournisseur s'importent au format CSV et l'assistant IA aide à recréer les recettes. Testez cette reprise sur vos dix plats les plus vendus avant de résilier quoi que ce soit.",
  },
  {
    question: "Quelle alternative à Inpulse choisir pour un petit restaurant ?",
    answer: "Si votre priorité est de connaître le coût de chaque plat et de voir vos prix d'achat bouger, sans prévision ni production automatisée, un outil simple suffit. RestauMargin coûte 19 € par mois. Pour un besoin encore plus léger, notre calculateur de food cost en ligne est gratuit et ne demande pas de compte.",
  },
];

export default function AlternativeInpulse() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Alternative à Inpulse pour restaurant indépendant | Comparatif 2026"
        description="Inpulse vise les chaînes, sur devis. RestauMargin suit marges et food cost à 19 €/mois, sans prévision ni connecteur de caisse. Comparatif factuel 2026."
        path="/alternative-inpulse"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Comparatifs', url: 'https://www.restaumargin.fr/comparatif-logiciels-restaurant' },
            { name: 'Alternative à Inpulse', url: 'https://www.restaumargin.fr/alternative-inpulse' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Alternative à Inpulse : quel logiciel de marge pour un restaurant indépendant ?',
            description: "Comparatif factuel entre Inpulse (plateforme de stocks et de prévision pour chaînes, sur devis) et RestauMargin (marges et food cost à 19 € par mois).",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-11-05',
            dateModified: '2026-11-05',
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/alternative-inpulse' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'RestauMargin',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web, iOS, Android (PWA)',
            offers: { '@type': 'Offer', price: '19', priceCurrency: 'EUR' },
            description: "Fiches techniques, food cost, mercuriale, lecture des factures par IA et inventaire pour les restaurateurs.",
          },
        ]}
      />

      <PublicHeader />

      {/* ── Fil d'Ariane ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/comparatif-logiciels-restaurant" className="hover:text-teal-600">Comparatifs</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Alternative à Inpulse</span>
        </div>
      </div>

      <BlogArticleHero
        category="Comparatif"
        readTime="12 min"
        date="Novembre 2026"
        title="Alternative à Inpulse : quel logiciel pour un restaurant indépendant ?"
        accentWord="Inpulse"
        subtitle="Inpulse et RestauMargin parlent tous deux de marge, mais ne s'adressent pas au même restaurateur. Voici ce que fait chacun, ce qu'il ne fait pas, et comment trancher sans y passer trois rendez-vous."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-11-05" readTime="12 min" variant="header" />

        {/* ── Réponse rapide ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">En 30 secondes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">Inpulse ou RestauMargin : la réponse rapide</h2>
          <div className="bg-white/10 rounded-2xl p-5 space-y-3 text-sm sm:text-base leading-relaxed">
            <p>
              <strong>Inpulse</strong> est une plateforme de stocks, de prévision et de production pensée pour les chaînes de restaurants et de boulangeries, connectée à la caisse, avec un tarif sur demande.
            </p>
            <p>
              <strong>RestauMargin</strong> est un outil de marge pour restaurateurs qui veulent connaître le coût de chaque plat et suivre leurs prix d'achat, à 19 € par mois, sans connecteur de caisse ni prévision de ventes.
            </p>
            <p className="pt-2 border-t border-white/20">
              <strong>Pour trancher :</strong> si vous pilotez un réseau et voulez automatiser vos commandes à partir de prévisions, regardez Inpulse. Si vous tenez un ou quelques établissements et que vous cherchez d'abord à savoir ce que vous gagnez sur chaque assiette, commencez par RestauMargin.
            </p>
          </div>
        </div>

        {/* ── Sommaire ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8" aria-label="Sommaire">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm text-mono-400 list-decimal pl-5">
            <li><a className="hover:text-teal-700" href="#inpulse">Ce que fait Inpulse</a></li>
            <li><a className="hover:text-teal-700" href="#restaumargin">Ce que fait RestauMargin</a></li>
            <li><a className="hover:text-teal-700" href="#tableau">Le comparatif fonction par fonction</a></li>
            <li><a className="hover:text-teal-700" href="#prix">Comparer les prix quand l'un n'est pas public</a></li>
            <li><a className="hover:text-teal-700" href="#choisir-inpulse">Quand choisir Inpulse</a></li>
            <li><a className="hover:text-teal-700" href="#choisir-restaumargin">Quand choisir RestauMargin</a></li>
            <li><a className="hover:text-teal-700" href="#rentabilite">Calculer ce que l'outil doit rapporter</a></li>
            <li><a className="hover:text-teal-700" href="#tester">Tester sur 7 jours, étape par étape</a></li>
            <li><a className="hover:text-teal-700" href="#changer">Trois erreurs à éviter en changeant d'outil</a></li>
            <li><a className="hover:text-teal-700" href="#faq">Questions fréquentes</a></li>
          </ol>
        </nav>

        {/* ── Inpulse ── */}
        <SectionTitle id="inpulse" icon={<Building2 className="w-6 h-6 text-teal-600" />}>Ce que fait Inpulse</SectionTitle>
        <Paragraph>
          Inpulse se décrit comme une plateforme d'IA destinée aux chaînes de restaurants et de boulangeries. Sa logique tient en une boucle : récupérer les ventes depuis la caisse, en déduire ce qui devrait être consommé, le comparer à ce qui a été acheté et compté, puis prévoir ce qu'il faut commander et produire. C'est un outil d'exploitation avant d'être un outil de calcul.
        </Paragraph>
        <Paragraph>
          Sa <ExternalLink href={INPULSE_TARIFS}>page tarifs</ExternalLink>, consultée le 5 novembre 2026, détaille trois offres dont le contenu est public, mais pas le prix :
        </Paragraph>
        <ul className="my-6 space-y-3">
          <Bullet><strong>Starter</strong> : connexion à la caisse et à l'agrégateur, fiches recettes et ratios matières, fournisseurs et mercuriales, envoi des commandes, contrôle à la réception, demande d'avoir, inventaires, remontée des pertes, transferts de stocks et analyse des écarts de consommation.</Bullet>
          <Bullet><strong>Scale</strong> : tout Starter, plus la prévision de chiffre d'affaires par jour et par établissement, la prévision des ventes par produit et par ingrédient, les recommandations de commande et la gestion des promotions et des événements.</Bullet>
          <Bullet><strong>Enterprise</strong> : tout Scale, plus la commande en EDI, le planning de production automatisé, l'utilisation de l'API, des droits avancés, un chef de projet dédié, des marques illimitées, le multi-devises et le multi-fuseau horaire.</Bullet>
        </ul>
        <Paragraph>
          Côté intégrations, sa <ExternalLink href={INPULSE_INTEGRATIONS}>page dédiée</ExternalLink> liste de nombreux logiciels de caisse, dont Zelty et SumUp, ainsi que des agrégateurs et des plateformes de livraison. C'est son principal atout face à un outil plus léger : les ventes arrivent seules, sans export ni manipulation.
        </Paragraph>
        <Paragraph>
          L'éditeur annonce aussi des gains de marge sur son site, notamment « jusqu'à 5 points » sur le coût matière. Ce sont ses propres chiffres : nous n'avons aucun moyen de les vérifier, et ils ne préjugent pas de ce que vous obtiendriez chez vous.
        </Paragraph>

        {/* ── RestauMargin ── */}
        <SectionTitle id="restaumargin" icon={<ChefHat className="w-6 h-6 text-teal-600" />}>Ce que fait RestauMargin</SectionTitle>
        <Paragraph>
          RestauMargin est un outil récent, construit autour d'une question plus étroite : combien me rapporte réellement chaque plat, et qu'est-ce qui vient de changer ? Il part de la fiche technique, pas de la caisse. Vous décrivez vos recettes, le logiciel calcule le coût portion, le food cost et la marge, puis les prix d'achat viennent mettre ces chiffres à jour.
        </Paragraph>
        <ul className="my-6 space-y-3">
          <Bullet><strong>Fiches techniques illimitées</strong> avec calcul automatique du coût et de la marge.</Bullet>
          <Bullet><strong>Lecture des factures par IA</strong> : les prix de vos fournisseurs se mettent à jour à partir de vos factures.</Bullet>
          <Bullet><strong>Mercuriale</strong> : suivi des prix fournisseurs dans le temps, avec alertes, et import des prix au format CSV.</Bullet>
          <Bullet><strong>Ingénierie de menu</strong> : matrice qui classe vos plats selon leur popularité et leur marge, à partir des ventes que vous lui fournissez.</Bullet>
          <Bullet><strong>Inventaire</strong> avec alertes de stock bas, et <strong>commandes fournisseurs</strong> par e-mail.</Bullet>
          <Bullet><strong>HACCP numérique</strong> : relevés de températures, nettoyage et traçabilité.</Bullet>
          <Bullet><strong>Assistant IA</strong> : 19 actions, dont la création de recettes par chat ou à la voix, dans la limite de 500 requêtes par mois.</Bullet>
          <Bullet><strong>Station de pesée</strong> en option (tablette et balance Bluetooth) et <strong>plusieurs établissements</strong> dans un seul compte.</Bullet>
        </ul>
        <Paragraph>
          Le prix tient en une ligne : 19 € par mois, une seule offre, toutes les fonctions, 7 jours d'essai sans carte bancaire, sans engagement. Le détail se trouve sur la <Link to="/pricing" className="text-teal-700 underline hover:text-teal-600">page tarifs</Link>.
        </Paragraph>
        <div className="my-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-5 text-sm leading-relaxed">
          <strong>Ce que RestauMargin ne fait pas :</strong> aucun connecteur direct de caisse (les ventes s'importent en collant un export CSV), aucune prévision de ventes par produit ou par ingrédient, aucun planning de production, aucune commande EDI, aucune API publique pour vos systèmes. Si l'une de ces fonctions est indispensable, ce comparatif a déjà sa réponse.
        </div>

        {/* ── Tableau ── */}
        <SectionTitle id="tableau" icon={<ClipboardList className="w-6 h-6 text-teal-600" />}>Le comparatif fonction par fonction</SectionTitle>
        <Paragraph>
          Pour Inpulse, la colonne indique l'offre qui inclut la fonction selon sa page tarifs, consultée le 5 novembre 2026. Un éditeur peut faire évoluer ses offres : vérifiez les points décisifs lors de la démonstration.
        </Paragraph>
        <div className="overflow-x-auto my-8 border border-mono-900 rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-mono-1000">
              <tr>
                <th scope="col" className="text-left p-3 font-semibold text-mono-100">Fonction</th>
                <th scope="col" className="text-left p-3 font-semibold text-mono-100">Inpulse</th>
                <th scope="col" className="text-left p-3 font-semibold text-mono-100">RestauMargin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mono-900">
              <Row label="Prix affiché" a="Non publié, sur demande" b="19 € par mois" />
              <Row label="Public visé" a="Chaînes, réseaux, boulangeries" b="Indépendants et petits groupes" />
              <Row label="Fiches recettes" a="Dès Starter" b="Oui, illimitées" />
              <Row label="Mercuriale fournisseurs" a="Dès Starter" b="Oui, avec alertes" />
              <Row label="Lecture des factures" a="Annoncée, à faire préciser selon l'offre" b="Oui, par IA" />
              <Row label="Envoi des commandes" a="Dès Starter" b="Oui, par e-mail" />
              <Row label="Inventaire" a="Dès Starter" b="Oui, avec alertes de stock bas" />
              <Row label="Connexion directe à la caisse" a="Dès Starter" b="Non, import CSV" no />
              <Row label="Écarts de consommation automatiques" a="Dès Starter" b="Non" no />
              <Row label="Prévision du chiffre d'affaires" a="Dès Scale" b="Non" no />
              <Row label="Prévision par produit et ingrédient" a="Dès Scale" b="Non" no />
              <Row label="Recommandations de commande" a="Dès Scale" b="Non" no />
              <Row label="Planning de production" a="Enterprise" b="Non" no />
              <Row label="Commande EDI" a="Enterprise" b="Non" no />
              <Row label="API" a="Enterprise" b="Non" no />
              <Row label="Ingénierie de menu (matrice)" a="Non listée sur la page tarifs" b="Oui" />
              <Row label="HACCP numérique" a="Non listé sur la page tarifs" b="Oui" />
              <Row label="Essai" a="Démonstration sur rendez-vous" b="7 jours, sans carte bancaire" />
            </tbody>
          </table>
        </div>
        <Paragraph>
          Le tableau montre un écart de nature plus que de niveau. Inpulse automatise une chaîne d'approvisionnement et RestauMargin rend une marge lisible. Comparer leurs seules listes de fonctions donnerait un gagnant évident, mais pas forcément celui dont vous avez besoin : une fonction de prévision ne vous sert à rien si vous passez commande chaque matin en voyant votre chambre froide.
        </Paragraph>

        {/* ── Prix ── */}
        <SectionTitle id="prix" icon={<Scale className="w-6 h-6 text-teal-600" />}>Comparer les prix quand l'un n'est pas public</SectionTitle>
        <Paragraph>
          Vous trouverez peut-être en ligne des montants attribués à Inpulse. Ne vous y fiez pas : l'éditeur n'en publie aucun, et ces chiffres peuvent dater ou viser une autre configuration. Nous n'en citons donc aucun ici. Le seul prix valable sera celui de votre devis.
        </Paragraph>
        <Paragraph>Pour comparer à périmètre égal, posez ces questions lors de l'échange commercial :</Paragraph>
        <ol className="my-6 space-y-3 list-decimal pl-6 text-mono-400 leading-relaxed">
          <li>Le tarif se calcule-t-il par établissement, et existe-t-il un minimum de sites ?</li>
          <li>Y a-t-il des frais de mise en place ou de formation en plus de l'abonnement ?</li>
          <li>Quelle est la durée d'engagement, et comment se passe la résiliation ?</li>
          <li>La connexion à ma caisse et à mes plateformes de livraison est-elle incluse ?</li>
          <li>La prévision, dont j'ai besoin ou non, m'oblige-t-elle à prendre l'offre supérieure ?</li>
          <li>Puis-je exporter mes recettes et mes historiques si je pars ?</li>
          <li>Qui saisit les recettes au départ, et combien de temps de mon équipe cela demande-t-il ?</li>
        </ol>
        <Paragraph>
          Ajoutez ensuite le temps interne au prix affiché. Tout outil de ce type ne vaut que si ses données sont justes : recettes à jour, prix à jour, inventaires réguliers. Ce coût-là existe chez Inpulse comme chez RestauMargin, et il pèse souvent plus lourd que l'abonnement.
        </Paragraph>

        {/* ── Choisir Inpulse ── */}
        <SectionTitle id="choisir-inpulse" icon={<Target className="w-6 h-6 text-teal-600" />}>Quand choisir Inpulse</SectionTitle>
        <Paragraph>Inpulse est le meilleur choix des deux dans les situations suivantes. Dans ces cas, RestauMargin ne suffira pas, et mieux vaut le savoir avant de commencer.</Paragraph>
        <ul className="my-6 space-y-3">
          <Bullet><strong>Vous pilotez un réseau</strong> et vous devez comparer les écarts entre établissements sans demander un fichier à chaque responsable.</Bullet>
          <Bullet><strong>Vos commandes pèsent lourd</strong> et une erreur de prévision se paie en invendus ou en ruptures chaque jour : l'automatisation peut alors se justifier vite.</Bullet>
          <Bullet><strong>Vous produisez en laboratoire central</strong> ou en cuisine de production, avec des produits finis dont il faut suivre les dates limites.</Bullet>
          <Bullet><strong>Vos achats passent par l'EDI</strong> ou vos systèmes doivent dialoguer par API avec un autre logiciel.</Bullet>
          <Bullet><strong>Vous voulez les écarts de consommation automatiques</strong>, c'est-à-dire la différence entre ce que la caisse dit avoir vendu et ce que les stocks ont réellement perdu.</Bullet>
        </ul>

        {/* ── Choisir RestauMargin ── */}
        <SectionTitle id="choisir-restaumargin" icon={<CheckCircle className="w-6 h-6 text-teal-600" />}>Quand choisir RestauMargin</SectionTitle>
        <Paragraph>RestauMargin a du sens quand le problème se situe plus en amont, ce qui est fréquent dans un établissement indépendant.</Paragraph>
        <ul className="my-6 space-y-3">
          <Bullet><strong>Vous ne connaissez pas le coût exact de vos plats.</strong> Tant que vos fiches techniques n'existent pas, aucun moteur de prévision ne vous dira si votre carte est rentable. Notre guide sur le <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-600">calcul de la marge d'un restaurant</Link> pose les bases.</Bullet>
          <Bullet><strong>Vos prix d'achat bougent et vos prix de vente non.</strong> La mercuriale et la lecture des factures servent à voir la hausse le jour où elle arrive, puis à revoir votre <Link to="/blog/coefficient-multiplicateur" className="text-teal-700 underline hover:text-teal-600">coefficient multiplicateur</Link> en connaissance de cause.</Bullet>
          <Bullet><strong>Vous voulez retravailler votre carte.</strong> L'<Link to="/blog/menu-engineering-boston-matrix" className="text-teal-700 underline hover:text-teal-600">ingénierie de menu</Link> montre quels plats pousser, corriger ou retirer.</Bullet>
          <Bullet><strong>Vous voulez un prix connu avant le premier rendez-vous</strong> et pouvoir tester seul, un soir après le service.</Bullet>
          <Bullet><strong>Votre caisse fait déjà le reste.</strong> Si vous avez un logiciel de caisse, voyez aussi notre comparatif <Link to="/alternative-lightspeed" className="text-teal-700 underline hover:text-teal-600">Lightspeed et RestauMargin</Link> : une caisse encaisse, elle ne calcule pas la marge de vos recettes.</Bullet>
        </ul>
        <Paragraph>
          Vous pouvez aussi commencer sans aucun abonnement : le <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-600">calculateur de food cost</Link> en ligne est gratuit et donne un premier ordre de grandeur pour un plat. Un tableur bien tenu rend le même service tant que votre carte reste courte et que vos prix changent peu.
        </Paragraph>

        {/* ── Rentabilité ── */}
        <SectionTitle id="rentabilite" icon={<Calculator className="w-6 h-6 text-teal-600" />}>Calculer ce que l'outil doit rapporter</SectionTitle>
        <Paragraph>
          Ne cherchez pas le logiciel le plus complet : cherchez le seuil à partir duquel il se paie. Le calcul tient en trois lignes et s'applique à n'importe quel outil, y compris avec le prix de votre devis. Les chiffres ci-dessous sont un exemple de calcul, pas le résultat d'un client.
        </Paragraph>
        <div className="my-6 bg-mono-1000 border border-mono-900 rounded-2xl p-6 text-sm text-mono-400 leading-relaxed space-y-2">
          <p><strong className="text-mono-100">Hypothèse :</strong> un restaurant réalise 30 000 € de chiffre d'affaires HT par mois.</p>
          <p><strong className="text-mono-100">Valeur d'un point de food cost :</strong> 30 000 € × 1 % = 300 € par mois.</p>
          <p><strong className="text-mono-100">Seuil pour un abonnement de 19 € :</strong> 19 ÷ 30 000 = 0,06 point de food cost par mois.</p>
          <p><strong className="text-mono-100">Seuil pour un abonnement de A € :</strong> A ÷ chiffre d'affaires mensuel HT, à calculer avec le montant de votre devis, frais de mise en place étalés sur 12 mois.</p>
        </div>
        <Paragraph>
          Ce seuil ne promet rien. Il dit seulement ce qu'il faudrait récupérer pour que l'abonnement soit couvert. Le gain réel dépend de ce que vous ferez des chiffres : un logiciel qui signale une hausse ne change aucune marge tant que personne ne modifie une portion, un fournisseur ou un prix de vente. Pour identifier les leviers, lisez notre guide pour <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-600">réduire le food cost</Link>.
        </Paragraph>

        {/* ── Test ── */}
        <SectionTitle id="tester" icon={<ClipboardList className="w-6 h-6 text-teal-600" />}>Tester sur 7 jours, étape par étape</SectionTitle>
        <Paragraph>Quel que soit l'outil, faites le même essai. Un logiciel se juge sur vos plats et vos factures, pas sur une démonstration préparée.</Paragraph>
        <ol className="my-6 space-y-3 list-decimal pl-6 text-mono-400 leading-relaxed">
          <li><strong className="text-mono-100">Jours 1 et 2 :</strong> saisissez vos dix plats les plus vendus, avec les vrais grammages. Chronométrez le temps passé.</li>
          <li><strong className="text-mono-100">Jour 3 :</strong> faites lire trois factures récentes et vérifiez ligne par ligne les prix retenus. C'est là que les erreurs coûteuses apparaissent.</li>
          <li><strong className="text-mono-100">Jour 4 :</strong> comparez le coût calculé pour deux plats avec votre propre calcul. Un écart doit pouvoir s'expliquer.</li>
          <li><strong className="text-mono-100">Jour 5 :</strong> importez les ventes d'une semaine et regardez quels plats ressortent comme les moins rentables.</li>
          <li><strong className="text-mono-100">Jours 6 et 7 :</strong> prenez une décision réelle à partir de ces chiffres, puis demandez-vous si vous l'auriez prise sans l'outil. Si la réponse est oui, il ne vous sert pas encore.</li>
        </ol>
        <Paragraph>
          Pour élargir la recherche à d'autres catégories de logiciels, notre <Link to="/comparatif-logiciels-restaurant" className="text-teal-700 underline hover:text-teal-600">comparatif des logiciels de restaurant</Link> et notre <Link to="/blog/logiciel-gestion-restaurant" className="text-teal-700 underline hover:text-teal-600">guide d'achat</Link> présentent le paysage. Le détail du produit est sur la page <Link to="/logiciel-marge-restaurant" className="text-teal-700 underline hover:text-teal-600">logiciel de marge pour restaurant</Link>.
        </Paragraph>

        {/* ── Changer d'outil ── */}
        <SectionTitle id="changer" icon={<Scale className="w-6 h-6 text-teal-600" />}>Trois erreurs à éviter en changeant d'outil</SectionTitle>
        <Paragraph>
          <strong>Choisir sur la liste de fonctions.</strong> Une fonction se paie deux fois : dans l'abonnement, puis dans le temps qu'elle demande pour rester juste. Avant de cocher une ligne du tableau, nommez la personne qui la fera vivre chaque semaine. Si personne ne peut s'en charger, retirez-la de vos critères, même si elle vous fait envie pendant la démonstration.
        </Paragraph>
        <Paragraph>
          <strong>Résilier avant d'avoir tout récupéré.</strong> Vos recettes, vos grammages et votre historique de prix représentent des mois de travail. Demandez un export complet à votre éditeur actuel, ouvrez-le, puis vérifiez qu'il est exploitable. Gardez les deux outils en parallèle le temps de contrôler vos plats principaux, et ne coupez l'ancien qu'une fois les coûts recoupés.
        </Paragraph>
        <Paragraph>
          <strong>Former une seule personne.</strong> Si seul le gérant sait mettre une fiche à jour, les données vieillissent dès la première semaine chargée. Confiez la saisie des factures à celui qui les reçoit et le contrôle des grammages à celui qui cuisine. Fixez aussi un rendez-vous court, par exemple une fois par semaine, pour regarder les trois plats dont la marge a le plus bougé et décider quoi faire. C'est ce rituel, bien plus que le choix du logiciel, qui déplace une marge.
        </Paragraph>

        {/* ── FAQ ── */}
        <SectionTitle id="faq" icon={<BookOpen className="w-6 h-6 text-teal-600" />}>Questions fréquentes</SectionTitle>
        <div className="my-6 space-y-3">
          {faqItems.map((item) => (
            <details key={item.question} className="bg-mono-1000 border border-mono-900 rounded-2xl group">
              <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between gap-3 hover:text-teal-700 transition-colors">
                {item.question}
                <ArrowRight className="w-4 h-4 shrink-0 text-mono-700 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-xs text-mono-500 leading-relaxed">
          Inpulse est une marque de son éditeur. Informations relevées sur ses pages publiques le 5 novembre 2026. Une erreur ou une évolution à signaler ? Écrivez à <a href="mailto:contact@restaumargin.fr" className="underline hover:text-teal-600">contact@restaumargin.fr</a>, nous corrigerons.
        </p>

        {/* ── CTA ── */}
        <div className="mt-10 bg-[#111111] rounded-3xl p-8 text-center text-white">
          <h2 className="text-2xl font-extrabold mb-3">Vérifiez la marge de vos dix premiers plats</h2>
          <p className="text-sm text-white/70 mb-6">7 jours d'essai, sans carte bancaire et sans engagement. Ensuite 19 € par mois, une seule offre.</p>
          <Link to="/pricing" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Voir l'offre
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

function SectionTitle({ id, icon, children }: { id: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 mt-14 mb-5 text-2xl sm:text-3xl font-extrabold text-mono-100 flex items-center gap-3">
      {icon}
      {children}
    </h2>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="my-4 text-mono-400 leading-relaxed">{children}</p>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-mono-400 leading-relaxed">
      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-teal-600" />
      <span>{children}</span>
    </li>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="text-teal-700 underline hover:text-teal-600">
      {children}
    </a>
  );
}

function Row({ label, a, b, no }: { label: string; a: string; b: string; no?: boolean }) {
  return (
    <tr>
      <th scope="row" className="text-left p-3 font-medium text-mono-100">{label}</th>
      <td className="p-3 text-mono-400">{a}</td>
      <td className="p-3 text-mono-400">
        <span className="inline-flex items-center gap-1.5">
          {no && <XCircle className="w-4 h-4 shrink-0 text-mono-500" />}
          {b}
        </span>
      </td>
    </tr>
  );
}
