import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
const ZONES = [
  {
    id: 'calm',
    emoji: '🌿',
    name: 'Calm',
    desc: 'Rest, reflection, low-stimulus presence',
    radius: '200m',
    color: 'var(--calm)',
  },
  {
    id: 'lab',
    emoji: '🔬',
    name: 'Lab',
    desc: 'Build, create, experiment together',
    radius: '200m',
    color: 'var(--lab)',
  },
  {
    id: 'kitchen',
    emoji: '🍳',
    name: 'Kitchen',
    desc: 'Share food, conversation, warmth',
    radius: '200m',
    color: 'var(--kitchen)',
  },
  {
    id: 'deep',
    emoji: '🌊',
    name: 'Deep',
    desc: 'Vulnerable conversation, emotional support',
    radius: '100m',
    color: 'var(--deep)',
  },
  {
    id: 'wild',
    emoji: '🌀',
    name: 'Wild',
    desc: 'Adventure, exploration, serendipity',
    radius: '500m',
    color: 'var(--wild)',
  },
];
export function Zones() {
  return _jsx('section', {
    id: 'zones',
    children: _jsxs('div', {
      children: [
        _jsx('div', { className: 'section-label', children: 'The Five Zones' }),
        _jsx('h2', { children: 'Choose Your Space' }),
        _jsx('p', {
          className: 'lead',
          children:
            'Each zone defines a different social context. Your energy level and intentions guide which zone fits the moment.',
        }),
        _jsx('div', {
          className: 'zone-grid',
          children: ZONES.map((z) =>
            _jsxs(
              'div',
              {
                className: 'zone-card',
                style: { borderColor: z.color },
                children: [
                  _jsx('div', { className: 'emoji', children: z.emoji }),
                  _jsx('h3', { children: z.name }),
                  _jsx('p', { children: z.desc }),
                  _jsxs('span', { className: 'radius-badge', children: [z.radius, ' radius'] }),
                ],
              },
              z.id,
            ),
          ),
        }),
      ],
    }),
  });
}
//# sourceMappingURL=Zones.js.map
