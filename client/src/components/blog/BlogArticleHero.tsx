/**
 * @file client/src/components/blog/BlogArticleHero.tsx
 *
 * Hero reutilisable pour TOUS les articles du blog. Garantit un theme
 * coherent avec la landing principale :
 *  - ShaderBackground (Curves : 6 lignes emerald qui derivent + reactivite curseur)
 *  - Breadcrumb cinematic (Accueil > Blog > Article)
 *  - Title XL avec accent emerald
 *  - Meta badges (categorie, temps de lecture, date)
 *  - Padding genereux + isolate stacking context
 *
 * Usage :
 *   <BlogArticleHero
 *     category="Marges"
 *     readTime="15 min"
 *     date="14 avril 2026"
 *     title="Comment calculer la marge de votre restaurant en 2026"
 *     subtitle="Guide complet : food cost, coefficient multiplicateur..."
 *   />
 */

import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ChevronRight, BookOpen } from 'lucide-react';

const ShaderBackground = lazy(() => import('../landing/ShaderBackground'));

interface BlogArticleHeroProps {
  category: string;
  readTime: string;
  date: string;
  title: string;
  subtitle?: string;
  /** Mot ou groupe de mots a accentuer en emerald dans le title (optionnel) */
  accentWord?: string;
}

export default function BlogArticleHero({
  category,
  readTime,
  date,
  title,
  subtitle,
  accentWord,
}: BlogArticleHeroProps) {
  // Si accentWord fourni, on l'enveloppe dans un span emerald
  const renderTitle = () => {
    if (!accentWord || !title.includes(accentWord)) {
      return <>{title}</>;
    }
    const parts = title.split(accentWord);
    return (
      <>
        {parts[0]}
        <span className="text-emerald-600">{accentWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <header className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 px-4 sm:px-6 overflow-hidden isolate">
      <Suspense fallback={<div className="absolute inset-0 z-0 bg-[#FAFAF7]" />}>
        <ShaderBackground intensity={0.6} />
      </Suspense>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[#737373] mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Accueil</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/blog" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            Blog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0F172A] font-medium truncate">{category}</span>
        </nav>

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {category}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#525252] bg-white/80 backdrop-blur border border-[#E5E7EB] rounded-full">
            <Clock className="w-3.5 h-3.5" />
            {readTime}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#525252] bg-white/80 backdrop-blur border border-[#E5E7EB] rounded-full">
            <Calendar className="w-3.5 h-3.5" />
            {date}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0F172A] leading-tight tracking-tight mb-6">
          {renderTitle()}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-base sm:text-lg lg:text-xl text-[#525252] leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
