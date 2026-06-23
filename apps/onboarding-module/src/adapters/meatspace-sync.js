export async function syncGroundTruth(endpoint, payload) {
  if (!endpoint) return { synced: false, reason: 'no-endpoint' };
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { synced: false, reason: `http-${res.status}` };
    return { synced: true, endpoint, at: new Date().toISOString() };
  } catch (err) {
    return { synced: false, reason: err instanceof Error ? err.message : 'network-error' };
  }
}
export async function syncMedicalFloor(endpoint, floorData) {
  return syncGroundTruth(endpoint, {
    plane: 'medical-floor',
    planeData: floorData,
    source: 'localStorage',
    syncedAt: new Date().toISOString(),
    timestamp: Date.now(),
  });
}
//# sourceMappingURL=meatspace-sync.js.map
