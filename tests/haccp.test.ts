/**
 * @file tests/haccp.test.ts
 * Pure tests for HACCP temperature status (EU regulation 852/2004).
 * No DB, no network, no env required.
 */
import { describe, it, expect } from 'vitest';
import {
  getTemperatureStatus,
  EU_FRIDGE_MAX,
  EU_FREEZER_MAX,
  EU_HOT_MIN,
} from '../api-lib/utils/haccp';

describe('getTemperatureStatus', () => {
  it('frigo 3°C → conforme', () => {
    expect(getTemperatureStatus('frigo', 3)).toBe('conforme');
  });

  it('frigo 4°C exactly → conforme (boundary)', () => {
    expect(getTemperatureStatus('frigo', EU_FRIDGE_MAX)).toBe('conforme');
  });

  it('frigo 5°C → non_conforme', () => {
    expect(getTemperatureStatus('frigo', 5)).toBe('non_conforme');
  });

  it('frigo -1°C → non_conforme (cold-chain breach below 0°C)', () => {
    expect(getTemperatureStatus('frigo', -1)).toBe('non_conforme');
  });

  it('congélateur -20°C → conforme', () => {
    expect(getTemperatureStatus('congélateur', -20)).toBe('conforme');
  });

  it('congélateur -18°C exactly → conforme (boundary)', () => {
    expect(getTemperatureStatus('congélateur', EU_FREEZER_MAX)).toBe('conforme');
  });

  it('congélateur -15°C → non_conforme', () => {
    expect(getTemperatureStatus('congélateur', -15)).toBe('non_conforme');
  });

  it('plats chauds 65°C → conforme', () => {
    expect(getTemperatureStatus('plats chauds', 65)).toBe('conforme');
  });

  it('plats chauds 63°C exactly → conforme (boundary)', () => {
    expect(getTemperatureStatus('plats chauds', EU_HOT_MIN)).toBe('conforme');
  });

  it('plats chauds 60°C → non_conforme', () => {
    expect(getTemperatureStatus('plats chauds', 60)).toBe('non_conforme');
  });

  it('réception 4°C → conforme (treated as fridge)', () => {
    expect(getTemperatureStatus('réception', 4)).toBe('conforme');
  });

  it('unknown zone → en_attente', () => {
    expect(getTemperatureStatus('cave-à-vin', 12)).toBe('en_attente');
    expect(getTemperatureStatus('', 0)).toBe('en_attente');
  });

  it('case-insensitive zone matching', () => {
    expect(getTemperatureStatus('FRIGO', 3)).toBe('conforme');
    expect(getTemperatureStatus('Congélateur', -20)).toBe('conforme');
  });
});
