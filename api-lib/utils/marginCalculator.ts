/**
 * @file api-lib/utils/marginCalculator.ts
 * Pure margin-calculation logic extracted from api/index.ts.
 * Handles food-cost summation (with waste multiplier) + labour + margin %.
 */
import { getUnitDivisor } from './unitConversion';

export interface IngredientWithQty {
  quantity: number;
  wastePercent?: number;
  ingredient: {
    unit: string;
    pricePerUnit: number;
  };
}

export interface RecipeInput {
  ingredients: IngredientWithQty[];
  sellingPrice: number;
  nbPortions?: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  laborCostPerHour?: number;
}

export interface MarginResult {
  foodCost: number;
  foodCostPercent: number;
  costPerPortion: number;
  laborCostPerPortion: number;
  totalCostPerPortion: number;
  marginAmount: number;
  marginPercent: number;
  coefficient: number;
}

/**
 * Compute food-cost per ingredient.
 * - 'additive' strategy: multiplier = 1 + w/100  (20% waste => 1.20)
 * - 'yield'    strategy: multiplier = 1 / (1 - w/100)  (preserves the
 *   formula already in production: 20% waste yields 1.25 multiplier)
 */
export function computeFoodCost(
  ingredients: IngredientWithQty[],
  wasteMultiplierStrategy: 'additive' | 'yield' = 'additive'
): number {
  return ingredients.reduce((total, ri) => {
    const w = ri.wastePercent ?? 0;
    let multiplier: number;
    if (w <= 0) multiplier = 1;
    else if (wasteMultiplierStrategy === 'yield' && w < 100) multiplier = 1 / (1 - w / 100);
    else multiplier = 1 + w / 100;
    const divisor = getUnitDivisor(ri.ingredient.unit);
    return total + (ri.quantity / divisor) * ri.ingredient.pricePerUnit * multiplier;
  }, 0);
}

/**
 * Simple margin calculator (additive waste strategy: waste 20% => multiplier 1.20).
 * Used by tests + the public /api/public/food-cost endpoint.
 */
export function calculateMargin(
  ingredients: IngredientWithQty[],
  sellingPrice: number,
  wastePercent: number = 0
): MarginResult {
  const withWaste = ingredients.map((ri) => ({
    ...ri,
    wastePercent: ri.wastePercent ?? wastePercent,
  }));
  const foodCost = computeFoodCost(withWaste, 'additive');
  const foodCostPercent = sellingPrice > 0 ? (foodCost / sellingPrice) * 100 : 0;
  const marginAmount = sellingPrice - foodCost;
  const marginPercent = sellingPrice > 0 ? (marginAmount / sellingPrice) * 100 : 0;
  const coefficient = foodCost > 0 ? sellingPrice / foodCost : 0;
  return {
    foodCost: Math.round(foodCost * 100) / 100,
    foodCostPercent: Math.round(foodCostPercent * 10) / 10,
    costPerPortion: Math.round(foodCost * 100) / 100,
    laborCostPerPortion: 0,
    totalCostPerPortion: Math.round(foodCost * 100) / 100,
    marginAmount: Math.round(marginAmount * 100) / 100,
    marginPercent: Math.round(marginPercent * 10) / 10,
    coefficient: Math.round(coefficient * 100) / 100,
  };
}

/**
 * Full recipe margin calculator (yield-based waste strategy 1/(1-w)).
 * Mirrors the formula already used in api/index.ts to keep parity with
 * existing recipes — switching to additive would change every recipe number.
 */
export function calculateRecipeMargin(recipe: RecipeInput): MarginResult {
  const foodCost = computeFoodCost(recipe.ingredients, 'yield');
  const nbPortions = recipe.nbPortions && recipe.nbPortions > 0 ? recipe.nbPortions : 1;
  const costPerPortion = foodCost / nbPortions;
  const prepTime = recipe.prepTimeMinutes || 0;
  const cookTime = recipe.cookTimeMinutes || 0;
  const totalTimeHours = (prepTime + cookTime) / 60;
  const totalLaborCost = totalTimeHours * (recipe.laborCostPerHour || 0);
  const laborCostPerPortion = totalLaborCost / nbPortions;
  const totalCostPerPortion = costPerPortion + laborCostPerPortion;
  const marginAmount = recipe.sellingPrice - totalCostPerPortion;
  const marginPercent = recipe.sellingPrice > 0 ? (marginAmount / recipe.sellingPrice) * 100 : 0;
  const foodCostPercent = recipe.sellingPrice > 0 ? (costPerPortion / recipe.sellingPrice) * 100 : 0;
  const coefficient = totalCostPerPortion > 0 ? recipe.sellingPrice / totalCostPerPortion : 0;
  return {
    foodCost: Math.round(foodCost * 100) / 100,
    foodCostPercent: Math.round(foodCostPercent * 10) / 10,
    costPerPortion: Math.round(costPerPortion * 100) / 100,
    laborCostPerPortion: Math.round(laborCostPerPortion * 100) / 100,
    totalCostPerPortion: Math.round(totalCostPerPortion * 100) / 100,
    marginAmount: Math.round(marginAmount * 100) / 100,
    marginPercent: Math.round(marginPercent * 10) / 10,
    coefficient: Math.round(coefficient * 100) / 100,
  };
}
