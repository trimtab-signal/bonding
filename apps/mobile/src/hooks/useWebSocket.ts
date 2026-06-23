import { useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/game-store.js';
import { generateKeyPair, exportPublicKeyJwk, exportPrivateKeyJwk, importPrivateKey, signData, generateUserId } from './crypto.js';
import { geohashEncode } from '@bonding/shared-types';
import type { ClientMessage, ServerMessage } from '@bonding/shared-types';

interface UseWebSocketReturn {
  connect: () => Promise<void>;
  disconnect: () => void;
  send: (msg: ClientMessage) => void;
  ping: (targetUserId: string, zoneId: string) => void;
  checkIn: (zoneId: string) => void;
  setZone: (zoneId: string | null) => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const { serverUrl, setConnected, setIdentity, addBond, addPing, removePing, addMessage, setCurrentZone, setNearbyAtoms } = useGameStore();

  const connect = useCallback(async () => {
    // Generate or load identity
    const storedPublic = (() => { try { return localStorage.getItem('bonding_public_key'); } catch { return null; } })();
    const storedPrivate = (() => { try { return localStorage.getItem('bonding_private_key'); } catch { return null; } })();

    let userId: string;
    let publicKeyJwk: JsonWebKey;
    let privateKeyJwk: JsonWebKey;

    if (storedPublic && storedPrivate) {
      publicKeyJwk = JSON.parse(storedPublic);
      privateKeyJwk = JSON.parse(storedPrivate);
      userId = await generateUserId(publicKeyJwk);
    } else {
      const keyPair = await generateKeyPair();
      publicKeyJwk = await exportPublicKeyJwk(keyPair.publicKey);
      privateKeyJwk = await exportPrivateKeyJwk(keyPair.privateKey);
      userId = await generateUserId(publicKeyJwk);
      (() => { try { localStorage.setItem('bonding_public_key', JSON.stringify(publicKeyJwk)); localStorage.setItem('bonding_private_key', JSON.stringify(privateKeyJwk)); } catch {} })();
    }

    setIdentity(userId, publicKeyJwk, privateKeyJwk);

    // Sign auth payload: signature(userId:timestamp)
    const authTimestamp = Date.now();
    const privateKey = await importPrivateKey(privateKeyJwk);
    const authSignature = await signData(privateKey, `${userId}:${authTimestamp}`);

    const socket = io(serverUrl, {
      auth: { userId, timestamp: authTimestamp, signature: authSignature },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      setConnected(true);
      addMessage('info', 'Connected to BONDING server');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      addMessage('info', 'Disconnected from server');
    });

    socket.on('message', (raw: string) => {
      try {
        const msg: ServerMessage = JSON.parse(raw);
        handleServerMessage(msg);
      } catch { /* skip malformed */ }
    });

    socket.on('connect_error', (err) => {
      addMessage('error', `Connection error: ${err.message}`);
    });

    socketRef.current = socket;
  }, [serverUrl]);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setConnected(false);
  }, []);

  const send = useCallback((msg: ClientMessage) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('message', JSON.stringify(msg));
    }
  }, []);

  const ping = useCallback((targetUserId: string, zoneId: string) => {
    send({ type: 'ping', targetUserId, zoneId: zoneId as import('@bonding/shared-types').ZoneId });
  }, [send]);

  const checkIn = useCallback(async (zoneId: string) => {
    const state = useGameStore.getState();
    const coords = (window as any).__bonding_last_coords__ as { latitude: number; longitude: number } | null;
    if (!coords) {
      addMessage('error', 'No GPS location available');
      return;
    }
    const { latitude, longitude } = coords;
    const precision = zoneId === 'deep' ? 6 : 5;
    const geohash = geohashEncode(latitude, longitude, precision);
    const timestamp = Date.now();
    const privateKey = await importPrivateKey(state.privateKeyJwk!);
    const payload = `${geohash}:${latitude}:${longitude}:${timestamp}`;
    const signature = await signData(privateKey, payload);

    const locationProof = {
      geohashPrefix: geohash,
      geohashPrecision: precision,
      lat: latitude,
      lng: longitude,
      witnessedBy: [] as string[],
      witnessSignatures: [] as string[],
      timestamp,
      signature,
    };
    const msg: ClientMessage = state.healthOptIn && state.energyLevel !== null
      ? { type: 'check_in', zoneId: zoneId as import('@bonding/shared-types').ZoneId, locationProof, energyLevel: state.energyLevel }
      : { type: 'check_in', zoneId: zoneId as import('@bonding/shared-types').ZoneId, locationProof };
    send(msg);
  }, [send]);

  const setZone = useCallback((zoneId: string | null) => {
    send({ type: 'set_zone', zoneId: zoneId as import('@bonding/shared-types').ZoneId | null });
    setCurrentZone(zoneId as import('@bonding/shared-types').ZoneId | null);
  }, [send]);

  function handleServerMessage(msg: ServerMessage) {
    switch (msg.type) {
      case 'pong_received':
        addMessage('ping', `Ping sent to ${msg.fromUserId}`);
        break;
      case 'ping_received':
        addPing({ pingId: msg.pingId, fromUserId: msg.fromUserId, zoneId: msg.zoneId });
        addMessage('ping', `Incoming ping from ${msg.fromUserId}`);
        break;
      case 'ping_accepted':
        removePing(msg.pingId);
        addMessage('success', 'Ping accepted! Bond formed.');
        break;
      case 'ping_rejected':
        removePing(msg.pingId);
        addMessage('info', 'Ping was rejected');
        break;
      case 'bond_formed':
        addBond(msg.bond);
        addMessage('success', `Bond formed with ${msg.bond.atomA === useGameStore.getState().userId ? msg.bond.atomB : msg.bond.atomA}`);
        break;
      case 'check_in_confirmed':
        addMessage('success', 'Check-in confirmed');
        break;
      case 'zone_update':
        addMessage('info', `${msg.userId} is now in ${msg.zoneId || 'no zone'}`);
        break;
      case 'nearby_atoms':
        setNearbyAtoms(msg.atoms);
        break;
      case 'witness_request':
        addMessage('info', `Witness request from ${msg.fromUserId} (nonce: ${msg.nonce.slice(0, 8)}…)`);
        break;
      case 'error':
        addMessage('error', msg.message);
        break;
    }
  }

  return { connect, disconnect, send, ping, checkIn, setZone };
}
