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
