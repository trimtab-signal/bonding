const BOND_TYPES = [
  {
    title: '🤝 Mutual',
    desc: 'The standard bond. Formed when two atoms accept each other\'s ping. Grows through co-presence in shared zones.',
    tag: 'Default',
    tagColor: 'var(--accent)',
  },
  {
    title: '🧭 Mentor',
    desc: 'An asymmetric bond for guidance and teaching. One atom leads, the other learns. Built through consistent check-ins.',
    tag: 'Coming Soon',
    tagColor: 'var(--lab)',
  },
  {
    title: '🌱 Sibling',
    desc: 'A peer bond for deep collaboration. Formed when two atoms complete a shared project or milestone together.',
    tag: 'Coming Soon',
    tagColor: 'var(--deep)',
  },
];

const ENERGY_ZONES = [
  { range: '< 30%', zone: 'Calm 🌿', desc: 'Low energy — rest, reflect, be present without pressure' },
  { range: '30–60%', zone: 'Kitchen 🍳', desc: 'Moderate — share a meal, warm conversation' },
  { range: '60–80%', zone: 'Lab 🔬', desc: 'Good energy — build and create together' },
  { range: '≥ 80%', zone: 'Wild 🌀', desc: 'High energy — adventure and exploration' },
];

export function BondingMechanics() {
  return (
    <section id="mechanics">
      <div>
        <div className="section-label">Relationship Types</div>
        <h2>Bonding Mechanics</h2>
        <p className="lead">
          Bonds track real co-presence — not likes, not messages.
          Every check-in with a bonded atom deepens the connection.
        </p>
        <div className="bond-types">
          {BOND_TYPES.map((bt) => (
            <div className="bond-type" key={bt.title}>
              <h3>{bt.title}</h3>
              <p>{bt.desc}</p>
              <span className="tag" style={{ background: bt.tagColor + '20', color: bt.tagColor }}>{bt.tag}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 60 }}>
          <div className="section-label">Energy-Aware Zones</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            🌿 Your Energy Matches the Zone
          </h3>
          <p className="lead" style={{ marginBottom: 32 }}>
            BONDING reads PHOS health data (on-device only) to suggest
            the best zone for your current capacity. No data leaves
            your device unless you opt in.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {ENERGY_ZONES.map((ez) => (
              <div key={ez.range} style={{
                padding: 20, borderRadius: 'var(--radius)',
                border: '1px solid var(--border)', background: 'var(--bg)',
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{ez.range}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{ez.zone}</div>
                <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>{ez.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
