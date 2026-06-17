import { useGameStore } from '../store/game-store.js';

interface PingModalProps {
  onAccept: (pingId: string) => void;
  onReject: (pingId: string) => void;
}

export function PingModal({ onAccept, onReject }: PingModalProps) {
  const pendingPings = useGameStore(s => s.pendingPings);

  if (pendingPings.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      {pendingPings.map(ping => (
        <div key={ping.pingId} style={{
          background: 'var(--surface)',
          borderRadius: 16, padding: 24, margin: 16,
          maxWidth: 320, width: '100%',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
          <h3 style={{ marginBottom: 8 }}>Incoming Ping</h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: 16 }}>
            {ping.fromUserId} wants to bond in {ping.zoneId}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => onReject(ping.pingId)}
              style={{
                padding: '12px 24px', borderRadius: 8, border: '1px solid #666',
                background: 'transparent', color: '#e0e0e0', cursor: 'pointer',
              }}
            >
              Decline
            </button>
            <button
              onClick={() => onAccept(ping.pingId)}
              style={{
                padding: '12px 24px', borderRadius: 8, border: 'none',
                background: 'var(--accent)', color: '#fff', cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
