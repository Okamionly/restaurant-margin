import { Link } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';

interface BlogAuthorProps {
  publishedDate: string;
  updatedDate?: string;
  readTime: string;
  variant?: 'header' | 'footer';
}

/**
 * BlogAuthor — Signature + bio for RestauMargin blog posts.
 *
 * E-E-A-T (Experience, Expertise, Authority, Trust) signals for Google.
 * The March 2026 Core Update penalized blog posts without author attribution.
 *
 * Usage:
 *   <BlogAuthor publishedDate="2026-04-14" readTime="12 min" variant="header" />
 *   <BlogAuthor publishedDate="2026-04-14" readTime="12 min" variant="footer" />
 */
export default function BlogAuthor({
  publishedDate,
  updatedDate,
  readTime,
  variant = 'header',
}: BlogAuthorProps) {
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (variant === 'header') {
    return (
      <div className="flex flex-wrap items-center gap-4 text-sm text-[#737373] mb-8 pb-6 border-b border-[#E5E7EB]">
        <Link to="/a-propos" className="flex items-center gap-2 hover:text-teal-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-xs">
            RM
          </div>
          <span className="font-semibold text-[#111111]">La rédaction RestauMargin</span>
        </Link>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <time dateTime={publishedDate} itemProp="datePublished">{formatDate(publishedDate)}</time>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {readTime} de lecture
        </span>
        {updatedDate && updatedDate !== publishedDate && (
          <span className="text-xs italic">Mis à jour le <time dateTime={updatedDate} itemProp="dateModified">{formatDate(updatedDate)}</time></span>
        )}
      </div>
    );
  }

  // Footer variant — full bio card
  return (
    <aside
      className="mt-16 p-6 sm:p-8 bg-gradient-to-br from-[#f8fafb] to-white border border-[#E5E7EB] rounded-3xl"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-xl">
          RM
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">À propos de l'auteur</span>
          </div>
          <h3 className="text-xl font-bold text-[#111111] mb-2" itemProp="name">
            La rédaction RestauMargin
          </h3>
          <p className="text-sm text-[#525252] leading-relaxed mb-3" itemProp="description">
            L'équipe <strong>RestauMargin</strong> est passionnée par la gestion de restaurant et
            l'optimisation des marges. Nous développons depuis 2025 des outils pour aider les chefs et
            restaurateurs à maîtriser leur food cost, leurs fiches techniques et la rentabilité de
            leurs plats grâce à l'intelligence artificielle.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/a-propos" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors" itemProp="url">
              En savoir plus →
            </Link>
            <a href="mailto:contact@restaumargin.fr" className="text-[#737373] hover:text-teal-600 transition-colors">
              contact@restaumargin.fr
            </a>
          </div>
        </div>
      </div>
      <meta itemProp="worksFor" content="RestauMargin" />
    </aside>
  );
}
