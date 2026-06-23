# TECH_SPEC.md — Technical Specification

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Frontend                         │
│  React 18 + TypeScript + Zustand + MapLibre + Capacitor    │
└───────────────────────────┬─────────────────────────────────┘
                            │ WebSocket (Socket.io) + REST
┌───────────────────────────▼─────────────────────────────────┐
│                     Backend Server                          │
│  Node.js + Express + Socket.io                             │
│  - REST API (auth, profiles, zones)                        │
│  - WebSocket game loop (ping, accept, check-in, witnesses) │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                 PostgreSQL + PostGIS                        │
│  atoms, bonds, check_ins, pings, reactions                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Model

### `atoms`

- `id` (TEXT, PK) — public key fingerprint (SHA‑256 of JWK)
- `public_key_jwk` (JSONB) — for signature verification
- `display_name`, `bio`, `skills` (TEXT[]), `interests` (TEXT[])
- `valence` (REAL, 0.1–2.0) — private reputation
- `current_zone` (TEXT) — one of `calm`, `lab`, `kitchen`, `deep`, `wild`
- `total_check_ins`, `total_bonds`
- `last_seen`, `created_at`

### `bonds`

- `id` (TEXT, PK)
- `atom_a`, `atom_b` (FK → atoms)
- `status` (`pending`, `active`, `decayed`)
- `bond_type` (`mutual`, `mentor`, `sibling`)
- `check_in_count`
- `formed_at`, `last_interaction_at`

### `check_ins`

- `id` (TEXT, PK)
- `atom_id` (FK → atoms)
- `bond_id` (FK → bonds, optional)
- `zone_id` (TEXT)
- `geohash_prefix` (TEXT)
- `witnessed_by` (TEXT[]), `witness_count`
- `location` (GEOGRAPHY(POINT, 4326)) — not stored in MVP

### `pings`

- `id` (TEXT, PK)
- `from_atom`, `to_atom` (FK → atoms)
- `zone_id`
- `status` (`pending`, `accepted`, `rejected`, `expired`)
- `created_at`, `responded_at`

### `reactions`

- `id` (TEXT, PK)
- `type` (`bond_formed`, `check_in`, `witnessed`, `problem_solved`, `resource_shared`, `era_advanced`)
- `atoms` (TEXT[])
- `bond_id` (FK → bonds, optional)
- `zone_id` (TEXT)
- `description` (TEXT)
- `timestamp`

---

## API Endpoints

### REST

| Method | Path             | Description                       |
| ------ | ---------------- | --------------------------------- |
| `POST` | `/api/register`  | Create or update atom profile     |
| `GET`  | `/api/atoms/:id` | Get public atom info              |
| `GET`  | `/api/atoms`     | List all atoms (public directory) |
| `GET`  | `/api/zones`     | List zone definitions             |
| `GET`  | `/health`        | Service health check              |

### WebSocket (Socket.io)

**Authentication:** Send `auth: { userId }` on connection.

**Client → Server messages:**

```typescript
type ClientMessage =
  | { type: 'ping'; targetUserId: string; zoneId: ZoneId }
  | { type: 'accept_ping'; pingId: string }
  | { type: 'reject_ping'; pingId: string }
  | { type: 'check_in'; zoneId: ZoneId; locationProof: LocationProof }
  | {
      type: 'update_profile';
      displayName?: string;
      bio?: string;
      skills?: string[];
      interests?: string[];
    }
  | { type: 'request_witness'; targetUserId: string; locationProofHash: string }
  | { type: 'provide_witness'; requestId: string; signature: string }
  | { type: 'submit_reaction'; bondId: string; reactionType: ReactionType; description: string }
  | { type: 'set_zone'; zoneId: ZoneId | null };
```

**Server → Client messages:**

```typescript
type ServerMessage =
  | { type: 'pong_received'; pingId: string; fromUserId: string }
  | { type: 'ping_received'; pingId: string; fromUserId: string; zoneId: ZoneId }
  | { type: 'ping_accepted'; pingId: string }
  | { type: 'ping_rejected'; pingId: string }
  | { type: 'bond_formed'; bond: Bond }
  | { type: 'check_in_confirmed'; checkIn: CheckIn }
  | { type: 'witness_request'; requestId: string; fromUserId: string; locationProofHash: string }
  | { type: 'witness_confirmed'; checkInId: string }
  | { type: 'reaction_recorded'; reaction: Reaction }
  | { type: 'nearby_atoms'; atoms: AtomPublic[] }
  | { type: 'zone_update'; userId: string; zoneId: ZoneId | null }
  | { type: 'error'; code: string; message: string };
```

---

## Valence Engine

- **Boost**: `+0.05` per check‑in with an active bond.
- **Penalty**: `-0.02` per rejected ping.
- **Decay**: `-0.01` per day without activity.
- **Range**: `0.1 – 2.0`. If below `0.5`, user cannot initiate new bonds (isolation mode).
- **Matching score**: `0.6 * skill_complementarity + 0.4 * shared_interests`.

## Witness Consensus (MVP)

- A location proof consists of: `geohashPrefix` + `timestamp` + `signature`.
- To confirm a check‑in, at least **1 witness** (another atom in the same zone) must sign the proof.
- Witness signatures are stored on `check_ins.witnessed_by`.
- No raw GPS coordinates are ever transmitted to the server.
