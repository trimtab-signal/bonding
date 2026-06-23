import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
const FEATURES = [
  {
    icon: '🔐',
    title: 'Geohash-Only Location',
    desc: 'Your precise GPS never leaves your device. Only a geohash prefix (≈4.9 km² at MVP precision) is shared.',
  },
  {
    icon: '🗝️',
    title: 'Ephemeral Key Pairs',
    desc: 'Identity is derived from a cryptographic key pair stored locally. No account, no email, no password.',
  },
  {
    icon: '👁️',
    title: 'Witness Consensus',
    desc: 'Check-ins can be witnessed by other atoms, building a distributed web of trust without a central authority.',
  },
  {
    icon: '🌿',
    title: 'On-Device Health Data',
    desc: 'PHOS health data stays on your device. Only a scalar energy level is shared when you explicitly opt in.',
  },
];
const ETHICS = [
  {
    icon: '🚫',
    title: 'No Streaks',
    desc: 'You are not punished for taking a day off. Presence is genuine, not gamified.',
  },
  {
    icon: '🚫',
    title: 'No Leaderboards',
    desc: 'There is no winner. The goal is real connection, not competition.',
  },
  {
    icon: '🚫',
    title: 'No Variable Rewards',
    desc: 'No random loot, no dopamine slots. Bonds grow predictably through real presence.',
  },
  {
    icon: '🚫',
    title: 'No Surveillance',
    desc: 'No tracking, no data selling, no ads. The server only stores what is cryptographically required.',
  },
];
export function PrivacyEthics() {
  return _jsx('section', {
    id: 'privacy',
    children: _jsxs('div', {
      children: [
        _jsx('div', { className: 'section-label', children: 'Privacy by Design' }),
        _jsx('h2', { children: 'Your Data Stays Yours' }),
        _jsx('p', {
          className: 'lead',
          children:
            'BONDING is built from the ground up to be private by default. No accounts, no tracking, no surveillance.',
        }),
        _jsx('div', {
          className: 'principles',
          children: FEATURES.map((f) =>
            _jsxs(
              'div',
              {
                className: 'principle',
                children: [
                  _jsx('div', { className: 'icon', children: f.icon }),
                  _jsx('h3', { children: f.title }),
                  _jsx('p', { children: f.desc }),
                ],
              },
              f.title,
            ),
          ),
        }),
        _jsxs('div', {
          style: { marginTop: 60 },
          children: [
            _jsx('div', { className: 'section-label', children: 'Ethical Design' }),
            _jsx('h3', {
              style: { fontSize: 22, fontWeight: 700, marginBottom: 12 },
              children: 'Designed for Humans, Not Engagement',
            }),
            _jsx('p', {
              className: 'lead',
              style: { marginBottom: 32 },
              children: 'BONDING explicitly avoids every dark pattern common in social media.',
            }),
            _jsx('div', {
              className: 'principles',
              children: ETHICS.map((e) =>
                _jsxs(
                  'div',
                  {
                    className: 'principle',
                    children: [
                      _jsx('div', { className: 'icon', children: e.icon }),
                      _jsx('h3', { children: e.title }),
                      _jsx('p', { children: e.desc }),
                    ],
                  },
                  e.title,
                ),
              ),
            }),
          ],
        }),
      ],
    }),
  });
}
//# sourceMappingURL=PrivacyEthics.js.map
