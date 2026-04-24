/**
 * @file api-lib/utils/haccp.ts
 * Pure HACCP temperature compliance logic (EU regulation 852/2004).
 * Fridges must keep cold chain between 0-4°C, freezers at or below -18°C,
 * and hot-held dishes at or above 63°C. Any zone outside these bounds is
 * "non_conforme"; unknown zones default to "en_attente".
 */

export const EU_FRIDGE_MIN = 0;
export const EU_FRIDGE_MAX = 4;
export const EU_FREEZER_MAX = -18;
export const EU_HOT_MIN = 63;

export type TemperatureStatus = 'conforme' | 'non_conforme' | 'en_attente';

export function getTemperatureStatus(zone: string, temperature: number): TemperatureStatus {
  const z = (zone || '').toLowerCase().trim();
  if (z === 'frigo' || z === 'réfrigérateur' || z === 'refrigerateur') {
    return temperature >= EU_FRIDGE_MIN && temperature <= EU_FRIDGE_MAX ? 'conforme' : 'non_conforme';
  }
  if (z === 'congélateur' || z === 'congelateur') {
    return temperature <= EU_FREEZER_MAX ? 'conforme' : 'non_conforme';
  }
  if (z === 'plats chauds' || z === 'plat_chaud') {
    return temperature >= EU_HOT_MIN ? 'conforme' : 'non_conforme';
  }
  if (z === 'réception' || z === 'reception') {
    return temperature >= EU_FRIDGE_MIN && temperature <= EU_FRIDGE_MAX ? 'conforme' : 'non_conforme';
  }
  return 'en_attente';
}
