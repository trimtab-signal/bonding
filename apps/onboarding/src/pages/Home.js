import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import styles from './Home.module.css';
export const Home = () =>
  _jsxs(Layout, {
    children: [
      _jsx('section', {
        className: styles.hero,
        children: _jsxs('div', {
          className: styles.heroInner,
          children: [
            _jsx('span', { className: styles.badge, children: '\uD83E\uDDEC v0.1.0' }),
            _jsxs('h1', {
              className: styles.title,
              children: [
                'Humans are ',
                _jsx('span', { className: styles.accent, children: 'atoms' }),
                '.',
                _jsx('br', {}),
                'Relationships are ',
                _jsx('span', { className: styles.accent, children: 'bonds' }),
                '.',
              ],
            }),
            _jsx('p', {
              className: styles.desc,
              children:
                'A real-world game where presence replaces profiles, co-presence replaces matching, and bonds form through shared time in shared space.',
            }),
            _jsxs('div', {
              className: styles.actions,
              children: [
                _jsx('a', { href: '#/pilot', className: styles.cta, children: 'Join the Pilot' }),
                _jsx('a', {
                  href: '#/demo',
                  className: styles.secondary,
                  children: 'Live Demo \u2192',
                }),
              ],
            }),
            _jsx('p', {
              className: styles.tagline,
              children: '"Same bowl, same room \u2014 your people first."',
            }),
          ],
        }),
      }),
      _jsx('section', {
        className: styles.deltaPortal,
        children: _jsxs('div', {
          className: styles.deltaPortalInner,
          children: [
            _jsx('div', { className: styles.deltaTag, children: 'K\u2084 \u00B7 ISO\u00B7STATIC' }),
            _jsx('h2', { className: styles.deltaTitle, children: 'Delta Ignition' }),
            _jsx('p', {
              className: styles.deltaDesc,
              children:
                'A 12-second transformation. Wye collapses. Delta locks in. You are the signal.',
            }),
            _jsx('a', {
              href: 'https://delta-ignition.p31ca.org',
              className: styles.deltaCta,
              children: 'Run the Sequence \u2192',
            }),
          ],
        }),
      }),
      _jsx('section', {
        className: styles.features,
        children: _jsxs('div', {
          className: styles.featuresInner,
          children: [
            _jsx('h2', { className: styles.sectionTitle, children: 'How it feels' }),
            _jsxs('div', {
              className: styles.featuresGrid,
              children: [
                _jsxs(Card, {
                  variant: 'elevated',
                  children: [
                    _jsx('span', { className: styles.featureIcon, children: '\uD83D\uDCCD' }),
                    _jsx('h3', { children: 'Show up' }),
                    _jsx('p', {
                      children:
                        'Check in at a zone. Your location stays private \u2014 only a geohash is shared.',
                    }),
                  ],
                }),
                _jsxs(Card, {
                  variant: 'elevated',
                  children: [
                    _jsx('span', { className: styles.featureIcon, children: '\uD83D\uDD14' }),
                    _jsx('h3', { children: 'Connect' }),
                    _jsx('p', {
                      children:
                        'Ping nearby atoms. If they accept, a bond forms. Mutual, intentional, real.',
                    }),
                  ],
                }),
                _jsxs(Card, {
                  variant: 'elevated',
                  children: [
                    _jsx('span', { className: styles.featureIcon, children: '\u26A1' }),
                    _jsx('h3', { children: 'Evolve' }),
                    _jsx('p', {
                      children:
                        'Share reactions, solve problems, and watch your community era advance.',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
//# sourceMappingURL=Home.js.map
