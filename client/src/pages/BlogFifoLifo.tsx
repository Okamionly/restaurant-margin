import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Package, RefreshCw, AlertTriangle, CheckCircle, ArrowRight, TrendingDown, Calculator, BarChart3, Lightbulb, Scale, ListChecks, Target, FileText, Clock, Tag } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "FIFO vs LIFO en restauration"
   Mot-cle principal : methode FIFO restaurant
   ~3 200 mots — modele BlogCalcMarge
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Le FIFO est-il obligatoire en restauration ?",
    answer: "Pas explicitement au sens legal, mais c'est la seule pratique conforme aux exigences HACCP et au reglement (CE) 178/2002 sur la tracabilite des denrees alimentaires. En cas de controle sanitaire de la DDPP, l'absence de systeme de rotation des denrees est un point de non-conformite. Sanctions possibles : avertissement, mise en demeure, amende administrative jusqu'a 1 500 EUR, voire fermeture administrative en cas de risque sanitaire avere."
  },
  {
    question: "Comment gerer le FIFO avec un congelateur ?",
    answer: "Meme principe : etiquetez tout avec la date de congelation et la DLC d'origine, placez les produits les plus anciens en facade. DLC au congelateur : 1 mois pour les viandes hachees, 3 mois pour les viandes pieces, 4-6 mois pour les poissons, 8-12 mois pour les legumes. Un produit non etiquete au congelateur est automatiquement a risque sanitaire et doit etre jete par precaution."
  },
  {
    question: "FIFO ou CMUP pour la comptabilite restaurant ?",
    answer: "Les deux methodes sont legales en France pour valoriser les stocks en restauration. Le CMUP (Cout Moyen Unitaire Pondere) est souvent plus simple a gerer manuellement et lisse les variations de prix. Le FIFO est plus precis car il reflete les prix actuels du marche, mais demande un suivi lot par lot. La majorite des experts-comptables conseillent le CMUP pour les TPE/PME et le FIFO pour les chaines avec un logiciel de gestion."
  },
  {
    question: "Mon equipe oublie le FIFO. Comment creer l'habitude ?",
    answer: "L'organisation physique prime sur la volonte humaine. Si les nouveaux produits sont physiquement derriere les anciens (frigos profonds, etageres a deux niveaux), le bon reflexe est force par la geographie des lieux. Combinez avec un controle matinal de 5 min integre a la checklist HACCP quotidienne et une formation de 15 min par nouvel arrivant. Un referent FIFO par poste accelere la transmission."
  },
  {
    question: "Quelle difference entre FIFO et FEFO en restauration ?",
    answer: "FIFO = First In First Out (premier entre, premier sorti, base sur l'ordre chronologique). FEFO = First Expired First Out (DLC la plus proche sortie en premier). En restauration, on parle de FIFO par habitude mais on applique le FEFO dans les faits, car c'est la DLC qui prime sur la date d'entree. Dans 90 % des cas, les deux methodes coincident. Cas de divergence : un lot livre en deuxieme position avec une DLC plus courte (lot en promotion par exemple)."
  },
  {
    question: "Comment etiqueter pour appliquer le FIFO efficacement ?",
    answer: "Methode professionnelle : etiqueteuse Brother PT-D210 ou Dymo (50 EUR) + rouleaux solubles au lavage (30 EUR/an). Mentions obligatoires : date de reception, DLC d'origine, nom du produit (si reconditionne), initiales du receptionnaire. Methode visuelle complementaire : pastilles Day Dot couleur par jour de la semaine (rouge=lundi, vert=mardi, bleu=mercredi, etc.). Une etagere bien etiquetee se controle en 30 secondes."
  },
  {
    question: "Le FIFO impacte-t-il vraiment le food cost ?",
    answer: "Oui, significativement. Un FIFO bien applique reduit le gaspillage de 2 a 4 points de food cost dans les restaurants qui ne le pratiquaient pas. Sur un restaurant a 35 % de food cost et 25 000 EUR de CA mensuel, passer a 32 % represente 750 EUR de marges recuperees par mois, soit 9 000 EUR par an. Le ROI d'une mise en place FIFO structuree est generalement atteint en moins d'un mois."
  },
  {
    question: "FIFO pour les boissons aussi ?",
    answer: "Oui, particulierement pour les bieres en futs (DLC 3-4 mois apres production), les vins courants en caisses (rotation a optimiser), les softs et jus (DLC 6-12 mois), les laitages associes au bar. Pour les spiritueux et vins de garde, le FIFO n'est pas applique de la meme maniere : ces produits ne se degradent pas dans le temps et peuvent meme prendre de la valeur. Distinguer cave 'consommation' (FIFO) et cave 'garde' (long terme)."
  },
  {
    question: "Que faire des produits qui approchent de la DLC malgre le FIFO ?",
    answer: "Trois options : (1) Suggestion du jour ou plat ephemere qui utilise prioritairement ces produits. (2) Promotion sur la carte du moment (mini-prix). (3) Don a une association alimentaire (Restos du Coeur, ANDES, Banque alimentaire) avec deductibilite fiscale de 60 % de la valeur HT. (4) En dernier recours, jeter avec tracabilite (fiche perte signee). Le jet pur et simple sans plan d'action est un echec de planification."
  },
  {
    question: "Combien coute la mise en place complete d'un systeme FIFO ?",
    answer: "Tres peu en absolu. Etiqueteuse pro : 50 EUR. Rouleaux d'etiquettes annuels : 30 EUR. Day Dot couleurs : 20 EUR. Affiches plastifiees dans chaque chambre froide : 15 EUR. Formation initiale equipe : 2h x salaire moyen. Total : moins de 200 EUR de materiel pour un ROI annuel de 5 000 a 25 000 EUR selon la taille du restaurant. C'est le meilleur ROI investissement de la gestion en restauration."
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
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="FIFO vs LIFO en restauration 2026 : guide complet du choix legal et rentable"
        description="FIFO ou LIFO pour vos stocks de restaurant ? Definitions, comparatif chiffre, mise en place pratique etape par etape et impact sur le food cost. Guide expert pour restaurateurs."
        path="/blog/fifo-lifo-stocks-restaurant"
        type="article"
        schema={[
          faqSchema,
          breadcrumbSchema,
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: "Comment appliquer la methode FIFO dans un restaurant en 6 etapes",
            description: "Methode pas-a-pas pour mettre en place le FIFO dans votre cuisine et reduire les pertes alimentaires de 3 a 5 %.",
            totalTime: 'PT2H',
            tool: [
              'Etiqueteuse Brother PT-D210 ou Dymo (50 EUR)',
              'Rouleaux d\'etiquettes solubles au lavage',
              'Pastilles Day Dot couleur par jour de la semaine',
              'Feutre indelebile pour congelateur',
              'Affiches plastifiees dans chaque chambre froide'
            ],
            step: [
              { '@type': 'HowToStep', name: 'Etiqueter systematiquement toute reception', text: 'Chaque produit entrant recoit une etiquette : date de reception, DLC d\'origine, nom du produit (si reconditionne), initiales du receveur.' },
              { '@type': 'HowToStep', name: 'Reorganiser physiquement les frigos', text: 'Regle d\'or : nouveaux produits derriere ou en dessous, anciens devant ou au-dessus. A chaque livraison, videz l\'etagere, remettez les anciens devant, placez les nouveaux derriere.' },
              { '@type': 'HowToStep', name: 'Former l\'equipe et afficher les regles', text: '15 min de formation en debut de saison + une affiche plastifiee dans chaque chambre froide. Message visuel clair : fleche de rotation, code couleur Day Dot.' },
              { '@type': 'HowToStep', name: 'Controler quotidiennement (5 min)', text: 'Le chef de partie verifie les DLC chaque matin. Tout produit a DLC J-1 ou depassee est identifie pour utilisation prioritaire ou jet trace.' },
              { '@type': 'HowToStep', name: 'Suivre les indicateurs de pertes', text: 'Tenir une fiche de pertes hebdomadaire : produit, quantite, motif. Calculer le taux de pertes mensuel (objectif < 2 %).' },
              { '@type': 'HowToStep', name: 'Ajuster les commandes a la rotation reelle', text: 'Si vous trouvez regulierement des produits en limite de DLC, reduisez les commandes. Cercle vertueux : FIFO -> moins de gaspillage -> commandes ajustees -> food cost ameliore.' }
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "FIFO vs LIFO en restauration : guide complet du choix legal et rentable",
            description: "FIFO ou LIFO pour gerer vos stocks en cuisine ? Definitions, comparatif chiffre et mise en place pratique pour reduire les pertes de 3 a 5 %.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'La redaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
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
            keywords: 'FIFO restauration, LIFO restaurant, methode FIFO restaurant, gestion stocks cuisine, rotation stocks restaurant, HACCP stocks, food cost gestion stocks, valorisation stock restaurant'
          }
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
              Calculateur gratuit
            </Link>
            <Link to="/login" className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors">Connexion</Link>
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
        subtitle="Sans systeme de rotation des stocks, les restaurants perdent en moyenne 3 a 5 % de leurs achats en produits perimes. Voici la methode complete pour stopper l'hemorragie et gagner 9 000 EUR par an."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* Encadre rapide */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Resume rapide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            FIFO ou LIFO ? La reponse en 4 points
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-teal-200 shrink-0 mt-0.5" />
              <span><strong className="text-white">FIFO</strong> (First In, First Out) = methode obligatoire en restauration alimentaire. Conforme HACCP, autorisee comptablement.</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0 mt-0.5" />
              <span><strong className="text-white">LIFO</strong> (Last In, First Out) = <strong>interdit en France depuis 2005</strong> pour la valorisation comptable. Non conforme HACCP.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-teal-200 shrink-0 mt-0.5" />
              <span><strong className="text-white">CMUP</strong> (Cout Moyen Unitaire Pondere) = methode comptable legale en France, complement frequent au FIFO physique.</span>
            </div>
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-teal-200 shrink-0 mt-0.5" />
              <span><strong className="text-white">Impact :</strong> un FIFO bien applique reduit le food cost de 2 a 4 points, soit 5 000 a 25 000 EUR/an selon la taille du restaurant.</span>
            </div>
          </div>
        </div>

        {/* Intro */}
        <div className="mt-12 prose-content">
          <p className="text-[#374151] text-lg leading-relaxed mb-6">
            Dans votre cuisine, chaque jour, quelqu'un decide quel produit utiliser en premier. Sans systeme, on attrape ce qui est a portee de main — et on perd entre <strong>3 et 5 % des achats</strong> en produits perimes, soit 3 000 a 25 000 EUR par an selon la taille du restaurant. Les methodes FIFO et LIFO apportent une reponse structuree a ce probleme. Mais une seule des deux est legale en France, et seul le FIFO est compatible avec les exigences sanitaires HACCP.
          </p>
          <p className="text-[#374151] leading-relaxed">
            Ce guide complet explique les deux methodes, leurs implications comptables et operationnelles, et detaille la mise en place pratique du FIFO en cuisine restaurant. A la fin, vous saurez exactement quoi faire et combien cela vous rapportera.
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
              { href: '#fifo', label: 'FIFO : definition, principe et avantages' },
              { href: '#lifo', label: 'LIFO : definition, cas d\'usage et interdiction' },
              { href: '#cmup', label: 'CMUP : la troisieme voie comptable' },
              { href: '#comparaison', label: 'Tableau comparatif FIFO vs LIFO vs CMUP' },
              { href: '#impact-chiffre', label: 'Impact chiffre des 3 methodes sur le stock' },
              { href: '#mise-en-place', label: 'Mettre en place le FIFO en 6 etapes' },
              { href: '#food-cost', label: 'Impact sur le food cost (cas chiffres)' },
              { href: '#erreurs', label: 'Les 7 erreurs FIFO a eviter' },
              { href: '#outils', label: 'Outils et materiel pour le FIFO' },
              { href: '#faq', label: 'Questions frequentes' },
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
              <strong>FIFO</strong> est l'acronyme de <em>First In, First Out</em>, traduit en francais par PEPS (Premier Entre, Premier Sorti). Le principe est elementaire : le produit recu en premier est utilise en premier. C'est la methode de reference universelle en restauration professionnelle, recommandee par les normes HACCP, la reglementation sanitaire francaise et le Plan Comptable General.
            </p>
            <p>
              En pratique, la methode FIFO restaurant impose une discipline a la fois physique (rangement chronologique des produits) et administrative (suivi des dates de reception et DLC). Quand bien meme une seule equipe ou un seul service ne respecte pas le FIFO, la chaine entiere est compromise.
            </p>
          </div>

          <div className="mt-8 bg-teal-50 border border-teal-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-teal-700" />
              <h3 className="font-bold text-teal-900">Exemple concret FIFO</h3>
            </div>
            <p className="text-sm text-teal-800 leading-relaxed">
              Vous recevez lundi 10 kg de saumon (DLC vendredi), jeudi 10 kg supplementaires (DLC lundi). Le vendredi, vous cuisinez les filets du lundi en priorite, pas ceux du jeudi. Les plus anciens passent toujours en premier, meme s'ils sont moins accessibles dans le frigo.
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
                Poissons : DLC 2-5 jours. Viandes : DLC 3-7 jours. Un oubli = perte seche d'un produit cher.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <h4 className="font-bold text-emerald-900 text-sm">Conformite HACCP</h4>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                La tracabilite HACCP repose sur la rotation chronologique des denrees. Sans FIFO, votre dossier sanitaire est invalide.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-emerald-700" />
                <h4 className="font-bold text-emerald-900 text-sm">Pertes evitables</h4>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Un restaurant sans FIFO perd en moyenne 3 a 5 % de ses achats en pertes perimees. Sur 8 000 EUR d'achats, c'est 240 EUR par mois.
              </p>
            </div>
          </div>

          <Callout type="info">
            <strong>Chiffre cle :</strong> sur 8 000 EUR d'achats mensuels, 3 % de pertes = 240 EUR jetes chaque mois, soit 2 880 EUR par an. Multipliez par 5 ans, c'est 14 400 EUR partis a la poubelle, juste pour ne pas avoir applique le FIFO restaurant.
          </Callout>
        </section>

        {/* SECTION 2 : LIFO */}
        <section id="lifo" className="mb-16">
          <SectionHeading icon={<Package className="w-6 h-6" />} number="2">
            LIFO : dernier entre, premier sorti
          </SectionHeading>

          <div className="prose-content">
            <p>
              <strong>LIFO</strong> = <em>Last In, First Out</em>, traduit en francais par DEPS (Dernier Entre, Premier Sorti). Le produit recu en dernier est utilise en premier. Cette methode est utilisee dans certaines industries (metallurgie, BTP) pour des raisons de stockage technique, mais en restauration alimentaire, elle est <strong>contre-productive et illegale comptablement</strong>.
            </p>
            <p>
              Le LIFO peut paraitre logique dans certains cas pratiques (silo de farine ou de sucre ou le dessus est toujours accessible en premier), mais il viole la regle de base de la securite alimentaire : utiliser les produits les plus anciens d'abord.
            </p>
          </div>

          <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-700" />
              <h3 className="font-bold text-orange-900">Cas d'usage tres limites du LIFO</h3>
            </div>
            <ul className="text-sm text-orange-800 space-y-1.5 mt-2">
              <li>- Produits secs en silo ou en vrac (farine, sucre) ou le dessus est forcement accessible en premier — pratique technique mais non recommandee</li>
              <li>- Comptabilite d'inventaire dans certains pays (USA notamment) — interdite en France depuis 2005</li>
              <li>- Periodes d'hyperinflation severe (theorie comptable americaine pour reduire l'impot) — sans pertinence en France</li>
            </ul>
          </div>

          <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              <strong>Important :</strong> Le Plan Comptable General francais n'autorise pas la methode LIFO pour valoriser les stocks depuis 2005. Les seules methodes legales en France sont le <strong>FIFO (PEPS)</strong> et le <strong>CMUP (Cout Moyen Unitaire Pondere)</strong>. Utiliser le LIFO en France expose a un rejet de comptabilite et un redressement fiscal.
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Pourquoi le LIFO est dangereux en restauration</h3>
            <p>
              Au-dela de l'aspect legal, le LIFO en restauration accelere mecaniquement les pertes alimentaires. Si vous utilisez les nouveaux produits en premier, les anciens (deja proches de leur DLC) restent en stock et perissent. C'est l'inverse exact du bon sens sanitaire et economique.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-3">
              <li>Augmentation des pertes alimentaires de 5 a 10 % en moyenne</li>
              <li>Risque sanitaire : produits perimes consommes par erreur</li>
              <li>Non-conformite HACCP : sanctions DDPP possibles</li>
              <li>Rejet de comptabilite par l'administration fiscale francaise</li>
              <li>Tracabilite alimentaire impossible (regle CE 178/2002)</li>
            </ul>
          </div>
        </section>

        {/* SECTION 3 : CMUP */}
        <section id="cmup" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="3">
            CMUP : la troisieme voie comptable
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>CMUP</strong> (Cout Moyen Unitaire Pondere), parfois appele CUMP, est une methode de valorisation comptable alternative au FIFO. Le principe : a chaque entree en stock, on recalcule un prix moyen pondere par les quantites. C'est une moyenne mobile qui lisse les variations de prix d'achat dans le temps.
            </p>
            <p>
              Le CMUP est legal en France, simple a tenir manuellement (idem Excel) et tres repandu dans les TPE/PME de restauration. Il n'est pas concurrent du FIFO mais complementaire : le FIFO est applique <strong>physiquement</strong> en cuisine (rotation des denrees), le CMUP est applique <strong>comptablement</strong> pour la valorisation du stock final.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Formule du CMUP</h3>
            <div className="bg-white px-4 py-3 rounded-lg border border-mono-900 font-mono text-sm mb-4">
              <strong>CMUP =</strong> (Valeur stock initial + Valeur achats periode) / (Quantite stock initial + Quantite achetee periode)
            </div>
            <p className="text-sm text-mono-400 leading-relaxed">
              On obtient un prix unitaire moyen qui sert ensuite a valoriser le stock final (multiplie par la quantite restante). Cette methode est utilisee en restauration pour les produits a forte variation de prix (poissons, certains legumes, certains alcools).
            </p>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Exemple chiffre CMUP</h3>
            <p>Restaurant achete du beurre demi-sel au cours du mois :</p>
            <ul className="list-disc list-inside space-y-1.5 text-mono-350 mt-3">
              <li>Stock initial : 5 kg a 6 EUR/kg = 30 EUR</li>
              <li>1er achat : 10 kg a 6 EUR/kg = 60 EUR</li>
              <li>2e achat : 10 kg a 7 EUR/kg = 70 EUR</li>
              <li>3e achat : 5 kg a 7,50 EUR/kg = 37,50 EUR</li>
            </ul>
            <p className="mt-3">
              Total : 30 kg pour 197,50 EUR. CMUP = 197,50 / 30 = <strong>6,58 EUR/kg</strong>. Si le stock final est de 8 kg, sa valeur comptable au CMUP est : 8 x 6,58 = <strong>52,67 EUR</strong>.
            </p>
            <p className="mt-3">
              En FIFO strict, le stock final aurait ete valorise au prix des dernieres entrees : 5 kg x 7,50 + 3 kg x 7 = 58,50 EUR. Difference : 5,83 EUR sur ce produit. Sur 100 references, l'ecart cumule peut atteindre plusieurs centaines d'euros.
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
              Voici le comparatif complet des trois methodes de gestion des stocks en restauration sur 12 criteres clefs. Cela vous permet de visualiser instantanement laquelle adopter selon votre contexte.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-975 text-mono-100">
                  <th className="text-left px-4 py-3 font-semibold">Critere</th>
                  <th className="text-center px-4 py-3 font-semibold text-emerald-700">FIFO</th>
                  <th className="text-center px-4 py-3 font-semibold text-amber-700">CMUP</th>
                  <th className="text-center px-4 py-3 font-semibold text-rose-700">LIFO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mono-900">
                {[
                  ['Adapte aux denrees perissables', 'Oui (excellent)', 'Oui', 'Non'],
                  ['Conforme HACCP', 'Oui', 'Compatible', 'Non'],
                  ['Reduit le gaspillage alimentaire', 'Oui (-3 a -5 %)', 'Neutre', 'Augmente les pertes'],
                  ['Reflete les prix actuels du marche', 'Oui (precis)', 'Lissage (moyenne)', 'Decale (anciens prix)'],
                  ['Valorisation comptable legale France', 'Autorise', 'Autorise', 'Interdit depuis 2005'],
                  ['Complexite mise en place physique', 'Moyenne', 'Faible', 'Faible'],
                  ['Complexite calcul comptable', 'Elevee (lot par lot)', 'Faible', 'Faible'],
                  ['Adapte produits secs en vrac', 'A adapter', 'Oui', 'Possible techniquement'],
                  ['Cout d\'investissement initial', 'Faible (< 200 EUR)', 'Tres faible', 'Tres faible'],
                  ['Impact food cost', 'Reduction 2-4 pts', 'Neutre', 'Augmentation 2-5 pts'],
                  ['Tracabilite alimentaire (CE 178/2002)', 'Optimale', 'Acceptable', 'Insuffisante'],
                  ['Recommande pour restaurants FR', 'OUI absolument', 'OUI (comptable)', 'NON jamais'],
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
            <strong>Verdict :</strong> en restauration professionnelle francaise, la combinaison gagnante est <strong>FIFO physique en cuisine + CMUP comptable pour la valorisation</strong>. Le LIFO est a proscrire integralement.
          </p>
        </section>

        {/* SECTION 5 : Impact chiffre */}
        <section id="impact-chiffre" className="mb-16">
          <SectionHeading icon={<TrendingDown className="w-6 h-6" />} number="5">
            Impact chiffre des 3 methodes sur la valorisation du stock
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voyons concretement comment les trois methodes impactent la valorisation finale du stock dans un contexte d'inflation moderee (cas le plus frequent en restauration 2025-2026). Prenons un produit phare : le beurre demi-sel.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Mouvements de stock sur le mois</h3>
            <ul className="space-y-1.5 text-sm text-mono-350">
              <li>- 1er du mois : entree 10 kg a 6,00 EUR/kg = 60,00 EUR</li>
              <li>- 8 du mois : entree 10 kg a 6,50 EUR/kg = 65,00 EUR</li>
              <li>- 15 du mois : entree 10 kg a 7,00 EUR/kg = 70,00 EUR</li>
              <li>- 22 du mois : entree 5 kg a 7,50 EUR/kg = 37,50 EUR</li>
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
              <p className="text-xs text-emerald-700 mt-2 italic">Methode legale + reflete les prix actuels</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h4 className="font-bold text-amber-900 mb-2">Valorisation CMUP</h4>
              <p className="text-xs text-amber-800 mb-2">
                CMUP = (60 + 65 + 70 + 37,50) / 35 kg = 6,64 EUR/kg. Stock final : 5 x 6,64
              </p>
              <p className="text-2xl font-extrabold text-amber-700">33,21 EUR</p>
              <p className="text-xs text-amber-700 mt-2 italic">Methode legale + lissage des prix</p>
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
            <strong>Lecture :</strong> en inflation, le FIFO donne la valorisation la plus elevee (les derniers prix sont en stock), le LIFO la plus basse (les anciens prix subsistent au bilan). En periode de hausse des prix, le LIFO sous-estime artificiellement la valeur du stock — c'est pour cela qu'il etait utilise aux USA pour reduire l'impot sur les benefices. En France, c'est interdit precisement pour eviter ce type d'optimisation fiscale.
          </Callout>
        </section>

        {/* SECTION 6 : Mise en place */}
        <section id="mise-en-place" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="6">
            Mettre en place le FIFO en 6 etapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la procedure complete pour deployer un systeme FIFO restaurant fiable en moins d'une semaine. Cette methode est utilisee par les chaines de restauration professionnelles et adaptee aux independants.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Etiqueter systematiquement toutes les receptions',
                body: "Chaque produit entrant recoit une etiquette obligatoirement : date de reception, DLC d'origine, nom du produit (si reconditionne), initiales du receptionnaire, eventuellement le lot. Outils recommandes : etiqueteuse Brother PT-D210 (~50 EUR), rouleaux solubles au lavage (~30 EUR/an), pastilles Day Dot couleur (~20 EUR). Pour un investissement de moins de 100 EUR, vous economisez 5 000 a 25 000 EUR par an."
              },
              {
                title: 'Reorganiser physiquement les espaces de stockage',
                body: "Regle d'or : nouveaux produits derriere ou en dessous, anciens devant ou au-dessus. A chaque livraison, videz l'etagere, remettez les anciens devant, placez les nouveaux derriere. Pour les frigos profonds : marquage au sol des zones FIFO. Pour les etageres : utilisation de bacs gastronomes inclines. L'organisation physique force le bon reflexe — c'est plus efficace que la formation."
              },
              {
                title: 'Former l\'equipe et afficher les regles',
                body: "Formation de 15 min en debut de saison + une affiche plastifiee dans chaque chambre froide. Message visuel : fleche de rotation, code couleur Day Dot, regle 'vieux devant / nouveau derriere'. Repeter la formation a chaque nouvel arrivant et a chaque changement de poste. Designer un referent FIFO par poste."
              },
              {
                title: 'Controler quotidiennement (5 min)',
                body: "Le chef de partie ou le second verifie les DLC chaque matin avant le service. Tout produit a DLC J-1 ou depassee est identifie pour utilisation prioritaire (suggestion du jour, plat ephemere) ou jet trace (fiche perte). Cette verification s'integre naturellement a la checklist HACCP quotidienne sans charge additionnelle."
              },
              {
                title: 'Mesurer et suivre les indicateurs cles',
                body: "Tenir deux KPIs : (1) taux de pertes mensuel = valeur des produits jetes / valeur des achats x 100 (cible < 2 %), (2) ecart food cost theorique vs reel issu de l'inventaire. Un ecart de plus de 2 points signale un dysfonctionnement FIFO. Afficher ces chiffres mensuellement dans le bureau. La transparence renforce l'adhesion de l'equipe."
              },
              {
                title: 'Ajuster les commandes a la rotation reelle',
                body: "Le FIFO revele souvent un probleme de sur-commande. Si vous trouvez regulierement des produits en limite de DLC malgre le FIFO, commandez moins ou plus souvent. Cercle vertueux : FIFO -> moins de gaspillage -> commandes ajustees -> food cost ameliore -> tresorerie liberee. L'optimisation des commandes est detaillee dans notre guide de la rotation des stocks."
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
            <strong>Pour aller plus loin :</strong> consultez notre <Link to="/blog/methode-fifo-gestion-stocks-restaurant" className="underline font-semibold hover:text-teal-700">guide pratique de la methode FIFO en restauration</Link> qui detaille les 4 piliers de la mise en pratique et la checklist FIFO quotidienne.
          </Callout>
        </section>

        {/* SECTION 7 : Impact food cost */}
        <section id="food-cost" className="mb-16">
          <SectionHeading icon={<TrendingDown className="w-6 h-6" />} number="7">
            Impact du FIFO sur le food cost (cas chiffres)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Un FIFO bien applique reduit le gaspillage de <strong>2 a 4 points de food cost</strong> dans les restaurants qui ne le pratiquaient pas. Voici un tableau d'impact chiffre sur 4 tailles d'etablissements differents.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-975">
                  <th className="text-left px-4 py-3 font-semibold text-mono-100">CA mensuel</th>
                  <th className="text-center px-4 py-3 font-semibold text-mono-100">Food cost avant FIFO</th>
                  <th className="text-center px-4 py-3 font-semibold text-mono-100">Food cost apres FIFO</th>
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
            Estimations basees sur une reduction de 2 a 4 % du food cost apres mise en place d'un FIFO restaurant structure. Sources : donnees agregees RestauMargin sur 500+ restaurants connectes et benchmarks GIRA Conseil 2026.
          </p>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Cas chiffre detaille : bistrot 30 000 EUR de CA</h3>
            <p>
              Restaurant bistronomique a Lyon, 35 couverts, CA mensuel 30 000 EUR HT, food cost cible 32 %.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
              <h4 className="font-bold text-rose-900 mb-2">Scenario A — Sans FIFO (8 % de pertes)</h4>
              <ul className="text-sm text-rose-800 space-y-1">
                <li>- Achats matieres : 11 200 EUR</li>
                <li>- Pertes (8 %) : 896 EUR</li>
                <li>- Consommation reelle : 10 304 EUR</li>
                <li>- <strong>Food cost reel : 34,3 %</strong></li>
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <h4 className="font-bold text-emerald-900 mb-2">Scenario B — Avec FIFO (2 % de pertes)</h4>
              <ul className="text-sm text-emerald-800 space-y-1">
                <li>- Achats matieres : 9 800 EUR (optimises)</li>
                <li>- Pertes (2 %) : 196 EUR</li>
                <li>- Consommation reelle : 9 604 EUR</li>
                <li>- <strong>Food cost reel : 32,0 %</strong></li>
              </ul>
            </div>
          </div>

          <Callout type="info">
            <strong>Gain net annuel :</strong> economie achats (16 800 EUR/an) + reduction pertes (8 400 EUR/an) = <strong>25 200 EUR/an</strong>. Soit l'equivalent d'un mois et demi de CA en marge nette additionnelle. Investissement initial FIFO : moins de 200 EUR. ROI : 12 600 %.
          </Callout>
        </section>

        {/* SECTION 8 : Erreurs */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="8">
            Les 7 erreurs FIFO a eviter absolument
          </SectionHeading>

          <div className="space-y-5 mt-8">
            <ErreurCard
              number={1}
              title="Ranger les nouveaux produits devant"
              desc="Reflexe naturel le plus repandu (rapide a la reception) mais oppose au principe FIFO. Sur 30 receptions par mois, c'est 30 occasions de degrader le systeme. La solution : marquer physiquement les zones FIFO (rubans adhesifs au sol des etageres) et faire de la rotation a la reception un geste obligatoire."
            />
            <ErreurCard
              number={2}
              title="Ne pas etiqueter les contenants reconditionnes"
              desc="Bocaux de cornichons, sauces transvasees, vinaigres en burettes, huiles en pichets : ces produits perdent leur etiquette d'origine et donc leur DLC. Sans etiquetage, vous ne savez plus depuis quand c'est ouvert. Regle absolue : tout contenant transfere recoit une etiquette avec date d'ouverture et DLC secondaire."
            />
            <ErreurCard
              number={3}
              title="Ignorer la DLC secondaire (apres ouverture)"
              desc="Une creme fraiche fermee se conserve 3 semaines, ouverte seulement 3 jours. Une bouteille de vin ouverte se conserve 2-3 jours au frais. Un sachet de levure ouvert 48h. Connaitre les DLC secondaires et les afficher est aussi important que le FIFO lui-meme."
            />
            <ErreurCard
              number={4}
              title="Laisser des produits a plusieurs endroits"
              desc="Le meme produit dans 2 frigos differents ou 2 etageres differentes : double tracabilite, risque de doublon, complexite de gestion. Regle : un produit = un emplacement unique. Si volume important, etagere dediee mais zone unique."
            />
            <ErreurCard
              number={5}
              title="Inventaire en debut de mois seulement"
              desc="Si vous decouvrez les ecarts FIFO uniquement lors de l'inventaire mensuel, les pertes sont deja consommees. Ajouter un inventaire flash hebdomadaire sur les 10 produits les plus chers et un controle DLC quotidien permet de detecter les derives en temps reel."
            />
            <ErreurCard
              number={6}
              title="Ne pas former les nouveaux employes"
              desc="Une seule personne qui ne connait pas le FIFO peut saboter tout le systeme. Chaque nouvel arrivant doit avoir 15 min de formation FIFO le premier jour, avec demonstration physique. Un livret HACCP/FIFO de 2 pages a signer est un bon support."
            />
            <ErreurCard
              number={7}
              title="Sur-stocker pour 'ne pas etre en rupture'"
              desc="Mieux vaut 2 commandes par semaine (frais tendus) que des stocks volumineux qui generent 8 % de pertes. La peur de la rupture pousse a sur-commander, ce qui aggrave le probleme FIFO. Faire confiance aux fournisseurs et adapter les volumes a la rotation reelle observee."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumule :</strong> ces 7 erreurs combinees peuvent representer 4 a 8 points de food cost en plus, soit 4 800 a 9 600 EUR par an sur un restaurant a 25 000 EUR de CA mensuel. Mettre en place une discipline FIFO est l'action ROI numero 1 pour un restaurateur.
          </Callout>
        </section>

        {/* SECTION 9 : Outils */}
        <section id="outils" className="mb-16">
          <SectionHeading icon={<Tag className="w-6 h-6" />} number="9">
            Outils et materiel pour le FIFO restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le FIFO ne necessite pas un gros budget. Voici la liste complete du materiel recommande pour un demarrage efficace, avec budgets indicatifs 2026.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Materiel</th>
                  <th className="text-left py-3 px-4 font-semibold">Usage</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Prix indicatif 2026</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { mat: 'Etiqueteuse Brother PT-D210 ou Dymo LabelManager', usage: 'Impression d\'etiquettes professionnelles', prix: '45-65 EUR' },
                  { mat: 'Rouleaux d\'etiquettes solubles au lavage (annuel)', usage: 'Etiquetage des contenants alimentaires lavables', prix: '25-40 EUR/an' },
                  { mat: 'Pastilles Day Dot couleur (7 jours)', usage: 'Code couleur visuel par jour de la semaine', prix: '15-25 EUR' },
                  { mat: 'Feutre indelebile permanent (lot de 5)', usage: 'Marquage congelateur et contenants', prix: '10-15 EUR' },
                  { mat: 'Affiches plastifiees procedure FIFO', usage: 'Rappel visuel dans chaque chambre froide', prix: '15-20 EUR' },
                  { mat: 'Logiciel inventaire (mensuel)', usage: 'Suivi DLC et alertes automatiques', prix: '29-80 EUR/mois' },
                  { mat: 'Tablette Android dediee inventaire (optionnel)', usage: 'Saisie en mobilite dans les zones de stockage', prix: '150-300 EUR' },
                  { mat: 'Bacs gastronomes inclines (lot de 5)', usage: 'Force le rangement chronologique en frigo', prix: '60-100 EUR' }
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
              <strong>Budget total demarrage (hors logiciel) :</strong> moins de 200 EUR pour le materiel de base, 350 EUR avec tablette dediee. Avec logiciel mensuel, comptez 29 a 80 EUR/mois supplementaires. ROI atteint en moins de 2 mois dans 95 % des cas.
            </p>
            <p>
              Pour aller plus loin sur l'automatisation, consultez notre guide complet de l'<Link to="/blog/inventaire-restaurant-guide" className="text-teal-700 underline hover:text-teal-800">inventaire restaurant</Link> et notre article sur la <Link to="/blog/rotation-stocks-restaurant" className="text-teal-700 underline hover:text-teal-800">rotation des stocks</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes FIFO restaurant</h2>
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
              Sources et references
            </h2>
            <ul className="text-sm text-mono-400 space-y-2">
              <li>- Reglement (CE) n° 178/2002 du Parlement europeen — Tracabilite des denrees alimentaires</li>
              <li>- Plan Comptable General francais (PCG) — Article 213-1 et 214-1 (methodes de valorisation autorisees)</li>
              <li>- Guide des Bonnes Pratiques d'Hygiene (GBPH) restauration — DGAL et ANSES</li>
              <li>- Paquet Hygiene europeen — Reglements (CE) 852/2004, 853/2004 et 854/2004</li>
              <li>- INSEE — Statistiques sectorielles de la restauration en France (donnees 2024-2026)</li>
              <li>- GIRA Conseil — Etude annuelle profitabilite restaurants HCR France 2026</li>
              <li>- Base RestauMargin — 500+ restaurants connectes, donnees agregees 2025-2026</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Suivez vos stocks et votre food cost en temps reel
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin vous aide a appliquer le FIFO efficacement : alertes DLC, suggestion de plats du jour, food cost reel par plat et identification automatique des pertes avant qu'elles impactent votre resultat.
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
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin sur la gestion des stocks</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/methode-fifo-gestion-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Methode FIFO en pratique</h3>
              <p className="text-xs text-mono-500">4 piliers, checklist quotidienne, exemples chiffres.</p>
            </Link>
            <Link to="/blog/inventaire-restaurant-guide" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Inventaire restaurant</h3>
              <p className="text-xs text-mono-500">Methode complete, frequence, outils, valorisation.</p>
            </Link>
            <Link to="/blog/rotation-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Rotation des stocks</h3>
              <p className="text-xs text-mono-500">Calcul, benchmarks, leviers d'optimisation.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant</h3>
              <p className="text-xs text-mono-500">Food cost, marge brute, coefficient multiplicateur.</p>
            </Link>
            <Link to="/blog/food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Food cost optimal</h3>
              <p className="text-xs text-mono-500">Benchmarks par type d'etablissement.</p>
            </Link>
            <Link to="/blog/gaspillage" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le gaspillage</h3>
              <p className="text-xs text-mono-500">10 strategies pour limiter les pertes.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Reduire le food cost</h3>
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
          <Link to="/blog/methode-fifo-gestion-stocks-restaurant" className="text-sm text-teal-600 hover:underline">Methode FIFO en pratique &rarr;</Link>
        </div>

        </article>
      </main>

      {/* Footer */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
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
          <p className="mt-6 text-xs text-mono-700">&copy; {new Date().getFullYear()} RestauMargin. Tous droits reserves.</p>
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
