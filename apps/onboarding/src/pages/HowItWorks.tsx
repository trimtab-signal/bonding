import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    emoji: '📍',
    title: 'Check In',
    desc: 'Arrive at a zone and broadcast your presence. Your location stays private.',
  },
  {
    emoji: '🔔',
    title: 'Ping',
    desc: 'See who else is in the zone. Send a ping to signal interest.',
  },
  {
    emoji: '🤝',
    title: 'Accept',
    desc: 'If the feeling is mutual, they accept. A bond is formed.',
  },
  {
    emoji: '🧪',
    title: 'Bond',
    desc: 'Mutual bonds count co-presence over time. The more you show up, the stronger the bond.',
  },
  {
    emoji: '👁️',
    title: 'Witness',
    desc: 'Other atoms can witness your check-in, building a web of trust.',
  },
  {
    emoji: '⚡',
    title: 'Evolve',
    desc: 'Reactions, valence, and era milestones mark your shared journey.',
  },
];

export const HowItWorks: React.FC = () => (
  <Layout>
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={styles.label}>The Game Loop</span>
        <h2 className={styles.title}>How BONDING Works</h2>
        <p className={styles.desc}>
          No profiles to swipe. No DMs. No algorithms. You show up at a real place, and the game
          handles the rest.
        </p>
        <div className={styles.steps}>
          {STEPS.map((step, i) => (
            <Card key={step.title} variant="elevated" className={styles.step}>
              <span className={styles.stepNumber}>{i + 1}</span>
              <span className={styles.stepEmoji}>{step.emoji}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);
