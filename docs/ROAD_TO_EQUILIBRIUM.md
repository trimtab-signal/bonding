# Road to Equilibrium

> BONDING meatspace protocol — tetrahedron work package framework.
> Each full cycle (Discovery → Synthesis → Implementation → Validation) closes one or more security/feature layers.

## Cycle Tracker

| Layer                     | Status        | Discovery | Synthesis | Implementation | Validation |
| ------------------------- | ------------- | --------- | --------- | -------------- | ---------- |
| P0 — Auth Foundation      | ✅ **Closed** | Complete  | Complete  | Complete       | Complete   |
| P1 — Trust & Spatial      | ✅ **Closed** | Complete  | Complete  | Complete       | Complete   |
| P2 — Valence Economy      | ✅ **Closed** | Complete  | Complete  | Complete       | Complete   |
| P3 — Production Hardening | ⬜ Future     | ⬜        | ⬜        | ⬜             | ⬜         |

---

## P1 Discovery Report — Trust & Spatial Layer

**Date:** 2026-06-17
**Node 1 (Discovery) Deliverable:** Options analysis for all P1 items.
**Next:** Hand off to Node 2 (Synthesis) for design decisions.

---

### P1.1 — Multi-Site Zone Topology

#### Pilot Locations (confirmed)

Three distributed locations across FL/GA border:

| Site | Address                                 | Lat      | Lng       | Description                      |
| ---- | --------------------------------------- | -------- | --------- | -------------------------------- |
| JAX  | 2950 Tinsley Rd, Jacksonville, FL 32218 | 30.43053 | -81.69309 | Northside residential area       |
| KNG  | 101 Greentree Cir, Kingsland, GA 31548  | 30.77509 | -81.67522 | Suburban neighborhood            |
| STM  | Mission Trace, St. Marys, GA 31558      | 30.78972 | -81.59179 | Apartment complex near Kings Bay |

Distances: JAX↔KNG ~24mi, KNG↔STM ~8mi, JAX↔STM ~27mi.

#### Problem

Zones are defined as fixed lat/lng in `ZONES` constant. With 3 sites 8-27mi apart, a single set of zone coordinates cannot serve all users. The current `ZONES` all have `lat: 0, lng: 0`.

#### Options

**Option A — Primary Site + Remote Nodes (Recommended for MVP)**

- Designate Kingsland/St. Marys as the primary cluster (two sites ~8mi apart — close enough that zones can overlap)
- Zone centers placed at centroid of KNG+STM: `(30.7824, -81.6335)`
- Jacksonville site is a secondary "Wild" node for now
- Zone radii increased to accommodate the 8mi spread between KNG and STM:
  - Wild: 1000m (already 500m)
  - Deep: 100m (tight, one location only)
  - Others: 300m
- Trade-off: JAX users will be ~24mi from zone centers — they won't be in-zone unless we create a separate JAX Site

**Option B — One Zone Set Per Site**

- Three copies of the 5-zone set, each centered on its site
- Add a `siteId` field to `ZoneDefinition` / filter by user proximity to site
- Server determines nearest site on check-in
- Complexity: matching atoms across sites, bonding across sites

**Option C — User-Centered Zones**

- Each user's home address is their zone center
- 5 zone "types" are relative to the user's location (e.g., "your Calm zone is at your home, your Wild zone is 500m away")
- Most flexible for distributed users
- Requires per-user zone coordinate generation
- Bonding requires checking if users' zones overlap

#### Recommendation

**Option A for MVP** — single zone cluster at KNG/STM centroid. JAX users can participate when visiting the primary site. Add multi-site support (Option B) in P2.

#### Zone Coordinate Proposal

```typescript
const KNG_STM_CENTROID = { lat: 30.7824, lng: -81.6335 };

ZONES: {
  calm:  { ...center: KNG_STM_CENTROID, radius: 200 },
  lab:   { ...center: KNG_STM_CENTROID, radius: 200 },
  kitchen: { ...center: KNG_STM_CENTROID, radius: 200 },
  deep:  { ...center: KNG_STM_CENTROID, radius: 100 },
  wild:  { ...center: KNG_STM_CENTROID, radius: 500 },
}
```

JAX site can be added as `wild` extension or as a second `site` in P2.

---

### P1.2 — Witness Signature Verification

#### Current State

Critical gap: the server **never verifies any signatures**. Key findings from code audit:

1. **Auth middleware** (game-handler.ts:14-26): trusts `userId` from `socket.handshake.auth.userId` — anyone can impersonate any user by sending the right `userId` string.
2. **`LocationProof`** has `witnessSignatures: string[]` field but **no code reads it**.
3. **`recordWitness()`** (witness.ts:18-32): blindly appends to `witnessed_by` array — no check that the witness actually signed anything.
4. **Client `signData()`** exists in `crypto.ts` but is **never called** in the check-in flow.
5. **P0 auth patches were designed but never applied** to the actual codebase.

#### Parallel work needed in P1:

The P0 auth work (signed timestamp in Socket.io handshake) was designed but never written to files. This must be closed simultaneously with P1.2 since witness verification depends on the same ECDSA P-256 infrastructure.

#### Witness Flow (Proposed)

1. **Check-in** initiates witness request:

   ```
   Client sends check_in with signature = sign(privateKey, `${zoneId}:${geohashPrefix}:${timestamp}`)
   Server verifies signature against atom.public_key_jwk
   Server emits witness_request to nearby atoms
   ```

2. **Witness responds**:

   ```
   Witness signs: sign(witnessPrivateKey, `${claimerId}:${geohashPrefix}:${timestamp}:${nonce}`)
   Server stores witness_signature alongside witness_id in check_ins
   ```

3. **Server validates witness**:
   ```
   verify(witnessPublicKeyJwk, statement, witnessSignature)
   Only counts as valid witness if signature passes
   ```

#### Signature Payload Format

| Field         | Check-in Signature  | Witness Signature                    |
| ------------- | ------------------- | ------------------------------------ |
| claimerId     | (implicit via auth) | claimerId                            |
| geohashPrefix | geohashPrefix       | geohashPrefix                        |
| timestamp     | check-in timestamp  | witness timestamp                    |
| zoneId        | zoneId              | —                                    |
| nonce         | —                   | random 32-byte hex (prevents replay) |

#### Replay Window

- 5-minute window for witness responses (same as current `recordWitness` query)
- Nonce in witness signature makes it single-use even within window
- Server tracks used nonces (LRU cache, evict after 10min)

#### Server-Side Crypto Dependency

`jwk-to-pem` (or raw `crypto.subtle` via Node's Web Crypto) needed for ECDSA P-256 verification. Node 16+ has `crypto.webcrypto.subtle` built-in — avoid the `jwk-to-pem` npm dependency.

```typescript
// Use Node's built-in Web Crypto API (available since Node 16)
const key = await crypto.subtle.importKey(
  'jwk',
  publicKeyJwk,
  { name: 'ECDSA', namedCurve: 'P-256' },
  false,
  ['verify'],
);
const valid = await crypto.subtle.verify(
  { name: 'ECDSA', hash: 'SHA-256' },
  key,
  signatureBytes,
  dataBytes,
);
```

---

### P1.3 — PostGIS Spatial Queries

#### Current State

- `check_ins.location` column exists as `GEOGRAPHY(POINT, 4326)` ✅
- **Never populated** ❌ — `recordCheckIn()` inserts everything else but skips `location`
- **No GIST index** ❌ — `ST_DWithin` cannot use index acceleration
- **No spatial queries used** ❌ — `getNearbyAtoms()` only checks `current_zone` text equality

#### Migration Required: `003_add_spatial_index.sql`

```sql
-- Populate location from geohash prefix (approximate center)
UPDATE check_ins
SET location = ST_PointFromText(
  'POINT(' || (
    -- decode geohash to centroid --
  ) || ')', 4326
)
WHERE location IS NULL;

-- Create GIST index for ST_DWithin acceleration
CREATE INDEX IF NOT EXISTS idx_check_ins_location
ON check_ins USING GIST (location);
```

Alternative: populate `location` from raw GPS coordinates sent in `LocationProof` (add `lat`/`lng` backup to shared types).

#### Query Pattern: Zone Radius Check

```sql
-- Atoms currently checked into a zone within radius R of a point
SELECT a.id, a.display_name, a.current_zone
FROM atoms a
JOIN check_ins ci ON ci.atom_id = a.id
WHERE ST_DWithin(
  ci.location,
  ST_SetSRID(ST_MakePoint($lng, $lat), 4326)::geography,
  $radiusMeters
)
AND ci.timestamp > NOW() - INTERVAL '1 hour'
AND a.id != $currentUserId
ORDER BY ci.timestamp DESC
LIMIT 20;
```

This replaces the current `WHERE current_zone = $1` logic in `getNearbyAtoms()`.

**Performance note:** With MVP scale (3-5 users, <100 check-ins), even a full table scan is instantaneous. GIST index is future-proofing for production.

#### Query Pattern: Nearest Neighbor (KNN)

```sql
SELECT a.id, a.display_name,
  ST_Distance(ci.location, ST_SetSRID(ST_MakePoint($lng, $lat), 4326)::geography) AS dist_m
FROM atoms a
JOIN check_ins ci ON ci.atom_id = a.id
WHERE ci.timestamp > NOW() - INTERVAL '1 hour'
  AND a.id != $currentUserId
ORDER BY ci.location <-> ST_SetSRID(ST_MakePoint($lng, $lat), 4326)::geography
LIMIT 10;
```

The `<->` operator triggers GiST index-assisted KNN scan (O(log N + K)).

#### Scope Decision Needed

Three approaches, increasing fidelity:

| Approach                    | Location Source                          | Accuracy             | Effort |
| --------------------------- | ---------------------------------------- | -------------------- | ------ |
| **A: Geohash-only**         | Decode geohash to centroid lat/lng       | ±4.9km (precision 5) | Low    |
| **B: Client sends raw GPS** | Add `lat`/`lng` to `LocationProof`       | ±5m (device GPS)     | Medium |
| **C: Hybrid**               | Client signs raw GPS, server stores both | Full accuracy        | Medium |

**Recommendation: Option B** — Add `lat`/`lng` as optional fields to `LocationProof`, signed by the client. Server populates `location` column from these. This gives accurate spatial queries without trusting raw GPS.

---

### P1.4 — Valence Decay Scheduling

#### Current State

`applyDailyDecay()` function exists in `valence.ts` but is **never called** from any code path.

#### Options

| Option                  | Mechanism                                                                     | Reliability                    | Complexity                |
| ----------------------- | ----------------------------------------------------------------------------- | ------------------------------ | ------------------------- |
| **A — setInterval**     | `setInterval(() => applyDailyDecay(), 24 * 60 * 60 * 1000)` in server process | Lost on restart — resets timer | Trivial                   |
| **B — Cron in process** | Use `node-cron` or similar for timezone-aware scheduling                      | Same as A                      | Low                       |
| **C — External cron**   | Render Cron Jobs / GitHub Actions hitting an endpoint                         | Survives restarts              | Medium                    |
| **D — pg_cron**         | PostgreSQL extension: `SELECT cron.schedule(...)`                             | Survives everything            | High (requires superuser) |
| **E — Lazy decay**      | Compute valence on read: `valence * pow(DECAY_FACTOR, daysSinceLastCheckIn)`  | Always correct                 | Low                       |

#### Recommendation

**Option E for MVP** — lazy decay computed on read instead of background job. Zero operational overhead, always correct regardless of restarts or downtime. Add Option C (Render Cron Job hitting `POST /api/cron/decay`) for P2 when the event/logging side effects matter.

---

### P1.5 — Sybil Resistance

#### Current State

`needsWitnessConsensus(witnessCount)` returns `true` if `witnessCount >= 1`. Effectively: one witness is enough.

#### The MVP Tradeoff

With 3-5 pilot users:

- **Threshold = 1**: Meaningful for 1:1 witness, but trivially bypassed by running a second device with a second key
- **Threshold = 2**: Requires 2 other users to be physically present — almost guarantees failure in a 3-person pilot if one person checks in while others are AFK

#### Recommended Graduated Approach

| Phase      | Min Users | Witness Threshold | Notes                                              |
| ---------- | --------- | ----------------- | -------------------------------------------------- |
| MVP Pilot  | 3-5       | **1**             | Accept forgery risk; focus on UX and protocol flow |
| Beta       | 6-15      | **2**             | Minimum viable security — 2 independent witnesses  |
| Production | 16+       | **3**             | Full Sybil resistance per design spec              |

#### Additional Mitigations (MVP)

Even with threshold=1, add basic safeguards:

1. **Rate limit**: max 1 check-in per 2 minutes per user
2. **Witness must be distinct from claimer**: no self-witnessing
3. **Witness must have a prior check-in**: can't witness with a fresh account
4. **Replay protection**: nonce in witness signatures

These don't prevent Sybil attacks but raise the cost enough for MVP.

---

### P0 Gap: Auth Foundation Not Applied

Critical finding: the P0 auth patches (signed timestamp in handshake, geohash signature verification) were **designed in the previous cycle but never written to any source files**. The server currently trusts all client input:

- `game-handler.ts:14-26`: `userId` from `socket.handshake.auth.userId` — **no verification**
- `crypto.ts` on client: `signData()` exists but **never called**
- No server-side ECDSA verification exists

**Recommendation:** Close this gap as part of P1 Implementation. Add a `crypto.ts` service on the server and wire up auth middleware + check-in signature verification in the same sprint as P1.2.

---

### Options Summary for Synthesis (Node 2)

| Item                   | Decision Needed                                    | Recommended                                |
| ---------------------- | -------------------------------------------------- | ------------------------------------------ |
| P1.1 Zone topology     | A (Single cluster) / B (Multi-site) / C (Per-user) | **A** — KNG/STM centroid, JAX as secondary |
| P1.2 Witness sigs      | Use Node Web Crypto or jwk-to-pem?                 | **Node crypto.subtle** (no deps)           |
| P1.2 Replay protection | Nonce + LRU cache?                                 | **Yes** — 32-byte nonce, 10min TTL         |
| P1.3 Spatial accuracy  | A (geohash) / B (raw GPS) / C (hybrid)             | **B** — add lat/lng to LocationProof       |
| P1.4 Decay scheduling  | A (setInterval) / C (cron) / E (lazy)              | **E** — lazy on read                       |
| P1.5 Sybil threshold   | 1 or 2 for MVP?                                    | **1** with graduated plan                  |
| P0 auth gap            | Apply P0 patches in P1 impl?                       | **Yes** — same sprint as P1.2              |

---

### Next Action

Hand this report to **Node 2 (Synthesis / Claude)** for design decisions and implementation plan generation.
