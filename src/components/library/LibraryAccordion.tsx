"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePlayer, type NowPlaying } from "@/components/player/PlayerProvider";

export type LibraryMix = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  volume: number | null;
  cover_url: string | null;
  mux_playback_id: string | null;
  duration_seconds: number | null;
  published_at: string | null;
};

export type LibrarySeries = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  cover_url: string | null;
};

export type Shelf = {
  series: LibrarySeries;
  mixes: LibraryMix[];
};

type Props = {
  shelves: Shelf[];
  hasAccess: boolean;
};

function fmtDur(s: number | null | undefined): string {
  if (!s || s <= 0) return "—";
  const total = Math.round(s);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const NEW_WINDOW_DAYS = 14;

function isFresh(iso: string | null): boolean {
  if (!iso) return false;
  return Date.now() - new Date(iso).getTime() < NEW_WINDOW_DAYS * 86400000;
}

/**
 * Stack of collapsible series shelves. Each shelf has an ambient backdrop
 * image (blurred copy of the newest mix's cover) so the header bar reads
 * as designed instead of empty.
 *
 * When a user clicks play on any mix, we hand the PlayerProvider the FULL
 * ordered list of that series' playable mixes so the player auto-advances
 * to the next one when the current track ends. No clicking required to
 * keep the music going — it blends straight through to Vol N+1 (or N-1
 * if browsing newest-first).
 */
export function LibraryAccordion({ shelves, hasAccess }: Props) {
  const { nowPlaying, play } = usePlayer();

  const [openSet, setOpenSet] = useState<Set<string>>(() => {
    const first = shelves.find((s) => s.mixes.length > 0);
    return new Set(first ? [first.series.id] : []);
  });

  const toggle = (id: string) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /**
   * Build a queue from the series and start playback at the clicked mix.
   * Display order is newest-first, so the "next" mix is the one OLDER
   * than the clicked one — feels like a curated DJ set rolling backwards
   * through the catalog.
   */
  const onPlay = (mix: LibraryMix, shelf: Shelf) => {
    if (!hasAccess || !mix.mux_playback_id) return;

    const seriesTitle = shelf.series.title;
    const queue: NowPlaying[] = shelf.mixes
      .filter((m) => !!m.mux_playback_id)
      .map((m) => ({
        playbackId: m.mux_playback_id!,
        title: m.title,
        subtitle: seriesTitle,
        coverUrl: m.cover_url,
      }));

    play(
      {
        playbackId: mix.mux_playback_id,
        title: mix.title,
        subtitle: seriesTitle,
        coverUrl: mix.cover_url,
      },
      queue,
    );
  };

  if (shelves.length === 0) {
    return (
      <div className="border border-dashed border-line/60 p-8 font-sans text-[14px] text-cream/55">
        No series yet. Check back soon.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {shelves.map((shelf) => (
          <ShelfRow
            key={shelf.series.id}
            shelf={shelf}
            open={openSet.has(shelf.series.id)}
            onToggle={() => toggle(shelf.series.id)}
            onPlay={(mix) => onPlay(mix, shelf)}
            hasAccess={hasAccess}
            playingId={nowPlaying?.playbackId ?? null}
          />
        ))}
      </div>

      <div className="h-32" aria-hidden />
    </>
  );
}

function ShelfRow({
  shelf,
  open,
  onToggle,
  onPlay,
  hasAccess,
  playingId,
}: {
  shelf: Shelf;
  open: boolean;
  onToggle: () => void;
  onPlay: (mix: LibraryMix) => void;
  hasAccess: boolean;
  playingId: string | null;
}) {
  const { series, mixes } = shelf;
  const newest = mixes[0];
  const hasNew = newest && isFresh(newest.published_at);
  const headerArt = useMemo(
    () => series.cover_url || newest?.cover_url || null,
    [series.cover_url, newest?.cover_url],
  );

  return (
    <div
      className={`group relative overflow-hidden border transition-all duration-300 ${
        open
          ? "border-cream/30 bg-cream/[0.04]"
          : "border-line bg-cream/[0.02] hover:border-cream/20 hover:bg-cream/[0.03]"
      }`}
    >
      {/* HEADER */}
      <div className="relative">
        {headerArt ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={headerArt}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-[1.35] object-cover opacity-50 blur-2xl saturate-150"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-night/95 via-night/75 to-night/55" />
            <div className="absolute inset-0 bg-gradient-to-b from-night/30 via-transparent to-night/40" />
          </div>
        ) : null}

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="relative flex w-full items-center gap-5 px-5 py-4 text-left md:gap-6 md:px-7 md:py-5"
        >
          <div className="relative aspect-square h-14 w-14 shrink-0 overflow-hidden bg-night-soft md:h-16 md:w-16">
            {headerArt ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={headerArt}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-[24px] text-cream/20">
                ♫
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="truncate font-display text-[20px] font-light leading-tight tracking-[-0.005em] text-cream md:text-[26px]">
                {series.title}
              </h3>
              {hasNew ? (
                <span className="inline-flex items-center gap-1.5 bg-ember px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.28em] text-night">
                  <span className="inline-block h-1 w-1 rounded-full bg-night" />
                  New
                </span>
              ) : null}
            </div>
            {series.subtitle ? (
              <div className="mt-0.5 hidden truncate font-sans text-[11px] uppercase tracking-[0.22em] text-cream/55 md:block">
                {series.subtitle}
              </div>
            ) : null}
          </div>

          <div className="hidden shrink-0 font-sans text-[11px] uppercase tracking-[0.22em] text-cream/65 sm:block">
            {mixes.length} {mixes.length === 1 ? "mix" : "mixes"}
          </div>

          <div
            className={`shrink-0 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          >
            <Chevron />
          </div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-cream/10 px-5 pb-6 pt-5 md:px-7">
              {mixes.length === 0 ? (
                <div className="font-sans text-[13px] text-cream/55">
                  No mixes published in this series yet.
                </div>
              ) : (
                <ul className="flex gap-4 overflow-x-auto pb-2 [scrollbar-color:rgba(245,241,234,0.18)_transparent] [scrollbar-width:thin]">
                  {mixes.map((mix) => (
                    <MixTile
                      key={mix.id}
                      mix={mix}
                      hasAccess={hasAccess}
                      isPlaying={!!playingId && playingId === mix.mux_playback_id}
                      onPlay={() => onPlay(mix)}
                    />
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MixTile({
  mix,
  hasAccess,
  isPlaying,
  onPlay,
}: {
  mix: LibraryMix;
  hasAccess: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const fresh = isFresh(mix.published_at);
  return (
    <li className="w-[220px] shrink-0 md:w-[240px]">
      <div className="group/tile relative aspect-square w-full overflow-hidden bg-night-soft">
        {mix.cover_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={mix.cover_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover/tile:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-[40px] text-cream/15">
            ♫
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/0 to-night/0 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100" />

        {fresh ? (
          <span className="absolute right-2 top-2 bg-ember px-1.5 py-0.5 font-sans text-[9px] uppercase tracking-[0.24em] text-night">
            New
          </span>
        ) : null}

        <button
          type="button"
          onClick={onPlay}
          disabled={!hasAccess || !mix.mux_playback_id}
          aria-label={
            !hasAccess
              ? `Subscribe to play ${mix.title}`
              : isPlaying
                ? `${mix.title} is playing`
                : `Play ${mix.title}`
          }
          className={`absolute left-2 bottom-2 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 ${
            !hasAccess
              ? "bg-night/70 text-cream/55"
              : isPlaying
                ? "bg-ember text-night opacity-100 shadow-[0_8px_30px_-8px_rgba(229,185,122,0.6)]"
                : "bg-cream text-night opacity-0 group-hover/tile:opacity-100 hover:bg-ember"
          }`}
        >
          {!hasAccess ? <LockIcon /> : isPlaying ? <BarsIcon /> : <PlayIcon />}
        </button>
      </div>

      <div className="mt-3 px-0.5">
        <div className="flex items-center gap-2">
          {mix.volume ? (
            <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-ember">
              Vol {String(mix.volume).padStart(2, "0")}
            </span>
          ) : null}
          <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-cream/45">
            {fmtDur(mix.duration_seconds)}
          </span>
        </div>
        <div className="mt-1 truncate font-display text-[15px] leading-tight text-cream">
          {mix.title}
        </div>
        {mix.subtitle ? (
          <div className="mt-0.5 truncate font-sans text-[11px] leading-tight text-cream/45">
            {mix.subtitle}
          </div>
        ) : null}
      </div>
    </li>
  );
}

function Chevron() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-cream/55"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function BarsIcon() {
  return (
    <span className="inline-flex h-3.5 items-end gap-[2px]" aria-hidden="true">
      <span className="inline-block h-2 w-[3px] animate-pulse bg-night" />
      <span
        className="inline-block h-3.5 w-[3px] animate-pulse bg-night"
        style={{ animationDelay: "120ms" }}
      />
      <span
        className="inline-block h-2.5 w-[3px] animate-pulse bg-night"
        style={{ animationDelay: "60ms" }}
      />
    </span>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="1" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
