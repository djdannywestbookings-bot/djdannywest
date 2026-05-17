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
 * Vinyl-record SVG: a more record-looking disc with track-separator grooves,
 * a visible center label, a glossy highlight arc, and the spindle hole.
 * Strokes use currentColor so the parent wrapper controls the honey tint.
 */
function VinylDisc({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Outer rim — two stacked strokes for a real-edge feel */}
      <circle cx="300" cy="300" r="298" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="300" cy="300" r="293" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />

      {/* 42 grooves; every 7th is thicker — mimics the track separators you
         can see on a real record under raking light */}
      {Array.from({ length: 42 }).map((_, i) => {
        const isSeparator = i % 7 === 0;
        return (
          <circle
            key={`g-${i}`}
            cx="300"
            cy="300"
            r={125 + i * 4}
            fill="none"
            stroke="currentColor"
            strokeWidth={isSeparator ? 0.9 : 0.4}
            opacity={isSeparator ? 0.65 : 0.45}
          />
        );
      })}

      {/* Center label disc — bigger, slightly solid so it reads as a paper label */}
      <circle cx="300" cy="300" r="115" fill="currentColor" opacity="0.22" />
      <circle cx="300" cy="300" r="115" fill="none" stroke="currentColor" strokeWidth="1.2" />

      {/* Inner label rings */}
      <circle cx="300" cy="300" r="92" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.55" />
      <circle cx="300" cy="300" r="55" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.4" />

      {/* Spindle hole */}
      <circle cx="300" cy="300" r="6" fill="currentColor" opacity="0.85" />

      {/* Glossy highlight arc — top-right reflection */}
      <path
        d="M 300 78 A 222 222 0 0 1 522 300"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.5"
      />
    </svg>
  );
}

/**
 * Thin equalizer-style bars along the bottom edge — quiet rhythm.
 */
function EqualizerBars({ className = "" }: { className?: string }) {
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

      {/* Layer 2 — soft honey wash on the left for color depth */}
      <div className="pointer-events-none absolute -left-[10%] top-1/4 h-[50vh] w-[50vh] rounded-full bg-ember/[0.20] blur-[180px]" />

      {/* Layer 3 — spinning vinyl disc bleeding off the right edge.
         Slow ~50s rotation so it feels alive without being distracting. */}
      <div
        className="pointer-events-none absolute -right-[18%] top-1/2 hidden h-[140vh] w-[140vh] -translate-y-1/2 text-ember-soft opacity-[0.55] md:block"
        aria-hidden
      >
        <motion.div
          className="h-full w-full will-change-transform"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <VinylDisc className="h-full w-full" />
        </motion.div>
      </div>
      {/* Mobile-only smaller spinning vinyl disc */}
      <div
        className="pointer-events-none absolute -right-[30%] top-[4%] h-[90vw] w-[90vw] text-ember-soft opacity-[0.45] md:hidden"
        aria-hidden
      >
        <motion.div
          className="h-full w-full will-change-transform"
          animate={{ rotate: 360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        >
          <VinylDisc className="h-full w-full" />
        </motion.div>
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
                className="group relative flex flex-col overflow-hidden border border-night/12 bg-cream/35 p-7 backdrop-blur-md transition-colors duration-300 hover:bg-cream/55 md:p-9"
              >
                <div className="opsz-text relative font-display text-2xl leading-tight tracking-[-0.01em] text-night md:text-[26px]">
                  {p.title}
                </div>
                <div className="relative mt-3 font-sans text-[14px] leading-[1.6] text-night/70">
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
