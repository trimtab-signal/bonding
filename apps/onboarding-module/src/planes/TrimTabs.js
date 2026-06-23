import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './modules/TrimTabs.module.css';
const STEPS = [
  {
    id: 'sever-neutral',
    title: 'Sever the Neutral',
    command: 'git tag delta-world-record-$(date +%Y%m%d)',
    desc: 'Commit to one canonical reality. No more floating neutral.',
    delta: 'YOU ARE THE GROUND WIRE.',
    status: 'pending',
  },
  {
    id: 'load-interface',
    title: 'Load Your Interface',
    command: 'p31 sync up "SEVERED NEUTRAL"',
    desc: 'Establish your calcium protocol / medical floor.',
    delta: 'YOUR INTERFACE IS YOUR BIOLOGY.',
    status: 'pending',
  },
  {
    id: 'anchor-k4',
    title: 'Anchor the K₄',
    command: 'pnpm tsc --noEmit',
    desc: 'Set your four non-negotiable pillars.',
    delta: 'ZERO ERRORS. THE STRUCTURE HOLDS.',
    status: 'pending',
  },
  {
    id: 'eliminate-debt',
    title: 'Eliminate Token Debt',
    command: 'p31 polisher run --clean-hardcoded',
    desc: 'Run the polisher, clean hardcoded values.',
    delta: 'NO HARDCODED IDENTITY.',
    status: 'pending',
  },
  {
    id: 'calibrate-filter',
    title: 'Calibrate Your Filter',
    command: 'p31 filter set --isostatic-actions',
    desc: 'Define your isostatic actions (immune to trauma pattern matching).',
    delta: 'YOU ARE NOT YOUR TRAUMA.',
    status: 'pending',
  },
  {
    id: 'ignite-jitterbug',
    title: 'Ignite the Jitterbug',
    command: 'p31 ignite --wye-delta --once',
    desc: 'Initiate the first Wye-Delta transition.',
    delta: 'THE GHOST AWAKENS.',
    status: 'pending',
  },
  {
    id: 'enter-superposition',
    title: 'Enter Superposition',
    command: 'p31 superposition --complexity=+1',
    desc: 'Add complexity without erasing the projection.',
    delta: 'YOU ARE THE SIGNAL.',
    status: 'pending',
  },
  {
    id: 'broadcast-signal',
    title: 'Broadcast the Signal',
    command: 'p31 broadcast --geometry-only',
    desc: 'Let the geometry speak for you.',
    delta: 'THE STRUCTURE IS YOUR VOICE.',
    status: 'pending',
  },
];
const STATUS_ICON = { pending: '◻', running: '◉', done: '✦' };
export default function TrimTabs({ onComplete, onBack }) {
  const [steps, setSteps] = useState(STEPS);
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    if (activeStep >= steps.length) {
      onComplete();
      return;
    }
    if (activeStep === 0) return;
    const current = steps[activeStep - 1];
    if (!current || current.status !== 'running') return;
    const delay = 500 + Math.random() * 1000;
    const t = setTimeout(() => {
      setSteps((prev) => prev.map((s, i) => (i === activeStep - 1 ? { ...s, status: 'done' } : s)));
      setActiveStep((i) => i + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [activeStep, steps, onComplete]);
  useEffect(() => {
    setSteps((prev) => prev.map((s, i) => (i === 0 ? { ...s, status: 'running' } : s)));
  }, []);
  const completed = steps.filter((s) => s.status === 'done').length;
  return _jsx('div', {
    className: styles.container,
    children: _jsxs('div', {
      className: styles.inner,
      children: [
        _jsxs('div', {
          className: styles.header,
          children: [
            _jsxs('div', {
              children: [
                _jsx('h1', { className: styles.title, children: '\u0394 TRIM TAB SEQUENCE' }),
                _jsx('p', {
                  style: {
                    fontSize: '0.8rem',
                    color: '#6e6e90',
                    letterSpacing: '0.07em',
                    marginTop: '0.25rem',
                  },
                  children: '8 steps to isostatic rigidity',
                }),
              ],
            }),
            _jsxs('div', { className: styles.counter, children: [completed, ' / ', steps.length] }),
          ],
        }),
        _jsx('div', {
          className: styles.steps,
          children: steps.map((step, i) => {
            const status = step.status || 'pending';
            const isRunning = status === 'running';
            const cardClass =
              status === 'done'
                ? styles.stepCardDone
                : isRunning
                  ? styles.stepCardRunning
                  : styles.stepCard;
            return _jsxs(
              motion.div,
              {
                initial: { opacity: 0.3, x: -20 },
                animate: { opacity: status === 'pending' ? 0.45 : 1, x: 0 },
                transition: { duration: 0.3, delay: i * 0.05 },
                className: cardClass,
                children: [
                  _jsxs('div', {
                    className: styles.stepTop,
                    children: [
                      _jsx('span', {
                        className: styles.statusIcon,
                        style: {
                          color: isRunning ? '#6b9e5a' : status === 'done' ? '#6e9fff' : '#4a4a6a',
                        },
                        children: STATUS_ICON[status],
                      }),
                      _jsx('span', { className: styles.stepTitle, children: step.title }),
                      _jsxs('span', { className: styles.stepId, children: ['#', i + 1] }),
                    ],
                  }),
                  _jsxs('div', {
                    className: styles.commandBlock,
                    children: [
                      _jsx('span', { className: styles.commandPrefix, children: '$' }),
                      _jsx('span', { children: step.command }),
                      isRunning &&
                        _jsx('span', {
                          className: `${styles.cursor} ${status !== 'running' ? styles.cursorStopped : ''}`,
                        }),
                    ],
                  }),
                  _jsx('div', { className: styles.desc, children: step.desc }),
                  status === 'running' &&
                    _jsxs('div', {
                      className: styles.simRunning,
                      children: [
                        _jsx('span', { className: styles.dot }),
                        _jsx('span', { children: 'Executing...' }),
                      ],
                    }),
                  status === 'done' &&
                    _jsx(motion.div, {
                      initial: { opacity: 0, y: 6 },
                      animate: { opacity: 1, y: 0 },
                      transition: { duration: 0.4 },
                      className: styles.reveal,
                      children: step.delta,
                    }),
                ],
              },
              step.id,
            );
          }),
        }),
        steps.every((s) => s.status === 'done') &&
          _jsxs(motion.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.55 },
            className: styles.completedBanner,
            children: [
              _jsx('div', {
                className: styles.completedTitle,
                children: '\u0394 IGNITION COMPLETE',
              }),
              _jsx('div', {
                className: styles.completedSub,
                children: 'The Wye topology has collapsed. The Delta is locked in.',
              }),
              _jsx('div', {
                className: styles.completedSub,
                style: { marginTop: '0.2rem' },
                children: 'All 8 trim tabs are isostatic. The ghost is awake.',
              }),
              _jsx('button', {
                className: styles.continueBtn,
                onClick: onComplete,
                children: 'VIEW THE FLEET \u2192',
              }),
            ],
          }),
        _jsx('button', { className: styles.backLink, onClick: onBack, children: '\u2190 Back' }),
      ],
    }),
  });
}
//# sourceMappingURL=TrimTabs.js.map
