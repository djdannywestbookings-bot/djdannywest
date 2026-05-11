"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const pillars = [
  {
    num: "01",
    title: "New mixes uploaded weekly",
    body: "Recorded live or in studio. Lossless audio. DJ sets you can play in any room.",
  },
  {
    num: "02",
    title: "Request what you want",
    body: "Subscribers can request a mix. Post your Spotify or your favorite playlist, name the mix, and see if it makes the cut.",
  },
  {
    num: "03",
    title: "Hire your favorite DJ",
    body: "Send a booking inquiry to get a courtesy discount on your first event — weddings, clubs, private.",
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
        {/* Body */}
        <div className="md:col-span-12">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: easeOut }}
            className="opsz-section font-display text-[36px] font-light leading-[1.05] tracking-[-0.025em] text-cream md:text-[clamp(44px,5.2vw,88px)]"
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
                key={p.num}
                className="group relative flex flex-col overflow-hidden border-t-2 border-ember/70 bg-cream/[0.03] p-7 backdrop-blur-sm transition-colors duration-300 hover:bg-cream/[0.05] md:p-9"
              >
                {/* subtle inner glow on hover */}
                <div className="pointer-events-none absolute -top-1/2 -right-1/4 h-[150%] w-[150%] rounded-full bg-ember/[0.04] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
                  — {p.num}
                </div>
                <div className="opsz-text relative mt-5 font-display text-2xl leading-tight tracking-[-0.01em] text-cream md:text-[26px]">
                  {p.title}
                </div>
                <div className="relative mt-3 font-sans text-[14px] leading-[1.6] text-cream/65">
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
