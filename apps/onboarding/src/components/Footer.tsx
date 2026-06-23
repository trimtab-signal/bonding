import styles from './Footer.module.css';

export const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <p className={styles.tagline}>🧬 BONDING — same bowl, same room, your people first.</p>
      <p className={styles.links}>
        <a href="https://phos.p31ca.org" target="_blank" rel="noopener noreferrer">PHOS Convergence</a>
        <span className={styles.sep}>·</span>
        <a href="https://github.com/trimtab-signal/bonding" target="_blank" rel="noopener noreferrer">GitHub</a>
        <span className={styles.sep}>·</span>
        <a href="LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a>
      </p>
      <p className={styles.legal}>Built with care. No tracking, no ads, no surveillance.</p>
    </div>
  </footer>
);
