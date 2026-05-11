import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set a new password — DJ Danny West",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <main className="bg-night text-cream">
      <SiteNav />
      <section className="relative overflow-hidden bg-night pb-24 pt-20 md:pb-32 md:pt-24">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-[15%] -top-[15%] h-[55vh] w-[55vh] rounded-full bg-ember/12 blur-[180px]" />

        <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-5">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              New password
            </div>
            <h1 className="opsz-display mt-6 font-display text-[clamp(56px,7vw,128px)] font-light leading-[0.86] tracking-[-0.04em] text-cream">
              <span className="italic">Set</span>
              <br />
              <span className="text-ember">it.</span>
            </h1>
            <p className="mt-8 max-w-sm font-sans text-[15px] leading-[1.65] text-cream/65">
              Pick something strong. Once it&apos;s saved you&apos;ll land on
              your member dashboard.
            </p>
          </div>

          <div className="md:col-span-7 md:pl-10">
            <ResetPasswordForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
