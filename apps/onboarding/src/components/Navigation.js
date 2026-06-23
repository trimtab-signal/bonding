import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import styles from './Navigation.module.css';
const PAGES = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'how-it-works', label: 'How It Works', path: '/how-it-works' },
  { id: 'demo', label: 'Demo', path: '/demo' },
  { id: 'zones', label: 'Zones', path: '/zones' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'press', label: 'Press', path: '/press' },
  { id: 'pilot', label: 'Pilot', path: '/pilot' },
];
const EXTERNAL_LINKS = [
  {
    id: 'phos',
    label: 'PHOS →',
    href: 'https://phos.p31ca.org',
    title: 'P31 Convergence Dashboard',
  },
  {
    id: 'github',
    label: 'GitHub →',
    href: 'https://github.com/trimtab-signal/bonding',
    title: 'Source code',
  },
];
export const Navigation = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  useEffect(() => {
    const handler = () => setCurrentPath(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return _jsx('nav', {
    className: styles.nav,
    children: _jsxs('div', {
      className: styles.inner,
      children: [
        _jsxs('a', {
          href: '#/',
          className: styles.logo,
          children: [
            _jsx('span', { className: styles.logoEmoji, children: '\uD83E\uDDEC' }),
            _jsx('span', { className: styles.logoText, children: 'BONDING' }),
          ],
        }),
        _jsxs('div', {
          className: styles.links,
          children: [
            PAGES.map((page) =>
              _jsx(
                'a',
                {
                  href: `#${page.path}`,
                  className: `${styles.link} ${currentPath === page.path ? styles.active : ''}`,
                  children: page.label,
                },
                page.id,
              ),
            ),
            EXTERNAL_LINKS.map((link) =>
              _jsx(
                'a',
                {
                  href: link.href,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: styles.extLink,
                  title: link.title,
                  children: link.label,
                },
                link.id,
              ),
            ),
          ],
        }),
        _jsxs('div', {
          className: styles.right,
          children: [
            _jsx(ThemeToggle, {}),
            _jsx('a', { href: '#/pilot', className: styles.cta, children: 'Join Pilot' }),
          ],
        }),
      ],
    }),
  });
};
//# sourceMappingURL=Navigation.js.map
