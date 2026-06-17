import { describe, it, expect, beforeEach, vi } from 'vitest';
import { adjustValence } from '../services/valence.js';
import { MockPool, matchHandler } from './mock-pool.js';

// This test file validates the health→valence integration logic
// that exists in game-handler.ts. We test the valence side here
// (the energy-to-delta mapping is a simple formula).

const mockPool = new MockPool();

vi.mock('../db/pool.js', () => ({
  query: vi.fn((text: string, params?: any[]) => mockPool.query(text, params)),
  transaction: vi.fn((fn: (client: any) => Promise<any>) => mockPool.transaction(fn)),
}));

describe('health → valence integration', () => {
  beforeEach(() => {
    mockPool.setHandler(() => ({ rows: [], rowCount: 0 }));
  });

  // This mirrors the formula in game-handler.ts:
  //   const boostAmount = (energyLevel - 0.5) * 0.1;
  //   await adjustValence(userId, boostAmount);
  function energyToDelta(energy: number): number {
    return (energy - 0.5) * 0.1;
  }

  it('high energy (1.0) gives max positive boost +0.05', () => {
    expect(energyToDelta(1.0)).toBe(0.05);
  });

  it('low energy (0.0) gives max negative boost -0.05', () => {
    expect(energyToDelta(0.0)).toBe(-0.05);
  });

  it('energy 0.5 gives zero boost', () => {
    expect(energyToDelta(0.5)).toBe(0);
  });

  it('energy 0.7 gives modest positive boost +0.02', () => {
    expect(energyToDelta(0.7)).toBeCloseTo(0.02, 10);
  });

  it('energy 0.3 gives modest negative boost -0.02', () => {
    expect(energyToDelta(0.3)).toBeCloseTo(-0.02, 10);
  });

  it('adjustValence is called with the correct delta from energy', async () => {
    let capturedDelta = 0;
    mockPool.setHandler(matchHandler([
      {
        match: 'UPDATE atoms SET valence',
        handler: (_t, params) => {
          capturedDelta = params[2] as number;
          return { rows: [{ valence: 1.0 + capturedDelta }], rowCount: 1 };
        },
      },
    ]));

    const energy = 0.8;
    const delta = energyToDelta(energy); // = 0.03
    const v = await adjustValence('health-test-atom', delta);
    expect(capturedDelta).toBeCloseTo(0.03);
    expect(v).toBeCloseTo(1.03);
  });

  it('edge case: energy 0.75 yields +0.025 boost', () => {
    expect(energyToDelta(0.75)).toBe(0.025);
  });

  it('edge case: energy 0.25 yields -0.025 boost', () => {
    expect(energyToDelta(0.25)).toBe(-0.025);
  });
});
