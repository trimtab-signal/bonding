export type Plane = 'magnum-walk' | 'trim-tabs' | 'fleet-status';
export interface OnboardingData {
    completed: boolean;
    plane: Plane;
    timestamp: number;
}
export interface DeltaIgnitionConfig {
    mode: 'full' | 'minimal';
    resume: boolean;
    onComplete: (data: OnboardingData) => void;
    onExit?: (step: string) => void;
    onError?: (err: Error) => void;
    onBack?: (from: Plane) => void;
    adapters?: {
        k4?: {
            endpoint: string;
        };
        meatspace?: {
            groundTruthPath?: string;
        };
        phos?: {
            endpoint: string;
        };
    };
}
export default function OnboardingModule({ mode, resume, onComplete, onExit, onBack, adapters }: DeltaIgnitionConfig): import("react").JSX.Element;
//# sourceMappingURL=Orchestrator.d.ts.map