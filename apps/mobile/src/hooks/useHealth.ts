import { useEffect, useState } from 'react';

export interface HealthSummary {
  energyLevel: number;
  sleepScore: number;
  calcium: number;
  spoons: number;
  lastUpdated: number;
}

export function useHealth() {
  const [health, setHealth] = useState<HealthSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const readHealth = async () => {
    try {
      let raw: string;
      try {
        // Try fetching from local PHOS HTTP endpoint (dev mode)
        const resp = await fetch('http://localhost:3000/p31/health-summary.json', {
          signal: AbortSignal.timeout(2000),
        });
        raw = await resp.text();
      } catch {
        // Fallback: try from public directory or mock
        const resp = await fetch('/health-summary.json', { signal: AbortSignal.timeout(2000) });
        raw = await resp.text();
      }
      const data = JSON.parse(raw);
      const sleep = data.sleepScore ?? 0.7;
      const calcium = data.calcium ?? 0.8;
      const spoons = data.spoons ?? 0.6;
      const energyLevel = Math.min(1, Math.max(0, sleep * 0.3 + calcium * 0.3 + spoons * 0.4));
      setHealth({ energyLevel, sleepScore: sleep, calcium, spoons, lastUpdated: Date.now() });
    } catch {
      setHealth(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    readHealth();
    const interval = setInterval(readHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { health, loading, refetch: readHealth };
}
