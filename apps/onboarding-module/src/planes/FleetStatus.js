import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from './modules/FleetStatus.module.css';
const FLEET_DATA = [
    { id: 'ATOM-01', name: 'Base Alpha', status: 'ACTIVE', delta: 'Δ-1', k4: 4 },
    { id: 'ATOM-02', name: 'Outpost Seven', status: 'ACTIVE', delta: 'Δ-2', k4: 4 },
    { id: 'ATOM-03', name: 'Relay Point', status: 'DEGRADED', delta: 'Δ-1', k4: 3 },
    { id: 'ATOM-04', name: 'R&D Lab', status: 'ACTIVE', delta: 'Δ-0', k4: 4 },
    { id: 'ATOM-05', name: 'Sector West', status: 'OFFLINE', delta: 'OFFLINE', k4: 0 },
    { id: 'ATOM-06', name: 'Node Gamma', status: 'ACTIVE', delta: 'Δ-2', k4: 4 },
];
const COMMANDS = [
    { input: 'fleet status --all', output: '──── K4 COORDINATED FLEET ────\n\nATOM-01  Base Alpha    ● ONLINE    Δ-1  [████████] 98%\nATOM-02  Outpost Seven  ● ONLINE    Δ-2  [███████░] 87%\nATOM-03  Relay Point    ● DEGRADED  Δ-1  [█████░░░] 64%\nATOM-04  R&D Lab        ● ONLINE    Δ-0  [████████] 92%\nATOM-05  Sector West    ● OFFLINE   ---   [█░░░░░░░] 12%\nATOM-06  Node Gamma     ● ONLINE    Δ-2  [███████░] 81%', type: 'system' },
    { input: 'health report ATOM-01', output: '\n── HEALTH REPORT: ATOM-01 (Base Alpha) ──\n\nStatus:        NOMINAL\nBond Strength: 94% (Synchronized)\nLast Sync:     0.3s ago\nDelta Class:   Δ-1 (Isostatic)\nColor:         BLUE\n\n[BIOS] All buffers within tolerance.\n[NET] Uplink stable at 1.2 Gbps.', type: 'system' },
    { input: 'delta topology --map', output: '\n── DELTA TOPOLOGY ──\n\n       [ATOM-01]\n       /        \\\n[ATOM-04]──[ATOM-06]\n       \\        /\n       [ATOM-02]\n\nActive flights: 4\nBackground relay: 1\nDegraded node: 1 (ATOM-03)\n', type: 'system' },
    { input: 'deploy patch ATOM-05', output: 'ERROR: ATOM-05 is OFFLINE.\nReason: Maintenance cycle in progress.\nETA: 4h 23m\n\nNo patch deployed. Back up the node first.\n', type: 'error' },
    { input: 'show metrics', output: '\n── SYSTEM METRICS ──\n\nActive nodes:      5 / 6\nTotal bonds:       2,847\nActive psi-messages: 312\nAvg response time: 1.2s\n\nK4 compliance:     100%\nArchitecture:      Diamond (isostatic)', type: 'system' },
];
export default function FleetStatus({ onBack }) {
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    useEffect(() => {
        let idx = 0;
        const interval = setInterval(() => {
            if (idx < COMMANDS.length) {
                const cmd = COMMANDS[idx];
                if (cmd)
                    setHistory((prev) => [...prev, cmd]);
                idx++;
            }
        }, 1400);
        return () => clearInterval(interval);
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        const val = input.trim();
        if (!val)
            return;
        const known = COMMANDS.find((c) => c.input === val);
        if (known) {
            setHistory((prev) => [...prev, known]);
        }
        else {
            setHistory((prev) => [...prev, { input: val, output: `Command not found: ${val}\nType 'help' for available commands.`, type: 'error' }]);
        }
        setInput('');
    };
    const activeCount = FLEET_DATA.filter((u) => u.status === 'ACTIVE').length;
    const degradedCount = FLEET_DATA.filter((u) => u.status === 'DEGRADED').length;
    const offlineCount = FLEET_DATA.filter((u) => u.status === 'OFFLINE').length;
    return (_jsx("div", { className: styles.container, children: _jsxs("div", { className: styles.inner, children: [_jsx("div", { className: styles.header, children: _jsxs("div", { children: [_jsx("h1", { className: styles.title, children: "\u0394 FLEET STATUS" }), _jsxs("p", { className: styles.sub, children: ["K\u2084 Coordinated Fleet \u00B7 ", activeCount, " active \u00B7 ", degradedCount, " degraded \u00B7 ", offlineCount, " offline"] })] }) }), _jsxs("div", { className: styles.kpiGrid, children: [_jsxs("div", { className: styles.kpiCard, children: [_jsxs("div", { className: styles.kpiValue, children: [activeCount, "/", FLEET_DATA.length] }), _jsx("div", { className: styles.kpiLabel, children: "UNITS ONLINE" })] }), _jsxs("div", { className: styles.kpiCard, children: [_jsx("div", { className: styles.kpiValue, children: "2,847" }), _jsx("div", { className: styles.kpiLabel, children: "TOTAL BONDS" })] }), _jsxs("div", { className: styles.kpiCard, children: [_jsx("div", { className: styles.kpiValue, children: "312" }), _jsx("div", { className: styles.kpiLabel, children: "PSI MSG/MIN" })] }), _jsxs("div", { className: styles.kpiCard, children: [_jsx("div", { className: styles.kpiValue, children: "1.2s" }), _jsx("div", { className: styles.kpiLabel, children: "RESPONSE LAT" })] })] }), _jsxs("div", { className: styles.terminal, children: [_jsxs("div", { className: styles.terminalHeader, children: [_jsx("span", { className: `${styles.dot} ${styles.dotRed}` }), _jsx("span", { className: `${styles.dot} ${styles.dotYellow}` }), _jsx("span", { className: `${styles.dot} ${styles.dotGreen}` }), _jsx("span", { className: styles.terminalTitle, children: "meatspace@k4-fleet:~$" })] }), _jsxs("div", { className: styles.terminalBody, children: [history.map((cmd, i) => (_jsxs("div", { children: [_jsxs("div", { className: styles.userInput, children: ["$ ", cmd.input] }), _jsx("div", { className: cmd.type === 'error' ? styles.stderr : styles.stdout, children: cmd.output.split('\n').map((line, j) => (_jsx("div", { children: line || '\u00A0' }, j))) })] }, i))), history.length === 0 && _jsx("div", { className: styles.systemPrompt, children: "Initializing fleet monitor..." }), _jsx("form", { onSubmit: handleSubmit, children: _jsxs("div", { className: styles.prompt, children: ["$ ", input, _jsx("span", { className: styles.cursor })] }) })] })] }), _jsx("button", { className: styles.backLink, onClick: onBack, children: "\u2190 Back" })] }) }));
}
//# sourceMappingURL=FleetStatus.js.map