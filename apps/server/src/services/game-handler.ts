import { Server, Socket } from 'socket.io';
import { query } from '../db/pool.js';
import {
  createPing,
  respondToPing,
  recordCheckIn,
  getOrCreateBondId,
  getNearbyAtoms,
  isRateLimited,
  updateRateLimit,
} from '../services/game-loop.js';
import {
  boostCheckIn,
  penalizeRejection,
  adjustValence,
  distributeDividends,
  getValence,
} from '../services/valence.js';
import { hashStatement, recordWitness, isNonceValid } from '../services/witness.js';
import { verifySignature, generateNonce } from '../services/crypto.js';
import { updateCommunityCounter, getCurrentEra } from '../services/era.js';
import type { ClientMessage, ServerMessage } from '@meatspace/shared-types';
import { ZONES } from '@meatspace/shared-types';
import { v4 as uuid } from 'uuid';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export function registerGameHandlers(io: Server): void {
  io.use(async (socket: AuthenticatedSocket, next) => {
    const auth = socket.handshake.auth;
    const { userId, timestamp, signature } = auth as Record<string, string | undefined>;
    if (!userId || !timestamp || !signature) {
      return next(new Error('Authentication required (userId, timestamp, signature)'));
    }
    // Verify user exists and get their public key
    const user = await query(`SELECT id, public_key_jwk FROM atoms WHERE id = $1`, [userId]);
    if (user.rows.length === 0) {
      return next(new Error('Unknown user. Please register first.'));
    }
    // Reject stale auth (10-second window)
    if (Math.abs(Date.now() - parseInt(timestamp, 10)) > 10000) {
      return next(new Error('Auth timestamp expired'));
    }
    // Verify ECDSA signature over userId:timestamp
    const valid = await verifySignature(
      user.rows[0].public_key_jwk,
      `${userId}:${timestamp}`,
      signature,
    );
    if (!valid) {
      return next(new Error('Invalid auth signature'));
    }
    socket.userId = userId;
    next();
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    console.warn(`[bonding] User connected: ${userId}`);

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
        console.error('Message parse error:', e);
        socket.emit(
          'message',
          JSON.stringify({
            type: 'error',
            code: 'PARSE_ERROR',
            message: 'Invalid message format',
          } satisfies ServerMessage),
        );
      }
    });

    // ─── Disconnect ───────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.warn(`[bonding] User disconnected: ${userId}`);
    });
  });
}

async function handleMessage(
  io: Server,
  socket: AuthenticatedSocket,
  userId: string,
  msg: ClientMessage,
): Promise<void> {
  switch (msg.type) {
    case 'ping': {
      const ping = await createPing(userId, msg.targetUserId, msg.zoneId);
      io.to(`user:${msg.targetUserId}`).emit(
        'message',
        JSON.stringify({
          type: 'ping_received',
          pingId: ping.pingId,
          fromUserId: userId,
          zoneId: msg.zoneId,
        } satisfies ServerMessage),
      );
      socket.emit(
        'message',
        JSON.stringify({
          type: 'pong_received',
          pingId: ping.pingId,
          fromUserId: msg.targetUserId,
        } satisfies ServerMessage),
      );
      break;
    }

    case 'accept_ping': {
      const pingResult = await respondToPing(msg.pingId, true);
      if (pingResult.status === 'accepted') {
        // Notify both parties
        io.to(`user:${userId}`).emit(
          'message',
          JSON.stringify({
            type: 'ping_accepted',
            pingId: msg.pingId,
          } satisfies ServerMessage),
        );

        // Get ping details to notify the other party
        const pingRow = await query(`SELECT from_atom, to_atom FROM pings WHERE id = $1`, [
          msg.pingId,
        ]);
        const ping = pingRow.rows[0]!;
        const otherUserId = ping.from_atom === userId ? ping.to_atom : ping.from_atom;
        io.to(`user:${otherUserId}`).emit(
          'message',
          JSON.stringify({
            type: 'ping_accepted',
            pingId: msg.pingId,
          } satisfies ServerMessage),
        );

        // Update community bond counter
        await updateCommunityCounter('bond');

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
      socket.emit(
        'message',
        JSON.stringify({
          type: 'ping_rejected',
          pingId: msg.pingId,
        } satisfies ServerMessage),
      );
      break;
    }

    case 'check_in': {
      const { geohashPrefix, lat, lng, timestamp, signature } = msg.locationProof;
      const energyLevel = (msg as any).energyLevel as number | undefined;

      // Reject stale proof (5-minute window)
      if (Math.abs(Date.now() - timestamp) > 300000) {
        socket.emit(
          'message',
          JSON.stringify({
            type: 'error',
            code: 'STALE_PROOF',
            message: 'Location proof expired',
          } satisfies ServerMessage),
        );
        break;
      }

      // Deep zone gating: requires valence >= 1.0
      if (msg.zoneId === 'deep') {
        const userValence = await getValence(userId);
        if (userValence < 1.0) {
          socket.emit(
            'message',
            JSON.stringify({
              type: 'error',
              code: 'DEEP_GATED',
              message: `Deep zone requires valence ≥ 1.0. Your valence: ${Math.round(userValence * 100) / 100}`,
            } satisfies ServerMessage),
          );
          break;
        }
      }

      // Wild zone era unlock: requires community era >= 2
      if (msg.zoneId === 'wild') {
        const era = await getCurrentEra();
        if (era < 2) {
          socket.emit(
            'message',
            JSON.stringify({
              type: 'error',
              code: 'WILD_LOCKED',
              message: `Wild zone unlocks at Era 2. Current Era: ${era}`,
            } satisfies ServerMessage),
          );
          break;
        }
      }

      // Rate limit: 1 check-in per 2 minutes
      if (isRateLimited(userId)) {
        socket.emit(
          'message',
          JSON.stringify({
            type: 'error',
            code: 'RATE_LIMITED',
            message: 'Please wait 2 minutes between check-ins',
          } satisfies ServerMessage),
        );
        break;
      }

      // Verify location proof signature
      const user = await query(`SELECT public_key_jwk FROM atoms WHERE id = $1`, [userId]);
      if (user.rows.length === 0) break;
      const proofPayload = `${geohashPrefix}:${lat}:${lng}:${timestamp}`;
      const proofValid = await verifySignature(
        user.rows[0].public_key_jwk,
        proofPayload,
        signature,
      );
      if (!proofValid) {
        socket.emit(
          'message',
          JSON.stringify({
            type: 'error',
            code: 'INVALID_SIGNATURE',
            message: 'Invalid location proof signature',
          } satisfies ServerMessage),
        );
        break;
      }

      // Record check-in with PostGIS location
      await recordCheckIn(
        userId,
        msg.zoneId,
        geohashPrefix,
        lat,
        lng,
        msg.locationProof.witnessedBy,
        energyLevel,
      );
      updateRateLimit(userId);
      await updateCommunityCounter('checkin');

      // Adjust valence based on energy level
      if (energyLevel !== undefined && energyLevel >= 0 && energyLevel <= 1) {
        const boostAmount = (energyLevel - 0.5) * 0.1;
        await adjustValence(userId, boostAmount);
      }

      // Find spatially-nearby atoms and request witness
      const zoneDef = ZONES[msg.zoneId];
      const nearby = await getNearbyAtoms(lng, lat, zoneDef.radiusMeters, userId);
      for (const atom of nearby) {
        const bondId = await getOrCreateBondId(userId, atom.id);
        if (bondId) {
          await query(
            `UPDATE bonds SET check_in_count = check_in_count + 1, last_interaction_at = NOW() WHERE id = $1`,
            [bondId],
          );
          await boostCheckIn(userId, bondId);
        }
        // Geofenced witness request — only to spatially-nearby atoms
        const nonce = generateNonce();
        io.to(`user:${atom.id}`).emit(
          'message',
          JSON.stringify({
            type: 'witness_request',
            requestId: uuid(),
            fromUserId: userId,
            locationProofHash: hashStatement({ claimerId: userId, geohashPrefix, timestamp }),
            nonce,
          } satisfies ServerMessage),
        );
      }

      // Broadcast zone update
      io.emit(
        'message',
        JSON.stringify({
          type: 'zone_update',
          userId,
          zoneId: msg.zoneId,
        } satisfies ServerMessage),
      );

      socket.emit(
        'message',
        JSON.stringify({
          type: 'check_in_confirmed',
          checkIn: {
            userId,
            zoneId: msg.zoneId,
            locationProof: msg.locationProof,
            timestamp: Date.now(),
            energyLevel,
          },
        } satisfies ServerMessage),
      );
      break;
    }

    case 'request_witness': {
      const target = await query(`SELECT id FROM atoms WHERE id = $1`, [msg.targetUserId]);
      if (target.rows.length > 0) {
        const nonce = generateNonce();
        io.to(`user:${msg.targetUserId}`).emit(
          'message',
          JSON.stringify({
            type: 'witness_request',
            requestId: msg.requestId,
            fromUserId: userId,
            locationProofHash: msg.locationProofHash,
            nonce,
          } satisfies ServerMessage),
        );
      }
      break;
    }

    case 'provide_witness': {
      // Reject self-witness (Sybil mitigation)
      if (msg.claimerId === userId) {
        socket.emit(
          'message',
          JSON.stringify({
            type: 'error',
            code: 'SELF_WITNESS',
            message: 'Cannot witness your own check-in',
          } satisfies ServerMessage),
        );
        break;
      }

      // Validate nonce (replay protection)
      if (msg.nonce && !isNonceValid(msg.nonce)) {
        socket.emit(
          'message',
          JSON.stringify({
            type: 'error',
            code: 'REPLAY_REJECTED',
            message: 'Nonce already used or expired',
          } satisfies ServerMessage),
        );
        break;
      }

      // Verify witness signature: sign(claimerId:geohashPrefix:timestamp:nonce)
      const witness = await query(`SELECT public_key_jwk FROM atoms WHERE id = $1`, [userId]);
      if (witness.rows.length === 0) break;
      const witnessPayload = `${msg.claimerId}:${msg.geohashPrefix}:${msg.timestamp}:${msg.nonce}`;
      const witnessValid = await verifySignature(
        witness.rows[0].public_key_jwk,
        witnessPayload,
        msg.signature,
      );
      if (!witnessValid) {
        socket.emit(
          'message',
          JSON.stringify({
            type: 'error',
            code: 'INVALID_WITNESS',
            message: 'Witness signature invalid',
          } satisfies ServerMessage),
        );
        break;
      }

      await recordWitness(msg.claimerId, msg.geohashPrefix, userId);
      socket.emit(
        'message',
        JSON.stringify({
          type: 'witness_confirmed',
          checkInId: msg.claimerId,
        } satisfies ServerMessage),
      );
      break;
    }

    case 'set_zone': {
      await query(`UPDATE atoms SET current_zone = $1 WHERE id = $2`, [msg.zoneId, userId]);
      io.emit(
        'message',
        JSON.stringify({
          type: 'zone_update',
          userId,
          zoneId: msg.zoneId,
        } satisfies ServerMessage),
      );
      break;
    }

    case 'update_profile': {
      const updates: string[] = [];
      const params: any[] = [];
      let i = 1;
      if (msg.displayName !== undefined) {
        updates.push(`display_name = $${i++}`);
        params.push(msg.displayName);
      }
      if (msg.bio !== undefined) {
        updates.push(`bio = $${i++}`);
        params.push(msg.bio);
      }
      if (msg.skills !== undefined) {
        updates.push(`skills = $${i++}`);
        params.push(msg.skills);
      }
      if (msg.interests !== undefined) {
        updates.push(`interests = $${i++}`);
        params.push(msg.interests);
      }
      if (updates.length > 0) {
        params.push(userId);
        await query(`UPDATE atoms SET ${updates.join(', ')} WHERE id = $${i}`, params);
      }
      break;
    }

    case 'submit_reaction': {
      // Get bond participants
      const bondRow = await query(`SELECT atom_a, atom_b, zone_id FROM bonds WHERE id = $1`, [
        msg.bondId,
      ]);
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
        [reactionId, msg.reactionType, [userId, otherAtomId], msg.bondId, zoneId, msg.description],
      );
      // Distribute valence dividends for collaborative reactions
      if (msg.reactionType === 'problem_solved' || msg.reactionType === 'resource_shared') {
        await distributeDividends(msg.bondId);
      }

      // Update community counters
      await updateCommunityCounter('reaction');
      if (msg.reactionType === 'problem_solved') {
        await updateCommunityCounter('problem_solved');
      }

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
      socket.emit(
        'message',
        JSON.stringify({
          type: 'error',
          code: 'UNKNOWN_MESSAGE',
          message: `Unknown message type: ${(msg as any).type}`,
        } satisfies ServerMessage),
      );
    }
  }
}
