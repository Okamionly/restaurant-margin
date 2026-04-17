import { Link } from 'react-router-dom';
import { ChefHat, Calculator, ArrowRight, Clock, BookOpen } from 'lucide-react';
import SEOHead from '../components/SEOHead';

/* ═══════════════════════════════════════════════════════════════
   Blog Index — Liste des 8 articles
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
    slug: 'calcul-marge-restaurant',
    title: 'Comment calculer la marge de votre restaurant en 2026',
    excerpt: 'Guide complet pour calculer la marge de votre restaurant : food cost, coefficient multiplicateur, marge brute et nette. Methodes et outils pour restaurateurs.',
    category: 'Marges',
    readTime: '12 min',
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
];

const categoryColors: Record<string, string> = {
  'Marges': 'bg-teal-100 text-teal-700 border-teal-200',
  'Food Cost': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Pricing': 'bg-amber-100 text-amber-700 border-amber-200',
  'IA': 'bg-violet-100 text-violet-700 border-violet-200',
  'Gaspillage': 'bg-rose-100 text-rose-700 border-rose-200',
  'HACCP': 'bg-blue-100 text-blue-700 border-blue-200',
  'Fiches techniques': 'bg-orange-100 text-orange-700 border-orange-200',
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
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>RestauMargin</span>
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
              className="text-sm font-medium text-[#525252] hover:text-teal-600 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-teal-600" />
          <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">Blog</span>
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black text-[#111111] mb-6 leading-tight"
          style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}
        >
          Guides et conseils pour restaurateurs
        </h1>
        <p className="text-lg text-[#525252] max-w-2xl leading-relaxed">
          Articles pratiques et retours d'experience pour optimiser vos marges, reduire votre food cost,
          et gerer votre restaurant au quotidien.
        </p>
      </section>

      {/* Articles grid */}
      <section className="pb-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 hover:border-teal-500 hover:shadow-xl transition-all duration-300"
            >
              {/* Category + read time */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${
                    categoryColors[post.category] || 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#737373]">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>

              {/* Title */}
              <h2
                className="text-xl sm:text-2xl font-bold text-[#111111] mb-3 leading-tight group-hover:text-teal-600 transition-colors"
                style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}
              >
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-sm text-[#525252] leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Read more */}
              <div className="flex items-center gap-2 text-sm font-semibold text-teal-600 group-hover:gap-3 transition-all">
                Lire l'article
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 bg-gradient-to-br from-[#111111] to-[#1f2937] rounded-3xl p-8 sm:p-12 text-center text-white">
          <h3
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}
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
      <footer className="border-t border-[#E5E7EB] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#737373]">
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
