import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import styles from './Press.module.css';
const ASSETS = [
    { name: 'Logo (SVG)', file: 'logo.svg', desc: '🧬 BONDING logo, transparent background' },
    { name: 'Twitter/X Card', file: 'social-card-twitter.svg', desc: '1200×628, optimized for Twitter card' },
    { name: 'LinkedIn Card', file: 'social-card-linkedin.svg', desc: '1200×627, optimized for LinkedIn' },
    { name: 'Instagram Card', file: 'social-card-instagram.svg', desc: '1080×1080, square format' },
    { name: 'Facebook Card', file: 'social-card-facebook.svg', desc: '1200×630, optimized for Facebook' },
    { name: 'OG Image', file: 'social-card-og.svg', desc: '1200×630, Open Graph preview image' },
];
export const Press = () => (_jsx(Layout, { children: _jsx("section", { className: styles.section, children: _jsxs("div", { className: styles.inner, children: [_jsx("span", { className: styles.label, children: "Press Kit" }), _jsx("h2", { className: styles.title, children: "BONDING Media Assets" }), _jsxs("p", { className: styles.desc, children: ["All assets are open source and free to use. Attribution appreciated but not required. For press inquiries: ", _jsx("a", { href: "mailto:pilot@bonding.p31ca.org", children: "pilot@bonding.p31ca.org" })] }), _jsx("div", { className: styles.grid, children: ASSETS.map(a => (_jsxs(Card, { variant: "elevated", className: styles.asset, children: [_jsx("h3", { children: a.name }), _jsx("p", { children: a.desc }), _jsx("a", { href: `/media/${a.file}`, download: true, className: styles.downloadBtn, children: "Download" })] }, a.file))) }), _jsxs("div", { className: styles.pressRelease, children: [_jsx("h3", { children: "\uD83D\uDCF0 Press Release" }), _jsx("p", { children: "Full press release available in the launch document." }), _jsx("a", { href: "https://github.com/trimtab-signal/bonding/blob/master/docs/LAUNCH.md", target: "_blank", rel: "noopener noreferrer", style: { color: 'var(--accent)', fontWeight: 600 }, children: "View Press Release \u2192" })] }), _jsxs("div", { className: styles.contact, children: [_jsx("h3", { children: "\uD83D\uDCEC Contact" }), _jsx("p", { children: "pilot@bonding.p31ca.org" }), _jsx("p", { children: "github.com/trimtab-signal/bonding" }), _jsx("p", { children: "bonding-meatspace.pages.dev" })] })] }) }) }));
//# sourceMappingURL=Press.js.map