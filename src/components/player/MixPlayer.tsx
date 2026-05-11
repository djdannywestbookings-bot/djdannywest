"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";

type Props = {
  playbackId: string;
  title: string;
  posterUrl?: string;
};

/**
 * Audio-only Mux player.
 *
 * Fetches a short-lived signed JWT from /api/mux/playback-token. That endpoint
 * verifies has_active_access() server-side, so locked-down access is enforced
 * at request time, not just visually.
 */
export function MixPlayer({ playbackId, title, posterUrl }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setToken(null);
    (async () => {
      try {
        const resp = await fetch(
          `/api/mux/playback-token?playbackId=${encodeURIComponent(playbackId)}`,
          { cache: "no-store" },
        );
        const data: { ok?: boolean; token?: string; error?: string } = await resp.json();
        if (cancelled) return;
        if (!resp.ok || !data.token) {
          setError(data.error ?? "Couldn't load the player");
          return;
        }
        setToken(data.token);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [playbackId]);

  if (error) {
    return (
      <div className="border border-line bg-night/40 p-6 font-sans text-[13px] text-cream/70">
        {error}
      </div>
    );
  }
  if (!token) {
    return (
      <div className="border border-line bg-night/40 p-6 font-sans text-[12px] uppercase tracking-[0.22em] text-cream/45">
        Loading player…
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-line bg-night/40">
      <MuxPlayer
        playbackId={playbackId}
        tokens={{ playback: token }}
        metadata={{ video_title: title }}
        accentColor="#E5B97A"
        primaryColor="#F5F1EA"
        audio
        streamType="on-demand"
        poster={posterUrl}
        style={{
          // Keep the controls clean and consistent with the editorial look.
          background: "#0A0907",
          color: "#F5F1EA",
          width: "100%",
        }}
      />
    </div>
  );
}
