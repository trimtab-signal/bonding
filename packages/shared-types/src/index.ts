// ─── Identity & Crypto ───────────────────────────────────────────

export interface KeyPair {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}

export interface SignedPayload<T = unknown> {
  payload: T;
  signature: string;
  publicKeyJwk: JsonWebKey;
  timestamp: number;
}

// ─── Location & Check-in ─────────────────────────────────────────

export interface LocationProof {
  geohashPrefix: string;       // e.g. "9q8yy" — client-derived geohash
  geohashPrecision: number;    // 5 (~4.9km) for standard, 6 (~100m) for Deep
  lat: number;                 // raw GPS latitude — signed as part of payload
  lng: number;                 // raw GPS longitude — signed as part of payload
  witnessedBy: string[];       // public key fingerprints of witnesses
  witnessSignatures: string[];
  timestamp: number;
  signature: string;           // client ECDSA signature over `${geohashPrefix}:${lat}:${lng}:${timestamp}`
}

export interface CheckIn {
  userId: string;
  zoneId: ZoneId;
  locationProof: LocationProof;
  timestamp: number;
  energyLevel?: number;
}

// ─── Zones ───────────────────────────────────────────────────────

export type ZoneId = 'calm' | 'lab' | 'kitchen' | 'deep' | 'wild';

export interface ZoneDefinition {
  id: ZoneId;
  name: string;
  description: string;
  color: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  emoji: string;
}

// P1.1: MVP Zone Topology — KNG/STM centroid (Kingsland, GA / St. Marys, GA)
// JAX site (30.43053, -81.69309) reserved for future multi-site expansion.
const KNG_STM_CENTROID = { lat: 30.7824, lng: -81.6335 };

export const ZONES: Record<ZoneId, ZoneDefinition> = {
  calm: {
    id: 'calm',
    name: 'Calm',
    description: 'Rest, reflection, low-stimulus presence',
    color: '#6b9e6b',
    lat: KNG_STM_CENTROID.lat, lng: KNG_STM_CENTROID.lng, radiusMeters: 300,
    emoji: '🌿',
  },
  lab: {
    id: 'lab',
    name: 'Lab',
    description: 'Build, create, experiment together',
    color: '#9b6bb0',
    lat: KNG_STM_CENTROID.lat, lng: KNG_STM_CENTROID.lng, radiusMeters: 300,
    emoji: '🔬',
  },
  kitchen: {
    id: 'kitchen',
    name: 'Kitchen',
    description: 'Share food, conversation, warmth',
    color: '#d4a84b',
    lat: KNG_STM_CENTROID.lat, lng: KNG_STM_CENTROID.lng, radiusMeters: 300,
    emoji: '🍳',
  },
  deep: {
    id: 'deep',
    name: 'Deep',
    description: 'Vulnerable conversation, emotional support',
    color: '#4a7c9b',
    lat: KNG_STM_CENTROID.lat, lng: KNG_STM_CENTROID.lng, radiusMeters: 100,
    emoji: '🌊',
  },
  wild: {
    id: 'wild',
    name: 'Wild',
    description: 'Adventure, exploration, serendipity',
    color: '#d46b4b',
    lat: KNG_STM_CENTROID.lat, lng: KNG_STM_CENTROID.lng, radiusMeters: 1000,
    emoji: '🌀',
  },
};

// ─── Atoms (Users) ───────────────────────────────────────────────

export interface AtomPublic {
  id: string;                        // fingerprint of public key
  displayName: string;
  bio: string;
  skills: string[];
  interests: string[];
  zoneId: ZoneId | null;             // current zone (null = offline/unavailable)
  lastSeen: number;
  bondCount: number;
  atomType: 'operator' | 'family' | 'friend' | 'ally';
}

export interface AtomProfile {
  public: AtomPublic;
  valence: number;                   // 0.1–2.0, private — never sent to client
  createdAt: number;
  totalCheckIns: number;
  totalBonds: number;
}

// ─── Bonds (Relationships) ───────────────────────────────────────

export type BondStatus = 'pending' | 'active' | 'decayed';

export interface Bond {
  id: string;
  atomA: string;
  atomB: string;
  status: BondStatus;
  formedAt: number;
  lastInteractionAt: number;
  checkInCount: number;
  bondType: 'mutual' | 'mentor' | 'sibling';
  zoneId?: ZoneId;
}

// ─── Reactions (Events) ──────────────────────────────────────────

export type ReactionType =
  | 'bond_formed'
  | 'check_in'
  | 'witnessed'
  | 'problem_solved'
  | 'resource_shared'
  | 'era_advanced';

export interface Reaction {
  id: string;
  type: ReactionType;
  atoms: string[];
  bondId: string | null;
  zoneId: ZoneId;
  description: string;
  timestamp: number;
}

// ─── WebSocket Protocol ──────────────────────────────────────────

export type ClientMessage =
  | { type: 'ping'; targetUserId: string; zoneId: ZoneId }
  | { type: 'accept_ping'; pingId: string }
  | { type: 'reject_ping'; pingId: string }
  | { type: 'check_in'; zoneId: ZoneId; locationProof: LocationProof; energyLevel?: number }
  | { type: 'update_profile'; displayName?: string; bio?: string; skills?: string[]; interests?: string[] }
  | { type: 'request_witness'; targetUserId: string; locationProofHash: string; requestId: string }
  | { type: 'provide_witness'; claimerId: string; geohashPrefix: string; timestamp: number; nonce: string; signature: string }
  | { type: 'submit_reaction'; bondId: string; reactionType: ReactionType; description: string }
  | { type: 'set_zone'; zoneId: ZoneId | null };

export type ServerMessage =
  | { type: 'pong_received'; pingId: string; fromUserId: string }
  | { type: 'ping_received'; pingId: string; fromUserId: string; zoneId: ZoneId }
  | { type: 'ping_accepted'; pingId: string }
  | { type: 'ping_rejected'; pingId: string }
  | { type: 'bond_formed'; bond: Bond }
  | { type: 'bond_decayed'; bondId: string }
  | { type: 'check_in_confirmed'; checkIn: CheckIn }
  | { type: 'witness_request'; requestId: string; fromUserId: string; locationProofHash: string; nonce: string }
  | { type: 'witness_confirmed'; checkInId: string }
  | { type: 'reaction_recorded'; reaction: Reaction }
  | { type: 'nearby_atoms'; atoms: AtomPublic[] }
  | { type: 'zone_update'; userId: string; zoneId: ZoneId | null }
  | { type: 'error'; code: string; message: string };

// ─── Math helpers ────────────────────────────────────────────────

export function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function geohashEncode(lat: number, lng: number, precision: number = 5): string {
  const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
  let latMin = -90, latMax = 90;
  let lngMin = -180, lngMax = 180;
  let hash = '';
  let isEven = true;
  let bit = 0;
  let ch = 0;

  while (hash.length < precision) {
    if (isEven) {
      const mid = (lngMin + lngMax) / 2;
      if (lng >= mid) { ch |= (1 << (4 - bit)); lngMin = mid; }
      else { lngMax = mid; }
    } else {
      const mid = (latMin + latMax) / 2;
      if (lat >= mid) { ch |= (1 << (4 - bit)); latMin = mid; }
      else { latMax = mid; }
    }
    isEven = !isEven;
    if (bit < 4) { bit++; }
    else { hash += BASE32[ch]; bit = 0; ch = 0; }
  }
  return hash;
}
