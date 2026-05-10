"use client";

import { motion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function PageHeader() {
  return (
    <header className="relative overflow-hidden border-b border-line bg-night pb-20 pt-24 md:pb-28 md:pt-32">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />
      <div className="pointer-events-none absolute -right-[10%] -top-[10%] h-[55vh] w-[55vh] rounded-full bg-ember/15 blur-[180px]" />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 md:grid-cols-12 md:gap-10 md:px-12">
        <div className="md:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45"
          >
            <div className="mb-3 h-px w-12 bg-ember/70" />
            No. 02 — The Archive
          </motion.div>
        </div>
        <div className="md:col-span-9">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easeOut, delay: 0.1 }}
            className="opsz-display font-display text-[18vw] font-light leading-[0.84] tracking-[-0.045em] text-cream md:text-[clamp(80px,10vw,168px)]"
          >
            <span className="italic">Mixes.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-xl font-sans text-[15px] leading-[1.65] text-cream/70 md:text-[17px]"
          >
            The full archive — sets recorded for SiriusXM, residencies, weddings, and rooms you couldn&apos;t be in. Two new mixes every month.{" "}
            <span className="text-cream">Streaming locked to subscribers.</span>
          </motion.p>
        </div>
      </div>
    </header>
  );
}
