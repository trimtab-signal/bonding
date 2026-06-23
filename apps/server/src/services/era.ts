import { query } from '../db/pool.js';

export async function getCommunityState(): Promise<{
  id: number;
  era: number;
  total_bonds: number;
  total_check_ins: number;
  total_reactions: number;
  total_problems_solved: number;
}> {
  const result = await query(`SELECT * FROM community_state WHERE id = 1`);
  return result.rows[0]!;
}

export function computeEra(state: {
  total_bonds: number;
  total_check_ins: number;
  total_reactions: number;
  total_problems_solved: number;
}): number {
  const { total_bonds, total_check_ins, total_reactions, total_problems_solved } = state;
  if (total_bonds >= 10 && total_reactions >= 10 && total_problems_solved >= 5) return 5;
  if (total_bonds >= 3 && total_reactions >= 5) return 4;
  if (total_problems_solved >= 1) return 3;
  if (total_check_ins >= 10) return 2;
  if (total_bonds >= 1) return 1;
  return 0;
}

export async function updateCommunityCounter(
  type: 'bond' | 'checkin' | 'reaction' | 'problem_solved',
): Promise<number> {
  const columnMap: Record<string, string> = {
    bond: 'total_bonds',
    checkin: 'total_check_ins',
    reaction: 'total_reactions',
    problem_solved: 'total_problems_solved',
  };
  const column = columnMap[type];
  await query(
    `UPDATE community_state SET ${column} = ${column} + 1, updated_at = NOW() WHERE id = 1`,
  );
  const state = await getCommunityState();
  const newEra = computeEra(state);
  if (newEra > state.era) {
    await query(`UPDATE community_state SET era = $1 WHERE id = 1`, [newEra]);
    return newEra;
  }
  return state.era;
}

export async function getCurrentEra(): Promise<number> {
  const result = await query(`SELECT era FROM community_state WHERE id = 1`);
  return result.rows[0]?.era ?? 0;
}
