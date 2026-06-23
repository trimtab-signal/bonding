import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockPool, matchHandler } from './mock-pool.js';

const mockPool = new MockPool();

vi.mock('../db/pool.js', () => ({
  query: vi.fn((text: string, params?: any[]) => mockPool.query(text, params)),
  transaction: vi.fn((fn: (client: any) => Promise<any>) => mockPool.transaction(fn)),
}));

const gameLoop = await import('../services/game-loop.js');

describe('game-loop', () => {
  beforeEach(() => {
    mockPool.setHandler(() => ({ rows: [], rowCount: 0 }));
  });

  describe('createPing', () => {
    it('inserts a ping and returns its details', async () => {
      let inserted = false;
      mockPool.setHandler(
        matchHandler([
          {
            match: 'INSERT INTO pings',
            handler: () => {
              inserted = true;
              return { rows: [], rowCount: 1 };
            },
          },
        ]),
      );
      const result = await gameLoop.createPing('atom-a', 'atom-b', 'calm');
      expect(result.fromUserId).toBe('atom-a');
      expect(result.toUserId).toBe('atom-b');
      expect(result.zoneId).toBe('calm');
      expect(result.status).toBe('pending');
      expect(result.pingId).toBeTruthy();
      expect(inserted).toBe(true);
    });
  });

  describe('respondToPing', () => {
    it('accepts a pending ping and creates a bond', async () => {
      let pingUpdated = false;
      let bondInserted = false;
      const now = new Date();

      mockPool.setHandler(
        matchHandler([
          {
            match: 'SELECT * FROM pings',
            handler: () => ({
              rows: [
                {
                  id: 'ping-1',
                  from_atom: 'atom-a',
                  to_atom: 'atom-b',
                  zone_id: 'lab',
                  status: 'pending',
                  created_at: now,
                },
              ],
              rowCount: 1,
            }),
          },
          {
            match: 'UPDATE pings SET status',
            handler: () => {
              pingUpdated = true;
              return { rows: [], rowCount: 1 };
            },
          },
          {
            match: 'INSERT INTO bonds',
            handler: () => {
              bondInserted = true;
              return { rows: [{ id: 'bond-1' }], rowCount: 1 };
            },
          },
          {
            match: /^UPDATE atoms SET total_bonds/,
            handler: () => ({ rows: [], rowCount: 1 }),
          },
          {
            match: 'INSERT INTO reactions',
            handler: () => ({ rows: [], rowCount: 1 }),
          },
        ]),
      );

      const result = await gameLoop.respondToPing('ping-1', true);
      expect(result.status).toBe('accepted');
      expect(result.bondId).toBeTruthy();
      expect(pingUpdated).toBe(true);
      expect(bondInserted).toBe(true);
    });

    it('rejects a ping and returns rejected status', async () => {
      mockPool.setHandler(
        matchHandler([
          {
            match: 'SELECT * FROM pings',
            handler: () => ({
              rows: [
                {
                  id: 'ping-1',
                  from_atom: 'a',
                  to_atom: 'b',
                  zone_id: 'calm',
                  status: 'pending',
                  created_at: new Date(),
                },
              ],
              rowCount: 1,
            }),
          },
          {
            match: 'UPDATE pings SET status',
            handler: () => ({ rows: [], rowCount: 1 }),
          },
        ]),
      );

      const result = await gameLoop.respondToPing('ping-1', false);
      expect(result.status).toBe('rejected');
      expect(result.bondId).toBeUndefined();
    });

    it('throws when ping not found', async () => {
      mockPool.setHandler(() => ({ rows: [], rowCount: 0 }));
      await expect(gameLoop.respondToPing('nonexistent', true)).rejects.toThrow();
    });
  });

  describe('getOrCreateBondId', () => {
    it('returns bond ID when active bond exists', async () => {
      mockPool.setHandler(
        matchHandler([
          {
            match: 'SELECT id FROM bonds',
            handler: () => ({ rows: [{ id: 'bond-xyz' }], rowCount: 1 }),
          },
        ]),
      );
      const id = await gameLoop.getOrCreateBondId('atom-a', 'atom-b');
      expect(id).toBe('bond-xyz');
    });

    it('returns null when no active bond', async () => {
      mockPool.setHandler(() => ({ rows: [], rowCount: 0 }));
      const id = await gameLoop.getOrCreateBondId('atom-a', 'atom-b');
      expect(id).toBeNull();
    });
  });

  describe('recordCheckIn', () => {
    it('inserts check-in and updates atom stats', async () => {
      let checkInInserted = false;
      let atomUpdated = false;

      mockPool.setHandler(
        matchHandler([
          {
            match: 'INSERT INTO check_ins',
            handler: (_t, params) => {
              checkInInserted = true;
              // params: [id, atomId, zoneId, geohashPrefix, lng, lat, witnessedBy, witnessCount, energyLevel]
              expect(params[8]).toBeNull(); // no energy level
              return { rows: [], rowCount: 1 };
            },
          },
          {
            match: 'UPDATE atoms SET',
            handler: () => {
              atomUpdated = true;
              return { rows: [], rowCount: 1 };
            },
          },
        ]),
      );

      const id = await gameLoop.recordCheckIn('atom-1', 'lab', '9q8yy', 0, 0, []);
      expect(id).toBeTruthy();
      expect(checkInInserted).toBe(true);
      expect(atomUpdated).toBe(true);
    });

    it('stores energy level when provided', async () => {
      let storedEnergy: number | null = null;
      mockPool.setHandler(
        matchHandler([
          {
            match: 'INSERT INTO check_ins',
            handler: (_t, params) => {
              storedEnergy = params[8] as number | null;
              return { rows: [], rowCount: 1 };
            },
          },
          {
            match: 'UPDATE atoms SET',
            handler: () => ({ rows: [], rowCount: 1 }),
          },
        ]),
      );

      await gameLoop.recordCheckIn('atom-1', 'calm', 'abcd', 0, 0, [], 0.75);
      expect(storedEnergy).toBe(0.75);
    });
  });

  describe('getNearbyAtoms', () => {
    it('returns atoms in same zone', async () => {
      mockPool.setHandler(
        matchHandler([
          {
            match: /^SELECT a\.id/,
            handler: () => ({
              rows: [
                {
                  id: 'atom-b',
                  display_name: 'Bob',
                  skills: ['js'],
                  interests: ['music'],
                  atom_type: 'friend',
                  current_zone: 'lab',
                  last_seen: new Date(),
                  total_bonds: 1,
                },
              ],
              rowCount: 1,
            }),
          },
        ]),
      );

      const atoms = await gameLoop.getNearbyAtoms(-81.6335, 30.7824, 500, 'atom-a');
      expect(atoms).toHaveLength(1);
      expect(atoms[0].id).toBe('atom-b');
    });

    it('returns empty when no one else is in zone', async () => {
      mockPool.setHandler(() => ({ rows: [], rowCount: 0 }));
      const atoms = await gameLoop.getNearbyAtoms('wild', 'atom-a');
      expect(atoms).toHaveLength(0);
    });
  });

  describe('decayOldBonds', () => {
    it('executes decay query', async () => {
      let executed = false;
      mockPool.setHandler((text: string) => {
        if (text.includes('UPDATE bonds')) executed = true;
        return { rows: [], rowCount: 0 };
      });
      await gameLoop.decayOldBonds();
      expect(executed).toBe(true);
    });
  });
});
