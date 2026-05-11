"use client";

import { useState } from "react";

/**
 * Opens the Stripe Customer Portal in a new tab. Members use the portal to
 * cancel, update card on file, or download invoices. We hit our own
 * /api/stripe/portal endpoint which creates a one-time portal session URL
 * and returns it.
 */
export function ManageButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Could not open the portal");
      }
      // Redirect in same tab — keeps the back button working.
      window.location.href = json.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={openPortal}
        disabled={loading}
        className="inline-flex border border-line bg-night/40 px-5 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-cream/85 transition hover:border-cream hover:text-cream disabled:opacity-50"
      >
        {loading ? "Opening…" : "Manage subscription →"}
      </button>
      <p className="mt-3 font-sans text-[11px] text-cream/45">
        Update card on file, see invoices, or cancel.
      </p>
      {error && (
        <p className="mt-3 font-sans text-[12px] text-red-400">{error}</p>
      )}
    </div>
  );
}
