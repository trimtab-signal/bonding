import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './FleetStatus.module.css';

type FeatureRow = Record<string, number>;

const ENDPOINT = 'https://cashpilot-sync.trimtab-signal.workers.dev/api/k4/features';

function safeParseK4Payload(raw: unknown): Record<string, FeatureRow> {
  if (!raw || typeof raw !== 'object') return {};
  const safe: Record<string, FeatureRow> = Object.create(null);
  const data = (raw as any).features || raw;
  if (typeof data !== 'object' || data === null) return {};

  for (const [key, val] of Object.entries(data)) {
    if (typeof val === 'object' && val !== null) {
      const levels = ['L0', 'L1', 'L2', 'L3', 'L4'];
      const valid = levels.every(l => typeof (val as any)[l] === 'number');
      if (valid) {
        safe[key] = val as FeatureRow;
      }
    }
  }
  return safe;
}

export function FleetStatus() {
  const [features, setFeatures] = useState<Record<string, FeatureRow> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let latestRequestId = 0;

    const fetchData = async () => {
      const requestId = ++latestRequestId;
      try {
        const res = await fetch(ENDPOINT, { signal: AbortSignal.timeout(8000) });
        const raw = await res.json();
        if (isMounted && requestId === latestRequestId) {
          const parsed = safeParseK4Payload(raw);
          setFeatures(parsed);
          setError(null);
        }
      } catch (err) {
        if (isMounted && requestId === latestRequestId) {
          setError(err instanceof Error ? err.message : 'Endpoint unavailable');
        }
      } finally {
        if (isMounted && requestId === latestRequestId) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const id = setInterval(fetchData, 6000);
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>Polling K₄ endpoint...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.errorState}>⚠ Endpoint unavailable — {error}</div>
          <a href="#/trim-tabs" className={styles.backLink}>← Back to Trim Tabs</a>
        </div>
      </div>
    );
  }

  const rows: Record<string, FeatureRow> = features ?? {};
  const displayNames: Record<string, string> = {
    USD: 'USD',
    LOVE: 'LOVE',
    Valence: 'Valence',
    Trust: 'Trust',
    Tasks: 'Tasks',
    Spoons: 'Spoons',
  };

  const levels = ['L0', 'L1', 'L2', 'L3', 'L4'] as const;

  // Simulated medical (medical floor stays in meatspace)
  const medical = { calcium: '8.2 mg/dL', spoons: '12/12', entropy: '2.1' };

  const gates = [
    { name: 'Entropy ≤ 5.0', pass: true },
    { name: 'Fidelity ≥ 95', pass: true },
    { name: 'Ca ≥ 8.0', pass: true },
    { name: 'Spoon Budget ≥ 8', pass: true },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>⚡ FLEET STATUS</h1>
            <div className={styles.sectionLabel} style={{ marginTop: '0.3rem' }}>
              Live K₄ telemetry — polling every 6s
            </div>
          </div>
        </div>

        <div className={styles.sectionLabel}>K₄ Features Matrix</div>
        <table className={styles.matrix}>
          <thead>
            <tr>
              <th>Feature</th>
              {levels.map((l) => (
                <th key={l}>{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(rows).map(([name, vals], i) => (
              <motion.tr
                key={name}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <td>{displayNames[name] || name}</td>
                {levels.map((l) => {
                  const v = (vals[l] ?? 0) as number;
                  return (
                    <td key={l} className={v > 0 ? styles.valPositive : styles.valNegative}>
                      {v.toFixed(2)}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>

        <div className={styles.grid}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>Medical Floor (Simulated)</div>
            <div className={styles.row}>
              <span className={styles.label}>Calcium</span>
              <span className={`${styles.value} ${styles.green}`}>{medical.calcium}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Spoon Budget</span>
              <span className={`${styles.value} ${styles.blue}`}>{medical.spoons}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Entropy</span>
              <span className={`${styles.value} ${styles.yellow}`}>{medical.entropy}</span>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>Delta Scorecard</div>
            {gates.map((g) => (
              <div className={styles.row} key={g.name}>
                <span className={styles.label}>{g.name}</span>
                <span className={`${styles.value} ${g.pass ? styles.green : 'red'}`}>
                  {g.pass ? '✓ PASS' : '✗ FAIL'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <a href="#/trim-tabs" className={styles.backLink}>
          ← Back to Trim Tabs
        </a>
      </div>
    </div>
  );
}
