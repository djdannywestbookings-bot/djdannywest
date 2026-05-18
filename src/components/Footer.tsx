"use client";

import { site } from "@/lib/site";

const siteItems = [
  { label: "Mixes", href: "/mixes" },
  { label: "Book Danny", href: "/book" },
  { label: "Wedding DJ Guide", href: "/wedding-dj-guide" },
  { label: "FAQ", href: "/faq" },
  { label: "Merch", href: "/merchandise" },
];

const serviceItems = [
  { label: "Wedding DJ", href: "/services/weddings" },
  { label: "Quinceañera DJ", href: "/services/quinceaneras" },
  { label: "Corporate DJ", href: "/services/corporate" },
  { label: "Private Parties", href: "/services/private-parties" },
  { label: "Clubs · Nightlife", href: "/services/clubs" },
  { label: "School Dances · Proms", href: "/services/school-dances" },
  { label: "Birthdays · Sweet 16", href: "/services/birthdays" },
];

const cityItems = [
  { label: "Dallas", href: "/dj-dallas" },
  { label: "Fort Worth", href: "/dj-fort-worth" },
  { label: "Arlington", href: "/dj-arlington" },
  { label: "Plano", href: "/dj-plano" },
  { label: "Frisco", href: "/dj-frisco" },
  { label: "Irving", href: "/dj-irving" },
  { label: "McKinney", href: "/dj-mckinney" },
  { label: "Southlake", href: "/dj-southlake" },
];

const legalItems = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.1 20.1a6.34 6.34 0 0 0 10.86-4.43V8.83a8.16 8.16 0 0 0 4.77 1.52V6.94a4.85 4.85 0 0 1-1.14-.25Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-line bg-night">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 py-16 md:grid-cols-12 md:gap-10 md:px-12 md:py-20">
        {/* Brand mark + tagline */}
        <div className="md:col-span-4">
          <a href="/" className="inline-flex items-center gap-3">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/wordmark-white.png"
              alt="Danny West"
              width={1053}
              height={652}
              className="h-12 w-auto md:h-14"
            />
          </a>
          <p className="opsz-text mt-6 max-w-sm font-display text-[18px] italic leading-snug text-cream/55">
            A DJ that moves rooms. New mixes uploaded weekly — subscribers
            only.{" "}
            <a
              href="/subscribe"
              className="not-italic font-sans text-[11px] uppercase tracking-[0.24em] text-ember hover:text-cream transition"
            >
              Subscribe Now →
            </a>
          </p>

          {/* Socials */}
          <div className="mt-8 flex items-center gap-4">
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Danny West on Instagram"
              className="flex h-10 w-10 items-center justify-center border border-line text-cream/60 transition hover:border-cream hover:text-cream"
            >
              <span className="block h-5 w-5">
                <InstagramIcon />
              </span>
            </a>
            <a
              href={site.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Danny West on TikTok"
              className="flex h-10 w-10 items-center justify-center border border-line text-cream/60 transition hover:border-cream hover:text-cream"
            >
              <span className="block h-5 w-5">
                <TikTokIcon />
              </span>
            </a>
            <span className="ml-2 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/35">
              @djdannywest
            </span>
          </div>
        </div>

        {/* Site */}
        <div className="md:col-span-2">
          <div className="mb-5 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/40">
            Site
          </div>
          <ul className="space-y-3">
            {siteItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="font-sans text-[13px] text-cream/75 transition hover:text-cream"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div className="md:col-span-3">
          <div className="mb-5 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/40">
            DFW DJ Services
          </div>
          <ul className="space-y-3">
            {serviceItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="font-sans text-[13px] text-cream/75 transition hover:text-cream"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Cities */}
        <div className="md:col-span-3">
          <div className="mb-5 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/40">
            Cities I serve
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
            {cityItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="font-sans text-[13px] text-cream/75 transition hover:text-cream"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal + Bookings strip */}
        <div className="md:col-span-12 mt-4 grid grid-cols-1 gap-8 border-t border-line pt-8 md:grid-cols-12">
          <div className="md:col-span-4 flex items-center gap-6">
            <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/35">
              © {new Date().getFullYear()} Danny West
            </span>
            <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/35">
              Dallas · Worldwide
            </span>
          </div>
          <div className="md:col-span-5 flex flex-wrap items-center gap-6">
            {legalItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45 transition hover:text-cream"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="md:col-span-3 md:text-right">
            <a
              href="/book"
              className="font-sans text-[11px] uppercase tracking-[0.24em] text-ember transition hover:text-cream"
            >
              Bookings by inquiry →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
