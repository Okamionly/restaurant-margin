import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, Package, Tag, ClipboardList, AlertTriangle, TrendingDown, ArrowRight, Calculator, RefreshCw, CheckCircle, Lightbulb, BarChart3, Target, FileText, ListChecks, Scale } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Methode FIFO en restauration : guide pratique"
   Mot-cle principal : methode FIFO restaurant
   ~3 200 mots — modele BlogCalcMarge
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "FIFO ou FEFO, lequel utiliser concrètement en cuisine ?",
    answer: "En cuisine professionnelle, on parle de FIFO mais on applique du FEFO dans les faits. FIFO = First In First Out (premier entre, premier sorti, basé sur la chronologie). FEFO = First Expired First Out (DLC la plus proche sortie en premier). Dans 90 % des cas, les deux méthodes coïncident. Cas de divergence : un lot de yaourts en promo livré en deuxième position mais avec une DLC plus courte. Règle pratique : c'est la DLC qui prime sur la date d'arrivée."
  },
  {
    question: "Mes employés ne respectent pas le FIFO restaurant, comment faire ?",
    answer: "Trois leviers complémentaires : (1) Formation initiale documentée de 15 min par nouvel arrivant, avec procédure écrite affichée en cuisine. (2) Responsabilisation : un référent FIFO par poste, désigné nominativement. (3) Incentives : prime trimestrielle indexée sur le taux de pertes (cible < 2 %). Cumuler les trois leviers donne 90 % d'adhésion en moins d'un mois. L'organisation physique des frigos est aussi un levier puissant : si les nouveaux produits sont physiquement derrière, le bon réflexe est forcé."
  },
  {
    question: "Combien coûte la mise en place complète d'un système FIFO ?",
    answer: "Très peu en absolu. Étiqueteuse Brother PT-D210 ou Dymo : 50 EUR. Rouleaux d'étiquettes solubles : 30 EUR/an. Pastilles Day Dot couleur : 20 EUR. Affiches plastifiées : 15 EUR. Formation initiale équipe : 2h x salaire moyen. Total : moins de 200 EUR pour un ROI annuel de 5 000 à 25 000 EUR selon la taille du restaurant. C'est le meilleur ratio investissement / rentabilité de la gestion de restaurant en général."
  },
  {
    question: "Le FIFO s'applique-t-il aussi aux boissons ?",
    answer: "Oui, et c'est souvent négligé. Les vins courants (rotation à optimiser, DLC virtuelle), les softs en bouteilles (DLC 6-12 mois), les bières en pression (fûts avec DLC 3-4 mois), les bières en bouteilles (DLC 9-12 mois). N'oubliez pas non plus les produits d'épicerie une fois ouverts : huiles d'olive (rancissement après ouverture), vinaigres balsamiques, sirops, sauces industrielles. Pour les spiritueux et vins de garde, le FIFO classique ne s'applique pas (les produits ne se dégradent pas dans le temps)."
  },
  {
    question: "Comment mesurer l'efficacité de mon FIFO ?",
    answer: "Suivez deux indicateurs principaux : (1) Taux de pertes mensuel = valeur des produits jetés / valeur des achats x 100. Objectif < 2 %. (2) Écart entre food cost théorique (ventes x fiches techniques) et food cost réel (issu de l'inventaire). Un écart > 2 points signale un problème FIFO ou un autre dysfonctionnement (vol, surdosage). Ajouter éventuellement : nombre de produits à DLC dépassée identifiés par semaine (objectif < 5)."
  },
  {
    question: "Comment étiqueter dans la pratique sans perdre de temps ?",
    answer: "Méthode rapide : étiqueteuse pré-programmée avec votre nom de restaurant et la date du jour automatique. À la réception, l'étiqueteur clique sur le produit dans la liste, l'étiquette s'imprime en 2 secondes. Temps total étiquetage : 1-2 min pour une livraison de 20 références. Alternative manuelle : feutre indélébile + ruban adhésif jaune fluo. Mention minimum : date jj/mm + DLC. Temps : 3-5 min par livraison."
  },
  {
    question: "Que faire des produits qui approchent de la DLC ?",
    answer: "Quatre options dans l'ordre de priorité : (1) Suggestion du jour ou plat éphémère qui utilise prioritairement ce produit (impact zéro sur la marge). (2) Promotion ciblée sur la carte (mini-prix sur un plat). (3) Don à une association alimentaire (Restos du Coeur, ANDES, Banque alimentaire) avec déductibilité fiscale de 60 % de la valeur HT. (4) En dernier recours, jet avec traçabilité (fiche perte signée). Le jet pur et simple sans plan d'action est un échec de planification, pas une fatalité."
  },
  {
    question: "Le FIFO est-il obligatoire légalement en France ?",
    answer: "Pas explicitement au sens d'une obligation légale directe, mais c'est la seule pratique conforme au règlement (CE) 178/2002 sur la traçabilité des denrées alimentaires et aux exigences HACCP. En cas de contrôle sanitaire DDPP, l'absence de système de rotation des denrées est un point de non-conformité. Sanctions : avertissement, mise en demeure, amende administrative jusqu'à 1 500 EUR, voire fermeture administrative si risque sanitaire avéré. Le FIFO est donc obligatoire 'de facto'."
  },
  {
    question: "Faut-il appliquer le FIFO aux produits surgelés ?",
    answer: "Oui, absolument. Au congélateur, l'étiquetage est encore plus crucial car visuel impossible. Mentions obligatoires : date de congélation, DLC d'origine, nom du produit. Utiliser un feutre indélébile sur le sac directement ou des étiquettes résistantes au froid. DLC indicatives au congélateur : viande hachée 1 mois, viande pièce 3 mois, poisson 4-6 mois, légumes 8-12 mois, pain 3 mois. Un produit non étiqueté au congélateur doit être jeté par précaution."
  },
  {
    question: "Comment intégrer le FIFO dans la checklist HACCP quotidienne ?",
    answer: "Ajouter 3 points à votre checklist HACCP existante : (1) Vérification des DLC critiques (< 48h) avant chaque service, par le chef de partie, en 5 min. (2) Contrôle visuel de l'organisation FIFO dans chaque chambre froide : anciens devant, nouveaux derrière. (3) Saisie des produits à DLC dépassée dans la fiche 'pertes du jour'. Cette intégration ne demande pas plus de 10 min par jour et garantit la cohérence des deux systèmes (HACCP + FIFO)."
  }
];

export default function BlogMethodeFifo() {
  const faqSchema = buildFAQSchema(faqItems);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Accueil', url: 'https://www.restaumargin.fr' },
    { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
    { name: 'Méthode FIFO en restauration', url: 'https://www.restaumargin.fr/blog/methode-fifo-gestion-stocks-restaurant' }
  ]);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Méthode FIFO en restauration 2026 : guide pratique complet"
        description="Appliquez la méthode FIFO dans votre cuisine restaurant : 4 piliers, checklist quotidienne, étiquetage, exemples chiffrés, impact food cost et réduction du gaspillage de 6 à 10 %."
        path="/blog/methode-fifo-gestion-stocks-restaurant"
        type="article"
        schema={[
          faqSchema,
          breadcrumbSchema,
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: "Comment appliquer la méthode FIFO en restauration en 6 étapes",
            description: "Guide pratique pour mettre en place la méthode FIFO dans votre cuisine restaurant et réduire les pertes alimentaires de 6 à 10 %.",
            totalTime: 'PT1H30M',
            tool: [
              'Étiqueteuse Brother PT-D210 ou Dymo (45-65 EUR)',
              'Rouleaux d\'étiquettes solubles (25-40 EUR/an)',
              'Pastilles Day Dot couleur 7 jours (15-25 EUR)',
              'Feutre indélébile pour congélateur (10 EUR)',
              'Affiches procédure plastifiées (15-20 EUR)',
              'Logiciel d\'inventaire FIFO (29-80 EUR/mois)'
            ],
            step: [
              { '@type': 'HowToStep', name: 'Pilier 1 : Étiqueter systématiquement', text: 'Chaque produit reçoit à la réception une étiquette : date de réception, DLC d\'origine, nom, initiales receveur. Étiqueteuse pro recommandée.' },
              { '@type': 'HowToStep', name: 'Pilier 2 : Organiser les espaces', text: 'Frigos : étagère par catégorie, anciens devant, nouveaux derrière. Étagères sèches : zones A/B/C par fréquence d\'usage. Congélateur : date au feutre indélébile.' },
              { '@type': 'HowToStep', name: 'Pilier 3 : Procédure de réception', text: 'Séquence 6 étapes : contrôle quantitatif (BL), contrôle qualitatif (visuel + T°), vérification DLC, étiquetage, rangement FIFO, saisie logiciel.' },
              { '@type': 'HowToStep', name: 'Pilier 4 : Inventaire flash hebdomadaire', text: '5 min sur les 10 produits stratégiques (80 % du food cost), identification des produits à passer en priorité, briefing chef pour adapter le menu.' },
              { '@type': 'HowToStep', name: 'Contrôle quotidien des DLC critiques', text: '5 min chaque matin avant le service. Tout produit < 48h DLC = identifié pour usage prioritaire ou jet tracé.' },
              { '@type': 'HowToStep', name: 'Suivre les KPIs et ajuster', text: 'Taux de pertes mensuel < 2 %. Écart food cost théorique vs réel < 2 points. Ajuster commandes selon rotation réelle observée.' }
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Méthode FIFO en restauration : guide pratique complet 2026",
            description: "Mise en place complète de la méthode FIFO dans un restaurant : 4 piliers, checklist quotidienne, exemples chiffrés et impact food cost.",
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
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/methode-fifo-gestion-stocks-restaurant' }
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
          <span className="text-mono-100 font-medium">Méthode FIFO</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Stocks"
        readTime="15 min"
        date="Mai 2026"
        title="Méthode FIFO en restauration : guide pratique 2026"
        accentWord="FIFO"
        subtitle="Un restaurant moyen jette 6 à 10 % de ses achats alimentaires chaque mois. La méthode FIFO est la solution la plus simple jamais inventée pour stopper cette hémorragie financière. Voici le guide complet."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="header" />

        {/* Encadre formule rapide */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Les 4 piliers de la méthode FIFO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Le système FIFO en restaurant en 4 piliers
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Étiquetage systématique</strong> : chaque produit reçoit à la réception une étiquette (date, DLC, nom, initiales).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Organisation des espaces</strong> : anciens devant, nouveaux derrière. Force le bon réflexe physiquement.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Procédure de réception</strong> : séquence 6 étapes (contrôle, étiquetage, rangement, saisie).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Inventaire flash hebdomadaire</strong> : 5 min sur les 10 produits stratégiques.</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectif standard : taux de pertes inférieur à 2 % du chiffre d'affaires. Impact food cost : -2 à -4 points en 1-3 mois.
          </p>
        </div>

        {/* Intro */}
        <div className="mt-12 prose-content">
          <p className="text-[#374151] text-lg leading-relaxed mb-6">
            <strong>Un restaurant moyen jette entre 6 et 10 % de ses achats alimentaires chaque mois.</strong> Sur un food cost mensuel de 12 000 EUR, ce sont 720 à 1 200 EUR qui partent à la poubelle, soit jusqu'à 14 400 EUR de marge nette annuelle perdue. Dans 80 % des cas, ces pertes sont dues à une mauvaise rotation des stocks et à l'absence d'un système FIFO restaurant rigoureux.
          </p>
          <p className="text-[#374151] leading-relaxed">
            La bonne nouvelle : la méthode FIFO est la solution la plus simple et la moins coûteuse de la gestion en restauration. Pour moins de 200 EUR d'investissement initial, vous pouvez récupérer 5 000 à 25 000 EUR par an. Ce guide vous donne la procédure complète pour une mise en place réussie en moins d'une semaine.
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
              { href: '#fifo-fefo', label: 'FIFO vs FEFO : la différence cruciale' },
              { href: '#obligatoire', label: 'Pourquoi le FIFO est obligatoire en restauration' },
              { href: '#piliers', label: 'Les 4 piliers de la mise en pratique' },
              { href: '#etiquetage', label: 'Étiquetage : guide détaillé' },
              { href: '#organisation', label: 'Organisation physique des espaces' },
              { href: '#reception', label: 'Procédure de réception en 6 étapes' },
              { href: '#chiffre', label: 'Exemple chiffré : 8 % vs 2 % de pertes' },
              { href: '#checklist', label: 'Checklist FIFO quotidienne et hebdomadaire' },
              { href: '#erreurs', label: 'Les 7 erreurs classiques à éviter' },
              { href: '#kpi', label: 'Mesurer et piloter avec les bons KPIs' },
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

        {/* SECTION 1 : FIFO vs FEFO */}
        <section id="fifo-fefo" className="mb-16">
          <SectionHeading icon={<Package className="w-6 h-6" />} number="1">
            FIFO vs FEFO : la différence cruciale
          </SectionHeading>

          <div className="prose-content">
            <p>
              Avant de détailler la méthode, il est essentiel de comprendre la distinction entre FIFO et FEFO. Ces deux acronymes sont souvent confondus mais désignent des logiques différentes — même si en restauration elles convergent dans 90 % des cas.
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
                On consomme d'abord les produits entrés en premier dans le stock. Logique chronologique pure, basée sur la date de réception. Méthode universelle, simple à comprendre et à expliquer à l'équipe.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-blue-900">FEFO</h3>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed mb-2">
                <strong>First Expired, First Out</strong> = premier périmé, premier sorti
              </p>
              <p className="text-sm text-blue-800 leading-relaxed">
                On consomme d'abord les produits dont la DLC est la plus proche. Logique sanitaire pure, basée sur la date limite de consommation. Plus précis que le FIFO mais demande une analyse fine des DLC.
              </p>
            </div>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>En restauration, on applique principalement le FEFO</strong>, mais le terme FIFO est utilisé par habitude car les deux méthodes coïncident dans 90 % des cas (les produits arrivent dans l'ordre des DLC). On parle donc souvent de FIFO en cuisine pour désigner le FEFO opérationnel.
            </p>
          </div>

          <div className="mt-6 border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl p-4">
            <p className="text-sm font-semibold text-emerald-700 mb-1">Cas concret où FIFO et FEFO divergent</p>
            <p className="text-sm text-emerald-700">
              Yaourts livrés : 50 pots en deuxième livraison de la semaine, mais ils proviennent d'un lot en promotion avec une DLC plus courte que les yaourts déjà en stock (livrés en premier mais DLC plus longue). Application FEFO : on sort en priorité le lot à DLC courte, même s'il est arrivé en second. Application FIFO stricte : on sort les anciens d'abord, et on jette les yaourts en promo périmés.
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
              Le FIFO restaurant n'est pas un "nice to have" ou une bonne pratique optionnelle. Il existe à la fois une raison sanitaire (obligation légale indirecte) et une raison économique (impact direct sur la marge nette).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-rose-700" />
                <h3 className="font-bold text-rose-900">Raison sanitaire (HACCP)</h3>
              </div>
              <p className="text-sm text-rose-800 leading-relaxed mb-3">
                Le règlement européen CE 178/2002 et le <strong>Paquet Hygiène</strong> imposent traçabilité et fraîcheur des produits. Le FIFO est la méthode opérationnelle reconnue pour répondre à ces exigences.
              </p>
              <p className="text-sm text-rose-800 leading-relaxed mb-3">
                <strong>Sanctions en cas de contrôle DDPP défavorable :</strong>
              </p>
              <ul className="text-sm text-rose-800 space-y-1 ml-4">
                <li>- Avertissement et mise en demeure</li>
                <li>- Amende administrative jusqu'à 1 500 EUR</li>
                <li>- Fermeture administrative si risque sanitaire</li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Raison économique</h3>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed mb-3">
                Sans FIFO, le saumon livré le mercredi (DLC dimanche) est rangé devant le saumon du lundi (DLC vendredi). Vendredi soir, on utilise le mercredi. Lundi suivant : saumon du lundi précédent périmé, jeté.
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>Multiplié par 80 références fraîches</strong> dans un restaurant moyen, cela représente 5 à 10 % de pertes mensuelles. Soit 600 à 1 200 EUR par mois sur 12 000 EUR d'achats.
              </p>
            </div>
          </div>

          <Callout type="warning">
            <strong>Double peine en cas d'absence de FIFO :</strong> vous perdez de l'argent (gaspillage alimentaire) ET vous êtes en infraction sanitaire (non-conformité HACCP). C'est l'une des rares actions de gestion où les bénéfices sont triples : financier, juridique et qualité client.
          </Callout>
        </section>

        {/* SECTION 3 : Piliers */}
        <section id="piliers" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="3">
            Les 4 piliers de la mise en pratique
          </SectionHeading>

          <div className="prose-content">
            <p>
              La méthode FIFO en restauration repose sur 4 piliers indissociables. Négliger l'un d'eux compromet l'ensemble du système. Voici la vue d'ensemble avant le détail de chacun dans les sections suivantes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <div className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">1</span>
                <h3 className="font-bold text-mono-100">Étiquetage systématique</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Chaque produit entrant reçoit une étiquette obligatoire : date de réception, DLC, nom, initiales receveur. Matériel : étiqueteuse Brother PT-D210 ou Dymo (50 EUR), rouleaux solubles (30 EUR/an).
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">2</span>
                <h3 className="font-bold text-mono-100">Organisation des espaces</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Frigos : étagère par catégorie, anciens devant, nouveaux derrière. Étagères sèches : zones A/B/C par DLC. Congélateurs : date au feutre indélébile, max 3 mois viande hachée.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">3</span>
                <h3 className="font-bold text-mono-100">Procédure de réception</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                Séquence 6 étapes obligatoires : contrôle quantitatif (BL), contrôle qualitatif (visuel + T°), vérification DLC (refus si {'<'} 3 jours), étiquetage, rangement FIFO, saisie logiciel. Durée : 15-25 min.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">4</span>
                <h3 className="font-bold text-mono-100">Inventaire flash hebdo</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed">
                5 min sur les 10 produits stratégiques (80 % du food cost). Identification des produits à passer en priorité. Briefing chef pour adapter le menu et éviter les pertes anticipées.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4 : Etiquetage */}
        <section id="etiquetage" className="mb-16">
          <SectionHeading icon={<Tag className="w-6 h-6" />} number="4">
            Étiquetage : guide détaillé
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'étiquetage est le pilier le plus important du FIFO restaurant. Sans étiquette claire, impossible d'appliquer la rotation chronologique. Voici les règles, le matériel et les bonnes pratiques.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Mentions obligatoires sur chaque étiquette</h3>
            <ul className="space-y-2 text-sm text-mono-350">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" /><span><strong>Date de réception</strong> (format jj/mm/aaaa)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" /><span><strong>DLC d'origine</strong> ou DDM (date de durabilité minimale)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" /><span><strong>Nom du produit</strong> (si reconditionné ou transvasé)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" /><span><strong>Initiales du receveur</strong> (responsabilisation)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" /><span><strong>Numéro de lot</strong> (pour les produits à forte traçabilité : viandes, poissons)</span></li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" /><span><strong>DLC secondaire</strong> après ouverture (pour les contenants ouverts)</span></li>
            </ul>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Matériel d'étiquetage recommandé</h3>
            <p>Trois niveaux d'équipement selon votre budget et votre volume :</p>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <h4 className="font-bold text-emerald-900 mb-2">Entrée de gamme</h4>
              <p className="text-xs text-emerald-800 mb-2">Feutre indélébile + ruban adhésif jaune fluo</p>
              <p className="text-lg font-extrabold text-emerald-700">15 EUR</p>
              <p className="text-xs text-emerald-700 mt-2">Convient pour &lt; 30 réceptions/mois</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h4 className="font-bold text-blue-900 mb-2">Standard pro</h4>
              <p className="text-xs text-blue-800 mb-2">Étiqueteuse Brother PT-D210 + rouleaux solubles</p>
              <p className="text-lg font-extrabold text-blue-700">80 EUR</p>
              <p className="text-xs text-blue-700 mt-2">Recommandé pour la plupart des restaurants</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <h4 className="font-bold text-purple-900 mb-2">Haut de gamme</h4>
              <p className="text-xs text-purple-800 mb-2">Dymo LabelManager 360D + Day Dot couleur</p>
              <p className="text-lg font-extrabold text-purple-700">150 EUR</p>
              <p className="text-xs text-purple-700 mt-2">Pour grands volumes (chaînes, brasseries)</p>
            </div>
          </div>

          <Callout type="info">
            <strong>Astuce gain de temps :</strong> programmer l'étiqueteuse avec votre nom de restaurant et la date du jour automatique. À la réception, le chef de partie clique sur le produit dans la liste pré-enregistrée, l'étiquette s'imprime en 2 secondes. Temps total étiquetage : 1-2 min pour une livraison de 20 références.
          </Callout>
        </section>

        {/* SECTION 5 : Organisation */}
        <section id="organisation" className="mb-16">
          <SectionHeading icon={<Package className="w-6 h-6" />} number="5">
            Organisation physique des espaces
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'organisation physique des espaces de stockage est le pilier qui demande le moins d'effort une fois mis en place, mais qui produit le plus de résultats. Voici comment réorganiser frigos, étagères et congélateurs pour forcer le FIFO restaurant naturellement.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">A</span>
                Frigos et chambres froides
              </h3>
              <ul className="text-sm text-mono-400 space-y-2">
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Une étagère par catégorie de produit (viandes, poissons, laitiers, légumes, vins)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Anciens produits devant, nouveaux derrière ou en dessous</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Marquage au sol des zones (ruban adhésif de couleur)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Bacs gastronomes inclinés pour forcer la rotation</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Affiche FIFO plastifiée à l'intérieur de la porte</span></li>
              </ul>
            </div>

            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">B</span>
                Étagères sèches (épicerie)
              </h3>
              <ul className="text-sm text-mono-400 space-y-2">
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Zones A/B/C selon la fréquence d'usage (A = quotidien, B = hebdo, C = mensuel)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>DLC courtes positionnées en Zone A accessible</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Une rangée = un produit (pas de mélange de lots)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Niveau bas = lourd (sacs farine, riz), niveau haut = léger (conserves)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Date de première ouverture sur les bocaux/sachets entamés</span></li>
              </ul>
            </div>

            <div className="bg-white border border-mono-900 rounded-2xl p-6">
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">C</span>
                Congélateurs
              </h3>
              <ul className="text-sm text-mono-400 space-y-2">
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Date de congélation au feutre indélébile sur chaque sac</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>DLC maximales : viande hachée 1 mois, viande pièce 3 mois, poisson 4-6 mois, légumes 8-12 mois</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Bacs étiquetés par catégorie (pas de mélange viandes / légumes)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Inventaire visuel mensuel (par catégorie)</span></li>
                <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">-</span><span>Produit non étiqueté = jet immédiat (règle sans exception)</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 6 : Reception */}
        <section id="reception" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="6">
            Procédure de réception en 6 étapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              La procédure de réception fournisseur est le moment clé où le FIFO se met en place ou s'effondre. Voici la séquence professionnelle à appliquer systématiquement, avec un temps estimé de 15 à 25 minutes par livraison.
            </p>
          </div>

          <ol className="mt-8 space-y-4">
            {[
              { title: 'Contrôle quantitatif (BL)', body: "Vérifier que les quantités livrées correspondent exactement au bon de livraison. Tout écart est noté immédiatement et signalé au livreur (signature contestée si nécessaire). Temps : 3-5 min." },
              { title: 'Contrôle qualitatif visuel et T°', body: "Vérifier l'aspect des produits (fraîcheur visuelle, emballage intact, absence de moisissures). Prendre la température de la chaîne du froid avec un thermomètre infrarouge (refus si > 4°C pour le frais). Temps : 2-3 min." },
              { title: 'Vérification des DLC', body: "Refus systématique de tout produit à DLC inférieure à 3 jours pour le frais courant, 7 jours pour les viandes nobles, 15 jours pour la charcuterie. Ces seuils sont à adapter selon votre rotation réelle. Temps : 2 min." },
              { title: 'Étiquetage immédiat', body: "Étiquette posée sur chaque produit avant rangement : date de réception, DLC, nom, initiales. Sans étiquette = pas de rangement. Temps : 5-8 min (avec étiqueteuse pro)." },
              { title: 'Rangement FIFO strict', body: "Vider l'étagère existante, remettre les anciens produits devant, placer les nouveaux derrière ou en dessous. Vérifier l'ordre chronologique apparent. Temps : 3-5 min." },
              { title: 'Saisie logiciel et contrôle', body: "Enregistrer la réception dans le logiciel de gestion (stocks, prix d'achat, lots). Vérifier que les prix correspondent à la commande. Archiver le BL. Temps : 2-3 min." }
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
            <strong>Total temps réception professionnelle :</strong> 15 à 25 minutes par livraison. Cela peut sembler long, mais c'est le moment où se joue 80 % de la qualité du FIFO. Une réception bâclée = une semaine de gestion compromise.
          </Callout>
        </section>

        {/* SECTION 7 : Cas chiffre */}
        <section id="chiffre" className="mb-16">
          <SectionHeading icon={<TrendingDown className="w-6 h-6" />} number="7">
            Exemple chiffré : 8 % vs 2 % de pertes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Restaurant a <strong>30 000 EUR de CA mensuel</strong>, food cost cible 32 %. Comparons deux scénarios sur la même période : avec et sans méthode FIFO restaurant structurée.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
              <h3 className="font-bold text-rose-900 mb-3">Scénario A : Sans FIFO (8 % de pertes)</h3>
              <div className="space-y-2 text-sm text-rose-800">
                <div className="flex justify-between border-b border-rose-200 pb-1"><span>Achats matières</span><strong>11 200 EUR</strong></div>
                <div className="flex justify-between border-b border-rose-200 pb-1"><span>Pertes alimentaires (8 %)</span><strong>896 EUR</strong></div>
                <div className="flex justify-between border-b border-rose-200 pb-1"><span>Consommation réelle</span><strong>10 304 EUR</strong></div>
                <div className="flex justify-between border-b border-rose-200 pb-1"><span>Surcommande typique</span><strong>+ 1 400 EUR</strong></div>
                <div className="flex justify-between font-bold text-rose-900 pt-2 border-t-2 border-rose-300"><span>Food cost réel</span><span>34,3 %</span></div>
              </div>
              <p className="text-xs text-rose-700 mt-3 italic">Restaurant en dérive, marge fragile</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="font-bold text-emerald-900 mb-3">Scénario B : Avec FIFO (2 % de pertes)</h3>
              <div className="space-y-2 text-sm text-emerald-800">
                <div className="flex justify-between border-b border-emerald-200 pb-1"><span>Achats matières</span><strong>9 800 EUR</strong></div>
                <div className="flex justify-between border-b border-emerald-200 pb-1"><span>Pertes alimentaires (2 %)</span><strong>196 EUR</strong></div>
                <div className="flex justify-between border-b border-emerald-200 pb-1"><span>Consommation réelle</span><strong>9 604 EUR</strong></div>
                <div className="flex justify-between border-b border-emerald-200 pb-1"><span>Commandes optimisées</span><strong>- 1 400 EUR</strong></div>
                <div className="flex justify-between font-bold text-emerald-900 pt-2 border-t-2 border-emerald-300"><span>Food cost réel</span><span>32,0 %</span></div>
              </div>
              <p className="text-xs text-emerald-700 mt-3 italic">Restaurant performant, marge maîtrisée</p>
            </div>
          </div>

          <div className="mt-8 bg-teal-50 border border-teal-200 rounded-xl p-6">
            <h3 className="font-bold text-teal-900 mb-3 text-lg">Gain net annuel</h3>
            <ul className="text-sm text-teal-800 space-y-2">
              <li>- Économie achats : 1 400 EUR/mois x 12 = <strong>16 800 EUR/an</strong></li>
              <li>- Réduction pertes : 700 EUR/mois x 12 = <strong>8 400 EUR/an</strong></li>
              <li className="border-t border-teal-300 pt-2 mt-2 font-bold text-teal-900 text-base">Total gain annuel : 25 200 EUR/an</li>
            </ul>
            <p className="text-xs text-teal-700 mt-3 italic">
              Soit un mois et demi de CA additionnel en marge nette. Investissement initial FIFO : moins de 200 EUR. ROI : 12 600 %.
            </p>
          </div>

          <div className="prose-content mt-8">
            <p>
              Ces chiffres sont des estimations. Pour un restaurant qui n'avait aucun FIFO, une discipline rigoureuse peut représenter des gains plus importants encore, selon le volume d'achats. Pour aller plus loin, consultez notre comparatif <Link to="/blog/fifo-lifo-stocks-restaurant" className="text-teal-700 underline hover:text-teal-800">FIFO vs LIFO en restauration</Link>.
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
              Voici la checklist à imprimer et plastifier pour la coller dans votre bureau et dans chaque chambre froide. Elle résume les actions quotidiennes et hebdomadaires d'un système FIFO efficace.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">Q</span>
                Quotidien (5-10 min par jour)
              </h3>
              <ul className="space-y-2 text-sm text-mono-350 ml-9">
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Vérifier DLC critiques (&lt; 48h) chaque matin avant service — chef ou second, 5 min</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Étiqueter toute nouvelle livraison à la réception — 15-25 min selon livraison</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Briefing équipe sur produits prioritaires avant service — chef, 3 min</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Saisie pertes du jour dans fiche dédiée (si applicable)</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Mise à jour logiciel stock — 10 min en fin de service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">H</span>
                Hebdomadaire (30 min, le dimanche soir)
              </h3>
              <ul className="space-y-2 text-sm text-mono-350 ml-9">
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Inventaire flash sur 10 produits stratégiques (viandes, poissons, vins) — manager, 30 min</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Vérification organisation FIFO dans chaque chambre froide</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Identification produits à DLC courte pour suggestion du jour semaine suivante</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Mise à jour des commandes prévues selon stocks restants</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Briefing équipe sur les KPIs FIFO de la semaine (pertes, écarts)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-mono-100 mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">M</span>
                Mensuel (2-3 heures, en fin de mois)
              </h3>
              <ul className="space-y-2 text-sm text-mono-350 ml-9">
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Inventaire complet portes fermées — équipe binôme, 2-3h</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Calcul taux de pertes mensuel et comparaison avec mois précédents</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Calcul écart food cost théorique vs réel</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Réunion bilan FIFO avec l'équipe (1h)</li>
                <li className="flex items-start gap-2"><span className="text-teal-600">[]</span> Ajustement des procédures pour le mois suivant</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 9 : Erreurs */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="9">
            Les 7 erreurs classiques à éviter
          </SectionHeading>

          <div className="space-y-5 mt-8">
            <ErreurCard
              number={1}
              title="Ne pas étiqueter les bocaux et contenants reconditionnés"
              desc="Sauces transvasées, huiles en burettes, vinaigres dans des bouteilles, fromages emballés à part : ces produits perdent leur étiquette d'origine. Sans étiquetage, on ne sait plus depuis quand le produit est ouvert. Règle absolue : tout transvasement = nouvelle étiquette avec date d'ouverture et DLC secondaire."
            />
            <ErreurCard
              number={2}
              title="Ranger les nouveaux produits devant les anciens"
              desc="Réflexe naturel et le plus répandu. Le livreur est pressé, le réceptionnaire aussi. Résultat : les nouveaux produits sont posés sur l'étagère devant les anciens, qui sont oubliés et périmés. La solution : marquage physique des zones FIFO et procédure de réception non négociable."
            />
            <ErreurCard
              number={3}
              title="Laisser des produits à plusieurs endroits"
              desc="Le même produit dans 2 frigos différents ou 2 étagères différentes crée double traçabilité, risque de doublon, complexité de gestion. Règle : un produit = un emplacement unique. Si le volume est important, utiliser une étagère dédiée, mais toujours dans une zone unique."
            />
            <ErreurCard
              number={4}
              title="Ignorer la DLC secondaire après ouverture"
              desc="Une crème fraîche fermée se conserve 3 semaines, ouverte seulement 3 jours. Un sachet de levure 48h après ouverture. Une bouteille de vin 2-3 jours. Sans suivi des DLC secondaires, vous accumulez des produits 'dormants' dangereux. Solution : reetiquetage à l'ouverture avec DLC secondaire."
            />
            <ErreurCard
              number={5}
              title="Faire l'inventaire en début de mois seulement"
              desc="Découvrir les écarts FIFO uniquement lors de l'inventaire mensuel = trop tard, les pertes sont déjà consommées. Ajouter un inventaire flash hebdomadaire sur les 10 produits les plus chers permet de détecter et corriger les dérives en 7 jours maximum."
            />
            <ErreurCard
              number={6}
              title="Ne pas former les nouveaux employés"
              desc="Une seule personne qui ne connaît pas le FIFO peut saboter tout le système. Chaque nouvel arrivant doit avoir 15 minutes de formation FIFO le premier jour, avec démonstration physique en cuisine. Un livret HACCP/FIFO de 2 pages à signer matérialise l'engagement."
            />
            <ErreurCard
              number={7}
              title="Sur-stocker pour ne pas être en rupture"
              desc="Mieux vaut 2 commandes par semaine en flux tendus que des stocks volumineux qui génèrent 8 % de pertes. La peur de la rupture pousse à sur-commander, ce qui aggrave mécaniquement le problème FIFO. Faire confiance aux fournisseurs et adapter les volumes à la rotation réelle observée."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumulé :</strong> ces 7 erreurs combinées peuvent représenter 4 à 8 points de food cost en plus, soit 4 800 à 9 600 EUR par an sur un restaurant à 25 000 EUR de CA mensuel. Éviter ces erreurs n'est pas optionnel : c'est l'action ROI numéro 1 d'un restaurant qui démarre.
          </Callout>
        </section>

        {/* SECTION 10 : KPIs */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="10">
            Mesurer et piloter avec les bons KPIs
          </SectionHeading>

          <div className="prose-content">
            <p>
              Sans mesure, pas de pilotage. Voici les 4 KPIs essentiels pour suivre l'efficacité de votre méthode FIFO restaurant au fil du temps. Tous se calculent rapidement et donnent une vision claire de la performance.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">KPI</th>
                  <th className="text-left py-3 px-4 font-semibold">Formule</th>
                  <th className="text-center py-3 px-4 font-semibold">Fréquence</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Cible</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-mono-100">Taux de pertes mensuel</td>
                  <td className="py-3 px-4 text-xs">Valeur produits jetés / valeur achats x 100</td>
                  <td className="py-3 px-4 text-center text-xs">Mensuel</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">&lt; 2 %</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-bold text-mono-100">Écart food cost</td>
                  <td className="py-3 px-4 text-xs">Food cost réel - Food cost théorique</td>
                  <td className="py-3 px-4 text-center text-xs">Mensuel</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">&lt; 2 points</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-mono-100">Produits DLC dépassée</td>
                  <td className="py-3 px-4 text-xs">Nombre de produits identifiés / semaine</td>
                  <td className="py-3 px-4 text-center text-xs">Hebdomadaire</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">&lt; 5</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-bold text-mono-100">Rotation des stocks</td>
                  <td className="py-3 px-4 text-xs">Achats du mois / Stock moyen</td>
                  <td className="py-3 px-4 text-center text-xs">Mensuel</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold">3 à 5 x</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Pour calculer ces KPIs facilement, utilisez le module intégré de RestauMargin ou notre <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800">calculateur de food cost gratuit</Link>. Pour aller plus loin sur la rotation, lisez notre guide <Link to="/blog/rotation-stocks-restaurant" className="text-teal-700 underline hover:text-teal-800">Rotation des stocks en restauration</Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="15 min" variant="footer" />

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes méthode FIFO restaurant</h2>
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
              <li>- Règlement (CE) n° 178/2002 — Traçabilité des denrées alimentaires</li>
              <li>- Paquet Hygiène européen (CE 852/2004, 853/2004, 854/2004)</li>
              <li>- Guide des Bonnes Pratiques d'Hygiène (GBPH) restauration — DGAL et ANSES</li>
              <li>- Plan Comptable Général — Article 213-1 et 214-1 (méthodes de valorisation)</li>
              <li>- INSEE — Statistiques sectorielles HCR France (données 2024-2026)</li>
              <li>- GIRA Conseil — Étude annuelle profitabilité restaurants HCR France 2026</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Réduisez vos pertes et gagnez 3 points de marge
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin automatise votre FIFO : alertes DLC, suggestions de plats du jour intelligentes, food cost réel en temps réel et suivi des pertes par catégorie.
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
            <Link to="/blog/fifo-lifo-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">FIFO vs LIFO en restauration</h3>
              <p className="text-xs text-mono-500">Comparatif complet et choix légal en France.</p>
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
          <Link to="/outils/calculateur-food-cost" className="text-sm text-teal-600 hover:underline">Calculateur food cost gratuit &rarr;</Link>
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
