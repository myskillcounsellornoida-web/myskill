import "server-only";
import crypto from "crypto";

// Signed, stateless admin session token: "admin.<expiresAt>.<hmacSignature>"
// Avoids adding a JWT dependency for a single-role, single-user admin session.

export const ADMIN_SESSION_COOKIE = "msc_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not defined in the environment.");
  }
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expiresAtRaw, signature] = parts;
  if (role !== "admin") return false;

  const expected = sign(`${role}.${expiresAtRaw}`);
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  if (expectedBuf.length !== actualBuf.length) return false;
  if (!crypto.timingSafeEqual(expectedBuf, actualBuf)) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

export function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}
