import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Calculator, ArrowRight, Clock, BookOpen, Sparkles } from 'lucide-react';
import SEOHead from '../components/SEOHead';

// Curves shader (lignes emerald qui derivent — meme theme que la landing principale).
// Lazy-loaded pour preserver le LCP.
const ShaderBackground = lazy(() => import('../components/landing/ShaderBackground'));

/* ═══════════════════════════════════════════════════════════════
   Blog Index — Liste des articles
   Mot-clé principal : blog restauration, gestion restaurant
   ═══════════════════════════════════════════════════════════════ */

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
}

const posts: BlogPost[] = [
  {
    slug: 'prix-de-vente-restaurant',
    title: "Calculer le prix de vente d'un plat de restaurant en 2026",
    excerpt: 'Methodes eprouvees pour fixer vos prix : coefficient multiplicateur, marge cible, pricing psychologique. Cas pratiques chiffres et outils gratuits.',
    category: 'Pricing',
    readTime: '15 min',
    date: '2026-04-27',
  },
  {
    slug: 'calcul-marge-restaurant',
    title: 'Comment calculer la marge de votre restaurant en 2026',
    excerpt: 'Guide complet pour calculer la marge de votre restaurant : food cost, coefficient multiplicateur, marge brute et nette. Methodes et outils pour restaurateurs.',
    category: 'Marges',
    readTime: '15 min',
    date: '2026-04-14',
  },
  {
    slug: 'reduire-food-cost',
    title: 'Reduire le food cost de votre restaurant : 10 strategies',
    excerpt: 'Strategies concretes pour reduire le food cost : gestion des stocks, fiches techniques, negociation fournisseurs, reduction du gaspillage.',
    category: 'Food Cost',
    readTime: '10 min',
    date: '2026-04-14',
  },
  {
    slug: 'coefficient-multiplicateur',
    title: 'Le coefficient multiplicateur en restauration : guide complet',
    excerpt: "Comprendre et appliquer le coefficient multiplicateur pour fixer vos prix de vente en restaurant. Formules, exemples et erreurs a eviter.",
    category: 'Pricing',
    readTime: '8 min',
    date: '2026-04-14',
  },
  {
    slug: 'ia-restauration',
    title: "L'intelligence artificielle en restauration : guide 2026",
    excerpt: "Comment l'IA transforme la restauration : gestion des marges, previsions de ventes, optimisation des menus, commandes automatisees.",
    category: 'IA',
    readTime: '15 min',
    date: '2026-04-14',
  },
  {
    slug: 'gaspillage-alimentaire',
    title: 'Reduire le gaspillage alimentaire en restaurant',
    excerpt: 'Solutions concretes pour reduire le gaspillage alimentaire : FIFO, portionnement, valorisation des dechets, suivi des pertes.',
    category: 'Gaspillage',
    readTime: '9 min',
    date: '2026-04-14',
  },
  {
    slug: 'haccp-restaurant',
    title: "HACCP en restaurant : guide complet des normes d'hygiene",
    excerpt: "Tout savoir sur la methode HACCP en restaurant : 7 principes, plan de maitrise sanitaire, temperatures, tracabilite, controles officiels.",
    category: 'HACCP',
    readTime: '14 min',
    date: '2026-04-14',
  },
  {
    slug: 'fiche-technique-restaurant',
    title: 'Fiche technique restaurant : le guide complet',
    excerpt: 'Apprenez a creer des fiches techniques efficaces pour vos plats : grammages, couts matieres, allergenes, process de fabrication.',
    category: 'Fiches techniques',
    readTime: '11 min',
    date: '2026-04-14',
  },
  {
    slug: 'kpi-essentiels-restaurateur',
    title: 'Les 12 KPIs essentiels pour piloter votre restaurant',
    excerpt: 'Food cost, marge brute, ticket moyen, productivite par couvert : les indicateurs incontournables pour un restaurant rentable.',
    category: 'Marges',
    readTime: '13 min',
    date: '2026-04-20',
  },
  {
    slug: 'seuil-rentabilite-restaurant',
    title: "Comment calculer le seuil de rentabilité d'un restaurant (guide complet 2026)",
    excerpt: "Formules, exemples chiffrés et benchmarks pour connaître votre point mort, le nombre de couverts nécessaires et les leviers pour réduire votre seuil.",
    category: 'Gestion financière',
    readTime: '12 min',
    date: '2026-04-25',
  },
  {
    slug: 'kpi-restaurateur',
    title: 'Les 10 KPI essentiels pour piloter son restaurant en 2026',
    excerpt: "Food cost, prime cost, RevPASH, ticket moyen, taux d'occupation… Les indicateurs clés avec formules et benchmarks sectoriels.",
    category: 'Pilotage',
    readTime: '11 min',
    date: '2026-04-27',
  },
  {
    slug: 'logiciel-caisse-enregistreuse-restaurant',
    title: 'Logiciel de caisse restaurant : comparatif 2026 (Lightspeed, Zelty, L\'Addition…)',
    excerpt: '7 solutions comparées : prix, fonctionnalités, points forts et points faibles. Comment choisir votre caisse enregistreuse en 2026.',
    category: 'Outils',
    readTime: '13 min',
    date: '2026-04-27',
  },
  {
    slug: 'methode-fifo-gestion-stocks-restaurant',
    title: 'Méthode FIFO en restauration : guide pratique pour réduire les pertes',
    excerpt: "FIFO vs FEFO, organisation des réfrigérateurs, étiquetage, impact sur le food cost : tout pour réduire votre gaspillage à moins de 2%.",
    category: 'Stocks',
    readTime: '10 min',
    date: '2026-04-27',
  },
  {
    slug: 'menu-engineering-boston-matrix-restaurant',
    title: 'Menu engineering : la méthode Boston Matrix pour optimiser votre carte',
    excerpt: 'Classez vos plats en Stars, Vaches à lait, Puzzles et Chiens. Exemple pratique sur une carte de 20 plats avec actions concrètes.',
    category: 'Carte & Prix',
    readTime: '12 min',
    date: '2026-04-27',
  },
  {
    slug: 'comment-ouvrir-restaurant-guide-complet',
    title: 'Comment ouvrir un restaurant en 2026 : guide complet étape par étape',
    excerpt: 'Les 10 étapes pour créer votre restaurant : concept, business plan, financement, licences, recrutement. Coûts réels et aides disponibles.',
    category: 'Création',
    readTime: '15 min',
    date: '2026-04-27',
  },
  {
    slug: 'prime-cost-restaurant',
    title: "Prime cost en restauration : l'indicateur n°1 de rentabilité",
    excerpt: "Food cost + masse salariale = prime cost. Benchmarks, formule complète et plan d'action pour passer de 72% à 62% en 3 mois.",
    category: 'Gestion financière',
    readTime: '10 min',
    date: '2026-04-27',
  },
  {
    slug: 'taux-occupation-restaurant',
    title: "Taux d'occupation restaurant : calcul, benchmarks et 8 leviers",
    excerpt: "RevPASH, taux de remplissage, rotation des tables… Comment maximiser le chiffre d'affaires de chaque place disponible.",
    category: 'Performance',
    readTime: '11 min',
    date: '2026-04-27',
  },
  {
    slug: 'augmenter-ticket-moyen-restaurant',
    title: 'Augmenter le ticket moyen de son restaurant : 10 techniques efficaces',
    excerpt: "Upselling boissons, suggestion desserts, formule premium, design de carte… 10 méthodes concrètes avec l'impact chiffré sur votre CA annuel.",
    category: 'Revenus',
    readTime: '10 min',
    date: '2026-04-27',
  },
  {
    slug: 'inventaire-restaurant-guide',
    title: "Faire l'inventaire de son restaurant : méthode, fréquence et outils 2026",
    excerpt: "Quotidien, hebdomadaire, mensuel : quelle fréquence selon les produits ? Méthode pas à pas, calcul de rotation et modèle de tableau.",
    category: 'Stocks',
    readTime: '11 min',
    date: '2026-04-27',
  },
  {
    slug: 'fixer-prix-carte-restaurant',
    title: 'Comment fixer les prix de sa carte de restaurant : méthode et stratégie',
    excerpt: "3 méthodes (coût, valeur perçue, concurrence), coefficients multiplicateurs par poste, psychologie des prix et comment augmenter sans perdre de clients.",
    category: 'Carte & Prix',
    readTime: '12 min',
    date: '2026-04-27',
  },
  {
    slug: 'charges-sociales-restauration',
    title: 'Charges sociales en restauration : guide 2026 (taux, exonérations, URSSAF)',
    excerpt: "40-45% du salaire brut en charges patronales. Taux CCN HCR 2026, réduction Fillon, comparatif CDI/CDD/extras/apprentis avec coût employeur réel.",
    category: 'Juridique',
    readTime: '11 min',
    date: '2026-04-27',
  },
  {
    slug: 'cout-revient-plat-restaurant',
    title: "Calculer le coût de revient d'un plat : méthode complète pour restaurateurs",
    excerpt: "5 étapes, ratio de perte par produit, exemple bœuf bourguignon, seuil d'alerte à 35% et mise à jour automatique quand les prix fournisseurs changent.",
    category: 'Food Cost',
    readTime: '11 min',
    date: '2026-04-27',
  },
  {
    slug: 'logiciel-gestion-restaurant',
    title: 'Logiciel de gestion restaurant : comparatif et guide d\'achat 2026',
    excerpt: "8 solutions comparées (Lightspeed, Skello, Inpulse, RestauMargin…). Stack idéal selon la taille et calcul du ROI sur 12 mois.",
    category: 'Outils',
    readTime: '12 min',
    date: '2026-04-27',
  },
  {
    slug: 'rotation-stocks-restaurant',
    title: 'Rotation des stocks en restauration : calcul, benchmarks et optimisation',
    excerpt: "Formule, benchmarks par catégorie (viandes 3-4j, poissons 1-2j, secs 30-60j), 6 leviers et impact sur la trésorerie immobilisée.",
    category: 'Stocks',
    readTime: '10 min',
    date: '2026-04-27',
  },
  {
    slug: 'budget-previsionnel-restaurant',
    title: 'Budget prévisionnel restaurant : comment le construire et le respecter',
    excerpt: "Structure, méthodes top-down vs bottom-up, tableau 12 mois et les 5 postes qui dérivent le plus souvent. Pilotage mensuel budget vs réel.",
    category: 'Gestion financière',
    readTime: '12 min',
    date: '2026-04-27',
  },
  {
    slug: 'prevision-ventes-restaurant',
    title: 'Prévision des ventes en restauration : méthodes et outils pour anticiper votre CA',
    excerpt: "Historique N-1, moyennes mobiles, facteurs météo/événements… Commander juste et staffer juste pour éviter gaspillage et ruptures.",
    category: 'Pilotage',
    readTime: '10 min',
    date: '2026-04-27',
  },
  {
    slug: 'formation-personnel-restauration',
    title: 'Formation du personnel en restauration : obligations, aides et pratiques 2026',
    excerpt: "OPCO Mobilités, CPF, formations prioritaires (HACCP, upselling, outils digitaux). ROI concret et plan de formation annuel pas à pas.",
    category: 'RH',
    readTime: '11 min',
    date: '2026-04-27',
  },
  {
    slug: 'strategie-digitale-restaurant',
    title: 'Stratégie digitale pour restaurant : attirer et fidéliser plus de clients en 2026',
    excerpt: "Google Business Profile, Instagram, TikTok, gestion des avis, réservation en ligne. Budget recommandé et actions concrètes par niveau d'investissement.",
    category: 'Marketing',
    readTime: '11 min',
    date: '2026-04-27',
  },
  {
    slug: 'chiffre-affaires-restaurant-comment-calculer',
    title: "Chiffre d'affaires restaurant : comment le calculer, l'analyser et l'augmenter",
    excerpt: "Formule CA, TVA 10%/20%, analyse par service et par créneau, 5 leviers de croissance et projection sur 12 mois selon les scénarios.",
    category: 'Gestion financière',
    readTime: '11 min',
    date: '2026-04-27',
  },
];

const categoryColors: Record<string, string> = {
  'Marges': 'bg-teal-100 text-teal-700 border-teal-200',
  'Food Cost': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Pricing': 'bg-amber-100 text-amber-700 border-amber-200',
  'IA': 'bg-violet-100 text-violet-700 border-violet-200',
  'Gaspillage': 'bg-rose-100 text-rose-700 border-rose-200',
  'HACCP': 'bg-blue-100 text-blue-700 border-blue-200',
  'Fiches techniques': 'bg-orange-100 text-orange-700 border-orange-200',
  'Gestion financière': 'bg-teal-100 text-teal-700 border-teal-200',
  'Pilotage': 'bg-blue-100 text-blue-700 border-blue-200',
  'Outils': 'bg-amber-100 text-amber-700 border-amber-200',
  'Stocks': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Carte & Prix': 'bg-violet-100 text-violet-700 border-violet-200',
  'Création': 'bg-orange-100 text-orange-700 border-orange-200',
  'Performance': 'bg-sky-100 text-sky-700 border-sky-200',
  'Revenus': 'bg-amber-100 text-amber-700 border-amber-200',
  'Juridique': 'bg-rose-100 text-rose-700 border-rose-200',
  'RH': 'bg-orange-100 text-orange-700 border-orange-200',
  'Marketing': 'bg-pink-100 text-pink-700 border-pink-200',
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Blog RestauMargin — Guides et conseils pour restaurateurs"
        description="Articles et guides pratiques pour restaurateurs : calcul de marge, food cost, HACCP, fiches techniques, IA en restauration. Conseils d'experts pour optimiser votre restaurant."
        path="/blog"
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
            <Link
              to="/login"
              className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero with PaperFold animated shader background */}
      <section className="relative pt-20 pb-20 sm:pb-28 px-4 sm:px-6 overflow-hidden isolate">
        <Suspense fallback={<div className="absolute inset-0 z-0 bg-[#FAFAF7]" />}>
          <ShaderBackground intensity={0.7} />
        </Suspense>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">Blog RestauMargin</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-mono-100 mb-6 leading-tight tracking-tight">
            Guides et conseils pour <span className="text-teal-600">restaurateurs</span>
          </h1>
          <p className="text-lg sm:text-xl text-mono-400 max-w-2xl leading-relaxed mb-8">
            {posts.length} articles pratiques et retours d'experience pour optimiser vos marges, reduire votre food cost,
            et gerer votre restaurant au quotidien.
          </p>

          {/* Stats badges */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur border border-mono-900 rounded-full">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <strong className="text-mono-100">{posts.length} articles</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur border border-mono-900 rounded-full">
              <Clock className="w-4 h-4 text-teal-600" />
              Lecture moyenne <strong className="text-mono-100">12 min</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur border border-mono-900 rounded-full">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Mis a jour <strong className="text-mono-100">avril 2026</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Articles grid — cinematic landing theme */}
      <section className="relative pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Featured article — premier article en grand 2-cols-span */}
        {posts[0] && (
          <Link
            to={`/blog/${posts[0].slug}`}
            className="group relative block bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-mono-900 rounded-3xl p-8 sm:p-12 mb-8 overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl hover:shadow-emerald-500/30 hover:border-emerald-500"
          >
            {/* Numero decoratif geant */}
            <div className="pointer-events-none absolute -top-8 -right-8 text-[16rem] font-black leading-none select-none text-emerald-100 group-hover:text-emerald-200 transition-colors duration-500">
              01
            </div>

            {/* Glow halo au hover */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-3xl"
              style={{ background: 'radial-gradient(circle at 30% 50%, rgba(16,185,129,0.4) 0%, transparent 60%)' }}
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-600 text-white">
                <Sparkles className="w-3.5 h-3.5" />
                Article a la une
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${categoryColors[posts[0].category] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                  {posts[0].category}
                </span>
                <span className="flex items-center gap-1 text-xs text-mono-500">
                  <Clock className="w-3.5 h-3.5" />
                  {posts[0].readTime}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-mono-100 mb-4 leading-tight tracking-tight group-hover:text-emerald-600 transition-colors max-w-3xl">
                {posts[0].title}
              </h2>

              <p className="text-base sm:text-lg text-mono-400 leading-relaxed mb-6 max-w-2xl">
                {posts[0].excerpt}
              </p>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-mono-100 group-hover:bg-emerald-600 text-white text-sm font-bold rounded-full transition-all">
                Lire l'article
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        )}

        {/* Reste des articles — cards numerotees avec 3D hover */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {posts.slice(1).map((post, idx) => {
            const num = String(idx + 2).padStart(2, '0');
            return (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group relative block bg-white border border-mono-900 rounded-3xl p-6 sm:p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500"
              >
                {/* Numero decoratif en background */}
                <div className="pointer-events-none absolute -top-4 -right-4 text-[7rem] font-black leading-none select-none text-[#F0FDF4] group-hover:text-emerald-100 transition-colors duration-500">
                  {num}
                </div>

                {/* Glow au hover */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl"
                  style={{ background: 'radial-gradient(circle at 50% 100%, rgba(16,185,129,0.25) 0%, transparent 70%)' }}
                />

                <div className="relative">
                  {/* Category + read time */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${categoryColors[post.category] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-mono-500">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-bold text-mono-100 mb-3 leading-tight tracking-tight group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-mono-400 leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Read more */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 group-hover:gap-3 transition-all">
                    Lire l'article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 bg-gradient-to-br from-mono-100 to-[#1f2937] rounded-3xl p-8 sm:p-12 text-center text-white">
          <h3
            className="text-2xl sm:text-3xl font-bold mb-3"

          >
            Prêt à optimiser votre restaurant ?
          </h3>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Essayez RestauMargin gratuitement pendant 7 jours. Calculez vos marges, gerez vos fiches
            techniques et optimisez vos food cost automatiquement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-full transition-colors"
            >
              Essai gratuit 7 jours
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-colors backdrop-blur-sm"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-mono-900 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-mono-500">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-teal-600" />
            <span>© 2026 RestauMargin — Tous droits reserves</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions legales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialite</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
