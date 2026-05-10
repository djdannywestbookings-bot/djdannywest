"use client";

import { motion } from "motion/react";

export type Mix = {
  vol: number;
  slug: string;
  title: string;
  subtitle: string;
  source: string;
  series: string;
  durationSec: number;
  duration: string;
  isExplicit: boolean;
  coverArt: string;
  tags: string[];
};

type Props = { mix: Mix; index: number };

export function MixCard({ mix, index }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.7,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
    >
      {/* Cover (entire card links to detail page) */}
      <a
        href={`/mixes/${mix.slug}`}
        className="relative block aspect-square w-full overflow-hidden bg-night-soft"
        aria-label={`${mix.title} ${mix.subtitle}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mix.coverArt}
          alt={`${mix.title} ${mix.subtitle} cover art`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Subtle hover overlay — invites the click */}
        <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-night/90 via-night/0 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/80">
            🔒 Subscribers only
          </span>
          <span className="inline-flex items-center gap-2 bg-ember px-3 py-2 font-sans text-[10px] uppercase tracking-[0.22em] text-night">
            Open →
          </span>
        </div>

        {/* Persistent lock pip top-right */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 bg-night/55 px-2 py-1 backdrop-blur-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" />
          <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-cream/85">
            Locked
          </span>
        </div>
      </a>

      {/* Meta */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-3">
          <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-ember">
            {mix.subtitle}
          </div>
          <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/40">
            {mix.duration}
          </div>
        </div>
        <h3 className="opsz-text mt-2 font-display text-[20px] font-light leading-tight tracking-[-0.01em] text-cream md:text-[22px]">
          {mix.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-[10px] uppercase tracking-[0.24em] text-cream/45">
          <span>{mix.source}</span>
          {mix.tags.slice(0, 2).map((t) => (
            <span key={t} className="flex items-center gap-2">
              <span className="inline-block h-px w-2 bg-cream/25" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
