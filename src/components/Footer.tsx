"use client";

import { site } from "@/lib/site";

const navItems = [
  { label: "Mixes", href: "/mixes" },
  { label: "Book Danny", href: "/book" },
  { label: "Merch", href: "/merchandise" },
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
        <div className="md:col-span-5">
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
              href="/mixes"
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

        {/* Nav */}
        <div className="md:col-span-3">
          <div className="mb-5 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/40">
            Site
          </div>
          <ul className="space-y-3">
            {navItems.map((item) => (
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

        {/* Legal */}
        <div className="md:col-span-2">
          <div className="mb-5 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/40">
            Legal
          </div>
          <ul className="space-y-3">
            {legalItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="font-sans text-[13px] text-cream/55 transition hover:text-cream"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-2">
          <div className="mb-5 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/40">
            Bookings
          </div>
          <a
            href="/book"
            className="opsz-text font-display text-[18px] italic text-cream transition hover:text-ember"
          >
            Inquire →
          </a>
          <div className="mt-2 font-sans text-[12px] text-cream/45">
            By inquiry
          </div>
        </div>

        {/* Bottom bar */}
        <div className="md:col-span-12 mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/35">
          <span>© {new Date().getFullYear()} Danny West</span>
          <span>Dallas · Worldwide</span>
        </div>
      </div>
    </footer>
  );
}
