const MAPPING = [
  { car: 'Atoms', bonding: 'Humans', icon: '⚛️', desc: 'Each person is a unique atom with properties — skills, interests, energy level.' },
  { car: 'Bonds', bonding: 'Relationships', icon: '🤝', desc: 'Real connections form between atoms through mutual opt-in and shared presence.' },
  { car: 'Reactions', bonding: 'Collaborative problem-solving', icon: '⚡', desc: 'When atoms come together, reactions happen — helping, building, sharing.' },
  { car: 'Zones', bonding: 'Physical places', icon: '📍', desc: 'Calm, Lab, Kitchen, Deep, Wild — each zone defines a social context.' },
  { car: 'Valence', bonding: 'Trust & reliability', icon: '💎', desc: 'A hidden reputation scalar that rewards showing up and penalizes flaking.' },
];

const ZONE_ENERGY = [
  { zone: '🌿 Calm', energy: '< 30%', color: 'var(--calm)', bg: 'rgba(107,158,107,0.1)' },
  { zone: '🍳 Kitchen', energy: '30–60%', color: 'var(--kitchen)', bg: 'rgba(212,168,75,0.1)' },
  { zone: '🔬 Lab', energy: '60–80%', color: 'var(--lab)', bg: 'rgba(155,107,176,0.1)' },
  { zone: '🌀 Wild', energy: '≥ 80%', color: 'var(--wild)', bg: 'rgba(212,107,75,0.1)' },
];

export function MolecularMetaphor() {
  return (
    <section id="metaphor">
      <div>
        <div className="section-label">The Science Metaphor</div>
        <h2>From C.A.R.S. to Meatspace</h2>
        <p className="lead">
          BONDING translates the digital molecular simulation C.A.R.S.
          into a real-world game. Every concept maps directly from
          chemistry to human connection.
        </p>

        <div className="metaphor-diagram">
          <div className="metaphor-molecule">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="metaphor-electron"
                style={{
                  animationDelay: `${i * 0.7}s`,
                  '--orbit-angle': `${i * 72}deg`,
                  '--orbit-color': ['var(--accent)', 'var(--lab)', 'var(--kitchen)', 'var(--deep)', 'var(--wild)'][i],
                } as React.CSSProperties}
              />
            ))}
            <div className="metaphor-nucleus">
              <span>BONDING</span>
            </div>
          </div>
        </div>

        <div className="metaphor-grid">
          <div className="metaphor-header">
            <span>C.A.R.S. (Digital)</span>
            <span className="metaphor-arrow">→</span>
            <span>BONDING (Meatspace)</span>
          </div>
          {MAPPING.map((m) => (
            <div className="metaphor-row" key={m.car}>
              <div className="metaphor-cell">
                <span className="metaphor-icon">{m.icon}</span>
                <span>{m.car}</span>
              </div>
              <div className="metaphor-arrow-cell">→</div>
              <div className="metaphor-cell">
                <strong>{m.bonding}</strong>
              </div>
              <div className="metaphor-desc">{m.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64 }}>
          <div className="section-label">Energy Matches Zone</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            Your State Picks the Space
          </h3>
          <p className="lead" style={{ marginBottom: 32 }}>
            Your energy level — computed from PHOS health data on-device —
            determines which zone fits your current capacity.
          </p>
          <div className="energy-bar-track">
            <div className="energy-bar">
              {ZONE_ENERGY.map((ze) => (
                <div
                  key={ze.zone}
                  className="energy-segment"
                  style={{ background: ze.bg, borderColor: ze.color }}
                >
                  <span className="energy-range">{ze.energy}</span>
                  <span className="energy-label">{ze.zone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
