/**
 * Cryptographic utilities for secure Remote Control authentication.
 * Uses the standard Web Crypto API (supported in all modern browsers).
 */

export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateRandomId(prefix = "vp", length = 6): string {
  const chars = "23456789abcdefghjkmnpqrstuvwxyz"; // Avoid ambiguous chars 0, 1, l, o
  let result = "";
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return `${prefix}-${result}`;
}

export function generateSalt(length = 16): string {
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Computes the client authentication proof.
 * Password is salted and combined with session ID and a unique client nonce.
 * Plaintext password is NEVER transmitted.
 */
export async function computeAuthProof(
  password: string,
  salt: string,
  sessionId: string,
  clientNonce: string,
): Promise<string> {
  const payload = `${password.trim()}::${salt}::${sessionId}::${clientNonce}`;
  return sha256(payload);
}

/**
 * Verifies an auth proof sent by a client.
 */
export async function verifyAuthProof(
  expectedPassword: string,
  salt: string,
  sessionId: string,
  clientNonce: string,
  receivedProof: string,
): Promise<boolean> {
  const expectedProof = await computeAuthProof(
    expectedPassword,
    salt,
    sessionId,
    clientNonce,
  );
  return expectedProof.toLowerCase() === receivedProof.toLowerCase();
}

/**
 * Generates an ephemeral session token once authentication succeeds.
 */
export async function computeSessionToken(
  sessionId: string,
  clientNonce: string,
  password: string,
): Promise<string> {
  return sha256(`TOKEN::${sessionId}::${clientNonce}::${password.trim()}`);
}
