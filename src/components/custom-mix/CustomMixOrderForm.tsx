"use client";

import { useCallback, useMemo, useState } from "react";
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

type Song = { title: string; artist: string; url: string };

type Props = {
  publishableKey: string | null;
};

const MIN_SONGS = 8;
const MAX_SONGS = 15;

/**
 * Two-step custom-mix order:
 *   1. Brief — vibe, length, occasion, song list, notes
 *   2. Stripe Embedded Checkout — pays $100 → webhook flips order to 'paid'
 *
 * The brief is POSTed to /api/stripe/custom-mix-session which inserts a
 * pending_payment order row and returns the Stripe client_secret. We then
 * render <EmbeddedCheckout> in place of the form. After payment Stripe
 * redirects to /account/custom-mix/success?session_id=...
 */
export function CustomMixOrderForm({ publishableKey }: Props) {
  const [songs, setSongs] = useState<Song[]>(() =>
    Array.from({ length: MIN_SONGS }, () => ({ title: "", artist: "", url: "" })),
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

  const updateSong = (i: number, patch: Partial<Song>) => {
    setSongs((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  };
  const addSong = () => {
    if (songs.length >= MAX_SONGS) return;
    setSongs((prev) => [...prev, { title: "", artist: "", url: "" }]);
  };
  const removeSong = (i: number) => {
    setSongs((prev) => prev.filter((_, idx) => idx !== i));
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
      {/* Vibe + length */}
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
            <PillButton
              active={explicitOk}
              onClick={() => setExplicitOk(true)}
            >
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

      {/* Songs */}
      <div>
        <Label>
          Songs · <span className="text-ember">{filledSongs.length}</span> /
          {" "}{MIN_SONGS}–{MAX_SONGS}
        </Label>
        <p className="mt-2 font-sans text-[12px] leading-snug text-cream/55">
          Drop {MIN_SONGS}–{MAX_SONGS} songs you want in the mix. Spotify
          links help me hear the exact version you have in mind, but title +
          artist is enough.
        </p>
        <div className="mt-4 space-y-2">
          {songs.map((song, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-2 border border-cream/10 bg-cream/[0.02] p-3"
            >
              <input
                type="text"
                value={song.title}
                onChange={(e) => updateSong(i, { title: e.target.value })}
                placeholder={`Song ${i + 1} title`}
                className="col-span-12 border-0 border-b border-cream/10 bg-transparent py-1.5 font-sans text-[14px] text-cream placeholder:text-cream/30 focus:border-ember focus:outline-none md:col-span-5"
              />
              <input
                type="text"
                value={song.artist}
                onChange={(e) => updateSong(i, { artist: e.target.value })}
                placeholder="Artist (optional)"
                className="col-span-12 border-0 border-b border-cream/10 bg-transparent py-1.5 font-sans text-[13px] text-cream placeholder:text-cream/30 focus:border-ember focus:outline-none md:col-span-3"
              />
              <input
                type="url"
                value={song.url}
                onChange={(e) => updateSong(i, { url: e.target.value })}
                placeholder="Spotify URL (optional)"
                className="col-span-11 border-0 border-b border-cream/10 bg-transparent py-1.5 font-sans text-[12px] text-cream placeholder:text-cream/30 focus:border-ember focus:outline-none md:col-span-3"
              />
              <button
                type="button"
                onClick={() => removeSong(i)}
                disabled={songs.length <= 1}
                aria-label={`Remove song ${i + 1}`}
                className="col-span-1 grid place-items-center text-cream/45 transition hover:text-ember disabled:opacity-30 md:col-span-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addSong}
          disabled={songs.length >= MAX_SONGS}
          className="mt-3 inline-flex items-center gap-2 border border-cream/20 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.22em] text-cream/65 transition hover:border-cream hover:text-cream disabled:opacity-40"
        >
          + Add another song ({MAX_SONGS - songs.length} left)
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
