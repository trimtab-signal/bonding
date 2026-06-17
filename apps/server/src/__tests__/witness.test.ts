import { describe, it, expect } from 'vitest';
import { hashStatement } from '../services/witness.js';

describe('witness / hashStatement', () => {
  it('produces a deterministic hex string', () => {
    const input = { claimerId: 'abc', geohashPrefix: '9q8yy', timestamp: 1000 };
    const a = hashStatement(input);
    const b = hashStatement(input);
    expect(a).toBe(b);
  });

  it('produces different hashes for different inputs', () => {
    const a = hashStatement({ claimerId: 'alice', geohashPrefix: 'abc', timestamp: 1 });
    const b = hashStatement({ claimerId: 'bob', geohashPrefix: 'abc', timestamp: 1 });
    expect(a).not.toBe(b);
  });

  it('produces different hashes for different timestamps', () => {
    const a = hashStatement({ claimerId: 'alice', geohashPrefix: 'abc', timestamp: 100 });
    const b = hashStatement({ claimerId: 'alice', geohashPrefix: 'abc', timestamp: 200 });
    expect(a).not.toBe(b);
  });

  it('returns a non-empty string', () => {
    const result = hashStatement({ claimerId: 'x', geohashPrefix: 'y', timestamp: 0 });
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });
});
