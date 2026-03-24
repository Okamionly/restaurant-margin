import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Clock, AlertTriangle } from 'lucide-react';
import { fetchRecipe } from '../services/api';
import type { Recipe } from '../types';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRecipe(parseInt(id))
        .then(setRecipe)
        .catch(() => console.error('Erreur'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="text-center py-12 text-slate-500 dark:text-slate-400">Chargement...</div>;
  if (!recipe) return <div className="text-center py-12 text-red-500">Recette non trouvée</div>;

  const m = recipe.margin;
  const marginColor = m.marginPercent >= 70 ? 'text-green-600' : m.marginPercent >= 60 ? 'text-amber-600' : 'text-red-600';

  // Aggregate allergens from all recipe ingredients
  const allAllergens = Array.from(
    new Set(recipe.ingredients.flatMap((ri) => ri.ingredient.allergens || []))
  ).sort();

  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 no-print">
        <Link to="/recipes" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
          <ArrowLeft className="w-4 h-4" /> Retour aux recettes
        </Link>
        <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 text-sm">
          <Printer className="w-4 h-4" /> Exporter PDF
        </button>
      </div>

      {/* Fiche Technique */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden print:shadow-none print:rounded-none" id="fiche-technique">
        {/* Header */}
        <div className="bg-blue-800 dark:bg-blue-900 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{recipe.name}</h1>
              <p className="text-blue-200 mt-1">{recipe.category}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{recipe.sellingPrice.toFixed(2)} &euro;</div>
              <div className="text-blue-200 text-sm">Prix de vente</div>
            </div>
          </div>
          {recipe.description && <p className="mt-3 text-blue-100">{recipe.description}</p>}

          {/* Time info */}
          {totalTime > 0 && (
            <div className="flex gap-4 mt-4 pt-3 border-t border-blue-700">
              {recipe.prepTimeMinutes > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-blue-200">
                  <Clock className="w-4 h-4" />
                  <span>Prép : {recipe.prepTimeMinutes} min</span>
                </div>
              )}
              {recipe.cookTimeMinutes > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-blue-200">
                  <Clock className="w-4 h-4" />
                  <span>Cuisson : {recipe.cookTimeMinutes} min</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                <Clock className="w-4 h-4" />
                <span>Total : {totalTime} min</span>
              </div>
            </div>
          )}
        </div>

        {/* Allergens */}
        {allAllergens.length > 0 && (
          <div className="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 flex-wrap">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Allergènes :</span>
              {allAllergens.map((a) => (
                <span key={a} className="px-2 py-0.5 rounded text-xs bg-amber-200 dark:bg-amber-800/50 text-amber-800 dark:text-amber-200 font-medium">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients Table */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Composition ({recipe.nbPortions} portion{recipe.nbPortions > 1 ? 's' : ''})</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-600 text-left text-slate-600 dark:text-slate-400">
                <th className="pb-2 font-medium">Ingrédient</th>
                <th className="pb-2 font-medium text-center">Quantité</th>
                <th className="pb-2 font-medium text-center">Unité</th>
                <th className="pb-2 font-medium text-center">Perte %</th>
                <th className="pb-2 font-medium text-right">P.U.</th>
                <th className="pb-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {recipe.ingredients.map((ri) => {
                const waste = ri.wastePercent || 0;
                const effectiveQty = ri.quantity * (1 + waste / 100);
                const lineTotal = effectiveQty * ri.ingredient.pricePerUnit;
                return (
                  <tr key={ri.id}>
                    <td className="py-2.5 text-slate-800 dark:text-slate-200">
                      {ri.ingredient.name}
                      {(ri.ingredient.allergens || []).length > 0 && (
                        <span className="ml-1 text-amber-500 text-xs" title={ri.ingredient.allergens.join(', ')}>*</span>
                      )}
                    </td>
                    <td className="py-2.5 text-center font-mono text-slate-700 dark:text-slate-300">{ri.quantity}</td>
                    <td className="py-2.5 text-center text-slate-600 dark:text-slate-400">{ri.ingredient.unit}</td>
                    <td className="py-2.5 text-center font-mono text-slate-500 dark:text-slate-400">{waste > 0 ? `${waste}%` : '\u2014'}</td>
                    <td className="py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{ri.ingredient.pricePerUnit.toFixed(2)} &euro;</td>
                    <td className="py-2.5 text-right font-mono font-medium text-slate-800 dark:text-slate-200">{lineTotal.toFixed(2)} &euro;</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 dark:border-slate-600 font-semibold text-slate-800 dark:text-slate-100">
                <td colSpan={5} className="py-3">Coût matière total</td>
                <td className="py-3 text-right font-mono">{m.foodCost.toFixed(2)} &euro;</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Margin Summary */}
        <div className="bg-slate-50 dark:bg-slate-700/50 p-6 border-t dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Analyse de marge</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-sm">
              <div className="text-sm text-slate-500 dark:text-slate-400">Coût matière</div>
              <div className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100">{m.costPerPortion.toFixed(2)} &euro;</div>
              <div className="text-xs text-slate-400">/ portion</div>
            </div>
            {m.laborCostPerPortion > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-sm">
                <div className="text-sm text-slate-500 dark:text-slate-400">Coût MO</div>
                <div className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100">{m.laborCostPerPortion.toFixed(2)} &euro;</div>
                <div className="text-xs text-slate-400">/ portion</div>
              </div>
            )}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-sm">
              <div className="text-sm text-slate-500 dark:text-slate-400">Coût total</div>
              <div className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100">{m.totalCostPerPortion.toFixed(2)} &euro;</div>
              <div className="text-xs text-slate-400">/ portion</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-sm">
              <div className="text-sm text-slate-500 dark:text-slate-400">Marge brute</div>
              <div className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100">{m.marginAmount.toFixed(2)} &euro;</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-sm">
              <div className="text-sm text-slate-500 dark:text-slate-400">Marge %</div>
              <div className={`text-xl font-bold mt-1 ${marginColor}`}>{m.marginPercent.toFixed(1)}%</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 text-center shadow-sm">
              <div className="text-sm text-slate-500 dark:text-slate-400">Coefficient</div>
              <div className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100">{m.coefficient.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
