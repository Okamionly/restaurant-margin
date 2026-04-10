import { formatCurrency } from '../utils/currency';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, AlertTriangle, BarChart3, ShoppingBasket, ArrowRight, Lock, Eye, Percent, DollarSign, UtensilsCrossed, Truck, ClipboardList, Target, X, Sparkles } from 'lucide-react';
import FoodIllustration from '../components/FoodIllustration';

/* ═══════════════════════════════════════════════════════════════
   Demo Page — Mode demo pour les prospects (route publique /demo)
   DONNEES FICTIVES — Restaurant fictif "Le Bistrot de Marie"
   Toutes les donnees ci-dessous sont inventees a des fins de
   demonstration. Aucune API n'est appelee. Read-only.
   ═══════════════════════════════════════════════════════════════ */

// DEMO DATA — Donnees fictives pour le restaurant "Le Bistrot de Marie"
const FAKE_RECIPES = [
  {
    name: 'Risotto aux champignons et parmesan',
    category: 'Plat',
    foodCost: 24.6,
    costPerServing: 1.79,
    sellingPrice: 8.00,
    margin: 5.48,
    popularity: 180,
    status: 'puzzle' as const,
    ingredients: [
      { name: 'Riz arborio', qty: '250g', cost: 0.80 },
      { name: 'Champignons de Paris', qty: '200g', cost: 0.90 },
      { name: 'Parmesan AOP', qty: '40g', cost: 0.72 },
      { name: 'Vin blanc sec', qty: '80ml', cost: 0.48 },
      { name: 'Beurre doux', qty: '30g', cost: 0.24 },
      { name: 'Oignon', qty: '50g', cost: 0.08 },
      { name: 'Bouillon de legumes', qty: '500ml', cost: 0.25 },
    ],
  },
  {
    name: 'Magret de canard aux cerises',
    category: 'Plat',
    foodCost: 28.1,
    costPerServing: 5.20,
    sellingPrice: 20.91,
    margin: 15.71,
    popularity: 110,
    status: 'star' as const,
    ingredients: [
      { name: 'Magret de canard', qty: '350g', cost: 7.88 },
      { name: 'Cerises fraiches', qty: '120g', cost: 1.02 },
      { name: 'Vinaigre balsamique', qty: '30ml', cost: 0.45 },
      { name: 'Miel', qty: '20g', cost: 0.18 },
      { name: 'Thym frais', qty: '5g', cost: 0.10 },
      { name: 'Beurre doux', qty: '20g', cost: 0.16 },
    ],
  },
  {
    name: 'Creme brulee a la vanille',
    category: 'Dessert',
    foodCost: 20.0,
    costPerServing: 1.20,
    sellingPrice: 6.00,
    margin: 4.80,
    popularity: 200,
    status: 'star' as const,
    ingredients: [
      { name: 'Creme liquide 35%', qty: '200ml', cost: 0.76 },
      { name: 'Oeufs frais (jaunes)', qty: '3 pcs', cost: 0.84 },
      { name: 'Sucre en poudre', qty: '60g', cost: 0.07 },
      { name: 'Gousse de vanille', qty: '0.5 pcs', cost: 2.25 },
    ],
  },
  {
    name: 'Salade Nicoise revisitee',
    category: 'Entree',
    foodCost: 32.5,
    costPerServing: 3.90,
    sellingPrice: 12.00,
    margin: 8.10,
    popularity: 95,
    status: 'workhorse' as const,
    ingredients: [
      { name: 'Thon frais', qty: '120g', cost: 3.36 },
      { name: 'Oeuf frais', qty: '1 pc', cost: 0.28 },
      { name: 'Olives noires Kalamata', qty: '30g', cost: 0.33 },
      { name: 'Tomates grappe', qty: '100g', cost: 0.35 },
      { name: 'Haricots verts frais', qty: '80g', cost: 0.46 },
      { name: 'Anchois', qty: '20g', cost: 0.40 },
      { name: 'Huile olive extra vierge', qty: '20ml', cost: 0.18 },
    ],
  },
  {
    name: 'Tartare de boeuf classique',
    category: 'Plat',
    foodCost: 35.2,
    costPerServing: 6.50,
    sellingPrice: 18.50,
    margin: 12.00,
    popularity: 60,
    status: 'dog' as const,
    ingredients: [
      { name: 'Boeuf hache (rumsteck)', qty: '180g', cost: 2.61 },
      { name: 'Capres', qty: '15g', cost: 0.23 },
      { name: 'Cornichons', qty: '20g', cost: 0.12 },
      { name: 'Oignon rouge', qty: '30g', cost: 0.09 },
      { name: 'Jaune oeuf', qty: '1 pc', cost: 0.28 },
      { name: 'Moutarde de Dijon', qty: '10g', cost: 0.06 },
      { name: 'Tabasco', qty: '2ml', cost: 0.04 },
    ],
  },
];

// DEMO DATA — 20 Ingredients fictifs
const FAKE_INGREDIENTS = [
  { name: 'Riz arborio', unit: 'kg', price: 3.20, stock: 8.5, alert: false },
  { name: 'Champignons de Paris', unit: 'kg', price: 4.50, stock: 3.2, alert: false },
  { name: 'Parmesan AOP', unit: 'kg', price: 18.00, stock: 2.1, alert: false },
  { name: 'Magret de canard', unit: 'kg', price: 22.50, stock: 4.0, alert: false },
  { name: 'Creme liquide 35%', unit: 'L', price: 3.80, stock: 6.0, alert: false },
  { name: 'Beurre doux', unit: 'kg', price: 8.00, stock: 5.5, alert: false },
  { name: 'Oeufs frais', unit: 'piece', price: 0.28, stock: 120, alert: false },
  { name: 'Vanille Bourbon', unit: 'gousse', price: 4.50, stock: 15, alert: false },
  { name: 'Thon frais', unit: 'kg', price: 28.00, stock: 1.8, alert: true },
  { name: 'Boeuf hache', unit: 'kg', price: 14.50, stock: 3.5, alert: false },
  { name: 'Huile olive extra vierge', unit: 'L', price: 9.20, stock: 4.0, alert: false },
  { name: 'Tomates grappe', unit: 'kg', price: 3.50, stock: 5.0, alert: false },
  { name: 'Haricots verts frais', unit: 'kg', price: 5.80, stock: 2.5, alert: false },
  { name: 'Olives noires Kalamata', unit: 'kg', price: 11.00, stock: 1.5, alert: true },
  { name: 'Cerises fraiches', unit: 'kg', price: 8.50, stock: 2.0, alert: false },
  { name: 'Vin blanc sec', unit: 'L', price: 6.00, stock: 3.0, alert: false },
  { name: 'Moutarde de Dijon', unit: 'kg', price: 5.50, stock: 1.0, alert: false },
  { name: 'Capres', unit: 'kg', price: 15.00, stock: 0.5, alert: true },
  { name: 'Sucre en poudre', unit: 'kg', price: 1.20, stock: 10.0, alert: false },
  { name: 'Farine T55', unit: 'kg', price: 0.90, stock: 12.0, alert: false },
];

// DEMO DATA — KPIs fictifs
const FAKE_KPIS = {
  foodCostGlobal: 26.8,
  foodCostTarget: 28.0,
  marginBrute: 73.2,
  recipeCount: 24,
  ingredientCount: 87,
  alertCount: 3,
  caHT: 46327,
  couverts: 1456,
  fournisseurs: 8,
  commandesMois: 34,
};

// Margin evolution fake data (last 6 months)
const MARGIN_EVOLUTION = [
  { month: 'Nov', margin: 68.5, foodCost: 31.5 },
  { month: 'Dec', margin: 69.2, foodCost: 30.8 },
  { month: 'Jan', margin: 70.1, foodCost: 29.9 },
  { month: 'Fev', margin: 71.8, foodCost: 28.2 },
  { month: 'Mar', margin: 72.5, foodCost: 27.5 },
  { month: 'Avr', margin: 73.2, foodCost: 26.8 },
];

// Category distribution for donut-style chart
const CATEGORY_DIST = [
  { name: 'Plats', pct: 45, color: '#0d9488' },
  { name: 'Entrees', pct: 20, color: '#111111' },
  { name: 'Desserts', pct: 18, color: '#6B7280' },
  { name: 'Boissons', pct: 12, color: '#D4D4D4' },
  { name: 'Accomp.', pct: 5, color: '#E5E7EB' },
];

function statusLabel(s: string) {
  switch (s) {
    case 'star': return { text: 'Star', color: 'bg-emerald-100 text-emerald-700', dotColor: 'bg-emerald-500' };
    case 'puzzle': return { text: 'Puzzle', color: 'bg-amber-100 text-amber-700', dotColor: 'bg-amber-500' };
    case 'workhorse': return { text: 'Cheval de labour', color: 'bg-blue-100 text-blue-700', dotColor: 'bg-blue-500' };
    case 'dog': return { text: 'Poids mort', color: 'bg-red-100 text-red-700', dotColor: 'bg-red-500' };
    default: return { text: s, color: 'bg-[#F5F5F5] text-[#404040]', dotColor: 'bg-[#A3A3A3]' };
  }
}

/* ── Animated number counter ─────────────────────── */
function useAnimatedNumber(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let startTime: number | null = null;
        const animate = (ts: number) => {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { value, ref };
}

export default function Demo() {
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Demo RestauMargin -- Le Bistrot de Marie | RestauMargin';
    window.scrollTo(0, 0);
  }, []);

  const maxMargin = Math.max(...MARGIN_EVOLUTION.map(m => m.margin));

  // Animated KPIs
  const foodCostAnim = useAnimatedNumber(268);
  const marginAnim = useAnimatedNumber(732);
  const caAnim = useAnimatedNumber(46327);
  const couvertsAnim = useAnimatedNumber(1456);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Animated CSS keyframes ── */}
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes barGrow { from { height: 0; } }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .anim-slide-up { animation: slideUp 0.6s ease-out both; }
        .anim-fade { animation: fadeIn 0.5s ease-out both; }
        .anim-bar { animation: barGrow 0.8s ease-out both; }
        .shimmer-bg { background: linear-gradient(90deg, transparent 30%, rgba(13,148,136,0.05) 50%, transparent 70%); background-size: 200% 100%; animation: shimmer 3s infinite; }
      `}</style>

      {/* -- Demo Banner -- */}
      <div className="sticky top-0 z-50 bg-[#111111] text-white px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Eye className="w-4 h-4 text-white/60" />
              <span className="font-semibold text-sm">
                Mode demo -- Donnees fictives du "Bistrot de Marie"
              </span>
            </div>
          </div>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-1.5 px-6 py-2 bg-white text-[#111111] font-bold text-sm rounded-full hover:bg-white/90 transition-colors shadow-lg shadow-white/10"
          >
            <Sparkles className="w-4 h-4" />
            Creer mon compte gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* -- Navbar -- */}
      <nav className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#111111] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>RestauMargin</span>
            <span className="ml-2 text-xs font-medium text-[#A3A3A3] bg-[#F5F5F5] px-2 py-0.5 rounded-full">DEMO</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className="text-sm font-medium text-[#737373] hover:text-teal-600 transition-colors"
            >
              Tarifs
            </Link>
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] hover:bg-[#333333] text-white text-sm font-semibold rounded-full transition-colors"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* -- Restaurant Header -- */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#FAFAFA] via-white to-[#FAFAFA] pt-10 pb-8 px-4 border-b border-[#F5F5F5]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/[0.03] rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/[0.03] rounded-full blur-[60px]" />
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/20">
              <UtensilsCrossed className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#111111]" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
                Le Bistrot de Marie
              </h1>
              <p className="text-sm text-[#737373] mt-0.5">Bistrot traditionnel -- Paris 11e -- 45 couverts/service</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-[10px] text-[#A3A3A3] uppercase tracking-wider font-semibold">Derniere MAJ</p>
                <p className="text-sm font-bold text-[#111111]">Aujourd'hui, 14h32</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* -- KPI Cards with animated numbers -- */}
        <section className="anim-slide-up">
          <h2 className="text-lg font-bold text-[#111111] mb-4 flex items-center gap-2" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            <BarChart3 className="w-5 h-5 text-teal-600" />
            Tableau de bord
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div ref={foodCostAnim.ref} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 relative overflow-hidden">
              <div className="shimmer-bg absolute inset-0 rounded-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">Food cost global</span>
                  <Percent className="w-5 h-5 text-teal-600" />
                </div>
                <p className="text-3xl font-extrabold text-[#111111]">{(foodCostAnim.value / 10).toFixed(1)}%</p>
                <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Sous l'objectif de {FAKE_KPIS.foodCostTarget}%
                </p>
              </div>
            </div>
            <div ref={marginAnim.ref} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 relative overflow-hidden">
              <div className="shimmer-bg absolute inset-0 rounded-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">Marge brute</span>
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-3xl font-extrabold text-[#111111]">{(marginAnim.value / 10).toFixed(1)}%</p>
                <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +4.7 pts en 6 mois
                </p>
              </div>
            </div>
            <div ref={caAnim.ref} className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">CA HT / mois</span>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-extrabold text-[#111111]">{formatCurrency(caAnim.value)}</p>
              <p className="text-xs text-emerald-600 mt-1 font-semibold">+12% vs mois dernier</p>
            </div>
            <div ref={couvertsAnim.ref} className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">Couverts / mois</span>
                <UtensilsCrossed className="w-5 h-5 text-[#737373]" />
              </div>
              <p className="text-3xl font-extrabold text-[#111111]">{couvertsAnim.value.toLocaleString('fr-FR')}</p>
              <p className="text-xs text-[#A3A3A3] mt-1">{FAKE_KPIS.recipeCount} recettes / {FAKE_KPIS.ingredientCount} ingredients</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <KPICard
              label="Fournisseurs"
              value={String(FAKE_KPIS.fournisseurs)}
              sub="Fournisseurs actifs"
              icon={<Truck className="w-5 h-5 text-[#737373]" />}
            />
            <KPICard
              label="Commandes"
              value={String(FAKE_KPIS.commandesMois)}
              sub="Ce mois"
              icon={<ClipboardList className="w-5 h-5 text-[#737373]" />}
            />
            <KPICard
              label="Alertes prix"
              value={String(FAKE_KPIS.alertCount)}
              sub="Fournisseurs en hausse"
              icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
              warning
            />
            <KPICard
              label="Objectif food cost"
              value={`${FAKE_KPIS.foodCostTarget}%`}
              sub="Seuil configure"
              icon={<Target className="w-5 h-5 text-teal-600" />}
            />
          </div>
        </section>

        {/* -- Charts row: Margin Evolution + Category Distribution -- */}
        <section className="grid lg:grid-cols-3 gap-6">
          {/* Margin Evolution Chart */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-[#111111] mb-4" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
              Evolution de la marge (6 derniers mois)
            </h2>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <div className="flex items-end gap-3 h-52">
                {MARGIN_EVOLUTION.map((m, i) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600">{m.margin}%</span>
                    <div className="w-full bg-[#F5F5F5] rounded-t-lg relative" style={{ height: '100%' }}>
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg anim-bar"
                        style={{
                          height: `${(m.margin / maxMargin) * 100}%`,
                          animationDelay: `${i * 150}ms`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-[#737373] font-medium">{m.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#A3A3A3]">
                <span>Marge brute en progression constante</span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" /> +4.7 pts en 6 mois
                </span>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] mb-4" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
              Repartition par categorie
            </h2>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 h-[calc(100%-2rem)]">
              <div className="space-y-3">
                {CATEGORY_DIST.map((cat, i) => (
                  <div key={cat.name} className="anim-fade" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#404040]">{cat.name}</span>
                      <span className="text-sm font-bold text-[#111111]">{cat.pct}%</span>
                    </div>
                    <div className="h-3 bg-[#F5F5F5] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${cat.pct}%`,
                          backgroundColor: cat.color,
                          animation: `barGrow 1s ease-out ${i * 100}ms both`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#F5F5F5]">
                <p className="text-xs text-[#A3A3A3]">Base: {FAKE_KPIS.recipeCount} recettes actives</p>
              </div>
            </div>
          </div>
        </section>

        {/* -- Recipes with FoodIllustration -- */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
              <ClipboardList className="w-5 h-5 text-teal-600" />
              Fiches techniques ({FAKE_RECIPES.length} recettes)
            </h2>
            <div className="flex gap-2">
              {(['star', 'puzzle', 'workhorse', 'dog'] as const).map(s => {
                const st = statusLabel(s);
                return (
                  <span key={s} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1 ${st.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dotColor}`} />
                    {st.text}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {FAKE_RECIPES.map((r, idx) => {
              const st = statusLabel(r.status);
              return (
                <button
                  key={r.name}
                  onClick={() => setSelectedRecipe(idx)}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-4 hover:shadow-lg hover:border-teal-200 transition-all relative group text-left anim-slide-up cursor-pointer"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* FoodIllustration */}
                  <div className="flex items-center justify-center mb-3">
                    <FoodIllustration recipeName={r.name} category={r.category} size="md" animated />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-[#A3A3A3] uppercase tracking-wider">{r.category}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${st.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dotColor}`} />
                      {st.text}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#111111] mb-2 line-clamp-2">{r.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-[10px] text-[#A3A3A3]">Food cost</p>
                      <p className="text-base font-bold text-[#111111]">{r.foodCost}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#A3A3A3]">Marge</p>
                      <p className="text-base font-bold text-emerald-600">{formatCurrency(r.margin)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-[#A3A3A3]">PV: {formatCurrency(r.sellingPrice)}</p>
                    <span className="text-[10px] text-teal-600 font-semibold group-hover:underline">
                      Voir details
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* -- Recipe Detail Modal -- */}
        {selectedRecipe !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm anim-fade" onClick={() => setSelectedRecipe(null)}>
            <div
              className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl anim-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const r = FAKE_RECIPES[selectedRecipe];
                const st = statusLabel(r.status);
                const totalCost = r.ingredients.reduce((sum, ing) => sum + ing.cost, 0);
                return (
                  <>
                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#F5F5F5] px-6 py-4 rounded-t-3xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FoodIllustration recipeName={r.name} category={r.category} size="sm" />
                        <div>
                          <h3 className="text-lg font-bold text-[#111111]">{r.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#A3A3A3]">{r.category}</span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${st.color}`}>{st.text}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setSelectedRecipe(null)} className="p-2 hover:bg-[#F5F5F5] rounded-full transition-colors">
                        <X className="w-5 h-5 text-[#737373]" />
                      </button>
                    </div>

                    <div className="px-6 py-5 space-y-6">
                      {/* Key metrics */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#F5F5F5] rounded-xl p-3 text-center">
                          <p className="text-[10px] text-[#A3A3A3] uppercase tracking-wider font-semibold">Prix de vente</p>
                          <p className="text-xl font-bold text-[#111111] mt-1">{formatCurrency(r.sellingPrice)}</p>
                        </div>
                        <div className="bg-[#F5F5F5] rounded-xl p-3 text-center">
                          <p className="text-[10px] text-[#A3A3A3] uppercase tracking-wider font-semibold">Cout matiere</p>
                          <p className="text-xl font-bold text-[#111111] mt-1">{formatCurrency(totalCost)}</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-3 text-center">
                          <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-semibold">Marge</p>
                          <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(r.margin)}</p>
                        </div>
                      </div>

                      {/* Food cost visual bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-[#404040]">Food cost</span>
                          <span className="text-sm font-bold text-[#111111]">{r.foodCost}%</span>
                        </div>
                        <div className="h-4 bg-[#F5F5F5] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${r.foodCost}%`,
                              backgroundColor: r.foodCost > 30 ? '#ef4444' : r.foodCost > 25 ? '#f59e0b' : '#10b981',
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] text-[#A3A3A3]">
                          <span>0%</span>
                          <span className="text-amber-500 font-semibold">Objectif: 28%</span>
                          <span>50%</span>
                        </div>
                      </div>

                      {/* Ingredients table */}
                      <div>
                        <h4 className="text-sm font-bold text-[#111111] mb-3">Ingredients ({r.ingredients.length})</h4>
                        <div className="bg-[#FAFAFA] rounded-xl overflow-hidden border border-[#E5E7EB]">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-[10px] text-[#A3A3A3] uppercase tracking-wider">
                                <th className="text-left px-4 py-2 font-semibold">Ingredient</th>
                                <th className="text-right px-4 py-2 font-semibold">Quantite</th>
                                <th className="text-right px-4 py-2 font-semibold">Cout</th>
                                <th className="text-right px-4 py-2 font-semibold">% du total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {r.ingredients.map((ing, i) => (
                                <tr key={i} className="border-t border-[#E5E7EB]">
                                  <td className="px-4 py-2 font-medium text-[#111111]">{ing.name}</td>
                                  <td className="px-4 py-2 text-right text-[#737373]">{ing.qty}</td>
                                  <td className="px-4 py-2 text-right font-semibold text-[#404040]">{formatCurrency(ing.cost)}</td>
                                  <td className="px-4 py-2 text-right text-[#A3A3A3]">{((ing.cost / totalCost) * 100).toFixed(0)}%</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="border-t-2 border-[#E5E7EB] bg-white">
                                <td className="px-4 py-2 font-bold text-[#111111]" colSpan={2}>Total</td>
                                <td className="px-4 py-2 text-right font-bold text-[#111111]">{formatCurrency(totalCost)}</td>
                                <td className="px-4 py-2 text-right font-bold text-[#111111]">100%</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      {/* Cost breakdown mini-chart */}
                      <div>
                        <h4 className="text-sm font-bold text-[#111111] mb-3">Repartition des couts</h4>
                        <div className="flex gap-1 h-6 rounded-full overflow-hidden">
                          {r.ingredients.map((ing, i) => {
                            const pct = (ing.cost / totalCost) * 100;
                            const colors = ['#0d9488', '#111111', '#6B7280', '#9CA3AF', '#D4D4D4', '#E5E7EB', '#F5F5F5'];
                            return (
                              <div
                                key={i}
                                className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                                style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }}
                                title={`${ing.name}: ${pct.toFixed(0)}%`}
                              />
                            );
                          })}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {r.ingredients.slice(0, 4).map((ing, i) => {
                            const colors = ['#0d9488', '#111111', '#6B7280', '#9CA3AF'];
                            return (
                              <span key={i} className="flex items-center gap-1 text-[10px] text-[#737373]">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                                {ing.name}
                              </span>
                            );
                          })}
                          {r.ingredients.length > 4 && (
                            <span className="text-[10px] text-[#A3A3A3]">+{r.ingredients.length - 4} autres</span>
                          )}
                        </div>
                      </div>

                      {/* Popularity indicator */}
                      <div className="bg-[#F5F5F5] rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">Popularite</p>
                          <p className="text-lg font-bold text-[#111111]">{r.popularity} ventes/mois</p>
                        </div>
                        <div className={`text-xs font-semibold px-3 py-1.5 rounded-full ${st.color}`}>
                          {st.text}
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-[#F5F5F5] bg-[#FAFAFA] rounded-b-3xl">
                      <div className="flex items-center gap-2 text-xs text-[#A3A3A3]">
                        <Lock className="w-3 h-3" />
                        <span>Mode demo -- Donnees fictives. <Link to="/login?mode=register" className="text-teal-600 font-semibold hover:underline">Creez votre compte</Link> pour gerer vos propres recettes.</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* -- Ingredients -- */}
        <section>
          <h2 className="text-lg font-bold text-[#111111] mb-4" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Ingredients ({FAKE_INGREDIENTS.length})
          </h2>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FAFAFA] text-[#737373] text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-semibold">Ingredient</th>
                    <th className="text-right px-5 py-3 font-semibold">Prix unitaire</th>
                    <th className="text-right px-5 py-3 font-semibold">Unite</th>
                    <th className="text-right px-5 py-3 font-semibold">Stock</th>
                    <th className="text-center px-5 py-3 font-semibold">Alerte</th>
                  </tr>
                </thead>
                <tbody>
                  {FAKE_INGREDIENTS.map((ing) => (
                    <tr key={ing.name} className="border-t border-[#F5F5F5] hover:bg-[#FAFAFA]/50 transition-colors">
                      <td className="px-5 py-2.5 font-medium text-[#111111]">{ing.name}</td>
                      <td className="px-5 py-2.5 text-right text-[#404040]">{formatCurrency(ing.price)}</td>
                      <td className="px-5 py-2.5 text-right text-[#737373]">{ing.unit}</td>
                      <td className="px-5 py-2.5 text-right text-[#404040]">{ing.stock}</td>
                      <td className="px-5 py-2.5 text-center">
                        {ing.alert && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Prix en hausse
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* -- Menu Engineering Matrix -- */}
        <section>
          <h2 className="text-lg font-bold text-[#111111] mb-4" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Matrice Menu Engineering
          </h2>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <div className="grid grid-cols-2 gap-4 h-64 relative">
              {/* Axes */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-semibold text-[#A3A3A3] uppercase tracking-wider">Marge</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#A3A3A3] uppercase tracking-wider">Popularite</div>

              {/* Quadrants */}
              <div className="bg-amber-50 rounded-tl-xl border border-amber-100 p-3 flex flex-col items-center justify-center text-center">
                <Target className="w-5 h-5 text-amber-500 mb-1" />
                <p className="text-xs font-bold text-amber-700">Puzzle</p>
                <p className="text-[10px] text-amber-600 mt-1">Marge haute, popularite basse</p>
                <div className="mt-2 flex gap-1 flex-wrap justify-center">
                  {FAKE_RECIPES.filter(r => r.status === 'puzzle').map(r => (
                    <span key={r.name} className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{r.name.split(' ').slice(0, 2).join(' ')}</span>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-50 rounded-tr-xl border border-emerald-100 p-3 flex flex-col items-center justify-center text-center">
                <TrendingUp className="w-5 h-5 text-emerald-500 mb-1" />
                <p className="text-xs font-bold text-emerald-700">Star</p>
                <p className="text-[10px] text-emerald-600 mt-1">Marge haute, popularite haute</p>
                <div className="mt-2 flex gap-1 flex-wrap justify-center">
                  {FAKE_RECIPES.filter(r => r.status === 'star').map(r => (
                    <span key={r.name} className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">{r.name.split(' ').slice(0, 2).join(' ')}</span>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 rounded-bl-xl border border-red-100 p-3 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="w-5 h-5 text-red-400 mb-1" />
                <p className="text-xs font-bold text-red-700">Poids mort</p>
                <p className="text-[10px] text-red-600 mt-1">Marge basse, popularite basse</p>
                <div className="mt-2 flex gap-1 flex-wrap justify-center">
                  {FAKE_RECIPES.filter(r => r.status === 'dog').map(r => (
                    <span key={r.name} className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">{r.name.split(' ').slice(0, 2).join(' ')}</span>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 rounded-br-xl border border-blue-100 p-3 flex flex-col items-center justify-center text-center">
                <ShoppingBasket className="w-5 h-5 text-blue-500 mb-1" />
                <p className="text-xs font-bold text-blue-700">Cheval de labour</p>
                <p className="text-[10px] text-blue-600 mt-1">Marge basse, popularite haute</p>
                <div className="mt-2 flex gap-1 flex-wrap justify-center">
                  {FAKE_RECIPES.filter(r => r.status === 'workhorse').map(r => (
                    <span key={r.name} className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{r.name.split(' ').slice(0, 2).join(' ')}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -- CTA Section — Stunning -- */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-3xl" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px]" />
          <div className="relative text-center py-16 px-6 rounded-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-semibold mb-6 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              Essai gratuit 7 jours -- Sans carte bancaire
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
              Impressionne ? Creez votre compte gratuit
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-8 text-lg">
              Ce que vous voyez avec des donnees fictives, RestauMargin le fait avec les donnees reelles de votre restaurant.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-white/90 text-[#111111] font-bold text-lg rounded-xl transition-colors shadow-lg shadow-white/10"
              >
                Creer mon compte gratuit
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-colors"
              >
                Voir les tarifs
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/40">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Sans engagement</span>
              <span className="flex items-center gap-1"><UtensilsCrossed className="w-3 h-3" /> 150+ restaurants</span>
              <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> -5 pts food cost</span>
            </div>
          </div>
        </section>
      </main>

      {/* -- Footer -- */}
      <footer className="border-t border-[#E5E7EB] py-8 text-center text-sm text-[#A3A3A3]">
        <p>&copy; {new Date().getFullYear()} RestauMargin. Tous droits reserves.</p>
      </footer>
    </div>
  );
}

/* -- KPI Card Component -- */
function KPICard({ label, value, sub, icon, good, warning }: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  good?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <p className={`text-2xl font-bold ${warning ? 'text-amber-500' : good ? 'text-[#111111]' : 'text-[#111111]'}`}>
        {value}
      </p>
      <p className="text-xs text-[#A3A3A3] mt-1">{sub}</p>
    </div>
  );
}
