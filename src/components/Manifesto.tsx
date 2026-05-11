"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const pillars = [
  {
    num: "01",
    title: "Two new mixes monthly",
    body: "Recorded live or in-studio. Lossless audio, full tracklists, sets you couldn't be in the room for.",
  },
  {
    num: "02",
    title: "Request what you want",
    body: "Subscribers can request a mix once a month. If it lands, I make it — and you get the credit.",
  },
  {
    num: "03",
    title: "Hire the room-mover",
    body: "Bookings by inquiry. Subscribers get a courtesy discount on their first event — weddings, clubs, private.",
  },
];

export function Manifesto() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-15%", once: true });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-night py-32 md:py-48"
    >
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />
      <div className="pointer-events-none absolute -left-[10%] top-1/3 h-[40vh] w-[40vh] rounded-full bg-ember/[0.07] blur-[180px]" />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:gap-10 md:px-12">
        {/* Section label */}
        <div className="md:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45"
          >
            <div className="mb-3 h-px w-12 bg-ember/70" />
            No. 02 — The Ethos
          </motion.div>
        </div>

        {/* Body */}
        <div className="md:col-span-9">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: easeOut }}
            className="opsz-section font-display text-[36px] font-light leading-[1.05] tracking-[-0.025em] text-cream md:text-[clamp(44px,5.2vw,88px)]"
          >
            The mixes you can&apos;t get on Spotify. The sets that don&apos;t
            exist on SoundCloud.{" "}
            <span className="italic text-cream/55">
              The real rooms, the real nights, the real records.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-12"
          >
            {pillars.map((p) => (
              <div key={p.num}>
                <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
                  — {p.num}
                </div>
                <div className="opsz-text mt-4 font-display text-2xl leading-tight tracking-[-0.01em] text-cream md:text-[26px]">
                  {p.title}
                </div>
                <div className="mt-3 font-sans text-[14px] leading-[1.6] text-cream/55">
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
