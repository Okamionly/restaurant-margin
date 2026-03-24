import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, TrendingUp, ChefHat, DollarSign } from 'lucide-react';
import { fetchRecipes } from '../services/api';
import type { Recipe } from '../types';
import { RECIPE_CATEGORIES } from '../types';

export default function MenuBuilder() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Recipe[]>();
    RECIPE_CATEGORIES.forEach((cat) => map.set(cat, []));
    recipes.forEach((r) => {
      const list = map.get(r.category) || [];
      list.push(r);
      map.set(r.category, list);
    });
    // Remove empty categories
    const result: { category: string; recipes: Recipe[]; avgMargin: number; avgPrice: number; totalRevenue: number }[] = [];
    map.forEach((recipeList, category) => {
      if (recipeList.length > 0) {
        const avgMargin = recipeList.reduce((s, r) => s + r.margin.marginPercent, 0) / recipeList.length;
        const avgPrice = recipeList.reduce((s, r) => s + r.sellingPrice, 0) / recipeList.length;
        const totalRevenue = recipeList.reduce((s, r) => s + r.sellingPrice, 0);
        result.push({ category, recipes: recipeList, avgMargin, avgPrice, totalRevenue });
      }
    });
    return result;
  }, [recipes]);

  const displayGroups = selectedCategory
    ? grouped.filter((g) => g.category === selectedCategory)
    : grouped;

  // Global stats
  const totalPlats = recipes.length;
  const globalAvgMargin = totalPlats > 0 ? recipes.reduce((s, r) => s + r.margin.marginPercent, 0) / totalPlats : 0;
  const globalAvgPrice = totalPlats > 0 ? recipes.reduce((s, r) => s + r.sellingPrice, 0) / totalPlats : 0;
  const totalRevenue = recipes.reduce((s, r) => s + r.sellingPrice, 0);

  if (loading) return <div className="text-center py-12 text-slate-500 dark:text-slate-400">Chargement...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">La Carte</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input w-full sm:w-48"
        >
          <option value="">Toutes les catégories</option>
          {RECIPE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Total plats</span>
            <div className="p-2 rounded-lg bg-blue-600"><ChefHat className="w-5 h-5 text-white" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalPlats}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Marge moy. carte</span>
            <div className="p-2 rounded-lg bg-green-600"><TrendingUp className="w-5 h-5 text-white" /></div>
          </div>
          <div className={`text-2xl font-bold ${globalAvgMargin >= 70 ? 'text-green-600' : globalAvgMargin >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
            {globalAvgMargin.toFixed(1)}%
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Prix moyen</span>
            <div className="p-2 rounded-lg bg-purple-600"><DollarSign className="w-5 h-5 text-white" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{globalAvgPrice.toFixed(2)} &euro;</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">CA potentiel carte</span>
            <div className="p-2 rounded-lg bg-cyan-600"><DollarSign className="w-5 h-5 text-white" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalRevenue.toFixed(2)} &euro;</div>
        </div>
      </div>

      {/* Grouped by Category */}
      {displayGroups.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow">
          <ChefHat className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">Aucun plat dans cette catégorie</h3>
          <p className="text-slate-400 dark:text-slate-500">Créez des recettes pour construire votre carte.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {displayGroups.map((group) => (
            <div key={group.category} className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-900 dark:to-blue-800 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{group.category}</h3>
                  <div className="flex items-center gap-4 text-sm text-blue-200">
                    <span>{group.recipes.length} plat{group.recipes.length > 1 ? 's' : ''}</span>
                    <span>Marge moy. : <strong className="text-white">{group.avgMargin.toFixed(1)}%</strong></span>
                    <span>Prix moy. : <strong className="text-white">{group.avgPrice.toFixed(2)} &euro;</strong></span>
                  </div>
                </div>
              </div>

              {/* Recipes in category */}
              <div className="divide-y dark:divide-slate-700">
                {group.recipes
                  .sort((a, b) => a.sellingPrice - b.sellingPrice)
                  .map((recipe) => {
                    const mc = recipe.margin.marginPercent >= 70 ? 'text-green-600' : recipe.margin.marginPercent >= 60 ? 'text-amber-600' : 'text-red-600';
                    return (
                      <div key={recipe.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">{recipe.name}</h4>
                            {recipe.description && (
                              <span className="text-sm text-slate-400 dark:text-slate-500 hidden sm:inline">{recipe.description}</span>
                            )}
                          </div>
                          <div className="flex gap-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
                            <span>Coût: {(recipe.margin.totalCostPerPortion || recipe.margin.costPerPortion).toFixed(2)} &euro;</span>
                            <span>Coeff: {recipe.margin.coefficient.toFixed(2)}</span>
                            {recipe.nbPortions > 1 && <span>{recipe.nbPortions} portions</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{recipe.sellingPrice.toFixed(2)} &euro;</div>
                            <div className={`text-sm font-semibold ${mc}`}>{recipe.margin.marginPercent.toFixed(1)}%</div>
                          </div>
                          <Link
                            to={`/recipes/${recipe.id}`}
                            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            title="Voir fiche technique"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
