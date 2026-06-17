import { Server, Socket } from 'socket.io';
import { query } from '../db/pool.js';
import { createPing, respondToPing, recordCheckIn, getOrCreateBondId, getNearbyAtoms } from '../services/game-loop.js';
import { boostCheckIn, penalizeRejection, adjustValence } from '../services/valence.js';
import { hashStatement, recordWitness } from '../services/witness.js';
import type { ClientMessage, ServerMessage } from '@bonding/shared-types';
import { v4 as uuid } from 'uuid';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export function registerGameHandlers(io: Server): void {
  io.use(async (socket: AuthenticatedSocket, next) => {
    const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId;
    if (!userId || typeof userId !== 'string') {
      return next(new Error('Authentication required'));
    }
    // Verify user exists in database
    const user = await query(`SELECT id FROM atoms WHERE id = $1`, [userId]);
    if (user.rows.length === 0) {
      return next(new Error('Unknown user. Please register first.'));
    }
    socket.userId = userId;
    next();
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    console.log(`[bonding] User connected: ${userId}`);

    // Mark user as online
    await query(`UPDATE atoms SET last_seen = NOW() WHERE id = $1`, [userId]);

    // Join user to their personal room
    socket.join(`user:${userId}`);

    // ─── Ping flow ─────────────────────────────────────────────
    socket.on('message', async (raw: string) => {
      try {
        const msg: ClientMessage = JSON.parse(raw);
        await handleMessage(io, socket, userId, msg);
      } catch (e) {
        socket.emit('message', JSON.stringify({ type: 'error', code: 'PARSE_ERROR', message: 'Invalid message format' } satisfies ServerMessage));
      }
    });

    // ─── Disconnect ───────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`[bonding] User disconnected: ${userId}`);
    });
  });
}

async function handleMessage(io: Server, socket: AuthenticatedSocket, userId: string, msg: ClientMessage): Promise<void> {
  switch (msg.type) {
    case 'ping': {
      const ping = await createPing(userId, msg.targetUserId, msg.zoneId);
      io.to(`user:${msg.targetUserId}`).emit('message', JSON.stringify({
        type: 'ping_received',
        pingId: ping.pingId,
        fromUserId: userId,
        zoneId: msg.zoneId,
      } satisfies ServerMessage));
      socket.emit('message', JSON.stringify({
        type: 'pong_received',
        pingId: ping.pingId,
        fromUserId: msg.targetUserId,
      } satisfies ServerMessage));
      break;
    }

    case 'accept_ping': {
      const pingResult = await respondToPing(msg.pingId, true);
      if (pingResult.status === 'accepted') {
        // Notify both parties
        io.to(`user:${userId}`).emit('message', JSON.stringify({
          type: 'ping_accepted',
          pingId: msg.pingId,
        } satisfies ServerMessage));

        // Get ping details to notify the other party
        const pingRow = await query(`SELECT from_atom, to_atom FROM pings WHERE id = $1`, [msg.pingId]);
        const ping = pingRow.rows[0]!;
        const otherUserId = ping.from_atom === userId ? ping.to_atom : ping.from_atom;
        io.to(`user:${otherUserId}`).emit('message', JSON.stringify({
          type: 'ping_accepted',
          pingId: msg.pingId,
        } satisfies ServerMessage));

        // Notify about bond
        if (pingResult.bondId) {
          const bondMsg: ServerMessage = {
            type: 'bond_formed',
            bond: {
              id: pingResult.bondId,
              atomA: userId,
              atomB: otherUserId,
              status: 'active',
              formedAt: Date.now(),
              lastInteractionAt: Date.now(),
              checkInCount: 0,
              bondType: 'mutual',
            },
          };
          io.to(`user:${userId}`).emit('message', JSON.stringify(bondMsg));
          io.to(`user:${otherUserId}`).emit('message', JSON.stringify(bondMsg));
        }
      }
      break;
    }

    case 'reject_ping': {
      await respondToPing(msg.pingId, false);
      await penalizeRejection(userId);
      socket.emit('message', JSON.stringify({
        type: 'ping_rejected',
        pingId: msg.pingId,
      } satisfies ServerMessage));
      break;
    }

    case 'check_in': {
      const energyLevel = (msg as any).energyLevel as number | undefined;
      await recordCheckIn(userId, msg.zoneId, msg.locationProof.geohashPrefix, msg.locationProof.witnessedBy, energyLevel);

      // Adjust valence based on energy level (higher energy = bigger boost)
      if (energyLevel !== undefined && energyLevel >= 0 && energyLevel <= 1) {
        const boostAmount = (energyLevel - 0.5) * 0.1; // -0.05 to +0.05
        await adjustValence(userId, boostAmount);
      }

      // Boost valence if checked in with a bonded atom at same zone
      const nearby = await getNearbyAtoms(msg.zoneId, userId);
      for (const atom of nearby) {
        const bondId = await getOrCreateBondId(userId, atom.id);
        if (bondId) {
          // Record check-in against bond
          await query(`UPDATE bonds SET check_in_count = check_in_count + 1, last_interaction_at = NOW() WHERE id = $1`, [bondId]);
          await boostCheckIn(userId, bondId);

          // Emit witnessed event
          io.to(`user:${atom.id}`).emit('message', JSON.stringify({
            type: 'witness_request',
            requestId: uuid(),
            fromUserId: userId,
            locationProofHash: hashStatement({
              claimerId: userId,
              geohashPrefix: msg.locationProof.geohashPrefix,
              timestamp: msg.locationProof.timestamp,
            }),
          } satisfies ServerMessage));
        }
      }

      // Broadcast zone update
      io.emit('message', JSON.stringify({
        type: 'zone_update',
        userId,
        zoneId: msg.zoneId,
      } satisfies ServerMessage));

      socket.emit('message', JSON.stringify({
        type: 'check_in_confirmed',
        checkIn: {
          userId,
          zoneId: msg.zoneId,
          locationProof: msg.locationProof,
          timestamp: Date.now(),
          energyLevel,
        },
      } satisfies ServerMessage));
      break;
    }

    case 'request_witness': {
      const target = await query(`SELECT id FROM atoms WHERE id = $1`, [msg.targetUserId]);
      if (target.rows.length > 0) {
        const requestId = uuid();
        io.to(`user:${msg.targetUserId}`).emit('message', JSON.stringify({
          type: 'witness_request',
          requestId,
          fromUserId: userId,
          locationProofHash: msg.locationProofHash,
        } satisfies ServerMessage));
        socket.emit('message', JSON.stringify({
          type: 'witness_confirmed',
          checkInId: requestId,
        } satisfies ServerMessage));
      }
      break;
    }

    case 'provide_witness': {
      const checkInRow = await query(
        `SELECT id, atom_id, geohash_prefix FROM check_ins WHERE id = $1`,
        [msg.requestId]
      );
      if (checkInRow.rows.length > 0) {
        const checkIn = checkInRow.rows[0]!;
        await recordWitness(checkIn.atom_id, checkIn.geohash_prefix, userId);
        socket.emit('message', JSON.stringify({
          type: 'witness_confirmed',
          checkInId: checkIn.id,
        } satisfies ServerMessage));
      }
      break;
    }

    case 'set_zone': {
      await query(`UPDATE atoms SET current_zone = $1 WHERE id = $2`, [msg.zoneId, userId]);
      io.emit('message', JSON.stringify({
        type: 'zone_update',
        userId,
        zoneId: msg.zoneId,
      } satisfies ServerMessage));
      break;
    }

    case 'update_profile': {
      const updates: string[] = [];
      const params: any[] = [];
      let i = 1;
      if (msg.displayName !== undefined) { updates.push(`display_name = $${i++}`); params.push(msg.displayName); }
      if (msg.bio !== undefined) { updates.push(`bio = $${i++}`); params.push(msg.bio); }
      if (msg.skills !== undefined) { updates.push(`skills = $${i++}`); params.push(msg.skills); }
      if (msg.interests !== undefined) { updates.push(`interests = $${i++}`); params.push(msg.interests); }
      if (updates.length > 0) {
        params.push(userId);
        await query(`UPDATE atoms SET ${updates.join(', ')} WHERE id = $${i}`, params);
      }
      break;
    }

    case 'submit_reaction': {
      // Get bond participants
      const bondRow = await query(`SELECT atom_a, atom_b, zone_id FROM bonds WHERE id = $1`, [msg.bondId]);
      if (bondRow.rows.length === 0) break;
      const bond = bondRow.rows[0]!;
      const otherAtomId = bond.atom_a === userId ? bond.atom_b : bond.atom_a;
      // Get zone from user's current zone
      const atom = await query(`SELECT current_zone FROM atoms WHERE id = $1`, [userId]);
      const zoneId = atom.rows[0]?.current_zone || 'calm';
      const reactionId = uuid();
      await query(
        `INSERT INTO reactions (id, type, atoms, bond_id, zone_id, description)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [reactionId, msg.reactionType, [userId, otherAtomId], msg.bondId, zoneId, msg.description]
      );
      // Notify both bond participants
      const reactionMsg: ServerMessage = {
        type: 'reaction_recorded',
        reaction: {
          id: reactionId,
          type: msg.reactionType,
          atoms: [userId, otherAtomId],
          bondId: msg.bondId,
          zoneId: zoneId as any,
          description: msg.description,
          timestamp: Date.now(),
        },
      };
      io.to(`user:${userId}`).emit('message', JSON.stringify(reactionMsg));
      io.to(`user:${otherAtomId}`).emit('message', JSON.stringify(reactionMsg));
      break;
    }

    default: {
      socket.emit('message', JSON.stringify({
        type: 'error',
        code: 'UNKNOWN_MESSAGE',
        message: `Unknown message type: ${(msg as any).type}`,
      } satisfies ServerMessage));
    }
  }
}
