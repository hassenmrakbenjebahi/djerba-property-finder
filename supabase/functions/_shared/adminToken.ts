// Shared HMAC token utilities for the admin edge functions.
// Tokens are server-issued after password verification and expire after 8h.

const SECRET = Deno.env.get("ADMIN_TOKEN_SECRET") ?? "";
const TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function issueAdminToken(): Promise<string> {
  if (!SECRET) throw new Error("ADMIN_TOKEN_SECRET not configured");
  const exp = Date.now() + TTL_MS;
  const payload = `${exp}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function verifyAdminToken(token: string | null): Promise<boolean> {
  if (!SECRET || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [expStr, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = await hmac(expStr);
  return timingSafeEqual(sig, expected);
}
