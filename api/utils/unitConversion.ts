// ── Unit conversion divisor ────────────────────────────────────────────
// pricePerUnit is always stored per the BULK unit (kg for weight, L for volume).
// If ingredient.unit is "g", quantity is in grams but price is per kg → divide by 1000.
// If ingredient.unit is "kg", quantity is in kg and price is per kg → divide by 1.
// If ingredient.unit is "cl", quantity is in cl but price is per L → divide by 100.
// If ingredient.unit is "ml", quantity is in ml but price is per L → divide by 1000.
// If ingredient.unit is "L", quantity is in L and price is per L → divide by 1.
// If ingredient.unit is "pièce"/"piece"/etc → divide by 1.
export function getUnitDivisor(unit: string): number {
  const u = (unit || '').toLowerCase().trim();
  if (u === 'g') return 1000;
  if (u === 'mg') return 1000000;
  if (u === 'cl') return 100;
  if (u === 'ml') return 1000;
  if (u === 'dl') return 10;
  return 1; // kg, L, pièce, piece, unité, etc.
}
