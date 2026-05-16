"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const pillars = [
  {
    title: "New mixes uploaded weekly",
    body: "Recorded live or in studio. Lossless audio. DJ sets you can play in any room.",
  },
  {
    title: "Request what you want",
    body: "Subscribers can request a mix. Post your Spotify or your favorite playlist, name the mix, and see if it makes the cut.",
  },
  {
    title: "Hire your favorite DJ",
    body: "Send a booking inquiry to get a courtesy discount on your first event — weddings, clubs, private.",
  },
];

/**
 * Vinyl-record SVG: 32 concentric grooves + a label disc in the center.
 * Sized via viewBox so it scales cleanly. Strokes use currentColor so
 * the parent wrapper controls the tint.
 */
function VinylDisc({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* outer rim */}
      <circle cx="300" cy="300" r="298" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* grooves */}
      {Array.from({ length: 30 }).map((_, i) => (
        <circle
          key={i}
          cx="300"
          cy="300"
          r={90 + i * 6.5}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity={0.55}
        />
      ))}
      {/* center label disc */}
      <circle cx="300" cy="300" r="78" fill="currentColor" opacity="0.08" />
      <circle cx="300" cy="300" r="78" fill="none" stroke="currentColor" strokeWidth="1" />
      {/* spindle hole */}
      <circle cx="300" cy="300" r="6" fill="currentColor" opacity="0.7" />
      {/* label rule */}
      <line
        x1="222"
        y1="300"
        x2="378"
        y2="300"
        stroke="currentColor"
        strokeWidth="0.4"
        opacity="0.5"
      />
    </svg>
  );
}

/**
 * Thin equalizer-style vertical bars — pure decorative texture sitting
 * along the bottom edge of the section to add quiet rhythm.
 */
function EqualizerBars({ className = "" }: { className?: string }) {
  // Pseudo-randomized but deterministic heights so server + client agree
  const heights = [
    18, 32, 24, 46, 12, 38, 28, 52, 22, 42, 16, 34, 30, 48, 20, 36, 26, 44, 14,
    40, 30, 52, 18, 32, 28, 46, 22, 38, 16, 34, 24, 42, 12, 36, 30, 48,
  ];
  return (
    <svg
      viewBox={`0 0 ${heights.length * 14} 60`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 14}
          y={60 - h}
          width="3"
          height={h}
          fill="currentColor"
          opacity={0.42}
        />
      ))}
    </svg>
  );
}

export function Manifesto() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-15%", once: true });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-cream py-32 text-night md:py-48"
    >
      {/* Layer 1 — grain texture for film-paper warmth */}
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply" />

      {/* Layer 2 — soft warm honey wash on the left */}
      <div className="pointer-events-none absolute -left-[10%] top-1/4 h-[50vh] w-[50vh] rounded-full bg-ember/[0.20] blur-[180px]" />

      {/* Layer 3 — vinyl disc bleeding off the right edge. Honey-tinted so it
          reads as part of the brand and not generic blackline. */}
      <div
        className="pointer-events-none absolute -right-[18%] top-1/2 hidden h-[140vh] w-[140vh] -translate-y-1/2 text-ember-soft opacity-[0.42] md:block"
        aria-hidden
      >
        <VinylDisc className="h-full w-full" />
      </div>
      {/* Mobile-only smaller vinyl disc — top-right corner */}
      <div
        className="pointer-events-none absolute -right-[30%] top-[6%] h-[80vw] w-[80vw] text-ember-soft opacity-[0.35] md:hidden"
        aria-hidden
      >
        <VinylDisc className="h-full w-full" />
      </div>

      {/* Layer 4 — quiet equalizer rhythm along the bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 text-night opacity-[0.10]"
        aria-hidden
      >
        <EqualizerBars className="h-full w-full" />
      </div>

      {/* Hairlines */}
      <div className="absolute inset-x-0 top-0 h-px bg-night/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-night/10" />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:gap-10 md:px-12">
        <div className="md:col-span-12">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: easeOut }}
            className="opsz-section font-display text-[36px] font-light leading-[1.05] tracking-[-0.025em] text-night md:text-[clamp(44px,5.2vw,88px)]"
          >
            The mixes you can&apos;t get on Spotify. The sets that don&apos;t
            exist on SoundCloud.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-7"
          >
            {pillars.map((p) => (
              <div
                key={p.title}
                className="group relative flex flex-col overflow-hidden border-t-2 border-ember bg-cream/95 p-7 backdrop-blur-sm transition-colors duration-300 hover:bg-cream md:p-9"
              >
                {/* subtle inner glow on hover */}
                <div className="pointer-events-none absolute -right-1/4 -top-1/2 h-[150%] w-[150%] rounded-full bg-ember/[0.10] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="opsz-text relative font-display text-2xl leading-tight tracking-[-0.01em] text-night md:text-[26px]">
                  {p.title}
                </div>
                <div className="relative mt-3 font-sans text-[14px] leading-[1.6] text-night/65">
                  {p.body}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
