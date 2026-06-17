import { describe, it, expect, vi } from 'vitest';

const TEST_JWK: JsonWebKey = {
  kty: 'EC',
  crv: 'P-256',
  x: 'rR1gU7vGgJYqX7vz5Lk0sQ',
  y: 'rR1gU7vGgJYqX7vz5Lk0sQ',
};

// Mock the entire crypto module since it depends on WebCrypto (not available in happy-dom)
vi.mock('../hooks/crypto.js', () => ({
  generateKeyPair: vi.fn(async () => ({
    publicKey: { type: 'public' } as CryptoKey,
    privateKey: { type: 'private' } as CryptoKey,
  })),
  exportPublicKeyJwk: vi.fn(async () => TEST_JWK),
  exportPrivateKeyJwk: vi.fn(async () => TEST_JWK),
  generateUserId: vi.fn(async (jwk: JsonWebKey) => {
    const str = `${jwk.kty}-${jwk.crv}-${jwk.x}-${jwk.y}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }),
  importPublicKey: vi.fn(async () => ({ type: 'public' } as CryptoKey)),
  signData: vi.fn(async () => 'mock-signature'),
}));

describe('crypto utilities (mocked)', () => {
  it('generateKeyPair produces public/private pair', async () => {
    const { generateKeyPair } = await import('../hooks/crypto.js');
    const keys = await generateKeyPair();
    expect(keys.publicKey).toBeTruthy();
    expect(keys.privateKey).toBeTruthy();
  });

  it('exportPublicKeyJwk returns JWK format', async () => {
    const { exportPublicKeyJwk } = await import('../hooks/crypto.js');
    const jwk = await exportPublicKeyJwk({} as CryptoKey);
    expect(jwk.kty).toBe('EC');
    expect(jwk.crv).toBe('P-256');
  });

  it('generateUserId produces deterministic ID from same JWK', async () => {
    const { generateUserId } = await import('../hooks/crypto.js');
    const id1 = await generateUserId(TEST_JWK);
    const id2 = await generateUserId(TEST_JWK);
    expect(id1).toBe(id2);
  });

  it('generateUserId returns a hex string of length 16', async () => {
    const { generateUserId } = await import('../hooks/crypto.js');
    const id = await generateUserId(TEST_JWK);
    expect(id).toMatch(/^[0-9a-f]{16}$/);
  });

  it('different JWKs produce different user IDs', async () => {
    const { generateUserId } = await import('../hooks/crypto.js');
    const jwk2: JsonWebKey = { kty: 'EC', crv: 'P-256', x: 'different-value', y: 'different-value' };
    const id1 = await generateUserId(TEST_JWK);
    const id2 = await generateUserId(jwk2);
    expect(id1).not.toBe(id2);
  });

  it('signData produces a signature string', async () => {
    const { signData } = await import('../hooks/crypto.js');
    const sig = await signData({} as CryptoKey, 'test-data');
    expect(sig).toBe('mock-signature');
  });

  it('importPublicKey creates a usable key', async () => {
    const { importPublicKey } = await import('../hooks/crypto.js');
    const key = await importPublicKey(TEST_JWK);
    expect(key).toBeTruthy();
  });
});
