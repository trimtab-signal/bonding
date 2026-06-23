import './global.css';
declare global {
    interface Window {
        initDeltaIgnition: (config: any) => {
            start: () => void;
            resume: () => void;
            skipTo: (plane: string) => void;
            getState: () => any;
        };
    }
}
//# sourceMappingURL=main.d.ts.map