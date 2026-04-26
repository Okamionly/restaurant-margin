/**
 * @file client/src/pages/Landing.tsx
 * RestauMargin landing — refonte 2026-04-26 "Scroll Cinematic + Video".
 *
 * Architecture :
 *   1. <Navbar>             — sticky, transparent->blur on scroll
 *   2. <ScrollCinematic>    — 3 viewports parallax (Hero / Dashboard / Promesses)
 *   3. <VideoPresentation>  — 60s cinematic Cloudflare Stream remplace 12 sections
 *   4. <ConversionFooter>   — Trust badges + CTA banner + Newsletter inline + Footer
 *
 * Plus 3 widgets globaux :
 *   - StickyCtaBar (mobile only, after 30% scroll)
 *   - ExitIntentPopup (food cost calculator on mouseleave top)
 *   - ScrollProgressBar (3px green bar at top)
 *
 * Pages dédiées (linkées dans footer) pour le contenu profond :
 *   /fonctionnalites · /temoignages · /faq · /comment-ca-marche · /securite · /tarifs
 *
 * Bundle target : <250 KB JS gzipped (vs 600+ KB ancien monolithe).
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Menu, X as XIcon, ArrowRight, Calculator, X } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import ScrollCinematic from '../components/landing/ScrollCinematic';
import VideoPresentation from '../components/landing/VideoPresentation';
import ConversionFooter from '../components/landing/ConversionFooter';

const ACCENT = '#10B981';

// ────────────────────────────────────────────────────────────────────────────
// Navbar
// ────────────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-[#E5E7EB]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#ECFDF5' }}
          >
            <ChefHat className="w-5 h-5" style={{ color: ACCENT }} />
          </div>
          <span className="text-xl font-extrabold text-[#0F172A]">RestauMargin</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#475569]">
          <Link to="/fonctionnalites" className="hover:text-[#0F172A] transition-colors">Fonctionnalités</Link>
          <a href="#video-presentation" className="hover:text-[#0F172A] transition-colors">Démo</a>
          <Link to="/tarifs" className="hover:text-[#0F172A] transition-colors">Tarifs</Link>
          <Link to="/temoignages" className="hover:text-[#0F172A] transition-colors">Témoignages</Link>
          <Link to="/blog" className="hover:text-[#0F172A] transition-colors">Blog</Link>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-[#0F172A] hover:text-[#475569] transition-colors">
            Se connecter
          </Link>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-white font-semibold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
            style={{
              background: `linear-gradient(135deg, ${ACCENT} 0%, #047857 100%)`,
            }}
          >
            Essai 14 jours <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="lg:hidden p-2"
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#E5E7EB] px-4 py-6 space-y-4 text-base font-medium">
          <Link to="/fonctionnalites" className="block py-2" onClick={() => setMobileOpen(false)}>Fonctionnalités</Link>
          <a href="#video-presentation" className="block py-2" onClick={() => setMobileOpen(false)}>Démo</a>
          <Link to="/tarifs" className="block py-2" onClick={() => setMobileOpen(false)}>Tarifs</Link>
          <Link to="/temoignages" className="block py-2" onClick={() => setMobileOpen(false)}>Témoignages</Link>
          <Link to="/blog" className="block py-2" onClick={() => setMobileOpen(false)}>Blog</Link>
          <hr className="border-[#E5E7EB]" />
          <Link to="/login" className="block py-2" onClick={() => setMobileOpen(false)}>Se connecter</Link>
          <Link
            to="/login?mode=register"
            className="block text-center px-5 py-3 rounded-xl text-white font-semibold shadow-md"
            style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #047857 100%)` }}
            onClick={() => setMobileOpen(false)}
          >
            Essai gratuit 14 jours
          </Link>
        </div>
      )}
    </nav>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Scroll progress bar (3px top, green)
// ────────────────────────────────────────────────────────────────────────────
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-[3px] transition-[width] duration-100"
      style={{ width: `${progress}%`, background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
    />
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sticky CTA bar (mobile only, after scroll past hero)
// ────────────────────────────────────────────────────────────────────────────
function StickyCtaBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`lg:hidden fixed bottom-4 inset-x-4 z-40 transition-transform duration-300 ${
        show ? 'translate-y-0' : 'translate-y-32'
      }`}
    >
      <Link
        to="/login?mode=register"
        className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-white font-bold shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${ACCENT} 0%, #047857 100%)`,
          boxShadow: `0 10px 30px ${ACCENT}66`,
        }}
      >
        Essai gratuit 14 jours <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Exit-intent popup with mini food cost calculator
// ────────────────────────────────────────────────────────────────────────────
function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const fired = useRef(false);
  const [couverts, setCouverts] = useState(80);
  const [prix, setPrix] = useState(18);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('exit_dismissed') === '1') {
      setDismissed(true);
      return;
    }
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !fired.current && !dismissed) {
        fired.current = true;
        setShow(true);
      }
    };
    document.addEventListener('mouseleave', onLeave);
    return () => document.removeEventListener('mouseleave', onLeave);
  }, [dismissed]);

  const close = () => {
    setShow(false);
    sessionStorage.setItem('exit_dismissed', '1');
    setDismissed(true);
  };

  if (!show || dismissed) return null;

  // Quick estimate : 4% of monthly revenue saved (industry baseline).
  const ca = couverts * prix * 30;
  const savings = Math.round(ca * 0.04);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 p-2 hover:bg-[#F1F5F9] rounded-full transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: '#ECFDF5', color: '#047857' }}
        >
          <Calculator className="w-7 h-7" />
        </div>

        <h3 className="text-2xl font-extrabold mb-2 text-[#0F172A]">Avant de partir...</h3>
        <p className="text-sm text-[#64748B] mb-6">
          Estimez ce que vous pourriez économiser avec RestauMargin :
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
              Couverts par jour : <span className="text-[#0F172A]">{couverts}</span>
            </label>
            <input
              type="range"
              min={20}
              max={300}
              value={couverts}
              onChange={(e) => setCouverts(parseInt(e.target.value))}
              className="w-full mt-2 accent-[#10B981]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
              Prix moyen plat : <span className="text-[#0F172A]">{prix}€</span>
            </label>
            <input
              type="range"
              min={8}
              max={45}
              value={prix}
              onChange={(e) => setPrix(parseInt(e.target.value))}
              className="w-full mt-2 accent-[#10B981]"
            />
          </div>
        </div>

        <div className="rounded-2xl p-4 mb-6" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <p className="text-xs uppercase tracking-wider font-semibold text-[#047857]">
            Économies mensuelles estimées
          </p>
          <p className="text-3xl font-extrabold mt-1 text-[#0F172A] tabular-nums">
            {savings.toLocaleString('fr-FR')} €
          </p>
          <p className="text-xs text-[#64748B] mt-1">Soit {(savings * 12).toLocaleString('fr-FR')}€/an</p>
        </div>

        <Link
          to="/login?mode=register"
          className="block w-full text-center px-6 py-3.5 rounded-xl text-white font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-transform"
          style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #047857 100%)` }}
        >
          Démarrer l'essai gratuit
        </Link>
        <p className="text-xs text-center text-[#94A3B8] mt-3">Sans CB · 14 jours · Annulation 1 clic</p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// JSON-LD structured data (kept for SEO)
// ────────────────────────────────────────────────────────────────────────────
function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'RestauMargin',
        url: 'https://www.restaumargin.fr',
        logo: 'https://www.restaumargin.fr/og-image.png',
        sameAs: [],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'RestauMargin',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, iOS, Android',
        offers: { '@type': 'Offer', price: '29', priceCurrency: 'EUR' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '150' },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main page
// ────────────────────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <>
      <SEOHead
        title="RestauMargin — Logiciel de calcul de marge restaurant | Food cost et fiches techniques"
        description="RestauMargin : fiches techniques, food cost et commandes fournisseurs automatisés par l'IA. Logiciel de gestion de marge restaurant. Essai gratuit 14 jours."
        path="/"
      />
      <StructuredData />

      <ScrollProgressBar />
      <Navbar />

      <main className="overflow-x-hidden">
        <ScrollCinematic />
        <VideoPresentation />
        <ConversionFooter />
      </main>

      <StickyCtaBar />
      <ExitIntentPopup />
    </>
  );
}
