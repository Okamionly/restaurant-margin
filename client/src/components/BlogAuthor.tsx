import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ShieldCheck, BookOpen, MapPin } from 'lucide-react';

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
      <div className="flex flex-wrap items-center gap-4 text-sm text-mono-500 mb-8 pb-6 border-b border-mono-900">
        <Link to="/a-propos" className="flex items-center gap-2 hover:text-teal-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-xs">
            RM
          </div>
          <span className="font-semibold text-mono-100">La rédaction RestauMargin</span>
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

  // Footer variant — full bio card (E-E-A-T enriched)
  const expertise = [
    'Food cost & ratios',
    'Fiches techniques',
    'Marges & rentabilité',
    'HACCP & traçabilité',
  ];

  return (
    <aside
      className="mt-16 p-6 sm:p-8 bg-gradient-to-br from-[#f8fafb] to-white border border-mono-900 rounded-3xl"
      itemScope
      itemType="https://schema.org/Organization"
    >
      {/* Organization E-E-A-T schema for the author entity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'La rédaction RestauMargin',
            'url': 'https://www.restaumargin.fr/a-propos',
            'logo': 'https://www.restaumargin.fr/icon-512.png',
            'foundingDate': '2025',
            'description':
              "Équipe éditoriale de RestauMargin, plateforme SaaS française de gestion de marge pour restaurateurs. Nous publions des guides sur le food cost, les fiches techniques et la rentabilité, mis à jour à partir de données réelles de centaines d'établissements.",
            'areaServed': 'FR',
            'knowsAbout': [
              'Food cost restaurant',
              'Coefficient multiplicateur',
              'Marge brute restauration',
              'Fiches techniques de cuisine',
              'Prime cost',
              'HACCP',
              'Gestion de restaurant',
            ],
            'sameAs': ['https://www.restaumargin.fr/a-propos'],
          }),
        }}
      />

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-xl">
          RM
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">À propos de l'auteur</span>
          </div>
          <h3 className="text-xl font-bold text-mono-100 mb-1" itemProp="name">
            La rédaction RestauMargin
          </h3>
          <p className="text-xs text-mono-500 mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Équipe éditoriale spécialisée restauration
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              Montpellier, France
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              Publie depuis 2025
            </span>
          </p>
          <p className="text-sm text-mono-400 leading-relaxed mb-3" itemProp="description">
            L'équipe <strong>RestauMargin</strong> conçoit depuis 2025 des outils de gestion pour les
            restaurateurs. Nos guides sur le <strong>food cost</strong>, les fiches techniques et la
            rentabilité s'appuient sur l'analyse de données réelles de centaines d'établissements et sont
            relus puis mis à jour régulièrement pour rester fidèles aux pratiques 2026.
          </p>

          {/* Domaines d'expertise — E-E-A-T expertise signal */}
          <div className="flex flex-wrap gap-2 mb-4">
            {expertise.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-medium text-teal-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link to="/a-propos" className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-semibold transition-colors" itemProp="url">
              <BookOpen className="w-4 h-4" />
              Qui sommes-nous &amp; méthodologie éditoriale →
            </Link>
            <a href="mailto:contact@restaumargin.fr" className="text-mono-500 hover:text-teal-600 transition-colors">
              contact@restaumargin.fr
            </a>
          </div>
        </div>
      </div>
      <meta itemProp="worksFor" content="RestauMargin" />
    </aside>
  );
}
