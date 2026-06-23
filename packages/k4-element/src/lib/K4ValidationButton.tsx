import { useState, useCallback } from 'react';
import { Kerberos4Element } from './Kerberos4Element';
import { K4Edge, K4ValidationResult, buildDefaultEdges, validateK4 } from '../lib/k4-geometry';
import styles from './K4ValidationButton.module.css';

export interface K4ValidationButtonProps {
  onValid?: (result: K4ValidationResult) => void;
  onInvalid?: (result: K4ValidationResult) => void;
  label?: string;
  className?: string;
}

const COMMANDS = [
  { cmd: 'validate node A', valid: true, label: 'AB' },
  { cmd: 'validate node B', valid: true, label: 'AB' },
  { cmd: 'validate node C', valid: false, label: 'AC' },
  { cmd: 'validate node D', valid: false, label: 'AD' },
  { cmd: 'check edge AB', valid: true, label: 'AB' },
  { cmd: 'check edge BC', valid: true, label: 'BC' },
  { cmd: 'check edge CD', valid: false, label: 'CD' },
  { cmd: 'trace topology', valid: true, label: null },
  { cmd: 'probe D', valid: false, label: 'AD' },
  { cmd: 'ping ALL', valid: true, label: null },
];

export default function K4ValidationButton({
  onValid,
  onInvalid,
  label = 'VALIDATE K₄',
  className = '',
}: K4ValidationButtonProps) {
  const [edges, setEdges] = useState<K4Edge[]>(() => buildDefaultEdges());
  const [cmdIndex, setCmdIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [state, setState] = useState<'idle' | 'walking' | 'valid' | 'invalid'>('idle');

  const runValidation = useCallback(() => {
    if (state === 'walking') return;
    setState('walking');
    setCmdIndex(0);
    setHistory([]);
    setEdges(buildDefaultEdges());

    let i = 0;
    const tick = () => {
      if (i >= COMMANDS.length) {
        const result = validateK4(edges);
        if (result.valid) {
          setState('valid');
          onValid?.(result);
        } else {
          setState('invalid');
          onInvalid?.(result);
        }
        return;
      }
      const entry = COMMANDS[i]!;
      setHistory((prev) => [...prev, `$ ${entry.cmd}`]);
      setCmdIndex(i);
      if (entry.label) {
        setEdges((prev) =>
          prev.map((e) =>
            e.label === entry.label ? { ...e, checked: true, valid: entry.valid } : e,
          ),
        );
        if (!entry.valid) setHistory((prev) => [...prev, `→ Edge ${entry.label}: DEGRADED`]);
        else setHistory((prev) => [...prev, `→ ${entry.label}: OK`]);
      } else if (entry.cmd === 'ping ALL') {
        setEdges((prev) => prev.map((e) => ({ ...e, checked: true })));
        setHistory((prev) => [...prev, `→ All 6 edges probed.`]);
      } else {
        setHistory((prev) => [...prev, `→ No edge change.`]);
      }
      i++;
      setTimeout(tick, 380);
    };
    setTimeout(tick, 200);
  }, [state, edges, onValid, onInvalid]);

  const reset = useCallback(() => {
    setEdges(buildDefaultEdges());
    setHistory([]);
    setCmdIndex(0);
    setState('idle');
  }, []);

  return (
    <div className={`${styles.wrap} ${className}`}>
      <Kerberos4Element
        edges={edges}
        validationState={state}
        highlightEdges={
          state === 'valid'
            ? [
                [0, 1],
                [2, 3],
              ]
            : undefined
        }
      />
      <div className={styles.terminal}>
        <div className={styles.header}>
          <span className={styles.dotRed} />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen} />
          <span className={styles.title}>k4-validator</span>
          <button className={styles.resetBtn} onClick={reset}>
            Reset
          </button>
        </div>
        <div className={styles.history}>
          {history.map((line, i) => (
            <div
              key={i}
              className={`${styles.line} ${line.startsWith('→') ? (line.includes('DEGRADED') || line.includes('ERROR') ? styles.stderr : styles.stdout) : styles.user}`}
            >
              {line}
            </div>
          ))}
          {state === 'walking' && (
            <div className={styles.line + ' ' + styles.user}>
              $ {COMMANDS[cmdIndex]?.cmd ?? ''}
              <span className={styles.cursor} />
            </div>
          )}
        </div>
        <button
          className={`${styles.button} ${state === 'valid' ? styles.valid : state === 'invalid' ? styles.invalid : ''}`}
          onClick={runValidation}
          disabled={state === 'walking'}
        >
          {state === 'valid'
            ? '✓ K₄ VALID'
            : state === 'invalid'
              ? '✕ INVALID'
              : state === 'walking'
                ? 'VALIDATING...'
                : label}
        </button>
      </div>
    </div>
  );
}
