"use client";

import { motion } from "motion/react";

const items = [
  "Sunset 004",
  "Late Night 011",
  "Wedding · Cocktail Hour Vol. 3",
  "Peak Time 008",
  "After Hours · Brooklyn",
  "R&B Slow Burn",
  "Sensual 002",
  "Lounge Sessions 09",
  "Rooftop · Summer Edits",
];

export function Marquee() {
  return (
    <div className="flex w-full overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        className="opsz-display flex shrink-0 items-center gap-12 whitespace-nowrap pr-12 font-display text-[44px] leading-none tracking-tight text-cream/30 md:text-[60px]"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-12">
            <span className="italic">{item}</span>
            <span className="text-ember/60">●</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
