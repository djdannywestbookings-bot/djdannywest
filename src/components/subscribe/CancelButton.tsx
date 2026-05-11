"use client";

import { useState } from "react";

export function CancelButton() {
  const [status, setStatus] = useState<"idle" | "confirming" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function doCancel() {
    setStatus("loading");
    setError(null);
    try {
      const resp = await fetch("/api/square/cancel", { method: "POST" });
      const data: { ok?: boolean; error?: string } = await resp.json();
      if (!resp.ok || !data.ok) {
        setError(data.error ?? "Couldn't cancel.");
        setStatus("error");
        return;
      }
      setStatus("done");
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="font-sans text-[12px] text-cream/85">
        Cancellation scheduled. You&apos;ll have access until the end of the current
        billing period.
      </div>
    );
  }

  if (status === "confirming") {
    return (
      <div className="space-y-3">
        <p className="font-sans text-[12px] text-cream/65">
          Cancel — you keep access until the current billing period ends, then it
          stops renewing. Sure?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={doCancel}
            disabled={status !== "confirming" as never}
            className="border border-ember bg-ember/10 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.22em] text-ember transition hover:bg-ember hover:text-night"
          >
            Yes, cancel
          </button>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="font-sans text-[10px] uppercase tracking-[0.22em] text-cream/55 transition hover:text-cream"
          >
            Never mind
          </button>
        </div>
        {error && <div className="font-sans text-[12px] text-ember">{error}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={status === "loading"}
        onClick={() => setStatus("confirming")}
        className="font-sans text-[10px] uppercase tracking-[0.22em] text-cream/55 transition hover:text-ember disabled:opacity-60"
      >
        {status === "loading" ? "Cancelling…" : "Cancel subscription"}
      </button>
      {error && <div className="font-sans text-[12px] text-ember">{error}</div>}
    </div>
  );
}
