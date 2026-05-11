import "server-only";
import { SquareClient, SquareEnvironment } from "square";

/**
 * Square server SDK wrapper.
 *
 * With the hosted-checkout-link flow (Path B), most Square API access is
 * unused. Only the webhook signature key is strictly required. Access token
 * is only needed when we want to enrich a webhook (e.g. look up a customer's
 * email so we can match them to a member).
 *
 * Env vars:
 *   SQUARE_WEBHOOK_SIGNATURE_KEY — REQUIRED. Webhook signing secret.
 *   SQUARE_ACCESS_TOKEN          — OPTIONAL. Needed for Customers API lookups.
 *   SQUARE_ENVIRONMENT           — OPTIONAL. "sandbox" or "production". Default: sandbox.
 */

export type SquareConfig = {
  accessToken: string | null;
  webhookSignatureKey: string;
  environment: "sandbox" | "production";
};

export function getSquareConfig(): SquareConfig | null {
  const webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!webhookSignatureKey) return null;

  const accessToken = process.env.SQUARE_ACCESS_TOKEN || null;
  const environment =
    process.env.SQUARE_ENVIRONMENT === "production" ? "production" : "sandbox";

  return { accessToken, webhookSignatureKey, environment };
}

/**
 * Create a Square SDK client. Returns null if access token is missing or
 * looks like a placeholder. Callers should null-check before any API call.
 */
export function getSquareClient(): SquareClient | null {
  const cfg = getSquareConfig();
  if (!cfg?.accessToken) return null;
  if (cfg.accessToken.startsWith("PASTE_") || cfg.accessToken === "TODO") return null;
  return new SquareClient({
    token: cfg.accessToken,
    environment:
      cfg.environment === "production"
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
  });
}

/**
 * Fetch a Square customer's email by their customer_id. Returns null if
 * we can't reach the API (token missing/invalid) or the customer has no email.
 */
export async function getCustomerEmail(customerId: string): Promise<string | null> {
  const client = getSquareClient();
  if (!client) return null;
  try {
    const result = await client.customers.get({ customerId });
    return result.customer?.emailAddress ?? null;
  } catch (err) {
    console.error("[getCustomerEmail] failed for", customerId, err);
    return null;
  }
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
