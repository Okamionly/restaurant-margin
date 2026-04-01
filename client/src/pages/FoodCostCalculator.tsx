import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, RotateCcw, ArrowRight, ChefHat } from 'lucide-react';

/* ─────────────── Types ─────────────── */

interface Ingredient {
  id: number;
  nom: string;
  quantite: number;
  prixUnitaire: number;
  unite: string;
}

const UNITES = ['kg', 'g', 'L', 'cL', 'mL', 'pièce(s)', 'botte(s)', 'tranche(s)'];

let nextId = 1;

function createIngredient(): Ingredient {
  return { id: nextId++, nom: '', quantite: 0, prixUnitaire: 0, unite: 'kg' };
}

/* ─────────────── Page ─────────────── */

export default function FoodCostCalculator() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([createIngredient(), createIngredient(), createIngredient()]);
  const [portions, setPortions] = useState<number>(10);
  const [prixVente, setPrixVente] = useState<number>(0);

  useEffect(() => {
    document.title = 'Calculateur de Food Cost Restaurant Gratuit | RestauMargin';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Calculez votre food cost, marge brute et coefficient multiplicateur gratuitement. Outil en ligne pour restaurateurs, chefs et gérants.');
    }
  }, []);

  /* ── Calculs ── */
  const coutTotal = ingredients.reduce((s, i) => s + i.quantite * i.prixUnitaire, 0);
  const coutParPortion = portions > 0 ? coutTotal / portions : 0;
  const foodCostPct = prixVente > 0 ? (coutParPortion / prixVente) * 100 : 0;
  const margeBrute = prixVente - coutParPortion;
  const margePct = prixVente > 0 ? (margeBrute / prixVente) * 100 : 0;
  const coefMultiplicateur = coutParPortion > 0 ? prixVente / coutParPortion : 0;

  /* ── Jauge couleur ── */
  const jaugeColor = foodCostPct <= 30 ? '#10b981' : foodCostPct <= 35 ? '#f59e0b' : '#ef4444';
  const jaugeLabel = foodCostPct <= 30 ? 'Excellent' : foodCostPct <= 35 ? 'Acceptable' : 'Trop élevé';
  const jaugeWidth = Math.min(foodCostPct, 50); // cap visuel à 50% pour la barre

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

  return (
    <div className="min-h-screen bg-[#f8fafb]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>RestauMargin</span>
          </Link>
          <Link
            to="/register"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Essai gratuit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="pt-12 pb-8 sm:pt-16 sm:pb-10 text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-5 border border-teal-200">
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" /> Outil 100% gratuit
        </div>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight max-w-3xl mx-auto"
          style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}
        >
          Calculateur de Food Cost Restaurant — Gratuit
        </h1>
        <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Ajoutez vos ingrédients, indiquez le prix de vente et visualisez instantanément votre food cost,
          marge brute et coefficient multiplicateur.
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">

        {/* ── Tableau d'ingrédients ── */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Ingrédients de la recette
          </h2>

          {/* Desktop header */}
          <div className="hidden sm:grid grid-cols-[1fr_100px_120px_110px_40px] gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-1">
            <span>Ingrédient</span><span>Quantité</span><span>Prix unitaire (€)</span><span>Unité</span><span />
          </div>

          <div className="space-y-3">
            {ingredients.map((ing) => (
              <div key={ing.id} className="grid grid-cols-1 sm:grid-cols-[1fr_100px_120px_110px_40px] gap-2 sm:gap-3 items-end bg-slate-50 rounded-xl p-3 sm:p-2 sm:bg-transparent sm:rounded-none border sm:border-0 border-slate-200">
                {/* Nom */}
                <div>
                  <label className="sm:hidden text-xs text-slate-500 font-medium mb-1 block">Ingrédient</label>
                  <input
                    type="text"
                    placeholder="Ex : Tomates cerises"
                    value={ing.nom}
                    onChange={e => updateIngredient(ing.id, 'nom', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                  />
                </div>
                {/* Quantité */}
                <div>
                  <label className="sm:hidden text-xs text-slate-500 font-medium mb-1 block">Quantité</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={ing.quantite || ''}
                    onChange={e => updateIngredient(ing.id, 'quantite', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                  />
                </div>
                {/* Prix unitaire */}
                <div>
                  <label className="sm:hidden text-xs text-slate-500 font-medium mb-1 block">Prix unitaire (€)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={ing.prixUnitaire || ''}
                    onChange={e => updateIngredient(ing.id, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                  />
                </div>
                {/* Unité */}
                <div>
                  <label className="sm:hidden text-xs text-slate-500 font-medium mb-1 block">Unité</label>
                  <select
                    value={ing.unite}
                    onChange={e => updateIngredient(ing.id, 'unite', e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
                  >
                    {UNITES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                {/* Supprimer */}
                <button
                  onClick={() => removeIngredient(ing.id)}
                  className="self-center sm:self-end p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Sous-total + boutons */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={addIngredient}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" /> Ajouter un ingrédient
              </button>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Réinitialiser
              </button>
            </div>
            <div className="text-sm text-slate-600">
              Coût matière total : <span className="font-bold text-slate-900">{fmt(coutTotal)} €</span>
            </div>
          </div>
        </section>

        {/* ── Portions & prix de vente ── */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Portions & prix de vente
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600 font-medium mb-1.5 block">Nombre de portions</label>
              <input
                type="number"
                min={1}
                value={portions || ''}
                onChange={e => setPortions(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 font-medium mb-1.5 block">Prix de vente par portion (€ HT)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={prixVente || ''}
                onChange={e => setPrixVente(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
              />
            </div>
          </div>
        </section>

        {/* ── Résultats ── */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Résultats
          </h2>

          {/* Jauge food cost */}
          {prixVente > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Food Cost</span>
                <span className="text-sm font-bold" style={{ color: jaugeColor }}>{fmt(foodCostPct)} % — {jaugeLabel}</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(jaugeWidth / 50) * 100}%`, backgroundColor: jaugeColor }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 px-0.5">
                <span>0%</span><span>30%</span><span>35%</span><span>50%</span>
              </div>
            </div>
          )}

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KPICard label="Coût par portion" value={`${fmt(coutParPortion)} €`} />
            <KPICard label="Food Cost %" value={`${fmt(foodCostPct)} %`} color={jaugeColor} />
            <KPICard label="Marge brute" value={`${fmt(margeBrute)} €`} sub={`${fmt(margePct)} %`} />
            <KPICard label="Coefficient" value={coefMultiplicateur > 0 ? `x ${fmt(coefMultiplicateur)}` : '—'} />
          </div>
        </section>

        {/* ── Explications SEO ── */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Comment calculer le food cost ?
          </h2>
          <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed space-y-3">
            <p>
              Le <strong>food cost</strong> (ou coût matière) représente le pourcentage du prix de vente
              consacré aux ingrédients. C'est l'indicateur clé de rentabilité en restauration.
            </p>
            <p><strong>Formule :</strong> Food Cost % = (Coût des ingrédients par portion / Prix de vente HT) x 100</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-emerald-600 font-semibold">Inférieur à 30%</span> — Excellente maîtrise des coûts</li>
              <li><span className="text-amber-600 font-semibold">Entre 30% et 35%</span> — Acceptable, mais surveillez les variations</li>
              <li><span className="text-red-600 font-semibold">Supérieur à 35%</span> — Alerte : optimisez vos recettes ou renégociez vos fournisseurs</li>
            </ul>
            <p>
              Le <strong>coefficient multiplicateur</strong> est l'inverse du food cost : il indique par combien
              multiplier le coût matière pour obtenir le prix de vente. Un coefficient de 3,3 correspond
              environ à un food cost de 30%.
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6 sm:p-10 text-center">
          <h2
            className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3"
            style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}
          >
            Fatigué de calculer à la main ?
          </h2>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            RestauMargin automatise vos fiches techniques avec l'IA. Import de factures, suivi des prix
            fournisseurs, alertes de marge — tout en un.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full text-base transition-colors shadow-lg shadow-teal-600/20"
          >
            Essai gratuit 14 jours <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </main>

      {/* ── Footer minimal ── */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        <div className="max-w-6xl mx-auto px-4">
          © {new Date().getFullYear()} RestauMargin · <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions légales</Link> · <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────── KPI Card ─────────────── */

function KPICard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-center">
      <div className="text-xs text-slate-500 font-medium mb-1">{label}</div>
      <div className="text-xl sm:text-2xl font-extrabold" style={{ color: color || '#0f172a' }}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}
