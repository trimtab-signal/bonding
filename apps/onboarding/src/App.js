import { jsx as _jsx } from 'react/jsx-runtime';
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
function redirectAndRenderFallback(url) {
  window.location.replace(url);
  throw new Error(`Redirecting to ${url}`);
}
function getPage(path) {
  switch (path) {
    case '/delta-ignition':
      return redirectAndRenderFallback(DELTA_IGNITION_URL);
    case '/trim-tabs':
      return redirectAndRenderFallback(TRIM_SEQUENCE_URL);
    case '/fleet':
      return redirectAndRenderFallback(FLEET_STATUS_URL);
    case '/how-it-works':
      return _jsx(HowItWorks, {});
    case '/zones':
      return _jsx(Zones, {});
    case '/about':
      return _jsx(About, {});
    case '/join':
      return _jsx(Join, {});
    case '/demo':
      return _jsx(Demo, {});
    case '/press':
      return _jsx(Press, {});
    case '/pilot':
      return _jsx(Pilot, {});
    default:
      return _jsx(Home, {});
  }
}
export default function App() {
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');
  useEffect(() => {
    const handler = () => setPath(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return _jsx(ErrorBoundary, {
    children: _jsx('div', { className: styles.app, children: getPage(path) }),
  });
}
//# sourceMappingURL=App.js.map
