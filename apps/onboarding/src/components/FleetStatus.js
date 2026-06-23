import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './FleetStatus.module.css';
const ENDPOINT = 'https://cashpilot-sync.trimtab-signal.workers.dev/api/k4/features';
function safeParseK4Payload(raw) {
    if (!raw || typeof raw !== 'object')
        return {};
    const safe = Object.create(null);
    const data = raw.features || raw;
    if (typeof data !== 'object' || data === null)
        return {};
    for (const [key, val] of Object.entries(data)) {
        if (typeof val === 'object' && val !== null) {
            const levels = ['L0', 'L1', 'L2', 'L3', 'L4'];
            const valid = levels.every(l => typeof val[l] === 'number');
            if (valid) {
                safe[key] = val;
            }
        }
    }
    return safe;
}
export function FleetStatus() {
    const [features, setFeatures] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            }
            catch (err) {
                if (isMounted && requestId === latestRequestId) {
                    setError(err instanceof Error ? err.message : 'Endpoint unavailable');
                }
            }
            finally {
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
        return (_jsx("div", { className: styles.container, children: _jsx("div", { className: styles.inner, children: _jsxs("div", { className: styles.loading, children: [_jsx("div", { className: styles.spinner }), _jsx("span", { children: "Polling K\u2084 endpoint..." })] }) }) }));
    }
    if (error) {
        return (_jsx("div", { className: styles.container, children: _jsxs("div", { className: styles.inner, children: [_jsxs("div", { className: styles.errorState, children: ["\u26A0 Endpoint unavailable \u2014 ", error] }), _jsx("a", { href: "#/trim-tabs", className: styles.backLink, children: "\u2190 Back to Trim Tabs" })] }) }));
    }
    const rows = features ?? {};
    const displayNames = {
        USD: 'USD',
        LOVE: 'LOVE',
        Valence: 'Valence',
        Trust: 'Trust',
        Tasks: 'Tasks',
        Spoons: 'Spoons',
    };
    const levels = ['L0', 'L1', 'L2', 'L3', 'L4'];
    // Simulated medical (medical floor stays in meatspace)
    const medical = { calcium: '8.2 mg/dL', spoons: '12/12', entropy: '2.1' };
    const gates = [
        { name: 'Entropy ≤ 5.0', pass: true },
        { name: 'Fidelity ≥ 95', pass: true },
        { name: 'Ca ≥ 8.0', pass: true },
        { name: 'Spoon Budget ≥ 8', pass: true },
    ];
    return (_jsx("div", { className: styles.container, children: _jsxs("div", { className: styles.inner, children: [_jsx("div", { className: styles.header, children: _jsxs("div", { children: [_jsx("h1", { className: styles.title, children: "\u26A1 FLEET STATUS" }), _jsx("div", { className: styles.sectionLabel, style: { marginTop: '0.3rem' }, children: "Live K\u2084 telemetry \u2014 polling every 6s" })] }) }), _jsx("div", { className: styles.sectionLabel, children: "K\u2084 Features Matrix" }), _jsxs("table", { className: styles.matrix, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Feature" }), levels.map((l) => (_jsx("th", { children: l }, l)))] }) }), _jsx("tbody", { children: Object.entries(rows).map(([name, vals], i) => (_jsxs(motion.tr, { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.04 }, children: [_jsx("td", { children: displayNames[name] || name }), levels.map((l) => {
                                        const v = (vals[l] ?? 0);
                                        return (_jsx("td", { className: v > 0 ? styles.valPositive : styles.valNegative, children: v.toFixed(2) }, l));
                                    })] }, name))) })] }), _jsxs("div", { className: styles.grid, children: [_jsxs("div", { className: styles.panel, children: [_jsx("div", { className: styles.panelTitle, children: "Medical Floor (Simulated)" }), _jsxs("div", { className: styles.row, children: [_jsx("span", { className: styles.label, children: "Calcium" }), _jsx("span", { className: `${styles.value} ${styles.green}`, children: medical.calcium })] }), _jsxs("div", { className: styles.row, children: [_jsx("span", { className: styles.label, children: "Spoon Budget" }), _jsx("span", { className: `${styles.value} ${styles.blue}`, children: medical.spoons })] }), _jsxs("div", { className: styles.row, children: [_jsx("span", { className: styles.label, children: "Entropy" }), _jsx("span", { className: `${styles.value} ${styles.yellow}`, children: medical.entropy })] })] }), _jsxs("div", { className: styles.panel, children: [_jsx("div", { className: styles.panelTitle, children: "Delta Scorecard" }), gates.map((g) => (_jsxs("div", { className: styles.row, children: [_jsx("span", { className: styles.label, children: g.name }), _jsx("span", { className: `${styles.value} ${g.pass ? styles.green : 'red'}`, children: g.pass ? '✓ PASS' : '✗ FAIL' })] }, g.name)))] })] }), _jsx("a", { href: "#/trim-tabs", className: styles.backLink, children: "\u2190 Back to Trim Tabs" })] }) }));
}
//# sourceMappingURL=FleetStatus.js.map