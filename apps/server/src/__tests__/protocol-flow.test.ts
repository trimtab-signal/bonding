import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockPool, matchHandler } from './mock-pool.js';

// ── Mocks ──────────────────────────────────────────────────────────

const mockPool = new MockPool();

vi.mock('../db/pool.js', () => ({
  query: vi.fn((text: string, params?: any[]) => mockPool.query(text, params)),
  transaction: vi.fn((fn: (client: any) => Promise<any>) => mockPool.transaction(fn)),
}));

// Mock uuid for deterministic IDs
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid-' + Math.random().toString(36).slice(2, 10),
}));

// ── Helpers ────────────────────────────────────────────────────────

function energyToDelta(energy: number): number {
  return (energy - 0.5) * 0.1;
}

// ── Tests ──────────────────────────────────────────────────────────

describe('full protocol flow with health integration', () => {
  beforeEach(() => {
    mockPool.setHandler(() => ({ rows: [], rowCount: 0 }));
  });

  it('user with high energy checks in → valence boosted positively', async () => {
    const userId = 'atom-high-energy';
    const energyLevel = 0.9;
    let capturedDelta = 0;
    let capturedEnergy: number | null = null;
    let checkInInserted = false;

    mockPool.setHandler(matchHandler([
      {
        match: 'INSERT INTO check_ins',
        handler: (_t, params) => {
          capturedEnergy = params[8] as number | null;
          checkInInserted = true;
          return { rows: [], rowCount: 1 };
        },
      },
      {
        match: 'UPDATE atoms SET valence',
        handler: (_t, params) => {
          capturedDelta = params[2] as number;
          return { rows: [{ valence: 1.0 + capturedDelta }], rowCount: 1 };
        },
      },
      {
        match: /^UPDATE atoms SET (?!valence)/,
        handler: () => ({ rows: [], rowCount: 1 }),
      },
    ]));

    // Simulate game-handler.ts check_in logic:
    const { recordCheckIn } = await import('../services/game-loop.js');
    const { adjustValence } = await import('../services/valence.js');

    // 1. Record check-in with energy level
    const checkInId = await recordCheckIn(userId, 'lab', '9q8yy', 0, 0, [], energyLevel);
    expect(checkInId).toBeTruthy();
    expect(checkInInserted).toBe(true);
    expect(capturedEnergy).toBe(energyLevel);

    // 2. Adjust valence based on energy
    const delta = energyToDelta(energyLevel);
    const newValence = await adjustValence(userId, delta);
    expect(capturedDelta).toBeCloseTo(0.04);
    expect(newValence).toBeCloseTo(1.04);
  });

  it('user with low energy checks in → valence adjusted slightly down', async () => {
    const userId = 'atom-low-energy';
    const energyLevel = 0.2;
    let capturedDelta = 0;
    let capturedEnergy: number | null = null;

    mockPool.setHandler(matchHandler([
      {
        match: 'INSERT INTO check_ins',
        handler: (_t, params) => {
          capturedEnergy = params[8] as number | null;
          return { rows: [], rowCount: 1 };
        },
      },
      {
        match: 'UPDATE atoms SET valence',
        handler: (_t, params) => {
          capturedDelta = params[2] as number;
          return { rows: [{ valence: 1.0 + capturedDelta }], rowCount: 1 };
        },
      },
      {
        match: /^UPDATE atoms SET (?!valence)/,
        handler: () => ({ rows: [], rowCount: 1 }),
      },
    ]));

    const { recordCheckIn } = await import('../services/game-loop.js');
    const { adjustValence } = await import('../services/valence.js');

    await recordCheckIn(userId, 'calm', 'abcd', 0, 0, [], energyLevel);

    const delta = energyToDelta(energyLevel);
    const newValence = await adjustValence(userId, delta);
    expect(capturedDelta).toBeCloseTo(-0.03);
    expect(newValence).toBeCloseTo(0.97);
  });

  it('user who opted out sends no energy → no valence adjustment', async () => {
    const userId = 'atom-opted-out';
    let capturedEnergy: number | null = 999; // non-null sentinel
    let valenceAdjustmentCalled = false;

    mockPool.setHandler(matchHandler([
      {
        match: 'INSERT INTO check_ins',
        handler: (_t, params) => {
          capturedEnergy = params[8] as number | null;
          return { rows: [], rowCount: 1 };
        },
      },
      {
        match: /UPDATE atoms SET valence/,
        handler: () => {
          valenceAdjustmentCalled = true;
          return { rows: [{ valence: 1.05 }], rowCount: 1 };
        },
      },
      {
        match: /^UPDATE atoms/,
        handler: () => ({ rows: [], rowCount: 1 }),
      },
    ]));

    const { recordCheckIn } = await import('../services/game-loop.js');

    // Energy level is undefined when user opts out
    await recordCheckIn(userId, 'kitchen', 'wxyz', 0, 0, []);
    expect(capturedEnergy).toBeNull();
    // No valence adjustment from energy (simulating the guard in game-handler)
    expect(valenceAdjustmentCalled).toBe(false);
  });

  it('full ping → accept → bond → check-in with bonded atom flow', async () => {
    const atomA = 'atom-alice';
    const atomB = 'atom-bob';

    // Phase 1: Alice pings Bob
    let pingCreated = false;
    mockPool.setHandler(matchHandler([
      {
        match: 'INSERT INTO pings',
        handler: () => {
          pingCreated = true;
          return { rows: [], rowCount: 1 };
        },
      },
    ]));

    const { createPing, respondToPing, getOrCreateBondId, recordCheckIn } = await import('../services/game-loop.js');
    const { boostCheckIn, getValence } = await import('../services/valence.js');

    const ping = await createPing(atomA, atomB, 'lab');
    expect(pingCreated).toBe(true);
    expect(ping.status).toBe('pending');

    // Phase 2: Bob accepts
    mockPool.setHandler(matchHandler([
      {
        match: 'SELECT * FROM pings',
        handler: () => ({
          rows: [{ id: ping.pingId, from_atom: atomA, to_atom: atomB, zone_id: 'lab', status: 'pending', created_at: new Date() }],
          rowCount: 1,
        }),
      },
      {
        match: 'UPDATE pings SET status',
        handler: () => ({ rows: [], rowCount: 1 }),
      },
      {
        match: 'INSERT INTO bonds',
        handler: () => ({ rows: [{ id: 'bond-alice-bob' }], rowCount: 1 }),
      },
      {
        match: /^UPDATE atoms SET total_bonds/,
        handler: () => ({ rows: [], rowCount: 2 }),
      },
      {
        match: 'INSERT INTO reactions',
        handler: () => ({ rows: [], rowCount: 1 }),
      },
    ]));

    const acceptResult = await respondToPing(ping.pingId, true);
    expect(acceptResult.status).toBe('accepted');
    const bondId = acceptResult.bondId!;

    // Phase 3: They both check in at the same zone → bond boost
    let bondCheckInCounted = false;
    let bondBoosted = false;

    mockPool.setHandler(matchHandler([
      {
        match: 'INSERT INTO check_ins',
        handler: (_t, params) => ({
          rows: [{ id: 'ci-' + params[0] }],
          rowCount: 1,
        }),
      },
      // Specific valence UPDATE must come before general atoms UPDATE
      {
        match: 'UPDATE atoms SET valence',
        handler: () => {
          bondBoosted = true;
          return { rows: [{ valence: 1.05 }], rowCount: 1 };
        },
      },
      {
        match: /^UPDATE atoms SET/,
        handler: () => ({ rows: [], rowCount: 1 }),
      },
      // getOrCreateBondId query
      {
        match: 'SELECT id FROM bonds',
        handler: () => ({ rows: [{ id: bondId }], rowCount: 1 }),
      },
      // boostCheckIn queries: first SELECT bond, then UPDATE
      {
        match: 'SELECT id FROM bonds WHERE id',
        handler: () => ({ rows: [{ id: bondId }], rowCount: 1 }),
      },
      {
        match: /^UPDATE bonds SET check_in_count/,
        handler: () => {
          bondCheckInCounted = true;
          return { rows: [], rowCount: 1 };
        },
      },
    ]));

    // Alice checks in
    await recordCheckIn(atomA, 'lab', '9q8yy', 0, 0, []);
    expect(bondCheckInCounted).toBe(false); // no bond check-in counting until bonded atom nearby

    // Simulate the game-handler logic: find nearby bonded atom
    const bondExists = await getOrCreateBondId(atomA, atomB);
    expect(bondExists).toBe(bondId);

    // Boost check-in for the bond
    const boostedValence = await boostCheckIn(atomA, bondId);
    expect(boostedValence).toBeGreaterThan(1.0);
    expect(bondBoosted).toBe(true);
  });
});
