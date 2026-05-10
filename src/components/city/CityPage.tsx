"use client";

import { motion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;

export type CityPageProps = {
  city: string;
  /** Short region label shown in eyebrow, e.g. "TX · DFW" */
  region: string;
  /** Eyebrow text above the hero headline */
  eyebrow: string;
  /** Single-line tagline for the meta description and hero sub */
  tagline: string;
  /** Long-form intro paragraph */
  intro: string;
  /** Three quick "what I do" event types — each shows as a label + 1-line copy */
  doing: { label: string; copy: string }[];
  /** Notable rooms / contexts in the city — keep these factual */
  rooms: string[];
  /** FAQ items, also rendered into JSON-LD by the page */
  faq: { question: string; answer: string }[];
};

export function CityPage(props: CityPageProps) {
  const { city, region, eyebrow, tagline, intro, doing, rooms, faq } = props;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-night pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-[10%] -top-[10%] h-[55vh] w-[55vh] rounded-full bg-ember/15 blur-[180px]" />

        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45"
            >
              <div className="mb-3 h-px w-12 bg-ember/70" />
              {eyebrow}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-4 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/30"
            >
              {region}
            </motion.div>
          </div>
          <div className="md:col-span-9">
            <h1 className="font-display font-light leading-[0.86] tracking-[-0.04em] text-cream">
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: easeOut, delay: 0.1 }}
                className="opsz-section block text-[12vw] font-normal text-cream/55 md:text-[clamp(40px,5vw,80px)]"
              >
                Hire a DJ
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: easeOut, delay: 0.22 }}
                className="opsz-display block text-[20vw] font-normal text-ember md:text-[clamp(96px,11vw,200px)]"
              >
                in {city}.
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 max-w-2xl font-sans text-[16px] leading-[1.65] text-cream/75 md:text-[18px]"
            >
              {tagline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              <a
                href="/book"
                className="group inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream"
              >
                Book — from $1,500
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a
                href="/mixes"
                className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/65 underline decoration-cream/20 underline-offset-[6px] transition hover:text-cream hover:decoration-cream"
              >
                Hear the archive
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="relative overflow-hidden border-b border-line bg-night py-24 md:py-32">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              The pitch
            </div>
          </div>
          <div className="md:col-span-9">
            <p className="opsz-section font-display text-[28px] font-light leading-[1.2] tracking-[-0.015em] text-cream md:text-[clamp(32px,3.4vw,52px)]">
              {intro}
            </p>
          </div>
        </div>
      </section>

      {/* WHAT I DO */}
      <section className="relative overflow-hidden border-b border-line bg-night py-24 md:py-28">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              What I do in {city}
            </div>
          </div>
          <div className="md:col-span-9 grid grid-cols-1 gap-10 md:grid-cols-3">
            {doing.map((d, i) => (
              <div key={d.label}>
                <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
                  — 0{i + 1}
                </div>
                <div className="opsz-text mt-3 font-display text-[22px] leading-tight tracking-[-0.005em] text-cream md:text-[26px]">
                  {d.label}
                </div>
                <p className="mt-3 font-sans text-[14px] leading-[1.6] text-cream/55">
                  {d.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="relative overflow-hidden border-b border-line bg-night py-24 md:py-28">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              Rooms I know
            </div>
          </div>
          <div className="md:col-span-9">
            <ul className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
              {rooms.map((r) => (
                <li key={r} className="font-sans text-[15px] leading-snug text-cream/75">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden border-b border-line bg-night py-24 md:py-32">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              FAQ
            </div>
            <h2 className="opsz-section mt-6 font-display text-[36px] font-light leading-[0.95] tracking-[-0.025em] text-cream md:text-[44px]">
              <span className="italic">Quick</span>
              <br />
              answers.
            </h2>
          </div>
          <div className="md:col-span-9">
            <dl className="divide-y divide-line">
              {faq.map((q) => (
                <div key={q.question} className="py-6 grid grid-cols-1 gap-3 md:grid-cols-7 md:gap-8 md:py-8">
                  <dt className="opsz-text font-display text-[20px] leading-tight tracking-[-0.005em] text-cream md:col-span-3 md:text-[22px]">
                    {q.question}
                  </dt>
                  <dd className="font-sans text-[15px] leading-[1.65] text-cream/65 md:col-span-4">
                    {q.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="relative overflow-hidden bg-night py-24 md:py-32">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/15 blur-[200px]" />
        <div className="relative mx-auto max-w-[1100px] px-6 text-center md:px-12">
          <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
            Ready when you are
          </div>
          <h2 className="opsz-display mt-6 font-display text-[48px] font-normal leading-[0.95] tracking-[-0.035em] text-cream md:text-[clamp(56px,7vw,112px)]">
            Book the {city.toLowerCase()}
            <br />
            <span className="text-ember">DJ.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-md font-sans text-[16px] leading-[1.65] text-cream/65">
            Bookings start at $1,500. I respond within 24 hours.
          </p>
          <a
            href="/book"
            className="group mt-10 inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream"
          >
            Send Inquiry →
          </a>
        </div>
      </section>
    </>
  );
}
