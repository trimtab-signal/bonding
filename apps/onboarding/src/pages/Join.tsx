import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import styles from './Join.module.css';

export const Join: React.FC = () => (
  <Layout>
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.label}>Get Involved</span>
        <h2 className={styles.title}>Join the Reaction</h2>
        <p className={styles.desc}>
          BONDING is open source and community-driven. Whether you want
          to run a pilot, contribute code, or just follow along, there's
          a place for you.
        </p>
        <div className={styles.grid}>
          <Card variant="elevated" className={styles.card}>
            <span className={styles.cardIcon}>📬</span>
            <h3>Pilot Sign-Up</h3>
            <p>Running a pilot in your neighborhood? We want to hear from you.</p>
            <a href="mailto:pilot@bonding.p31ca.org" className={styles.link}>pilot@bonding.p31ca.org →</a>
          </Card>
          <Card variant="elevated" className={styles.card}>
            <span className={styles.cardIcon}>🐙</span>
            <h3>GitHub</h3>
            <p>Star the repo, open issues, submit PRs. The code is yours to explore.</p>
            <a href="https://github.com/trimtab-signal/bonding" target="_blank" rel="noopener noreferrer" className={styles.link}>github.com/trimtab-signal/bonding →</a>
          </Card>
          <Card variant="elevated" className={styles.card}>
            <span className={styles.cardIcon}>💬</span>
            <h3>Community</h3>
            <p>Chat with the community, ask questions, and find your lab partners.</p>
            <span className={styles.comingSoon}>Coming Soon</span>
          </Card>
        </div>
        <div className={styles.ctaRow}>
          <Button variant="primary" size="lg" onClick={() => window.open('https://github.com/trimtab-signal/bonding', '_blank')}>
            View on GitHub →
          </Button>
        </div>
      </div>
    </section>
  </Layout>
);
