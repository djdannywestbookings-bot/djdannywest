"use client";

import { useMemo, useState } from "react";
import { MixCard, type Mix } from "./MixCard";

type SortKey = "latest" | "oldest";

type Props = { mixes: Mix[] };

export function MixesGrid({ mixes }: Props) {
  const [sort, setSort] = useState<SortKey>("latest");
  const [source, setSource] = useState<string>("All");

  const sources = useMemo(() => {
    const s = new Set(mixes.map((m) => m.source));
    return ["All", ...Array.from(s)];
  }, [mixes]);

  const filtered = useMemo(() => {
    const list = source === "All" ? mixes : mixes.filter((m) => m.source === source);
    return [...list].sort((a, b) => (sort === "latest" ? b.vol - a.vol : a.vol - b.vol));
  }, [mixes, source, sort]);

  return (
    <div>
      {/* Filter strip */}
      <div className="mb-12 flex flex-col gap-6 border-y border-line py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
          <span className="mr-3 font-sans text-[10px] uppercase tracking-[0.28em] text-cream/40">
            Source
          </span>
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.24em] transition ${
                source === s
                  ? "bg-cream text-night"
                  : "text-cream/55 hover:text-cream"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/40">
            Sort
          </span>
          <button
            onClick={() => setSort("latest")}
            className={`font-sans text-[10px] uppercase tracking-[0.24em] transition ${
              sort === "latest" ? "text-cream" : "text-cream/45 hover:text-cream"
            }`}
          >
            Latest
          </button>
          <span className="text-cream/20">·</span>
          <button
            onClick={() => setSort("oldest")}
            className={`font-sans text-[10px] uppercase tracking-[0.24em] transition ${
              sort === "oldest" ? "text-cream" : "text-cream/45 hover:text-cream"
            }`}
          >
            Oldest
          </button>
        </div>
      </div>

      {/* Result count */}
      <div className="mb-8 font-sans text-[10px] uppercase tracking-[0.28em] text-cream/40">
        {filtered.length} {filtered.length === 1 ? "mix" : "mixes"}
        {source !== "All" ? ` · ${source}` : ""}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4 lg:gap-x-7">
        {filtered.map((mix, i) => (
          <MixCard key={mix.slug} mix={mix} index={i} />
        ))}
      </div>
    </div>
  );
}
