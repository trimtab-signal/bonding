export interface PhosSessionEvent {
  event: 'phos:session:start' | 'phos:session:end' | 'phos:event';
  data: Record<string, unknown>;
  emittedAt: string;
}

export async function triggerPhosSession(endpoint: string | undefined, sessionData: Record<string, unknown>) {
  if (!endpoint) return { forwarded: false, reason: 'no-endpoint' };
  try {
    const payload: PhosSessionEvent = { event: 'phos:session:start', data: sessionData, emittedAt: new Date().toISOString() };
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) return { forwarded: false, reason: `http-${res.status}` };
    return { forwarded: true, endpoint, event: 'phos:session:start' };
  } catch (err) {
    return { forwarded: false, reason: err instanceof Error ? err.message : 'network-error' };
  }
}
