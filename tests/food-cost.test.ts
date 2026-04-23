/**
 * @file tests/food-cost.test.ts
 * Critical test: food cost calculation logic and unit conversion
 * Pure unit tests — no DB, no network.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';

// Set JWT_SECRET before any module that reads it at import time
beforeAll(() => {
  process.env['JWT_SECRET'] = 'test-secret-32-chars-minimum-ok!';
});

// Stub PrismaClient as a class (middleware.ts calls new PrismaClient())
vi.mock('@prisma/client', () => {
  class PrismaClient {
    restaurantMember = { findFirst: vi.fn() };
    auditLog = { create: vi.fn() };
  }
  return { PrismaClient };
});

describe('getUnitDivisor — converts ingredient quantities to bulk unit', () => {
  it('returns 1000 for grams (price stored per kg)', async () => {
    const { getUnitDivisor } = await import('../api/utils/unitConversion');
    expect(getUnitDivisor('g')).toBe(1000);
  });

  it('returns 1 for kg', async () => {
    const { getUnitDivisor } = await import('../api/utils/unitConversion');
    expect(getUnitDivisor('kg')).toBe(1);
  });

  it('returns 100 for cl (price stored per L)', async () => {
    const { getUnitDivisor } = await import('../api/utils/unitConversion');
    expect(getUnitDivisor('cl')).toBe(100);
  });

  it('returns 1000 for ml', async () => {
    const { getUnitDivisor } = await import('../api/utils/unitConversion');
    expect(getUnitDivisor('ml')).toBe(1000);
  });

  it('returns 10 for dl', async () => {
    const { getUnitDivisor } = await import('../api/utils/unitConversion');
    expect(getUnitDivisor('dl')).toBe(10);
  });

  it('returns 1 for pieces (pièce)', async () => {
    const { getUnitDivisor } = await import('../api/utils/unitConversion');
    expect(getUnitDivisor('pièce')).toBe(1);
  });

  it('returns 1 for L', async () => {
    const { getUnitDivisor } = await import('../api/utils/unitConversion');
    expect(getUnitDivisor('L')).toBe(1);
  });

  it('returns 1 for unknown unit (safe default)', async () => {
    const { getUnitDivisor } = await import('../api/utils/unitConversion');
    expect(getUnitDivisor('unknown')).toBe(1);
    expect(getUnitDivisor('')).toBe(1);
  });

  it('handles case insensitivity', async () => {
    const { getUnitDivisor } = await import('../api/utils/unitConversion');
    expect(getUnitDivisor('G')).toBe(1000);
    expect(getUnitDivisor('CL')).toBe(100);
  });
});

describe('Food cost calculation formula', () => {
  it('calculates ingredient cost for beef at 15e/kg, 200g portion', async () => {
    const { getUnitDivisor } = await import('../api/utils/unitConversion');
    const cost = (200 * 15) / getUnitDivisor('g');
    expect(cost).toBeCloseTo(3.0, 2);
  });

  it('calculates ingredient cost for olive oil at 8e/L, 5cl portion', async () => {
    const { getUnitDivisor } = await import('../api/utils/unitConversion');
    const cost = (5 * 8) / getUnitDivisor('cl');
    expect(cost).toBeCloseTo(0.4, 2);
  });

  it('computes food cost percentage correctly', () => {
    const totalIngredientCost = 3.5;
    const sellingPrice = 14.0;
    const foodCostPercent = (totalIngredientCost / sellingPrice) * 100;
    expect(foodCostPercent).toBeCloseTo(25, 0);
  });

  it('computes gross margin from food cost %', () => {
    const foodCostPercent = 25;
    const grossMargin = 100 - foodCostPercent;
    expect(grossMargin).toBe(75);
  });
});

describe('validatePrice — guards numeric inputs', () => {
  it('accepts valid price', async () => {
    const { validatePrice } = await import('../api/middleware');
    const result = validatePrice('12.50', 'prix');
    expect(result.valid).toBe(true);
    expect(result.value).toBe(12.5);
  });

  it('rejects NaN', async () => {
    const { validatePrice } = await import('../api/middleware');
    const result = validatePrice('abc', 'prix');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('prix');
  });

  it('rejects negative price', async () => {
    const { validatePrice } = await import('../api/middleware');
    const result = validatePrice('-5', 'prix');
    expect(result.valid).toBe(false);
  });

  it('rejects price exceeding 999999', async () => {
    const { validatePrice } = await import('../api/middleware');
    const result = validatePrice('1000000', 'prix');
    expect(result.valid).toBe(false);
  });

  it('rounds to 2 decimal places', async () => {
    const { validatePrice } = await import('../api/middleware');
    const result = validatePrice('3.14159', 'prix');
    expect(result.valid).toBe(true);
    expect(result.value).toBe(3.14);
  });
});

describe('validatePositiveNumber — guards quantity inputs', () => {
  it('accepts zero', async () => {
    const { validatePositiveNumber } = await import('../api/middleware');
    const result = validatePositiveNumber('0', 'qty');
    expect(result.valid).toBe(true);
    expect(result.value).toBe(0);
  });

  it('accepts positive integer', async () => {
    const { validatePositiveNumber } = await import('../api/middleware');
    const result = validatePositiveNumber('500', 'qty');
    expect(result.valid).toBe(true);
    expect(result.value).toBe(500);
  });

  it('rejects string input', async () => {
    const { validatePositiveNumber } = await import('../api/middleware');
    const result = validatePositiveNumber('notanumber', 'qty');
    expect(result.valid).toBe(false);
  });
});
