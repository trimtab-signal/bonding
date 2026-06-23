import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import OnboardingModule from './planes/Orchestrator';
import './global.css';

function mount(container: HTMLElement | null, config: any) {
  if (!container) return;
  createRoot(container).render(<OnboardingModule {...config} />);
}

declare global {
  interface Window {
    initDeltaIgnition: (config: any) => { start: () => void; resume: () => void; skipTo: (plane: string) => void; getState: () => any };
  }
}

window.initDeltaIgnition = (config: any) => {
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
    skipTo: (_plane: string) => { /* orchestrator handles hash */ },
    getState: () => ({ mode: config.mode, timestamp: Date.now() }),
  };
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OnboardingModule mode="full" resume={false} onComplete={() => {}} onError={() => {}} />
  </StrictMode>
);
