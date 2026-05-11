import "server-only";
import { SquareClient, SquareEnvironment } from "square";

/**
 * Square server SDK wrapper.
 *
 * Required env vars (set in Vercel):
 *   SQUARE_ACCESS_TOKEN         — Square Developer Dashboard → Application → Credentials
 *   SQUARE_LOCATION_ID          — Square Developer Dashboard → Application → Locations
 *   SQUARE_PLAN_VARIATION_ID    — id of the $20/mo subscription plan variation
 *   SQUARE_WEBHOOK_SIGNATURE_KEY — Square Developer Dashboard → Webhooks → Signature key
 *   SQUARE_ENVIRONMENT          — "sandbox" or "production" (default: sandbox)
 */

export type SquareConfig = {
  accessToken: string;
  locationId: string;
  planVariationId: string;
  webhookSignatureKey: string;
  environment: "sandbox" | "production";
};

export function getSquareConfig(): SquareConfig | null {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  const planVariationId = process.env.SQUARE_PLAN_VARIATION_ID;
  const webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  const environment =
    process.env.SQUARE_ENVIRONMENT === "production" ? "production" : "sandbox";

  if (!accessToken || !locationId || !planVariationId || !webhookSignatureKey) {
    return null;
  }
  return {
    accessToken,
    locationId,
    planVariationId,
    webhookSignatureKey,
    environment,
  };
}

/**
 * Create a Square SDK client. Returns null if Square credentials aren't configured.
 */
export function getSquareClient(): SquareClient | null {
  const cfg = getSquareConfig();
  if (!cfg) return null;
  return new SquareClient({
    token: cfg.accessToken,
    environment:
      cfg.environment === "production"
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
  });
}

/**
 * Verify a Square webhook HMAC-SHA256 signature.
 * Square sends `x-square-hmacsha256-signature` header.
 */
export async function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  notificationUrl: string,
): Promise<boolean> {
  const cfg = getSquareConfig();
  if (!cfg || !signatureHeader) return false;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(cfg.webhookSignatureKey);
  const message = encoder.encode(notificationUrl + rawBody);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", cryptoKey, message);
  const digest = Buffer.from(new Uint8Array(signed)).toString("base64");
  return digest === signatureHeader;
}
