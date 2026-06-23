import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import styles from './HowItWorks.module.css';
const STEPS = [
    { emoji: '📍', title: 'Check In', desc: 'Arrive at a zone and broadcast your presence. Your location stays private.' },
    { emoji: '🔔', title: 'Ping', desc: 'See who else is in the zone. Send a ping to signal interest.' },
    { emoji: '🤝', title: 'Accept', desc: 'If the feeling is mutual, they accept. A bond is formed.' },
    { emoji: '🧪', title: 'Bond', desc: 'Mutual bonds count co-presence over time. The more you show up, the stronger the bond.' },
    { emoji: '👁️', title: 'Witness', desc: 'Other atoms can witness your check-in, building a web of trust.' },
    { emoji: '⚡', title: 'Evolve', desc: 'Reactions, valence, and era milestones mark your shared journey.' },
];
export const HowItWorks = () => (_jsx(Layout, { children: _jsx("section", { className: styles.section, children: _jsxs("div", { className: styles.inner, children: [_jsx("span", { className: styles.label, children: "The Game Loop" }), _jsx("h2", { className: styles.title, children: "How BONDING Works" }), _jsx("p", { className: styles.desc, children: "No profiles to swipe. No DMs. No algorithms. You show up at a real place, and the game handles the rest." }), _jsx("div", { className: styles.steps, children: STEPS.map((step, i) => (_jsxs(Card, { variant: "elevated", className: styles.step, children: [_jsx("span", { className: styles.stepNumber, children: i + 1 }), _jsx("span", { className: styles.stepEmoji, children: step.emoji }), _jsx("h3", { children: step.title }), _jsx("p", { children: step.desc })] }, step.title))) })] }) }) }));
//# sourceMappingURL=HowItWorks.js.map