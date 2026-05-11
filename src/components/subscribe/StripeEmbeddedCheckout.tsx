"use client";

import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

type Props = {
  publishableKey: string;
};

/**
 * Mounts Stripe's Embedded Checkout inside our subscribe page. The checkout
 * form is an iframe, but it lives on our page — no redirect, no popup.
 *
 * Flow:
 *   1. We POST /api/stripe/checkout-session to create a session.
 *   2. Stripe returns a client_secret.
 *   3. We pass it to <EmbeddedCheckoutProvider> which renders the form.
 *   4. On payment success, Stripe redirects to /subscribe/success?session_id=...
 */
export function StripeEmbeddedCheckout({ publishableKey }: Props) {
  const [error, setError] = useState<string | null>(null);

  // loadStripe is stable for a given key — memoize across renders.
  const stripePromise = useState(() => loadStripe(publishableKey))[0];

  const fetchClientSecret = useCallback(async () => {
    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok || !json.clientSecret) {
        throw new Error(json.error ?? "Could not start checkout");
      }
      return json.clientSecret as string;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw err;
    }
  }, []);

  if (error) {
    return (
      <div className="border border-line bg-cream/[0.02] p-8">
        <h2 className="font-serif text-[24px] text-cream">
          Couldn&apos;t start checkout
        </h2>
        <p className="mt-3 font-sans text-[14px] text-cream/65">{error}</p>
        <p className="mt-4 font-sans text-[12px] text-cream/45">
          Try refreshing the page. If it keeps happening, email{" "}
          <a
            className="underline hover:text-cream"
            href="mailto:djdannywestbookings@gmail.com"
          >
            djdannywestbookings@gmail.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-line bg-cream/[0.02]">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
