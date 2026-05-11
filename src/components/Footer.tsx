"use client";

const navItems = [
  { label: "Mixes", href: "/mixes" },
  { label: "Book Danny", href: "/book" },
  { label: "Subscribe", href: "/#subscribe" },
];

const legalItems = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
];

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
            Sets that move rooms. Two new mixes every month. Subscribers only.
          </p>
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
