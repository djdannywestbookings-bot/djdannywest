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

type PlayerCtx = {
  nowPlaying: NowPlaying | null;
  play: (track: NowPlaying) => void;
  close: () => void;
};

const PlayerContext = createContext<PlayerCtx | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);

  const play = useCallback((track: NowPlaying) => {
    setNowPlaying(track);
  }, []);

  const close = useCallback(() => {
    setNowPlaying(null);
  }, []);

  const value = useMemo<PlayerCtx>(
    () => ({ nowPlaying, play, close }),
    [nowPlaying, play, close],
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
