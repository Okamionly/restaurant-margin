import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChefHat, ClipboardList, Truck, BarChart3,
  ArrowRight, CheckCircle2, TrendingUp, Zap, Star,
  Package, Users, Menu, X as XIcon, Shield, Lock, Mail,
  Scale, Tablet, Bluetooth, ChevronDown, Phone, Send, Loader2,
  XCircle, Brain, Thermometer,
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

function StatCounter({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const { ref, visible } = useInView(0.3);
  const count = useAnimatedCounter(value, 1800, visible);
  return (
    <div ref={ref} className="text-center px-6">
      <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-b from-blue-600 to-blue-400 bg-clip-text text-transparent tracking-tight">
        {count}{suffix}
      </div>
      <div className="text-sm text-slate-400 mt-1 font-medium">{label}</div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-900 pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-60 pb-5' : 'max-h-0'}`}>
        <p className="px-6 text-sm text-slate-300 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

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
    q: 'Le Kit Station est-il obligatoire ?',
    a: 'Non. Le Kit Station est un accessoire optionnel pour les cuisines qui veulent la pesee connectee en temps reel. L\'application RestauMargin fonctionne parfaitement seule sur smartphone, tablette ou ordinateur.',
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

  const [activeDesign, setActiveDesign] = useState(0);

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

  const DESIGNS = [
    {
      id: 0, name: 'Obsidian Pro', font: "'Sora', sans-serif",
      hero: 'bg-gradient-to-br from-gray-950 via-slate-900 to-black',
      accent: 'text-blue-400', btn: 'bg-blue-600 hover:bg-blue-500',
      nav: 'bg-black/80 backdrop-blur-xl border-b border-white/5',
      badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      tag: 'Inspiré Toast POS',
    },
    {
      id: 1, name: 'Arctic Clean', font: "'DM Sans', sans-serif",
      hero: 'bg-gradient-to-br from-slate-50 via-white to-blue-50',
      accent: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700',
      nav: 'bg-white/90 backdrop-blur-xl border-b border-slate-200',
      badge: 'bg-blue-50 text-blue-700 border border-blue-200',
      tag: 'Inspiré Lightspeed',
      light: true,
    },
    {
      id: 2, name: 'Midnight Neon', font: "'Manrope', sans-serif",
      hero: 'bg-[#080C14]',
      accent: 'text-cyan-400', btn: 'bg-cyan-500 hover:bg-cyan-400',
      nav: 'bg-[#080C14]/95 backdrop-blur-xl border-b border-cyan-500/10',
      badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      tag: 'Inspiré Linear',
    },
    {
      id: 3, name: 'Ivory Minimal', font: "'Outfit', sans-serif",
      hero: 'bg-gradient-to-b from-zinc-900 to-zinc-950',
      accent: 'text-amber-400', btn: 'bg-amber-500 hover:bg-amber-400',
      nav: 'bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-700',
      badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      tag: 'Inspiré Square',
    },
    {
      id: 4, name: 'Pure Black', font: "'Plus Jakarta Sans', sans-serif",
      hero: 'bg-black',
      accent: 'text-white', btn: 'bg-white text-black hover:bg-gray-100',
      nav: 'bg-black/95 backdrop-blur-xl border-b border-white/10',
      badge: 'bg-white/5 text-white border border-white/10',
      tag: 'Inspiré Vercel',
    },
    {
      id: 5, name: 'Indigo Glass', font: "'Inter', sans-serif",
      hero: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950',
      accent: 'text-violet-400', btn: 'bg-violet-600 hover:bg-violet-500',
      nav: 'bg-indigo-950/80 backdrop-blur-xl border-b border-violet-500/10',
      badge: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
      tag: 'Inspiré Figma',
    },
    {
      id: 6, name: 'Forest Pro', font: "'Sora', sans-serif",
      hero: 'bg-gradient-to-br from-emerald-950 via-slate-900 to-gray-950',
      accent: 'text-emerald-400', btn: 'bg-emerald-500 hover:bg-emerald-400',
      nav: 'bg-slate-950/90 backdrop-blur-xl border-b border-emerald-500/10',
      badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      tag: 'Inspiré Stripe',
    },
    {
      id: 7, name: 'Rose Elite', font: "'DM Sans', sans-serif",
      hero: 'bg-gradient-to-br from-rose-950 via-slate-900 to-gray-950',
      accent: 'text-rose-400', btn: 'bg-rose-500 hover:bg-rose-400',
      nav: 'bg-slate-950/90 backdrop-blur-xl border-b border-rose-500/10',
      badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      tag: 'Inspiré Notion',
    },
  ];
  const d = DESIGNS[activeDesign];

  return (
    <div style={{ fontFamily: d.font }} className={`min-h-screen ${d.hero} text-slate-900 overflow-x-hidden scroll-smooth`}>

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? d.nav + ' shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-700/25">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">RestauMargin</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-sm text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">Fonctionnalites</button>
            <button onClick={() => scrollTo('station')} className="text-sm text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">Kit Station</button>
            <button onClick={() => scrollTo('pricing')} className="text-sm text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">Tarifs</button>
            <button onClick={() => scrollTo('faq')} className="text-sm text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">FAQ</button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-400 hover:text-slate-900 transition-colors px-3 py-2">Connexion</Link>
            <Link to="/pricing" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-600/40 hover:shadow-blue-500/60">
              Voir les tarifs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-slate-900">
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollTo('features')} className="block w-full text-left text-sm text-slate-300 hover:text-slate-900 py-2">Fonctionnalites</button>
              <button onClick={() => scrollTo('station')} className="block w-full text-left text-sm text-slate-300 hover:text-slate-900 py-2">Kit Station</button>
              <button onClick={() => scrollTo('pricing')} className="block w-full text-left text-sm text-slate-300 hover:text-slate-900 py-2">Tarifs</button>
              <button onClick={() => scrollTo('faq')} className="block w-full text-left text-sm text-slate-300 hover:text-slate-900 py-2">FAQ</button>
              <hr className="border-slate-200" />
              <Link to="/login" className="block text-sm text-slate-300 hover:text-slate-900 py-2">Connexion</Link>
              <Link to="/pricing" className="block w-full text-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold">Voir les tarifs</Link>
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
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wide animate-pulse ${d.badge}`}>
                <Zap className="w-3.5 h-3.5" />
                PLATEFORME #1 DES RESTAURATEURS
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.1] tracking-tight animate-[fadeInUp_0.8s_ease-out_0.1s_both]">
                <span className="text-slate-900">Maitrisez vos marges.</span>
                <br />
                <span className="text-slate-900">Augmentez vos </span>
                <span className={`${d.accent} drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]`}>
                  profits.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
                La plateforme tout-en-un pour les restaurateurs qui veulent reprendre le controle de leurs couts matiere, optimiser leur carte et automatiser leurs commandes.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
                <Link
                  to="/pricing"
                  className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all text-base ${d.btn}`}
                >
                  Voir les tarifs <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => scrollTo('demo')}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-transparent text-slate-900 font-semibold border border-slate-300 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.08)] transition-all text-base"
                >
                  Voir la demo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-400 text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
                <Lock className="w-3.5 h-3.5" /> Paiement securise via Stripe
              </p>
            </div>

            {/* Right — Product image */}
            <div className="hidden lg:block animate-[fadeInUp_1s_ease-out_0.3s_both]">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.07] to-indigo-500/[0.07] rounded-3xl blur-2xl" />
                <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">
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
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold">
                  Nouveau 2026
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="animate-[fadeInUp_1s_ease-out_0.5s_both]">
            <div className="mt-16 bg-white border border-slate-200 rounded-2xl py-8 px-4 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-slate-200 md:divide-x">
                <StatCounter value={150} suffix="+" label="Restaurants equipes" />
                <StatCounter value={8} suffix="%" label="Cout matiere economise" />
                <StatCounter value={50} suffix="k" label="Pesees par mois" />
                <div className="text-center px-6">
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">4.8/5</div>
                  <div className="text-sm text-slate-400 mt-1 font-medium">Satisfaction clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 2. TRUSTED BY ═══════════════════ */}
      <section className="py-10 border-y border-slate-200 bg-gray-50" style={{ borderImage: 'linear-gradient(to right, transparent, rgba(59,130,246,0.15), rgba(168,85,247,0.15), transparent) 1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
              Ils nous font confiance
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                { name: 'METRO', color: 'bg-slate-100 text-slate-400' },
                { name: 'Transgourmet', color: 'bg-slate-100 text-slate-400' },
                { name: 'Pomona', color: 'bg-slate-100 text-slate-400' },
                { name: 'Sysco', color: 'bg-slate-100 text-slate-400' },
                { name: 'Brake', color: 'bg-slate-100 text-slate-400' },
              ].map((s) => (
                <span key={s.name} className={`${s.color} px-5 py-2 rounded-full text-sm font-bold tracking-tight opacity-60 hover:opacity-100 transition-opacity select-none border border-slate-200`}>
                  {s.name}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ 3. PROBLEM → SOLUTION ═══════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Problem */}
            <FadeIn>
              <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 h-full hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.08)] transition-all duration-500 shadow-sm">
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
                      <p className="text-slate-300 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Solution */}
            <FadeIn delay={150}>
              <div className="bg-white border border-emerald-200 rounded-2xl p-8 sm:p-10 h-full hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] transition-all duration-500 shadow-sm">
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
                      <p className="text-slate-300 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 4. FEATURES BENTO GRID ═══════════════════ */}
      <section id="features" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Fonctionnalites</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Tout ce dont vous avez besoin pour{' '}
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">piloter vos marges</span>
              </h2>
            </div>
          </FadeIn>

          {/* Bento grid: 2 large + 4 small */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Large card 1 */}
            <FadeIn delay={0} className="lg:col-span-2">
              <div className="group relative bg-white border border-slate-200 shadow-sm rounded-2xl p-8 h-full hover:border-blue-400 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition">
                    <ClipboardList className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Fiches techniques intelligentes</h3>
                  <p className="text-slate-300 leading-relaxed max-w-lg">
                    Calculez le cout exact de chaque plat avec ingredients, quantites, etapes de preparation et couts actualises automatiquement. Marge brute, cout matiere, prix de vente — tout est calcule en temps reel.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Small card 1 */}
            <FadeIn delay={80}>
              <div className="group bg-white border border-slate-200 shadow-sm rounded-2xl p-7 h-full hover:border-emerald-400 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition">
                  <BarChart3 className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Menu Engineering</h3>
                <p className="text-sm text-slate-300 leading-relaxed">Matrice BCG, identifiez vos plats stars et vos poids morts.</p>
              </div>
            </FadeIn>

            {/* Small card 2 */}
            <FadeIn delay={160}>
              <div className="group bg-white border border-slate-200 shadow-sm rounded-2xl p-7 h-full hover:border-orange-400 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition">
                  <Truck className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Gestion fournisseurs</h3>
                <p className="text-sm text-slate-300 leading-relaxed">Comparateur prix, score /10, alertes et suivi tarifaire.</p>
              </div>
            </FadeIn>

            {/* Small card 3 */}
            <FadeIn delay={240}>
              <div className="group bg-white border border-slate-200 shadow-sm rounded-2xl p-7 h-full hover:border-purple-400 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition">
                  <Thermometer className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">HACCP & Tracabilite</h3>
                <p className="text-sm text-slate-300 leading-relaxed">Temperatures, nettoyage, conformite reglementaire.</p>
              </div>
            </FadeIn>

            {/* Large card 2 */}
            <FadeIn delay={320} className="lg:col-span-2">
              <div className="group relative bg-white border border-slate-200 shadow-sm rounded-2xl p-8 h-full hover:border-emerald-400 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition">
                    <Scale className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Kit Station Balance + Tablette</h3>
                  <p className="text-slate-300 leading-relaxed max-w-lg">
                    Pesez, calculez, maitrisez en temps reel. La premiere station de pesee connectee concue pour la restauration. Balance integree 5kg + tablette 11" + logiciel de gestion des marges.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Small card 4 */}
            <FadeIn delay={400}>
              <div className="group bg-white border border-slate-200 shadow-sm rounded-2xl p-7 h-full hover:border-cyan-400 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition">
                  <Brain className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Assistant IA</h3>
                <p className="text-sm text-slate-300 leading-relaxed">Claude analyse vos donnees et vous conseille en continu.</p>
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
              <h2 className="text-3xl sm:text-4xl font-extrabold">3 etapes pour piloter vos marges</h2>
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
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-600/25">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                  {i < 2 && (
                    <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-slate-300" />
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 6. KIT STATION ═══════════════════ */}
      <section id="station" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Content */}
            <FadeIn>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
                  <Package className="w-3.5 h-3.5" /> Produit physique
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-6">
                  Kit Station —{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    Balance connectee + Tablette
                  </span>
                </h2>
                <p className="text-lg text-slate-300 mb-8">
                  Le support EST la balance. Plateau inox alimentaire, bras solidaire, moule silicone pour glisser la tablette. Un seul produit, zero cable.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    'Pesee BLE 5kg, precision 0.5g',
                    'Tablette 11" Samsung Galaxy Tab A9+',
                    'Fiches techniques auto-remplies',
                    'Marges en direct pendant la preparation',
                    'IP54 resistant aux eclaboussures',
                    '8h d\'autonomie batterie USB-C',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollTo('contact')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25 text-base"
                >
                  Commander le Kit — 1 200 euros HT <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex flex-wrap gap-3 mt-6">
                  {['Balance 5kg', 'BLE 5.0', 'Inox 304L'].map((badge) => (
                    <span key={badge} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-400 font-medium">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right — Product image */}
            <FadeIn delay={200}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.07] to-blue-500/[0.07] rounded-3xl blur-2xl" />
                <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">
                  <video
                    src="/images/hero/station-demo.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto rounded-2xl"
                    poster="/images/hero/hero-1.webp"
                  />
                  <div className="grid grid-cols-3 gap-3 mt-6 text-center">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <Scale className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                      <div className="text-xs text-slate-400">Capacite</div>
                      <div className="text-sm font-semibold">5 kg</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <Bluetooth className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <div className="text-xs text-slate-400">Connexion</div>
                      <div className="text-sm font-semibold">BLE 5.0</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <Tablet className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                      <div className="text-xs text-slate-400">Ecran</div>
                      <div className="text-sm font-semibold">11" FHD</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 7. PRICING ═══════════════════ */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Tarifs</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold">
                Un plan pour chaque{' '}
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">restaurant</span>
              </h2>
              <p className="mt-4 text-slate-400">Sans engagement. Annulez quand vous voulez.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {/* Pro — Popular */}
            <FadeIn delay={100}>
              <div className="relative bg-white border-2 border-blue-500 rounded-2xl p-8 h-full flex flex-col shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:shadow-[0_0_60px_rgba(59,130,246,0.18)] transition-all duration-500">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-500 text-white text-xs font-bold uppercase tracking-wide">
                  Populaire
                </div>
                <h3 className="text-lg font-bold mb-1 mt-2">Pro</h3>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-4xl font-extrabold">29</span>
                  <span className="text-slate-400 text-sm mb-1">euros/mois</span>
                </div>
                <p className="text-sm text-slate-400 mb-6">Pour optimiser et developper son restaurant.</p>
                <div className="space-y-3 mb-8 flex-1">
                  {['Dashboard & statistiques', 'Menu Engineering BCG', 'Gestion fournisseurs avancee', 'Export PDF / Excel', 'Support prioritaire'].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-sm text-slate-300">{f}</span>
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
              <div className="bg-white border border-slate-200 rounded-2xl p-8 h-full flex flex-col hover:border-slate-300 transition-colors shadow-sm">
                <h3 className="text-lg font-bold mb-1">Business</h3>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-4xl font-extrabold">79</span>
                  <span className="text-slate-400 text-sm mb-1">euros/mois</span>
                </div>
                <p className="text-sm text-slate-400 mb-6">Pour les groupes multi-restaurants.</p>
                <div className="space-y-3 mb-8 flex-1">
                  {['Tout du plan Pro', 'Multi-restaurants', 'API & webhooks', 'Formation personnalisee', 'Account manager dedie'].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-sm text-slate-300">{f}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://buy.stripe.com/4gMbIU5Ki4cAfbe1b187K05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-6 py-3 rounded-xl bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 transition-colors border border-slate-300"
                >
                  Choisir Business
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 8. TESTIMONIALS ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Temoignages</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold">
                Ce que disent nos{' '}
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">clients</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-white border border-slate-200 rounded-2xl p-7 h-full flex flex-col hover:border-purple-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.06)] transition-all duration-500 group shadow-sm">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1 italic">"{t.quote}"</p>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role} — {t.place}</div>
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
              <h2 className="text-3xl sm:text-4xl font-extrabold">Questions frequentes</h2>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ 10. CONTACT FORM ═══════════════════ */}
      <section id="contact" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Contact</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Parlons de votre{' '}
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">projet</span>
              </h2>
              <p className="text-slate-400">Notre equipe vous recontacte sous 24h.</p>
            </div>

            {contactSent ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-emerald-400">Demande envoyee !</p>
                <p className="text-sm text-slate-400 mt-1">Nous vous recontactons tres vite.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 space-y-5 shadow-sm">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Nom</label>
                    <input
                      type="text"
                      required
                      value={contactForm.nom}
                      onChange={(e) => setContactForm({ ...contactForm, nom: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Telephone</label>
                  <input
                    type="tel"
                    value={contactForm.telephone}
                    onChange={(e) => setContactForm({ ...contactForm, telephone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-slate-400"
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
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed"
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
      <footer className="border-t border-slate-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">RestauMargin</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                La plateforme de gestion des marges pour la restauration professionnelle.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Shield className="w-3.5 h-3.5 text-blue-400" /> Donnees EU
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> SSL
                </div>
              </div>
            </div>

            {/* Produit */}
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4">Produit</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><button onClick={() => scrollTo('features')} className="hover:text-slate-900 transition-colors">Fonctionnalites</button></li>
                <li><Link to="/pricing" className="hover:text-slate-900 transition-colors">Tarifs</Link></li>
                <li><Link to="/station-produit" className="hover:text-slate-900 transition-colors">Kit Station</Link></li>
                <li><button onClick={() => scrollTo('faq')} className="hover:text-slate-900 transition-colors">FAQ</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><Link to="/mentions-legales" className="hover:text-slate-900 transition-colors">Mentions legales</Link></li>
                <li><Link to="/cgu" className="hover:text-slate-900 transition-colors">CGU</Link></li>
                <li><Link to="/politique-confidentialite" className="hover:text-slate-900 transition-colors">Politique de confidentialite</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-slate-900 text-sm mb-4">Contact</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-300" />
                  <a href="mailto:contact@restaumargin.fr" className="hover:text-slate-900 transition-colors">contact@restaumargin.fr</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-300" />
                  <span>01 23 45 67 89</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-slate-200 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-300">RestauMargin &copy; 2026. Tous droits reserves.</p>
            <div className="flex items-center gap-6 text-xs text-slate-300">
              <Link to="/mentions-legales" className="hover:text-slate-800 transition-colors">Mentions legales</Link>
              <Link to="/cgu" className="hover:text-slate-800 transition-colors">CGU</Link>
              <Link to="/politique-confidentialite" className="hover:text-slate-800 transition-colors">Confidentialite</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Design Switcher - Floating */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="flex flex-col items-end gap-2">
          {/* Designs panel (visible on hover) */}
          <div className="hidden group-hover:flex flex-col gap-1.5 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-3 shadow-2xl max-h-80 overflow-y-auto">
            {DESIGNS.map((design, idx) => (
              <button
                key={design.id}
                onClick={() => setActiveDesign(idx)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all text-xs font-medium whitespace-nowrap ${
                  activeDesign === idx
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-current opacity-70 flex-shrink-0" />
                <span>{design.name}</span>
                <span className="text-[10px] opacity-60 ml-1">{design.tag}</span>
              </button>
            ))}
          </div>
          {/* Toggle button */}
          <button className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-4" /></svg>
          </button>
        </div>
      </div>

    </div>
  );
}
