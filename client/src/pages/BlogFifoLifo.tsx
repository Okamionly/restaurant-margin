import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Package, RefreshCw, AlertTriangle, CheckCircle, ArrowRight, TrendingDown, Calculator, BarChart3, Lightbulb, Scale, ListChecks, Target, FileText, Clock, Tag } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "FIFO vs LIFO en restauration"
   Mot-cle principal : methode FIFO restaurant
   ~3 200 mots — modele BlogCalcMarge
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Le FIFO est-il obligatoire en restauration ?",
    answer: "Pas explicitement au sens légal, mais c'est la seule pratique conforme aux exigences HACCP et au règlement (CE) 178/2002 sur la traçabilité des denrées alimentaires. En cas de contrôle sanitaire de la DDPP, l'absence de système de rotation des denrées est un point de non-conformité. Sanctions possibles : avertissement, mise en demeure, amende administrative jusqu'à 1 500 EUR, voire fermeture administrative en cas de risque sanitaire avéré."
  },
  {
    question: "Comment gérer le FIFO avec un congélateur ?",
    answer: "Même principe : étiquetez tout avec la date de congélation et la DLC d'origine, placez les produits les plus anciens en façade. DLC au congélateur : 1 mois pour les viandes hachées, 3 mois pour les viandes pièces, 4-6 mois pour les poissons, 8-12 mois pour les légumes. Un produit non étiqueté au congélateur est automatiquement à risque sanitaire et doit être jeté par précaution."
  },
  {
    question: "FIFO ou CMUP pour la comptabilité restaurant ?",
    answer: "Les deux méthodes sont légales en France pour valoriser les stocks en restauration. Le CMUP (Coût Moyen Unitaire Pondéré) est souvent plus simple à gérer manuellement et lisse les variations de prix. Le FIFO est plus précis car il reflète les prix actuels du marché, mais demande un suivi lot par lot. La majorité des experts-comptables conseillent le CMUP pour les TPE/PME et le FIFO pour les chaînes avec un logiciel de gestion."
  },
  {
    question: "Mon équipe oublie le FIFO. Comment créer l'habitude ?",
    answer: "L'organisation physique prime sur la volonté humaine. Si les nouveaux produits sont physiquement derrière les anciens (frigos profonds, étagères à deux niveaux), le bon réflexe est forcé par la géographie des lieux. Combinez avec un contrôle matinal de 5 min intégré à la checklist HACCP quotidienne et une formation de 15 min par nouvel arrivant. Un référent FIFO par poste accélère la transmission."
  },
  {
    question: "Quelle différence entre FIFO et FEFO en restauration ?",
    answer: "FIFO = First In First Out (premier entre, premier sorti, basé sur l'ordre chronologique). FEFO = First Expired First Out (DLC la plus proche sortie en premier). En restauration, on parle de FIFO par habitude mais on applique le FEFO dans les faits, car c'est la DLC qui prime sur la date d'entrée. Dans 90 % des cas, les deux méthodes coïncident. Cas de divergence : un lot livré en deuxième position avec une DLC plus courte (lot en promotion par exemple)."
  },
  {
    question: "Comment étiqueter pour appliquer le FIFO efficacement ?",
    answer: "Méthode professionnelle : étiqueteuse Brother PT-D210 ou Dymo (50 EUR) + rouleaux solubles au lavage (30 EUR/an). Mentions obligatoires : date de réception, DLC d'origine, nom du produit (si reconditionné), initiales du réceptionnaire. Méthode visuelle complémentaire : pastilles Day Dot couleur par jour de la semaine (rouge=lundi, vert=mardi, bleu=mercredi, etc.). Une étagère bien étiquetée se contrôle en 30 secondes."
  },
  {
    question: "Le FIFO impacte-t-il vraiment le food cost ?",
    answer: "Oui, significativement. Un FIFO bien appliqué réduit le gaspillage de 2 à 4 points de food cost dans les restaurants qui ne le pratiquaient pas. Sur un restaurant à 35 % de food cost et 25 000 EUR de CA mensuel, passer à 32 % représente 750 EUR de marges récupérées par mois, soit 9 000 EUR par an. Le ROI d'une mise en place FIFO structurée est généralement atteint en moins d'un mois."
  },
  {
    question: "FIFO pour les boissons aussi ?",
    answer: "Oui, particulièrement pour les bières en fûts (DLC 3-4 mois après production), les vins courants en caisses (rotation à optimiser), les softs et jus (DLC 6-12 mois), les laitages associés au bar. Pour les spiritueux et vins de garde, le FIFO n'est pas appliqué de la même manière : ces produits ne se dégradent pas dans le temps et peuvent même prendre de la valeur. Distinguer cave 'consommation' (FIFO) et cave 'garde' (long terme)."
  },
  {
    question: "Que faire des produits qui approchent de la DLC malgré le FIFO ?",
    answer: "Trois options : (1) Suggestion du jour ou plat éphémère qui utilise prioritairement ces produits. (2) Promotion sur la carte du moment (mini-prix). (3) Don à une association alimentaire (Restos du Coeur, ANDES, Banque alimentaire) avec déductibilité fiscale de 60 % de la valeur HT. (4) En dernier recours, jeter avec traçabilité (fiche perte signée). Le jet pur et simple sans plan d'action est un échec de planification."
  },
  {
    question: "Combien coûte la mise en place complète d'un système FIFO ?",
    answer: "Très peu en absolu. Étiqueteuse pro : 50 EUR. Rouleaux d'étiquettes annuels : 30 EUR. Day Dot couleurs : 20 EUR. Affiches plastifiées dans chaque chambre froide : 15 EUR. Formation initiale équipe : 2h x salaire moyen. Total : moins de 200 EUR de matériel pour un ROI annuel de 5 000 à 25 000 EUR selon la taille du restaurant. C'est le meilleur ROI investissement de la gestion en restauration."
  }
];

export default function BlogFifoLifo() {
  const faqSchema = buildFAQSchema(faqItems);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Accueil", url: "https://www.restaumargin.fr/" },
    { name: "Blog", url: "https://www.restaumargin.fr/blog" },
    { name: "FIFO vs LIFO restauration", url: "https://www.restaumargin.fr/blog/fifo-lifo-stocks-restaurant" }
  ]);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="FIFO vs LIFO en restauration 2026 : guide complet du choix légal et rentable"
        description="FIFO ou LIFO pour vos stocks de restaurant ? Définitions, comparatif chiffré, mise en place pratique étape par étape et impact sur le food cost. Guide expert pour restaurateurs."
        path="/blog/fifo-lifo-stocks-restaurant"
        type="article"
        schema={[
          faqSchema,
          breadcrumbSchema,
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: "Comment appliquer la méthode FIFO dans un restaurant en 6 étapes",
            description: "Méthode pas-à-pas pour mettre en place le FIFO dans votre cuisine et réduire les pertes alimentaires de 3 à 5 %.",
            totalTime: 'PT2H',
            tool: [
              'Étiqueteuse Brother PT-D210 ou Dymo (50 EUR)',
              'Rouleaux d\'étiquettes solubles au lavage',
              'Pastilles Day Dot couleur par jour de la semaine',
              'Feutre indélébile pour congélateur',
              'Affiches plastifiées dans chaque chambre froide'
            ],
            step: [
              { '@type': 'HowToStep', name: 'Étiqueter systématiquement toute réception', text: 'Chaque produit entrant reçoit une étiquette : date de réception, DLC d\'origine, nom du produit (si reconditionné), initiales du receveur.' },
              { '@type': 'HowToStep', name: 'Réorganiser physiquement les frigos', text: 'Règle d\'or : nouveaux produits derrière ou en dessous, anciens devant ou au-dessus. À chaque livraison, videz l\'étagère, remettez les anciens devant, placez les nouveaux derrière.' },
              { '@type': 'HowToStep', name: 'Former l\'équipe et afficher les règles', text: '15 min de formation en début de saison + une affiche plastifiée dans chaque chambre froide. Message visuel clair : flèche de rotation, code couleur Day Dot.' },
              { '@type': 'HowToStep', name: 'Contrôler quotidiennement (5 min)', text: 'Le chef de partie vérifie les DLC chaque matin. Tout produit à DLC J-1 ou dépassée est identifié pour utilisation prioritaire ou jet tracé.' },
              { '@type': 'HowToStep', name: 'Suivre les indicateurs de pertes', text: 'Tenir une fiche de pertes hebdomadaire : produit, quantité, motif. Calculer le taux de pertes mensuel (objectif < 2 %).' },
              { '@type': 'HowToStep', name: 'Ajuster les commandes à la rotation réelle', text: 'Si vous trouvez régulièrement des produits en limite de DLC, réduisez les commandes. Cercle vertueux : FIFO -> moins de gaspillage -> commandes ajustées -> food cost amélioré.' }
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "FIFO vs LIFO en restauration : guide complet du choix légal et rentable",
            description: "FIFO ou LIFO pour gérer vos stocks en cuisine ? Définitions, comparatif chiffré et mise en place pratique pour réduire les pertes de 3 à 5 %.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'La rédaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' }
            },
            datePublished: '2026-04-27',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/fifo-lifo-stocks-restaurant' },
            keywords: 'FIFO restauration, LIFO restaurant, méthode FIFO restaurant, gestion stocks cuisine, rotation stocks restaurant, HACCP stocks, food cost gestion stocks, valorisation stock restaurant'
          }
        ]}
      />

      {/* Navbar */}
      <PublicHeader />

      {/* Breadcrumbs visibles */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">FIFO vs LIFO en restauration</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Stocks"
        readTime="15 min"
        date="Mai 2026"
        title="FIFO vs LIFO en restauration : guide complet 2026"
        accentWord="FIFO"
        subtitle="Sans système de rotation des stocks, les restaurants perdent en moyenne 3 à 5 % de leurs achats en produits périmés. Voici la méthode complète pour stopper l'hémorragie et gagner 9 000 EUR par an."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* Encadre rapide */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Résumé rapide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            FIFO ou LIFO ? La réponse en 4 points
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-teal-200 shrink-0 mt-0.5" />
              <span><strong className="text-white">FIFO</strong> (First In, First Out) = méthode obligatoire en restauration alimentaire. Conforme HACCP, autorisée comptablement.</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0 mt-0.5" />
              <span><strong className="text-white">LIFO</strong> (Last In, First Out) = <strong>interdit en France depuis 2005</strong> pour la valorisation comptable. Non conforme HACCP.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-teal-200 shrink-0 mt-0.5" />
              <span><strong className="text-white">CMUP</strong> (Coût Moyen Unitaire Pondéré) = méthode comptable légale en France, complément fréquent au FIFO physique.</span>
            </div>
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-teal-200 shrink-0 mt-0.5" />
              <span><strong className="text-white">Impact :</strong> un FIFO bien appliqué réduit le food cost de 2 à 4 points, soit 5 000 à 25 000 EUR/an selon la taille du restaurant.</span>
            </div>
          </div>
        </div>

        {/* Intro */}
        <div className="mt-12 prose-content">
          <p className="text-[#374151] text-lg leading-relaxed mb-6">
            Dans votre cuisine, chaque jour, quelqu'un décide quel produit utiliser en premier. Sans système, on attrape ce qui est à portée de main — et on perd entre <strong>3 et 5 % des achats</strong> en produits périmés, soit 3 000 à 25 000 EUR par an selon la taille du restaurant. Les méthodes FIFO et LIFO apportent une réponse structurée à ce problème. Mais une seule des deux est légale en France, et seul le FIFO est compatible avec les exigences sanitaires HACCP.
          </p>
          <p className="text-[#374151] leading-relaxed">
            Ce guide complet explique les deux méthodes, leurs implications comptables et opérationnelles, et détaille la mise en place pratique du FIFO en cuisine restaurant. À la fin, vous saurez exactement quoi faire et combien cela vous rapportera.
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
              { href: '#fifo', label: 'FIFO : définition, principe et avantages' },
              { href: '#lifo', label: 'LIFO : définition, cas d\'usage et interdiction' },
              { href: '#cmup', label: 'CMUP : la troisième voie comptable' },
              { href: '#comparaison', label: 'Tableau comparatif FIFO vs LIFO vs CMUP' },
              { href: '#impact-chiffre', label: 'Impact chiffré des 3 méthodes sur le stock' },
              { href: '#mise-en-place', label: 'Mettre en place le FIFO en 6 étapes' },
              { href: '#food-cost', label: 'Impact sur le food cost (cas chiffrés)' },
              { href: '#erreurs', label: 'Les 7 erreurs FIFO à éviter' },
              { href: '#outils', label: 'Outils et matériel pour le FIFO' },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Automatiser avec RestauMargin' }
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

        {/* SECTION 1 : FIFO */}
        <section id="fifo" className="mb-16">
          <SectionHeading icon={<RefreshCw className="w-6 h-6" />} number="1">
            FIFO : premier entre, premier sorti
          </SectionHeading>

          <div className="prose-content">
            <p>
              <strong>FIFO</strong> est l'acronyme de <em>First In, First Out</em>, traduit en français par PEPS (Premier Entre, Premier Sorti). Le principe est élémentaire : le produit reçu en premier est utilisé en premier. C'est la méthode de référence universelle en restauration professionnelle, recommandée par les normes HACCP, la réglementation sanitaire française et le Plan Comptable Général.
            </p>
            <p>
              En pratique, la méthode FIFO restaurant impose une discipline à la fois physique (rangement chronologique des produits) et administrative (suivi des dates de réception et DLC). Quand bien même une seule équipe ou un seul service ne respecte pas le FIFO, la chaîne entière est compromise.
            </p>
          </div>

          <div className="mt-8 bg-teal-50 border border-teal-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-teal-700" />
              <h3 className="font-bold text-teal-900">Exemple concret FIFO</h3>
            </div>
            <p className="text-sm text-teal-800 leading-relaxed">
              Vous recevez lundi 10 kg de saumon (DLC vendredi), jeudi 10 kg supplémentaires (DLC lundi). Le vendredi, vous cuisinez les filets du lundi en priorité, pas ceux du jeudi. Les plus anciens passent toujours en premier, même s'ils sont moins accessibles dans le frigo.
            </p>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Pourquoi le FIFO est crucial en restauration</h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <h4 className="font-bold text-emerald-900 text-sm">DLC fragiles</h4>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Poissons : DLC 2-5 jours. Viandes : DLC 3-7 jours. Un oubli = perte sèche d'un produit cher.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <h4 className="font-bold text-emerald-900 text-sm">Conformité HACCP</h4>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                La traçabilité HACCP repose sur la rotation chronologique des denrées. Sans FIFO, votre dossier sanitaire est invalide.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-emerald-700" />
                <h4 className="font-bold text-emerald-900 text-sm">Pertes évitables</h4>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Un restaurant sans FIFO perd en moyenne 3 à 5 % de ses achats en pertes périmées. Sur 8 000 EUR d'achats, c'est 240 EUR par mois.
              </p>
            </div>
          </div>

          <Callout type="info">
            <strong>Chiffre clé :</strong> sur 8 000 EUR d'achats mensuels, 3 % de pertes = 240 EUR jetés chaque mois, soit 2 880 EUR par an. Multipliez par 5 ans, c'est 14 400 EUR partis à la poubelle, juste pour ne pas avoir appliqué le FIFO restaurant.
          </Callout>
        </section>

        {/* SECTION 2 : LIFO */}
        <section id="lifo" className="mb-16">
          <SectionHeading icon={<Package className="w-6 h-6" />} number="2">
            LIFO : dernier entre, premier sorti
          </SectionHeading>

          <div className="prose-content">
            <p>
              <strong>LIFO</strong> = <em>Last In, First Out</em>, traduit en français par DEPS (Dernier Entre, Premier Sorti). Le produit reçu en dernier est utilisé en premier. Cette méthode est utilisée dans certaines industries (métallurgie, BTP) pour des raisons de stockage technique, mais en restauration alimentaire, elle est <strong>contre-productive et illégale comptablement</strong>.
            </p>
            <p>
              Le LIFO peut paraître logique dans certains cas pratiques (silo de farine ou de sucre où le dessus est toujours accessible en premier), mais il viole la règle de base de la sécurité alimentaire : utiliser les produits les plus anciens d'abord.
            </p>
          </div>

          <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-700" />
              <h3 className="font-bold text-orange-900">Cas d'usage très limités du LIFO</h3>
            </div>
            <ul className="text-sm text-orange-800 space-y-1.5 mt-2">
              <li>- Produits secs en silo ou en vrac (farine, sucre) où le dessus est forcément accessible en premier — pratique technique mais non recommandée</li>
              <li>- Comptabilité d'inventaire dans certains pays (USA notamment) — interdite en France depuis 2005</li>
              <li>- Périodes d'hyperinflation sévère (théorie comptable américaine pour réduire l'impôt) — sans pertinence en France</li>
            </ul>
          </div>

          <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              <strong>Important :</strong> Le Plan Comptable Général français n'autorise pas la méthode LIFO pour valoriser les stocks depuis 2005. Les seules méthodes légales en France sont le <strong>FIFO (PEPS)</strong> et le <strong>CMUP (Coût Moyen Unitaire Pondéré)</strong>. Utiliser le LIFO en France expose à un rejet de comptabilité et un redressement fiscal.
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Pourquoi le LIFO est dangereux en restauration</h3>
            <p>
              Au-delà de l'aspect légal, le LIFO en restauration accélère mécaniquement les pertes alimentaires. Si vous utilisez les nouveaux produits en premier, les anciens (déjà proches de leur DLC) restent en stock et périssent. C'est l'inverse exact du bon sens sanitaire et économique.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-3">
              <li>Augmentation des pertes alimentaires de 5 à 10 % en moyenne</li>
              <li>Risque sanitaire : produits périmés consommés par erreur</li>
              <li>Non-conformité HACCP : sanctions DDPP possibles</li>
              <li>Rejet de comptabilité par l'administration fiscale française</li>
              <li>Traçabilité alimentaire impossible (règle CE 178/2002)</li>
            </ul>
          </div>
        </section>

        {/* SECTION 3 : CMUP */}
        <section id="cmup" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            CMUP : la troisième voie comptable
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>CMUP</strong> (Coût Moyen Unitaire Pondéré), parfois appelé CUMP, est une méthode de valorisation comptable alternative au FIFO. Le principe : à chaque entrée en stock, on recalcule un prix moyen pondéré par les quantités. C'est une moyenne mobile qui lisse les variations de prix d'achat dans le temps.
            </p>
            <p>
              Le CMUP est légal en France, simple à tenir manuellement (idem Excel) et très répandu dans les TPE/PME de restauration. Il n'est pas concurrent du FIFO mais complémentaire : le FIFO est appliqué <strong>physiquement</strong> en cuisine (rotation des denrées), le CMUP est appliqué <strong>comptablement</strong> pour la valorisation du stock final.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Formule du CMUP</h3>
            <div className="bg-white px-4 py-3 rounded-lg border border-mono-900 font-mono text-sm mb-4">
              <strong>CMUP =</strong> (Valeur stock initial + Valeur achats période) / (Quantité stock initial + Quantité achetée période)
            </div>
            <p className="text-sm text-mono-400 leading-relaxed">
              On obtient un prix unitaire moyen qui sert ensuite à valoriser le stock final (multiplié par la quantité restante). Cette méthode est utilisée en restauration pour les produits à forte variation de prix (poissons, certains légumes, certains alcools).
            </p>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Exemple chiffré CMUP</h3>
            <p>Restaurant achète du beurre demi-sel au cours du mois :</p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-3">
              <li>Stock initial : 5 kg à 6 EUR/kg = 30 EUR</li>
              <li>1er achat : 10 kg à 6 EUR/kg = 60 EUR</li>
              <li>2e achat : 10 kg à 7 EUR/kg = 70 EUR</li>
              <li>3e achat : 5 kg à 7,50 EUR/kg = 37,50 EUR</li>
            </ul>
            <p className="mt-3">
              Total : 30 kg pour 197,50 EUR. CMUP = 197,50 / 30 = <strong>6,58 EUR/kg</strong>. Si le stock final est de 8 kg, sa valeur comptable au CMUP est : 8 x 6,58 = <strong>52,67 EUR</strong>.
            </p>
            <p className="mt-3">
              En FIFO strict, le stock final aurait été valorisé au prix des dernières entrées : 5 kg x 7,50 + 3 kg x 7 = 58,50 EUR. Différence : 5,83 EUR sur ce produit. Sur 100 références, l'écart cumulé peut atteindre plusieurs centaines d'euros.
            </p>
          </div>
        </section>

        {/* SECTION 4 : Comparatif */}
        <section id="comparaison" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            Tableau comparatif FIFO vs LIFO vs CMUP
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici le comparatif complet des trois méthodes de gestion des stocks en restauration sur 12 critères clefs. Cela vous permet de visualiser instantanément laquelle adopter selon votre contexte.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-975 text-mono-100">
                  <th className="text-left px-4 py-3 font-semibold">Critère</th>
                  <th className="text-center px-4 py-3 font-semibold text-emerald-700">FIFO</th>
                  <th className="text-center px-4 py-3 font-semibold text-amber-700">CMUP</th>
                  <th className="text-center px-4 py-3 font-semibold text-rose-700">LIFO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mono-900">
                {[
                  ['Adapté aux denrées périssables', 'Oui (excellent)', 'Oui', 'Non'],
                  ['Conforme HACCP', 'Oui', 'Compatible', 'Non'],
                  ['Réduit le gaspillage alimentaire', 'Oui (-3 à -5 %)', 'Neutre', 'Augmente les pertes'],
                  ['Reflète les prix actuels du marché', 'Oui (précis)', 'Lissage (moyenne)', 'Décalé (anciens prix)'],
                  ['Valorisation comptable légale France', 'Autorisé', 'Autorisé', 'Interdit depuis 2005'],
                  ['Complexité mise en place physique', 'Moyenne', 'Faible', 'Faible'],
                  ['Complexité calcul comptable', 'Élevée (lot par lot)', 'Faible', 'Faible'],
                  ['Adapté produits secs en vrac', 'À adapter', 'Oui', 'Possible techniquement'],
                  ['Coût d\'investissement initial', 'Faible (< 200 EUR)', 'Très faible', 'Très faible'],
                  ['Impact food cost', 'Réduction 2-4 pts', 'Neutre', 'Augmentation 2-5 pts'],
                  ['Traçabilité alimentaire (CE 178/2002)', 'Optimale', 'Acceptable', 'Insuffisante'],
                  ['Recommandé pour restaurants FR', 'OUI absolument', 'OUI (comptable)', 'NON jamais'],
                ].map(([crit, fifo, cmup, lifo]) => (
                  <tr key={crit} className="bg-white hover:bg-mono-1000 transition-colors">
                    <td className="px-4 py-3 text-[#374151] font-medium">{crit}</td>
                    <td className="px-4 py-3 text-center text-emerald-700">{fifo}</td>
                    <td className="px-4 py-3 text-center text-amber-700">{cmup}</td>
                    <td className="px-4 py-3 text-center text-rose-700">{lifo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-mono-500 mt-4">
            <strong>Verdict :</strong> en restauration professionnelle française, la combinaison gagnante est <strong>FIFO physique en cuisine + CMUP comptable pour la valorisation</strong>. Le LIFO est à proscrire intégralement.
          </p>
        </section>

        {/* SECTION 5 : Impact chiffre */}
        <section id="impact-chiffre" className="mb-16">
          <SectionHeading icon={<TrendingDown className="w-6 h-6" />} number="5">
            Impact chiffré des 3 méthodes sur la valorisation du stock
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voyons concrètement comment les trois méthodes impactent la valorisation finale du stock dans un contexte d'inflation modérée (cas le plus fréquent en restauration 2025-2026). Prenons un produit phare : le beurre demi-sel.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Mouvements de stock sur le mois</h3>
            <ul className="space-y-1.5 text-sm text-mono-350">
              <li>- 1er du mois : entrée 10 kg à 6,00 EUR/kg = 60,00 EUR</li>
              <li>- 8 du mois : entrée 10 kg à 6,50 EUR/kg = 65,00 EUR</li>
              <li>- 15 du mois : entrée 10 kg à 7,00 EUR/kg = 70,00 EUR</li>
              <li>- 22 du mois : entrée 5 kg à 7,50 EUR/kg = 37,50 EUR</li>
              <li>- Sorties cuisine sur le mois : 30 kg</li>
              <li>- <strong>Stock final physique : 5 kg</strong></li>
            </ul>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <h4 className="font-bold text-emerald-900 mb-2">Valorisation FIFO</h4>
              <p className="text-xs text-emerald-800 mb-2">
                Le stock final correspond aux derniers entrants : 5 kg x 7,50 EUR/kg
              </p>
              <p className="text-2xl font-extrabold text-emerald-700">37,50 EUR</p>
              <p className="text-xs text-emerald-700 mt-2 italic">Méthode légale + reflète les prix actuels</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h4 className="font-bold text-amber-900 mb-2">Valorisation CMUP</h4>
              <p className="text-xs text-amber-800 mb-2">
                CMUP = (60 + 65 + 70 + 37,50) / 35 kg = 6,64 EUR/kg. Stock final : 5 x 6,64
              </p>
              <p className="text-2xl font-extrabold text-amber-700">33,21 EUR</p>
              <p className="text-xs text-amber-700 mt-2 italic">Méthode légale + lissage des prix</p>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
              <h4 className="font-bold text-rose-900 mb-2">Valorisation LIFO</h4>
              <p className="text-xs text-rose-800 mb-2">
                Le stock final correspond aux premiers entrants : 5 kg x 6,00 EUR/kg
              </p>
              <p className="text-2xl font-extrabold text-rose-700">30,00 EUR</p>
              <p className="text-xs text-rose-700 mt-2 italic">INTERDIT en France depuis 2005</p>
            </div>
          </div>

          <Callout type="warning">
            <strong>Lecture :</strong> en inflation, le FIFO donne la valorisation la plus élevée (les derniers prix sont en stock), le LIFO la plus basse (les anciens prix subsistent au bilan). En période de hausse des prix, le LIFO sous-estime artificiellement la valeur du stock — c'est pour cela qu'il était utilisé aux USA pour réduire l'impôt sur les bénéfices. En France, c'est interdit précisément pour éviter ce type d'optimisation fiscale.
          </Callout>
        </section>

        {/* SECTION 6 : Mise en place */}
        <section id="mise-en-place" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="6">
            Mettre en place le FIFO en 6 étapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la procédure complète pour déployer un système FIFO restaurant fiable en moins d'une semaine. Cette méthode est utilisée par les chaînes de restauration professionnelles et adaptée aux indépendants.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Étiqueter systématiquement toutes les réceptions',
                body: "Chaque produit entrant reçoit une étiquette obligatoirement : date de réception, DLC d'origine, nom du produit (si reconditionné), initiales du réceptionnaire, éventuellement le lot. Outils recommandés : étiqueteuse Brother PT-D210 (~50 EUR), rouleaux solubles au lavage (~30 EUR/an), pastilles Day Dot couleur (~20 EUR). Pour un investissement de moins de 100 EUR, vous économisez 5 000 à 25 000 EUR par an."
              },
              {
                title: 'Réorganiser physiquement les espaces de stockage',
                body: "Règle d'or : nouveaux produits derrière ou en dessous, anciens devant ou au-dessus. À chaque livraison, videz l'étagère, remettez les anciens devant, placez les nouveaux derrière. Pour les frigos profonds : marquage au sol des zones FIFO. Pour les étagères : utilisation de bacs gastronomes inclinés. L'organisation physique force le bon réflexe — c'est plus efficace que la formation."
              },
              {
                title: 'Former l\'équipe et afficher les règles',
                body: "Formation de 15 min en début de saison + une affiche plastifiée dans chaque chambre froide. Message visuel : flèche de rotation, code couleur Day Dot, règle 'vieux devant / nouveau derrière'. Répéter la formation à chaque nouvel arrivant et à chaque changement de poste. Désigner un référent FIFO par poste."
              },
              {
                title: 'Contrôler quotidiennement (5 min)',
                body: "Le chef de partie ou le second vérifie les DLC chaque matin avant le service. Tout produit à DLC J-1 ou dépassée est identifié pour utilisation prioritaire (suggestion du jour, plat éphémère) ou jet tracé (fiche perte). Cette vérification s'intègre naturellement à la checklist HACCP quotidienne sans charge additionnelle."
              },
              {
                title: 'Mesurer et suivre les indicateurs clés',
                body: "Tenir deux KPIs : (1) taux de pertes mensuel = valeur des produits jetés / valeur des achats x 100 (cible < 2 %), (2) écart food cost théorique vs réel issu de l'inventaire. Un écart de plus de 2 points signale un dysfonctionnement FIFO. Afficher ces chiffres mensuellement dans le bureau. La transparence renforce l'adhésion de l'équipe."
              },
              {
                title: 'Ajuster les commandes à la rotation réelle',
                body: "Le FIFO révèle souvent un problème de sur-commande. Si vous trouvez régulièrement des produits en limite de DLC malgré le FIFO, commandez moins ou plus souvent. Cercle vertueux : FIFO -> moins de gaspillage -> commandes ajustées -> food cost amélioré -> trésorerie libérée. L'optimisation des commandes est détaillée dans notre guide de la rotation des stocks."
              }
            ].map((step, i) => (
              <li key={i} className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7 flex gap-5">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg shadow-md">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-mono-100 text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <Callout type="info">
            <strong>Pour aller plus loin :</strong> consultez notre <Link to="/blog/methode-fifo-gestion-stocks-restaurant" className="underline font-semibold hover:text-teal-700">guide pratique de la méthode FIFO en restauration</Link> qui détaille les 4 piliers de la mise en pratique et la checklist FIFO quotidienne.
          </Callout>
        </section>

        {/* SECTION 7 : Impact food cost */}
        <section id="food-cost" className="mb-16">
          <SectionHeading icon={<TrendingDown className="w-6 h-6" />} number="7">
            Impact du FIFO sur le food cost (cas chiffrés)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un FIFO bien appliqué réduit le gaspillage de <strong>2 à 4 points de food cost</strong> dans les restaurants qui ne le pratiquaient pas. Voici un tableau d'impact chiffré sur 4 tailles d'établissements différents.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-975">
                  <th className="text-left px-4 py-3 font-semibold text-mono-100">CA mensuel</th>
                  <th className="text-center px-4 py-3 font-semibold text-mono-100">Food cost avant FIFO</th>
                  <th className="text-center px-4 py-3 font-semibold text-mono-100">Food cost après FIFO</th>
                  <th className="text-center px-4 py-3 font-semibold text-mono-100">Gain points</th>
                  <th className="text-center px-4 py-3 font-semibold text-teal-700">Gain mensuel</th>
                  <th className="text-center px-4 py-3 font-semibold text-teal-700">Gain annuel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mono-900">
                {[
                  ['15 000 EUR', '38 %', '35 %', '3 pts', '450 EUR', '5 400 EUR'],
                  ['25 000 EUR', '36 %', '32 %', '4 pts', '1 000 EUR', '12 000 EUR'],
                  ['40 000 EUR', '35 %', '31 %', '4 pts', '1 600 EUR', '19 200 EUR'],
                  ['60 000 EUR', '37 %', '33 %', '4 pts', '2 400 EUR', '28 800 EUR'],
                  ['100 000 EUR', '36 %', '32 %', '4 pts', '4 000 EUR', '48 000 EUR']
                ].map(([ca, avant, apres, gain, gainM, gainA]) => (
                  <tr key={ca} className="bg-white hover:bg-mono-1000">
                    <td className="px-4 py-3 text-[#374151] font-medium">{ca}</td>
                    <td className="px-4 py-3 text-center text-rose-500">{avant}</td>
                    <td className="px-4 py-3 text-center text-emerald-600">{apres}</td>
                    <td className="px-4 py-3 text-center text-teal-700 font-semibold">{gain}</td>
                    <td className="px-4 py-3 text-center font-bold text-teal-700">{gainM}</td>
                    <td className="px-4 py-3 text-center font-bold text-teal-700">{gainA}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-mono-500 mt-3">
            Estimations basées sur une réduction de 2 à 4 % du food cost après mise en place d'un FIFO restaurant structuré (ordres de grandeur indicatifs).
          </p>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Exemple illustratif chiffré : bistrot 30 000 EUR de CA</h3>
            <p>
              Exemple fictif : restaurant bistronomique de 35 couverts, CA mensuel 30 000 EUR HT, food cost cible 32 %.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
              <h4 className="font-bold text-rose-900 mb-2">Scénario A — Sans FIFO (8 % de pertes)</h4>
              <ul className="text-sm text-rose-800 space-y-1">
                <li>- Achats matières : 11 200 EUR</li>
                <li>- Pertes (8 %) : 896 EUR</li>
                <li>- Consommation réelle : 10 304 EUR</li>
                <li>- <strong>Food cost réel : 34,3 %</strong></li>
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <h4 className="font-bold text-emerald-900 mb-2">Scénario B — Avec FIFO (2 % de pertes)</h4>
              <ul className="text-sm text-emerald-800 space-y-1">
                <li>- Achats matières : 9 800 EUR (optimisés)</li>
                <li>- Pertes (2 %) : 196 EUR</li>
                <li>- Consommation réelle : 9 604 EUR</li>
                <li>- <strong>Food cost réel : 32,0 %</strong></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Gain net annuel :</strong> économie achats (16 800 EUR/an) + réduction pertes (8 400 EUR/an) = <strong>25 200 EUR/an</strong>. Soit l'équivalent d'un mois et demi de CA en marge nette additionnelle. Investissement initial FIFO : moins de 200 EUR. ROI : 12 600 %.
          </Callout>
        </section>

        {/* SECTION 8 : Erreurs */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="8">
            Les 7 erreurs FIFO à éviter absolument
          </SectionHeading>

          <div className="space-y-5 mt-8">
            <ErreurCard
              number={1}
              title="Ranger les nouveaux produits devant"
              desc="Réflexe naturel le plus répandu (rapide à la réception) mais opposé au principe FIFO. Sur 30 réceptions par mois, c'est 30 occasions de dégrader le système. La solution : marquer physiquement les zones FIFO (rubans adhésifs au sol des étagères) et faire de la rotation à la réception un geste obligatoire."
            />
            <ErreurCard
              number={2}
              title="Ne pas étiqueter les contenants reconditionnés"
              desc="Bocaux de cornichons, sauces transvasées, vinaigres en burettes, huiles en pichets : ces produits perdent leur étiquette d'origine et donc leur DLC. Sans étiquetage, vous ne savez plus depuis quand c'est ouvert. Règle absolue : tout contenant transféré reçoit une étiquette avec date d'ouverture et DLC secondaire."
            />
            <ErreurCard
              number={3}
              title="Ignorer la DLC secondaire (après ouverture)"
              desc="Une crème fraîche fermée se conserve 3 semaines, ouverte seulement 3 jours. Une bouteille de vin ouverte se conserve 2-3 jours au frais. Un sachet de levure ouvert 48h. Connaître les DLC secondaires et les afficher est aussi important que le FIFO lui-même."
            />
            <ErreurCard
              number={4}
              title="Laisser des produits à plusieurs endroits"
              desc="Le même produit dans 2 frigos différents ou 2 étagères différentes : double traçabilité, risque de doublon, complexité de gestion. Règle : un produit = un emplacement unique. Si volume important, étagère dédiée mais zone unique."
            />
            <ErreurCard
              number={5}
              title="Inventaire en début de mois seulement"
              desc="Si vous découvrez les écarts FIFO uniquement lors de l'inventaire mensuel, les pertes sont déjà consommées. Ajouter un inventaire flash hebdomadaire sur les 10 produits les plus chers et un contrôle DLC quotidien permet de détecter les dérives en temps réel."
            />
            <ErreurCard
              number={6}
              title="Ne pas former les nouveaux employés"
              desc="Une seule personne qui ne connaît pas le FIFO peut saboter tout le système. Chaque nouvel arrivant doit avoir 15 min de formation FIFO le premier jour, avec démonstration physique. Un livret HACCP/FIFO de 2 pages à signer est un bon support."
            />
            <ErreurCard
              number={7}
              title="Sur-stocker pour 'ne pas être en rupture'"
              desc="Mieux vaut 2 commandes par semaine (frais tendus) que des stocks volumineux qui génèrent 8 % de pertes. La peur de la rupture pousse à sur-commander, ce qui aggrave le problème FIFO. Faire confiance aux fournisseurs et adapter les volumes à la rotation réelle observée."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumulé :</strong> ces 7 erreurs combinées peuvent représenter 4 à 8 points de food cost en plus, soit 4 800 à 9 600 EUR par an sur un restaurant à 25 000 EUR de CA mensuel. Mettre en place une discipline FIFO est l'action ROI numéro 1 pour un restaurateur.
          </Callout>
        </section>

        {/* SECTION 9 : Outils */}
        <section id="outils" className="mb-16">
          <SectionHeading icon={<Tag className="w-6 h-6" />} number="9">
            Outils et matériel pour le FIFO restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le FIFO ne nécessite pas un gros budget. Voici la liste complète du matériel recommandé pour un démarrage efficace, avec budgets indicatifs 2026.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Matériel</th>
                  <th className="text-left py-3 px-4 font-semibold">Usage</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Prix indicatif 2026</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { mat: 'Étiqueteuse Brother PT-D210 ou Dymo LabelManager', usage: 'Impression d\'étiquettes professionnelles', prix: '45-65 EUR' },
                  { mat: 'Rouleaux d\'étiquettes solubles au lavage (annuel)', usage: 'Étiquetage des contenants alimentaires lavables', prix: '25-40 EUR/an' },
                  { mat: 'Pastilles Day Dot couleur (7 jours)', usage: 'Code couleur visuel par jour de la semaine', prix: '15-25 EUR' },
                  { mat: 'Feutre indélébile permanent (lot de 5)', usage: 'Marquage congélateur et contenants', prix: '10-15 EUR' },
                  { mat: 'Affiches plastifiées procédure FIFO', usage: 'Rappel visuel dans chaque chambre froide', prix: '15-20 EUR' },
                  { mat: 'Logiciel inventaire (mensuel)', usage: 'Suivi DLC et alertes automatiques', prix: '29-80 EUR/mois' },
                  { mat: 'Tablette Android dédiée inventaire (optionnel)', usage: 'Saisie en mobilité dans les zones de stockage', prix: '150-300 EUR' },
                  { mat: 'Bacs gastronomes inclinés (lot de 5)', usage: 'Force le rangement chronologique en frigo', prix: '60-100 EUR' }
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.mat}</td>
                    <td className="py-3 px-4 text-xs">{row.usage}</td>
                    <td className="py-3 px-4 text-right text-teal-700 font-semibold">{row.prix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Budget total démarrage (hors logiciel) :</strong> moins de 200 EUR pour le matériel de base, 350 EUR avec tablette dédiée. Avec logiciel mensuel, comptez 29 à 80 EUR/mois supplémentaires. ROI atteint en moins de 2 mois dans 95 % des cas.
            </p>
            <p>
              Pour aller plus loin sur l'automatisation, consultez notre guide complet de l'<Link to="/blog/inventaire-restaurant-guide" className="text-teal-700 underline hover:text-teal-800">inventaire restaurant</Link> et notre article sur la <Link to="/blog/rotation-stocks-restaurant" className="text-teal-700 underline hover:text-teal-800">rotation des stocks</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes FIFO restaurant</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* Sources EAT */}
        <section className="mb-12">
          <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-mono-100 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              Sources et références
            </h2>
            <ul className="text-sm text-mono-400 space-y-2">
              <li>- Règlement (CE) n° 178/2002 du Parlement européen — Traçabilité des denrées alimentaires</li>
              <li>- Plan Comptable Général français (PCG) — Article 213-1 et 214-1 (méthodes de valorisation autorisées)</li>
              <li>- Guide des Bonnes Pratiques d'Hygiène (GBPH) restauration — DGAL et ANSES</li>
              <li>- Paquet Hygiène européen — Règlements (CE) 852/2004, 853/2004 et 854/2004</li>
              <li>- INSEE — Statistiques sectorielles de la restauration en France (données 2024-2026)</li>
              <li>- GIRA Conseil — Étude annuelle profitabilité restaurants HCR France 2026</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Suivez vos stocks et votre food cost en temps réel
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin vous aide à appliquer le FIFO efficacement : alertes DLC, suggestion de plats du jour, food cost réel par plat et identification automatique des pertes avant qu'elles impactent votre résultat.
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
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin sur la gestion des stocks</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/methode-fifo-gestion-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Méthode FIFO en pratique</h3>
              <p className="text-xs text-mono-500">4 piliers, checklist quotidienne, exemples chiffrés.</p>
            </Link>
            <Link to="/blog/inventaire-restaurant-guide" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Inventaire restaurant</h3>
              <p className="text-xs text-mono-500">Méthode complète, fréquence, outils, valorisation.</p>
            </Link>
            <Link to="/blog/rotation-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Rotation des stocks</h3>
              <p className="text-xs text-mono-500">Calcul, benchmarks, leviers d'optimisation.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant</h3>
              <p className="text-xs text-mono-500">Food cost, marge brute, coefficient multiplicateur.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Food cost optimal</h3>
              <p className="text-xs text-mono-500">Benchmarks par type d'établissement.</p>
            </Link>
            <Link to="/blog/gaspillage-alimentaire" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire le gaspillage</h3>
              <p className="text-xs text-mono-500">10 stratégies pour limiter les pertes.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire le food cost</h3>
              <p className="text-xs text-mono-500">10 leviers concrets en 2026.</p>
            </Link>
            <Link to="/outils/calculateur-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calculateur food cost gratuit</h3>
              <p className="text-xs text-mono-500">Calculez votre marge en 30 secondes.</p>
            </Link>
          </div>
        </section>

        {/* Nav bas */}
        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">&larr; Tous les articles</Link>
          <Link to="/blog/methode-fifo-gestion-stocks-restaurant" className="text-sm text-teal-600 hover:underline">Méthode FIFO en pratique &rarr;</Link>
        </div>

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

function ErreurCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-mono-100 mb-1.5">{title}</h3>
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
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
