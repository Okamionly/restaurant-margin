import { formatCurrency } from '../utils/currency';
import { useState, useEffect } from 'react';
import { ChefHat, Clock, Users, Flame, ShoppingCart, Plus, ArrowLeft, Truck, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '../hooks/useApiClient';

interface EditorialIngredient {
  id: number;
  recipe_id: number;
  ingredient_name: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_cost: number;
  supplier: string;
  image_url: string | null;
}

interface EditorialRecipe {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  portions: number;
  category: string;
  difficulty: string;
  prep_time: number;
  cook_time: number;
  cost_per_portion: number;
  suggested_price: number;
  margin_percent: number;
  season: string | null;
  chef_tip: string | null;
  published: boolean;
  week_date: string | null;
  ingredients?: EditorialIngredient[];
}

function getWeekNumber(d: Date): number {
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d.getTime() - oneJan.getTime()) / 86400000);
  return Math.ceil((days + oneJan.getDay() + 1) / 7);
}

const difficultyColors: Record<string, string> = {
  'Facile': 'bg-emerald-500/20 text-emerald-400',
  'Moyen': 'bg-amber-500/20 text-amber-400',
  'Difficile': 'bg-red-500/20 text-red-400',
};

const categoryEmojis: Record<string, string> = {
  'Plat': '🍽️',
  'Entrée': '🥗',
  'Dessert': '🍰',
};

export default function EditorialRecipes() {
  const [recipes, setRecipes] = useState<EditorialRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<EditorialRecipe | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [orderingId, setOrderingId] = useState<number | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { authHeaders } = useApiClient();

  const weekNum = getWeekNumber(new Date());

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    try {
      const res = await fetch('/api/editorial-recipes/latest');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRecipes(data);
    } catch {
      showToast('Impossible de charger les recettes de la semaine', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function openDetail(id: number) {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/editorial-recipes/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSelectedRecipe(data);
    } catch {
      showToast('Impossible de charger le détail', 'error');
    } finally {
      setDetailLoading(false);
    }
  }

  async function addToMine(id: number, e?: React.MouseEvent) {
    e?.stopPropagation();
    setAddingId(id);
    try {
      const res = await fetch(`/api/editorial-recipes/${id}/add-to-mine`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      showToast('Recette ajoutée à vos fiches techniques !', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de l\'ajout', 'error');
    } finally {
      setAddingId(null);
    }
  }

  async function orderIngredients(id: number, e?: React.MouseEvent) {
    e?.stopPropagation();
    setOrderingId(id);
    try {
      const res = await fetch(`/api/editorial-recipes/${id}/order`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }
      showToast('Commande créée avec succès !', 'success');
      navigate('/commandes');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la commande', 'error');
    } finally {
      setOrderingId(null);
    }
  }

  function MarginGauge({ percent }: { percent: number }) {
    const clamp = Math.min(100, Math.max(0, percent));
    const color = clamp >= 75 ? 'bg-emerald-500' : clamp >= 60 ? 'bg-amber-500' : 'bg-red-500';
    return (
      <div className="w-full h-1.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${clamp}%` }} />
      </div>
    );
  }

  // Detail modal
  if (selectedRecipe) {
    const r = selectedRecipe;
    const totalCost = r.ingredients?.reduce((s, i) => s + parseFloat(String(i.total_cost || 0)), 0) || 0;
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedRecipe(null)} className="flex items-center gap-2 text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour aux recettes
        </button>

        <div className="bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
          {/* Header image */}
          {r.image_url ? (
            <div className="relative h-48 sm:h-64">
              <img src={r.image_url} alt={r.title} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">{r.title}</h1>
                <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm mt-1">{r.description}</p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-gradient-to-r from-teal-900/30 to-transparent">
              <h1 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">{r.title}</h1>
              <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm mt-1">{r.description}</p>
            </div>
          )}

          {/* Info badges */}
          <div className="p-4 flex flex-wrap gap-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <span className="flex items-center gap-1.5 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
              <Users className="w-4 h-4 text-teal-400" /> {r.portions} portions
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
              <Clock className="w-4 h-4 text-teal-400" /> Prépa {r.prep_time} min
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
              <Flame className="w-4 h-4 text-orange-400" /> Cuisson {r.cook_time} min
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[r.difficulty] || 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]'}`}>
              {r.difficulty}
            </span>
          </div>

          {/* Cost summary */}
          <div className="p-4 grid grid-cols-3 gap-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="text-center">
              <div className="text-lg font-bold text-amber-400">{formatCurrency(parseFloat(String(r.cost_per_portion)))}</div>
              <div className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Coût / portion</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-400">{formatCurrency(parseFloat(String(r.suggested_price)))}</div>
              <div className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Prix suggéré</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-teal-400">{parseFloat(String(r.margin_percent)).toFixed(0)}%</div>
              <div className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Marge</div>
            </div>
          </div>

          {/* Ingredients list */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-3">Ingrédients</h3>
            <div className="space-y-2">
              {r.ingredients?.map((ing) => (
                <div key={ing.id} className="flex items-center gap-3 bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/50 rounded-xl p-3">
                  <div className="w-10 h-10 rounded-full bg-[#F3F4F6] dark:bg-[#171717] flex-shrink-0 overflow-hidden">
                    {ing.image_url ? (
                      <img src={ing.image_url} alt={ing.ingredient_name} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-lg flex items-center justify-center w-full h-full">🥘</span>'; }} />
                    ) : (
                      <span className="text-lg flex items-center justify-center w-full h-full">🥘</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#111111] dark:text-white">{ing.ingredient_name}</div>
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                      {ing.quantity} {ing.unit} · {formatCurrency(parseFloat(String(ing.price_per_unit)))}/{ing.unit}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-medium text-amber-400">{formatCurrency(parseFloat(String(ing.total_cost)))}</div>
                    <div className="text-xs text-[#6B7280] dark:text-[#A3A3A3] flex items-center gap-1">
                      <Truck className="w-3 h-3" /> {ing.supplier}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between items-center bg-[#FAFAFA]/30 dark:bg-[#0A0A0A]/30 rounded-xl p-3">
              <span className="text-sm font-semibold text-[#6B7280] dark:text-[#A3A3A3]">Coût total recette</span>
              <span className="text-lg font-bold text-amber-400">{formatCurrency(totalCost)}</span>
            </div>
          </div>

          {/* Chef tip */}
          {r.chef_tip && (
            <div className="px-4 pb-4">
              <div className="bg-teal-900/20 border border-teal-800/30 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <ChefHat className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-teal-300 italic">{r.chef_tip}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A] flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => addToMine(r.id)}
              disabled={addingId === r.id}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {addingId === r.id ? 'Ajout en cours...' : 'Ajouter à mes recettes'}
            </button>
            <button
              onClick={() => orderIngredients(r.id)}
              disabled={orderingId === r.id}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" />
              {orderingId === r.id ? 'Commande en cours...' : 'Commander les ingrédients'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-[#111111] dark:bg-white/20 flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">
              Recettes de la semaine — Semaine {weekNum}
            </h1>
            <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">
              Transgourmet · Cours du frais · {recipes.length} recette{recipes.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && recipes.length === 0 && (
        <div className="text-center py-16">
          <ChefHat className="w-16 h-16 mx-auto text-[#6B7280] dark:text-[#A3A3A3] mb-4" />
          <h3 className="text-lg font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-2">Aucune recette cette semaine</h3>
          <p className="text-[#6B7280] dark:text-[#A3A3A3]">Les recettes du "Cours du frais" seront publiées prochainement.</p>
        </div>
      )}

      {/* Recipe grid */}
      {!loading && recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recipes.map((r) => (
            <div
              key={r.id}
              onClick={() => openDetail(r.id)}
              className="bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden hover:border-[#E5E7EB] dark:border-[#1A1A1A] transition-all cursor-pointer group"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                {r.image_url ? (
                  <img
                    src={r.image_url}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      el.parentElement!.classList.add('bg-gradient-to-br', 'from-teal-900/40', 'to-transparent');
                      el.parentElement!.innerHTML = `<span class="text-5xl absolute inset-0 flex items-center justify-center">${categoryEmojis[r.category] || '🍽️'}</span>`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-900/40 to-transparent flex items-center justify-center">
                    <span className="text-5xl">{categoryEmojis[r.category] || '🍽️'}</span>
                  </div>
                )}
                {/* Season badge */}
                {r.season && (
                  <span className="absolute top-2 right-2 bg-white dark:bg-black/80 backdrop-blur text-xs text-[#6B7280] dark:text-[#A3A3A3] px-2 py-0.5 rounded-full">
                    {r.season}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi leading-tight">{r.title}</h3>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-full text-xs text-[#6B7280] dark:text-[#A3A3A3]">{r.category}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[r.difficulty] || 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                    {r.difficulty}
                  </span>
                  <span className="px-2 py-0.5 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-full text-xs text-[#9CA3AF] dark:text-[#737373] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {r.prep_time + r.cook_time} min
                  </span>
                  <span className="px-2 py-0.5 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-full text-xs text-[#9CA3AF] dark:text-[#737373] flex items-center gap-1">
                    <Users className="w-3 h-3" /> {r.portions}
                  </span>
                </div>

                {/* Cost per portion */}
                <div className="bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/50 rounded-xl p-3">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-2xl font-bold text-amber-400">{formatCurrency(parseFloat(String(r.cost_per_portion)))}<span className="text-sm font-normal text-[#6B7280] dark:text-[#A3A3A3]">/portion</span></span>
                  </div>
                  <MarginGauge percent={parseFloat(String(r.margin_percent))} />
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">Prix suggéré : <span className="text-emerald-400 font-semibold">{formatCurrency(parseFloat(String(r.suggested_price)))}</span></span>
                    <span className="text-sm font-semibold text-teal-400">marge {parseFloat(String(r.margin_percent)).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Chef tip */}
                {r.chef_tip && (
                  <div className="flex items-start gap-2 text-xs text-teal-300/80 italic">
                    <ChefHat className="w-3.5 h-3.5 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{r.chef_tip}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={(e) => addToMine(r.id, e)}
                    disabled={addingId === r.id}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white text-sm rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {addingId === r.id ? 'Ajout...' : 'Ajouter'}
                  </button>
                  <button
                    onClick={(e) => orderIngredients(r.id, e)}
                    disabled={orderingId === r.id}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white text-sm rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {orderingId === r.id ? '...' : 'Commander'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail loading overlay */}
      {detailLoading && (
        <div className="fixed inset-0 bg-white dark:bg-black/50 flex items-center justify-center z-50">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
