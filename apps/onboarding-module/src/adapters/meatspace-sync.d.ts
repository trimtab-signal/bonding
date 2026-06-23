export interface GroundTruthPayload {
    plane: string;
    planeData: Record<string, unknown>;
    biological?: {
        calciumProtocolActive: boolean;
        medicalFloorSchema: string;
        somaticState: 'neutral' | 'wye' | 'delta' | 'stable';
    };
    source?: 'localStorage' | 'runtime' | 'remote';
    syncedAt: string;
    timestamp: number;
    at?: number;
}
export declare function syncGroundTruth(endpoint: string | undefined, payload: GroundTruthPayload): Promise<{
    synced: boolean;
    reason: string;
    endpoint?: undefined;
    at?: undefined;
} | {
    synced: boolean;
    endpoint: string;
    at: string;
    reason?: undefined;
}>;
export declare function syncMedicalFloor(endpoint: string | undefined, floorData: Record<string, unknown>): Promise<{
    synced: boolean;
    reason: string;
    endpoint?: undefined;
    at?: undefined;
} | {
    synced: boolean;
    endpoint: string;
    at: string;
    reason?: undefined;
}>;
//# sourceMappingURL=meatspace-sync.d.ts.map