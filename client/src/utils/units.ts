/**
 * @file client/src/utils/units.ts
 *
 * Unit conversion helpers for restaurant inventory and recipes.
 * Single source of truth — was duplicated in Dashboard.tsx, Recipes.tsx, Inventory.tsx.
 *
 * Usage : multiply or divide a quantity by getUnitDivisor(unit) to convert
 * to or from the canonical reference unit (kg or L).
 *
 * Examples :
 *   500 g → 500 / getUnitDivisor('g') = 0.5 kg
 *   25 cl → 25 / getUnitDivisor('cl') = 0.25 L
 */

/**
 * Returns the divisor to convert from a smaller unit to its canonical
 * reference unit (kg for solids, L for liquids).
 *
 * Supported units : g, mg, cl, ml, dl. All others (kg, L, piece, etc.)
 * return 1 (no conversion).
 *
 * @param unit - the unit string (case-insensitive, whitespace-trimmed)
 * @returns the divisor (1, 10, 100, 1000, or 1000000)
 */
export function getUnitDivisor(unit: string): number {
  const u = (unit || '').toLowerCase().trim();
  if (u === 'g') return 1000;
  if (u === 'mg') return 1000000;
  if (u === 'cl') return 100;
  if (u === 'ml') return 1000;
  if (u === 'dl') return 10;
  return 1;
}
