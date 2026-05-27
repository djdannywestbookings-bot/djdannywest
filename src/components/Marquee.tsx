"use client";

import { motion } from "motion/react";

// Real credentials — pulled from Danny's EPK. Acts as a scrolling social-proof
// bar at the bottom of the hero. JetBrains Mono in italic + uppercase + a touch
// of letter-spacing gives this strip a tour-itinerary / broadcast schedule feel
// rather than a footer-legal-copy feel.
const items = [
  "SiriusXM · Channel 13",
  "Dallas Cowboys",
  "Pitbull's Globalization",
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
        className="flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 font-mono text-[16px] font-medium uppercase italic leading-none text-cream/55 md:gap-14 md:pr-14 md:text-[20px]"
        style={{ letterSpacing: "0.05em" }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-10 md:gap-14">
            <span>{item}</span>
            <span aria-hidden="true" className="text-ember/55">●</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
