import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChefHat,
  Calculator,
  ClipboardList,
  Sparkles,
  Truck,
  BarChart3,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Utensils,
  Zap,
  Star,
  StarHalf,
  Play,
  Package,
  Users,
  Quote,
  Menu,
  X,
  Shield,
  Lock,
  Mail,
  BadgeCheck,
} from 'lucide-react';

/* ───────────────────────── Hooks ───────────────────────── */

function useInView(threshold = 0.15) {
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

/* ───────────────────────── Components ───────────────────────── */

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

function AnimatedStat({ value, suffix = '', label, icon: Icon }: { value: number; suffix?: string; label: string; icon: React.ElementType }) {
  const { ref, visible } = useInView(0.3);
  const count = useAnimatedCounter(value, 1800, visible);
  return (
    <div ref={ref} className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-4">
        <Icon className="w-7 h-7 text-blue-200" />
      </div>
      <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        {count}{suffix}
      </div>
      <div className="text-sm text-blue-200/80 mt-2 font-medium">{label}</div>
    </div>
  );
}

/* ───────────────────────── Data ───────────────────────── */

const features = [
  {
    icon: ClipboardList,
    title: 'Fiches techniques professionnelles',
    desc: 'Créez des fiches techniques détaillées avec ingrédients, quantités, étapes de préparation et coûts actualisés automatiquement.',
  },
  {
    icon: Calculator,
    title: 'Calcul de marge en temps réel',
    desc: 'Visualisez instantanément vos coûts matière, marges brutes et prix de vente recommandés sur chaque plat.',
  },
  {
    icon: Truck,
    title: 'Gestion des fournisseurs',
    desc: 'Centralisez vos fournisseurs, comparez les prix, suivez les évolutions tarifaires et optimisez vos achats.',
  },
  {
    icon: Package,
    title: 'Inventaire et stock',
    desc: 'Suivez vos stocks en temps réel, anticipez les ruptures et réduisez le gaspillage alimentaire.',
  },
  {
    icon: Sparkles,
    title: 'Suggestions intelligentes (IA)',
    desc: "L'intelligence artificielle analyse vos données pour suggérer des optimisations de recettes et de prix.",
  },
  {
    icon: Smartphone,
    title: 'Application installable (PWA)',
    desc: "Accédez à RestauMargin depuis n'importe quel appareil — smartphone, tablette ou ordinateur, même hors connexion.",
  },
];

const steps = [
  { num: '01', title: 'Choisissez votre abonnement', desc: 'Basic 9€, Pro 29€ ou Business 79€/mois. Activation instantanée.', icon: Users },
  { num: '02', title: 'Ajoutez vos ingrédients et fournisseurs', desc: 'Importez ou saisissez votre catalogue avec les prix.', icon: Utensils },
  { num: '03', title: 'Composez vos recettes', desc: 'Créez vos fiches techniques avec calcul automatique.', icon: BookOpen },
  { num: '04', title: 'Analysez et optimisez', desc: 'Pilotez vos marges avec des données précises.', icon: TrendingUp },
];

const testimonials = [
  {
    quote: "+4 points de marge en 3 mois. Les fiches techniques automatisées nous ont tout changé.",
    name: 'Laurent Dubois',
    role: 'Chef de cuisine',
    place: 'Restaurant gastronomique, Lyon',
    rating: 4.5,
  },
  {
    quote: "Interface intuitive, calcul en temps réel. Exactement ce qu'il manquait aux restaurateurs.",
    name: 'Sophie Martin',
    role: 'Directrice',
    place: 'Brasserie Le Comptoir, Paris',
    rating: 5,
  },
  {
    quote: "Chaque centime compte en food truck. RestauMargin m'aide à rester compétitif et rentable.",
    name: 'Karim Benali',
    role: 'Gérant',
    place: 'Food truck Street Flavors, Bordeaux',
    rating: 4.5,
  },
];

const pricingFeaturesFree = [
  'Calcul de marge illimité',
  'Fiches techniques complètes',
  'Suggestions intelligentes (IA)',
  'Gestion fournisseurs',
  'Tableau de bord analytics',
  'Application PWA installable',
  'Support par email',
];

const pricingFeaturesPro = [
  'Tout du plan Gratuit',
  'Multi-restaurant',
  'Export avancé (PDF, Excel)',
  'Support prioritaire 24/7',
  'Intégrations fournisseurs',
  'API & webhooks',
  'Formation personnalisée',
];

/* ───────────────────────── Page ───────────────────────── */

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [proEmail, setProEmail] = useState('');
  const [proEmailSent, setProEmailSent] = useState(false);
  const [proLoading, setProLoading] = useState(false);
  const [proError, setProError] = useState('');
  const [kitForm, setKitForm] = useState({ nom: '', email: '', telephone: '', message: '' });
  const [kitFormSent, setKitFormSent] = useState(false);
  const [kitLoading, setKitLoading] = useState(false);
  const [kitError, setKitError] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden scroll-smooth">

      {/* ════════════════ Navbar ════════════════ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-700/25 group-hover:shadow-blue-700/40 transition-shadow">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              RestauMargin
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors cursor-pointer">
              Fonctionnalités
            </button>
            <button onClick={() => scrollTo('pricing')} className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors cursor-pointer">
              Tarifs
            </button>
            <button onClick={() => scrollTo('testimonials')} className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors cursor-pointer">
              Témoignages
            </button>
            <Link to="/station-produit" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
              Kit Station <Zap className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors px-3 py-2"
            >
              Connexion
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/25 hover:shadow-blue-700/40"
            >
              Voir les tarifs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-blue-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-xl">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollTo('features')} className="block w-full text-left text-sm font-medium text-slate-700 hover:text-blue-700 py-2">
                Fonctionnalités
              </button>
              <button onClick={() => scrollTo('pricing')} className="block w-full text-left text-sm font-medium text-slate-700 hover:text-blue-700 py-2">
                Tarifs
              </button>
              <button onClick={() => scrollTo('testimonials')} className="block w-full text-left text-sm font-medium text-slate-700 hover:text-blue-700 py-2">
                Témoignages
              </button>
              <hr className="border-slate-100" />
              <Link to="/login" className="block text-sm font-medium text-slate-700 hover:text-blue-700 py-2">
                Connexion
              </Link>
              <Link
                to="/pricing"
                className="block w-full text-center px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-all"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ════════════════ Hero ════════════════ */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.25) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(37,99,235,0.15) 0%, transparent 60%)',
            animation: 'meshMove 12s ease-in-out infinite alternate',
          }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-b from-blue-50 to-transparent opacity-80" />
          <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl" style={{ animation: 'meshFloat 8s ease-in-out infinite alternate' }} />
          <div className="absolute top-48 -left-20 w-72 h-72 rounded-full bg-indigo-100/30 blur-3xl" style={{ animation: 'meshFloat 10s ease-in-out infinite alternate-reverse' }} />
          {/* Dot grid pattern */}
          <div className="absolute inset-0 opacity-[0.035]" style={{
            backgroundImage: 'radial-gradient(circle, #1e40af 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
        </div>
        <style>{`
          @keyframes meshMove {
            0% { transform: scale(1) rotate(0deg); }
            100% { transform: scale(1.08) rotate(2deg); }
          }
          @keyframes meshFloat {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(-20px) scale(1.05); }
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div className="text-center lg:text-left">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-6 tracking-wide">
                  <Star className="w-3.5 h-3.5 fill-blue-700" />
                  GRATUIT PENDANT LA BETA
                </div>
              </FadeIn>

              <FadeIn delay={100}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.1] tracking-tight">
                  <span className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-500 bg-clip-text text-transparent">
                    La solution complète
                  </span>
                  <br />
                  <span className="text-slate-900">
                    de gestion des marges
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                    pour la restauration
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={200}>
                <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Calculez vos coûts, optimisez vos prix, maîtrisez votre rentabilité.
                  <span className="text-blue-700 font-semibold"> Utilisé par +100 restaurateurs en France.</span>
                </p>
              </FadeIn>

              <FadeIn delay={300}>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/pricing"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-colors"
                  >
                    Voir les tarifs <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <Play className="w-4 h-4" /> Voir une démo
                  </a>
                </div>
                <p className="mt-3 text-sm text-slate-400 text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Pas de carte bancaire requise
                </p>
              </FadeIn>
            </div>

            {/* Right — Mock dashboard */}
            <FadeIn delay={400} className="hidden lg:block">
              <div className="relative">
                {/* Main card — glassmorphism */}
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/60 border border-white/50 p-6 relative z-10" style={{ boxShadow: '0 8px 32px rgba(31,38,135,0.12), inset 0 0 0 1px rgba(255,255,255,0.3)' }}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                        <ChefHat className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-sm text-slate-800">Tableau de bord</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: 'Marge moyenne', val: '68%', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                      { label: 'Coût matière', val: '32%', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                      { label: 'Recettes', val: '47', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
                    ].map((s) => (
                      <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3`}>
                        <div className={`text-2xl font-extrabold ${s.color}`}>{s.val}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart bars */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-xs font-semibold text-slate-500 mb-3">Marges par catégorie</div>
                    <div className="space-y-2.5">
                      {[
                        { name: 'Entrées', pct: 72, color: 'bg-blue-500' },
                        { name: 'Plats', pct: 65, color: 'bg-blue-600' },
                        { name: 'Desserts', pct: 78, color: 'bg-blue-700' },
                        { name: 'Boissons', pct: 85, color: 'bg-blue-800' },
                      ].map((bar) => (
                        <div key={bar.name} className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 w-16 font-medium">{bar.name}</span>
                          <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${bar.color} rounded-full transition-all duration-1000`}
                              style={{ width: `${bar.pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 w-8 text-right">{bar.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg shadow-slate-200/50 border border-white/50 px-4 py-3 flex items-center gap-2.5 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-emerald-600">+12%</div>
                    <div className="text-[10px] text-slate-400">ce mois</div>
                  </div>
                </div>

                <div className="absolute -bottom-3 -left-4 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg shadow-slate-200/50 border border-white/50 px-4 py-3 flex items-center gap-2.5" style={{ animation: 'bounce 3.5s infinite' }}>
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calculator className="w-4.5 h-4.5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-blue-800">Marge: 68%</div>
                    <div className="text-[10px] text-slate-400">Risotto truffe</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════════════ Trusted By ════════════════ */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
              Compatible avec vos fournisseurs
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                { name: 'METRO', bg: 'bg-[#003D7A]', text: 'text-white' },
                { name: 'Transgourmet', bg: 'bg-[#E30613]', text: 'text-white' },
                { name: 'Pomona', bg: 'bg-[#00833E]', text: 'text-white' },
                { name: 'Sysco', bg: 'bg-[#004B87]', text: 'text-white' },
                { name: 'Brake', bg: 'bg-[#D4202C]', text: 'text-white' },
              ].map((s) => (
                <span
                  key={s.name}
                  className={`${s.bg} ${s.text} px-4 py-1.5 rounded-full text-sm sm:text-base font-bold tracking-tight opacity-80 hover:opacity-100 transition-opacity select-none`}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

      {/* ════════════════ Trust Badges ════════════════ */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {[
                { icon: Shield, label: 'Données hébergées en France', color: 'text-blue-700' },
                { icon: BadgeCheck, label: 'Conforme RGPD', color: 'text-emerald-600' },
                { icon: Lock, label: 'Chiffrement SSL', color: 'text-indigo-600' },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <badge.icon className={`w-5 h-5 ${badge.color}`} />
                  {badge.label}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

      {/* ════════════════ Features ════════════════ */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-widest mb-3">Fonctionnalités</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Tout ce dont vous avez besoin pour{' '}
                <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent">
                  piloter vos marges
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                Une suite d'outils puissants et simples pour optimiser la rentabilité de votre restaurant.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 80}>
                <div className="group relative bg-white rounded-2xl p-7 border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 h-full cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-blue-800 flex items-center justify-center mb-5 transition-all duration-300 group-hover:rotate-[360deg] group-hover:scale-110" style={{ transitionDuration: '500ms' }}>
                    <f.icon className="w-6 h-6 text-blue-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      {/* ════════════════ Kit Station Balance ════════════════ */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-100 to-blue-50">
                  <img
                    src="/images/restaumargin-station-opt.webp"
                    alt="Kit Station RestauMargin — Tablette + Balance connectée"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-lg">
                  À partir de 450 € HT
                </div>
                <div className="absolute -top-3 -left-3 bg-emerald-500 text-white px-4 py-1.5 rounded-lg shadow-lg text-xs font-bold uppercase tracking-wide">
                  Nouveau 2026
                </div>
              </div>
              {/* Content */}
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Nouveau</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                  Kit Station{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">RestauMargin</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                  Le support EST la balance. Glissez votre tablette dans le moule silicone, pesez vos ingrédients sur le plateau inox et maîtrisez vos marges en temps réel.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    { title: 'Balance intégrée 5kg', desc: 'Le support est la balance — plateau inox 304L, précision 0.5g, BLE 5.0' },
                    { title: 'Moule silicone tablette', desc: 'Glissez votre Samsung Tab A9+ dans le bras, écran tactile accessible' },
                    { title: 'Bras solidaire', desc: 'Design monobloc, pas de pièce séparée, robuste pour la cuisine pro' },
                    { title: 'App RestauMargin incluse', desc: 'Fiches techniques auto, calcul de marges, mercuriale fournisseurs' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mt-0.5">
                        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/station-produit"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all"
                  >
                    Découvrir le Kit Station
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a
                    href="#kit-contact"
                    className="inline-flex items-center gap-2 border-2 border-blue-200 hover:border-blue-400 text-blue-700 font-semibold px-6 py-3 rounded-xl transition-all"
                  >
                    Demander un devis
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════ How It Works ════════════════ */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-slate-900 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3">Comment ça marche</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Démarrez en{' '}
                <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  4 étapes simples
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Configurez votre espace en quelques minutes et commencez à optimiser vos marges.
              </p>
            </div>
          </FadeIn>

          {/* Timeline */}
          <div className="relative">
            {/* Connector line — desktop */}
            <div className="hidden lg:block absolute top-20 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <FadeIn key={step.num} delay={i * 150}>
                  <div className="relative text-center group">
                    <div className="relative z-10 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-xl shadow-blue-700/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-lg font-extrabold text-white">{step.num}</span>
                    </div>
                    <div className="mx-auto w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center mb-4">
                      <step.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ Statistics ════════════════ */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <AnimatedStat value={239} suffix="+" label="Ingrédients référencés" icon={Utensils} />
            <AnimatedStat value={60} suffix="+" label="Templates de recettes" icon={BookOpen} />
            <AnimatedStat value={50} suffix="+" label="Fournisseurs français" icon={Truck} />
            <AnimatedStat value={1} suffix="s" label="Calcul instantané" icon={Zap} />
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

      {/* ════════════════ Testimonials ════════════════ */}
      <section id="testimonials" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-widest mb-3">Témoignages</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Ils nous font{' '}
                <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent">
                  confiance
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                Découvrez comment RestauMargin aide les professionnels de la restauration au quotidien.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 120}>
                <div className="bg-white rounded-2xl p-7 border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 h-full flex flex-col">
                  {/* Stars + Avis vérifié */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.floor(t.rating) }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      {t.rating % 1 !== 0 && (
                        <StarHalf className="w-4 h-4 fill-amber-400 text-amber-400" />
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <BadgeCheck className="w-3 h-3" /> Avis vérifié
                    </span>
                  </div>

                  <div className="relative mb-5 flex-1">
                    <Quote className="absolute -top-1 -left-1 w-8 h-8 text-blue-100" />
                    <p className="text-sm text-slate-600 leading-relaxed relative z-10 pl-2">{t.quote}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-sm">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role} — {t.place}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

      {/* ════════════════ Pricing ════════════════ */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-widest mb-3">Tarifs</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Des tarifs{' '}
                <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent">
                  simples et transparents
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                A partir de 9€/mois. Accédez à tous les outils de gestion de marge.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free plan */}
            <FadeIn delay={100}>
              <div className="relative bg-white rounded-3xl border-2 border-blue-700 shadow-2xl shadow-blue-100/50 overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                  Populaire
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900">Gratuit</h3>
                  <p className="text-sm text-slate-500 mt-1">Accès complet pendant la bêta</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-blue-700">0&euro;</span>
                    <span className="text-slate-400 text-lg">/mois</span>
                  </div>

                  <div className="mt-8 space-y-3 flex-1">
                    {pricingFeaturesFree.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-700 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/login"
                    className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-700 text-white font-semibold text-base hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/25 hover:shadow-blue-700/40"
                  >
                    Commencer maintenant
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Pro plan */}
            <FadeIn delay={200}>
              <div className="relative bg-slate-50 rounded-3xl border-2 border-slate-200 overflow-hidden h-full flex flex-col opacity-80">
                <div className="absolute top-0 right-0 bg-slate-400 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                  Bientôt
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900">Pro</h3>
                  <p className="text-sm text-slate-500 mt-1">Pour les multi-restaurants</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-slate-400">--&euro;</span>
                    <span className="text-slate-400 text-lg">/mois</span>
                  </div>

                  <div className="mt-8 space-y-3 flex-1">
                    {pricingFeaturesPro.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        <span className="text-sm text-slate-500">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <p className="text-xs font-semibold text-slate-500 mb-2 text-center">Prévenez-moi du lancement</p>
                    {proEmailSent ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-medium py-3">
                        <CheckCircle2 className="w-4 h-4" /> Vous serez notifié !
                      </div>
                    ) : (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!proEmail) return;
                          setProLoading(true);
                          setProError('');
                          try {
                            const res = await fetch('/api/contact', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                name: 'Intéressé Pro',
                                email: proEmail,
                                source: 'pro-waitlist',
                              }),
                            });
                            if (!res.ok) {
                              const data = await res.json();
                              throw new Error(data.error || 'Erreur');
                            }
                            setProEmailSent(true);
                          } catch (err: unknown) {
                            const message = err instanceof Error ? err.message : 'Erreur. Réessayez.';
                            setProError(message);
                          } finally {
                            setProLoading(false);
                          }
                        }}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex gap-2">
                          <input
                            type="email"
                            required
                            value={proEmail}
                            onChange={(e) => setProEmail(e.target.value)}
                            placeholder="votre@email.com"
                            className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="submit"
                            disabled={proLoading}
                            className="px-4 py-2.5 rounded-xl bg-slate-700 text-white text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {proLoading ? '...' : <Mail className="w-4 h-4" />}
                          </button>
                        </div>
                        {proError && (
                          <p className="text-xs text-red-500">{proError}</p>
                        )}
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════════════ CTA Banner ════════════════ */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
              Prêt à optimiser vos marges ?
            </h2>
            <p className="text-lg text-blue-200/90 mb-10 max-w-2xl mx-auto">
              Rejoignez les restaurateurs qui utilisent RestauMargin pour maîtriser leurs coûts et augmenter leurs marges. Gratuit, sans engagement.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-blue-700 font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:-translate-y-0.5"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════ Kit Contact Form ════════════════ */}
      <section id="kit-form" className="py-20 sm:py-28 bg-slate-50 scroll-mt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-widest mb-3">Contact</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Demander un devis pour le{' '}
                <span className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent">Kit Station</span>
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                Remplissez le formulaire et notre équipe vous recontacte sous 24h.
              </p>
            </div>
            {kitFormSent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <p className="text-lg font-semibold text-emerald-800">Demande envoyée !</p>
                <p className="text-sm text-emerald-600 mt-1">Nous vous recontactons très vite.</p>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setKitLoading(true);
                  setKitError('');
                  try {
                    const res = await fetch('/api/contact', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: kitForm.nom,
                        email: kitForm.email,
                        phone: kitForm.telephone,
                        message: kitForm.message,
                        source: 'kit-station',
                      }),
                    });
                    if (!res.ok) {
                      const data = await res.json();
                      throw new Error(data.error || 'Erreur lors de l\'envoi');
                    }
                    setKitFormSent(true);
                  } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Erreur lors de l\'envoi. Veuillez réessayer.';
                    setKitError(message);
                  } finally {
                    setKitLoading(false);
                  }
                }}
                className="bg-white rounded-2xl border border-slate-100 shadow-xl p-8 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom</label>
                    <input
                      type="text"
                      required
                      value={kitForm.nom}
                      onChange={(e) => setKitForm({ ...kitForm, nom: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={kitForm.email}
                      onChange={(e) => setKitForm({ ...kitForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Téléphone</label>
                  <input
                    type="tel"
                    value={kitForm.telephone}
                    onChange={(e) => setKitForm({ ...kitForm, telephone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                  <textarea
                    rows={3}
                    value={kitForm.message}
                    onChange={(e) => setKitForm({ ...kitForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Décrivez votre besoin..."
                  />
                </div>
                {kitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                    {kitError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={kitLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-700 text-white font-semibold text-base hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/25 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {kitLoading ? 'Envoi en cours...' : 'Demander un devis'}
                  {!kitLoading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ════════════════ Footer ════════════════ */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top */}
          <div className="py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">RestauMargin</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                La solution complète de gestion des marges pour les professionnels de la restauration.
              </p>
            </div>

            {/* Produit */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Produit</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => scrollTo('features')} className="text-sm hover:text-white transition-colors">Fonctionnalités</button></li>
                <li><button onClick={() => scrollTo('pricing')} className="text-sm hover:text-white transition-colors">Tarifs</button></li>
                <li><button onClick={() => scrollTo('testimonials')} className="text-sm hover:text-white transition-colors">Témoignages</button></li>
              </ul>
            </div>

            {/* Ressources */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Ressources</h4>
              <ul className="space-y-2.5">
                <li><a href="#kit-form" className="text-sm hover:text-white transition-colors">Contact</a></li>
                <li><a href="#kit-form" className="text-sm hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Légal</h4>
              <ul className="space-y-2.5">
                <li><Link to="/mentions-legales" className="text-sm text-slate-500 hover:text-white transition-colors">Mentions légales</Link></li>
                <li><Link to="/cgu" className="text-sm text-slate-500 hover:text-white transition-colors">CGU</Link></li>
                <li><Link to="/politique-confidentialite" className="text-sm text-slate-500 hover:text-white transition-colors">Politique de confidentialité</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-slate-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} RestauMargin. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              {/* Social placeholders */}
              {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <span key={social} className="text-xs text-slate-600 hover:text-white transition-colors cursor-pointer">
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
