export function Hero() {
  return (
    <section id="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="dot" />
          v0.1.0 — Hyperlocal Pilot
        </div>
        <h1 className="hero-title">
          Humans are <span className="gradient">atoms</span>.<br />
          Relationships are <span className="gradient">bonds</span>.
        </h1>
        <p className="hero-subtitle">
          A real-world social game where presence replaces profiles,
          co-presence replaces matching, and bonds form through
          shared time in shared space.
        </p>
        <p className="hero-tagline">"Same bowl, same room — your people first."</p>
        <div className="hero-buttons">
          <a href="#how" className="btn btn-primary">
            How It Works ↓
          </a>
          <a href="#start" className="btn btn-secondary">
            Get Started
          </a>
          <a href="https://github.com/anomalyco/bonding" className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
            GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}
