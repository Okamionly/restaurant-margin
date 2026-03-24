import { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
} from 'lucide-react';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const features = [
  {
    icon: Calculator,
    title: 'Calcul de marge automatique',
    desc: "Calculez instantanement vos couts matiere et marges sur chaque plat de votre carte.",
  },
  {
    icon: ClipboardList,
    title: 'Fiches techniques completes',
    desc: "Creez des fiches techniques detaillees avec ingredients, quantites et couts a jour.",
  },
  {
    icon: Sparkles,
    title: 'Suggestions de recettes intelligentes',
    desc: "Recevez des suggestions basees sur vos ingredients disponibles et vos objectifs de marge.",
  },
  {
    icon: Truck,
    title: 'Gestion des fournisseurs',
    desc: "Centralisez vos fournisseurs, comparez les prix et optimisez vos approvisionnements.",
  },
  {
    icon: BarChart3,
    title: 'Tableau de bord analytics',
    desc: "Visualisez vos performances en temps reel avec des graphiques clairs et actionnables.",
  },
  {
    icon: Smartphone,
    title: 'Application installable PWA',
    desc: "Accedez a RestauMargin depuis n'importe quel appareil, meme hors connexion.",
  },
];

const steps = [
  {
    num: '1',
    title: 'Ajoutez vos ingredients et fournisseurs',
    desc: "Importez ou saisissez votre catalogue d'ingredients avec les prix fournisseurs.",
    icon: Utensils,
  },
  {
    num: '2',
    title: 'Creez vos recettes avec suggestions automatiques',
    desc: "Composez vos fiches techniques et laissez l'IA vous suggerer des optimisations.",
    icon: BookOpen,
  },
  {
    num: '3',
    title: 'Analysez vos marges et optimisez votre carte',
    desc: "Identifiez les plats les plus rentables et ajustez votre carte en consequence.",
    icon: TrendingUp,
  },
];

const stats = [
  { value: '+200', label: "ingredients references", icon: Utensils },
  { value: '+60', label: 'recettes templates', icon: BookOpen },
  { value: '12', label: 'fournisseurs', icon: Truck },
  { value: '< 1s', label: 'calcul instantane', icon: Zap },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-lg shadow-blue-800/20 group-hover:shadow-blue-800/40 transition-shadow">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              RestauMargin
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-blue-800 transition-colors"
            >
              Connexion
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-800 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-800/25"
            >
              Commencer
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-b from-blue-50 to-transparent opacity-80" />
          <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-indigo-100/40 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold mb-6">
                  <Star className="w-3.5 h-3.5" />
                  Gratuit pendant la beta
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 bg-clip-text text-transparent">
                    Maitrisez vos marges,
                  </span>
                  <br />
                  <span className="text-slate-900">boostez votre rentabilite</span>
                </h1>
              </FadeIn>
              <FadeIn delay={200}>
                <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  L'outil de calcul de marge et de gestion des fiches techniques
                  <span className="text-blue-800 font-semibold"> concu par et pour les restaurateurs</span>.
                </p>
              </FadeIn>
              <FadeIn delay={300}>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-800 text-white font-semibold text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-800/25 hover:shadow-blue-800/40 hover:-translate-y-0.5"
                  >
                    Commencer gratuitement
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold text-base hover:border-blue-300 hover:text-blue-800 transition-all"
                  >
                    Voir la demo
                    <ChevronDown className="w-5 h-5" />
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Right: Hero illustration */}
            <FadeIn delay={400} className="hidden lg:block">
              <div className="relative">
                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-6 relative z-10">
                  {/* Fake dashboard header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center">
                        <ChefHat className="w-4.5 h-4.5 text-white" />
                      </div>
                      <span className="font-bold text-sm text-slate-800">Tableau de bord</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                  </div>

                  {/* Fake stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: 'Marge moyenne', val: '68%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { label: 'Cout matiere', val: '32%', color: 'text-blue-600', bg: 'bg-blue-50' },
                      { label: 'Recettes', val: '47', color: 'text-violet-600', bg: 'bg-violet-50' },
                    ].map((s) => (
                      <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                        <div className={`text-2xl font-extrabold ${s.color}`}>{s.val}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Fake chart bars */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xs font-semibold text-slate-500 mb-3">Marges par categorie</div>
                    <div className="space-y-2.5">
                      {[
                        { name: 'Entrees', pct: 72, color: 'bg-blue-500' },
                        { name: 'Plats', pct: 65, color: 'bg-blue-600' },
                        { name: 'Desserts', pct: 78, color: 'bg-blue-700' },
                        { name: 'Boissons', pct: 85, color: 'bg-blue-800' },
                      ].map((bar) => (
                        <div key={bar.name} className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 w-16">{bar.name}</span>
                          <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${bar.color} rounded-full`}
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
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-600">+12%</div>
                    <div className="text-[10px] text-slate-400">ce mois</div>
                  </div>
                </div>

                <div className="absolute -bottom-3 -left-4 bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 flex items-center gap-2" style={{ animation: 'bounce 3.5s infinite' }}>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calculator className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-800">Marge: 68%</div>
                    <div className="text-[10px] text-slate-400">Risotto truffe</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-gradient-to-r from-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 100}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-3">
                    <s.icon className="w-6 h-6 text-blue-200" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</div>
                  <div className="text-sm text-blue-200 mt-1">{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Tout ce dont vous avez besoin pour{' '}
                <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                  piloter vos marges
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                Une suite d'outils puissants et simples pour optimiser la rentabilite de votre restaurant.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 80}>
                <div className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-800 flex items-center justify-center mb-4 transition-colors duration-300">
                    <f.icon className="w-6 h-6 text-blue-800 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Demarrez en{' '}
                <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                  3 etapes simples
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                Configurez votre espace en quelques minutes et commencez a optimiser vos marges.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line - desktop */}
            <div className="hidden md:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200" />

            {steps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 150}>
                <div className="relative text-center">
                  {/* Step number circle */}
                  <div className="relative z-10 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-xl shadow-blue-800/25 mb-6">
                    <span className="text-2xl font-extrabold text-white">{step.num}</span>
                  </div>
                  <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-blue-800" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Un seul plan,{' '}
                <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                  tout inclus
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                Profitez de toutes les fonctionnalites gratuitement pendant la phase beta.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="max-w-md mx-auto">
              <div className="relative bg-white rounded-3xl border-2 border-blue-800 shadow-2xl shadow-blue-100 overflow-hidden">
                {/* Badge */}
                <div className="absolute top-0 right-0 bg-blue-800 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
                  BETA
                </div>

                <div className="p-8 text-center">
                  <h3 className="text-xl font-bold text-slate-900">Acces complet</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold text-blue-800">0&euro;</span>
                    <span className="text-slate-400 text-lg">/mois</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Gratuit pendant toute la duree de la beta</p>

                  <div className="mt-8 space-y-3 text-left">
                    {[
                      'Calcul de marge illimite',
                      'Fiches techniques completes',
                      'Suggestions intelligentes',
                      'Gestion fournisseurs',
                      'Tableau de bord analytics',
                      'Application PWA installable',
                      'Support prioritaire',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-800 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/login"
                    className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-800 text-white font-semibold text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-800/25 hover:shadow-blue-800/40"
                  >
                    S'inscrire maintenant
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Pret a optimiser la rentabilite de votre restaurant ?
            </h2>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
              Rejoignez les restaurateurs qui utilisent RestauMargin pour maitriser leurs couts et augmenter leurs marges.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-800 font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">RestauMargin</span>
              <span className="text-sm">&copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/login" className="hover:text-white transition-colors">
                Connexion
              </Link>
              <a href="mailto:contact@restaumargin.fr" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
