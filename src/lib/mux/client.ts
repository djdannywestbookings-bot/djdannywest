import "server-only";
import Mux from "@mux/mux-node";
import jwt from "jsonwebtoken";

/**
 * Mux server SDK wrapper.
 *
 * Required env vars (set in Vercel):
 *   MUX_TOKEN_ID                — Mux Dashboard → Settings → Access Tokens → ID
 *   MUX_TOKEN_SECRET            — Mux Dashboard → Settings → Access Tokens → Secret
 *   MUX_SIGNING_KEY_ID          — Mux Dashboard → Settings → URL Signing Keys → Key ID
 *   MUX_SIGNING_KEY_PRIVATE     — same → Private key (base64-encoded)
 *   MUX_WEBHOOK_SIGNATURE_KEY   — Mux Dashboard → Webhooks → Signing secret
 */

export type MuxConfig = {
  tokenId: string;
  tokenSecret: string;
  signingKeyId: string;
  signingKeyPrivateBase64: string;
  webhookSignatureKey: string;
};

export function getMuxConfig(): MuxConfig | null {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  const signingKeyId = process.env.MUX_SIGNING_KEY_ID;
  const signingKeyPrivateBase64 = process.env.MUX_SIGNING_KEY_PRIVATE;
  const webhookSignatureKey = process.env.MUX_WEBHOOK_SIGNATURE_KEY;
  if (
    !tokenId ||
    !tokenSecret ||
    !signingKeyId ||
    !signingKeyPrivateBase64 ||
    !webhookSignatureKey
  ) {
    return null;
  }
  return {
    tokenId,
    tokenSecret,
    signingKeyId,
    signingKeyPrivateBase64,
    webhookSignatureKey,
  };
}

let _mux: Mux | null = null;
export function getMuxClient(): Mux | null {
  const cfg = getMuxConfig();
  if (!cfg) return null;
  if (!_mux) {
    _mux = new Mux({
      tokenId: cfg.tokenId,
      tokenSecret: cfg.tokenSecret,
    });
  }
  return _mux;
}

/**
 * Generate a JWT for signed playback. Token is valid for 4 hours by default.
 * Mux Player will use this token to fetch the manifest and segments.
 *
 * Subscribe-only audio requires "Signed" playback IDs (not "Public"). When you
 * create the asset via upload, request `playback_policy: ["signed"]`.
 */
export function generatePlaybackToken(
  playbackId: string,
  audience: "video" | "thumbnail" | "gif" | "storyboard" = "video",
  expiresInSeconds = 60 * 60 * 4,
): string | null {
  const cfg = getMuxConfig();
  if (!cfg) return null;
  const key = Buffer.from(cfg.signingKeyPrivateBase64, "base64").toString("utf8");
  return jwt.sign(
    {
      sub: playbackId,
      aud: audience,
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
      kid: cfg.signingKeyId,
    },
    key,
    { algorithm: "RS256" },
  );
}

/**
 * Verify Mux webhook HMAC-SHA256 signature.
 * Mux sends header `mux-signature` formatted as `t=<unix-ts>,v1=<hex-hmac>`.
 */
export async function verifyMuxWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): Promise<boolean> {
  const cfg = getMuxConfig();
  if (!cfg || !signatureHeader) return false;

  // Parse the header (t=...,v1=...)
  const parts = signatureHeader.split(",").reduce<Record<string, string>>(
    (acc, kv) => {
      const [k, v] = kv.split("=");
      if (k && v) acc[k.trim()] = v.trim();
      return acc;
    },
    {},
  );
  const timestamp = parts.t;
  const sig = parts.v1;
  if (!timestamp || !sig) return false;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(cfg.webhookSignatureKey);
  const message = encoder.encode(`${timestamp}.${rawBody}`);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", cryptoKey, message);
  const digest = Buffer.from(new Uint8Array(signed)).toString("hex");
  // Constant-time compare via length check + char comparison
  if (digest.length !== sig.length) return false;
  let result = 0;
  for (let i = 0; i < digest.length; i++) {
    result |= digest.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return result === 0;
}
