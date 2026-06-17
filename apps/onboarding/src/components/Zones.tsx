const ZONES = [
  { id: 'calm', emoji: '🌿', name: 'Calm', desc: 'Rest, reflection, low-stimulus presence', radius: '200m', color: 'var(--calm)' },
  { id: 'lab', emoji: '🔬', name: 'Lab', desc: 'Build, create, experiment together', radius: '200m', color: 'var(--lab)' },
  { id: 'kitchen', emoji: '🍳', name: 'Kitchen', desc: 'Share food, conversation, warmth', radius: '200m', color: 'var(--kitchen)' },
  { id: 'deep', emoji: '🌊', name: 'Deep', desc: 'Vulnerable conversation, emotional support', radius: '100m', color: 'var(--deep)' },
  { id: 'wild', emoji: '🌀', name: 'Wild', desc: 'Adventure, exploration, serendipity', radius: '500m', color: 'var(--wild)' },
];

export function Zones() {
  return (
    <section id="zones">
      <div>
        <div className="section-label">The Five Zones</div>
        <h2>Choose Your Space</h2>
        <p className="lead">
          Each zone defines a different social context. Your energy level
          and intentions guide which zone fits the moment.
        </p>
        <div className="zone-grid">
          {ZONES.map((z) => (
            <div className="zone-card" key={z.id} style={{ borderColor: z.color }}>
              <div className="emoji">{z.emoji}</div>
              <h3>{z.name}</h3>
              <p>{z.desc}</p>
              <span className="radius-badge">{z.radius} radius</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
