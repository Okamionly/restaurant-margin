import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChefHat, ClipboardList, Truck, BarChart3,
  ArrowRight, CheckCircle2, TrendingUp, Zap, Star,
  Users, Menu, X as XIcon, Shield, Lock, Mail,
  Scale, ChevronDown, Phone, Send, Loader2,
  XCircle, Brain, Thermometer, Newspaper,
  Check, Plus, Minus, Sparkles, MessageCircle,
} from 'lucide-react';

/* <!-- HERO SAUVEGARDE -->
HERO SECTION BACKUP (lines 323-414 of original Landing.tsx):
──────────────────────────────────────────────────────────────

<section ref={heroRef} className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
  <div className="absolute inset-0 -z-10">
    <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-teal-500/[0.05] rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-400/[0.04] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/[0.03] rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #0d9488 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
  </div>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
          <Link to="/login?mode=register" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-lg transition-all text-base">
            Essai gratuit 7 jours <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/pricing" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#111111] hover:bg-[#333] text-white font-semibold transition-all text-base">
            Voir les tarifs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <p className="mt-3 text-sm text-gray-500 text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
          <Shield className="w-3.5 h-3.5" /> Pas de carte bancaire requise
        </p>
      </div>
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

END HERO BACKUP
<!-- /HERO SAUVEGARDE --> */

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Shared UI                                                          */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: Send,
    title: 'Messagerie & Commandes directes',
    description: 'Envoyez vos commandes aux fournisseurs par email et WhatsApp directement depuis RestauMargin.',
    priority: true,
  },
  {
    icon: Sparkles,
    title: 'Intelligence Artificielle',
    description: '19 actions IA : creer des recettes, analyser vos marges, optimiser vos prix — par chat, voix ou photo.',
    priority: true,
  },
  {
    icon: ClipboardList,
    title: 'Fiches techniques automatiques',
    description: 'Calculez votre food cost instantanement. Coefficients, marges, allergenes — tout est automatique.',
    priority: true,
  },
  {
    icon: BarChart3,
    title: 'Menu Engineering',
    description: 'Matrice BCG pour identifier vos plats Stars, vos Vaches a lait et vos Poids morts.',
  },
  {
    icon: Truck,
    title: 'Gestion fournisseurs',
    description: 'Comparateur de prix, score qualite /10, alertes automatiques et suivi tarifaire.',
  },
  {
    icon: Scale,
    title: 'Station de pesee',
    description: 'Connectez votre balance Bluetooth et suivez vos marges en direct pendant la preparation.',
  },
  {
    icon: Thermometer,
    title: 'HACCP & Tracabilite',
    description: 'Suivi des temperatures, nettoyage et conformite reglementaire integres.',
  },
  {
    icon: Brain,
    title: 'Assistant IA conversationnel',
    description: 'Claude analyse vos donnees, detecte les anomalies et vous conseille en continu.',
  },
];

const testimonials = [
  {
    quote: "+4 points de marge en 3 mois. Les fiches techniques automatiques nous ont tout change.",
    name: 'Laurent Dubois',
    restaurant: 'Restaurant gastronomique, Lyon',
  },
  {
    quote: "Interface intuitive, calcul en temps reel. Exactement ce qu'il manquait aux restaurateurs.",
    name: 'Sophie Martin',
    restaurant: 'Brasserie Le Comptoir, Paris',
  },
  {
    quote: "Chaque centime compte en food truck. RestauMargin m'aide a rester competitif et rentable.",
    name: 'Karim Benali',
    restaurant: 'Food truck Street Flavors, Bordeaux',
  },
];

const faqItems = [
  {
    q: "Comment fonctionne l'abonnement ?",
    a: "Choisissez votre plan (Pro ou Business), payez par carte bancaire et recevez votre code d'activation instantanement. L'abonnement est mensuel, sans engagement. Vous pouvez annuler a tout moment depuis votre espace.",
  },
  {
    q: "Comment recevoir mon code d'activation ?",
    a: "Apres le paiement, vous recevez un email avec votre code d'activation et un lien pour creer votre compte. Connectez-vous, entrez le code et commencez a utiliser RestauMargin immediatement.",
  },
  {
    q: 'Puis-je changer de plan ?',
    a: 'Oui, vous pouvez upgrader ou downgrader votre plan a tout moment. Le changement prend effet au prochain cycle de facturation. Le prorata est calcule automatiquement.',
  },
  {
    q: 'Puis-je utiliser une balance connectee ?',
    a: "Oui. RestauMargin propose une station de pesee logicielle compatible avec toute balance Bluetooth. Connectez votre propre balance et pesez vos ingredients directement depuis l'application.",
  },
  {
    q: 'Mes donnees sont-elles securisees ?',
    a: "Vos donnees sont hebergees en Europe (Supabase), chiffrees en transit (SSL/TLS) et au repos. Nous sommes conformes RGPD. Aucune donnee n'est revendue a des tiers.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [contactForm, setContactForm] = useState({ nom: '', email: '', telephone: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [showExitPopup, setShowExitPopup] = useState(false);

  // Newsletter slide-in
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);

  // Inline newsletter
  const [inlineNewsletterEmail, setInlineNewsletterEmail] = useState('');
  const [inlineNewsletterLoading, setInlineNewsletterLoading] = useState(false);
  const [inlineNewsletterSent, setInlineNewsletterSent] = useState(false);
  const [inlineNewsletterError, setInlineNewsletterError] = useState('');

  // Floating CTA
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  /* ---- side-effects ---- */

  useEffect(() => {
    const dismissed = localStorage.getItem('newsletterDismissed');
    const isLoggedIn = !!localStorage.getItem('token');
    if (dismissed || isLoggedIn) return;
    const timer = setTimeout(() => setShowNewsletter(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowFloatingCTA(!entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(s => (s + 1) % 3), 4000);
    return () => clearInterval(timer);
  }, []);

  /* ---- handlers ---- */

  const scrollTo = useCallback((id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterLoading(true);
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
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

  const handleInlineNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineNewsletterLoading(true);
    setInlineNewsletterError('');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inlineNewsletterEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setInlineNewsletterSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur. Veuillez reessayer.';
      setInlineNewsletterError(message);
    } finally {
      setInlineNewsletterLoading(false);
    }
  };

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
        throw new Error(data.error || "Erreur lors de l'envoi");
      }
      setContactSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'envoi. Veuillez reessayer.";
      setContactError(message);
    } finally {
      setContactLoading(false);
    }
  };

  /* ---- sub-components ---- */

  const StatCounter = ({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) => {
    const { ref, visible } = useInView(0.3);
    const count = useAnimatedCounter(value, 1800, visible);
    return (
      <div ref={ref} className="text-center px-6">
        <div className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
          {count}{suffix}
        </div>
        <div className="text-sm text-[#6B7280] mt-1 font-medium">{label}</div>
      </div>
    );
  };

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] overflow-x-hidden scroll-smooth" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FFFFFF]/95 backdrop-blur-xl border-b border-[#E5E7EB]' : 'bg-transparent'}`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#111111] flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#111111]">RestauMargin</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors cursor-pointer">Fonctionnalites</button>
            <button onClick={() => scrollTo('pricing')} className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors cursor-pointer">Tarifs</button>
            <button onClick={() => scrollTo('faq')} className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors cursor-pointer">FAQ</button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm text-[#6B7280] hover:text-[#111111] transition-colors px-3 py-2">Connexion</Link>
            <Link to="/login?mode=register" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-[#333333] text-white text-sm font-semibold transition-all">
              Essai gratuit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#6B7280] hover:text-[#111111]">
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFFFF] border-t border-[#E5E7EB]">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollTo('features')} className="block w-full text-left text-sm text-[#6B7280] hover:text-[#111111] py-2">Fonctionnalites</button>
              <button onClick={() => scrollTo('pricing')} className="block w-full text-left text-sm text-[#6B7280] hover:text-[#111111] py-2">Tarifs</button>
              <button onClick={() => scrollTo('faq')} className="block w-full text-left text-sm text-[#6B7280] hover:text-[#111111] py-2">FAQ</button>
              <hr className="border-[#E5E7EB]" />
              <Link to="/login" className="block text-sm text-[#6B7280] hover:text-[#111111] py-2">Connexion</Link>
              <Link to="/login?mode=register" className="block w-full text-center px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-[#333333] text-white text-sm font-semibold">Essai gratuit 7 jours</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════ 1. HERO (KEPT AS-IS) ═══════════════ */}
      <section ref={heroRef} className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
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
                  Essai gratuit 7 jours <ArrowRight className="w-4 h-4" />
                </Link>
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

      {/* ═══════════════ 2. FEATURES ═══════════════ */}
      <section id="features" className="py-24 sm:py-32 bg-[#FFFFFF]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <p className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mb-4">Fonctionnalites</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#111111]">
                Tout ce dont vous avez besoin
              </h2>
              <p className="mt-4 text-lg text-[#6B7280] max-w-lg mx-auto">
                Six outils puissants pour reprendre le controle total de vos marges.
              </p>
            </div>
          </FadeIn>

          {/* Priority features — larger cards */}
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            {features.filter((f: any) => f.priority).map((f, i) => {
              const Icon = f.icon;
              return (
                <FadeIn key={i} delay={i * 80}>
                  <div className="bg-[#FFFFFF] border-2 border-[#111111] rounded-2xl p-10 h-full hover:shadow-lg transition-all duration-300">
                    <div className="w-14 h-14 rounded-xl bg-[#111111] flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#111111] mb-3">{f.title}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{f.description}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {/* Other features — standard cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.filter((f: any) => !f.priority).map((f, i) => {
              const Icon = f.icon;
              return (
                <FadeIn key={i} delay={(i + 3) * 80}>
                  <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 h-full hover:border-[#111111]/20 transition-colors duration-300">
                    <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-[#111111]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#111111] mb-2">{f.title}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{f.description}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ 3. HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-[#FFFFFF] border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <p className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mb-4">Comment ca marche</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111]">
                Trois etapes simples
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {[
              { num: '01', title: 'Inscrivez-vous', desc: 'Creez votre compte en 2 minutes. Essai gratuit de 7 jours, sans carte bancaire.' },
              { num: '02', title: 'Ajoutez vos donnees', desc: 'Importez vos ingredients, recettes et fournisseurs. Notre assistant IA vous guide.' },
              { num: '03', title: 'Optimisez vos marges', desc: 'Dashboard temps reel, alertes automatiques. Vos marges s\'ameliorent des le premier jour.' },
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 120}>
                <div className="text-center md:text-left">
                  <div className="text-6xl sm:text-7xl font-extrabold text-[#111111] leading-none mb-6 tracking-tight">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-[#111111] mb-3">{step.title}</h3>
                  <p className="text-[#6B7280] leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 4. SOCIAL PROOF / TESTIMONIALS ═══════════════ */}
      <section className="py-24 sm:py-32 bg-[#FFFFFF] border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <p className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mb-4">Temoignages</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111]">
                Ce que disent nos clients
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 h-full flex flex-col">
                  <div className="text-4xl text-[#E5E7EB] font-serif leading-none mb-4">&ldquo;</div>
                  <p className="text-[#111111] leading-relaxed mb-8 flex-1">
                    {t.quote}
                  </p>
                  <div className="border-t border-[#E5E7EB] pt-6">
                    <p className="text-sm font-bold text-[#111111]">{t.name}</p>
                    <p className="text-sm text-[#9CA3AF]">{t.restaurant}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════ 6. PRICING ═══════════════ */}
      <section id="pricing" className="py-24 sm:py-32 bg-[#FFFFFF] border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mb-4">Tarifs</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111]">
                Des tarifs simples et transparents
              </h2>
              <p className="mt-4 text-lg text-[#6B7280]">Sans engagement. Annulez quand vous voulez.</p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E5E7EB] bg-[#F9FAFB]">
                <Zap className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-semibold text-[#111111]">Essai gratuit 7 jours</span>
              </div>
              <p className="mt-3 text-sm text-[#9CA3AF]">Messages et IA limites pendant l'essai</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pro */}
            <FadeIn delay={100}>
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 h-full flex flex-col">
                <h3 className="text-lg font-bold text-[#111111] mb-1">Pro</h3>
                <p className="text-sm text-[#9CA3AF] mb-6">Pour optimiser et developper son restaurant.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-extrabold text-[#111111]">49</span>
                  <span className="text-[#9CA3AF] text-base">&euro;/mois</span>
                </div>
                <div className="space-y-4 mb-10 flex-1">
                  {[
                    'Dashboard & statistiques',
                    'Fiches techniques illimitees',
                    'Menu Engineering BCG',
                    'Gestion fournisseurs avancee',
                    'Export PDF / Excel',
                    'Support prioritaire',
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#111111] shrink-0" />
                      <span className="text-sm text-[#6B7280]">{f}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://buy.stripe.com/9B614g1u2eRe9QU6vl87K04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-6 py-3.5 rounded-lg bg-[#111111] text-white font-semibold hover:bg-[#333333] transition-colors"
                >
                  Commencer l'essai gratuit
                </a>
              </div>
            </FadeIn>

            {/* Business */}
            <FadeIn delay={200}>
              <div className="bg-[#FFFFFF] border-2 border-[#111111] rounded-2xl p-8 h-full flex flex-col relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#111111] text-white text-xs font-bold uppercase tracking-wide">
                  Populaire
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-1 mt-2">Business</h3>
                <p className="text-sm text-[#9CA3AF] mb-6">Pour les groupes multi-restaurants.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-extrabold text-[#111111]">99</span>
                  <span className="text-[#9CA3AF] text-base">&euro;/mois</span>
                </div>
                <div className="space-y-4 mb-10 flex-1">
                  {[
                    'Tout du plan Pro',
                    'Multi-restaurants',
                    'API & webhooks',
                    'Station de pesee connectee',
                    'Formation personnalisee',
                    'Account manager dedie',
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-[#111111] shrink-0" />
                      <span className="text-sm text-[#6B7280]">{f}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://buy.stripe.com/4gMbIU5Ki4cAfbe1b187K05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-6 py-3.5 rounded-lg bg-[#111111] text-white font-semibold hover:bg-[#333333] transition-colors"
                >
                  Commencer l'essai gratuit
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════ 7. FAQ ═══════════════ */}
      <section id="faq" className="py-24 sm:py-32 bg-[#FFFFFF] border-t border-[#E5E7EB]">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mb-4">FAQ</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111]">Questions frequentes</h2>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="space-y-0 border border-[#E5E7EB] rounded-2xl overflow-hidden">
              {faqItems.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} isLast={i === faqItems.length - 1} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ 8. NEWSLETTER ═══════════════ */}
      <section className="py-24 sm:py-32 bg-[#FFFFFF] border-t border-[#E5E7EB]">
        <div className="max-w-[560px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-3">
                Restez informe
              </h2>
              <p className="text-[#6B7280] mb-8">
                Recevez nos conseils marge, actualites fournisseurs et mises a jour produit.
              </p>

              {inlineNewsletterSent ? (
                <div className="border border-[#E5E7EB] rounded-2xl p-8">
                  <CheckCircle2 className="w-10 h-10 text-[#111111] mx-auto mb-3" />
                  <p className="text-lg font-semibold text-[#111111]">Merci !</p>
                  <p className="text-sm text-[#9CA3AF] mt-1">Vous recevrez nos actualites restaurant.</p>
                </div>
              ) : (
                <form onSubmit={handleInlineNewsletterSubmit}>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      required
                      value={inlineNewsletterEmail}
                      onChange={(e) => setInlineNewsletterEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="flex-1 min-w-0 px-4 py-3 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] text-[#111111] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#111111] focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={inlineNewsletterLoading}
                      className="px-6 py-3 rounded-lg bg-[#111111] text-white font-semibold text-sm hover:bg-[#333333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {inlineNewsletterLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "S'inscrire"
                      )}
                    </button>
                  </div>
                  {inlineNewsletterError && (
                    <p className="text-red-500 text-sm mt-2">{inlineNewsletterError}</p>
                  )}
                  <p className="text-xs text-[#9CA3AF] mt-3">Pas de spam. Desinscription en un clic.</p>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ 9. CONTACT ═══════════════ */}
      <section id="contact" className="py-24 sm:py-32 bg-[#FFFFFF] border-t border-[#E5E7EB]">
        <div className="max-w-[560px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mb-4">Contact</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-3">
                Parlons de votre projet
              </h2>
              <p className="text-[#6B7280]">Notre equipe vous recontacte sous 24h.</p>
            </div>

            {contactSent ? (
              <div className="border border-[#E5E7EB] rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#111111] mx-auto mb-4" />
                <p className="text-lg font-semibold text-[#111111]">Demande envoyee !</p>
                <p className="text-sm text-[#9CA3AF] mt-1">Nous vous recontactons tres vite.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="border border-[#E5E7EB] rounded-2xl p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-1.5">Nom</label>
                    <input
                      type="text"
                      required
                      value={contactForm.nom}
                      onChange={(e) => setContactForm({ ...contactForm, nom: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] text-[#111111] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#111111] focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] text-[#111111] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#111111] focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-1.5">Telephone</label>
                  <input
                    type="tel"
                    value={contactForm.telephone}
                    onChange={(e) => setContactForm({ ...contactForm, telephone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] text-[#111111] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#111111] focus:border-transparent"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] text-[#111111] placeholder-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#111111] focus:border-transparent resize-none"
                    placeholder="Decrivez votre besoin..."
                  />
                </div>
                {contactError && (
                  <div className="border border-red-200 bg-red-50 rounded-lg p-3 text-sm text-red-600">
                    {contactError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#111111] hover:bg-[#333333] text-white font-semibold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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

      {/* ═══════════════ 10. FOOTER ═══════════════ */}
      <footer className="border-t border-[#E5E7EB] bg-[#FFFFFF]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#111111] flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-[#111111]">RestauMargin</span>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                La plateforme de gestion des marges pour la restauration professionnelle.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                  <Shield className="w-3.5 h-3.5" /> Donnees EU
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                  <Lock className="w-3.5 h-3.5" /> SSL
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[#111111] text-sm mb-4">Produit</h4>
              <ul className="space-y-2.5 text-sm text-[#6B7280]">
                <li><button onClick={() => scrollTo('features')} className="hover:text-[#111111] transition-colors">Fonctionnalites</button></li>
                <li><Link to="/pricing" className="hover:text-[#111111] transition-colors">Tarifs</Link></li>
                <li><button onClick={() => scrollTo('faq')} className="hover:text-[#111111] transition-colors">FAQ</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#111111] text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm text-[#6B7280]">
                <li><Link to="/mentions-legales" className="hover:text-[#111111] transition-colors">Mentions legales</Link></li>
                <li><Link to="/cgu" className="hover:text-[#111111] transition-colors">CGU</Link></li>
                <li><Link to="/politique-confidentialite" className="hover:text-[#111111] transition-colors">Politique de confidentialite</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#111111] text-sm mb-4">Contact</h4>
              <ul className="space-y-2.5 text-sm text-[#6B7280]">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#9CA3AF]" />
                  <a href="mailto:contact@restaumargin.fr" className="hover:text-[#111111] transition-colors">contact@restaumargin.fr</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#9CA3AF]" />
                  <span>01 23 45 67 89</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#E5E7EB] py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#9CA3AF]">RestauMargin &copy; 2026. Tous droits reserves.</p>
            <div className="flex items-center gap-6 text-xs text-[#9CA3AF]">
              <Link to="/mentions-legales" className="hover:text-[#111111] transition-colors">Mentions legales</Link>
              <Link to="/cgu" className="hover:text-[#111111] transition-colors">CGU</Link>
              <Link to="/politique-confidentialite" className="hover:text-[#111111] transition-colors">Confidentialite</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════ FLOATING CTA BAR ═══════════════ */}
      <div
        className={`fixed bottom-0 inset-x-0 z-[80] transition-all duration-500 ease-out ${
          showFloatingCTA ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#FFFFFF]/95 backdrop-blur-xl border-t border-[#E5E7EB]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111111]">Essai gratuit 7 jours</p>
                <p className="text-xs text-[#9CA3AF]">Pas de carte bancaire requise</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to="/login?mode=register"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#111111] hover:bg-[#333333] text-white font-semibold text-sm transition-all"
              >
                Commencer <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => scrollTo('pricing')}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-[#111111] text-sm font-medium hover:bg-[#F9FAFB] transition-colors"
              >
                Voir les tarifs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ NEWSLETTER SLIDE-IN ═══════════════ */}
      <div
        className={`fixed bottom-6 right-6 z-[90] w-[300px] transition-all duration-500 ease-out ${
          showNewsletter ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl shadow-lg p-5 relative">
          <button
            onClick={dismissNewsletter}
            className="absolute top-3 right-3 text-[#9CA3AF] hover:text-[#111111] transition-colors"
            aria-label="Fermer"
          >
            <XIcon className="w-4 h-4" />
          </button>

          {newsletterSent ? (
            <div className="text-center py-2">
              <CheckCircle2 className="w-8 h-8 text-[#111111] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#111111]">Inscription confirmee !</p>
              <p className="text-xs text-[#9CA3AF] mt-1">A bientot dans votre boite mail.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Newspaper className="w-4 h-4 text-[#111111]" />
                <h4 className="text-sm font-bold text-[#111111]">Mercuriale hebdomadaire</h4>
              </div>
              <p className="text-xs text-[#6B7280] mb-3">
                Recevez les prix du marche chaque semaine
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="flex-1 min-w-0 px-3 py-2 text-xs rounded-lg bg-[#FFFFFF] border border-[#E5E7EB] text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111111] focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="px-3 py-2 rounded-lg bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold transition-colors disabled:opacity-60 whitespace-nowrap"
                >
                  {newsletterLoading ? '...' : "S'inscrire"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ═══════════════ EXIT-INTENT POPUP ═══════════════ */}
      {showExitPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="relative mx-4 w-full max-w-md bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl shadow-2xl p-8 text-center">
            <button
              onClick={() => setShowExitPopup(false)}
              className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#111111] transition-colors"
              aria-label="Fermer"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-[#111111] mb-2">Attendez !</h3>
            <p className="text-lg font-semibold text-[#111111] mb-1">
              Essayez RestauMargin gratuitement pendant 7 jours
            </p>
            <p className="text-sm text-[#9CA3AF] mb-6">Pas de carte bancaire requise</p>

            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] text-white font-semibold rounded-lg hover:bg-[#333333] transition-colors"
            >
              Commencer mon essai gratuit <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setShowExitPopup(false)}
              className="block mx-auto mt-4 text-sm text-[#9CA3AF] hover:text-[#111111] transition-colors"
            >
              Non merci
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════ JSON-LD ═══════════════ */}
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

/* ------------------------------------------------------------------ */
/*  FAQ Accordion Item                                                 */
/* ------------------------------------------------------------------ */

function FAQItem({ q, a, isLast = false }: { q: string; a: string; isLast?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${!isLast ? 'border-b border-[#E5E7EB]' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#F9FAFB] transition-colors"
      >
        <span className="font-semibold text-[#111111] pr-4">{q}</span>
        <div className="w-6 h-6 rounded-full border border-[#E5E7EB] flex items-center justify-center shrink-0">
          {open ? <Minus className="w-3.5 h-3.5 text-[#111111]" /> : <Plus className="w-3.5 h-3.5 text-[#111111]" />}
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-60 pb-5' : 'max-h-0'}`}>
        <p className="px-6 text-sm text-[#6B7280] leading-relaxed">{a}</p>
      </div>
    </div>
  );
}
