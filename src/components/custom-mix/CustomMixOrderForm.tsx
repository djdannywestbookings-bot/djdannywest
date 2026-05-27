"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { Reorder, useDragControls, motion } from "motion/react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const VIBES = [
  { value: "wedding", label: "Wedding pre-party" },
  { value: "peak-time", label: "Peak-time / club" },
  { value: "chill", label: "Chill / dinner" },
  { value: "gym", label: "Gym / workout" },
  { value: "road-trip", label: "Road trip" },
  { value: "throwback", label: "Throwback" },
  { value: "latin", label: "Latin" },
  { value: "other", label: "Other (tell me in notes)" },
];

type Song = {
  /** Stable ID so React + Reorder can track this row across reorders. */
  id: string;
  title: string;
  artist: string;
  url: string;
};

type Props = {
  publishableKey: string | null;
};

const MIN_SONGS = 8;
const MAX_SONGS = 15;

let seedCounter = 0;
function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  seedCounter += 1;
  return `song-${Date.now()}-${seedCounter}`;
}

function blankSong(): Song {
  return { id: newId(), title: "", artist: "", url: "" };
}

/**
 * Two-step custom-mix order:
 *   1. Brief — vibe, length, drag-to-reorder song list, notes
 *   2. Stripe Embedded Checkout — pays $100 → webhook flips order to 'paid'
 *
 * Songs use stable IDs so the Reorder.Group can drag-to-reorder them
 * without React losing input state. The order you build IS the order
 * I'll mix them in.
 */
export function CustomMixOrderForm({ publishableKey }: Props) {
  const [songs, setSongs] = useState<Song[]>(() =>
    Array.from({ length: MIN_SONGS }, blankSong),
  );
  const [vibe, setVibe] = useState<string>("wedding");
  const [length, setLength] = useState<number>(75);
  const [occasion, setOccasion] = useState<string>("");
  const [explicitOk, setExplicitOk] = useState<boolean>(true);
  const [dontDo, setDontDo] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const stripePromise = useState(() =>
    publishableKey ? loadStripe(publishableKey) : null,
  )[0];

  const filledSongs = useMemo(
    () => songs.filter((s) => s.title.trim().length > 0),
    [songs],
  );
  const valid = filledSongs.length >= MIN_SONGS && !!vibe && length > 0;

  const updateSong = (id: string, patch: Partial<Song>) => {
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };
  const addSong = () => {
    if (songs.length >= MAX_SONGS) return;
    setSongs((prev) => [...prev, blankSong()]);
  };
  const removeSong = (id: string) => {
    setSongs((prev) => (prev.length <= 1 ? prev : prev.filter((s) => s.id !== id)));
  };

  const submit = async () => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/custom-mix-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vibe,
          target_length_minutes: length,
          occasion,
          explicit_ok: explicitOk,
          dont_do: dontDo,
          notes_to_danny: notes,
          songs: filledSongs.map((s) => ({
            title: s.title.trim(),
            artist: s.artist.trim() || undefined,
            url: s.url.trim() || undefined,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.clientSecret) {
        throw new Error(json.error ?? "Could not start checkout");
      }
      setClientSecret(json.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPending(false);
    }
  };

  const fetchClientSecret = useCallback(async () => {
    if (!clientSecret) throw new Error("Missing client secret");
    return clientSecret;
  }, [clientSecret]);

  // === STEP 2: payment ===
  if (clientSecret && stripePromise) {
    return (
      <section className="border border-ember/40 bg-night/80 p-1 md:p-2">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ fetchClientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
        <div className="border-t border-cream/10 p-4 text-center font-sans text-[11px] uppercase tracking-[0.24em] text-cream/45">
          Payment is processed securely by Stripe.
        </div>
      </section>
    );
  }

  // === STEP 1: brief ===
  return (
    <section className="space-y-10">
      {/* Vibe */}
      <div>
        <Label>Vibe</Label>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {VIBES.map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => setVibe(v.value)}
              className={`border px-3 py-2.5 text-left font-sans text-[12px] uppercase tracking-[0.22em] transition ${
                vibe === v.value
                  ? "border-ember bg-ember/10 text-ember"
                  : "border-cream/15 bg-cream/[0.02] text-cream/65 hover:border-cream/35 hover:text-cream"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label>Target length · {length} min</Label>
          <input
            type="range"
            min={45}
            max={120}
            step={5}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-3 w-full accent-ember"
          />
          <div className="mt-1 flex justify-between font-sans text-[10px] uppercase tracking-[0.22em] text-cream/35">
            <span>45 min</span>
            <span>120 min</span>
          </div>
        </div>
        <div>
          <Label>Explicit lyrics OK?</Label>
          <div className="mt-3 flex gap-2">
            <PillButton active={explicitOk} onClick={() => setExplicitOk(true)}>
              Yes — uncut
            </PillButton>
            <PillButton
              active={!explicitOk}
              onClick={() => setExplicitOk(false)}
            >
              Clean edits only
            </PillButton>
          </div>
        </div>
      </div>

      <div>
        <Label>Occasion (optional)</Label>
        <input
          type="text"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          placeholder="Mike & Sara's wedding pre-party · Saturday, June 21"
          className="mt-3 w-full border-0 border-b border-cream/15 bg-transparent py-2 font-sans text-[15px] text-cream placeholder:text-cream/35 focus:border-ember focus:outline-none"
        />
      </div>

      {/* Songs — drag-to-reorder */}
      <div>
        <Label>
          Tracklist · <span className="text-ember">{filledSongs.length}</span>{" "}
          / {MIN_SONGS}–{MAX_SONGS}
        </Label>
        <p className="mt-2 max-w-2xl font-sans text-[12px] leading-snug text-cream/55">
          Drop {MIN_SONGS}–{MAX_SONGS} songs in the order you want them. Drag
          the handle on the left to move a song up or down — the final mix
          follows this order. Spotify links help me hear the exact version
          you have in mind; title + artist alone is enough.
        </p>

        <Reorder.Group
          axis="y"
          values={songs}
          onReorder={setSongs}
          className="mt-5 space-y-2"
        >
          {songs.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              position={i + 1}
              total={songs.length}
              onUpdate={(patch) => updateSong(song.id, patch)}
              onRemove={() => removeSong(song.id)}
              canRemove={songs.length > 1}
            />
          ))}
        </Reorder.Group>

        <button
          type="button"
          onClick={addSong}
          disabled={songs.length >= MAX_SONGS}
          className="mt-4 inline-flex items-center gap-2 border border-cream/20 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.22em] text-cream/65 transition hover:border-cream hover:text-cream disabled:opacity-40"
        >
          <span className="text-ember">+</span> Add another song
          <span className="text-cream/40">
            ({MAX_SONGS - songs.length} left)
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label>Don&rsquo;t do (optional)</Label>
          <textarea
            value={dontDo}
            onChange={(e) => setDontDo(e.target.value)}
            rows={3}
            placeholder="No slow Taylor Swift · skip the dubstep drops · keep BPM under 130"
            className="mt-3 w-full border border-cream/15 bg-night/40 p-3 font-sans text-[13px] text-cream placeholder:text-cream/30 focus:border-ember focus:outline-none"
          />
        </div>
        <div>
          <Label>Anything else (optional)</Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="It's for a surprise 60th birthday — needs to feel like a party but my mom hates EDM"
            className="mt-3 w-full border border-cream/15 bg-night/40 p-3 font-sans text-[13px] text-cream placeholder:text-cream/30 focus:border-ember focus:outline-none"
          />
        </div>
      </div>

      {error ? (
        <div className="border border-ember/40 bg-ember/[0.08] p-4 font-sans text-[13px] text-ember">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-cream/10 pt-6">
        <div className="font-sans text-[12px] text-cream/55">
          <span className="text-cream">$100</span> · one-time · 7-day turnaround
          · secure Stripe checkout
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={!valid || pending}
          className="group inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Loading checkout…" : "Continue to checkout — $100"}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </section>
  );
}

/**
 * Single draggable song row. Handles dragging via a dedicated grip handle
 * (so users can still freely click/select inside text fields without
 * accidentally starting a drag).
 */
function SongRow({
  song,
  position,
  total,
  onUpdate,
  onRemove,
  canRemove,
}: {
  song: Song;
  position: number;
  total: number;
  onUpdate: (patch: Partial<Song>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const dragControls = useDragControls();
  const labelId = useId();

  return (
    <Reorder.Item
      value={song}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{
        scale: 1.015,
        boxShadow: "0 24px 48px -16px rgba(0,0,0,0.6)",
        zIndex: 30,
      }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="grid grid-cols-[36px_28px_1fr_28px] items-center gap-2 border border-cream/10 bg-cream/[0.025] px-2 py-2 backdrop-blur-sm transition-colors hover:border-cream/25 md:grid-cols-[44px_36px_1fr_36px] md:gap-3 md:px-3 md:py-3"
      aria-labelledby={labelId}
    >
      {/* DRAG HANDLE */}
      <button
        type="button"
        onPointerDown={(e) => dragControls.start(e)}
        aria-label={`Reorder song ${position}`}
        className="grid h-9 w-9 cursor-grab touch-none place-items-center text-cream/40 transition hover:bg-cream/5 hover:text-ember active:cursor-grabbing md:h-10 md:w-10"
        style={{ touchAction: "none" }}
      >
        <GripIcon />
      </button>

      {/* POSITION NUMBER */}
      <div
        id={labelId}
        className="text-center font-display text-[20px] italic leading-none text-ember md:text-[24px]"
        aria-label={`Position ${position} of ${total}`}
      >
        {String(position).padStart(2, "0")}
      </div>

      {/* FIELDS */}
      <div className="grid grid-cols-1 gap-1.5 md:grid-cols-12 md:gap-2">
        <input
          type="text"
          value={song.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder={`Song ${position} · title`}
          className="border-0 border-b border-cream/10 bg-transparent py-1.5 font-sans text-[14px] text-cream placeholder:text-cream/30 focus:border-ember focus:outline-none md:col-span-5"
        />
        <input
          type="text"
          value={song.artist}
          onChange={(e) => onUpdate({ artist: e.target.value })}
          placeholder="Artist"
          className="border-0 border-b border-cream/10 bg-transparent py-1.5 font-sans text-[13px] text-cream placeholder:text-cream/30 focus:border-ember focus:outline-none md:col-span-3"
        />
        <input
          type="url"
          value={song.url}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="Spotify / YouTube URL (optional)"
          className="border-0 border-b border-cream/10 bg-transparent py-1.5 font-sans text-[12px] text-cream placeholder:text-cream/30 focus:border-ember focus:outline-none md:col-span-4"
        />
      </div>

      {/* REMOVE */}
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label={`Remove song ${position}`}
        className="grid h-9 w-9 place-items-center text-cream/40 transition hover:text-ember disabled:opacity-25 md:h-10 md:w-10"
      >
        <CloseIcon />
      </button>
    </Reorder.Item>
  );
}

function GripIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="5" cy="3" r="1.2" />
      <circle cx="11" cy="3" r="1.2" />
      <circle cx="5" cy="8" r="1.2" />
      <circle cx="11" cy="8" r="1.2" />
      <circle cx="5" cy="13" r="1.2" />
      <circle cx="11" cy="13" r="1.2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
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
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/65">
      {children}
    </div>
  );
}

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.22em] transition ${
        active
          ? "border-ember bg-ember/10 text-ember"
          : "border-cream/15 bg-cream/[0.02] text-cream/65 hover:border-cream/35 hover:text-cream"
      }`}
    >
      {children}
    </button>
  );
}
