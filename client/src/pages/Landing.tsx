/**
 * @file client/src/pages/Landing.tsx
 * RestauMargin landing — v3 "Claude Design Integration" — 2026-04-26.
 *
 * Architecture : 9 sections numérotées + 4 widgets globaux flottants.
 * Match exact des screenshots claude.design partagés par l'utilisateur.
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChefHat, Menu, X as XIcon, ArrowRight, Calculator, X, Check,
  Send, Sparkles, ClipboardList, BarChart3, Truck, Scale, Thermometer,
  Star, ShieldCheck, MapPin, Headphones, FileCheck, CreditCard,
  Play, Tablet, ScanLine, ArrowUpRight,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEOHead from '../components/SEOHead';

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
// 01 — HERO
// ═══════════════════════════════════════════════════════════════════════════
function HeroSection() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-40 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, ${ACCENT_BG} 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, ${ACCENT_BG} 0%, transparent 50%)`,
        }}
      />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div ref={ref}>
          <SectionNumber n="01" label="RestauMargin" />
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight" style={{ color: TEXT }}>
            Gérez mieux.
            <br />
            <span style={{ color: ACCENT }}>Gagnez plus.</span>
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
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-base shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`, boxShadow: `0 12px 30px ${ACCENT}40` }}
            >
              Essayer gratuitement <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs flex items-center gap-3 font-medium" style={{ color: TEXT_MUTED }}>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
                14 jours gratuits
              </span>
              <span>·</span>
              <span>Sans carte bancaire</span>
            </span>
          </div>
        </div>
        <div className="relative">
          <DashboardMiniCard animated />
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 02 — ROI CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════
function RoiCalculatorSection() {
  const ref = useReveal<HTMLDivElement>();
  const [couverts, setCouverts] = useState(80);
  const [prix, setPrix] = useState(18);
  const [plats, setPlats] = useState(25);
  const ca = couverts * prix * 30;
  const economiesMois = Math.round(ca * 0.04);

  return (
    <section className="py-24 px-6 lg:px-8" style={{ background: '#FAFAFA' }}>
      <div ref={ref} className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
        <div>
          <SectionNumber n="02" label="Calculateur ROI" />
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight" style={{ color: TEXT }}>
            Combien pouvez-vous{' '}
            <span style={{ color: ACCENT }}>économiser ?</span>
          </h2>
          <p className="mt-4 text-lg" style={{ color: TEXT_MUTED }}>
            Estimez vos économies mensuelles en quelques clics.
          </p>
          <div className="mt-8 rounded-2xl p-5" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ACCENT_BG, color: ACCENT_DARK }}>
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: TEXT }}>
                  Jusqu'à 500€ d'économies par mois
                </div>
                <div className="text-xs" style={{ color: TEXT_MUTED }}>
                  Calcul en temps réel et 100% personnalisé
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl p-8 bg-white shadow-xl" style={{ border: `1px solid ${BORDER}` }}>
          <h3 className="text-base font-bold mb-6 flex items-center gap-2" style={{ color: TEXT }}>
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: ACCENT_BG, color: ACCENT_DARK }}>
              <Calculator className="w-3.5 h-3.5" />
            </span>
            Estimez vos économies
          </h3>

          {[
            { label: 'Nombre de couverts par jour', value: couverts, set: setCouverts, min: 20, max: 300, suffix: '' },
            { label: "Prix moyen d'un plat (EUR)", value: prix, set: setPrix, min: 8, max: 45, suffix: '€' },
            { label: 'Nombre de plats à la carte', value: plats, set: setPlats, min: 5, max: 80, suffix: '' },
          ].map((field) => (
            <div key={field.label} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold" style={{ color: TEXT }}>{field.label}</label>
                <span className="px-3 py-1 rounded-full text-sm font-bold tabular-nums" style={{ background: '#F5F5F5', color: TEXT }}>
                  {field.value}{field.suffix}
                </span>
              </div>
              <input
                type="range"
                min={field.min}
                max={field.max}
                value={field.value}
                onChange={(e) => field.set(parseInt(e.target.value))}
                className="w-full"
                style={{ accentColor: ACCENT }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: TEXT_MUTED }}>
                <span>{field.min}{field.suffix}</span>
                <span>{field.max}{field.suffix}</span>
              </div>
            </div>
          ))}

          <div className="rounded-2xl p-5 mt-6" style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_LIGHT}` }}>
            <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: ACCENT_DARK }}>Économies / mois</div>
            <div className="text-4xl font-extrabold mt-1 tabular-nums" style={{ color: TEXT }}>
              {economiesMois.toLocaleString('fr-FR')}.00 €
            </div>
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
    <section className="py-24 px-6 lg:px-8 bg-white">
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
          <div className="flex justify-end">
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
          <div className="rounded-3xl p-8 bg-white" style={{ border: `1px solid ${BORDER}` }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: TEXT }}>Pro</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-extrabold" style={{ color: TEXT }}>
                {annual ? pricing.pro.annual : pricing.pro.monthly}
              </span>
              <span className="text-lg font-semibold" style={{ color: TEXT_MUTED }}>€/mois</span>
            </div>
            {annual && (
              <p className="text-xs font-semibold mb-6" style={{ color: ACCENT_DARK }}>
                Soit {pricing.pro.annual * 12}€/an au lieu de {pricing.pro.monthly * 12}€
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
              className="block w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.01]"
              style={{ background: 'white', color: TEXT, border: `2px solid ${BORDER}` }}
            >Essai gratuit 14 jours</Link>
          </div>

          <div className="rounded-3xl p-8 bg-white relative" style={{ border: `2px solid ${ACCENT}`, boxShadow: `0 20px 40px ${ACCENT}1A` }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: ACCENT, color: 'white' }}>
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
                Soit {pricing.business.annual * 12}€/an au lieu de {pricing.business.monthly * 12}€
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
              className="block w-full text-center py-3.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`, boxShadow: `0 12px 30px ${ACCENT}40` }}
            >Essai gratuit 14 jours</Link>
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
  const ref = useReveal<HTMLDivElement>();
  const features = [
    { icon: Send, title: 'Commandes fournisseurs en 1 clic' },
    { icon: Sparkles, title: "L'IA qui parle cuisine" },
    { icon: ClipboardList, title: 'Fiches techniques en quelques clics' },
    { icon: Truck, title: 'Suivi des prix fournisseurs' },
    { icon: Scale, title: 'Balance Bluetooth en cuisine' },
    { icon: Thermometer, title: 'HACCP digital, sans papier' },
  ];

  return (
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
          <div>
            <SectionNumber n="04" label="Fonctionnalités" />
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight" style={{ color: TEXT }}>
              Tout ce dont
              <br />
              vous <span style={{ color: ACCENT }}>avez besoin</span>
            </h2>
            <p className="mt-4 text-base" style={{ color: TEXT_MUTED }}>
              Six outils puissants pour reprendre le contrôle de vos marges.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl p-5 bg-white transition-all hover:-translate-y-1 hover:shadow-md"
                  style={{ border: `1px solid ${BORDER}` }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: ACCENT_BG, color: ACCENT_DARK }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold" style={{ color: TEXT }}>{f.title}</h3>
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
// 05 — PROCESSUS
// ═══════════════════════════════════════════════════════════════════════════
function ProcessSection() {
  const ref = useReveal<HTMLDivElement>();
  const steps = [
    { n: '01', icon: ScanLine, title: 'Ajoutez vos ingrédients', desc: "Importez votre liste d'ingrédients depuis Excel ou dictez-les à l'IA. Prix, fournisseurs, unités : tout est organisé automatiquement." },
    { n: '02', icon: ClipboardList, title: 'Créez vos fiches techniques', desc: "L'assistant IA génère vos fiches en 10 secondes. Food cost, marge, allergènes, coefficient — tout est calculé en temps réel." },
    { n: '03', icon: BarChart3, title: 'Optimisez vos marges', desc: "Dashboard avec KPIs, alertes prix fournisseurs, Menu Engineering. Vos marges s'améliorent dès le premier jour." },
  ];
  return (
    <section className="py-24 px-6 lg:px-8" style={{ background: '#FAFAFA' }}>
      <div ref={ref} className="max-w-6xl mx-auto">
        <SectionNumber n="05" label="Processus" />
        <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight" style={{ color: TEXT }}>
          Trois étapes <span style={{ color: ACCENT }}>simples</span>
        </h2>
        <p className="mt-4 text-lg" style={{ color: TEXT_MUTED }}>
          De l'inscription à l'optimisation de vos marges en quelques minutes.
        </p>
        <div className="mt-16 grid md:grid-cols-3 gap-6 relative">
          <div
            className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px -z-10"
            style={{ backgroundImage: `repeating-linear-gradient(to right, ${ACCENT} 0 6px, transparent 6px 12px)` }}
          />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.n} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 font-mono font-bold text-sm" style={{ background: 'white', border: `1px solid ${BORDER}`, color: TEXT }}>
                  {step.n}
                </div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 mx-auto" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
                  <Icon className="w-6 h-6" style={{ color: TEXT }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: TEXT }}>{step.title}</h3>
                <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: TEXT_MUTED }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 06 — TÉMOIGNAGES
// ═══════════════════════════════════════════════════════════════════════════
function TestimonialsSection() {
  const ref = useReveal<HTMLDivElement>();
  const testimonials = [
    { stars: 5, quote: '+4 points de marge en 3 mois. Les fiches techniques automatiques nous ont tout changé. Avant on calculait à la main sur des Post-it, maintenant tout est précis au centime près.', initials: 'LD', name: 'Laurent Dubois', role: 'Chef propriétaire', restaurant: 'Le Jardin des Saveurs, Lyon' },
    { stars: 5, quote: "On a réduit notre food cost de 34% à 27% en 2 mois. L'IA qui crée les fiches techniques en 10 secondes, c'est un game changer. Mon équipe ne peut plus s'en passer.", initials: 'SM', name: 'Sophie Martin', role: 'Directrice', restaurant: 'Brasserie Le Comptoir, Paris' },
    { stars: 5, quote: "Chaque centime compte en food truck. Les alertes sur les prix fournisseurs m'ont fait économiser 800 euros le premier mois. L'app est simple, rapide, parfaite pour le terrain.", initials: 'KB', name: 'Karim Benali', role: 'Gérant', restaurant: 'Street Flavors, Bordeaux' },
  ];
  return (
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
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
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-3xl p-7 bg-white" style={{ border: `1px solid ${BORDER}` }}>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#0F172A' }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: TEXT }}>"{t.quote}"</p>
              <div className="pt-5 mt-auto flex items-center gap-3" style={{ borderTop: `1px solid ${BORDER}` }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: '#F5F5F5', color: TEXT }}>
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
// 07 — TUTORIELS ANIMÉS
// ═══════════════════════════════════════════════════════════════════════════
function TutorialsSection() {
  const ref = useReveal<HTMLDivElement>();
  const [activeIdx, setActiveIdx] = useState(0);
  const tutorials = [
    { icon: ClipboardList, title: 'Créer une fiche technique', desc: 'De la recette à la marge en 4 étapes.', visual: { title: 'Bowl Saumon', items: ['Saumon · 120g · 2.45€', 'Avocat · 80g · 1.10€', 'Riz basmati · 150g · 0.35€'] } },
    { icon: Scale, title: 'Peser un ingrédient', desc: 'Connectez votre balance et pesez en temps réel.', visual: { title: 'Balance Bluetooth', items: ['Tomate · 156g', 'Mozzarella · 122g', 'Basilic · 14g'] } },
    { icon: Truck, title: 'Commander un fournisseur', desc: "L'IA suggère, vous envoyez en 1 clic.", visual: { title: 'Commande #4523', items: ['Tomates 5kg · Métro', 'Saumon 2kg · Pêcheur du Nord', 'Riz 10kg · Sysco'] } },
  ];
  return (
    <section className="py-24 px-6 lg:px-8" style={{ background: '#FAFAFA' }}>
      <div ref={ref} className="max-w-7xl mx-auto">
        <SectionNumber n="07" label="Tutoriels animés" />
        <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight" style={{ color: TEXT }}>
          Voyez le produit <span style={{ color: ACCENT }}>en action</span>
        </h2>
        <p className="mt-4 text-lg" style={{ color: TEXT_MUTED }}>
          Trois scénarios animés qui montrent la puissance de RestauMargin.
        </p>
        <div className="mt-12 grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
          <div className="rounded-3xl bg-[#0F172A] p-6 shadow-2xl relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="ml-3 text-xs text-white/40 font-mono">Dashboard</div>
            </div>
            <div className="rounded-2xl p-6 bg-white h-full">
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-base font-bold" style={{ color: TEXT }}>{tutorials[activeIdx].visual.title}</h4>
                <button type="button" className="px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: ACCENT }}>
                  Enregistrer
                </button>
              </div>
              <div className="space-y-2">
                {tutorials[activeIdx].visual.items.map((line, i) => (
                  <div key={i} className="rounded-xl px-4 py-3 flex items-center justify-between text-sm" style={{ background: '#F8FAFC', border: `1px solid ${BORDER}` }}>
                    <span style={{ color: TEXT }}>{line.split(' · ')[0]}</span>
                    <div className="flex items-center gap-3">
                      {line.split(' · ').slice(1).map((part, j, arr) => (
                        <span key={j} className="text-xs font-mono font-semibold" style={{ color: j === arr.length - 1 ? ACCENT_DARK : TEXT_MUTED }}>
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-3 left-6 right-6 flex items-center gap-3">
              <Play className="w-4 h-4 text-white/60" />
              <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${((activeIdx + 1) / 3) * 100}%`, background: ACCENT }} />
              </div>
              <span className="text-xs text-white/40 font-mono">0:0{activeIdx * 5 + 4} / 0:15</span>
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
                  onClick={() => setActiveIdx(i)}
                  className="w-full text-left rounded-2xl p-5 bg-white transition-all"
                  style={{ border: `2px solid ${active ? ACCENT : BORDER}`, boxShadow: active ? `0 8px 24px ${ACCENT}1A` : 'none' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: active ? ACCENT : '#F5F5F5', color: active ? 'white' : TEXT }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold" style={{ color: TEXT }}>{tut.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>{tut.desc}</div>
                    </div>
                  </div>
                </button>
              );
            })}
            <Link
              to="/login?mode=register"
              className="block text-center px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg mt-4 transition-all hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`, boxShadow: `0 12px 30px ${ACCENT}40` }}
            >Essayer maintenant →</Link>
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
  const ref = useReveal<HTMLDivElement>();
  const badges = [
    { icon: ShieldCheck, title: 'Données sécurisées', sub: 'Chiffrement SSL/TLS' },
    { icon: MapPin, title: 'Made in France', sub: 'Hébergé en Europe' },
    { icon: Headphones, title: 'Support 7j/7', sub: 'Réponse sous 24h' },
    { icon: FileCheck, title: 'RGPD Conforme', sub: 'Vos données vous appartiennent' },
    { icon: CreditCard, title: 'Essai sans CB', sub: '14 jours gratuits' },
  ];
  return (
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto">
        <SectionNumber n="08" label="Confiance & sécurité" />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3" style={{ background: ACCENT_BG, color: ACCENT_DARK }}>
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
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
        <div>
          <SectionNumber n="09" label="Prêt à augmenter vos marges ?" />
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight" style={{ color: TEXT }}>
            Prêt à <span style={{ color: ACCENT }}>augmenter</span>
            <br />
            vos marges ?
          </h2>
          <p className="mt-4 text-lg" style={{ color: TEXT_MUTED }}>Essayez gratuitement pendant 14 jours.</p>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-white font-bold text-base shadow-lg mt-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`, boxShadow: `0 12px 30px ${ACCENT}40` }}
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
            <div className="text-4xl font-extrabold tabular-nums mb-2" style={{ color: ACCENT_DARK }}>479.00 €</div>
            <div className="flex items-center gap-1 text-xs font-semibold mb-5" style={{ color: ACCENT_DARK }}>
              ↗ +12% <span className="font-normal" style={{ color: TEXT_MUTED }}>vs mois dernier</span>
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
                <div className="text-2xl font-extrabold mt-1 tabular-nums" style={{ color: TEXT }}>4.8%</div>
                <div className="text-xs font-semibold mt-0.5" style={{ color: ACCENT_DARK }}>+0.0%</div>
              </div>
              <div className="rounded-xl p-3" style={{ background: '#F8FAFC' }}>
                <div className="text-xs font-semibold" style={{ color: TEXT_MUTED }}>Food cost moyen</div>
                <div className="text-2xl font-extrabold mt-1 tabular-nums" style={{ color: TEXT }}>27.4%</div>
                <div className="text-xs font-semibold mt-0.5" style={{ color: ACCENT_DARK }}>-2.1%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white/70 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
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
            <li><Link to="/booking-demo" className="hover:text-white">Réserver une démo</Link></li>
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
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${BORDER}` : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
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
          <Link to="/login" className="text-sm font-semibold transition-colors" style={{ color: TEXT }}>Se connecter</Link>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-white font-semibold text-sm shadow-md transition-transform hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}
          >
            Essai 14 jours <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <button type="button" onClick={() => setOpen((o) => !o)} className="lg:hidden p-2" aria-label={open ? 'Fermer' : 'Ouvrir'}>
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
            Essai 14 jours
          </Link>
        </div>
      )}
    </nav>
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
      <Link to="/login?mode=register" className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-white font-bold shadow-2xl" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`, boxShadow: `0 10px 30px ${ACCENT}66` }}>
        Essai gratuit 14 jours <ArrowRight className="w-4 h-4" />
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
        <button type="button" onClick={close} className="absolute top-4 right-4 p-2 hover:bg-[#F1F5F9] rounded-full" aria-label="Fermer">
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
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function Landing() {
  return (
    <>
      <SEOHead
        title="RestauMargin — Logiciel de marge restaurant | L'IA au service de votre rentabilité"
        description="Gérez mieux. Gagnez plus. RestauMargin : fiches techniques, food cost et commandes fournisseurs automatisés par l'IA. Essai gratuit 14 jours sans CB."
        path="/"
      />
      <StructuredData />
      <ScrollProgressBar />
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
      </main>
      <Footer />
      <StickyCtaBar />
      <ExitIntentPopup />
    </>
  );
}
