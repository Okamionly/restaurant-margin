import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Trash2, Search, Pencil, Copy, Sparkles } from 'lucide-react';
import { fetchRecipes, fetchIngredients, createRecipe, updateRecipe, deleteRecipe, cloneRecipe } from '../services/api';
import type { Recipe, Ingredient } from '../types';
import { RECIPE_CATEGORIES } from '../types';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { searchTemplates, type RecipeTemplate } from '../data/recipeTemplates';

function MarginBadge({ percent }: { percent: number }) {
  const color = percent >= 70 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : percent >= 60 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{percent.toFixed(1)}%</span>;
}

export default function Recipes() {
  const { showToast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Plat',
    sellingPrice: '',
    nbPortions: '1',
    description: '',
    prepTimeMinutes: '',
    cookTimeMinutes: '',
    laborCostPerHour: '',
  });
  const [formIngredients, setFormIngredients] = useState<{ ingredientId: number; quantity: string; wastePercent: string }[]>([]);

  // Suggestion system
  const [suggestions, setSuggestions] = useState<RecipeTemplate[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [r, i] = await Promise.all([fetchRecipes(), fetchIngredients()]);
      setRecipes(r);
      setIngredients(i);
    } catch {
      showToast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() {
    setForm({ name: '', category: 'Plat', sellingPrice: '', nbPortions: '1', description: '', prepTimeMinutes: '', cookTimeMinutes: '', laborCostPerHour: '' });
    setFormIngredients([]);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(recipe: Recipe) {
    setForm({
      name: recipe.name,
      category: recipe.category,
      sellingPrice: String(recipe.sellingPrice),
      nbPortions: String(recipe.nbPortions),
      description: recipe.description || '',
      prepTimeMinutes: recipe.prepTimeMinutes ? String(recipe.prepTimeMinutes) : '',
      cookTimeMinutes: recipe.cookTimeMinutes ? String(recipe.cookTimeMinutes) : '',
      laborCostPerHour: recipe.laborCostPerHour ? String(recipe.laborCostPerHour) : '',
    });
    setFormIngredients(
      recipe.ingredients.map((ri) => ({
        ingredientId: ri.ingredientId,
        quantity: String(ri.quantity),
        wastePercent: ri.wastePercent ? String(ri.wastePercent) : '0',
      }))
    );
    setEditingId(recipe.id);
    setShowForm(true);
  }

  // Handle recipe name change - search for templates
  function handleNameChange(value: string) {
    setForm({ ...form, name: value });
    if (!editingId && value.length >= 2) {
      const results = searchTemplates(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  // Apply a template suggestion
  function applyTemplate(template: RecipeTemplate) {
    setForm({
      name: template.name,
      category: template.category,
      sellingPrice: String(template.suggestedSellingPrice),
      nbPortions: String(template.nbPortions),
      description: template.description,
      prepTimeMinutes: String(template.suggestedPrepTime),
      cookTimeMinutes: String(template.suggestedCookTime),
      laborCostPerHour: '',
    });

    // Map template ingredients to actual ingredients in DB
    const mapped = template.suggestedIngredients
      .map((ti: { name: string; quantity: number; wastePercent: number }) => {
        const found = ingredients.find((i) => i.name === ti.name);
        if (!found) return null;
        return {
          ingredientId: found.id,
          quantity: String(ti.quantity),
          wastePercent: String(ti.wastePercent),
        };
      })
      .filter(Boolean) as { ingredientId: number; quantity: string; wastePercent: string }[];

    setFormIngredients(mapped);
    setShowSuggestions(false);
    setSuggestions([]);
  }

  function addIngredientLine() {
    if (ingredients.length === 0) return;
    setFormIngredients([...formIngredients, { ingredientId: ingredients[0].id, quantity: '', wastePercent: '0' }]);
  }

  function removeIngredientLine(index: number) {
    setFormIngredients(formIngredients.filter((_, i) => i !== index));
  }

  // Real-time cost calculation
  const liveCost = formIngredients.reduce((total, fi) => {
    const ing = ingredients.find((i) => i.id === fi.ingredientId);
    const qty = parseFloat(fi.quantity) || 0;
    const waste = parseFloat(fi.wastePercent) || 0;
    const effectiveQty = qty * (1 + waste / 100);
    return total + (ing ? ing.pricePerUnit * effectiveQty : 0);
  }, 0);

  const livePortions = parseInt(form.nbPortions) || 1;
  const liveCostPerPortion = liveCost / livePortions;

  // Labor cost calculation
  const livePrepTime = parseFloat(form.prepTimeMinutes) || 0;
  const liveCookTime = parseFloat(form.cookTimeMinutes) || 0;
  const liveLaborRate = parseFloat(form.laborCostPerHour) || 0;
  const liveLaborCost = ((livePrepTime + liveCookTime) / 60) * liveLaborRate;
  const liveLaborPerPortion = liveLaborCost / livePortions;
  const liveTotalPerPortion = liveCostPerPortion + liveLaborPerPortion;

  const liveSellingPrice = parseFloat(form.sellingPrice) || 0;
  const liveMargin = liveSellingPrice > 0 ? ((liveSellingPrice - liveTotalPerPortion) / liveSellingPrice) * 100 : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name: form.name,
      category: form.category,
      sellingPrice: parseFloat(form.sellingPrice),
      nbPortions: parseInt(form.nbPortions) || 1,
      description: form.description || undefined,
      prepTimeMinutes: form.prepTimeMinutes ? parseFloat(form.prepTimeMinutes) : undefined,
      cookTimeMinutes: form.cookTimeMinutes ? parseFloat(form.cookTimeMinutes) : undefined,
      laborCostPerHour: form.laborCostPerHour ? parseFloat(form.laborCostPerHour) : undefined,
      ingredients: formIngredients
        .filter((fi) => parseFloat(fi.quantity) > 0)
        .map((fi) => ({
          ingredientId: fi.ingredientId,
          quantity: parseFloat(fi.quantity),
          wastePercent: parseFloat(fi.wastePercent) || 0,
        })),
    };

    try {
      if (editingId) {
        await updateRecipe(editingId, data);
        showToast('Recette modifiée avec succès', 'success');
      } else {
        await createRecipe(data);
        showToast('Recette créée avec succès', 'success');
      }
      setShowForm(false);
      loadData();
    } catch {
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteRecipe(deleteTarget);
      showToast('Recette supprimée', 'success');
      loadData();
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleClone(id: number) {
    try {
      await cloneRecipe(id);
      showToast('Recette dupliquée avec succès', 'success');
      loadData();
    } catch {
      showToast('Erreur lors de la duplication', 'error');
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-500 dark:text-slate-400">Chargement...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Fiches techniques</h2>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvelle recette
        </button>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher une recette..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10 w-full"
        />
      </div>

      {/* Recipe Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-500 col-span-full text-center py-8">
            {recipes.length === 0 ? 'Aucune recette. Créez-en une !' : 'Aucun résultat.'}
          </p>
        ) : (
          filtered.map((recipe) => (
            <div key={recipe.id} className="bg-white dark:bg-slate-800 rounded-lg shadow p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{recipe.name}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{recipe.category}</span>
                </div>
                <MarginBadge percent={recipe.margin.marginPercent} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mt-3 text-slate-600 dark:text-slate-400">
                <div>Prix vente : <strong className="text-slate-800 dark:text-slate-200">{recipe.sellingPrice.toFixed(2)} &euro;</strong></div>
                <div>Coût matière : <strong className="text-slate-800 dark:text-slate-200">{recipe.margin.costPerPortion.toFixed(2)} &euro;</strong></div>
                {recipe.margin.laborCostPerPortion > 0 && (
                  <div>Coût MO : <strong className="text-slate-800 dark:text-slate-200">{recipe.margin.laborCostPerPortion.toFixed(2)} &euro;</strong></div>
                )}
                <div>Coeff : <strong className="text-slate-800 dark:text-slate-200">{recipe.margin.coefficient.toFixed(2)}</strong></div>
                <div>Marge : <strong className="text-slate-800 dark:text-slate-200">{recipe.margin.marginAmount.toFixed(2)} &euro;</strong></div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t dark:border-slate-700">
                <Link to={`/recipes/${recipe.id}`} className="btn-secondary text-sm flex items-center gap-1 flex-1 justify-center">
                  <Eye className="w-4 h-4" /> Voir
                </Link>
                <button onClick={() => openEdit(recipe)} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Modifier">
                  <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
                <button onClick={() => handleClone(recipe.id)} className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30" title="Dupliquer">
                  <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
                <button onClick={() => setDeleteTarget(recipe.id)} className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30" title="Supprimer">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recipe Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Modifier la recette' : 'Nouvelle recette'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 relative">
              <label className="label">Nom du plat *</label>
              <input
                required
                className="input w-full"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                placeholder="Tapez un nom (ex: quiche, risotto, burger...)"
                autoComplete="off"
              />
              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 rounded-lg shadow-xl border dark:border-slate-600 max-h-64 overflow-y-auto">
                  <div className="px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 border-b dark:border-slate-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Suggestions de recettes
                  </div>
                  {suggestions.slice(0, 8).map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyTemplate(tpl)}
                      className="w-full text-left px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors border-b dark:border-slate-600 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{tpl.name}</span>
                          <span className="ml-2 text-xs text-slate-400">{tpl.category}</span>
                        </div>
                        <span className="text-sm font-mono text-slate-500">{tpl.suggestedSellingPrice} &euro;</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{tpl.description} &bull; {tpl.suggestedIngredients.length} ingrédients</div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(false)}
                    className="w-full text-center px-3 py-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    Fermer les suggestions
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="label">Catégorie *</label>
              <select required className="input w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {RECIPE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Nb portions *</label>
              <input required type="number" min="1" className="input w-full" value={form.nbPortions} onChange={(e) => setForm({ ...form, nbPortions: e.target.value })} />
            </div>
            <div>
              <label className="label">Prix de vente (&euro;) *</label>
              <input required type="number" step="0.01" min="0" className="input w-full" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} />
            </div>
            <div>
              <label className="label">Description</label>
              <input className="input w-full" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>

          {/* Timing and labor */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Préparation (min)</label>
              <input type="number" min="0" className="input w-full" value={form.prepTimeMinutes} onChange={(e) => setForm({ ...form, prepTimeMinutes: e.target.value })} />
            </div>
            <div>
              <label className="label">Cuisson (min)</label>
              <input type="number" min="0" className="input w-full" value={form.cookTimeMinutes} onChange={(e) => setForm({ ...form, cookTimeMinutes: e.target.value })} />
            </div>
            <div>
              <label className="label">Coût MO (&euro;/h)</label>
              <input type="number" step="0.01" min="0" className="input w-full" value={form.laborCostPerHour} onChange={(e) => setForm({ ...form, laborCostPerHour: e.target.value })} />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Ingrédients</label>
              <button type="button" onClick={addIngredientLine} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                + Ajouter un ingrédient
              </button>
            </div>
            {formIngredients.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 py-2">Aucun ingrédient ajouté</p>
            ) : (
              <div className="space-y-2">
                {formIngredients.map((fi, idx) => {
                  const ing = ingredients.find((i) => i.id === fi.ingredientId);
                  const qty = parseFloat(fi.quantity) || 0;
                  const waste = parseFloat(fi.wastePercent) || 0;
                  const effectiveQty = qty * (1 + waste / 100);
                  const lineTotal = ing ? ing.pricePerUnit * effectiveQty : 0;
                  return (
                    <div key={idx} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <select
                        className="input flex-1 min-w-[140px]"
                        value={fi.ingredientId}
                        onChange={(e) => {
                          const updated = [...formIngredients];
                          updated[idx].ingredientId = parseInt(e.target.value);
                          setFormIngredients(updated);
                        }}
                      >
                        {ingredients.map((i) => (
                          <option key={i.id} value={i.id}>{i.name} ({i.pricePerUnit.toFixed(2)}&euro;/{i.unit})</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        placeholder="Qté"
                        className="input w-20"
                        value={fi.quantity}
                        onChange={(e) => {
                          const updated = [...formIngredients];
                          updated[idx].quantity = e.target.value;
                          setFormIngredients(updated);
                        }}
                      />
                      <span className="text-xs text-slate-500 dark:text-slate-400 w-8">{ing?.unit}</span>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        placeholder="Perte %"
                        className="input w-20"
                        value={fi.wastePercent}
                        onChange={(e) => {
                          const updated = [...formIngredients];
                          updated[idx].wastePercent = e.target.value;
                          setFormIngredients(updated);
                        }}
                        title="Pourcentage de perte"
                      />
                      <span className="text-xs text-slate-400 w-4">%</span>
                      <span className="text-sm font-mono w-20 text-right text-slate-700 dark:text-slate-300">{lineTotal.toFixed(2)} &euro;</span>
                      <button type="button" onClick={() => removeIngredientLine(idx)} className="p-1 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Live cost preview */}
          {formIngredients.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-sm space-y-1">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Coût matière total :</span>
                <strong>{liveCost.toFixed(2)} &euro;</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Coût matière / portion :</span>
                <strong>{liveCostPerPortion.toFixed(2)} &euro;</strong>
              </div>
              {liveLaborPerPortion > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Coût MO / portion :</span>
                  <strong>{liveLaborPerPortion.toFixed(2)} &euro;</strong>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-300 font-semibold pt-1 border-t dark:border-slate-600">
                <span>Coût total / portion :</span>
                <strong>{liveTotalPerPortion.toFixed(2)} &euro;</strong>
              </div>
              {liveSellingPrice > 0 && (
                <div className="flex justify-between font-semibold pt-1 border-t dark:border-slate-600">
                  <span className="text-slate-700 dark:text-slate-200">Marge :</span>
                  <span className={liveMargin >= 70 ? 'text-green-600' : liveMargin >= 60 ? 'text-amber-600' : 'text-red-600'}>
                    {liveMargin.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
            <button type="submit" className="btn-primary">{editingId ? 'Modifier' : 'Créer la recette'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        title="Supprimer la recette"
        message="Êtes-vous sûr de vouloir supprimer cette recette ? Cette action est irréversible."
      />
    </div>
  );
}
