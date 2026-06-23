import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
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
function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function saveSession(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, updatedAt: Date.now() }));
  } catch {
    /* quota exceeded or unavailable */
  }
}
function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
export default function OnboardingModule({ mode, resume, onComplete, onExit, onBack, adapters }) {
  const [phase, setPhase] = useState(mode === 'minimal' ? 'magnum-walk' : 'loading');
  useEffect(() => {
    if (mode === 'minimal') {
      setPhase('magnum-walk');
      return;
    }
    if (resume) {
      const session = loadSession();
      if (
        session &&
        (session.phase === 'magnum-walk' ||
          session.phase === 'trim-tabs' ||
          session.phase === 'fleet-status')
      ) {
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
  const persistPayload = useCallback((payload) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : null;
      saveSession({ ...existing, payload: { ...payload }, updatedAt: Date.now() });
    } catch {
      /* noop */
    }
  }, []);
  const handleComplete = useCallback(
    (data) => {
      clearSession();
      onComplete(data);
    },
    [onComplete],
  );
  const handleExit = useCallback(
    (step) => {
      clearSession();
      onExit?.(step);
    },
    [onExit],
  );
  const handleBack = useCallback(
    (from) => {
      onBack?.(from);
      if (from === 'fleet-status') setPhase('trim-tabs');
      else if (from === 'trim-tabs') setPhase('magnum-walk');
      else handleExit('root');
    },
    [onBack, handleExit],
  );
  const runAdapters = useCallback(
    (plane) => {
      if (!adapters) return;
      const { k4, meatspace, phos } = adapters;
      if (!k4?.endpoint && !meatspace?.groundTruthPath && !phos?.endpoint) return;
      Promise.allSettled([
        k4?.endpoint
          ? pushK4Entry(k4.endpoint, { event: 'onboarding:step', plane, at: Date.now() }).catch(
              () => {},
            )
          : Promise.resolve(),
        k4?.endpoint ? getK4NetworkStatus(k4.endpoint).catch(() => null) : Promise.resolve(null),
        meatspace?.groundTruthPath
          ? syncGroundTruth(meatspace.groundTruthPath, {
              plane,
              planeData: {},
              source: 'runtime',
              syncedAt: new Date().toISOString(),
              timestamp: Date.now(),
            }).catch(() => ({}))
          : Promise.resolve({}),
        phos?.endpoint
          ? triggerPhosSession(phos.endpoint, {
              event: 'phase:complete',
              plane,
              at: Date.now(),
            }).catch(() => ({}))
          : Promise.resolve({}),
      ]).catch(() => {});
    },
    [adapters],
  );
  const handlePlaneComplete = useCallback(
    (data) => {
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
    },
    [handleComplete, persistPayload, runAdapters],
  );
  const handleSkip = useCallback(() => {
    if (mode === 'full') setPhase('trim-tabs');
    else handleComplete({ completed: true, plane: 'magnum-walk', timestamp: Date.now() });
  }, [mode, handleComplete]);
  const handleMagnumComplete = useCallback(
    (_data) => {
      handlePlaneComplete({ completed: false, plane: 'magnum-walk', timestamp: Date.now() });
    },
    [handlePlaneComplete],
  );
  const handleTrimTabsComplete = useCallback(
    (_data) => {
      handlePlaneComplete({ completed: false, plane: 'trim-tabs', timestamp: Date.now() });
    },
    [handlePlaneComplete],
  );
  const handleFleetBack = useCallback(() => handleBack('fleet-status'), [handleBack]);
  const handleTrimBack = useCallback(() => handleBack('trim-tabs'), [handleBack]);
  return _jsx('div', {
    className: styles.moduleRoot,
    children: _jsxs(AnimatePresence, {
      mode: 'wait',
      children: [
        (phase === 'magnum-walk' || phase === 'loading') &&
          _jsx(MagnumWalk, { onComplete: handleMagnumComplete, onSkip: handleSkip }, 'magnum-walk'),
        phase === 'trim-tabs' &&
          mode === 'full' &&
          _jsx(
            TrimTabs,
            { onComplete: handleTrimTabsComplete, onBack: handleTrimBack },
            'trim-tabs',
          ),
        phase === 'fleet-status' &&
          mode === 'full' &&
          _jsx(FleetStatus, { onBack: handleFleetBack }, 'fleet-status'),
      ],
    }),
  });
}
//# sourceMappingURL=Orchestrator.js.map
