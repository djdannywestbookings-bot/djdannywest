"use client";

import { motion } from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const pillars = [
  {
    num: "01",
    title: "Weekly drops",
    body: "A new mix every week — plus the full back archive going back to my first SiriusXM sets. Lossless audio, full tracklists.",
  },
  {
    num: "02",
    title: "Request a mix",
    body: "Submit a vibe, an occasion, or a Spotify playlist. I read every request. The trends shape what I make next.",
  },
  {
    num: "03",
    title: "Custom mixes",
    body: "Need an hour built around your wedding, your workout, your dinner party? $100 / hour, 3–5 day turnaround.",
  },
];

const faq = [
  {
    question: "What do I get for $20 a month?",
    answer:
      "Full streaming access to every mix in the archive plus every new release. Mix request privileges. Member-only drops. Cancel anytime.",
  },
  {
    question: "How often do new mixes drop?",
    answer:
      "Weekly. New release every week, plus occasional surprise drops from live gigs and recording sessions.",
  },
  {
    question: "How does the request system work?",
    answer:
      "Submit a request from the member dashboard — describe the vibe, attach a Spotify playlist link if you have one, tell me the occasion. I review every one. The recurring themes turn into the next public drops.",
  },
  {
    question: "What's a custom mix?",
    answer:
      "An hour-long mix made for your specific event or vibe — wedding cocktail, road trip, dinner party, workout. $100 per hour, 3–5 day turnaround once I confirm the brief. Members get this option in their dashboard.",
  },
  {
    question: "Can I cancel?",
    answer:
      "Anytime, no penalty, no friction. Manage your subscription from your account page.",
  },
];

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
            <h1 className="font-display font-light leading-[0.86] tracking-[-0.04em] text-cream">
              <span className="opsz-display block text-[18vw] italic md:text-[clamp(80px,10vw,180px)]">
                The
              </span>
              <span className="opsz-display block text-[20vw] font-normal text-ember md:text-[clamp(100px,12vw,220px)]">
                Mixes.
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 max-w-xl font-sans text-[15px] leading-[1.65] text-cream/75 md:text-[17px]"
            >
              Full archive — sets recorded for{" "}
              <span className="text-cream">SiriusXM</span>, residencies,
              weddings, and rooms you couldn&apos;t be in. New mixes released{" "}
              <span className="text-cream">weekly</span>. Subscribers only.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              <a
                href="/subscribe"
                className="group inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember/85"
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

      {/* WHAT YOU GET */}
      <section className="relative overflow-hidden border-b border-line bg-night py-24 md:py-32">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay" />
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              Inside the membership
            </div>
            <h2 className="opsz-section mt-6 font-display text-[44px] font-light leading-[0.95] tracking-[-0.025em] text-cream md:text-[64px]">
              <span className="italic">What</span>
              <br />
              you get.
            </h2>
          </div>
          <div className="md:col-span-9 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
            {pillars.map((p) => (
              <div key={p.num}>
                <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
                  — {p.num}
                </div>
                <div className="opsz-text mt-4 font-display text-2xl leading-tight tracking-[-0.01em] text-cream md:text-[26px]">
                  {p.title}
                </div>
                <p className="mt-3 font-sans text-[14px] leading-[1.6] text-cream/60">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative overflow-hidden border-b border-line bg-night py-24 md:py-32">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              How it works
            </div>
          </div>
          <div className="md:col-span-9">
            <ol className="divide-y divide-line">
              {[
                { n: "01", t: "Subscribe — $20/month", b: "Cancel anytime, no friction." },
                { n: "02", t: "Stream the archive", b: "Every back-mix plus every new weekly drop, delivered to your dashboard." },
                { n: "03", t: "Submit requests", b: "Drop a vibe, occasion, or your Spotify playlist. I read every one." },
                { n: "04", t: "Order custom mixes", b: "$100 per hour, 3–5 day turnaround. Built for your event." },
              ].map((s) => (
                <li key={s.n} className="grid grid-cols-1 gap-4 py-6 md:grid-cols-12 md:gap-8 md:py-8">
                  <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember md:col-span-1">
                    — {s.n}
                  </div>
                  <div className="opsz-text font-display text-[22px] leading-snug tracking-[-0.005em] text-cream md:col-span-4 md:text-[26px]">
                    {s.t}
                  </div>
                  <div className="font-sans text-[15px] leading-[1.6] text-cream/65 md:col-span-7">
                    {s.b}
                  </div>
                </li>
              ))}
            </ol>
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
            $20 / month
          </div>
          <h2 className="opsz-display mt-6 font-display text-[56px] font-normal leading-[0.95] tracking-[-0.04em] text-cream md:text-[clamp(72px,9vw,144px)]">
            Start <span className="text-ember">listening.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-md font-sans text-[16px] leading-[1.65] text-cream/65">
            Member portal launches with the next milestone. Until then, the
            booking funnel is fully open.
          </p>
          <a
            href="/book"
            className="group mt-10 inline-flex items-center gap-3 border border-cream/40 px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-cream transition-colors duration-300 hover:bg-cream hover:text-night"
          >
            Book Danny instead →
          </a>
        </div>
      </section>
    </>
  );
}
