const STEPS = [
  {
    emoji: '📍',
    title: 'Check In',
    desc: 'Arrive at a zone and broadcast your presence. Your location is shared as a geohash — never raw GPS.',
  },
  {
    emoji: '🔔',
    title: 'Ping',
    desc: 'See who else is in your zone. Send a ping to signal interest in connecting.',
  },
  {
    emoji: '🤝',
    title: 'Accept',
    desc: 'If the feeling is mutual, they accept. A bond is formed between your atoms.',
  },
  {
    emoji: '🧪',
    title: 'Bond',
    desc: 'Mutual bonds count co-presence over time. The more you show up, the stronger the bond.',
  },
  {
    emoji: '👁️',
    title: 'Witness',
    desc: 'Other atoms can witness your check-in, building a web of trust without central authority.',
  },
  {
    emoji: '⚡',
    title: 'Evolve',
    desc: 'Reactions, valence scores, and era milestones mark your shared journey.',
  },
];

export function HowItWorks() {
  return (
    <section id="how">
      <div>
        <div className="section-label">The Game Loop</div>
        <h2>How BONDING Works</h2>
        <p className="lead">
          There are no profiles to swipe. No DMs. No algorithms. You show up at a real place, and
          the game handles the rest.
        </p>
        <div className="steps">
          {STEPS.map((step, i) => (
            <div className="step" key={step.title}>
              <div className="step-number">{i + 1}</div>
              <div className="emoji">{step.emoji}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
