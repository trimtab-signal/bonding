import { useState } from 'react';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { OnboardingModal } from './components/OnboardingModal';
import { Toaster } from './components/ui';
import styles from './App.module.css';

type Tab = 'map' | 'profile';

export default function App() {
  const [tab, setTab] = useState<Tab>('map');
  return (
    <div className={styles.app}>
      <main className={styles.main}>
        {tab === 'map' ? <Home /> : <Profile />}
      </main>
      <nav className={styles.nav}>
        <button className={`${styles.tab} ${tab === 'map' ? styles.active : ''}`} onClick={() => setTab('map')}>🗺️ Map</button>
        <button className={`${styles.tab} ${tab === 'profile' ? styles.active : ''}`} onClick={() => setTab('profile')}>🧬 Profile</button>
      </nav>
      <OnboardingModal />
      <Toaster />
    </div>
  );
}
