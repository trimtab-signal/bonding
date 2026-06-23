import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import styles from './Press.module.css';

const ASSETS = [
  { name: 'Logo (SVG)', file: 'logo.svg', desc: '🧬 BONDING logo, transparent background' },
  { name: 'Twitter/X Card', file: 'social-card-twitter.svg', desc: '1200×628, optimized for Twitter card' },
  { name: 'LinkedIn Card', file: 'social-card-linkedin.svg', desc: '1200×627, optimized for LinkedIn' },
  { name: 'Instagram Card', file: 'social-card-instagram.svg', desc: '1080×1080, square format' },
  { name: 'Facebook Card', file: 'social-card-facebook.svg', desc: '1200×630, optimized for Facebook' },
  { name: 'OG Image', file: 'social-card-og.svg', desc: '1200×630, Open Graph preview image' },
];

export const Press: React.FC = () => (
  <Layout>
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.label}>Press Kit</span>
        <h2 className={styles.title}>BONDING Media Assets</h2>
        <p className={styles.desc}>
          All assets are open source and free to use. Attribution appreciated but not required.
          For press inquiries: <a href="mailto:pilot@bonding.p31ca.org">pilot@bonding.p31ca.org</a>
        </p>

        <div className={styles.grid}>
          {ASSETS.map(a => (
            <Card key={a.file} variant="elevated" className={styles.asset}>
              <h3>{a.name}</h3>
              <p>{a.desc}</p>
              <a href={`/media/${a.file}`} download className={styles.downloadBtn}>Download</a>
            </Card>
          ))}
        </div>

        <div className={styles.pressRelease}>
          <h3>📰 Press Release</h3>
          <p>Full press release available in the launch document.</p>
          <a href="https://github.com/trimtab-signal/bonding/blob/master/docs/LAUNCH.md" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            View Press Release →
          </a>
        </div>

        <div className={styles.contact}>
          <h3>📬 Contact</h3>
          <p>pilot@bonding.p31ca.org</p>
          <p>github.com/trimtab-signal/bonding</p>
          <p>bonding-meatspace.pages.dev</p>
        </div>
      </div>
    </section>
  </Layout>
);
