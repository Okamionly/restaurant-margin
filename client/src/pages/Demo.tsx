import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, AlertTriangle, BarChart3, ShoppingBasket, ArrowRight, Lock, Eye, Percent, DollarSign, UtensilsCrossed } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Demo Page — Mode demo pour les prospects
   Restaurant fictif "Le Bistrot de Marie" avec donnees pre-remplies
   Read-only, pas d'API calls, route publique /demo
   ═══════════════════════════════════════════════════════════════ */

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
    ingredients: ['Riz arborio', 'Champignons de Paris', 'Parmesan', 'Vin blanc', 'Beurre', 'Oignon', 'Bouillon'],
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
    ingredients: ['Magret de canard', 'Cerises', 'Vinaigre balsamique', 'Miel', 'Thym', 'Beurre'],
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
    ingredients: ['Creme liquide', 'Oeufs', 'Sucre', 'Gousse de vanille'],
  },
];

const FAKE_INGREDIENTS = [
  { name: 'Riz arborio', unit: 'kg', price: 3.20, stock: 8.5 },
  { name: 'Champignons de Paris', unit: 'kg', price: 4.50, stock: 3.2 },
  { name: 'Parmesan AOP', unit: 'kg', price: 18.00, stock: 2.1 },
  { name: 'Magret de canard', unit: 'kg', price: 22.50, stock: 4.0 },
  { name: 'Creme liquide 35%', unit: 'L', price: 3.80, stock: 6.0 },
  { name: 'Beurre doux', unit: 'kg', price: 8.00, stock: 5.5 },
  { name: 'Oeufs frais', unit: 'piece', price: 0.28, stock: 120 },
  { name: 'Vanille Bourbon', unit: 'gousse', price: 4.50, stock: 15 },
];

const FAKE_KPIS = {
  foodCostGlobal: 26.8,
  foodCostTarget: 28.0,
  marginBrute: 73.2,
  recipeCount: 24,
  ingredientCount: 87,
  alertCount: 3,
  caHT: 46327,
  couverts: 1456,
};

function statusLabel(s: string) {
  switch (s) {
    case 'star': return { text: 'Star', color: 'bg-emerald-100 text-emerald-700' };
    case 'puzzle': return { text: 'Puzzle', color: 'bg-amber-100 text-amber-700' };
    case 'workhorse': return { text: 'Cheval de labour', color: 'bg-blue-100 text-blue-700' };
    case 'dog': return { text: 'Poids mort', color: 'bg-red-100 text-red-700' };
    default: return { text: s, color: 'bg-slate-100 text-slate-700' };
  }
}

export default function Demo() {
  useEffect(() => {
    document.title = 'Demo RestauMargin — Le Bistrot de Marie | RestauMargin';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Demo Banner ── */}
      <div className="sticky top-0 z-50 bg-amber-500 text-white px-4 py-3 text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <span className="font-semibold text-sm sm:text-base">
              Mode demo — Creez votre compte pour commencer
            </span>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-5 py-1.5 bg-white text-amber-600 font-semibold text-sm rounded-full hover:bg-amber-50 transition-colors"
          >
            Creer mon compte
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>RestauMargin</span>
            <span className="ml-2 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">DEMO</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className="text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors"
            >
              Tarifs
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Restaurant Header ── */}
      <header className="bg-gradient-to-b from-slate-50 to-white pt-8 pb-6 px-4 border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
                Le Bistrot de Marie
              </h1>
              <p className="text-sm text-slate-500">Bistrot traditionnel — Paris 11e</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* ── KPI Cards ── */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Tableau de bord
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              label="Food cost global"
              value={`${FAKE_KPIS.foodCostGlobal} %`}
              sub={`Objectif : ${FAKE_KPIS.foodCostTarget} %`}
              icon={<Percent className="w-5 h-5 text-teal-600" />}
              good
            />
            <KPICard
              label="Marge brute"
              value={`${FAKE_KPIS.marginBrute} %`}
              sub={`${FAKE_KPIS.caHT.toLocaleString('fr-FR')} EUR HT/mois`}
              icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
              good
            />
            <KPICard
              label="Recettes"
              value={String(FAKE_KPIS.recipeCount)}
              sub={`${FAKE_KPIS.ingredientCount} ingredients`}
              icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
            />
            <KPICard
              label="Alertes"
              value={String(FAKE_KPIS.alertCount)}
              sub="Prix fournisseurs en hausse"
              icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
              warning
            />
          </div>
        </section>

        {/* ── Recipes ── */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Fiches techniques (3 exemples)
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {FAKE_RECIPES.map((r) => {
              const st = statusLabel(r.status);
              return (
                <div key={r.name} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow relative group">
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                    <span className="flex items-center gap-2 text-slate-500 font-medium text-sm bg-white/90 px-4 py-2 rounded-full shadow">
                      <Lock className="w-4 h-4" />
                      Lecture seule en demo
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{r.category}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.color}`}>{st.text}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{r.name}</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-slate-400">Food cost</p>
                      <p className="text-lg font-bold text-slate-900">{r.foodCost} %</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Marge / portion</p>
                      <p className="text-lg font-bold text-emerald-600">{r.margin.toFixed(2)} EUR</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Cout matiere</p>
                      <p className="text-sm font-semibold text-slate-700">{r.costPerServing.toFixed(2)} EUR</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Prix de vente TTC</p>
                      <p className="text-sm font-semibold text-slate-700">{r.sellingPrice.toFixed(2)} EUR</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {r.ingredients.map((ing) => (
                      <span key={ing} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{ing}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Ingredients ── */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Ingredients (extrait)
          </h2>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-semibold">Ingredient</th>
                    <th className="text-right px-5 py-3 font-semibold">Prix unitaire</th>
                    <th className="text-right px-5 py-3 font-semibold">Unite</th>
                    <th className="text-right px-5 py-3 font-semibold">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {FAKE_INGREDIENTS.map((ing) => (
                    <tr key={ing.name} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-900">{ing.name}</td>
                      <td className="px-5 py-3 text-right text-slate-700">{ing.price.toFixed(2)} EUR</td>
                      <td className="px-5 py-3 text-right text-slate-500">{ing.unit}</td>
                      <td className="px-5 py-3 text-right text-slate-700">{ing.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="text-center py-12 px-4">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
              Pret a gerer VOS marges ?
            </h2>
            <p className="text-slate-500 mb-6">
              Ce que vous voyez ici avec des donnees fictives, RestauMargin le fait avec les donnees reelles de votre restaurant. Essayez gratuitement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
              >
                Creer mon compte gratuit
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-7 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl transition-colors"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        <p>&copy; {new Date().getFullYear()} RestauMargin. Tous droits reserves.</p>
      </footer>
    </div>
  );
}

/* ── KPI Card Component ── */
function KPICard({ label, value, sub, icon, good, warning }: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  good?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <p className={`text-2xl font-bold ${warning ? 'text-amber-500' : good ? 'text-slate-900' : 'text-slate-900'}`}>
        {value}
      </p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}
