import { describe, it, expect } from 'vitest';

interface LocationProof {
  geohashPrefix: string;
  geohashPrecision: number;
  witnessedBy: string[];
  witnessSignatures: string[];
  timestamp: number;
}

// Replicates the checkIn logic from useWebSocket.ts
function buildCheckInMessage(
  zoneId: string,
  opts: { healthOptIn: boolean; energyLevel: number | null }
): Record<string, unknown> {
  const msg: Record<string, unknown> = {
    type: 'check_in',
    zoneId,
    locationProof: {
      geohashPrefix: 'local',
      geohashPrecision: 5,
      witnessedBy: [],
      witnessSignatures: [],
      timestamp: Date.now(),
    },
  };
  if (opts.healthOptIn && opts.energyLevel !== null) {
    msg.energyLevel = opts.energyLevel;
  }
  return msg;
}

describe('check-in message construction with health data', () => {
  it('includes energyLevel when opted in and level available', () => {
    const msg = buildCheckInMessage('lab', { healthOptIn: true, energyLevel: 0.75 });
    expect(msg.type).toBe('check_in');
    expect(msg.zoneId).toBe('lab');
    expect(msg.energyLevel).toBe(0.75);
  });

  it('omits energyLevel when opted in but level is null', () => {
    const msg = buildCheckInMessage('calm', { healthOptIn: true, energyLevel: null });
    expect(msg.energyLevel).toBeUndefined();
  });

  it('omits energyLevel when opted out', () => {
    const msg = buildCheckInMessage('wild', { healthOptIn: false, energyLevel: 0.9 });
    expect(msg.energyLevel).toBeUndefined();
  });

  it('omits energyLevel when opted out and level is null', () => {
    const msg = buildCheckInMessage('kitchen', { healthOptIn: false, energyLevel: null });
    expect(msg.energyLevel).toBeUndefined();
  });

  it('includes location proof structure', () => {
    const msg = buildCheckInMessage('deep', { healthOptIn: false, energyLevel: null });
    const proof = msg.locationProof as LocationProof;
    expect(proof.geohashPrefix).toBe('local');
    expect(proof.geohashPrecision).toBe(5);
    expect(proof.witnessedBy).toEqual([]);
    expect(proof.timestamp).toBeGreaterThan(0);
  });

  it('handles energy level 0 correctly (not falsy)', () => {
    const msg = buildCheckInMessage('lab', { healthOptIn: true, energyLevel: 0 });
    expect(msg.energyLevel).toBe(0);
  });

  it('handles energy level 1 correctly', () => {
    const msg = buildCheckInMessage('lab', { healthOptIn: true, energyLevel: 1 });
    expect(msg.energyLevel).toBe(1);
  });

  it('correctly passes zoneId as string', () => {
    const msg = buildCheckInMessage('calm', { healthOptIn: false, energyLevel: null });
    expect(msg.zoneId).toBe('calm');
  });
});
