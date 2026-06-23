import { query, transaction } from '../db/pool.js';
import { v4 as uuid } from 'uuid';

const K4_SYNC_URL = process.env.K4_SYNC_URL || 'https://cashpilot-sync.trimtab-signal.workers.dev';
const K4_SYNC_TOKEN = process.env.SYNC_TOKEN || '';

async function pushK4ValenceEntry(feature: string, value: number, source: string, atomId: string): Promise<void> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (K4_SYNC_TOKEN) headers['Authorization'] = `Bearer ${K4_SYNC_TOKEN}`;
    await fetch(`${K4_SYNC_URL}/api/k4/push`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        level: 0,
        vertex: 'EARN',
        edge: 'EARN→AGGREGATE',
        amount_usd: value,
        feature,
        source: `bonding:${source}`,
        node_id: atomId,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch { /* non-blocking */ }
}

export interface PingResult {
  pingId: string;
  fromUserId: string;
  toUserId: string;
  zoneId: string;
  status: string;
}

export async function createPing(fromUserId: string, toUserId: string, zoneId: string): Promise<PingResult> {
  const id = uuid();
  await query(
    `INSERT INTO pings (id, from_atom, to_atom, zone_id) VALUES ($1, $2, $3, $4)`,
    [id, fromUserId, toUserId, zoneId]
  );
  return { pingId: id, fromUserId, toUserId, zoneId, status: 'pending' };
}

export async function respondToPing(pingId: string, accept: boolean): Promise<{ bondId?: string; status: string }> {
  return transaction(async (client) => {
    const ping = await client.query(
      `SELECT * FROM pings WHERE id = $1 AND status = 'pending'`,
      [pingId]
    );
    if (ping.rows.length === 0) throw new Error('Ping not found or already responded');

    const p = ping.rows[0]!;
    const status = accept ? 'accepted' : 'rejected';
    await client.query(
      `UPDATE pings SET status = $1, responded_at = NOW() WHERE id = $2`,
      [status, pingId]
    );

    if (!accept) return { status: 'rejected' };

    // Ensure atoms are ordered (a < b)
    const [atomA, atomB] = [p.from_atom, p.to_atom].sort() as [string, string];
    const bondId = uuid();

    await client.query(
      `INSERT INTO bonds (id, atom_a, atom_b, status, bond_type)
       VALUES ($1, $2, $3, 'active', 'mutual')
       ON CONFLICT (atom_a, atom_b) DO UPDATE SET status = 'active', last_interaction_at = NOW()
       RETURNING id`,
      [bondId, atomA, atomB]
    );

    // Update bond counts
    await client.query(`UPDATE atoms SET total_bonds = total_bonds + 1 WHERE id = $1`, [atomA]);
    await client.query(`UPDATE atoms SET total_bonds = total_bonds + 1 WHERE id = $1`, [atomB]);

    // Record reaction
    await client.query(
      `INSERT INTO reactions (id, type, atoms, bond_id, zone_id, description)
       VALUES ($1, 'bond_formed', $2, $3, $4, 'New bond formed')`,
      [uuid(), [atomA, atomB], bondId, p.zone_id]
    );

    pushK4ValenceEntry('valence', 0.05, 'bond_formed', atomA);
    pushK4ValenceEntry('valence', 0.05, 'bond_formed', atomB);

    return { bondId, status: 'accepted' };
  });
}

export async function recordCheckIn(atomId: string, zoneId: string, geohashPrefix: string, lat: number, lng: number, witnessedBy: string[], energyLevel?: number): Promise<string> {
  const id = uuid();
  await query(
    `INSERT INTO check_ins (id, atom_id, zone_id, geohash_prefix, location, witnessed_by, witness_count, energy_level)
     VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8, $9)`,
    [id, atomId, zoneId, geohashPrefix, lng, lat, witnessedBy, witnessedBy.length, energyLevel ?? null]
  );
  await query(`UPDATE atoms SET total_check_ins = total_check_ins + 1, last_seen = NOW(), current_zone = $2 WHERE id = $1`,
    [atomId, zoneId]);

  pushK4ValenceEntry('valence', 0.02, 'check_in', atomId);

  return id;
}

export async function getOrCreateBondId(atomA: string, atomB: string): Promise<string | null> {
  const [a, b] = [atomA, atomB].sort() as [string, string];
  const result = await query(
    `SELECT id FROM bonds WHERE atom_a = $1 AND atom_b = $2 AND status = 'active'`,
    [a, b]
  );
  return result.rows[0]?.id ?? null;
}

export async function decayOldBonds(): Promise<void> {
  // Mark bonds as decayed if no interaction in 30 days
  await query(
    `UPDATE bonds SET status = 'decayed'
     WHERE status = 'active' AND last_interaction_at < NOW() - INTERVAL '30 days'`
  );
}

// ─── Rate limiting ─────────────────────────────────────────────────

const rateLimitCache = new Map<string, number>();

export function isRateLimited(userId: string, cooldownMs: number = 120000): boolean {
  const lastCheckin = rateLimitCache.get(userId);
  if (lastCheckin && Date.now() - lastCheckin < cooldownMs) return true;
  return false;
}

export function updateRateLimit(userId: string): void {
  rateLimitCache.set(userId, Date.now());
}

// ─── Spatial queries ────────────────────────────────────────────────

export async function getNearbyAtoms(lng: number, lat: number, radiusMeters: number, excludeUserId: string): Promise<any[]> {
  const result = await query(
    `SELECT a.id, a.display_name, a.bio, a.skills, a.interests, a.atom_type, a.current_zone, a.last_seen, a.total_bonds
     FROM atoms a
     JOIN check_ins ci ON ci.atom_id = a.id
     WHERE ST_DWithin(
       ci.location,
       ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
       $3
     )
     AND ci.timestamp > NOW() - INTERVAL '1 hour'
     AND a.id != $4
     ORDER BY ci.timestamp DESC
     LIMIT 20`,
    [lng, lat, radiusMeters, excludeUserId]
  );
  return result.rows;
}
