import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import MagnumWalk from './MagnumWalk';
import TrimTabs from './TrimTabs';
import FleetStatus from './FleetStatus';
import { pushK4Entry, getK4NetworkStatus } from '../adapters/k4-bridge';
import { syncGroundTruth } from '../adapters/meatspace-sync';
import { triggerPhosSession } from '../adapters/phos-proxy';
import styles from './OnboardingModule.module.css';

const STORAGE_KEY = 'di_state_v1';

type SessionPhase = 'loading' | 'magnum-walk' | 'trim-tabs' | 'fleet-status' | 'complete' | 'exited';

interface SessionData {
  phase: SessionPhase;
  mode: string;
  updatedAt: number;
  payload?: Record<string, unknown>;
}

function loadSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

function saveSession(data: SessionData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, updatedAt: Date.now() }));
  } catch { /* quota exceeded or unavailable */ }
}

function clearSession() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
}

export type Plane = 'magnum-walk' | 'trim-tabs' | 'fleet-status';

export interface OnboardingData {
  completed: boolean;
  plane: Plane;
  timestamp: number;
}

export interface DeltaIgnitionConfig {
  mode: 'full' | 'minimal';
  resume: boolean;
  onComplete: (data: OnboardingData) => void;
  onExit?: (step: string) => void;
  onError?: (err: Error) => void;
  onBack?: (from: Plane) => void;
  adapters?: {
    k4?: { endpoint: string };
    meatspace?: { groundTruthPath?: string };
    phos?: { endpoint: string };
  };
}

export default function OnboardingModule({ mode, resume, onComplete, onExit, onBack, adapters }: DeltaIgnitionConfig) {
  const [phase, setPhase] = useState<SessionPhase>(mode === 'minimal' ? 'magnum-walk' : 'loading');

  useEffect(() => {
    if (mode === 'minimal') {
      setPhase('magnum-walk');
      return;
    }
    if (resume) {
      const session = loadSession();
      if (session && (session.phase === 'magnum-walk' || session.phase === 'trim-tabs' || session.phase === 'fleet-status')) {
        setPhase(session.phase);
        return;
      }
    }
    setPhase('magnum-walk');
  }, [mode, resume]);

  useEffect(() => {
    if (phase === 'loading' || phase === 'complete' || phase === 'exited') return;
    saveSession({ phase, mode, updatedAt: Date.now() });
  }, [phase, mode]);

  const persistPayload = useCallback((payload: OnboardingData) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) as SessionData : null;
      saveSession({ ...existing, payload: { ...payload } as Record<string, unknown>, updatedAt: Date.now() } as unknown as SessionData);
    } catch { /* noop */ }
  }, []);

  const handleComplete = useCallback((data: OnboardingData) => {
    clearSession();
    onComplete(data);
  }, [onComplete]);

  const handleExit = useCallback((step: string) => {
    clearSession();
    onExit?.(step);
  }, [onExit]);

  const handleBack = useCallback((from: Plane) => {
    onBack?.(from);
    if (from === 'fleet-status') setPhase('trim-tabs');
    else if (from === 'trim-tabs') setPhase('magnum-walk');
    else handleExit('root');
  }, [onBack, handleExit]);

  const runAdapters = useCallback((plane: 'magnum-walk' | 'trim-tabs' | 'fleet-status') => {
    if (!adapters) return;
    const { k4, meatspace, phos } = adapters;
    if (!k4?.endpoint && !meatspace?.groundTruthPath && !phos?.endpoint) return;
    Promise.allSettled([
      k4?.endpoint ? pushK4Entry(k4.endpoint, { event: 'onboarding:step', plane, at: Date.now() }).catch(() => {}) : Promise.resolve(),
      k4?.endpoint ? getK4NetworkStatus(k4.endpoint).catch(() => null) : Promise.resolve(null),
      meatspace?.groundTruthPath ? syncGroundTruth(meatspace.groundTruthPath, { plane, planeData: {}, source: 'runtime', syncedAt: new Date().toISOString(), timestamp: Date.now() }).catch(() => ({})) : Promise.resolve({}),
      phos?.endpoint ? triggerPhosSession(phos.endpoint, { event: 'phase:complete', plane, at: Date.now() }).catch(() => ({})) : Promise.resolve({}),
    ]).catch(() => {});
  }, [adapters]);

  const handlePlaneComplete = useCallback((data: OnboardingData) => {
    persistPayload(data);
    if (data.plane === 'fleet-status') {
      setPhase('complete');
      handleComplete(data);
      runAdapters('fleet-status');
    } else if (data.plane === 'magnum-walk') {
      setPhase('trim-tabs');
      runAdapters('magnum-walk');
    } else {
      setPhase('fleet-status');
      runAdapters('trim-tabs');
    }
  }, [handleComplete, persistPayload, runAdapters]);

  const handleSkip = useCallback(() => {
    if (mode === 'full') setPhase('trim-tabs');
    else handleComplete({ completed: true, plane: 'magnum-walk', timestamp: Date.now() });
  }, [mode, handleComplete]);

  const handleMagnumComplete = useCallback((_data?: OnboardingData) => {
    handlePlaneComplete({ completed: false, plane: 'magnum-walk', timestamp: Date.now() });
  }, [handlePlaneComplete]);

  const handleTrimTabsComplete = useCallback((_data?: OnboardingData) => {
    handlePlaneComplete({ completed: false, plane: 'trim-tabs', timestamp: Date.now() });
  }, [handlePlaneComplete]);

  const handleFleetBack = useCallback(() => handleBack('fleet-status'), [handleBack]);
  const handleTrimBack = useCallback(() => handleBack('trim-tabs'), [handleBack]);

  return (
    <div className={styles.moduleRoot}>
      <AnimatePresence mode="wait">
        {(phase === 'magnum-walk' || phase === 'loading') && (
          <MagnumWalk key="magnum-walk" onComplete={handleMagnumComplete} onSkip={handleSkip} />
        )}
        {phase === 'trim-tabs' && mode === 'full' && <TrimTabs key="trim-tabs" onComplete={handleTrimTabsComplete} onBack={handleTrimBack} />}
        {phase === 'fleet-status' && mode === 'full' && <FleetStatus key="fleet-status" onBack={handleFleetBack} />}
      </AnimatePresence>
    </div>
  );
}
