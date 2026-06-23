import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import styles from './About.module.css';

const PRINCIPLES = [
  {
    emoji: '🔐',
    title: 'Privacy by Default',
    desc: 'Your precise location never leaves your device. Only a geohash prefix is shared.',
  },
  {
    emoji: '🗝️',
    title: 'No Accounts',
    desc: 'Identity is derived from a cryptographic key pair stored locally. No email, no password.',
  },
  {
    emoji: '👁️',
    title: 'Witness Consensus',
    desc: 'Check-ins can be witnessed by other atoms, building a distributed web of trust.',
  },
  {
    emoji: '🌿',
    title: 'Calm Technology',
    desc: 'Open, find your people, put it away. No infinite scroll, no streaks, no dopamine loops.',
  },
];

export const About: React.FC = () => (
  <Layout>
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.label}>The Philosophy</span>
        <h2 className={styles.title}>Built for Humans, Not Engagement</h2>
        <p className={styles.desc}>
          BONDING is not a social network. It is a permission structure for real-world connection.
          We explicitly avoid every dark pattern common in social media.
        </p>
        <div className={styles.grid}>
          {PRINCIPLES.map((p) => (
            <Card key={p.title} variant="elevated" className={styles.principle}>
              <span className={styles.icon}>{p.emoji}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </Card>
          ))}
        </div>
        <div className={styles.tagline}>
          <p>"Same bowl, same room — your people first."</p>
        </div>
      </div>
    </section>
  </Layout>
);
