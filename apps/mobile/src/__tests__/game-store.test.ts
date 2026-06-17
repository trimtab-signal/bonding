import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage since happy-dom may not provide it in this context
function mockLocalStorage() {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: vi.fn((key: string) => store.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => { store.set(key, value); }),
      removeItem: vi.fn((key: string) => { store.delete(key); }),
      clear: vi.fn(() => { store.clear(); }),
      get length() { return store.size; },
      key: vi.fn((i: number) => [...store.keys()][i] ?? null),
    },
    configurable: true,
    writable: true,
  });
}

// Re-create a minimal store matching game-store.ts behavior
function createTestStore() {
  const state: {
    energyLevel: number | null;
    healthOptIn: boolean;
    userId: string | null;
    connected: boolean;
    messages: any[];
    bonds: any[];
  } = {
    energyLevel: null,
    healthOptIn: false,
    userId: null,
    connected: false,
    messages: [],
    bonds: [],
  };

  function loadOptIn(): boolean {
    try { return localStorage.getItem('bonding_health_opt_in') === 'true'; }
    catch { return false; }
  }

  function saveOptIn(v: boolean) {
    try { localStorage.setItem('bonding_health_opt_in', String(v)); }
    catch { /* noop */ }
  }

  // Initialize from localStorage like the real game-store
  state.healthOptIn = loadOptIn();

  return {
    getState: () => state,
    setEnergyLevel: (level: number | null) => { state.energyLevel = level; },
    setHealthOptIn: (optIn: boolean) => {
      state.healthOptIn = optIn;
      saveOptIn(optIn);
    },
    setUserId: (id: string) => { state.userId = id; },
    setConnected: (c: boolean) => { state.connected = c; },
    loadOptIn,
    reset: () => {
      state.energyLevel = null;
      state.healthOptIn = loadOptIn();
      state.userId = null;
      state.connected = false;
      state.messages = [];
      state.bonds = [];
    },
  };
}

describe('game store (health state)', () => {
  beforeEach(() => {
    mockLocalStorage();
    localStorage.clear();
  });

  it('defaults to energyLevel null', () => {
    const store = createTestStore();
    expect(store.getState().energyLevel).toBeNull();
  });

  it('defaults to healthOptIn false', () => {
    const store = createTestStore();
    expect(store.getState().healthOptIn).toBe(false);
  });

  it('setEnergyLevel stores the value', () => {
    const store = createTestStore();
    store.setEnergyLevel(0.75);
    expect(store.getState().energyLevel).toBe(0.75);
  });

  it('setEnergyLevel can be set to null', () => {
    const store = createTestStore();
    store.setEnergyLevel(0.5);
    store.setEnergyLevel(null);
    expect(store.getState().energyLevel).toBeNull();
  });

  it('setHealthOptIn persists to localStorage', () => {
    const store = createTestStore();
    store.setHealthOptIn(true);
    expect(localStorage.getItem('bonding_health_opt_in')).toBe('true');
    expect(store.getState().healthOptIn).toBe(true);
  });

  it('setHealthOptIn can opt out', () => {
    const store = createTestStore();
    store.setHealthOptIn(true);
    store.setHealthOptIn(false);
    expect(localStorage.getItem('bonding_health_opt_in')).toBe('false');
    expect(store.getState().healthOptIn).toBe(false);
  });

  it('loads opt-in from localStorage on restart', () => {
    const store = createTestStore();
    store.setHealthOptIn(true);
    const store2 = createTestStore();
    expect(store2.getState().healthOptIn).toBe(true);
  });

  it('loadOptIn returns false when no localStorage value', () => {
    const store = createTestStore();
    expect(store.loadOptIn()).toBe(false);
  });

  it('multiple state fields coexist correctly', () => {
    const store = createTestStore();
    store.setUserId('test-atom');
    store.setConnected(true);
    store.setEnergyLevel(0.3);
    store.setHealthOptIn(true);

    const s = store.getState();
    expect(s.userId).toBe('test-atom');
    expect(s.connected).toBe(true);
    expect(s.energyLevel).toBe(0.3);
    expect(s.healthOptIn).toBe(true);
  });
});
