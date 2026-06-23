export interface PhosSessionEvent {
    event: 'phos:session:start' | 'phos:session:end' | 'phos:event';
    data: Record<string, unknown>;
    emittedAt: string;
}
export declare function triggerPhosSession(endpoint: string | undefined, sessionData: Record<string, unknown>): Promise<{
    forwarded: boolean;
    reason: string;
    endpoint?: undefined;
    event?: undefined;
} | {
    forwarded: boolean;
    endpoint: string;
    event: string;
    reason?: undefined;
}>;
//# sourceMappingURL=phos-proxy.d.ts.map