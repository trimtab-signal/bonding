import { randomBytes } from 'crypto';

export async function verifySignature(
  publicKeyJwk: JsonWebKey,
  data: string,
  signature: string,
): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      'jwk',
      publicKeyJwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify'],
    );
    const dataBytes = new TextEncoder().encode(data);
    const sigBytes = Buffer.from(signature, 'base64');
    return await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, sigBytes, dataBytes);
  } catch {
    return false;
  }
}

export function generateNonce(): string {
  return randomBytes(32).toString('hex');
}
