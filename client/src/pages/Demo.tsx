import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, TrendingUp, AlertTriangle, BarChart3, ShoppingBasket, ArrowRight, Lock, Eye, Percent, DollarSign, UtensilsCrossed, Truck, ClipboardList, Target } from 'lucide-react';

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
  {
    name: 'Salade Nicoise revisitee',
    category: 'Entree',
    foodCost: 32.5,
    costPerServing: 3.90,
    sellingPrice: 12.00,
    margin: 8.10,
    popularity: 95,
    status: 'workhorse' as const,
    ingredients: ['Thon frais', 'Oeuf', 'Olives noires', 'Tomates', 'Haricots verts', 'Anchois', 'Huile olive'],
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
    ingredients: ['Boeuf hache', 'Capres', 'Cornichons', 'Oignon', 'Jaune oeuf', 'Moutarde', 'Tabasco'],
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

function statusLabel(s: string) {
  switch (s) {
    case 'star': return { text: 'Star', color: 'bg-emerald-100 text-emerald-700' };
    case 'puzzle': return { text: 'Puzzle', color: 'bg-amber-100 text-amber-700' };
    case 'workhorse': return { text: 'Cheval de labour', color: 'bg-blue-100 text-blue-700' };
    case 'dog': return { text: 'Poids mort', color: 'bg-red-100 text-red-700' };
    default: return { text: s, color: 'bg-[#F5F5F5] text-[#404040]' };
  }
}

export default function Demo() {
  useEffect(() => {
    document.title = 'Demo RestauMargin -- Le Bistrot de Marie | RestauMargin';
    window.scrollTo(0, 0);
  }, []);

  const maxMargin = Math.max(...MARGIN_EVOLUTION.map(m => m.margin));

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* -- Demo Banner -- */}
      <div className="sticky top-0 z-50 bg-[#111111] text-white px-4 py-3 text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-white/70" />
            <span className="font-semibold text-sm sm:text-base">
              Mode demo -- Donnees fictives
            </span>
          </div>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-1.5 px-5 py-1.5 bg-white text-[#111111] font-semibold text-sm rounded-full hover:bg-white/90 transition-colors"
          >
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
      <header className="bg-gradient-to-b from-[#FAFAFA] to-white pt-8 pb-6 px-4 border-b border-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#111111]" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
                Le Bistrot de Marie
              </h1>
              <p className="text-sm text-[#737373]">Bistrot traditionnel -- Paris 11e</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* -- KPI Cards -- */}
        <section>
          <h2 className="text-lg font-bold text-[#111111] mb-4" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
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
              label="Recettes / Ingredients"
              value={`${FAKE_KPIS.recipeCount} / ${FAKE_KPIS.ingredientCount}`}
              sub={`${FAKE_KPIS.couverts} couverts/mois`}
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
              label="Couverts"
              value={FAKE_KPIS.couverts.toLocaleString('fr-FR')}
              sub="Ce mois"
              icon={<UtensilsCrossed className="w-5 h-5 text-[#737373]" />}
            />
            <KPICard
              label="CA HT"
              value={`${FAKE_KPIS.caHT.toLocaleString('fr-FR')} EUR`}
              sub="+12% vs mois dernier"
              icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
              good
            />
          </div>
        </section>

        {/* -- Margin Evolution Chart -- */}
        <section>
          <h2 className="text-lg font-bold text-[#111111] mb-4" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
            Evolution de la marge (6 derniers mois)
          </h2>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <div className="flex items-end gap-3 h-48">
              {MARGIN_EVOLUTION.map((m, i) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-emerald-600">{m.margin}%</span>
                  <div className="w-full bg-[#F5F5F5] rounded-t-lg relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${(m.margin / maxMargin) * 100}%`, animationDelay: `${i * 100}ms` }}
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
        </section>

        {/* -- Recipes -- */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#111111]" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
              Fiches techniques ({FAKE_RECIPES.length} recettes)
            </h2>
            <div className="flex gap-2">
              {(['star', 'puzzle', 'workhorse', 'dog'] as const).map(s => {
                const st = statusLabel(s);
                return (
                  <span key={s} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.color}`}>{st.text}</span>
                );
              })}
            </div>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {FAKE_RECIPES.map((r) => {
              const st = statusLabel(r.status);
              return (
                <div key={r.name} className="bg-white border border-[#E5E7EB] rounded-2xl p-4 hover:shadow-md transition-shadow relative group">
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                    <span className="flex items-center gap-2 text-[#737373] font-medium text-xs bg-white/90 px-3 py-1.5 rounded-full shadow">
                      <Lock className="w-3 h-3" />
                      Lecture seule
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-[#A3A3A3] uppercase tracking-wider">{r.category}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${st.color}`}>{st.text}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#111111] mb-2 line-clamp-2">{r.name}</h3>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <p className="text-[10px] text-[#A3A3A3]">Food cost</p>
                      <p className="text-base font-bold text-[#111111]">{r.foodCost}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#A3A3A3]">Marge</p>
                      <p className="text-base font-bold text-emerald-600">{r.margin.toFixed(2)} EUR</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {r.ingredients.slice(0, 4).map((ing) => (
                      <span key={ing} className="text-[10px] bg-[#F5F5F5] text-[#525252] px-1.5 py-0.5 rounded-full">{ing}</span>
                    ))}
                    {r.ingredients.length > 4 && (
                      <span className="text-[10px] bg-[#F5F5F5] text-[#A3A3A3] px-1.5 py-0.5 rounded-full">+{r.ingredients.length - 4}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

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
                      <td className="px-5 py-2.5 text-right text-[#404040]">{ing.price.toFixed(2)} EUR</td>
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

        {/* -- CTA Section -- */}
        <section className="text-center py-12 px-4">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-[#111111] mb-3" style={{ fontFamily: "'Satoshi', 'Inter', sans-serif" }}>
              Pret a gerer VOS marges ?
            </h2>
            <p className="text-[#737373] mb-6">
              Ce que vous voyez ici avec des donnees fictives, RestauMargin le fait avec les donnees reelles de votre restaurant. Essayez gratuitement pendant 7 jours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#111111] hover:bg-[#333333] text-white font-semibold rounded-xl transition-colors"
              >
                Creer mon compte gratuit
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-7 py-3 border border-[#D4D4D4] hover:border-[#A3A3A3] text-[#404040] font-semibold rounded-xl transition-colors"
              >
                Voir les tarifs
              </Link>
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
