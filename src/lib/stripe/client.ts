import "server-only";
import Stripe from "stripe";

/**
 * Stripe server SDK wrapper.
 *
 * Required env vars (set in Vercel):
 *   STRIPE_SECRET_KEY        — Stripe Dashboard → Developers → API keys → Secret key
 *   STRIPE_WEBHOOK_SECRET    — Stripe Dashboard → Developers → Webhooks → Signing secret
 *   STRIPE_PRICE_ID          — id of the $20/mo recurring Price (starts with price_...)
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — Publishable key (safe to expose)
 *
 * For test/sandbox mode, all keys are the test variants (sk_test_..., pk_test_...).
 * For production, switch to live keys.
 */

export type StripeConfig = {
  secretKey: string;
  webhookSecret: string | null;
  priceId: string | null;
  publishableKey: string | null;
};

export function getStripeConfig(): StripeConfig | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.startsWith("PASTE_")) return null;
  return {
    secretKey,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || null,
    priceId: process.env.STRIPE_PRICE_ID || null,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null,
  };
}

let cached: Stripe | null = null;
export function getStripeClient(): Stripe | null {
  if (cached) return cached;
  const cfg = getStripeConfig();
  if (!cfg) return null;
  cached = new Stripe(cfg.secretKey, {
    // Use the API version your Stripe account defaults to. Pinning here would
    // diverge if the Stripe SDK ships an unknown version string.
    typescript: true,
  });
  return cached;
}

/**
 * Verify a Stripe webhook signature and parse the event.
 * Returns null if signature is invalid or config is missing.
 */
export async function verifyStripeWebhook(
  rawBody: string,
  signature: string | null,
): Promise<Stripe.Event | null> {
  const stripe = getStripeClient();
  const cfg = getStripeConfig();
  if (!stripe || !cfg?.webhookSecret || !signature) return null;
  try {
    return await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      cfg.webhookSecret,
    );
  } catch (err) {
    console.error("[verifyStripeWebhook] failed:", err);
    return null;
  }
}
