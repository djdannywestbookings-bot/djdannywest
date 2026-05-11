import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Welcome",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Landing page after Stripe Embedded Checkout completes successfully.
 *
 * Stripe redirects here with ?session_id=cs_test_... but the webhook is the
 * authoritative signal that flips the subscription to ACTIVE. We don't need
 * to verify the session here — we just confirm to the user and route them
 * to the library. If the webhook hasn't landed yet, /mixes/library will show
 * the locked state momentarily, then unlock on next refresh.
 */
export default async function SubscribeSuccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/subscribe/success");

  return (
    <main className="bg-night text-cream">
      <SiteNav />
      <section className="mx-auto flex min-h-[70vh] max-w-[760px] flex-col items-center justify-center px-6 py-24 text-center md:px-12">
        <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
          — Welcome to the family
        </p>
        <h1 className="mt-6 font-serif text-[56px] italic leading-[0.95] tracking-[-0.02em] md:text-[88px]">
          You&apos;re in.
        </h1>
        <p className="mx-auto mt-8 max-w-md font-sans text-[15px] leading-relaxed text-cream/65">
          Your subscription is active. The library is unlocking — sometimes
          takes a few seconds for the system to catch up. Head in and start
          listening.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/mixes/library"
            className="inline-flex bg-ember px-7 py-4 font-sans text-[12px] uppercase tracking-[0.24em] text-night transition hover:bg-cream"
          >
            Open the library →
          </Link>
          <Link
            href="/account/subscription"
            className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/65 transition hover:text-cream"
          >
            Manage subscription
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
