import { describe, it, expect } from 'vitest';

// The energy calculation logic from useHealth.ts, extracted as a pure function
function computeEnergyLevel(data: {
  sleepScore?: number;
  calcium?: number;
  spoons?: number;
}): number {
  const sleep = data.sleepScore ?? 0.7;
  const calcium = data.calcium ?? 0.8;
  const spoons = data.spoons ?? 0.6;
  return Math.min(1.0, Math.max(0.0,
    sleep * 0.3 + calcium * 0.3 + spoons * 0.4
  ));
}

describe('health energy level calculation', () => {
  it('uses all three metrics with correct weights', () => {
    // sleep * 0.3 + calcium * 0.3 + spoons * 0.4
    const result = computeEnergyLevel({
      sleepScore: 1.0,
      calcium: 1.0,
      spoons: 1.0,
    });
    expect(result).toBe(1.0);
  });

  it('computes weighted average correctly', () => {
    const result = computeEnergyLevel({
      sleepScore: 0.5,
      calcium: 0.5,
      spoons: 0.5,
    });
    expect(result).toBe(0.5);
  });

  it('uses defaults when fields are missing', () => {
    const result = computeEnergyLevel({});
    expect(result).toBeCloseTo(0.7 * 0.3 + 0.8 * 0.3 + 0.6 * 0.4, 6);
  });

  it('clamps to 0.0 minimum', () => {
    const result = computeEnergyLevel({
      sleepScore: -1,
      calcium: -1,
      spoons: -1,
    });
    expect(result).toBe(0.0);
  });

  it('clamps to 1.0 maximum', () => {
    const result = computeEnergyLevel({
      sleepScore: 5,
      calcium: 5,
      spoons: 5,
    });
    expect(result).toBe(1.0);
  });

  it('spoons has highest weight (0.4)', () => {
    const highSpoons = computeEnergyLevel({
      sleepScore: 0.0,
      calcium: 0.0,
      spoons: 1.0,
    });
    const highSleep = computeEnergyLevel({
      sleepScore: 1.0,
      calcium: 0.0,
      spoons: 0.0,
    });
    expect(highSpoons).toBeGreaterThan(highSleep);
  });

  it('handles partial data with defaults', () => {
    const onlySleep = computeEnergyLevel({ sleepScore: 1.0 });
    const expected = 1.0 * 0.3 + 0.8 * 0.3 + 0.6 * 0.4;
    expect(onlySleep).toBeCloseTo(expected, 6);
  });

  it('produces reasonable energy values for realistic inputs', () => {
    // Good sleep, decent calcium, medium spoons
    const result = computeEnergyLevel({
      sleepScore: 0.85,
      calcium: 0.7,
      spoons: 0.6,
    });
    expect(result).toBeGreaterThan(0.5);
    expect(result).toBeLessThan(1.0);
  });
});
