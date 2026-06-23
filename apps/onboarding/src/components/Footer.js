import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import styles from './Footer.module.css';
export const Footer = () =>
  _jsx('footer', {
    className: styles.footer,
    children: _jsxs('div', {
      className: styles.inner,
      children: [
        _jsx('p', {
          className: styles.tagline,
          children: '\uD83E\uDDEC BONDING \u2014 same bowl, same room, your people first.',
        }),
        _jsxs('p', {
          className: styles.links,
          children: [
            _jsx('a', {
              href: 'https://phos.p31ca.org',
              target: '_blank',
              rel: 'noopener noreferrer',
              children: 'PHOS Convergence',
            }),
            _jsx('span', { className: styles.sep, children: '\u00B7' }),
            _jsx('a', {
              href: 'https://github.com/trimtab-signal/bonding',
              target: '_blank',
              rel: 'noopener noreferrer',
              children: 'GitHub',
            }),
            _jsx('span', { className: styles.sep, children: '\u00B7' }),
            _jsx('a', {
              href: 'LICENSE',
              target: '_blank',
              rel: 'noopener noreferrer',
              children: 'MIT License',
            }),
          ],
        }),
        _jsx('p', {
          className: styles.legal,
          children: 'Built with care. No tracking, no ads, no surveillance.',
        }),
      ],
    }),
  });
//# sourceMappingURL=Footer.js.map
