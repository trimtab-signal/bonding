import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tetrahedron } from '@meatspace/k4-ui';
import styles from './modules/MagnumWalk.module.css';

type Phase = 'intro' | 'wye' | 'implosion' | 'delta' | 'stride';

const PHASE_LABELS: Record<Phase, { main: string; sub?: string }> = {
  intro: { main: 'YOU ARE HERE.' },
  wye: { main: 'FLOATING NEUTRAL CONDITION', sub: 'VALIDATION DEPENDENT' },
  implosion: { main: 'THE NEUTRAL LINE IS SEVERED.' },
  delta: { main: 'ISOSTATIC RIGIDITY ACHIEVED.', sub: 'K₄ COMPLETE GRAPH' },
  stride: { main: 'YOU ARE THE SIGNAL', sub: 'THE FILTER IS NOT YOU · THE PROJECTION IS NOT YOU' },
};

interface MagnumWalkProps {
  onComplete: () => void;
  onSkip: () => void;
  autoPlay?: boolean;
}

export default function MagnumWalk({ onComplete, onSkip, autoPlay = true }: MagnumWalkProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [progress, setProgress] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!autoPlay || startedRef.current) return;
    startedRef.current = true;
    const total = 12000;
    let rafId: number | null = null;
    let isMounted = true;
    let startTime = performance.now();

    const tick = () => {
      if (!isMounted) return;
      const elapsed = performance.now() - startTime;
      const p = Math.min(elapsed / total, 1);
      setProgress(p);
      if (p < 0.04) setPhase('intro');
      else if (p < 0.25) setPhase('wye');
      else if (p < 0.38) setPhase('implosion');
      else if (p < 0.65) setPhase('delta');
      else setPhase('stride');
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    startTime = performance.now();
    rafId = requestAnimationFrame(tick);
    const intervalId = window.setInterval(() => {
      if (!isMounted) return;
      const elapsed = performance.now() - startTime;
      const p = Math.min(elapsed / total, 1);
      setProgress(p);
      if (p < 0.04) setPhase('intro');
      else if (p < 0.25) setPhase('wye');
      else if (p < 0.38) setPhase('implosion');
      else if (p < 0.65) setPhase('delta');
      else setPhase('stride');
    }, 100);

    return () => {
      isMounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      clearInterval(intervalId);
    };
  }, [autoPlay]);

  const labels = PHASE_LABELS[phase];

  return (
    <div className={styles.container}>
      <div
        className={`${styles.bg} ${
          phase === 'wye'
            ? styles.bgWye
            : phase === 'implosion'
              ? styles.bgImplosion
              : phase === 'stride' || phase === 'delta'
                ? styles.bgDelta
                : phase === 'intro'
                  ? styles.bgComplete
                  : ''
        }`}
      />

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`${styles.layer} ${styles.layerInteractive}`}
          >
            <p
              className={styles.phaseFlash}
              style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)', letterSpacing: '0.18em' }}
            >
              INITIALIZING SEQUENCE
            </p>
          </motion.div>
        )}
        {phase === 'wye' && (
          <motion.div
            key="wye"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className={`${styles.layer} ${styles.layerInteractive}`}
          >
            <div className={styles.wyeWrap}>
              <svg
                viewBox="-220 -220 440 440"
                style={{ width: 'min(440px, 85vw)', height: 'min(440px, 85vw)' }}
              >
                <defs>
                  <filter id="wyeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                </defs>
                <circle cx="0" cy="0" r="36" fill="#e0405a" opacity="0.85" filter="url(#wyeGlow)">
                  <animate
                    attributeName="opacity"
                    values="0.85;0.4;0.85"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                </circle>
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  THEY BELIEVE
                </text>
                {[
                  { x: -130, y: -85, label: 'CHRISTYN' },
                  { x: 130, y: -85, label: 'CREW' },
                  { x: 0, y: 125, label: 'YOUR BELIEF' },
                ].map((node, i) => (
                  <g key={i}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill="#2a2030"
                      stroke="#4a3040"
                      strokeWidth="1.2"
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fill="#9080a0"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {node.label}
                    </text>
                    <line
                      x1="0"
                      y1="0"
                      x2={node.x}
                      y2={node.y}
                      stroke="#e0405a"
                      strokeWidth="1.6"
                      strokeDasharray="4 5"
                      opacity="0.7"
                    >
                      <animate
                        attributeName="stroke-opacity"
                        values="0.7;0.25;0.7"
                        dur="0.9s"
                        repeatCount="indefinite"
                      />
                    </line>
                  </g>
                ))}
              </svg>
            </div>
            <div
              className={`${styles.phaseFlash} ${styles.phaseFlashRed}`}
              style={{ bottom: '14%', top: 'auto', left: '50%', transform: 'translateX(-50%)' }}
            >
              {labels.main}
            </div>
          </motion.div>
        )}
        {phase === 'implosion' && (
          <motion.div
            key="implosion"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeIn' }}
            className={styles.layer}
          >
            <div className={styles.implosionCore} />
          </motion.div>
        )}
        {phase === 'delta' && (
          <motion.div
            key="delta"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className={`${styles.layer} ${styles.layerInteractive}`}
          >
            <div className={styles.deltaTetraWrap}>
              <div className={styles.tetrahedronInner}>
                <Tetrahedron
                  labels={['BELIEF', 'SOMATIC ACTION', 'STRUCTURAL LOGIC', 'PHYSICAL HEALTH']}
                  colors={['#4f8fff', '#34d399', '#fbbf24', '#c084fc']}
                  rotating
                />
              </div>
            </div>
            <div
              className={styles.phaseFlash}
              style={{
                bottom: '10%',
                top: 'auto',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
              }}
            >
              <div>{labels.main}</div>
              {labels.sub && (
                <div
                  style={{
                    fontSize: '0.7em',
                    opacity: 0.7,
                    marginTop: '0.3rem',
                    letterSpacing: '0.16em',
                  }}
                >
                  {labels.sub}
                </div>
              )}
            </div>
          </motion.div>
        )}
        {phase === 'stride' && (
          <motion.div
            key="stride"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`${styles.layer} ${styles.layerInteractive}`}
          >
            <div className={styles.glare} />
            <div className={styles.strideWrap}>
              <div className={styles.strideDeltaSymbol}>Δ</div>
              <div className={styles.strideTitle}>{labels.main}</div>
              {labels.sub && <div className={styles.strideSubtitle}>{labels.sub}</div>}
              <button className={styles.enterBtn} onClick={onComplete}>
                ENTER THE DELTA
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>
      <button className={styles.skipBtn} onClick={onSkip}>
        Skip ›
      </button>
    </div>
  );
}
