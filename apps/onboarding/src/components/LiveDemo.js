import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PARTICLES = [
    { label: 'You', color: 'var(--accent)', orbit: 1, speed: 12, delay: 0 },
    { label: 'Friend', color: 'var(--lab)', orbit: 1.6, speed: 15, delay: 1 },
    { label: 'Mate', color: 'var(--kitchen)', orbit: 2.2, speed: 18, delay: 2 },
    { label: 'Peer', color: 'var(--deep)', orbit: 1.3, speed: 10, delay: 0.5 },
    { label: 'Buddy', color: 'var(--wild)', orbit: 1.9, speed: 14, delay: 1.5 },
];
export function LiveDemo() {
    return (_jsx("section", { id: "demo", children: _jsxs("div", { children: [_jsx("div", { className: "section-label", children: "Live Demo" }), _jsx("h2", { children: "See the Molecule in Motion" }), _jsx("p", { className: "lead", children: "Atoms orbiting, bonds forming, zones lighting up. This is BONDING \u2014 your neighborhood as a living molecule." }), _jsxs("div", { className: "demo-container", children: [_jsxs("div", { className: "demo-molecule", children: [_jsx("div", { className: "demo-nucleus", children: _jsx("span", { children: "BOND" }) }), PARTICLES.map((p) => (_jsx("div", { className: "demo-particle", style: {
                                        '--orbit': p.orbit,
                                        '--speed': p.speed,
                                        '--delay': `${p.delay}s`,
                                        '--color': p.color,
                                    }, children: _jsx("div", { className: "demo-atom", style: { background: p.color }, children: _jsx("span", { children: p.label }) }) }, p.label)))] }), _jsxs("div", { className: "demo-labels", children: [_jsxs("div", { className: "demo-legend", children: [_jsx("span", { className: "demo-legend-dot", style: { background: 'var(--accent)' } }), "Bonded"] }), _jsxs("div", { className: "demo-legend", children: [_jsx("span", { className: "demo-legend-dot", style: { background: 'var(--border)' } }), "Available"] }), _jsxs("div", { className: "demo-legend", children: [_jsx("span", { className: "demo-legend-dot", style: { background: 'var(--accent)', opacity: 0.3 } }), "In Zone"] })] })] })] }) }));
}
//# sourceMappingURL=LiveDemo.js.map