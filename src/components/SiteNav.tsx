"use client";

type Props = {
  active?: "mixes" | "book" | "merch";
  /** When the nav sits over a hero with its own video/photography, this is `false` so it floats transparently. */
  solid?: boolean;
};

export function SiteNav({ active, solid = true }: Props) {
  const link = (key: string, label: string, href: string) => (
    <a
      href={href}
      className={`transition hover:text-cream ${
        active === key ? "text-cream" : "text-cream/65"
      }`}
    >
      {label}
    </a>
  );

  return (
    <header
      className={`${
        solid ? "relative" : "absolute left-0 right-0 top-0"
      } z-30 mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 md:px-12 md:py-8`}
    >
      <a href="/" className="flex items-center gap-3">
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
          className="h-9 w-auto md:h-10"
        />
      </a>
      <nav className="hidden items-center gap-10 font-sans text-[10px] uppercase tracking-[0.32em] md:flex">
        {link("mixes", "Mixes", "/mixes")}
        {link("book", "Book", "/book")}
        {link("merch", "Merch", "/merchandise")}
      </nav>
      <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/30">
        Member login soon
      </span>
    </header>
  );
}
