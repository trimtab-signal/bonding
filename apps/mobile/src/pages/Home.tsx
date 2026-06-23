import { useEffect, useState } from 'react';
import { ZoneMap } from '../components/ZoneMap';
import { PingModal } from '../components/PingModal';
import { HealthBanner } from '../components/HealthBanner';
import { NearbySheet } from '../components/NearbySheet';
import { ReactionModal } from '../components/ReactionModal';
import { WitnessModal } from '../components/WitnessModal';
import { Button, EmptyState, Skeleton } from '../components/ui';
import type { WitnessRequest } from '../components/WitnessModal';
import { useWebSocket } from '../hooks/useWebSocket';
import { useHealth } from '../hooks/useHealth';
import { useGameStore } from '../store/game-store';
import { useToastStore } from '../store/toast-slice';
import type { ZoneId } from '@meatspace/shared-types';
import styles from './Home.module.css';

export function Home() {
  const { connect, disconnect, send, checkIn, setZone } = useWebSocket();
  const { connected, userId, nearbyAtoms, messages, bonds } = useGameStore();
  const { health } = useHealth();
  const addToast = useToastStore((s) => s.addToast);
  const [selectedZone, setSelectedZone] = useState<ZoneId | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [showLog, setShowLog] = useState(false);
  const [witnessReq, setWitnessReq] = useState<WitnessRequest | null>(null);
  const [reactTarget, setReactTarget] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    if (health) useGameStore.getState().setEnergyLevel(health.energyLevel);
  }, [health]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.longitude, pos.coords.latitude]);
          setLoading(false);
        },
        () => setLoading(false),
        { enableHighAccuracy: false, timeout: 10000 },
      );
    } else {
      setLoading(false);
    }
  }, []);

  const handleZoneSelect = (zone: ZoneId) => {
    setSelectedZone(zone);
    setZone(zone);
  };
  const handleCheckIn = () => {
    if (selectedZone) checkIn(selectedZone);
  };
  const handlePing = (targetId: string) => {
    if (selectedZone) {
      send({ type: 'ping', targetUserId: targetId, zoneId: selectedZone });
      addToast({ type: 'info', title: 'Ping sent' });
    }
  };
  const handleReact = (reaction: string, target: string) => {
    send({
      type: 'submit_reaction',
      bondId: target,
      reactionType: 'check_in',
      description: reaction,
    });
    addToast({ type: 'success', title: 'Reaction sent' });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logo}>🧬 BONDING</span>
          <span className={`${styles.dot} ${connected ? styles.online : styles.offline}`} />
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userId}>{userId?.slice(0, 8)}</span>
          <Button variant="ghost" size="sm" onClick={() => setShowLog(!showLog)}>
            {showLog ? 'Map' : 'Log'}
          </Button>
        </div>
      </header>

      <main className={styles.main}>
        <HealthBanner />

        {loading ? (
          <div className={styles.loadingWrap}>
            <Skeleton variant="rect" width="100%" height="300px" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
        ) : showLog ? (
          <div className={styles.log}>
            <h3 className={styles.logTitle}>Activity Log</h3>
            {messages.length === 0 ? (
              <EmptyState title="No activity yet" description="Check in to start building bonds." />
            ) : (
              messages
                .slice()
                .reverse()
                .map((m, i) => (
                  <div
                    key={i}
                    className={`${styles.logItem} ${styles[`log${m.type.charAt(0).toUpperCase() + m.type.slice(1)}`] || ''}`}
                  >
                    {typeof m.data === 'string' ? m.data : JSON.stringify(m.data)}
                  </div>
                ))
            )}
          </div>
        ) : (
          <div className={styles.mapWrap}>
            <ZoneMap
              onZoneSelect={handleZoneSelect}
              selectedZone={selectedZone}
              userLocation={userLocation}
            />
          </div>
        )}

        <NearbySheet
          atoms={nearbyAtoms}
          onPing={handlePing}
          onReact={(uid) => setReactTarget(uid)}
        />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          {selectedZone ? (
            <span>
              Zone: <strong>{selectedZone}</strong>
            </span>
          ) : (
            <span>Select a zone</span>
          )}
        </div>
        <span className={styles.bondCount}>
          {bonds.length} bond{bonds.length !== 1 ? 's' : ''}
        </span>
        <Button
          variant="primary"
          size="md"
          disabled={!selectedZone || !connected}
          onClick={handleCheckIn}
        >
          Check In
        </Button>
      </footer>

      <PingModal
        onAccept={(pid) => send({ type: 'accept_ping', pingId: pid })}
        onReject={(pid) => send({ type: 'reject_ping', pingId: pid })}
      />
      <ReactionModal
        open={!!reactTarget}
        onClose={() => setReactTarget(null)}
        onReact={handleReact}
        targetUserId={reactTarget || ''}
      />
      <WitnessModal
        request={witnessReq}
        onAccept={(n) => {
          send({
            type: 'provide_witness',
            claimerId: '',
            geohashPrefix: '',
            timestamp: Date.now(),
            nonce: n,
            signature: '',
          });
          setWitnessReq(null);
        }}
        onReject={() => {
          setWitnessReq(null);
        }}
      />
    </div>
  );
}
