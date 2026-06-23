import { create } from 'zustand';
import type { AtomPublic, Bond, ZoneId } from '@meatspace/shared-types';

export interface PendingPing {
  pingId: string;
  fromUserId: string;
  zoneId: ZoneId;
}

interface GameState {
  // Connection
  connected: boolean;
  serverUrl: string;

  // Identity
  userId: string | null;
  publicKeyJwk: JsonWebKey | null;
  privateKeyJwk: JsonWebKey | null;
  profile: AtomPublic | null;

  // World
  nearbyAtoms: AtomPublic[];
  zones: ZoneId[];
  currentZone: ZoneId | null;

  // Bonds
  bonds: Bond[];
  pendingPings: PendingPing[];

  // Health
  energyLevel: number | null;
  healthOptIn: boolean;

  // Messages
  messages: { type: string; data: any; timestamp: number }[];

  // Actions
  setConnected: (connected: boolean) => void;
  setIdentity: (userId: string, publicKey: JsonWebKey, privateKey: JsonWebKey) => void;
  setProfile: (profile: AtomPublic) => void;
  setNearbyAtoms: (atoms: AtomPublic[]) => void;
  setCurrentZone: (zone: ZoneId | null) => void;
  addBond: (bond: Bond) => void;
  addPing: (ping: PendingPing) => void;
  removePing: (pingId: string) => void;
  addMessage: (type: string, data: any) => void;
  setServerUrl: (url: string) => void;
  setEnergyLevel: (level: number | null) => void;
  setHealthOptIn: (optIn: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  connected: false,
  serverUrl: 'https://bonding-server.onrender.com',

  userId: null,
  publicKeyJwk: null,
  privateKeyJwk: null,
  profile: null,

  nearbyAtoms: [],
  zones: ['calm', 'lab', 'kitchen', 'deep', 'wild'],
  currentZone: null,

  bonds: [],
  pendingPings: [],
  energyLevel: null,
  healthOptIn: (() => {
    try {
      return (
        typeof localStorage !== 'undefined' &&
        localStorage.getItem('bonding_health_opt_in') === 'true'
      );
    } catch {
      return false;
    }
  })(),
  messages: [],

  setConnected: (connected) => set({ connected }),
  setIdentity: (userId, publicKey, privateKey) =>
    set({ userId, publicKeyJwk: publicKey, privateKeyJwk: privateKey }),
  setProfile: (profile) => set({ profile }),
  setNearbyAtoms: (atoms) => set({ nearbyAtoms: atoms }),
  setCurrentZone: (zone) => set({ currentZone: zone }),
  addBond: (bond) => set((s) => ({ bonds: [...s.bonds.filter((b) => b.id !== bond.id), bond] })),
  addPing: (ping) => set((s) => ({ pendingPings: [...s.pendingPings, ping] })),
  removePing: (pingId) =>
    set((s) => ({ pendingPings: s.pendingPings.filter((p) => p.pingId !== pingId) })),
  addMessage: (type, data) =>
    set((s) => ({ messages: [...s.messages.slice(-50), { type, data, timestamp: Date.now() }] })),
  setServerUrl: (url) => set({ serverUrl: url }),
  setEnergyLevel: (level) => set({ energyLevel: level }),
  setHealthOptIn: (optIn) => {
    try {
      localStorage.setItem('bonding_health_opt_in', String(optIn));
    } catch {}
    set({ healthOptIn: optIn });
  },
}));
