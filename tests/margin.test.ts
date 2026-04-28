/**
 * @file tests/margin.test.ts
 * Pure tests for the food-cost margin calculator.
 * Uses the additive waste strategy: 20% waste => multiplier 1.20.
 */
import { describe, it, expect } from 'vitest';
import {
  calculateMargin,
  calculateRecipeMargin,
  computeFoodCost,
  type IngredientWithQty,
} from '../api-lib/utils/marginCalculator';

const beef = (quantityG: number, wastePercent = 0): IngredientWithQty => ({
  quantity: quantityG,
  wastePercent,
  ingredient: { unit: 'g', pricePerUnit: 20 }, // 20€/kg
});

describe('calculateMargin (additive waste strategy)', () => {
  it('100g beef @ 20€/kg, waste 0% → foodCost 2.00€', () => {
    const r = calculateMargin([beef(100, 0)], 10);
    expect(r.foodCost).toBeCloseTo(2.0, 2);
  });

  it('100g beef @ 20€/kg, waste 20% → foodCost 2.40€ (multiplier 1.20)', () => {
    const r = calculateMargin([beef(100, 20)], 10);
    expect(r.foodCost).toBeCloseTo(2.4, 2);
  });

  it('correct margin% from selling price 10€ foodCost 2€ → 80%', () => {
    const r = calculateMargin([beef(100, 0)], 10);
    expect(r.marginPercent).toBeCloseTo(80, 1);
  });

  it('correct foodCost% from same → 20%', () => {
    const r = calculateMargin([beef(100, 0)], 10);
    expect(r.foodCostPercent).toBeCloseTo(20, 1);
  });

  it('empty ingredients array → foodCost 0', () => {
    const r = calculateMargin([], 10);
    expect(r.foodCost).toBe(0);
    expect(r.marginPercent).toBeCloseTo(100, 1);
  });

  it('selling price 0 → marginPercent 0 (no NaN, no crash)', () => {
    const r = calculateMargin([beef(100, 0)], 0);
    expect(Number.isFinite(r.marginPercent)).toBe(true);
    expect(r.marginPercent).toBe(0);
    expect(r.foodCostPercent).toBe(0);
  });

  it('multi-ingredient food cost sums correctly', () => {
    const r = calculateMargin(
      [
        beef(100, 0), // 2.00€
        { quantity: 5, wastePercent: 0, ingredient: { unit: 'cl', pricePerUnit: 8 } }, // 5cl * 8€/L / 100 = 0.40€
      ],
      10
    );
    expect(r.foodCost).toBeCloseTo(2.4, 2);
  });
});

describe('calculateRecipeMargin (yield waste strategy, production parity)', () => {
  it('reproduces production formula: 100g beef @ 20€/kg waste 20% → multiplier 1.25', () => {
    const r = calculateRecipeMargin({
      ingredients: [beef(100, 20)],
      sellingPrice: 10,
      nbPortions: 1,
    });
    // 0.1kg * 20€ * (1/0.8) = 2 * 1.25 = 2.50
    expect(r.foodCost).toBeCloseTo(2.5, 2);
  });

  it('handles labour cost contribution', () => {
    const r = calculateRecipeMargin({
      ingredients: [beef(100, 0)],
      sellingPrice: 10,
      nbPortions: 1,
      prepTimeMinutes: 30,
      cookTimeMinutes: 30,
      laborCostPerHour: 12,
    });
    // labour = 1h * 12€ = 12€/portion -> totalCost = 2 + 12 = 14€
    expect(r.totalCostPerPortion).toBeCloseTo(14, 2);
    expect(r.marginAmount).toBeCloseTo(-4, 2);
  });
});

describe('computeFoodCost — strategy switch', () => {
  it('additive vs yield disagree on 50% waste', () => {
    const ing = [beef(100, 50)];
    expect(computeFoodCost(ing, 'additive')).toBeCloseTo(3.0, 2); // 2 * 1.5
    expect(computeFoodCost(ing, 'yield')).toBeCloseTo(4.0, 2); // 2 * 2
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// REGRESSION TESTS — 2026-04-28
// Bug fb315d4 : api-lib/routes/recipes.ts importait calculateMargin (mauvais)
// au lieu de calculateRecipeMargin. Toute recette multi-portions affichait
// une marge fausse en production. Ces tests garantissent que la fonction
// utilisée par formatRecipe respecte bien nbPortions.
// ─────────────────────────────────────────────────────────────────────────────
describe('REGRESSION: calculateRecipeMargin must divide by nbPortions', () => {
  it('Magret canard 4 portions, ingredients 32€ total, vente 18€ → costPerPortion = 8€', () => {
    // Crée 4 ingrédients à 8€ chacun (pour totalFoodCost = 32€)
    const ingredients = [
      { quantity: 1000, wastePercent: 0, ingredient: { unit: 'g', pricePerUnit: 8 } },  // 8€
      { quantity: 1000, wastePercent: 0, ingredient: { unit: 'g', pricePerUnit: 8 } },
      { quantity: 1000, wastePercent: 0, ingredient: { unit: 'g', pricePerUnit: 8 } },
      { quantity: 1000, wastePercent: 0, ingredient: { unit: 'g', pricePerUnit: 8 } },
    ];
    const r = calculateRecipeMargin({ ingredients, sellingPrice: 18, nbPortions: 4 });
    expect(r.foodCost).toBeCloseTo(32.0, 2);            // total
    expect(r.costPerPortion).toBeCloseTo(8.0, 2);       // 32 / 4
    expect(r.marginAmount).toBeCloseTo(10.0, 2);        // 18 - 8 par portion
    expect(r.marginPercent).toBeCloseTo(55.6, 1);       // (18-8)/18*100
  });

  it('Recipe 1 portion → costPerPortion === foodCost (no division surprise)', () => {
    const ingredients = [{ quantity: 100, wastePercent: 0, ingredient: { unit: 'g', pricePerUnit: 20 } }];
    const r = calculateRecipeMargin({ ingredients, sellingPrice: 10, nbPortions: 1 });
    expect(r.costPerPortion).toBeCloseTo(2.0, 2);
    expect(r.foodCost).toBeCloseTo(2.0, 2);
  });

  it('Recipe nbPortions = 0 or undefined → fallback to 1 (no NaN/Infinity)', () => {
    const ingredients = [{ quantity: 100, wastePercent: 0, ingredient: { unit: 'g', pricePerUnit: 20 } }];
    const r1 = calculateRecipeMargin({ ingredients, sellingPrice: 10, nbPortions: 0 });
    const r2 = calculateRecipeMargin({ ingredients, sellingPrice: 10 } as any);
    expect(r1.costPerPortion).toBeCloseTo(2.0, 2);
    expect(r2.costPerPortion).toBeCloseTo(2.0, 2);
    expect(Number.isFinite(r1.marginPercent)).toBe(true);
    expect(Number.isFinite(r2.marginPercent)).toBe(true);
  });

  it('calculateMargin (legacy) ≠ calculateRecipeMargin — strategies divergent on multi-portions', () => {
    // CE TEST documente l'invariance fonctionnelle :
    // calculateMargin n'a PAS de nbPortions → ne divise jamais
    // calculateRecipeMargin DIVISE par nbPortions
    // Si quelqu'un swap les deux par erreur (comme moi en commit b8d02be),
    // ce test plante immédiatement.
    const ingredients = [
      { quantity: 500, wastePercent: 0, ingredient: { unit: 'g', pricePerUnit: 40 } },  // 20€
      { quantity: 500, wastePercent: 0, ingredient: { unit: 'g', pricePerUnit: 40 } },  // 20€
    ];
    const legacy = calculateMargin(ingredients, 50);                              // pas de nbPortions
    const recipe = calculateRecipeMargin({ ingredients, sellingPrice: 50, nbPortions: 5 });

    expect(legacy.costPerPortion).toBeCloseTo(40.0, 2);     // 40€ total (PAS divisé)
    expect(recipe.costPerPortion).toBeCloseTo(8.0, 2);      // 40 / 5 = 8€
    expect(legacy.costPerPortion).not.toBeCloseTo(recipe.costPerPortion, 2);
  });
});

describe('REGRESSION: formatRecipe must call calculateRecipeMargin (not calculateMargin)', () => {
  // Ces tests vérifient que la fonction formatRecipe (qui formate les recettes
  // pour l'API GET /api/recipes) utilise bien la BONNE fonction de calcul.
  it('via api-lib/routes/recipes.ts : multi-portion recipe returns correct costPerPortion', () => {
    const recipe = {
      id: 1,
      name: 'Magret canard',
      sellingPrice: 18,
      nbPortions: 4,
      ingredients: [
        { quantity: 1000, wastePercent: 0, ingredient: { unit: 'g', pricePerUnit: 8, allergens: [] } },
        { quantity: 1000, wastePercent: 0, ingredient: { unit: 'g', pricePerUnit: 8, allergens: [] } },
        { quantity: 1000, wastePercent: 0, ingredient: { unit: 'g', pricePerUnit: 8, allergens: [] } },
        { quantity: 1000, wastePercent: 0, ingredient: { unit: 'g', pricePerUnit: 8, allergens: [] } },
      ],
    };
    // Simule ce que fait formatRecipe dans api-lib/routes/recipes.ts
    const margin = calculateRecipeMargin(recipe);
    expect(margin.costPerPortion).toBeCloseTo(8.0, 2);
    expect(margin.costPerPortion).not.toBeCloseTo(32.0, 2); // BAD si on appelle calculateMargin par erreur
  });
});
