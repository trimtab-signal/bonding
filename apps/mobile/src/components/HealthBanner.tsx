import { useGameStore } from '../store/game-store.js';
import { ZONES, type ZoneId } from '@bonding/shared-types';

export function HealthBanner() {
  const { energyLevel, healthOptIn, setHealthOptIn } = useGameStore();

  if (energyLevel === null) return null;

  if (!healthOptIn) {
    return (
      <div style={{
        background: 'var(--surface2)', padding: '10px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          🌿 Enable health‑aware zone suggestions?
        </span>
        <button
          onClick={() => setHealthOptIn(true)}
          style={{
            padding: '4px 14px', borderRadius: 6, border: 'none',
            background: 'var(--accent)', color: '#fff', fontSize: 12, cursor: 'pointer',
          }}
        >
          Opt In
        </button>
      </div>
    );
  }

  let suggested: ZoneId | null = null;
  if (energyLevel < 0.3) suggested = 'calm';
  else if (energyLevel < 0.6) suggested = 'kitchen';
  else if (energyLevel < 0.8) suggested = 'lab';
  else suggested = 'wild';

  const zone = suggested ? ZONES[suggested] : null;

  return (
    <div style={{
      background: 'var(--surface2)', padding: '10px 16px',
      borderBottom: `2px solid ${zone?.color || '#666'}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <span style={{ fontSize: 13, fontWeight: 600 }}>
          {zone ? `${zone.emoji} Try ${zone.name} Zone` : '🌿 No suggestion'}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 8 }}>
          Energy: {Math.round(energyLevel * 100)}%
        </span>
      </div>
      <button
        onClick={() => setHealthOptIn(false)}
        style={{
          padding: '3px 10px', borderRadius: 4, border: '1px solid #555',
          background: 'transparent', color: 'var(--text-dim)', fontSize: 11, cursor: 'pointer',
        }}
      >
        Hide
      </button>
    </div>
  );
}
