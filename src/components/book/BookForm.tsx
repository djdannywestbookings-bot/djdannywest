"use client";

import { motion } from "motion/react";
import { useState, useTransition } from "react";
import { submitBookingInquiry } from "@/app/book/actions";

const easeOut = [0.16, 1, 0.3, 1] as const;

const EVENT_TYPES = [
  "Wedding",
  "Corporate",
  "Birthday",
  "Private party",
  "Club / venue",
  "Other",
];

const labelCls = "font-sans text-[10px] uppercase tracking-[0.32em] text-cream/55";
const fieldCls =
  "w-full bg-transparent border-0 border-b border-line py-3 font-sans text-[15px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none focus:ring-0 transition";

export function BookForm() {
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitBookingInquiry(formData);
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
        className="py-24 text-center"
      >
        <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
          Inquiry received
        </div>
        <h2 className="opsz-section mt-6 font-display text-[clamp(56px,8vw,120px)] font-light italic leading-[0.95] tracking-[-0.04em] text-cream">
          Got it.
        </h2>
        <p className="mx-auto mt-8 max-w-md font-sans text-[16px] leading-[1.65] text-cream/70">
          I&apos;ll respond personally within 24 hours. While you wait, the
          archive is open —
        </p>
        <a
          href="/mixes"
          className="mt-8 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.24em] text-cream transition hover:text-ember"
        >
          <span className="underline decoration-cream/30 underline-offset-[6px] transition group-hover:decoration-cream">
            Browse the mixes
          </span>
          <span>→</span>
        </a>
      </motion.div>
    );
  }

  return (
    <form action={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-10">
      {/* Event type */}
      <div className="md:col-span-1">
        <label htmlFor="eventType" className={labelCls}>
          Event type *
        </label>
        <select id="eventType" name="eventType" required defaultValue="" className={fieldCls}>
          <option value="" disabled className="bg-night">
            Select…
          </option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t} className="bg-night">
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Event date */}
      <div className="md:col-span-1">
        <label htmlFor="eventDate" className={labelCls}>
          Event date
        </label>
        <input
          id="eventDate"
          name="eventDate"
          type="date"
          className={`${fieldCls} [color-scheme:dark]`}
        />
      </div>

      {/* Location */}
      <div className="md:col-span-1">
        <label htmlFor="location" className={labelCls}>
          Location / venue
        </label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="e.g. Four Seasons Dallas"
          className={fieldCls}
        />
      </div>

      {/* Guest count */}
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

      {/* Offer — open ended, like a real artist booking */}
      <div className="md:col-span-2">
        <label htmlFor="offer" className={labelCls}>
          Your offer
        </label>
        <input
          id="offer"
          name="offer"
          type="text"
          placeholder="Make an offer — e.g. $5,000 / event, all-in"
          className={fieldCls}
        />
        <p className="mt-2 font-sans text-[11px] leading-snug text-cream/40">
          Bookings go through review. Make your best offer, or leave blank if
          you&apos;d rather discuss before committing to a number.
        </p>
      </div>

      {/* Name */}
      <div className="md:col-span-1">
        <label htmlFor="name" className={labelCls}>
          Your name *
        </label>
        <input id="name" name="name" type="text" required className={fieldCls} />
      </div>

      {/* Email */}
      <div className="md:col-span-1">
        <label htmlFor="email" className={labelCls}>
          Email *
        </label>
        <input id="email" name="email" type="email" required className={fieldCls} />
      </div>

      {/* Phone */}
      <div className="md:col-span-1">
        <label htmlFor="phone" className={labelCls}>
          Phone (optional)
        </label>
        <input id="phone" name="phone" type="tel" className={fieldCls} />
      </div>

      {/* How heard */}
      <div className="md:col-span-1">
        <label htmlFor="howHeard" className={labelCls}>
          How did you find me?
        </label>
        <input
          id="howHeard"
          name="howHeard"
          type="text"
          placeholder="Friend, IG, Cowboys game, etc."
          className={fieldCls}
        />
      </div>

      {/* Notes */}
      <div className="md:col-span-2">
        <label htmlFor="notes" className={labelCls}>
          Tell me about your event
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Vibe, room, crowd, anything I should know."
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
        <p className="font-sans text-[11px] text-cream/40">
          I respond personally within 24 hours.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send Inquiry"}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
