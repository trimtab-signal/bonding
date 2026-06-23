import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
const STEPS = [
  {
    emoji: '📍',
    title: 'Check In',
    desc: 'Arrive at a zone and broadcast your presence. Your location is shared as a geohash — never raw GPS.',
  },
  {
    emoji: '🔔',
    title: 'Ping',
    desc: 'See who else is in your zone. Send a ping to signal interest in connecting.',
  },
  {
    emoji: '🤝',
    title: 'Accept',
    desc: 'If the feeling is mutual, they accept. A bond is formed between your atoms.',
  },
  {
    emoji: '🧪',
    title: 'Bond',
    desc: 'Mutual bonds count co-presence over time. The more you show up, the stronger the bond.',
  },
  {
    emoji: '👁️',
    title: 'Witness',
    desc: 'Other atoms can witness your check-in, building a web of trust without central authority.',
  },
  {
    emoji: '⚡',
    title: 'Evolve',
    desc: 'Reactions, valence scores, and era milestones mark your shared journey.',
  },
];
export function HowItWorks() {
  return _jsx('section', {
    id: 'how',
    children: _jsxs('div', {
      children: [
        _jsx('div', { className: 'section-label', children: 'The Game Loop' }),
        _jsx('h2', { children: 'How BONDING Works' }),
        _jsx('p', {
          className: 'lead',
          children:
            'There are no profiles to swipe. No DMs. No algorithms. You show up at a real place, and the game handles the rest.',
        }),
        _jsx('div', {
          className: 'steps',
          children: STEPS.map((step, i) =>
            _jsxs(
              'div',
              {
                className: 'step',
                children: [
                  _jsx('div', { className: 'step-number', children: i + 1 }),
                  _jsx('div', { className: 'emoji', children: step.emoji }),
                  _jsx('h3', { children: step.title }),
                  _jsx('p', { children: step.desc }),
                ],
              },
              step.title,
            ),
          ),
        }),
      ],
    }),
  });
}
//# sourceMappingURL=HowItWorks.js.map
