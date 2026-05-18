import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { GuideForm } from "@/components/guide/GuideForm";
import { StructuredData } from "@/components/StructuredData";
import { faqSchema, serviceSchema } from "@/lib/seo";
import { site } from "@/lib/site";

const PAGE_URL = `${site.url}/wedding-dj-guide`;
const PDF_URL = `${site.url}/guides/dfw-wedding-dj-guide.pdf`;

export const metadata: Metadata = {
  title:
    "DFW Wedding DJ Pricing Guide — What It Actually Costs in 2026 | DJ Danny West",
  description:
    "Free 10-page guide: the four DFW wedding DJ pricing tiers, 7 red flags to walk away from, venue-by-venue cheat sheet (Adolphus, Marquee on Magnolia, Four Seasons), 12-month music timeline, and the 10-question DJ interview that filters fast. By DJ Danny West — Cowboys' Stadium Club DJ, SiriusXM Latin mix coordinator.",
  keywords: [
    "DFW wedding DJ pricing",
    "Dallas wedding DJ cost",
    "Fort Worth wedding DJ price",
    "Texas wedding DJ guide",
    "how much does a wedding DJ cost in Dallas",
    "wedding DJ Dallas Fort Worth pricing",
  ],
  alternates: { canonical: "/wedding-dj-guide" },
  openGraph: {
    title: "DFW Wedding DJ Pricing Guide — DJ Danny West",
    description:
      "Free 10-page guide to wedding DJ pricing in Dallas–Fort Worth. Real numbers, real red flags, real venue intel.",
    url: PAGE_URL,
    type: "article",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DFW Wedding DJ Pricing Guide — DJ Danny West",
    description:
      "What a wedding DJ really costs in Dallas–Fort Worth. Free 10-page guide.",
    images: ["/og-image.jpg"],
  },
};

const guideFaq = [
  {
    question: "Is the guide really free?",
    answer:
      "Yes. You give me your event details so I can take a personal look at your date — but the PDF is free, no email-list trick, no upsell. You'll get the download link in your inbox the moment you submit.",
  },
  {
    question: "What's actually inside the 10 pages?",
    answer:
      "The four real DFW wedding DJ pricing tiers ($800–$1,500 / $1,500–$3K / $3K–$6K / $6K+) with what's actually included at each, 7 red flags that mean walk away, a venue cheat sheet covering the Adolphus, Four Seasons Las Colinas, Marquee on Magnolia, Filter Building, Stonebriar, Hickory Street Annex and more, a 12-month music planning timeline, what add-ons are worth paying for, and the 10-question DJ interview that filters fast.",
  },
  {
    question: "Will I get spammed?",
    answer:
      "No. I personally read every submission. You'll get one confirmation email with the guide and one personal reply from me within 24 hours. That's it.",
  },
  {
    question: "What if my date is already booked?",
    answer:
      "I'll tell you straight up and recommend two or three DFW DJs I'd trust with your event. There's no point keeping you in suspense — the calendar is the calendar.",
  },
  {
    question: "Do I have to book Danny to use the guide?",
    answer:
      "Absolutely not. The guide is genuinely useful regardless of who you hire. If it helps you book a better DJ — me or someone else — that's the point.",
  },
];

const guideService = serviceSchema({
  name: "DFW Wedding DJ — Pricing & Planning Guide",
  serviceType: "Wedding DJ services",
  description:
    "Free 10-page guide to wedding DJ pricing in Dallas–Fort Worth, including pricing tiers, venue notes, planning timeline, and a 10-question DJ vetting checklist.",
  url: PAGE_URL,
  areaServed: [
    "Dallas",
    "Fort Worth",
    "Arlington",
    "Plano",
    "Frisco",
    "Irving",
    "McKinney",
    "Southlake",
  ],
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "DFW Wedding DJ Pricing Guide — What It Actually Costs in 2026",
  description:
    "A 10-page guide to wedding DJ pricing in Dallas–Fort Worth: tiers, red flags, venue notes, and a planning timeline.",
  author: { "@id": `${site.url}/#person` },
  publisher: { "@id": `${site.url}/#organization` },
  mainEntityOfPage: PAGE_URL,
  image: `${site.url}/og-image.jpg`,
  url: PAGE_URL,
  datePublished: "2026-05-18",
  dateModified: "2026-05-18",
  about: ["Wedding DJ", "DFW weddings", "Wedding planning"],
};

const offerSchema = {
  "@context": "https://schema.org",
  "@type": "Offer",
  name: "DFW Wedding DJ Pricing & Planning Guide (PDF)",
  url: PDF_URL,
  price: "0",
  priceCurrency: "USD",
  availability: "https://schema.org/InStock",
  seller: { "@id": `${site.url}/#person` },
};

export default function WeddingDjGuidePage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData
        schemas={[guideService, articleSchema, offerSchema, faqSchema(guideFaq)]}
      />
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-night pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-[10%] -top-[10%] h-[55vh] w-[55vh] rounded-full bg-ember/15 blur-[180px]" />

        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              Free guide · 10 pages
            </div>
            <div className="mt-4 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/30">
              DFW · 2026
            </div>
          </div>
          <div className="md:col-span-9">
            <div className="mb-6 inline-flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/55">
              <span className="inline-block h-px w-10 bg-cream/30" />
              The Pricing Guide
            </div>
            <h1 className="font-display font-light leading-[0.86] tracking-[-0.04em] text-cream">
              <span className="opsz-display block text-[16vw] md:text-[clamp(72px,10vw,170px)]">
                What a DFW
              </span>
              <span className="opsz-display block text-[16vw] italic text-ember md:text-[clamp(72px,10vw,170px)]">
                wedding DJ
              </span>
              <span className="opsz-display block text-[16vw] md:text-[clamp(72px,10vw,170px)]">
                actually costs.
              </span>
            </h1>
            <p className="mt-10 max-w-2xl font-sans text-[16px] leading-[1.65] text-cream/75 md:text-[18px]">
              Quotes from $800 to $8,000 for what looks like the same service.
              Here&apos;s the honest breakdown — the four real DFW pricing
              tiers, seven red flags that mean walk away, a venue-by-venue
              cheat sheet, and the 10-question DJ interview I&apos;d give if I
              were the one shopping.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href="#get-the-guide"
                className="group inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream"
              >
                Get the free guide
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  ↓
                </span>
              </a>
              <a
                href="/book"
                className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/65 underline decoration-cream/20 underline-offset-[6px] transition hover:text-cream hover:decoration-cream"
              >
                Or skip ahead and book
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="relative overflow-hidden border-b border-line bg-night py-20 md:py-28">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              What&apos;s inside
            </div>
            <h2 className="opsz-section mt-6 font-display text-[28px] font-light leading-[1.05] tracking-[-0.02em] text-cream md:text-[34px]">
              Ten <span className="italic">useful</span> pages.
            </h2>
          </div>
          <div className="md:col-span-9 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
            {[
              {
                t: "The four DFW pricing tiers",
                c: "$800 to $12K+ — what each tier actually includes, who it's for, and what to watch out for.",
              },
              {
                t: "Seven red flags",
                c: "How to spot a no-show or a side-hustler before you sign, regardless of how good the price looks.",
              },
              {
                t: "DFW venue cheat sheet",
                c: "Adolphus, Four Seasons Las Colinas, Marquee on Magnolia, Filter Building, Stonebriar, Hickory Street Annex, Texas Live!, and more — with what your DJ needs to know about each.",
              },
              {
                t: "12-month music timeline",
                c: "From booking the DJ at 12 months out to last call on the day — when each conversation needs to happen.",
              },
              {
                t: "Add-ons worth paying for",
                c: "Uplighting, ceremony sound, overtime buffer — what's worth the line item and what to skip.",
              },
              {
                t: "The 10-question DJ interview",
                c: "A printable checklist. Ask these on any DJ call — if they hesitate on more than two, move on.",
              },
            ].map((d, i) => (
              <div key={d.t}>
                <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
                  — 0{i + 1}
                </div>
                <div className="opsz-text mt-3 font-display text-[22px] leading-tight tracking-[-0.005em] text-cream md:text-[24px]">
                  {d.t}
                </div>
                <p className="mt-2 font-sans text-[14px] leading-[1.6] text-cream/55">
                  {d.c}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE FORM */}
      <section
        id="get-the-guide"
        className="relative overflow-hidden border-b border-line bg-night py-20 md:py-28"
      >
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-[10%] top-1/4 h-[40vh] w-[40vh] rounded-full bg-ember/10 blur-[160px]" />
        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-4">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              Send me the guide
            </div>
            <h2 className="opsz-section mt-6 font-display text-[44px] font-light leading-[0.95] tracking-[-0.025em] text-cream md:text-[56px]">
              <span className="italic">Tell me</span>
              <br />
              about your wedding.
            </h2>
            <p className="mt-8 max-w-md font-sans text-[15px] leading-[1.65] text-cream/65">
              A few quick details so I can give you something useful when I
              reply, not a generic auto-response. The PDF hits your inbox
              instantly — and you&apos;ll hear from me personally within 24
              hours.
            </p>
            <div className="mt-10 space-y-3 font-sans text-[13px] text-cream/55">
              <div>
                <span className="text-ember">✓</span>&nbsp;&nbsp; No email
                list, no upsells
              </div>
              <div>
                <span className="text-ember">✓</span>&nbsp;&nbsp; Real DFW
                market intel, not a brochure
              </div>
              <div>
                <span className="text-ember">✓</span>&nbsp;&nbsp; Personal
                reply within 24 hours
              </div>
            </div>
          </div>
          <div className="md:col-span-8">
            <GuideForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden border-b border-line bg-night py-20 md:py-28">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
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
              {guideFaq.map((q) => (
                <div
                  key={q.question}
                  className="py-6 grid grid-cols-1 gap-3 md:grid-cols-7 md:gap-8 md:py-8"
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

      <Footer />
    </main>
  );
}
