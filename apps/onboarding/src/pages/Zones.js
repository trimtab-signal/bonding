import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import styles from './Zones.module.css';
const ZONES = [
    { id: 'calm', emoji: '🌿', name: 'Calm', desc: 'Rest, reflection, low-stimulus presence', radius: '200m' },
    { id: 'lab', emoji: '🔬', name: 'Lab', desc: 'Build, create, experiment together', radius: '200m' },
    { id: 'kitchen', emoji: '🍳', name: 'Kitchen', desc: 'Share food, conversation, warmth', radius: '200m' },
    { id: 'deep', emoji: '🌊', name: 'Deep', desc: 'Vulnerable conversation, emotional support', radius: '100m' },
    { id: 'wild', emoji: '🌀', name: 'Wild', desc: 'Adventure, exploration, serendipity', radius: '500m' },
];
export const Zones = () => (_jsx(Layout, { children: _jsx("section", { className: styles.section, children: _jsxs("div", { className: styles.inner, children: [_jsx("span", { className: styles.label, children: "The Five Zones" }), _jsx("h2", { className: styles.title, children: "Choose Your Space" }), _jsx("p", { className: styles.desc, children: "Each zone defines a different social context. Your energy level and intentions guide which zone fits the moment." }), _jsx("div", { className: styles.grid, children: ZONES.map((z) => (_jsxs(Card, { variant: "elevated", className: styles.zone, children: [_jsx("span", { className: styles.emoji, children: z.emoji }), _jsx("h3", { children: z.name }), _jsx("p", { children: z.desc }), _jsxs("span", { className: styles.radius, children: [z.radius, " radius"] })] }, z.id))) })] }) }) }));
//# sourceMappingURL=Zones.js.map