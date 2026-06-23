import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import styles from './Home.module.css';

export const Home: React.FC = () => (
  <Layout>
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <span className={styles.badge}>🧬 v0.1.0</span>
        <h1 className={styles.title}>
          Humans are <span className={styles.accent}>atoms</span>.<br />
          Relationships are <span className={styles.accent}>bonds</span>.
        </h1>
        <p className={styles.desc}>
          A real-world game where presence replaces profiles, co-presence replaces matching, and
          bonds form through shared time in shared space.
        </p>
        <div className={styles.actions}>
          <a href="#/pilot" className={styles.cta}>
            Join the Pilot
          </a>
          <a href="#/demo" className={styles.secondary}>
            Live Demo →
          </a>
        </div>
        <p className={styles.tagline}>"Same bowl, same room — your people first."</p>
      </div>
    </section>

    <section className={styles.deltaPortal}>
      <div className={styles.deltaPortalInner}>
        <div className={styles.deltaTag}>K₄ · ISO·STATIC</div>
        <h2 className={styles.deltaTitle}>Delta Ignition</h2>
        <p className={styles.deltaDesc}>
          A 12-second transformation. Wye collapses. Delta locks in. You are the signal.
        </p>
        <a href="https://delta-ignition.p31ca.org" className={styles.deltaCta}>
          Run the Sequence →
        </a>
      </div>
    </section>

    <section className={styles.features}>
      <div className={styles.featuresInner}>
        <h2 className={styles.sectionTitle}>How it feels</h2>
        <div className={styles.featuresGrid}>
          <Card variant="elevated">
            <span className={styles.featureIcon}>📍</span>
            <h3>Show up</h3>
            <p>Check in at a zone. Your location stays private — only a geohash is shared.</p>
          </Card>
          <Card variant="elevated">
            <span className={styles.featureIcon}>🔔</span>
            <h3>Connect</h3>
            <p>Ping nearby atoms. If they accept, a bond forms. Mutual, intentional, real.</p>
          </Card>
          <Card variant="elevated">
            <span className={styles.featureIcon}>⚡</span>
            <h3>Evolve</h3>
            <p>Share reactions, solve problems, and watch your community era advance.</p>
          </Card>
        </div>
      </div>
    </section>
  </Layout>
);
