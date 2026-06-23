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

export const Navigation: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  useEffect(() => {
    const handler = () => setCurrentPath(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <a href="#/" className={styles.logo}>
          <span className={styles.logoEmoji}>🧬</span>
          <span className={styles.logoText}>BONDING</span>
        </a>
        <div className={styles.links}>
          {PAGES.map((page) => (
            <a
              key={page.id}
              href={`#${page.path}`}
              className={`${styles.link} ${currentPath === page.path ? styles.active : ''}`}
            >
              {page.label}
            </a>
          ))}
          {EXTERNAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.extLink}
              title={link.title}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className={styles.right}>
          <ThemeToggle />
          <a href="#/pilot" className={styles.cta}>
            Join Pilot
          </a>
        </div>
      </div>
    </nav>
  );
};
