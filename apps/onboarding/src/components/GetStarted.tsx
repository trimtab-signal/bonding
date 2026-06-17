const START_STEPS = [
  { title: 'Clone the repo', desc: 'git clone https://github.com/anomalyco/bonding && cd bonding' },
  { title: 'Install dependencies', desc: 'pnpm install (requires Node 20+ and pnpm 9+)' },
  { title: 'Start the database', desc: 'pnpm docker:up — spins up PostgreSQL with PostGIS via Docker Compose' },
  { title: 'Run migrations & seed', desc: 'pnpm db:migrate && pnpm db:seed — creates tables and sample atoms' },
  { title: 'Set zone coordinates', desc: 'Edit packages/shared-types/src/index.ts — replace lat:0,lng:0 with real coordinates for your neighborhood.' },
  { title: 'Start the server', desc: 'pnpm dev:server — Express + Socket.io on port 3001' },
  { title: 'Start the app', desc: 'pnpm dev:mobile — Vite dev server on port 5173' },
  { title: 'Invite your people', desc: 'Share the URL with 5–10 friends in the same neighborhood. Run the 4-week hyperlocal pilot.' },
];

export function GetStarted() {
  return (
    <section id="start">
      <div>
        <div className="section-label">Launch Your Pilot</div>
        <h2>Get Started in 8 Steps</h2>
        <p className="lead" style={{ margin: '0 auto' }}>
          BONDING is designed for hyperlocal pilots. Everything you need
          to run one in your neighborhood is in the repo.
        </p>
        <div className="start-steps">
          {START_STEPS.map((s, i) => (
            <div className="start-step" key={i}>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="start-cta">
          <a href="https://github.com/anomalyco/bonding" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
            View on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}
