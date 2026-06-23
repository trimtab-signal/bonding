import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import OnboardingModule from './planes/Orchestrator';
import './global.css';
function mount(container, config) {
    if (!container)
        return;
    createRoot(container).render(_jsx(OnboardingModule, { ...config }));
}
window.initDeltaIgnition = (config) => {
    let container = document.getElementById('delta-ignition-root');
    if (!container) {
        container = document.createElement('div');
        container.id = 'delta-ignition-root';
        document.body.appendChild(container);
    }
    mount(container, config);
    return {
        start: () => mount(container, config),
        resume: () => mount(container, { ...config, resume: true }),
        skipTo: (_plane) => { },
        getState: () => ({ mode: config.mode, timestamp: Date.now() }),
    };
};
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(OnboardingModule, { mode: "full", resume: false, onComplete: () => { }, onError: () => { } }) }));
//# sourceMappingURL=main.js.map