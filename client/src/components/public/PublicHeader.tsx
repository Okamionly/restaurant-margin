/**
 * En-tete unique du site public (2026-11-04).
 *
 * Avant : 39 variantes de <nav> recopiees page par page (liens, appels a
 * l'action et styles differents d'une page a l'autre). Une seule source ici :
 * meme logo, memes liens, meme appel a l'action sur tout le site.
 *
 * Couleurs W&B du CLAUDE.md (texte #111111, secondaire #525252, aucune teinte
 * « slate »), accent vert de la page d'accueil. Le site public est en theme
 * clair uniquement, comme la page d'accueil.
 */
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Calculator, ChefHat, Menu, X } from 'lucide-react';

const LIENS = [
  { to: '/fonctionnalites', label: 'Fonctionnalités' },
  { to: '/pricing', label: 'Tarifs' },
  { to: '/blog', label: 'Blog' },
];

export default function PublicHeader() {
  const [ouvert, setOuvert] = useState(false);
  const [defile, setDefile] = useState(false);
  const { pathname } = useLocation();

  // Le menu mobile se referme a chaque changement de page.
  useEffect(() => { setOuvert(false); }, [pathname]);

  useEffect(() => {
    const surDefilement = () => setDefile(window.scrollY > 8);
    surDefilement();
    window.addEventListener('scroll', surDefilement, { passive: true });
    return () => window.removeEventListener('scroll', surDefilement);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b transition-colors ${
        defile || ouvert ? 'border-[#E5E7EB]' : 'border-transparent'
      }`}
    >
      <nav
        aria-label="Navigation principale"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6"
      >
        <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="RestauMargin, retour à l'accueil">
          <span className="w-9 h-9 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-[#047857]" aria-hidden="true" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-[#111111] font-satoshi">RestauMargin</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {LIENS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `transition-colors ${isActive ? 'text-[#111111]' : 'text-[#525252] hover:text-[#111111]'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/outils/calculateur-marge-restaurant"
            className="inline-flex items-center gap-1.5 text-[#047857] hover:text-[#065F46] transition-colors"
          >
            <Calculator className="w-4 h-4" aria-hidden="true" /> Calculateur gratuit
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Link
            to="/login"
            className="px-3 py-2 text-sm font-semibold text-[#111111] rounded-lg hover:bg-[#F5F5F5] transition-colors"
          >
            Se connecter
          </Link>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-sm font-semibold transition-colors"
          >
            Essai gratuit 7 jours <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOuvert((o) => !o)}
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-lg text-[#111111] hover:bg-[#F5F5F5]"
          aria-expanded={ouvert}
          aria-controls="menu-public"
          aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {ouvert ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {ouvert && (
        <div id="menu-public" className="lg:hidden bg-white px-4 sm:px-6 pb-6">
          {LIENS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block py-3 text-base font-medium text-[#111111] border-b border-[#F5F5F5]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/outils/calculateur-marge-restaurant"
            className="flex items-center gap-2 py-3 text-base font-semibold text-[#047857] border-b border-[#F5F5F5]"
          >
            <Calculator className="w-4 h-4" aria-hidden="true" /> Calculateur de marge gratuit
          </Link>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              to="/login"
              className="text-center px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm font-semibold text-[#111111]"
            >
              Se connecter
            </Link>
            <Link
              to="/login?mode=register"
              className="text-center px-4 py-3 rounded-xl bg-[#047857] text-white text-sm font-semibold"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
