import { createHash } from 'crypto';
import { query } from '../db/pool.js';

export interface WitnessStatement {
  claimerId: string;
  geohashPrefix: string;
  timestamp: number;
}

export function hashStatement(stmt: WitnessStatement): string {
  return createHash('sha256')
    .update(`${stmt.claimerId}|${stmt.geohashPrefix}|${stmt.timestamp}`)
    .digest('hex');
}

// ─── Nonce cache for replay protection ──────────────────────────────

const nonceCache = new Map<string, number>();

export function isNonceValid(nonce: string, ttlMs: number = 600000): boolean {
  const now = Date.now();
  // Evict expired entries
  for (const [key, ts] of nonceCache.entries()) {
    if (now - ts > ttlMs) nonceCache.delete(key);
  }
  if (nonceCache.has(nonce)) return false;
  nonceCache.set(nonce, now);
  return true;
}

// ─── Witness recording ──────────────────────────────────────────────

export async function recordWitness(claimerId: string, geohashPrefix: string, witnessId: string): Promise<void> {
  await query(
    `UPDATE check_ins
     SET witnessed_by = array_append(witnessed_by, $1), witness_count = witness_count + 1
     WHERE atom_id = $2 AND geohash_prefix = $3
     AND timestamp > NOW() - INTERVAL '5 minutes'`,
    [witnessId, claimerId, geohashPrefix]
  );
}

export async function getWitnessCount(claimerId: string, geohashPrefix: string): Promise<number> {
  const result = await query(
    `SELECT COUNT(*) as count FROM check_ins
     WHERE atom_id = $1 AND geohash_prefix = $2 AND timestamp > NOW() - INTERVAL '5 minutes'`,
    [claimerId, geohashPrefix]
  );
  return parseInt(result.rows[0]!.count as string, 10);
}

export function needsWitnessConsensus(witnessCount: number): boolean {
  return witnessCount >= 1; // MVP: at least 1 witness
}
