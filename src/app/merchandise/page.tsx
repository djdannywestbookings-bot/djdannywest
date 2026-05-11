import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Merch — Coming soon",
  description: "DJ Danny West merch line — coming soon. Mock-ups in motion.",
};

export default function MerchandisePage() {
  return (
    <main className="bg-night text-cream">
      <SiteNav active="merch" />

      <section className="relative overflow-hidden border-b border-line bg-night">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-[10%] -top-[10%] h-[55vh] w-[55vh] rounded-full bg-ember/15 blur-[180px]" />
        <div className="pointer-events-none absolute -left-[10%] bottom-[10%] h-[40vh] w-[40vh] rounded-full bg-ember/[0.07] blur-[180px]" />

        <div className="relative mx-auto grid min-h-[80vh] max-w-[1600px] grid-cols-1 items-center gap-10 px-6 pb-20 pt-24 md:grid-cols-12 md:px-12 md:pb-28 md:pt-32">
          <div className="md:col-span-12">
            <h1 className="font-display font-light leading-[0.84] tracking-[-0.04em] text-cream">
              <span className="opsz-display block text-[18vw] italic md:text-[clamp(80px,10vw,160px)]">
                Coming
              </span>
              <span className="opsz-display block text-[22vw] font-normal text-ember md:text-[clamp(120px,14vw,240px)]">
                soon.
              </span>
            </h1>
            <p className="mt-10 max-w-xl font-sans text-[15px] leading-[1.65] text-cream/70 md:text-[17px]">
              Mock-ups in motion. The merch line drops alongside the member
              portal — tees, hats, and a few things you can&apos;t get
              anywhere else.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href="/book"
                className="group inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-cream"
              >
                Book Danny — inquire
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
