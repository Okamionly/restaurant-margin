import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Clock, Scale, ChefHat, X, Play, Pause, RotateCcw, Timer, UtensilsCrossed } from 'lucide-react';
import { fetchRecipes } from '../services/api';
import type { Recipe } from '../types';

// ── Unit conversion helper ─────────────────────────────────────────────
function convertToBaseUnit(quantity: number, inputUnit: string, priceUnit: string): number {
  const u = inputUnit.toLowerCase().trim();
  const p = priceUnit.toLowerCase().trim();
  if (u === p) return quantity;
  if (p === 'kg') {
    if (u === 'g') return quantity / 1000;
    if (u === 'mg') return quantity / 1000000;
  }
  if (p === 'g' && u === 'kg') return quantity * 1000;
  if (p === 'l' || p === 'litre' || p === 'litres') {
    if (u === 'cl') return quantity / 100;
    if (u === 'ml') return quantity / 1000;
  }
  if (p === 'cl') {
    if (u === 'l' || u === 'litre') return quantity * 100;
    if (u === 'ml') return quantity / 10;
  }
  return quantity;
}

// ── Kitchen Timer Component ────────────────────────────────────────────
function KitchenTimer() {
  const [seconds, setSeconds] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState(0);
  const [running, setRunning] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && !alarm) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          if (targetMinutes > 0 && next >= targetMinutes * 60) {
            setAlarm(true);
            setRunning(false);
          }
          return next;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, targetMinutes, alarm]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setSeconds(0);
    setRunning(false);
    setAlarm(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const presets = [1, 3, 5, 10, 15, 20, 30];

  return (
    <div className={`rounded-2xl border-2 p-6 ${alarm ? 'border-red-500 bg-red-50 animate-pulse' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-center gap-3 mb-4">
        <Timer className="w-7 h-7 text-teal-600" />
        <span className="text-xl font-bold text-slate-800">Timer</span>
      </div>

      {/* Time display */}
      <div className={`text-6xl font-mono font-bold text-center py-4 ${alarm ? 'text-red-600' : 'text-slate-900'}`}>
        {formatTime(seconds)}
      </div>

      {alarm && (
        <div className="text-center text-red-600 font-bold text-2xl mb-4 animate-bounce">
          TEMPS ECOULE !
        </div>
      )}

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {presets.map(m => (
          <button
            key={m}
            onClick={() => { setTargetMinutes(m); reset(); }}
            className={`px-4 py-3 rounded-xl text-lg font-semibold min-h-[60px] min-w-[60px] transition-colors
              ${targetMinutes === m ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {m} min
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => { setAlarm(false); setRunning(r => !r); }}
          className="flex items-center gap-2 px-8 py-4 rounded-xl text-xl font-bold min-h-[60px] transition-colors bg-teal-600 hover:bg-teal-500 text-white"
        >
          {running ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          {running ? 'Pause' : 'Lancer'}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-4 rounded-xl text-xl font-bold min-h-[60px] transition-colors bg-slate-200 hover:bg-slate-300 text-slate-700"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

// ── Recipe Detail Full-Screen View ─────────────────────────────────────
function RecipeFullScreen({ recipe, onBack }: { recipe: Recipe; onBack: () => void }) {
  const totalCost = recipe.ingredients.reduce((sum, ri) => {
    const converted = convertToBaseUnit(ri.quantity, ri.ingredient.unit, ri.ingredient.unit);
    return sum + converted * ri.ingredient.pricePerUnit * (1 + (ri.wastePercent || 0) / 100);
  }, 0);
  const costPerPortion = recipe.nbPortions > 0 ? totalCost / recipe.nbPortions : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b-2 border-slate-200 px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-3 px-6 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xl min-h-[60px] transition-colors"
        >
          <ArrowLeft className="w-7 h-7" />
          Retour
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Title */}
        <h1 className="text-4xl font-bold text-slate-900 mb-2">{recipe.name}</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-800 text-lg font-semibold">
            <ChefHat className="w-5 h-5" />
            {recipe.category}
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-lg font-semibold">
            <UtensilsCrossed className="w-5 h-5" />
            {recipe.nbPortions} portions
          </span>
          {recipe.prepTimeMinutes > 0 && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              Prep {recipe.prepTimeMinutes} min
            </span>
          )}
          {recipe.cookTimeMinutes > 0 && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-800 text-lg font-semibold">
              <Clock className="w-5 h-5" />
              Cuisson {recipe.cookTimeMinutes} min
            </span>
          )}
        </div>

        {recipe.description && (
          <p className="text-xl text-slate-600 mb-6 leading-relaxed">{recipe.description}</p>
        )}

        {/* Cost summary */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-5 mb-8">
          <div className="flex flex-wrap gap-8 text-xl">
            <div>
              <span className="text-teal-600 font-medium">Prix de vente :</span>{' '}
              <span className="font-bold text-slate-900">{recipe.sellingPrice.toFixed(2)} EUR</span>
            </div>
            <div>
              <span className="text-teal-600 font-medium">Food cost :</span>{' '}
              <span className="font-bold text-slate-900">{costPerPortion.toFixed(2)} EUR/portion</span>
            </div>
            {recipe.margin && (
              <div>
                <span className="text-teal-600 font-medium">Marge :</span>{' '}
                <span className={`font-bold ${recipe.margin.marginPercent >= 70 ? 'text-green-700' : recipe.margin.marginPercent >= 60 ? 'text-amber-700' : 'text-red-700'}`}>
                  {recipe.margin.marginPercent.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients table */}
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ingredients</h2>
        <div className="border-2 border-slate-200 rounded-2xl overflow-hidden mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="text-left px-5 py-4 text-xl font-bold text-slate-700">Ingredient</th>
                <th className="text-right px-5 py-4 text-xl font-bold text-slate-700">Quantite</th>
                <th className="text-right px-5 py-4 text-xl font-bold text-slate-700">Unite</th>
                <th className="text-right px-5 py-4 text-xl font-bold text-slate-700">Cout</th>
              </tr>
            </thead>
            <tbody>
              {recipe.ingredients.map((ri, idx) => {
                const cost = convertToBaseUnit(ri.quantity, ri.ingredient.unit, ri.ingredient.unit)
                  * ri.ingredient.pricePerUnit * (1 + (ri.wastePercent || 0) / 100);
                return (
                  <tr key={ri.id} className={`border-b border-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="px-5 py-4 text-xl font-semibold text-slate-900">{ri.ingredient.name}</td>
                    <td className="px-5 py-4 text-xl text-right text-slate-700 font-mono">{ri.quantity}</td>
                    <td className="px-5 py-4 text-xl text-right text-slate-600">{ri.ingredient.unit}</td>
                    <td className="px-5 py-4 text-xl text-right text-slate-700 font-mono">{cost.toFixed(2)} EUR</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-200">
                <td colSpan={3} className="px-5 py-4 text-xl font-bold text-slate-800">Total</td>
                <td className="px-5 py-4 text-xl text-right font-bold text-slate-900 font-mono">{totalCost.toFixed(2)} EUR</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Timer */}
        <KitchenTimer />
      </div>
    </div>
  );
}

// ── Main Kitchen Mode Page ─────────────────────────────────────────────
export default function KitchenMode() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = recipes.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const grouped = filtered.reduce<Record<string, Recipe[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  // If a recipe is selected, show full-screen detail
  if (selectedRecipe) {
    return <RecipeFullScreen recipe={selectedRecipe} onBack={() => setSelectedRecipe(null)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b-2 border-slate-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg min-h-[60px] transition-colors shrink-0"
          >
            <ArrowLeft className="w-6 h-6" />
            Retour
          </button>

          <div className="flex items-center gap-3 flex-1">
            <ChefHat className="w-8 h-8 text-teal-600 shrink-0" />
            <h1 className="text-2xl font-bold text-slate-900 hidden sm:block">Mode Cuisine</h1>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Chercher une recette..."
              className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-slate-200 text-xl text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none min-h-[60px]"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); searchRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xl text-slate-500">Chargement des recettes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <UtensilsCrossed className="w-16 h-16 text-slate-300" />
            <p className="text-2xl text-slate-500 font-medium">
              {search ? 'Aucune recette trouvee' : 'Aucune recette'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold text-lg min-h-[60px] hover:bg-teal-500 transition-colors"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          Object.entries(grouped).map(([category, catRecipes]) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-500" />
                {category}
                <span className="text-lg font-normal text-slate-400 ml-2">({catRecipes.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catRecipes.map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="text-left p-6 rounded-2xl border-2 border-slate-200 hover:border-teal-400 hover:shadow-lg bg-white transition-all min-h-[120px] active:scale-[0.98]"
                  >
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{recipe.name}</h3>
                    <div className="flex flex-wrap gap-3 text-lg text-slate-500">
                      <span className="flex items-center gap-1">
                        <UtensilsCrossed className="w-5 h-5" />
                        {recipe.nbPortions} port.
                      </span>
                      {(recipe.prepTimeMinutes > 0 || recipe.cookTimeMinutes > 0) && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-5 h-5" />
                          {(recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)} min
                        </span>
                      )}
                      {recipe.margin && (
                        <span className={`font-semibold ${recipe.margin.marginPercent >= 70 ? 'text-green-600' : recipe.margin.marginPercent >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                          {recipe.margin.marginPercent.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
