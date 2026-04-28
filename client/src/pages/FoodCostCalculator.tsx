import { formatCurrency } from '../utils/currency';
import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, RotateCcw, ArrowRight, ChefHat, ChevronDown, TrendingUp, Users, Calendar, DollarSign, Target, AlertTriangle, CheckCircle, HelpCircle, Sparkles, Zap } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import SEOHead from '../components/SEOHead';

// Curves shader (lignes emerald qui derivent — meme theme que la landing principale).
// Lazy-loaded pour preserver le LCP.
const ShaderBackground = lazy(() => import('../components/landing/ShaderBackground'));

/* ─────────────── Types ─────────────── */

interface Ingredient {
  id: number;
  nom: string;
  quantite: number;
  prixUnitaire: number;
  unite: string;
}

const UNITES = ['kg', 'g', 'L', 'cL', 'mL', 'piece(s)', 'botte(s)', 'tranche(s)'];

let nextId = 1;

function createIngredient(): Ingredient {
  return { id: nextId++, nom: '', quantite: 0, prixUnitaire: 0, unite: 'kg' };
}

/* ─────────────── Industry Benchmarks ─────────────── */

const BENCHMARKS: { label: string; foodCost: number; color: string }[] = [
  { label: 'Fast-food', foodCost: 32, color: '#f59e0b' },
  { label: 'Brasserie', foodCost: 30, color: '#10b981' },
  { label: 'Gastronomique', foodCost: 28, color: '#06b6d4' },
  { label: 'Pizzeria', foodCost: 25, color: '#8b5cf6' },
  { label: 'Japonais / Sushi', foodCost: 35, color: '#ef4444' },
  { label: 'Indien / Thaï', foodCost: 27, color: '#ec4899' },
];

/* ─────────────── FAQ Data ─────────────── */

const FAQ_ITEMS = [
  {
    q: "Qu'est-ce que le food cost en restauration ?",
    a: "Le food cost (ou cout matiere) est le pourcentage du prix de vente d'un plat consacre a l'achat des ingredients. C'est l'indicateur numero 1 de rentabilite en restauration. Formule : Food Cost % = (Cout ingredients par portion / Prix de vente HT) x 100."
  },
  {
    q: "Quel est le food cost ideal pour un restaurant ?",
    a: "Un food cost inferieur a 30 % est considere comme excellent. Entre 30 % et 35 %, c'est acceptable mais a surveiller. Au-dela de 35 %, il faut agir : renegocier les fournisseurs, reduire le gaspillage ou ajuster les prix de vente."
  },
  {
    q: "Comment reduire son food cost sans baisser la qualite ?",
    a: "Plusieurs leviers : negocier les prix fournisseurs en volume, standardiser les fiches techniques pour eviter le sur-dosage, utiliser les produits de saison, reduire le gaspillage avec le FIFO (premier entre, premier sorti), et optimiser les portions."
  },
  {
    q: "Quelle est la difference entre food cost theorique et reel ?",
    a: "Le food cost theorique est calcule a partir de vos fiches techniques (cout des ingredients prevu). Le food cost reel prend en compte le gaspillage, le vol, les erreurs de dosage et la casse. L'ecart entre les deux revele vos pertes cachees."
  },
  {
    q: "Comment calculer le coefficient multiplicateur ?",
    a: "Le coefficient multiplicateur est l'inverse du food cost. Si vous visez 30 % de food cost, votre coefficient est 1/0.30 = 3.33. Multipliez le cout matiere par ce coefficient pour obtenir le prix de vente HT minimum."
  },
  {
    q: "Faut-il inclure la TVA dans le calcul du food cost ?",
    a: "Non. Le food cost se calcule toujours hors taxes (HT). La TVA est un element de prix pour le client final mais ne fait pas partie de votre marge. Utilisez le prix de vente HT dans la formule pour un resultat fiable."
  },
];

/* ─────────────── Page ─────────────── */

export default function FoodCostCalculator() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([createIngredient(), createIngredient(), createIngredient()]);
  const [portions, setPortions] = useState<number>(10);
  const [prixVente, setPrixVente] = useState<number>(0);
  const [tracked, setTracked] = useState(false);

  // Profit Simulator
  const [couvertsJour, setCouvertsJour] = useState<number>(60);
  const [joursMois, setJoursMois] = useState<number>(26);
  const [chargesFixes, setChargesFixes] = useState<number>(35);

  // Cuisine type for benchmark
  const [cuisineType, setCuisineType] = useState<string>('Brasserie');

  // FAQ open state
  const [openFaq, setOpenFaq] = useState<number | null>(null);



  /* ── Calculs ── */
  const coutTotal = ingredients.reduce((s, i) => s + i.quantite * i.prixUnitaire, 0);
  const coutParPortion = portions > 0 ? coutTotal / portions : 0;
  const foodCostPct = prixVente > 0 ? (coutParPortion / prixVente) * 100 : 0;
  const margeBrute = prixVente - coutParPortion;
  const margePct = prixVente > 0 ? (margeBrute / prixVente) * 100 : 0;
  const coefMultiplicateur = coutParPortion > 0 ? prixVente / coutParPortion : 0;
  const prixVenteSuggere = coutParPortion > 0 ? coutParPortion / 0.30 : 0;

  /* ── Profit Simulator Calculs ── */
  const caJour = prixVente > 0 ? couvertsJour * prixVente : 0;
  const caMois = caJour * joursMois;
  const profitBrutMois = caMois * (margePct / 100);
  const profitNetMois = profitBrutMois - (profitBrutMois * chargesFixes / 100);

  useEffect(() => {
    if (!tracked && coutTotal > 0 && prixVente > 0) {
      trackEvent('calculator_used');
      setTracked(true);
    }
  }, [coutTotal, prixVente, tracked]);

  /* ── Gauge helpers ── */
  const gaugeColor = foodCostPct <= 30 ? '#10b981' : foodCostPct <= 35 ? '#f59e0b' : '#ef4444';
  const gaugeLabel = foodCostPct <= 30 ? 'Excellent' : foodCostPct <= 35 ? 'Acceptable' : 'Trop eleve';
  const gaugeAngle = Math.min((foodCostPct / 50) * 360, 360);

  /* ── Benchmark data with user value ── */
  const benchmarkWithUser = useMemo(() => {
    const base = BENCHMARKS.map(b => ({ ...b, isUser: false }));
    if (foodCostPct > 0) {
      base.push({ label: 'Votre recette', foodCost: Math.round(foodCostPct * 10) / 10, color: '#000000', isUser: true } as any);
    }
    return base.sort((a, b) => b.foodCost - a.foodCost);
  }, [foodCostPct]);

  /* ── Handlers ── */
  const updateIngredient = (id: number, field: keyof Ingredient, value: string | number) => {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };
  const removeIngredient = (id: number) => {
    setIngredients(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);
  };
  const addIngredient = () => setIngredients(prev => [...prev, createIngredient()]);
  const reset = () => {
    nextId = 1;
    setIngredients([createIngredient(), createIngredient(), createIngredient()]);
    setPortions(10);
    setPrixVente(0);
  };

  const fmt = (n: number) => n.toFixed(2).replace('.', ',');
  const fmtK = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.', ',') + 'k';
    return Math.round(n).toString();
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead title="Calculateur de Food Cost Restaurant Gratuit" description="Calculez gratuitement le food cost de vos plats. Outil en ligne pour restaurateurs : cout matiere, prix de vente, marge brute par recette." path="/outils/calculateur-food-cost" />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-[#000000] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-[#000000]" />
            <span>RestauMargin</span>
          </Link>
          <Link
            to="/login?mode=register"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#000000] hover:bg-[#222222] text-white text-sm font-semibold rounded-full transition-colors"
          >
            Essai gratuit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ── Hero with PaperFold animated shader background ── */}
      <header className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 px-4 overflow-hidden isolate">
        <Suspense fallback={<div className="absolute inset-0 z-0 bg-[#FAFAF7]" />}>
          <ShaderBackground intensity={0.8} />
        </Suspense>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[#000000] text-xs font-semibold mb-6 border border-mono-900">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Outil 100% gratuit — aucun compte requis
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] leading-tight tracking-tight mb-6">
            Calculateur de <span className="text-emerald-600">Food Cost</span> Restaurant
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-mono-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Ajoutez vos ingredients, visualisez votre food cost avec une jauge interactive,
            comparez-vous aux standards du secteur et simulez votre profit mensuel.
          </p>

          {/* Stats badges cinematic */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur border border-mono-900 rounded-full">
              <Zap className="w-4 h-4 text-emerald-600" />
              <strong className="text-[#0F172A]">Calcul instantane</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur border border-mono-900 rounded-full">
              <Target className="w-4 h-4 text-emerald-600" />
              Benchmark <strong className="text-[#0F172A]">6 secteurs</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur border border-mono-900 rounded-full">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <strong className="text-[#0F172A]">100% gratuit</strong>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">

        {/* ══════════════════════════════════════════════
            1. INTERACTIVE CALCULATOR — Ingredients
        ══════════════════════════════════════════════ */}
        <section className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-[#000000] mb-4 font-satoshi">
            Ingredients de la recette
          </h2>

          {/* Desktop header */}
          <div className="hidden sm:grid grid-cols-[1fr_100px_120px_110px_40px] gap-3 text-xs font-semibold text-[#999999] uppercase tracking-wide mb-2 px-1">
            <span>Ingredient</span><span>Quantite</span><span>Prix unitaire</span><span>Unite</span><span />
          </div>

          <div className="space-y-3">
            {ingredients.map((ing) => (
              <div key={ing.id} className="grid grid-cols-1 sm:grid-cols-[1fr_100px_120px_110px_40px] gap-2 sm:gap-3 items-end bg-mono-1000 rounded-2xl p-3 sm:p-2 sm:bg-transparent sm:rounded-none border sm:border-0 border-[#e5e5e5]">
                <div>
                  <label className="sm:hidden text-xs text-[#999999] font-medium mb-1 block">Ingredient</label>
                  <input
                    type="text"
                    placeholder="Ex : Tomates cerises"
                    value={ing.nom}
                    onChange={e => updateIngredient(ing.id, 'nom', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#e5e5e5] rounded-2xl text-sm text-[#000000] placeholder:text-[#cccccc] focus:outline-none focus:ring-2 focus:ring-[#000000]/10 focus:border-[#000000] transition"
                  />
                </div>
                <div>
                  <label className="sm:hidden text-xs text-[#999999] font-medium mb-1 block">Quantite</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={ing.quantite || ''}
                    onChange={e => updateIngredient(ing.id, 'quantite', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-white border border-[#e5e5e5] rounded-2xl text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#000000]/10 focus:border-[#000000] transition"
                  />
                </div>
                <div>
                  <label className="sm:hidden text-xs text-[#999999] font-medium mb-1 block">Prix unitaire</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={ing.prixUnitaire || ''}
                    onChange={e => updateIngredient(ing.id, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-white border border-[#e5e5e5] rounded-2xl text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#000000]/10 focus:border-[#000000] transition"
                  />
                </div>
                <div>
                  <label className="sm:hidden text-xs text-[#999999] font-medium mb-1 block">Unite</label>
                  <select
                    value={ing.unite}
                    onChange={e => updateIngredient(ing.id, 'unite', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#e5e5e5] rounded-2xl text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#000000]/10 focus:border-[#000000] transition"
                  >
                    {UNITES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <button
                  onClick={() => removeIngredient(ing.id)}
                  className="self-center sm:self-end p-2 text-[#cccccc] hover:text-[#ef4444] transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={addIngredient}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#000000] hover:bg-[#222222] text-white text-sm font-semibold rounded-2xl transition-colors"
              >
                <Plus className="w-4 h-4" /> Ajouter
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-mono-975 hover:bg-[#eeeeee] text-[#000000] text-sm font-semibold rounded-2xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
            <div className="text-sm text-[#666666]">
              Cout total : <span className="font-bold text-[#000000]">{formatCurrency(coutTotal)}</span>
            </div>
          </div>
        </section>

        {/* ── Portions & prix de vente ── */}
        <section className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-[#000000] mb-4 font-satoshi">
            Portions & prix de vente
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-[#666666] font-medium mb-1.5 block">Nombre de portions</label>
              <input
                type="number"
                min={1}
                value={portions || ''}
                onChange={e => setPortions(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-mono-1000 border border-[#e5e5e5] rounded-2xl text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#000000]/10 focus:border-[#000000] transition"
              />
            </div>
            <div>
              <label className="text-sm text-[#666666] font-medium mb-1.5 block">Prix de vente HT (EUR)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={prixVente || ''}
                onChange={e => setPrixVente(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-mono-1000 border border-[#e5e5e5] rounded-2xl text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#000000]/10 focus:border-[#000000] transition"
              />
            </div>
            <div>
              <label className="text-sm text-[#666666] font-medium mb-1.5 block">Prix suggere (30%)</label>
              <div className="w-full px-4 py-3 bg-mono-975 border border-[#e5e5e5] rounded-2xl text-sm text-[#000000] font-bold">
                {prixVenteSuggere > 0 ? `${formatCurrency(prixVenteSuggere)}` : '--'}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            RESULTS: KPI Cards + Circular Gauge
        ══════════════════════════════════════════════ */}
        <section className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-[#000000] mb-5 font-satoshi">
            Resultats
          </h2>

          <div className={`grid grid-cols-1 ${prixVente > 0 ? 'lg:grid-cols-[240px_1fr]' : ''} gap-6 items-start`}>

            {/* ── 2. VISUAL GAUGE — Circular conic-gradient ── */}
            {prixVente > 0 && (
              <div className="flex flex-col items-center justify-center">
                <div
                  className="relative w-48 h-48 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(${gaugeColor} 0deg, ${gaugeColor} ${gaugeAngle}deg, #f5f5f5 ${gaugeAngle}deg, #f5f5f5 360deg)`,
                  }}
                >
                  <div className="absolute w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-[#000000]">{fmt(foodCostPct)}%</span>
                    <span className="text-xs font-semibold mt-1" style={{ color: gaugeColor }}>{gaugeLabel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> &lt;30%</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> 30-35%</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" /> &gt;35%</span>
                </div>
              </div>
            )}

            {/* KPI cards */}
            <div className={`grid grid-cols-2 ${prixVente > 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-4'} gap-3`}>
              <KPICard
                icon={<DollarSign className="w-4 h-4" />}
                label="Cout / portion"
                value={formatCurrency(coutParPortion)}
              />
              <KPICard
                icon={<Target className="w-4 h-4" />}
                label="Food Cost %"
                value={`${fmt(foodCostPct)} %`}
                color={gaugeColor}
              />
              <KPICard
                icon={<TrendingUp className="w-4 h-4" />}
                label="Marge brute"
                value={formatCurrency(margeBrute)}
                sub={`${fmt(margePct)} %`}
              />
              <KPICard
                icon={<CheckCircle className="w-4 h-4" />}
                label="Coefficient"
                value={coefMultiplicateur > 0 ? `x ${fmt(coefMultiplicateur)}` : '--'}
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            3. BENCHMARK — Bar chart by cuisine type
        ══════════════════════════════════════════════ */}
        <section className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <h2 className="text-lg font-bold text-[#000000] font-satoshi">
              Benchmark par type de cuisine
            </h2>
            <select
              value={cuisineType}
              onChange={e => setCuisineType(e.target.value)}
              className="px-3 py-2 bg-mono-1000 border border-[#e5e5e5] rounded-2xl text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#000000]/10 focus:border-[#000000] transition w-full sm:w-auto"
            >
              {BENCHMARKS.map(b => <option key={b.label} value={b.label}>{b.label}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            {benchmarkWithUser.map((item, idx) => {
              const isUser = (item as any).isUser;
              const maxVal = 45;
              const widthPct = Math.min((item.foodCost / maxVal) * 100, 100);
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-32 sm:w-40 text-right text-sm font-medium ${isUser ? 'text-[#000000] font-bold' : 'text-[#666666]'}`}>
                    {item.label}
                  </div>
                  <div className="flex-1 h-8 bg-mono-975 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-3"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: item.color,
                        minWidth: '40px',
                      }}
                    >
                      <span className="text-xs font-bold text-white">{item.foodCost}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {foodCostPct > 0 && (
            <div className="mt-4 p-3 rounded-2xl bg-mono-1000 border border-[#e5e5e5]">
              {(() => {
                const selectedBenchmark = BENCHMARKS.find(b => b.label === cuisineType);
                if (!selectedBenchmark) return null;
                const diff = foodCostPct - selectedBenchmark.foodCost;
                if (diff <= -3) return (
                  <div className="flex items-center gap-2 text-sm text-[#10b981]">
                    <CheckCircle className="w-4 h-4" />
                    Votre food cost est <strong>{Math.abs(diff).toFixed(1)} pts</strong> en dessous de la moyenne {cuisineType}. Excellent !
                  </div>
                );
                if (diff <= 3) return (
                  <div className="flex items-center gap-2 text-sm text-[#f59e0b]">
                    <AlertTriangle className="w-4 h-4" />
                    Votre food cost est dans la moyenne {cuisineType} ({selectedBenchmark.foodCost}%). Marge d'amelioration possible.
                  </div>
                );
                return (
                  <div className="flex items-center gap-2 text-sm text-[#ef4444]">
                    <AlertTriangle className="w-4 h-4" />
                    Votre food cost depasse la moyenne {cuisineType} de <strong>{diff.toFixed(1)} pts</strong>. Action recommandee.
                  </div>
                );
              })()}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════
            4. PROFIT SIMULATOR
        ══════════════════════════════════════════════ */}
        <section className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-[#000000] mb-5 font-satoshi">
            Simulateur de profit mensuel
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            {/* Couverts / jour */}
            <div>
              <label className="text-sm text-[#666666] font-medium mb-2 block">
                <Users className="w-4 h-4 inline mr-1" /> Couverts / jour
              </label>
              <input
                type="range"
                min={10}
                max={300}
                step={5}
                value={couvertsJour}
                onChange={e => setCouvertsJour(parseInt(e.target.value))}
                className="w-full accent-[#000000] h-2 rounded-full"
              />
              <div className="text-center text-2xl font-extrabold text-[#000000] mt-2">{couvertsJour}</div>
            </div>

            {/* Jours / mois */}
            <div>
              <label className="text-sm text-[#666666] font-medium mb-2 block">
                <Calendar className="w-4 h-4 inline mr-1" /> Jours ouverts / mois
              </label>
              <input
                type="range"
                min={10}
                max={31}
                step={1}
                value={joursMois}
                onChange={e => setJoursMois(parseInt(e.target.value))}
                className="w-full accent-[#000000] h-2 rounded-full"
              />
              <div className="text-center text-2xl font-extrabold text-[#000000] mt-2">{joursMois}</div>
            </div>

            {/* Charges fixes % */}
            <div>
              <label className="text-sm text-[#666666] font-medium mb-2 block">
                <DollarSign className="w-4 h-4 inline mr-1" /> Charges fixes (% marge)
              </label>
              <input
                type="range"
                min={10}
                max={70}
                step={5}
                value={chargesFixes}
                onChange={e => setChargesFixes(parseInt(e.target.value))}
                className="w-full accent-[#000000] h-2 rounded-full"
              />
              <div className="text-center text-2xl font-extrabold text-[#000000] mt-2">{chargesFixes}%</div>
            </div>
          </div>

          {/* Profit KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-mono-1000 rounded-2xl border border-[#e5e5e5] p-4 text-center">
              <div className="text-xs text-[#999999] font-medium mb-1">CA / mois</div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#000000]">{formatCurrency(caMois)}</div>
            </div>
            <div className="bg-mono-1000 rounded-2xl border border-[#e5e5e5] p-4 text-center">
              <div className="text-xs text-[#999999] font-medium mb-1">Profit brut / mois</div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#10b981]">{formatCurrency(profitBrutMois)}</div>
            </div>
            <div className="bg-mono-1000 rounded-2xl border border-[#e5e5e5] p-4 text-center">
              <div className="text-xs text-[#999999] font-medium mb-1">Profit net estime</div>
              <div className="text-xl sm:text-2xl font-extrabold" style={{ color: profitNetMois > 0 ? '#10b981' : '#ef4444' }}>
                {formatCurrency(profitNetMois)}
              </div>
            </div>
            <div className="bg-mono-1000 rounded-2xl border border-[#e5e5e5] p-4 text-center">
              <div className="text-xs text-[#999999] font-medium mb-1">Profit net / an</div>
              <div className="text-xl sm:text-2xl font-extrabold" style={{ color: profitNetMois > 0 ? '#000000' : '#ef4444' }}>
                {formatCurrency(profitNetMois * 12)}
              </div>
            </div>
          </div>

          {prixVente === 0 && (
            <p className="text-xs text-[#999999] mt-3 text-center">
              Renseignez un prix de vente ci-dessus pour activer le simulateur.
            </p>
          )}
        </section>

        {/* ══════════════════════════════════════════════
            SEO Explainer (kept + improved)
        ══════════════════════════════════════════════ */}
        <section className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-[#000000] mb-3 font-satoshi">
            Comment calculer le food cost ?
          </h2>
          <div className="text-[#666666] text-sm leading-relaxed space-y-3">
            <p>
              Le <strong className="text-[#000000]">food cost</strong> (ou cout matiere) represente le pourcentage du prix de vente
              consacre aux ingredients. C'est l'indicateur cle de rentabilite en restauration.
            </p>
            <p><strong className="text-[#000000]">Formule :</strong> Food Cost % = (Cout des ingredients par portion / Prix de vente HT) x 100</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-[#10b981] font-semibold">Inferieur a 30%</span> -- Excellente maitrise des couts</li>
              <li><span className="text-[#f59e0b] font-semibold">Entre 30% et 35%</span> -- Acceptable, mais surveillez les variations</li>
              <li><span className="text-[#ef4444] font-semibold">Superieur a 35%</span> -- Alerte : optimisez vos recettes ou renegociez vos fournisseurs</li>
            </ul>
            <p>
              Le <strong className="text-[#000000]">coefficient multiplicateur</strong> est l'inverse du food cost : il indique par combien
              multiplier le cout matiere pour obtenir le prix de vente. Un coefficient de 3,3 correspond
              environ a un food cost de 30%.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            6. SEO FAQ — Accordion
        ══════════════════════════════════════════════ */}
        <section className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-[#000000] mb-5 font-satoshi">
            <HelpCircle className="w-5 h-5 inline mr-2" />
            Questions frequentes sur le food cost
          </h2>

          <div className="space-y-0 divide-y divide-[#e5e5e5]">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between py-4 text-left text-sm font-semibold text-[#000000] hover:text-[#666666] transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="pb-4 text-sm text-[#666666] leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* JSON-LD FAQ Schema for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": FAQ_ITEMS.map(item => ({
                  "@type": "Question",
                  "name": item.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.a
                  }
                }))
              })
            }}
          />
        </section>

        {/* ── Bottom CTA ── */}
        <section className="rounded-2xl border border-[#e5e5e5] bg-mono-1000 p-6 sm:p-10 text-center">
          <h2
            className="text-xl sm:text-2xl font-extrabold text-[#000000] mb-3"
           
          >
            Fatigue de calculer a la main ?
          </h2>
          <p className="text-[#666666] mb-6 max-w-lg mx-auto">
            RestauMargin automatise vos fiches techniques avec l'IA. Import de factures, suivi des prix
            fournisseurs, alertes de marge — tout en un.
          </p>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#000000] hover:bg-[#222222] text-white font-bold rounded-full text-base transition-colors shadow-lg shadow-[#000000]/10"
          >
            Essai gratuit 7 jours <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </main>

      {/* ══════════════════════════════════════════════
          5. STICKY CTA BANNER
      ══════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#000000] text-white py-3 px-4 sm:px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <p className="text-sm font-medium hidden sm:block">
            Vous gerez +10 recettes ? Automatisez vos fiches techniques et vos marges.
          </p>
          <p className="text-sm font-medium sm:hidden">
            +10 recettes ? Automatisez tout.
          </p>
          <Link
            to="/login?mode=register"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#000000] text-sm font-bold rounded-full hover:bg-mono-975 transition-colors"
          >
            Essai gratuit 7 jours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Footer minimal ── */}
      <footer className="border-t border-[#e5e5e5] bg-white py-6 text-center text-sm text-[#999999] mb-14">
        <div className="max-w-6xl mx-auto px-4">
          &copy; {new Date().getFullYear()} RestauMargin &middot;{' '}
          <Link to="/mentions-legales" className="hover:text-[#000000] transition-colors">Mentions legales</Link> &middot;{' '}
          <Link to="/cgv" className="hover:text-[#000000] transition-colors">CGV</Link>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────── KPI Card ─────────────── */

function KPICard({ icon, label, value, sub, color }: { icon?: React.ReactNode; label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-mono-1000 rounded-2xl border border-[#e5e5e5] p-4 text-center">
      {icon && <div className="flex justify-center mb-1.5 text-[#999999]">{icon}</div>}
      <div className="text-xs text-[#999999] font-medium mb-1">{label}</div>
      <div className="text-xl sm:text-2xl font-extrabold" style={{ color: color || '#000000' }}>{value}</div>
      {sub && <div className="text-xs text-[#999999] mt-0.5">{sub}</div>}
    </div>
  );
}
