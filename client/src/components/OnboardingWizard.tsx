import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, Check, Plus, Trash2, Sparkles, ChefHat, BarChart3 } from 'lucide-react';
import { useRestaurant } from '../hooks/useRestaurant';
import { createIngredient, createRecipe } from '../services/api';

// ── Constants ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'onboarding-completed';
const TOTAL_STEPS = 5;

const CUISINE_TYPES = [
  'Française', 'Italienne', 'Japonaise', 'Méditerranéenne', 'Bistronomique',
  'Fast-casual', 'Brasserie', 'Orientale', 'Asiatique', 'Mexicaine', 'Autre',
];

interface SuggestedIngredient {
  name: string;
  unit: string;
  pricePerUnit: number;
  category: string;
}

const SUGGESTED_INGREDIENTS: SuggestedIngredient[] = [
  { name: 'Poulet (filet)', unit: 'kg', pricePerUnit: 9.5, category: 'Viandes' },
  { name: 'Boeuf (entrecôte)', unit: 'kg', pricePerUnit: 28, category: 'Viandes' },
  { name: 'Tomates', unit: 'kg', pricePerUnit: 2.8, category: 'Légumes' },
  { name: 'Oignons', unit: 'kg', pricePerUnit: 1.5, category: 'Légumes' },
  { name: 'Huile d\'olive', unit: 'L', pricePerUnit: 8.5, category: 'Huiles & Matières grasses' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export function isOnboardingCompleted(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function markOnboardingCompleted(): void {
  localStorage.setItem(STORAGE_KEY, 'true');
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const { selectedRestaurant, updateRestaurant } = useRestaurant();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [animating, setAnimating] = useState(false);

  // Step 1 — Restaurant info
  const [restaurantName, setRestaurantName] = useState(selectedRestaurant?.name || '');
  const [cuisineType, setCuisineType] = useState(selectedRestaurant?.cuisineType || '');
  const [coversPerDay, setCoversPerDay] = useState(selectedRestaurant?.coversPerDay || 50);

  // Step 2 — Ingredients
  const [ingredients, setIngredients] = useState<SuggestedIngredient[]>(
    SUGGESTED_INGREDIENTS.map(i => ({ ...i }))
  );

  // Step 3 — Recipe
  const [recipeName, setRecipeName] = useState('Poulet grillé');
  const [recipeCategory, setRecipeCategory] = useState('Plat');
  const [recipePrice, setRecipePrice] = useState(18);
  const [selectedIngredientIndexes, setSelectedIngredientIndexes] = useState<number[]>([0, 2, 3]);
  const [recipeQuantities, setRecipeQuantities] = useState<Record<number, number>>({ 0: 0.2, 2: 0.15, 3: 0.05 });

  // Step 4 — Computed results
  const [createdIngredientIds, setCreatedIngredientIds] = useState<number[]>([]);
  const [createdRecipeId, setCreatedRecipeId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Step 5 — AI demo
  const [aiDemoStep, setAiDemoStep] = useState(0);

  // Celebration state
  const [showConfetti, setShowConfetti] = useState(false);

  // ── Computed margin ─────────────────────────────────────────────────────
  const marginData = useMemo(() => {
    let foodCost = 0;
    selectedIngredientIndexes.forEach(idx => {
      const ing = ingredients[idx];
      const qty = recipeQuantities[idx] || 0;
      if (ing) foodCost += ing.pricePerUnit * qty;
    });
    const margin = recipePrice > 0 ? ((recipePrice - foodCost) / recipePrice) * 100 : 0;
    const coefficient = foodCost > 0 ? recipePrice / foodCost : 0;
    return { foodCost, margin, coefficient };
  }, [ingredients, selectedIngredientIndexes, recipeQuantities, recipePrice]);

  // ── Step navigation ─────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    if (step >= TOTAL_STEPS - 1) return;
    setDirection('next');
    setAnimating(true);
    setTimeout(() => {
      setStep(s => s + 1);
      setAnimating(false);
    }, 250);
  }, [step]);

  const goPrev = useCallback(() => {
    if (step <= 0) return;
    setDirection('prev');
    setAnimating(true);
    setTimeout(() => {
      setStep(s => s - 1);
      setAnimating(false);
    }, 250);
  }, [step]);

  const handleSkip = useCallback(() => {
    markOnboardingCompleted();
    onComplete();
  }, [onComplete]);

  // ── Save data before showing results ────────────────────────────────────
  const handleSaveAndShowResults = useCallback(async () => {
    if (saving || saved) { goNext(); return; }
    setSaving(true);
    try {
      // Update restaurant
      if (selectedRestaurant) {
        await updateRestaurant(selectedRestaurant.id, {
          name: restaurantName || selectedRestaurant.name,
          cuisineType: cuisineType || undefined,
          coversPerDay: coversPerDay || undefined,
        });
      }

      // Create ingredients
      const ids: number[] = [];
      for (const ing of ingredients) {
        try {
          const created = await createIngredient({
            name: ing.name,
            unit: ing.unit,
            pricePerUnit: ing.pricePerUnit,
            category: ing.category,
            supplier: null,
            supplierId: null,
            allergens: [],
          });
          ids.push(created.id);
        } catch {
          // Skip duplicates silently
        }
      }
      setCreatedIngredientIds(ids);

      // Create recipe if we have ingredients
      if (ids.length > 0) {
        const recipeIngredients = selectedIngredientIndexes
          .map(idx => {
            const ingId = ids[idx];
            if (!ingId) return null;
            return { ingredientId: ingId, quantity: recipeQuantities[idx] || 0.1, wastePercent: 0 };
          })
          .filter(Boolean) as { ingredientId: number; quantity: number; wastePercent: number }[];

        if (recipeIngredients.length > 0) {
          const recipe = await createRecipe({
            name: recipeName,
            category: recipeCategory,
            sellingPrice: recipePrice,
            nbPortions: 1,
            ingredients: recipeIngredients,
          });
          setCreatedRecipeId(recipe.id);
        }
      }

      setSaved(true);
    } catch {
      // Continue even if save fails — onboarding shouldn't block
    } finally {
      setSaving(false);
      goNext();
    }
  }, [saving, saved, goNext, selectedRestaurant, updateRestaurant, restaurantName, cuisineType, coversPerDay, ingredients, selectedIngredientIndexes, recipeQuantities, recipeName, recipeCategory, recipePrice]);

  // Show confetti on step 4
  useEffect(() => {
    if (step === 3) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // AI demo auto-advance
  useEffect(() => {
    if (step === 4 && aiDemoStep < 3) {
      const timer = setTimeout(() => setAiDemoStep(s => s + 1), 1200);
      return () => clearTimeout(timer);
    }
  }, [step, aiDemoStep]);

  const handleFinish = useCallback(() => {
    markOnboardingCompleted();
    onComplete();
  }, [onComplete]);

  // ── Toggle ingredient in recipe ─────────────────────────────────────────
  const toggleIngredient = useCallback((idx: number) => {
    setSelectedIngredientIndexes(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx);
      return [...prev, idx];
    });
    setRecipeQuantities(prev => {
      if (!prev[idx]) return { ...prev, [idx]: 0.1 };
      return prev;
    });
  }, []);

  // ── Render steps ────────────────────────────────────────────────────────
  const slideClass = animating
    ? direction === 'next' ? 'opacity-0 translate-x-8' : 'opacity-0 -translate-x-8'
    : 'opacity-100 translate-x-0';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/80 dark:bg-black/90 backdrop-blur-xl" />

      {/* Confetti (CSS-only) */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[210]">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][i % 6],
                animation: `confetti-fall ${2 + Math.random() * 2}s ease-in forwards`,
                animationDelay: `${Math.random() * 1}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-[220] w-full max-w-2xl mx-4 bg-white dark:bg-[#0A0A0A] rounded-3xl shadow-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-5 right-5 z-10 text-sm text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white transition-colors flex items-center gap-1"
        >
          Passer <X className="w-4 h-4" />
        </button>

        {/* Progress bar */}
        <div className="h-1.5 bg-[#F3F4F6] dark:bg-[#171717]">
          <div
            className="h-full bg-[#111111] dark:bg-white transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 pt-6 pb-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? 'bg-[#111111] dark:bg-white w-6'
                  : i < step
                    ? 'bg-[#111111] dark:bg-white'
                    : 'bg-[#D1D5DB] dark:bg-[#333333]'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className={`px-8 pb-8 pt-4 transition-all duration-250 ease-out ${slideClass}`}>
          {/* ── Step 1: Welcome ──────────────────────────────────────── */}
          {step === 0 && (
            <div>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">👨‍🍳</div>
                <h2 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">
                  Bienvenue sur RestauMargin
                </h2>
                <p className="text-[#6B7280] dark:text-[#A3A3A3] mt-2">
                  Configurons votre restaurant en quelques minutes
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#111111] dark:text-white mb-1.5">
                    Nom de votre restaurant
                  </label>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={e => setRestaurantName(e.target.value)}
                    placeholder="Chez Marcel"
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-[#171717] text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#111111] dark:focus:ring-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111111] dark:text-white mb-1.5">
                    Type de cuisine
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CUISINE_TYPES.map(c => (
                      <button
                        key={c}
                        onClick={() => setCuisineType(c)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          cuisineType === c
                            ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white'
                            : 'bg-white dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#111111] dark:hover:border-white'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111111] dark:text-white mb-1.5">
                    Couverts par jour (moyenne)
                  </label>
                  <input
                    type="number"
                    value={coversPerDay}
                    onChange={e => setCoversPerDay(Number(e.target.value))}
                    min={1}
                    max={1000}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-[#171717] text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#111111] dark:focus:ring-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Ingredients ──────────────────────────────────── */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🧅</div>
                <h2 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">
                  Ajoutez vos premiers ingredients
                </h2>
                <p className="text-[#6B7280] dark:text-[#A3A3A3] mt-2">
                  Modifiez les prix selon vos fournisseurs
                </p>
              </div>

              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-[#171717]">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={e => {
                          const next = [...ingredients];
                          next[i] = { ...next[i], name: e.target.value };
                          setIngredients(next);
                        }}
                        className="w-full bg-transparent text-sm font-medium text-[#111111] dark:text-white focus:outline-none"
                      />
                      <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">{ing.category}</div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={ing.pricePerUnit}
                        onChange={e => {
                          const next = [...ingredients];
                          next[i] = { ...next[i], pricePerUnit: Number(e.target.value) };
                          setIngredients(next);
                        }}
                        className="w-20 text-right px-2 py-1 rounded-lg border border-[#E5E7EB] dark:border-[#333333] bg-white dark:bg-[#0A0A0A] text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#111111] dark:focus:ring-white"
                      />
                      <span className="text-xs text-[#9CA3AF] dark:text-[#737373] w-6">/{ing.unit}</span>
                    </div>
                    {ingredients.length > 1 && (
                      <button
                        onClick={() => setIngredients(prev => prev.filter((_, j) => j !== i))}
                        className="text-[#D1D5DB] dark:text-[#555555] hover:text-[#EF4444] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIngredients(prev => [...prev, { name: '', unit: 'kg', pricePerUnit: 0, category: 'Autres' }])}
                className="mt-3 flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" /> Ajouter un ingredient
              </button>
            </div>
          )}

          {/* ── Step 3: Recipe ───────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">📋</div>
                <h2 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">
                  Creez votre premiere recette
                </h2>
                <p className="text-[#6B7280] dark:text-[#A3A3A3] mt-2">
                  Selectionnez des ingredients et fixez votre prix de vente
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">Nom</label>
                    <input
                      type="text"
                      value={recipeName}
                      onChange={e => setRecipeName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-[#171717] text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#111111] dark:focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">Categorie</label>
                    <select
                      value={recipeCategory}
                      onChange={e => setRecipeCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-[#171717] text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#111111] dark:focus:ring-white"
                    >
                      {['Entree', 'Plat', 'Dessert', 'Boisson', 'Accompagnement'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">Prix de vente (EUR)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={recipePrice}
                    onChange={e => setRecipePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-[#171717] text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#111111] dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-2">Ingredients</label>
                  <div className="space-y-2">
                    {ingredients.map((ing, idx) => {
                      const selected = selectedIngredientIndexes.includes(idx);
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                            selected
                              ? 'border-[#111111] dark:border-white bg-[#F3F4F6] dark:bg-[#171717]'
                              : 'border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#9CA3AF] dark:hover:border-[#555555]'
                          }`}
                          onClick={() => toggleIngredient(idx)}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            selected
                              ? 'bg-[#111111] dark:bg-white border-[#111111] dark:border-white'
                              : 'border-[#D1D5DB] dark:border-[#555555]'
                          }`}>
                            {selected && <Check className="w-3 h-3 text-white dark:text-[#111111]" />}
                          </div>
                          <span className="flex-1 text-sm text-[#111111] dark:text-white">{ing.name}</span>
                          {selected && (
                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                              <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={recipeQuantities[idx] || 0.1}
                                onChange={e => setRecipeQuantities(prev => ({ ...prev, [idx]: Number(e.target.value) }))}
                                className="w-16 text-right px-2 py-1 rounded-lg border border-[#E5E7EB] dark:border-[#333333] bg-white dark:bg-[#0A0A0A] text-xs text-[#111111] dark:text-white focus:outline-none"
                              />
                              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{ing.unit}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live preview */}
                <div className="p-3 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280] dark:text-[#A3A3A3]">Apercu food cost</span>
                    <span className="font-bold text-[#111111] dark:text-white">{marginData.foodCost.toFixed(2)} EUR</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-[#6B7280] dark:text-[#A3A3A3]">Marge estimee</span>
                    <span className={`font-bold ${marginData.margin >= 70 ? 'text-[#10B981]' : marginData.margin >= 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                      {marginData.margin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Results ──────────────────────────────────────── */}
          {step === 3 && (
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi mb-2">
                Votre marge est calculee !
              </h2>
              <p className="text-[#6B7280] dark:text-[#A3A3A3] mb-8">
                Voici le resultat pour <strong className="text-[#111111] dark:text-white">{recipeName}</strong>
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* Food cost */}
                <div className="p-5 rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-[#171717]">
                  <div className="text-3xl font-bold text-[#111111] dark:text-white font-satoshi animate-counter">
                    {marginData.foodCost.toFixed(2)} EUR
                  </div>
                  <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Food Cost</div>
                </div>

                {/* Margin */}
                <div className="p-5 rounded-2xl border-2 border-[#111111] dark:border-white bg-[#111111] dark:bg-white">
                  <div className="text-3xl font-bold text-white dark:text-[#111111] font-satoshi animate-counter">
                    {marginData.margin.toFixed(1)}%
                  </div>
                  <div className="text-xs text-[#D1D5DB] dark:text-[#6B7280] mt-1">Marge Brute</div>
                </div>

                {/* Coefficient */}
                <div className="p-5 rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-[#171717]">
                  <div className="text-3xl font-bold text-[#111111] dark:text-white font-satoshi animate-counter">
                    x{marginData.coefficient.toFixed(1)}
                  </div>
                  <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Coefficient</div>
                </div>
              </div>

              {/* Advice */}
              <div className="p-4 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A] text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#111111] dark:bg-white flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-4 h-4 text-white dark:text-[#111111]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#111111] dark:text-white">
                      {marginData.margin >= 70
                        ? 'Excellente marge ! Votre recette est tres rentable.'
                        : marginData.margin >= 60
                          ? 'Bonne marge. Vous pouvez encore optimiser les quantites.'
                          : 'Marge a ameliorer. Ajustez le prix de vente ou les quantites.'}
                    </p>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
                      Objectif restauration : marge brute entre 65% et 75%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: AI Demo ──────────────────────────────────────── */}
          {step === 4 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">
                  Decouvrez l'IA RestauMargin
                </h2>
                <p className="text-[#6B7280] dark:text-[#A3A3A3] mt-2">
                  Votre assistant intelligent pour optimiser vos marges
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { icon: '💡', title: 'Suggestions de recettes', desc: 'L\'IA genere des recettes rentables a partir de vos ingredients', delay: 0 },
                  { icon: '📈', title: 'Optimisation des marges', desc: 'Analysez vos recettes et trouvez ou economiser sans perdre en qualite', delay: 1 },
                  { icon: '🎤', title: 'Commande vocale', desc: 'Dictez vos recettes et ingredients, l\'IA comprend le langage naturel', delay: 2 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-500 ${
                      aiDemoStep > i
                        ? 'border-[#111111] dark:border-white bg-[#F9FAFB] dark:bg-[#171717] opacity-100 translate-y-0'
                        : 'border-[#E5E7EB] dark:border-[#1A1A1A] opacity-40 translate-y-2'
                    }`}
                  >
                    <div className="text-2xl flex-shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="text-sm font-bold text-[#111111] dark:text-white">{item.title}</h3>
                      <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111]">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Essayez maintenant</p>
                    <p className="text-xs opacity-70 mt-0.5">Cliquez sur le bouton assistant en bas a droite de l'ecran</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="px-8 pb-8 flex items-center justify-between">
          <div>
            {step > 0 && (
              <button
                onClick={goPrev}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Precedent
              </button>
            )}
          </div>

          <div>
            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={step === 2 ? handleSaveAndShowResults : goNext}
                disabled={saving}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#333333] dark:hover:bg-[#E5E7EB] transition-colors disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Suivant'} {!saving && <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#333333] dark:hover:bg-[#E5E7EB] transition-colors"
              >
                <ChefHat className="w-4 h-4" /> C'est parti !
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confetti animation keyframes */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-counter {
          animation: counter-pop 0.6s ease-out;
        }
        @keyframes counter-pop {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
