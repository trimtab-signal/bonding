import { useGameStore } from '../store/game-store.js';

export function Profile() {
  const { userId, bonds, profile } = useGameStore();

  return (
    <div style={{ padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--surface2)', margin: '0 auto 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36,
        }}>
          🧬
        </div>
        <h2>{profile?.displayName || 'Unnamed Atom'}</h2>
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          {userId?.slice(0, 12)}...
        </p>
      </div>

      <section style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 8 }}>
          Stats
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['Bonds', bonds.length],
            ['Type', profile?.atomType || 'friend'],
            ['Zone', profile?.zoneId || 'none'],
          ].map(([label, value]) => (
            <div key={label as string} style={{
              background: 'var(--surface)',
              padding: 12, borderRadius: 8,
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{value as string | number}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 8 }}>
          Bonds ({bonds.length})
        </h3>
        {bonds.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
            No bonds yet. Check in at a zone to connect.
          </p>
        ) : (
          bonds.map(bond => (
            <div key={bond.id} style={{
              background: 'var(--surface2)', padding: 12, borderRadius: 8, marginBottom: 6,
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>{bond.atomA === userId ? bond.atomB.slice(0, 8) : bond.atomA.slice(0, 8)}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>
                {bond.status} · {bond.checkInCount} check-ins
              </span>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
