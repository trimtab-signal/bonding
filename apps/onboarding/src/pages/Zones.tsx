import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import styles from './Zones.module.css';

const ZONES = [
  {
    id: 'calm',
    emoji: '🌿',
    name: 'Calm',
    desc: 'Rest, reflection, low-stimulus presence',
    radius: '200m',
  },
  {
    id: 'lab',
    emoji: '🔬',
    name: 'Lab',
    desc: 'Build, create, experiment together',
    radius: '200m',
  },
  {
    id: 'kitchen',
    emoji: '🍳',
    name: 'Kitchen',
    desc: 'Share food, conversation, warmth',
    radius: '200m',
  },
  {
    id: 'deep',
    emoji: '🌊',
    name: 'Deep',
    desc: 'Vulnerable conversation, emotional support',
    radius: '100m',
  },
  {
    id: 'wild',
    emoji: '🌀',
    name: 'Wild',
    desc: 'Adventure, exploration, serendipity',
    radius: '500m',
  },
];

export const Zones: React.FC = () => (
  <Layout>
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.label}>The Five Zones</span>
        <h2 className={styles.title}>Choose Your Space</h2>
        <p className={styles.desc}>
          Each zone defines a different social context. Your energy level and intentions guide which
          zone fits the moment.
        </p>
        <div className={styles.grid}>
          {ZONES.map((z) => (
            <Card key={z.id} variant="elevated" className={styles.zone}>
              <span className={styles.emoji}>{z.emoji}</span>
              <h3>{z.name}</h3>
              <p>{z.desc}</p>
              <span className={styles.radius}>{z.radius} radius</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);
