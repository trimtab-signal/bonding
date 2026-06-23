export interface K4Node {
    id: string;
    label: string;
    location: string;
    status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
    deltaClass: string;
    load: number;
}
export interface K4NetworkStatus {
    timestamp: number;
    active: number;
    degraded: number;
    offline: number;
    total: number;
    topology: 'diamond' | 'wye' | 'delta' | 'unstable';
    nodes: K4Node[];
}
export declare function getK4NetworkStatus(endpoint: string | undefined): Promise<K4NetworkStatus | null>;
export declare function pushK4Entry(endpoint: string, entry: Record<string, unknown>): Promise<void>;
export declare function validateWyeDelta(endpoint: string | undefined): Promise<boolean>;
//# sourceMappingURL=k4-bridge.d.ts.map