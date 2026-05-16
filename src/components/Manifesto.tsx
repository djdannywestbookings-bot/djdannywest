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

export function Manifesto() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-15%", once: true });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-cream py-32 text-night md:py-48"
    >
      {/* Subtle grain texture so the cream surface still has depth */}
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply" />

      {/* Soft warm wash on the left — keeps the brand's honey-gold heritage */}
      <div className="pointer-events-none absolute -left-[10%] top-1/4 h-[50vh] w-[50vh] rounded-full bg-ember/[0.18] blur-[180px]" />
      {/* Quiet right-side wash, slightly cooler */}
      <div className="pointer-events-none absolute -right-[8%] bottom-[10%] h-[40vh] w-[40vh] rounded-full bg-ember-soft/[0.12] blur-[180px]" />

      {/* Top + bottom hairlines to set the section apart from the dark above/below */}
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
                className="group relative flex flex-col overflow-hidden border-t-2 border-ember bg-night/[0.03] p-7 backdrop-blur-sm transition-colors duration-300 hover:bg-night/[0.06] md:p-9"
              >
                {/* subtle inner glow on hover */}
                <div className="pointer-events-none absolute -right-1/4 -top-1/2 h-[150%] w-[150%] rounded-full bg-ember/[0.08] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

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
