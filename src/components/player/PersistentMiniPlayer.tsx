"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { motion, AnimatePresence } from "motion/react";
import { usePlayer, type NowPlaying } from "./PlayerProvider";

/**
 * Sticky bottom-pinned mini-player that lives in the root layout so audio
 * keeps playing as the user navigates between pages.
 *
 * Mux's default control bar is hidden — we drive the underlying audio
 * element ourselves so the visual language is editorial / DJ-room: a big
 * play/pause button, an oversized waveform scrubber (procedurally
 * generated per-mix), hover-time preview, ember-on-cream progress.
 *
 * When a mix ends, the player auto-advances to the next track in the
 * queue (passed in by whatever surface called play()). At end of queue,
 * the player closes itself.
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
  const { hasNext, hasPrev, playNext, playPrev } = usePlayer();

  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const muxRef = useRef<HTMLElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fetch a fresh signed JWT every time the loaded track changes.
  useEffect(() => {
    let cancelled = false;
    setToken(null);
    setTokenError(null);
    setCurrentTime(0);
    setDuration(0);
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

  // Bind audio engine events. The `ended` event triggers auto-advance.
  useEffect(() => {
    const el = muxRef.current as
      | (HTMLElement & {
          play: () => Promise<void>;
          pause: () => void;
          currentTime: number;
          duration: number;
          paused: boolean;
          volume: number;
        })
      | null;
    if (!el) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(el.currentTime || 0);
    const onDur = () => setDuration(el.duration || 0);
    const onEnded = () => {
      // Auto-advance to next track in queue (no-op + close if no next)
      playNext();
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("durationchange", onDur);
    el.addEventListener("loadedmetadata", onDur);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("durationchange", onDur);
      el.removeEventListener("loadedmetadata", onDur);
      el.removeEventListener("ended", onEnded);
    };
  }, [token, playNext]);

  const togglePlay = () => {
    const el = muxRef.current as (HTMLElement & {
      play: () => Promise<void>;
      pause: () => void;
      paused: boolean;
    }) | null;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  };

  const seekTo = (time: number) => {
    const el = muxRef.current as (HTMLElement & { currentTime: number }) | null;
    if (el && isFinite(time)) {
      el.currentTime = Math.max(0, Math.min(duration || time, time));
    }
  };

  // Lock-screen / Bluetooth / AirPods metadata + handlers
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

    const player = muxRef.current as
      | (HTMLAudioElement & {
          play: () => Promise<void>;
          pause: () => void;
          currentTime: number;
          duration: number;
        })
      | null;
    const handlers: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
      ["play", () => { player?.play().catch(() => {}); }],
      ["pause", () => { player?.pause(); }],
      ["nexttrack", () => { playNext(); }],
      ["previoustrack", () => { playPrev(); }],
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
        (details: { seekTime?: number }) => {
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
        /* unsupported actions silently ignored */
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
  }, [nowPlaying, playNext, playPrev]);

  return (
    <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 md:gap-5 md:px-8 md:py-4">
      {/* Hidden Mux Player — drives audio decode/HLS playback */}
      <div className="hidden">
        {token ? (
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
            audio
            streamType="on-demand"
            autoPlay
            style={{
              background: "transparent",
              ["--controls" as string]: "none",
            }}
          />
        ) : null}
      </div>

      {/* Cover art */}
      <div className="relative aspect-square h-12 w-12 shrink-0 overflow-hidden bg-night-soft md:h-16 md:w-16">
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
          <div className="flex h-full w-full items-center justify-center font-display text-[22px] text-cream/20">
            ♫
          </div>
        )}
        {isPlaying ? (
          <div className="pointer-events-none absolute inset-0 ring-1 ring-ember/50" />
        ) : null}
      </div>

      {/* Track meta — hides on small screens to make room for the waveform */}
      <div className="hidden min-w-0 lg:block lg:w-[200px]">
        <div className="truncate font-display text-[14px] leading-tight text-cream">
          {nowPlaying.title}
        </div>
        {nowPlaying.subtitle ? (
          <div className="mt-1 truncate font-sans text-[10px] uppercase tracking-[0.22em] text-cream/45">
            {nowPlaying.subtitle}
          </div>
        ) : null}
      </div>

      {/* Prev button */}
      <button
        type="button"
        onClick={playPrev}
        disabled={!hasPrev}
        aria-label="Previous mix"
        className="hidden h-9 w-9 shrink-0 items-center justify-center text-cream/55 transition hover:text-cream disabled:opacity-25 md:flex"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M3.5 2.5h1.5v11H3.5zM13 2.5L6 8l7 5.5V2.5z" />
        </svg>
      </button>

      {/* Play / pause */}
      <button
        type="button"
        onClick={togglePlay}
        disabled={!token}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ember text-night transition hover:scale-105 disabled:opacity-40 md:h-12 md:w-12"
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <rect x="3" y="2" width="3.5" height="12" rx="0.5" />
            <rect x="9.5" y="2" width="3.5" height="12" rx="0.5" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ marginLeft: 2 }}>
            <path d="M3.5 2.5L13 8L3.5 13.5V2.5Z" />
          </svg>
        )}
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={playNext}
        disabled={!hasNext}
        aria-label="Next mix"
        className="hidden h-9 w-9 shrink-0 items-center justify-center text-cream/55 transition hover:text-cream disabled:opacity-25 md:flex"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M11 2.5h1.5v11H11zM3 2.5L10 8 3 13.5V2.5z" />
        </svg>
      </button>

      {/* Current time */}
      <div className="hidden shrink-0 font-sans text-[11px] uppercase tracking-[0.2em] tabular-nums text-cream/65 md:block md:w-12 md:text-right">
        {formatTime(currentTime)}
      </div>

      {/* Waveform scrubber */}
      <div className="min-w-0 flex-1">
        {tokenError ? (
          <div className="font-sans text-[12px] text-ember">{tokenError}</div>
        ) : !token ? (
          <div className="font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45">
            Loading…
          </div>
        ) : (
          <Waveform
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
            seed={nowPlaying.playbackId}
            isPlaying={isPlaying}
          />
        )}
      </div>

      {/* Duration */}
      <div className="hidden shrink-0 font-sans text-[11px] uppercase tracking-[0.2em] tabular-nums text-cream/65 md:block md:w-12">
        {formatTime(duration)}
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

/**
 * Procedural-but-deterministic waveform display. Seeded from the playback
 * ID so each track gets a unique pattern that's stable across reloads.
 */
function Waveform({
  currentTime,
  duration,
  onSeek,
  seed,
  isPlaying,
}: {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  seed: string;
  isPlaying: boolean;
}) {
  const bars = useMemo(() => generateBars(seed, 140), [seed]);
  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const ratioFromEvent = (clientX: number): number => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) =>
    setHoverRatio(ratioFromEvent(e.clientX));
  const handleLeave = () => setHoverRatio(null);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    onSeek(ratioFromEvent(e.clientX) * duration);
  };

  const hoverTime =
    hoverRatio !== null && duration > 0 ? hoverRatio * duration : null;

  return (
    <div className="relative" style={{ paddingTop: 18 }}>
      {hoverTime !== null && hoverRatio !== null ? (
        <div
          className="pointer-events-none absolute font-sans text-[10px] uppercase tracking-[0.2em] tabular-nums text-cream/85"
          style={{
            top: 0,
            left: `${hoverRatio * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          {formatTime(hoverTime)}
        </div>
      ) : null}
      <div
        ref={trackRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={currentTime}
        tabIndex={0}
        className="relative flex h-12 cursor-pointer items-center gap-[2px] select-none"
      >
        {bars.map((h, i) => {
          const barRatio = (i + 0.5) / bars.length;
          const past = barRatio <= progress;
          const isHead = isPlaying && Math.abs(barRatio - progress) < 1 / bars.length;
          return (
            <div
              key={i}
              style={{ height: `${Math.max(8, h * 100)}%` }}
              className={
                "flex-1 rounded-[1px] transition-[background-color,transform] duration-100 " +
                (past ? "bg-ember" : "bg-cream/30") +
                (isHead ? " scale-y-[1.15]" : "")
              }
            />
          );
        })}
        {hoverRatio !== null ? (
          <div
            className="pointer-events-none absolute top-0 h-full w-px bg-cream/50"
            style={{ left: `${hoverRatio * 100}%` }}
          />
        ) : null}
      </div>
    </div>
  );
}

function generateBars(seed: string, count: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  const rand = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return (h & 0x7fffffff) / 0x7fffffff;
  };

  const out: number[] = [];
  let v = 0.5;
  for (let i = 0; i < count; i++) {
    const delta = (rand() - 0.5) * 0.45;
    v = Math.max(0.18, Math.min(0.95, v + delta));
    const pulse = 0.08 * Math.sin(i * 0.42) + 0.05 * Math.sin(i * 0.13);
    out.push(Math.max(0.12, Math.min(1, v + pulse)));
  }
  return out;
}

function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  const total = Math.floor(s);
  const min = Math.floor(total / 60);
  const sec = total % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
