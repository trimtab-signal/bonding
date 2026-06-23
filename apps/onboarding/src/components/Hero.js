import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
export function Hero() {
  return _jsx('section', {
    id: 'hero',
    children: _jsxs('div', {
      className: 'hero-content',
      children: [
        _jsxs('div', {
          className: 'hero-badge',
          children: [_jsx('span', { className: 'dot' }), 'v0.1.0 \u2014 Hyperlocal Pilot'],
        }),
        _jsxs('h1', {
          className: 'hero-title',
          children: [
            'Humans are ',
            _jsx('span', { className: 'gradient', children: 'atoms' }),
            '.',
            _jsx('br', {}),
            'Relationships are ',
            _jsx('span', { className: 'gradient', children: 'bonds' }),
            '.',
          ],
        }),
        _jsx('p', {
          className: 'hero-subtitle',
          children:
            'A real-world social game where presence replaces profiles, co-presence replaces matching, and bonds form through shared time in shared space.',
        }),
        _jsx('p', {
          className: 'hero-tagline',
          children: '"Same bowl, same room \u2014 your people first."',
        }),
        _jsxs('div', {
          className: 'hero-buttons',
          children: [
            _jsx('a', {
              href: '#how',
              className: 'btn btn-primary',
              children: 'How It Works \u2193',
            }),
            _jsx('a', { href: '#start', className: 'btn btn-secondary', children: 'Get Started' }),
            _jsx('a', {
              href: 'https://github.com/anomalyco/bonding',
              className: 'btn btn-ghost',
              target: '_blank',
              rel: 'noopener noreferrer',
              children: 'GitHub \u2192',
            }),
          ],
        }),
      ],
    }),
  });
}
//# sourceMappingURL=Hero.js.map
