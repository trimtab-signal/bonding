const PARTICLES = [
  { label: 'You', color: 'var(--accent)', orbit: 1, speed: 12, delay: 0 },
  { label: 'Friend', color: 'var(--lab)', orbit: 1.6, speed: 15, delay: 1 },
  { label: 'Mate', color: 'var(--kitchen)', orbit: 2.2, speed: 18, delay: 2 },
  { label: 'Peer', color: 'var(--deep)', orbit: 1.3, speed: 10, delay: 0.5 },
  { label: 'Buddy', color: 'var(--wild)', orbit: 1.9, speed: 14, delay: 1.5 },
];

export function LiveDemo() {
  return (
    <section id="demo">
      <div>
        <div className="section-label">Live Demo</div>
        <h2>See the Molecule in Motion</h2>
        <p className="lead">
          Atoms orbiting, bonds forming, zones lighting up.
          This is BONDING — your neighborhood as a living molecule.
        </p>

        <div className="demo-container">
          <div className="demo-molecule">
            <div className="demo-nucleus">
              <span>BOND</span>
            </div>
            {PARTICLES.map((p) => (
              <div
                key={p.label}
                className="demo-particle"
                style={{
                  '--orbit': p.orbit,
                  '--speed': p.speed,
                  '--delay': `${p.delay}s`,
                  '--color': p.color,
                } as React.CSSProperties}
              >
                <div className="demo-atom" style={{ background: p.color }}>
                  <span>{p.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="demo-labels">
            <div className="demo-legend">
              <span className="demo-legend-dot" style={{ background: 'var(--accent)' }} />
              Bonded
            </div>
            <div className="demo-legend">
              <span className="demo-legend-dot" style={{ background: 'var(--border)' }} />
              Available
            </div>
            <div className="demo-legend">
              <span className="demo-legend-dot" style={{ background: 'var(--accent)', opacity: 0.3 }} />
              In Zone
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
