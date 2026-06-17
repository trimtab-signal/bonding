import { useState } from 'react';
import { Home } from './pages/Home.js';
import { Profile } from './pages/Profile.js';

type Tab = 'map' | 'profile';

const TAB_STYLE = (active: boolean) => ({
  flex: 1, padding: '10px', textAlign: 'center' as const,
  border: 'none', background: active ? 'var(--accent)' : 'transparent',
  color: active ? '#fff' : 'var(--text-dim)', cursor: 'pointer',
  fontWeight: active ? 600 : 400, fontSize: 14,
  transition: 'all .2s',
});

export default function App() {
  const [tab, setTab] = useState<Tab>('map');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 'map' ? <Home /> : <Profile />}
      </main>
      <nav style={{
        display: 'flex', background: 'var(--surface2)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <button style={TAB_STYLE(tab === 'map')} onClick={() => setTab('map')}>
          🗺️ Map
        </button>
        <button style={TAB_STYLE(tab === 'profile')} onClick={() => setTab('profile')}>
          🧬 Profile
        </button>
      </nav>
    </div>
  );
}
