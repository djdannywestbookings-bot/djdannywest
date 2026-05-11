import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password — DJ Danny West",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
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
              Forgot your password?
            </div>
            <h1 className="opsz-display mt-6 font-display text-[clamp(56px,7vw,128px)] font-light leading-[0.86] tracking-[-0.04em] text-cream">
              <span className="italic">Reset</span>
              <br />
              it.
            </h1>
            <p className="mt-8 max-w-sm font-sans text-[15px] leading-[1.65] text-cream/65">
              Drop the email on your account and I&apos;ll send a reset link.
              Click the link, set a new password, you&apos;re back in.
            </p>
          </div>

          <div className="md:col-span-7 md:pl-10">
            <ForgotPasswordForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
