import { useGameStore } from '../store/game-store';
import { ZONES, type ZoneId } from '@bonding/shared-types';
import { Card, Badge } from './ui';

export function HealthBanner() {
  const { energyLevel, healthOptIn, setHealthOptIn } = useGameStore();

  if (energyLevel === null) return null;

  if (!healthOptIn) {
    return (
      <Card padding="0.6rem 1rem" variant="bordered">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>🌿 Enable health‑aware zone suggestions?</span>
          <button onClick={() => setHealthOptIn(true)} className="btn-primary" style={{ padding: '4px 14px', borderRadius: 6, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>Opt In</button>
        </div>
      </Card>
    );
  }

  let suggested: ZoneId | null = null;
  if (energyLevel < 0.3) suggested = 'calm';
  else if (energyLevel < 0.6) suggested = 'kitchen';
  else if (energyLevel < 0.8) suggested = 'lab';
  else suggested = 'wild';

  const zone = suggested ? ZONES[suggested] : null;

  return (
    <Card padding="0.5rem 1rem" variant="bordered">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            {zone ? `${zone.emoji} Try ${zone.name}` : '🌿 No suggestion'}
          </span>
          <Badge variant={suggested || 'default'} size="sm">Energy: {Math.round(energyLevel * 100)}%</Badge>
        </div>
        <button onClick={() => setHealthOptIn(false)} style={{ padding: '3px 10px', borderRadius: 4, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-dim)', fontSize: 11, cursor: 'pointer', flexShrink: 0 }}>Hide</button>
      </div>
    </Card>
  );
}
