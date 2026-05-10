"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const NOW = [
  { role: "Official DJ", venue: "Dallas Cowboys · Stadium Club" },
  { role: "Mix Show Coordinator", venue: "SiriusXM Channel 13 · Pitbull's Globalization" },
  { role: "Talent Booker / DJ", venue: "Gaylord Texan" },
];

const TOURED = [
  { year: "2023", title: "50 Cent — Final Lap Tour" },
  { year: "2023", title: "Pitbull — Can't Stop Us Now Tour" },
  { year: "2022", title: "Latin Life Festival — London" },
  { year: "2021", title: "Enrique Iglesias + Ricky Martin Tour" },
  { year: "2018", title: "Red Bull 3Style — Santiago, Chile" },
];

const STAGES = [
  "ESPN Super Bowl",
  "HBO Boxing · Top Rank",
  "American Airlines Center",
  "House of Blues Las Vegas",
  "W Hotel Dallas",
  "Club LIV Manchester",
  "Tup Tup Palace Newcastle",
  "UP & Down NYC",
  "Resort World Bimini",
  "WARP Tokyo",
  "Piccadilly Osaka",
  "Terraza Catedral Mexico City",
  "Saddle Ranch Universal City",
  "SXSW Austin",
];

export function Credits() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-15%", once: true });

  return (
    <section
      ref={ref}
      id="credits"
      className="relative w-full overflow-hidden border-t border-line bg-night py-32 md:py-40"
    >
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay" />
      <div className="pointer-events-none absolute right-[-10%] top-[20%] h-[40vh] w-[40vh] rounded-full bg-ember/[0.08] blur-[180px]" />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:gap-10 md:px-12">
        {/* Section label + heading */}
        <div className="md:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45"
          >
            <div className="mb-3 h-px w-12 bg-ember/70" />
            No. 03 — On the Board
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: easeOut, delay: 0.1 }}
            className="opsz-section mt-6 font-display text-[44px] font-light leading-[0.95] tracking-[-0.025em] text-cream md:text-[56px]"
          >
            <span className="italic">Where</span>
            <br />
            it&apos;s
            <br />
            played.
          </motion.h2>
        </div>

        {/* Three columns: NOW / TOURED / STAGES */}
        <div className="grid grid-cols-1 gap-14 md:col-span-9 md:grid-cols-3 md:gap-10">
          {/* NOW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.15 }}
          >
            <div className="mb-5 flex items-baseline justify-between">
              <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
                Now
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-cream/35">
                Residencies
              </span>
            </div>
            <ul className="space-y-5">
              {NOW.map((item) => (
                <li key={item.role}>
                  <div className="opsz-text font-display text-[20px] leading-snug tracking-[-0.005em] text-cream md:text-[22px]">
                    {item.role}
                  </div>
                  <div className="mt-1 font-sans text-[12px] leading-snug text-cream/55">
                    {item.venue}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* TOURED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.25 }}
          >
            <div className="mb-5 flex items-baseline justify-between">
              <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
                Toured
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-cream/35">
                Selected
              </span>
            </div>
            <ul className="space-y-5">
              {TOURED.map((item) => (
                <li key={item.title} className="flex items-start gap-4">
                  <div className="font-sans text-[12px] leading-snug text-cream/40 tabular-nums">
                    {item.year}
                  </div>
                  <div className="opsz-text font-display text-[18px] leading-snug tracking-[-0.005em] text-cream md:text-[20px]">
                    {item.title}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* STAGES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.35 }}
          >
            <div className="mb-5 flex items-baseline justify-between">
              <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
                Stages
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-cream/35">
                Worldwide
              </span>
            </div>
            <ul className="space-y-2.5">
              {STAGES.map((s) => (
                <li
                  key={s}
                  className="font-sans text-[13px] leading-snug text-cream/70"
                >
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
