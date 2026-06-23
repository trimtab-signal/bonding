import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';
export const ThemeToggle = () => {
    const [dark, setDark] = useState(() => {
        const stored = localStorage.getItem('bonding_theme');
        if (stored)
            return stored === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        localStorage.setItem('bonding_theme', dark ? 'dark' : 'light');
    }, [dark]);
    return (_jsx("button", { className: styles.toggle, onClick: () => setDark(!dark), "aria-label": dark ? 'Switch to light mode' : 'Switch to dark mode', children: dark ? '☀️' : '🌙' }));
};
//# sourceMappingURL=ThemeToggle.js.map