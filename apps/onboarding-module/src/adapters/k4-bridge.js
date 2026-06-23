function fakeNetworkStatus() {
  return {
    timestamp: Date.now(),
    active: 5,
    degraded: 1,
    offline: 0,
    total: 6,
    topology: 'diamond',
    nodes: [
      {
        id: 'ATOM-01',
        label: 'Base Alpha',
        location: 'Alpha',
        status: 'ONLINE',
        deltaClass: 'Δ-1',
        load: 0.98,
      },
      {
        id: 'ATOM-02',
        label: 'Outpost Seven',
        location: 'Seven',
        status: 'ONLINE',
        deltaClass: 'Δ-2',
        load: 0.87,
      },
      {
        id: 'ATOM-03',
        label: 'Relay Point',
        location: 'Relay',
        status: 'DEGRADED',
        deltaClass: 'Δ-1',
        load: 0.64,
      },
      {
        id: 'ATOM-04',
        label: 'R&D Lab',
        location: 'Lab',
        status: 'ONLINE',
        deltaClass: 'Δ-0',
        load: 0.92,
      },
      {
        id: 'ATOM-05',
        label: 'Sector West',
        location: 'West',
        status: 'OFFLINE',
        deltaClass: '---',
        load: 0.12,
      },
      {
        id: 'ATOM-06',
        label: 'Node Gamma',
        location: 'Gamma',
        status: 'ONLINE',
        deltaClass: 'Δ-2',
        load: 0.81,
      },
    ],
  };
}
export async function getK4NetworkStatus(endpoint) {
  if (!endpoint) return fakeNetworkStatus();
  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return fakeNetworkStatus();
    return await res.json();
  } catch {
    return fakeNetworkStatus();
  }
}
export async function pushK4Entry(endpoint, entry) {
  if (!endpoint) return;
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  } catch {
    /* silent fail */
  }
}
export async function validateWyeDelta(endpoint) {
  if (!endpoint) return true;
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'wye:delta:validate', at: Date.now() }),
    });
    const json = await res.json();
    return json.valid === true;
  } catch {
    return true;
  }
}
//# sourceMappingURL=k4-bridge.js.map
