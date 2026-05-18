/**
 * Friendly "members only" gate shown on /insider pages to visitors who don't
 * qualify. Two states:
 *   - unauthenticated → "Sign in to enter"
 *   - signed in, no access → "Subscribe or book to unlock"
 */
type Props = {
  state: "unauthenticated" | "no_access";
};

export function InsiderGate({ state }: Props) {
  return (
    <section className="relative overflow-hidden bg-night py-32 md:py-40">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/15 blur-[200px]" />
      <div className="relative mx-auto max-w-[760px] px-6 text-center md:px-12">
        <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
          Members only
        </div>
        <h1 className="opsz-display mt-6 font-display text-[clamp(56px,8vw,120px)] font-light leading-[0.92] tracking-[-0.035em] text-cream">
          The <span className="italic">Insider.</span>
        </h1>
        {state === "unauthenticated" ? (
          <>
            <p className="mx-auto mt-8 max-w-md font-sans text-[16px] leading-[1.65] text-cream/70">
              The Insider section is for active subscribers and past clients. Sign in to your
              account to continue.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <a
                href="/login?next=/insider"
                className="group inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream"
              >
                Sign in
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="/subscribe"
                className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/65 underline decoration-cream/20 underline-offset-[6px] transition hover:text-cream hover:decoration-cream"
              >
                Or subscribe to the mixes
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="mx-auto mt-8 max-w-md font-sans text-[16px] leading-[1.65] text-cream/70">
              The Insider section is for active subscribers and past clients. Subscribe to the mixes for
              $20/mo, or send a booking inquiry — once your event&apos;s confirmed, you&apos;re in.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <a
                href="/subscribe"
                className="group inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream"
              >
                Subscribe — $20/mo
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="/book"
                className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/65 underline decoration-cream/20 underline-offset-[6px] transition hover:text-cream hover:decoration-cream"
              >
                Or send an inquiry
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
