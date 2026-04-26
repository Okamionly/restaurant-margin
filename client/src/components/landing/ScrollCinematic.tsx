/**
 * @file client/src/components/landing/ScrollCinematic.tsx
 * Hero scrollytelling : 3 viewports avec animations CSS 3D + GSAP ScrollTrigger.
 * Bundle target ~70KB gzipped (GSAP + ScrollTrigger only, no Three.js).
 *
 * Sections :
 *   1. HERO       — Image hero parallax + H1 + KPIs counter
 *   2. DASHBOARD  — Screenshot mockup zoom progressif au scroll
 *   3. PROMESSES  — 3 cards qui se déplient en cascade
 *
 * After this section, le user atteint la VideoPresentation (60s loop)
 * puis le footer avec CTA + trust badges.
 *
 * A11y :
 *   - prefers-reduced-motion → disable parallax, fallback static layout
 *   - All animations done after first paint (no LCP impact)
 *   - Semantic HTML : <section> + <h1> + alt text on all images
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ACCENT = '#10B981'; // emerald-500 — RestauMargin green
const ACCENT_DARK = '#047857';

interface KpiCounterProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}

/**
 * Counter that animates from 0 to `value` when its row enters the viewport.
 * Uses GSAP for smooth easing instead of raw setInterval.
 */
function KpiCounter({ value, suffix = '', label, duration = 1.6 }: KpiCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => setDisplay(Math.round(obj.v * 10) / 10),
    });
    return () => {
      tween.kill();
    };
  }, [value, duration]);

  return (
    <div ref={ref} className="text-center px-4">
      <div className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight tabular-nums">
        {display % 1 === 0 ? Math.round(display) : display.toFixed(1)}
        <span className="text-[#10B981]">{suffix}</span>
      </div>
      <div className="text-sm text-[#64748B] mt-2 font-medium">{label}</div>
    </div>
  );
}

export default function ScrollCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLImageElement>(null);
  const promisesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Honour user accessibility preference — disable scroll-driven motion.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // ── 1. HERO parallax ────────────────────────────────────────────────
      // Image translates UP slower than text for depth effect.
      if (heroImgRef.current) {
        gsap.to(heroImgRef.current, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: '#cinematic-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }

      // Text fades + translates UP slightly faster than image.
      if (heroTextRef.current) {
        gsap.to(heroTextRef.current, {
          yPercent: -10,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#cinematic-hero',
            start: 'top top',
            end: 'bottom 30%',
            scrub: 0.5,
          },
        });
      }

      // ── 2. DASHBOARD zoom ──────────────────────────────────────────────
      // Screenshot starts at 0.6× scale, zooms to 1.05× as user scrolls past.
      if (dashboardRef.current) {
        gsap.fromTo(
          dashboardRef.current,
          { scale: 0.6, rotationY: -15, opacity: 0.7 },
          {
            scale: 1.05,
            rotationY: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#cinematic-dashboard',
              start: 'top 80%',
              end: 'top 20%',
              scrub: 0.8,
            },
          }
        );
      }

      // ── 3. PROMESSES cascade ───────────────────────────────────────────
      // Each card unfolds with rotateX from -30° to 0° + opacity 0 → 1, in stagger.
      if (promisesRef.current) {
        const cards = promisesRef.current.querySelectorAll('[data-promise-card]');
        gsap.fromTo(
          cards,
          { rotationX: -30, opacity: 0, y: 60 },
          {
            rotationX: 0,
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: promisesRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-white text-[#0F172A]" style={{ perspective: 1200 }}>
      {/* ═══════════════════════ 1. HERO ═══════════════════════ */}
      <section
        id="cinematic-hero"
        className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Parallax background image */}
        <img
          ref={heroImgRef}
          src="/images/hero/hero-1.webp"
          alt="Cuisine professionnelle RestauMargin"
          className="absolute inset-0 w-full h-[120%] object-cover -z-10"
          fetchPriority="high"
          decoding="async"
          style={{ willChange: 'transform' }}
        />
        {/* White-to-mint gradient veil so text stays readable */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.85) 40%, rgba(240,253,250,0.95) 100%)',
          }}
        />

        <div ref={heroTextRef} className="max-w-5xl mx-auto px-6 text-center" style={{ willChange: 'transform, opacity' }}>
          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 tracking-wide"
            style={{ background: '#ECFDF5', color: ACCENT_DARK, border: `1px solid ${ACCENT}33` }}
          >
            <Zap className="w-3.5 h-3.5" />
            PLATEFORME #1 DES RESTAURATEURS
          </div>

          {/* H1 — display font, large */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
            Maîtrisez vos marges.
            <br />
            <span style={{ color: ACCENT }}>Augmentez vos profits.</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            La plateforme tout-en-un pour reprendre le contrôle de vos coûts matière, calculer vos
            fiches techniques en secondes et automatiser vos commandes fournisseurs.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-base shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
                boxShadow: `0 10px 30px ${ACCENT}33`,
              }}
            >
              Essai gratuit 14 jours <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#video-presentation"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0F172A] font-bold text-base border-2 border-[#E5E7EB] hover:border-[#0F172A] transition-all"
            >
              Voir la démo (60s)
            </a>
          </div>

          <p className="mt-5 text-sm text-[#64748B] flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Sans carte bancaire requise · Annulation à tout moment
          </p>

          {/* KPIs */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <KpiCounter value={150} suffix="+" label="Restaurants équipés" />
            <KpiCounter value={7} suffix="pts" label="Food cost économisé" />
            <KpiCounter value={50} suffix="k" label="Pesées par mois" />
            <KpiCounter value={4.8} suffix="/5" label="Satisfaction clients" />
          </div>
        </div>

        {/* Scroll-down chevron */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-[#64748B]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════ 2. DASHBOARD ZOOM ═══════════════════════ */}
      <section
        id="cinematic-dashboard"
        className="relative min-h-screen flex flex-col items-center justify-center py-20 px-6 overflow-hidden bg-[#FAFAFA]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: ACCENT_DARK }}>
            Le dashboard que vos marges méritent
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Vos chiffres, en <span style={{ color: ACCENT }}>direct</span>.
          </h2>
          <p className="mt-4 text-lg text-[#64748B]">
            Food cost, marges, alertes prix fournisseurs — tout sur un seul écran, mis à jour
            chaque seconde.
          </p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto">
          {/* Soft glow halo behind the dashboard */}
          <div
            className="absolute inset-0 -z-10 rounded-[40px] blur-3xl opacity-50"
            style={{
              background: `radial-gradient(circle at center, ${ACCENT}33 0%, transparent 70%)`,
            }}
          />
          <img
            ref={dashboardRef}
            src="/images/restaumargin-station-opt.webp"
            alt="Dashboard RestauMargin avec food cost et marges en temps réel"
            className="w-full h-auto rounded-[24px] shadow-2xl border border-[#E5E7EB]"
            loading="lazy"
            decoding="async"
            style={{ willChange: 'transform, opacity', transformStyle: 'preserve-3d' }}
          />
        </div>
      </section>

      {/* ═══════════════════════ 3. 3 PROMESSES ═══════════════════════ */}
      <section
        id="cinematic-promises"
        className="relative py-24 px-6 bg-white"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: ACCENT_DARK }}>
            Trois promesses, mesurables
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Ce que vous obtenez, <span style={{ color: ACCENT }}>concrètement</span>.
          </h2>
        </div>

        <div ref={promisesRef} className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto" style={{ perspective: 1200 }}>
          {[
            {
              kpi: '30 sec',
              title: 'Une fiche technique créée',
              desc: 'Dictez vos ingrédients à la voix ou par chat. L\'IA calcule food cost, allergènes et marge en temps réel.',
            },
            {
              kpi: '-7 pts',
              title: 'Food cost moyen, en 30 jours',
              desc: 'Détection automatique des plats qui plombent vos marges. Vous corrigez, RestauMargin mesure.',
            },
            {
              kpi: '+3 K€',
              title: 'Marge mensuelle récupérée',
              desc: 'Alertes prix fournisseurs en temps réel + Mercuriale + Menu Engineering. Chaque centime compte.',
            },
          ].map((promise) => (
            <div
              key={promise.title}
              data-promise-card
              className="rounded-[20px] p-8 bg-white border-2 border-[#E5E7EB] hover:border-[#10B981] transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
            >
              <div
                className="text-5xl font-extrabold mb-4 tabular-nums"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {promise.kpi}
              </div>
              <h3 className="text-lg font-bold mb-2 text-[#0F172A]">{promise.title}</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">{promise.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
