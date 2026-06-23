import { useState, useEffect } from 'react';

const ENDPOINT = 'https://cashpilot-sync.trimtab-signal.workers.dev/api/k4/features';

import { FeatureRow } from './types';

export function safeParseK4Payload(raw: unknown): Record<string, FeatureRow> {
  if (!raw || typeof raw !== 'object') return {};
  const safe: Record<string, FeatureRow> = Object.create(null);
  const data = (raw as any).features || raw;
  if (typeof data !== 'object' || data === null) return {};

  for (const [key, val] of Object.entries(data)) {
    if (typeof val === 'object' && val !== null) {
      const levels = ['L0', 'L1', 'L2', 'L3', 'L4'];
      const valid = levels.every((l) => typeof (val as any)[l] === 'number');
      if (valid) safe[key] = val as FeatureRow;
    }
  }
  return safe;
}

export function useK4Features() {
  const [features, setFeatures] = useState<Record<string, FeatureRow> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let latestRequestId = 0;

    const fetchData = async () => {
      const requestId = ++latestRequestId;
      try {
        const res = await fetch(ENDPOINT, { signal: AbortSignal.timeout(8000) });
        const raw = await res.json();
        if (isMounted && requestId === latestRequestId) {
          const parsed = safeParseK4Payload(raw);
          setFeatures(parsed);
          setError(null);
        }
      } catch (err) {
        if (isMounted && requestId === latestRequestId) {
          setError(err instanceof Error ? err.message : 'Endpoint unavailable');
        }
      } finally {
        if (isMounted && requestId === latestRequestId) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 6000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { features, loading, error };
}
