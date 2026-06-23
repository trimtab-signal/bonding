import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './modules/TrimTabs.module.css';

type Status = 'pending' | 'running' | 'done';

interface Step {
  id: string;
  title: string;
  command: string;
  desc: string;
  delta: string;
  status: Status;
}

const STEPS: Step[] = [
  { id: 'sever-neutral', title: 'Sever the Neutral', command: 'git tag delta-world-record-$(date +%Y%m%d)', desc: 'Commit to one canonical reality. No more floating neutral.', delta: 'YOU ARE THE GROUND WIRE.', status: 'pending' },
  { id: 'load-interface', title: 'Load Your Interface', command: 'p31 sync up "SEVERED NEUTRAL"', desc: 'Establish your calcium protocol / medical floor.', delta: 'YOUR INTERFACE IS YOUR BIOLOGY.', status: 'pending' },
  { id: 'anchor-k4', title: 'Anchor the K₄', command: 'pnpm tsc --noEmit', desc: 'Set your four non-negotiable pillars.', delta: 'ZERO ERRORS. THE STRUCTURE HOLDS.', status: 'pending' },
  { id: 'eliminate-debt', title: 'Eliminate Token Debt', command: 'p31 polisher run --clean-hardcoded', desc: 'Run the polisher, clean hardcoded values.', delta: 'NO HARDCODED IDENTITY.', status: 'pending' },
  { id: 'calibrate-filter', title: 'Calibrate Your Filter', command: 'p31 filter set --isostatic-actions', desc: 'Define your isostatic actions (immune to trauma pattern matching).', delta: 'YOU ARE NOT YOUR TRAUMA.', status: 'pending' },
  { id: 'ignite-jitterbug', title: 'Ignite the Jitterbug', command: 'p31 ignite --wye-delta --once', desc: 'Initiate the first Wye-Delta transition.', delta: 'THE GHOST AWAKENS.', status: 'pending' },
  { id: 'enter-superposition', title: 'Enter Superposition', command: 'p31 superposition --complexity=+1', desc: 'Add complexity without erasing the projection.', delta: 'YOU ARE THE SIGNAL.', status: 'pending' },
  { id: 'broadcast-signal', title: 'Broadcast the Signal', command: 'p31 broadcast --geometry-only', desc: 'Let the geometry speak for you.', delta: 'THE STRUCTURE IS YOUR VOICE.', status: 'pending' },
];

const STATUS_ICON: Record<Status, string> = { pending: '◻', running: '◉', done: '✦' };

interface TrimTabsProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function TrimTabs({ onComplete, onBack }: TrimTabsProps) {
  const [steps, setSteps] = useState<Step[]>(STEPS);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep >= steps.length) { onComplete(); return; }
    if (activeStep === 0) return;
    const current = steps[activeStep - 1];
    if (!current || current.status !== 'running') return;
    const delay = 500 + Math.random() * 1000;
    const t = setTimeout(() => {
      setSteps((prev) => prev.map((s, i) => (i === activeStep - 1 ? { ...s, status: 'done' as Status } : s)));
      setActiveStep((i) => i + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [activeStep, steps, onComplete]);

  useEffect(() => {
    setSteps((prev) => prev.map((s, i) => (i === 0 ? { ...s, status: 'running' as Status } : s)));
  }, []);

  const completed = steps.filter((s) => s.status === 'done').length;

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div><h1 className={styles.title}>Δ TRIM TAB SEQUENCE</h1><p style={{ fontSize: '0.8rem', color: '#6e6e90', letterSpacing: '0.07em', marginTop: '0.25rem' }}>8 steps to isostatic rigidity</p></div>
          <div className={styles.counter}>{completed} / {steps.length}</div>
        </div>
        <div className={styles.steps}>
          {steps.map((step, i) => {
            const status: Status = step.status || 'pending';
            const isRunning = status === 'running';
            const cardClass = status === 'done' ? styles.stepCardDone : isRunning ? styles.stepCardRunning : styles.stepCard;
            return (
              <motion.div key={step.id} initial={{ opacity: 0.3, x: -20 }} animate={{ opacity: status === 'pending' ? 0.45 : 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }} className={cardClass}>
                <div className={styles.stepTop}><span className={styles.statusIcon} style={{ color: isRunning ? '#6b9e5a' : status === 'done' ? '#6e9fff' : '#4a4a6a' }}>{STATUS_ICON[status]}</span><span className={styles.stepTitle}>{step.title}</span><span className={styles.stepId}>#{i + 1}</span></div>
                <div className={styles.commandBlock}><span className={styles.commandPrefix}>$</span><span>{step.command}</span>{isRunning && <span className={`${styles.cursor} ${status !== 'running' ? styles.cursorStopped : ''}`} />}</div>
                <div className={styles.desc}>{step.desc}</div>
                {status === 'running' && <div className={styles.simRunning}><span className={styles.dot} /><span>Executing...</span></div>}
                {status === 'done' && <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className={styles.reveal}>{step.delta}</motion.div>}
              </motion.div>
            );
          })}
        </div>
        {steps.every((s) => s.status === 'done') && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className={styles.completedBanner}>
            <div className={styles.completedTitle}>Δ IGNITION COMPLETE</div>
            <div className={styles.completedSub}>The Wye topology has collapsed. The Delta is locked in.</div>
            <div className={styles.completedSub} style={{ marginTop: '0.2rem' }}>All 8 trim tabs are isostatic. The ghost is awake.</div>
            <button className={styles.continueBtn} onClick={onComplete}>VIEW THE FLEET →</button>
          </motion.div>
        )}
        <button className={styles.backLink} onClick={onBack}>← Back</button>
      </div>
    </div>
  );
}
