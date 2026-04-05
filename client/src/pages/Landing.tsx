import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChefHat, ClipboardList, Truck, BarChart3,
  ArrowRight, CheckCircle2, TrendingUp, Zap, Star,
  Users, Menu, X as XIcon, Shield, Lock, Mail,
  Scale, ChevronDown, Phone, Send, Loader2,
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
  const [showExitPopup, setShowExitPopup] = useState(false);

  // Newsletter slide-in state
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);

  // Newsletter slide-in: show after 30s, once only, not if logged in
  useEffect(() => {
    const dismissed = localStorage.getItem('newsletterDismissed');
    const isLoggedIn = !!localStorage.getItem('token');
    if (dismissed || isLoggedIn) return;
    const timer = setTimeout(() => setShowNewsletter(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterLoading(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newsletterEmail,
          source: 'newsletter',
          message: 'Inscription newsletter mercuriale',
        }),
      });
      setNewsletterSent(true);
      localStorage.setItem('newsletterDismissed', '1');
    } catch {
      // silently fail
    } finally {
      setNewsletterLoading(false);
    }
  };

  const dismissNewsletter = () => {
    setShowNewsletter(false);
    localStorage.setItem('newsletterDismissed', '1');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Exit-intent popup: show once per session, not on mobile, not if logged in
  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    const alreadyShown = localStorage.getItem('exitPopupShown');
    const isLoggedIn = !!localStorage.getItem('token');
    if (isMobile || alreadyShown || isLoggedIn) return;

    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY < 10) {
        setShowExitPopup(true);
        localStorage.setItem('exitPopupShown', '1');
        document.removeEventListener('mouseout', handleMouseOut);
      }
    };
    document.addEventListener('mouseout', handleMouseOut);
    return () => document.removeEventListener('mouseout', handleMouseOut);
  }, []);

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

  const StatCounter = ({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) => {
    const { ref, visible } = useInView(0.3);
    const count = useAnimatedCounter(value, 1800, visible);
    return (
      <div ref={ref} className="text-center px-6">
        <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-b from-teal-500 to-teal-600 bg-clip-text text-transparent tracking-tight">
          {count}{suffix}
        </div>
        <div className="text-sm text-gray-500 mt-1 font-medium">{label}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden scroll-smooth" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">RestauMargin</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Fonctionnalites</button>
            <button onClick={() => scrollTo('pricing')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">Tarifs</button>
            <button onClick={() => scrollTo('faq')} className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">FAQ</button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-2">Connexion</Link>
            <Link to="/login?mode=register" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all shadow-lg">
              Essai gratuit 14 jours <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-500 hover:text-gray-900">
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 border-t border-gray-200 backdrop-blur-xl shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollTo('features')} className="block w-full text-left text-sm text-gray-500 hover:text-gray-900 py-2">Fonctionnalites</button>
              <button onClick={() => scrollTo('pricing')} className="block w-full text-left text-sm text-gray-500 hover:text-gray-900 py-2">Tarifs</button>
              <button onClick={() => scrollTo('faq')} className="block w-full text-left text-sm text-gray-500 hover:text-gray-900 py-2">FAQ</button>
              <hr className="border-gray-200" />
              <Link to="/login" className="block text-sm text-gray-500 hover:text-gray-900 py-2">Connexion</Link>
              <Link to="/login?mode=register" className="block w-full text-center px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold">Essai gratuit 14 jours</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-teal-500/[0.05] rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-400/[0.04] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/[0.03] rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #0d9488 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div className="text-center lg:text-left animate-[fadeInUp_0.6s_ease-out]">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold mb-6 tracking-wide shadow-[0_0_15px_rgba(13,148,136,0.08)]">
                <Zap className="w-3.5 h-3.5" />
                PLATEFORME #1 DES RESTAURATEURS
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.1] tracking-tight animate-[fadeInUp_0.8s_ease-out_0.1s_both]">
                <span className="text-gray-900">Maitrisez vos marges.</span>
                <br />
                <span className="text-gray-900">Augmentez vos </span>
                <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(13,148,136,0.2)]">
                  profits.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
                La plateforme tout-en-un pour les restaurateurs qui veulent reprendre le controle de leurs couts matiere, optimiser leur carte et automatiser leurs commandes.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
                <Link
                  to="/login?mode=register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-lg transition-all text-base"
                >
                  Essai gratuit 14 jours <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => scrollTo('demo')}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-transparent text-gray-900 font-semibold border border-gray-300 hover:border-teal-400 hover:shadow-[0_0_15px_rgba(13,148,136,0.08)] transition-all text-base"
                >
                  Voir la demo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-500 text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
                <Shield className="w-3.5 h-3.5" /> Pas de carte bancaire requise
              </p>
            </div>

            {/* Right -- Product image */}
            <div className="hidden lg:block animate-[fadeInUp_1s_ease-out_0.3s_both]">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.07] to-emerald-500/[0.07] rounded-3xl blur-2xl" />
                <div className="relative bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-3xl p-8 transition-shadow">
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${heroSlide * 100}%)` }}>
                      <img src="/images/hero/hero-1.webp" alt="RestauMargin Station en cuisine" className="w-full h-auto flex-shrink-0" loading="eager" />
                      <img src="/images/hero/hero-2.webp" alt="RestauMargin Station cuisine pro" className="w-full h-auto flex-shrink-0" loading="eager" />
                      <img src="/images/hero/hero-3.webp" alt="Chef utilisant RestauMargin" className="w-full h-auto flex-shrink-0" loading="eager" />
                    </div>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {[0, 1, 2].map(i => (
                        <button key={i} onClick={() => setHeroSlide(i)} className={`w-2 h-2 rounded-full transition-all ${heroSlide === i ? 'bg-teal-600 w-6' : 'bg-gray-400/50'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold">
                  Nouveau 2026
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="animate-[fadeInUp_1s_ease-out_0.5s_both]">
            <div className="mt-16 bg-white border border-gray-200 shadow-sm rounded-2xl py-8 px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-gray-200 md:divide-x">
                <StatCounter value={150} suffix="+" label="Restaurants equipes" />
                <StatCounter value={8} suffix="%" label="Cout matiere economise" />
                <StatCounter value={50} suffix="k" label="Pesees par mois" />
                <div className="text-center px-6">
                  <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">4.8/5</div>
                  <div className="text-sm text-gray-500 mt-1 font-medium">Satisfaction clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 2. COMPATIBLE SUPPLIERS ═══════════════════ */}
      <section className="py-10 border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
              Compatible avec vos fournisseurs
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {['METRO', 'Transgourmet', 'Pomona', 'Sysco', 'Brake'].map((name) => (
                <span key={name} className="bg-gray-100 border border-gray-200 text-gray-500 px-5 py-2 rounded-full text-sm font-bold tracking-tight opacity-60 hover:opacity-100 transition-opacity select-none">
                  {name}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ 2b. SOCIAL PROOF ═══════════════════ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-sm font-semibold mb-4">
                <Star className="w-4 h-4 fill-teal-500 text-teal-500" />
                4.8/5 satisfaction
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                150+ restaurants utilisent RestauMargin
              </h2>
              <p className="text-gray-500 text-sm">
                Ils ont repris le controle de leurs marges
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Sophie Martin',
                  city: 'Lyon',
                  type: 'Brasserie',
                  quote: "En 2 mois, on a identifie 8 plats qui nous faisaient perdre de l'argent. Nos marges ont augmente de 4 points.",
                },
                {
                  name: 'Karim Benali',
                  city: 'Paris',
                  type: 'Restaurant gastronomique',
                  quote: "Fini les tableurs Excel. Je vois en temps reel l'impact de chaque changement de prix fournisseur sur mes plats.",
                },
                {
                  name: 'Marie Dupont',
                  city: 'Bordeaux',
                  type: 'Bistrot',
                  quote: "Simple, rapide, efficace. Meme mon chef qui deteste l'informatique l'utilise tous les jours.",
                },
              ].map((t, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-teal-300 transition-colors duration-300">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    &laquo;&nbsp;{t.quote}&nbsp;&raquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.type} — {t.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ 3. PROBLEM -> SOLUTION ═══════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <FadeIn>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 h-full hover:border-red-500/30 transition-all duration-500 shadow-sm">
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
                      <p className="text-gray-500 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 h-full hover:border-emerald-500/30 transition-all duration-500 shadow-sm">
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
                      <p className="text-gray-500 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 4. FEATURES BENTO GRID ═══════════════════ */}
      <section id="features" className="py-20 sm:py-28 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest mb-3">Fonctionnalites</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
                Tout ce dont vous avez besoin pour{' '}
                <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">piloter vos marges</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FadeIn delay={0} className="lg:col-span-2">
              <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 h-full hover:border-teal-400/30 transition-all duration-300 overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-5 group-hover:bg-teal-500/20 transition">
                    <ClipboardList className="w-7 h-7 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Fiches techniques intelligentes</h3>
                  <p className="text-gray-500 leading-relaxed max-w-lg">
                    Calculez le cout exact de chaque plat avec ingredients, quantites, etapes de preparation et couts actualises automatiquement. Marge brute, cout matiere, prix de vente — tout est calcule en temps reel.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={80}>
              <div className="group bg-white border border-gray-200 rounded-2xl p-7 h-full hover:border-emerald-400/30 transition-all duration-300 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition">
                  <BarChart3 className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Menu Engineering</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Matrice BCG, identifiez vos plats stars et vos poids morts.</p>
              </div>
            </FadeIn>

            <FadeIn delay={160}>
              <div className="group bg-white border border-gray-200 rounded-2xl p-7 h-full hover:border-orange-400/30 transition-all duration-300 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition">
                  <Truck className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Gestion fournisseurs</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Comparateur prix, score /10, alertes et suivi tarifaire.</p>
              </div>
            </FadeIn>

            <FadeIn delay={240}>
              <div className="group bg-white border border-gray-200 rounded-2xl p-7 h-full hover:border-purple-400/30 transition-all duration-300 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition">
                  <Thermometer className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">HACCP & Tracabilite</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Temperatures, nettoyage, conformite reglementaire.</p>
              </div>
            </FadeIn>

            <FadeIn delay={320} className="lg:col-span-2">
              <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 h-full hover:border-emerald-400/30 transition-all duration-300 overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition">
                    <Scale className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">Station de pesee connectee</h3>
                  <p className="text-gray-500 leading-relaxed max-w-lg">
                    Pesez, calculez, maitrisez en temps reel. Connectez votre balance Bluetooth et suivez vos marges en direct pendant la preparation.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="group bg-white border border-gray-200 rounded-2xl p-7 h-full hover:border-cyan-400/30 transition-all duration-300 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition">
                  <Brain className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Assistant IA</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Claude analyse vos donnees et vous conseille en continu.</p>
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
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest mb-3">Comment ca marche</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">3 etapes pour piloter vos marges</h2>
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
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 shadow-lg">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  {i < 2 && (
                    <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-gray-500" />
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ 6. INTEGRATIONS ═══════════════════ */}
      <section id="integrations" className="py-20 sm:py-28 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest mb-3">Compatibilite</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900">
                Compatible avec vos{' '}
                <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
                  logiciels de caisse
                </span>
              </h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
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
                <div className="group bg-white border border-gray-200 rounded-2xl p-6 h-full hover:border-blue-400/30 transition-all duration-300 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition">
                      <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{pos.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{pos.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={500}>
            <p className="text-center mt-10 text-sm text-gray-500">
              Vous utilisez un autre logiciel ?{' '}
              <button onClick={() => scrollTo('contact')} className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 transition-colors">
                Contactez-nous
              </button>{' '}
              pour verifier la compatibilite.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ 6b. COMPARISON TABLE ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest mb-3">Comparatif</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Pourquoi RestauMargin ?</h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">Le seul outil qui combine IA conversationnelle, commande vocale et prix fournisseurs reels.</p>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-5 font-semibold text-gray-700 bg-gray-50/80">Fonctionnalite</th>
                    <th className="py-4 px-5 font-bold text-white bg-teal-600 text-center min-w-[140px]">RestauMargin</th>
                    <th className="py-4 px-5 font-semibold text-gray-500 text-center bg-gray-50/80 min-w-[110px]">Inpulse</th>
                    <th className="py-4 px-5 font-semibold text-gray-500 text-center bg-gray-50/80 min-w-[110px]">Koust</th>
                    <th className="py-4 px-5 font-semibold text-gray-500 text-center bg-gray-50/80 min-w-[110px]">Melba</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Prix / mois', rm: '29\u20AC', inpulse: '~200\u20AC+', koust: '~80\u20AC', melba: '~60\u20AC', highlight: true },
                    { feature: 'IA conversationnelle', rm: '19 actions', inpulse: null, koust: null, melba: null },
                    { feature: 'Commande vocale', rm: true, inpulse: null, koust: null, melba: null },
                    { feature: 'Mercuriale Transgourmet', rm: 'Prix reels', inpulse: null, koust: null, melba: null },
                    { feature: 'Fiches techniques', rm: 'Auto-IA', inpulse: 'Manuel', koust: 'Manuel', melba: 'Manuel' },
                    { feature: 'HACCP', rm: true, inpulse: null, koust: true, melba: null },
                    { feature: 'Menu Engineering', rm: 'Matrice BCG', inpulse: null, koust: true, melba: null },
                    { feature: 'Essai gratuit', rm: '14 jours', inpulse: null, koust: null, melba: null },
                  ].map((row, i) => {
                    const renderCell = (val: string | boolean | null, isTeal: boolean) => {
                      if (val === null) return <span className="text-gray-300 text-lg">&#10005;</span>;
                      if (val === true) return <span className="text-emerald-500 text-lg font-bold">&#10003;</span>;
                      return <span className={isTeal ? 'font-bold text-teal-700' : 'text-gray-600'}>{val}</span>;
                    };
                    return (
                      <tr key={i} className={`border-b border-gray-100 last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                        <td className="py-3.5 px-5 font-medium text-gray-800">{row.feature}</td>
                        <td className="py-3.5 px-5 text-center bg-teal-50/60">{renderCell(row.rm, true)}</td>
                        <td className="py-3.5 px-5 text-center">{renderCell(row.inpulse, false)}</td>
                        <td className="py-3.5 px-5 text-center">{renderCell(row.koust, false)}</td>
                        <td className="py-3.5 px-5 text-center">{renderCell(row.melba, false)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-center mt-6 text-xs text-gray-400">Donnees publiques au 01/04/2026. Les prix concurrents sont des estimations basees sur les informations disponibles.</p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ 7. PRICING ═══════════════════ */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest mb-3">Tarifs</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                Un plan pour chaque{' '}
                <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">restaurant</span>
              </h2>
              <p className="mt-4 text-gray-500">Sans engagement. Annulez quand vous voulez.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <FadeIn delay={100}>
              <div className="relative bg-white border-2 !border-blue-500 rounded-2xl p-8 h-full flex flex-col shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:shadow-[0_0_60px_rgba(59,130,246,0.18)] transition-all duration-500">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-500 text-white text-xs font-bold uppercase tracking-wide">
                  Populaire
                </div>
                <h3 className="text-lg font-bold mb-1 mt-2 text-gray-900">Pro</h3>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-gray-900">29</span>
                  <span className="text-gray-500 text-sm mb-1">euros/mois</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">Pour optimiser et developper son restaurant.</p>
                <div className="space-y-3 mb-8 flex-1">
                  {['Dashboard & statistiques', 'Menu Engineering BCG', 'Gestion fournisseurs avancee', 'Export PDF / Excel', 'Support prioritaire'].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-sm text-gray-500">{f}</span>
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

            <FadeIn delay={200}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full flex flex-col hover:border-emerald-500/30 transition-colors shadow-sm">
                <h3 className="text-lg font-bold mb-1 text-gray-900">Business</h3>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-gray-900">79</span>
                  <span className="text-gray-500 text-sm mb-1">euros/mois</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">Pour les groupes multi-restaurants.</p>
                <div className="space-y-3 mb-8 flex-1">
                  {['Tout du plan Pro', 'Multi-restaurants', 'API & webhooks', 'Formation personnalisee', 'Account manager dedie'].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-sm text-gray-500">{f}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://buy.stripe.com/4gMbIU5Ki4cAfbe1b187K05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-6 py-3 rounded-xl bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 font-semibold transition-colors"
                >
                  Choisir Business
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 8. TESTIMONIALS ═══════════════════ */}
      <section className="py-20 sm:py-28 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest mb-3">Temoignages</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                Ce que disent nos{' '}
                <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">clients</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-white border border-gray-200 rounded-2xl p-7 h-full flex flex-col hover:border-purple-500/30 transition-all duration-500 group shadow-sm">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1 italic">"{t.quote}"</p>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role} — {t.place}</div>
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
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest mb-3">FAQ</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Questions frequentes</h2>
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
      <section id="contact" className="py-20 sm:py-28 bg-[#f8fafc]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest mb-3">Contact</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900">
                Parlons de votre{' '}
                <span className="bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">projet</span>
              </h2>
              <p className="text-gray-500">Notre equipe vous recontacte sous 24h.</p>
            </div>

            {contactSent ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-emerald-400">Demande envoyee !</p>
                <p className="text-sm text-gray-500 mt-1">Nous vous recontactons tres vite.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 space-y-5 shadow-sm">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1.5">Nom</label>
                    <input
                      type="text"
                      required
                      value={contactForm.nom}
                      onChange={(e) => setContactForm({ ...contactForm, nom: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">Telephone</label>
                  <input
                    type="tel"
                    value={contactForm.telephone}
                    onChange={(e) => setContactForm({ ...contactForm, telephone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
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
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-base transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
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
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">RestauMargin</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                La plateforme de gestion des marges pour la restauration professionnelle.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5 text-blue-400" /> Donnees EU
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> SSL
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-4">Produit</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><button onClick={() => scrollTo('features')} className="hover:text-gray-900 transition-colors">Fonctionnalites</button></li>
                <li><Link to="/pricing" className="hover:text-gray-900 transition-colors">Tarifs</Link></li>
                <li><button onClick={() => scrollTo('integrations')} className="hover:text-gray-900 transition-colors">Integrations</button></li>
                <li><button onClick={() => scrollTo('faq')} className="hover:text-gray-900 transition-colors">FAQ</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link to="/mentions-legales" className="hover:text-gray-900 transition-colors">Mentions legales</Link></li>
                <li><Link to="/cgu" className="hover:text-gray-900 transition-colors">CGU</Link></li>
                <li><Link to="/politique-confidentialite" className="hover:text-gray-900 transition-colors">Politique de confidentialite</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-4">Contact</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a href="mailto:contact@restaumargin.fr" className="hover:text-gray-900 transition-colors">contact@restaumargin.fr</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>01 23 45 67 89</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">RestauMargin &copy; 2026. Tous droits reserves.</p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <Link to="/mentions-legales" className="hover:text-gray-900 transition-colors">Mentions legales</Link>
              <Link to="/cgu" className="hover:text-gray-900 transition-colors">CGU</Link>
              <Link to="/politique-confidentialite" className="hover:text-gray-900 transition-colors">Confidentialite</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════ NEWSLETTER SLIDE-IN ═══════════════════ */}
      <div
        className={`fixed bottom-6 right-6 z-[90] w-[300px] transition-all duration-500 ease-out ${
          showNewsletter ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white border border-teal-200 rounded-2xl shadow-xl p-5 relative">
          <button
            onClick={dismissNewsletter}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fermer"
          >
            <XIcon className="w-4 h-4" />
          </button>

          {newsletterSent ? (
            <div className="text-center py-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900">Inscription confirmee !</p>
              <p className="text-xs text-gray-500 mt-1">A bientot dans votre boite mail.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📊</span>
                <h4 className="text-sm font-bold text-gray-900">Mercuriale hebdomadaire</h4>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Recevez les prix du marche chaque semaine
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="flex-1 min-w-0 px-3 py-2 text-xs rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors disabled:opacity-60 whitespace-nowrap"
                >
                  {newsletterLoading ? '...' : "S'inscrire"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ═══════════════════ EXIT-INTENT POPUP ═══════════════════ */}
      {showExitPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative mx-4 w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-8 text-center animate-scale-in">
            <button
              onClick={() => setShowExitPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Attendez !</h3>
            <p className="text-lg font-semibold text-teal-600 mb-1">
              Essayez RestauMargin gratuitement pendant 14 jours
            </p>
            <p className="text-sm text-gray-500 mb-6">Pas de carte bancaire requise</p>

            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-200"
            >
              Commencer mon essai gratuit <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setShowExitPopup(false)}
              className="block mx-auto mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Non merci
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════ JSON-LD FAQPage Schema ═══════════════════ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
              },
            })),
          }),
        }}
      />

    </div>
  );
}

/* ─────────────────────── FAQ Item ─────────────────────── */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-60 pb-5' : 'max-h-0'}`}>
        <p className="px-6 text-sm text-gray-500 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}
