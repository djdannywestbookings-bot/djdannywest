import { Marquee } from "./Marquee";

/**
 * Hero entry animations are now driven by pure CSS `@keyframes` (defined in
 * globals.css) instead of motion's `initial`/`animate` props. Reason: motion
 * sets `opacity: 0` as inline style during SSR, and if hydration ever fails
 * or is slow, the hero stays invisible. CSS animations are JS-agnostic — they
 * run automatically when the element mounts, the default state of every
 * element is visible, and `prefers-reduced-motion: reduce` skips the
 * animation entirely (handled in globals.css). No-JS fallback is therefore
 * the default render state.
 *
 * Headline sizing math (worked out to prevent "Moves Rooms" orphaning):
 *   Mobile 390px:    14vw  = 54.6px  · "Moves Rooms" ~300px in 342 col → fits
 *   Desktop 1440px:  8vw   = 115.2px · ~634px in ~1344 col → fits comfortably
 *   Desktop 1920px:  8vw → clamp ceiling at 140px → ~770px → fits
 */
export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-night text-cream">
      {/* Full-bleed promo video — z-0 */}
      <div className="absolute inset-0 z-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/hero-poster.jpg"
        >
          <source src="/video/hero-1080.mp4" type="video/mp4" media="(min-width: 1024px)" />
          <source src="/video/hero-720.mp4" type="video/mp4" />
        </video>

        {/* Legibility gradients — left side darker for text */}
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 via-50% to-night/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-night/60" />
        {/* Ember kiss */}
        <div className="absolute -right-[10%] top-[10%] h-[60vh] w-[60vh] rounded-full bg-ember/15 blur-[180px]" />
      </div>

      {/* Grain over everything */}
      <div className="grain pointer-events-none absolute inset-0 z-[1] opacity-[0.14] mix-blend-overlay" />

      {/* Hero content (nav rendered separately by parent SiteNav) */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-90px)] max-w-[1600px] flex-col justify-end gap-14 px-6 pb-16 pt-8 md:px-12 md:pb-24 md:pt-4">
        <div className="w-full">
          <h1 className="font-display font-extrabold leading-[0.88] tracking-[-0.04em] text-cream">
            <span
              className="hero-rise opsz-display block text-[14vw] md:text-[clamp(56px,8vw,140px)]"
              style={{ animationDelay: "0.22s" }}
            >
              A DJ That
            </span>
            <span
              className="hero-rise opsz-display block italic text-[14vw] md:text-[clamp(56px,8vw,140px)]"
              style={{ animationDelay: "0.36s" }}
            >
              Moves Rooms
            </span>
          </h1>

          <p
            className="hero-fade mt-10 max-w-md font-sans text-[17px] leading-[1.7] text-cream/80 md:text-[18px]"
            style={{ animationDelay: "0.65s" }}
          >
            <span className="text-cream">New mixes released weekly.</span>{" "}
            Subscribers only.
          </p>

          <div
            className="hero-fade mt-10 flex max-w-[440px] flex-col gap-4"
            style={{ animationDelay: "0.85s" }}
          >
            <a
              href="/subscribe"
              className="group relative inline-flex items-center justify-between gap-3 overflow-hidden bg-cream px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream/90"
            >
              <span className="relative z-10">Subscribe to DJ Danny West mixes</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a
              href="/book"
              className="group relative inline-flex items-center justify-between gap-3 border border-cream/40 px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-cream transition-colors duration-300 hover:bg-cream hover:text-night hover:border-cream"
            >
              <span className="relative z-10">Book DJ Danny West</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Marquee at bottom */}
      <div className="relative z-10 border-t border-line bg-night/70 py-7 backdrop-blur-sm">
        <Marquee />
      </div>
    </section>
  );
}
