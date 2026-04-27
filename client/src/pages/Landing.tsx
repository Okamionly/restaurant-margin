/**
 * @file client/src/pages/Landing.tsx
 * RestauMargin landing — v3 "Claude Design Integration" — 2026-04-26.
 *
 * Architecture : 9 sections numérotées + 4 widgets globaux flottants.
 * Match exact des screenshots claude.design partagés par l'utilisateur.
 */

import { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  ChefHat, Menu, X as XIcon, ArrowRight, Calculator, X, Check,
  Send, Sparkles, ClipboardList, BarChart3, Truck, Scale, Thermometer,
  Star, ShieldCheck, MapPin, Headphones, FileCheck, CreditCard,
  Play, Tablet, ScanLine, ArrowUpRight, Camera, TrendingUp, Mic,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEOHead from '../components/SEOHead';
import ShaderBackground from '../components/landing/ShaderBackground';
// PaperFoldBackground = WebGL2 shader = ~30KB + GPU work that blocks the main
// thread during landing FCP. We lazy-load it so the LCP text renders first;
// the shader fades in once React has finished initial paint.
const PaperFoldBackground = lazy(() => import('../components/landing/PaperFoldBackground'));

gsap.registerPlugin(ScrollTrigger);

const ACCENT = '#10B981';
const ACCENT_DARK = '#047857';
const ACCENT_LIGHT = '#6EE7B7';
const ACCENT_BG = '#ECFDF5';
const TEXT = '#0F172A';
const TEXT_MUTED = '#64748B';
const BORDER = '#E5E7EB';

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      });
    });
    return () => ctx.revert();
  }, []);
  return ref;
}

function useCounter(target: number, decimals = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: target,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        onUpdate: () => setV(obj.v),
      });
    });
    return () => ctx.revert();
  }, [target]);
  return { ref, value: decimals === 0 ? Math.round(v) : Number(v.toFixed(decimals)) };
}

// Stagger multiple children on scroll-enter
function useStagger<T extends HTMLElement>(staggerDelay = 0.1) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const children = Array.from(el.children) as HTMLElement[];
    if (!children.length) return;
    const ctx = gsap.context(() => {
      // fromTo guarantees a deterministic final state if the ScrollTrigger
      // never fires (defensive : we'd rather show the cards than hide them).
      gsap.fromTo(
        children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: staggerDelay,
          // 'top bottom' = trigger as soon as the grid top touches the bottom
          // of the viewport (was 'top 85%', which left ~15% of cases unfired).
          scrollTrigger: { trigger: el, start: 'top bottom-=80', toggleActions: 'play none none none' },
        }
      );
    });
    // Force a refresh once the rest of the page (lazy images, fonts) has
    // settled — guards against stale measurements after Vite HMR or fonts.
    const t = setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [staggerDelay]);
  return ref;
}

// Typing effect for a string — returns displayed text
function useTypingEffect(text: string, active: boolean, speed = 60) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!active) { setDisplayed(text); return; }
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);
  return displayed;
}

// Pulse glow on value change
function usePulseOnChange(value: number) {
  const ref = useRef<HTMLDivElement>(null);
  const prevRef = useRef(value);
  useEffect(() => {
    if (prevRef.current === value) return;
    prevRef.current = value;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(el, { scale: 1.04 }, { scale: 1, duration: 0.35, ease: 'power2.out' });
  }, [value]);
  return ref;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function SectionNumber({ n, label }: { n: string; label?: string }) {
  return (
    <div className="inline-flex items-center gap-3 mb-4">
      <span
        className="inline-flex items-center justify-center min-w-[44px] h-10 px-3 rounded-full text-sm font-mono font-bold tracking-wide"
        style={{ background: 'white', border: `1px solid ${BORDER}`, color: TEXT }}
      >
        {n}
      </span>
      {label && (
        <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: TEXT_MUTED }}>
          {label}
        </span>
      )}
    </div>
  );
}

function DashboardMiniCard({ animated = false }: { animated?: boolean }) {
  const counter = useCounter(479, 0);
  return (
    <div
      ref={counter.ref}
      className="relative rounded-3xl p-6 bg-white shadow-xl"
      style={{ border: `1px solid ${BORDER}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: TEXT_MUTED }}>
          Économies / mois
        </span>
        <ArrowUpRight className="w-4 h-4" style={{ color: ACCENT }} />
      </div>
      <div className="text-4xl font-extrabold tabular-nums" style={{ color: TEXT }}>
        {animated ? counter.value : 479}.00 €
      </div>
      <div className="flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: ACCENT_DARK }}>
        <span>↗ +12%</span>
        <span style={{ color: TEXT_MUTED, fontWeight: 400 }}>vs mois dernier</span>
      </div>
      <svg viewBox="0 0 240 80" className="w-full mt-4" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.4" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,60 Q30,55 50,45 T100,40 T150,28 T200,18 T240,8 L240,80 L0,80 Z" fill="url(#sparkGrad)" />
        <path d="M0,60 Q30,55 50,45 T100,40 T150,28 T200,18 T240,8" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Rich Dashboard Mockup — auto-cycling carousel between 2 variants.
// V1: Light dashboard (food cost, marge, alerts)
// V2: Voice mode "Nouvelle fiche · dictée" (audio waveform → recipe card)
// 3D tilt is driven by GSAP scrollTrigger so the mockup leans towards the
// viewer as it enters the viewport (Apple-style "lift" effect). Neon blue
// (#06B6D4 cyan) is interleaved with the emerald green for a fluo accent.
// ═══════════════════════════════════════════════════════════════════════════
const NEON_BLUE = '#06B6D4'; // cyan/electric blue companion to ACCENT (emerald)
const MONO_STYLE = { fontFamily: '"JetBrains Mono", "SF Mono", ui-monospace, monospace' } as React.CSSProperties;

// ── Variant A : Dashboard ──────────────────────────────────────────────────
function DashboardVariant({ active }: { active: boolean }) {
  const foodCost = useCounter(27.3, 1);
  const marge = useCounter(72.7, 1);
  const ca = useCounter(38, 0);
  const economies = useCounter(2.6, 1);

  const platBars = [
    { n: 'Entrecôte', pct: 62, color: '#F59E0B', warn: true },
    { n: 'Saumon', pct: 38, color: ACCENT },
    { n: 'Poulet', pct: 24, color: ACCENT },
    { n: 'Risotto', pct: 18, color: NEON_BLUE },
  ];

  return (
    <div ref={foodCost.ref} className="rounded-2xl overflow-hidden bg-white"
      style={{ border: `1px solid ${BORDER}`, boxShadow: `0 30px 80px -20px rgba(15, 23, 42, 0.18), 0 0 0 1px ${ACCENT}1A, 0 0 60px ${NEON_BLUE}1A` }}
    >
      {/* URL bar */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b" style={{ borderColor: BORDER, background: '#FAFBFC' }}>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="ml-2 text-[11px] font-bold flex items-center gap-1" style={{ color: TEXT }}>
          RestauMargin<span style={{ color: TEXT_MUTED, fontWeight: 400 }}>/ Dashboard</span>
        </div>
        <span className="ml-auto px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.14em]"
          style={{ background: `linear-gradient(135deg, ${ACCENT}22, ${NEON_BLUE}22)`, color: ACCENT_DARK, border: `1px solid ${ACCENT}33` }}
        >
          Nouveau 2026
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* 4 KPI cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { l: 'FOOD COST', v: (active ? foodCost.value : 27.3).toFixed(1), unit: '%', sub: '▼ 6.7pts vs janvier', subColor: ACCENT_DARK, mainColor: ACCENT_DARK },
            { l: 'MARGE BRUTE', v: (active ? marge.value : 72.7).toFixed(1), unit: '%', sub: 'Objectif : 70%', subColor: TEXT_MUTED, mainColor: TEXT },
            { l: 'CA CE MOIS', v: Math.round(active ? ca.value : 38).toString(), unit: 'k€', sub: '▲ +4.2% vs N-1', subColor: ACCENT_DARK, mainColor: TEXT },
            { l: 'ÉCONOMIES/MOIS', v: (active ? economies.value : 2.6).toFixed(1), unit: 'k€', sub: 'vs avant RM', subColor: TEXT_MUTED, mainColor: NEON_BLUE },
          ].map((k) => (
            <div key={k.l} className="rounded-xl p-3" style={{ background: '#FAFBFC', border: `1px solid ${BORDER}` }}>
              <div className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: TEXT_MUTED }}>{k.l}</div>
              <div className="mt-1.5 flex items-baseline gap-0.5">
                <span className="text-2xl font-extrabold tabular-nums leading-none" style={{ ...MONO_STYLE, color: k.mainColor }}>{k.v}</span>
                <span className="text-[11px] font-semibold opacity-70" style={{ ...MONO_STYLE, color: k.mainColor }}>{k.unit}</span>
              </div>
              <div className="text-[9px] mt-1.5" style={{ color: k.subColor }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Food cost par plat bars */}
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-2.5" style={{ color: TEXT_MUTED }}>Food cost par plat</div>
          <div className="space-y-1.5">
            {platBars.map((p) => (
              <div key={p.n} className="grid grid-cols-[60px_1fr_auto] gap-3 items-center text-[10px]">
                <span style={{ color: TEXT }}>{p.n}</span>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${p.pct}%`,
                    background: p.warn ? p.color : p.color === NEON_BLUE ? `linear-gradient(90deg, ${NEON_BLUE}, ${ACCENT})` : `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DARK})`,
                    boxShadow: `0 0 8px ${p.color}66`,
                  }} />
                </div>
                <span className="font-semibold tabular-nums" style={{ ...MONO_STYLE, color: TEXT_MUTED }}>{p.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert */}
        <div className="rounded-lg px-3 py-2 flex items-center gap-2 text-[10px]" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />
          <span><strong>Entrecôte 62%</strong> — revoir grammage ou tarif fournisseur</span>
        </div>
      </div>
    </div>
  );
}

// ── Variant B : Voice fiche dictée ─────────────────────────────────────────
function VoiceFicheVariant({ active }: { active: boolean }) {
  const [seconds, setSeconds] = useState(14);
  useEffect(() => {
    if (!active) { setSeconds(14); return; }
    const id = setInterval(() => setSeconds((s) => (s >= 30 ? 14 : s + 1)), 1000);
    return () => clearInterval(id);
  }, [active]);

  // Animated waveform bars heights
  const bars = Array.from({ length: 28 }, (_, i) => {
    const base = 0.3 + 0.7 * Math.abs(Math.sin(i * 0.7 + (active ? Date.now() / 400 : 0)));
    return Math.round(base * 100);
  });

  return (
    <div className="rounded-2xl overflow-hidden bg-white"
      style={{ border: `1px solid ${BORDER}`, boxShadow: `0 30px 80px -20px rgba(15, 23, 42, 0.18), 0 0 0 1px ${NEON_BLUE}1A, 0 0 60px ${ACCENT}1A` }}
    >
      {/* Header with mic icon */}
      <div className="flex items-center gap-3 px-5 sm:px-6 py-4">
        <div className="relative w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: ACCENT_BG }}>
          <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ background: ACCENT }} />
          <Mic className="w-5 h-5 relative" style={{ color: ACCENT_DARK }} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold" style={{ color: TEXT }}>Nouvelle fiche · dictée</div>
          <div className="text-xs flex items-center gap-1.5" style={{ color: ACCENT_DARK }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
            Enregistrement…
          </div>
        </div>
        <div className="text-sm font-bold tabular-nums" style={{ ...MONO_STYLE, color: TEXT }}>
          00:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      {/* Audio waveform */}
      <div className="px-5 sm:px-6 pt-1 pb-3">
        <div className="flex items-center justify-center gap-[3px] h-12">
          {bars.map((h, i) => (
            <span
              key={i}
              className="rounded-full"
              style={{
                width: 3,
                height: `${Math.max(6, h * 0.36)}px`,
                background: i < 16 ? ACCENT : ACCENT_DARK,
                opacity: 0.4 + (h / 100) * 0.6,
                animation: active ? `waveBar 0.8s ease-in-out ${i * 50}ms infinite alternate` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Quote */}
      <div className="px-5 sm:px-6 py-3">
        <p className="text-sm leading-relaxed" style={{ color: TEXT }}>
          <span className="text-lg font-bold" style={{ color: ACCENT_DARK }}>« </span>
          Magret de canard, sauce miel et thym, pommes grenailles rôties, 220 g par portion, coefficient 3,8.
          <span className="text-lg font-bold ml-0.5" style={{ color: ACCENT_DARK }}> »</span>
        </p>
      </div>

      {/* Divider with label */}
      <div className="px-5 sm:px-6 py-2 flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: BORDER }} />
        <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: ACCENT_DARK }}>L'IA structure</span>
        <div className="flex-1 h-px" style={{ background: BORDER }} />
      </div>

      {/* Recipe card */}
      <div className="px-5 sm:px-6 pb-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-base font-extrabold" style={{ color: TEXT }}>Magret · sauce miel & thym</h4>
            <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>Plat · 220 g · 1 portion</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: TEXT_MUTED }}>Coût matière</div>
            <div className="text-2xl font-extrabold tabular-nums" style={{ ...MONO_STYLE, color: ACCENT_DARK }}>7,08 €</div>
          </div>
        </div>

        {/* Ingredient lines */}
        <div className="space-y-1.5">
          {[
            { n: 'Magret de canard', q: '180 g', p: '3,42 €' },
            { n: 'Pommes grenailles', q: '120 g', p: '0,82 €' },
            { n: 'Miel de châtaignier', q: '15 g', p: '0,38 €' },
            { n: 'Thym frais · ail · beurre', q: '—', p: '2,46 €' },
          ].map((it) => (
            <div key={it.n} className="rounded-lg px-3 py-2 grid grid-cols-[1fr_auto_auto] gap-3 items-center text-xs" style={{ background: ACCENT_BG }}>
              <span className="text-right font-medium" style={{ color: TEXT }}>{it.n}</span>
              <span className="font-semibold tabular-nums" style={{ ...MONO_STYLE, color: TEXT_MUTED, minWidth: 38 }}>{it.q}</span>
              <span className="font-semibold tabular-nums" style={{ ...MONO_STYLE, color: TEXT, minWidth: 48 }}>{it.p}</span>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: TEXT_MUTED }}>Food cost</div>
            <div className="mt-1 text-xl font-extrabold tabular-nums" style={{ ...MONO_STYLE, color: ACCENT_DARK }}>26,3 %</div>
          </div>
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: TEXT_MUTED }}>Coefficient</div>
            <div className="mt-1 text-xl font-extrabold tabular-nums" style={{ ...MONO_STYLE, color: TEXT }}>×3,8</div>
          </div>
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: TEXT_MUTED }}>Prix de vente</div>
            <div className="mt-1 text-xl font-extrabold tabular-nums" style={{ ...MONO_STYLE, color: ACCENT_DARK }}>26,90 €</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Carousel orchestrator ──────────────────────────────────────────────────
function RichDashboardMockup() {
  const [activeIdx, setActiveIdx] = useState(0);
  const tiltRef = useRef<HTMLDivElement>(null);

  // Auto-cycle every 6.5s between the 2 variants. Pause on hover.
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setActiveIdx((i) => (i === 0 ? 1 : 0)), 6500);
    return () => clearInterval(id);
  }, [paused]);

  // 3D tilt sur scroll (lift Apple-style).
  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { rotateX: 12, rotateY: -10, scale: 0.95 },
        {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 30%', scrub: 0.6 },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // Pre-measure the taller variant so the wrapper height stays stable.
  // Each variant is absolute-positioned in the wrapper; without a min-height
  // the parent collapses on flip. Use min-height matching variant B (taller).
  return (
    <div
      className="relative"
      style={{ perspective: '1400px', perspectiveOrigin: '50% 60%' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={tiltRef} className="relative" style={{ transformStyle: 'preserve-3d' }}>
        {/* Neon glow halo */}
        <div
          className="absolute inset-0 -z-10 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${ACCENT}33 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, ${NEON_BLUE}33 0%, transparent 50%)`,
            filter: 'blur(40px)',
            transform: 'translateZ(-40px) scale(1.05)',
          }}
        />

        {/* 3D flip stage. Each variant occupies the same slot; non-active rotates Y to hide. */}
        <div className="relative" style={{ transformStyle: 'preserve-3d', minHeight: '560px' }}>
          <div
            className="transition-all duration-700 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: activeIdx === 0 ? 'rotateY(0deg)' : 'rotateY(-90deg)',
              opacity: activeIdx === 0 ? 1 : 0,
              pointerEvents: activeIdx === 0 ? 'auto' : 'none',
              position: activeIdx === 0 ? 'relative' : 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
            }}
          >
            <DashboardVariant active={activeIdx === 0} />
          </div>
          <div
            className="transition-all duration-700 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: activeIdx === 1 ? 'rotateY(0deg)' : 'rotateY(90deg)',
              opacity: activeIdx === 1 ? 1 : 0,
              pointerEvents: activeIdx === 1 ? 'auto' : 'none',
              position: activeIdx === 1 ? 'relative' : 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
            }}
          >
            <VoiceFicheVariant active={activeIdx === 1} />
          </div>
        </div>

        {/* Carousel dots indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {[0, 1].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              aria-label={i === 0 ? 'Voir le dashboard' : 'Voir la fiche dictée'}
              className="rounded-full transition-all"
              style={{
                width: activeIdx === i ? 24 : 6,
                height: 6,
                background: activeIdx === i ? ACCENT : '#CBD5E1',
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating cards stay outside the carousel so they're visible on both variants */}
      <div
        className="hidden md:flex absolute items-center gap-2.5 rounded-xl bg-white shadow-2xl px-3 py-2.5"
        style={{
          left: '-20px',
          bottom: '18%',
          border: `1px solid ${ACCENT}33`,
          boxShadow: `0 20px 40px rgba(15, 23, 42, 0.12), 0 0 24px ${ACCENT}22`,
          animation: 'floatY 6s ease-in-out infinite',
        }}
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${ACCENT_BG}, ${NEON_BLUE}22)`, color: ACCENT_DARK }}>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-xs font-bold leading-tight" style={{ color: TEXT }}>Fiche technique générée</div>
          <div className="text-[10px] mt-0.5" style={{ color: TEXT_MUTED }}>
            <span style={{ ...MONO_STYLE, color: ACCENT_DARK, fontWeight: 600 }}>10,4 s</span> · Magret sauce miel
          </div>
        </div>
      </div>

      <div
        className="hidden md:flex absolute items-center gap-2.5 rounded-xl bg-white shadow-2xl px-3 py-2.5"
        style={{
          right: '-12px',
          top: '6%',
          border: `1px solid ${NEON_BLUE}33`,
          boxShadow: `0 20px 40px rgba(15, 23, 42, 0.12), 0 0 24px ${NEON_BLUE}22`,
          animation: 'floatY 7s ease-in-out -2s infinite',
        }}
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${NEON_BLUE}22, ${ACCENT_BG})`, color: NEON_BLUE }}>
          <BarChart3 className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-xs font-bold leading-tight" style={{ color: TEXT }}>Coefficient appliqué</div>
          <div className="text-[10px] mt-0.5" style={{ color: TEXT_MUTED }}>
            <span style={{ ...MONO_STYLE, fontWeight: 600 }}>×3,8</span> → prix de vente <span style={{ ...MONO_STYLE, color: ACCENT_DARK, fontWeight: 600 }}>26,90 €</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 01 — HERO
// ═══════════════════════════════════════════════════════════════════════════
function HeroKpis() {
  // Format inspired from claude.design "RestauMargin Nouveau" — big number on top
  // (mono font for the technical feel), small uppercase tracking-wide label below.
  const kpis = [
    { value: '320+', label: 'Brigades actives' },
    { value: '+4 pts', label: 'Marge en 90 j' },
    { value: '10 s', label: 'Pour une fiche' },
    { value: '800 €', label: 'Économisés / site' },
  ];
  const containerRef = useStagger<HTMLDivElement>(0.12);
  return (
    <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-10">
      {kpis.map((k) => (
        <div
          key={k.label}
          className="rounded-2xl px-4 py-4 sm:py-5"
          style={{ background: 'white', border: `1px solid ${BORDER}` }}
        >
          <div
            className="text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight"
            style={{ color: TEXT, fontFamily: '"JetBrains Mono", "SF Mono", ui-monospace, monospace' }}
          >
            {k.value}
          </div>
          <div
            className="text-[10px] sm:text-[11px] mt-1.5 font-semibold uppercase tracking-[0.12em]"
            style={{ color: TEXT_MUTED }}
          >
            {k.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroSection() {
  const ref = useReveal<HTMLDivElement>();
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden isolate">
      {/* Paper Fold shader inside the browser frame — animated folded paper
          texture with neon emerald creases that follow the cursor. The
          shader's own paper-white base (#FAFAF7) guarantees text contrast,
          no veil needed on top. `isolate` on the parent + z-0 here creates
          a fresh stacking context so the negative z-index of nothing below
          us can clip the canvas. */}
      <Suspense fallback={<div className="absolute inset-0 z-0 bg-[#FAFAF7]" />}>
        <PaperFoldBackground intensity={1.0} className="z-0" />
      </Suspense>
      {/* Scroll parallax stub — visible above the shader, transparent. */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />
      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div ref={ref}>
          {/* Eyebrow badge with pulse dot — replaces the "01 RestauMargin" SectionNumber. */}
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ background: ACCENT_BG, color: ACCENT_DARK, border: `1px solid ${ACCENT_LIGHT}` }}
          >
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: ACCENT }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: ACCENT }} />
            </span>
            Plateforme #1 des restaurateurs
          </span>
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight" style={{ color: TEXT }}>
            Maîtrisez vos marges restaurant.
            <br />
            <span style={{ color: ACCENT }}>Augmentez vos profits.</span>
          </h1>
          <p className="mt-6 text-xl leading-relaxed" style={{ color: TEXT_MUTED }}>
            L'IA au service de votre rentabilité.
          </p>
          <ul className="mt-8 space-y-3">
            {['Marges optimisées', 'Fiches techniques en quelques clics', 'Analyse et alertes en temps réel'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: ACCENT }}>
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span className="text-base font-medium" style={{ color: TEXT }}>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-base shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`, boxShadow: `0 12px 30px ${ACCENT}40`, '--tw-ring-color': ACCENT } as React.CSSProperties}
            >
              Essayer gratuitement <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs flex items-center gap-3 font-medium" style={{ color: TEXT_MUTED }}>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
                7 jours gratuits
              </span>
              <span>·</span>
              <span>Sans carte bancaire</span>
            </span>
          </div>
          <HeroKpis />
        </div>
        <div className="relative">
          <RichDashboardMockup />
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 02 — ROI CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════
function RoiCalculatorSection() {
  const titleRef = useReveal<HTMLDivElement>();
  const cardsRef = useReveal<HTMLDivElement>();
  const [couverts, setCouverts] = useState(80);
  const [prix, setPrix] = useState(18);
  const [plats, setPlats] = useState(25);
  // Same model as the claude.design "RestauMargin Nouveau" ROI card —
  // 4 % marge récupérée × 20 % de l'amélioration adressable.
  const monthly = Math.round(couverts * prix * 30 * 0.04 * 0.20);
  const annual = monthly * 12;
  const retour = Math.max(1, Math.round(monthly / 49));
  const pulseRef = usePulseOnChange(monthly);
  const fmtEur = (n: number) => n.toLocaleString('fr-FR');

  const monoStyle = { fontFamily: '"JetBrains Mono", "SF Mono", ui-monospace, monospace' } as React.CSSProperties;

  // Slider rows extracted to drive a single map and shave repetition.
  const rows = [
    { label: 'Couverts par jour', value: couverts, set: setCouverts, min: 20, max: 300, suffix: '' },
    { label: 'Ticket moyen', value: prix, set: setPrix, min: 8, max: 60, suffix: ' €' },
    { label: 'Plats à la carte', value: plats, set: setPlats, min: 5, max: 80, suffix: '' },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-start mb-10 lg:mb-14">
          <div>
            <SectionNumber n="02" label="Calcul de marge" />
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-tight" style={{ color: TEXT }}>
              Votre cuisine,
              <br />
              <span style={{ color: ACCENT }}>en chiffres.</span>
            </h2>
          </div>
          <p className="text-base lg:text-lg lg:pt-16" style={{ color: TEXT_MUTED }}>
            Quatre points de marge récupérés sur des milliers de couverts.
            Bougez les curseurs : votre service vous parle.
          </p>
        </div>

        <div ref={cardsRef} className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* ── Sliders card ──────────────────────────────────────── */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white shadow-xl" style={{ border: `1px solid ${BORDER}` }}>
            {rows.map((field, i) => (
              <div key={field.label} className={i < rows.length - 1 ? 'mb-7' : ''}>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold" style={{ color: TEXT }}>
                    {field.label}
                  </label>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-bold tabular-nums"
                    style={{ ...monoStyle, background: ACCENT_BG, color: ACCENT_DARK }}
                  >
                    {field.value}{field.suffix}
                  </span>
                </div>
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  value={field.value}
                  onChange={(e) => field.set(parseInt(e.target.value))}
                  className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-full"
                  style={{ accentColor: ACCENT, '--tw-ring-color': ACCENT } as React.CSSProperties}
                  aria-label={field.label}
                />
                <div className="flex justify-between text-xs mt-2" style={{ color: TEXT_MUTED }}>
                  <span>{field.min}{field.suffix}</span>
                  <span>{field.max}{field.suffix}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Result card ───────────────────────────────────────── */}
          <div
            ref={pulseRef}
            className="rounded-3xl p-6 sm:p-8 bg-white shadow-xl transition-shadow duration-300 flex flex-col"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div className="text-xs uppercase tracking-[0.18em] font-semibold" style={{ color: TEXT_MUTED }}>
              Économies estimées
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <div
                className="text-6xl sm:text-7xl font-extrabold tabular-nums leading-none"
                style={{ ...monoStyle, color: TEXT }}
              >
                {fmtEur(monthly)}
              </div>
              <span className="text-2xl font-semibold" style={{ color: TEXT_MUTED }}>€</span>
            </div>
            <p className="mt-2 text-sm" style={{ color: TEXT_MUTED }}>
              par mois — sur la base de +4 pts de marge
            </p>

            {/* Progress bar */}
            <div className="mt-5 h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${Math.min(100, monthly / 60)}%`,
                  background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DARK})`,
                }}
              />
            </div>

            {/* /AN · RETOUR · DÉLAI grid */}
            <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { l: '/ AN', v: `${fmtEur(annual)} €`, accent: true },
                { l: 'RETOUR', v: `×${retour}`, accent: false },
                { l: 'DÉLAI', v: '30 j', accent: false },
              ].map((s) => (
                <div key={s.l}>
                  <div
                    className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] mb-1"
                    style={{ color: TEXT_MUTED }}
                  >
                    {s.l}
                  </div>
                  <div
                    className="text-lg sm:text-xl font-extrabold tabular-nums"
                    style={{ ...monoStyle, color: s.accent ? ACCENT_DARK : TEXT }}
                  >
                    {s.v}
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/login?mode=register"
              className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
                boxShadow: `0 12px 30px ${ACCENT}40`,
                '--tw-ring-color': ACCENT,
              } as React.CSSProperties}
            >
              Lancer mon essai 7 jours <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 03 — PRICING
// ═══════════════════════════════════════════════════════════════════════════
function PricingSection() {
  const ref = useReveal<HTMLDivElement>();
  const [annual, setAnnual] = useState(false);

  const pricing = {
    pro: { monthly: 29, annual: 23, features: ['Fiches techniques illimitées', '19 actions IA', 'Commandes fournisseurs', 'Scanner de factures IA', '500 requêtes IA / mois'] },
    business: { monthly: 79, annual: 63, features: ['Tout du plan Pro', 'Multi-restaurants', '2000 requêtes IA / mois', 'Rapports IA hebdomadaires', 'Menu Engineering', 'Support prioritaire'] },
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start mb-12">
          <div>
            <SectionNumber n="03" label="Tarifs" />
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight" style={{ color: TEXT }}>
              Des tarifs <span style={{ color: ACCENT }}>simples</span>
              <br />
              et <span style={{ color: ACCENT }}>transparents</span>
            </h2>
            <p className="mt-4 text-lg" style={{ color: TEXT_MUTED }}>
              Sans engagement. Annulez quand vous voulez.
            </p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <div className="inline-flex items-center gap-1 p-1 rounded-full" style={{ background: '#F5F5F5' }}>
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={{ background: !annual ? 'white' : 'transparent', color: !annual ? TEXT : TEXT_MUTED, boxShadow: !annual ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}
              >Mensuel</button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
                style={{ background: annual ? 'white' : 'transparent', color: annual ? TEXT : TEXT_MUTED, boxShadow: annual ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}
              >
                Annuel
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: ACCENT, color: 'white' }}>-20%</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-8 bg-white transition-all duration-200 hover:-translate-y-1"
            style={{ border: `1px solid ${BORDER}`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: TEXT }}>Pro</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-extrabold" style={{ color: TEXT }}>
                {annual ? pricing.pro.annual : pricing.pro.monthly}
              </span>
              <span className="text-lg font-semibold" style={{ color: TEXT_MUTED }}>€/mois</span>
            </div>
            {annual && (
              <p className="text-xs font-semibold mb-6" style={{ color: ACCENT_DARK }}>
                Soit {pricing.pro.annual * 12} €/an au lieu de {pricing.pro.monthly * 12} €
              </p>
            )}
            <ul className="space-y-3 mb-8">
              {pricing.pro.features.map((feat) => (
                <li key={feat} className="flex items-start gap-3 text-sm" style={{ color: TEXT }}>
                  <Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: ACCENT_DARK }} strokeWidth={2.5} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/login?mode=register"
              className="block w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-[#F5F5F5] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: 'white', color: TEXT, border: `2px solid ${BORDER}`, '--tw-ring-color': ACCENT } as React.CSSProperties}
            >Commencer l'essai gratuit</Link>
          </div>

          <div
            className="rounded-3xl p-8 bg-white relative transition-all duration-200 hover:-translate-y-1"
            style={{ border: `2px solid ${ACCENT}`, boxShadow: `0 20px 40px ${ACCENT}1A` }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 28px 48px ${ACCENT}28`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 40px ${ACCENT}1A`; }}
          >
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse-badge"
              style={{ background: ACCENT, color: 'white' }}
            >
              Populaire
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: TEXT }}>Business</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-extrabold" style={{ color: TEXT }}>
                {annual ? pricing.business.annual : pricing.business.monthly}
              </span>
              <span className="text-lg font-semibold" style={{ color: TEXT_MUTED }}>€/mois</span>
            </div>
            {annual && (
              <p className="text-xs font-semibold mb-6" style={{ color: ACCENT_DARK }}>
                Soit {pricing.business.annual * 12} €/an au lieu de {pricing.business.monthly * 12} €
              </p>
            )}
            <ul className="space-y-3 mb-8">
              {pricing.business.features.map((feat) => (
                <li key={feat} className="flex items-start gap-3 text-sm" style={{ color: TEXT }}>
                  <Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: ACCENT_DARK }} strokeWidth={2.5} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/login?mode=register"
              className="block w-full text-center py-3.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`, boxShadow: `0 12px 30px ${ACCENT}40`, '--tw-ring-color': ACCENT } as React.CSSProperties}
            >Commencer l'essai gratuit</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 04 — FONCTIONNALITÉS
// ═══════════════════════════════════════════════════════════════════════════
function FeaturesSection() {
  const titleRef = useReveal<HTMLDivElement>();
  const gridRef = useStagger<HTMLDivElement>(0.06);
  // 8 features (port from claude.design "RestauMargin Nouveau" Features grid).
  const features = [
    { icon: Send, title: 'Commandes fournisseurs en 1 clic', body: 'Email ou WhatsApp envoyés directement depuis la mercuriale, avec votre BL pré-rempli.' },
    { icon: Sparkles, title: "L'IA qui parle cuisine", body: "Dictez la recette, l'IA structure ingrédients, allergènes et coût. Pas de jargon SaaS." },
    { icon: ClipboardList, title: 'Fiches techniques en 10 s', body: 'Food cost, marge, coefficient, allergènes — calculés en temps réel, prêts pour l\'inspection.' },
    { icon: Truck, title: 'Mercuriale & alertes prix', body: 'Suivi automatique des prix par fournisseur. Alerte dès que le beurre dérive.' },
    { icon: Scale, title: 'Pesage Bluetooth', body: 'Balance connectée à la fiche, en plein service. Plus de Post-it sur le plan de travail.' },
    { icon: Thermometer, title: 'HACCP digital', body: 'Températures, nettoyage, traçabilité — un tap. Inspection : un PDF. Fini le classeur.' },
    { icon: Camera, title: 'OCR factures', body: 'Photo de la facture, prix injectés dans la mercuriale en 4 secondes. Aucune saisie.' },
    { icon: TrendingUp, title: 'Menu Engineering', body: 'Stars, puzzles, plowhorses, dogs. Sait quel plat sortir de la carte avant qu\'il vous coûte cher.' },
  ];

  const monoStyle = { fontFamily: '"JetBrains Mono", "SF Mono", ui-monospace, monospace' } as React.CSSProperties;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-start mb-10 lg:mb-14">
          <div ref={titleRef}>
            <SectionNumber n="04" label="Fonctionnalités" />
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-tight" style={{ color: TEXT }}>
              Tout ce qu'il faut
              <br />
              pour piloter une
              <br />
              <span style={{ color: ACCENT }}>cuisine rentable.</span>
            </h2>
          </div>
          <p className="text-base lg:text-lg lg:pt-24" style={{ color: TEXT_MUTED }}>
            Huit modules qui se parlent — pas une suite d'outils dispersés.
            Construits avec des chefs, sur le pass, à 23 h.
          </p>
        </div>
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            const num = String(i + 1).padStart(2, '0');
            return (
              <article
                key={f.title}
                className="rounded-2xl p-5 lg:p-6 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md group flex flex-col"
                style={{ border: `1px solid ${BORDER}` }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = ACCENT;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = BORDER;
                }}
              >
                <div className="text-xs font-semibold mb-3" style={{ ...monoStyle, color: TEXT_MUTED }}>
                  {num}
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: ACCENT_BG, color: ACCENT_DARK }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold mb-2" style={{ color: TEXT }}>
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {f.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 05 — PROCESSUS
// ═══════════════════════════════════════════════════════════════════════════
function ProcessSection() {
  const titleRef = useReveal<HTMLDivElement>();
  const stepsRef = useStagger<HTMLDivElement>(0.15);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
      });
    });
    return () => ctx.revert();
  }, []);

  const steps = [
    { n: '01', icon: ScanLine, title: 'Ajoutez vos ingrédients', desc: "Importez votre liste depuis Excel ou dictez-les à l'IA. Prix, fournisseurs, unités : tout est organisé automatiquement." },
    { n: '02', icon: ClipboardList, title: 'Créez vos fiches techniques', desc: "L'assistant IA génère vos fiches en 10 secondes. Food cost, marge, allergènes, coefficient — calculés en temps réel." },
    { n: '03', icon: BarChart3, title: 'Optimisez vos marges', desc: "Dashboard KPIs, alertes prix fournisseurs, Menu Engineering. Vos marges s'améliorent dès le premier jour." },
  ];
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#FAFAFA' }}>
      <div ref={titleRef} className="max-w-6xl mx-auto">
        <SectionNumber n="05" label="Processus" />
        <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight" style={{ color: TEXT }}>
          Trois étapes <span style={{ color: ACCENT }}>simples</span>
        </h2>
        <p className="mt-4 text-lg" style={{ color: TEXT_MUTED }}>
          De l'inscription à l'optimisation de vos marges en quelques minutes.
        </p>
        <div className="mt-16 relative">
          {/* Animated dotted timeline */}
          <div
            ref={timelineRef}
            className="hidden md:block absolute top-7 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px -z-10"
            style={{ backgroundImage: `repeating-linear-gradient(to right, ${ACCENT} 0 8px, transparent 8px 16px)` }}
          />
          <div ref={stepsRef} className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.n} className="text-center">
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 font-mono font-bold text-sm transition-transform duration-200 hover:scale-110"
                    style={{ background: 'white', border: `2px solid ${ACCENT}`, color: ACCENT_DARK }}
                  >
                    {step.n}
                  </div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 mx-auto" style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_LIGHT}` }}>
                    <Icon className="w-6 h-6" style={{ color: ACCENT_DARK }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: TEXT }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: TEXT_MUTED }}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 06 — TÉMOIGNAGES
// ═══════════════════════════════════════════════════════════════════════════
function TestimonialsSection() {
  const titleRef = useReveal<HTMLDivElement>();
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = cardsRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = Array.from(container.children) as HTMLElement[];
    const xOffsets = [-60, 0, 60];
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.from(card, {
          x: xOffsets[i] ?? 0,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: { trigger: container, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  const testimonials = [
    { stars: 5, quote: '+4 points de marge en 3 mois. Les fiches techniques automatiques nous ont tout changé. Avant on calculait à la main sur des Post-it, maintenant tout est précis au centime près.', initials: 'LD', name: 'Laurent Dubois', role: 'Chef propriétaire', restaurant: 'Le Jardin des Saveurs, Lyon' },
    { stars: 5, quote: "On a réduit notre food cost de 34 % à 27 % en 2 mois. L'IA qui crée les fiches techniques en 10 secondes, c'est un vrai gain de temps. Mon équipe ne peut plus s'en passer.", initials: 'SM', name: 'Sophie Martin', role: 'Directrice', restaurant: 'Brasserie Le Comptoir, Paris' },
    { stars: 5, quote: "Chaque centime compte en food truck. Les alertes sur les prix fournisseurs m'ont fait économiser 800 € le premier mois. L'app est simple, rapide, parfaite pour le terrain.", initials: 'KB', name: 'Karim Benali', role: 'Gérant', restaurant: 'Street Flavors, Bordeaux' },
  ];
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-12">
          <div className="flex justify-center"><SectionNumber n="06" label="Témoignages" /></div>
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight" style={{ color: TEXT }}>
            Ils ont <span style={{ color: ACCENT }}>transformé</span>
            <br />
            leurs marges
          </h2>
          <p className="mt-4 text-lg" style={{ color: TEXT_MUTED }}>
            Des restaurateurs comme vous partagent leur expérience.
          </p>
        </div>
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-3xl p-7 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              style={{ border: `1px solid ${BORDER}` }}
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#0F172A' }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: TEXT }}>"{t.quote}"</p>
              <div className="pt-5 mt-auto flex items-center gap-3" style={{ borderTop: `1px solid ${BORDER}` }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: ACCENT_BG, color: ACCENT_DARK }}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: TEXT }}>{t.name}</div>
                  <div className="text-xs" style={{ color: TEXT_MUTED }}>{t.role}</div>
                  <div className="text-xs" style={{ color: TEXT_MUTED }}>{t.restaurant}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 07 — TUTORIELS ANIMÉS — 5 mockups TSX réalistes des écrans de l'app
// ═══════════════════════════════════════════════════════════════════════════

function MockupBalance() {
  const [weight, setWeight] = useState(0);
  useEffect(() => {
    const obj = { v: 0 };
    const tw = gsap.to(obj, { v: 156, duration: 1.4, ease: 'power2.out', onUpdate: () => setWeight(Math.round(obj.v)) });
    return () => { tw.kill(); };
  }, []);
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: TEXT_MUTED }}>Pesage en cours</div>
          <h4 className="text-base font-bold mt-0.5" style={{ color: TEXT }}>Bowl Saumon · Tomate</h4>
        </div>
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5" style={{ background: ACCENT_BG, color: ACCENT_DARK }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
          Connectée
        </span>
      </div>
      <div className="rounded-2xl p-6 mb-4 text-center" style={{ background: '#0F172A' }}>
        <div className="text-xs uppercase tracking-widest font-semibold text-white/50 mb-2">Poids actuel</div>
        <div className="text-6xl font-extrabold tabular-nums font-mono" style={{ color: ACCENT }}>
          {weight}<span className="text-2xl ml-2 text-white/60">g</span>
        </div>
        <div className="text-xs text-white/40 mt-2 font-mono">Cible: 150g · Tolérance ±5g</div>
        <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden mx-8">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (weight / 156) * 100)}%`, background: ACCENT }} />
        </div>
      </div>
      <div className="space-y-2">
        {[
          { name: 'Saumon', weight: '120g', cost: '2.45€', done: true },
          { name: 'Avocat', weight: '80g', cost: '1.10€', done: true },
          { name: 'Tomate', weight: weight + 'g', cost: '—', current: true },
          { name: 'Riz basmati', weight: '150g', cost: '0.35€' },
        ].map((it, i) => (
          <div key={i} className="rounded-xl px-4 py-2.5 flex items-center justify-between text-sm" style={{ background: it.current ? ACCENT_BG : '#F8FAFC', border: `1px solid ${it.current ? ACCENT_LIGHT : BORDER}` }}>
            <div className="flex items-center gap-3">
              {it.done ? <Check className="w-4 h-4" style={{ color: ACCENT }} /> : it.current ? <span className="w-3 h-3 rounded-full animate-pulse" style={{ background: ACCENT }} /> : <span className="w-3 h-3 rounded-full" style={{ background: BORDER }} />}
              <span style={{ color: TEXT, fontWeight: it.current ? 700 : 500 }}>{it.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono" style={{ color: it.current ? ACCENT_DARK : TEXT_MUTED }}>{it.weight}</span>
              <span className="text-xs font-mono font-semibold" style={{ color: it.cost === '—' ? TEXT_MUTED : ACCENT_DARK }}>{it.cost}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function MockupCommandes() {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: TEXT_MUTED }}>Commandes du jour</div>
          <h4 className="text-base font-bold mt-0.5" style={{ color: TEXT }}>3 fournisseurs · 12 produits</h4>
        </div>
        <button type="button" className="px-4 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-1.5" style={{ background: ACCENT }}>
          <Send className="w-3.5 h-3.5" />Envoyer tout
        </button>
      </div>
      {[
        { name: 'Métro Lyon', items: 5, total: '127.40€', status: 'Suggéré par IA', icon: 'M', color: '#F59E0B' },
        { name: 'Pêcheur du Nord', items: 3, total: '218.70€', status: 'WhatsApp prêt', icon: 'P', color: '#3B82F6' },
        { name: 'Sysco France', items: 4, total: '94.20€', status: 'Email envoyé', icon: 'S', color: ACCENT, sent: true },
      ].map((sup, i) => (
        <div key={i} className="rounded-xl p-3 mb-2 flex items-center gap-3" style={{ background: '#F8FAFC', border: `1px solid ${BORDER}` }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: sup.color }}>{sup.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold" style={{ color: TEXT }}>{sup.name}</div>
            <div className="text-xs flex items-center gap-2" style={{ color: TEXT_MUTED }}>
              <span>{sup.items} produits</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                {sup.sent && <Check className="w-3 h-3" style={{ color: ACCENT }} />}
                {sup.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold tabular-nums" style={{ color: TEXT }}>{sup.total}</div>
            <div className="text-xs" style={{ color: TEXT_MUTED }}>HT</div>
          </div>
        </div>
      ))}
      <div className="mt-4 rounded-xl p-3 flex items-center gap-2" style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_LIGHT}` }}>
        <Sparkles className="w-4 h-4 shrink-0" style={{ color: ACCENT_DARK }} />
        <p className="text-xs" style={{ color: ACCENT_DARK }}>
          <strong>L'IA suggère</strong> de regrouper Métro + Sysco → économie estimée 24€
        </p>
      </div>
    </>
  );
}

function MockupIA() {
  const messages = [
    { who: 'user', text: "Crée une fiche pour bowl saumon 4 portions" },
    { who: 'ia', text: "Bowl Saumon créé · Food cost 27.3% · Marge 72.7% · 4 allergènes (poisson, gluten, lait, sésame). Voulez-vous l'enregistrer ?" },
    { who: 'user', text: "Oui, et propose 2 variantes vegan" },
  ];
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: ACCENT_BG, color: ACCENT_DARK }}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold" style={{ color: TEXT }}>Assistant IA</h4>
            <div className="text-xs flex items-center gap-1.5" style={{ color: ACCENT_DARK }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
              En ligne · 19 actions disponibles
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.who === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="rounded-2xl px-4 py-2.5 max-w-[80%] text-sm" style={{
              background: m.who === 'user' ? ACCENT : '#F1F5F9',
              color: m.who === 'user' ? 'white' : TEXT,
              borderTopRightRadius: m.who === 'user' ? 4 : undefined,
              borderTopLeftRadius: m.who === 'ia' ? 4 : undefined,
            }}>
              {m.text}
            </div>
          </div>
        ))}
        <div className="flex justify-start">
          <div className="rounded-2xl px-4 py-3 inline-flex gap-1" style={{ background: '#F1F5F9' }}>
            {[0, 1, 2].map(i => (
              <span key={i} className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TEXT_MUTED, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: '#F8FAFC', border: `1px solid ${BORDER}` }}>
        <Sparkles className="w-4 h-4 shrink-0" style={{ color: ACCENT }} />
        <input type="text" disabled placeholder="Posez votre question..." className="flex-1 bg-transparent text-sm outline-none" style={{ color: TEXT_MUTED }} />
        <button type="button" className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: ACCENT }}>Envoyer</button>
      </div>
    </>
  );
}

function MockupMessages() {
  const notifs = [
    { icon: '⚠', title: 'Hausse prix · Tomate', desc: 'Métro +12% (1.40€ → 1.57€/kg). Impact: -0.3 pt marge sur 4 plats.', time: '2 min', accent: '#EF4444' },
    { icon: '✓', title: 'Commande livrée', desc: 'Pêcheur du Nord · 218.70€ · Toutes les références conformes.', time: '14 min', accent: ACCENT },
    { icon: '⊙', title: 'Plat le plus rentable', desc: 'Bowl Saumon · marge 72.7% · 18 ventes cette semaine.', time: '1h', accent: '#3B82F6' },
    { icon: '☆', title: 'Suggestion IA', desc: 'Augmentez "Tartare bœuf" de 1€ pour récupérer la marge perdue.', time: '2h', accent: ACCENT_DARK },
  ];
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: TEXT_MUTED }}>Notifications</div>
          <h4 className="text-base font-bold mt-0.5" style={{ color: TEXT }}>4 nouvelles · Aujourd'hui</h4>
        </div>
        <button type="button" className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: '#F5F5F5', color: TEXT }}>
          Tout marquer lu
        </button>
      </div>
      <div className="space-y-2">
        {notifs.map((n, i) => (
          <div key={i} className="rounded-xl p-3 flex items-start gap-3" style={{ background: '#F8FAFC', border: `1px solid ${BORDER}` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0" style={{ background: n.accent + '22', color: n.accent }}>
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold truncate" style={{ color: TEXT }}>{n.title}</div>
                <span className="text-xs shrink-0" style={{ color: TEXT_MUTED }}>il y a {n.time}</span>
              </div>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: TEXT_MUTED }}>{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function MockupActualites() {
  const news = [
    { tag: 'Marché', tagColor: '#3B82F6', title: 'Saumon norvégien : prix à la baisse cette semaine', summary: '-8% vs semaine dernière. Bonne fenêtre pour stocker.', date: "Aujourd'hui" },
    { tag: 'Réglementation', tagColor: '#F59E0B', title: 'Nouvel arrêté traçabilité viande bovine 2026', summary: 'Effet 1er juin. RestauMargin met à jour HACCP automatiquement.', date: 'Hier' },
    { tag: 'Tendance', tagColor: ACCENT, title: 'Le bowl asiatique en tête des recherches Google', summary: '+34% en 30 jours. Pensez à mettre en avant votre offre.', date: '2 jours' },
  ];
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: ACCENT_BG, color: ACCENT_DARK }}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold" style={{ color: TEXT }}>Actualités IA</h4>
            <div className="text-xs" style={{ color: TEXT_MUTED }}>Curated pour votre restaurant · Daily</div>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: ACCENT_BG, color: ACCENT_DARK }}>3 nouveautés</span>
      </div>
      <div className="space-y-3">
        {news.map((n, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: '#F8FAFC', border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-bold" style={{ background: n.tagColor + '22', color: n.tagColor }}>{n.tag}</span>
              <span className="text-xs" style={{ color: TEXT_MUTED }}>{n.date}</span>
            </div>
            <h5 className="text-sm font-bold mb-1" style={{ color: TEXT }}>{n.title}</h5>
            <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>{n.summary}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function TutorialsSection() {
  const ref = useReveal<HTMLDivElement>();
  const [activeIdx, setActiveIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  const tutorials = [
    { icon: Scale, title: 'Balance connectée', desc: 'Pesez vos ingrédients en temps réel.', mockup: MockupBalance, slug: 'weigh' },
    { icon: Truck, title: 'Commandes fournisseurs', desc: "L'IA suggère, vous envoyez en 1 clic.", mockup: MockupCommandes, slug: 'commandes' },
    { icon: Sparkles, title: 'Assistant IA', desc: '19 actions disponibles pour piloter votre cuisine.', mockup: MockupIA, slug: 'assistant-ia' },
    { icon: Send, title: 'Messages & alertes', desc: 'Hausse prix, livraisons, suggestions IA.', mockup: MockupMessages, slug: 'messages' },
    { icon: ClipboardList, title: 'Actualités IA', desc: 'Veille marché, réglementation, tendances.', mockup: MockupActualites, slug: 'actualites-ia' },
  ];

  const currentSlug = `app.restaumargin.fr/${tutorials[activeIdx].slug}`;
  const typedSlug = useTypingEffect(currentSlug, prevIdx !== null, 35);
  const displayedSlug = prevIdx !== null ? typedSlug : currentSlug;

  const switchTo = useCallback((i: number) => {
    setPrevIdx(activeIdx);
    setActiveIdx(i);
  }, [activeIdx]);

  // Fade+scale transition on mockup switch
  useEffect(() => {
    const el = mockupRef.current;
    if (!el || prevIdx === null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(el, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
  }, [activeIdx, prevIdx]);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => switchTo((activeIdx + 1) % tutorials.length), 5000);
    return () => clearInterval(id);
  }, [autoplay, activeIdx, switchTo, tutorials.length]);

  const ActiveMockup = tutorials[activeIdx].mockup;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#FAFAFA' }}>
      <div ref={ref} className="max-w-7xl mx-auto">
        <SectionNumber n="07" label="Tutoriels animés" />
        <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight" style={{ color: TEXT }}>
          Voyez le produit <span style={{ color: ACCENT }}>en action</span>
        </h2>
        <p className="mt-4 text-lg" style={{ color: TEXT_MUTED }}>
          Cinq scénarios animés directement dans l'application.
        </p>
        <div className="mt-12 grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
          <div className="rounded-3xl bg-[#0F172A] p-3 shadow-2xl relative overflow-hidden aspect-[3/4] sm:aspect-[4/3]">
            <div className="rounded-2xl bg-white h-full flex flex-col overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ background: '#FAFAFA', borderColor: BORDER }}>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="ml-3 flex-1 max-w-md text-center text-xs px-3 py-1 rounded-md font-mono" style={{ background: 'white', border: `1px solid ${BORDER}`, color: TEXT_MUTED }}>
                  {displayedSlug}
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: TEXT_MUTED }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: ACCENT }} />
                  Live
                </div>
              </div>
              {/* Mockup content with fade+scale transition */}
              <div ref={mockupRef} className="flex-1 p-5 overflow-hidden">
                <ActiveMockup />
              </div>
            </div>
            {/* Progress bar + controls */}
            <div className="absolute bottom-1 left-1 right-1 px-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAutoplay((a) => !a)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label={autoplay ? 'Mettre en pause' : 'Lancer la lecture'}
              >
                {autoplay ? <span className="block w-2 h-2.5 border-l-2 border-r-2 border-white" /> : <Play className="w-3 h-3 ml-0.5" />}
              </button>
              <div className="flex-1 flex gap-1.5">
                {tutorials.map((_, i) => (
                  <div key={i} className="flex-1 h-1 rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: i < activeIdx ? '100%' : i === activeIdx ? (autoplay ? '100%' : '50%') : '0%',
                        background: ACCENT,
                        transition: i === activeIdx && autoplay ? 'width 5s linear' : 'width 0.4s ease',
                      }}
                    />
                  </div>
                ))}
              </div>
              <span className="text-xs text-white/60 font-mono">{activeIdx + 1}/{tutorials.length}</span>
            </div>
          </div>

          <div className="space-y-3">
            {tutorials.map((tut, i) => {
              const Icon = tut.icon;
              const active = i === activeIdx;
              return (
                <button
                  key={tut.title}
                  type="button"
                  onClick={() => { switchTo(i); setAutoplay(false); }}
                  className="w-full text-left rounded-2xl p-4 bg-white transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    border: `2px solid ${active ? ACCENT : BORDER}`,
                    boxShadow: active ? `0 8px 24px ${ACCENT}1A` : 'none',
                    '--tw-ring-color': ACCENT,
                  } as React.CSSProperties}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200" style={{ background: active ? ACCENT : '#F5F5F5', color: active ? 'white' : TEXT }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold" style={{ color: TEXT }}>{tut.title}</div>
                      <div className="text-xs mt-0.5 leading-snug" style={{ color: TEXT_MUTED }}>{tut.desc}</div>
                    </div>
                  </div>
                </button>
              );
            })}
            <Link
              to="/login?mode=register"
              className="block text-center px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg mt-4 transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`, boxShadow: `0 12px 30px ${ACCENT}40`, '--tw-ring-color': ACCENT } as React.CSSProperties}
            >Essayer maintenant <ArrowRight className="inline w-4 h-4 ml-1" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 08 — TRUST BADGES
// ═══════════════════════════════════════════════════════════════════════════
function TrustBadgesSection() {
  const titleRef = useReveal<HTMLDivElement>();
  const badgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = badgesRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = Array.from(container.children) as HTMLElement[];
    const ctx = gsap.context(() => {
      gsap.from(items, {
        x: -40,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: container, start: 'top 85%', toggleActions: 'play none none none' },
      });
    });
    return () => ctx.revert();
  }, []);

  const badges = [
    { icon: ShieldCheck, title: 'Données sécurisées', sub: 'Chiffrement SSL/TLS' },
    { icon: MapPin, title: 'Made in France', sub: 'Hébergé en Europe' },
    { icon: Headphones, title: 'Support 7j/7', sub: 'Réponse sous 24h' },
    { icon: FileCheck, title: 'RGPD Conforme', sub: 'Vos données vous appartiennent' },
    { icon: CreditCard, title: 'Essai sans CB', sub: '7 jours gratuits' },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef}>
          <SectionNumber n="08" label="Confiance & sécurité" />
        </div>
        <div ref={badgesRef} className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="text-center group">
                <div
                  className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:rotate-[15deg]"
                  style={{ background: ACCENT_BG, color: ACCENT_DARK }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold" style={{ color: TEXT }}>{b.title}</p>
                <p className="text-xs mt-1" style={{ color: TEXT_MUTED }}>{b.sub}</p>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs mt-10" style={{ color: TEXT_MUTED }}>
          Votre sécurité est notre priorité. Aucune donnée sensible n'est stockée sans votre consentement.
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 09 — CTA FINAL
// ═══════════════════════════════════════════════════════════════════════════
function FinalCtaSection() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: 'white' }}>
      {/* Animated gradient mesh */}
      <div
        className="absolute inset-0 -z-10 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, ${ACCENT_BG} 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, ${ACCENT_BG} 0%, transparent 60%)`,
          animation: 'gradientDrift 8s ease-in-out infinite alternate',
        }}
      />
      <div ref={ref} className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
        <div>
          <SectionNumber n="09" label="Prêt à augmenter vos marges ?" />
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight" style={{ color: TEXT }}>
            Prêt à <span style={{ color: ACCENT }}>augmenter</span>
            <br />
            vos marges ?
          </h2>
          <p className="mt-4 text-lg" style={{ color: TEXT_MUTED }}>Essayez gratuitement pendant 7 jours.</p>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-white font-bold text-base shadow-lg mt-8 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
              boxShadow: `0 12px 30px ${ACCENT}40`,
              animation: 'ctaGlow 2.5s ease-in-out infinite',
              '--tw-ring-color': ACCENT,
            } as React.CSSProperties}
          >
            Commencer gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-3 text-xs flex items-center gap-2" style={{ color: TEXT_MUTED }}>
            <Check className="w-3.5 h-3.5" style={{ color: ACCENT }} />
            Sans engagement.
            <Check className="w-3.5 h-3.5 ml-2" style={{ color: ACCENT }} />
            Annulez quand vous voulez.
          </p>
        </div>
        <div>
          <div className="rounded-3xl p-6 bg-white shadow-2xl" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2 mb-3">
              <Tablet className="w-4 h-4" style={{ color: TEXT_MUTED }} />
              <span className="text-sm font-bold" style={{ color: TEXT }}>Vue d'ensemble</span>
            </div>
            <div className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: TEXT_MUTED }}>Économies ce mois</div>
            <div className="text-4xl font-extrabold tabular-nums mb-2" style={{ color: ACCENT_DARK }}>
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(479)}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold mb-5" style={{ color: ACCENT_DARK }}>
              ↗ +12 % <span className="font-normal" style={{ color: TEXT_MUTED }}>vs mois dernier</span>
            </div>
            <svg viewBox="0 0 240 80" className="w-full mb-5" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g09" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,55 Q40,50 60,42 T120,36 T180,22 T240,8 L240,80 L0,80 Z" fill="url(#g09)" />
              <path d="M0,55 Q40,50 60,42 T120,36 T180,22 T240,8" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3" style={{ background: '#F8FAFC' }}>
                <div className="text-xs font-semibold" style={{ color: TEXT_MUTED }}>Marge moyenne</div>
                <div className="text-2xl font-extrabold mt-1 tabular-nums" style={{ color: TEXT }}>4,8 %</div>
                <div className="text-xs font-semibold mt-0.5" style={{ color: ACCENT_DARK }}>+0,0 %</div>
              </div>
              <div className="rounded-xl p-3" style={{ background: '#F8FAFC' }}>
                <div className="text-xs font-semibold" style={{ color: TEXT_MUTED }}>Food cost moyen</div>
                <div className="text-2xl font-extrabold mt-1 tabular-nums" style={{ color: TEXT }}>27,4 %</div>
                <div className="text-xs font-semibold mt-0.5" style={{ color: ACCENT_DARK }}>-2,1 %</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NEWSLETTER — light theme variant
// ═══════════════════════════════════════════════════════════════════════════
function NewsletterSection() {
  const ref = useReveal<HTMLDivElement>();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Echec de l'inscription. Reessayez.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div ref={ref} className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: TEXT }}>
          Restez informé
        </h2>
        <p className="mt-3 text-base" style={{ color: TEXT_MUTED }}>
          Recevez nos conseils marge, actualités fournisseurs et mises à jour produit.
        </p>

        {sent ? (
          <div className="mt-8 rounded-2xl p-8" style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_LIGHT}` }}>
            <Check className="w-10 h-10 mx-auto mb-3" style={{ color: ACCENT_DARK }} strokeWidth={3} />
            <p className="text-lg font-semibold" style={{ color: TEXT }}>Merci !</p>
            <p className="text-sm mt-1" style={{ color: TEXT_MUTED }}>Vous recevrez nos actualités restaurant.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="flex-1 min-w-0 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ background: 'white', border: `1px solid ${BORDER}`, color: TEXT, '--tw-ring-color': ACCENT } as React.CSSProperties}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`, boxShadow: `0 8px 20px ${ACCENT}40` }}
              >
                {loading ? '...' : "S'inscrire"}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <p className="text-xs mt-3" style={{ color: TEXT_MUTED }}>Pas de spam. Désinscription en un clic.</p>
          </form>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT — "Parlons de votre projet" form, light variant
// ═══════════════════════════════════════════════════════════════════════════
function ContactSection() {
  const ref = useReveal<HTMLDivElement>();
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Echec de l'envoi. Réessayez.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = 'w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-offset-1';
  const fieldStyle = {
    background: 'white',
    border: `1px solid ${BORDER}`,
    color: TEXT,
    '--tw-ring-color': ACCENT,
  } as React.CSSProperties;

  return (
    <section id="contact" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ background: '#FAFAFA' }}>
      <div ref={ref} className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: TEXT_MUTED }}>Contact</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: TEXT }}>
            Parlons de votre projet
          </h2>
          <p className="mt-3" style={{ color: TEXT_MUTED }}>Notre équipe vous recontacte sous 24 h.</p>
        </div>

        {sent ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_LIGHT}` }}>
            <Check className="w-12 h-12 mx-auto mb-4" style={{ color: ACCENT_DARK }} strokeWidth={3} />
            <p className="text-lg font-semibold" style={{ color: TEXT }}>Demande envoyée !</p>
            <p className="text-sm mt-1" style={{ color: TEXT_MUTED }}>Nous vous recontactons très vite.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-2xl p-6 sm:p-8 space-y-5 bg-white" style={{ border: `1px solid ${BORDER}` }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: TEXT }}>Nom</label>
                <input
                  type="text"
                  required
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className={fieldClass}
                  style={fieldStyle}
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: TEXT }}>Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={fieldClass}
                  style={fieldStyle}
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: TEXT }}>Téléphone</label>
              <input
                type="tel"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                className={fieldClass}
                style={fieldStyle}
                placeholder="06 12 34 56 78"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: TEXT }}>Message</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${fieldClass} resize-none`}
                style={fieldStyle}
                placeholder="Décrivez votre besoin..."
              />
            </div>
            {error && (
              <div className="rounded-lg p-3 text-sm" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`, boxShadow: `0 12px 30px ${ACCENT}40` }}
            >
              {loading ? 'Envoi en cours...' : <>Envoyer <Send className="w-4 h-4" /></>}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white/70 py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: ACCENT_BG }}>
              <ChefHat className="w-5 h-5" style={{ color: ACCENT_DARK }} />
            </div>
            <span className="text-xl font-extrabold text-white">RestauMargin</span>
          </div>
          <p className="text-sm text-white/50">Le logiciel de marges pensé pour les restaurateurs français.</p>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
            <span className="text-white/60">Serveurs opérationnels</span>
          </div>
        </div>
        <div>
          <p className="text-white font-bold text-sm uppercase tracking-wider mb-4">Produit</p>
          <ul className="space-y-2 text-sm">
            <li><a href="#fonctionnalites" className="hover:text-white">Fonctionnalités</a></li>
            <li><a href="#tarifs" className="hover:text-white">Tarifs</a></li>
            <li><a href="#temoignages" className="hover:text-white">Témoignages</a></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-bold text-sm uppercase tracking-wider mb-4">Ressources</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/outils/calculateur-food-cost" className="hover:text-white">Calculateur food cost</Link></li>
            <li><Link to="/outils/generateur-qr-menu" className="hover:text-white">Générateur QR menu</Link></li>
            <li><a href="#contact" className="hover:text-white">Réserver une démo</a></li>
            <li><Link to="/launch" className="hover:text-white inline-flex items-center gap-1.5">🚀 Launch Product Hunt</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-bold text-sm uppercase tracking-wider mb-4">Légal</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/cgu" className="hover:text-white">CGU</Link></li>
            <li><Link to="/politique-confidentialite" className="hover:text-white">Politique de confidentialité</Link></li>
            <li><a href="mailto:contact@restaumargin.fr" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-white/40">© {new Date().getFullYear()} RestauMargin · Hébergé en Europe · RGPD</p>
        <p className="text-xs text-white/40">Made with care in France 🇫🇷</p>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVBAR + WIDGETS
// ═══════════════════════════════════════════════════════════════════════════
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav
      className="sticky top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? `1px solid ${BORDER}` : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: ACCENT_BG }}>
            <ChefHat className="w-5 h-5" style={{ color: ACCENT_DARK }} />
          </div>
          <span className="text-xl font-extrabold" style={{ color: TEXT }}>RestauMargin</span>
        </Link>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium" style={{ color: TEXT_MUTED }}>
          <a href="#fonctionnalites" className="hover:text-[#0F172A] transition-colors">Fonctionnalités</a>
          <a href="#tarifs" className="hover:text-[#0F172A] transition-colors">Tarifs</a>
          <a href="#temoignages" className="hover:text-[#0F172A] transition-colors">Témoignages</a>
          <Link to="/blog" className="hover:text-[#0F172A] transition-colors">Blog</Link>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold transition-colors hover:text-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md px-2 py-1"
            style={{ color: TEXT, '--tw-ring-color': ACCENT } as React.CSSProperties}
          >Se connecter</Link>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-white font-semibold text-sm shadow-md transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`, '--tw-ring-color': ACCENT } as React.CSSProperties}
          >
            Essai 7 jours <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <button type="button" onClick={() => setOpen((o) => !o)} className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" style={{ '--tw-ring-color': ACCENT } as React.CSSProperties} aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}>
          {open ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-white border-t border-[#E5E7EB] px-6 py-6 space-y-4 text-base font-medium">
          <a href="#fonctionnalites" className="block py-2" onClick={() => setOpen(false)}>Fonctionnalités</a>
          <a href="#tarifs" className="block py-2" onClick={() => setOpen(false)}>Tarifs</a>
          <a href="#temoignages" className="block py-2" onClick={() => setOpen(false)}>Témoignages</a>
          <Link to="/blog" className="block py-2" onClick={() => setOpen(false)}>Blog</Link>
          <hr className="border-[#E5E7EB]" />
          <Link to="/login" className="block py-2" onClick={() => setOpen(false)}>Se connecter</Link>
          <Link to="/login?mode=register" className="block text-center px-5 py-3 rounded-xl text-white font-semibold shadow-md" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }} onClick={() => setOpen(false)}>
            Essai 7 jours
          </Link>
        </div>
      )}
    </nav>
  );
}

/**
 * Sticky banner top "Coming soon on Product Hunt".
 * Drives traffic vers /launch pour capturer les emails early supporters.
 * Dismissible via localStorage (réapparait après 7 jours).
 */
function PHLaunchBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const dismissed = localStorage.getItem('ph_banner_dismissed_at');
    if (dismissed) {
      const age = Date.now() - parseInt(dismissed, 10);
      if (age < 7 * 24 * 60 * 60 * 1000) return; // 7 jours
    }
    setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('ph_banner_dismissed_at', String(Date.now()));
    setShow(false);
  };

  if (!show) return null;
  return (
    <div className="fixed top-0 inset-x-0 z-[55] bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <Link to="/launch" className="flex-1 flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-xs font-bold uppercase tracking-wider">
            🚀 Bientôt
          </span>
          <span className="text-sm sm:text-base font-semibold">
            <span className="sm:hidden">🚀 </span>
            On lance sur <strong className="font-extrabold">Product Hunt le 6 mai</strong>
            <span className="hidden sm:inline"> — sois prévenu·e jour-J</span>
          </span>
          <span className="ml-auto text-sm font-bold opacity-90 hover:opacity-100 underline-offset-2 hover:underline">
            En savoir plus →
          </span>
        </Link>
        <button
          onClick={dismiss}
          className="p-1 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Fermer la bannière"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ScrollProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setP(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="fixed top-0 left-0 z-[60] h-[3px] transition-[width] duration-100" style={{ width: `${p}%`, background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />;
}

function StickyCtaBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className={`lg:hidden fixed bottom-4 inset-x-4 z-40 transition-transform duration-300 ${show ? 'translate-y-0' : 'translate-y-32'}`}>
      <Link
        to="/login?mode=register"
        className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-white font-bold shadow-2xl active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
          boxShadow: `0 10px 30px ${ACCENT}66`,
          '--tw-ring-color': ACCENT,
          animation: show ? 'ctaGlow 2.5s ease-in-out infinite' : 'none',
        } as React.CSSProperties}
      >
        Essai gratuit 7 jours <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const fired = useRef(false);
  const [couverts, setCouverts] = useState(80);
  const [prix, setPrix] = useState(18);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('exit_d') === '1') return;
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !fired.current) {
        fired.current = true;
        setShow(true);
      }
    };
    document.addEventListener('mouseleave', onLeave);
    return () => document.removeEventListener('mouseleave', onLeave);
  }, []);
  const close = () => { setShow(false); sessionStorage.setItem('exit_d', '1'); };
  if (!show) return null;
  const savings = Math.round(couverts * prix * 30 * 0.04);
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 relative">
        <button type="button" onClick={close} className="absolute top-3 right-3 inline-flex items-center justify-center w-11 h-11 hover:bg-[#F1F5F9] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" style={{ '--tw-ring-color': ACCENT } as React.CSSProperties} aria-label="Fermer">
          <X className="w-5 h-5" />
        </button>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: ACCENT_BG, color: ACCENT_DARK }}>
          <Calculator className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-extrabold mb-2" style={{ color: TEXT }}>Avant de partir...</h3>
        <p className="text-sm mb-6" style={{ color: TEXT_MUTED }}>Estimez ce que vous pourriez économiser :</p>
        <div className="space-y-4 mb-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
              Couverts/jour : <span style={{ color: TEXT }}>{couverts}</span>
            </label>
            <input type="range" min={20} max={300} value={couverts} onChange={(e) => setCouverts(parseInt(e.target.value))} className="w-full mt-1" style={{ accentColor: ACCENT }} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: TEXT_MUTED }}>
              Prix moyen : <span style={{ color: TEXT }}>{prix}€</span>
            </label>
            <input type="range" min={8} max={45} value={prix} onChange={(e) => setPrix(parseInt(e.target.value))} className="w-full mt-1" style={{ accentColor: ACCENT }} />
          </div>
        </div>
        <div className="rounded-2xl p-4 mb-5" style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_LIGHT}` }}>
          <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: ACCENT_DARK }}>Économies / mois</p>
          <p className="text-3xl font-extrabold mt-1 tabular-nums" style={{ color: TEXT }}>{savings.toLocaleString('fr-FR')} €</p>
        </div>
        <Link to="/login?mode=register" className="block w-full text-center px-6 py-3.5 rounded-xl text-white font-bold shadow-lg transition-transform hover:scale-[1.02]" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}>
          Démarrer l'essai gratuit
        </Link>
      </div>
    </div>
  );
}

function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr', logo: 'https://www.restaumargin.fr/og-image.png' },
      { '@type': 'SoftwareApplication', name: 'RestauMargin', applicationCategory: 'BusinessApplication', operatingSystem: 'Web, iOS, Android', offers: { '@type': 'Offer', price: '29', priceCurrency: 'EUR' }, aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '150' } },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL KEYFRAMES (injected once per page)
// ═══════════════════════════════════════════════════════════════════════════
const LANDING_STYLES = `
  @keyframes gradientDrift {
    0%   { background-position: 20% 50%; }
    100% { background-position: 80% 50%; }
  }
  @keyframes ctaGlow {
    0%, 100% { box-shadow: 0 12px 30px rgba(16,185,129,0.25); }
    50%       { box-shadow: 0 12px 40px rgba(16,185,129,0.50); }
  }
  @keyframes badgePulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.75; }
  }
  .animate-pulse-badge { animation: badgePulse 2s ease-in-out infinite; }
  @keyframes floatY {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
  }
  @keyframes waveBar {
    0%   { transform: scaleY(0.4); }
    100% { transform: scaleY(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    .animate-pulse-badge,
    [style*="ctaGlow"],
    [style*="gradientDrift"] {
      animation: none !important;
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// BROWSER FRAME — Safari-style chrome wrapping the entire site (desktop only)
// On mobile: the wrapper degrades to a flat white background, no frame.
// ═══════════════════════════════════════════════════════════════════════════
function BrowserChrome() {
  return (
    <div
      className="hidden lg:flex items-center gap-2 px-5 py-3 border-b"
      style={{ background: '#F8FAFC', borderColor: BORDER }}
    >
      <div className="flex gap-1.5">
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
      </div>
      <div
        className="flex-1 max-w-md mx-auto text-center text-xs px-4 py-1.5 rounded-md font-mono flex items-center justify-center gap-2"
        style={{ background: 'white', border: `1px solid ${BORDER}`, color: TEXT_MUTED }}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        restaumargin.fr
      </div>
      <div className="w-12" aria-hidden />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function Landing() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: LANDING_STYLES }} />
      <SEOHead
        title="RestauMargin — Logiciel calcul marge restaurant + food cost"
        description="Calculez votre marge restaurant et food cost en temps réel. Logiciel + IA + fiches techniques + commandes fournisseurs. Essai gratuit 7 jours sans CB."
        path="/"
      />
      <StructuredData />
      <ScrollProgressBar />
      <PHLaunchBanner />

      {/* Animated paper-fold green WebGL2 wallpaper — fixed full-page, sits behind everything.
          Visible on the sides and corners outside of the centred browser frame on lg+ viewports. */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <ShaderBackground intensity={0.4} />
      </div>

      {/* Site shell — on lg+, max-w 1500 with browser frame; on mobile, full width white. */}
      <div className="relative lg:max-w-[1500px] lg:mx-auto lg:px-6 xl:px-12 lg:py-8">
        <div
          className="relative bg-white lg:rounded-3xl lg:overflow-hidden lg:border"
          style={{
            borderColor: BORDER,
            boxShadow: '0 50px 120px -20px rgba(15, 23, 42, 0.18), 0 20px 50px -20px rgba(15, 23, 42, 0.10)',
          }}
        >
          <BrowserChrome />
          <Navbar />
          <main className="bg-white overflow-x-hidden">
            <HeroSection />
            <RoiCalculatorSection />
            <section id="tarifs"><PricingSection /></section>
            <section id="fonctionnalites"><FeaturesSection /></section>
            <ProcessSection />
            <section id="temoignages"><TestimonialsSection /></section>
            <TutorialsSection />
            <TrustBadgesSection />
            <FinalCtaSection />
            <NewsletterSection />
            <ContactSection />
          </main>
          <Footer />
        </div>
      </div>

      <StickyCtaBar />
      <ExitIntentPopup />
    </>
  );
}
