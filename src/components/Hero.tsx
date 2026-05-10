"use client";

import { motion } from "motion/react";
import { Marquee } from "./Marquee";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-night text-cream">
      {/* Full-bleed promo video — z-0 */}
      <div className="absolute inset-0 z-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/hero-poster.jpg"
        >
          <source src="/video/hero-1080.mp4" type="video/mp4" media="(min-width: 1024px)" />
          <source src="/video/hero-720.mp4" type="video/mp4" />
        </video>

        {/* Legibility gradients — left side darker for text */}
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 via-50% to-night/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/60" />
        {/* Ember kiss */}
        <div className="absolute -right-[10%] top-[10%] h-[60vh] w-[60vh] rounded-full bg-ember/15 blur-[180px]" />
      </div>

      {/* Grain over everything */}
      <div className="grain pointer-events-none absolute inset-0 z-[1] opacity-[0.14] mix-blend-overlay" />

      {/* Top nav */}
      <header className="relative z-20 mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
          </span>
          <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/80">
            Danny West
          </span>
        </div>
        <nav className="hidden items-center gap-10 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/65 md:flex">
          <a href="/mixes" className="transition hover:text-cream">Mixes</a>
          <a href="#book" className="transition hover:text-cream">Book</a>
          <a href="#subscribe" className="transition hover:text-cream">Subscribe</a>
        </nav>
        <a
          href="#subscribe"
          className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember transition hover:text-cream"
        >
          $20 / mo →
        </a>
      </header>

      {/* Hero content */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-90px)] max-w-[1600px] grid-cols-1 items-end gap-14 px-6 pb-16 pt-8 md:grid-cols-12 md:px-12 md:pb-24 md:pt-4">
        {/* Text column */}
        <div className="md:col-span-8 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mb-10 inline-flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/60"
          >
            <span className="inline-block h-px w-10 bg-cream/30" />
            Subscriber archive · No. 001
          </motion.div>

          <h1 className="font-display font-light leading-[0.84] tracking-[-0.045em] text-cream">
            <motion.span
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easeOut, delay: 0.2 }}
              className="opsz-display block text-[18vw] italic md:text-[clamp(80px,10.5vw,180px)]"
            >
              Sets
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easeOut, delay: 0.32 }}
              className="opsz-display block text-[18vw] md:text-[clamp(80px,10.5vw,180px)]"
            >
              that move
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easeOut, delay: 0.44 }}
              className="opsz-display block text-[18vw] text-ember md:text-[clamp(80px,10.5vw,180px)]"
            >
              rooms.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-12 max-w-md font-sans text-[15px] leading-[1.65] text-cream/75 md:text-[17px]"
          >
            A private archive of the mixes I play in clubs, on rooftops, at
            weddings, after hours. Two new sets every month.{" "}
            <span className="text-cream">No previews — subscribers only.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            <a
              href="#subscribe"
              className="group relative inline-flex items-center gap-3 overflow-hidden bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream"
            >
              <span className="relative z-10">Subscribe — $20 / month</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#book"
              className="group inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.24em] text-cream/70 transition hover:text-cream"
            >
              <span className="underline decoration-cream/25 underline-offset-[6px] transition group-hover:decoration-cream">
                Book Danny — from $1,500
              </span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </motion.div>
        </div>

        {/* Bottom-right floating tag */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="md:col-span-4 lg:col-span-5"
        >
          <div className="ml-auto flex max-w-[280px] flex-col items-end gap-4 text-right">
            <div className="flex items-center gap-2.5">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
              </span>
              <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/85">
                Now Playing · Sunset 004
              </span>
            </div>
            <div className="opsz-text font-display text-[15px] italic leading-snug text-cream/70 md:text-[16px]">
              &ldquo;The mixes you can&apos;t get on Spotify. The sets that
              don&apos;t exist on SoundCloud.&rdquo;
            </div>
            <div className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <span>Dallas · Worldwide</span>
              <span className="inline-block h-px w-6 bg-cream/30" />
              <span>Est. 2026</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Marquee at bottom */}
      <div className="relative z-10 border-t border-line bg-night/70 py-7 backdrop-blur-sm">
        <Marquee />
      </div>
    </section>
  );
}
