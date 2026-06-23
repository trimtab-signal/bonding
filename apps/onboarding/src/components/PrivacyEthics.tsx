const FEATURES = [
  {
    icon: '🔐',
    title: 'Geohash-Only Location',
    desc: 'Your precise GPS never leaves your device. Only a geohash prefix (≈4.9 km² at MVP precision) is shared.',
  },
  {
    icon: '🗝️',
    title: 'Ephemeral Key Pairs',
    desc: 'Identity is derived from a cryptographic key pair stored locally. No account, no email, no password.',
  },
  {
    icon: '👁️',
    title: 'Witness Consensus',
    desc: 'Check-ins can be witnessed by other atoms, building a distributed web of trust without a central authority.',
  },
  {
    icon: '🌿',
    title: 'On-Device Health Data',
    desc: 'PHOS health data stays on your device. Only a scalar energy level is shared when you explicitly opt in.',
  },
];

const ETHICS = [
  {
    icon: '🚫',
    title: 'No Streaks',
    desc: 'You are not punished for taking a day off. Presence is genuine, not gamified.',
  },
  {
    icon: '🚫',
    title: 'No Leaderboards',
    desc: 'There is no winner. The goal is real connection, not competition.',
  },
  {
    icon: '🚫',
    title: 'No Variable Rewards',
    desc: 'No random loot, no dopamine slots. Bonds grow predictably through real presence.',
  },
  {
    icon: '🚫',
    title: 'No Surveillance',
    desc: 'No tracking, no data selling, no ads. The server only stores what is cryptographically required.',
  },
];

export function PrivacyEthics() {
  return (
    <section id="privacy">
      <div>
        <div className="section-label">Privacy by Design</div>
        <h2>Your Data Stays Yours</h2>
        <p className="lead">
          BONDING is built from the ground up to be private by default. No accounts, no tracking, no
          surveillance.
        </p>
        <div className="principles">
          {FEATURES.map((f) => (
            <div className="principle" key={f.title}>
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 60 }}>
          <div className="section-label">Ethical Design</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            Designed for Humans, Not Engagement
          </h3>
          <p className="lead" style={{ marginBottom: 32 }}>
            BONDING explicitly avoids every dark pattern common in social media.
          </p>
          <div className="principles">
            {ETHICS.map((e) => (
              <div className="principle" key={e.title}>
                <div className="icon">{e.icon}</div>
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
