import { describe, it, expect, vi, beforeEach } from 'vitest';
import { computeMatchScore } from '../services/valence.js';
import { MockPool, matchHandler } from './mock-pool.js';

// Module-level mock pool
const mockPool = new MockPool();

vi.mock('../db/pool.js', () => ({
  query: vi.fn((text: string, params?: any[]) => mockPool.query(text, params)),
  transaction: vi.fn((fn: (client: any) => Promise<any>) => mockPool.transaction(fn)),
}));

// Re-import the module-under-test AFTER mocks are set up
const valenceModule = await import('../services/valence.js');

describe('computeMatchScore (pure logic)', () => {
  it('returns 0 for identical atoms with no skills/interests', () => {
    const atom = { skills: [], interests: [] };
    expect(computeMatchScore(atom, atom)).toBe(0);
  });

  it('scores higher when skills are complementary', () => {
    const backend = { skills: ['typescript', 'postgres'], interests: ['music'] };
    const frontend = { skills: ['react', 'css'], interests: ['music'] };
    const score = computeMatchScore(backend, frontend);
    expect(score).toBeGreaterThan(0);
    // Complementary skills gain more than shared interests (0.6 weight vs 0.4)
    expect(score).toBeGreaterThan(0.2);
  });

  it('scores higher with more shared interests', () => {
    const alice = { skills: ['a'], interests: ['x', 'y', 'z'] };
    const bob = { skills: ['b'], interests: ['x', 'y', 'z'] };
    const carol = { skills: ['a'], interests: ['x'] };
    const ab = computeMatchScore(alice, bob);
    const ac = computeMatchScore(alice, carol);
    expect(ab).toBeGreaterThan(ac);
  });

  it('returns same score regardless of argument order (symmetric)', () => {
    const a = { skills: ['js', 'rust'], interests: ['hiking'] };
    const b = { skills: ['python', 'design'], interests: ['cooking'] };
    expect(computeMatchScore(a, b)).toBe(computeMatchScore(b, a));
  });

  it('shared interests still contribute when skills are identical', () => {
    const a = { skills: ['js'], interests: ['music'] };
    expect(computeMatchScore(a, a)).toBeGreaterThan(0);
    // 0.6 * 0 (no skill complement) + 0.4 * 1 (shared interest) = 0.4
    expect(computeMatchScore(a, a)).toBeCloseTo(0.4);
  });
});

describe('valence module (with mocked DB)', () => {
  beforeEach(() => {
    mockPool.setHandler(() => ({ rows: [], rowCount: 0 }));
  });

  describe('getValence', () => {
    it('returns default 1.0 when atom not found', async () => {
      mockPool.setHandler(() => ({ rows: [], rowCount: 0 }));
      const v = await valenceModule.getValence('unknown');
      expect(v).toBe(1.0);
    });

    it('returns stored valence', async () => {
      mockPool.setHandler(matchHandler([
        {
          match: 'SELECT valence',
          handler: () => ({ rows: [{ valence: 1.5 }], rowCount: 1 }),
        },
      ]));
      const v = await valenceModule.getValence('atom-1');
      expect(v).toBe(1.5);
    });
  });

  describe('adjustValence', () => {
    it('adds positive delta', async () => {
      mockPool.setHandler(matchHandler([
        {
          match: 'UPDATE atoms SET valence',
          handler: (_t, params) => ({ rows: [{ valence: 1.0 + (params[2] as number) }], rowCount: 1 }),
        },
      ]));
      const v = await valenceModule.adjustValence('atom-1', 0.05);
      expect(v).toBe(1.05);
    });

    it('subtracts negative delta', async () => {
      mockPool.setHandler(matchHandler([
        {
          match: 'UPDATE atoms SET valence',
          handler: (_t, params) => ({ rows: [{ valence: 1.0 + (params[2] as number) }], rowCount: 1 }),
        },
      ]));
      const v = await valenceModule.adjustValence('atom-1', -0.02);
      expect(v).toBe(0.98);
    });

    it('clamps to minimum 0.1', async () => {
      mockPool.setHandler(matchHandler([
        {
          match: 'UPDATE atoms SET valence',
          handler: (_t, params) => {
            const delta = params[2] as number;
            const result = Math.max(0.1, Math.min(2.0, 1.0 + delta));
            return { rows: [{ valence: result }], rowCount: 1 };
          },
        },
      ]));
      const v = await valenceModule.adjustValence('atom-1', -5.0);
      expect(v).toBe(0.1);
    });

    it('clamps to maximum 2.0', async () => {
      mockPool.setHandler(matchHandler([
        {
          match: 'UPDATE atoms SET valence',
          handler: (_t, params) => {
            const delta = params[2] as number;
            const result = Math.max(0.1, Math.min(2.0, 1.0 + delta));
            return { rows: [{ valence: result }], rowCount: 1 };
          },
        },
      ]));
      const v = await valenceModule.adjustValence('atom-1', 5.0);
      expect(v).toBe(2.0);
    });
  });

  describe('boostCheckIn', () => {
    it('boosts valence when bond is active', async () => {
      mockPool.setHandler(matchHandler([
        {
          match: 'SELECT id FROM bonds',
          handler: () => ({ rows: [{ id: 'bond-1' }], rowCount: 1 }),
        },
        {
          match: 'UPDATE atoms SET valence',
          handler: () => ({ rows: [{ valence: 1.05 }], rowCount: 1 }),
        },
      ]));
      const v = await valenceModule.boostCheckIn('atom-1', 'bond-1');
      expect(v).toBe(1.05);
    });

    it('returns current valence when bond is not active', async () => {
      mockPool.setHandler(matchHandler([
        {
          match: 'SELECT id FROM bonds',
          handler: () => ({ rows: [], rowCount: 0 }),
        },
        {
          match: 'SELECT valence',
          handler: () => ({ rows: [{ valence: 0.8 }], rowCount: 1 }),
        },
      ]));
      const v = await valenceModule.boostCheckIn('atom-1', 'bond-dead');
      expect(v).toBe(0.8);
    });
  });

  describe('penalizeRejection', () => {
    it('reduces valence by penalty amount', async () => {
      mockPool.setHandler(matchHandler([
        {
          match: 'UPDATE atoms SET valence',
          handler: (_t, params) => {
            const newVal = 1.0 + (params[2] as number);
            return { rows: [{ valence: newVal }], rowCount: 1 };
          },
        },
      ]));
      const v = await valenceModule.penalizeRejection('atom-1');
      expect(v).toBeLessThan(1.0);
    });
  });

  describe('applyDailyDecay', () => {
    it('executes decay query without error', async () => {
      let called = false;
      mockPool.setHandler((text: string) => {
        if (text.includes('UPDATE atoms')) called = true;
        return { rows: [], rowCount: 0 };
      });
      await valenceModule.applyDailyDecay();
      expect(called).toBe(true);
    });
  });
});
