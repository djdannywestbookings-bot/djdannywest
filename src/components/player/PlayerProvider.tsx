"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

/**
 * The track that's currently loaded into the persistent MiniPlayer.
 * Lives at the root layout level so navigating between pages does
 * NOT interrupt playback — the audio keeps going.
 */
export type NowPlaying = {
  playbackId: string;
  title: string;
  /** Series name or short context line shown next to the title. */
  subtitle: string | null;
  coverUrl: string | null;
};

/**
 * An ordered queue. The currently-playing track sits at queue.tracks[queue.index].
 * When a track ends naturally, the player advances index by 1 (auto-advance).
 * When the index reaches the end of the queue, playback stops.
 */
type Queue = {
  tracks: NowPlaying[];
  index: number;
};

type PlayerCtx = {
  nowPlaying: NowPlaying | null;
  /** Has another track waiting after the current one? */
  hasNext: boolean;
  /** Has another track before the current one? */
  hasPrev: boolean;
  /**
   * Start playing a track.
   * - If `queue` is provided, the player auto-advances through it when the
   *   current track ends. `track` must be present in `queue`; if not, it
   *   gets prepended.
   * - If `queue` is omitted, single-track mode (no auto-advance).
   */
  play: (track: NowPlaying, queue?: NowPlaying[]) => void;
  /** Advance to the next track in the queue. Stops if at end. */
  playNext: () => void;
  /** Go back to the previous track in the queue. No-op if at start. */
  playPrev: () => void;
  close: () => void;
};

const PlayerContext = createContext<PlayerCtx | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Queue | null>(null);
  const nowPlaying = queue ? queue.tracks[queue.index] ?? null : null;

  const play = useCallback((track: NowPlaying, tracks?: NowPlaying[]) => {
    if (!tracks || tracks.length === 0) {
      // Single-track mode — no auto-advance
      setQueue({ tracks: [track], index: 0 });
      return;
    }
    let index = tracks.findIndex((t) => t.playbackId === track.playbackId);
    let resolved = tracks;
    if (index === -1) {
      // Caller passed a queue that doesn't include the clicked track — prepend it
      resolved = [track, ...tracks];
      index = 0;
    }
    setQueue({ tracks: resolved, index });
  }, []);

  const playNext = useCallback(() => {
    setQueue((prev) => {
      if (!prev) return prev;
      if (prev.index + 1 >= prev.tracks.length) {
        // End of queue — close the player
        return null;
      }
      return { ...prev, index: prev.index + 1 };
    });
  }, []);

  const playPrev = useCallback(() => {
    setQueue((prev) => {
      if (!prev) return prev;
      if (prev.index <= 0) return prev;
      return { ...prev, index: prev.index - 1 };
    });
  }, []);

  const close = useCallback(() => {
    setQueue(null);
  }, []);

  const value = useMemo<PlayerCtx>(
    () => ({
      nowPlaying,
      hasNext: !!queue && queue.index + 1 < queue.tracks.length,
      hasPrev: !!queue && queue.index > 0,
      play,
      playNext,
      playPrev,
      close,
    }),
    [nowPlaying, queue, play, playNext, playPrev, close],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerCtx {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used inside <PlayerProvider>");
  }
  return ctx;
}
