import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { StripeEmbeddedCheckout } from "@/components/subscribe/StripeEmbeddedCheckout";

export const metadata: Metadata = {
  title: "Subscribe",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SubscribePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/subscribe");

  // Already subscribed? Bounce to library.
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("member_id", user.id)
    .eq("status", "ACTIVE")
    .maybeSingle();

  const publishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  const configured = !!publishableKey;

  return (
    <main className="bg-night text-cream">
      <SiteNav />
      <section className="mx-auto grid min-h-[80vh] max-w-[1200px] grid-cols-1 gap-12 px-6 pb-24 pt-20 md:grid-cols-12 md:px-12 md:pt-24">
        <div className="md:col-span-5">
          <Link
            href="/mixes"
            className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream/55 transition hover:text-cream"
          >
            ← Back
          </Link>
          <p className="mt-6 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
            — Become a member
          </p>
          <h1 className="mt-4 font-serif text-[56px] leading-[0.95] tracking-[-0.02em] md:text-[80px]">
            $20 <span className="italic text-ember">a month.</span>
          </h1>
          <p className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-cream/65">
            Full archive. New mixes uploaded weekly. Cancel any time.
          </p>
          <ul className="mt-8 space-y-3 font-sans text-[13px] text-cream/65">
            <li>· The full mix archive</li>
            <li>· New mixes every week</li>
            <li>· Cancel any time, no questions</li>
          </ul>
          <p className="mt-10 font-sans text-[11px] uppercase tracking-[0.18em] text-cream/45">
            Powered by Stripe · Secure card payment · Cancel anytime
          </p>
        </div>

        <div className="md:col-span-7">
          {existing ? (
            <div className="border border-cream/30 bg-cream/[0.04] p-8">
              <h2 className="font-serif text-[28px] text-cream">
                You&apos;re already subscribed.
              </h2>
              <p className="mt-4 font-sans text-[14px] text-cream/65">
                Streaming is on. Head to your member library.
              </p>
              <Link
                href="/mixes/library"
                className="mt-6 inline-flex bg-cream px-6 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
              >
                Open library →
              </Link>
            </div>
          ) : configured ? (
            <StripeEmbeddedCheckout publishableKey={publishableKey} />
          ) : (
            <div className="border border-dashed border-ember/40 bg-ember/[0.04] p-8">
              <h2 className="font-serif text-[24px] text-cream">
                Checkout opens soon.
              </h2>
              <p className="mt-4 font-sans text-[13px] leading-relaxed text-cream/65">
                Subscriptions go live once Stripe credentials are wired in
                Vercel. If you&apos;re reading this in production, ping Danny
                — he&apos;s on it.
              </p>
              <Link
                href="/account"
                className="mt-6 inline-flex font-sans text-[11px] uppercase tracking-[0.24em] text-cream/70 transition hover:text-cream"
              >
                ← Back to dashboard
              </Link>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
