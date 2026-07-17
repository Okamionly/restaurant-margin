import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Package, Tag, ClipboardList, AlertTriangle, TrendingDown, ArrowRight, Calculator, RefreshCw, CheckCircle, Lightbulb, BarChart3, Target, FileText, ListChecks, Scale } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Methode FIFO en restauration : guide pratique"
   Mot-cle principal : methode FIFO restaurant
   ~3 200 mots — modele BlogCalcMarge
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "FIFO ou FEFO, lequel utiliser concretement en cuisine ?",
    answer: "En cuisine professionnelle, on parle de FIFO mais on applique du FEFO dans les faits. FIFO = First In First Out (premier entre, premier sorti, base sur la chronologie). FEFO = First Expired First Out (DLC la plus proche sortie en premier). Dans 90 % des cas, les deux methodes coincident. Cas de divergence : un lot de yaourts en promo livre en deuxieme position mais avec une DLC plus courte. Regle pratique : c'est la DLC qui prime sur la date d'arrivee."
  },
  {
    question: "Mes employes ne respectent pas le FIFO restaurant, comment faire ?",
    answer: "Trois leviers complementaires : (1) Formation initiale documentee de 15 min par nouvel arrivant, avec procedure ecrite affichee en cuisine. (2) Responsabilisation : un referent FIFO par poste, designe nominativement. (3) Incentives : prime trimestrielle indexee sur le taux de pertes (cible < 2 %). Cumuler les trois leviers donne 90 % d'adhesion en moins d'un mois. L'organisation physique des frigos est aussi un levier puissant : si les nouveaux produits sont physiquement derriere, le bon reflexe est force."
  },
  {
    question: "Combien coute la mise en place complete d'un systeme FIFO ?",
    answer: "Tres peu en absolu. Etiqueteuse Brother PT-D210 ou Dymo : 50 EUR. Rouleaux d'etiquettes solubles : 30 EUR/an. Pastilles Day Dot couleur : 20 EUR. Affiches plastifiees : 15 EUR. Formation initiale equipe : 2h x salaire moyen. Total : moins de 200 EUR pour un ROI annuel de 5 000 a 25 000 EUR selon la taille du restaurant. C'est le meilleur ratio investissement / rentabilite de la gestion de restaurant en general."
  },
  {
    question: "Le FIFO s'applique-t-il aussi aux boissons ?",
    answer: "Oui, et c'est souvent neglige. Les vins courants (rotation a optimiser, DLC virtuelle), les softs en bouteilles (DLC 6-12 mois), les bieres en pression (futs avec DLC 3-4 mois), les bieres en bouteilles (DLC 9-12 mois). N'oubliez pas non plus les produits d'epicerie une fois ouverts : huiles d'olive (rancissement apres ouverture), vinaigres balsamiques, sirops, sauces industrielles. Pour les spiritueux et vins de garde, le FIFO classique ne s'applique pas (les produits ne se degradent pas dans le temps)."
  },
  {
    question: "Comment mesurer l'efficacite de mon FIFO ?",
    answer: "Suivez deux indicateurs principaux : (1) Taux de pertes mensuel = valeur des produits jetes / valeur des achats x 100. Objectif < 2 %. (2) Ecart entre food cost theorique (ventes x fiches techniques) et food cost reel (issu de l'inventaire). Un ecart > 2 points signale un probleme FIFO ou un autre dysfonctionnement (vol, surdosage). Ajouter eventuellement : nombre de produits a DLC depassee identifies par semaine (objectif < 5)."
  },
  {
    question: "Comment etiqueter dans la pratique sans perdre de temps ?",
    answer: "Methode rapide : etiqueteuse pre-programmee avec votre nom de restaurant et la date du jour automatique. A la reception, l'etiqueteur clique sur le produit dans la liste, l'etiquette s'imprime en 2 secondes. Temps total etiquetage : 1-2 min pour une livraison de 20 references. Alternative manuelle : feutre indelebile + ruban adhesif jaune fluo. Mention minimum : date jj/mm + DLC. Temps : 3-5 min par livraison."
  },
  {
    question: "Que faire des produits qui approchent de la DLC ?",
    answer: "Quatre options dans l'ordre de priorite : (1) Suggestion du jour ou plat ephemere qui utilise prioritairement ce produit (impact zero sur la marge). (2) Promotion ciblee sur la carte (mini-prix sur un plat). (3) Don a une association alimentaire (Restos du Coeur, ANDES, Banque alimentaire) avec deductibilite fiscale de 60 % de la valeur HT. (4) En dernier recours, jet avec tracabilite (fiche perte signee). Le jet pur et simple sans plan d'action est un echec de planification, pas une fatalite."
  },
  {
    question: "Le FIFO est-il obligatoire legalement en France ?",
    answer: "Pas explicitement au sens d'une obligation legale directe, mais c'est la seule pratique conforme au reglement (CE) 178/2002 sur la tracabilite des denrees alimentaires et aux exigences HACCP. En cas de controle sanitaire DDPP, l'absence de systeme de rotation des denrees est un point de non-conformite. Sanctions : avertissement, mise en demeure, amende administrative jusqu'a 1 500 EUR, voire fermeture administrative si risque sanitaire avere. Le FIFO est donc obligatoire 'de facto'."
  },
  {
    question: "Faut-il appliquer le FIFO aux produits surgeles ?",
    answer: "Oui, absolument. Au congelateur, l'etiquetage est encore plus crucial car visuel impossible. Mentions obligatoires : date de congelation, DLC d'origine, nom du produit. Utiliser un feutre indelebile sur le sac directement ou des etiquettes resistantes au froid. DLC indicatives au congelateur : viande hachee 1 mois, viande piece 3 mois, poisson 4-6 mois, legumes 8-12 mois, pain 3 mois. Un produit non etiquete au congelateur doit etre jete par precaution."
  },
  {
    question: "Comment integrer le FIFO dans la checklist HACCP quotidienne ?",
    answer: "Ajouter 3 points a votre checklist HACCP existante : (1) Verification des DLC critiques (< 48h) avant chaque service, par le chef de partie, en 5 min. (2) Controle visuel de l'organisation FIFO dans chaque chambre froide : anciens devant, nouveaux derriere. (3) Saisie des produits a DLC depassee dans la fiche 'pertes du jour'. Cette integration ne demande pas plus de 10 min par jour et garantit la coherence des deux systemes (HACCP + FIFO)."
  }
];

export default function BlogMethodeFifo() {
  const faqSchema = buildFAQSchema(faqItems);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Accueil', url: 'https://www.restaumargin.fr' },
    { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
    { name: 'Methode FIFO en restauration', url: 'https://www.restaumargin.fr/blog/methode-fifo-gestion-stocks-restaurant' }
  ]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Methode FIFO en restauration 2026 : guide pratique complet"
        description="Appliquez la methode FIFO dans votre cuisine restaurant : 4 piliers, checklist quotidienne, etiquetage, exemples chiffres, impact food cost et reduction du gaspillage de 6 a 10 %."
        path="/blog/methode-fifo-gestion-stocks-restaurant"
        type="article"
        schema={[
          faqSchema,
          breadcrumbSchema,
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: "Comment appliquer la methode FIFO en restauration en 6 etapes",
            description: "Guide pratique pour mettre en place la methode FIFO dans votre cuisine restaurant et reduire les pertes alimentaires de 6 a 10 %.",
            totalTime: 'PT1H30M',
            tool: [
              'Etiqueteuse Brother PT-D210 ou Dymo (45-65 EUR)',
              'Rouleaux d\'etiquettes solubles (25-40 EUR/an)',
              'Pastilles Day Dot couleur 7 jours (15-25 EUR)',
              'Feutre indelebile pour congelateur (10 EUR)',
              'Affiches procedure plastifiees (15-20 EUR)',
              'Logiciel d\'inventaire FIFO (29-80 EUR/mois)'
            ],
            step: [
              { '@type': 'HowToStep', name: 'Pilier 1 : Etiqueter systematiquement', text: 'Chaque produit recoit a la reception une etiquette : date de reception, DLC d\'origine, nom, initiales receveur. Etiqueteuse pro recommandee.' },
              { '@type': 'HowToStep', name: 'Pilier 2 : Organiser les espaces', text: 'Frigos : etagere par categorie, anciens devant, nouveaux derriere. Etageres seches : zones A/B/C par frequence d\'usage. Congelateur : date au feutre indelebile.' },
              { '@type': 'HowToStep', name: 'Pilier 3 : Procedure de reception', text: 'Sequence 6 etapes : controle quantitatif (BL), controle qualitatif (visuel + T°), verification DLC, etiquetage, rangement FIFO, saisie logiciel.' },
              { '@type': 'HowToStep', name: 'Pilier 4 : Inventaire flash hebdomadaire', text: '5 min sur les 10 produits strategiques (80 % du food cost), identification des produits a passer en priorite, briefing chef pour adapter le menu.' },
              { '@type': 'HowToStep', name: 'Controle quotidien des DLC critiques', text: '5 min chaque matin avant le service. Tout produit < 48h DLC = identifie pour usage prioritaire ou jet trace.' },
              { '@type': 'HowToStep', name: 'Suivre les KPIs et ajuster', text: 'Taux de pertes mensuel < 2 %. Ecart food cost theorique vs reel < 2 points. Ajuster commandes selon rotation reelle observee.' }
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Methode FIFO en restauration : guide pratique complet 2026",
            description: "Mise en place complete de la methode FIFO dans un restaurant : 4 piliers, checklist quotidienne, exemples chiffres et impact food cost.",
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/methode-fifo-gestion-stocks-restaurant' }
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
            <Link to="/outils/calculateur-food-cost" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors">
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
          <span className="text-mono-100 font-medium">Methode FIFO</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Stocks"
        readTime="15 min"
        date="Mai 2026"
        title="Methode FIFO en restauration : guide pratique 2026"
        accentWord="FIFO"
        subtitle="Un restaurant moyen jette 6 a 10 % de ses achats alimentaires chaque mois. La methode FIFO est la solution la plus simple jamais inventee pour stopper cette hemorragie financiere. Voici le guide complet."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* Encadre formule rapide */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Les 4 piliers de la methode FIFO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Le systeme FIFO en restaurant en 4 piliers
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Etiquetage systematique</strong> : chaque produit recoit a la reception une etiquette (date, DLC, nom, initiales).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Organisation des espaces</strong> : anciens devant, nouveaux derriere. Force le bon reflexe physiquement.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Procedure de reception</strong> : sequence 6 etapes (controle, etiquetage, rangement, saisie).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Inventaire flash hebdomadaire</strong> : 5 min sur les 10 produits strategiques.</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectif standard : taux de pertes inferieur a 2 % du chiffre d'affaires. Impact food cost : -2 a -4 points en 1-3 mois.
          </p>
        </div>

        {/* Intro */}
        <div className="mt-12 prose-content">
          <p className="text-[#374151] text-lg leading-relaxed mb-6">
            <strong>Un restaurant moyen jette entre 6 et 10 % de ses achats alimentaires chaque mois.</strong> Sur un food cost mensuel de 12 000 EUR, ce sont 720 a 1 200 EUR qui partent a la poubelle, soit jusqu'a 14 400 EUR de marge nette annuelle perdue. Dans 80 % des cas, ces pertes sont dues a une mauvaise rotation des stocks et a l'absence d'un systeme FIFO restaurant rigoureux.
          </p>
          <p className="text-[#374151] leading-relaxed">
            La bonne nouvelle : la methode FIFO est la solution la plus simple et la moins couteuse de la gestion en restauration. Pour moins de 200 EUR d'investissement initial, vous pouvez recuperer 5 000 a 25 000 EUR par an. Ce guide vous donne la procedure complete pour une mise en place reussie en moins d'une semaine.
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
              { href: '#fifo-fefo', label: 'FIFO vs FEFO : la difference cruciale' },
              { href: '#obligatoire', label: 'Pourquoi le FIFO est obligatoire en restauration' },
              { href: '#piliers', label: 'Les 4 piliers de la mise en pratique' },
              { href: '#etiquetage', label: 'Etiquetage : guide detaille' },
              { href: '#organisation', label: 'Organisation physique des espaces' },
              { href: '#reception', label: 'Procedure de reception en 6 etapes' },
              { href: '#chiffre', label: 'Exemple chiffre : 8 % vs 2 % de pertes' },
              { href: '#checklist', label: 'Checklist FIFO quotidienne et hebdomadaire' },
              { href: '#erreurs', label: 'Les 7 erreurs classiques a eviter' },
              { href: '#kpi', label: 'Mesurer et piloter avec les bons KPIs' },
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

        {/* SECTION 1 : FIFO vs FEFO */}
        <section id="fifo-fefo" className="mb-16">
          <SectionHeading icon={<Package className="w-6 h-6" />} number="1">
            FIFO vs FEFO : la difference cruciale
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant de detailler la methode, il est essentiel de comprendre la distinction entre FIFO et FEFO. Ces deux acronymes sont souvent confondus mais designent des logiques differentes — meme si en restauration elles convergent dans 90 % des cas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">FIFO</h3>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed mb-2">
                <strong>First In, First Out</strong> = premier entre, premier sorti
              </p>
              <p className="text-sm text-emerald-800 leading-relaxed">
                On consomme d'abord les produits entres en premier dans le stock. Logique chronologique pure, basee sur la date de reception. Methode universelle, simple a comprendre et a expliquer a l'equipe.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-blue-900">FEFO</h3>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed mb-2">
                <strong>First Expired, First Out</strong> = premier perime, premier sorti
              </p>
              <p className="text-sm text-blue-800 leading-relaxed">
                On consomme d'abord les produits dont la DLC est la plus proche. Logique sanitaire pure, basee sur la date limite de consommation. Plus precis que le FIFO mais demande une analyse fine des DLC.
              </p>
            </div>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>En restauration, on applique principalement le FEFO</strong>, mais le terme FIFO est utilise par habitude car les deux methodes coincident dans 90 % des cas (les produits arrivent dans l'ordre des DLC). On parle donc souvent de FIFO en cuisine pour designer le FEFO operationnel.
            </p>
          </div>

          <div className="mt-6 border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4">
            <p className="text-sm font-semibold text-emerald-700 mb-1">Cas concret ou FIFO et FEFO divergent</p>
            <p className="text-sm text-emerald-700">
              Yaourts livres : 50 pots en deuxieme livraison de la semaine, mais ils proviennent d'un lot en promotion avec une DLC plus courte que les yaourts deja en stock (livres en premier mais DLC plus longue). Application FEFO : on sort en priorite le lot a DLC courte, meme s'il est arrive en second. Application FIFO stricte : on sort les anciens d'abord, et on jette les yaourts en promo perimes.
            </p>
          </div>
        </section>

        {/* SECTION 2 : Obligatoire */}
        <section id="obligatoire" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="2">
            Pourquoi le FIFO est obligatoire en restauration
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le FIFO restaurant n'est pas un "nice to have" ou une bonne pratique optionnelle. Il existe a la fois une raison sanitaire (obligation legale indirecte) et une raison economique (impact direct sur la marge nette).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-rose-700" />
                <h3 className="font-bold text-rose-900">Raison sanitaire (HACCP)</h3>
              </div>
              <p className="text-sm text-rose-800 leading-relaxed mb-3">
                Le reglement europeen CE 178/2002 et le <strong>Paquet Hygiene</strong> imposent tracabilite et fraicheur des produits. Le FIFO est la methode operationnelle reconnue pour repondre a ces exigences.
              </p>
              <p className="text-sm text-rose-800 leading-relaxed mb-3">
                <strong>Sanctions en cas de controle DDPP defavorable :</strong>
              </p>
              <ul className="text-sm text-rose-800 space-y-1 ml-4">
                <li>- Avertissement et mise en demeure</li>
                <li>- Amende administrative jusqu'a 1 500 EUR</li>
                <li>- Fermeture administrative si risque sanitaire</li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Raison economique</h3>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed mb-3">
                Sans FIFO, le saumon livre le mercredi (DLC dimanche) est range devant le saumon du lundi (DLC vendredi). Vendredi soir, on utilise le mercredi. Lundi suivant : saumon du lundi precedent perime, jete.
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>Multiplie par 80 references fraiches</strong> dans un restaurant moyen, cela represente 5 a 10 % de pertes mensuelles. Soit 600 a 1 200 EUR par mois sur 12 000 EUR d'achats.
              </p>
            </div>
          </div>

          <Callout type="warning">
            <strong>Double peine en cas d'absence de FIFO :</strong> vous perdez de l'argent (gaspillage alimentaire) ET vous etes en infraction sanitaire (non-conformite HACCP). C'est l'une des rares actions de gestion ou les benefices sont triples : financier, juridique et qualite client.
          </Callout>
        </section>

        {/* SECTION 3 : Piliers */}
        <section id="piliers" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="3">
            Les 4 piliers de la mise en pratique
          </SectionHeading>

          <div className="prose-content">
            <p>
              La methode FIFO en restauration repose sur 4 piliers indissociables. Negliger l'un d'eux compromet l'ensemble du systeme. Voici la vue d'ensemble avant le detail de chacun dans les sections suivantes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <div className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">1</span>
                <h3 className="font-bold text-mono-100">Etiquetage systematique</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Chaque produit entrant recoit une etiquette obligatoire : date de reception, DLC, nom, initiales receveur. Materiel : etiqueteuse Brother PT-D210 ou Dymo (50 EUR), rouleaux solubles (30 EUR/an).
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">2</span>
                <h3 className="font-bold text-mono-100">Organisation des espaces</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Frigos : etagere par categorie, anciens devant, nouveaux derriere. Etageres seches : zones A/B/C par DLC. Congelateurs : date au feutre indelebile, max 3 mois viande hachee.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">3</span>
                <h3 className="font-bold text-mono-100">Procedure de reception</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Sequence 6 etapes obligatoires : controle quantitatif (BL), controle qualitatif (visuel + T°), verification DLC (refus si {'<'} 3 jours), etiquetage, rangement FIFO, saisie logiciel. Duree : 15-25 min.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">4</span>
                <h3 className="font-bold text-mono-100">Inventaire flash hebdo</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                5 min sur les 10 produits strategiques (80 % du food cost). Identification des produits a passer en priorite. Briefing chef pour adapter le menu et eviter les pertes anticipees.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4 : Etiquetage */}
        <section id="etiquetage" className="mb-16">
          <SectionHeading icon={<Tag className="w-6 h-6" />} number="4">
            Etiquetage : guide detaille
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'etiquetage est le pilier le plus important du FIFO restaurant. Sans etiquette claire, impossible d'appliquer la rotation chronologique. Voici les regles, le materiel et les bonnes pratiques.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Mentions obligatoires sur chaque etiquette</h3>
            <ul className="space-y-2 text-sm text-mono-350">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" /><span><strong>Date de reception</strong> (format jj/mm/aaaa)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" /><span><strong>DLC d'origine</strong> ou DDM (date de durabilite minimale)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" /><span><strong>Nom du produit</strong> (si reconditionne ou transvase)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" /><span><strong>Initiales du receveur</strong> (responsabilisation)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" /><span><strong>Numero de lot</strong> (pour les produits a forte tracabilite : viandes, poissons)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" /><span><strong>DLC secondaire</strong> apres ouverture (pour les contenants ouverts)</span></li>
            </ul>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Materiel d'etiquetage recommande</h3>
            <p>Trois niveaux d'equipement selon votre budget et votre volume :</p>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <h4 className="font-bold text-emerald-900 mb-2">Entree de gamme</h4>
              <p className="text-xs text-emerald-800 mb-2">Feutre indelebile + ruban adhesif jaune fluo</p>
              <p className="text-lg font-extrabold text-emerald-700">15 EUR</p>
              <p className="text-xs text-emerald-700 mt-2">Convient pour &lt; 30 receptions/mois</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h4 className="font-bold text-blue-900 mb-2">Standard pro</h4>
              <p className="text-xs text-blue-800 mb-2">Etiqueteuse Brother PT-D210 + rouleaux solubles</p>
              <p className="text-lg font-extrabold text-blue-700">80 EUR</p>
              <p className="text-xs text-blue-700 mt-2">Recommande pour la plupart des restaurants</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <h4 className="font-bold text-purple-900 mb-2">Haut de gamme</h4>
              <p className="text-xs text-purple-800 mb-2">Dymo LabelManager 360D + Day Dot couleur</p>
              <p className="text-lg font-extrabold text-purple-700">150 EUR</p>
              <p className="text-xs text-purple-700 mt-2">Pour grands volumes (chaines, brasseries)</p>
            </div>
          </div>

          <Callout type="info">
            <strong>Astuce gain de temps :</strong> programmer l'etiqueteuse avec votre nom de restaurant et la date du jour automatique. A la reception, le chef de partie clique sur le produit dans la liste pre-enregistree, l'etiquette s'imprime en 2 secondes. Temps total etiquetage : 1-2 min pour une livraison de 20 references.
          </Callout>
        </section>

        {/* SECTION 5 : Organisation */}
        <section id="organisation" className="mb-16">
          <SectionHeading icon={<Package className="w-6 h-6" />} number="5">
            Organisation physique des espaces
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'organisation physique des espaces de stockage est le pilier qui demande le moins d'effort une fois mis en place, mais qui produit le plus de resultats. Voici comment reorganiser frigos, etageres et congelateurs pour forcer le FIFO restaurant naturellement.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">A</span>
                Frigos et chambres froides
              </h3>
              <ul className="text-sm text-mono-400 space-y-2">
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Une etagere par categorie de produit (viandes, poissons, laitiers, legumes, vins)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Anciens produits devant, nouveaux derriere ou en dessous</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Marquage au sol des zones (ruban adhesif de couleur)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Bacs gastronomes inclines pour forcer la rotation</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Affiche FIFO plastifiee a l'interieur de la porte</span></li>
              </ul>
            </div>

            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">B</span>
                Etageres seches (epicerie)
              </h3>
              <ul className="text-sm text-mono-400 space-y-2">
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Zones A/B/C selon la frequence d'usage (A = quotidien, B = hebdo, C = mensuel)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>DLC courtes positionnees en Zone A accessible</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Une rangee = un produit (pas de melange de lots)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Niveau bas = lourd (sacs farine, riz), niveau haut = leger (conserves)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Date de premiere ouverture sur les bocaux/sachets entames</span></li>
              </ul>
            </div>

            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">C</span>
                Congelateurs
              </h3>
              <ul className="text-sm text-mono-400 space-y-2">
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Date de congelation au feutre indelebile sur chaque sac</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>DLC maximales : viande hachee 1 mois, viande piece 3 mois, poisson 4-6 mois, legumes 8-12 mois</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Bacs etiquetes par categorie (pas de melange viandes / legumes)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Inventaire visuel mensuel (par categorie)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Produit non etiquete = jet immediat (regle sans exception)</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 6 : Reception */}
        <section id="reception" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="6">
            Procedure de reception en 6 etapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              La procedure de reception fournisseur est le moment cle ou le FIFO se met en place ou s'effondre. Voici la sequence professionnelle a appliquer systematiquement, avec un temps estime de 15 a 25 minutes par livraison.
            </p>
          </div>

          <ol className="mt-8 space-y-4">
            {[
              { title: 'Controle quantitatif (BL)', body: "Verifier que les quantites livrees correspondent exactement au bon de livraison. Tout ecart est note immediatement et signale au livreur (signature contestee si necessaire). Temps : 3-5 min." },
              { title: 'Controle qualitatif visuel et T°', body: "Verifier l'aspect des produits (fraicheur visuelle, emballage intact, absence de moisissures). Prendre la temperature de la chaine du froid avec un thermometre infrarouge (refus si > 4°C pour le frais). Temps : 2-3 min." },
              { title: 'Verification des DLC', body: "Refus systematique de tout produit a DLC inferieure a 3 jours pour le frais courant, 7 jours pour les viandes nobles, 15 jours pour la charcuterie. Ces seuils sont a adapter selon votre rotation reelle. Temps : 2 min." },
              { title: 'Etiquetage immediat', body: "Etiquette posee sur chaque produit avant rangement : date de reception, DLC, nom, initiales. Sans etiquette = pas de rangement. Temps : 5-8 min (avec etiqueteuse pro)." },
              { title: 'Rangement FIFO strict', body: "Vider l'etagere existante, remettre les anciens produits devant, placer les nouveaux derriere ou en dessous. Verifier l'ordre chronologique apparent. Temps : 3-5 min." },
              { title: 'Saisie logiciel et controle', body: "Enregistrer la reception dans le logiciel de gestion (stocks, prix d'achat, lots). Verifier que les prix correspondent a la commande. Archiver le BL. Temps : 2-3 min." }
            ].map((step, i) => (
              <li key={i} className="bg-white border border-mono-900 rounded-2xl p-5 flex gap-4">
                <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-extrabold text-base shadow-md">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-mono-100 mb-1">{step.title}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <Callout type="info">
            <strong>Total temps reception professionnelle :</strong> 15 a 25 minutes par livraison. Cela peut sembler long, mais c'est le moment ou se joue 80 % de la qualite du FIFO. Une reception baclee = une semaine de gestion compromise.
          </Callout>
        </section>

        {/* SECTION 7 : Cas chiffre */}
        <section id="chiffre" className="mb-16">
          <SectionHeading icon={<TrendingDown className="w-6 h-6" />} number="7">
            Exemple chiffre : 8 % vs 2 % de pertes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Restaurant a <strong>30 000 EUR de CA mensuel</strong>, food cost cible 32 %. Comparons deux scenarios sur la meme periode : avec et sans methode FIFO restaurant structuree.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
              <h3 className="font-bold text-rose-900 mb-3">Scenario A : Sans FIFO (8 % de pertes)</h3>
              <div className="space-y-2 text-sm text-rose-800">
                <div className="flex justify-between border-b border-rose-200 pb-1"><span>Achats matieres</span><strong>11 200 EUR</strong></div>
                <div className="flex justify-between border-b border-rose-200 pb-1"><span>Pertes alimentaires (8 %)</span><strong>896 EUR</strong></div>
                <div className="flex justify-between border-b border-rose-200 pb-1"><span>Consommation reelle</span><strong>10 304 EUR</strong></div>
                <div className="flex justify-between border-b border-rose-200 pb-1"><span>Surcommande typique</span><strong>+ 1 400 EUR</strong></div>
                <div className="flex justify-between font-bold text-rose-900 pt-2 border-t-2 border-rose-300"><span>Food cost reel</span><span>34,3 %</span></div>
              </div>
              <p className="text-xs text-rose-700 mt-3 italic">Restaurant en derive, marge fragile</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-emerald-900 mb-3">Scenario B : Avec FIFO (2 % de pertes)</h3>
              <div className="space-y-2 text-sm text-emerald-800">
                <div className="flex justify-between border-b border-emerald-200 pb-1"><span>Achats matieres</span><strong>9 800 EUR</strong></div>
                <div className="flex justify-between border-b border-emerald-200 pb-1"><span>Pertes alimentaires (2 %)</span><strong>196 EUR</strong></div>
                <div className="flex justify-between border-b border-emerald-200 pb-1"><span>Consommation reelle</span><strong>9 604 EUR</strong></div>
                <div className="flex justify-between border-b border-emerald-200 pb-1"><span>Commandes optimisees</span><strong>- 1 400 EUR</strong></div>
                <div className="flex justify-between font-bold text-emerald-900 pt-2 border-t-2 border-emerald-300"><span>Food cost reel</span><span>32,0 %</span></div>
              </div>
              <p className="text-xs text-emerald-700 mt-3 italic">Restaurant performant, marge maitrisee</p>
            </div>
          </div>

          <div className="mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6">
            <h3 className="font-bold text-teal-900 mb-3 text-lg">Gain net annuel</h3>
            <ul className="text-sm text-teal-800 space-y-2">
              <li>- Economie achats : 1 400 EUR/mois x 12 = <strong>16 800 EUR/an</strong></li>
              <li>- Reduction pertes : 700 EUR/mois x 12 = <strong>8 400 EUR/an</strong></li>
              <li className="border-t border-teal-300 pt-2 mt-2 font-bold text-teal-900 text-base">Total gain annuel : 25 200 EUR/an</li>
            </ul>
            <p className="text-xs text-teal-700 mt-3 italic">
              Soit un mois et demi de CA additionnel en marge nette. Investissement initial FIFO : moins de 200 EUR. ROI : 12 600 %.
            </p>
          </div>

          <div className="prose-content mt-8">
            <p>
              Ces chiffres sont conservateurs. Sur les restaurants qui n'avaient aucun FIFO et qui mettent en place une discipline rigoureuse, on observe regulierement des gains de 30 000 a 50 000 EUR par an. Pour aller plus loin, consultez notre comparatif <Link to="/blog/fifo-lifo-stocks-restaurant" className="text-teal-700 underline hover:text-teal-800">FIFO vs LIFO en restauration</Link>.
            </p>
          </div>
        </section>

        {/* SECTION 8 : Checklist */}
        <section id="checklist" className="mb-16">
          <SectionHeading icon={<ClipboardList className="w-6 h-6" />} number="8">
            Checklist FIFO quotidienne et hebdomadaire
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la checklist a imprimer et plastifier pour la coller dans votre bureau et dans chaque chambre froide. Elle resume les actions quotidiennes et hebdomadaires d'un systeme FIFO efficace.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">Q</span>
                Quotidien (5-10 min par jour)
              </h3>
              <ul className="space-y-2 text-sm text-mono-350 ml-9">
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Verifier DLC critiques (&lt; 48h) chaque matin avant service — chef ou second, 5 min</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Etiqueter toute nouvelle livraison a la reception — 15-25 min selon livraison</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Briefing equipe sur produits prioritaires avant service — chef, 3 min</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Saisie pertes du jour dans fiche dediee (si applicable)</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Mise a jour logiciel stock — 10 min en fin de service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">H</span>
                Hebdomadaire (30 min, le dimanche soir)
              </h3>
              <ul className="space-y-2 text-sm text-mono-350 ml-9">
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Inventaire flash sur 10 produits strategiques (viandes, poissons, vins) — manager, 30 min</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Verification organisation FIFO dans chaque chambre froide</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Identification produits a DLC courte pour suggestion du jour semaine suivante</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Mise a jour des commandes prevues selon stocks restants</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Briefing equipe sur les KPIs FIFO de la semaine (pertes, ecarts)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">M</span>
                Mensuel (2-3 heures, en fin de mois)
              </h3>
              <ul className="space-y-2 text-sm text-mono-350 ml-9">
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Inventaire complet portes fermees — equipe binome, 2-3h</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Calcul taux de pertes mensuel et comparaison avec mois precedents</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Calcul ecart food cost theorique vs reel</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Reunion bilan FIFO avec l'equipe (1h)</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Ajustement des procedures pour le mois suivant</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 9 : Erreurs */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="9">
            Les 7 erreurs classiques a eviter
          </SectionHeading>

          <div className="space-y-5 mt-8">
            <ErreurCard
              number={1}
              title="Ne pas etiqueter les bocaux et contenants reconditionnes"
              desc="Sauces transvasees, huiles en burettes, vinaigres dans des bouteilles, fromages emballes a part : ces produits perdent leur etiquette d'origine. Sans etiquetage, on ne sait plus depuis quand le produit est ouvert. Regle absolue : tout transvasement = nouvelle etiquette avec date d'ouverture et DLC secondaire."
            />
            <ErreurCard
              number={2}
              title="Ranger les nouveaux produits devant les anciens"
              desc="Reflexe naturel et le plus repandu. Le livreur est presse, le receptionnaire aussi. Resultat : les nouveaux produits sont poses sur l'etagere devant les anciens, qui sont oublies et perimes. La solution : marquage physique des zones FIFO et procedure de reception non negociable."
            />
            <ErreurCard
              number={3}
              title="Laisser des produits a plusieurs endroits"
              desc="Le meme produit dans 2 frigos differents ou 2 etageres differentes cree double tracabilite, risque de doublon, complexite de gestion. Regle : un produit = un emplacement unique. Si le volume est important, utiliser une etagere dediee, mais toujours dans une zone unique."
            />
            <ErreurCard
              number={4}
              title="Ignorer la DLC secondaire apres ouverture"
              desc="Une creme fraiche fermee se conserve 3 semaines, ouverte seulement 3 jours. Un sachet de levure 48h apres ouverture. Une bouteille de vin 2-3 jours. Sans suivi des DLC secondaires, vous accumulez des produits 'dormants' dangereux. Solution : reetiquetage a l'ouverture avec DLC secondaire."
            />
            <ErreurCard
              number={5}
              title="Faire l'inventaire en debut de mois seulement"
              desc="Decouvrir les ecarts FIFO uniquement lors de l'inventaire mensuel = trop tard, les pertes sont deja consommees. Ajouter un inventaire flash hebdomadaire sur les 10 produits les plus chers permet de detecter et corriger les derives en 7 jours maximum."
            />
            <ErreurCard
              number={6}
              title="Ne pas former les nouveaux employes"
              desc="Une seule personne qui ne connait pas le FIFO peut saboter tout le systeme. Chaque nouvel arrivant doit avoir 15 minutes de formation FIFO le premier jour, avec demonstration physique en cuisine. Un livret HACCP/FIFO de 2 pages a signer materialise l'engagement."
            />
            <ErreurCard
              number={7}
              title="Sur-stocker pour ne pas etre en rupture"
              desc="Mieux vaut 2 commandes par semaine en flux tendus que des stocks volumineux qui generent 8 % de pertes. La peur de la rupture pousse a sur-commander, ce qui aggrave mecaniquement le probleme FIFO. Faire confiance aux fournisseurs et adapter les volumes a la rotation reelle observee."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumule :</strong> ces 7 erreurs combinees peuvent representer 4 a 8 points de food cost en plus, soit 4 800 a 9 600 EUR par an sur un restaurant a 25 000 EUR de CA mensuel. Eviter ces erreurs n'est pas optionnel : c'est l'action ROI numero 1 d'un restaurant qui demarre.
          </Callout>
        </section>

        {/* SECTION 10 : KPIs */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="10">
            Mesurer et piloter avec les bons KPIs
          </SectionHeading>

          <div className="prose-content">
            <p>
              Sans mesure, pas de pilotage. Voici les 4 KPIs essentiels pour suivre l'efficacite de votre methode FIFO restaurant au fil du temps. Tous se calculent rapidement et donnent une vision claire de la performance.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">KPI</th>
                  <th className="text-left py-3 px-4 font-semibold">Formule</th>
                  <th className="text-center py-3 px-4 font-semibold">Frequence</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Cible</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-mono-100">Taux de pertes mensuel</td>
                  <td className="py-3 px-4 text-xs">Valeur produits jetes / valeur achats x 100</td>
                  <td className="py-3 px-4 text-center text-xs">Mensuel</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">&lt; 2 %</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-bold text-mono-100">Ecart food cost</td>
                  <td className="py-3 px-4 text-xs">Food cost reel - Food cost theorique</td>
                  <td className="py-3 px-4 text-center text-xs">Mensuel</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">&lt; 2 points</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-mono-100">Produits DLC depassee</td>
                  <td className="py-3 px-4 text-xs">Nombre de produits identifies / semaine</td>
                  <td className="py-3 px-4 text-center text-xs">Hebdomadaire</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">&lt; 5</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-bold text-mono-100">Rotation des stocks</td>
                  <td className="py-3 px-4 text-xs">Achats du mois / Stock moyen</td>
                  <td className="py-3 px-4 text-center text-xs">Mensuel</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">3 a 5 x</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Pour calculer ces KPIs facilement, utilisez le module integre de RestauMargin ou notre <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800">calculateur de food cost gratuit</Link>. Pour aller plus loin sur la rotation, lisez notre guide <Link to="/blog/rotation-stocks-restaurant" className="text-teal-700 underline hover:text-teal-800">Rotation des stocks en restauration</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions frequentes methode FIFO restaurant</h2>
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
              <li>- Reglement (CE) n° 178/2002 — Tracabilite des denrees alimentaires</li>
              <li>- Paquet Hygiene europeen (CE 852/2004, 853/2004, 854/2004)</li>
              <li>- Guide des Bonnes Pratiques d'Hygiene (GBPH) restauration — DGAL et ANSES</li>
              <li>- Plan Comptable General — Article 213-1 et 214-1 (methodes de valorisation)</li>
              <li>- INSEE — Statistiques sectorielles HCR France (donnees 2024-2026)</li>
              <li>- GIRA Conseil — Etude annuelle profitabilite restaurants HCR France 2026</li>
              <li>- Base RestauMargin — 500+ restaurants connectes, donnees agregees 2025-2026</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Reduisez vos pertes et gagnez 3 points de marge
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin automatise votre FIFO : alertes DLC, suggestions de plats du jour intelligentes, food cost reel en temps reel et suivi des pertes par categorie.
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
            <Link to="/blog/fifo-lifo-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">FIFO vs LIFO en restauration</h3>
              <p className="text-xs text-mono-500">Comparatif complet et choix legal en France.</p>
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
            <Link to="/blog/reduire-food-cost" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Food cost optimal</h3>
              <p className="text-xs text-mono-500">Benchmarks par type d'etablissement.</p>
            </Link>
            <Link to="/blog/gaspillage-alimentaire" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
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
          <Link to="/outils/calculateur-food-cost" className="text-sm text-teal-600 hover:underline">Calculateur food cost gratuit &rarr;</Link>
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
