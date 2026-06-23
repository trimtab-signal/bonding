import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
const MAPPING = [
  {
    car: 'Atoms',
    bonding: 'Humans',
    icon: '⚛️',
    desc: 'Each person is a unique atom with properties — skills, interests, energy level.',
  },
  {
    car: 'Bonds',
    bonding: 'Relationships',
    icon: '🤝',
    desc: 'Real connections form between atoms through mutual opt-in and shared presence.',
  },
  {
    car: 'Reactions',
    bonding: 'Collaborative problem-solving',
    icon: '⚡',
    desc: 'When atoms come together, reactions happen — helping, building, sharing.',
  },
  {
    car: 'Zones',
    bonding: 'Physical places',
    icon: '📍',
    desc: 'Calm, Lab, Kitchen, Deep, Wild — each zone defines a social context.',
  },
  {
    car: 'Valence',
    bonding: 'Trust & reliability',
    icon: '💎',
    desc: 'A hidden reputation scalar that rewards showing up and penalizes flaking.',
  },
];
const ZONE_ENERGY = [
  { zone: '🌿 Calm', energy: '< 30%', color: 'var(--calm)', bg: 'rgba(107,158,107,0.1)' },
  { zone: '🍳 Kitchen', energy: '30–60%', color: 'var(--kitchen)', bg: 'rgba(212,168,75,0.1)' },
  { zone: '🔬 Lab', energy: '60–80%', color: 'var(--lab)', bg: 'rgba(155,107,176,0.1)' },
  { zone: '🌀 Wild', energy: '≥ 80%', color: 'var(--wild)', bg: 'rgba(212,107,75,0.1)' },
];
export function MolecularMetaphor() {
  return _jsx('section', {
    id: 'metaphor',
    children: _jsxs('div', {
      children: [
        _jsx('div', { className: 'section-label', children: 'The Science Metaphor' }),
        _jsx('h2', { children: 'From C.A.R.S. to Meatspace' }),
        _jsx('p', {
          className: 'lead',
          children:
            'BONDING translates the digital molecular simulation C.A.R.S. into a real-world game. Every concept maps directly from chemistry to human connection.',
        }),
        _jsx('div', {
          className: 'metaphor-diagram',
          children: _jsxs('div', {
            className: 'metaphor-molecule',
            children: [
              [0, 1, 2, 3, 4].map((i) =>
                _jsx(
                  'div',
                  {
                    className: 'metaphor-electron',
                    style: {
                      animationDelay: `${i * 0.7}s`,
                      '--orbit-angle': `${i * 72}deg`,
                      '--orbit-color': [
                        'var(--accent)',
                        'var(--lab)',
                        'var(--kitchen)',
                        'var(--deep)',
                        'var(--wild)',
                      ][i],
                    },
                  },
                  i,
                ),
              ),
              _jsx('div', {
                className: 'metaphor-nucleus',
                children: _jsx('span', { children: 'BONDING' }),
              }),
            ],
          }),
        }),
        _jsxs('div', {
          className: 'metaphor-grid',
          children: [
            _jsxs('div', {
              className: 'metaphor-header',
              children: [
                _jsx('span', { children: 'C.A.R.S. (Digital)' }),
                _jsx('span', { className: 'metaphor-arrow', children: '\u2192' }),
                _jsx('span', { children: 'BONDING (Meatspace)' }),
              ],
            }),
            MAPPING.map((m) =>
              _jsxs(
                'div',
                {
                  className: 'metaphor-row',
                  children: [
                    _jsxs('div', {
                      className: 'metaphor-cell',
                      children: [
                        _jsx('span', { className: 'metaphor-icon', children: m.icon }),
                        _jsx('span', { children: m.car }),
                      ],
                    }),
                    _jsx('div', { className: 'metaphor-arrow-cell', children: '\u2192' }),
                    _jsx('div', {
                      className: 'metaphor-cell',
                      children: _jsx('strong', { children: m.bonding }),
                    }),
                    _jsx('div', { className: 'metaphor-desc', children: m.desc }),
                  ],
                },
                m.car,
              ),
            ),
          ],
        }),
        _jsxs('div', {
          style: { marginTop: 64 },
          children: [
            _jsx('div', { className: 'section-label', children: 'Energy Matches Zone' }),
            _jsx('h3', {
              style: { fontSize: 22, fontWeight: 700, marginBottom: 12 },
              children: 'Your State Picks the Space',
            }),
            _jsx('p', {
              className: 'lead',
              style: { marginBottom: 32 },
              children:
                'Your energy level \u2014 computed from PHOS health data on-device \u2014 determines which zone fits your current capacity.',
            }),
            _jsx('div', {
              className: 'energy-bar-track',
              children: _jsx('div', {
                className: 'energy-bar',
                children: ZONE_ENERGY.map((ze) =>
                  _jsxs(
                    'div',
                    {
                      className: 'energy-segment',
                      style: { background: ze.bg, borderColor: ze.color },
                      children: [
                        _jsx('span', { className: 'energy-range', children: ze.energy }),
                        _jsx('span', { className: 'energy-label', children: ze.zone }),
                      ],
                    },
                    ze.zone,
                  ),
                ),
              }),
            }),
          ],
        }),
      ],
    }),
  });
}
//# sourceMappingURL=MolecularMetaphor.js.map
