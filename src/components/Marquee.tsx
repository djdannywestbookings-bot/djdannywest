"use client";

import { motion } from "motion/react";

// Real credentials — pulled from Danny's EPK. Acts as a scrolling social-proof bar
// at the bottom of the hero. If you add a new credential, drop it in this list.
const items = [
  "SiriusXM · Channel 13",
  "Dallas Cowboys",
  "Pitbull's Globalization",
  "DJcity",
  "50 Cent · Final Lap Tour",
  "Pitbull · Can't Stop Us Now",
  "Enrique Iglesias × Ricky Martin",
  "Red Bull 3Style",
  "ESPN · Super Bowl",
  "HBO Boxing",
  "House of Blues Vegas",
  "American Airlines Center",
  "Club LIV Manchester",
  "WARP Tokyo",
  "Resort World Bimini",
  "W Hotel Dallas",
  "SXSW",
];

export function Marquee() {
  return (
    <div className="flex w-full overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 80, ease: "linear", repeat: Infinity }}
        className="opsz-display flex shrink-0 items-center gap-12 whitespace-nowrap pr-12 font-display text-[40px] leading-none tracking-tight text-cream/35 md:text-[56px]"
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
