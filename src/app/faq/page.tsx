import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { StructuredData } from "@/components/StructuredData";
import { faqSchema } from "@/lib/seo";

type FaqGroup = {
  heading: string;
  items: { question: string; answer: string }[];
};

const groups: FaqGroup[] = [
  {
    heading: "Booking + pricing",
    items: [
      {
        question: "How much does a DFW wedding DJ cost?",
        answer:
          "Wedding bookings are quoted per event based on ceremony + reception coverage, hours, travel, and add-ons (lighting, PA, photo booth, MC time). Most DFW weddings land in a similar range to top-tier vendors in the market. Send your date and venue and I'll send a clean quote within 24 hours.",
      },
      {
        question: "How early should I book a DJ in DFW?",
        answer:
          "9–14 months out for Saturday weddings, especially May, June, September, October, November. Corporate and private parties usually book 6–10 weeks out. I'm currently booking dates into next year — if your date is firm, get on the calendar now.",
      },
      {
        question: "How does the booking process work?",
        answer:
          "Submit an inquiry through the Book page with your date, venue, and event type. I respond within 24 hours with availability and a quote. If we're aligned, a signed agreement and deposit hold the date.",
      },
      {
        question: "What's your deposit and payment schedule?",
        answer:
          "Standard practice: signed agreement plus a deposit to hold the date. Balance due before the event per the agreement. I accept ACH, wire, Stripe, and standard corporate AP (NET 30) for corporate clients.",
      },
      {
        question: "What if I need to reschedule?",
        answer:
          "Life happens. Reschedules with reasonable notice typically move the deposit to your new date if I'm available. Cancellation terms are in the agreement — straightforward, fair.",
      },
    ],
  },
  {
    heading: "Music + the night",
    items: [
      {
        question: "Can my guests request songs?",
        answer:
          "Yes. Pre-list your must-plays and do-not-plays. Day-of, guests can request through me or your coordinator. I read the floor in real time — if a request kills momentum I'll skip it and find a smarter substitute with the same vibe.",
      },
      {
        question: "Do you DJ Latin, hip-hop, country, and open-format?",
        answer:
          "Yes to all of it. Open-format is my main lane — Latin, hip-hop, country, top 40, house, throwbacks, EDM crossovers. I run the SiriusXM Channel 13 Pitbull's Globalization mix show, so Latin floors are a sweet spot. Bilingual MC available.",
      },
      {
        question: "Are you bilingual in English and Spanish?",
        answer:
          "Yes. Fully bilingual MC. Quinceañeras, bicultural weddings, Latin nights — handled in either language or both.",
      },
      {
        question: "Can you build a custom playlist for my event?",
        answer:
          "Yes. Send me a Spotify playlist as a brief. I'll mirror the vibe, layer in your must-plays, respect your do-not-plays, and fill the rest with the right energy curve for your crowd.",
      },
      {
        question: "Will you MC for us?",
        answer:
          "Yes. Wedding party introductions, toasts, surprise reveals, prom court announcements, corporate awards — MC duty included with most bookings. Confident on the mic, in either English or Spanish.",
      },
    ],
  },
  {
    heading: "Logistics + production",
    items: [
      {
        question: "Do you bring sound and lighting?",
        answer:
          "I bring my DJ rig — decks, mixer, headphones, wireless microphone. Full PA + dance-floor lighting can be added depending on your venue size and look. Tell me the venue and I'll scope it clean.",
      },
      {
        question: "Do you have liability insurance?",
        answer:
          "Yes. General liability coverage with the ability to provide a certificate naming your venue or production company as additional insured. Most DFW venues require this — happy to handle.",
      },
      {
        question: "Will you provide a microphone for toasts and the ceremony?",
        answer:
          "Yes. Wireless lapel and handheld mics for officiants, vows, toasts, hosts. Soundcheck before doors. I work with your planner on cues.",
      },
      {
        question: "Do you travel outside DFW?",
        answer:
          "Yes. Across Texas, the US, and internationally. I've worked floors from Manchester to Tokyo to Bimini. Travel quoted with the booking.",
      },
    ],
  },
  {
    heading: "Special situations",
    items: [
      {
        question: "Do you DJ both wedding ceremony and reception?",
        answer:
          "Yes — most clients book full coverage: ceremony processional / recessional, cocktail hour, dinner, reception, dance floor. One DJ, one feel, all night.",
      },
      {
        question: "Can you handle a vals / surprise dance at a quinceañera?",
        answer:
          "Yes. Standard vals repertoire plus whatever song the choreographer chose. I cue with your coordinator so vals, surprise dance, padrinos, and toasts all hit on time.",
      },
      {
        question: "Do you DJ same-sex weddings?",
        answer:
          "Absolutely. Every couple, every family configuration — same craft, same care. Send the inquiry.",
      },
      {
        question: "Can you do a corporate event with a strict music policy?",
        answer:
          "Yes. Send the do-play / do-not-play list ahead. I respect it. Where the brand wants creative control, you have it; where the brand wants me to read the floor, I read the floor.",
      },
      {
        question: "Do you offer custom recorded mixes for members?",
        answer:
          "Yes — through the membership at $20/month, mixes are released weekly. Members can also request custom mixes — submit a vibe and an occasion. There's also a paid custom mix option ($100/hour, 3–5 day turnaround) for non-members or for one-off needs.",
      },
    ],
  },
];

const allItems = groups.flatMap((g) => g.items);

export const metadata: Metadata = {
  title: {
    absolute:
      "DFW DJ FAQ — Wedding · Corporate · Quinceañera Questions | DJ Danny West",
  },
  description:
    "Common questions about hiring a DFW DJ — booking, pricing, music policy, deposits, ceremonies, vals, MC duties, equipment, insurance. DJ Danny West, the Dallas Cowboys' official DJ.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "DFW DJ FAQ — DJ Danny West",
    description:
      "Wedding, corporate, quinceañera, club — answers to the most common DFW DJ questions.",
    url: "/faq",
    images: ["/og-image.jpg"],
  },
};

export default function FaqPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData schemas={[faqSchema(allItems)]} />
      <SiteNav active="book" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-night pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-[10%] -top-[10%] h-[55vh] w-[55vh] rounded-full bg-ember/15 blur-[180px]" />

        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-12">
            <div className="mb-6 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/55">
              Frequently asked
            </div>
            <h1 className="font-display font-light leading-[0.92] tracking-[-0.04em] text-cream">
              <span className="opsz-display block text-[16vw] italic md:text-[clamp(72px,9vw,160px)]">
                The questions.
              </span>
            </h1>
            <p className="mt-10 max-w-2xl font-sans text-[16px] leading-[1.65] text-cream/75 md:text-[18px]">
              Everything I get asked before a wedding, corporate event, quince,
              or private booking. If something isn&apos;t here, just{" "}
              <Link
                href="/book"
                className="underline decoration-cream/30 underline-offset-4 hover:decoration-cream"
              >
                send an inquiry
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FAQ GROUPS */}
      {groups.map((group, gi) => (
        <section
          key={group.heading}
          className="relative overflow-hidden border-b border-line bg-night py-20 md:py-24"
        >
          <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
          <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
            <div className="md:col-span-3">
              <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
                0{gi + 1}
              </div>
              <h2 className="opsz-section mt-3 font-display text-[32px] font-light leading-[1.05] tracking-[-0.02em] text-cream md:text-[44px]">
                {group.heading}
              </h2>
            </div>
            <div className="md:col-span-9">
              <dl className="divide-y divide-line">
                {group.items.map((q) => (
                  <div
                    key={q.question}
                    className="grid grid-cols-1 gap-3 py-6 md:grid-cols-7 md:gap-8 md:py-7"
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
      ))}

      {/* BOTTOM CTA */}
      <section className="relative overflow-hidden bg-night py-24 md:py-32">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/15 blur-[200px]" />
        <div className="relative mx-auto max-w-[1100px] px-6 text-center md:px-12">
          <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
            Couldn&apos;t find it?
          </div>
          <h2 className="opsz-display mt-6 font-display text-[56px] font-normal leading-[0.95] tracking-[-0.04em] text-cream md:text-[clamp(72px,8vw,128px)]">
            Just <span className="italic">ask.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-md font-sans text-[16px] leading-[1.65] text-cream/65">
            Send me the inquiry — your date, your venue, your vibe. I respond
            within 24 hours.
          </p>
          <Link
            href="/book"
            className="group mt-10 inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream"
          >
            Send inquiry →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
