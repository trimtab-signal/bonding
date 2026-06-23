import { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { Zones } from './pages/Zones';
import { About } from './pages/About';
import { Join } from './pages/Join';
import { Demo } from './pages/Demo';
import { Press } from './pages/Press';
import { Pilot } from './pages/Pilot';
import styles from './App.module.css';

const DELTA_IGNITION_URL = 'https://delta-ignition.p31ca.org';
const TRIM_SEQUENCE_URL = 'https://trim-sequence.p31ca.org';
const FLEET_STATUS_URL = 'https://fleet-status.p31ca.org';

function redirectAndRenderFallback(url: string): never {
  window.location.replace(url);
  throw new Error(`Redirecting to ${url}`);
}

function getPage(path: string) {
  switch (path) {
    case '/delta-ignition':
      return redirectAndRenderFallback(DELTA_IGNITION_URL);
    case '/trim-tabs':
      return redirectAndRenderFallback(TRIM_SEQUENCE_URL);
    case '/fleet':
      return redirectAndRenderFallback(FLEET_STATUS_URL);
    case '/how-it-works':
      return <HowItWorks />;
    case '/zones':
      return <Zones />;
    case '/about':
      return <About />;
    case '/join':
      return <Join />;
    case '/demo':
      return <Demo />;
    case '/press':
      return <Press />;
    case '/pilot':
      return <Pilot />;
    default:
      return <Home />;
  }
}

export default function App() {
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handler = () => setPath(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return (
    <ErrorBoundary>
      <div className={styles.app}>{getPage(path)}</div>
    </ErrorBoundary>
  );
}
