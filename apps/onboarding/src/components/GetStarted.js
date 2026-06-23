import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
const START_STEPS = [
  { title: 'Clone the repo', desc: 'git clone https://github.com/anomalyco/bonding && cd bonding' },
  { title: 'Install dependencies', desc: 'pnpm install (requires Node 20+ and pnpm 9+)' },
  {
    title: 'Start the database',
    desc: 'pnpm docker:up — spins up PostgreSQL with PostGIS via Docker Compose',
  },
  {
    title: 'Run migrations & seed',
    desc: 'pnpm db:migrate && pnpm db:seed — creates tables and sample atoms',
  },
  {
    title: 'Set zone coordinates',
    desc: 'Edit packages/shared-types/src/index.ts — replace lat:0,lng:0 with real coordinates for your neighborhood.',
  },
  { title: 'Start the server', desc: 'pnpm dev:server — Express + Socket.io on port 3001' },
  { title: 'Start the app', desc: 'pnpm dev:mobile — Vite dev server on port 5173' },
  {
    title: 'Invite your people',
    desc: 'Share the URL with 5–10 friends in the same neighborhood. Run the 4-week hyperlocal pilot.',
  },
];
export function GetStarted() {
  return _jsx('section', {
    id: 'start',
    children: _jsxs('div', {
      children: [
        _jsx('div', { className: 'section-label', children: 'Launch Your Pilot' }),
        _jsx('h2', { children: 'Get Started in 8 Steps' }),
        _jsx('p', {
          className: 'lead',
          style: { margin: '0 auto' },
          children:
            'BONDING is designed for hyperlocal pilots. Everything you need to run one in your neighborhood is in the repo.',
        }),
        _jsx('div', {
          className: 'start-steps',
          children: START_STEPS.map((s, i) =>
            _jsx(
              'div',
              {
                className: 'start-step',
                children: _jsxs('div', {
                  children: [_jsx('h3', { children: s.title }), _jsx('p', { children: s.desc })],
                }),
              },
              i,
            ),
          ),
        }),
        _jsx('div', {
          className: 'start-cta',
          children: _jsx('a', {
            href: 'https://github.com/anomalyco/bonding',
            className: 'btn btn-primary',
            target: '_blank',
            rel: 'noopener noreferrer',
            children: 'View on GitHub \u2192',
          }),
        }),
      ],
    }),
  });
}
//# sourceMappingURL=GetStarted.js.map
