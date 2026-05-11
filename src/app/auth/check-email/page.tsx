import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Check your email",
  robots: { index: false, follow: false },
};

export default function CheckEmailPage() {
  return (
    <main className="bg-night text-cream">
      <SiteNav />
      <section className="relative overflow-hidden bg-night py-32 md:py-40">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="relative mx-auto max-w-[800px] px-6 text-center md:px-12">
          <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
            Almost there
          </div>
          <h1 className="opsz-display mt-6 font-display text-[clamp(56px,7vw,120px)] font-light italic leading-[0.92] tracking-[-0.04em] text-cream">
            Check your email.
          </h1>
          <p className="mx-auto mt-8 max-w-md font-sans text-[16px] leading-[1.65] text-cream/65">
            I just sent a confirmation link. Click it to verify your address
            and finish setting up your account. Don&apos;t see it? Check spam.
          </p>
          <a
            href="/"
            className="mt-10 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.24em] text-cream transition hover:text-ember"
          >
            ← Back home
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
