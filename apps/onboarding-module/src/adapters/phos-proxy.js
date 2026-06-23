export async function triggerPhosSession(endpoint, sessionData) {
    if (!endpoint)
        return { forwarded: false, reason: 'no-endpoint' };
    try {
        const payload = { event: 'phos:session:start', data: sessionData, emittedAt: new Date().toISOString() };
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok)
            return { forwarded: false, reason: `http-${res.status}` };
        return { forwarded: true, endpoint, event: 'phos:session:start' };
    }
    catch (err) {
        return { forwarded: false, reason: err instanceof Error ? err.message : 'network-error' };
    }
}
//# sourceMappingURL=phos-proxy.js.map