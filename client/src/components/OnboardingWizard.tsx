import { formatCurrency } from '../utils/currency';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, X, Check, Plus, Trash2, Sparkles, ChefHat, BarChart3,
  UtensilsCrossed, Store, Flame, Pizza, Fish, HelpCircle, Target, TrendingDown,
  TrendingUp, Package, Loader2, Star,
} from 'lucide-react';
import { useRestaurant } from '../hooks/useRestaurant';
import { createIngredient, createRecipe } from '../services/api';
import { recipePacks } from '../data/recipeTemplates';
import type { RecipePack } from '../data/recipeTemplates';

// ── Constants ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'onboarding-completed';
const ONBOARDING_STATE_KEY = 'onboarding-state';
const TOTAL_STEPS = 6;

interface SuggestedIngredient {
  name: string;
  unit: string;
  pricePerUnit: number;
  category: string;
}

const SUGGESTED_INGREDIENTS: SuggestedIngredient[] = [
  { name: 'Poulet (filet)', unit: 'kg', pricePerUnit: 9.5, category: 'Viandes' },
  { name: 'Tomates', unit: 'kg', pricePerUnit: 2.8, category: 'Legumes' },
  { name: 'Huile d\'olive', unit: 'L', pricePerUnit: 8.5, category: 'Huiles & Matieres grasses' },
  { name: 'Oignons', unit: 'kg', pricePerUnit: 1.5, category: 'Legumes' },
  { name: 'Ail', unit: 'kg', pricePerUnit: 7.0, category: 'Legumes' },
];

const RESTAURANT_TYPES = [
  { value: 'brasserie', label: 'Brasserie', icon: UtensilsCrossed, emoji: '🍽️', desc: 'Cuisine traditionnelle, plats du jour' },
  { value: 'gastronomique', label: 'Gastronomique', icon: Star, emoji: '⭐', desc: 'Haute cuisine, produits nobles' },
  { value: 'fast-food', label: 'Burger', icon: Flame, emoji: '🍔', desc: 'Burgers, frites, fast casual' },
  { value: 'pizzeria', label: 'Pizzeria', icon: Pizza, emoji: '🍕', desc: 'Pizzas, antipasti, pasta' },
  { value: 'japonais', label: 'Japonais', icon: Fish, emoji: '🍣', desc: 'Sushi, ramen, bento' },
  { value: 'autre', label: 'Autre', icon: Store, emoji: '🍴', desc: 'Tout type de restauration' },
];

// Map restaurant type to recipe pack ID
const RESTAURANT_PACK_MAP: Record<string, string> = {
  'brasserie': 'brasserie-francaise',
  'fast-food': 'burger',
  'pizzeria': 'pizzeria',
};

const GOALS = [
  { value: 'reduce-costs', label: 'Reduire les couts', icon: TrendingDown, desc: 'Identifier les ingredients trop chers et trouver des alternatives' },
  { value: 'increase-margins', label: 'Augmenter les marges', icon: TrendingUp, desc: 'Optimiser vos prix de vente et votre food cost' },
  { value: 'manage-stock', label: 'Mieux gerer le stock', icon: Package, desc: 'Suivre votre inventaire et eviter le gaspillage' },
  { value: 'all', label: 'Tout !', icon: Sparkles, desc: 'Profitez de toutes les fonctionnalites' },
];

const AI_INGREDIENT_SUGGESTIONS: Record<string, SuggestedIngredient[]> = {
  brasserie: [
    { name: 'Entrecote', unit: 'kg', pricePerUnit: 28, category: 'Viandes' },
    { name: 'Pommes de terre', unit: 'kg', pricePerUnit: 1.2, category: 'Legumes' },
    { name: 'Beurre', unit: 'kg', pricePerUnit: 12, category: 'Produits laitiers' },
  ],
  gastronomique: [
    { name: 'Foie gras', unit: 'kg', pricePerUnit: 85, category: 'Viandes' },
    { name: 'Truffe noire', unit: 'kg', pricePerUnit: 800, category: 'Legumes' },
    { name: 'Homard', unit: 'kg', pricePerUnit: 45, category: 'Poissons & Fruits de mer' },
  ],
  'fast-food': [
    { name: 'Steak hache', unit: 'kg', pricePerUnit: 10, category: 'Viandes' },
    { name: 'Pain burger', unit: 'piece', pricePerUnit: 0.35, category: 'Feculents & Cereales' },
    { name: 'Cheddar', unit: 'kg', pricePerUnit: 9, category: 'Produits laitiers' },
  ],
  pizzeria: [
    { name: 'Mozzarella', unit: 'kg', pricePerUnit: 8, category: 'Produits laitiers' },
    { name: 'Pate a pizza', unit: 'kg', pricePerUnit: 2.5, category: 'Feculents & Cereales' },
    { name: 'Sauce tomate', unit: 'L', pricePerUnit: 3, category: 'Legumes' },
  ],
  japonais: [
    { name: 'Saumon frais', unit: 'kg', pricePerUnit: 25, category: 'Poissons & Fruits de mer' },
    { name: 'Riz a sushi', unit: 'kg', pricePerUnit: 4, category: 'Feculents & Cereales' },
    { name: 'Nori', unit: 'kg', pricePerUnit: 45, category: 'Autres' },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
export function isOnboardingCompleted(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function markOnboardingCompleted(): void {
  localStorage.setItem(STORAGE_KEY, 'true');
  // Update onboarding state
  const state = getOnboardingState();
  state.wizardCompleted = true;
  saveOnboardingState(state);
}

export interface OnboardingState {
  wizardCompleted: boolean;
  restaurantType: string;
  dishCount: number;
  goal: string;
  ingredientAdded: boolean;
  recipeCreated: boolean;
  stockConfigured: boolean;
  supplierAdded: boolean;
  menuCreated: boolean;
  invoiceScanned: boolean;
  tooltipsShown: Record<string, boolean>;
}

export function getOnboardingState(): OnboardingState {
  try {
    const stored = localStorage.getItem(ONBOARDING_STATE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    wizardCompleted: false,
    restaurantType: '',
    dishCount: 20,
    goal: '',
    ingredientAdded: false,
    recipeCreated: false,
    stockConfigured: false,
    supplierAdded: false,
    menuCreated: false,
    invoiceScanned: false,
    tooltipsShown: {},
  };
}

export function saveOnboardingState(state: OnboardingState): void {
  localStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify(state));
}

export function updateOnboardingStep(key: keyof OnboardingState, value: any): void {
  const state = getOnboardingState();
  (state as any)[key] = value;
  saveOnboardingState(state);
}

export function isAllOnboardingDone(): boolean {
  const s = getOnboardingState();
  return s.ingredientAdded && s.recipeCreated && s.stockConfigured && s.supplierAdded && s.menuCreated && s.invoiceScanned;
}

export function getCompletedSteps(): number {
  const s = getOnboardingState();
  let count = 0;
  if (s.wizardCompleted) count++;
  if (s.ingredientAdded) count++;
  if (s.recipeCreated) count++;
  if (s.stockConfigured) count++;
  if (s.supplierAdded) count++;
  if (s.menuCreated) count++;
  if (s.invoiceScanned) count++;
  return count;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const { selectedRestaurant, updateRestaurant } = useRestaurant();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [animating, setAnimating] = useState(false);

  // Step 1 — Restaurant type
  const [restaurantType, setRestaurantType] = useState('');

  // Step 2 — Dish count slider
  const [dishCount, setDishCount] = useState(20);

  // Step 3 — Goal
  const [goal, setGoal] = useState('');

  // Step 4 — Ingredients
  const [ingredients, setIngredients] = useState<SuggestedIngredient[]>(
    SUGGESTED_INGREDIENTS.slice(0, 3).map(i => ({ ...i }))
  );
  const [aiSuggestionsShown, setAiSuggestionsShown] = useState(false);
  const [ingredientNameInput, setIngredientNameInput] = useState('');
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const autoCompleteRef = useRef<HTMLDivElement>(null);

  // Step 5 — Recipe
  const [recipeName, setRecipeName] = useState('Poulet grille');
  const [recipeCategory, setRecipeCategory] = useState('Plat');
  const [recipePrice, setRecipePrice] = useState(18);
  const [selectedIngredientIndexes, setSelectedIngredientIndexes] = useState<number[]>([0, 1]);
  const [recipeQuantities, setRecipeQuantities] = useState<Record<number, number>>({ 0: 0.2, 1: 0.15 });

  // Step 6 — Results
  const [createdIngredientIds, setCreatedIngredientIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Celebration state
  const [showConfetti, setShowConfetti] = useState(false);

  // Recipe pack import state
  const [importingPack, setImportingPack] = useState(false);
  const [packImported, setPackImported] = useState(false);

  // Get the matching recipe pack for the restaurant type
  const matchingPack: RecipePack | undefined = useMemo(() => {
    const packId = RESTAURANT_PACK_MAP[restaurantType];
    if (!packId) return undefined;
    return recipePacks.find(p => p.id === packId);
  }, [restaurantType]);

  const handleImportPack = useCallback(async () => {
    if (!matchingPack || importingPack || packImported) return;
    setImportingPack(true);
    try {
      for (const packRecipe of matchingPack.recipes.slice(0, 5)) {
        // Create ingredients first
        const ingIds: number[] = [];
        for (const ing of packRecipe.ingredients) {
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
            ingIds.push(created.id);
          } catch {
            // Skip duplicates
          }
        }
        // Create recipe
        if (ingIds.length > 0) {
          const recipeIngredients = packRecipe.ingredients
            .map((ing, idx) => {
              const ingId = ingIds[idx];
              if (!ingId) return null;
              return { ingredientId: ingId, quantity: ing.quantity, wastePercent: ing.wastePercent };
            })
            .filter(Boolean) as { ingredientId: number; quantity: number; wastePercent: number }[];

          if (recipeIngredients.length > 0) {
            await createRecipe({
              name: packRecipe.name,
              category: packRecipe.category,
              sellingPrice: packRecipe.sellingPrice,
              nbPortions: packRecipe.nbPortions,
              ingredients: recipeIngredients,
            });
          }
        }
      }
      setPackImported(true);
      updateOnboardingStep('recipeCreated', true);
    } catch {
      // Continue even if some fail
    } finally {
      setImportingPack(false);
    }
  }, [matchingPack, importingPack, packImported]);

  // AI autocomplete suggestions for ingredient name
  const autoCompleteSuggestions = useMemo(() => {
    if (!ingredientNameInput || ingredientNameInput.length < 2) return [];
    const q = ingredientNameInput.toLowerCase();
    const allSuggestions = [
      ...SUGGESTED_INGREDIENTS,
      ...(AI_INGREDIENT_SUGGESTIONS[restaurantType] || []),
      { name: 'Sel', unit: 'kg', pricePerUnit: 0.8, category: 'Epices & Condiments' },
      { name: 'Poivre', unit: 'kg', pricePerUnit: 18, category: 'Epices & Condiments' },
      { name: 'Farine', unit: 'kg', pricePerUnit: 1.2, category: 'Feculents & Cereales' },
      { name: 'Sucre', unit: 'kg', pricePerUnit: 1.1, category: 'Autres' },
      { name: 'Creme fraiche', unit: 'L', pricePerUnit: 4.5, category: 'Produits laitiers' },
      { name: 'Parmesan', unit: 'kg', pricePerUnit: 22, category: 'Produits laitiers' },
      { name: 'Basilic frais', unit: 'kg', pricePerUnit: 25, category: 'Epices & Condiments' },
      { name: 'Citron', unit: 'kg', pricePerUnit: 3.5, category: 'Fruits' },
      { name: 'Carotte', unit: 'kg', pricePerUnit: 1.5, category: 'Legumes' },
      { name: 'Courgette', unit: 'kg', pricePerUnit: 2.2, category: 'Legumes' },
      { name: 'Aubergine', unit: 'kg', pricePerUnit: 3.5, category: 'Legumes' },
      { name: 'Poivron', unit: 'kg', pricePerUnit: 4, category: 'Legumes' },
      { name: 'Champignon', unit: 'kg', pricePerUnit: 6, category: 'Legumes' },
      { name: 'Saumon', unit: 'kg', pricePerUnit: 25, category: 'Poissons & Fruits de mer' },
      { name: 'Thon', unit: 'kg', pricePerUnit: 20, category: 'Poissons & Fruits de mer' },
      { name: 'Crevettes', unit: 'kg', pricePerUnit: 18, category: 'Poissons & Fruits de mer' },
    ];
    const existing = ingredients.map(i => i.name.toLowerCase());
    return allSuggestions
      .filter(s => s.name.toLowerCase().includes(q) && !existing.includes(s.name.toLowerCase()))
      .slice(0, 5);
  }, [ingredientNameInput, restaurantType, ingredients]);

  // Show AI suggestions based on restaurant type
  useEffect(() => {
    if (step === 3 && restaurantType && !aiSuggestionsShown) {
      const suggestions = AI_INGREDIENT_SUGGESTIONS[restaurantType];
      if (suggestions) {
        setAiSuggestionsShown(true);
      }
    }
  }, [step, restaurantType, aiSuggestionsShown]);

  // Close autocomplete on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (autoCompleteRef.current && !autoCompleteRef.current.contains(e.target as Node)) {
        setShowAutoComplete(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
          name: selectedRestaurant.name,
          cuisineType: restaurantType || undefined,
          coversPerDay: undefined,
        });
      }

      // Save onboarding state
      updateOnboardingStep('restaurantType', restaurantType);
      updateOnboardingStep('dishCount', dishCount);
      updateOnboardingStep('goal', goal);

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
      updateOnboardingStep('ingredientAdded', ids.length > 0);

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
          await createRecipe({
            name: recipeName,
            category: recipeCategory,
            sellingPrice: recipePrice,
            nbPortions: 1,
            ingredients: recipeIngredients,
          });
          updateOnboardingStep('recipeCreated', true);
        }
      }

      setSaved(true);
    } catch {
      // Continue even if save fails
    } finally {
      setSaving(false);
      goNext();
    }
  }, [saving, saved, goNext, selectedRestaurant, updateRestaurant, restaurantType, dishCount, goal, ingredients, selectedIngredientIndexes, recipeQuantities, recipeName, recipeCategory, recipePrice]);

  // Show confetti on step 5 (results)
  useEffect(() => {
    if (step === 5) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

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

  const addAutoCompleteIngredient = useCallback((suggestion: SuggestedIngredient) => {
    setIngredients(prev => [...prev, { ...suggestion }]);
    setIngredientNameInput('');
    setShowAutoComplete(false);
  }, []);

  // Step labels
  const stepLabels = [
    'Type de restaurant',
    'Votre carte',
    'Votre objectif',
    'Ingredients',
    'Premiere recette',
    'Fiche technique',
  ];

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
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: `${4 + Math.random() * 6}px`,
                height: `${4 + Math.random() * 6}px`,
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'][i % 8],
                animation: `confetti-fall ${2 + Math.random() * 3}s ease-in forwards`,
                animationDelay: `${Math.random() * 1.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-[220] w-full max-w-2xl mx-4 bg-white dark:bg-mono-50 rounded-3xl shadow-2xl border border-mono-900 dark:border-mono-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg text-sm font-medium border border-mono-900 dark:border-[#333333] text-[#6B7280] dark:text-mono-700 hover:text-mono-100 dark:hover:text-white hover:border-mono-100 dark:hover:border-white hover:bg-mono-950 dark:hover:bg-[#171717] transition-all flex items-center gap-1.5"
        >
          Passer <X className="w-3.5 h-3.5" />
        </button>

        {/* Progress bar */}
        <div className="h-1.5 bg-mono-950 dark:bg-[#171717] flex-shrink-0">
          <div
            className="h-full bg-mono-100 dark:bg-white transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 pt-5 pb-1 flex-shrink-0">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? 'bg-mono-100 dark:bg-white w-8'
                  : i < step
                    ? 'bg-mono-100 dark:bg-white w-2'
                    : 'bg-[#D1D5DB] dark:bg-[#333333] w-2'
              }`}
            />
          ))}
        </div>
        <div className="text-center pb-2 flex-shrink-0">
          <span className="text-xs font-medium text-[#9CA3AF] dark:text-mono-500">
            {step + 1}/{TOTAL_STEPS} — {stepLabels[step]}
          </span>
        </div>

        {/* Step content — scrollable */}
        <div className={`px-6 sm:px-8 pb-6 pt-3 transition-all duration-250 ease-out overflow-y-auto flex-1 ${slideClass}`}>

          {/* ── Step 1: Restaurant Type ─────────────────────────────── */}
          {step === 0 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl sm:text-6xl mb-3">👨‍🍳</div>
                <h2 className="text-xl sm:text-2xl font-bold text-mono-100 dark:text-white font-satoshi">
                  Bienvenue ! Quel type de restaurant avez-vous ?
                </h2>
                <p className="text-[#6B7280] dark:text-mono-700 mt-2 text-sm">
                  Nous adapterons RestauMargin a votre activite
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {RESTAURANT_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setRestaurantType(type.value)}
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all duration-200 group ${
                      restaurantType === type.value
                        ? 'border-mono-100 dark:border-white bg-mono-950 dark:bg-[#171717] scale-[1.02]'
                        : 'border-mono-900 dark:border-mono-200 hover:border-[#9CA3AF] dark:hover:border-[#555555] hover:bg-[#F9FAFB] dark:hover:bg-[#171717]/50'
                    }`}
                  >
                    <span className={`text-4xl transition-transform duration-200 ${
                      restaurantType === type.value ? 'scale-110' : 'group-hover:scale-105'
                    }`}>{type.emoji}</span>
                    <span className={`text-sm font-bold ${
                      restaurantType === type.value
                        ? 'text-mono-100 dark:text-white'
                        : 'text-[#6B7280] dark:text-mono-700'
                    }`}>
                      {type.label}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF] dark:text-mono-500 leading-tight text-center">
                      {type.desc}
                    </span>
                    {restaurantType === type.value && (
                      <div className="w-5 h-5 rounded-full bg-mono-100 dark:bg-white flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-white dark:text-mono-100" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Dish Count Slider ───────────────────────────── */}
          {step === 1 && (
            <div>
              <div className="text-center mb-8">
                <div className="text-5xl sm:text-6xl mb-3">📋</div>
                <h2 className="text-xl sm:text-2xl font-bold text-mono-100 dark:text-white font-satoshi">
                  Combien de plats avez-vous sur votre carte ?
                </h2>
                <p className="text-[#6B7280] dark:text-mono-700 mt-2 text-sm">
                  Cela nous aide a personnaliser votre experience
                </p>
              </div>

              <div className="max-w-md mx-auto">
                {/* Display value */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-mono-950 dark:bg-[#171717] border-2 border-mono-100 dark:border-white">
                    <span className="text-4xl font-bold text-mono-100 dark:text-white font-satoshi">{dishCount}</span>
                  </div>
                  <p className="text-sm text-[#6B7280] dark:text-mono-700 mt-2">plats</p>
                </div>

                {/* Slider */}
                <div className="px-4">
                  <input
                    type="range"
                    min={5}
                    max={100}
                    value={dishCount}
                    onChange={e => setDishCount(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-mono-900 dark:bg-[#333333] accent-mono-100 dark:accent-white slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-[#9CA3AF] dark:text-mono-500 mt-2">
                    <span>5</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Quick buttons */}
                <div className="flex gap-2 mt-6 justify-center flex-wrap">
                  {[10, 20, 30, 50, 75].map(v => (
                    <button
                      key={v}
                      onClick={() => setDishCount(v)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        dishCount === v
                          ? 'bg-mono-100 dark:bg-white text-white dark:text-mono-100'
                          : 'bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700 hover:bg-mono-900 dark:hover:bg-mono-200'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Goal ────────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl sm:text-6xl mb-3">🎯</div>
                <h2 className="text-xl sm:text-2xl font-bold text-mono-100 dark:text-white font-satoshi">
                  Quel est votre objectif principal ?
                </h2>
                <p className="text-[#6B7280] dark:text-mono-700 mt-2 text-sm">
                  Nous mettrons en avant les fonctionnalites adaptees
                </p>
              </div>

              <div className="space-y-3">
                {GOALS.map(g => {
                  const Icon = g.icon;
                  return (
                    <button
                      key={g.value}
                      onClick={() => setGoal(g.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        goal === g.value
                          ? 'border-mono-100 dark:border-white bg-mono-950 dark:bg-[#171717]'
                          : 'border-mono-900 dark:border-mono-200 hover:border-[#9CA3AF] dark:hover:border-[#555555]'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        goal === g.value
                          ? 'bg-mono-100 dark:bg-white'
                          : 'bg-mono-950 dark:bg-[#171717]'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          goal === g.value ? 'text-white dark:text-mono-100' : 'text-[#6B7280] dark:text-mono-700'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-bold ${
                          goal === g.value ? 'text-mono-100 dark:text-white' : 'text-[#6B7280] dark:text-mono-700'
                        }`}>
                          {g.label}
                        </h3>
                        <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mt-0.5">{g.desc}</p>
                      </div>
                      {goal === g.value && (
                        <div className="w-6 h-6 rounded-full bg-mono-100 dark:bg-white flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-white dark:text-mono-100" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 4: Add Ingredients ─────────────────────────────── */}
          {step === 3 && (
            <div>
              <div className="text-center mb-5">
                <div className="text-5xl sm:text-6xl mb-3">🧅</div>
                <h2 className="text-xl sm:text-2xl font-bold text-mono-100 dark:text-white font-satoshi">
                  Ajoutons votre premier ingredient
                </h2>
                <p className="text-[#6B7280] dark:text-mono-700 mt-2 text-sm">
                  Modifiez les prix selon vos fournisseurs, ou ajoutez les votres
                </p>
              </div>

              {/* AI suggestions banner */}
              {restaurantType && AI_INGREDIENT_SUGGESTIONS[restaurantType] && (
                <div className="mb-4 p-3 rounded-xl bg-[#F0F9FF] dark:bg-[#0C1426] border border-[#BAE6FD] dark:border-[#1E3A5F]">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8]" />
                    <span className="text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                      Suggestions IA pour un restaurant {RESTAURANT_TYPES.find(t => t.value === restaurantType)?.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {AI_INGREDIENT_SUGGESTIONS[restaurantType]
                      .filter(s => !ingredients.some(i => i.name === s.name))
                      .map(s => (
                        <button
                          key={s.name}
                          onClick={() => setIngredients(prev => [...prev, { ...s }])}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-mono-200 border border-[#BAE6FD] dark:border-[#1E3A5F] text-[#0284C7] dark:text-[#38BDF8] hover:bg-[#F0F9FF] dark:hover:bg-[#0C1426] transition-colors"
                        >
                          <Plus className="w-3 h-3" /> {s.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Ingredients list */}
              <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3 p-3 rounded-xl border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-[#171717]">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={e => {
                          const next = [...ingredients];
                          next[i] = { ...next[i], name: e.target.value };
                          setIngredients(next);
                        }}
                        className="w-full bg-transparent text-sm font-medium text-mono-100 dark:text-white focus:outline-none"
                      />
                      <div className="text-xs text-[#9CA3AF] dark:text-mono-500 mt-0.5">{ing.category}</div>
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
                        className="w-16 sm:w-20 text-right px-2 py-1 rounded-lg border border-mono-900 dark:border-[#333333] bg-white dark:bg-mono-50 text-sm text-mono-100 dark:text-white focus:outline-none focus:ring-1 focus:ring-mono-100 dark:focus:ring-white"
                      />
                      <span className="text-xs text-[#9CA3AF] dark:text-mono-500 w-6">/{ing.unit}</span>
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

              {/* Add ingredient with AI autocomplete */}
              <div className="mt-3 relative" ref={autoCompleteRef}>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={ingredientNameInput}
                      onChange={e => {
                        setIngredientNameInput(e.target.value);
                        setShowAutoComplete(e.target.value.length >= 2);
                      }}
                      onFocus={() => {
                        if (ingredientNameInput.length >= 2) setShowAutoComplete(true);
                      }}
                      placeholder="Ajouter un ingredient..."
                      className="w-full px-3 py-2 rounded-lg border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-[#171717] text-sm text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-500 focus:outline-none focus:ring-1 focus:ring-mono-100 dark:focus:ring-white"
                    />
                    {showAutoComplete && autoCompleteSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl shadow-xl z-10 py-1 max-h-48 overflow-y-auto">
                        <div className="px-3 py-1.5 text-[10px] font-semibold text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" /> Suggestions IA
                        </div>
                        {autoCompleteSuggestions.map(s => (
                          <button
                            key={s.name}
                            onClick={() => addAutoCompleteIngredient(s)}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors"
                          >
                            <div>
                              <span className="font-medium text-mono-100 dark:text-white">{s.name}</span>
                              <span className="text-xs text-[#9CA3AF] dark:text-mono-500 ml-2">{s.category}</span>
                            </div>
                            <span className="text-xs font-medium text-[#6B7280] dark:text-mono-700">
                              {formatCurrency(s.pricePerUnit)}/{s.unit}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (ingredientNameInput.trim()) {
                        setIngredients(prev => [...prev, { name: ingredientNameInput, unit: 'kg', pricePerUnit: 0, category: 'Autres' }]);
                        setIngredientNameInput('');
                        setShowAutoComplete(false);
                      }
                    }}
                    disabled={!ingredientNameInput.trim()}
                    className="px-3 py-2 rounded-lg bg-mono-100 dark:bg-white text-white dark:text-mono-100 text-sm font-medium disabled:opacity-30 hover:bg-[#333333] dark:hover:bg-mono-900 transition-colors flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: Create Recipe ───────────────────────────────── */}
          {step === 4 && (
            <div>
              <div className="text-center mb-5">
                <div className="text-5xl sm:text-6xl mb-3">🍳</div>
                <h2 className="text-xl sm:text-2xl font-bold text-mono-100 dark:text-white font-satoshi">
                  Creons votre premiere recette !
                </h2>
                <p className="text-[#6B7280] dark:text-mono-700 mt-2 text-sm">
                  Selectionnez des ingredients et fixez votre prix de vente
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#6B7280] dark:text-mono-700 mb-1">Nom</label>
                    <input
                      type="text"
                      value={recipeName}
                      onChange={e => setRecipeName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-[#171717] text-sm text-mono-100 dark:text-white focus:outline-none focus:ring-1 focus:ring-mono-100 dark:focus:ring-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B7280] dark:text-mono-700 mb-1">Categorie</label>
                    <select
                      value={recipeCategory}
                      onChange={e => setRecipeCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-[#171717] text-sm text-mono-100 dark:text-white focus:outline-none focus:ring-1 focus:ring-mono-100 dark:focus:ring-white"
                    >
                      {['Entree', 'Plat', 'Dessert', 'Boisson', 'Accompagnement'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7280] dark:text-mono-700 mb-1">Prix de vente (EUR)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={recipePrice}
                    onChange={e => setRecipePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-[#171717] text-sm text-mono-100 dark:text-white focus:outline-none focus:ring-1 focus:ring-mono-100 dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#6B7280] dark:text-mono-700 mb-2">Ingredients</label>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {ingredients.map((ing, idx) => {
                      const selected = selectedIngredientIndexes.includes(idx);
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                            selected
                              ? 'border-mono-100 dark:border-white bg-mono-950 dark:bg-[#171717]'
                              : 'border-mono-900 dark:border-mono-200 hover:border-[#9CA3AF] dark:hover:border-[#555555]'
                          }`}
                          onClick={() => toggleIngredient(idx)}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            selected
                              ? 'bg-mono-100 dark:bg-white border-mono-100 dark:border-white'
                              : 'border-[#D1D5DB] dark:border-[#555555]'
                          }`}>
                            {selected && <Check className="w-3 h-3 text-white dark:text-mono-100" />}
                          </div>
                          <span className="flex-1 text-sm text-mono-100 dark:text-white">{ing.name}</span>
                          {selected && (
                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                              <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={recipeQuantities[idx] || 0.1}
                                onChange={e => setRecipeQuantities(prev => ({ ...prev, [idx]: Number(e.target.value) }))}
                                className="w-16 text-right px-2 py-1 rounded-lg border border-mono-900 dark:border-[#333333] bg-white dark:bg-mono-50 text-xs text-mono-100 dark:text-white focus:outline-none"
                              />
                              <span className="text-xs text-[#9CA3AF] dark:text-mono-500">{ing.unit}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live preview */}
                <div className="p-3 rounded-xl bg-mono-950 dark:bg-[#171717] border border-mono-900 dark:border-mono-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280] dark:text-mono-700">Apercu food cost</span>
                    <span className="font-bold text-mono-100 dark:text-white">{formatCurrency(marginData.foodCost)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-[#6B7280] dark:text-mono-700">Marge estimee</span>
                    <span className={`font-bold ${marginData.margin >= 70 ? 'text-[#10B981]' : marginData.margin >= 60 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                      {marginData.margin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 6: Fiche Technique Results ────────────────────── */}
          {step === 5 && (
            <div className="text-center">
              <div className="text-5xl sm:text-6xl mb-3">🎉</div>
              <h2 className="text-xl sm:text-2xl font-bold text-mono-100 dark:text-white font-satoshi mb-2">
                Voila votre premiere fiche technique !
              </h2>
              <p className="text-[#6B7280] dark:text-mono-700 mb-6 text-sm">
                Resultat pour <strong className="text-mono-100 dark:text-white">{recipeName}</strong>
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="p-4 sm:p-5 rounded-2xl border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-[#171717]">
                  <div className="text-2xl sm:text-3xl font-bold text-mono-100 dark:text-white font-satoshi animate-counter">
                    {marginData.foodCost.toFixed(2)}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#9CA3AF] dark:text-mono-500 mt-1">Food Cost (EUR)</div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-mono-100 dark:border-white bg-mono-100 dark:bg-white">
                  <div className="text-2xl sm:text-3xl font-bold text-white dark:text-mono-100 font-satoshi animate-counter">
                    {marginData.margin.toFixed(1)}%
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#D1D5DB] dark:text-[#6B7280] mt-1">Marge Brute</div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-[#171717]">
                  <div className="text-2xl sm:text-3xl font-bold text-mono-100 dark:text-white font-satoshi animate-counter">
                    x{marginData.coefficient.toFixed(1)}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#9CA3AF] dark:text-mono-500 mt-1">Coefficient</div>
                </div>
              </div>

              {/* Ingredients breakdown */}
              <div className="p-4 rounded-xl bg-[#F9FAFB] dark:bg-[#171717] border border-mono-900 dark:border-mono-200 text-left mb-4">
                <h3 className="text-xs font-semibold text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider mb-2">Composition</h3>
                <div className="space-y-1.5">
                  {selectedIngredientIndexes.map(idx => {
                    const ing = ingredients[idx];
                    const qty = recipeQuantities[idx] || 0;
                    if (!ing) return null;
                    const cost = ing.pricePerUnit * qty;
                    return (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-mono-100 dark:text-white">{ing.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#9CA3AF] dark:text-mono-500">{qty} {ing.unit}</span>
                          <span className="font-medium text-mono-100 dark:text-white">{formatCurrency(cost)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Advice */}
              <div className="p-4 rounded-xl bg-mono-950 dark:bg-[#171717] border border-mono-900 dark:border-mono-200 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-mono-100 dark:bg-white flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-4 h-4 text-white dark:text-mono-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-mono-100 dark:text-white">
                      {marginData.margin >= 70
                        ? 'Excellente marge ! Votre recette est tres rentable.'
                        : marginData.margin >= 60
                          ? 'Bonne marge. Vous pouvez encore optimiser les quantites.'
                          : 'Marge a ameliorer. Ajustez le prix ou les quantites.'}
                    </p>
                    <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mt-1">
                      Objectif restauration : marge brute entre 65% et 75%
                    </p>
                  </div>
                </div>
              </div>

              {/* Recipe pack import suggestion */}
              {matchingPack && (
                <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-900/10 text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{matchingPack.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-mono-100 dark:text-white">
                        Importer le pack "{matchingPack.name}" ?
                      </p>
                      <p className="text-xs text-[#6B7280] dark:text-mono-700 mt-0.5">
                        {matchingPack.recipes.slice(0, 5).length} recettes pre-remplies avec ingredients et prix
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {matchingPack.recipes.slice(0, 5).map(r => (
                          <span key={r.name} className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-mono-200 border border-mono-900 dark:border-[#333333] text-[#6B7280] dark:text-mono-700">
                            {r.name}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={handleImportPack}
                        disabled={importingPack || packImported}
                        className={`mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          packImported
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                            : 'bg-mono-100 dark:bg-white text-white dark:text-mono-100 hover:bg-[#333333] dark:hover:bg-mono-900 disabled:opacity-50'
                        }`}
                      >
                        {packImported ? (
                          <><Check className="w-4 h-4" /> Pack importe !</>
                        ) : importingPack ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Import en cours...</>
                        ) : (
                          <><Sparkles className="w-4 h-4" /> Importer {matchingPack.recipes.slice(0, 5).length} recettes {matchingPack.name}</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex items-center justify-between flex-shrink-0 border-t border-mono-950 dark:border-mono-200 pt-4">
          <div>
            {step > 0 && (
              <button
                onClick={goPrev}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-[#6B7280] dark:text-mono-700 hover:text-mono-100 dark:hover:text-white hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Precedent
              </button>
            )}
          </div>

          <div>
            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={step === 4 ? handleSaveAndShowResults : goNext}
                disabled={saving}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-medium bg-mono-100 dark:bg-white text-white dark:text-mono-100 hover:bg-[#333333] dark:hover:bg-mono-900 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
                  </>
                ) : (
                  <>
                    Suivant <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-medium bg-mono-100 dark:bg-white text-white dark:text-mono-100 hover:bg-[#333333] dark:hover:bg-mono-900 transition-colors"
              >
                <ChefHat className="w-4 h-4" /> C'est parti !
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confetti + slider + counter animation keyframes */}
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
        input[type="range"].slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #111111;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .dark input[type="range"]::-webkit-slider-thumb {
          background: white;
          border: 3px solid #111111;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #111111;
          cursor: pointer;
          border: 3px solid white;
        }
        .dark input[type="range"]::-moz-range-thumb {
          background: white;
          border: 3px solid #111111;
        }
      `}</style>
    </div>
  );
}
