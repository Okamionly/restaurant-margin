/**
 * @file client/src/components/landing/VideoPresentation.tsx
 * 60-second cinematic product video — replaces 12 static sections (features,
 * testimonials, ROI calc, pricing detail, FAQ list, etc.) with a single
 * scrollytelling video presentation.
 *
 * Source: Cloudflare Stream HLS (env VITE_CLOUDFLARE_STREAM_VIDEO_ID).
 * Fallback: local /images/hero/station-demo.mp4 in dev when env var unset.
 * A11y: <track kind="captions"> for SEO + a11y, prefers-reduced-motion → no autoplay.
 *
 * Conversion tracking: emits `play`, `25%`, `50%`, `75%`, `complete` events
 * to dataLayer for GA4/GTM and to /api/track/video for first-party analytics.
 */

import { useEffect, useRef, useState } from 'react';
import { Play, Volume2, VolumeX, Maximize2 } from 'lucide-react';

const ACCENT = '#10B981';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function track(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  if (window.dataLayer) {
    window.dataLayer.push({ event: `landing_video_${event}`, ...payload });
  }
  // Best-effort first-party analytics — fire and forget.
  fetch('/api/track/video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, ...payload, ts: Date.now() }),
    keepalive: true,
  }).catch(() => {
    /* analytics failures are silent */
  });
}

export default function VideoPresentation() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const milestonesFired = useRef(new Set<string>());

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Autoplay muted on viewport entry — matches modern UX patterns
    // (Apple, Vercel, Linear). Respect prefers-reduced-motion.
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !prefersReducedMotion) {
            v.play().catch(() => {
              /* autoplay blocked, user will click */
            });
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(v);

    const onPlay = () => {
      setPlaying(true);
      if (!milestonesFired.current.has('play')) {
        milestonesFired.current.add('play');
        track('play');
      }
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      track('complete', { duration: v.duration });
    };
    const onTimeUpdate = () => {
      if (!v.duration || isNaN(v.duration)) return;
      const pct = (v.currentTime / v.duration) * 100;
      for (const m of [25, 50, 75]) {
        const key = `pct_${m}`;
        if (pct >= m && !milestonesFired.current.has(key)) {
          milestonesFired.current.add(key);
          track(`progress_${m}`, { currentTime: v.currentTime });
        }
      }
    };

    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);
    v.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      observer.disconnect();
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) track('unmute', { currentTime: v.currentTime });
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  const goFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
  };

  const cloudflareId = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env
    .VITE_CLOUDFLARE_STREAM_VIDEO_ID;

  return (
    <section
      id="video-presentation"
      className="relative bg-black py-24 px-6"
      aria-label="Présentation vidéo RestauMargin 60 secondes"
    >
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: ACCENT }}>
          La présentation, en 60 secondes
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Voyez RestauMargin <span style={{ color: ACCENT }}>en action</span>.
        </h2>
        <p className="mt-4 text-base text-white/60">
          Une vidéo. Tout le produit. Pas de scroll de 15 sections.
        </p>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Soft glow halo */}
        <div
          className="absolute -inset-4 rounded-[32px] blur-3xl opacity-40 -z-10"
          style={{
            background: `radial-gradient(circle at center, ${ACCENT}55 0%, transparent 70%)`,
          }}
        />

        <div className="relative aspect-video rounded-[24px] overflow-hidden border border-white/10 shadow-2xl bg-[#0A0A0A]">
          {cloudflareId ? (
            // Cloudflare Stream iframe — adaptive HLS, no bandwidth on Vercel.
            <iframe
              src={`https://customer-inu5okyp5g2t5fku.cloudflarestream.com/${cloudflareId}/iframe?autoplay=true&muted=true&loop=false&controls=true&preload=metadata`}
              title="RestauMargin présentation 60 secondes"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              loading="lazy"
            />
          ) : (
            <>
              {/* Local fallback for dev / before Kling video uploaded. */}
              <video
                ref={videoRef}
                src="/images/hero/station-demo.mp4"
                poster="/images/restaumargin-station-opt.webp"
                muted={muted}
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                aria-label="Démonstration RestauMargin Station"
              >
                <track kind="captions" src="/captions/landing-fr.vtt" srcLang="fr" label="Français" default />
              </video>

              {/* Custom controls overlay — minimal, only on hover */}
              <div className="absolute inset-0 flex items-end justify-between p-4 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-white/90 text-black flex items-center justify-center hover:bg-white transition-colors"
                  aria-label={playing ? 'Pause' : 'Play'}
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
                    aria-label={muted ? 'Activer le son' : 'Couper le son'}
                  >
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <button
                    type="button"
                    onClick={goFullscreen}
                    className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
                    aria-label="Plein écran"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-white/40">
          Vidéo cinematic · 60 secondes · Sous-titres FR disponibles · Caption icon to enable sound
        </p>
      </div>
    </section>
  );
}
