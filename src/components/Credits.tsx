"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const easeOut = [0.16, 1, 0.3, 1] as const;

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
      className="relative w-full overflow-hidden bg-night-soft py-32 md:py-40"
    >
      {/* Layered grain + warm bloom to give the dark surface life */}
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay" />

      {/* Two ember blooms — one top-right, one bottom-left — for visual rhythm */}
      <div className="pointer-events-none absolute -right-[8%] top-[10%] h-[55vh] w-[55vh] rounded-full bg-ember/[0.14] blur-[180px]" />
      <div className="pointer-events-none absolute -left-[10%] bottom-[5%] h-[40vh] w-[40vh] rounded-full bg-ember/[0.08] blur-[180px]" />

      {/* Subtle vertical hairlines — visual nods to a mixing console */}
      <div className="pointer-events-none absolute inset-y-0 left-[18%] hidden w-px bg-cream/[0.04] md:block" />
      <div className="pointer-events-none absolute inset-y-0 right-[22%] hidden w-px bg-cream/[0.04] md:block" />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:gap-10 md:px-12">
        {/* Section heading */}
        <div className="md:col-span-3">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: easeOut, delay: 0.1 }}
            className="opsz-section font-display text-[40px] font-light leading-[0.98] tracking-[-0.025em] text-cream md:text-[52px]"
          >
            <span className="italic">Some of</span> DJ Danny West&apos;s past performances.
          </motion.h2>
        </div>

        {/* Two columns: TOURED / STAGES */}
        <div className="grid grid-cols-1 gap-14 md:col-span-9 md:grid-cols-2 md:gap-14">
          {/* TOURED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.15 }}
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
            transition={{ duration: 0.8, ease: easeOut, delay: 0.25 }}
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
