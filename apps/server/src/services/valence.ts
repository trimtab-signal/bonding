import { query } from '../db/pool.js';

const VALENCE_MIN = 0.1;
const VALENCE_MAX = 2.0;
const VALENCE_DEFAULT = 1.0;
const DECAY_FACTOR = 0.99; // 1% decay per inactive day

// Boost per successful check-in with a bonded atom
const BOOST_PER_CHECKIN = 0.05;

// Penalty for rejected pings
const PENALTY_REJECTED_PING = 0.02;

export async function applyDailyDecay(): Promise<void> {
  await query(`UPDATE atoms SET valence = GREATEST($1, valence * $2) WHERE valence > 0`, [VALENCE_MIN, DECAY_FACTOR]);
}

export async function getValence(atomId: string): Promise<number> {
  const result = await query(
    `SELECT valence, last_seen FROM atoms WHERE id = $1`,
    [atomId]
  );
  if (result.rows.length === 0) return VALENCE_DEFAULT;
  const { valence, last_seen } = result.rows[0]!;
  if (!last_seen) return valence;
  const daysSinceLastCheckIn = Math.floor(
    (Date.now() - new Date(last_seen).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceLastCheckIn <= 0) return valence;
  const decayed = valence * Math.pow(DECAY_FACTOR, daysSinceLastCheckIn);
  return Math.max(0, decayed);
}

const K4_SYNC_URL = process.env.K4_SYNC_URL || 'https://cashpilot-sync.trimtab-signal.workers.dev';
const K4_SYNC_TOKEN = process.env.SYNC_TOKEN || '';

async function pushK4ValenceEntry(atomId: string, delta: number, source: string): Promise<void> {
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
        amount_usd: Math.abs(delta),
        feature: 'valence',
        source: `valence:${source}`,
        node_id: atomId,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch { /* non-blocking */ }
}

export async function adjustValence(atomId: string, delta: number): Promise<number> {
  const result = await query(
    `UPDATE atoms SET valence = GREATEST($1, LEAST($2, valence + $3)) WHERE id = $4 RETURNING valence`,
    [VALENCE_MIN, VALENCE_MAX, delta, atomId]
  );
  pushK4ValenceEntry(atomId, delta, 'adjust');
  return result.rows[0]!.valence;
}

export async function boostCheckIn(atomId: string, bondId: string): Promise<number> {
  const bond = await query(
    `SELECT id FROM bonds WHERE id = $1 AND status = 'active'`,
    [bondId]
  );
  if (bond.rows.length > 0) {
    return adjustValence(atomId, BOOST_PER_CHECKIN);
  }
  return getValence(atomId);
}

export async function penalizeRejection(atomId: string): Promise<number> {
  return adjustValence(atomId, -PENALTY_REJECTED_PING);
}

export async function distributeDividends(bondId: string): Promise<void> {
  const bond = await query(`SELECT atom_a, atom_b FROM bonds WHERE id = $1`, [bondId]);
  if (bond.rows.length === 0) return;
  const { atom_a, atom_b } = bond.rows[0]!;
  await adjustValence(atom_a, 0.02);
  await adjustValence(atom_b, 0.02);
}

// Compute matching score between two atoms for the algorithm
// Returns higher scores for complementary pairs (different skills, shared interests)
export function computeMatchScore(atomA: { skills: string[]; interests: string[] }, atomB: { skills: string[]; interests: string[] }): number {
  const skillComplement = atomA.skills.filter(s => !atomB.skills.includes(s)).length +
    atomB.skills.filter(s => !atomA.skills.includes(s)).length;
  const sharedInterests = atomA.interests.filter(i => atomB.interests.includes(i)).length;

  // Normalize: skillComplement 0–1, sharedInterests 0–1, weight complementarity
  const maxSkills = Math.max(atomA.skills.length, atomB.skills.length, 1);
  const maxInterests = Math.max(atomA.interests.length, atomB.interests.length, 1);
  const skillScore = skillComplement / maxSkills;
  const interestScore = sharedInterests / maxInterests;

  return 0.6 * skillScore + 0.4 * interestScore;
}
