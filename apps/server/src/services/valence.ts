import { query } from '../db/pool.js';

const VALENCE_MIN = 0.1;
const VALENCE_MAX = 2.0;
const VALENCE_DEFAULT = 1.0;

// Decay per day without interaction
const DECAY_PER_DAY = 0.01;

// Boost per successful check-in with a bonded atom
const BOOST_PER_CHECKIN = 0.05;

// Penalty for rejected pings
const PENALTY_REJECTED_PING = 0.02;

export async function getValence(atomId: string): Promise<number> {
  const result = await query(`SELECT valence FROM atoms WHERE id = $1`, [atomId]);
  return result.rows[0]?.valence ?? VALENCE_DEFAULT;
}

export async function adjustValence(atomId: string, delta: number): Promise<number> {
  const result = await query(
    `UPDATE atoms SET valence = GREATEST($1, LEAST($2, valence + $3)) WHERE id = $4 RETURNING valence`,
    [VALENCE_MIN, VALENCE_MAX, delta, atomId]
  );
  return result.rows[0]!.valence;
}

export async function boostCheckIn(atomId: string, bondId: string): Promise<number> {
  // Verify bond is active
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

export async function applyDailyDecay(): Promise<void> {
  await query(
    `UPDATE atoms SET valence = GREATEST($1, valence - $2) WHERE last_seen < NOW() - INTERVAL '1 day'`,
    [VALENCE_MIN, DECAY_PER_DAY]
  );
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
