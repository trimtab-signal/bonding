import { query, transaction } from '../db/pool.js';
import { v4 as uuid } from 'uuid';

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

    return { bondId, status: 'accepted' };
  });
}

export async function recordCheckIn(atomId: string, zoneId: string, geohashPrefix: string, witnessedBy: string[], energyLevel?: number): Promise<string> {
  const id = uuid();
  await query(
    `INSERT INTO check_ins (id, atom_id, zone_id, geohash_prefix, witnessed_by, witness_count, energy_level)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, atomId, zoneId, geohashPrefix, witnessedBy, witnessedBy.length, energyLevel ?? null]
  );
  await query(`UPDATE atoms SET total_check_ins = total_check_ins + 1, last_seen = NOW(), current_zone = $2 WHERE id = $1`,
    [atomId, zoneId]);
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

export async function getNearbyAtoms(zoneId: string, excludeUserId: string): Promise<any[]> {
  const result = await query(
    `SELECT id, display_name, bio, skills, interests, atom_type, current_zone, last_seen, total_bonds
     FROM atoms
     WHERE current_zone = $1 AND id != $2 AND last_seen > NOW() - INTERVAL '1 hour'`,
    [zoneId, excludeUserId]
  );
  return result.rows;
}
