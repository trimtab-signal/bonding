import { useGameStore } from '../store/game-store';
import { Modal, Button } from './ui';

interface PingModalProps {
  onAccept: (pingId: string) => void;
  onReject: (pingId: string) => void;
}

export function PingModal({ onAccept, onReject }: PingModalProps) {
  const pendingPings = useGameStore((s) => s.pendingPings);
  if (pendingPings.length === 0) return null;

  return (
    <Modal open={true} onClose={() => {}}>
      {pendingPings.map((ping) => (
        <div
          key={ping.pingId}
          style={{
            textAlign: 'center',
            padding: '0.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '3rem' }}>🔔</span>
          <h3>Incoming Ping</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            {ping.fromUserId.slice(0, 8)} wants to bond in {ping.zoneId}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
            <Button variant="ghost" fullWidth onClick={() => onReject(ping.pingId)}>
              Decline
            </Button>
            <Button variant="primary" fullWidth onClick={() => onAccept(ping.pingId)}>
              Accept
            </Button>
          </div>
        </div>
      ))}
    </Modal>
  );
}
