import { describe, it, expect } from 'vitest';
import { ZONES, type ZoneId } from '../index.js';

describe('ZONES', () => {
  const zoneIds: ZoneId[] = ['calm', 'lab', 'kitchen', 'deep', 'wild'];

  it('has all 5 zones', () => {
    expect(Object.keys(ZONES)).toHaveLength(5);
  });

  it.each(zoneIds)('zone %s has required fields', (id) => {
    const zone = ZONES[id];
    expect(zone.id).toBe(id);
    expect(zone.name).toBeTruthy();
    expect(zone.description).toBeTruthy();
    expect(zone.color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(zone.emoji).toBeTruthy();
    expect(zone.lat).toBeTypeOf('number');
    expect(zone.lng).toBeTypeOf('number');
    expect(zone.radiusMeters).toBeGreaterThan(0);
  });

  it('all zones have unique colors', () => {
    const colors = Object.values(ZONES).map((z) => z.color);
    expect(new Set(colors).size).toBe(colors.length);
  });

  it('all zones have unique emoji', () => {
    const emojis = Object.values(ZONES).map((z) => z.emoji);
    expect(new Set(emojis).size).toBe(emojis.length);
  });

  it('deep zone has smallest radius (intimate zone)', () => {
    const deep = ZONES.deep;
    const radii = Object.values(ZONES).map((z) => z.radiusMeters);
    const minRadius = Math.min(...radii);
    expect(deep.radiusMeters).toBe(minRadius);
  });
});
