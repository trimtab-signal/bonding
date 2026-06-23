import { useState, useEffect } from 'react';
import styles from './modules/FleetStatus.module.css';

interface Unit { id: string; name: string; status: 'ACTIVE' | 'DEGRADED' | 'OFFLINE'; delta: string; k4: number; }
interface Command { input: string; output: string; type: 'system' | 'user' | 'error'; }

const FLEET_DATA: Unit[] = [
  { id: 'ATOM-01', name: 'Base Alpha', status: 'ACTIVE', delta: 'Δ-1', k4: 4 },
  { id: 'ATOM-02', name: 'Outpost Seven', status: 'ACTIVE', delta: 'Δ-2', k4: 4 },
  { id: 'ATOM-03', name: 'Relay Point', status: 'DEGRADED', delta: 'Δ-1', k4: 3 },
  { id: 'ATOM-04', name: 'R&D Lab', status: 'ACTIVE', delta: 'Δ-0', k4: 4 },
  { id: 'ATOM-05', name: 'Sector West', status: 'OFFLINE', delta: 'OFFLINE', k4: 0 },
  { id: 'ATOM-06', name: 'Node Gamma', status: 'ACTIVE', delta: 'Δ-2', k4: 4 },
];

const COMMANDS: Command[] = [
  { input: 'fleet status --all', output: '──── K4 COORDINATED FLEET ────\n\nATOM-01  Base Alpha    ● ONLINE    Δ-1  [████████] 98%\nATOM-02  Outpost Seven  ● ONLINE    Δ-2  [███████░] 87%\nATOM-03  Relay Point    ● DEGRADED  Δ-1  [█████░░░] 64%\nATOM-04  R&D Lab        ● ONLINE    Δ-0  [████████] 92%\nATOM-05  Sector West    ● OFFLINE   ---   [█░░░░░░░] 12%\nATOM-06  Node Gamma     ● ONLINE    Δ-2  [███████░] 81%', type: 'system' },
  { input: 'health report ATOM-01', output: '\n── HEALTH REPORT: ATOM-01 (Base Alpha) ──\n\nStatus:        NOMINAL\nBond Strength: 94% (Synchronized)\nLast Sync:     0.3s ago\nDelta Class:   Δ-1 (Isostatic)\nColor:         BLUE\n\n[BIOS] All buffers within tolerance.\n[NET] Uplink stable at 1.2 Gbps.', type: 'system' },
  { input: 'delta topology --map', output: '\n── DELTA TOPOLOGY ──\n\n       [ATOM-01]\n       /        \\\n[ATOM-04]──[ATOM-06]\n       \\        /\n       [ATOM-02]\n\nActive flights: 4\nBackground relay: 1\nDegraded node: 1 (ATOM-03)\n', type: 'system' },
  { input: 'deploy patch ATOM-05', output: 'ERROR: ATOM-05 is OFFLINE.\nReason: Maintenance cycle in progress.\nETA: 4h 23m\n\nNo patch deployed. Back up the node first.\n', type: 'error' },
  { input: 'show metrics', output: '\n── SYSTEM METRICS ──\n\nActive nodes:      5 / 6\nTotal bonds:       2,847\nActive psi-messages: 312\nAvg response time: 1.2s\n\nK4 compliance:     100%\nArchitecture:      Diamond (isostatic)', type: 'system' },
];

interface FleetStatusProps { onBack: () => void; }

export default function FleetStatus({ onBack }: FleetStatusProps) {
  const [history, setHistory] = useState<Command[]>([]);
  const [input, setInput] = useState('');
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < COMMANDS.length) { const cmd = COMMANDS[idx]; if (cmd) setHistory((prev) => [...prev, cmd]); idx++; }
    }, 1400);
    return () => clearInterval(interval);
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = input.trim();
    if (!val) return;
    const known = COMMANDS.find((c) => c.input === val);
    if (known) { setHistory((prev) => [...prev, known]); }
    else { setHistory((prev) => [...prev, { input: val, output: `Command not found: ${val}\nType 'help' for available commands.`, type: 'error' }]); }
    setInput('');
  };
  const activeCount = FLEET_DATA.filter((u) => u.status === 'ACTIVE').length;
  const degradedCount = FLEET_DATA.filter((u) => u.status === 'DEGRADED').length;
  const offlineCount = FLEET_DATA.filter((u) => u.status === 'OFFLINE').length;

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}><div><h1 className={styles.title}>Δ FLEET STATUS</h1><p className={styles.sub}>K₄ Coordinated Fleet · {activeCount} active · {degradedCount} degraded · {offlineCount} offline</p></div></div>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}><div className={styles.kpiValue}>{activeCount}/{FLEET_DATA.length}</div><div className={styles.kpiLabel}>UNITS ONLINE</div></div>
          <div className={styles.kpiCard}><div className={styles.kpiValue}>2,847</div><div className={styles.kpiLabel}>TOTAL BONDS</div></div>
          <div className={styles.kpiCard}><div className={styles.kpiValue}>312</div><div className={styles.kpiLabel}>PSI MSG/MIN</div></div>
          <div className={styles.kpiCard}><div className={styles.kpiValue}>1.2s</div><div className={styles.kpiLabel}>RESPONSE LAT</div></div>
        </div>
        <div className={styles.terminal}>
          <div className={styles.terminalHeader}><span className={`${styles.dot} ${styles.dotRed}`} /><span className={`${styles.dot} ${styles.dotYellow}`} /><span className={`${styles.dot} ${styles.dotGreen}`} /><span className={styles.terminalTitle}>meatspace@k4-fleet:~$</span></div>
          <div className={styles.terminalBody}>
            {history.map((cmd, i) => (<div key={i}><div className={styles.userInput}>$ {cmd.input}</div><div className={cmd.type === 'error' ? styles.stderr : styles.stdout}>{cmd.output.split('\n').map((line, j) => (<div key={j}>{line || '\u00A0'}</div>))}</div></div>))}
            {history.length === 0 && <div className={styles.systemPrompt}>Initializing fleet monitor...</div>}
            <form onSubmit={handleSubmit}><div className={styles.prompt}>$ {input}<span className={styles.cursor} /></div></form>
          </div>
        </div>
        <button className={styles.backLink} onClick={onBack}>← Back</button>
      </div>
    </div>
  );
}
