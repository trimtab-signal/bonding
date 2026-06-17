import { useEffect, useState } from 'react';
import { ZoneMap } from '../components/ZoneMap.js';
import { PingModal } from '../components/PingModal.js';
import { HealthBanner } from '../components/HealthBanner.js';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { useHealth } from '../hooks/useHealth.js';
import { useGameStore } from '../store/game-store.js';
import type { ZoneId } from '@bonding/shared-types';

export function Home() {
  const { connect, disconnect, send, checkIn, setZone } = useWebSocket();
  const { connected, userId, bonds, messages, setEnergyLevel } = useGameStore();
  const { health } = useHealth();
  const [selectedZone, setSelectedZone] = useState<ZoneId | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showLog, setShowLog] = useState(false);

  // Sync health data into store
  useEffect(() => {
    if (health) setEnergyLevel(health.energyLevel);
  }, [health]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.longitude, pos.coords.latitude]),
        () => {}, // ignore errors for now
        { enableHighAccuracy: false, timeout: 10000 }
      );
    }
  }, []);

  const handleZoneSelect = (zone: ZoneId) => {
    setSelectedZone(zone);
    setZone(zone);
  };

  const handleCheckIn = () => {
    if (selectedZone) {
      checkIn(selectedZone);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface)', padding: '12px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div>
          <span style={{ fontSize: 20, fontWeight: 700 }}>🧬 BONDING</span>
          <span style={{
            display: 'inline-block', marginLeft: 8, width: 8, height: 8,
            borderRadius: '50%', background: connected ? '#4caf50' : '#f44336',
          }} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
            {userId?.slice(0, 8)}
          </span>
          <button
            onClick={() => setShowLog(!showLog)}
            style={{
              padding: '6px 12px', borderRadius: 6, border: '1px solid #555',
              background: 'transparent', color: '#e0e0e0', fontSize: 12, cursor: 'pointer',
            }}
          >
            {showLog ? 'Map' : 'Log'}
          </button>
        </div>
      </header>

      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Health banner */}
        <HealthBanner />

        {/* Body */}
        {showLog ? (
        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          <h3 style={{ marginBottom: 12 }}>Activity Log</h3>
          {messages.slice().reverse().map((m, i) => (
            <div key={i} style={{
              padding: '8px 12px', marginBottom: 4, borderRadius: 6,
              background: 'var(--surface2)', fontSize: 13,
              borderLeft: `3px solid ${
                m.type === 'error' ? '#f44336' :
                m.type === 'success' ? '#4caf50' :
                m.type === 'ping' ? '#ff9800' : '#555'
              }`,
            }}>
              {typeof m.data === 'string' ? m.data : JSON.stringify(m.data)}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, position: 'relative' }}>
          <ZoneMap
            onZoneSelect={handleZoneSelect}
            selectedZone={selectedZone}
            userLocation={userLocation}
          />
        </div>
      )}
      </main>

      {/* Bottom bar */}
      <div style={{
        background: 'var(--surface)',
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <div style={{ flex: 1 }}>
          {selectedZone ? (
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>
              Zone: <strong style={{ color: '#fff' }}>{selectedZone}</strong>
            </span>
          ) : (
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>
              Select a zone
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
          {bonds.length} bond{bonds.length !== 1 ? 's' : ''}
        </div>
        <button
          onClick={handleCheckIn}
          disabled={!selectedZone || !connected}
          style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            background: selectedZone && connected ? 'var(--accent)' : '#444',
            color: selectedZone && connected ? '#fff' : '#888',
            fontWeight: 600, cursor: selectedZone && connected ? 'pointer' : 'default',
          }}
        >
          Check In
        </button>
      </div>

      {/* Ping modal */}
      <PingModal
        onAccept={(pid) => send({ type: 'accept_ping', pingId: pid })}
        onReject={(pid) => send({ type: 'reject_ping', pingId: pid })}
      />
    </div>
  );
}
