"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type SquareTokenResult = {
  status: "OK" | "Errors";
  token?: string;
  errors?: Array<{ message: string }>;
};

type CardInstance = {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<SquareTokenResult>;
  destroy?: () => Promise<void>;
};

type SquarePayments = {
  card: () => Promise<CardInstance>;
};

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => SquarePayments;
    };
  }
}

type Props = {
  applicationId: string;
  locationId: string;
  environment: "sandbox" | "production";
};

export function SubscribeForm({ applicationId, locationId, environment }: Props) {
  const [sdkReady, setSdkReady] = useState(false);
  const [card, setCard] = useState<CardInstance | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const initialisedRef = useRef(false);

  const squareSdkUrl =
    environment === "production"
      ? "https://web.squarecdn.com/v1/square.js"
      : "https://sandbox.web.squarecdn.com/v1/square.js";

  useEffect(() => {
    if (!sdkReady || initialisedRef.current) return;
    if (!window.Square) return;
    if (!applicationId || !locationId) {
      setError("Square credentials are missing.");
      return;
    }
    initialisedRef.current = true;
    (async () => {
      try {
        const payments = window.Square!.payments(applicationId, locationId);
        const instance = await payments.card();
        await instance.attach("#square-card-container");
        setCard(instance);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't load card form");
      }
    })();
  }, [sdkReady, applicationId, locationId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!card) return;
    setStatus("submitting");
    setError(null);

    try {
      const result = await card.tokenize();
      if (result.status !== "OK" || !result.token) {
        const msg = result.errors?.[0]?.message ?? "Couldn't read your card";
        setError(msg);
        setStatus("error");
        return;
      }

      const resp = await fetch("/api/square/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sourceId: result.token }),
      });
      const data: { ok?: boolean; error?: string } = await resp.json();
      if (!resp.ok || !data.ok) {
        setError(data.error ?? "Something went wrong starting your subscription.");
        setStatus("error");
        return;
      }
      setStatus("success");
      // Soft redirect so /account refreshes with the new subscription
      setTimeout(() => {
        window.location.href = "/account";
      }, 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setStatus("error");
    }
  }

  return (
    <>
      <Script src={squareSdkUrl} onLoad={() => setSdkReady(true)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/55">
            Card details
          </div>
          <div
            id="square-card-container"
            ref={cardContainerRef}
            className="mt-3 min-h-[100px] border border-line bg-night/40 p-4"
          />
        </div>

        {error && (
          <div className="font-sans text-[12px] text-ember">{error}</div>
        )}
        {status === "success" && (
          <div className="font-sans text-[12px] text-cream/85">
            Subscription started. Routing you to your dashboard…
          </div>
        )}

        <button
          type="submit"
          disabled={!card || status === "submitting" || status === "success"}
          className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden bg-cream px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-ember disabled:opacity-60"
        >
          {status === "submitting"
            ? "Processing…"
            : status === "success"
              ? "✓ Active"
              : "Subscribe · $20 / month"}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>

        <p className="font-sans text-[11px] leading-relaxed text-cream/55">
          You&apos;ll be charged $20 USD today and every month after on the same
          date until you cancel. Cancel any time from your member dashboard.
        </p>
      </form>
    </>
  );
}
