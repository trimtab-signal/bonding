import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import styles from './About.module.css';
const PRINCIPLES = [
    { emoji: '🔐', title: 'Privacy by Default', desc: 'Your precise location never leaves your device. Only a geohash prefix is shared.' },
    { emoji: '🗝️', title: 'No Accounts', desc: 'Identity is derived from a cryptographic key pair stored locally. No email, no password.' },
    { emoji: '👁️', title: 'Witness Consensus', desc: 'Check-ins can be witnessed by other atoms, building a distributed web of trust.' },
    { emoji: '🌿', title: 'Calm Technology', desc: 'Open, find your people, put it away. No infinite scroll, no streaks, no dopamine loops.' },
];
export const About = () => (_jsx(Layout, { children: _jsx("section", { className: styles.section, children: _jsxs("div", { className: styles.inner, children: [_jsx("span", { className: styles.label, children: "The Philosophy" }), _jsx("h2", { className: styles.title, children: "Built for Humans, Not Engagement" }), _jsx("p", { className: styles.desc, children: "BONDING is not a social network. It is a permission structure for real-world connection. We explicitly avoid every dark pattern common in social media." }), _jsx("div", { className: styles.grid, children: PRINCIPLES.map((p) => (_jsxs(Card, { variant: "elevated", className: styles.principle, children: [_jsx("span", { className: styles.icon, children: p.emoji }), _jsx("h3", { children: p.title }), _jsx("p", { children: p.desc })] }, p.title))) }), _jsx("div", { className: styles.tagline, children: _jsx("p", { children: "\"Same bowl, same room \u2014 your people first.\"" }) })] }) }) }));
//# sourceMappingURL=About.js.map