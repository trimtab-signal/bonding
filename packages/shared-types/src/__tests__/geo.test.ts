import { describe, it, expect } from 'vitest';
import { distanceMeters, geohashEncode } from '../index.js';

describe('distanceMeters', () => {
  // Reference: roughly Washington DC (38.9, -77.0) to NYC (40.7, -74.0) ~330km
  const DC: [number, number] = [38.9, -77.0];
  const NYC: [number, number] = [40.7, -74.0];

  it('returns ~330km between DC and NYC', () => {
    const d = distanceMeters(DC[0], DC[1], NYC[0], NYC[1]);
    expect(d).toBeGreaterThan(300_000);
    expect(d).toBeLessThan(370_000);
  });

  it('returns 0 for same point', () => {
    expect(distanceMeters(38.9, -77.0, 38.9, -77.0)).toBe(0);
  });

  it('is symmetric (commutative)', () => {
    const a = distanceMeters(DC[0], DC[1], NYC[0], NYC[1]);
    const b = distanceMeters(NYC[0], NYC[1], DC[0], DC[1]);
    expect(a).toBeCloseTo(b, 6);
  });

  it('handles antipodal points roughly', () => {
    const d = distanceMeters(0, 0, 0, 180);
    // half the earth's circumference ~20_000 km
    expect(d).toBeGreaterThan(15_000_000);
    expect(d).toBeLessThan(25_000_000);
  });

  it('works with negative coordinates (southern hemisphere)', () => {
    const sydney: [number, number] = [-33.8, 151.2];
    const d = distanceMeters(sydney[0], sydney[1], sydney[0], sydney[1]);
    expect(d).toBe(0);
  });
});

describe('geohashEncode', () => {
  it('encodes known location (Trafalgar Square)', () => {
    // Trafalgar Square London: ~51.5, -0.13 → geohash "gcpu" at precision 4
    const hash = geohashEncode(51.5, -0.13, 4);
    expect(hash).toBe('gcpu');
  });

  it('encodes with default precision 5', () => {
    const hash = geohashEncode(38.9, -77.0);
    expect(hash).toHaveLength(5);
  });

  it('encodes with custom precision', () => {
    const hash = geohashEncode(40.7, -74.0, 7);
    expect(hash).toHaveLength(7);
  });

  it('produces alphanumeric (base32) characters only', () => {
    const hash = geohashEncode(48.85, 2.35, 12);
    expect(hash).toMatch(/^[0-9bcdefghjkmnpqrstuvwxyz]+$/);
  });

  it('nearby locations share prefix at low precision', () => {
    const h1 = geohashEncode(51.500, -0.130, 3);
    const h2 = geohashEncode(51.510, -0.120, 3);
    expect(h1[0]).toBe(h2[0]);
  });

  it('different hemispheres produce different hashes', () => {
    const north = geohashEncode(40.0, 0, 2);
    const south = geohashEncode(-40.0, 0, 2);
    expect(north).not.toBe(south);
  });

  it('throws or returns empty for precision 0', () => {
    expect(() => geohashEncode(0, 0, 0)).not.toThrow();
    expect(geohashEncode(0, 0, 0)).toBe('');
  });
});
