import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChefHat, ClipboardList, Truck, BarChart3,
  ArrowRight, CheckCircle2, TrendingUp, Zap, Star,
  Users, Menu, X as XIcon, Shield, Lock, Mail,
  Scale, ChevronDown, Phone, Send, Loader2,
  XCircle, Brain, Thermometer, Newspaper,
  Check, Plus, Minus, Sparkles, MessageCircle,
  ShieldCheck, Globe, Headphones, FileCheck, CreditCard,
  Package, Calculator,
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
    let rafId: number;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
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
    title: 'Commandes fournisseurs en 1 clic',
    description: 'Envoyez vos commandes par email ou WhatsApp directement depuis l\'appli. Plus besoin de jongler entre les mails et les coups de fil.',
    priority: true,
  },
  {
    icon: Sparkles,
    title: 'L\'IA qui parle cuisine',
    description: 'Creez des recettes par chat ou commande vocale, scannez vos factures avec l\'appareil photo — l\'IA fait le reste.',
    priority: true,
  },
  {
    icon: ClipboardList,
    title: 'Fiches techniques en quelques clics',
    description: 'L\'IA calcule vos marges, vos coefficients et vos allergenes automatiquement. Vous n\'avez qu\'a cuisiner.',
    priority: true,
  },
  {
    icon: BarChart3,
    title: 'Optimisez votre carte',
    description: 'Identifiez quels plats vous rapportent le plus et lesquels plombent vos marges. Prenez les bonnes decisions.',
  },
  {
    icon: Truck,
    title: 'Suivez les prix de vos fournisseurs',
    description: 'La Mercuriale suit l\'evolution des prix et vous alerte quand un fournisseur augmente. Comparez en un coup d\'oeil.',
  },
  {
    icon: Scale,
    title: 'Balance connectee en cuisine',
    description: 'Pesez vos ingredients avec une balance Bluetooth et verifiez vos marges en temps reel pendant la preparation.',
  },
  {
    icon: Thermometer,
    title: 'HACCP digital, sans papier',
    description: 'Temperatures, fiches de nettoyage, tracabilite — tout est numerique et conforme. Fini les classeurs.',
  },
  {
    icon: Brain,
    title: 'Un assistant qui connait votre cuisine',
    description: 'Posez vos questions, dictez vos commandes. L\'IA analyse vos donnees et vous alerte quand quelque chose cloche.',
  },
];

const testimonials = [
  {
    quote: "+4 points de marge en 3 mois. Les fiches techniques automatiques nous ont tout change. Avant on calculait a la main sur des Post-it, maintenant tout est precis au centime pres.",
    name: 'Laurent Dubois',
    role: 'Chef proprietaire',
    restaurant: 'Le Jardin des Saveurs',
    city: 'Lyon',
    stars: 5,
    initials: 'LD',
  },
  {
    quote: "On a reduit notre food cost de 34% a 27% en 2 mois. L'IA qui cree les fiches techniques en 10 secondes, c'est un game changer. Mon equipe ne peut plus s'en passer.",
    name: 'Sophie Martin',
    role: 'Directrice',
    restaurant: 'Brasserie Le Comptoir',
    city: 'Paris',
    stars: 5,
    initials: 'SM',
  },
  {
    quote: "Chaque centime compte en food truck. Les alertes sur les prix fournisseurs m'ont fait economiser 800 euros le premier mois. L'app est simple, rapide, parfaite pour le terrain.",
    name: 'Karim Benali',
    role: 'Gerant',
    restaurant: 'Street Flavors',
    city: 'Bordeaux',
    stars: 5,
    initials: 'KB',
  },
];

const faqItems = [
  {
    q: "Est-ce que c'est complique a prendre en main ?",
    a: "Pas du tout. L'interface est pensee pour les restaurateurs, pas pour les informaticiens. La plupart de nos clients creent leur premiere fiche technique en moins de 5 minutes. Et notre assistant IA vous guide a chaque etape.",
  },
  {
    q: "Combien ca coute ?",
    a: "Le plan Pro demarre a 29 euros/mois et le plan Business a 79 euros/mois. L'essai gratuit de 7 jours est sans carte bancaire et sans engagement. Vous pouvez annuler a tout moment depuis votre espace.",
  },
  {
    q: 'Mes donnees sont-elles securisees ?',
    a: "Vos donnees sont hebergees en Europe (Supabase), chiffrees en transit (SSL/TLS) et au repos. Nous sommes conformes RGPD. Aucune donnee n'est revendue a des tiers. Vous restez proprietaire de vos donnees a 100%.",
  },
  {
    q: "Comment fonctionne l'abonnement ?",
    a: "Choisissez votre plan (Pro ou Business), payez par carte bancaire et recevez votre code d'activation instantanement. L'abonnement est mensuel, sans engagement. Vous pouvez annuler a tout moment depuis votre espace.",
  },
  {
    q: "Est-ce que ca marche pour mon type de restaurant ?",
    a: "Oui. RestauMargin est utilise par des restaurants gastronomiques, des brasseries, des food trucks, des pizzerias, des traiteurs et meme des dark kitchens. L'outil s'adapte a tous les formats de restauration.",
  },
  {
    q: 'Puis-je utiliser une balance connectee ?',
    a: "Oui. RestauMargin propose une station de pesee logicielle compatible avec toute balance Bluetooth. Connectez votre propre balance et pesez vos ingredients directement depuis l'application.",
  },
  {
    q: "Combien de temps pour voir des resultats ?",
    a: "La plupart de nos clients constatent une amelioration de leurs marges des la premiere semaine. En moyenne, nos utilisateurs reduisent leur food cost de 3 a 5 points en moins de 3 mois.",
  },
  {
    q: "Puis-je importer mes recettes existantes ?",
    a: "Oui. Vous pouvez importer vos ingredients et recettes depuis un fichier Excel, ou simplement les dicter a notre assistant IA qui creera les fiches techniques automatiquement.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
    if (!isValidEmail(newsletterEmail)) return;
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
    if (!isValidEmail(inlineNewsletterEmail)) {
      setInlineNewsletterError('Veuillez entrer une adresse email valide.');
      return;
    }
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
    if (!isValidEmail(contactForm.email)) {
      setContactError('Veuillez entrer une adresse email valide.');
      return;
    }
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

          {/* Social proof headline */}
          <div className="animate-[fadeInUp_1s_ease-out_0.45s_both]">
            <p className="mt-16 text-center text-sm font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mb-4">
              Deja adopte par des restaurateurs partout en France
            </p>
          </div>

          {/* Stats bar */}
          <div className="animate-[fadeInUp_1s_ease-out_0.5s_both]">
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl py-8 px-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-gray-200 md:divide-x">
                <StatCounter value={150} suffix="+" label="Restaurants equipes" />
                <StatCounter value={12400} suffix="" label="Fiches techniques creees" />
                <StatCounter value={340} suffix="k" label="Euros economises en food cost" />
                <StatCounter value={8} suffix="%" label="Cout matiere economise" />
                <div className="text-center px-6">
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">4.8/5</div>
                  <div className="text-sm text-[#6B7280] mt-1 font-medium">Satisfaction clients</div>
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

      {/* ═══════════════ VOIR EN ACTION ═══════════════ */}
      <section className="py-24 sm:py-32 bg-[#FFFFFF] border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <p className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mb-4">Voir en action</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111]">
                Un apercu de votre futur quotidien
              </h2>
              <p className="mt-4 text-lg text-[#6B7280]">
                Trois ecrans qui changent la gestion de votre restaurant.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mockup 1: Dashboard KPIs */}
            <FadeIn delay={0}>
              <div className="group">
                <div className="relative bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl overflow-hidden aspect-[4/3] flex flex-col items-center justify-center p-8 hover:border-[#111111]/30 transition-all duration-500 hover:shadow-lg">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-[#111111] flex items-center px-3 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/80" />
                    <span className="text-[10px] text-white/50 ml-2 font-mono">restaumargin.fr/dashboard</span>
                  </div>
                  <div className="mt-4 w-full space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-center">
                        <div className="text-xs text-[#9CA3AF]">Food Cost</div>
                        <div className="text-lg font-bold text-[#111111]">28.4%</div>
                      </div>
                      <div className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-center">
                        <div className="text-xs text-[#9CA3AF]">Marge</div>
                        <div className="text-lg font-bold text-[#111111]">71.6%</div>
                      </div>
                      <div className="bg-white border border-[#E5E7EB] rounded-lg p-3 text-center">
                        <div className="text-xs text-[#9CA3AF]">Recettes</div>
                        <div className="text-lg font-bold text-[#111111]">47</div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#9CA3AF]">Evolution marge</span>
                        <span className="text-xs font-semibold text-[#22C55E]">+4.2%</span>
                      </div>
                      <div className="flex items-end gap-1 h-10">
                        {[40, 55, 45, 60, 52, 68, 72, 65, 78, 82, 75, 88].map((h, i) => (
                          <div key={i} className="flex-1 bg-[#111111] rounded-sm transition-all duration-700 group-hover:bg-teal-600" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-[#111111]">Dashboard temps reel</h3>
                  <p className="text-sm text-[#6B7280] mt-1">KPIs, marges et food cost en un coup d'oeil</p>
                </div>
              </div>
            </FadeIn>

            {/* Mockup 2: AI Assistant */}
            <FadeIn delay={150}>
              <div className="group">
                <div className="relative bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl overflow-hidden aspect-[4/3] flex flex-col items-center justify-center p-8 hover:border-[#111111]/30 transition-all duration-500 hover:shadow-lg">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-[#111111] flex items-center px-3 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/80" />
                    <span className="text-[10px] text-white/50 ml-2 font-mono">restaumargin.fr/ai</span>
                  </div>
                  <div className="mt-4 w-full space-y-3">
                    <div className="bg-[#111111] rounded-lg p-3 ml-8">
                      <p className="text-xs text-white/90">"Cree une fiche technique pour un risotto aux cepes, 4 portions, prix de vente 19 euros"</p>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-lg p-3 mr-8">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-3.5 h-3.5 text-teal-600" />
                        <span className="text-xs font-semibold text-[#111111]">Assistant IA</span>
                      </div>
                      <p className="text-xs text-[#6B7280]">Fiche creee ! Food cost: 5.20EUR (27.4%). Marge brute: 72.6%. Coefficient: 3.65x</p>
                    </div>
                    <div className="bg-white border border-[#E5E7EB] rounded-lg p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-7 bg-[#F9FAFB] border border-[#E5E7EB] rounded px-2 flex items-center">
                          <span className="text-xs text-[#9CA3AF]">Demandez a l'IA...</span>
                        </div>
                        <div className="w-7 h-7 rounded bg-[#111111] flex items-center justify-center">
                          <Send className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-[#111111]">Assistant IA cuisine</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Creez une recette par chat en 10 secondes</p>
                </div>
              </div>
            </FadeIn>

            {/* Mockup 3: Supplier Order via WhatsApp */}
            <FadeIn delay={300}>
              <div className="group">
                <div className="relative bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl overflow-hidden aspect-[4/3] flex flex-col items-center justify-center p-8 hover:border-[#111111]/30 transition-all duration-500 hover:shadow-lg">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-[#111111] flex items-center px-3 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/80" />
                    <span className="text-[10px] text-white/50 ml-2 font-mono">restaumargin.fr/commandes</span>
                  </div>
                  <div className="mt-4 w-full space-y-2.5">
                    <div className="bg-white border border-[#E5E7EB] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#111111]">Metro France</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] text-[#9CA3AF]">CMD-2026-042</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#6B7280]">Mozzarella di Bufala</span>
                          <span className="text-[#111111] font-medium">5 kg</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[#6B7280]">Tomates San Marzano</span>
                          <span className="text-[#111111] font-medium">10 kg</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[#6B7280]">Farine T00</span>
                          <span className="text-[#111111] font-medium">25 kg</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white border border-[#E5E7EB] rounded-lg p-2.5 flex items-center justify-center gap-2 hover:border-[#111111]/30 transition-colors cursor-pointer">
                        <Mail className="w-3.5 h-3.5 text-[#111111]" />
                        <span className="text-xs font-medium text-[#111111]">Email</span>
                      </div>
                      <div className="flex-1 bg-[#111111] rounded-lg p-2.5 flex items-center justify-center gap-2 cursor-pointer">
                        <MessageCircle className="w-3.5 h-3.5 text-white" />
                        <span className="text-xs font-medium text-white">WhatsApp</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold text-[#111111]">Commandes en 1 clic</h3>
                  <p className="text-sm text-[#6B7280] mt-1">Envoyez par email ou WhatsApp a vos fournisseurs</p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* CTA under mockups */}
          <FadeIn delay={400}>
            <div className="mt-16 text-center">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#111111] hover:bg-[#333333] text-white font-semibold text-base transition-all shadow-lg"
              >
                Essayer gratuitement pendant 7 jours <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-3 text-sm text-[#9CA3AF]">Sans carte bancaire -- Sans engagement</p>
            </div>
          </FadeIn>
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
              <p className="mt-4 text-lg text-[#6B7280]">
                De l'inscription a l'optimisation de vos marges en quelques minutes.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-px bg-[#E5E7EB]" />

            {[
              { num: '01', icon: Package, title: 'Ajoutez vos ingredients', desc: 'Importez votre liste d\'ingredients depuis Excel ou dictez-les a l\'IA. Prix, fournisseurs, unites : tout est organise automatiquement.' },
              { num: '02', icon: ClipboardList, title: 'Creez vos fiches techniques', desc: 'L\'assistant IA genere vos fiches en 10 secondes. Food cost, marge, allergenes, coefficient — tout est calcule en temps reel.' },
              { num: '03', icon: TrendingUp, title: 'Optimisez vos marges', desc: 'Dashboard avec KPIs, alertes prix fournisseurs, Menu Engineering. Vos marges s\'ameliorent des le premier jour.' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <FadeIn key={i} delay={i * 150}>
                  <div className="text-center relative">
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#111111] flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#111111] text-white text-sm font-bold flex items-center justify-center -mt-3 -ml-8 z-20 border-2 border-white shadow">
                      {step.num}
                    </div>
                    <h3 className="text-xl font-bold text-[#111111] mb-3">{step.title}</h3>
                    <p className="text-[#6B7280] leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ 4. SOCIAL PROOF / TESTIMONIALS ═══════════════ */}
      <section id="testimonials" className="py-24 sm:py-32 bg-[#FFFFFF] border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <p className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mb-4">Temoignages</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111]">
                Ils ont transforme leurs marges
              </h2>
              <p className="mt-4 text-lg text-[#6B7280]">
                Des restaurateurs comme vous partagent leur experience.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 h-full flex flex-col hover:shadow-lg hover:border-[#111111]/20 transition-all duration-500">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-[#111111] text-[#111111]" />
                    ))}
                  </div>
                  <p className="text-[#111111] leading-relaxed mb-8 flex-1 text-[15px]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="border-t border-[#E5E7EB] pt-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#111111] flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm">{t.initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111111]">{t.name}</p>
                      <p className="text-sm text-[#6B7280]">{t.role}</p>
                      <p className="text-xs text-[#9CA3AF]">{t.restaurant}, {t.city}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ROI CALCULATOR ═══════════════ */}
      <section id="roi-calculator" className="py-24 sm:py-32 bg-[#FFFFFF] border-t border-[#E5E7EB]">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mb-4">Calculateur ROI</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111]">
                Combien pouvez-vous economiser ?
              </h2>
              <p className="mt-4 text-lg text-[#6B7280]">
                Estimez vos economies mensuelles avec RestauMargin.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <ROICalculator />
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ TRUST BADGES ═══════════════ */}
      <section className="py-16 bg-[#FFFFFF] border-t border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
              {[
                { icon: ShieldCheck, label: 'Donnees securisees', sub: 'Chiffrement SSL/TLS' },
                { icon: Globe, label: 'Made in France', sub: 'Heberge en Europe' },
                { icon: Headphones, label: 'Support 7j/7', sub: 'Reponse sous 24h' },
                { icon: FileCheck, label: 'RGPD Conforme', sub: 'Vos donnees vous appartiennent' },
                { icon: CreditCard, label: 'Essai sans CB', sub: '7 jours gratuits' },
              ].map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-[#111111]" />
                    </div>
                    <p className="text-sm font-bold text-[#111111]">{badge.label}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{badge.sub}</p>
                  </div>
                );
              })}
            </div>
          </FadeIn>
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
                <p className="text-sm text-[#9CA3AF] mb-6">Pour les independants qui veulent maitriser leurs marges.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-extrabold text-[#111111]">29</span>
                  <span className="text-[#9CA3AF] text-base">&euro;/mois</span>
                </div>
                <div className="space-y-4 mb-10 flex-1">
                  {[
                    'Fiches techniques illimitees avec calcul automatique des marges',
                    '19 actions IA : creez vos recettes par chat ou commande vocale',
                    'Commandes fournisseurs par email et WhatsApp en 1 clic',
                    'Scanner de factures IA : photographiez, les prix se mettent a jour',
                    'Suivi des prix fournisseurs (Mercuriale) avec alertes',
                    'Gestion de l\'inventaire avec alertes stock bas',
                    'HACCP digital : temperatures, nettoyage, conformite',
                    '500 requetes IA par mois',
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
                <p className="text-sm text-[#9CA3AF] mb-6">Pour les groupes qui gerent plusieurs etablissements.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-extrabold text-[#111111]">79</span>
                  <span className="text-[#9CA3AF] text-base">&euro;/mois</span>
                </div>
                <div className="space-y-4 mb-10 flex-1">
                  {[
                    'Tout du plan Pro',
                    'Multi-restaurants : gerez tous vos etablissements',
                    '2000 requetes IA par mois',
                    'Rapport IA hebdomadaire automatique',
                    'Menu Engineering : matrice BCG pour optimiser votre carte',
                    'Analyse predictive : previsions de ventes et suggestions prix',
                    'Station Balance compatible (tablette + balance Bluetooth)',
                    'Support prioritaire',
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
                <li><Link to="/temoignages" className="hover:text-[#111111] transition-colors">Temoignages</Link></li>
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

      {/* ═══════════════ STICKY CTA BAR ═══════════════ */}
      <div
        className={`fixed bottom-0 inset-x-0 z-[80] transition-all duration-500 ease-out ${
          showFloatingCTA ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#111111] border-t border-[#333333] shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Essayer gratuitement -- 7 jours sans engagement</p>
                <p className="text-xs text-white/50">Pas de carte bancaire requise</p>
              </div>
            </div>
            <p className="sm:hidden text-sm font-semibold text-white">7 jours gratuits, sans CB</p>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white hover:bg-gray-100 text-[#111111] font-semibold text-sm transition-all"
              >
                Commencer maintenant <ArrowRight className="w-4 h-4" />
              </Link>
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
        <div className={`w-6 h-6 rounded-full border border-[#E5E7EB] flex items-center justify-center shrink-0 transition-all duration-300 ${open ? 'rotate-180 bg-[#111111] border-[#111111]' : ''}`}>
          {open ? <Minus className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5 text-[#111111]" />}
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-60 pb-5' : 'max-h-0'}`}>
        <p className="px-6 text-sm text-[#6B7280] leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ROI Calculator                                                     */
/* ------------------------------------------------------------------ */

function ROICalculator() {
  const [couverts, setCouverts] = useState(80);
  const [prixMoyen, setPrixMoyen] = useState(18);
  const [nbPlats, setNbPlats] = useState(25);

  // Calculation: RestauMargin typically saves 3-5% on food cost
  // Average food cost = 30% of revenue
  // Monthly revenue = couverts * prixMoyen * 26 working days
  const monthlyRevenue = couverts * prixMoyen * 26;
  const currentFoodCost = monthlyRevenue * 0.32; // 32% average food cost
  const savingsPercent = 0.04; // 4% savings on food cost
  const monthlySavings = Math.round(currentFoodCost * savingsPercent);
  const yearlySavings = monthlySavings * 12;

  return (
    <div className="border-2 border-[#111111] rounded-2xl overflow-hidden">
      <div className="bg-[#111111] px-8 py-5">
        <div className="flex items-center gap-3">
          <Calculator className="w-5 h-5 text-white" />
          <h3 className="text-lg font-bold text-white">Estimez vos economies</h3>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Slider: Couverts/jour */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-[#111111]">Nombre de couverts par jour</label>
            <span className="text-lg font-extrabold text-[#111111] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-1 min-w-[60px] text-center">{couverts}</span>
          </div>
          <input
            type="range"
            min={20}
            max={300}
            step={5}
            value={couverts}
            onChange={(e) => setCouverts(Number(e.target.value))}
            className="w-full h-2 bg-[#E5E7EB] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#111111] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-[#111111] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
            <span>20</span>
            <span>300</span>
          </div>
        </div>

        {/* Slider: Prix moyen */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-[#111111]">Prix moyen d'un plat (EUR)</label>
            <span className="text-lg font-extrabold text-[#111111] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-1 min-w-[60px] text-center">{prixMoyen}EUR</span>
          </div>
          <input
            type="range"
            min={8}
            max={45}
            step={1}
            value={prixMoyen}
            onChange={(e) => setPrixMoyen(Number(e.target.value))}
            className="w-full h-2 bg-[#E5E7EB] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#111111] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-[#111111] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
            <span>8EUR</span>
            <span>45EUR</span>
          </div>
        </div>

        {/* Slider: Nombre de plats */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-[#111111]">Nombre de plats a la carte</label>
            <span className="text-lg font-extrabold text-[#111111] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-1 min-w-[60px] text-center">{nbPlats}</span>
          </div>
          <input
            type="range"
            min={5}
            max={80}
            step={1}
            value={nbPlats}
            onChange={(e) => setNbPlats(Number(e.target.value))}
            className="w-full h-2 bg-[#E5E7EB] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#111111] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-[#111111] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
            <span>5</span>
            <span>80</span>
          </div>
        </div>

        {/* Results */}
        <div className="border-t border-[#E5E7EB] pt-8">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 text-center">
              <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold mb-1">CA mensuel estime</p>
              <p className="text-2xl font-extrabold text-[#111111]">{monthlyRevenue.toLocaleString('fr-FR')}EUR</p>
            </div>
            <div className="bg-[#111111] rounded-xl p-5 text-center">
              <p className="text-xs text-white/60 uppercase tracking-wider font-semibold mb-1">Economies / mois</p>
              <p className="text-3xl font-extrabold text-white">{monthlySavings.toLocaleString('fr-FR')}EUR</p>
            </div>
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-5 text-center">
              <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold mb-1">Economies / an</p>
              <p className="text-2xl font-extrabold text-[#111111]">{yearlySavings.toLocaleString('fr-FR')}EUR</p>
            </div>
          </div>
          <p className="text-xs text-[#9CA3AF] text-center mt-4">
            * Estimation basee sur une reduction moyenne de 4% du food cost, constatee chez nos clients.
          </p>
          <div className="mt-6 text-center">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#111111] hover:bg-[#333333] text-white font-semibold text-base transition-all"
            >
              Commencer a economiser <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
