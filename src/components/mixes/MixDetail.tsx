"use client";

import { motion } from "motion/react";
import type { Mix } from "./MixCard";

const easeOut = [0.16, 1, 0.3, 1] as const;

type Props = {
  mix: Mix;
  prev: Mix | null;
  next: Mix | null;
};

export function MixDetail({ mix, prev, next }: Props) {
  return (
    <>
      {/* Hero band */}
      <section className="relative overflow-hidden border-b border-line bg-night pb-20 pt-16 md:pb-28 md:pt-20">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="pointer-events-none absolute -left-[10%] top-[10%] h-[60vh] w-[60vh] rounded-full bg-ember/12 blur-[180px]" />

        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-12 px-6 md:grid-cols-12 md:gap-14 md:px-12">
          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easeOut }}
            className="md:col-span-5"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-night-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mix.coverArt}
                alt={`${mix.title} ${mix.subtitle} cover`}
                className="h-full w-full object-cover"
              />
              {/* Locked badge — top right */}
              <div className="absolute right-4 top-4 flex items-center gap-1.5 bg-night/55 px-2 py-1 backdrop-blur-sm">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" />
                <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-cream/85">
                  Locked
                </span>
              </div>
            </div>
            {/* Meta strip below cover */}
            <div className="mt-4 flex items-center justify-between font-sans text-[10px] uppercase tracking-[0.32em] text-cream/40">
              <span>{mix.source}</span>
              <span>{mix.duration}</span>
            </div>
          </motion.div>

          {/* Detail column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easeOut, delay: 0.15 }}
            className="md:col-span-7"
          >
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              {mix.subtitle} · {mix.source}
            </div>

            <h1 className="opsz-display mt-6 font-display text-[36px] font-light leading-[0.95] tracking-[-0.03em] text-cream md:text-[clamp(48px,5.5vw,88px)]">
              {mix.title}
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 font-sans text-[10px] uppercase tracking-[0.24em] text-cream/55">
              {mix.tags.map((t, i) => (
                <span key={t} className="flex items-center gap-2">
                  {i > 0 && <span className="inline-block h-px w-2 bg-cream/25" />}
                  <span>{t}</span>
                </span>
              ))}
            </div>

            {/* Locked notice */}
            <div className="mt-12 border-t border-line pt-8">
              <div className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/55">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
                </span>
                Subscribers only · No previews
              </div>
              <p className="mt-5 max-w-lg font-sans text-[15px] leading-[1.65] text-cream/70 md:text-[16px]">
                The full mix streams to active subscribers. Tracklists, signed
                playback, and every back-volume drop monthly. $20 / month, cancel
                anytime.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <a
                  href="/#subscribe"
                  className="group inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream"
                >
                  Subscribe — $20 / month
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
                <a
                  href="/mixes"
                  className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/60 underline decoration-cream/20 underline-offset-[6px] transition hover:text-cream hover:decoration-cream"
                >
                  ← All mixes
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prev / Next nav */}
      {(prev || next) && (
        <nav
          aria-label="Mix navigation"
          className="border-b border-line bg-night/95"
        >
          <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-px bg-line/50 md:px-0">
            <PrevNextLink
              direction="prev"
              label="Newer"
              mix={prev}
            />
            <PrevNextLink
              direction="next"
              label="Older"
              mix={next}
            />
          </div>
        </nav>
      )}
    </>
  );
}

function PrevNextLink({
  direction,
  label,
  mix,
}: {
  direction: "prev" | "next";
  label: string;
  mix: Mix | null;
}) {
  if (!mix) {
    return (
      <div
        className={`bg-night px-6 py-10 md:px-12 md:py-12 ${
          direction === "next" ? "text-right" : ""
        }`}
      >
        <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/25">
          {label}
        </div>
        <div className="opsz-text mt-3 font-display text-[18px] italic leading-snug text-cream/30 md:text-[22px]">
          End of the archive
        </div>
      </div>
    );
  }
  return (
    <a
      href={`/mixes/${mix.slug}`}
      className={`group bg-night px-6 py-10 transition hover:bg-night-soft md:px-12 md:py-12 ${
        direction === "next" ? "text-right" : ""
      }`}
    >
      <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
        {direction === "prev" ? "← " : ""}
        {label}
        {direction === "next" ? " →" : ""}
      </div>
      <div className="mt-3 font-sans text-[10px] uppercase tracking-[0.28em] text-ember">
        {mix.subtitle}
      </div>
      <div className="opsz-text mt-2 font-display text-[20px] leading-snug tracking-[-0.005em] text-cream transition group-hover:text-cream md:text-[26px]">
        {mix.title}
      </div>
      <div className="mt-1 font-sans text-[11px] text-cream/45">
        {mix.source} · {mix.duration}
      </div>
    </a>
  );
}
