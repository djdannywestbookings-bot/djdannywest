"use client";

import { motion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const types = [
  "Weddings",
  "Cocktail Hour",
  "Corporate",
  "Private",
  "Clubs",
  "Stadium / Arena",
];

export function BookHero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-night pb-20 pt-24 md:pb-28 md:pt-32">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />
      <div className="pointer-events-none absolute -right-[10%] -top-[10%] h-[55vh] w-[55vh] rounded-full bg-ember/15 blur-[180px]" />
      <div className="pointer-events-none absolute -left-[10%] bottom-[10%] h-[40vh] w-[40vh] rounded-full bg-ember/[0.06] blur-[180px]" />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 md:grid-cols-12 md:px-12">
        <div className="md:col-span-12">
          <h1 className="font-display font-light leading-[0.84] tracking-[-0.045em] text-cream">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easeOut, delay: 0.1 }}
              className="opsz-display block text-[16vw] italic md:text-[clamp(72px,9.5vw,168px)]"
            >
              Book the
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: easeOut, delay: 0.22 }}
              className="opsz-display block text-[16vw] text-ember md:text-[clamp(72px,9.5vw,168px)]"
            >
              night.
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 max-w-xl font-sans text-[15px] leading-[1.65] text-cream/70 md:text-[17px]"
          >
            Bookings <span className="text-cream">by inquiry</span>. Custom
            quotes for weddings, corporate floors, private events, and clubs you
            don&apos;t need to brief — the room recognizes me, the room
            recognizes the records.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-8 flex flex-wrap gap-x-2 gap-y-2"
          >
            {types.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 border border-line px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.24em] text-cream/65"
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
