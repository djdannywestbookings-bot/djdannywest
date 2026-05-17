"use client";

import { motion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;

type Pillar = {
  title: string;
  body: string;
  tone: "cream" | "ember" | "night";
};

const pillars: Pillar[] = [
  {
    title: "The library",
    body: "A new mix every week. Lossless audio. Stream the full catalog on-demand from any device.",
    tone: "cream",
  },
  {
    title: "Request a mix",
    body: "Submit a vibe and an occasion, or share a Spotify playlist. Members get the first cut.",
    tone: "ember",
  },
  {
    title: "Custom mix",
    body: "Need an hour built around your night? $100 per hour, 3–5 day turnaround once the brief is locked.",
    tone: "night",
  },
];

const faq = [
  {
    question: "What do I get for $20 a month?",
    answer:
      "Full streaming access to every mix in the catalog, every new weekly drop, and the ability to submit mix requests. Cancel anytime.",
  },
  {
    question: "How often do new mixes drop?",
    answer:
      "Every week. New release every Friday, plus the occasional surprise drop in between.",
  },
  {
    question: "How does the request system work?",
    answer:
      "From your member dashboard — submit a vibe, an occasion, or a Spotify playlist link. I read every one. The recurring themes shape what comes next.",
  },
  {
    question: "What's a custom mix?",
    answer:
      "An hour built specifically for your night. $100 per hour, 3–5 day turnaround once I confirm the brief. Members get the option directly inside the dashboard.",
  },
  {
    question: "Can I cancel?",
    answer:
      "Anytime. Manage your subscription from your account page — no friction, no penalty.",
  },
];

/* Card colorway lookup — keeps each pillar's surface visually distinct
   without leaking gold-on-black AI-poster vibes. */
function cardClasses(tone: Pillar["tone"]): string {
  switch (tone) {
    case "cream":
      return "bg-cream text-night border-night/10 hover:bg-cream/95";
    case "ember":
      return "bg-ember text-night border-night/15 hover:bg-ember/90";
    case "night":
    default:
      return "bg-night-soft text-cream border-cream/15 hover:bg-night";
  }
}

function cardEyebrowClasses(tone: Pillar["tone"]): string {
  return tone === "night" ? "text-cream/60" : "text-night/55";
}

function cardBodyClasses(tone: Pillar["tone"]): string {
  return tone === "night" ? "text-cream/70" : "text-night/70";
}

export function MixesPitch() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-night pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-[10%] -top-[10%] h-[55vh] w-[55vh] rounded-full bg-ember/15 blur-[180px]" />
        <div className="pointer-events-none absolute -left-[10%] bottom-[10%] h-[40vh] w-[40vh] rounded-full bg-ember/[0.07] blur-[180px]" />

        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-12">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 font-sans text-[11px] uppercase tracking-[0.32em] text-cream/55"
            >
              Subscribers only · $20 / month
            </motion.div>
            <h1 className="font-display font-light leading-[0.92] tracking-[-0.04em] text-cream">
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: easeOut, delay: 0.1 }}
                className="opsz-display block text-[12vw] md:text-[clamp(56px,7.5vw,128px)]"
              >
                Exclusive
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: easeOut, delay: 0.22 }}
                className="opsz-display block text-[12vw] md:text-[clamp(56px,7.5vw,128px)]"
              >
                DJ Danny West
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: easeOut, delay: 0.34 }}
                className="opsz-display block text-[12vw] italic md:text-[clamp(56px,7.5vw,128px)]"
              >
                Mixes.
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-12 max-w-xl font-sans text-[15px] leading-[1.65] text-cream/75 md:text-[18px]"
            >
              Live-recorded DJ sets across every genre, every vibe.{" "}
              <span className="text-cream">A non-stop party</span> in your
              headphones — new mixes every week, lossless audio,
              subscribers only.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              <a
                href="/subscribe"
                className="group inline-flex items-center gap-3 bg-cream px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-cream/90"
              >
                Subscribe — $20 / month
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/40">
                Cancel any time
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET — 3 cards with distinct contrasting surfaces */}
      <section className="relative overflow-hidden border-b border-line bg-night py-24 md:py-32">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-[8%] top-[10%] h-[45vh] w-[45vh] rounded-full bg-ember/[0.08] blur-[180px]" />

        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              Inside the membership
            </div>
            <h2 className="opsz-section mt-6 font-display text-[44px] font-light leading-[0.95] tracking-[-0.025em] text-cream md:text-[64px]">
              <span className="italic">What</span>
              <br />
              you get.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:col-span-9 md:grid-cols-3 md:gap-7">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: easeOut, delay: i * 0.1 }}
                className={`group relative flex flex-col overflow-hidden border p-7 transition-colors duration-300 md:p-9 ${cardClasses(
                  p.tone,
                )}`}
              >
                <div
                  className={`font-sans text-[10px] uppercase tracking-[0.32em] ${cardEyebrowClasses(
                    p.tone,
                  )}`}
                >
                  0{i + 1}
                </div>
                <div className="opsz-text relative mt-5 font-display text-2xl leading-tight tracking-[-0.01em] md:text-[26px]">
                  {p.title}
                </div>
                <div
                  className={`relative mt-3 font-sans text-[14px] leading-[1.6] ${cardBodyClasses(
                    p.tone,
                  )}`}
                >
                  {p.body}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden border-b border-line bg-night py-24 md:py-32">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
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
                <div
                  key={q.question}
                  className="grid grid-cols-1 gap-3 py-6 md:grid-cols-7 md:gap-8 md:py-8"
                >
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
          <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/55">
            $20 / month · Cancel any time
          </div>
          <h2 className="opsz-display mt-6 font-display text-[56px] font-normal leading-[0.95] tracking-[-0.04em] text-cream md:text-[clamp(72px,9vw,144px)]">
            Start <span className="italic">listening.</span>
          </h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/subscribe"
              className="group inline-flex items-center gap-3 bg-cream px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-cream/90"
            >
              Subscribe — $20 / month
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="/book"
              className="group inline-flex items-center gap-3 border border-cream/40 px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-cream transition-colors duration-300 hover:bg-cream hover:text-night"
            >
              Book Danny instead →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
