import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChefHat, ClipboardList, Truck, BarChart3,
  ArrowRight, CheckCircle2, TrendingUp, Zap, Star,
  Users, Menu, X as XIcon, Shield, Lock, Mail,
  Scale, ChevronDown, Phone, Send, Loader2,
  XCircle, Brain, Thermometer, Palette,
} from 'lucide-react';

/* ─────────────────────── Hooks ─────────────────────── */

function useInView(threshold = 0.01) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useAnimatedCounter(target: number, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return count;
}

/* ─────────────────────── Components ─────────────────────── */

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────── Design System ─────────────────────── */

interface DesignTheme {
  id: string;
  name: string;
  font: string;
  hero: string;
  accent: string;
  btn: string;
  nav: string;
  badge: string;
  tag: string;
  light?: boolean;
  tp: string;
  ts: string;
  th: string;
  cardBg: string;
  inputBg: string;
  sectionAlt: string;
  footerBorder: string;
}

const DESIGNS: DesignTheme[] = [
  {
    id: 'obsidian-pro',
    name: 'Obsidian Pro',
    font: "'Sora', sans-serif",
    hero: 'bg-gradient-to-br from-black via-slate-950 to-slate-900',
    accent: 'from-orange-500 to-blue-500',
    btn: 'bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-400 hover:to-blue-500 shadow-orange-500/30',
    nav: 'bg-black/80 backdrop-blur-xl border-white/10',
    badge: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    tag: 'bg-white/5 border-white/10 text-slate-400',
    tp: 'text-white',
    ts: 'text-slate-400',
    th: 'hover:text-white',
    cardBg: 'bg-white/5 border border-white/10',
    inputBg: 'bg-white/10 border-white/20 text-white placeholder-slate-500',
    sectionAlt: 'bg-white/[0.02]',
    footerBorder: 'border-white/10 bg-black/20',
  },
  {
    id: 'arctic-clean',
    name: 'Arctic Clean',
    font: "'DM Sans', sans-serif",
    hero: 'bg-gradient-to-br from-white via-sky-50 to-cyan-50',
    accent: 'from-cyan-500 to-blue-500',
    btn: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/30',
    nav: 'bg-white/90 backdrop-blur-xl border-slate-200',
    badge: 'bg-cyan-50 border-cyan-200 text-cyan-600',
    tag: 'bg-slate-100 border-slate-200 text-slate-500',
    light: true,
    tp: 'text-slate-900',
    ts: 'text-slate-600',
    th: 'hover:text-slate-900',
    cardBg: 'bg-white border border-slate-200',
    inputBg: 'bg-white border-slate-300 text-slate-900 placeholder-slate-400',
    sectionAlt: 'bg-gray-50',
    footerBorder: 'border-slate-200 bg-gray-50',
  },
  {
    id: 'midnight-neon',
    name: 'Midnight Neon',
    font: "'Inter', sans-serif",
    hero: 'bg-gradient-to-br from-[#0a0a1a] via-[#0d0d2b] to-[#12122a]',
    accent: 'from-violet-500 to-cyan-400',
    btn: 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 shadow-violet-500/30',
    nav: 'bg-[#0a0a1a]/80 backdrop-blur-xl border-white/10',
    badge: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    tag: 'bg-white/5 border-white/10 text-slate-400',
    tp: 'text-white',
    ts: 'text-slate-400',
    th: 'hover:text-white',
    cardBg: 'bg-white/5 border border-white/10',
    inputBg: 'bg-white/10 border-white/20 text-white placeholder-slate-500',
    sectionAlt: 'bg-white/[0.02]',
    footerBorder: 'border-white/10 bg-black/20',
  },
  {
    id: 'ivory-minimal',
    name: 'Ivory Minimal',
    font: "'Outfit', sans-serif",
    hero: 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950',
    accent: 'from-amber-400 to-orange-500',
    btn: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/30',
    nav: 'bg-zinc-950/80 backdrop-blur-xl border-white/10',
    badge: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    tag: 'bg-white/5 border-white/10 text-slate-400',
    tp: 'text-white',
    ts: 'text-slate-400',
    th: 'hover:text-white',
    cardBg: 'bg-white/5 border border-white/10',
    inputBg: 'bg-white/10 border-white/20 text-white placeholder-slate-500',
    sectionAlt: 'bg-white/[0.02]',
    footerBorder: 'border-white/10 bg-black/20',
  },
  {
    id: 'pure-black',
    name: 'Pure Black',
    font: "'Plus Jakarta Sans', sans-serif",
    hero: 'bg-black',
    accent: 'from-white to-slate-300',
    btn: 'bg-white text-black hover:bg-slate-200 shadow-white/10',
    nav: 'bg-black/80 backdrop-blur-xl border-white/10',
    badge: 'bg-white/10 border-white/20 text-white',
    tag: 'bg-white/5 border-white/10 text-slate-400',
    tp: 'text-white',
    ts: 'text-slate-400',
    th: 'hover:text-white',
    cardBg: 'bg-white/5 border border-white/10',
    inputBg: 'bg-white/10 border-white/20 text-white placeholder-slate-500',
    sectionAlt: 'bg-white/[0.02]',
    footerBorder: 'border-white/10 bg-black/20',
  },
  {
    id: 'indigo-glass',
    name: 'Indigo Glass',
    font: "'Inter', sans-serif",
    hero: 'bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950',
    accent: 'from-violet-400 to-indigo-400',
    btn: 'bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 shadow-violet-500/30',
    nav: 'bg-indigo-950/80 backdrop-blur-xl border-white/10',
    badge: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    tag: 'bg-white/5 border-white/10 text-slate-400',
    tp: 'text-white',
    ts: 'text-slate-400',
    th: 'hover:text-white',
    cardBg: 'bg-white/5 border border-white/10',
    inputBg: 'bg-white/10 border-white/20 text-white placeholder-slate-500',
    sectionAlt: 'bg-white/[0.02]',
    footerBorder: 'border-white/10 bg-black/20',
  },
  {
    id: 'forest-pro',
    name: 'Forest Pro',
    font: "'Sora', sans-serif",
    hero: 'bg-gradient-to-br from-emerald-950 via-green-950 to-emerald-900',
    accent: 'from-emerald-400 to-green-400',
    btn: 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 shadow-emerald-500/30',
    nav: 'bg-emerald-950/80 backdrop-blur-xl border-white/10',
    badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    tag: 'bg-white/5 border-white/10 text-slate-400',
    tp: 'text-white',
    ts: 'text-slate-400',
    th: 'hover:text-white',
    cardBg: 'bg-white/5 border border-white/10',
    inputBg: 'bg-white/10 border-white/20 text-white placeholder-slate-500',
    sectionAlt: 'bg-white/[0.02]',
    footerBorder: 'border-white/10 bg-black/20',
  },
  {
    id: 'rose-elite',
    name: 'Rose Elite',
    font: "'DM Sans', sans-serif",
    hero: 'bg-gradient-to-br from-rose-950 via-pink-950 to-rose-900',
    accent: 'from-rose-400 to-pink-400',
    btn: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 shadow-rose-500/30',
    nav: 'bg-rose-950/80 backdrop-blur-xl border-white/10',
    badge: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    tag: 'bg-white/5 border-white/10 text-slate-400',
    tp: 'text-white',
    ts: 'text-slate-400',
    th: 'hover:text-white',
    cardBg: 'bg-white/5 border border-white/10',
    inputBg: 'bg-white/10 border-white/20 text-white placeholder-slate-500',
    sectionAlt: 'bg-white/[0.02]',
    footerBorder: 'border-white/10 bg-black/20',
  },
];

/* ─────────────────────── Data ─────────────────────── */

const testimonials = [
  {
    quote: "+4 points de marge en 3 mois. Les fiches techniques automatiques nous ont tout change.",
    name: 'Laurent Dubois',
    role: 'Chef de cuisine',
    place: 'Restaurant gastronomique, Lyon',
    rating: 5,
  },
  {
    quote: "Interface intuitive, calcul en temps reel. Exactement ce qu'il manquait aux restaurateurs.",
    name: 'Sophie Martin',
    role: 'Directrice',
    place: 'Brasserie Le Comptoir, Paris',
    rating: 5,
  },
  {
    quote: "Chaque centime compte en food truck. RestauMargin m'aide a rester competitif et rentable.",
    name: 'Karim Benali',
    role: 'Gerant',
    place: 'Food truck Street Flavors, Bordeaux',
    rating: 4,
  },
];

const faqItems = [
  {
    q: 'Comment fonctionne l\'abonnement ?',
    a: 'Choisissez votre plan (Pro ou Business), payez par carte bancaire et recevez votre code d\'activation instantanement. L\'abonnement est mensuel, sans engagement. Vous pouvez annuler a tout moment depuis votre espace.',
  },
  {
    q: 'Comment recevoir mon code d\'activation ?',
    a: 'Apres le paiement, vous recevez un email avec votre code d\'activation et un lien pour creer votre compte. Connectez-vous, entrez le code et commencez a utiliser RestauMargin immediatement.',
  },
  {
    q: 'Puis-je changer de plan ?',
    a: 'Oui, vous pouvez upgrader ou downgrader votre plan a tout moment. Le changement prend effet au prochain cycle de facturation. Le prorata est calcule automatiquement.',
  },
  {
    q: 'Puis-je utiliser une balance connectee ?',
    a: 'Oui. RestauMargin propose une station de pesee logicielle compatible avec toute balance Bluetooth. Connectez votre propre balance et pesez vos ingredients directement depuis l\'application.',
  },
  {
    q: 'Mes donnees sont-elles securisees ?',
    a: 'Vos donnees sont hebergees en Europe (Supabase), chiffrees en transit (SSL/TLS) et au repos. Nous sommes conformes RGPD. Aucune donnee n\'est revendue a des tiers.',
  },
];

/* ─────────────────────── Page ─────────────────────── */

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [contactForm, setContactForm] = useState({ nom: '', email: '', telephone: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [designIndex, setDesignIndex] = useState(0);
  const [designPanelOpen, setDesignPanelOpen] = useState(false);

  const d = DESIGNS[designIndex];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hero carousel auto-rotation
  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(s => (s + 1) % 3), 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactForm.nom,
          email: contactForm.email,
          phone: contactForm.telephone,
          message: contactForm.message,
          source: 'landing-contact',
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }
      setContactSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'envoi. Veuillez reessayer.';
      setContactError(message);
    } finally {
      setContactLoading(false);
    }
  };

  /* — Stat counter sub-component (needs d.ts) — */
  const StatCounter = ({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) => {
    const { ref, visible } = useInView(0.3);
    const count = useAnimatedCounter(value, 1800, visible);
    return (
      <div ref={ref} className="text-center px-6">
        <div className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-b ${d.accent} bg-clip-text text-transparent tracking-tight`}>
          {count}{suffix}
        </div>
        <div className={`text-sm ${d.ts} mt-1 font-medium`}>{label}</div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${d.hero} ${d.tp} overflow-x-hidden scroll-smooth`} style={{ fontFamily: d.font }}>

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? `${d.nav} shadow-sm` : 'bg-transparent'} ${scrolled && d.light ? 'border-b border-slate-200' : scrolled ? 'border-b border-white/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${d.accent} flex items-center justify-center shadow-lg`}>
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${d.tp}`}>RestauMargin</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className={`text-sm ${d.ts} ${d.th} transition-colors cursor-pointer`}>Fonctionnalites</button>
            <button onClick={() => scrollTo('pricing')} className={`text-sm ${d.ts} ${d.th} transition-colors cursor-pointer`}>Tarifs</button>
            <button onClick={() => scrollTo('faq')} className={`text-sm ${d.ts} ${d.th} transition-colors cursor-pointer`}>FAQ</button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className={`text-sm ${d.ts} ${d.th} transition-colors px-3 py-2`}>Connexion</Link>
            <Link to="/pricing" className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl ${d.btn} text-white text-sm font-semibold transition-all shadow-lg`}>
              Voir les tarifs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden p-2 ${d.ts} ${d.th}`}>
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden ${d.light ? 'bg-white/95 border-t border-slate-200' : 'bg-black/95 border-t border-white/10'} backdrop-blur-xl shadow-lg`}>
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollTo('features')} className={`block w-full text-left text-sm ${d.ts} ${d.th} py-2`}>Fonctionnalites</button>
              <button onClick={() => scrollTo('pricing')} className={`block w-full text-left text-sm ${d.ts} ${d.th} py-2`}>Tarifs</button>
              <button onClick={() => scrollTo('faq')} className={`block w-full text-left text-sm ${d.ts} ${d.th} py-2`}>FAQ</button>
              <hr className={d.light ? 'border-slate-200' : 'border-white/10'} />
              <Link to="/login" className={`block text-sm ${d.ts} ${d.th} py-2`}>Connexion</Link>
              <Link to="/pricing" className={`block w-full text-center px-5 py-2.5 rounded-xl ${d.btn} text-white text-sm font-semibold`}>Voir les tarifs</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Neon glow orbs */}
          <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-blue-500/[0.07] rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/[0.05] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/[0.04] rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #60a5fa 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          {/* Gradient line top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div className="text-center lg:text-left animate-[fadeInUp_0.6s_ease-out]">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${d.badge} text-xs font-semibold mb-6 tracking-wide shadow-[0_0_15px_rgba(59,130,246,0.08)] animate-pulse`}>
                <Zap className="w-3.5 h-3.5" />
                PLATEFORME #1 DES RESTAURATEURS
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.1] tracking-tight animate-[fadeInUp_0.8s_ease-out_0.1s_both]">
                <span className={d.tp}>Maitrisez vos marges.</span>
                <br />
                <span className={d.tp}>Augmentez vos </span>
                <span className={`bg-gradient-to-r ${d.accent} bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]`}>
                  profits.
                </span>
              </h1>

              <p className={`mt-6 text-lg sm:text-xl ${d.ts} max-w-xl mx-auto lg:mx-0 leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.2s_both]`}>
                La plateforme tout-en-un pour les restaurateurs qui veulent reprendre le controle de leurs couts matiere, optimiser leur carte et automatiser leurs commandes.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
                <Link
                  to="/pricing"
                  className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl ${d.btn} text-white font-semibold shadow-lg transition-all text-base`}
                >
                  Voir les tarifs <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => scrollTo('demo')}
                  className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-transparent ${d.tp} font-semibold border ${d.light ? 'border-slate-300 hover:border-blue-400' : 'border-white/20 hover:border-white/40'} hover:shadow-[0_0_15px_rgba(59,130,246,0.08)] transition-all text-base`}
                >
                  Voir la demo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className={`mt-3 text-sm ${d.ts} text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5 animate-[fadeInUp_0.8s_ease-out_0.4s_both]`}>
                <Lock className="w-3.5 h-3.5" /> Paiement securise via Stripe
              </p>
            </div>

            {/* Right — Product image */}
            <div className="hidden lg:block animate-[fadeInUp_1s_ease-out_0.3s_both]">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${d.light ? 'from-blue-500/[0.07] to-indigo-500/[0.07]' : 'from-blue-500/[0.12] to-indigo-500/[0.12]'} rounded-3xl blur-2xl`} />
                <div className={`relative ${d.cardBg} rounded-3xl p-8 shadow-lg`}>
                  {/* Hero image carousel */}
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${heroSlide * 100}%)` }}>
                      <img src="/images/hero/hero-1.webp" alt="RestauMargin Station en cuisine" className="w-full h-auto flex-shrink-0" loading="eager" />
                      <img src="/images/hero/hero-2.webp" alt="RestauMargin Station cuisine pro" className="w-full h-auto flex-shrink-0" loading="eager" />
                      <img src="/images/hero/hero-3.webp" alt="Chef utilisant RestauMargin" className="w-full h-auto flex-shrink-0" loading="eager" />
                    </div>
                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {[0, 1, 2].map(i => (
                        <button key={i} onClick={() => setHeroSlide(i)} className={`w-2 h-2 rounded-full transition-all ${heroSlide === i ? 'bg-blue-600 w-6' : 'bg-slate-400/50'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Floating badge */}
                <div className={`absolute -top-4 -right-4 bg-gradient-to-r ${d.accent} text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold`}>
                  Nouveau 2026
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="animate-[fadeInUp_1s_ease-out_0.5s_both]">
            <div className={`mt-16 ${d.cardBg} rounded-2xl py-8 px-4 shadow-lg`}>
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${d.light ? 'divide-slate-200' : 'divide-white/10'} md:divide-x`}>
                <StatCounter value={150} suffix="+" label="Restaurants equipes" />
                <StatCounter value={8} suffix="%" label="Cout matiere economise" />
                <StatCounter value={50} suffix="k" label="Pesees par mois" />
                <div className="text-center px-6">
                  <div className={`text-3xl sm:text-4xl font-extrabold ${d.tp} tracking-tight`}>4.8/5</div>
                  <div className={`text-sm ${d.ts} mt-1 font-medium`}>Satisfaction clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 2. TRUSTED BY ═══════════════════ */}
      <section className={`py-10 ${d.light ? 'border-y border-slate-200 bg-gray-50' : 'border-y border-white/10 bg-white/[0.02]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className={`text-center text-xs font-semibold ${d.ts} uppercase tracking-widest mb-6`}>
              Ils nous font confiance
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                { name: 'METRO' },
                { name: 'Transgourmet' },
                { name: 'Pomona' },
                { name: 'Sysco' },
                { name: 'Brake' },
              ].map((s) => (
                <span key={s.name} className={`${d.tag} px-5 py-2 rounded-full text-sm font-bold tracking-tight opacity-60 hover:opacity-100 transition-opacity select-none border`}>
                  {s.name}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ 3. PROBLEM -> SOLUTION ═══════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Problem */}
            <FadeIn>
              <div className={`${d.cardBg} rounded-2xl p-8 sm:p-10 h-full hover:border-red-500/30 transition-all duration-500 shadow-sm`}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-6">
                  <XCircle className="w-3.5 h-3.5" /> Le probleme
                </div>
                <div className="space-y-6">
                  {[
                    'Vous calculez vos marges sur Excel ou de tete',
                    'Vous ne savez pas quel plat est rentable',
                    'Les prix fournisseurs changent sans que vous le sachiez',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <XCircle className="w-4 h-4 text-red-400" />
                      </div>
                      <p className={`${d.ts} leading-relaxed`}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Solution */}
            <FadeIn delay={150}>
              <div className={`${d.cardBg} rounded-2xl p-8 sm:p-10 h-full hover:border-emerald-500/30 transition-all duration-500 shadow-sm`}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
                  <CheckCircle2 className="w-3.5 h-3.5" /> La solution RestauMargin
                </div>
                <div className="space-y-6">
                  {[
                    'Calcul automatique des marges en temps reel',
                    'Menu Engineering : identifiez vos Stars et vos Poids morts',
                    'Alertes prix fournisseurs + comparateur integre',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className={`${d.ts} leading-relaxed`}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 4. FEATURES BENTO GRID ═══════════════════ */}
      <section id="features" className={`py-20 sm:py-28 ${d.sectionAlt}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Fonctionnalites</p>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight ${d.tp}`}>
                Tout ce dont vous avez besoin pour{' '}
                <span className={`bg-gradient-to-r ${d.accent} bg-clip-text text-transparent`}>piloter vos marges</span>
              </h2>
            </div>
          </FadeIn>

          {/* Bento grid: 2 large + 4 small */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Large card 1 */}
            <FadeIn delay={0} className="lg:col-span-2">
              <div className={`group relative ${d.cardBg} shadow-sm rounded-2xl p-8 h-full hover:border-blue-400/30 transition-all duration-300 overflow-hidden`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition">
                    <ClipboardList className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${d.tp}`}>Fiches techniques intelligentes</h3>
                  <p className={`${d.ts} leading-relaxed max-w-lg`}>
                    Calculez le cout exact de chaque plat avec ingredients, quantites, etapes de preparation et couts actualises automatiquement. Marge brute, cout matiere, prix de vente — tout est calcule en temps reel.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Small card 1 */}
            <FadeIn delay={80}>
              <div className={`group ${d.cardBg} shadow-sm rounded-2xl p-7 h-full hover:border-emerald-400/30 transition-all duration-300`}>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition">
                  <BarChart3 className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${d.tp}`}>Menu Engineering</h3>
                <p className={`text-sm ${d.ts} leading-relaxed`}>Matrice BCG, identifiez vos plats stars et vos poids morts.</p>
              </div>
            </FadeIn>

            {/* Small card 2 */}
            <FadeIn delay={160}>
              <div className={`group ${d.cardBg} shadow-sm rounded-2xl p-7 h-full hover:border-orange-400/30 transition-all duration-300`}>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition">
                  <Truck className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${d.tp}`}>Gestion fournisseurs</h3>
                <p className={`text-sm ${d.ts} leading-relaxed`}>Comparateur prix, score /10, alertes et suivi tarifaire.</p>
              </div>
            </FadeIn>

            {/* Small card 3 */}
            <FadeIn delay={240}>
              <div className={`group ${d.cardBg} shadow-sm rounded-2xl p-7 h-full hover:border-purple-400/30 transition-all duration-300`}>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition">
                  <Thermometer className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${d.tp}`}>HACCP & Tracabilite</h3>
                <p className={`text-sm ${d.ts} leading-relaxed`}>Temperatures, nettoyage, conformite reglementaire.</p>
              </div>
            </FadeIn>

            {/* Large card 2 */}
            <FadeIn delay={320} className="lg:col-span-2">
              <div className={`group relative ${d.cardBg} shadow-sm rounded-2xl p-8 h-full hover:border-emerald-400/30 transition-all duration-300 overflow-hidden`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition">
                    <Scale className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${d.tp}`}>Station de pesee connectee</h3>
                  <p className={`${d.ts} leading-relaxed max-w-lg`}>
                    Pesez, calculez, maitrisez en temps reel. Connectez votre balance Bluetooth et suivez vos marges en direct pendant la preparation.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Small card 4 */}
            <FadeIn delay={400}>
              <div className={`group ${d.cardBg} shadow-sm rounded-2xl p-7 h-full hover:border-cyan-400/30 transition-all duration-300`}>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition">
                  <Brain className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${d.tp}`}>Assistant IA</h3>
                <p className={`text-sm ${d.ts} leading-relaxed`}>Claude analyse vos donnees et vous conseille en continu.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 5. HOW IT WORKS ═══════════════════ */}
      <section id="demo" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Comment ca marche</p>
              <h2 className={`text-3xl sm:text-4xl font-extrabold ${d.tp}`}>3 etapes pour piloter vos marges</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Choisissez votre abonnement', desc: 'Pro 29 euros ou Business 79 euros. Activation instantanee.', icon: Users },
              { num: '02', title: 'Activez votre compte', desc: 'Recevez votre code, creez votre espace en 2 minutes.', icon: Zap },
              { num: '03', title: 'Pilotez vos marges', desc: 'Dashboard, recettes, fournisseurs, tout est pret.', icon: TrendingUp },
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 120}>
                <div className="relative text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${d.accent} flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 shadow-lg`}>
                    {step.num}
                  </div>
                  <h3 className={`text-lg font-bold mb-3 ${d.tp}`}>{step.title}</h3>
                  <p className={`text-sm ${d.ts} leading-relaxed`}>{step.desc}</p>
                  {i < 2 && (
                    <ArrowRight className={`hidden md:block absolute top-8 -right-4 w-8 h-8 ${d.ts}`} />
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 6. INTEGRATIONS ═══════════════════ */}
      <section id="integrations" className={`py-20 sm:py-28 ${d.sectionAlt}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Compatibilite</p>
              <h2 className={`text-3xl sm:text-4xl font-extrabold leading-tight ${d.tp}`}>
                Compatible avec vos{' '}
                <span className={`bg-gradient-to-r ${d.accent} bg-clip-text text-transparent`}>
                  logiciels de caisse
                </span>
              </h2>
              <p className={`mt-4 text-lg ${d.ts} max-w-2xl mx-auto`}>
                RestauMargin se connecte a vos outils existants pour centraliser toutes vos donnees de vente et simplifier votre gestion.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Lightspeed', desc: 'Synchronisation des ventes et du catalogue produits' },
              { name: 'Square', desc: 'Import automatique des transactions et articles' },
              { name: 'SumUp', desc: 'Connexion directe avec votre terminal de paiement' },
              { name: 'Zelty', desc: 'Integration native avec votre caisse Zelty' },
              { name: 'Tiller', desc: 'Remontee des donnees de vente en temps reel' },
              { name: 'L\'Addition', desc: 'Compatibilite complete avec votre ecosysteme' },
            ].map((pos, i) => (
              <FadeIn key={pos.name} delay={i * 80}>
                <div className={`group ${d.cardBg} shadow-sm rounded-2xl p-6 h-full hover:border-blue-400/30 transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition">
                      <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className={`text-lg font-bold ${d.tp}`}>{pos.name}</h3>
                  </div>
                  <p className={`text-sm ${d.ts} leading-relaxed`}>{pos.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={500}>
            <p className={`text-center mt-10 text-sm ${d.ts}`}>
              Vous utilisez un autre logiciel ?{' '}
              <button onClick={() => scrollTo('contact')} className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 transition-colors">
                Contactez-nous
              </button>{' '}
              pour verifier la compatibilite.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ 7. PRICING ═══════════════════ */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Tarifs</p>
              <h2 className={`text-3xl sm:text-4xl font-extrabold ${d.tp}`}>
                Un plan pour chaque{' '}
                <span className={`bg-gradient-to-r ${d.accent} bg-clip-text text-transparent`}>restaurant</span>
              </h2>
              <p className={`mt-4 ${d.ts}`}>Sans engagement. Annulez quand vous voulez.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {/* Pro — Popular */}
            <FadeIn delay={100}>
              <div className={`relative ${d.cardBg} border-2 !border-blue-500 rounded-2xl p-8 h-full flex flex-col shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:shadow-[0_0_60px_rgba(59,130,246,0.18)] transition-all duration-500`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-500 text-white text-xs font-bold uppercase tracking-wide">
                  Populaire
                </div>
                <h3 className={`text-lg font-bold mb-1 mt-2 ${d.tp}`}>Pro</h3>
                <div className="flex items-end gap-1 mb-4">
                  <span className={`text-4xl font-extrabold ${d.tp}`}>29</span>
                  <span className={`${d.ts} text-sm mb-1`}>euros/mois</span>
                </div>
                <p className={`text-sm ${d.ts} mb-6`}>Pour optimiser et developper son restaurant.</p>
                <div className="space-y-3 mb-8 flex-1">
                  {['Dashboard & statistiques', 'Menu Engineering BCG', 'Gestion fournisseurs avancee', 'Export PDF / Excel', 'Support prioritaire'].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className={`text-sm ${d.ts}`}>{f}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://buy.stripe.com/9B614g1u2eRe9QU6vl87K04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                >
                  Choisir Pro
                </a>
              </div>
            </FadeIn>

            {/* Business */}
            <FadeIn delay={200}>
              <div className={`${d.cardBg} rounded-2xl p-8 h-full flex flex-col hover:border-emerald-500/30 transition-colors shadow-sm`}>
                <h3 className={`text-lg font-bold mb-1 ${d.tp}`}>Business</h3>
                <div className="flex items-end gap-1 mb-4">
                  <span className={`text-4xl font-extrabold ${d.tp}`}>79</span>
                  <span className={`${d.ts} text-sm mb-1`}>euros/mois</span>
                </div>
                <p className={`text-sm ${d.ts} mb-6`}>Pour les groupes multi-restaurants.</p>
                <div className="space-y-3 mb-8 flex-1">
                  {['Tout du plan Pro', 'Multi-restaurants', 'API & webhooks', 'Formation personnalisee', 'Account manager dedie'].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className={`text-sm ${d.ts}`}>{f}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://buy.stripe.com/4gMbIU5Ki4cAfbe1b187K05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center px-6 py-3 rounded-xl ${d.light ? 'bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200' : 'bg-white/10 text-white border border-white/20 hover:bg-white/15'} font-semibold transition-colors`}
                >
                  Choisir Business
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 8. TESTIMONIALS ═══════════════════ */}
      <section className={`py-20 sm:py-28 ${d.sectionAlt}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Temoignages</p>
              <h2 className={`text-3xl sm:text-4xl font-extrabold ${d.tp}`}>
                Ce que disent nos{' '}
                <span className={`bg-gradient-to-r ${d.accent} bg-clip-text text-transparent`}>clients</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className={`${d.cardBg} rounded-2xl p-7 h-full flex flex-col hover:border-purple-500/30 transition-all duration-500 group shadow-sm`}>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'text-amber-400 fill-amber-400' : d.light ? 'text-slate-200' : 'text-white/20'}`} />
                    ))}
                  </div>
                  <p className={`${d.ts} text-sm leading-relaxed mb-6 flex-1 italic`}>"{t.quote}"</p>
                  <div>
                    <div className={`font-semibold ${d.tp} text-sm`}>{t.name}</div>
                    <div className={`text-xs ${d.ts}`}>{t.role} — {t.place}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 9. FAQ ═══════════════════ */}
      <section id="faq" className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">FAQ</p>
              <h2 className={`text-3xl sm:text-4xl font-extrabold ${d.tp}`}>Questions frequentes</h2>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="space-y-4">
              {faqItems.map((item, i) => {
                /* Inline FAQ to use theme vars */
                return <FAQItemThemed key={i} q={item.q} a={item.a} d={d} />;
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ 10. CONTACT FORM ═══════════════════ */}
      <section id="contact" className={`py-20 sm:py-28 ${d.sectionAlt}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Contact</p>
              <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${d.tp}`}>
                Parlons de votre{' '}
                <span className={`bg-gradient-to-r ${d.accent} bg-clip-text text-transparent`}>projet</span>
              </h2>
              <p className={d.ts}>Notre equipe vous recontacte sous 24h.</p>
            </div>

            {contactSent ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-emerald-400">Demande envoyee !</p>
                <p className={`text-sm ${d.ts} mt-1`}>Nous vous recontactons tres vite.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className={`${d.cardBg} rounded-2xl p-8 space-y-5 shadow-sm`}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-sm font-medium ${d.ts} mb-1.5`}>Nom</label>
                    <input
                      type="text"
                      required
                      value={contactForm.nom}
                      onChange={(e) => setContactForm({ ...contactForm, nom: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl ${d.inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${d.ts} mb-1.5`}>Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl ${d.inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${d.ts} mb-1.5`}>Telephone</label>
                  <input
                    type="tel"
                    value={contactForm.telephone}
                    onChange={(e) => setContactForm({ ...contactForm, telephone: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl ${d.inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${d.ts} mb-1.5`}>Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl ${d.inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                    placeholder="Decrivez votre besoin..."
                  />
                </div>
                {contactError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                    {contactError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={contactLoading}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl ${d.btn} text-white font-semibold text-base transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {contactLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ 11. FOOTER ═══════════════════ */}
      <footer className={`border-t ${d.footerBorder}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${d.accent} flex items-center justify-center`}>
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className={`text-lg font-bold ${d.tp}`}>RestauMargin</span>
              </div>
              <p className={`text-sm ${d.ts} leading-relaxed`}>
                La plateforme de gestion des marges pour la restauration professionnelle.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className={`flex items-center gap-1.5 text-xs ${d.ts}`}>
                  <Shield className="w-3.5 h-3.5 text-blue-400" /> Donnees EU
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${d.ts}`}>
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> SSL
                </div>
              </div>
            </div>

            {/* Produit */}
            <div>
              <h4 className={`font-semibold ${d.tp} text-sm mb-4`}>Produit</h4>
              <ul className={`space-y-2.5 text-sm ${d.ts}`}>
                <li><button onClick={() => scrollTo('features')} className={`${d.th} transition-colors`}>Fonctionnalites</button></li>
                <li><Link to="/pricing" className={`${d.th} transition-colors`}>Tarifs</Link></li>
                <li><button onClick={() => scrollTo('integrations')} className={`${d.th} transition-colors`}>Integrations</button></li>
                <li><button onClick={() => scrollTo('faq')} className={`${d.th} transition-colors`}>FAQ</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className={`font-semibold ${d.tp} text-sm mb-4`}>Legal</h4>
              <ul className={`space-y-2.5 text-sm ${d.ts}`}>
                <li><Link to="/mentions-legales" className={`${d.th} transition-colors`}>Mentions legales</Link></li>
                <li><Link to="/cgu" className={`${d.th} transition-colors`}>CGU</Link></li>
                <li><Link to="/politique-confidentialite" className={`${d.th} transition-colors`}>Politique de confidentialite</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className={`font-semibold ${d.tp} text-sm mb-4`}>Contact</h4>
              <ul className={`space-y-2.5 text-sm ${d.ts}`}>
                <li className="flex items-center gap-2">
                  <Mail className={`w-4 h-4 ${d.ts}`} />
                  <a href="mailto:contact@restaumargin.fr" className={`${d.th} transition-colors`}>contact@restaumargin.fr</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className={`w-4 h-4 ${d.ts}`} />
                  <span>01 23 45 67 89</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className={`border-t ${d.light ? 'border-slate-200' : 'border-white/10'} py-6 flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <p className={`text-xs ${d.ts}`}>RestauMargin &copy; 2026. Tous droits reserves.</p>
            <div className={`flex items-center gap-6 text-xs ${d.ts}`}>
              <Link to="/mentions-legales" className={`${d.th} transition-colors`}>Mentions legales</Link>
              <Link to="/cgu" className={`${d.th} transition-colors`}>CGU</Link>
              <Link to="/politique-confidentialite" className={`${d.th} transition-colors`}>Confidentialite</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════ DESIGN SELECTOR ═══════════════════ */}
      <div className="fixed bottom-6 right-6 z-[60]">
        {designPanelOpen && (
          <div className={`absolute bottom-14 right-0 w-64 ${d.light ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900 border-white/10 shadow-2xl'} border rounded-2xl p-4 mb-2`}>
            <p className={`text-xs font-semibold ${d.ts} uppercase tracking-widest mb-3`}>Choisir un design</p>
            <div className="space-y-1.5 max-h-80 overflow-y-auto">
              {DESIGNS.map((design, i) => (
                <button
                  key={design.id}
                  onClick={() => { setDesignIndex(i); setDesignPanelOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    i === designIndex
                      ? `bg-gradient-to-r ${design.accent} text-white`
                      : `${d.light ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-300 hover:bg-white/10'}`
                  }`}
                >
                  {design.name}
                  {design.light && <span className="ml-1.5 text-[10px] opacity-60">(clair)</span>}
                </button>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setDesignPanelOpen(!designPanelOpen)}
          className={`w-12 h-12 rounded-full bg-gradient-to-r ${d.accent} text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}
          title="Changer de design"
        >
          <Palette className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}

/* ─────────────────────── Themed FAQ Item ─────────────────────── */

function FAQItemThemed({ q, a, d }: { q: string; a: string; d: DesignTheme }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${d.cardBg} rounded-2xl overflow-hidden shadow-sm`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-6 py-5 text-left ${d.light ? 'hover:bg-slate-50' : 'hover:bg-white/5'} transition-colors`}
      >
        <span className={`font-semibold ${d.tp} pr-4`}>{q}</span>
        <ChevronDown className={`w-5 h-5 ${d.ts} shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-60 pb-5' : 'max-h-0'}`}>
        <p className={`px-6 text-sm ${d.ts} leading-relaxed`}>{a}</p>
      </div>
    </div>
  );
}
