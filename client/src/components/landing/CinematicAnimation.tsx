/**
 * @file client/src/components/landing/CinematicAnimation.tsx
 * 60-second procedural "cinematic video" — pure HTML/CSS/SVG + GSAP timeline.
 * No MP4, no Kling, no Cloudflare Stream. Looks like a video, runs in code.
 *
 * Six scenes, 10 seconds each, choreographed via GSAP timeline:
 *   1. KITCHEN     — top-down ingredients falling onto a counter
 *   2. WEIGH       — tomato lands on a digital scale, gram counter spins
 *   3. DASHBOARD   — tablet UI fills with food cost bars and a 27.3% reveal
 *   4. AI VOCAL    — mic pulses, recipe card materialises with typing effect
 *   5. PROFITS     — ascending bars, gold particles, floating "+7pts +3K€ +35h"
 *   6. CTA         — logo lock-up, button pulses, tagline types in
 *
 * Total bundle impact ~15 KB (inline SVG + a few CSS keyframes).
 * GSAP is already loaded by ScrollCinematic, so no additional cost.
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  ChefHat,
  Mic,
  Scale,
  TabletSmartphone,
  TrendingUp,
} from 'lucide-react';
import gsap from 'gsap';

const ACCENT = '#10B981';
const ACCENT_DARK = '#047857';
const ACCENT_LIGHT = '#6EE7B7';
const SCENE_DURATION = 10; // seconds
const TOTAL_DURATION = SCENE_DURATION * 6; // 60s

const SCENES = [
  { id: 1, title: 'En cuisine', subtitle: 'Vos ingrédients, organisés' },
  { id: 2, title: 'Pesée live', subtitle: 'Au gramme près' },
  { id: 3, title: 'Dashboard', subtitle: 'Vos chiffres en temps réel' },
  { id: 4, title: 'IA cuisine', subtitle: 'Vos fiches en 30 secondes' },
  { id: 5, title: 'Vos marges montent', subtitle: 'Mesurable, jour après jour' },
  { id: 6, title: 'Commencez', subtitle: 'Essai 7 jours, sans CB' },
] as const;

// ───────────────────────────────────────────────────────────────────────────
// Voice-over via Web Speech API — speaks in French during the animation.
// Falls back silently when SpeechSynthesis is unavailable.
// ───────────────────────────────────────────────────────────────────────────
const VOICEOVER_LINES: Array<{ at: number; text: string }> = [
  { at: 0.5, text: "Vous êtes restaurateur. Chaque jour, vos marges fuient sans que vous le sachiez." },
  { at: 10.5, text: 'RestauMargin transforme cette intuition en chiffres précis. Pesez, calculez, optimisez.' },
  { at: 20.5, text: "Votre food cost s'affiche en direct. Plat par plat, ingrédient par ingrédient." },
  { at: 30.5, text: "L'IA crée vos fiches techniques en dix secondes. À la voix, ou par chat." },
  { at: 40.5, text: 'Sept points de food cost récupérés. Trois mille euros par mois. Trente-cinq heures gagnées.' },
  { at: 50.5, text: 'Essai gratuit quatorze jours. Sans carte bancaire.' },
];

function speakLine(text: string) {
  if (typeof window === 'undefined') return;
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR';
  u.rate = 1.05;
  u.pitch = 1.0;
  u.volume = 0.85;
  // Pick a French voice when one is available.
  const voices = window.speechSynthesis.getVoices();
  const fr = voices.find((v) => v.lang.startsWith('fr'));
  if (fr) u.voice = fr;
  window.speechSynthesis.speak(u);
}

export default function CinematicAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0); // 0 → 1
  const [activeScene, setActiveScene] = useState(0);
  const spokenLines = useRef(new Set<number>());

  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;

    // Build the master timeline once. It's paused by default and the user
    // triggers play/pause/seek via the controls below.
    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        const t = tl.time();
        setProgress(t / TOTAL_DURATION);
        const idx = Math.min(5, Math.floor(t / SCENE_DURATION));
        setActiveScene(idx);
        // Trigger voice-over lines at the right time, only once per loop.
        if (!muted) {
          for (const line of VOICEOVER_LINES) {
            if (t >= line.at && !spokenLines.current.has(line.at)) {
              spokenLines.current.add(line.at);
              speakLine(line.text);
            }
          }
        }
      },
      onComplete: () => {
        setPlaying(false);
        spokenLines.current.clear();
      },
    });

    // ── Scene 1 (0-10s) — Kitchen intro ──────────────────────────────────
    tl.from(
      root.querySelectorAll('[data-s1-ingredient]'),
      { y: -200, opacity: 0, rotation: -45, duration: 1.2, stagger: 0.18, ease: 'power3.out' },
      0
    );
    tl.to(root.querySelector('[data-s1-overlay]'), { opacity: 0, duration: 0.8 }, 9);

    // ── Scene 2 (10-20s) — Weigh ────────────────────────────────────────
    tl.fromTo(
      root.querySelector('[data-s2-tomato]'),
      { y: -300, scale: 0.6, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 1.4, ease: 'bounce.out' },
      10
    );
    tl.to(
      root.querySelector('[data-s2-counter]'),
      { innerHTML: 156, duration: 2.2, ease: 'power2.out', snap: { innerHTML: 1 } },
      11
    );
    tl.from(
      root.querySelector('[data-s2-led]'),
      { opacity: 0, scale: 0.8, duration: 0.6 },
      11
    );
    tl.to(root.querySelector('[data-s2-overlay]'), { opacity: 0, duration: 0.8 }, 19);

    // ── Scene 3 (20-30s) — Dashboard ────────────────────────────────────
    tl.from(
      root.querySelectorAll('[data-s3-bar]'),
      { scaleY: 0, transformOrigin: 'bottom', duration: 1.4, stagger: 0.15, ease: 'power3.out' },
      20.5
    );
    tl.to(
      root.querySelector('[data-s3-foodcost]'),
      { innerHTML: 27.3, duration: 2.2, ease: 'power2.out', snap: { innerHTML: 0.1 } },
      21
    );
    tl.to(
      root.querySelector('[data-s3-margin]'),
      { innerHTML: 72.7, duration: 2.2, ease: 'power2.out', snap: { innerHTML: 0.1 } },
      22
    );
    tl.from(root.querySelector('[data-s3-glow]'), { opacity: 0, scale: 0.6, duration: 1 }, 24);
    tl.to(root.querySelector('[data-s3-overlay]'), { opacity: 0, duration: 0.8 }, 29);

    // ── Scene 4 (30-40s) — AI Vocal ─────────────────────────────────────
    tl.from(
      root.querySelectorAll('[data-s4-wave]'),
      { scale: 0, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' },
      30
    );
    tl.from(
      root.querySelector('[data-s4-card]'),
      { y: 80, opacity: 0, scale: 0.85, duration: 1.2, ease: 'power3.out' },
      31
    );
    tl.from(
      root.querySelectorAll('[data-s4-line]'),
      { width: 0, duration: 0.7, stagger: 0.25, ease: 'power2.out' },
      32
    );
    tl.to(root.querySelector('[data-s4-overlay]'), { opacity: 0, duration: 0.8 }, 39);

    // ── Scene 5 (40-50s) — Profits rising ───────────────────────────────
    tl.from(
      root.querySelectorAll('[data-s5-bar]'),
      { height: 0, duration: 1.6, stagger: 0.12, ease: 'power3.out' },
      40
    );
    tl.from(
      root.querySelectorAll('[data-s5-stat]'),
      { y: 60, opacity: 0, duration: 0.9, stagger: 0.3, ease: 'back.out(1.4)' },
      42
    );
    tl.from(
      root.querySelectorAll('[data-s5-particle]'),
      { y: 80, opacity: 0, duration: 1.2, stagger: 0.05, ease: 'power2.out' },
      44
    );
    tl.to(root.querySelector('[data-s5-overlay]'), { opacity: 0, duration: 0.8 }, 49);

    // ── Scene 6 (50-60s) — CTA ──────────────────────────────────────────
    tl.from(
      root.querySelector('[data-s6-logo]'),
      { scale: 0.6, opacity: 0, duration: 1.2, ease: 'back.out(1.4)' },
      50
    );
    tl.from(
      root.querySelector('[data-s6-tagline]'),
      { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out' },
      51
    );
    tl.from(
      root.querySelector('[data-s6-cta]'),
      { y: 40, opacity: 0, scale: 0.9, duration: 0.9, ease: 'back.out(1.4)' },
      52
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
      timelineRef.current = null;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [muted]);

  const togglePlay = () => {
    const tl = timelineRef.current;
    if (!tl) return;
    if (tl.progress() >= 1) {
      tl.restart();
      spokenLines.current.clear();
    }
    if (tl.paused()) {
      tl.play();
      setPlaying(true);
    } else {
      tl.pause();
      setPlaying(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  };

  const seekToScene = (idx: number) => {
    const tl = timelineRef.current;
    if (!tl) return;
    spokenLines.current.clear();
    tl.time(idx * SCENE_DURATION);
    if (tl.paused()) {
      tl.play();
      setPlaying(true);
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const toggleMute = () => {
    setMuted((m) => {
      if (!m && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      return !m;
    });
  };

  return (
    <section
      id="video-presentation"
      className="relative bg-black py-24 px-6"
      aria-label="Présentation animée RestauMargin 60 secondes"
    >
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: ACCENT }}>
          La présentation, en 60 secondes
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Voyez RestauMargin <span style={{ color: ACCENT }}>en action</span>.
        </h2>
        <p className="mt-4 text-base text-white/60">
          Six scènes, soixante secondes. Tout le produit, sans scroller quinze sections.
        </p>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Halo */}
        <div
          className="absolute -inset-4 rounded-[32px] blur-3xl opacity-40 -z-10"
          style={{
            background: `radial-gradient(circle at center, ${ACCENT}55 0%, transparent 70%)`,
          }}
        />

        <div
          ref={containerRef}
          className="relative aspect-video rounded-[24px] overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-[#0F1612] via-[#0A0F0D] to-[#050505]"
        >
          {/* ────────── SCENE 1 — Kitchen ────────── */}
          <Scene visible={activeScene === 0} accentLine="Vos ingrédients, organisés">
            <div className="grid grid-cols-5 gap-6 max-w-2xl mx-auto">
              {[
                { icon: '🍅', label: 'Tomate' },
                { icon: '🧄', label: 'Ail' },
                { icon: '🧈', label: 'Beurre' },
                { icon: '🥬', label: 'Salade' },
                { icon: '🥩', label: 'Viande' },
              ].map((it, i) => (
                <div
                  key={it.label}
                  data-s1-ingredient
                  className="aspect-square rounded-2xl flex flex-col items-center justify-center text-center"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div className="text-5xl mb-2">{it.icon}</div>
                  <div className="text-xs text-white/60 font-mono">{`#${i + 1}`}</div>
                  <div className="text-xs text-white font-semibold">{it.label}</div>
                </div>
              ))}
            </div>
          </Scene>

          {/* ────────── SCENE 2 — Weigh ────────── */}
          <Scene visible={activeScene === 1} accentLine="Au gramme près">
            <div className="flex flex-col items-center">
              <div data-s2-tomato className="text-7xl mb-4">
                🍅
              </div>
              <div className="relative">
                <div
                  data-s2-led
                  className="px-8 py-6 rounded-2xl border-2"
                  style={{
                    background: 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
                    borderColor: ACCENT,
                    boxShadow: `0 0 30px ${ACCENT}66`,
                  }}
                >
                  <span
                    data-s2-counter
                    className="font-mono text-5xl font-bold tabular-nums"
                    style={{ color: ACCENT, textShadow: `0 0 12px ${ACCENT}` }}
                  >
                    0
                  </span>
                  <span className="font-mono text-2xl font-bold ml-1" style={{ color: ACCENT }}>
                    g
                  </span>
                </div>
                <div className="text-xs text-white/40 text-center mt-2 uppercase tracking-widest">
                  Balance Bluetooth
                </div>
              </div>
            </div>
          </Scene>

          {/* ────────── SCENE 3 — Dashboard ────────── */}
          <Scene visible={activeScene === 2} accentLine="Vos chiffres en temps réel">
            <div className="max-w-2xl mx-auto">
              <div
                className="rounded-2xl p-6 grid grid-cols-2 gap-4"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <KpiCard
                  label="Food Cost"
                  refAttr="data-s3-foodcost"
                  suffix="%"
                  glowAttr="data-s3-glow"
                />
                <KpiCard label="Marge" refAttr="data-s3-margin" suffix="%" color={ACCENT} />
                <div className="col-span-2 flex items-end gap-2 h-24">
                  {[42, 68, 55, 78, 73, 88].map((h, i) => (
                    <div
                      key={i}
                      data-s3-bar
                      className="flex-1 rounded-t"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(180deg, ${ACCENT_LIGHT}, ${ACCENT})`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Scene>

          {/* ────────── SCENE 4 — AI Vocal ────────── */}
          <Scene visible={activeScene === 3} accentLine="L'IA crée vos fiches en 30 secondes">
            <div className="flex items-center gap-12 max-w-3xl mx-auto justify-center">
              <div className="relative flex items-center justify-center w-32 h-32">
                {[1, 1.4, 1.8, 2.2].map((s, i) => (
                  <div
                    key={i}
                    data-s4-wave
                    className="absolute inset-0 rounded-full border-2"
                    style={{
                      borderColor: ACCENT,
                      opacity: 0.6 - i * 0.12,
                      transform: `scale(${s})`,
                    }}
                  />
                ))}
                <div
                  className="relative w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: ACCENT, boxShadow: `0 0 40px ${ACCENT}` }}
                >
                  <Mic className="w-8 h-8 text-black" />
                </div>
              </div>
              <div
                data-s4-card
                className="rounded-2xl p-5 max-w-xs"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: ACCENT }}>
                  Fiche technique
                </div>
                <div className="text-white text-base font-bold mb-3">Tomates farcies au four</div>
                <div className="space-y-2">
                  {['🍅 6 tomates · 1.20€', '🧄 2 gousses ail · 0.10€', '🧈 50g beurre · 0.30€'].map((line, i) => (
                    <div
                      key={i}
                      data-s4-line
                      className="text-xs text-white/70 overflow-hidden whitespace-nowrap"
                      style={{ borderLeft: `2px solid ${ACCENT}`, paddingLeft: '8px' }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-xs">
                  <span className="text-white/60">Food cost</span>
                  <span className="font-bold" style={{ color: ACCENT }}>
                    24.6%
                  </span>
                </div>
              </div>
            </div>
          </Scene>

          {/* ────────── SCENE 5 — Profits rising ────────── */}
          <Scene visible={activeScene === 4} accentLine="Mesurable, jour après jour">
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-3 gap-6 mb-6">
                {[
                  { value: '-7 pts', label: 'Food cost' },
                  { value: '+3 K€', label: '/mois' },
                  { value: '+35 h', label: 'gagnées' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    data-s5-stat
                    className="rounded-2xl p-5 text-center"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <div
                      className="text-3xl font-extrabold tabular-nums"
                      style={{
                        background: `linear-gradient(135deg, ${ACCENT_LIGHT}, ${ACCENT})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/60 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-end gap-3 h-28 relative">
                {[18, 32, 45, 58, 70, 82, 95].map((h, i) => (
                  <div
                    key={i}
                    data-s5-bar
                    className="flex-1 rounded-t"
                    style={{
                      height: `${h}%`,
                      background: `linear-gradient(180deg, ${ACCENT_LIGHT}, ${ACCENT_DARK})`,
                    }}
                  />
                ))}
                {[10, 30, 60, 80].map((left, i) => (
                  <div
                    key={i}
                    data-s5-particle
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${left}%`,
                      bottom: `${30 + i * 15}%`,
                      background: '#FCD34D',
                      boxShadow: '0 0 12px #FCD34D',
                    }}
                  />
                ))}
              </div>
            </div>
          </Scene>

          {/* ────────── SCENE 6 — CTA ────────── */}
          <Scene visible={activeScene === 5} accentLine="">
            <div className="text-center max-w-2xl mx-auto">
              <div
                data-s6-logo
                className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
                  boxShadow: `0 0 60px ${ACCENT}AA`,
                }}
              >
                <ChefHat className="w-10 h-10 text-black" />
              </div>
              <h3 data-s6-tagline className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
                RestauMargin
              </h3>
              <p data-s6-tagline className="text-lg text-white/70 mb-8">
                Vos marges. Vos chiffres. Votre contrôle.
              </p>
              <Link
                to="/login?mode=register"
                data-s6-cta
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-black font-bold text-base shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT_LIGHT}, ${ACCENT})`,
                  boxShadow: `0 12px 40px ${ACCENT}AA`,
                }}
              >
                Essai gratuit 7 jours <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-white/50 mt-4">Sans CB · Annulation à tout moment</p>
            </div>
          </Scene>

          {/* Scene title bottom-left */}
          <div className="absolute bottom-6 left-6 max-w-md">
            <div className="text-xs uppercase tracking-widest font-mono" style={{ color: ACCENT }}>
              Scène {activeScene + 1} / 6
            </div>
            <div className="text-white text-lg font-bold mt-1">{SCENES[activeScene].title}</div>
            <div className="text-xs text-white/50">{SCENES[activeScene].subtitle}</div>
          </div>

          {/* Scene icon top-right */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            {[ChefHat, Scale, TabletSmartphone, Mic, TrendingUp, ChefHat].map((Icon, i) => (
              <button
                key={i}
                type="button"
                onClick={() => seekToScene(i)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  i === activeScene ? 'scale-110' : 'scale-90 opacity-50 hover:opacity-100'
                }`}
                style={{
                  background: i === activeScene ? ACCENT : 'rgba(255,255,255,0.08)',
                  color: i === activeScene ? '#000' : '#fff',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
                aria-label={`Aller à la scène ${i + 1} : ${SCENES[i].title}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Bottom progress + controls */}
          <div className="absolute bottom-0 inset-x-0 px-6 pb-4">
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full transition-[width] duration-100"
                style={{
                  width: `${progress * 100}%`,
                  background: `linear-gradient(90deg, ${ACCENT_LIGHT}, ${ACCENT})`,
                  boxShadow: `0 0 8px ${ACCENT}`,
                }}
              />
            </div>
          </div>

          {/* Play overlay before first start */}
          {!playing && progress === 0 && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
              aria-label="Lancer la présentation"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT_LIGHT}, ${ACCENT})`,
                  boxShadow: `0 12px 40px ${ACCENT}99`,
                }}
              >
                <Play className="w-8 h-8 text-black ml-1" />
              </div>
            </button>
          )}
        </div>

        {/* Player controls below */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label={muted ? 'Activer la voix' : 'Couper la voix'}
              title={muted ? 'Activer la narration FR' : 'Couper la narration'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <span className="text-xs text-white/40 font-mono ml-2">
              {Math.floor(progress * TOTAL_DURATION).toString().padStart(2, '0')}s / {TOTAL_DURATION}s
            </span>
          </div>
          <div className="text-xs text-white/40">
            Animation procédurale · Pas de vidéo téléchargée · Crisp 4K
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────
interface SceneProps {
  visible: boolean;
  accentLine: string;
  children: React.ReactNode;
}

function Scene({ visible, children }: SceneProps) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center p-12 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {children}
    </div>
  );
}

interface KpiCardProps {
  label: string;
  refAttr: string;
  suffix?: string;
  color?: string;
  glowAttr?: string;
}

function KpiCard({ label, refAttr, suffix = '', color, glowAttr }: KpiCardProps) {
  // refAttr like "data-s3-foodcost" needs to be split for React.
  const dataKey = refAttr.replace('data-', '');
  const props: Record<string, string> = { [`data-${dataKey}`]: '' };
  return (
    <div
      className="relative rounded-xl p-4"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color || 'rgba(255,255,255,0.1)'}`,
      }}
    >
      {glowAttr && (
        <div
          {...{ [glowAttr.replace('data-', 'data-')]: '' }}
          className="absolute -inset-2 rounded-2xl blur-xl pointer-events-none"
          style={{ background: `${ACCENT}33` }}
        />
      )}
      <div className="text-xs uppercase tracking-wider font-semibold text-white/50 relative">
        {label}
      </div>
      <div className="relative mt-1 flex items-baseline gap-1">
        <span
          {...props}
          className="text-3xl font-extrabold tabular-nums"
          style={{ color: color || ACCENT }}
        >
          0.0
        </span>
        <span className="text-xl font-bold" style={{ color: color || ACCENT }}>
          {suffix}
        </span>
      </div>
    </div>
  );
}
