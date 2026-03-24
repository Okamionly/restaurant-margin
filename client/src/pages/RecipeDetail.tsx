import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Clock, AlertTriangle, ChefHat, SlidersHorizontal, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchRecipe } from '../services/api';
import type { Recipe } from '../types';

// Allergen color map for colored badges
const ALLERGEN_COLORS: Record<string, string> = {
  Gluten: 'bg-yellow-200 text-yellow-900 dark:bg-yellow-800/50 dark:text-yellow-200',
  'Crustacés': 'bg-orange-200 text-orange-900 dark:bg-orange-800/50 dark:text-orange-200',
  Oeufs: 'bg-amber-200 text-amber-900 dark:bg-amber-800/50 dark:text-amber-200',
  Poissons: 'bg-blue-200 text-blue-900 dark:bg-blue-800/50 dark:text-blue-200',
  Arachides: 'bg-red-200 text-red-900 dark:bg-red-800/50 dark:text-red-200',
  Soja: 'bg-green-200 text-green-900 dark:bg-green-800/50 dark:text-green-200',
  Lait: 'bg-sky-200 text-sky-900 dark:bg-sky-800/50 dark:text-sky-200',
  'Fruits à coque': 'bg-stone-200 text-stone-900 dark:bg-stone-800/50 dark:text-stone-200',
  'Céleri': 'bg-lime-200 text-lime-900 dark:bg-lime-800/50 dark:text-lime-200',
  Moutarde: 'bg-yellow-300 text-yellow-900 dark:bg-yellow-700/50 dark:text-yellow-200',
  'Sésame': 'bg-teal-200 text-teal-900 dark:bg-teal-800/50 dark:text-teal-200',
  Sulfites: 'bg-purple-200 text-purple-900 dark:bg-purple-800/50 dark:text-purple-200',
  Lupin: 'bg-violet-200 text-violet-900 dark:bg-violet-800/50 dark:text-violet-200',
  Mollusques: 'bg-cyan-200 text-cyan-900 dark:bg-cyan-800/50 dark:text-cyan-200',
};

const DONUT_COLORS = ['#ef4444', '#f59e0b', '#22c55e'];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [simPrice, setSimPrice] = useState<number | null>(null);
  const [portions, setPortions] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchRecipe(parseInt(id))
        .then((r) => {
          setRecipe(r);
          setSimPrice(r.sellingPrice);
          setPortions(r.nbPortions);
        })
        .catch(() => console.error('Erreur'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Simulator computed values
  const simData = useMemo(() => {
    if (!recipe || simPrice === null) return null;
    const totalCost = recipe.margin.totalCostPerPortion;
    const margin = simPrice - totalCost;
    const marginPct = simPrice > 0 ? (margin / simPrice) * 100 : 0;
    const coeff = totalCost > 0 ? simPrice / totalCost : 0;
    return { margin, marginPct, coeff };
  }, [recipe, simPrice]);

  // Portions multiplier
  const portionMultiplier = useMemo(() => {
    if (!recipe || portions === null) return 1;
    return portions / recipe.nbPortions;
  }, [recipe, portions]);

  if (loading) return <div className="text-center py-12 text-slate-500 dark:text-slate-400">Chargement...</div>;
  if (!recipe) return <div className="text-center py-12 text-red-500">Recette non trouvee</div>;

  const m = recipe.margin;
  const marginColor = m.marginPercent >= 70 ? 'text-green-600' : m.marginPercent >= 60 ? 'text-amber-600' : 'text-red-600';
  const marginBg = m.marginPercent >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : m.marginPercent >= 60 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
  const marginBarColor = m.marginPercent >= 70 ? 'bg-green-500' : m.marginPercent >= 60 ? 'bg-amber-500' : 'bg-red-500';

  const allAllergens = Array.from(
    new Set(recipe.ingredients.flatMap((ri) => ri.ingredient.allergens || []))
  ).sort();

  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  // Donut chart data
  const donutData = [
    { name: 'Matiere', value: Math.round(m.costPerPortion * 100) / 100 },
    ...(m.laborCostPerPortion > 0 ? [{ name: 'Main-d\'oeuvre', value: Math.round(m.laborCostPerPortion * 100) / 100 }] : []),
    { name: 'Marge', value: Math.round(m.marginAmount * 100) / 100 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      {/* Screen navigation */}
      <div className="flex items-center justify-between mb-6 no-print">
        <Link to="/recipes" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour aux recettes
        </Link>
        <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 text-sm">
          <Printer className="w-4 h-4" /> Exporter PDF
        </button>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block mb-6 border-b-2 border-slate-300 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-slate-700" />
            <div>
              <div className="text-xl font-bold text-slate-800">Restaurant Manager</div>
              <div className="text-sm text-slate-500">Gestion des fiches techniques</div>
            </div>
          </div>
          <div className="text-right text-sm text-slate-500">
            <div>Fiche Technique N&deg;{recipe.id}</div>
            <div>Mise a jour : {formatDate(recipe.updatedAt)}</div>
          </div>
        </div>
      </div>

      {/* Margin badge - big visual indicator */}
      <div className="mb-4 no-print">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${marginBg}`}>
          {m.marginPercent >= 70 ? 'Excellente marge' : m.marginPercent >= 60 ? 'Marge correcte' : 'Marge insuffisante'}
          <span className="text-lg">{m.marginPercent.toFixed(1)}%</span>
        </div>
      </div>

      {/* Main Fiche Technique card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none print:border print:border-slate-300" id="fiche-technique">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 dark:from-blue-900 dark:to-slate-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <p className="text-blue-300 text-xs uppercase tracking-wider font-semibold mb-1">Fiche Technique N&deg;{recipe.id}</p>
              <h1 className="text-2xl sm:text-3xl font-bold">{recipe.name}</h1>
              <p className="text-blue-200 mt-1 text-sm">{recipe.category}</p>
              <p className="text-blue-400 text-xs mt-1 hidden print:block">Derniere mise a jour : {formatDate(recipe.updatedAt)}</p>
            </div>
            <div className="text-left sm:text-right flex-shrink-0">
              <div className="text-3xl sm:text-4xl font-bold">{recipe.sellingPrice.toFixed(2)} &euro;</div>
              <div className="text-blue-200 text-sm">Prix de vente TTC</div>
            </div>
          </div>
          {recipe.description && <p className="mt-4 text-blue-100 text-sm leading-relaxed">{recipe.description}</p>}

          {/* Time info */}
          {totalTime > 0 && (
            <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-blue-700/50">
              {recipe.prepTimeMinutes > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-blue-200">
                  <Clock className="w-4 h-4" />
                  <span>Prep : {recipe.prepTimeMinutes} min</span>
                </div>
              )}
              {recipe.cookTimeMinutes > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-blue-200">
                  <Clock className="w-4 h-4" />
                  <span>Cuisson : {recipe.cookTimeMinutes} min</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm text-white font-semibold">
                <Clock className="w-4 h-4" />
                <span>Total : {totalTime} min</span>
              </div>
            </div>
          )}

          {/* Margin progress bar */}
          <div className="mt-5 pt-4 border-t border-blue-700/50">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-blue-200">Marge</span>
              <span className="font-bold text-white">{m.marginPercent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-blue-950/50 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${marginBarColor}`}
                style={{ width: `${Math.min(m.marginPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-blue-400 mt-1">
              <span>0%</span>
              <span className="border-l border-blue-600 pl-1">60%</span>
              <span className="border-l border-blue-600 pl-1">70%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Allergens section with colored badges */}
        {allAllergens.length > 0 && (
          <div className="px-6 sm:px-8 py-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-semibold text-amber-800 dark:text-amber-300 block mb-2">Allergenes presents dans cette recette :</span>
                <div className="flex flex-wrap gap-2">
                  {allAllergens.map((a) => (
                    <span
                      key={a}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${ALLERGEN_COLORS[a] || 'bg-amber-200 text-amber-800 dark:bg-amber-800/50 dark:text-amber-200'}`}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Portions calculator */}
        <div className="px-6 sm:px-8 py-4 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-200 dark:border-indigo-800 no-print">
          <div className="flex items-center gap-3 flex-wrap">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Calculer pour</span>
            <input
              type="number"
              min={1}
              max={500}
              value={portions ?? ''}
              onChange={(e) => setPortions(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-2 py-1 text-sm border border-indigo-300 dark:border-indigo-600 rounded-lg text-center bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <span className="text-sm text-indigo-700 dark:text-indigo-300">
              portions {portionMultiplier !== 1 && <span className="text-xs text-indigo-500">(x{portionMultiplier.toFixed(2)})</span>}
            </span>
            {portionMultiplier !== 1 && (
              <button
                onClick={() => setPortions(recipe.nbPortions)}
                className="text-xs text-indigo-600 dark:text-indigo-400 underline hover:no-underline ml-auto"
              >
                Reinitialiser ({recipe.nbPortions})
              </button>
            )}
          </div>
        </div>

        {/* Ingredients Table */}
        <div className="p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            Composition
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
              ({portions ?? recipe.nbPortions} portion{(portions ?? recipe.nbPortions) > 1 ? 's' : ''})
            </span>
          </h2>
          <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-600 text-left text-slate-600 dark:text-slate-400">
                  <th className="pb-3 font-semibold">Ingredient</th>
                  <th className="pb-3 font-semibold text-center">Quantite</th>
                  <th className="pb-3 font-semibold text-center">Unite</th>
                  <th className="pb-3 font-semibold text-center">Perte %</th>
                  <th className="pb-3 font-semibold text-right">P.U.</th>
                  <th className="pb-3 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients.map((ri, idx) => {
                  const waste = ri.wastePercent || 0;
                  const baseQty = ri.quantity * portionMultiplier;
                  const effectiveQty = baseQty * (1 + waste / 100);
                  const lineTotal = effectiveQty * ri.ingredient.pricePerUnit;
                  const rowBg = idx % 2 === 0
                    ? 'bg-white dark:bg-slate-800'
                    : 'bg-slate-50 dark:bg-slate-750 dark:bg-slate-800/50';
                  return (
                    <tr key={ri.id} className={`${rowBg} print:even:bg-slate-50`}>
                      <td className="py-3 px-1 text-slate-800 dark:text-slate-200 font-medium">
                        {ri.ingredient.name}
                        {(ri.ingredient.allergens || []).length > 0 && (
                          <span className="ml-1.5 text-amber-500 text-xs font-bold" title={ri.ingredient.allergens.join(', ')}>
                            *
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-1 text-center font-mono text-slate-700 dark:text-slate-300">
                        {portionMultiplier !== 1 ? baseQty.toFixed(2) : ri.quantity}
                      </td>
                      <td className="py-3 px-1 text-center text-slate-600 dark:text-slate-400">{ri.ingredient.unit}</td>
                      <td className="py-3 px-1 text-center font-mono text-slate-500 dark:text-slate-400">{waste > 0 ? `${waste}%` : '\u2014'}</td>
                      <td className="py-3 px-1 text-right font-mono text-slate-700 dark:text-slate-300">{ri.ingredient.pricePerUnit.toFixed(2)} &euro;</td>
                      <td className="py-3 px-1 text-right font-mono font-bold text-slate-800 dark:text-slate-200">{lineTotal.toFixed(2)} &euro;</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 dark:border-slate-600 font-bold text-slate-800 dark:text-slate-100">
                  <td colSpan={5} className="py-4 text-base">Cout matiere total</td>
                  <td className="py-4 text-right font-mono text-base">{(m.foodCost * portionMultiplier).toFixed(2)} &euro;</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Donut chart + Key metrics side by side */}
        <div className="bg-slate-50 dark:bg-slate-700/50 p-6 sm:p-8 border-t dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5">Analyse de marge</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Donut chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center print:border print:border-slate-300">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Repartition du prix de vente</h3>
              <div className="w-48 h-48 no-print">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {donutData.map((_entry, index) => (
                        <Cell key={index} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `${value.toFixed(2)} \u20ac`}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Print fallback for donut */}
              <div className="hidden print:block text-sm text-slate-600 space-y-1 mt-2">
                {donutData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: DONUT_COLORS[i] }} />
                    <span>{d.name} : {d.value.toFixed(2)} &euro;</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-3 text-xs">
                {donutData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: DONUT_COLORS[i] }} />
                    <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key metrics grid */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <MetricCard label="Cout matiere" value={`${m.costPerPortion.toFixed(2)} \u20ac`} sub="/ portion" />
              {m.laborCostPerPortion > 0 && (
                <MetricCard label="Cout MO" value={`${m.laborCostPerPortion.toFixed(2)} \u20ac`} sub="/ portion" />
              )}
              <MetricCard label="Cout total" value={`${m.totalCostPerPortion.toFixed(2)} \u20ac`} sub="/ portion" />
              <MetricCard label="Marge brute" value={`${m.marginAmount.toFixed(2)} \u20ac`} />
              <MetricCard label="Marge %" value={`${m.marginPercent.toFixed(1)}%`} valueClass={marginColor} />
              <MetricCard label="Coefficient" value={m.coefficient.toFixed(2)} />
            </div>
          </div>
        </div>

        {/* Print summary box */}
        <div className="hidden print:block p-6 border-t border-slate-300 bg-white">
          <div className="border-2 border-slate-400 rounded-lg p-4">
            <h3 className="font-bold text-slate-800 text-base mb-3 text-center uppercase tracking-wide">Resume des indicateurs cles</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-slate-500">Ratio cout matiere</div>
                <div className="text-2xl font-bold text-slate-800">{((m.costPerPortion / recipe.sellingPrice) * 100).toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Marge brute</div>
                <div className="text-2xl font-bold text-slate-800">{m.marginPercent.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Coefficient</div>
                <div className="text-2xl font-bold text-slate-800">{m.coefficient.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Simulator */}
      <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden no-print">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
              <SlidersHorizontal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Simulateur de prix</h2>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Ajustez le prix de vente pour voir l'impact sur la marge et le coefficient en temps reel.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Prix de vente simule</label>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{(simPrice ?? 0).toFixed(2)} &euro;</span>
              </div>
              <input
                type="range"
                min={Math.max(0, m.totalCostPerPortion).toFixed(2)}
                max={(recipe.sellingPrice * 2.5).toFixed(2)}
                step="0.10"
                value={simPrice ?? recipe.sellingPrice}
                onChange={(e) => setSimPrice(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Cout : {m.totalCostPerPortion.toFixed(2)} &euro;</span>
                <span>Actuel : {recipe.sellingPrice.toFixed(2)} &euro;</span>
                <span>Max : {(recipe.sellingPrice * 2.5).toFixed(2)} &euro;</span>
              </div>
            </div>

            {simData && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                <SimCard
                  label="Marge"
                  value={`${simData.margin.toFixed(2)} \u20ac`}
                  highlight={simData.margin >= m.marginAmount}
                />
                <SimCard
                  label="Marge %"
                  value={`${simData.marginPct.toFixed(1)}%`}
                  highlight={simData.marginPct >= 70}
                  warn={simData.marginPct < 60}
                />
                <SimCard
                  label="Coefficient"
                  value={simData.coeff.toFixed(2)}
                  highlight={simData.coeff >= m.coefficient}
                />
              </div>
            )}

            {simPrice !== recipe.sellingPrice && (
              <button
                onClick={() => setSimPrice(recipe.sellingPrice)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Reinitialiser au prix actuel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Print footer */}
      <div className="hidden print:block mt-6 pt-4 border-t border-slate-300 text-center text-xs text-slate-400">
        <p>Document genere le {new Date().toLocaleDateString('fr-FR')} - Fiche Technique N&deg;{recipe.id} - {recipe.name}</p>
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function MetricCard({ label, value, sub, valueClass }: { label: string; value: string; sub?: string; valueClass?: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-sm border border-slate-100 dark:border-slate-700 print:border print:border-slate-300">
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">{label}</div>
      <div className={`text-xl font-bold mt-1 ${valueClass || 'text-slate-800 dark:text-slate-100'}`}>{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function SimCard({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
  const border = warn
    ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
    : highlight
      ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800';
  const textColor = warn
    ? 'text-red-700 dark:text-red-300'
    : highlight
      ? 'text-green-700 dark:text-green-300'
      : 'text-slate-800 dark:text-slate-100';
  return (
    <div className={`rounded-xl border-2 p-4 text-center transition-colors ${border}`}>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</div>
      <div className={`text-xl font-bold mt-1 ${textColor}`}>{value}</div>
    </div>
  );
}
