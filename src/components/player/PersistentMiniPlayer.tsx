"use client";

import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { motion, AnimatePresence } from "motion/react";
import { usePlayer, type NowPlaying } from "./PlayerProvider";

/**
 * Sticky bottom-pinned mini-player that lives in the root layout so audio
 * keeps playing as the user navigates between pages.
 *
 * Pulls a signed playback token from /api/mux/playback-token for every
 * track. That endpoint runs the has_active_access() server-side check,
 * so the moment a subscription lapses the next token request fails and
 * the player stops working — built-in auth refresh on every play.
 *
 * Sets navigator.mediaSession metadata so iOS / Android lock screens
 * and Bluetooth headphones show the track title, series, cover art,
 * and respond to play/pause/skip actions.
 */
export function PersistentMiniPlayer() {
  const { nowPlaying, close } = usePlayer();

  return (
    <AnimatePresence>
      {nowPlaying ? (
        <motion.div
          key="player"
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-cream/15 bg-night/95 backdrop-blur-md"
        >
          <PlayerBody nowPlaying={nowPlaying} onClose={close} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function PlayerBody({
  nowPlaying,
  onClose,
}: {
  nowPlaying: NowPlaying;
  onClose: () => void;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  // Mux player ref so we can set Media Session action handlers
  const muxRef = useRef<HTMLElement | null>(null);

  // Fetch a fresh signed JWT every time the loaded track changes.
  // The /api/mux/playback-token endpoint re-checks has_active_access()
  // on every call, so this also serves as the "still subscribed?"
  // verification on each play.
  useEffect(() => {
    let cancelled = false;
    setToken(null);
    setTokenError(null);
    (async () => {
      try {
        const resp = await fetch(
          `/api/mux/playback-token?playbackId=${encodeURIComponent(nowPlaying.playbackId)}`,
          { cache: "no-store" },
        );
        const data: { ok?: boolean; token?: string; error?: string } =
          await resp.json();
        if (cancelled) return;
        if (!resp.ok || !data.token) {
          setTokenError(
            data.error ??
              "Your session expired. Please refresh — you may need to re-subscribe.",
          );
          return;
        }
        setToken(data.token);
      } catch (e) {
        if (!cancelled) {
          setTokenError(
            e instanceof Error ? e.message : "Couldn't load the player",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nowPlaying.playbackId]);

  // Wire navigator.mediaSession so the lock-screen / AirPods / Bluetooth
  // controls show the right track and respond to taps.
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) {
      return;
    }
    navigator.mediaSession.metadata = new MediaMetadata({
      title: nowPlaying.title,
      artist: "DJ Danny West",
      album: nowPlaying.subtitle ?? "DJ Danny West",
      artwork: nowPlaying.coverUrl
        ? [
            { src: nowPlaying.coverUrl, sizes: "512x512", type: "image/jpeg" },
            { src: nowPlaying.coverUrl, sizes: "256x256", type: "image/jpeg" },
            { src: nowPlaying.coverUrl, sizes: "128x128", type: "image/jpeg" },
          ]
        : [],
    });

    const player = muxRef.current as (HTMLAudioElement & { play: () => Promise<void>; pause: () => void; currentTime: number; duration: number }) | null;
    const handlers: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
      [
        "play",
        () => {
          player?.play().catch(() => {});
        },
      ],
      [
        "pause",
        () => {
          player?.pause();
        },
      ],
      [
        "seekbackward",
        (details: { seekOffset?: number }) => {
          if (player) {
            const offset = details.seekOffset ?? 15;
            player.currentTime = Math.max(0, player.currentTime - offset);
          }
        },
      ],
      [
        "seekforward",
        (details: { seekOffset?: number }) => {
          if (player) {
            const offset = details.seekOffset ?? 30;
            player.currentTime = Math.min(
              player.duration || Infinity,
              player.currentTime + offset,
            );
          }
        },
      ],
      [
        "seekto",
        (details: { seekTime?: number; fastSeek?: boolean }) => {
          if (player && typeof details.seekTime === "number") {
            player.currentTime = details.seekTime;
          }
        },
      ],
    ];
    for (const [action, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Some platforms reject unknown actions silently — ignore.
      }
    }
    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          /* noop */
        }
      }
    };
  }, [nowPlaying]);

  return (
    <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 md:gap-6 md:px-8 md:py-4">
      {/* Track meta */}
      <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-[0_0_280px]">
        <div className="relative aspect-square h-12 w-12 shrink-0 overflow-hidden bg-night-soft md:h-14 md:w-14">
          {nowPlaying.coverUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={nowPlaying.coverUrl}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-[20px] text-cream/20">
              ♫
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[14px] leading-tight text-cream md:text-[15px]">
            {nowPlaying.title}
          </div>
          {nowPlaying.subtitle ? (
            <div className="truncate font-sans text-[11px] uppercase tracking-[0.2em] text-cream/45">
              {nowPlaying.subtitle}
            </div>
          ) : null}
        </div>
      </div>

      {/* Mux Player — handles its own play/pause/scrub UI */}
      <div className="flex-1">
        {tokenError ? (
          <div className="font-sans text-[12px] text-ember">{tokenError}</div>
        ) : !token ? (
          <div className="font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45">
            Loading…
          </div>
        ) : (
          <MuxPlayer
            ref={(el) => {
              muxRef.current = el as unknown as HTMLElement | null;
            }}
            playbackId={nowPlaying.playbackId}
            tokens={{ playback: token }}
            metadata={{
              video_title: nowPlaying.title,
              video_series: nowPlaying.subtitle ?? undefined,
            }}
            accentColor="#E5B97A"
            primaryColor="#F5F1EA"
            audio
            streamType="on-demand"
            autoPlay
            style={{
              background: "transparent",
              color: "#F5F1EA",
              width: "100%",
              ["--controls" as string]: "none",
              ["--media-object-fit" as string]: "contain",
            }}
          />
        )}
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close player"
        className="grid h-9 w-9 shrink-0 place-items-center text-cream/55 transition hover:text-cream"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>
    </div>
  );
}
