import { useState, useId } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import styles from './Pilot.module.css';

export const Pilot: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [area, setArea] = useState('');
  const [heard, setHeard] = useState('');
  const nameId = useId();
  const emailId = useId();
  const areaId = useId();
  const heardId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('BONDING Pilot Sign-Up');
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nArea: ${area}\nHeard from: ${heard}`
    );
    window.open(`mailto:pilot@bonding.p31ca.org?subject=${subject}&body=${body}`);
    setSubmitted(true);
  };

  return (
    <Layout>
      <section className={styles.section}>
        <div className={styles.inner}>
          <span className={styles.label}>Get Involved</span>
          <h2 className={styles.title}>Join the Pilot</h2>
          <p className={styles.desc}>
            We're running hyperlocal pilots in <strong>Kingsland/St. Marys, GA</strong>.
            Sign up below and we'll send you everything you need to get started.
          </p>

          {submitted ? (
            <Card variant="elevated" className={styles.success}>
              <span className={styles.successIcon}>📬</span>
              <h3>You're on the list!</h3>
              <p>We'll reach out at <strong>{email}</strong> with next steps. In the meantime, try the demo:</p>
              <a href="#/demo" className={styles.demoLink}>🧪 Try the Living Molecule Demo →</a>
            </Card>
          ) : (
            <Card variant="elevated" className={styles.form}>
              <form onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label htmlFor={nameId}>Name</label>
                  <input id={nameId} value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" />
                </div>
                <div className={styles.field}>
                  <label htmlFor={emailId}>Email</label>
                  <input id={emailId} type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
                </div>
                <div className={styles.field}>
                  <label htmlFor={areaId}>City / Area</label>
                  <input id={areaId} value={area} onChange={e => setArea(e.target.value)} required placeholder="Kingsland, GA" />
                </div>
                <div className={styles.field}>
                  <label htmlFor={heardId}>How did you hear about us?</label>
                  <input id={heardId} value={heard} onChange={e => setHeard(e.target.value)} placeholder="Twitter, friend, etc." />
                </div>
                <Button variant="primary" size="lg" fullWidth>Sign Up →</Button>
                <p className={styles.privacy}>
                  No spam. We'll only use this to contact you about the pilot.
                </p>
              </form>
            </Card>
          )}

          <div className={styles.info}>
            <h3>What happens next?</h3>
            <ol className={styles.steps}>
              <li>We review your sign-up and confirm your area</li>
              <li>You receive a welcome email with setup instructions</li>
              <li>Open the app, check in, and start bonding</li>
              <li>Share feedback at week 2 and week 4</li>
            </ol>
          </div>
        </div>
      </section>
    </Layout>
  );
};
