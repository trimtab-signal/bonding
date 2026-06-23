import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const BOND_TYPES = [
    {
        title: '🤝 Mutual',
        desc: 'The standard bond. Formed when two atoms accept each other\'s ping. Grows through co-presence in shared zones.',
        tag: 'Default',
        tagColor: 'var(--accent)',
    },
    {
        title: '🧭 Mentor',
        desc: 'An asymmetric bond for guidance and teaching. One atom leads, the other learns. Built through consistent check-ins.',
        tag: 'Coming Soon',
        tagColor: 'var(--lab)',
    },
    {
        title: '🌱 Sibling',
        desc: 'A peer bond for deep collaboration. Formed when two atoms complete a shared project or milestone together.',
        tag: 'Coming Soon',
        tagColor: 'var(--deep)',
    },
];
const ENERGY_ZONES = [
    { range: '< 30%', zone: 'Calm 🌿', desc: 'Low energy — rest, reflect, be present without pressure' },
    { range: '30–60%', zone: 'Kitchen 🍳', desc: 'Moderate — share a meal, warm conversation' },
    { range: '60–80%', zone: 'Lab 🔬', desc: 'Good energy — build and create together' },
    { range: '≥ 80%', zone: 'Wild 🌀', desc: 'High energy — adventure and exploration' },
];
export function BondingMechanics() {
    return (_jsx("section", { id: "mechanics", children: _jsxs("div", { children: [_jsx("div", { className: "section-label", children: "Relationship Types" }), _jsx("h2", { children: "Bonding Mechanics" }), _jsx("p", { className: "lead", children: "Bonds track real co-presence \u2014 not likes, not messages. Every check-in with a bonded atom deepens the connection." }), _jsx("div", { className: "bond-types", children: BOND_TYPES.map((bt) => (_jsxs("div", { className: "bond-type", children: [_jsx("h3", { children: bt.title }), _jsx("p", { children: bt.desc }), _jsx("span", { className: "tag", style: { background: bt.tagColor + '20', color: bt.tagColor }, children: bt.tag })] }, bt.title))) }), _jsxs("div", { style: { marginTop: 60 }, children: [_jsx("div", { className: "section-label", children: "Energy-Aware Zones" }), _jsx("h3", { style: { fontSize: 22, fontWeight: 700, marginBottom: 12 }, children: "\uD83C\uDF3F Your Energy Matches the Zone" }), _jsx("p", { className: "lead", style: { marginBottom: 32 }, children: "BONDING reads PHOS health data (on-device only) to suggest the best zone for your current capacity. No data leaves your device unless you opt in." }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }, children: ENERGY_ZONES.map((ez) => (_jsxs("div", { style: {
                                    padding: 20, borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border)', background: 'var(--bg)',
                                }, children: [_jsx("div", { style: { fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }, children: ez.range }), _jsx("div", { style: { fontSize: 16, fontWeight: 700, marginBottom: 4 }, children: ez.zone }), _jsx("div", { style: { fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }, children: ez.desc })] }, ez.range))) })] })] }) }));
}
//# sourceMappingURL=BondingMechanics.js.map