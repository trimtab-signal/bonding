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

function getPage(path: string) {
  switch (path) {
    case '/how-it-works': return <HowItWorks />;
    case '/zones': return <Zones />;
    case '/about': return <About />;
    case '/join': return <Join />;
    case '/demo': return <Demo />;
    case '/press': return <Press />;
    case '/pilot': return <Pilot />;
    default: return <Home />;
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
