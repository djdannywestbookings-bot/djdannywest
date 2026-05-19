import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { AccountShell } from "@/components/account/AccountShell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Custom mix — order received",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Stripe redirects here after the embedded checkout completes. We just show
 * a confirmation; the webhook is authoritative for actually flipping the
 * order to 'paid'.
 */
export default async function CustomMixSuccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/custom-mix");

  const displayName =
    (user.user_metadata?.name as string | undefined) ||
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Member";

  return (
    <main className="bg-night text-cream">
      <SiteNav />
      <div className="relative overflow-hidden bg-night">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <AccountShell
          active="custom"
          displayName={displayName}
          email={user.email ?? ""}
        >
          <header>
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
              <div className="mb-2 h-px w-10 bg-ember/70" />
              Order received · in the queue
            </div>
            <h1 className="mt-4 font-display text-[clamp(48px,6vw,96px)] font-light leading-[0.92] tracking-[-0.04em] text-cream">
              Thanks,{" "}
              <span className="italic text-ember">{displayName}.</span>
            </h1>
            <p className="mt-6 max-w-2xl font-sans text-[16px] leading-[1.65] text-cream/70">
              Your custom mix order is in the queue. I&rsquo;ve got your songs,
              your vibe, and your timeline. You&rsquo;ll hear from me within 24
              hours with an ETA, and the finished mix lands in your inbox + on
              this page within 7 days.
            </p>
            <p className="mt-3 max-w-2xl font-sans text-[14px] leading-[1.55] text-cream/55">
              A confirmation email is also on the way to your inbox.
            </p>
          </header>

          <section className="mt-10 flex flex-wrap gap-3">
            <a
              href="/account/custom-mix"
              className="group inline-flex items-center gap-2 bg-ember px-7 py-3.5 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-cream"
            >
              Track this order
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="/account"
              className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/65 underline decoration-cream/20 underline-offset-[6px] transition hover:text-cream hover:decoration-cream"
            >
              Back to dashboard
            </a>
          </section>
        </AccountShell>
      </div>
      <Footer />
    </main>
  );
}
