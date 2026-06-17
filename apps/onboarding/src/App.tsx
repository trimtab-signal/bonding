import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Zones } from './components/Zones';
import { BondingMechanics } from './components/BondingMechanics';
import { MolecularMetaphor } from './components/MolecularMetaphor';
import { LiveDemo } from './components/LiveDemo';
import { PrivacyEthics } from './components/PrivacyEthics';
import { Community } from './components/Community';
import { GetStarted } from './components/GetStarted';

export function App() {
  return (
    <>
      <nav>
        <div>
          <span className="logo"><span>BONDING</span></span>
          <div className="links">
            <a href="#how">How It Works</a>
            <a href="#zones">Zones</a>
            <a href="#metaphor">Metaphor</a>
            <a href="#demo">Demo</a>
            <a href="#mechanics">Bonds</a>
            <a href="#privacy">Privacy</a>
            <a href="#community">Community</a>
            <a href="#start">Start</a>
          </div>
        </div>
      </nav>

      <Hero />
      <HowItWorks />
      <Zones />
      <MolecularMetaphor />
      <LiveDemo />
      <BondingMechanics />
      <PrivacyEthics />
      <Community />
      <GetStarted />

      <footer>
        <div className="links">
          <a href="https://github.com/anomalyco/bonding" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://opencode.ai" target="_blank" rel="noopener noreferrer">Built with opencode</a>
          <a href="https://github.com/anomalyco/bonding/issues" target="_blank" rel="noopener noreferrer">Report an Issue</a>
        </div>
        <p>BONDING v0.1.0 — Humans are atoms, relationships are bonds.</p>
        <p style={{ marginTop: 4, fontSize: 11, opacity: 0.5 }}>
          No tracking. No ads. No surveillance.
        </p>
      </footer>
    </>
  );
}
