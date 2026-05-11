import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Off the floor",
  description: "Page not found.",
};

export default function NotFound() {
  return (
    <main className="bg-night text-cream">
      <SiteNav />

      <section className="relative overflow-hidden border-b border-line bg-night">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-[10%] top-[10%] h-[50vh] w-[50vh] rounded-full bg-ember/15 blur-[180px]" />

        <div className="relative mx-auto grid min-h-[70vh] max-w-[1600px] grid-cols-1 items-center gap-10 px-6 pb-24 pt-20 md:grid-cols-12 md:px-12 md:pb-32 md:pt-28">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              Error · 404
            </div>
          </div>
          <div className="md:col-span-9">
            <h1 className="opsz-display font-display text-[16vw] font-light leading-[0.86] tracking-[-0.045em] text-cream md:text-[clamp(80px,10vw,160px)]">
              <span className="italic">Off</span>{" "}
              the
              <br />
              <span className="text-ember">floor.</span>
            </h1>
            <p className="mt-10 max-w-md font-sans text-[15px] leading-[1.65] text-cream/70 md:text-[17px]">
              The room you&apos;re looking for doesn&apos;t exist — wrong door,
              old flier, mistyped URL. Try one of these instead.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href="/"
                className="inline-flex items-center gap-3 bg-ember px-7 py-3.5 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream"
              >
                Home →
              </a>
              <a
                href="/mixes"
                className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/65 underline decoration-cream/20 underline-offset-[6px] transition hover:text-cream hover:decoration-cream"
              >
                Browse the mixes
              </a>
              <a
                href="/book"
                className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/65 underline decoration-cream/20 underline-offset-[6px] transition hover:text-cream hover:decoration-cream"
              >
                Book the night
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
