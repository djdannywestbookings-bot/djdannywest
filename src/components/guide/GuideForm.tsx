"use client";

import { motion } from "motion/react";
import { useState, useTransition } from "react";
import { submitGuideRequest } from "@/app/wedding-dj-guide/actions";

const easeOut = [0.16, 1, 0.3, 1] as const;

const labelCls =
  "font-sans text-[10px] uppercase tracking-[0.32em] text-cream/55";
const fieldCls =
  "w-full bg-transparent border-0 border-b border-line py-3 font-sans text-[15px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none focus:ring-0 transition";

const GUIDE_URL = "/guides/dfw-wedding-dj-guide.pdf";

/**
 * Lead-magnet inquiry form for the /wedding-dj-guide landing page.
 *
 * Same field set as the main booking form so a guide-download lead lands in
 * Danny's admin queue as a soft inquiry, but with the eventType locked to
 * Wedding and a copy-tone that's "get the guide" not "book me".
 */
export function GuideForm() {
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitGuideRequest(formData);
      if (result.ok) {
        setSubmitted(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: easeOut }}
        className="py-12 text-center"
      >
        <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
          Your guide is ready
        </div>
        <h2 className="opsz-section mt-6 font-display text-[clamp(48px,7vw,96px)] font-light italic leading-[0.95] tracking-[-0.04em] text-cream">
          Here it is.
        </h2>
        <p className="mx-auto mt-6 max-w-md font-sans text-[15px] leading-[1.65] text-cream/70">
          Download below — and check your inbox for a confirmation. I&apos;ll
          take a personal look at your date and reply within 24 hours.
        </p>
        <a
          href={GUIDE_URL}
          target="_blank"
          rel="noopener"
          className="group mt-10 inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream"
        >
          Download the PDF
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
        <div className="mt-4 font-sans text-[11px] text-cream/40">
          10 pages · djdannywest.com
        </div>
      </motion.div>
    );
  }

  return (
    <form
      action={handleSubmit}
      className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-10"
    >
      {/* Event type — locked to Wedding for the guide flow but readable */}
      <input type="hidden" name="eventType" value="Wedding" />

      {/* Event date */}
      <div className="md:col-span-1">
        <label htmlFor="eventDate" className={labelCls}>
          Wedding date
        </label>
        <input
          id="eventDate"
          name="eventDate"
          type="date"
          className={`${fieldCls} [color-scheme:dark]`}
        />
      </div>

      {/* Location / venue */}
      <div className="md:col-span-1">
        <label htmlFor="location" className={labelCls}>
          Venue (if known)
        </label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="e.g. Marquee on Magnolia"
          className={fieldCls}
        />
      </div>

      {/* Guests */}
      <div className="md:col-span-1">
        <label htmlFor="guests" className={labelCls}>
          Expected guests
        </label>
        <input
          id="guests"
          name="guests"
          type="text"
          placeholder="e.g. 150"
          className={fieldCls}
        />
      </div>

      {/* City — useful filter for DFW */}
      <div className="md:col-span-1">
        <label htmlFor="howHeard" className={labelCls}>
          How did you find me?
        </label>
        <input
          id="howHeard"
          name="howHeard"
          type="text"
          placeholder="Google, IG, friend, planner…"
          className={fieldCls}
        />
      </div>

      {/* Offer */}
      <div className="md:col-span-2">
        <label htmlFor="offer" className={labelCls}>
          Budget ballpark (optional)
        </label>
        <input
          id="offer"
          name="offer"
          type="text"
          placeholder="e.g. $3K–$5K — or leave blank, we can talk it through"
          className={fieldCls}
        />
        <p className="mt-2 font-sans text-[11px] leading-snug text-cream/40">
          No pressure here. A ballpark helps me give you a real answer about
          fit — most DFW couples I work with are in the $3K–$6K range.
        </p>
      </div>

      {/* Name */}
      <div className="md:col-span-1">
        <label htmlFor="name" className={labelCls}>
          Your name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className={fieldCls}
        />
      </div>

      {/* Email */}
      <div className="md:col-span-1">
        <label htmlFor="email" className={labelCls}>
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={fieldCls}
        />
      </div>

      {/* Phone */}
      <div className="md:col-span-1">
        <label htmlFor="phone" className={labelCls}>
          Phone (optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className={fieldCls}
        />
      </div>

      {/* Notes */}
      <div className="md:col-span-2">
        <label htmlFor="notes" className={labelCls}>
          Anything I should know? (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Specific concerns, must-have songs, cultural touches, anything."
          className={`${fieldCls} resize-none`}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="md:col-span-2 font-sans text-[12px] text-ember">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-4">
        <p className="font-sans text-[11px] text-cream/40 max-w-[24rem]">
          I'll email the PDF immediately + personally review your event and
          reply within 24 hours.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send me the guide"}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
